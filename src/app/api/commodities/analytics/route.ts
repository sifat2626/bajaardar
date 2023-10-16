import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/commodityStore";

export async function GET() {
  const data = getAnalyticsData();
  return NextResponse.json({ success: true, data });
}
