"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Eye, EyeOff, Terminal, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DeploymentManagerProps {
    schoolId: string;
    initialDeployment: any;
}

export function DeploymentManager({ schoolId, initialDeployment }: DeploymentManagerProps) {
    const [loading, setLoading] = useState(false);

    // Deployment Status
    const [status, setStatus] = useState(initialDeployment.status || "pending");
    const [repo, setRepo] = useState(initialDeployment.githubRepo || "");
    const [project, setProject] = useState(initialDeployment.vercelProject || "");
    const [notes, setNotes] = useState(initialDeployment.notes || "");
    const [publicAppUrl, setPublicAppUrl] = useState(initialDeployment.publicAppUrl || "");

    // Credentials
    const [mongoUri, setMongoUri] = useState(initialDeployment.mongoDbUri || "");

    const [gmail, setGmail] = useState(initialDeployment.gmailAccount || { user: "", pass: "" });
    const [cloudinary, setCloudinary] = useState(initialDeployment.cloudinaryConfig || { cloudName: "", apiKey: "", apiSecret: "" });
    const [nextAuth, setNextAuth] = useState(initialDeployment.nextAuth || { secret: "", url: "" });
    const [encryptionKey, setEncryptionKey] = useState(initialDeployment.encryptionKey || "");
    const [licenseCookieSecret, setLicenseCookieSecret] = useState(initialDeployment.licenseCookieSecret || "");
    const [aiSensy, setAiSensy] = useState(initialDeployment.aiSensy || { apiKey: "" });
    const [triggerDev, setTriggerDev] = useState(initialDeployment.triggerDev || { apiKey: "", projectId: "" });

    const [waTemplates, setWaTemplates] = useState(initialDeployment.whatsappTemplates || {
        receipt: "receipt_pdf",
        reminderHindi: "fee_reminder_hindi",
        reminderEnglish: "fee_reminder_english",
        reminderUrdu: "fee_reminder_urdu"
    });

    // Visibility Toggles
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

    // Modal State
    const [showEnvModal, setShowEnvModal] = useState(false);
    const [generatedEnv, setGeneratedEnv] = useState("");
    const [copied, setCopied] = useState(false);

    const toggleVisibility = (field: string) => {
        setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
    };

    async function handleSave() {
        setLoading(true);
        try {
            const payload = {
                status,
                githubRepo: repo,
                vercelProject: project,
                notes,
                publicAppUrl,
                mongoDbUri: mongoUri,
                gmailAccount: gmail,
                cloudinaryConfig: cloudinary,
                nextAuth,
                encryptionKey,
                licenseCookieSecret,
                aiSensy,
                triggerDev,
                whatsappTemplates: waTemplates
            };

            const res = await fetch(`/api/admin/schools/${schoolId}/deployment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Deployment details updated!");
                // window.location.reload(); // Optional: Reload to fetch fresh data if needed, but state is already updated
            } else {
                toast.error("Failed to update deployment details");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error saving details");
        } finally {
            setLoading(false);
        }
    }

    const generateEnv = async () => {
        // Generate secure random strings if missing
        const generateRandomString = (length: number) => {
            const array = new Uint8Array(length);
            window.crypto.getRandomValues(array);
            return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
        };

        const secret = nextAuth.secret || generateRandomString(32); // 64 hex chars
        const encKey = encryptionKey || generateRandomString(32); // 64 hex chars
        const cookieSecret = licenseCookieSecret || generateRandomString(32);

        // Update state if new values generated
        let needsSave = false;
        if (!nextAuth.secret) {
            setNextAuth((prev: any) => ({ ...prev, secret }));
            needsSave = true;
        }
        if (!encryptionKey) {
            setEncryptionKey(encKey);
            needsSave = true;
        }
        if (!licenseCookieSecret) {
            setLicenseCookieSecret(cookieSecret);
            needsSave = true;
        }

        if (needsSave) {
            try {
                const payload = {
                    status,
                    githubRepo: repo,
                    vercelProject: project,
                    notes,
                    publicAppUrl,
                    mongoDbUri: mongoUri,
                    gmailAccount: gmail,
                    cloudinaryConfig: cloudinary,
                    nextAuth: { ...nextAuth, secret },
                    encryptionKey: encKey,
                    licenseCookieSecret: cookieSecret,
                    aiSensy,
                    triggerDev,
                    whatsappTemplates: waTemplates
                };

                await fetch(`/api/admin/schools/${schoolId}/deployment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                toast.success("Generated new security keys and saved to database.");
            } catch (e) {
                console.error("Failed to auto-save keys:", e);
            }
        }

        const whatsappEnabled = initialDeployment.features?.whatsapp ? "true" : "false";
        const aisensyBaseUrl = "https://backend.aisensy.com/campaign/t1/api/v2";

        const env = `
# Generated ENV for ${project || "modern-nursery"}

# Deployment
NEXT_PUBLIC_APP_URL=${publicAppUrl}
NEXT_PUBLIC_ENABLE_WHATSAPP_INTEGRATION=${whatsappEnabled}

# School Identity (Required for multi-tenant apps)
NEXT_PUBLIC_SCHOOL_NAME="${initialDeployment.schoolName || 'Modern Nursery'}"
NEXT_PUBLIC_SCHOOL_SHORT_NAME="${initialDeployment.schoolShortName || 'MN'}"
NEXT_PUBLIC_SCHOOL_ADDRESS="${initialDeployment.schoolAddress || '123 School Lane'}"

# FeeEase Configuration
NEXT_PUBLIC_FEEEASE_URL=${initialDeployment.feeeaseUrl}
LICENSE_PUBLIC_KEY="${initialDeployment.licensePublicKey.replace(/\n/g, '\\n')}"
ENCRYPTION_KEY=${encKey}
LICENSE_COOKIE_SECRET=${cookieSecret}

# Database
MONGODB_URI=${mongoUri}

# Authentication
NEXTAUTH_SECRET=${secret}
NEXTAUTH_URL=${nextAuth.url || publicAppUrl}

# Trigger.dev (Background Jobs)
TRIGGER_SECRET_KEY=${triggerDev.apiKey || ""}
TRIGGER_PROJECT_ID=${triggerDev.projectId || ""}

# WhatsApp TemplatesCloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=${cloudinary.cloudName}
CLOUDINARY_API_KEY=${cloudinary.apiKey}
CLOUDINARY_API_SECRET=${cloudinary.apiSecret}

# WhatsApp (AiSensy)
AISENSY_API_KEY=${aiSensy.apiKey}
AISENSY_BASE_URL=${aisensyBaseUrl}

# WhatsApp Templates
WHATSAPP_TEMPLATE_RECEIPT=${waTemplates.receipt}
WHATSAPP_TEMPLATE_REMINDER_HINDI=${waTemplates.reminderHindi}
WHATSAPP_TEMPLATE_REMINDER_ENGLISH=${waTemplates.reminderEnglish}
WHATSAPP_TEMPLATE_REMINDER_URDU=${waTemplates.reminderUrdu}
    `.trim();

        setGeneratedEnv(env);
        setShowEnvModal(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedEnv);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Deployment Configuration</CardTitle>
                    <CardDescription>Manage environment variables and deployment settings</CardDescription>
                </div>
                <Button variant="outline" onClick={generateEnv}>
                    <Terminal className="mr-2 h-4 w-4" />
                    Generate ENV
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* General Deployment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Deployment Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="deployed">Deployed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Vercel Project Name</Label>
                        <Input value={project} onChange={(e) => setProject(e.target.value)} placeholder="my-school-app" />
                    </div>
                    <div className="space-y-2">
                        <Label>GitHub Repository</Label>
                        <Input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="org/repo" />
                    </div>
                    <div className="space-y-2">
                        <Label>Public App URL</Label>
                        <Input value={publicAppUrl} onChange={(e) => setPublicAppUrl(e.target.value)} placeholder="https://school.feeease.in" />
                    </div>
                    <div className="space-y-2">
                        <Label>Gmail User</Label>
                        <Input value={gmail.user} onChange={(e) => setGmail({ ...gmail, user: e.target.value })} placeholder="school@gmail.com" />
                    </div>
                    <div className="space-y-2">
                        <Label>Gmail Password (App Password)</Label>
                        <div className="relative">
                            <Input
                                type={showSecrets['gmailPass'] ? "text" : "password"}
                                value={gmail.pass}
                                onChange={(e) => setGmail({ ...gmail, pass: e.target.value })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => toggleVisibility('gmailPass')}
                            >
                                {showSecrets['gmailPass'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <Accordion type="single" collapsible className="w-full">

                    {/* Database & Auth */}
                    <AccordionItem value="db-auth">
                        <AccordionTrigger>Database & Authentication</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>MongoDB URI</Label>
                                <div className="relative">
                                    <Input
                                        type={showSecrets['mongo'] ? "text" : "password"}
                                        value={mongoUri}
                                        onChange={(e) => setMongoUri(e.target.value)}
                                        placeholder="mongodb+srv://..."
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => toggleVisibility('mongo')}
                                    >
                                        {showSecrets['mongo'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>NextAuth Secret</Label>
                                    <div className="relative">
                                        <Input
                                            type={showSecrets['nextAuthSecret'] ? "text" : "password"}
                                            value={nextAuth.secret}
                                            onChange={(e) => setNextAuth({ ...nextAuth, secret: e.target.value })}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => toggleVisibility('nextAuthSecret')}
                                        >
                                            {showSecrets['nextAuthSecret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>NextAuth URL</Label>
                                    <Input
                                        value={nextAuth.url}
                                        onChange={(e) => setNextAuth({ ...nextAuth, url: e.target.value })}
                                        placeholder="Same as Public App URL"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label>Encryption Key (32 bytes hex)</Label>
                                <div className="relative">
                                    <Input
                                        type={showSecrets['encKey'] ? "text" : "password"}
                                        value={encryptionKey}
                                        onChange={(e) => setEncryptionKey(e.target.value)}
                                        placeholder="Generated automatically if empty"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => toggleVisibility('encKey')}
                                    >
                                        {showSecrets['encKey'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>License Cookie Secret</Label>
                                <div className="relative">
                                    <Input
                                        type={showSecrets['cookieSecret'] ? "text" : "password"}
                                        value={licenseCookieSecret}
                                        onChange={(e) => setLicenseCookieSecret(e.target.value)}
                                        placeholder="Generated automatically if empty"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => toggleVisibility('cookieSecret')}
                                    >
                                        {showSecrets['cookieSecret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* External Services */}
                    <AccordionItem value="services">
                        <AccordionTrigger>External Services (Cloudinary, Trigger.dev)</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Trigger.dev Configuration (Background Jobs)</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Trigger Secret Key</Label>
                                        <div className="relative">
                                            <Input
                                                type={showSecrets['triggerKey'] ? "text" : "password"}
                                                value={triggerDev.apiKey}
                                                onChange={(e) => setTriggerDev({ ...triggerDev, apiKey: e.target.value })}
                                                placeholder="tr_prod_..."
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => toggleVisibility('triggerKey')}
                                            >
                                                {showSecrets['triggerKey'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Project ID</Label>
                                        <Input value={triggerDev.projectId} onChange={(e) => setTriggerDev({ ...triggerDev, projectId: e.target.value })} placeholder="proj_..." />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <Label className="text-muted-foreground">Cloudinary Configuration</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Cloud Name</Label>
                                        <Input value={cloudinary.cloudName} onChange={(e) => setCloudinary({ ...cloudinary, cloudName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>API Key</Label>
                                        <Input value={cloudinary.apiKey} onChange={(e) => setCloudinary({ ...cloudinary, apiKey: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>API Secret</Label>
                                        <div className="relative">
                                            <Input
                                                type={showSecrets['cloudSecret'] ? "text" : "password"}
                                                value={cloudinary.apiSecret}
                                                onChange={(e) => setCloudinary({ ...cloudinary, apiSecret: e.target.value })}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => toggleVisibility('cloudSecret')}
                                            >
                                                {showSecrets['cloudSecret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* WhatsApp Integration */}
                    <AccordionItem value="whatsapp">
                        <AccordionTrigger>WhatsApp Integration (AiSensy)</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>AiSensy API Key</Label>
                                <div className="relative">
                                    <Input
                                        type={showSecrets['aisensy'] ? "text" : "password"}
                                        value={aiSensy.apiKey}
                                        onChange={(e) => setAiSensy({ ...aiSensy, apiKey: e.target.value })}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => toggleVisibility('aisensy')}
                                    >
                                        {showSecrets['aisensy'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Receipt Template</Label>
                                    <Input value={waTemplates.receipt} onChange={(e) => setWaTemplates({ ...waTemplates, receipt: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reminder Template (English)</Label>
                                    <Input value={waTemplates.reminderEnglish} onChange={(e) => setWaTemplates({ ...waTemplates, reminderEnglish: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reminder Template (Hindi)</Label>
                                    <Input value={waTemplates.reminderHindi} onChange={(e) => setWaTemplates({ ...waTemplates, reminderHindi: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reminder Template (Urdu)</Label>
                                    <Input value={waTemplates.reminderUrdu} onChange={(e) => setWaTemplates({ ...waTemplates, reminderUrdu: e.target.value })} />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="space-y-2 pt-4">
                    <Label>Deployment Notes</Label>
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Deployment notes, secrets hints, etc." />
                </div>

                <Button onClick={handleSave} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Deployment Details
                </Button>

                <Dialog open={showEnvModal} onOpenChange={setShowEnvModal}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Generated Environment Variables</DialogTitle>
                            <DialogDescription>
                                Copy these values to your Vercel project settings or .env file.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="relative mt-4">
                            <div className="bg-card rounded-lg border border-border">
                                <div className="flex justify-between items-center p-2 border-b border-border bg-muted/50 rounded-t-lg">
                                    <span className="text-xs text-muted-foreground font-mono px-2">.env</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                        onClick={copyToClipboard}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="mr-2 h-3.5 w-3.5" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="mr-2 h-3.5 w-3.5" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <pre className="p-4 overflow-x-auto max-h-[400px] text-xs font-mono text-foreground whitespace-pre-wrap break-all scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                    {generatedEnv}
                                </pre>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setShowEnvModal(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
