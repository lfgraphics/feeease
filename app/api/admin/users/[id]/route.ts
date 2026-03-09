import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { fullName, email, mobileNumber, role, isActive } = body;

    await dbConnect();
    const user = await AdminUser.findById(params.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent super admin from disabling themselves
    if (user._id.toString() === session.user.id && isActive === false) {
        return NextResponse.json({ error: "You cannot disable your own account" }, { status: 400 });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.role = role || user.role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    return NextResponse.json({ success: true, user });

  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
