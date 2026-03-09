"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Contact", href: "/contactus" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/images/assets/logo.jpeg"
              alt="FeeEase Logo"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <span className="text-xl font-bold text-slate-900">FeeEase</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === link.href ? "text-blue-600" : "text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100">
                     <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/portal">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <Link
                href="/login"
                className="text-slate-700 hover:text-blue-600 font-medium px-4 py-2 transition-colors border border-slate-200 rounded-full hover:border-blue-600"
              >
                Login
              </Link>
              <Link
                href="/get-started"
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white absolute w-full left-0 p-4 shadow-lg flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-lg font-medium ${
                pathname === link.href ? "text-blue-600" : "text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr />
          {session ? (
             <div className="flex flex-col gap-2">
                <div className="px-2 py-1">
                    <p className="font-medium">{session.user?.name}</p>
                    <p className="text-xs text-slate-500">{session.user?.email}</p>
                </div>
                <Link href="/portal" className="text-lg font-medium text-slate-600">Dashboard</Link>
                <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-lg font-medium text-red-500 text-left"
                >
                    Log out
                </button>
             </div>
          ) : (
            <div className="flex flex-col gap-3">
                <Link
                href="/login"
                className="text-center text-slate-700 font-medium px-4 py-2 border border-slate-200 rounded-lg"
                >
                Login
                </Link>
                <Link
                href="/get-started"
                className="text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                Get Started
                </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
