"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

type OnboardingStatus = "loading" | "complete" | "incomplete" | "error";

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatus>("loading");
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPage =
    pathname === "/" || pathname === "/login" || pathname === "/signup";
  const isOnboardingPage = pathname === "/onboarding";

  useEffect(() => {
    if (isPublicPage) {
      return;
    }

    let active = true;

    void fetch("/api/onboarding")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load onboarding status");
        }

        return response.json() as Promise<{ completed: boolean }>;
      })
      .then((data) => {
        if (active) {
          setOnboardingStatus(data.completed ? "complete" : "incomplete");
        }
      })
      .catch(() => {
        if (active) {
          setOnboardingStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [isPublicPage]);

  useEffect(() => {
    if (isPublicPage || onboardingStatus === "loading" || onboardingStatus === "error") {
      return;
    }

    if (onboardingStatus === "incomplete" && !isOnboardingPage) {
      router.replace("/onboarding");
    }

    if (onboardingStatus === "complete" && isOnboardingPage) {
      router.replace("/dashboard");
    }
  }, [isOnboardingPage, isPublicPage, onboardingStatus, router]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (onboardingStatus === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-sm text-slate-500 dark:text-gray-400">
        Preparing your Career Copilot workspace...
      </main>
    );
  }

  if (onboardingStatus === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            We could not load your account setup.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl btn-primary px-4 py-2 text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (
    (onboardingStatus === "incomplete" && !isOnboardingPage) ||
    (onboardingStatus === "complete" && isOnboardingPage)
  ) {
    return null;
  }

  if (isOnboardingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
