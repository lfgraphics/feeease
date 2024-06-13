import Image from "next/image";

import {
  FilePlus,
  NotepadText,
  Search,
  UserPlus,
  UserRoundSearch,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Progress } from "@/components/ui/progress";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import MonthlyFeeChart from "@/components/Chart";
import Link from "next/link";
import { home } from "./layout";

export default function Dashboard() {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const data = [12000, 11500, 12000, 15000, 12000, 11500, 13000, 12000, 12000, 11500, 13000, 15000];

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 sm:-ml-8">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Student"
                className="w-full rounded-lg bg-white pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Image
                    src="/images/assets/logo.png"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card
                  x-chunk="dashboard-05-chunk-2"
                  className="insights sm:col-span-2"
                >
                  <CardHeader className="pb-2">
                    <CardTitle>Total amount collected each month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className=" min-w-[300px] max-w-[100%]">
                      <MonthlyFeeChart
                        labels={labels}
                        data={data}
                        fillType="filled"
                        width="100%"
                        height="150px"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-05-chunk-1" className="revenue">
                  <CardHeader className="pb-2">
                    <CardTitle>Total Revenue</CardTitle>
                    <CardTitle className="text-4xl">$1,329</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      +25% from last week
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={25} aria-label="25% increase" />
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-05-chunk-2" className="pending">
                  <CardHeader className="pb-2">
                    <CardTitle>Pendign This Month</CardTitle>
                    <CardTitle className="text-4xl">$5,329</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      +10% from last month
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={12} aria-label="12% increase" />
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-05-chunk-2" className="reminders">
                  <CardHeader className="pb-2">
                    <CardTitle>Reminders</CardTitle>
                    <CardTitle className="text-4xl">$5,329</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      +10% from last month
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Progress value={12} aria-label="12% increase" />
                  </CardFooter>
                </Card>
                <Card className="student" x-chunk="dashboard-05-chunk-0">
                  <CardHeader className="pb-3">
                    <CardTitle>New Student</CardTitle>
                  </CardHeader>
                  <Link href={`${home}/addstudent`} className="text-center">
                    <CardContent className="text-center flex flex-col justify-center items-center mt-6">
                      <UserPlus size={48} strokeWidth={3} />
                      <CardDescription className="pt-3">
                        Add new Student
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="class" x-chunk="dashboard-05-chunk-0">
                  <CardHeader className="pb-3">
                    <CardTitle>New Class</CardTitle>
                  </CardHeader>
                  <Link href={`${home}/addclass`} className="text-center">
                    <CardContent className="text-center flex flex-col justify-center items-center mt-6">
                      <FilePlus size={48} strokeWidth={3} />
                      <CardDescription className="pt-3">
                        Add new Class
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="find" x-chunk="dashboard-05-chunk-0">
                  <CardHeader className="pb-3">
                    <CardTitle>Find</CardTitle>
                  </CardHeader>
                  <Link href={`${home}/find`} className="text-center">
                    <CardContent className="text-center flex flex-col justify-center items-center mt-6">
                      <UserRoundSearch size={48} strokeWidth={3} />
                      <CardDescription className="pt-3">
                        Find Student
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="report" x-chunk="dashboard-05-chunk-0">
                  <CardHeader className="pb-3">
                    <CardTitle>Report</CardTitle>
                  </CardHeader>
                  <Link href={`${home}/report`} className="text-center">
                    <CardContent className="text-center flex flex-col justify-center items-center mt-6">
                      <NotepadText size={48} strokeWidth={3} />
                      <CardDescription className="pt-3">
                        Generate and Print Report
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
                <Card
                  x-chunk="dashboard-05-chunk-2"
                  className="insights sm:col-span-3"
                >
                  <CardHeader className="pb-2">
                    <CardTitle>Total amount collected each month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className=" min-w-[300px] max-w-[100%]">
                      <MonthlyFeeChart
                        labels={labels}
                        data={data}
                        fillType="filled"
                        width="100%"
                        height="150px"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Payments</CardTitle>
                  <CardTitle>Most recent paid fees.</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Type (Monthly/ Examination)
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Month/ Exam
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-accent">
                        <TableCell>
                          <div className="font-medium">Yusuf Khan</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            yusuf.5678
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          Monthly
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          July
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          13-05-2024
                        </TableCell>
                        <TableCell className="text-right">₹300</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
