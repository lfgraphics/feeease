import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ReferralOffer from "@/models/ReferralOffer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all offers (public - for home page + school portal)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const filter: any = {};
    if (activeOnly) {
      filter.isActive = true;
      filter.validUntil = { $gte: new Date() };
    }

    const offers = await ReferralOffer.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(offers)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create offer (super_admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.description || !body.referralTarget || !body.rewardMonths || !body.validUntil) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const offer = await ReferralOffer.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(JSON.parse(JSON.stringify(offer)), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
