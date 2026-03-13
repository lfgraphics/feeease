import { NextResponse } from "next/server";
import { getAssignableUsers } from "@/actions/schoolQueries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.role?.includes("admin")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const users = await getAssignableUsers();
    return NextResponse.json({ success: true, users });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}