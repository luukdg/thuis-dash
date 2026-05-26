import { Card, CardContent, CardHeader } from "@components/ui/card";

async function getWeather() {
  const response = await fetch(
    `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_ROUTES_API}&location.latitude=${process.env.LAT}&location.longitude=${process.env.LON}`,
    { next: { revalidate: 600 } }, // cache & revalidate every 10 min
  );

  if (!response.ok) throw new Error("Failed to fetch weather");
  return response.json();
}

export async function WeatherWidget() {
  const data = await getWeather();
  const temperature = data.temperature.degrees;
  const iconUrl = `${data.weatherCondition.iconBaseUri}.png`;

  return (
    <Card>
      <CardHeader className="text-xl">Weer</CardHeader>
      <CardContent className="font-bold flex flex-row gap-3">
        {temperature} °C
        <img src={iconUrl} alt="" width={32} height={32} />
      </CardContent>
    </Card>
  );
}
