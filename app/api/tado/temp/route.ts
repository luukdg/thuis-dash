import { tadoFetch } from "@/lib/temperature/tado";
import { NextResponse } from "next/server";
import { RoomTemp } from "@/types/tadoTypes";

export async function GET() {
  try {
    const rooms = (await tadoFetch(
      "https://hops.tado.com/homes/1733550/rooms?ngsw-bypass=true",
    )) as any[];

    console.log("[weather] Success", rooms);

    // Ordering API input
    const result: RoomTemp[] = rooms.map((room: any) => ({
      id: room.id,
      name: room.name,
      temperature: room.sensorDataPoints?.insideTemperature?.value ?? 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch Tado data", error);
    return NextResponse.json([]);
  }
}
