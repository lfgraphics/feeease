"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import Footer from "./Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide Header/Footer for admin routes
  const isPrivate = pathname?.startsWith("/admin");

  if (isPrivate) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
