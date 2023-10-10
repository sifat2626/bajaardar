import { NextResponse } from "next/server";
import { getAllMarkets } from "@/lib/commodityStore";

export async function GET() {
  const data = getAllMarkets();
  return NextResponse.json({
    success: true,
    data,
  });
}
