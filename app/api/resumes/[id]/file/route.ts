import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { get } from "@vercel/blob";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
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
        { status: 404 }
      );
    }

    const blobUrl = resume.fileUrl;

    // Make sure this is a Vercel Blob URL.
    if (!blobUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "Invalid resume file URL" },
        { status: 400 }
      );
    }

    const result = await get(blobUrl, {
      access: "private",
    });

    if (!result || result.statusCode !== 200) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const fileName =
      blobUrl.split("/").pop()?.split("?")[0] || "resume.pdf";

    return new Response(result.stream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch resume file:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to fetch resume file" },
      { status: 500 }
    );
  }
}