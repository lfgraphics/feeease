import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FeeEase",
  description: "FeeEase - A responsive and powerfull fees management software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback="loadinding.....">
        {children}
        </Suspense>
      </body>
    </html>
  );
}
