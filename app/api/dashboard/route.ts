import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      jobCount,
      skillCount,
      applicationCount,
      jobs,
      userSkills,
    ] = await Promise.all([
      // Total jobs
      prisma.job.count(),

      // User's skills
      prisma.userSkill.count({
        where: {
          userId,
        },
      }),

      // User's applications
      prisma.application.count({
        where: {
          userId,
        },
      }),

      // ALL jobs for accurate average + skill gaps
      prisma.job.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          jobSkills: {
            include: {
              skill: true,
            },
          },
        },
      }),

      // User skills
      prisma.userSkill.findMany({
        where: {
          userId,
        },
        include: {
          skill: true,
        },
      }),
    ]);

    // -----------------------------------------
    // USER SKILLS
    // -----------------------------------------

    const userSkillNames = new Set(
      userSkills.map((item) =>
        item.skill.name.toLowerCase()
      )
    );

    // -----------------------------------------
    // CALCULATE MATCH FOR EVERY JOB
    // -----------------------------------------

    const jobsWithMatch = jobs.map((job) => {
      const requiredSkills = job.jobSkills.map(
        (item) => item.skill
      );

      const matchedSkills = requiredSkills.filter(
        (skill) =>
          userSkillNames.has(
            skill.name.toLowerCase()
          )
      );

      const matchPercentage =
        requiredSkills.length === 0
          ? 0
          : Math.round(
              (matchedSkills.length /
                requiredSkills.length) *
                100
            );

      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        matchPercentage,
      };
    });

    // -----------------------------------------
    // AVERAGE MATCH
    // -----------------------------------------

    const averageMatch =
      jobsWithMatch.length === 0
        ? 0
        : Math.round(
            jobsWithMatch.reduce(
              (total, job) =>
                total + job.matchPercentage,
              0
            ) / jobsWithMatch.length
          );

    // -----------------------------------------
    // RECENT JOBS
    // -----------------------------------------

    const recentJobs = jobsWithMatch.slice(0, 5);

    // -----------------------------------------
    // MISSING SKILLS
    // -----------------------------------------

    const missingSkillMap = new Map<
      string,
      number
    >();

    for (const job of jobs) {
      for (const jobSkill of job.jobSkills) {
        const skillName = jobSkill.skill.name;

        const hasSkill = userSkillNames.has(
          skillName.toLowerCase()
        );

        if (!hasSkill) {
          missingSkillMap.set(
            skillName,
            (missingSkillMap.get(skillName) || 0) + 1
          );
        }
      }
    }

    const topMissingSkills = Array.from(
      missingSkillMap.entries()
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
      }));

    // -----------------------------------------
    // CAREER OVERVIEW
    // -----------------------------------------

    let level = "Starting";
    let message =
      "Start building your skills and applying to relevant jobs.";
    let suggestion =
      "Add more skills to your career profile.";

    if (averageMatch >= 70) {
      level = "Strong";
      message =
        "Your skills are a strong match for the jobs you're tracking.";
      suggestion =
        "Keep improving your skills and focus on high-quality applications.";
    } else if (averageMatch >= 40) {
      level = "Developing";
      message =
        "You're building a solid career profile, but some skill gaps remain.";
      suggestion =
        "Focus on your most frequently missing skills to improve your job matches.";
    } else if (averageMatch > 0) {
      level = "Needs Improvement";
      message =
        "Your current job match is still developing.";
      suggestion =
        "Prioritize learning the skills that appear most often in your missing-skill list.";
    }

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return NextResponse.json({
      stats: {
        jobCount,
        skillCount,
        applicationCount,
        averageMatch,
      },

      recentJobs,

      topMissingSkills,

      careerOverview: {
        level,
        message,
        suggestion,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard failed:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        error: "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}
