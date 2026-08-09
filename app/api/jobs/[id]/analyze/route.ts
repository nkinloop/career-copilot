import { prisma } from "@/lib/prisma";
import { gemini } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { getQuotaErrorResponse, isGeminiQuotaError } from "@/lib/ai-errors";
import { getCurrentUserId } from "@/lib/current-user";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    // 1. Get the job
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    if (!job.description) {
      return NextResponse.json(
        { error: "This job has no description to analyze" },
        { status: 400 }
      );
    }

    // 2. Ask Gemini to extract skills
    let description = job.description ?? "";
    const MAX_DESC_CHARS = 50000;
    if (description.length > MAX_DESC_CHARS) {
      console.warn(
        `Truncating job description from ${description.length} to ${MAX_DESC_CHARS} chars to limit AI prompt size.`
      );
      description = description.slice(0, MAX_DESC_CHARS);
    }

    const prompt = `
Analyze the following job description.

Extract the technical and professional skills explicitly required
or strongly implied by the job.

Return ONLY valid JSON in exactly this format:

{
  "skills": ["skill1", "skill2", "skill3"]
}

Do not include markdown.
Do not include explanations.

Job Title: ${job.title}
Company: ${job.company}

Job Description:
${description}
`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    // 3. Parse Gemini response
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const analysis = JSON.parse(cleanedText);

    if (!Array.isArray(analysis.skills)) {
      throw new Error("Invalid skill analysis returned by Gemini");
    }

    // 4. Create/find skills and connect them to the job
    const skills = [];

    for (const skillName of analysis.skills) {
      if (typeof skillName !== "string" || !skillName.trim()) {
        continue;
      }

      const normalizedName = skillName.trim();

      const skill = await prisma.skill.upsert({
        where: {
          name: normalizedName,
        },
        update: {},
        create: {
          name: normalizedName,
        },
      });

      await prisma.jobSkill.upsert({
        where: {
          jobId_skillId: {
            jobId: job.id,
            skillId: skill.id,
          },
        },
        update: {},
        create: {
          jobId: job.id,
          skillId: skill.id,
        },
      });

      skills.push(skill);
    }

    return NextResponse.json({
      success: true,
      jobId: job.id,
      skills,
    });
  } catch (error) {
    console.error(
      "Job analysis failed:",
      error instanceof Error ? error.message : String(error)
    );

    if (isGeminiQuotaError(error)) {
      return NextResponse.json(getQuotaErrorResponse(), {
        status: 429,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to analyze job",
      },
      { status: 500 }
    );
  }
}
