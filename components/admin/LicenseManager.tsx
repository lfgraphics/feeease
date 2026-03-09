"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Copy, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LicenseManagerProps {
  schoolId: string;
  initialLicense: any;
  initialSubscription: any;
  initialFeatures: any;
}

export function LicenseManager({ schoolId, initialLicense, initialSubscription, initialFeatures }: LicenseManagerProps) {
  const [loading, setLoading] = useState(false);
  const [license, setLicense] = useState(initialLicense);
  const [subscription, setSubscription] = useState(initialSubscription);
  const [features, setFeatures] = useState(initialFeatures || {});
  const [plan, setPlan] = useState(subscription.plan || "Basic");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    license?.expiresAt ? new Date(license.expiresAt) : new Date(new Date().setDate(new Date().getDate() + 30))
  );
  const [copied, setCopied] = useState(false);

  async function updateLicense() {
    if (!expiryDate) {
        toast.warning("Please select an expiry date");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/schools/${schoolId}/license`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "generate", 
            expiryDate: expiryDate.toISOString(),
            plan,
            features
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLicense(data.license);
        setSubscription(data.subscription);
        toast.success("License updated successfully!");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !expiryDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={expiryDate}
                            onSelect={setExpiryDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>

        {/* Features Selection */}
        <div className="space-y-2">
            <Label>Features</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded-md bg-muted/20">
                <div className="flex items-center space-x-2">
                    <Checkbox id="whatsapp" checked={features.whatsapp} onCheckedChange={(c) => handleFeatureChange("whatsapp", c as boolean)} />
                    <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="teachers" checked={features.teachersLogin} onCheckedChange={(c) => handleFeatureChange("teachersLogin", c as boolean)} />
                    <Label htmlFor="teachers" className="cursor-pointer">Teachers Login</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="parents" checked={features.parentsLogin} onCheckedChange={(c) => handleFeatureChange("parentsLogin", c as boolean)} />
                    <Label htmlFor="parents" className="cursor-pointer">Parents Login</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="attendance" checked={features.attendance} onCheckedChange={(c) => handleFeatureChange("attendance", c as boolean)} />
                    <Label htmlFor="attendance" className="cursor-pointer">Attendance</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="payroll" checked={features.payroll} onCheckedChange={(c) => handleFeatureChange("payroll", c as boolean)} />
                    <Label htmlFor="payroll" className="cursor-pointer">Payroll</Label>
                </div>
            </div>
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
                <p className="font-bold text-muted-foreground text-sm uppercase tracking-wider">School License Key (Immutable)</p>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
                    {copied ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
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
