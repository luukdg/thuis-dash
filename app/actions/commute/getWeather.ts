"use server";

export async function getWeather() {
  const apiKey = process.env.GOOGLE_ROUTES_API;
  const lat = process.env.LAT;
  const lon = process.env.LON;

  try {
    const response = await fetch(
      `https://weather.googleapis.com/v1/currentConditions:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lon}`,
    );

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
