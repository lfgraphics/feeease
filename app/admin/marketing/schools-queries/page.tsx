import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSchoolQueries, getSchoolQueriesStats } from "@/actions/schoolQueries";
import SchoolQueriesClient from "@/components/SchoolQueriesClient";

export default async function MarketingQueriesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "marketing") {
    if (session?.user.role?.includes('admin')) {
      redirect('/admin/schools-queries');
    }
    redirect('/admin/login');
  }

  // for marketing we still support filters but restrict to referral user inside action
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = 10;
  const query = typeof searchParams.query === 'string' ? searchParams.query : undefined;
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const from = typeof searchParams.from === 'string' ? searchParams.from : undefined;
  const to = typeof searchParams.to === 'string' ? searchParams.to : undefined;

  const { queries, totalPages } = await getSchoolQueries({ page, limit, query, status: status as any, from, to, referrerEmail: session.user.email || '' });
  const stats = await getSchoolQueriesStats({ from, to, referrerEmail: session.user.email || '' });

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
