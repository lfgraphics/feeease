"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getMarketingPerformance } from "@/actions/finances";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

import { DateRange } from "react-day-picker";

export function MarketingPerformance() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMarketingPerformance(dateRange?.from, dateRange?.to);
      setStats(data);
    } catch (error) {
      toast.error("Failed to load marketing performance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const toggleRow = (userId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(userId)) {
      newExpandedRows.delete(userId);
    } else {
      newExpandedRows.add(userId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Marketing Performance</h3>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Staff Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Schools Referred</TableHead>
              <TableHead className="text-right">Income Generated</TableHead>
              <TableHead className="text-right">Total Paid</TableHead>
              <TableHead className="text-right">Net</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                </TableRow>
            ) : stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No marketing staff found.
                </TableCell>
              </TableRow>
            ) : (
              stats.map((user: any) => (
                <React.Fragment key={user.userId}>
                  <TableRow className={expandedRows.has(user.userId) ? "bg-muted/50" : ""}>
                    <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRow(user.userId)}>
                            {expandedRows.has(user.userId) ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.schoolsCount}</TableCell>
                    <TableCell className="text-right text-green-600">₹{user.incomeGenerated.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-600">₹{user.totalPaid.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-bold ${user.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{user.net.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(user.userId) && (
                      <TableRow>
                          <TableCell colSpan={7} className="p-0">
                              <div className="p-4 bg-muted/30">
                                  <h4 className="font-semibold mb-2 text-sm">School Breakdown</h4>
                                  <Table>
                                      <TableHeader>
                                          <TableRow>
                                              <TableHead>School Name</TableHead>
                                              <TableHead className="text-right">Income Generated (In Period)</TableHead>
                                          </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                          {user.schools && user.schools.length > 0 ? (
                                              user.schools.map((school: any) => (
                                                  <TableRow key={school.id}>
                                                      <TableCell>{school.name}</TableCell>
                                                      <TableCell className="text-right font-medium">₹{school.income.toLocaleString()}</TableCell>
                                                  </TableRow>
                                              ))
                                          ) : (
                                              <TableRow>
                                                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                                                      No schools referred or no income in this period.
                                                  </TableCell>
                                              </TableRow>
                                          )}
                                      </TableBody>
                                  </Table>
                              </div>
                          </TableCell>
                      </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}