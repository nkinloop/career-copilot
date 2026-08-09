import { FileText } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function ResumeScoreCard() {
  return (
    <GlassCard className="relative">
      <div className="absolute top-4 right-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-avatar opacity-90">
          <FileText size={16} strokeWidth={2} className="icon-brand" aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Resume Score
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
            91
          </h2>

          <p className="mt-2 text-sm text-gray-300">
            Excellent
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl brand-avatar">
          <FileText size={20} strokeWidth={2} className="icon-brand" aria-hidden="true" />
        </div>
      </div>
    </GlassCard>
  );
}