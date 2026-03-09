import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusFilter } from "@/components/admin/StatusFilter";
import { getSchools } from "@/actions/schools";

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { schools, totalPages, currentPage, totalSchools } = await getSchools(searchParams);

  const query = typeof searchParams.query === 'string' ? searchParams.query : '';
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : 'all';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <form>
                <Input 
                    name="query" 
                    placeholder="Search by school, admin, mobile..." 
                    className="pl-8" 
                    defaultValue={query}
                />
            </form>
        </div>
        <div className="w-full sm:w-[200px]">
             <StatusFilter defaultValue={statusFilter} />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>License Status</TableHead>
              <TableHead>Deployment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No schools found matching your criteria.
                    </TableCell>
                </TableRow>
            ) : (
                schools.map((school) => (
                <TableRow key={school._id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>
                    <div className="flex flex-col">
                        <span>{school.adminName}</span>
                        <span className="text-xs text-muted-foreground">{school.adminMobile}</span>
                    </div>
                    </TableCell>
                    <TableCell>{school.subscription.plan}</TableCell>
                    <TableCell>
                        {school.displayStatus === 'destructive' && <Badge variant="destructive">Expired</Badge>}
                        {school.displayStatus === 'default' && <Badge variant="default">Active</Badge>}
                        {school.displayStatus === 'secondary' && <Badge variant="secondary">{school.subscription.status}</Badge>}
                    </TableCell>
                    <TableCell>
                    <Badge variant={school.deployment.status === 'deployed' ? 'outline' : 'destructive'}>
                        {school.deployment.status}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    <Link href={`/admin/schools/${school._id}`}>
                        <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                        </Button>
                    </Link>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <div className="text-sm text-muted-foreground mr-4">
            Page {currentPage} of {totalPages || 1}
        </div>
        <Link href={`?page=${Math.max(1, currentPage - 1)}&query=${query}&status=${statusFilter}`}>
            <Button variant="outline" size="sm" disabled={currentPage <= 1}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
            </Button>
        </Link>
        <Link href={`?page=${Math.min(totalPages, currentPage + 1)}&query=${query}&status=${statusFilter}`}>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </Link>
      </div>
    </div>
  );
}
