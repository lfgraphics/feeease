import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Check if any admin exists
    const existingAdmin = await AdminUser.findOne({});
    if (existingAdmin) {
      return NextResponse.json({ message: "System already initialized" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash("123", 10);

    const admin = await AdminUser.create({
      fullName: "Super Admin",
      email: "admin@feeease.com", // Default email
      mobileNumber: "0000000000",
      passwordHash,
      role: "super_admin",
      isActive: true,
      requiresPasswordChange: true
    });

    return NextResponse.json({ success: true, message: "System initialized with admin:123" });

  } catch (error: unknown) {
    console.error("Init error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
