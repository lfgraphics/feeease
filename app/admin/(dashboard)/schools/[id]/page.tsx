import { notFound } from "next/navigation";
import { LicenseManager } from "@/components/admin/LicenseManager";
import { DeploymentManager } from "@/components/admin/DeploymentManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { getSchoolById } from "@/actions/schools";

export default async function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const school = await getSchoolById(id);

  if (!school) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/schools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Schools
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex gap-6">
                <div className="relative h-24 w-24 flex-shrink-0 rounded-xl border bg-background p-2 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                    src={school.logo} 
                    alt={school.name} 
                    className="h-full w-full object-contain" 
                    />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight leading-tight">{school.name}</h1>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                        <Badge variant="outline" className="font-mono text-xs">ID: {school._id.toString()}</Badge>
                        {school.shortName && <Badge variant="secondary">{school.shortName}</Badge>}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-3 self-start">
                 <Badge variant={school.subscription.status === 'active' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                    {school.subscription.status}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                    {school.subscription.plan} Plan
                </Badge>
            </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* School Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>School Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> Address
                    </span>
                    <p className="text-sm">{school.address}</p>
                </div>
                
                {school.deployment?.publicAppUrl && (
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <ExternalLink className="h-3 w-3" /> Public URL
                        </span>
                        <Link 
                            href={school.deployment.publicAppUrl} 
                            target="_blank" 
                            className="text-sm text-primary hover:underline truncate block font-medium"
                        >
                            {school.deployment.publicAppUrl}
                        </Link>
                    </div>
                )}
            </div>
            
            <div className="space-y-2 pt-4 border-t">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Enabled Features</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(school.features || {}).map(([key, value]) => (
                    value && <Badge key={key} variant="secondary" className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Badge>
                  ))}
                  {!Object.values(school.features || {}).some(Boolean) && <span className="text-sm text-muted-foreground italic">No specific features enabled</span>}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Contact Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Admin Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-xs">{school.adminName.charAt(0)}</span>
                </div>
                <div>
                    <p className="font-medium text-sm">{school.adminName}</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
            </div>
            
            <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{school.adminMobile}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="break-all">{school.adminEmail || "N/A"}</span>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* License Manager */}
        <div className="md:col-span-2 lg:col-span-3">
          <LicenseManager
            schoolId={school._id.toString()}
            initialLicense={JSON.parse(JSON.stringify(school.license || {}))}
            initialSubscription={JSON.parse(JSON.stringify(school.subscription || {}))}
            initialFeatures={JSON.parse(JSON.stringify(school.features || {}))}
          />
        </div>

        {/* Deployment Info */}
        <div className="md:col-span-2 lg:col-span-3">
          <DeploymentManager
            schoolId={school._id.toString()}
            initialDeployment={school.decryptedDeployment}
          />
        </div>

      </div>
    </div>
  );
}
