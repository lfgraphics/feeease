"use server"

import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import School from "@/models/School";
import Otp from "@/models/Otp";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import bcrypt from "bcryptjs";

const WORKER_URL = process.env.FEEEASE_WORKER_URL;

export async function requestOtp(phone: string) {
    try {
        await dbConnect();

        // 1. Validate phone number format (simple check)
        if (!/^\d{10,12}$/.test(phone)) {
            return { success: false, error: "Invalid phone number format" };
        }

        let userEntity = null;
        let userName = "";
        let refId = null;
        let role: 'admin' | 'school_owner' = 'admin';
        let schoolForWhatsApp = null;

        // 2. Search for AdminUser first
        userEntity = await AdminUser.findOne({ mobileNumber: phone });
        if (userEntity) {
            userName = userEntity.fullName;
            refId = userEntity._id;
            role = 'admin';
            // For AdminUsers, we need a school to use for WhatsApp.
            // Let's find any school that has WhatsApp enabled.
            schoolForWhatsApp = await School.findOne({ "features.whatsapp": true }).lean();
        } else {
            // 3. Search for School Admin
            const school = await School.findOne({ adminMobile: phone });
            if (school) {
                userEntity = school;
                userName = school.adminName;
                refId = school._id;
                role = 'school_owner';
                schoolForWhatsApp = school;
            }
        }

        if (!userEntity) {
            return { success: false, error: "User with this phone number not found" };
        }

        if (!schoolForWhatsApp) {
            return { success: false, error: "WhatsApp service is currently unavailable for this account" };
        }

        // 4. Generate 6-digit OTP
        const otpCode = crypto.randomInt(100000, 999999).toString();
        const expiresAt = addMinutes(new Date(), 5);

        // 5. Save to DB (upsert/new)
        await Otp.findOneAndUpdate(
            { phone, role },
            {
                otp: otpCode,
                refId,
                expiresAt,
                isUsed: false,
                createdAt: new Date()
            },
            { upsert: true }
        );

        // 6. Send via Worker
        const res = await fetch(`${WORKER_URL}/api/v1/system/otp`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.WORKER_WEBHOOK_SECRET}`
            },
            body: JSON.stringify({
                phone: phone,
                userName: userName,
                otp: otpCode,
                role: role,
                schoolName: role === 'admin' ? "FeeEase" : (schoolForWhatsApp?.name || "FeeEase"),
                source: role === 'admin' ? "FeeEase Admin" : "FeeEase School Portal"
            })
        });

        if (res.ok) {
            return { success: true, message: "OTP sent successfully to WhatsApp" };
        } else {
            const err = await res.json().catch(() => ({}));
            // Fallback for development if worker is down
            if (process.env.NODE_ENV === 'development') {
                console.log(`[DEBUG] OTP for ${phone} is: ${otpCode}`);
                return { success: true, debug: true, message: "Development: OTP is " + otpCode };
            }
            return { success: false, error: err.detail || "Failed to send WhatsApp OTP" };
        }

    } catch (error) {
        console.error("Request OTP error:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function verifyOtpAndResetPassword(phone: string, otp: string, newPassword: string) {
    try {
        await dbConnect();

        const otpDoc = await Otp.findOne({
            phone: phone,
            otp: otp,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpDoc) {
            return { success: false, error: "Invalid or expired OTP" };
        }

        // Mark as used
        otpDoc.isUsed = true;
        await otpDoc.save();

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (otpDoc.role === 'admin') {
            await AdminUser.findByIdAndUpdate(otpDoc.refId, { passwordHash: hashedPassword });
        } else if (otpDoc.role === 'school_owner') {
            await School.findByIdAndUpdate(otpDoc.refId, { adminPasswordHash: hashedPassword });
        }

        return {
            success: true,
            message: "Password reset successfully. You can now login with your new password."
        };

    } catch (error) {
        console.error("Verify OTP & Reset Password error:", error);
        return { success: false, error: "Password reset failed" };
    }
}
