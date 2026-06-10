import { NextResponse } from "next/server";
import { getLastItemAdded } from "@/lib/media/playbackStore";

export async function GET() {
  const data = getLastItemAdded();
  return NextResponse.json(data ?? null);
}
