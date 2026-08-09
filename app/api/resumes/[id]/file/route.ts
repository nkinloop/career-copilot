import { NextResponse } from "next/server";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id, userId },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  if (!resume.fileUrl) {
    return NextResponse.json({ error: "Resume file not found" }, { status: 404 });
  }

  // Only allow two locations for now: private/uploads/resumes or public/uploads/resumes
  const fileUrl = resume.fileUrl;

  let baseDir: string;
  let fileName: string;

  if (fileUrl.startsWith("/private/uploads/resumes/")) {
    baseDir = path.resolve(process.cwd(), "private", "uploads", "resumes");
    fileName = path.basename(fileUrl);
  } else if (fileUrl.startsWith("/uploads/resumes/")) {
    // legacy public files; serve through auth for now
    baseDir = path.resolve(process.cwd(), "public", "uploads", "resumes");
    fileName = path.basename(fileUrl);
  } else {
    return NextResponse.json({ error: "Unsupported file location" }, { status: 400 });
  }

  const filePath = path.resolve(baseDir, fileName);

  // Prevent path traversal by ensuring resolved path starts with baseDir
  if (!filePath.startsWith(baseDir)) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  try {
    await fsp.access(filePath, fsp.constants.R_OK);
  } catch (err) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Read file into memory (files are limited to reasonable sizes)
  const fileBuffer = await fsp.readFile(filePath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
