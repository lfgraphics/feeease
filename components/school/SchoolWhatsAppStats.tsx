"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"


interface SchoolWhatsAppStatsProps {
  usage: {
    sentThisMonth: number
    softLimit: number
    monthYear: string
    whatsappEnabled: boolean
  }
}

export function SchoolWhatsAppStats({ usage }: SchoolWhatsAppStatsProps) {
  const usagePercent = usage.softLimit > 0
    ? Math.min(100, Math.round((usage.sentThisMonth / usage.softLimit) * 100))
    : 0

  const remaining = Math.max(0, usage.softLimit - usage.sentThisMonth)

  if (!usage.whatsappEnabled) {
    return (
      <Card className="opacity-60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">WhatsApp Notifications</CardTitle>
          </div>
          <CardDescription>
            WhatsApp integration is not enabled for your school. Contact support to activate it.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">WhatsApp Usage</CardTitle>
          </div>
          <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
            Active
          </Badge>
        </div>
        <CardDescription>Current billing period: {usage.monthYear}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Usage Progress
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-3xl font-bold tabular-nums tracking-tight">
                    {usage.sentThisMonth.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">Messages sent</p>
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
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-700",
                    usagePercent >= 90 ? "bg-destructive" : usagePercent >= 70 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground font-medium">{usagePercent}% utilized</span>
                {usagePercent >= 90 && (
                  <span className="flex items-center gap-1 text-destructive font-bold animate-pulse">
                    <AlertTriangle className="h-3 w-3" /> Nearing Limit
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-primary/5 space-y-3">
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary/70">
              <CheckCircle className="h-3.5 w-3.5" />
              Available Allowance
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tabular-nums text-primary">{remaining.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Messages remaining until limit</p>
            </div>
            <div className="pt-2 border-t border-primary/10">
              <Badge variant="outline" className="text-[10px] items-center gap-1 bg-background">
                Next reset: {new Date().toLocaleString('default', { month: 'long' })} End
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Monthly counters reset automatically on the 1st of every month. For limit increases, please contact administrative support.
        </p>
      </CardContent>
    </Card>
  )
}
