"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAiQuota } from "@/components/AiQuotaProvider";
import { isQuotaExceededResponse } from "@/lib/ai-errors";

type Resume = {
  id: string;
  title: string;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const { showQuotaToast } = useAiQuota();

const [analysis, setAnalysis] = useState<{
  summary: string;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  experience: string[];
  education: string[];
  suggestions: string[];
} | null>(null);

const [analysisError, setAnalysisError] = useState("");

  async function fetchResumes() {
    try {
      const response = await fetch("/api/resumes");

      if (!response.ok) {
        throw new Error("Failed to fetch resumes");
      }

      const data = await response.json();
      setResumes(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load resumes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResumes();
  }, []);

  async function addResume(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a resume title.");
      return;
    }

    if (!file) {
      setError("Please select a PDF resume.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("file", file);

      const response = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload resume"
        );
      }

      setResumes((current) => [data, ...current]);
      setTitle("");
      setFile(null);

      const fileInput = document.getElementById(
        "resume-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload resume"
      );
    } finally {
      setSaving(false);
    }
  }
async function analyzeResume(resumeId: string) {
  setAnalyzingId(resumeId);
  setAnalysisError("");
  setAnalysis(null);

  try {
    const response = await fetch(
      `/api/resumes/${resumeId}/analyze`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429 || isQuotaExceededResponse(data)) {
        showQuotaToast();
        return;
      }

      throw new Error(
        data.error || "Failed to analyze resume"
      );
    }

    setAnalysis(data.analysis);
  } catch (error) {
    console.error(error);

    setAnalysisError(
      error instanceof Error
        ? error.message
        : "Failed to analyze resume"
    );
  } finally {
    setAnalyzingId(null);
  }
}
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <p className="text-sm font-medium text-[var(--brand)]">
            Career Copilot
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            My Resumes
          </h1>

          <p className="mt-2 text-gray-400">
            Upload your resume and use it for AI-powered
            career analysis.
          </p>
        </section>
{analysisError && (
  <section className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
    <p className="text-sm text-red-400">
      {analysisError}
    </p>
  </section>
)}

{analysis && (
  <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
    <h2 className="text-2xl font-semibold">
      AI Resume Analysis
    </h2>

    <div className="mt-6">
      <p className="text-sm text-gray-500">
        Professional Summary
      </p>

      <p className="mt-2 leading-7 text-gray-300">
        {analysis.summary}
      </p>
    </div>

    <div className="mt-6">
      <p className="text-sm text-gray-500">
        Skills
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {analysis.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-gray-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="mt-6">
      <p className="text-sm text-gray-500">
        Strengths
      </p>

      <ul className="mt-3 space-y-2 text-gray-300">
        {analysis.strengths.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <p className="text-sm text-gray-500">
        Areas to Improve
      </p>

      <ul className="mt-3 space-y-2 text-gray-300">
        {analysis.weaknesses.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <p className="text-sm text-gray-500">
        Experience
      </p>

      <ul className="mt-3 space-y-2 text-gray-300">
        {analysis.experience.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <p className="text-sm text-gray-500">
        Education
      </p>

      <ul className="mt-3 space-y-2 text-gray-300">
        {analysis.education.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <p className="text-sm text-gray-500">
        Suggestions
      </p>

      <ul className="mt-3 space-y-2 text-gray-300">
        {analysis.suggestions.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  </section>
)}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="text-xl font-semibold">
            Upload Resume
          </h2>

          <form
            onSubmit={addResume}
            className="mt-5 space-y-5"
          >
            <div>
              <label className="text-sm text-gray-400">
                Resume title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Frontend Developer Resume"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-white/20"
              />
            </div>

            <div>
              <label
                htmlFor="resume-file"
                className="text-sm text-gray-400"
              >
                Resume PDF
              </label>

              <input
                id="resume-file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="mt-2 block w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-white/20"
              />

              {file && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Uploading..."
                : "+ Upload Resume"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Your Resumes
            </h2>

            <span className="text-sm text-gray-500">
              {resumes.length} resume
              {resumes.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading resumes...
            </p>
          ) : resumes.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-gray-400">
                No resumes uploaded yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <p className="text-lg font-semibold">
                    {resume.title}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Added{" "}
                    {new Date(
                      resume.createdAt
                    ).toLocaleDateString()}
                  </p>

                  {resume.fileUrl && (
                    <a
                      href={`/api/resumes/${resume.id}/file`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-block text-sm text-[var(--brand)] hover:text-[var(--brand-strong)]"
                    >
                      View Resume →
                    </a>
                  )}
                  <button
  onClick={() => analyzeResume(resume.id)}
  disabled={analyzingId === resume.id}
  className="mt-4 block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
>
  {analyzingId === resume.id ? (
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
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}