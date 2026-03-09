"use client";

import { SessionProvider } from "next-auth/react";
import { ConfirmProvider } from "@/context/ConfirmDialogContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ConfirmProvider>
          {children}
          <Toaster />
        </ConfirmProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
