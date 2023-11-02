import { NextRequest, NextResponse } from "next/server";
import { bulkAdjustCommodities } from "@/lib/commodityStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = bulkAdjustCommodities({
      category: body.category,
      percentage: body.percentage ? Number(body.percentage) : undefined,
      flatAmount: body.flatAmount ? Number(body.flatAmount) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully adjusted prices for ${result.affectedCount} commodities.`,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to adjust prices" },
      { status: 500 }
    );
  }
}
