"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Copy, Check, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { SCHOOL_FEATURES } from "@/lib/features";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

interface LicenseManagerProps {
  schoolId: string;
  initialLicense: any;
  initialSubscription: any;
  initialFeatures: any;
}

export function LicenseManager({ schoolId, initialLicense, initialSubscription, initialFeatures }: LicenseManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [license, setLicense] = useState(initialLicense);
  const [subscription, setSubscription] = useState(initialSubscription);
  const [features, setFeatures] = useState(initialFeatures || {});
  const [plan, setPlan] = useState(subscription.plan || "Basic");

  // Sync features from props when they change on the server
  useEffect(() => {
    setFeatures(initialFeatures || {});
  }, [initialFeatures]);

  const [mounted, setMounted] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const [status, setStatus] = useState(initialLicense?.status || "active");

  useEffect(() => {
    setMounted(true);
    // Only set the date on the client side after mounting
    const initialDate = license?.expiresAt ? new Date(license.expiresAt) : new Date(new Date().setDate(new Date().getDate() + 30));
    setExpiryDate(initialDate);
    if (initialLicense?.status) {
      setStatus(initialLicense.status);
    }
  }, [license?.expiresAt, initialLicense?.status]);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>License & Plan Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  async function updateLicense() {
    if (!expiryDate) {
      toast.warning("Please select an expiry date");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        action: "generate",
        expiryDate: expiryDate.toISOString(),
        plan,
        features,
        status // Include status in the update
      };
      console.log("[LicenseManager] Updating with Payload:", JSON.stringify(payload, null, 2));

      const res = await fetch(`/api/admin/schools/${schoolId}/license`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setLicense(data.license);
        setSubscription(data.subscription);
        toast.success("License updated successfully!");
        router.refresh();
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update license");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (license?.licenseKey) {
      navigator.clipboard.writeText(license.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("License key copied!");
    }
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFeatures({ ...features, [feature]: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License & Plan Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>License Expiry Date</Label>
            <DatePicker date={expiryDate} setDate={setExpiryDate} />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Features Selection */}
        <div className="space-y-4">
          <Label className="text-base font-bold">Enabled Features</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SCHOOL_FEATURES.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow">
                <Label htmlFor={feature.id} className="cursor-pointer flex flex-col gap-0.5">
                  <span className="font-semibold text-sm">{feature.label}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">{feature.description}</span>
                </Label>
                <Select
                  value={!!features[feature.id] ? "true" : "false"}
                  onValueChange={(v) => handleFeatureChange(feature.id, v === "true")}
                >
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Save Features Only Action */}
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              setLoading(true);
              try {
                const res = await fetch(`/api/admin/schools/${schoolId}/deployment`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ features }),
                });
                if (res.ok) {
                  toast.success("Features updated successfully!");
                  router.refresh();
                } else {
                  toast.error("Failed to update features");
                }
              } catch (e) {
                toast.error("Error updating features");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Features Access
          </Button>
        </div>

        {/* Actions */}
        <Button onClick={updateLicense} disabled={loading} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Update Plan & Generate New License
        </Button>

        {/* License Key Display */}
        {license?.licenseKey && (
          <div className="bg-muted p-4 rounded-md border mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-muted-foreground text-sm uppercase tracking-wider">School License Key</p>
              <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
                {copied ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="font-mono text-sm sm:text-lg font-bold tracking-widest bg-background p-3 rounded border text-center text-foreground break-all">
              {license.licenseKey}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="font-bold text-muted-foreground text-xs mb-2 uppercase tracking-wider">Current Signed Token (System Use Only)</p>
              <div className="font-mono text-[10px] break-all bg-background p-2 rounded text-muted-foreground border border-border">
                {license.token || "Not Generated"}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">Status: <span className="font-medium text-foreground capitalize bg-background px-2 py-0.5 rounded border">{license.status}</span></span>
              <span className="flex items-center gap-1">Expires: <span className="font-medium text-foreground bg-background px-2 py-0.5 rounded border">{license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : "N/A"}</span></span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
