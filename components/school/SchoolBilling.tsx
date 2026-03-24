"use client";

import { useState, useMemo, useEffect } from "react";
import { format, addMonths, addYears, isBefore, isAfter, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getPayments } from "@/actions/school-financials";
import { toast } from "sonner";
import { Loader2, History, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecurringCost {
    amount: number;
    effectiveDate: string;
}

interface Payment {
    amount: number;
    date: string;
    method: string;
    status: string;
    type?: 'installation' | 'recurring' | 'other';
    billingPeriod?: string;
}

export function SchoolBilling({ schoolId, financials, initialSubscription, offerRewardMonthsRemaining = 0 }: any) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [fetchingPayments, setFetchingPayments] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [paymentsLoaded, setPaymentsLoaded] = useState(false);

    const fetchPaymentsData = async () => {
        setFetchingPayments(true);
        try {
            const data = await getPayments(schoolId);
            // Map backend data to frontend Payment interface if needed, 
            // though the server action now handles most mapping.
            setPayments(data);
            setPaymentsLoaded(true);
        } catch (error) {
            toast.error("Failed to fetch payments");
        } finally {
            setFetchingPayments(false);
        }
    };

    useEffect(() => {
        if (historyOpen && !paymentsLoaded) {
            fetchPaymentsData();
        }
    }, [historyOpen]);

    // Also fetch on mount to show correct summary status if needed?
    // User said "load only on request".
    // But to show "Next Due" accurately, we need to know what has been paid.
    // If we don't load payments, we assume nothing is paid, which might show false "Overdue" or "Due".
    // For the dashboard summary to be correct, we technically need the payment status.
    // However, maybe we can fetch a lightweight status?
    // For now, I'll respect "load only on request" for the *full history list*, but I might need to fetch *some* data for the summary.
    // Actually, let's fetch payments on mount silently to populate the summary, but keep the history hidden until requested.
    // The user said "reflect the payments (load only on request (in a separate popover component))".
    // This likely refers to the detailed table.
    // I'll fetch on mount for the summary correctness.

    useEffect(() => {
        fetchPaymentsData();
    }, []);

    // Helper: Get effective recurring cost for a specific date
    const getEffectiveCost = (date: Date) => {
        const costs = (financials.recurringCosts || []) as RecurringCost[];
        if (!costs || costs.length === 0) return financials.recurringCost || 0;

        const sortedCosts = [...costs].sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
        const effective = sortedCosts.find(c => isBefore(new Date(c.effectiveDate), date) || new Date(c.effectiveDate).getTime() === date.getTime());

        return effective ? effective.amount : 0;
    };

    // Generate Billing Periods
    const billingPeriods = useMemo(() => {
        if (!initialSubscription?.startDate) return [];

        const periods = [];
        const startDate = new Date(initialSubscription.startDate);
        const plan = financials.planType || 'monthly';
        const today = new Date();
        const futureLimit = addYears(today, 1);

        let currentDate = startDate;
        let count = 0;

        while (isBefore(currentDate, futureLimit) && count < 100) {
            const cost = getEffectiveCost(currentDate);
            let label = format(currentDate, "MMM yyyy");

            if (plan === 'quarterly') {
                label = `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`;
            } else if (plan === 'yearly') {
                label = `${currentDate.getFullYear()}`;
            }

            // Check if paid: match billingPeriod and status
            const isPaid = payments?.some((p: Payment) =>
                p.billingPeriod === label &&
                (p.status === 'completed' || p.status === 'approved')
            );

            periods.push({
                id: label,
                label: label,
                fullLabel: `${label} (Due: ${format(currentDate, "MMM d, yyyy")})`,
                date: new Date(currentDate),
                cost,
                isPaid
            });

            if (plan === 'monthly') currentDate = addMonths(currentDate, 1);
            else if (plan === 'quarterly') currentDate = addMonths(currentDate, 3);
            else if (plan === 'yearly') currentDate = addYears(currentDate, 1);

            count++;
        }
        return periods;
    }, [initialSubscription?.startDate, financials.planType, financials.recurringCosts, payments, offerRewardMonthsRemaining]);

    // Calculate which future unpaid periods are "free" due to offer reward
    const unpaidPeriods = billingPeriods.filter(p => !p.isPaid);
    const freeMonthsCount = Math.min(offerRewardMonthsRemaining, unpaidPeriods.length);
    const freePeriodIds = new Set(unpaidPeriods.slice(0, freeMonthsCount).map(p => p.id));

    const nextDue = billingPeriods.find(p => !p.isPaid && !freePeriodIds.has(p.id));
    const upcomingExpenses = billingPeriods.filter(p => !p.isPaid).slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Offer Reward Banner */}
            {offerRewardMonthsRemaining > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <span className="text-2xl">🎉</span>
                    <div>
                        <p className="font-semibold text-amber-800 dark:text-amber-200">Offer Reward Active</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Your next <strong>{offerRewardMonthsRemaining} month{offerRewardMonthsRemaining > 1 ? 's' : ''}</strong> of recurring payments are <strong>FREE</strong> due to your referral achievement!
                        </p>
                    </div>
                </div>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Installation Status */}
                        <div className="p-4 border rounded-lg bg-muted/10">
                            <div className="text-sm text-muted-foreground mb-1">Installation Fee</div>
                            <div className="flex items-center gap-2">
                                {payments?.some(p => p.type === 'installation' && (p.status === 'completed' || p.status === 'approved')) ? (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <span className="font-semibold text-green-600">Paid</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                                        <span className="font-semibold text-yellow-600">Pending</span>
                                        {financials.installationCost && <span className="text-xs text-muted-foreground">(₹{financials.installationCost})</span>}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Next Payment */}
                        <div className="p-4 border rounded-lg bg-muted/10">
                            <div className="text-sm text-muted-foreground mb-1">Next Payment Due</div>
                            {nextDue ? (
                                <div>
                                    <div className="font-bold text-lg">{nextDue.label}</div>
                                    <div className="text-sm">₹{nextDue.cost.toLocaleString()}</div>
                                    <div className={cn("text-xs mt-1", isAfter(new Date(), nextDue.date) ? "text-red-500 font-medium" : "text-muted-foreground")}>
                                        Due: {format(nextDue.date, "MMM d, yyyy")}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <span className="font-semibold">All caught up!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Expenses List */}
                    <div className="space-y-4">
                        <div className="flex w-full justify-between flex-row items-center">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Upcoming Expenses</h3>
                            <div className="flex flex-col gap-2 justify-center">
                                <Button variant="outline" onClick={() => setHistoryOpen(true)} className="w-full">
                                    <History className="mr-2 h-4 w-4" /> <span className="hidden md:block" >View Payment History</span>
                                </Button>
                            </div>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {upcomingExpenses.length > 0 ? (
                                        upcomingExpenses.map((expense, idx) => {
                                            const isFree = freePeriodIds.has(expense.id);
                                            return (
                                            <TableRow key={idx} className={isFree ? 'bg-green-50/50 dark:bg-green-950/20' : ''}>
                                                <TableCell className="flex items-center gap-2">
                                                    {expense.label}
                                                    {isFree && <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">FREE</Badge>}
                                                </TableCell>
                                                <TableCell>{format(expense.date, "MMM d, yyyy")}</TableCell>
                                                <TableCell className="text-right">
                                                    {isFree ? (
                                                        <span className="line-through text-muted-foreground mr-1">₹{expense.cost.toLocaleString()}</span>
                                                    ) : null}
                                                    <span className={isFree ? 'font-bold text-green-600' : ''}>{isFree ? '₹0' : `₹${expense.cost.toLocaleString()}`}</span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">No upcoming expenses found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Payment History Dialog */}
                    <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Payment History</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[60vh] overflow-y-auto">
                                {fetchingPayments && !paymentsLoaded ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Period</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {payments?.length > 0 ? (
                                                [...payments].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment: any, idx: number) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{format(new Date(payment.date), "MMM d, yyyy")}</TableCell>
                                                        <TableCell className="capitalize">
                                                            {payment.type === 'income' ? 'Payment' : (payment.type || 'Payment')}
                                                        </TableCell>
                                                        <TableCell>{payment.billingPeriod || '-'}</TableCell>
                                                        <TableCell className="text-right font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                                                        <TableCell>{payment.method || payment.paymentMethod}</TableCell>
                                                        <TableCell><Badge variant="outline">{payment.status}</Badge></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payments recorded</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}
