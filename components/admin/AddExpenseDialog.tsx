"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createExpense, getMarketingUsers } from "@/actions/finances";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";

import { Loader2, Plus } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(1, "Category is required"),
  paidToName: z.string().optional(),
  paidTo: z.string().optional(), // Marketing User ID
  date: z.date().optional(),
});

export function AddExpenseDialog({ onExpenseAdded }: { onExpenseAdded: (expense: any) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marketingUsers, setMarketingUsers] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
        getMarketingUsers().then(setMarketingUsers).catch(console.error);
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      paidToName: "",
      paidTo: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const newExpense = await createExpense({
        ...values,
        amount: Number(values.amount),
        date: values.date ? new Date(values.date) : new Date(),
        paidTo: values.paidTo || undefined,
        paidToName: values.paidToName || undefined,
      });
      toast.success("Expense added successfully");
      setOpen(false);
      form.reset();
      onExpenseAdded(newExpense);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add expense";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const category = form.watch("category");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record a new expense transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Server costs, Commission..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Commission">Commission</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Server Cost">Server Cost</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(category === 'Commission' || category === 'Salary' || category === 'Marketing') && (
                 <FormField
                 control={form.control}
                 name="paidTo"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Select Marketing Staff (Optional)</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select user" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {marketingUsers.map((user) => (
                            <SelectItem key={user._id} value={user._id}>{user.fullName}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
            )}

            <FormField
              control={form.control}
              name="paidToName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid To Name (External)</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of recipient" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Expense
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}