import { Target } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function CareerScoreCard() {
  return (
    <GlassCard className="relative">
      <div className="absolute top-4 right-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-avatar opacity-90">
          <Target size={16} strokeWidth={2} className="icon-brand" aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Career Score
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
            82
          </h2>

          <p className="mt-2 text-sm text-gray-300">
            Strong progress
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl brand-avatar">
          <Target size={20} strokeWidth={2} className="icon-brand" aria-hidden="true" />
        </div>
      </div>
    </GlassCard>
  );
}