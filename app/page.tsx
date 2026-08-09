import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  FileText,
  Map,
  Mic,
  Sparkles,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const features = [
  {
    title: "Smart Job Matching",
    description:
      "Find opportunities that match your skills and career goals.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Resume Analysis",
    description:
      "Analyze your resume and identify areas that can be improved.",
    icon: FileText,
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Discover the skills employers are looking for and identify what you should learn next.",
    icon: Brain,
  },
  {
    title: "Career Roadmap",
    description:
      "Get a personalized roadmap that turns your career goal into actionable steps.",
    icon: Map,
  },
  {
    title: "Interview Preparation",
    description:
      "Practice technical, behavioral and HR questions tailored to your target roles.",
    icon: Mic,
  },
  {
    title: "AI Career Assistant",
    description:
      "Ask Career Copilot questions and get personalized career guidance.",
    icon: Bot,
  },
];

const steps = [
  {
    title: "Build Your Profile",
    description:
      "Add your skills, resume and career information to create a strong foundation.",
  },
  {
    title: "Discover Opportunities",
    description:
      "Explore jobs and understand how well they match your profile.",
  },
  {
    title: "Improve & Grow",
    description:
      "Use skill-gap analysis, roadmap guidance and interview preparation to become job-ready.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-full border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full brand-avatar">
                <Sparkles size={18} strokeWidth={2} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Career Copilot
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  AI career intelligence
                </p>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-medium text-gray-300 transition-brand hover:bg-white/10 hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-full px-4 py-2 text-sm font-semibold btn-primary"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </header>

        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] sm:p-10 lg:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.12),transparent_30%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
                <div className="inline-flex items-center gap-2 rounded-full brand-pill px-3 py-1 text-sm font-medium">
                <Sparkles size={16} strokeWidth={2} className="icon-brand" aria-hidden="true" />
                Smarter career decisions, faster
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Your AI-Powered Career Copilot
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-gray-300">
                Career Copilot helps you discover relevant jobs, understand skill gaps, improve your resume, prepare for interviews and plan your next move with confidence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold btn-primary"
                >
                  Get Started
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition-brand hover:bg-white/15"
                >
                  Log In
                </Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                    Career intelligence
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    From profile to opportunity
                  </p>
                </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-avatar">
                    <Sparkles size={20} strokeWidth={2} className="icon-brand" aria-hidden="true" />
                  </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Skills recognized and mapped",
                  "Target roles matched to your profile",
                  "Resume feedback and interview prep",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-300">
                    <CheckCircle2 size={16} strokeWidth={2} className="icon-brand" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to move your career forward
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-gray-300">
              Bring your job search, skill building and interview prep into one intelligent experience.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={feature.title}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-avatar">
                    <Icon size={20} strokeWidth={2} className="icon-brand" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-300">
                    {feature.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              How Career Copilot works
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <GlassCard key={step.title} className="rounded-[1.25rem]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full brand-avatar text-sm font-semibold">
                  0{index + 1}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-300">
                  {step.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200/70 bg-brand-5 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-brand-10 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                  Career intelligence
                </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                Skills → Jobs → Skill Gaps → Learning → Interviews → Applications
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-gray-300">
                Instead of juggling separate tools for every part of your job search, Career Copilot brings the whole workflow together in one intelligent experience.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl brand-avatar text-brand-strong">
                  <Brain size={18} strokeWidth={2} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    One workflow, many outcomes
                  </p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    From first discovery to final application
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                {[
                  "Skills",
                  "Jobs",
                  "Skill Gaps",
                  "Learning",
                  "Interviews",
                  "Applications",
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-300">
                    <span>{item}</span>
                    {index < 5 ? <ChevronRight size={14} strokeWidth={2} aria-hidden="true" /> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] sm:p-10 lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            Ready to begin?
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Ready to take control of your career?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-gray-300">
            Create your Career Copilot profile and start building a smarter path toward your next opportunity.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full btn-primary px-5 py-3 text-sm font-semibold"
            >
              Get Started
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-gray-200 dark:hover:bg-white/10"
            >
              Already have an account? Log in
            </Link>
          </div>
        </section>

        <footer className="mt-16 flex flex-col gap-3 border-t border-slate-200/70 py-8 text-sm text-slate-500 dark:border-white/10 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Career Copilot</p>
            <p className="mt-1">AI-powered career intelligence for your next opportunity.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="transition hover:text-slate-900 dark:hover:text-white">
              Home
            </Link>
            <Link href="/login" className="transition hover:text-slate-900 dark:hover:text-white">
              Log In
            </Link>
            <Link href="/signup" className="transition hover:text-slate-900 dark:hover:text-white">
              Get Started
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}