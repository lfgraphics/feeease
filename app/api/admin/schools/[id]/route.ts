import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  // Check if session exists and role is super_admin
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized: Only Super Admin can delete schools" }, { status: 403 });
  }

  try {
    await dbConnect();
    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Hard delete
    await School.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "School deleted successfully" });

  } catch (error: any) {
    console.error("Delete school error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
