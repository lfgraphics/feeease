"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StatusFilter({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", value);
    params.set("page", "1"); // Reset to page 1
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={defaultValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="trial">Trial</SelectItem>
        <SelectItem value="expired">Expired</SelectItem>
        <SelectItem value="suspended">Suspended</SelectItem>
      </SelectContent>
    </Select>
  );
}
