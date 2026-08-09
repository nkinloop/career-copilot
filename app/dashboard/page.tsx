"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Brain,
  ClipboardList,
  FileText,
  ArrowRight,
} from "lucide-react";

type DashboardData = {
  stats: {
    jobCount: number;
    skillCount: number;
    applicationCount: number;
    averageMatch: number;
  };

  recentJobs: {
    id: string;
    title: string;
    company: string;
    location: string | null;
    matchPercentage: number;
  }[];

  topMissingSkills: {
    name: string;
    count: number;
  }[];

  careerOverview: {
    level: string;
    message: string;
    suggestion: string;
  };
};

export default function DashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "/api/dashboard"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load dashboard"
          );
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-slate-500 dark:text-gray-400">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-red-400">
          {error || "Something went wrong."}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}

      <section>
        <p className="text-sm font-medium text-[var(--brand)]">
          Career Copilot
        </p>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600 dark:text-gray-400">
          Track your job opportunities and career
          progress.
        </p>
      </section>

      {/* Stats */}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Jobs Available"
          value={data.stats.jobCount}
        />

        <StatCard
          title="My Skills"
          value={data.stats.skillCount}
        />

        <StatCard
          title="Average Match"
          value={`${data.stats.averageMatch}%`}
        />

        <StatCard
          title="Applications"
          value={data.stats.applicationCount}
        />
      </section>

      {/* Quick Actions */}

      <section className="mt-8">
        <div>
          <h2 className="text-xl font-semibold">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-gray-500">
            Quickly access your most important career
            tools.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            title="Browse Jobs"
            description="Find and explore job opportunities."
            href="/jobs"
            icon={BriefcaseBusiness}
          />

          <QuickAction
            title="My Resume"
            description="Upload and analyze your resume."
            href="/resume"
            icon={FileText}
          />

          <QuickAction
            title="Manage Skills"
            description="Update your career skill profile."
            href="/skills"
            icon={Brain}
          />

          <QuickAction
            title="Applications"
            description="Track your job applications."
            href="/applications"
            icon={ClipboardList}
          />
        </div>
      </section>

      {/* Recent Jobs + Skill Gaps */}

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Jobs */}

        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Recent Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-500">
                Your latest opportunities and match
                scores.
              </p>
            </div>

            <Link
              href="/jobs"
              className="flex items-center gap-1 text-sm text-[var(--brand)] transition hover:text-[var(--brand-strong)]"
            >
              View all <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {data.recentJobs.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-gray-500">
                No jobs available.
              </p>
            ) : (
              data.recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 transition hover:bg-slate-100/80 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium">
                      {job.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-500">
                      {job.company}

                      {job.location
                        ? ` • ${job.location}`
                        : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {job.matchPercentage}%
                    </p>

                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      match
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Skill Gaps */}

        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-semibold">
            Skill Gaps
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-gray-500">
            Skills that appear frequently in jobs but
            aren't in your profile.
          </p>

          <div className="mt-6 space-y-3">
            {data.topMissingSkills.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-gray-500">
                No missing skills detected.
              </p>
            ) : (
              data.topMissingSkills.map(
                (skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3 dark:bg-white/5"
                  >
                    <span className="text-sm">
                      {skill.name}
                    </span>

                    <span className="text-xs text-slate-500 dark:text-gray-500">
                      {skill.count} job
                      {skill.count !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                )
              )
            )}
          </div>

          <Link
            href="/skills"
            className="mt-6 block rounded-xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-center text-sm transition hover:bg-slate-100/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Improve My Skills
          </Link>
        </div>
      </section>

      {/* Career Overview */}

      <section className="mt-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-weak">
              Career Overview
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              You're currently at a{" "}
              {data.careerOverview.level.toLowerCase()}{" "}
              job match level.
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600 dark:text-gray-400">
              {data.careerOverview.message}
            </p>

            <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-gray-500">
              {data.careerOverview.suggestion}
            </p>
          </div>

          <Link
            href="/skills"
            className="w-fit shrink-0 rounded-xl border border-slate-200/70 bg-slate-50/80 px-5 py-3 text-sm font-medium transition hover:bg-slate-100/80 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            Improve My Skills →
          </Link>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <p className="text-sm text-slate-500 dark:text-gray-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/90 hover:text-brand-weak dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl brand-avatar">
        <Icon size={20} strokeWidth={2} className="icon-brand" aria-hidden="true" />
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-gray-500">
        {description}
      </p>
    </Link>
  );
}