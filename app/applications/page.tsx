"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
type Application = {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string | null;
  };
};
const statuses = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];
function getStatusCount(
  applications: Application[],
  status: string
) {
  return applications.filter(
    (application) => application.status === status
  ).length;
}
export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
    try {
      const response = await fetch("/api/applications");

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();

      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {
    try {
      const response = await fetch("/api/applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });
if (!response.ok) {
  const errorData = await response.json();

  console.error("Update status API error:", errorData);

  throw new Error(
    errorData.error || "Failed to update status"
  );
}

      const updated = await response.json();

      setApplications((current) =>
        current.map((application) =>
          application.id === id
            ? {
                ...application,
                status: updated.status,
              }
            : application
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section>
        <p className="text-sm font-medium text-[var(--brand)]">
          Career tracking
        </p>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          Applications
        </h1>

        <p className="mt-2 text-gray-400">
          Track and manage your job applications.
        </p>
      </section>
      {!loading && applications.length > 0 && (
  <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      title="Applied"
      value={getStatusCount(applications, "APPLIED")}
    />

    <StatCard
      title="Interviews"
      value={getStatusCount(applications, "INTERVIEW")}
    />

    <StatCard
      title="Offers"
      value={getStatusCount(applications, "OFFER")}
    />

    <StatCard
      title="Rejected"
      value={getStatusCount(applications, "REJECTED")}
    />
  </section>
)}

      {loading ? (
        <p className="mt-8 text-gray-500">
          Loading applications...
        </p>
      ) : applications.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-gray-400">
            No applications yet.
          </p>

          <Link
            href="/jobs"
            className="mt-4 inline-block text-sm text-[var(--brand)]"
          >
            Browse jobs →
          </Link>
        </div>
      ) : (
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="text-xl font-semibold hover:text-[var(--brand-strong)]"
                  >
                    {application.job.title}
                  </Link>

                  <p className="mt-2 text-gray-300">
                    {application.job.company}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Applied {" "}
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </p>

                  {application.job.location && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                      {application.job.location}
                    </p>
                  )}
                </div>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs">
                  {application.status}
                </span>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm text-gray-500">
                  Update status
                </p>

                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateStatus(
                          application.id,
                          status
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-xs transition ${
                        application.status === status
                          ? "border-brand-10 bg-brand-10 text-brand"
                          : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}>
                    
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
