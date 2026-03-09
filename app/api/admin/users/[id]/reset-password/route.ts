import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await dbConnect();
    const user = await AdminUser.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash("123", 10);
    user.passwordHash = passwordHash;
    user.requiresPasswordChange = true;
    
    await user.save();

    return NextResponse.json({ success: true, message: "Password reset successfully" });

  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
