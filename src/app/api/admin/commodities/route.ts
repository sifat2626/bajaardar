import { NextRequest, NextResponse } from "next/server";
import { getAllCommodities, createCommodity } from "@/lib/commodityStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;

  const data = getAllCommodities({ category, search, sortBy });
  return NextResponse.json({
    success: true,
    count: data.length,
    data,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.nameEn || !body.nameBn || !body.category || body.currentAvgPrice === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: nameEn, nameBn, category, currentAvgPrice are required",
        },
        { status: 400 }
      );
    }

    const commodity = createCommodity(body);
    return NextResponse.json(
      {
        success: true,
        message: "Commodity created successfully",
        data: commodity,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create commodity" },
      { status: 500 }
    );
  }
}
