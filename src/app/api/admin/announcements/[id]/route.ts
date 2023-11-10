import { NextRequest, NextResponse } from "next/server";
import { updateAnnouncement, deleteAnnouncement } from "@/lib/commodityStore";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = updateAnnouncement(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Announcement updated",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteAnnouncement(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Announcement not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Announcement deleted",
  });
}
