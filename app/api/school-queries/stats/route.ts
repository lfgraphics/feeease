import { NextResponse } from "next/server";
import { getSchoolQueriesStats } from "@/actions/schoolQueries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const params = url.searchParams;
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;

  const options: any = { from, to };
  if (session && session.user.role === "marketing") {
    options.referrerEmail = session.user.email;
  }

  try {
    const stats = await getSchoolQueriesStats(options);
    return NextResponse.json({ success: true, stats });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
