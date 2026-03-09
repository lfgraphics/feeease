import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, School as SchoolIcon, Key, Settings, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">FeeEase Admin</h1>
          <p className="text-xs text-slate-400 mt-1">Central Control Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link href="/admin/schools" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <SchoolIcon size={20} />
            <span>Schools</span>
          </Link>
          
          <Link href="/admin/licenses" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Key size={20} />
            <span>Licenses</span>
          </Link>

          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Users size={20} />
            <span>Users</span>
          </Link>

          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
              {session.user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{session.user?.name}</p>
              <p className="text-xs truncate">{session.user?.email}</p>
            </div>
          </div>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2 mt-2 text-red-400 hover:text-red-300 text-sm">
            <LogOut size={16} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
