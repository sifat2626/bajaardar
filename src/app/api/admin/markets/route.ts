import { NextRequest, NextResponse } from "next/server";
import { getAllMarkets, createMarket } from "@/lib/commodityStore";

export async function GET() {
  const data = getAllMarkets();
  return NextResponse.json({
    success: true,
    count: data.length,
    data,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.nameBn || !body.division || !body.district || !body.type) {
      return NextResponse.json(
        {
          success: false,
          message: "name, nameBn, division, district, and type are required",
        },
        { status: 400 }
      );
    }

    const market = createMarket(body);
    return NextResponse.json(
      {
        success: true,
        message: "Market created successfully",
        data: market,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create market" },
      { status: 500 }
    );
  }
}
