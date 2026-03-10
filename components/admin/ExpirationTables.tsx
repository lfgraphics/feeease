"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { ExternalLink, AlertCircle, CalendarDays } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ExpirationTablesProps {
  expiringTomorrow: any[];
  expiringWeek: any[];
  expiringMonth: any[];
}

export function ExpirationTables({ expiringTomorrow, expiringWeek, expiringMonth }: ExpirationTablesProps) {
  
  function SchoolTable({ schools }: { schools: any[] }) {
    if (schools.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/10 rounded-md border border-dashed">
          <p>No schools found in this category.</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school._id}>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell>{format(new Date(school.license.expiresAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/schools/${school._id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>License Expirations</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="48h" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="48h" className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        Expiring Soon (48h)
                        <span className="ml-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                            {expiringTomorrow.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="week" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-orange-500" />
                        This Week
                        <span className="ml-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-semibold text-orange-500">
                            {expiringWeek.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="month" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-yellow-500" />
                        This Month
                        <span className="ml-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-500">
                            {expiringMonth.length}
                        </span>
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="48h">
                    <SchoolTable schools={expiringTomorrow} />
                </TabsContent>
                <TabsContent value="week">
                    <SchoolTable schools={expiringWeek} />
                </TabsContent>
                <TabsContent value="month">
                    <SchoolTable schools={expiringMonth} />
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
