import { NextResponse } from "next/server";
import { searchSchoolsMinimal } from "@/actions/schoolQueries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  try {
    const results = await searchSchoolsMinimal(q);
    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("school search error", err);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}