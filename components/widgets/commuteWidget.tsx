import { Card, CardContent, CardHeader } from "@components/ui/card";
import { parseDurationToMinutes } from "@/lib/commute/parseDurationsToMinutes";
import { glassCard } from "@/lib/constants/glassCard";

async function getCommuteTime() {
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
      next: { revalidate: 900 }, // 15 minutes
    },
  );

  if (!response.ok) throw new Error("Failed to fetch commute time");
  return response.json();
}

export async function CommuteWidget() {
  const data = await getCommuteTime();

  const minutes = parseDurationToMinutes(data.routes[0].duration);
  const distanceKm = (data.routes[0].distanceMeters / 1000).toFixed(0);

  return (
    <Card className={`h-full ${glassCard}`}>
      <CardContent className="flex items-center justify-center h-full">
        <div className="flex flex-col font-bold text-4xl items-center">
          <p
            className={
              minutes < 30
                ? "text-green-500"
                : minutes < 60
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {minutes} min
          </p>
          <p className="text-xl text-muted-foreground">({distanceKm} km)</p>
        </div>
      </CardContent>
    </Card>
  );
}
