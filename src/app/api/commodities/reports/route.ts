import { NextRequest, NextResponse } from "next/server";
import { addReport, getSystemSettings } from "@/lib/commodityStore";

export async function POST(req: NextRequest) {
  try {
    const settings = getSystemSettings();
    if (!settings.crowdsourcingEnabled) {
      return NextResponse.json(
        {
          success: false,
          message: "Crowdsourced price reporting is temporarily paused by system administration.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.commodityId || !body.price || !body.marketName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: commodityId, price, and marketName are required" },
        { status: 400 }
      );
    }

    const report = addReport(body);
    const isAuto = report.status === "VERIFIED";

    return NextResponse.json(
      {
        success: true,
        message: isAuto
          ? "Price report verified and applied to live market index! Thank you for contributing to market transparency."
          : "Price report submitted successfully and queued for admin verification! Thank you for contributing to market transparency.",
        data: report,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit price report" },
      { status: 500 }
    );
  }
}
