import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getCurrentUserId } from "@/lib/current-user";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Quick Content-Length check to avoid parsing very large uploads
    const contentLengthHeader = request.headers.get("content-length");
    const maxUploadBytes = 6 * 1024 * 1024; // 6MB to allow multipart overhead
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);
      if (!Number.isNaN(contentLength) && contentLength > maxUploadBytes) {
        return NextResponse.json({ error: "Payload too large" }, { status: 413 });
      }
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const title = formData.get("title");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Resume title is required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Maximum file size is 5MB" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "private",
      "uploads",
      "resumes"
    );

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    const fileName = `${crypto.randomUUID()}.pdf`;

    const filePath = path.resolve(uploadDir, fileName);

    // validate resolved path stays within uploadDir
    const resolvedUploadDir = path.resolve(uploadDir);
    if (!filePath.startsWith(resolvedUploadDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Basic file signature check for PDF: '%PDF'
    const magic = buffer.slice(0, 4).toString("utf8");
    if (magic !== "%PDF") {
      return NextResponse.json({ error: "Uploaded file is not a valid PDF" }, { status: 400 });
    }

    await fs.writeFile(filePath, buffer);

    // Store a private identifier path in the DB (not a public URL)
    const fileUrl = `/private/uploads/resumes/${fileName}`;

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: title.trim(),
        fileUrl,
      },
    });

    return NextResponse.json(resume, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Resume upload failed:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
