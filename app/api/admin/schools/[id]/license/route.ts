import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "@/lib/crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role if needed

  try {
    await dbConnect();
    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const body = await req.json();
    const { action, expiryDate, plan, features } = body;

    if (action === "generate" || action === "extend") {
      if (!PRIVATE_KEY) {
         return NextResponse.json({ error: "Server configuration error: Missing Private Key" }, { status: 500 });
      }

      const expiresAt = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Ensure expiresAt is set to the END of that day (23:59:59.999)
      expiresAt.setHours(23, 59, 59, 999);
      
      // Update School Plan and Features
      if (plan) school.subscription.plan = plan;
      if (features) school.features = features;

      // Ensure licenseKey exists (migration for old records)
      if (!school.license?.licenseKey) {
          school.license.licenseKey = require('crypto').randomBytes(8).toString('hex').toUpperCase();
      }

      const payload = {
        schoolId: school._id.toString(),
        licenseKey: school.license.licenseKey, // Add public immutable key to token
        plan: school.subscription.plan,
        features: school.features,
        exp: Math.floor(expiresAt.getTime() / 1000),
        iat: Math.floor(Date.now() / 1000),
      };

      // Sign with Private Key
      // Ensure PRIVATE_KEY is properly formatted (newlines) handled in lib/crypto
      const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });

      school.license.token = token;
      school.license.issuedAt = new Date();
      school.license.expiresAt = expiresAt;
      school.license.status = 'active';

      school.subscription.status = 'active';
      school.subscription.expiryDate = expiresAt;

      await school.save();

      return NextResponse.json({ 
          success: true, 
          license: school.license,
          subscription: school.subscription 
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: unknown) {
    console.error("License generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
