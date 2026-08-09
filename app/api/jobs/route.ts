import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";

    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  {
                    title: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    company: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {},

          location
            ? {
                location: {
                  contains: location,
                  mode: "insensitive",
                },
              }
            : {},
        ],
      },

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
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error(
      "Failed to fetch jobs:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
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

    const { title, company, location, description, url, source } = body;

    if (!title || !company) {
      return NextResponse.json(
        { error: "Title and company are required" },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        description,
        url,
        source,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error(
      "Failed to create job:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
