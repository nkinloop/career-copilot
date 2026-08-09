"use client";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "@/components/theme-toggle";

type NavbarProps = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();
  const userLabel =
    session?.user?.name || session?.user?.email || "Account";

  return (
    <nav className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-slate-950 md:px-6">
      <div className="flex items-center gap-3">
  {onMenuClick && (
    <button
      type="button"
      onClick={onMenuClick}
      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-white/10 md:hidden"
      aria-label="Open menu"
    >
      <Menu size={20} />
    </button>
  )}

  <Link
    href="/"
    className="flex items-center gap-3 transition-opacity hover:opacity-80"
    aria-label="Career Copilot home"
  >
    <img
      src="/logo.png"
      alt=""
      className="h-9 w-9 object-contain"
    />

    <span className="text-lg font-semibold text-slate-900 dark:text-white md:text-xl">
      Career Copilot
    </span>
  </Link>
</div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
            {userLabel}
          </p>

          {session?.user?.email && session.user.name ? (
            <p className="text-xs text-slate-500 dark:text-gray-400">
              {session.user.email}
            </p>
          ) : null}
        </div>

        <ThemeToggle />

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <LogOut size={16} strokeWidth={2} aria-hidden="true" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}