import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import AdminUser from "@/models/AdminUser";
import { encrypt } from "@/lib/crypto";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const APP_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic Validation
    if (!body.schoolName || !body.schoolLogo || !body.adminName || !body.adminMobile || !body.adminPassword || !body.adminEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Validate Referral Code
    let referredBy = undefined;
    let referralCode = undefined;
    let referralStaffEmail = undefined;

    if (body.referralCode) {
      const marketingUser = await AdminUser.findOne({ referralCode: body.referralCode, role: 'marketing' });
      if (!marketingUser) {
        return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
      }
      referredBy = marketingUser._id;
      referralCode = body.referralCode;
      referralStaffEmail = marketingUser.email;
    }

    // Check if school already exists (by name or admin email if provided)
    // For now, let's just check mobile number uniqueness for admin
    const existingSchool = await School.findOne({ adminMobile: body.adminMobile });
    if (existingSchool) {
        return NextResponse.json({ error: "A school with this admin mobile number already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.adminPassword, 10);
    const encryptedPassword = encrypt(body.adminPassword);

    // Generate Immutable License Key (16 chars hex)
    const licenseKey = crypto.randomBytes(8).toString('hex').toUpperCase();

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
        status: 'trial', // Default to trial
        startDate: new Date(),
        // Default expiry 14 days for trial? Or let admin set it. Let's say 14 days trial.
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) 
      },
      license: {
          licenseKey: licenseKey,
          status: 'active',
          issuedAt: new Date(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) 
      },
      referral: {
        code: referralCode,
        referredBy: referredBy
      }
    });

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
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ success: true, schoolId: newSchool._id });

  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
