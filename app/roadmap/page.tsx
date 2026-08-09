"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Clock3, Sparkles, Target, CheckCircle2, Computer, TrendingUp, Check } from "lucide-react";
import { useAiQuota } from "@/components/AiQuotaProvider";
import { isQuotaExceededResponse } from "@/lib/ai-errors";

type RoadmapStage = {
  title: string;
  duration: string;
  skills: string[];
  projects: string[];
  actions: string[];
};

type Roadmap = {
  careerGoal: string;
  summary: string;
  stages: RoadmapStage[];
  currentSkills: string[];
  missingSkills: string[];
};

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const { showQuotaToast } = useAiQuota();

  async function fetchRoadmap() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/roadmap");

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 || isQuotaExceededResponse(data)) {
          showQuotaToast();
          return;
        }

        throw new Error(
          data.error || "Failed to load roadmap"
        );
      }

setRoadmap({
  ...data.roadmap,
  currentSkills: data.currentSkills || [],
  missingSkills: data.missingSkills || [],
});    } catch (error) {
      console.error("Failed to load roadmap:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load roadmap"
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateRoadmap() {
    try {
      setGenerating(true);
      setError("");

      const response = await fetch("/api/roadmap", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 || isQuotaExceededResponse(data)) {
          showQuotaToast();
          return;
        }

        throw new Error(
          data.error || "Failed to generate roadmap"
        );
      }

      setRoadmap(data.roadmap);
    } catch (error) {
      console.error("Failed to generate roadmap:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate roadmap"
      );
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-gray-400">
              Loading your career roadmap...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !roadmap) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              onClick={fetchRoadmap}
              className="mt-5 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20"
            >
              Try Again
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (!roadmap) {
    return null;
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--brand)]">
                Career development
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Career Roadmap
              </h1>

              <p className="mt-3 max-w-3xl text-gray-400">
                A personalized learning path based on your
                current skills, career goals, and skill gaps.
              </p>
            </div>

            <button
              onClick={generateRoadmap}
              disabled={generating}
              className="w-fit rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                  Regenerate Roadmap
                </span>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </section>

        {/* Career Goal */}
        <section className="mt-6 rounded-3xl border border-brand-10 bg-brand-5 p-6 backdrop-blur-xl md:p-8">
          <p className="flex items-center gap-2 text-sm font-medium text-[var(--brand)]">
            <Target size={16} strokeWidth={2} aria-hidden="true" />
            Target Career
          </p>

          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            {roadmap.careerGoal}
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-gray-300">
            {roadmap.summary}
          </p>
        </section>

        {/* Skills Overview */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">

          {/* Current Skills */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Your Current Skills
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Skills You Have
                </h2>
              </div>

              <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-300">
                {roadmap.currentSkills.length}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {roadmap.currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/5 px-3 py-1.5 text-sm text-gray-300"
                >
                  <Check size={14} strokeWidth={2} aria-hidden="true" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Skill Gaps
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Skills To Learn
                </h2>
              </div>

              <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300">
                {roadmap.missingSkills.length}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {roadmap.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1.5 text-sm text-gray-300"
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mt-8">
          <div>
            <p className="text-sm text-[var(--brand)]">
              Your Learning Path
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Step-by-Step Roadmap
            </h2>

            <p className="mt-2 text-gray-400">
              Follow these stages to move toward your target
              career.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {roadmap.stages.map((stage, index) => (
              <article
                key={stage.title}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
              >
                {/* Stage Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-10 bg-brand-10 text-sm font-bold text-brand-strong">
                      {index + 1}
                    </div>

                    <div>
                      <p className="text-sm text-[var(--brand)]">
                        Stage {index + 1}
                      </p>

                      <h3 className="mt-1 text-xl font-semibold md:text-2xl">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  <span className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
                    <Clock3 size={14} strokeWidth={2} aria-hidden="true" />
                    {stage.duration}
                  </span>
                </div>

                {/* Skills */}
                <div className="mt-8">
                  <p className="text-sm font-medium text-gray-400">
                    Skills to Learn
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {stage.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="mt-7">
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <Computer size={16} strokeWidth={2} aria-hidden="true" />
                    Recommended Projects
                  </p>

                  <div className="mt-3 space-y-3">
                    {stage.projects.map(
                      (project, projectIndex) => (
                        <div
                          key={project}
                          className="rounded-xl border border-white/10 bg-black/20 p-4"
                        >
                          <p className="text-sm leading-6 text-gray-300">
                            <span className="mr-2 text-[var(--brand)]">
                              {projectIndex + 1}.
                            </span>

                            {project}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7">
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                    Recommended Actions
                  </p>

                  <ul className="mt-3 space-y-3">
                    {stage.actions.map((action) => (
                      <li
                        key={action}
                        className="flex gap-3 text-sm leading-6 text-gray-300"
                      >
                        <span className="mt-1 text-green-400">
                          <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                        </span>

                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl md:p-8">
          <p className="text-sm text-gray-500">
            Keep improving
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Turn your skill gaps into strengths.
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
            Use your roadmap alongside your job matches and
            applications to continuously improve your career
            profile.
          </p>
        </section>
      </div>
    </main>
  );
}
