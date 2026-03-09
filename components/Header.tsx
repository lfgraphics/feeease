"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
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
    // Features link removed as requested
    { name: "Contact", href: "/contactus" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
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
          <span className="text-xl font-bold text-foreground">FeeEase</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
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
                className="text-muted-foreground hover:text-primary font-medium px-4 py-2 transition-colors border border-input rounded-full hover:border-primary"
              >
                Login
              </Link>
              <Link
                href="/get-started"
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            className="p-2 text-muted-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-background absolute w-full left-0 p-4 shadow-lg flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-lg font-medium ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-border" />
          {session ? (
             <div className="flex flex-col gap-2">
                <div className="px-2 py-1">
                    <p className="font-medium text-foreground">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                </div>
                <Link href="/portal" className="text-lg font-medium text-muted-foreground">Dashboard</Link>
                <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-lg font-medium text-destructive text-left"
                >
                    Log out
                </button>
             </div>
          ) : (
            <div className="flex flex-col gap-3">
                <Link
                href="/login"
                className="text-center text-muted-foreground font-medium px-4 py-2 border border-input rounded-lg"
                >
                Login
                </Link>
                <Link
                href="/get-started"
                className="text-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
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
