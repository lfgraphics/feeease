import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSchoolQueries, getSchoolQueriesStats } from "@/actions/schoolQueries";
import SchoolQueriesClient from "@/components/SchoolQueriesClient";

export default async function SchoolQueriesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const resolvedSearchParams = await searchParams;

  const session = await getServerSession(authOptions);
  if (!session || !session.user.role?.includes("admin")) {
    if (session?.user.role === "marketing") {
      redirect('/admin/marketing/schools-queries');
    }
    redirect('/admin/login');
  }

  // parse search params for initial data
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
  const limit = 10;
  const query = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined;
  const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined;
  const from = typeof resolvedSearchParams.from === 'string' ? resolvedSearchParams.from : undefined;
  const to = typeof resolvedSearchParams.to === 'string' ? resolvedSearchParams.to : undefined;

  const { queries, totalPages } = await getSchoolQueries({ page, limit, query, status: status as any, from, to });
  const stats = await getSchoolQueriesStats({ from, to });

  const simpleQueries = queries.map((q: any) => ({
    _id: String(q._id || ""),
    schoolName: q.schoolName,
    schoolLogo: q.schoolLogo,
    query: q.query,
    adminName: q.adminName,
    adminMobile: q.adminMobile,
    contactPersonName: q.contactPersonName,
    contactPersonMobile: q.contactPersonMobile,
    status: q.status,
    note: q.note,
    assigned: q.assigned
      ? { _id: String(q.assigned._id || ""), name: q.assigned.name, email: q.assigned.email }
      : undefined,
    createdAt: typeof q.createdAt === "string" ? q.createdAt : new Date(q.createdAt).toISOString(),
  }));

  return (
    <SchoolQueriesClient
      initialQueries={simpleQueries}
      initialStats={stats}
      initialPage={page}
    />
  );
}
