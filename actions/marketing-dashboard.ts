'use server';

import dbConnect from "@/lib/db";
import School from "@/models/School";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";

// Helper to construct the common pipeline for both stats and listing
const getPaymentStatusPipeline = () => [
  {
    $lookup: {
      from: 'expenses',
      let: { schoolId: '$_id' },
      pipeline: [
        { $match: { $expr: { $and: [{ $eq: ['$schoolId', '$$schoolId'] }, { $eq: ['$type', 'income'] }] } } }
      ],
      as: 'payments'
    }
  },
  {
    $addFields: {
      totalPaid: { $sum: '$payments.amount' },
      latestPayment: { $arrayElemAt: [{ $sortArray: { input: '$payments', sortBy: { date: -1 } } }, 0] },
      
      // Calculate periods elapsed
      monthsElapsed: {
        $dateDiff: {
          startDate: { $ifNull: ["$subscription.startDate", "$createdAt"] },
          endDate: "$$NOW",
          unit: "month"
        }
      },
      
      // Get the latest recurring cost
      currentRecurringCost: {
        $let: {
          vars: {
            lastRecurring: { $arrayElemAt: [{ $slice: ["$financials.recurringCosts", -1] }, 0] }
          },
          in: { $ifNull: ["$$lastRecurring.amount", 0] }
        }
      }
    }
  },
  {
    $addFields: {
      periodsDue: {
        $switch: {
          branches: [
            { case: { $eq: ["$financials.planType", "monthly"] }, then: { $add: ["$monthsElapsed", 1] } },
            { case: { $eq: ["$financials.planType", "quarterly"] }, then: { $add: [{ $floor: { $divide: ["$monthsElapsed", 3] } }, 1] } },
            { case: { $eq: ["$financials.planType", "yearly"] }, then: { $add: [{ $floor: { $divide: ["$monthsElapsed", 12] } }, 1] } }
          ],
          default: { $add: ["$monthsElapsed", 1] } // Default to monthly if unknown
        }
      }
    }
  },
  {
    $addFields: {
      expectedTotal: {
        $add: [
          { $ifNull: ["$financials.installationCost", 0] },
          { $multiply: ["$periodsDue", "$currentRecurringCost"] }
        ]
      }
    }
  },
  {
    $addFields: {
      isCleared: { $gte: ["$totalPaid", "$expectedTotal"] }
    }
  }
];

export async function getMarketingStats(userId: string) {
  return unstable_cache(
    async (id: string) => {
      await dbConnect();
      
      const userObjectId = new mongoose.Types.ObjectId(id);

      // Aggregation for schools stats
      const schoolStats = await School.aggregate([
        { $match: { 'referral.referredBy': userObjectId } },
        ...getPaymentStatusPipeline(),
        {
          $group: {
            _id: null,
            totalSchools: { $sum: 1 },
            clearedSchools: { $sum: { $cond: ['$isCleared', 1, 0] } },
            unclearSchools: { $sum: { $cond: ['$isCleared', 0, 1] } }
          }
        }
      ]);

      // Aggregation for earnings (expenses paid to this user)
      const earningStats = await Expense.aggregate([
        { $match: { paidTo: userObjectId } },
        { $group: { _id: null, totalEarnings: { $sum: '$amount' } } }
      ]);

      const stats = schoolStats[0] || { totalSchools: 0, clearedSchools: 0, unclearSchools: 0 };
      const earnings = earningStats[0] || { totalEarnings: 0 };

      return {
        totalSchools: stats.totalSchools,
        clearedSchools: stats.clearedSchools,
        unclearSchools: stats.unclearSchools,
        totalEarnings: earnings.totalEarnings
      };
    },
    ['marketing-stats'],
    { revalidate: 3600, tags: ['marketing-stats', `marketing-stats-${userId}`] }
  )(userId);
}

export async function getReferredSchools(userId: string, cursor?: string, limit: number = 10, filters?: any) {
  return unstable_cache(
    async (uid: string, c: string | undefined, l: number, f?: any) => {
      await dbConnect();

      const userObjectId = new mongoose.Types.ObjectId(uid);
      const matchStage: any = { 'referral.referredBy': userObjectId };

      // Search filter
      if (f?.search) {
        matchStage.name = { $regex: f.search, $options: 'i' };
      }
      
      // Date range filter
      if (f?.startDate && f?.endDate) {
        matchStage.createdAt = {
          $gte: new Date(f.startDate),
          $lte: new Date(f.endDate)
        };
      }

      // Cursor pagination
      if (c) {
        matchStage._id = { $lt: new mongoose.Types.ObjectId(c) };
      }

      const pipeline: any[] = [
        { $match: matchStage },
        { $sort: { _id: -1 } },
        ...getPaymentStatusPipeline(),
        {
          $addFields: {
            paymentStatus: {
              $cond: {
                if: "$isCleared",
                then: 'cleared',
                else: 'due'
              }
            }
          }
        }
      ];

      // Apply payment status filter
      if (f?.paymentStatus && f.paymentStatus !== 'all') {
        pipeline.push({
          $match: { paymentStatus: f.paymentStatus }
        });
      }

      // Limit + 1 for pagination check
      pipeline.push({ $limit: l + 1 });

      const schools = await School.aggregate(pipeline);

      const hasNextPage = schools.length > l;
      const data = hasNextPage ? schools.slice(0, l) : schools;
      const nextCursor = hasNextPage ? data[data.length - 1]._id : null;

      return {
        schools: JSON.parse(JSON.stringify(data)),
        nextCursor
      };
    },
    ['marketing-referred-schools'],
    { revalidate: 300, tags: ['marketing-schools', `marketing-schools-${userId}`] }
  )(userId, cursor, limit, filters);
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
