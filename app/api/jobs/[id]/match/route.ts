import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: {
        id,
      },
      include: {
        jobSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const userSkills = await prisma.userSkill.findMany({
      where: {
        userId,
      },
      include: {
        skill: true,
      },
    });

    const userSkillNames = new Set(
      userSkills.map((item) =>
        item.skill.name.toLowerCase()
      )
    );
const requiredSkills = job.jobSkills.map(
  (item) => item.skill
);

const matchedSkills = requiredSkills.filter((skill) =>
  userSkillNames.has(skill.name.toLowerCase())
);

const missingSkills = requiredSkills.filter(
  (skill) =>
    !userSkillNames.has(skill.name.toLowerCase())
);

const matchPercentage =
  requiredSkills.length === 0
    ? 0
    : Math.round(
        (matchedSkills.length /
          requiredSkills.length) *
          100
      );

return NextResponse.json({
  jobId: job.id,
  matchPercentage,
  requiredSkills,
  matchedSkills,
  missingSkills,
  totalRequired: requiredSkills.length,
  totalMatched: matchedSkills.length,
});  } catch (error) {
    console.error(
      "Failed to calculate job match:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to calculate job match" },
      { status: 500 }
    );
  }
}
