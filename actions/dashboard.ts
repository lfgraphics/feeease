"use server"

import dbConnect from "@/lib/db";
import School from "@/models/School";
import { addDays, startOfDay } from "date-fns";
import { unstable_cache } from "next/cache";

export const getDashboardStats = unstable_cache(
  async () => {
    await dbConnect();
    
    const today = startOfDay(new Date());
    const next7Days = addDays(today, 7);
    const next30Days = addDays(today, 30);

    const totalSchools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ "subscription.status": "active" });
    const trialSchools = await School.countDocuments({ "subscription.status": "trial" });
    const pendingDeployments = await School.countDocuments({ "deployment.status": "pending" });

    // Fetch expiring licenses
    const expiringTomorrow = await School.find({
      "license.expiresAt": { 
        $gte: today, 
        $lt: addDays(today, 2) 
      }
    }).select("name license.expiresAt _id").lean();

    const expiringWeek = await School.find({
      "license.expiresAt": { 
        $gte: today, 
        $lt: next7Days 
      }
    }).select("name license.expiresAt _id").lean();

    const expiringMonth = await School.find({
      "license.expiresAt": { 
        $gte: today, 
        $lt: next30Days 
      }
    }).select("name license.expiresAt _id").lean();

    return {
        totalSchools,
        activeSchools,
        trialSchools,
        pendingDeployments,
        expiringTomorrow: expiringTomorrow.map((s: any) => ({ ...s, _id: s._id.toString() })),
        expiringWeek: expiringWeek.map((s: any) => ({ ...s, _id: s._id.toString() })),
        expiringMonth: expiringMonth.map((s: any) => ({ ...s, _id: s._id.toString() }))
    };
  },
  ['dashboard-stats'],
  { revalidate: 3600, tags: ['dashboard-stats'] }
);
