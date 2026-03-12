import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Check, X } from "lucide-react";
import Link from "next/link";

import { CopyButton, ChangePasswordButton } from "@/components/SchoolProfileActions";
import { getSchoolByEmail } from "@/actions/schools";
import { SchoolBilling } from "@/components/school/SchoolBilling";
import { SCHOOL_FEATURES } from "@/lib/features";

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

  if (!session.user.email) {
    return <div>User email not found</div>;
  }

  const school = await getSchoolByEmail(session.user.email);

  if (!school) {
    return <div>School not found</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">School Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your school&apos;s information and subscription details.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* School Details Card - Spans 2 columns on large screens */}
        <Card className="md:col-span-2 lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-muted/30 border-b pb-8">
             <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative h-24 w-24 shrink-0 rounded-xl border bg-background p-2 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={school.logo} 
                    alt={school.name} 
                    className="h-full w-full object-contain" 
                  />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold wrap-break-word leading-tight">{school.name}</h2>
                    {school.shortName && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {school.shortName}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground flex items-start gap-2 text-sm">
                    {school.address}
                  </p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                {school.deployment?.publicAppUrl && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Public Application URL</span>
                    <div className="flex items-center gap-2 p-3 rounded-md bg-primary/5 border border-primary/10">
                        <Link 
                          href={school.deployment.publicAppUrl} 
                          target="_blank" 
                          className="text-sm font-semibold text-primary hover:underline truncate flex-1"
                        >
                          {school.deployment.publicAppUrl}
                        </Link>
                        <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                  </div>
                )}
                
                {school.license && school.license.licenseKey && (
                    <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">License Key</span>
                        <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted border border-border">
                            <code className="text-xs md:text-lg font-mono font-semibold text-foreground truncate flex-1">
                                {school.license.licenseKey}
                            </code>
                            <CopyButton text={school.license.licenseKey} />
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3 pt-4 border-t">
                <h3 className="text-sm font-semibold text-foreground">Active Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SCHOOL_FEATURES.map((feature) => {
                        const isEnabled = school.features?.[feature.id];
                        return (
                            <div key={feature.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border">
                                <span className="text-sm font-medium text-muted-foreground">{feature.label}</span>
                                {isEnabled ? (
                                    <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                        <Check className="h-3 w-3 mr-1" /> Active
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-muted-foreground bg-muted/50">
                                        <X className="h-3 w-3 mr-1" /> Inactive
                                    </Badge>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
             <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase">Current Plan</span>
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{school.subscription.plan}</span>
                    <Badge variant={school.subscription.status === 'active' ? 'default' : 'secondary'}>
                        {school.subscription.status}
                    </Badge>
                </div>
             </div>
             
             {school.subscription.expiryDate && (
                 <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase">Expires On</span>
                    <div className="font-medium">
                        {new Date(school.subscription.expiryDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                 </div>
             )}
          </CardContent>
        </Card>

        {/* Admin Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <span className="text-xs font-medium text-muted-foreground">Name</span>
              <p className="font-medium">{school.adminName}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-xs font-medium text-muted-foreground">Email</span>
              <p className="font-medium break-all">{school.adminEmail}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-xs font-medium text-muted-foreground">Mobile</span>
              <p className="font-medium">{school.adminMobile}</p>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Manage your account password and security settings.
                    </p>
                    <ChangePasswordButton />
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Financials & Billing</h2>
          <SchoolBilling 
            schoolId={school._id.toString()}
            financials={JSON.parse(JSON.stringify(school.financials || {}))}
            initialSubscription={JSON.parse(JSON.stringify(school.subscription || {}))}
          />
      </div>
    </div>
  );
}
