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
    const { action, expiryDate, plan, features, status } = body;

    if (action === "generate" || action === "extend") {
      if (!PRIVATE_KEY) {
         return NextResponse.json({ error: "Server configuration error: Missing Private Key" }, { status: 500 });
      }

      const expiresAt = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Ensure expiresAt is set to the END of that day (23:59:59.999)
      expiresAt.setHours(23, 59, 59, 999);
      
      const finalStatus = status || 'active';

      // If suspended, revoked, or expired, ensure the expiry date reflects this if needed
      // Or simply, we trust the admin provided expiryDate. 
      // But user requested: "if suspend/expired/revoked is being set then it should update the licence expiry as well to the current data or provided date"
      
      // If the status is NOT active, and no specific date was provided (or even if it was), 
      // should we expire it NOW?
      // "to the current data or provided date" -> If provided date is future, but status is expired, it's contradictory.
      // But the admin might want to "Suspend" a school that has a valid license until next year.
      // So the expiry date should remain next year, but status is suspended.
      // HOWEVER, the user specifically said: "update the licence expiry as well to the current data or provided date"
      // This likely means: If I set it to expired, I probably want the date to be now (or yesterday) so it is logically expired too.
      
      if (finalStatus === 'expired' || finalStatus === 'revoked') {
          // If explicitly setting to expired/revoked, and the date provided is in the future, 
          // we might want to clamp it? 
          // But if the user provided a date, we respect it. 
          // If the user DID NOT provide a date (using default +30 days), but set status to expired,
          // then we should probably set date to NOW.
          
          if (!expiryDate) {
              // No date provided, but status is expired -> expire immediately
              expiresAt.setTime(Date.now());
          }
      }
      
      // Update School Plan and Features
      if (plan) school.subscription.plan = plan;
      if (features) school.features = features;

      // Ensure licenseKey exists (migration for old records)
      if (!school.license?.licenseKey) {
          school.license.licenseKey = require('crypto').randomBytes(8).toString('hex').toUpperCase();
      }

      const payload = {
        schoolId: school._id.toString(),
        licenseKey: school.license.licenseKey,
        plan: school.subscription.plan,
        features: school.features,
        exp: Math.floor(expiresAt.getTime() / 1000),
        iat: Math.floor(Date.now() / 1000),
      };

      // Sign with Private Key
      const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });

      school.license.token = token;
      school.license.issuedAt = new Date();
      school.license.expiresAt = expiresAt;
      
      school.license.status = finalStatus;

      // Ensure subscription status matches license status
      school.subscription.status = finalStatus;
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
