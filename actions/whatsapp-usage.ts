"use server"

import dbConnect from "@/lib/db";
import School from "@/models/School";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function currentMonthYear() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function getWhatsAppUsage(schoolId: string) {
  await dbConnect();
  const school = await School.findById(schoolId)
    .select('whatsappUsage name features')
    .lean();

  if (!school) return null;

  const usage = (school as any).whatsappUsage || {};
  const monthYear = currentMonthYear();

  // Reset if it's a new month
  const sentThisMonth =
    usage.monthYear === monthYear ? (usage.sentThisMonth ?? 0) : 0;

  const result = {
    sentThisMonth,
    softLimit: usage.softLimit ?? 5000,
    monthYear,
    whatsappEnabled: (school as any).features?.whatsapp ?? false,
  };
  
  console.log("[WhatsApp Usage Stats Fetch]:", { schoolId, ...result });
  return result;
}

export async function updateWhatsAppSoftLimit(schoolId: string, newLimit: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.role.includes('admin')) {
    return { success: false, error: 'Unauthorised' };
  }
  if (newLimit < 0 || newLimit > 100000) {
    return { success: false, error: 'Limit must be between 0 and 100,000' };
  }

  await dbConnect();
  const updated = await School.findByIdAndUpdate(schoolId, {
    $set: { 'whatsappUsage.softLimit': newLimit },
  }, { new: true });

  if (!updated) {
    console.error("[WhatsApp Usage Error]: School not found for ID", schoolId);
    return { success: false, error: 'School not found' };
  }

  console.log("[WhatsApp Usage Success]: Updated soft limit to", newLimit, "for", schoolId);
  revalidatePath(`/admin/schools/${schoolId}`);
  return { success: true };
}

export async function resetWhatsAppUsage(schoolId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.role.includes('admin')) {
    return { success: false, error: 'Unauthorised' };
  }

  await dbConnect();
  const updated = await School.findByIdAndUpdate(schoolId, {
    $set: {
      'whatsappUsage.sentThisMonth': 0,
      'whatsappUsage.monthYear': currentMonthYear(),
    },
  }, { new: true });

  if (!updated) {
    console.error("[WhatsApp Usage Error]: School not found for ID", schoolId);
    return { success: false, error: 'School not found' };
  }

  console.log("[WhatsApp Usage Success]: Reset usage for", schoolId);
  revalidatePath(`/admin/schools/${schoolId}`);
  return { success: true };
}
