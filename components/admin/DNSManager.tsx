"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, Trash2, CheckCircle2, XCircle, RefreshCw, ExternalLink, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface DnsRecord {
  id: string;
  name: string;
  type: string;
  content: string;
  proxied: boolean;
  ttl: number;
}

interface DNSManagerProps {
  schoolId: string;
  shortName: string;
  currentPublicUrl?: string;
  canEdit: boolean;
}

export function DNSManager({ schoolId, shortName, currentPublicUrl, canEdit }: DNSManagerProps) {
  const [record, setRecord] = useState<DnsRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  // Form states
  const [prefix, setPrefix] = useState<string>(shortName || "");
  const [target, setTarget] = useState<string>("");
  const [proxied, setProxied] = useState<boolean>(true);
  const type = "CNAME"; // Locked to CNAME


  const fetchRecord = useCallback(async () => {
    if (!shortName) {
        setLoading(false);
        return;
    }
    
    try {
      setIsRefreshing(true);
      // We search by name (subdomain)
      // Note: We need the root domain to search for the full name. 
      // If we don't have it on client side, we can just use the API search.
      const response = await fetch(`/api/dns/records?name=${shortName}`);
      const data = await response.json();
      
      if (data.success && data.records && data.records.length > 0) {
        // Find the one that matches exactly or starts with shortName
        const exactMatch = data.records.find((r: DnsRecord) => 
            r.name.startsWith(shortName.toLowerCase())
        );
        setRecord(exactMatch || null);
      } else {
        setRecord(null);
      }
    } catch (err) {
      console.error("Failed to fetch DNS record", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [shortName]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const handleCreateSubdomain = async () => {
    if (!target) {
      toast.error("Please enter a target content (IP or domain)");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch("/api/dns/subdomains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: prefix,
          target,
          type,
          proxied,
          schoolId
        }),


      });

      const data = await response.json();
      if (data.success) {
        toast.success("Subdomain created successfully");
        setRecord(data.record);
        setShowCreateForm(false);
        
        // Optionally update school public URL via an action if needed
        // but for now we focus on DNS
      } else {
        toast.error(data.error || "Failed to create subdomain");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!record) return;
    if (!confirm(`Are you sure you want to delete the DNS record for ${record.name}?`)) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/dns/records/${record.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("DNS record deleted");
        setRecord(null);
      } else {
        toast.error(data.error || "Failed to delete record");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateRecord = async () => {
    if (!record || !target) return;
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/dns/records/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: target,
          proxied,
          type
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("DNS record updated");
        setRecord(data.record);
        setIsEditing(false);
      } else {
        toast.error(data.error || "Failed to update record");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerify = async () => {
    if (!record) return;
    setIsRefreshing(true);
    await fetchRecord();
    toast.success("DNS status verified");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              DNS Management
            </CardTitle>
            <CardDescription>
              Manage subdomain and DNS records for this school
            </CardDescription>
          </div>
          {record && (
            <Button variant="outline" size="sm" onClick={handleVerify} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Verify
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {!record && !showCreateForm && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">No DNS Record Found</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                This school doesn't have a configured subdomain yet.
              </p>
            </div>
            {canEdit && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Setup Subdomain
              </Button>
            )}
          </div>
        )}

        {showCreateForm && (
          <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
            <h3 className="font-bold flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Subdomain
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Subdomain Prefix</Label>
                <div className="flex items-center gap-2">
                    <Input 
                        value={prefix} 
                        onChange={(e) => setPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="e.g. school-name"
                    />
                    <Badge variant="outline">.yourdomain.com</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">User-friendly handle for the school</p>
              </div>
              <div className="space-y-2">
                <Label>Record Type</Label>
                <Input value="CNAME" disabled className="bg-muted opacity-60" />
                <p className="text-[10px] text-muted-foreground">Standard for Vercel hosting</p>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Target Value (Vercel CNAME)</Label>
                <Input 
                    placeholder="cname.vercel-dns.com" 
                    value={target}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarget(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 py-2">
                 <Switch id="proxied" checked={proxied} onCheckedChange={setProxied} />
                 <Label htmlFor="proxied" className="flex items-center gap-1.5 cursor-pointer">
                    Cloudflare Proxy
                    <Info className="h-3 w-3 text-muted-foreground" />

                 </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              <Button onClick={handleCreateSubdomain} disabled={isUpdating}>
                {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Record
              </Button>
            </div>
          </div>
        )}

        {record && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-muted/20 gap-4">
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${record.proxied ? "bg-orange-500" : "bg-blue-500"} animate-pulse`} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg leading-none">{record.name}</p>
                    <Badge variant="secondary" className="text-[10px] h-5">{record.type}</Badge>
                    {record.proxied && (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 text-[10px] h-5">Proxied</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-md">Points to: {record.content}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!isEditing && (
                    <>
                        <Button variant="outline" size="sm" asChild>
                            <a href={`https://${record.name}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Visit
                            </a>
                        </Button>
                        {canEdit && (
                        <Button variant="ghost" size="sm" onClick={() => {
                            setIsEditing(true);
                            setTarget(record.content);
                            setProxied(record.proxied);
                        }}>
                            Edit
                        </Button>

                        )}
                        {canEdit && (
                        <Button variant="destructive" size="sm" onClick={handleDeleteRecord} disabled={isUpdating}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        )}
                    </>
                )}
              </div>
            </div>

            {isEditing && (
               <div className="space-y-4 border-2 border-primary/20 rounded-lg p-4 bg-muted/5">
                <h3 className="font-bold flex items-center gap-2">
                    Edit Record: {record.name}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Record Type</Label>
                    <Input value="CNAME" disabled className="bg-muted opacity-60" />
                  </div>
                  <div className="sm:col-span-1 space-y-2">
                    <Label>Target Value</Label>
                    <Input 
                        placeholder="cname.vercel-dns.com" 
                        value={target}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarget(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2 py-2">
                     <Switch id="edit-proxied" checked={proxied} onCheckedChange={setProxied} />
                     <Label htmlFor="edit-proxied" className="flex items-center gap-1.5 cursor-pointer">
                        Cloudflare Proxy
                     </Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleUpdateRecord} disabled={isUpdating}>
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex items-center gap-2 text-sm p-3 border rounded-lg bg-green-50/50 border-green-100 text-green-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Record is active on Cloudflare edge.</span>
               </div>
               
               {currentPublicUrl && !currentPublicUrl.includes(record.name) && (
                 <div className="flex items-center gap-2 text-sm p-3 border rounded-lg bg-yellow-50/50 border-yellow-100 text-yellow-700">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>School URL mismatch with DNS record. Update recommended.</span>
                 </div>
               )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
