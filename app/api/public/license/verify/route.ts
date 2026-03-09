import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import { decrypt } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const { licenseKey } = await req.json();

    if (!licenseKey) {
      return NextResponse.json({ error: "License key is required" }, { status: 400 });
    }

    await dbConnect();

    // Find school by immutable license key
    const school = await School.findOne({ "license.licenseKey": licenseKey });

    if (!school) {
      return NextResponse.json({ error: "Invalid license key" }, { status: 404 });
    }

    if (school.license.status !== 'active') {
        return NextResponse.json({ error: "License is not active" }, { status: 403 });
    }

    // Decrypt admin password
    let adminPassword = "";
    if (school.adminPasswordEncrypted) {
        adminPassword = decrypt(school.adminPasswordEncrypted);
    }

    // Return school data and decrypted password for seeding
    return NextResponse.json({
      success: true,
      school: {
        _id: school._id,
        name: school.name,
        logo: school.logo,
        address: school.address,
        adminName: school.adminName,
        adminEmail: school.adminEmail,
        adminMobile: school.adminMobile,
        subscription: school.subscription,
        license: {
            token: school.license.token, // Send signed token
            status: school.license.status // Send status so client knows if expired/suspended
        }
      },
      adminPassword // Only sent once during activation/verification
    });

  } catch (error: any) {
    console.error("License verify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
