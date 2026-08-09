import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { extractText, getDocumentProxy } from "unpdf";
import { GoogleGenAI } from "@google/genai";
import { getQuotaErrorResponse, isGeminiQuotaError } from "@/lib/ai-errors";
import { getCurrentUserId } from "@/lib/current-user";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    if (!resume.fileUrl) {
      return NextResponse.json(
        { error: "Resume file not found" },
        { status: 400 }
      );
    }

    // Resolve file path securely. Support private uploads and legacy public uploads.
    const fileUrl = resume.fileUrl;
    let baseDir: string;
    let fileName: string;

    if (fileUrl.startsWith("/private/uploads/resumes/")) {
      baseDir = path.resolve(process.cwd(), "private", "uploads", "resumes");
      fileName = path.basename(fileUrl);
    } else if (fileUrl.startsWith("/uploads/resumes/")) {
      baseDir = path.resolve(process.cwd(), "public", "uploads", "resumes");
      fileName = path.basename(fileUrl);
    } else {
      return NextResponse.json({ error: "Unsupported resume file location" }, { status: 400 });
    }

    const filePath = path.resolve(baseDir, fileName);

    if (!filePath.startsWith(baseDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const fileBuffer = await fs.readFile(filePath);

    // Extract PDF text using unpdf
    const pdf = await getDocumentProxy(
      new Uint8Array(fileBuffer)
    );

    const result = await extractText(pdf, {
      mergePages: true,
    });

    let text = result.text || "";

    if (!text || !text.trim()) {
      return NextResponse.json(
        {
          error: "Could not extract text from this PDF",
        },
        { status: 400 }
      );
    }

    // Truncate very large extracted text to avoid excessive AI prompt sizes
    const MAX_TEXT_CHARS = 50000;
    if (text.length > MAX_TEXT_CHARS) {
      console.warn(
        `Truncating resume text from ${text.length} to ${MAX_TEXT_CHARS} chars to limit AI prompt size.`
      );
      text = text.slice(0, MAX_TEXT_CHARS);
    }

    const prompt = `
You are a professional resume analyzer.

Analyze the following resume and return ONLY valid JSON.

Resume:

${text}

Return exactly this structure:

{
  "summary": "Short professional summary",
  "skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "experience": ["experience point 1", "experience point 2"],
  "education": ["education point 1", "education point 2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Keep the response concise and useful for a job seeker.
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

    let analysis;

    try {
      analysis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to process AI response" },
        { status: 500 }
      );
    }

    const detectedSkills = Array.isArray(analysis.skills)
  ? analysis.skills
      .filter((skill: unknown) => typeof skill === "string")
      .map((skill: string) => skill.trim())
      .filter(Boolean)
  : [];

for (const skillName of detectedSkills) {
  const skill = await prisma.skill.upsert({
    where: {
      name: skillName,
    },
    update: {},
    create: {
      name: skillName,
    },
  });

  await prisma.userSkill.upsert({
    where: {
      userId_skillId: {
        userId,
        skillId: skill.id,
      },
    },
    update: {},
    create: {
      userId,
      skillId: skill.id,
    },
  });
}

return NextResponse.json({
  success: true,
  resumeId: resume.id,
  analysis,
  skillsSaved: detectedSkills,
});
  } catch (error) {
    console.error(
      "Resume AI analysis failed:",
      error instanceof Error ? error.message : String(error)
    );

    if (isGeminiQuotaError(error)) {
      return NextResponse.json(getQuotaErrorResponse(), {
        status: 429,
      });
    }

    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
