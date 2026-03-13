import { NextResponse } from "next/server";
import { getSchoolQueries } from "@/actions/schoolQueries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const params = url.searchParams;
  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "10");
  const query = params.get("query") || undefined;
  const status = (params.get("status") as any) || undefined;
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;

  const options: any = { page, limit, query, status, from, to };
  if (session && session.user.role === "marketing") {
    options.referrerEmail = session.user.email;
  }
  try {
    const data = await getSchoolQueries(options);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // optional create via API if needed
  return NextResponse.json({ success: false, error: "Method not allowed" }, { status: 405 });
}
