import { NextResponse } from "next/server";
import { getSystemSettings } from "@/lib/commodityStore";

export async function GET() {
  const settings = getSystemSettings();
  // Return public settings safely without exposing adminPasscode
  const { adminPasscode, ...publicSettings } = settings;
  return NextResponse.json({
    success: true,
    data: publicSettings,
  });
}
