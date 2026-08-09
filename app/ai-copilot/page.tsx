"use client";

import { useState } from "react";
import { useAiQuota } from "@/components/AiQuotaProvider";
import { AI_QUOTA_MESSAGE, isQuotaExceededResponse } from "@/lib/ai-errors";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Am I ready for my target job?",
  "What skills should I learn next?",
  "How can I improve my job match?",
  "How should I prepare for interviews?",
];

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm your Career Copilot. Ask me anything about your skills, jobs, resume, interviews, or career roadmap.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { showQuotaToast } = useAiQuota();

  async function sendMessage(message?: string) {
    const text = (message ?? input).trim();

    if (!text || loading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 || isQuotaExceededResponse(data)) {
          showQuotaToast();
          return;
        }

        throw new Error(
          data.error || "Failed to get AI response"
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("AI Copilot error:", error);

      if (error instanceof Error && error.message === AI_QUOTA_MESSAGE) {
        showQuotaToast();
        return;
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Sorry, I couldn't process your request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <main className="mx-auto max-w-5xl">
      {/* Header */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <p className="text-sm font-medium text-[var(--brand)]">
          AI Career Assistant
        </p>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          AI Copilot
        </h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Your personal AI assistant for jobs, skills, resumes,
          interviews, and career planning.
        </p>
      </section>

      {/* Suggestions */}
      <section className="mt-6">
        <p className="mb-3 text-sm text-gray-500">
          Try asking
        </p>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => sendMessage(suggestion)}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      {/* Chat */}
      <section className="mt-6 flex min-h-[550px] flex-col rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-7 ${
                  message.role === "user"
                    ? "bg-brand-10 text-brand-weak"
                    : "border border-white/10 bg-black/20 text-gray-300"
                }`}
              >
                <div className="mb-1 text-xs font-medium text-gray-500">
                  {message.role === "user"
                    ? "You"
                    : "Career Copilot"}
                </div>

                <p className="whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-gray-400">
                <div className="mb-1 text-xs text-gray-500">
                  Career Copilot
                </div>

                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-white/10 p-4"
        >
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask your Career Copilot..."
              disabled={loading}
              className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/20 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}