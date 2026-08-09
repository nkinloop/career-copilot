import { Check } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const stages = [
  { label: "Profile", completed: true },
  { label: "Resume", completed: true },
  { label: "Skills", completed: true },
  { label: "Applications", completed: false },
  { label: "Interview", completed: false },
];

export default function CareerProgress() {
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400">Career Journey</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
            Your progress
          </h2>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-gray-300">
          60% complete
        </span>
      </div>

      <div className="mt-8 space-y-5">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex items-center gap-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                stage.completed
                    ? "border-brand-10 bg-brand-10 text-brand-strong dark:border-white/20 dark:bg-white/15 dark:text-white"
                  : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-500"
              }`}
            >
              {stage.completed ? <Check size={14} strokeWidth={2} aria-hidden="true" /> : index + 1}
            </div>

            <div className="flex-1">
              <p
                className={`text-sm ${
                  stage.completed
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-gray-500"
                }`}
              >
                {stage.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}