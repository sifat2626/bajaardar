import { NextRequest, NextResponse } from "next/server";
import { getSingleCommodity } from "@/lib/commodityStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commodity = getSingleCommodity(id);

  if (!commodity) {
    return NextResponse.json(
      { success: false, message: "Commodity not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: commodity,
  });
}
