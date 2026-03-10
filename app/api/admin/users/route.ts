import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

function generateReferralCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { fullName, email, mobileNumber, role, password } = body;

    if (!fullName || !email || !mobileNumber || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    let referralCode = undefined;
    if (role === 'marketing') {
      let isUnique = false;
      while (!isUnique) {
        referralCode = generateReferralCode();
        const existing = await AdminUser.findOne({ referralCode });
        if (!existing) isUnique = true;
      }
    }

    // Default password '123' if not provided
    const passwordHash = await bcrypt.hash(password || "123", 10);

    const newUser = await AdminUser.create({
      fullName,
      email,
      mobileNumber,
      role,
      passwordHash,
      referralCode,
      isActive: true,
      requiresPasswordChange: true, // Force change on first login
    });

    return NextResponse.json({ success: true, user: newUser });

  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
