import GlassCard from "@/components/ui/GlassCard";

const applications = [
  {
    company: "Tech Company",
    role: "Software Engineer",
    status: "Interview",
    date: "2 days ago",
  },
  {
    company: "Analytics Company",
    role: "Data Analyst",
    status: "Applied",
    date: "5 days ago",
  },
  {
    company: "Product Company",
    role: "Backend Developer",
    status: "Review",
    date: "1 week ago",
  },
];

const statusStyles: Record<string, string> = {
  Interview: "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/20",
  Applied: "bg-white/10 text-slate-200 ring-1 ring-white/10",
  Review: "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20",
};

export default function RecentApplications() {
  return (
    <GlassCard className="mt-6 overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/10 px-1 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Application Tracker
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white/90">
            Recent Applications
          </h2>
        </div>

        <button className="inline-flex items-center justify-center self-start rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white sm:self-auto">
          View all
          <span className="ml-2 text-base leading-none">→</span>
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              <th className="pb-3 pl-1 font-medium">Company</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 pr-1 text-right font-medium">Date</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr
                key={`${application.company}-${application.role}`}
                className="group border-t border-white/5 align-middle transition-colors duration-200 hover:bg-white/[0.04]"
              >
                <td className="py-4 pl-1 pr-3">
                  <div className="font-medium text-white/90">
                    {application.company}
                  </div>
                </td>

                <td className="py-4 text-slate-400">
                  {application.role}
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[application.status]
                    }`}
                  >
                    {application.status}
                  </span>
                </td>

                <td className="py-4 pr-1 text-right text-slate-500">
                  {application.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}