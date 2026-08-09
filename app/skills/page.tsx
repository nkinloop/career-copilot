"use client";

import { useEffect, useState } from "react";

type Skill = {
  id: string;
  name: string;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const skillsApi = "/api/users/me/skills";

  async function fetchSkills() {
    try {
      const response = await fetch(skillsApi);

      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const data = await response.json();

      setSkills(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load skills.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  async function addSkill(event: React.FormEvent) {
    event.preventDefault();

    const skillName = name.trim();

    if (!skillName) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(skillsApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: skillName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add skill"
        );
      }

      setSkills((current) => {
        if (current.some((skill) => skill.id === data.id)) {
          return current;
        }

        return [...current, data];
      });

      setName("");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to add skill"
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeSkill(skillId: string) {
    setError("");

    try {
      const response = await fetch(
        `${skillsApi}?skillId=${skillId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error || "Failed to remove skill"
        );
      }

      setSkills((current) =>
        current.filter((skill) => skill.id !== skillId)
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove skill"
      );
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <section>
        <p className="text-sm font-medium text-[var(--brand)]">
          Career profile
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          My Skills
        </h1>

        <p className="mt-2 text-gray-400">
          Add the skills you currently have so Career
          Copilot can match you with relevant jobs.
        </p>
      </section>

      <form
        onSubmit={addSkill}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React, Python, SQL..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-white/20"
        />

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium transition hover:bg-white/20 disabled:opacity-50"
        >
          {saving ? "Adding..." : "+ Add Skill"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Your Skills
          </h2>

          <span className="text-sm text-gray-500">
            {skills.length} skills
          </span>
        </div>

        {loading ? (
          <p className="mt-6 text-gray-500">
            Loading skills...
          </p>
        ) : skills.length === 0 ? (
          <p className="mt-6 text-gray-500">
            No skills added yet.
          </p>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"
              >
                <span className="text-sm text-gray-300">
                  {skill.name}
                </span>

                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="text-gray-500 transition hover:text-red-400"
                  title={`Remove ${skill.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
