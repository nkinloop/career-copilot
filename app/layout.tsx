import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AiQuotaProvider } from "@/components/AiQuotaProvider";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Career Copilot",
  description: "Your AI-powered career assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <AuthSessionProvider>
              <ThemeProvider>
                <AiQuotaProvider>
                  <AppShell>
                    {children}
                  </AppShell>
                </AiQuotaProvider>
              </ThemeProvider>
            </AuthSessionProvider>
      </body>
    </html>
  );
}