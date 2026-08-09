
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAiQuota } from "@/components/AiQuotaProvider";
import { isQuotaExceededResponse } from "@/lib/ai-errors";
import { ArrowLeft, ArrowRight, Check, Lightbulb, MapPin, Sparkles, TrendingUp, TriangleAlert } from "lucide-react";

type JobSkill = {
  skill: {
    name: string;
  };
};
type JobMatch = {
  matchPercentage: number;
  matchedSkills: {
    id: string;
    name: string;
  }[];
  missingSkills: {
    id: string;
    name: string;
  }[];
  totalRequired: number;
  totalMatched: number;
};

type Job = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  url: string | null;
  source: string | null;
  createdAt: string;
  jobSkills: JobSkill[];
};


export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();

const [job, setJob] = useState<Job | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [analyzing, setAnalyzing] = useState(false);
const [analysisError, setAnalysisError] = useState("");

const [match, setMatch] = useState<JobMatch | null>(null);
const [matchLoading, setMatchLoading] = useState(true);
const [matchError, setMatchError] = useState("");

const [applying, setApplying] = useState(false);
const [applied, setApplied] = useState(false);
const [applicationError, setApplicationError] = useState("");

const [recommendation, setRecommendation] = useState<{
  summary: string;
  priority: string;
  skillsToLearn: string[];
  advice: string;
} | null>(null);

const [recommendationLoading, setRecommendationLoading] =
  useState(false);

const [recommendationError, setRecommendationError] =
  useState("");
const { showQuotaToast } = useAiQuota();
  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);

        if (!response.ok) {
          throw new Error("Job not found");
        }

        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load this job.");
      } finally {
        setLoading(false);
      }
    }
    async function fetchMatch() {
  try {
    setMatchLoading(true);

    const response = await fetch(
      `/api/jobs/${params.id}/match`
    );

    if (!response.ok) {
      throw new Error("Failed to calculate match");
    }

    const data = await response.json();
    setMatch(data);
  } catch (error) {
    console.error(error);
    setMatchError("Unable to calculate job match.");
  } finally {
    setMatchLoading(false);
  }
}
if (params.id) {
  fetchJob();
  fetchMatch();
}
  }, [params.id]);

  async function analyzeJob() {
    if (!job) return;

    setAnalyzing(true);
    setAnalysisError("");

    try {
      const response = await fetch(`/api/jobs/${job.id}/analyze`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 || isQuotaExceededResponse(data)) {
          showQuotaToast();
          return;
        }

        throw new Error(data.error || "Failed to analyze job");
      }

      // Fetch the job again so the newly-created skills appear
      const updatedResponse = await fetch(`/api/jobs/${job.id}`);

      if (!updatedResponse.ok) {
        throw new Error("Failed to refresh job");
      }

      const updatedJob = await updatedResponse.json();

      setJob(updatedJob);
    } catch (error) {
      console.error("AI analysis failed:", error);

      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Failed to analyze job"
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function getRecommendation() {
  if (!job || !match) return;

  setRecommendationLoading(true);
  setRecommendationError("");

  try {
    const response = await fetch(
      `/api/jobs/${job.id}/recommend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: job.title,
          matchedSkills: match.matchedSkills.map(
            (skill) => skill.name
          ),
          missingSkills: match.missingSkills.map(
            (skill) => skill.name
          ),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429 || isQuotaExceededResponse(data)) {
        showQuotaToast();
        return;
      }

      throw new Error(
        data.error || "Failed to generate recommendation"
      );
    }

    setRecommendation(data);
  } catch (error) {
    console.error(error);

    setRecommendationError(
      error instanceof Error
        ? error.message
        : "Failed to generate recommendation"
    );
  } finally {
    setRecommendationLoading(false);
  }
}
async function applyToJob() {
  if (!job) return;

  setApplying(true);
  setApplicationError("");

  try {
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId: job.id,
        status: "APPLIED",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to apply"
      );
    }

    setApplied(true);
  } catch (error) {
    console.error(error);

    setApplicationError(
      error instanceof Error
        ? error.message
        : "Failed to apply"
    );
  } finally {
    setApplying(false);
  }
}
  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <p className="text-gray-400">Loading job...</p>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <h1 className="text-2xl font-bold">
          Job not found
        </h1>

        <p className="mt-2 text-gray-400">
          This opportunity may have been removed or doesn't exist.
        </p>

        <button
          onClick={() => router.push("/jobs")}
          className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
        >
          ← Back to Jobs
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      {/* Back button */}
      <button
        onClick={() => router.push("/jobs")}
        className="mb-6 text-sm text-gray-400 transition hover:text-white"
      >
        <span className="flex items-center gap-2">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to Jobs
        </span>
      </button>

      {/* Hero */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--brand)]">
              Career opportunity
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {job.title}
            </h1>

            <p className="mt-3 text-lg text-gray-300">
              {job.company}
            </p>

            {job.location && (
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                {job.location}
              </p>
            )}
          </div>

          {job.source && (
            <span className="w-fit rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-gray-400">
              {job.source}
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20"
            >
              Apply / View Job <ArrowRight size={16} strokeWidth={2} className="ml-2 inline" aria-hidden="true" />
            </a>
            
          )}
          <button
  onClick={applyToJob}
  disabled={applying || applied}
  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
>
  {applying
    ? "Saving..."
    : applied
    ? <span className="flex items-center gap-2"><Check size={16} strokeWidth={2} aria-hidden="true" />Applied</span>
    : <span className="flex items-center gap-2"><Check size={16} strokeWidth={2} aria-hidden="true" />Track Application</span>}
</button>
{applicationError && (
  <p className="mt-4 text-sm text-red-400">
    {applicationError}
  </p>
)}

          <button
            onClick={analyzeJob}
            disabled={analyzing}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                Analyze with AI
              </span>
            )}
          </button>
        </div>

        {analysisError && (
          <p className="mt-4 text-sm text-red-400">
            {analysisError}
          </p>
        )}
      </section>

      {/* Description */}
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <h2 className="text-xl font-semibold">
          Job Description
        </h2>

        <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-400">
          {job.description || "No description available."}
        </div>
      </section>

      {/* AI Skills */}
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <h2 className="text-xl font-semibold">
          AI-Detected Skills
        </h2>

        {job.jobSkills.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">
            No skills analyzed yet. Click "Analyze with AI" above.
          </p>
        ) : (
          <div className="mt-5 flex flex-wrap gap-3">
            {job.jobSkills.map((jobSkill) => (
              <span
                key={jobSkill.skill.name}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
              >
                {jobSkill.skill.name}
              </span>
            ))}
          </div>
        )}
      </section>
{/* Job Match */}
<section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
  <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
      <p className="text-sm font-medium text-[var(--brand)]">
        Career Copilot
      </p>

      <h2 className="mt-1 text-2xl font-semibold">
        Job Match Analysis
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
        See how closely your current skills match the requirements
        for this opportunity.
      </p>

      {match && !matchLoading && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Skill compatibility
            </span>

            <span className="font-medium text-white">
              {match.matchPercentage}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-brand transition-all duration-700"
              style={{
                width: `${Math.min(
                  Math.max(match.matchPercentage, 0),
                  100
                )}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            {match.totalMatched} of {match.totalRequired} required
            skills matched
          </p>
        </div>
      )}
    </div>

    {matchLoading ? (
      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <span className="text-sm text-gray-500">
          Calculating...
        </span>
      </div>
    ) : match ? (
      <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border border-brand-10 bg-brand-10">
        <span className="text-3xl font-bold text-white">
          {match.matchPercentage}%
        </span>

        <span className="mt-1 text-xs text-gray-400">
          Match
        </span>
      </div>
    ) : null}
  </div>

  {matchError && (
    <p className="mt-5 text-sm text-red-400">
      {matchError}
    </p>
  )}

  {match && (
    <>
      {/* Match explanation */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
        <p className="flex items-center gap-2 text-sm font-medium text-white">
          <Lightbulb size={16} strokeWidth={2} aria-hidden="true" />
          What this score means
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          You currently match{" "}
          <span className="font-medium text-white">
            {match.totalMatched}
          </span>{" "}
          of{" "}
          <span className="font-medium text-white">
            {match.totalRequired}
          </span>{" "}
          required skills for this role.
          {match.matchPercentage >= 80
            ? " You have a strong skill match and should seriously consider applying."
            : match.matchPercentage >= 50
            ? " You have a reasonable foundation, but improving your missing skills could make you a stronger candidate."
            : " There are several skill gaps to work on before you become a stronger match for this role."}
        </p>
      </div>

      {/* Matched + Missing Skills */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Matched */}
        <div className="rounded-2xl border border-green-400/10 bg-green-400/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-green-400">
              <Check size={16} strokeWidth={2} aria-hidden="true" />
              Skills You Have
            </h3>

            <span className="text-xs text-gray-500">
              {match.matchedSkills.length}
            </span>
          </div>

          {match.matchedSkills.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No matching skills yet.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {match.matchedSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-sm text-green-300"
                >
                  <Check size={14} strokeWidth={2} aria-hidden="true" />
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Missing */}
        <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-yellow-400">
              <TriangleAlert size={16} strokeWidth={2} aria-hidden="true" />
              Skills to Improve
            </h3>

            <span className="text-xs text-gray-500">
              {match.missingSkills.length}
            </span>
          </div>

          {match.missingSkills.length === 0 ? (
            <p className="mt-4 text-sm text-green-400">
              🎉 You have all required skills!
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {match.missingSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-sm text-yellow-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Improvement section */}
      {match.missingSkills.length > 0 && (
        <div className="mt-6 rounded-2xl border border-purple-400/10 bg-purple-400/5 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-purple-400">
                <TrendingUp size={16} strokeWidth={2} aria-hidden="true" />
                Improve Your Match
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                Close your biggest skill gaps
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Focus on the missing skills below to become a stronger
                candidate for this position.
              </p>
            </div>

            <button
              onClick={() => router.push("/roadmap")}
              className="w-fit rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20"
            >
              View Career Roadmap →
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {match.missingSkills.slice(0, 6).map((skill, index) => (
              <div
                key={skill.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-gray-300">
                    {index + 1}
                  </span>

                  <span className="text-sm font-medium text-gray-300">
                    {skill.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )}
</section>
    </main>
  );
}

