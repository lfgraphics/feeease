import { notFound, redirect } from "next/navigation";
import { LicenseManager } from "@/components/admin/LicenseManager";
import { DeploymentManager } from "@/components/admin/DeploymentManager";
import { SchoolFinancials } from "@/components/admin/SchoolFinancials";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin, ShieldAlert, Calendar } from "lucide-react";
import { format } from "date-fns";
import { getSchoolById } from "@/actions/schools";
import { getSchoolPayments } from "@/actions/finances";
import { getAdminSchoolReferralData } from "@/actions/offers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SCHOOL_FEATURES } from "@/lib/features";
import { WhatsAppUsageManager } from "@/components/admin/WhatsAppUsageManager";
import { getWhatsAppUsage } from "@/actions/whatsapp-usage";
import { SchoolReferralSection } from "@/components/school/SchoolReferralSection";
import { DNSManager } from "@/components/admin/DNSManager";
import { SchoolStorageStats } from "@/components/school/SchoolStorageStats";

export default async function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const school = await getSchoolById(id);
    const payments = await getSchoolPayments(id);
    const session = await getServerSession(authOptions);
    const whatsappUsage = await getWhatsAppUsage(id);
    let schoolReferralData: any = null;
    try {
        schoolReferralData = await getAdminSchoolReferralData(id);
    } catch {
        schoolReferralData = null;
    }

    if (!school) {
        notFound();
    }

    // Permissions Logic
    const role = session?.user?.role;
    const isSuperAdmin = role === 'super_admin';
    const isOperationsAdmin = role === 'operations_admin';
    const isMarketing = role === 'marketing';

    const referredByMe = school.referral?.referredBy?.toString() === session?.user?.id;

    const canViewCredentials = isSuperAdmin || isOperationsAdmin;
    const canEditFinancials = isSuperAdmin || isOperationsAdmin || (isMarketing && referredByMe);
    const canViewFinancials = canEditFinancials;

    // Access Control: If marketing user and not referred by them, deny access
    if (isMarketing && !referredByMe) {
        redirect('/admin/marketing/dashboard');
    }

    return (
        <div className="container mx-auto py-3 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:gap-4">
                <Link href="/admin/schools" className="inline-flex items-center text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Schools
                </Link>

                <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 flex-1">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 shrink-0 rounded-lg sm:rounded-xl border bg-background p-2 shadow-sm mx-auto sm:mx-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={school.logo}
                                alt={school.name}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="space-y-2 text-center sm:text-left flex-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-snug">{school.name}</h1>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2 items-center text-xs sm:text-sm text-muted-foreground">
                                <Badge variant="outline" className="font-mono text-xs px-2 py-0.5 truncate">ID: {school._id}</Badge>
                                {school.shortName && <Badge variant="secondary" className="text-xs px-2 py-0.5">{school.shortName}</Badge>}
                                <span className="flex items-center gap-1 text-xs border px-1.5 py-0.5 rounded-full bg-muted/50 whitespace-nowrap">
                                    <Calendar className="h-3 w-3 shrink-0" />
                                    <span className="hidden sm:inline">Reg: {format(new Date(school.createdAt), 'dd - MM - yy, yyyy')}</span>
                                    <span className="sm:hidden">Reg: {format(new Date(school.createdAt), 'dd - MM - yy')}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col justify-center sm:justify-start gap-2 self-center sm:self-start w-full sm:w-auto lg:items-end">
                        <div className="flex justify-center flex-row lg:flex-row gap-2 w-full sm:w-auto">
                            <Badge variant={school.subscription.status === 'active' ? 'default' : 'secondary'} className="text-xs px-2 py-1">
                                {school.subscription.status.charAt(0).toUpperCase() + school.subscription.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 py-1">
                                {school.subscription.plan}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                {/* School Info Card */}
                <Card className="sm:col-span-2 lg:col-span-2">
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-lg sm:text-xl">School Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                    <MapPin className="h-3 w-3 shrink-0" /> Address
                                </span>
                                <p className="text-sm wrap-break-word">{school.address || "N/A"}</p>
                            </div>

                            {school.deployment?.publicAppUrl && (
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                        <ExternalLink className="h-3 w-3 shrink-0" /> Public URL
                                    </span>
                                    <Link
                                        href={school.deployment.publicAppUrl}
                                        target="_blank"
                                        className="text-xs sm:text-sm text-primary hover:underline break-all font-medium"
                                    >
                                        {school.deployment.publicAppUrl}
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 pt-3 sm:pt-4 border-t">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Enabled Features</span>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {Object.entries(school.features || {}).map(([key, value]) => {
                                    if (!value) return null;
                                    const feature = SCHOOL_FEATURES.find(f => f.id === key);
                                    return (
                                        <Badge key={key} variant="secondary" className="capitalize text-xs px-2 py-1">
                                            {feature ? feature.label : key.replace(/([A-Z])/g, ' $1').trim()}
                                        </Badge>
                                    );
                                })}
                                {!Object.values(school.features || {}).some(Boolean) && <span className="text-xs sm:text-sm text-muted-foreground italic">No specific features enabled</span>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Admin Contact Card */}
                <Card className="h-full">
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-lg sm:text-xl">Admin Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <span className="font-bold text-xs">{school.adminName.charAt(0)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">{school.adminName}</p>
                                <p className="text-xs text-muted-foreground">Administrator</p>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 pt-2">
                            <div className="flex items-center gap-3 text-xs sm:text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="break-all">{school.adminMobile}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs sm:text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="break-all">{school.adminEmail || "N/A"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Storage Stats Card */}
                {(isSuperAdmin || isOperationsAdmin) && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <SchoolStorageStats
                            mongoDbUri={school.decryptedDeployment?.mongoDbUri}
                            cloudinary={school.decryptedDeployment?.cloudinaryConfig}
                            title="Infrastructure Consumption"
                            description={`${school.name}'s data & media usage`}
                        />
                    </div>
                )}


                {/* Financials & Referral - Visible to admins and referring marketing staff */}
                {canViewFinancials && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <SchoolFinancials
                            schoolId={school._id.toString()}
                            initialReferral={JSON.parse(JSON.stringify(school.referral || {}))}
                            initialFinancials={JSON.parse(JSON.stringify(school.financials || {}))}
                            initialSubscription={JSON.parse(JSON.stringify(school.subscription || {}))}
                            initialPayments={payments}
                            canEdit={canEditFinancials}
                        />
                    </div>
                )}

                {/* WhatsApp Usage — visible to all admins (not marketing) */}
                {!isMarketing && whatsappUsage && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <WhatsAppUsageManager
                            schoolId={school._id.toString()}
                            initialUsage={whatsappUsage}
                            canEdit={canViewCredentials}
                        />
                    </div>
                )}

                {/* License Manager - Visible to all admins (but maybe not marketing?) */}
                {/* User didn't specify restricted access for License Manager, assuming admins only, which matches current logic */}
                {!isMarketing && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <LicenseManager
                            schoolId={school._id.toString()}
                            initialLicense={JSON.parse(JSON.stringify(school.license || {}))}
                            initialSubscription={JSON.parse(JSON.stringify(school.subscription || {}))}
                            initialFeatures={JSON.parse(JSON.stringify(school.features || {}))}
                        />
                    </div>
                )}

                {/* Deployment Info - Hidden for Support Admin & Marketing */}
                {canViewCredentials && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <DeploymentManager
                            schoolId={school._id.toString()}
                            initialDeployment={school.decryptedDeployment}
                            features={JSON.parse(JSON.stringify(school.features || {}))}
                            workerWebhookSecret={process.env.WORKER_WEBHOOK_SECRET}
                            workerUrl={process.env.FEEEASE_WORKER_URL}
                        />
                    </div>
                )}

                {/* DNS Manager - Visible to admins */}
                {canViewCredentials && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <DNSManager 
                            schoolId={school._id.toString()}
                            shortName={school.shortName || ""}
                            currentPublicUrl={school.deployment?.publicAppUrl}
                            canEdit={canViewCredentials}
                        />
                    </div>
                )}

                {(!canViewCredentials && !isMarketing) && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <Card className="bg-muted/30 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center text-muted-foreground">
                                <ShieldAlert className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 opacity-50" />
                                <h3 className="text-base sm:text-lg font-semibold">Access Restricted</h3>
                                <p className="text-xs sm:text-sm max-w-sm mt-2">
                                    You do not have permission to view deployment credentials and sensitive configuration details.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* School Referral Section */}
                {schoolReferralData && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <h2 className="text-xl font-bold tracking-tight mb-4">Referral Program</h2>
                        <SchoolReferralSection
                            referralCode={schoolReferralData.referralCode}
                            referredSchools={schoolReferralData.referredSchools}
                            offerRewardMonthsRemaining={schoolReferralData.offerRewardMonthsRemaining}
                            offerGrantedAt={schoolReferralData.offerGrantedAt}
                            offersProgress={schoolReferralData.offersProgress}
                            showReferralCode={true}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}
