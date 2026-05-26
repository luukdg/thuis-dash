// commuteWidget.tsx (no "use client")
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { parseDurationToMinutes } from "@/lib/commute/parseDurationsToMinutes";

async function getCommuteTime() {
  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_ROUTES_API as string,
        "X-Goog-FieldMask": "routes.duration",
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
      next: { revalidate: 600 }, // 10 minutes
    },
  );

  if (!response.ok) throw new Error("Failed to fetch commute time");
  return response.json();
}

export async function CommuteWidget() {
  const data = await getCommuteTime();
  const minutes = parseDurationToMinutes(data.routes[0].duration);

  return (
    <Card>
      <CardHeader className="text-xl">Reistijd Evie</CardHeader>
      <CardContent className="font-bold">{minutes} Minutes</CardContent>
    </Card>
  );
}
