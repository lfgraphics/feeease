"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { getExpenses, deleteExpense } from "@/actions/finances";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/context/ConfirmDialogContext";

export function ExpenseManager({ initialExpenses, initialCursor }: any) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const { confirm } = useConfirm();

  const loadMore = async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const result = await getExpenses(cursor, 10);
      setExpenses((prev: any[]) => [...prev, ...result.expenses]);
      setCursor(result.nextCursor);
    } catch (error) {
      toast.error("Failed to load more expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = (newExpense: any) => {
      // Add new expense to the beginning of the list
      setExpenses((prev: any[]) => [newExpense, ...prev]);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
        title: "Delete Transaction",
        description: "Are you sure you want to delete this transaction? This action cannot be undone.",
        confirmText: "Delete",
        variant: "destructive",
    });

    if (!isConfirmed) return;

    try {
        await deleteExpense(id);
        setExpenses((prev: any[]) => prev.filter((expense) => expense._id !== id));
        toast.success("Transaction deleted successfully");
    } catch (error) {
        toast.error("Failed to delete transaction");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Transactions</h3>
        <AddExpenseDialog onExpenseAdded={handleExpenseAdded} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Paid To / From</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No transactions recorded.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense: any) => (
                <TableRow key={expense._id}>
                  <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.paidToName || expense.paidTo?.fullName || "-"}</TableCell>
                  <TableCell className={`text-right font-medium ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{expense.type}</TableCell>
                  <TableCell className="capitalize">{expense.status}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(expense._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {cursor && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
