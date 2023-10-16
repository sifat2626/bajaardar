import { NextRequest, NextResponse } from "next/server";
import { getAllCommodities } from "@/lib/commodityStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;

  const data = getAllCommodities({ category, search, sortBy });
  return NextResponse.json({ success: true, count: data.length, data });
}
