import { NextRequest, NextResponse } from "next/server";
import { updateMarket, deleteMarket } from "@/lib/commodityStore";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = updateMarket(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Market not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Market updated",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update market" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteMarket(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Market not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Market deleted",
  });
}
