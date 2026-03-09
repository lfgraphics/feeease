import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import School from "@/models/School";

export async function GET(
  req: NextRequest,
  { params }: { params: { schoolId: string } }
) {
  try {
    await dbConnect();
    const school = await School.findById(params.schoolId);

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    if (!school.license || !school.license.licenseKey) {
        return NextResponse.json({ error: "No license found for this school" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      license: school.license
    });

  } catch (error: unknown) {
    console.error("Fetch latest license error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
