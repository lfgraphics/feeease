import dbConnect from "@/lib/db";
import School from "@/models/School";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School as SchoolIcon, CheckCircle, AlertCircle, Clock, CalendarDays, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { addDays, format, isBefore, startOfDay } from "date-fns";

export default async function AdminDashboard() {
  await dbConnect();
  
  const today = startOfDay(new Date());
  const next7Days = addDays(today, 7);
  const next30Days = addDays(today, 30);

  const totalSchools = await School.countDocuments();
  const activeSchools = await School.countDocuments({ "subscription.status": "active" });
  const trialSchools = await School.countDocuments({ "subscription.status": "trial" });
  const pendingDeployments = await School.countDocuments({ "deployment.status": "pending" });

  // Fetch expiring licenses
  const expiringTomorrow = await School.find({
    "license.expiresAt": { 
      $gte: today, 
      $lt: addDays(today, 2) // Within next 48 hours effectively covers "tomorrow"
    }
  }).select("name license.expiresAt _id");

  const expiringWeek = await School.find({
    "license.expiresAt": { 
      $gte: today, 
      $lt: next7Days 
    }
  }).select("name license.expiresAt _id");

  const expiringMonth = await School.find({
    "license.expiresAt": { 
      $gte: today, 
      $lt: next30Days 
    }
  }).select("name license.expiresAt _id");

  function ExpiryList({ schools, title, icon: Icon, color }: { schools: any[], title: string, icon: any, color: string }) {
    if (schools.length === 0) return null;
    
    return (
      <Card className="col-span-full md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">{schools.length}</div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {schools.map((school) => (
              <div key={school._id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[120px]" title={school.name}>{school.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(school.license.expiresAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <Link href={`/admin/schools/${school._id}`}>
                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <SchoolIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchools}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSchools}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Schools</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialSchools}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deployments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeployments}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ExpiryList 
            schools={expiringTomorrow} 
            title="Expiring Soon (48h)" 
            icon={AlertCircle} 
            color="text-red-600" 
        />
        <ExpiryList 
            schools={expiringWeek} 
            title="Expiring this Week" 
            icon={CalendarDays} 
            color="text-orange-500" 
        />
        <ExpiryList 
            schools={expiringMonth} 
            title="Expiring this Month" 
            icon={CalendarDays} 
            color="text-yellow-500" 
        />
      </div>
    </div>
  );
}
