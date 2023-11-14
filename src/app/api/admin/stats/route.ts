import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/commodityStore";

export async function GET() {
  const stats = getAdminStats();
  return NextResponse.json({
    success: true,
    data: stats,
  });
}
