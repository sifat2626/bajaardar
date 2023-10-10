import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "BajaarDar (বাজার দর) Next.js Fullstack API",
    version: "2.0.0",
    platform: "Vercel Serverless Ready",
    timestamp: new Date().toISOString(),
  });
}
