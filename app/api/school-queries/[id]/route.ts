import { NextRequest, NextResponse } from "next/server";
import { updateSchoolQuery } from "@/actions/schoolQueries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.id) body.id = id;
  if (!session.user.name || !session.user.email) {
    return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
  }
  try {
    const updated = await updateSchoolQuery(body, {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    });
    return NextResponse.json({ success: true, updated });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ success: false, error: e.message || "failed" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // maybe return single query
  return NextResponse.json({ success: false, error: "Not implemented" }, { status: 404 });
}
