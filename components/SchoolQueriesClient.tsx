"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { SchoolQueryStatus } from "@/models/SchoolQuery";
import { useSession } from "next-auth/react";
import { CheckCircle2, Clock, AlertCircle, XCircle, Zap, Pencil, PlusCircle } from "lucide-react";

interface QueryRow {
  _id: string;
  schoolName: string;
  schoolLogo?: string;
  query: string;
  adminName: string;
  adminMobile: string;
  contactPersonName?: string;
  contactPersonMobile?: string;
  status: SchoolQueryStatus;
  note?: string;
  assigned?: { _id: string; name: string; email: string };
  createdAt: string;
}

interface Stats {
  total: number;
  byStatus: Record<SchoolQueryStatus, number>;
}

interface ClientProps {
  initialQueries?: QueryRow[];
  initialStats?: Stats;
  initialPage?: number;
}

export const SchoolQueriesClient: React.FC<ClientProps> = ({
  initialQueries = [],
  initialStats,
  initialPage = 1,
}) => {
  const { data: session } = useSession();
  const role = session?.user.role;
  const isAdmin = !!role?.includes("admin");
  const isSuperAdmin = role === "super_admin";
  const [queries, setQueries] = useState<QueryRow[]>(initialQueries);
  const [stats, setStats] = useState<Stats | undefined>(initialStats);
  const [page, setPage] = useState(initialPage);
  const [assignableUsers, setAssignableUsers] = useState<Array<{ _id: string; fullName: string; email: string; role: string; }>>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDialogQueryId, setStatusDialogQueryId] = useState<string | null>(null);
  const [statusDialogStatus, setStatusDialogStatus] = useState<SchoolQueryStatus | null>(null);
  const [statusDialogNote, setStatusDialogNote] = useState<string>("");
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [periodType, setPeriodType] = useState<"all" | "custom">("all");

  const fetchData = useCallback(() => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (search) params.append("query", search);
    if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
    if (periodType === "custom" && dateRange) {
      if (dateRange.from) params.append("from", dateRange.from.toISOString());
      if (dateRange.to) params.append("to", dateRange.to.toISOString());
    }
    fetch(`/api/school-queries?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setQueries(d.data.queries);
          setTotalPages(d.data.totalPages || 1);
        }
      });

    // fetch stats separately
    const statsParams = new URLSearchParams();
    if (periodType === "custom" && dateRange) {
      if (dateRange.from) statsParams.append("from", dateRange.from.toISOString());
      if (dateRange.to) statsParams.append("to", dateRange.to.toISOString());
    }
    fetch(`/api/school-queries/stats?${statsParams.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setStats(d.stats);
        }
      });
  }, [page, search, statusFilter, dateRange, periodType]);

  // initial load
  useEffect(() => {
    if (initialQueries.length === 0) {
      fetchData();
    }
    // load assignable users if admin
    if (role?.includes('admin')) {
      fetch('/api/school-queries/users')
        .then(r => r.json())
        .then(d => {
          if (d.success) setAssignableUsers(d.users || []);
        })
        .catch(console.error);
    }
  }, []);

  // poll every 15 seconds
  useEffect(() => {
    const id = setInterval(fetchData, 15000);
    return () => clearInterval(id);
  }, [fetchData]);

  const updateStatus = async (id: string, newStatus: SchoolQueryStatus) => {
    await fetch(`/api/school-queries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchData();
  };

  const updateStatusWithNote = async (id: string, newStatus: SchoolQueryStatus, note: string) => {
    await fetch(`/api/school-queries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus, note }),
    });
    fetchData();
  };

  const updateAssigned = async (id: string, userId: string) => {
    const user = assignableUsers.find(u => u._id === userId);
    if (!user) return;
    await fetch(`/api/school-queries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, assigned: { _id: user._id, name: user.fullName, email: user.email } }),
    });
    fetchData();
  };

  const openStatusDialog = (id: string, newStatus: SchoolQueryStatus, existingNote?: string) => {
    setStatusDialogQueryId(id);
    setStatusDialogStatus(newStatus);
    setStatusDialogNote(existingNote || "");
    setStatusDialogOpen(true);
  };

  const statusDialogCopy = (st: SchoolQueryStatus | null) => {
    if (st === "rejected") return { title: "Reason for rejection", placeholder: "Write the rejection reason…" };
    if (st === "pending") return { title: "Reason for pending", placeholder: "Write why it's pending…" };
    if (st === "resolved") return { title: "Resolution note", placeholder: "Write what was done / resolution details…" };
    return { title: "Add note", placeholder: "Write a note…" };
  };

  const submitStatusDialog = async () => {
    if (!statusDialogQueryId || !statusDialogStatus) return;
    const note = statusDialogNote.trim();
    if (!note) return;
    await updateStatusWithNote(statusDialogQueryId, statusDialogStatus, note);
    setStatusDialogOpen(false);
    setStatusDialogQueryId(null);
    setStatusDialogStatus(null);
    setStatusDialogNote("");
  };

  const allowedStatusOptions = (current: SchoolQueryStatus) => {
    const base: SchoolQueryStatus[] = ["initiated", "assigned", "pending", "resolved", "rejected"];
    return current === "initiated" ? base : base.filter((s) => s !== "initiated");
  };

  const saveNote = async (id: string) => {
    await fetch(`/api/school-queries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, note: noteDraft }),
    });
    setEditingNoteId(null);
    fetchData();
  };

  const onSelectStatus = (q: QueryRow, next: SchoolQueryStatus) => {
    if (next === q.status) return;
    if (["pending", "resolved", "rejected"].includes(next)) {
      openStatusDialog(q._id, next, q.note);
      return;
    }
    updateStatus(q._id, next);
  };

  const statusColor = (status: SchoolQueryStatus) => {
    switch (status) {
      case 'initiated':
        return 'secondary';
      case 'assigned':
        return 'default';
      case 'pending':
        return 'outline';
      case 'resolved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: SchoolQueryStatus) => {
    switch (status) {
      case 'initiated':
        return <Zap className="w-5 h-5" />;
      case 'assigned':
        return <Clock className="w-5 h-5" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5" />;
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getStatusBgColor = (status: SchoolQueryStatus) => {
    switch (status) {
      case 'initiated':
        return 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
      case 'assigned':
        return 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300';
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300';
      case 'resolved':
        return 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300';
      case 'rejected':
        return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">School Queries</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <div className="flex items-center gap-2">
          <Button size="sm" variant={periodType === 'all' ? 'default' : 'outline'} onClick={() => { setPeriodType('all'); setDateRange(undefined); }}>All time</Button>
          <Button size="sm" variant={periodType === 'custom' ? 'default' : 'outline'} onClick={() => setPeriodType('custom')}>Period</Button>
        </div>
        {periodType === 'custom' && (
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Card */}
          <Card className="p-4 border-2 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total</span>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
          </Card>

          {/* Status Cards */}
          {(Object.entries(stats.byStatus) as Array<[SchoolQueryStatus, number]>).map(([status, count]) => (
            <Card key={status} className={`p-4 border-2 hover:shadow-md transition-shadow ${getStatusBgColor(status)}`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize tracking-wide">{status}</span>
                  {getStatusIcon(status)}
                </div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchData(); }}>
            <Input
              name="query"
              placeholder="Search by school, admin, mobile..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
        <div className="w-full sm:w-50">
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="initiated">Initiated</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-y-auto">
        <Table className="min-w-fit">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-10"></TableHead>
              <TableHead className="min-w-48">School</TableHead>
              <TableHead className="max-w-8">Query</TableHead>
              <TableHead className="min-w-40">Admin / Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Assigned</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No queries found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              queries.map((q) => (
                <TableRow key={q._id}>
                  <TableCell >
                    {q.schoolLogo && <img src={q.schoolLogo} className="h-8 w-8 object-contain rounded" alt={q.schoolName} />}
                  </TableCell>
                  <TableCell >
                    {q.schoolName}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="truncate max-w-12 block">{q.query}</span>
                      </TooltipTrigger>
                      <TooltipContent>{q.query}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{q.adminName}</span>
                      <a href={`tel:${q.adminMobile}`} className="text-xs text-muted-foreground hover:underline">{q.adminMobile}</a>
                      {q.contactPersonName && (
                        <span className="text-xs">{q.contactPersonName} / <a href={`tel:${q.contactPersonMobile}`} className="hover:underline">{q.contactPersonMobile}</a></span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="flex flex-col items-center">
                    <Badge className="w-full text-center" variant={statusColor(q.status)}>{q.status}</Badge>
                    {isAdmin && (
                      <Select
                        value={q.status}
                        onValueChange={(val) => onSelectStatus(q, val as SchoolQueryStatus)}
                        disabled={!isSuperAdmin && (q.status === "resolved" || q.status === "rejected")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedStatusOptions(q.status).map((s) => (
                            <SelectItem key={s} value={s}>
                              {s[0].toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <Select
                        value={q.assigned?._id || ""}
                        onValueChange={(val) => updateAssigned(q._id, val)}
                      // styling may be applied to the trigger instead of root
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignableUsers.map((u) => (
                            <SelectItem key={u._id} value={u._id}>{u.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      q.assigned ? `${q.assigned.name}` : "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingNoteId === q._id ? (
                      <div className="flex flex-col gap-2">
                        <Textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Write a note…"
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveNote(q._id)}>Save</Button>
                          <Button size="sm" variant="secondary" onClick={() => { setEditingNoteId(null); }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate max-w-12 block">{q.note || "-"}</span>
                          </TooltipTrigger>
                          <TooltipContent>{q.note || ""}</TooltipContent>
                        </Tooltip>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingNoteId(q._id);
                              setNoteDraft(q.note || "");
                            }}
                          >
                            {q.note ? <Pencil /> : <PlusCircle />}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={statusDialogOpen}
        onOpenChange={(open) => {
          setStatusDialogOpen(open);
          if (!open) {
            setStatusDialogQueryId(null);
            setStatusDialogStatus(null);
            setStatusDialogNote("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{statusDialogCopy(statusDialogStatus).title}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={statusDialogNote}
            onChange={(e) => setStatusDialogNote(e.target.value)}
            placeholder={statusDialogCopy(statusDialogStatus).placeholder}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitStatusDialog} disabled={!statusDialogNote.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <div className="text-sm text-muted-foreground mr-4">
          Page {page} of {totalPages || 1}
        </div>
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default SchoolQueriesClient;
