"use server"

import dbConnect from "@/lib/db";
import School from "@/models/School";
import AdminUser from "@/models/AdminUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Expense from "@/models/Expense";

export async function updateReferralCode(schoolId: string, code: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.role?.includes('admin')) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  
  const school = await School.findById(schoolId);
  if (!school) throw new Error("School not found");

  if (school.referral?.code) {
    throw new Error("Referral code already set");
  }

  const marketingUser = await AdminUser.findOne({ referralCode: code, role: 'marketing' });
  if (!marketingUser) {
    throw new Error("Invalid referral code");
  }

  school.referral = {
    code,
    referredBy: marketingUser._id
  };

  await school.save();
  return { success: true };
}

export async function updateFinancials(schoolId: string, data: { installationCost?: number, recurringCost?: number, effectiveDate?: Date, planType?: string }) {
  console.log(data)
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const isAdmin = session.user.role?.includes('admin');
  const isMarketing = session.user.role === 'marketing';

  if (!isAdmin && !isMarketing) {
     throw new Error("Unauthorized");
  }

  await dbConnect();

  if (isMarketing) {
      // Check ownership
      const school = await School.findById(schoolId).select('referral.referredBy');
      if (!school) throw new Error("School not found");
      
      if (school.referral?.referredBy?.toString() !== session.user.id) {
          throw new Error("Unauthorized: You can only edit schools you referred.");
      }
  }
  
  const update: any = {};
  if (data.installationCost !== undefined) update['financials.installationCost'] = data.installationCost;
  if (data.planType !== undefined) update['financials.planType'] = data.planType;

  if (data.recurringCost !== undefined) {
      console.log("Updating recurring cost:", { schoolId, amount: data.recurringCost, date: data.effectiveDate });
      
      const result = await School.findOneAndUpdate(
          { _id: schoolId },
          {
              $set: update,
              $push: {
                  'financials.recurringCosts': {
                      amount: data.recurringCost,
                      effectiveDate: data.effectiveDate || new Date()
                  }
              }
          },
          { new: true }
      );
      console.log("Update result:", result);
  } else {
      await School.updateOne({ _id: schoolId }, { $set: update });
  }

  return { success: true };
}

export async function addPayment(schoolId: string, payment: { amount: number, date: Date, method: string, transactionId?: string, status: string, type: string, billingPeriod?: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const isAdmin = session.user.role?.includes('admin');
  const isMarketing = session.user.role === 'marketing';

  if (!isAdmin && !isMarketing) {
     throw new Error("Unauthorized");
  }

  await dbConnect();

  const school = await School.findById(schoolId);
  if (!school) throw new Error("School not found");

  if (isMarketing) {
      if (school.referral?.referredBy?.toString() !== session.user.id) {
          throw new Error("Unauthorized: You can only add payments to schools you referred.");
      }
  }

  // Validation
  if (payment.type === 'installation') {
      const hasInstallation = await Expense.exists({ 
          schoolId, 
          type: 'income', 
          category: 'Installation', 
          status: 'approved' 
      });
      
      if (hasInstallation) {
          throw new Error("Installation payment already recorded.");
      }
  }

  if (payment.type === 'recurring' && !payment.billingPeriod) {
      throw new Error("Billing period is required for recurring payments.");
  }
  
  await Expense.create({
      type: 'income',
      amount: payment.amount,
      description: `Payment from ${school.name} (${payment.type})`,
      category: payment.type === 'installation' ? 'Installation' : 'Recurring',
      date: payment.date,
      schoolId: schoolId,
      approvedBy: session.user.id,
      status: 'approved', // Assuming immediate approval for now, or use 'pending'
      paymentMethod: payment.method,
      transactionId: payment.transactionId,
      billingPeriod: payment.billingPeriod
  });
  
  return { success: true };
}

export async function getPayments(schoolId: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized");
    }

    const isAdmin = session.user.role?.includes('admin');
    const isSchoolOwner = session.user.role === 'school_owner';

    await dbConnect();

    if (isSchoolOwner) {
        // Verify ownership
        const school = await School.findOne({ adminEmail: session.user.email });
        if (!school || school._id.toString() !== schoolId) {
            throw new Error("Unauthorized");
        }
    } else if (!isAdmin) {
        throw new Error("Unauthorized");
    }
    
    const payments = await Expense.find({ 
        schoolId, 
        type: 'income' 
    }).sort({ date: -1 }).lean();
  
    return JSON.parse(JSON.stringify(payments.map((p: any) => ({
        ...p,
        // Map category back to 'type' expected by frontend
        type: p.category === 'Installation' ? 'installation' : (p.category === 'Recurring' ? 'recurring' : 'other'),
        // Map paymentMethod to method
        method: p.paymentMethod
    }))));
}
