import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resumes = await prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error(
      "Failed to fetch resumes:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentLengthHeader = request.headers.get("content-length");
    const maxUploadBytes = 6 * 1024 * 1024;

    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);

      if (
        !Number.isNaN(contentLength) &&
        contentLength > maxUploadBytes
      ) {
        return NextResponse.json(
          { error: "Payload too large" },
          { status: 413 }
        );
      }
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const file = formData.get("file");

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Resume title is required" },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "PDF file is required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Maximum file size is 5MB" },
        { status: 400 }
      );
    }

    const magic = buffer.slice(0, 4).toString("utf8");

    if (magic !== "%PDF") {
      return NextResponse.json(
        { error: "Uploaded file is not a valid PDF" },
        { status: 400 }
      );
    }

    const crypto = await import("crypto");
    const fileName = `${crypto.randomUUID()}.pdf`;

    // Keep each user's resumes in their own folder.
    const blobPath = `resumes/${userId}/${fileName}`;

    const blob = await put(blobPath, buffer, {
      access: "private",
      contentType: "application/pdf",
      addRandomSuffix: false,
    });

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: title.trim(),
        fileUrl: blob.url,
      },
    });

    return NextResponse.json(resume, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Failed to upload resume:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}