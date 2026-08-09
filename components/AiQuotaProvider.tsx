"use client";

import { createContext, useCallback, useContext, useState } from "react";
import AiQuotaToast from "@/components/AiQuotaToast";

type AiQuotaContextValue = {
  showQuotaToast: () => void;
};

const AiQuotaContext = createContext<AiQuotaContextValue | null>(null);

export function AiQuotaProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const showQuotaToast = useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <AiQuotaContext.Provider value={{ showQuotaToast }}>
      {children}
      {visible ? (
        <AiQuotaToast
          message="AI quota is full for today. Please come back tomorrow."
          onClose={() => setVisible(false)}
        />
      ) : null}
    </AiQuotaContext.Provider>
  );
}

export function useAiQuota() {
  const context = useContext(AiQuotaContext);

  if (!context) {
    throw new Error("useAiQuota must be used within AiQuotaProvider");
  }

  return context;
}
