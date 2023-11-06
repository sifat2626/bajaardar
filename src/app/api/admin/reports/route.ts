import { NextRequest, NextResponse } from "next/server";
import { getAllReports } from "@/lib/commodityStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const commodityId = searchParams.get("commodityId") || undefined;

  const data = getAllReports({ status, commodityId });
  return NextResponse.json({
    success: true,
    count: data.length,
    data,
  });
}
