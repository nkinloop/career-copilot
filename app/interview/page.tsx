"use client";

import { useEffect, useState } from "react";
import { useAiQuota } from "@/components/AiQuotaProvider";
import { isQuotaExceededResponse } from "@/lib/ai-errors";
import { Sparkles, Target, Lightbulb, Brain, Mic } from "lucide-react";

type InterviewQuestion = {
  question: string;
  category: "Technical" | "Behavioral" | "HR";
  difficulty: "Easy" | "Medium" | "Hard";
  hint: string;
  idealAnswer: string;
};

type InterviewData = {
  targetRole: string;
  summary: string;
  questions: InterviewQuestion[];
};

type InterviewResponse = {
  success: boolean;
  interview: InterviewData;
};

const categories = ["All", "Technical", "Behavioral", "HR"];

export default function InterviewPage() {
  const [interview, setInterview] =
    useState<InterviewData | null>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("All");

  const [openQuestion, setOpenQuestion] =
    useState<number | null>(null);
  const { showQuotaToast } = useAiQuota();

  async function fetchInterview() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/interview");

      const data: InterviewResponse = await response.json();

      if (!response.ok) {
        if (response.status === 429 || isQuotaExceededResponse(data)) {
          showQuotaToast();
          return;
        }

        throw new Error(
          (data as any).error ||
            "Failed to load interview preparation"
        );
      }

      setInterview(data.interview);
    } catch (error) {
      console.error(
        "Failed to load interview preparation:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load interview preparation"
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateNewQuestions() {
    try {
      setGenerating(true);
      setError("");
      setOpenQuestion(null);

      const response = await fetch("/api/interview", {
        cache: "no-store",
      });

      const data: InterviewResponse = await response.json();

      if (!response.ok) {
        if (response.status === 429 || isQuotaExceededResponse(data)) {
          showQuotaToast();
          return;
        }

        throw new Error(
          (data as any).error ||
            "Failed to generate questions"
        );
      }

      setInterview(data.interview);
    } catch (error) {
      console.error("Failed to generate questions:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate questions"
      );
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    fetchInterview();
  }, []);

  const filteredQuestions =
    interview?.questions.filter((question) =>
      category === "All"
        ? true
        : question.category === category
    ) || [];

  function difficultyClass(difficulty: string) {
    if (difficulty === "Easy") {
      return "border-green-400/20 bg-green-400/10 text-green-300";
    }

    if (difficulty === "Medium") {
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
    }

    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  function categoryClass(category: string) {
    if (category === "Technical") {
      return "border-brand-10 bg-brand-10 text-brand-weak";
    }

    if (category === "Behavioral") {
      return "border-purple-400/20 bg-purple-400/10 text-purple-300";
    }

    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="text-gray-400">
              Preparing your interview questions...
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (error && !interview) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              onClick={fetchInterview}
              className="mt-5 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20"
            >
              Try Again
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (!interview) {
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
                AI-powered preparation
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Interview Prep
              </h1>

              <p className="mt-3 max-w-3xl text-gray-400">
                Practice personalized technical, behavioral,
                and HR questions based on your skills and
                target jobs.
              </p>
            </div>

            <button
              onClick={generateNewQuestions}
              disabled={generating}
              className="w-fit rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Sparkles size={16} strokeWidth={2} className="mr-2" aria-hidden="true" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} strokeWidth={2} className="mr-2" aria-hidden="true" />
                  Generate New Questions
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </section>

        {/* Target Role */}
        <section className="mt-6 rounded-3xl border border-brand-10 bg-brand-5 p-6 backdrop-blur-xl md:p-8">
          <p className="flex items-center gap-2 text-sm font-medium text-[var(--brand)]">
            <Target size={16} strokeWidth={2} aria-hidden="true" />
            Recommended Target Role
          </p>

          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            {interview.targetRole}
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-gray-300">
            {interview.summary}
          </p>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-500">
              Total Questions
            </p>

            <p className="mt-2 text-3xl font-bold">
              {interview.questions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-500">
              Technical
            </p>

            <p className="mt-2 text-3xl font-bold text-brand-weak">
              {
                interview.questions.filter(
                  (question) =>
                    question.category === "Technical"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-500">
              Behavioral + HR
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-300">
              {
                interview.questions.filter(
                  (question) =>
                    question.category !== "Technical"
                ).length
              }
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--brand)]">
                Practice Questions
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Interview Questions
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    setOpenQuestion(null);
                  }}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    category === item
                      ? "border-brand-10 bg-brand-10 text-brand"
                      : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="mt-6 space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-gray-400">
                No questions available for this category.
              </p>
            </div>
          ) : (
            filteredQuestions.map((question, index) => {
              const isOpen = openQuestion === index;

              return (
                <article
                  key={`${question.question}-${index}`}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                  {/* Question Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion(
                        isOpen ? null : index
                      )
                    }
                    className="w-full p-6 text-left md:p-7"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-gray-300">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs ${categoryClass(
                              question.category
                            )}`}
                          >
                            {question.category}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs ${difficultyClass(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </span>
                        </div>

                        <h3 className="mt-4 text-base font-semibold leading-7 text-gray-200 md:text-lg">
                          {question.question}
                        </h3>
                      </div>

                      <span className="text-xl text-gray-500">
                        {isOpen ? "−" : "+"}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="border-t border-white/10 px-6 pb-6 pt-5 md:px-7 md:pb-7">

                      {/* Hint */}
                      <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5">
                        <p className="flex items-center gap-2 text-sm font-medium text-yellow-300">
                          <Lightbulb size={16} strokeWidth={2} aria-hidden="true" />
                          Hint
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-300">
                          {question.hint}
                        </p>
                      </div>

                      {/* Ideal Answer */}
                      <div className="mt-4 rounded-2xl border border-green-400/10 bg-green-400/5 p-5">
                        <p className="flex items-center gap-2 text-sm font-medium text-green-300">
                          <Brain size={16} strokeWidth={2} aria-hidden="true" />
                          Ideal Answer
                        </p>

                        <p className="mt-2 text-sm leading-7 text-gray-300">
                          {question.idealAnswer}
                        </p>
                      </div>

                      {/* Practice Tip */}
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="flex items-center gap-2 text-sm font-medium text-gray-400">
                          <Mic size={16} strokeWidth={2} aria-hidden="true" />
                          Practice Tip
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          Try answering this question aloud
                          before revealing the ideal answer.
                          Keep your response structured,
                          concise, and supported with a
                          practical example where possible.
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        {/* Bottom */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl md:p-8">
          <p className="text-sm text-gray-500">
            Keep practicing
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Confidence comes from preparation.
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Practice the questions aloud, review the hints,
            and compare your answers with the suggested
            responses.
          </p>
        </section>
      </div>
    </main>
  );
}