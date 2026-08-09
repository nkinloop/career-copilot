"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  url: string | null;
  source: string | null;
  createdAt: string;
  jobSkills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    url: "",
    source: "Manual",
  });

  async function fetchJobs(
    searchValue = search,
    locationValue = location
  ) {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }

      if (locationValue.trim()) {
        params.set("location", locationValue.trim());
      }

      const queryString = params.toString();

      const response = await fetch(
        queryString
          ? `/api/jobs?${queryString}`
          : "/api/jobs"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      setJobs(data);
    } catch (error) {
      console.error(
        "Failed to load jobs:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs("", "");
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSearch(
    event: React.FormEvent
  ) {
    event.preventDefault();

    await fetchJobs(search, location);
  }

  async function clearFilters() {
    setSearch("");
    setLocation("");

    await fetchJobs("", "");
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!form.title.trim() || !form.company.trim()) {
      alert(
        "Job title and company are required."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            title: form.title.trim(),
            company: form.company.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create job"
        );
      }

      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
        url: "",
        source: "Manual",
      });

      setShowForm(false);

      // Refresh jobs while keeping current filters
      await fetchJobs(search, location);
    } catch (error) {
      console.error(
        "Failed to create job:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create job."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}

      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--brand)]">
            Career opportunities
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Jobs
          </h1>

          <p className="mt-2 text-gray-400">
            Find opportunities that match your
            skills and career goals.
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm((previous) => !previous)
          }
          className="w-fit rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium backdrop-blur-xl transition hover:bg-white/20"
        >
          {showForm ? "Close" : "+ Add Job"}
        </button>
      </section>

      {/* Search & Filters */}

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]"
        >
          <div>
            <label className="text-sm text-gray-400">
              Search
            </label>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Job title, company, skills..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Location
            </label>

            <input
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="e.g. Bangalore, Remote"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-white/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="self-end rounded-xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Searching..."
              : "🔍 Search"}
          </button>

          <button
            type="button"
            onClick={clearFilters}
            disabled={
              loading ||
              (!search && !location)
            }
            className="self-end rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
        </form>
      </section>

      {/* Add Job Form */}

      {showForm && (
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold">
            Add a new job
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Save a job opportunity to your Career
            Copilot workspace.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="text-sm text-gray-300">
                Job title *
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Company *
              </label>

              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Source
              </label>

              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                placeholder="e.g. LinkedIn"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-white/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">
                Job URL
              </label>

              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-white/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Paste or write the job description..."
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-white/30"
              />
            </div>

            <div className="flex justify-end md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Job"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Jobs */}

      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {search || location
              ? "Search Results"
              : "All Jobs"}
          </h2>

          {!loading && (
            <span className="text-sm text-gray-500">
              {jobs.length} job
              {jobs.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-gray-400">
              Loading jobs...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <h2 className="text-xl font-semibold">
              No jobs found
            </h2>

            <p className="mt-2 text-gray-400">
              Try changing your search or location
              filters.
            </p>

            {(search || location) && (
              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm transition hover:bg-white/20"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {job.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      {job.company}
                    </p>
                  </div>

                  {job.source && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                      {job.source}
                    </span>
                  )}
                </div>

                {job.location && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                    {job.location}
                  </p>
                )}

                {job.description && (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                    {job.description}
                  </p>
                )}

                {job.jobSkills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.jobSkills
                      .slice(0, 4)
                      .map((jobSkill) => (
                        <span
                          key={jobSkill.skill.id}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400"
                        >
                          {jobSkill.skill.name}
                        </span>
                      ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(
                      job.createdAt
                    ).toLocaleDateString()}
                  </span>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
                  >
                    View Job →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}