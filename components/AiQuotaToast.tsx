"use client";

import { useEffect, useState } from "react";

export type AiQuotaToastProps = {
  message: string;
  onClose: () => void;
};

export default function AiQuotaToast({
  message,
  onClose,
}: AiQuotaToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose();
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed right-4 top-4 z-[100] max-w-sm rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            AI quota notice
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-gray-300">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
          aria-label="Close quota notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
