"use server";

export async function getCommuteTime() {
  const apiKey = process.env.GOOGLE_ROUTES_API;
  const HOME_LOCATION = process.env.HOME_LOCATION;
  const WORK_LOCATION = process.env.WORK_LOCATION;

  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

  const requestBody = {
    origin: {
      placeId: HOME_LOCATION,
    },
    destination: {
      placeId: WORK_LOCATION,
    },
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
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey as string,
        "X-Goog-FieldMask": "routes.duration",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch route:", error);
    return { error: "Failed to calculate route" };
  }
}
