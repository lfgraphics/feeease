"use server";

import dbConnect from "@/lib/db";
import ReferralOffer from "@/models/ReferralOffer";
import School from "@/models/School";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ─── PUBLIC: Get Active Offers (for home page / school portal) ───────────────
export async function getActiveOffers() {
  await dbConnect();
  const now = new Date();
  const offers = await ReferralOffer.find({ isActive: true, validUntil: { $gte: now } })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(offers));
}

// ─── ADMIN: Get all offers (for settings CRUD) ───────────────────────────────
export async function getAllOffers() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'super_admin') {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  const offers = await ReferralOffer.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(offers));
}

// ─── ADMIN: Create offer ─────────────────────────────────────────────────────
export async function createOffer(data: {
  title: string;
  description: string;
  referralTarget: number;
  rewardMonths: number;
  validUntil: Date;
  isActive?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'super_admin') {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  const offer = await ReferralOffer.create({ ...data, createdBy: session.user.id });
  revalidatePath('/admin/settings');
  return JSON.parse(JSON.stringify(offer));
}

// ─── ADMIN: Update offer ─────────────────────────────────────────────────────
export async function updateOffer(id: string, data: Partial<{
  title: string;
  description: string;
  referralTarget: number;
  rewardMonths: number;
  validUntil: Date;
  isActive: boolean;
}>) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'super_admin') {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  const offer = await ReferralOffer.findByIdAndUpdate(id, data, { new: true });
  if (!offer) throw new Error("Offer not found");
  revalidatePath('/admin/settings');
  return JSON.parse(JSON.stringify(offer));
}

// ─── ADMIN: Delete offer ─────────────────────────────────────────────────────
export async function deleteOffer(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'super_admin') {
    throw new Error("Unauthorized");
  }
  await dbConnect();
  const offer = await ReferralOffer.findByIdAndDelete(id);
  if (!offer) throw new Error("Offer not found");
  revalidatePath('/admin/settings');
  return { success: true };
}

// ─── SCHOOL: Get school referral data (own school) ────────────────────────────
export async function getSchoolReferralData(schoolId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await dbConnect();

  const school = await School.findById(schoolId)
    .select('referral name')
    .lean() as any;

  if (!school) throw new Error("School not found");

  const now = new Date();
  const activeOffers = await ReferralOffer.find({ isActive: true, validUntil: { $gte: now } }).lean() as any[];

  const referredSchools = school.referral?.referredSchools || [];

  // For each active offer, compute progress
  const offersProgress = activeOffers.map((offer: any) => {
    const eligibleCount = referredSchools.filter(
      (rs: any) => new Date(rs.onboardedAt) <= new Date(offer.validUntil)
    ).length;
    return {
      offerId: offer._id.toString(),
      offerTitle: offer.title,
      offerDescription: offer.description,
      referralTarget: offer.referralTarget,
      rewardMonths: offer.rewardMonths,
      validUntil: offer.validUntil,
      eligibleCount,
      progress: Math.min(100, Math.round((eligibleCount / offer.referralTarget) * 100)),
      achieved: eligibleCount >= offer.referralTarget,
    };
  });

  return {
    referralCode: school.referral?.code,
    referredSchools: JSON.parse(JSON.stringify(referredSchools)),
    offerRewardMonthsRemaining: school.referral?.offerRewardMonthsRemaining || 0,
    offerGrantedAt: school.referral?.offerGrantedAt || null,
    offersProgress,
  };
}

// ─── ADMIN: Get school referral data (admin view into any school) ─────────────
export async function getAdminSchoolReferralData(schoolId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.role?.includes('admin')) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  const school = await School.findById(schoolId).select('referral name').lean() as any;
  if (!school) throw new Error("School not found");

  const now = new Date();
  const activeOffers = await ReferralOffer.find({ isActive: true, validUntil: { $gte: now } }).lean() as any[];

  const referredSchools = school.referral?.referredSchools || [];
  const offersProgress = activeOffers.map((offer: any) => {
    const eligibleCount = referredSchools.filter(
      (rs: any) => new Date(rs.onboardedAt) <= new Date(offer.validUntil)
    ).length;
    return {
      offerId: offer._id.toString(),
      offerTitle: offer.title,
      referralTarget: offer.referralTarget,
      rewardMonths: offer.rewardMonths,
      validUntil: offer.validUntil,
      eligibleCount,
      progress: Math.min(100, Math.round((eligibleCount / offer.referralTarget) * 100)),
      achieved: eligibleCount >= offer.referralTarget,
    };
  });

  return {
    referralCode: school.referral?.code,
    referredByType: school.referral?.referredByType,
    referredBy: school.referral?.referredBy?.toString() || null,
    referredSchools: JSON.parse(JSON.stringify(referredSchools)),
    offerRewardMonthsRemaining: school.referral?.offerRewardMonthsRemaining || 0,
    offerGrantedAt: school.referral?.offerGrantedAt || null,
    offersProgress,
  };
}
