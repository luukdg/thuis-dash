import { Card, CardContent, CardHeader } from "@components/ui/card";
import Image from "next/image";

async function getWeather() {
  const response = await fetch(
    `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_ROUTES_API}&location.latitude=${process.env.LAT}&location.longitude=${process.env.LON}`,
    { next: { revalidate: 900 } }, // cache & revalidate every 15 min
  );

  if (!response.ok) throw new Error("Failed to fetch weather");
  return response.json();
}

export async function WeatherWidget() {
  const data = await getWeather();
  const temperature = data.temperature.degrees;
  const iconUrl = `${data.weatherCondition.iconBaseUri}.png`;

  return (
    <Card className="h-full">
      <CardContent className="flex-col gap-3">
        <h1>Buiten</h1>
        <div className="font-bold flex gap-3 text-4xl">
          {temperature}°
          <Image
            src={iconUrl}
            alt=""
            width={32}
            height={32}
            style={{ width: "32px", height: "32px" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
