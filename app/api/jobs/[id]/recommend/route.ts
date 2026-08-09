import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
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

    const rawMissingSkills = body.missingSkills || [];
    const rawMatchedSkills = body.matchedSkills || [];
    const jobTitle = (body.jobTitle || "").toString().slice(0, 200);

    // Limit array sizes and individual skill lengths
    const MAX_SKILLS = 50;
    const sanitizeSkill = (s: unknown) =>
      typeof s === "string" ? s.trim().slice(0, 100) : "";

    const missingSkills = Array.isArray(rawMissingSkills)
      ? rawMissingSkills.map(sanitizeSkill).filter(Boolean).slice(0, MAX_SKILLS)
      : [];

    const matchedSkills = Array.isArray(rawMatchedSkills)
      ? rawMatchedSkills.map(sanitizeSkill).filter(Boolean).slice(0, MAX_SKILLS)
      : [];

    const prompt = `
You are a career advisor.

Job title: ${jobTitle}

Candidate matched skills:
${matchedSkills.join(", ") || "None"}

Candidate missing skills:
${missingSkills.join(", ") || "None"}

Give a short practical recommendation.

Return ONLY valid JSON in this exact format:

{
  "summary": "short recommendation",
  "priority": "Low | Medium | High",
  "skillsToLearn": ["skill1", "skill2", "skill3"],
  "advice": "short actionable advice"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const text = response.text || "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const recommendation = JSON.parse(cleaned);

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error(
      "Recommendation failed:",
      error instanceof Error ? error.message : String(error)
    );

    if (isGeminiQuotaError(error)) {
      return NextResponse.json(getQuotaErrorResponse(), {
        status: 429,
      });
    }

    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
