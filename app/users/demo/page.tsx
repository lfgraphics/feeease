import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
// import DashBoardNav from "../DashboardNav";
export default function Dashboard() {
  const home = "/users/demo";
  return (
    <>
      {/* <DashBoardNav /> */}
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="relative ml-12">
              {/* will program it's functionality and maybe it will become a saparate component and
            which processes the input data with databse and return matched students */}
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search Student..."
                className="w-full rounded-lg bg-background pl-8 md:w-[60%] shadow-md py-2"
              />
            </div>
            <details>
              {/* This will be made functional as well and it may lowse some dropdown labels */}
              <summary style={{ listStyle: "none" }}>
                <Image
                  src="/images/assets/logo.png"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </summary>
              <div className="absolute flex flex-col gap-2 items-start w-44 bg-white rounded-lg shadow-md p-3">
                <button className="check block">Help Center</button>
                <button className="check block">Contact Support</button>
                <button className="check block">Log Out</button>
              </div>
            </details>
          </header>

          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {/* first row of analytics cards */}
                <div>
                  <div className="pb-3">
                    <h3>New Student</h3>
                    <p className="max-w-lg text-balance leading-relaxed">
                      This will dd a new student in your data base
                    </p>
                  </div>
                  <div>
                    <button>
                      Add New Student <Plus className="ml-2" strokeWidth={3} />{" "}
                    </button>
                  </div>
                </div>
              </div>
              {/* Recent transactions Table */}
              <table>
                <thead>
                  <tr>
                    <thead>Customer</thead>
                    <thead className="hidden sm:table-cell">Type</thead>
                    <thead className="hidden sm:table-cell">
                      Status
                    </thead>
                    <thead className="hidden md:table-cell">Date</thead>
                    <thead className="text-right">Amount</thead>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-accent">
                    <td>
                      <div className="font-medium">Liam Johnson</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        liam@example.com
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">Sale</td>
                    <td className="hidden sm:table-cell"></td>
                    <td className="hidden md:table-cell">
                      2023-06-23
                    </td>
                    <td className="text-right">$250.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
