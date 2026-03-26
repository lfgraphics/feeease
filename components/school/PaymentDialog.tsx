"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, History, Banknote, QrCode, Send, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface PaymentDialogProps {
  school: {
    _id: string;
    name: string;
    adminName: string;
    adminMobile: string;
  };
}

export function PaymentDialog({ school }: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    transactionId: "",
    paymentFor: "recurring",
  });

  const handleNext = () => {
    if (!formData.amount || !formData.transactionId) {
      toast.error("Please fill all fields");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmRedirect = () => {
    const message = `Hello FeeEase Team,

I have just made a payment for my school. Here are the details:

*School ID:* ${school._id}
*School Name:* ${school.name}
*Admin Name:* ${school.adminName}
*Admin Mobile:* ${school.adminMobile}

*Paid Amount:* ₹${formData.amount}
*Transaction ID/Ref ID:* ${formData.transactionId}
*Payment For:* ${formData.paymentFor.charAt(0).toUpperCase() + formData.paymentFor.slice(1)}

Please find the attached payment confirmation screenshot.
Waiting for your review and approval.

Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/15559376765?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setOpen(false);
    setShowConfirm(false);
    setFormData({ amount: "", transactionId: "", paymentFor: "recurring" });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setShowConfirm(false);
    }}>
      <DialogTrigger asChild>
        <Button className="font-semibold shadow-lg hover:scale-105 transition-transform">
          <CreditCard className="mr-2 h-4 w-4" />
          Make a Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {!showConfirm ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Subscription Payment</DialogTitle>
              <DialogDescription>
                Pay for your school's installation, recurring charges, or WhatsApp credits.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="bank" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bank" className="gap-2">
                  <Banknote className="h-4 w-4" /> Details
                </TabsTrigger>
                <TabsTrigger value="action" className="gap-2">
                  <History className="h-4 w-4" /> Post Payment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bank" className="space-y-4 pt-4">
                <div className="rounded-lg border bg-muted/40 p-4 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bank Details</p>
                    <p className="font-bold text-sm">FEDERAL BANK</p>
                    <p className="text-sm font-medium">TAHA KAZMI</p>
                    <p className="text-sm">A/C: <span className="font-mono font-bold">777770123418739</span></p>
                    <p className="text-sm">IFSC: <span className="font-mono font-bold">FDRL0007777</span></p>
                  </div>

                  <div className="border-t pt-4 space-y-2 text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Scan to Pay via UPI</p>
                    <div className="bg-white p-2 inline-block rounded-lg shadow-sm border mx-auto">
                      <Image src="/images/UPI.png" alt="UPI QR Code" width={128} height={128} />
                    </div>
                    <p className="font-mono text-sm font-bold mt-2">6393440986@jupiteraxis</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="action" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">School ID</Label>
                    <Input value={school._id} readOnly className="bg-muted text-xs h-8" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Admin Name</Label>
                    <Input value={school.adminName} readOnly className="bg-muted text-xs h-8" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Paid Amount (₹)</Label>
                  <Input
                    id="amount"
                    placeholder="e.g. 5000"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="txId">Transaction / Reference ID</Label>
                  <Input
                    id="txId"
                    placeholder="UTR / Txn ID from bank app"
                    value={formData.transactionId}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment For</Label>
                  <Select
                    value={formData.paymentFor}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, paymentFor: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="installation">Installation Fee</SelectItem>
                      <SelectItem value="recurring">Subscription Fee</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp Credits</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full mt-4 gap-2 h-10" onClick={handleNext}>
                  <Send className="h-4 w-4" />
                  Submit Info
                </Button>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="py-6 space-y-6 text-center">
            <div className="flex justify-center flex-col items-center">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 border-2 border-blue-100 shadow-inner">
                <Send className="h-8 w-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold">Important Step!</h3>
            </div>

            <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-left">
              <p className="text-sm leading-relaxed text-slate-700">
                You will now be redirected to **WhatsApp** to share your payment info with the FeeEase team for review and approval.
              </p>
              <div className="flex items-start gap-2 bg-white/80 p-3 rounded-lg border border-blue-100/50 shadow-sm">
                <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[13px] font-semibold text-blue-900">
                  Please remember to attach the payment confirmation screenshot in the WhatsApp chat.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button className="w-full h-12 text-md font-bold bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 shadow-lg shadow-green-100" onClick={handleConfirmRedirect}>
                Confirm & Redirect
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setShowConfirm(false)}>
                Go Back
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
