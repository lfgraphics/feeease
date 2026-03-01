import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FeeEase - Complete School Management",
  description: "FeeEase - A responsive and powerful school management software for fees, attendance, staff, and more.",
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
