import {
  LayoutDashboard,
  LayoutDashboardIcon,
  PanelLeft,
  ReceiptText,
  Table2Icon,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const home = "/users/demo";

const classes = ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd"];

export default function DashBoardNav({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href={home}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LayoutDashboardIcon className="h-5 w-5" />
              Dashboard
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id="ddm"
                  variant="outline"
                  size="default"
                  className="overflow-hidden w-32"
                >
                  Classes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {classes.map((item, index) => (
                  <DropdownMenuItem>
                    <Link
                      key={index}
                      href={`${home}/class/${item}`}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href={`${home}/rct`}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <ReceiptText className="h-5 w-5" />
              Receipt
            </Link>

            <Link
              href={`${home}/db`}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Table2Icon className="h-5 w-5" />
              Paid Fees
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-24 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={home}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="w-20">
                Classes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="flex flex-col gap-2 items-start p-4"
            >
              {classes.map((item, index) => (
                <DropdownMenuItem>
                  <Link
                    key={index}
                    className="w-full"
                    href={`${home}/class/${item}`}
                  >
                    {item}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`${home}/rct`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <ReceiptText className="h-5 w-5" />
                  <span className="sr-only">Receipt</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Receipt</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`${home}/db`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Table2Icon className="h-5 w-5" />
                  <span className="sr-only">Paid Fees</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Paid Fees</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="ml-4 sm:ml-24 sm:mr-4 my-4">{children}</div>
    </>
  );
}
