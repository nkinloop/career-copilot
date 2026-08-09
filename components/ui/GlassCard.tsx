type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border border-slate-200/70
        bg-white/80
        p-8
        shadow-[0_12px_40px_rgba(15,23,42,0.08)]
        backdrop-blur-md
        border border-white/10
        shadow-lg shadow-black/20
        transition-all duration-300
        hover:bg-white/10
        hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)]
        hover:-translate-y-1
        will-change-transform
        dark:bg-white/5
        dark:border-white/10
        dark:shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}