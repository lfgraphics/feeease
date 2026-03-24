import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import AdminUser from "@/models/AdminUser";
import ReferralOffer from "@/models/ReferralOffer";
import { encrypt } from "@/lib/crypto";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const APP_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

function generateSchoolReferralCode(): string {
  // 8-char alphanumeric, uppercase (same style as marketing codes)
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic Validation
    if (!body.schoolName || !body.schoolLogo || !body.adminName || !body.adminMobile || !body.adminPassword || !body.adminEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // ──────────────────────────────────────────────────
    // Validate Referral Code
    // Priority: School referral code → Marketing referral code
    // ──────────────────────────────────────────────────
    let referredBy: any = undefined;
    let referredByType: 'marketing' | 'school' | undefined = undefined;
    let usedReferralCode: string | undefined = undefined;
    let referralStaffEmail: string | undefined = undefined;
    let referringSchool: any = undefined;

    if (body.referralCode) {
      // 1. Check school referral codes first
      referringSchool = await School.findOne({ 'referral.code': body.referralCode });

      if (referringSchool) {
        referredBy = referringSchool._id;
        referredByType = 'school';
        usedReferralCode = body.referralCode;
      } else {
        // 2. Fall back to marketing staff codes
        const marketingUser = await AdminUser.findOne({ referralCode: body.referralCode, role: 'marketing' });
        if (!marketingUser) {
          return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
        }
        referredBy = marketingUser._id;
        referredByType = 'marketing';
        usedReferralCode = body.referralCode;
        referralStaffEmail = marketingUser.email;
      }
    }

    // Check if school already exists (by admin mobile)
    const existingSchool = await School.findOne({ adminMobile: body.adminMobile });
    if (existingSchool) {
      return NextResponse.json({ error: "A school with this admin mobile number already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.adminPassword, 10);
    const encryptedPassword = encrypt(body.adminPassword);

    // Generate Immutable License Key (16 chars hex)
    const licenseKey = crypto.randomBytes(8).toString('hex').toUpperCase();

    // Generate unique referral code for this new school
    let schoolReferralCode: string;
    let isUnique = false;
    do {
      schoolReferralCode = generateSchoolReferralCode();
      const existing = await School.findOne({ 'referral.code': schoolReferralCode });
      isUnique = !existing;
    } while (!isUnique);

    const newSchool = await School.create({
      name: body.schoolName,
      logo: body.schoolLogo, // Base64
      shortName: body.schoolShortName,
      address: body.schoolAddress,
      adminName: body.adminName,
      adminMobile: body.adminMobile,
      adminEmail: body.adminEmail,
      adminPasswordHash: hashedPassword,
      adminPasswordEncrypted: encryptedPassword,
      features: body.features || {},
      subscription: {
        plan: body.plan || 'Basic',
        status: 'trial',
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      license: {
        licenseKey: licenseKey,
        status: 'active',
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      referral: {
        code: schoolReferralCode,  // Every school gets their own referral code
        referredBy: referredBy,
        referredByType: referredByType,
        referredSchools: [],
        offerRewardMonthsRemaining: 0,
      }
    });

    // ──────────────────────────────────────────────────
    // If referred by another school: update that school's referredSchools list
    // Then check if any active offer threshold is met
    // ──────────────────────────────────────────────────
    if (referringSchool) {
      const now = new Date();

      // Push this school to the referring school's referredSchools
      await School.findByIdAndUpdate(referringSchool._id, {
        $push: {
          'referral.referredSchools': {
            schoolId: newSchool._id,
            schoolName: newSchool.name,
            onboardedAt: now
          }
        }
      });

      // Re-fetch updated referring school for offer check
      const updatedReferringSchool = await School.findById(referringSchool._id);
      if (updatedReferringSchool) {
        // Check active offers
        const activeOffers = await ReferralOffer.find({ isActive: true, validUntil: { $gte: now } });

        for (const offer of activeOffers) {
          // Count referrals that were made before or on offer.validUntil
          const eligibleReferrals = (updatedReferringSchool.referral?.referredSchools || []).filter(
            (rs: any) => rs.onboardedAt <= offer.validUntil
          );

          if (eligibleReferrals.length >= offer.referralTarget) {
            // Grant offer reward if not already fully granted for this count milestone
            const currentReward = updatedReferringSchool.referral?.offerRewardMonthsRemaining || 0;
            if (currentReward < offer.rewardMonths) {
              await School.findByIdAndUpdate(referringSchool._id, {
                $set: {
                  'referral.offerRewardMonthsRemaining': offer.rewardMonths,
                  'referral.offerGrantedAt': now
                }
              });
            }
            break; // Apply best matching offer only once
          }
        }
      }
    }

    // Trigger App Script for Email Notification
    try {
      const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://feeease.com'}/admin/schools/${newSchool._id}`;
      const formData = new FormData();
      formData.append('adminEmail', body.adminEmail);
      if (referralStaffEmail) {
        formData.append('staffEmail', referralStaffEmail);
      }
      formData.append('school', body.schoolName);
      formData.append('adminName', body.adminName);
      formData.append('adminMobile', body.adminMobile);
      formData.append('profileUrl', profileUrl);

      await fetch(APP_SCRIPT_URL!, {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      console.error("Failed to post to App Script", err);
    }

    return NextResponse.json({ success: true, schoolId: newSchool._id });

  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
