"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function InitPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleInit() {
    setLoading(true);
    try {
      const res = await fetch("/api/init", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || data.message || "Failed to initialize");
      }
    } catch (e) {
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Initialize FeeEase System</CardTitle>
          <CardDescription>Create default super admin account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleInit} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initialize System"}
          </Button>
          {message && (
            <div className="p-4 rounded bg-slate-100 text-sm text-center">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
