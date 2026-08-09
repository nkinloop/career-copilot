import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error(
      "Failed to fetch profile:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const {
      headline,
      bio,
      location,
      phone,
      linkedin,
      github,
      targetRole,
    } = body;

    const profile = await prisma.profile.upsert({
      where: {
        userId,
      },
      update: {
        headline,
        bio,
        location,
        phone,
        linkedin,
        github,
        targetRole,
      },
      create: {
        userId,
        headline,
        bio,
        location,
        phone,
        linkedin,
        github,
        targetRole,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error(
      "Failed to save profile:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
