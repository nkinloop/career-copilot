import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { getQuotaErrorResponse, isGeminiQuotaError } from "@/lib/ai-errors";
import { getCurrentUserId } from "@/lib/current-user";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Protect against large request bodies
    const contentLengthHeader = request.headers.get("content-length");
    const maxBodyBytes = 100 * 1024; // 100KB
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);
      if (!Number.isNaN(contentLength) && contentLength > maxBodyBytes) {
        return NextResponse.json({ error: "Payload too large" }, { status: 413 });
      }
    }

    const body = await request.json();
    const message = body.message?.trim();

    // Limit message length to avoid huge prompts/costs
    const maxMessageLength = 2000;
    if (typeof message === "string" && message.length > maxMessageLength) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const [userSkills, jobs, applications] = await Promise.all([
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

      prisma.application.findMany({
        where: {
          userId,
        },
        include: {
          job: true,
        },
        orderBy: {
          appliedAt: "desc",
        },
        take: 10,
      }),
    ]);

    const skills = userSkills.map(
      (item) => item.skill.name
    );

    const jobContext = jobs.map((job) => ({
      title: job.title,
      company: job.company,
      location: job.location,
      skills: job.jobSkills.map(
        (item) => item.skill.name
      ),
    }));

    const applicationContext = applications.map(
      (application) => ({
        job: application.job.title,
        company: application.job.company,
        status: application.status,
      })
    );

    const prompt = `
You are Career Copilot, an AI career assistant.

You are helping a user with career development, jobs, skills,
resume improvement, interview preparation and applications.

USER'S CURRENT SKILLS:
${skills.length > 0 ? skills.join(", ") : "No skills added yet."}

RECENT JOBS:
${JSON.stringify(jobContext, null, 2)}

APPLICATIONS:
${JSON.stringify(applicationContext, null, 2)}

USER'S QUESTION:
${message}

Instructions:
- Give practical and personalized career advice.
- Use the user's actual skills and job data when relevant.
- Do not invent jobs, skills, experience, companies, or achievements.
- If the user asks what skill they should learn, prioritize skills
  that appear frequently in their missing/job requirements.
- If the user asks about a job, use the available job information.
- Keep answers clear and easy to understand.
- Use bullet points when useful.
- If the user asks for interview preparation, provide concrete examples.
- If the user asks about their career direction, connect your answer
  to their current skills and available opportunities.
`;

    const response = await ai.models.generateContent({
model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    console.error(
      "AI Copilot error:",
      error instanceof Error ? error.message : String(error)
    );

    if (isGeminiQuotaError(error)) {
      return NextResponse.json(getQuotaErrorResponse(), {
        status: 429,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to generate AI response",
      },
      {
        status: 500,
      }
    );
  }
}
