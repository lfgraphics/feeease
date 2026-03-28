import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School as SchoolIcon, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";
import { getFinanceStats, getExpenses } from "@/actions/finances";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceOverview } from "@/components/admin/FinanceOverview";
import { ExpenseManager } from "@/components/admin/ExpenseManager";
import { ExpirationTables } from "@/components/admin/ExpirationTables";
import { redirect } from "next/navigation";
import { DNSUsageManager } from "@/components/admin/DNSUsageManager";
import { SystemStats } from "@/components/admin/SystemStats";



export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  // Marketing users should not see this dashboard
  if (session?.user?.role === 'marketing') {
      redirect('/admin/marketing/dashboard');
  }

  const stats = await getDashboardStats();

  const isSuperAdmin = session?.user?.role === 'super_admin';
  let financeStats = null;
  let expensesData = null;

  if (isSuperAdmin) {
      try {
          financeStats = await getFinanceStats();
          expensesData = await getExpenses(undefined, 10);
      } catch (e) {
          console.error("Failed to fetch finance stats", e);
      }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expiring">Expirations</TabsTrigger>
          {isSuperAdmin && <TabsTrigger value="finances">Finances</TabsTrigger>}
          {isSuperAdmin && <TabsTrigger value="expenses">Transactions</TabsTrigger>}
          {isSuperAdmin && <TabsTrigger value="dns">Cloudflare DNS</TabsTrigger>}
          {isSuperAdmin && <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>}


        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                    <SchoolIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSchools}</div>
                </CardContent>
                </Card>
                
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeSchools}</div>
                </CardContent>
                </Card>

                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Trial Schools</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground text-yellow-600 dark:text-yellow-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.trialSchools}</div>
                </CardContent>
                </Card>

                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Deployments</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingDeployments}</div>
                </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
             <ExpirationTables 
                expiringTomorrow={stats.expiringTomorrow}
                expiringWeek={stats.expiringWeek}
                expiringMonth={stats.expiringMonth}
             />
        </TabsContent>

        {isSuperAdmin && financeStats && (
            <TabsContent value="finances" className="space-y-4">
                <FinanceOverview stats={financeStats} />
            </TabsContent>
        )}

        {isSuperAdmin && expensesData && (
            <TabsContent value="expenses" className="space-y-4">
                <ExpenseManager 
                    initialExpenses={expensesData.expenses}
                    initialCursor={expensesData.nextCursor}
                />
            </TabsContent>
        )}

        {isSuperAdmin && (
            <TabsContent value="dns" className="space-y-4">
                <DNSUsageManager />
            </TabsContent>
        )}
        
        {isSuperAdmin && (
            <TabsContent value="infrastructure" className="space-y-4">
                <SystemStats />
            </TabsContent>
        )}
      </Tabs>



    </div>
  );
}
