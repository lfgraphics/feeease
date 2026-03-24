import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ReferralOffer from "@/models/ReferralOffer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH - update offer
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const offer = await ReferralOffer.findByIdAndUpdate(id, body, { new: true });
    if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

    return NextResponse.json(JSON.parse(JSON.stringify(offer)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - delete offer
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const offer = await ReferralOffer.findByIdAndDelete(id);
    if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
