import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, School as SchoolIcon, Key, Settings, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // Strict Role Check
  if (!session.user.role?.includes("admin")) {
    redirect("/portal"); // Redirect unauthorized users (like school_owners) to their portal
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card text-foreground">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold">FeeEase Admin</h1>
        <p className="text-xs text-muted-foreground mt-1">Central Control Panel</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link href="/admin/schools" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <SchoolIcon size={20} />
          <span>Schools</span>
        </Link>
        
        <Link href="/admin/licenses" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Key size={20} />
          <span>Licenses</span>
        </Link>

        <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Users size={20} />
          <span>Users</span>
        </Link>

        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-foreground">
            {session.user?.name?.[0] || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{session.user?.name}</p>
            <p className="text-xs truncate">{session.user?.email}</p>
          </div>
        </div>
        <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2 mt-2 text-destructive hover:text-destructive/80 text-sm">
          <LogOut size={16} />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-border bg-card flex items-center justify-between shrink-0">
         <Sheet>
           <SheetTrigger asChild>
             <Button variant="ghost" size="icon">
               <Menu className="h-6 w-6" />
               <span className="sr-only">Toggle menu</span>
             </Button>
           </SheetTrigger>
           <SheetContent side="left" className="p-0 w-64 border-r border-border">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <SidebarContent />
           </SheetContent>
         </Sheet>
         <h1 className="font-bold text-lg">FeeEase Admin</h1>
         <div className="w-10"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card text-foreground flex-col flex-shrink-0 border-r border-border">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
