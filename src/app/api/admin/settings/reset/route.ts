import { NextResponse } from "next/server";
import { resetToDefaults } from "@/lib/commodityStore";

export async function POST() {
  resetToDefaults();
  return NextResponse.json({
    success: true,
    message: "Store successfully reset to initial demo seeds and benchmark prices.",
  });
}
