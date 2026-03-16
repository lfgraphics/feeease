import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import { encrypt } from "@/lib/crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user.role.includes("admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const school = await School.findById(id);

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const body = await req.json();
    const { 
        status, 
        githubRepo, 
        vercelProject, 
        notes,
        // New fields
        mongoDbUri,
        cloudinaryConfig,
        gmailAccount,
        nextAuth,
        encryptionKey,
        publicAppUrl,
        whatsappTemplates,
        licenseCookieSecret
    } = body;

    // Encrypt sensitive fields if they are provided
    // Note: We assume the body contains the RAW values (objects), so we JSON.stringify then encrypt
    
    const updateData: any = {
        status,
        githubRepo,
        vercelProject,
        notes,
        publicAppUrl
    };

    if (mongoDbUri) updateData.mongoDbUri = encrypt(mongoDbUri);
    if (cloudinaryConfig) updateData.cloudinaryConfig = encrypt(JSON.stringify(cloudinaryConfig));
    if (gmailAccount) updateData.gmailAccount = encrypt(JSON.stringify(gmailAccount));
    if (nextAuth) updateData.nextAuth = encrypt(JSON.stringify(nextAuth));
    if (encryptionKey) updateData.encryptionKey = encrypt(encryptionKey);
    if (licenseCookieSecret) updateData.licenseCookieSecret = encrypt(licenseCookieSecret);
    if (whatsappTemplates) updateData.whatsappTemplates = encrypt(JSON.stringify(whatsappTemplates));

    school.deployment = {
        ...school.deployment,
        ...updateData
    };

    await school.save();

    return NextResponse.json({ success: true, deployment: school.deployment });

  } catch (error: any) {
    console.error("Deployment update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
