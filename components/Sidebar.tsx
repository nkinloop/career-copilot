"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Brain,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Mic,
  Map,
  UserRound,
  X,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Resume", icon: FileText, href: "/resume" },
  { label: "Jobs", icon: BriefcaseBusiness, href: "/jobs" },
  { label: "Skills", icon: Brain, href: "/skills" },
  { label: "Career Roadmap", icon: Map, href: "/roadmap" },
  { label: "Applications", icon: ClipboardList, href: "/applications" },
  { label: "Interview Prep", icon: Mic, href: "/interview" },
  { label: "AI Copilot", icon: Bot, href: "/ai-copilot" },
  { label: "Profile", icon: UserRound, href: "/profile" },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden dark:bg-black/60"
        />
      )}

      {/* Sidebar */}
      <aside
        className={
          `
          fixed left-0 top-0 z-50 h-screen w-64
          border-r border-white/10 bg-black/60 text-white shadow-2xl backdrop-blur-md
          transition-transform duration-300 dark:border-white/10 dark:bg-black/60 dark:text-white
          md:sticky md:z-auto md:block md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `
        }
      >
        <div className="relative flex h-full flex-col p-4">
          {/* radial glow behind content */}
          <div className="absolute inset-0 -z-10 pointer-events-none sidebar-glow" />
          {/* Mobile close button */}
          <div className="mb-6 flex items-center justify-between md:hidden">
            <span className="text-lg font-semibold">
              Career Copilot
            </span>

            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center rounded-xl px-3 py-3 text-sm transition-all duration-300 transform ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive hover:bg-white/5 hover:text-white hover-scale'} `}
                >
                  <Icon size={18} strokeWidth={2} className={`mr-3 ${isActive ? 'icon-brand' : 'text-gray-400 group-hover:text-white'}`} aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
