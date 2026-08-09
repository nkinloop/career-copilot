import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const applications = await prisma.application.findMany({
      where: {
        userId,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error(
      "Failed to fetch applications:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to fetch applications" },
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
    const body = await request.json();

    const { jobId, status } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId is required" },
        { status: 400 }
      );
    }
const application = await prisma.application.upsert({
  where: {
    userId_jobId: {
      userId,
      jobId,
    },
  },
  update: {
    status: status || "APPLIED",
  },
  create: {
    userId,
    jobId,
    status: status || "APPLIED",
  },
  include: {
    job: true,
  },
});
    return NextResponse.json(application, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Failed to create application:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
export async function PATCH(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const result = await prisma.application.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        status,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const application = await prisma.application.findFirst({
      where: { id, userId },
      include: { job: true },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error(
      "PATCH application error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
