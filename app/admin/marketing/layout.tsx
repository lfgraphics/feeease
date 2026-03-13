import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, LogOut, Menu, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "marketing") {
    redirect("/admin/login");
  }

  const NavContent = () => (
    <div className="flex flex-col h-full bg-card text-foreground">
      <div className="p-4 sm:p-6 border-b border-border">
        <h1 className="text-lg sm:text-xl font-bold">FeeEase</h1>
        <p className="text-xs text-muted-foreground mt-1">Marketing Partner</p>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
        <Link
          href="/admin/marketing/dashboard"
          className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
        >
          <BarChart3 size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/marketing/schools-queries"
          className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
        >
          <MessageSquare size={20} />
          <span>School Queries</span>
        </Link>
      </nav>

      <div className="p-3 sm:p-4 border-t border-border">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-muted-foreground">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground shrink-0">
            {session.user?.name?.[0] || "M"}
          </div>
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="text-xs sm:text-sm font-medium truncate text-foreground">{session.user?.name}</p>
            <p className="text-xs truncate">{session.user?.email}</p>
          </div>
        </div>
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 mt-2 text-destructive hover:text-destructive/80 text-xs sm:text-sm rounded-lg hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden flex-col">
      {/* Mobile Header */}
      <div className="md:hidden p-3 sm:p-4 border-b border-border bg-card flex items-center justify-between shrink-0 gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r border-border">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
        <h1 className="font-bold text-base sm:text-lg flex-1">FeeEase</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground">
                {session.user?.name?.[0] || "M"}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-4 py-2 text-sm font-medium text-foreground border-b">
              {session.user?.name}
            </div>
            <div className="px-4 py-1 text-xs text-muted-foreground border-b">
              {session.user?.email}
            </div>
            <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive">
              <Link href="/api/auth/signout" className="flex items-center gap-2">
                <LogOut size={16} />
                <span>Sign Out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-card text-foreground flex-col flex-shrink-0 border-r border-border">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
