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
    // Protect against large request bodies (though GETs typically have none)
    const contentLengthHeader = (globalThis as any).request?.headers?.get
      ? (globalThis as any).request.headers.get("content-length")
      : null;
    // No strict enforcement here for GET; keep for parity with POSTs if used later

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

    const skills = userSkills.map(
      (item) => item.skill.name
    );

    const jobData = jobs.map((job) => ({
      title: job.title,
      company: job.company,
      skills: job.jobSkills.map(
        (item) => item.skill.name
      ),
    }));

    const prompt = `
You are an expert technical interviewer and career coach.

Create a personalized interview preparation plan for this candidate.

Candidate skills:
${JSON.stringify(skills)}

Recent jobs:
${JSON.stringify(jobData)}

Generate questions that are relevant to the candidate's skills
and the types of jobs they are targeting.

Return ONLY valid JSON using exactly this structure:

{
  "targetRole": "Recommended interview role",
  "summary": "Short personalized preparation summary",
  "questions": [
    {
      "question": "Interview question",
      "category": "Technical | Behavioral | HR",
      "difficulty": "Easy | Medium | Hard",
      "hint": "Short hint to help the candidate think about the answer",
      "idealAnswer": "Concise example of a strong answer"
    }
  ]
}

Generate 10 questions.

Requirements:
- Include technical questions based on the candidate's skills.
- Include questions related to their likely target roles.
- Include behavioral questions.
- Include HR questions.
- Mix Easy, Medium, and Hard difficulty.
- Keep answers concise and interview-friendly.
- Do not invent skills that are completely unrelated to the candidate.
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

    let interview;

    try {
      interview = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to process AI response" },
        { status: 500 }
      );
    }

    const result = {
      success: true,
      interview,
      skills,
      jobs: jobData,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Interview preparation failed:",
      error instanceof Error ? error.message : String(error)
    );
    if (isGeminiQuotaError(error)) {
      return NextResponse.json(getQuotaErrorResponse(), {
        status: 429,
      });
    }

    return NextResponse.json(
      { error: "Failed to generate interview preparation" },
      { status: 500 }
    );
  }
}
