import { NextResponse } from "next/server";
import { getAllPlaybacks } from "@/lib/media/playbackStore";

export async function GET() {
  return NextResponse.json(getAllPlaybacks());
}
