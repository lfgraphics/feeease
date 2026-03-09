import { notFound } from "next/navigation";
import { LicenseManager } from "@/components/admin/LicenseManager";
import { DeploymentManager } from "@/components/admin/DeploymentManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSchoolById } from "@/actions/schools";

export default async function SchoolDetailPage({ params }: { params: { id: string } }) {
  const school = await getSchoolById(params.id);

  if (!school) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/schools" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={school.logo} alt={school.name} className="w-12 h-12 object-contain rounded border bg-white" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{school.name}</h1>
                <p className="text-sm text-muted-foreground">{school._id.toString()}</p>
            </div>
        </div>
        <Badge variant={school.subscription.status === 'active' ? 'default' : 'secondary'}>
          {school.subscription.status}
        </Badge>
        <Badge variant="outline">{school.subscription.plan}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* School Info */}
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Short Name</span>
                <p>{school.shortName || "-"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Address</span>
                <p>{school.address}</p>
              </div>
              <div className="col-span-2">
                  <span className="text-sm font-medium text-muted-foreground">Features</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(school.features || {}).map(([key, value]) => (
                          value && <Badge key={key} variant="secondary" className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Badge>
                      ))}
                      {!Object.values(school.features || {}).some(Boolean) && <span className="text-sm text-muted-foreground">None</span>}
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Info */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Name</span>
                <p>{school.adminName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Mobile</span>
                <p>{school.adminMobile}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <p>{school.adminEmail || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Manager */}
        <div className="md:col-span-2">
          <LicenseManager 
            schoolId={school._id.toString()} 
            initialLicense={JSON.parse(JSON.stringify(school.license || {}))} 
            initialSubscription={JSON.parse(JSON.stringify(school.subscription || {}))}
            initialFeatures={JSON.parse(JSON.stringify(school.features || {}))}
          />
        </div>
        
        {/* Deployment Info */}
        <div className="md:col-span-2">
            <DeploymentManager 
                schoolId={school._id.toString()}
                initialDeployment={school.decryptedDeployment}
            />
        </div>

      </div>
    </div>
  );
}
