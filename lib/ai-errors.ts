export const AI_QUOTA_MESSAGE =
  "AI quota is full for today. Please come back tomorrow.";

function normalizeErrorText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Error) {
    return value.message;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.message === "string") {
      return record.message;
    }

    if (typeof record.error === "string") {
      return record.error;
    }

    if (record.details && typeof record.details === "object") {
      const details = record.details as Record<string, unknown>;

      if (typeof details.message === "string") {
        return details.message;
      }

      if (typeof details.error === "string") {
        return details.error;
      }
    }

    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  return "";
}

export function isGeminiQuotaError(error: unknown): boolean {
  const errorRecord = (error as Record<string, unknown> | undefined) ?? {};
  const responseRecord =
    errorRecord.response && typeof errorRecord.response === "object"
      ? (errorRecord.response as Record<string, unknown>)
      : undefined;

  const errorText = normalizeErrorText(error).toLowerCase();
  const responseText = normalizeErrorText(
    responseRecord?.body ?? errorRecord.body ?? errorRecord.details
  ).toLowerCase();
  const combined = `${errorText} ${responseText}`;
  const status =
    errorRecord.status ?? errorRecord.code ?? responseRecord?.status;

  return (
    status === 429 ||
    /resource_exhausted|quota exceeded|free_tier|retrydelay|retry delay|rate limit|429/.test(
      combined
    )
  );
}

export function isQuotaExceededResponse(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const data = payload as Record<string, unknown>;
  const errorCode =
    typeof data.error === "string" ? data.error.toLowerCase() : "";
  const message =
    typeof data.message === "string" ? data.message.toLowerCase() : "";

  return (
    errorCode === "ai_quota_exceeded" ||
    message.includes("quota exceeded") ||
    message.includes("ai quota is full") ||
    message.includes("free_tier") ||
    errorCode.includes("quota exceeded")
  );
}

export function getQuotaErrorResponse() {
  return {
    error: "AI_QUOTA_EXCEEDED",
    message: AI_QUOTA_MESSAGE,
  };
}
