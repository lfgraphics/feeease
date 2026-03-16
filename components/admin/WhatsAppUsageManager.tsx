"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { MessageCircle, RefreshCw, Settings, TrendingUp, AlertTriangle, Wallet, Landmark, CreditCard, ReceiptIndianRupee, Plus } from "lucide-react"
import { updateWhatsAppSoftLimit, resetWhatsAppUsage } from "@/actions/whatsapp-usage"
import { syncWhatsAppPricing, addWhatsAppPayment, getWhatsAppBillingSummary } from "@/actions/whatsapp-management"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface WhatsAppUsageManagerProps {
  schoolId: string
  initialUsage: {
    sentThisMonth: number
    softLimit: number
    monthYear: string
    whatsappEnabled: boolean
  }
  canEdit: boolean
}

interface BillingSummary {
  totalCost: number
  totalPaid: number
  balance: number
}

export function WhatsAppUsageManager({
  schoolId,
  initialUsage,
  canEdit,
}: WhatsAppUsageManagerProps) {
  const [usage, setUsage] = useState(initialUsage)
  const [newLimit, setNewLimit] = useState(String(initialUsage.softLimit))
  const [savingLimit, setSavingLimit] = useState(false)
  const [resetting, setResetting] = useState(false)

  // Billing states
  const [billing, setBilling] = useState<BillingSummary | null>(null)
  const [loadingBilling, setLoadingBilling] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDesc, setPaymentDesc] = useState("WhatsApp Credit")
  const [paymentStatus, setPaymentStatus] = useState(false)
  const [pricingAmount, setPricingAmount] = useState("0.5")
  const [pricingStatus, setPricingStatus] = useState(false)

  useEffect(() => {
    fetchBilling()
  }, [])

  const fetchBilling = async () => {
    setLoadingBilling(true)
    const summary = await getWhatsAppBillingSummary(schoolId)
    if (summary) setBilling(summary)
    setLoadingBilling(false)
  }

  const usagePercent = usage.softLimit > 0
    ? Math.min(100, Math.round((usage.sentThisMonth / usage.softLimit) * 100))
    : 0

  const statusColor =
    usagePercent >= 90 ? "destructive"
      : usagePercent >= 70 ? "secondary"
        : "default"

  const handleSaveLimit = async () => {
    const parsed = parseInt(newLimit)
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Please enter a valid number")
      return
    }
    setSavingLimit(true)
    const res = await updateWhatsAppSoftLimit(schoolId, parsed)
    setSavingLimit(false)
    if (res.success) {
      setUsage(prev => ({ ...prev, softLimit: parsed }))
      toast.success("Monthly message limit updated")
    } else {
      toast.error(res.error || "Failed to update limit")
    }
  }

  const handleReset = async () => {
    setResetting(true)
    const res = await resetWhatsAppUsage(schoolId)
    setResetting(false)
    if (res.success) {
      setUsage(prev => ({ ...prev, sentThisMonth: 0 }))
      toast.success("Usage counter reset to 0")
    } else {
      toast.error(res.error || "Failed to reset usage")
    }
  }

  const handleUpdatePricing = async () => {
    const val = parseFloat(pricingAmount)
    if (isNaN(val) || val < 0) return toast.error("Invalid price")
    setPricingStatus(true)
    const res = await syncWhatsAppPricing(schoolId, val, new Date())
    setPricingStatus(false)
    if (res.success) {
      toast.success("Message pricing updated on product app")
    } else {
      toast.error(res.error)
    }
  }

  const handleAddPayment = async () => {
    const val = parseFloat(paymentAmount)
    if (isNaN(val) || val <= 0) return toast.error("Invalid amount")
    setPaymentStatus(true)
    const res = await addWhatsAppPayment(schoolId, val, paymentDesc)
    setPaymentStatus(false)
    if (res.success) {
      toast.success("WhatsApp credit added successfully")
      setPaymentAmount("")
      fetchBilling()
    } else {
      toast.error(res.error)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">WhatsApp Usage</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {usage.whatsappEnabled ? (
              <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                Enabled
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>
            )}
          </div>
        </div>
        <CardDescription>
          Monthly usage for {usage.monthYear}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Main Stats Container - Flex for better space distribution */}
        <div className="flex flex-col gap-4">
          {/* Top Section: Metrics and Wallet Side-by-Side on wider containers */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Usage Metrics Section */}
            <div className="flex flex-col justify-between p-4 rounded-xl border bg-muted/20 relative overflow-hidden group min-h-[140px]">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="h-12 w-12" />
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                <MessageCircle className="h-3.5 w-3.5" />
                Usage Metrics
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-3xl font-bold tabular-nums tracking-tight">
                      {usage.sentThisMonth.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">Messages sent this month</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-xs text-muted-foreground font-medium">/</span>
                      <span className="text-lg font-bold text-muted-foreground">
                        {usage.softLimit.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Monthly Limit</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-700",
                        usagePercent >= 90 ? "bg-destructive" : usagePercent >= 70 ? "bg-yellow-500" : "bg-green-500"
                      )}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={cn("font-semibold", statusColor === 'destructive' ? "text-destructive" : "text-muted-foreground")}>
                      {usagePercent}% utilized
                    </span>
                    {usagePercent >= 90 && (
                      <span className="flex items-center gap-1 text-destructive font-bold animate-pulse">
                        <AlertTriangle className="h-3 w-3" />
                        Nearing limit
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="flex flex-col justify-between p-4 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden group min-h-[140px]">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
                <Wallet className="h-12 w-12" />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary/70 mb-4">
                <Landmark className="h-3.5 w-3.5" />
                WhatsApp Wallet
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-primary-foreground/0">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-3xl font-bold tabular-nums tracking-tight text-foreground", billing && billing.balance < 0 ? "text-destructive" : "text-foreground")}>
                        ₹{billing?.balance.toLocaleString() ?? "---"}
                      </p>
                      {loadingBilling && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Available Balance</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-lg font-bold text-muted-foreground">
                      ₹{billing?.totalCost.toLocaleString() ?? "---"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">Lifetime Spent</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm" className="flex-1 h-8 text-xs gap-1.5 font-semibold shadow-sm">
                        <Plus className="h-3.5 w-3.5" /> Add Credit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add WhatsApp Credit</DialogTitle>
                        <DialogDescription>Record a payment for WhatsApp messaging credits.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label>Amount (₹)</Label>
                          <Input type="number" placeholder="500" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input placeholder="Recharge 1000 messages" value={paymentDesc} onChange={e => setPaymentDesc(e.target.value)} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddPayment} disabled={paymentStatus}>
                          {paymentStatus ? "Processing..." : "Confirm Payment"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5 bg-background shadow-xs font-medium">
                        <ReceiptIndianRupee className="h-3.5 w-3.5" /> Pricing
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Message Pricing</DialogTitle>
                        <DialogDescription>Set the cost per successful WhatsApp message for this school.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label>Price per Message (₹)</Label>
                          <Input type="number" step="0.01" value={pricingAmount} onChange={e => setPricingAmount(e.target.value)} />
                          <p className="text-xs text-muted-foreground">Standard cost is ~0.50 including GST.</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleUpdatePricing} disabled={pricingStatus}>
                          {pricingStatus ? "Updating..." : "Update Pricing"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>

          {/* Configurations & Tools Section */}
          {canEdit && (
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-2 mb-1 px-1">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuration & Tools</h4>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Soft Limit Update */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-muted/5">
                  <div className="space-y-0.5">
                    <Label htmlFor="soft-limit" className="text-sm font-semibold">
                      Monthly Soft Limit
                    </Label>
                    <p className="text-[10px] text-muted-foreground max-w-[200px]">
                      Worker pauses broadcasts if this value is exceeded. 0 = unlimited.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Input
                      id="soft-limit"
                      type="number"
                      min={0}
                      value={newLimit}
                      onChange={e => setNewLimit(e.target.value)}
                      className="h-9 text-sm bg-background w-full sm:w-28 font-semibold"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveLimit}
                      disabled={savingLimit}
                      className="h-9 text-xs px-4 font-bold"
                    >
                      {savingLimit ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>

                {/* Reset Tool */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-dashed hover:bg-muted/10 transition-all group">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">Maintenance</p>
                    <p className="text-[10px] text-muted-foreground">Manually zero out this month's counter</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={resetting}
                    className="h-9 text-xs gap-2 font-bold border-destructive/20 text-destructive hover:bg-destructive/10 px-4"
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", resetting && "animate-spin")} />
                    Reset Counter
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
