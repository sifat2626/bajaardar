import { NextRequest, NextResponse } from "next/server";
import { getSingleCommodity, updateCommodity, deleteCommodity } from "@/lib/commodityStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commodity = getSingleCommodity(id);
  if (!commodity) {
    return NextResponse.json({ success: false, message: "Commodity not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: commodity });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = updateCommodity(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Commodity not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Commodity updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update commodity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteCommodity(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Commodity not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Commodity deleted successfully",
  });
}
