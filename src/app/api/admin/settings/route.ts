import { NextRequest, NextResponse } from "next/server";
import { getSystemSettings, updateSystemSettings } from "@/lib/commodityStore";

export async function GET() {
  const settings = getSystemSettings();
  return NextResponse.json({
    success: true,
    data: settings,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateSystemSettings(body);
    return NextResponse.json({
      success: true,
      message: "System settings updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
