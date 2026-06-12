import { NextResponse } from "next/server";
import { parseDurationToMinutes } from "@/lib/commute/parseDurationsToMinutes";

export async function GET() {
  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_ROUTES_API as string,
          "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
        },
        body: JSON.stringify({
          origin: { placeId: process.env.HOME_LOCATION },
          destination: { placeId: process.env.WORK_LOCATION },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
          },
          languageCode: "nl-NL",
          units: "METRIC",
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Routes API request failed" },
        { status: response.status },
      );
    }

    const responseJson = await response.json();
    const minutes = parseDurationToMinutes(responseJson?.routes?.[0]?.duration);
    const distanceKm = (
      responseJson?.routes?.[0]?.distanceMeters / 1000
    ).toFixed(0);

    return NextResponse.json({ minutes, distanceKm });
  } catch (error) {
    console.error("Commute API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch commute time" },
      { status: 500 },
    );
  }
}
