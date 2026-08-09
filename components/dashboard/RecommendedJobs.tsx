import GlassCard from "@/components/ui/GlassCard";

const jobs = [
  {
    title: "Software Engineer",
    company: "Tech Company",
    match: 94,
  },
  {
    title: "Data Analyst",
    company: "Analytics Company",
    match: 87,
  },
  {
    title: "Backend Developer",
    company: "Product Company",
    match: 82,
  },
];

export default function RecommendedJobs() {
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Opportunities
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Recommended Jobs
          </h2>
        </div>

        <span className="text-sm text-gray-400">
          12 matches
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {jobs.map((job) => (
          <div
            key={job.title}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.07]"
          >
            <div>
              <p className="font-medium">
                {job.title}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {job.company}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">
                {job.match}%
              </p>

              <p className="text-xs text-gray-500">
                match
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm transition hover:bg-white/10">
        View all jobs →
      </button>
    </GlassCard>
  );
}