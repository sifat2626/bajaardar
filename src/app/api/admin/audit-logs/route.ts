import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/commodityStore";

export async function GET() {
  const logs = getAuditLogs(40);
  return NextResponse.json({
    success: true,
    count: logs.length,
    data: logs,
  });
}
