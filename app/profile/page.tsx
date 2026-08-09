"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Profile = {
  headline: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    headline: "",
    bio: "",
    location: "",
    phone: "",
    linkedin: "",
    github: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(
    field: keyof Profile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProfile(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      setMessage("Profile saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <section>
        <p className="text-sm font-medium text-[var(--brand)]">
          Career profile
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          My Profile
        </h1>

        <p className="mt-2 text-gray-400">
          Keep your professional information updated.
        </p>
      </section>

      <form
        onSubmit={saveProfile}
        className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Professional Headline"
            value={profile.headline || ""}
            placeholder="Frontend Developer"
            onChange={(value) =>
              updateField("headline", value)
            }
          />

          <Field
            label="Location"
            value={profile.location || ""}
            placeholder="Bangalore"
            onChange={(value) =>
              updateField("location", value)
            }
          />

          <Field
            label="Phone"
            value={profile.phone || ""}
            placeholder="+91..."
            onChange={(value) =>
              updateField("phone", value)
            }
          />

          <Field
            label="LinkedIn"
            value={profile.linkedin || ""}
            placeholder="https://linkedin.com/in/..."
            onChange={(value) =>
              updateField("linkedin", value)
            }
          />

          <Field
            label="GitHub"
            value={profile.github || ""}
            placeholder="https://github.com/..."
            onChange={(value) =>
              updateField("github", value)
            }
          />
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-400">
            Bio
          </label>

          <textarea
            value={profile.bio || ""}
            onChange={(e) =>
              updateField("bio", e.target.value)
            }
            rows={6}
            placeholder="Tell employers about yourself..."
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-white/20"
          />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium transition hover:bg-white/20 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {message && (
            <p className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
              {message}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-400">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-white/20"
      />
    </div>
  );
}