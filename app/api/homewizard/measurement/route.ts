// app/api/homewizard/route.ts
import { NextRequest, NextResponse } from "next/server";

const DEVICE_IP = process.env.HOMEWIZARD_IP;
const TOKEN = process.env.HOMEWIZARD_TOKEN;

export async function GET(req: NextRequest) {
  const response = await fetch(`https://${DEVICE_IP}/api`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "X-Api-Version": "2",
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
