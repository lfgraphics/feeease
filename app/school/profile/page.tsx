import dbConnect from "@/lib/db";
import School from "@/models/School";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { CopyButton, LogoutButton, ChangePasswordButton } from "@/components/SchoolProfileActions";

export default async function SchoolProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Double check role
  if (session.user.role !== "school_owner") {
    // If admin tries to access, maybe redirect to admin?
    if (session.user.role.includes("admin")) {
        redirect("/admin");
    }
    redirect("/");
  }

  await dbConnect();
  const school = await School.findOne({ adminEmail: session.user.email });

  if (!school) {
    return <div>School not found</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My School Account</h1>
        <LogoutButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>School Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={school.logo} alt={school.name} className="w-16 h-16 object-contain rounded border" />
              <div>
                <h3 className="font-bold text-lg">{school.name}</h3>
                <p className="text-sm text-slate-500">{school.shortName}</p>
              </div>
            </div>
            
            {school.deployment?.publicAppUrl && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                <span className="font-medium text-xs text-blue-800 uppercase tracking-wide block mb-1">Your App URL</span>
                <Link 
                  href={school.deployment.publicAppUrl} 
                  target="_blank" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold break-all"
                >
                  {school.deployment.publicAppUrl}
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </Link>
              </div>
            )}

            <div>
              <span className="font-medium text-sm text-slate-500">Address</span>
              <p>{school.address}</p>
            </div>
            {school.license && school.license.licenseKey && (
                <div className="pt-2 border-t mt-2">
                    <span className="font-medium text-sm text-slate-500 block mb-1">License Key</span>
                    <div className="flex items-center bg-slate-100 p-2 rounded text-xs font-mono break-all">
                        <span className="truncate text-base font-bold text-blue-600">{school.license.licenseKey}</span>
                        <CopyButton text={school.license.licenseKey} />
                    </div>
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-medium text-sm text-slate-500">Name</span>
              <p>{school.adminName}</p>
            </div>
            <div>
              <span className="font-medium text-sm text-slate-500">Email</span>
              <p>{school.adminEmail}</p>
            </div>
            <div>
              <span className="font-medium text-sm text-slate-500">Mobile</span>
              <p>{school.adminMobile}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="font-medium">Plan</span>
                <Badge>{school.subscription.plan}</Badge>
             </div>
             <div className="flex items-center justify-between">
                <span className="font-medium">Status</span>
                <Badge variant={school.subscription.status === 'active' ? 'default' : 'secondary'}>
                    {school.subscription.status}
                </Badge>
             </div>
             {school.subscription.expiryDate && (
                 <div className="flex items-center justify-between">
                    <span className="font-medium">Expires On</span>
                    <span>{new Date(school.subscription.expiryDate).toLocaleDateString()}</span>
                 </div>
             )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500 mb-4">Update your account security settings.</p>
                <ChangePasswordButton />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
