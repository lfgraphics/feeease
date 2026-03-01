import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";


const inter = Inter({ subsets: ["latin"] });

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
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback="loading.....">
        {children}
        </Suspense>
      </body>
    </html>
  );
}
