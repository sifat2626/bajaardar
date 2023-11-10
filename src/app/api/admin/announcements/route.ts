import { NextRequest, NextResponse } from "next/server";
import { getAllAnnouncements, createAnnouncement } from "@/lib/commodityStore";

export async function GET() {
  const data = getAllAnnouncements(false); // return all (including inactive) for admin
  return NextResponse.json({
    success: true,
    count: data.length,
    data,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.titleEn || !body.titleBn || !body.messageEn || !body.messageBn) {
      return NextResponse.json(
        {
          success: false,
          message: "titleEn, titleBn, messageEn, and messageBn are required",
        },
        { status: 400 }
      );
    }

    const ann = createAnnouncement(body);
    return NextResponse.json(
      {
        success: true,
        message: "Announcement created successfully",
        data: ann,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create announcement" },
      { status: 500 }
    );
  }
}
