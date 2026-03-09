"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface DeleteSchoolDialogProps {
  schoolId: string;
  schoolName: string;
  variant?: "default" | "icon";
}

export function DeleteSchoolDialog({ schoolId, schoolName, variant = "default" }: DeleteSchoolDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmationText !== schoolName) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/schools/${schoolId}`, {
        method: "DELETE",
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success("School deleted permanently");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(data.error || "Failed to delete school");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
            </Button>
        ) : (
            <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-destructive/50">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
             <AlertTriangle className="h-6 w-6" />
             <DialogTitle>Delete School Permanently?</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the school 
            <span className="font-bold text-foreground"> "{schoolName}" </span>
            and all associated data (students, fees, transactions) from the database.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
             <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                Warning: This is a hard delete operation. Data recovery is not possible.
             </div>
             
             <div className="space-y-2">
                <Label htmlFor="confirm">
                    To confirm, type <span className="font-bold select-all">{schoolName}</span> below:
                </Label>
                <Input
                    id="confirm"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder={schoolName}
                    className="border-destructive/30 focus-visible:ring-destructive"
                    autoComplete="off"
                />
             </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={confirmationText !== schoolName || loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}