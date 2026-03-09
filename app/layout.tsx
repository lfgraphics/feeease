import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import PublicLayout from "@/components/PublicLayout";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://fee-ease.vercel.app'),
  title: "FeeEase - Complete School Management",
  description: "FeeEase - A responsive and powerful school management software for fees, attendance, staff, and more.",
  openGraph: {
    images: '/images/assets/logo.jpeg',
  },
  twitter: {
    images: '/images/assets/logo.jpeg',
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <Suspense fallback="loading.....">
            <PublicLayout>
              {children}
            </PublicLayout>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
