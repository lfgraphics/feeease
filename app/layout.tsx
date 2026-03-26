import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import PublicLayout from "@/components/PublicLayout";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.feeease.com'),
  title: {
    default: "FeeEase - Complete School Management Solution",
    template: "%s | FeeEase"
  },
  description: "FeeEase - A responsive and powerful school management software for fees, attendance, staff, and more.",
  keywords: ["School Management", "Fee Collection", "Expense Tracking", "Attendance System", "Salary management", "Staff Administration", "Student Records"],
  authors: [{ name: "FeeEase Team" }],
  creator: "FeeEase Team",
  publisher: "FeeEase",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.feeease.com",
    siteName: "FeeEase",
    title: "FeeEase - Complete School Management Solution",
    description: "Manage your entire school ecosystem with FeeEase. Fees, expenses, attendance, salaries, and more.",
    images: [
      {
        url: '/images/assets/logo-horizontal.png',
        width: 1200,
        height: 630,
        alt: 'FeeEase - Complete School Management',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FeeEase - Complete School Management Solution",
    description: "Manage your entire school ecosystem with FeeEase. Fees, expenses, attendance, salaries, and more.",
    images: ['/images/assets/logo-horizontal.png'],
    creator: "@feeease",
  },
  icons: {
    icon: [
      { url: "/images/assets/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/assets/favicon/favicon.ico" },
    ],
    shortcut: "/images/assets/favicon/favicon.ico",
    apple: "/images/assets/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/images/assets/favicon/apple-touch-icon.png",
      },
    ],
  },
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
