"use client";

import { useState, useMemo, useEffect } from "react";
import { format, addMonths, addYears, isBefore, isAfter, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { updateReferralCode, updateFinancials, addPayment } from "@/actions/school-financials";
import { toast } from "sonner";
import { Loader2, Plus, History, AlertCircle } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

interface RecurringCost {
    amount: number;
    effectiveDate: string; // ISO string from DB
}

interface Payment {
    amount: number;
    date: string;
    method: string;
    status: string;
    type?: 'installation' | 'recurring' | 'other';
    billingPeriod?: string;
}

export function SchoolFinancials({ schoolId, initialReferral, initialFinancials, initialSubscription, initialPayments, canEdit }: any) {
  const [referralCode, setReferralCode] = useState(initialReferral?.code || "");
  const [financials, setFinancials] = useState(initialFinancials || {});
  const [payments, setPayments] = useState(initialPayments || []);
  const [loading, setLoading] = useState(false);
  
  // Recurring Cost State
  const [newRecurringCost, setNewRecurringCost] = useState({ amount: "", effectiveDate: new Date() });
  const [showCostHistory, setShowCostHistory] = useState(false);

  // Payment Dialog State
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<{
      amount: string;
      date: Date;
      method: string;
      status: string;
      type: 'installation' | 'recurring' | 'other';
      billingPeriod?: string;
  }>({ 
      amount: "", 
      date: new Date(), 
      method: "Bank Transfer", 
      status: "completed",
      type: "recurring"
  });

  // Helper: Get effective recurring cost for a specific date
  const getEffectiveCost = (date: Date) => {
      const costs = (financials.recurringCosts || []) as RecurringCost[];
      if (!costs || costs.length === 0) return financials.recurringCost || 0; // Fallback to legacy

      // Sort by effective date descending
      const sortedCosts = [...costs].sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
      
      // Find the first cost where effectiveDate <= date
      const effective = sortedCosts.find(c => isBefore(new Date(c.effectiveDate), date) || new Date(c.effectiveDate).getTime() === date.getTime());
      
      return effective ? effective.amount : 0;
  };

  const currentEffectiveCost = getEffectiveCost(new Date());

  // Generate Billing Periods based on Subscription Start Date and Plan
  const billingPeriods = useMemo(() => {
      if (!initialSubscription?.startDate) return [];
      
      const periods = [];
      const startDate = new Date(initialSubscription.startDate);
      const plan = financials.planType || 'monthly';
      const today = new Date();
      const futureLimit = addYears(today, 1); // Generate up to 1 year in future

      let currentDate = startDate;
      let count = 0;

      while (isBefore(currentDate, futureLimit) && count < 100) { // Safety break
          const cost = getEffectiveCost(currentDate);
          let label = format(currentDate, "MMM yyyy");
          
          if (plan === 'quarterly') {
              label = `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`;
          } else if (plan === 'yearly') {
              label = `${currentDate.getFullYear()}`;
          }

          // Check if paid
          const isPaid = payments?.some((p: Payment) => 
              p.billingPeriod?.trim() === label.trim() && 
              (p.status === 'completed' || p.status === 'approved')
          );

          periods.push({
              id: label,
              label: `${label} (Due: ${format(currentDate, "MMM d, yyyy")})`,
              date: new Date(currentDate),
              cost,
              isPaid
          });

          // Increment date based on plan
          if (plan === 'monthly') currentDate = addMonths(currentDate, 1);
          else if (plan === 'quarterly') currentDate = addMonths(currentDate, 3);
          else if (plan === 'yearly') currentDate = addYears(currentDate, 1);
          
          count++;
      }
      return periods;
  }, [initialSubscription?.startDate, financials.planType, financials.recurringCosts, financials.payments]);

  const handleReferralSubmit = async () => {
    setLoading(true);
    try {
      await updateReferralCode(schoolId, referralCode);
      toast.success("Referral code updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update referral code");
      // Revert state on error
      setReferralCode(initialReferral?.code || "");
    } finally {
      setLoading(false);
    }
  };

  const handleFinancialsSubmit = async () => {
    setLoading(true);
    try {
      await updateFinancials(schoolId, {
        installationCost: Number(financials.installationCost),
        planType: financials.planType,
        // Only send recurring cost if user entered a new one
        recurringCost: newPayment.type === 'recurring' ? undefined : undefined // This is wrong place, fixed below
      });
      toast.success("Financials updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update financials");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecurringCost = async () => {
      if (!newRecurringCost.amount) return;
      setLoading(true);
      try {
          await updateFinancials(schoolId, {
              recurringCost: Number(newRecurringCost.amount),
              effectiveDate: newRecurringCost.effectiveDate
          });
          
          // Update local state instead of refreshing page
          setFinancials((prev: any) => ({
              ...prev,
              recurringCosts: [
                  ...(prev.recurringCosts || []),
                  {
                      amount: Number(newRecurringCost.amount),
                      effectiveDate: newRecurringCost.effectiveDate.toISOString()
                  }
              ]
          }));
          
          // Reset form
          setNewRecurringCost({ amount: "", effectiveDate: new Date() });
          setShowCostHistory(false);
          
          toast.success("Recurring cost updated");
      } catch (error: any) {
          toast.error("Failed to update recurring cost");
      } finally {
          setLoading(false);
      }
  };

  const handleAddPayment = async () => {
    setLoading(true);
    try {
      const newPaymentData = {
        amount: Number(newPayment.amount),
        date: newPayment.date.toISOString(),
        method: newPayment.method,
        status: newPayment.status,
        type: newPayment.type,
        billingPeriod: newPayment.billingPeriod
      };
      
      await addPayment(schoolId, {
        amount: Number(newPayment.amount),
        date: newPayment.date,
        method: newPayment.method,
        status: newPayment.status,
        type: newPayment.type,
        billingPeriod: newPayment.billingPeriod
      });

      // Update local state instead of refreshing page
      setPayments((prev: any[]) => [newPaymentData, ...prev]);

      toast.success("Payment added");
      setPaymentOpen(false);
      setNewPayment({ amount: "", date: new Date(), method: "Bank Transfer", status: "completed", type: "recurring" });
    } catch (error: any) {
      toast.error(error.message || "Failed to add payment");
    } finally {
      setLoading(false);
    }
  };

  // When payment type changes
  const handlePaymentTypeChange = (type: 'installation' | 'recurring' | 'other') => {
      setNewPayment(prev => ({ ...prev, type, billingPeriod: undefined, amount: "" }));
      
      if (type === 'installation') {
          setNewPayment(prev => ({ ...prev, type, amount: financials.installationCost?.toString() || "" }));
      }
  };

  // When billing period changes
  const handleBillingPeriodChange = (periodId: string) => {
      const period = billingPeriods.find(p => p.id === periodId);
      if (period) {
          setNewPayment(prev => ({
              ...prev,
              billingPeriod: periodId,
              amount: period.cost.toString(),
              date: new Date() // Or period.date? Usually paid on current date
          }));
      }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Referral Information</CardTitle>
        </CardHeader>
        <CardContent>
          {initialReferral?.code ? (
             <div className="flex flex-col gap-2">
                 <Label>Referral Code</Label>
                 <div className="text-lg font-bold">{initialReferral.code}</div>
                 {initialReferral.referredBy && <p className="text-sm text-muted-foreground">Referred by ID: {initialReferral.referredBy}</p>}
             </div>
          ) : (
             <div className="flex gap-4 items-end">
                 <div className="space-y-2 flex-1">
                     <Label>Add Referral Code</Label>
                     <Input 
                        placeholder="Enter 6-digit code" 
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        disabled={!canEdit}
                     />
                 </div>
                 {canEdit && (
                     <Button onClick={handleReferralSubmit} disabled={loading || !referralCode}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                     </Button>
                 )}
             </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financials Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">General Settings</h3>
                    <div className="space-y-2">
                        <Label>Plan Type</Label>
                        <Select 
                            value={financials.planType || "monthly"} 
                            onValueChange={(val) => setFinancials({...financials, planType: val})}
                            disabled={!canEdit}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Installation Cost (₹)</Label>
                        <div className="flex gap-2">
                            <Input 
                                type="number" 
                                value={financials.installationCost || ""} 
                                onChange={(e) => setFinancials({...financials, installationCost: e.target.value})}
                                disabled={!canEdit}
                            />
                            {canEdit && (
                                <Button onClick={handleFinancialsSubmit} disabled={loading} size="icon" variant="outline">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recurring Cost Management */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Recurring Cost</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowCostHistory(!showCostHistory)} className="h-6 text-xs">
                            <History className="mr-1 h-3 w-3" /> {showCostHistory ? "Hide History" : "Show History"}
                        </Button>
                    </div>
                    
                    <div className="p-4 bg-muted/20 rounded-md border space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Current Effective Cost</Label>
                            <span className="text-xl font-bold">₹{currentEffectiveCost.toLocaleString()}</span>
                        </div>
                        
                        {canEdit && (
                            <div className="space-y-3 pt-3 border-t">
                                <Label className="text-xs">Update Cost (Date Effective)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input 
                                        type="number" 
                                        placeholder="Amount" 
                                        value={newRecurringCost.amount}
                                        onChange={(e) => setNewRecurringCost({...newRecurringCost, amount: e.target.value})}
                                    />
                                    <DatePicker 
                                        date={newRecurringCost.effectiveDate} 
                                        setDate={(date) => setNewRecurringCost({...newRecurringCost, effectiveDate: date || new Date()})}
                                    />
                                </div>
                                <Button size="sm" className="w-full" onClick={handleUpdateRecurringCost} disabled={loading || !newRecurringCost.amount}>
                                    Update Cost
                                </Button>
                            </div>
                        )}
                    </div>

                    {showCostHistory && financials.recurringCosts && (
                        <div className="border rounded-md overflow-x-auto text-sm">
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="h-8">Effective Date</TableHead>
                                        <TableHead className="h-8 text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...(financials.recurringCosts)].sort((a: any, b: any) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()).map((cost: any, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell className="py-2">{format(new Date(cost.effectiveDate), "MMM d, yyyy")}</TableCell>
                                            <TableCell className="py-2 text-right">₹{cost.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment History</CardTitle>
          {canEdit && (
              <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                  <DialogTrigger asChild>
                      <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Payment</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                          <DialogTitle>Record Payment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Payment Type</Label>
                                    <Select 
                                        value={newPayment.type} 
                                        onValueChange={(val: any) => handlePaymentTypeChange(val)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recurring">Recurring Fee</SelectItem>
                                            <SelectItem 
                                                value="installation" 
                                                disabled={payments?.some((p: Payment) => p.type === 'installation' && p.status === 'completed')}
                                            >
                                                Installation {payments?.some((p: Payment) => p.type === 'installation' && p.status === 'completed') && "(Paid)"}
                                            </SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of Payment</Label>
                                    <DatePicker 
                                        date={newPayment.date} 
                                        setDate={(date) => setNewPayment({...newPayment, date: date || new Date()})} 
                                    />
                                </div>
                          </div>

                          {newPayment.type === 'recurring' && (
                              <div className="space-y-2">
                                  <Label>Billing Period</Label>
                                  <Select 
                                    value={newPayment.billingPeriod} 
                                    onValueChange={handleBillingPeriodChange}
                                  >
                                      <SelectTrigger>
                                          <SelectValue placeholder="Select billing period" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-[200px]">
                                          {billingPeriods.filter(period => !period.isPaid).map((period) => (
                                              <SelectItem key={period.id} value={period.id}>
                                                  <span className="flex justify-between w-full gap-4">
                                                      <span>{period.label}</span>
                                                      <span className="font-mono">₹{period.cost}</span>
                                                  </span>
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                  {!newPayment.billingPeriod && (
                                      <p className="text-xs text-muted-foreground">Select a period to auto-calculate amount.</p>
                                  )}
                              </div>
                          )}

                          {newPayment.type === 'installation' && payments?.some((p: Payment) => p.type === 'installation' && p.status === 'completed') && (
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-3 rounded-md flex items-start gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                  <p>Warning: An installation payment has already been recorded for this school.</p>
                              </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Amount (₹)</Label>
                                    <Input 
                                        type="number" 
                                        value={newPayment.amount} 
                                        onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Method</Label>
                                    <Select value={newPayment.method} onValueChange={(val) => setNewPayment({...newPayment, method: val})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="UPI">UPI</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                          </div>
                      </div>
                      <DialogFooter>
                          <Button onClick={handleAddPayment} disabled={loading || !newPayment.amount}>Save Payment</Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>
          )}
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto w-full">
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="whitespace-nowrap w-[120px]">Date</TableHead>
                        <TableHead className="whitespace-nowrap">Type</TableHead>
                        <TableHead className="whitespace-nowrap">Period/Details</TableHead>
                        <TableHead className="whitespace-nowrap text-right">Amount</TableHead>
                        <TableHead className="whitespace-nowrap">Method</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments?.length > 0 ? (
                        [...payments].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment: any, idx: number) => (
                            <TableRow key={idx}>
                                <TableCell className="whitespace-nowrap">{format(new Date(payment.date), "MMM d, yyyy")}</TableCell>
                                <TableCell className="capitalize whitespace-nowrap">{payment.type || 'Other'}</TableCell>
                                <TableCell className="whitespace-nowrap">{payment.billingPeriod || '-'}</TableCell>
                                <TableCell className="font-medium text-right whitespace-nowrap">₹{payment.amount.toLocaleString()}</TableCell>
                                <TableCell className="whitespace-nowrap">{payment.method}</TableCell>
                                <TableCell><Badge variant="outline">{payment.status}</Badge></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No payments recorded</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
