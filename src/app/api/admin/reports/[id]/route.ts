import { NextRequest, NextResponse } from "next/server";
import { updateReportStatus, deleteReport } from "@/lib/commodityStore";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json({ success: false, message: "status is required" }, { status: 400 });
    }

    const updated = updateReportStatus(
      id,
      body.status,
      body.adminNotes,
      body.applyPrice ?? true
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Report status updated to ${body.status}`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update report status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteReport(id);

  if (!deleted) {
    return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Report deleted successfully",
  });
}
