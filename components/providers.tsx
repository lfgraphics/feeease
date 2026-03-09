"use client";

import { SessionProvider } from "next-auth/react";
import { ConfirmProvider } from "@/context/ConfirmDialogContext";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ConfirmProvider>
        {children}
        <Toaster />
      </ConfirmProvider>
    </SessionProvider>
  );
}
