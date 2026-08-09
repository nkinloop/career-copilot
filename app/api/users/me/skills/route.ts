import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const skills = await prisma.userSkill.findMany({
      where: {
        userId,
      },
      include: {
        skill: true,
      },
    });

    return NextResponse.json(
      skills.map((item) => item.skill)
    );
  } catch (error) {
    console.error(
      "Failed to fetch skills:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to fetch skills" },
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

    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
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

    return NextResponse.json(skill, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Failed to add skill:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to add skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    const skillId = searchParams.get("skillId");

    if (!skillId) {
      return NextResponse.json(
        { error: "skillId is required" },
        { status: 400 }
      );
    }

    await prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to remove skill:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to remove skill" },
      { status: 500 }
    );
  }
}
