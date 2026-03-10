"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getReferredSchools } from "@/actions/marketing-dashboard";
import { Loader2, Copy, Check, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

import { DateRange } from "react-day-picker";

interface MarketingDashboardClientProps {
  initialSchools: any[];
  initialCursor: string | null;
  userId: string;
  stats: {
    totalSchools: number;
    totalInstallation: number;
    totalRecurring: number;
    totalEarnings: number;
  };
  referralCode?: string;
}

export function MarketingDashboardClient({ initialSchools, initialCursor, userId, stats, referralCode }: MarketingDashboardClientProps) {
  const [schools, setSchools] = useState<any[]>(initialSchools);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [copied, setCopied] = useState(false);

  const loadMore = async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const filters = dateRange?.from && dateRange?.to ? { startDate: dateRange.from, endDate: dateRange.to } : undefined;
      const result = await getReferredSchools(userId, cursor, 10, filters);
      setSchools((prev) => [...prev, ...result.schools]);
      setCursor(result.nextCursor);
    } catch (error) {
      toast.error("Failed to load more schools");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Referral code copied!");
    }
  };

  const handleDateSelect = async (range: DateRange | undefined) => {
      setDateRange(range);
      if (range?.from && range?.to) {
          // Reset and fetch with new filters
          setLoading(true);
          try {
              const filters = { startDate: range.from, endDate: range.to };
              const result = await getReferredSchools(userId, undefined, 10, filters);
              setSchools(result.schools);
              setCursor(result.nextCursor);
          } catch (error) {
              toast.error("Failed to filter schools");
          } finally {
              setLoading(false);
          }
      } else if (!range) {
          // Reset filter
          setLoading(true);
          try {
              const result = await getReferredSchools(userId, undefined, 10);
              setSchools(result.schools);
              setCursor(result.nextCursor);
          } catch (error) {
              toast.error("Failed to reset filters");
          } finally {
              setLoading(false);
          }
      }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Marketing Dashboard</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Track your performance and earnings</p>
        </div>
        {referralCode && (
          <Card className="w-full md:w-auto bg-primary/5 border-primary/20 shrink-0">
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Referral Code</p>
                <p className="text-lg sm:text-2xl font-bold tracking-wider text-primary truncate">{referralCode}</p>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopyCode} className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Referred Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalSchools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Installation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹{stats.totalInstallation.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹{stats.totalRecurring.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">₹{stats.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg sm:text-xl font-semibold">Referred Schools</h3>
          <div className="w-full sm:w-auto">
            <DatePickerWithRange date={dateRange} setDate={handleDateSelect} />
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">School Name</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Date Added</TableHead>
                <TableHead className="text-xs sm:text-sm">Plan</TableHead>
                <TableHead className="text-xs sm:text-sm hidden md:table-cell">Status</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">Installation</TableHead>
                <TableHead className="text-xs sm:text-sm text-right hidden lg:table-cell">Recurring</TableHead>
                <TableHead className="text-xs sm:text-sm text-right">Total Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground">
                    No schools found.
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school: any) => {
                  const totalPaid = school.financials?.payments?.reduce((acc: number, curr: any) => 
                    curr.status === 'completed' ? acc + curr.amount : acc, 0) || 0;
                  
                  return (
                    <TableRow key={school._id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{school.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{format(new Date(school.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{school.subscription?.plan || "Basic"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={school.subscription?.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {school.subscription?.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs sm:text-sm font-medium">₹{school.financials?.installationCost?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm font-medium hidden lg:table-cell">₹{school.financials?.recurringCost?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm font-bold text-green-600">₹{totalPaid.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {cursor && (
          <div className="flex justify-center pt-3 sm:pt-4">
            <Button variant="outline" onClick={loadMore} disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
