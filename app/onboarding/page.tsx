"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";

type Skill = {
  id: string;
  name: string;
};

type OnboardingData = {
  completed: boolean;
  profile: {
    name: string | null;
    targetRole: string | null;
    headline: string | null;
    location: string | null;
  };
  skills: Skill[];
};

const roleOptions = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Python Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Other",
];

const suggestedSkills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "SQL",
  "PostgreSQL",
  "Git",
  "Docker",
  "AWS",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState("My Resume");

  const targetRole = useMemo(
    () => (selectedRole === "Other" ? customRole.trim() : selectedRole),
    [customRole, selectedRole]
  );

  useEffect(() => {
    let active = true;

    void fetch("/api/onboarding")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load onboarding");
        }

        return response.json() as Promise<OnboardingData>;
      })
      .then((data) => {
        if (!active) {
          return;
        }

        if (data.completed) {
          router.replace("/dashboard");
          return;
        }

        setName(data.profile.name || "");
        setHeadline(data.profile.headline || "");
        setLocation(data.profile.location || "");
        setSkills(data.skills.map((skill) => skill.name));

        if (data.profile.targetRole) {
          if (roleOptions.includes(data.profile.targetRole)) {
            setSelectedRole(data.profile.targetRole);
          } else {
            setSelectedRole("Other");
            setCustomRole(data.profile.targetRole);
          }
        }
      })
      .catch(() => {
        if (active) {
          setError("We could not load your onboarding details. Please try again.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  function addSkill(skillName: string) {
    const normalizedSkill = skillName.trim();

    if (!normalizedSkill) {
      return;
    }

    setSkills((current) => {
      if (
        current.some(
          (skill) => skill.toLowerCase() === normalizedSkill.toLowerCase()
        )
      ) {
        return current;
      }

      return [...current, normalizedSkill];
    });
    setSkillInput("");
  }

  function completeOnboarding() {
    if (!targetRole || skills.length === 0) {
      setError("Choose a target role and at least one skill to continue.");
      return;
    }

    setSaving(true);
    setError("");

    void fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetRole,
        skills,
        headline: headline.trim() || undefined,
        location: location.trim() || undefined,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to complete onboarding");
        }

        setStep(5);
      })
      .catch((completionError: unknown) => {
        setError(
          completionError instanceof Error
            ? completionError.message
            : "Unable to complete onboarding"
        );
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function handleResumeContinue() {
    if (!resumeFile) {
      completeOnboarding();
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", resumeTitle.trim() || "My Resume");
    formData.append("file", resumeFile);

    void fetch("/api/resumes", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to upload resume");
        }

        completeOnboarding();
      })
      .catch((uploadError: unknown) => {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Unable to upload resume"
        );
      })
      .finally(() => {
        setUploading(false);
      });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-sm text-slate-500 dark:text-gray-400">
        Preparing your personalized workspace...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl brand-avatar text-brand-strong">
                <Sparkles size={20} strokeWidth={2} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Career Copilot
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Personalized setup
                </p>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
              {step} of 5
            </p>
          </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {error ? (
            <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          ) : null}

          {step === 1 ? (
            <section className="py-10 text-center sm:py-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl brand-avatar text-brand-strong">
                <Sparkles size={28} strokeWidth={2} aria-hidden="true" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Welcome to Career Copilot{name ? `, ${name}` : ""}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-gray-300">
                Set up a few career details so we can personalize relevant jobs,
                skill gaps, resume insights, interview preparation, and AI guidance.
              </p>
              <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
                {[
                  { icon: BriefcaseBusiness, text: "Find relevant jobs" },
                  { icon: Brain, text: "Understand skill gaps" },
                  { icon: FileText, text: "Improve your resume" },
                  { icon: Target, text: "Prepare for interviews" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-gray-300"
                    >
                      <Icon size={17} className="icon-brand" aria-hidden="true" />
                      {item.text}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-10 inline-flex items-center gap-2 rounded-full btn-primary px-5 py-3 text-sm font-semibold"
              >
                Let&apos;s get started
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="py-8 sm:py-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Career goal
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                What role are you targeting?
              </h1>
              <p className="mt-3 text-slate-600 dark:text-gray-300">
                Choose the closest fit or add the role you are working toward.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setError("");
                    }}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      selectedRole === role
                        ? "border-brand-10 bg-brand-10 text-brand-strong dark:border-brand-strong dark:text-brand-strong"
                        : "border-slate-200/70 bg-white/70 text-slate-700 hover:border-brand-strong dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:border-brand-strong"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              {selectedRole === "Other" ? (
                <input
                  value={customRole}
                  onChange={(event) => setCustomRole(event.target.value)}
                  placeholder="Enter your target role"
                  className="mt-4 w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus-border-brand dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                />
              ) : null}
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-600 dark:text-gray-300">
                  Professional headline <span className="text-slate-400">(optional)</span>
                  <input
                    value={headline}
                    onChange={(event) => setHeadline(event.target.value)}
                    placeholder="e.g. Junior Frontend Developer"
                    className="mt-2 w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus-border-brand dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                  />
                </label>
                <label className="text-sm text-slate-600 dark:text-gray-300">
                  Location <span className="text-slate-400">(optional)</span>
                  <div className="relative mt-2">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="e.g. Bengaluru, India"
                      className="w-full rounded-2xl border border-slate-200/70 bg-white/80 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus-border-brand dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                    />
                  </div>
                </label>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="py-8 sm:py-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Your skills
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                What skills do you already have?
              </h1>
              <p className="mt-3 text-slate-600 dark:text-gray-300">
                Select a few to start. You can always refine your skills later.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => {
                  const selected = skills.some(
                    (currentSkill) => currentSkill.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() =>
                        selected
                          ? setSkills((current) =>
                              current.filter(
                                (currentSkill) =>
                                  currentSkill.toLowerCase() !== skill.toLowerCase()
                              )
                            )
                          : addSkill(skill)
                      }
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-brand-10 bg-brand-10 text-brand-strong dark:border-brand-strong dark:text-brand-strong"
                              : "border-slate-200/70 bg-white/70 text-slate-700 hover:border-brand-strong dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex gap-3">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Add another skill"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus-border-brand dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="rounded-2xl border border-slate-200/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                >
                  Add
                </button>
              </div>
              {skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() =>
                        setSkills((current) => current.filter((item) => item !== skill))
                      }
                      className="rounded-full border border-brand-10 bg-brand-10 px-3 py-1.5 text-sm text-brand-strong transition hover:bg-brand-10 dark:text-brand-strong"
                    >
                      {skill} <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {step === 4 ? (
            <section className="py-8 sm:py-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Optional resume
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Bring your resume when you are ready
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-gray-300">
                Already have a resume? Upload it and Career Copilot can use it to understand your skills and improve your recommendations.
              </p>
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 dark:border-white/15 dark:bg-black/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-avatar text-brand-strong">
                  <Upload size={20} strokeWidth={2} aria-hidden="true" />
                </div>
                <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-gray-200">
                  Resume title
                  <input
                    value={resumeTitle}
                    onChange={(event) => setResumeTitle(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus-border-brand dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-white"
                  />
                </label>
                <label className="mt-4 block cursor-pointer rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-4 text-sm text-slate-600 transition hover:border-brand-strong dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                  <span className="font-medium text-slate-800 dark:text-white">Choose PDF resume</span>
                  <span className="ml-2 text-slate-500">{resumeFile?.name || "No file selected"}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      if (file && file.type !== "application/pdf") {
                        setError("Please select a PDF resume.");
                        return;
                      }
                      setError("");
                      setResumeFile(file);
                    }}
                  />
                </label>
              </div>
            </section>
          ) : null}

          {step === 5 ? (
            <section className="py-12 text-center sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                <CheckCircle2 size={30} strokeWidth={2} aria-hidden="true" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                You&apos;re all set.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-gray-300">
                Career Copilot will now personalize your job matches, skill gaps,
                roadmap, interview preparation, and AI guidance.
              </p>
              <button
                type="button"
                onClick={() => window.location.assign("/dashboard")}
                className="mt-9 inline-flex items-center gap-2 rounded-full btn-primary px-5 py-3 text-sm font-semibold"
              >
                Go to Dashboard
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </section>
          ) : null}

          {step > 1 && step < 5 ? (
            <div className="flex items-center justify-between border-t border-slate-200/70 pt-6 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep((current) => current - 1);
                }}
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/10"
              >
                <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
                Back
              </button>

              {step === 2 ? (
                <button
                  type="button"
                  disabled={!targetRole}
                  onClick={() => {
                    setError("");
                    setStep(3);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl btn-primary px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              ) : null}

              {step === 3 ? (
                <button
                  type="button"
                  disabled={skills.length === 0}
                  onClick={() => {
                    setError("");
                    setStep(4);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl btn-primary px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              ) : null}

              {step === 4 ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={completeOnboarding}
                    disabled={saving || uploading}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/10"
                  >
                    Skip for now
                  </button>
                  <button
                    type="button"
                    onClick={handleResumeContinue}
                    disabled={saving || uploading}
                    className="inline-flex items-center gap-2 rounded-xl btn-primary px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : saving ? "Saving..." : resumeFile ? "Upload and continue" : "Continue"}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
