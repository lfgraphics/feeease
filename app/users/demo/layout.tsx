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

// constants.ts
export const home = "/users/demo";

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

            <div>classes will be listed here</div>

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
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r bg-background sm:flex">
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

          <div>classes will be listed here</div>

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
      <div className="sm:ml-14">{children}</div>
    </>
  );
}
