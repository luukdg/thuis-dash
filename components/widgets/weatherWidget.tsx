import { Card, CardContent } from "@components/ui/card";
import Image from "next/image";
import { glassCard } from "@/lib/constants/glassCard";

async function getWeather() {
  const response = await fetch(
    `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_ROUTES_API}&location.latitude=${process.env.LAT}&location.longitude=${process.env.LON}`,
    { next: { revalidate: 900 } },
  );

  if (!response.ok) throw new Error("Failed to fetch weather");

  return response.json();
}

export async function WeatherWidget() {
  const data = await getWeather();

  const temp = Math.round(data.temperature.degrees);
  const feelsLike = Math.round(data.feelsLikeTemperature.degrees);

  const condition = data.weatherCondition?.type;
  const description = data.weatherCondition?.description?.text || "—";

  const iconUrl = `${data.weatherCondition.iconBaseUri}.png`;

  const humidity = data.relativeHumidity;
  const wind = data.wind?.speed?.value;
  const uv = data.uvIndex;

  return (
    <Card className={`h-full ${glassCard}`}>
      <CardContent className="h-full">
        <div className="flex h-full w-full flex-col justify-center items-center gap-2">
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold">Veldhoven</p>
            {description}
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="text-4xl font-bold flex flex-row">{temp}° </div>
            <Image src={iconUrl} alt={description} width={25} height={25} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
