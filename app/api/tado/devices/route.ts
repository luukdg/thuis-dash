import { tadoFetch } from "@/lib/temperature/tado";
import { NextResponse } from "next/server";
import { DeviceType } from "@/types/tadoTypes";

export async function GET() {
  try {
    const devices = (await tadoFetch(
      "https://my.tado.com/api/v2/homes/1733550/mobileDevices",
    )) as any[];

    // Ordering API input
    const result: DeviceType[] = devices.map((device: any) => ({
      id: device.id,
      name: device.name === "Luuk telefoon" ? "Luuk" : device.name,
      atHome: device.location?.atHome ?? false,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch /mobileDevices Tado data", error);
    return NextResponse.json([]);
  }
}
