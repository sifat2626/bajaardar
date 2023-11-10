import { NextResponse } from "next/server";
import { getAllAnnouncements } from "@/lib/commodityStore";

export async function GET() {
  const data = getAllAnnouncements(true); // only active announcements for public
  return NextResponse.json({
    success: true,
    data,
  });
}
