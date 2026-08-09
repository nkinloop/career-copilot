import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { getQuotaErrorResponse, isGeminiQuotaError } from "@/lib/ai-errors";
import { getCurrentUserId } from "@/lib/current-user";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [userSkills, jobs] = await Promise.all([
      prisma.userSkill.findMany({
        where: {
          userId,
        },
        include: {
          skill: true,
        },
      }),

      prisma.job.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          jobSkills: {
            include: {
              skill: true,
            },
          },
        },
      }),
    ]);

    const userSkillNames = userSkills.map(
      (item) => item.skill.name
    );

    const missingSkillMap = new Map<string, number>();

    for (const job of jobs) {
      for (const jobSkill of job.jobSkills) {
        const skillName = jobSkill.skill.name;

        const alreadyHaveSkill = userSkillNames.some(
          (skill) =>
            skill.toLowerCase() === skillName.toLowerCase()
        );

        if (!alreadyHaveSkill) {
          missingSkillMap.set(
            skillName,
            (missingSkillMap.get(skillName) || 0) + 1
          );
        }
      }
    }

    const missingSkills = Array.from(
      missingSkillMap.entries()
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);

    const prompt = `
You are a professional career mentor.

Create a personalized career roadmap for a job seeker.

Current skills:
${JSON.stringify(userSkillNames)}

Skills missing from the jobs they are targeting:
${JSON.stringify(missingSkills)}

Recent job titles:
${JSON.stringify(jobs.map((job) => job.title))}

Return ONLY valid JSON.

Use exactly this structure:

{
  "careerGoal": "Recommended career direction",
  "summary": "Short explanation of the roadmap",
  "stages": [
    {
      "title": "Stage title",
      "duration": "Estimated duration",
      "skills": ["skill1", "skill2"],
      "projects": ["project1", "project2"],
      "actions": ["action1", "action2"]
    }
  ]
}

Create 3 to 5 stages.

The roadmap should:
- Build on the user's existing skills.
- Prioritize skills appearing in missing job skills.
- Include practical projects.
- Be realistic for a student or early-career developer.
- Progress from fundamentals to job readiness.
- Keep each stage concise and actionable.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const responseText = response.text || "";

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let roadmap;

    try {
      roadmap = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to process AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      roadmap,
      currentSkills: userSkillNames,
      missingSkills,
    });
  } catch (error) {
    console.error(
      "Career roadmap failed:",
      error instanceof Error ? error.message : String(error)
    );

    if (isGeminiQuotaError(error)) {
      return NextResponse.json(getQuotaErrorResponse(), {
        status: 429,
      });
    }

    return NextResponse.json(
      { error: "Failed to generate career roadmap" },
      { status: 500 }
    );
  }
}
