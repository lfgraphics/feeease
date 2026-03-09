"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      if (session.user.role.includes("admin")) {
        router.push("/admin");
      } else if (session.user.role === "school_owner") {
        router.push("/school/profile");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500">Redirecting...</p>
      </div>
    </div>
  );
}
