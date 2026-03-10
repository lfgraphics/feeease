'use server';

import dbConnect from "@/lib/db";
import School from "@/models/School";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getMarketingStats(userId: string) {
  const getStats = unstable_cache(
    async (id) => {
      await dbConnect();
      
      const schools = await School.find({ 'referral.referredBy': id });
      
      const totalSchools = schools.length;
      let totalInstallation = 0;
      let totalRecurring = 0;
      let totalEarnings = 0;

      schools.forEach(school => {
        if (school.financials) {
           totalInstallation += school.financials.installationCost || 0;
           if (school.financials.recurringCosts && school.financials.recurringCosts.length > 0) {
             totalRecurring += school.financials.recurringCosts[school.financials.recurringCosts.length - 1].amount || 0;
           }
           // Note: totalEarnings from payments would require querying the Expense model separately
        }
      });

      return {
        totalSchools,
        totalInstallation,
        totalRecurring, // This might just be sum of recurring costs, but earnings is better
        totalEarnings
      };
    },
    ['marketing-stats'],
    { revalidate: 3600, tags: ['marketing-stats'] }
  );

  return getStats(userId);
}

export async function getReferredSchools(userId: string, cursor?: string, limit: number = 10, filters?: any) {
  await dbConnect();

  let query: any = { 'referral.referredBy': userId };

  if (cursor) {
    query._id = { $lt: cursor };
  }
  
  if (filters?.startDate && filters?.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate)
    };
  }

  const schools = await School.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasNextPage = schools.length > limit;
  const data = hasNextPage ? schools.slice(0, limit) : schools;
  const nextCursor = hasNextPage ? (data[data.length - 1] as any)._id : null;

  return {
    schools: JSON.parse(JSON.stringify(data)),
    nextCursor
  };
}

export async function getMarketingDashboardData() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  
  // Parallel fetch
  const [stats, schoolsData] = await Promise.all([
    getMarketingStats(userId),
    getReferredSchools(userId, undefined, 10)
  ]);

  return {
    stats,
    schools: schoolsData.schools,
    nextCursor: schoolsData.nextCursor
  };
}
