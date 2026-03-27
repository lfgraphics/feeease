"use client";

import {

  Globe,
  RefreshCw,
  AlertCircle,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Shield,
  ShieldOff,
  MoreHorizontal
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

interface DnsUsage {
  usage: number;
  limit: number;
  period: string;
  zoneName?: string;
}

interface DnsRecord {
  id: string;
  name: string;
  type: string;
  content: string;
  proxied: boolean;
  ttl: number;
}


export function DNSUsageManager() {
  const [usage, setUsage] = useState<DnsUsage | null>(null);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Create/Edit record form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DnsRecord | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "CNAME",
    content: "",
    proxied: true,
    ttl: 1
  });

  const fetchUsage = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/dns/usage");
      const data = await response.json();
      if (data.success) {
        setUsage(data.usage);
      } else {
        setError(data.error || "Failed to fetch DNS usage");
      }
    } catch (err) {
      setError("An error occurred while fetching DNS usage");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setRecordsLoading(true);
      const response = await fetch("/api/dns/records");
      const data = await response.json();
      if (data.success) {
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error("Failed to fetch records", err);
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    fetchRecords();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!formData.name || !formData.content) {
      toast.error("Name and Content are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const url = editingRecord
        ? `/api/dns/records/${editingRecord.id}`
        : "/api/dns/records";

      const method = editingRecord ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingRecord ? "Record updated" : "Record created");
        setIsDialogOpen(false);
        fetchRecords();
        fetchUsage();
      } else {
        toast.error(data.error || "Failed to save record");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the record for ${name}?`)) return;

    try {
      const response = await fetch(`/api/dns/records/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Record deleted");
        fetchRecords();
        fetchUsage();
      } else {
        toast.error(data.error || "Failed to delete record");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const openCreateDialog = () => {
    setEditingRecord(null);
    setFormData({ name: "", type: "CNAME", content: "", proxied: true, ttl: 1 });
    setIsDialogOpen(true);
  };

  const openEditDialog = (record: DnsRecord) => {
    setEditingRecord(record);
    // Cloudflare returns name as full domain, we might want to keep it or strip it.
    // For simplicity, let's keep it as is.
    setFormData({
      name: record.name,
      type: record.type,
      content: record.content,
      proxied: record.proxied,
      ttl: record.ttl
    });
    setIsDialogOpen(true);
  };

  const filteredRecords = records.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Globe className="h-5 w-5 animate-pulse text-primary" />
            DNS Records Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading DNS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchUsage}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const usageVal = usage?.usage ?? 0;
  const limitVal = usage?.limit ?? 1000;
  const percentage = Math.round((usageVal / limitVal) * 100) || 0;

  return (

    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Cloudflare DNS Control Panel
            </CardTitle>
            <CardDescription>Managed domain: {usage?.zoneName || "Connecting..."}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { fetchUsage(); fetchRecords(); }} disabled={loading || recordsLoading}>
              <RefreshCw className={`h-4 w-4 ${(loading || recordsLoading) ? 'animate-spin' : ''}`} />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingRecord ? "Edit DNS Record" : "Add DNS Record"}</DialogTitle>
                  <DialogDescription>
                    Configure your DNS record settings below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) => setFormData({ ...formData, type: v })}
                    >
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="AAAA">AAAA</SelectItem>
                        <SelectItem value="CNAME">CNAME</SelectItem>
                        <SelectItem value="TXT">TXT</SelectItem>
                        <SelectItem value="MX">MX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. www"
                      className="col-span-3"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">Content</Label>
                    <Input
                      id="content"
                      placeholder={formData.type === 'A' ? '1.2.3.4' : 'target.domain.com'}
                      className="col-span-3"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Proxy status</Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        checked={formData.proxied}
                        onCheckedChange={(v) => setFormData({ ...formData, proxied: v })}
                      />
                      <Label className="text-xs text-muted-foreground italic">
                        {formData.proxied ? 'Proxied (Cloudflare)' : 'DNS Only'}
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateOrUpdate} disabled={isSubmitting}>
                    {isSubmitting && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    {editingRecord ? "Update Record" : "Create Record"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="records">Records List</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 py-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Zone Records Usage</span>
                  <span className="font-bold">
                    {usageVal} / {limitVal}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-[10px] text-muted-foreground text-right italic">
                  {100 - percentage}% remaining capacity
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-xl bg-muted/20 flex flex-col gap-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Active Zone</p>
                  <p className="text-sm font-bold truncate">{usage?.zoneName || "Cloudflare API"}</p>
                </div>
                <div className="p-4 border rounded-xl bg-muted/20 flex flex-col gap-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Status</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-500 bg-green-500/10 border-green-500/20">Active</Badge>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  </div>

                </div>
              </div>
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, content or type..."
                    className="pl-8 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border overflow-hidden bg-background/50">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-b">

                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Content</TableHead>
                      <TableHead className="w-[80px] text-center">Proxy</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          {recordsLoading ? "Loading records..." : "No DNS records found."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id} className="group">
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-[10px] px-1.5 h-5">
                              {record.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-sm">
                            <div className="flex flex-col">
                              <span>{record.name}</span>
                              <span className="text-[10px] text-muted-foreground md:hidden truncate max-w-[150px]">
                                {record.content}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-mono text-[11px] text-muted-foreground max-w-[200px] truncate">
                            {record.content}
                          </TableCell>
                          <TableCell className="text-center">
                            {record.proxied ? (
                              <Shield className="h-4 w-4 text-orange-400 mx-auto filter drop-shadow-[0_0_3px_rgba(251,146,60,0.3)]" />
                            ) : (
                              <ShieldOff className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                            )}
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(record)}>
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a href={`https://${record.name}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Visit
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                  onClick={() => handleDelete(record.id, record.name)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <p className="text-[10px] text-muted-foreground italic text-center">
                Showing {filteredRecords.length} of {records.length} total records in your zone.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

