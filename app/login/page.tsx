"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      const onboardingResponse = await fetch("/api/onboarding");

      if (!onboardingResponse.ok) {
        throw new Error("Unable to load account setup");
      }

      const onboarding = (await onboardingResponse.json()) as {
        completed: boolean;
      };

      router.push(onboarding.completed ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError("Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-full border border-white/10 brand-avatar px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full brand-avatar">
              <Sparkles size={18} strokeWidth={2} className="icon-brand" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Career Copilot</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">Welcome back</p>
            </div>
          </Link>
        </header>

        <section className="grid gap-8 rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              Sign in to your account
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-gray-300">
              Continue managing your career plans, applications and interview preparation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-200" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus-border-brand dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-200" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus-border-brand dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </button>

            <p className="mt-4 text-center text-sm text-slate-600 dark:text-gray-400">
              New here?{' '}
              <Link href="/signup" className="font-semibold link-brand">
                Create an account
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
