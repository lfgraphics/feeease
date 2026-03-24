"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { createOffer, updateOffer, deleteOffer } from "@/actions/offers";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Gift, Users, Calendar, Award } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Offer {
  _id: string;
  title: string;
  description: string;
  referralTarget: number;
  rewardMonths: number;
  validUntil: string;
  isActive: boolean;
}

interface OffersManagerProps {
  initialOffers: Offer[];
}

const emptyForm = {
  title: "",
  description: "",
  referralTarget: 20,
  rewardMonths: 6,
  validUntil: new Date("2027-04-30"),
  isActive: true,
};

export function OffersManager({ initialOffers }: OffersManagerProps) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const resetForm = () => setForm({ ...emptyForm });

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.validUntil) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const created = await createOffer({
        ...form,
        validUntil: form.validUntil,
      });
      setOffers((prev) => [created, ...prev]);
      toast.success("Offer created successfully");
      setCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create offer");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editOffer) return;
    setLoading(true);
    try {
      const updated = await updateOffer(editOffer._id, {
        ...form,
        validUntil: form.validUntil,
      });
      setOffers((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      toast.success("Offer updated successfully");
      setEditOffer(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to update offer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o._id !== id));
      toast.success("Offer deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete offer");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      const updated = await updateOffer(offer._id, { isActive: !offer.isActive });
      setOffers((prev) => prev.map((o) => (o._id === offer._id ? updated : o)));
      toast.success(updated.isActive ? "Offer activated" : "Offer deactivated");
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle offer");
    }
  };

  const openEdit = (offer: Offer) => {
    setEditOffer(offer);
    setForm({
      title: offer.title,
      description: offer.description,
      referralTarget: offer.referralTarget,
      rewardMonths: offer.rewardMonths,
      validUntil: new Date(offer.validUntil),
      isActive: offer.isActive,
    });
  };

  const OfferForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Offer Title *</Label>
        <Input
          placeholder="e.g., School Referral Reward Program"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Description *</Label>
        <Textarea
          placeholder="e.g., Refer 20 schools and get 6 months free recurring payment"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Referral Target (schools) *</Label>
          <Input
            type="number"
            min={1}
            value={form.referralTarget}
            onChange={(e) => setForm({ ...form, referralTarget: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Free Months Reward *</Label>
          <Input
            type="number"
            min={1}
            value={form.rewardMonths}
            onChange={(e) => setForm({ ...form, rewardMonths: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Valid Until *</Label>
        <DatePicker
          date={form.validUntil}
          setDate={(date) => setForm({ ...form, validUntil: date || new Date() })}
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={form.isActive}
          onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
        />
        <Label>Active</Label>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Referral Offers</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage offers for schools based on referral milestones.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" /> Create New Offer
              </DialogTitle>
            </DialogHeader>
            <OfferForm onSubmit={handleCreate} submitLabel="Create Offer" />
          </DialogContent>
        </Dialog>
      </div>

      {offers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Gift className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-medium">No offers yet</p>
            <p className="text-sm mt-1">Create your first referral offer to incentivize school referrals.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {offers.map((offer) => {
            const isExpired = new Date(offer.validUntil) < new Date();
            return (
              <Card key={offer._id} className={`transition-all ${!offer.isActive || isExpired ? 'opacity-60' : 'border-primary/20'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        {offer.title}
                        {offer.isActive && !isExpired ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">Active</Badge>
                        ) : isExpired ? (
                          <Badge variant="secondary">Expired</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">{offer.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={offer.isActive}
                        onCheckedChange={() => handleToggleActive(offer)}
                        disabled={isExpired}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                      <Users className="h-4 w-4 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="text-sm font-semibold">{offer.referralTarget} schools</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                      <Award className="h-4 w-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="text-sm font-semibold">{offer.rewardMonths} months free</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                      <Calendar className="h-4 w-4 text-rose-500 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Valid Until</p>
                        <p className="text-sm font-semibold">{format(new Date(offer.validUntil), "dd MMM yyyy")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog open={editOffer?._id === offer._id} onOpenChange={(open) => { if (!open) { setEditOffer(null); resetForm(); } }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => openEdit(offer)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Pencil className="h-5 w-5 text-primary" /> Edit Offer
                          </DialogTitle>
                        </DialogHeader>
                        <OfferForm onSubmit={handleUpdate} submitLabel="Update Offer" />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Offer?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &quot;{offer.title}&quot;. Schools that already qualified won&apos;t lose their earned reward, but future tracking for this offer will stop.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(offer._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
