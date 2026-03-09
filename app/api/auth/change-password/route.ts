import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import School from "@/models/School";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    await dbConnect();
    
    let user;
    let isSchoolOwner = false;

    // Check if user is a school owner
    if (session.user.role === "school_owner") {
        user = await School.findById(session.user.id);
        isSchoolOwner = true;
    } else {
        user = await AdminUser.findById(session.user.id);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    // School model uses adminPasswordHash, AdminUser uses passwordHash
    const currentHash = isSchoolOwner ? (user as any).adminPasswordHash : (user as any).passwordHash;
    
    const isValid = await bcrypt.compare(currentPassword, currentHash);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    if (isSchoolOwner) {
        (user as any).adminPasswordHash = hashedPassword;
        // Schools don't have requiresPasswordChange field usually, but if they did, handle it here
    } else {
        (user as any).passwordHash = hashedPassword;
        (user as any).requiresPasswordChange = false;
    }
    
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated successfully" });

  } catch (error: unknown) {
    console.error("Password update error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
