import { NextResponse } from "next/server";
import { parseDurationToMinutes } from "@/lib/commute/parseDurationsToMinutes";

export async function GET() {
  try {
    const response = await fetch(
      `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_ROUTES_API}&location.latitude=${process.env.LAT}&location.longitude=${process.env.LON}`,
    );

    const responseJson = await response.json();
    const temp = Math.round(responseJson.temperature.degrees);
    const description = responseJson.weatherCondition?.description?.text || "—";
    const iconUrl = `${responseJson.weatherCondition.iconBaseUri}.png`;

    if (!response.ok) {
      return NextResponse.json(
        { error: "Weather API request failed" },
        { status: response.status },
      );
    }
    return NextResponse.json({ temp, description, iconUrl });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 },
    );
  }
}
