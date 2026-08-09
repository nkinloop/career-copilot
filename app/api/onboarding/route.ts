import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        onboardingCompletedAt: true,
        profile: {
          select: {
            targetRole: true,
            headline: true,
            bio: true,
            location: true,
          },
        },
        userSkills: {
          include: { skill: true },
        },
        _count: {
          select: {
            resumes: true,
            applications: true,
          },
        },
      },
    });

    if (!user) {
      return unauthorizedResponse();
    }

    const hasLegacyData =
      Boolean(user.profile) ||
      user.userSkills.length > 0 ||
      user._count.resumes > 0 ||
      user._count.applications > 0;

    let completedAt = user.onboardingCompletedAt;

    if (!completedAt && hasLegacyData) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          onboardingCompletedAt: new Date(),
        },
        select: {
          onboardingCompletedAt: true,
        },
      });

      completedAt = updatedUser.onboardingCompletedAt;
    }

    return NextResponse.json({
      completed: Boolean(completedAt),
      profile: {
        name: user.name,
        targetRole: user.profile?.targetRole ?? null,
        headline: user.profile?.headline ?? null,
        bio: user.profile?.bio ?? null,
        location: user.profile?.location ?? null,
      },
      skills: user.userSkills.map(
        (userSkill) => userSkill.skill
      ),
    });
  } catch (error) {
    console.error(
      "Failed to load onboarding:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to load onboarding" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return unauthorizedResponse();
  }

  try {
    const body: {
      targetRole?: unknown;
      headline?: unknown;
      location?: unknown;
      skills?: unknown;
    } = await request.json();

    const targetRole =
      typeof body.targetRole === "string"
        ? body.targetRole.trim()
        : "";

    const headline =
      typeof body.headline === "string"
        ? body.headline.trim()
        : undefined;

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : undefined;

    const skills = Array.isArray(body.skills)
      ? Array.from(
          new Set(
            body.skills
              .filter(
                (skill: unknown) =>
                  typeof skill === "string"
              )
              .map((skill: string) => skill.trim())
              .filter(Boolean)
          )
        )
      : [];

    if (!targetRole) {
      return NextResponse.json(
        { error: "A target role is required" },
        { status: 400 }
      );
    }

    if (skills.length === 0) {
      return NextResponse.json(
        { error: "Select at least one skill" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const profile = await tx.profile.upsert({
          where: { userId },
          update: {
            targetRole,
            headline,
            location,
          },
          create: {
            userId,
            targetRole,
            headline,
            location,
          },
        });

        const savedSkills = [];

        for (const name of skills) {
          const skill = await tx.skill.upsert({
            where: { name },
            update: {},
            create: { name },
          });

          await tx.userSkill.upsert({
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

          savedSkills.push(skill);
        }

        await tx.user.update({
          where: { id: userId },
          data: {
            onboardingCompletedAt: new Date(),
          },
        });

        return {
          profile,
          skills: savedSkills,
        };
      },
      {
        timeout: 15000,
      }
    );

    return NextResponse.json({
      completed: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Failed to complete onboarding:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}   