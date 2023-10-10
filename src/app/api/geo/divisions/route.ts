import { NextResponse } from "next/server";
import { BANGLADESH_DIVISIONS } from "@/lib/bangladeshGeo";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: BANGLADESH_DIVISIONS,
  });
}
