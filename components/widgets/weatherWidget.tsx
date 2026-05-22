"use client";

import { Card, CardContent, CardHeader, CardFooter } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { getWeather } from "@/app/actions/getWeather";
import { useState, useEffect } from "react";

export function WeatherWidget() {
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(0);

  const fetchWeather = async () => {
    try {
      const result = await getWeather();
      const temperature = result.temperature.degrees;
      const iconUrl = `${result.weatherCondition.iconBaseUri}.png`;

      console.log(result);

      setTemperature(temperature);
      setWeatherIcon(iconUrl);

      localStorage.setItem("Temperature", String(temperature));
      localStorage.setItem("TempImg", iconUrl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const savedTemp = localStorage.getItem("Temperature");
    const savedImg = localStorage.getItem("TempImg");

    setTemperature(Number(savedTemp));
    setWeatherIcon(savedImg);
  }, []);

  return (
    <Card>
      <CardHeader className="text-xl">Weer van vandaag</CardHeader>
      <CardContent className="font-bold flex flex-row gap-3">
        {temperature} °C{" "}
        <img src={weatherIcon ?? undefined} alt="" width={32} height={32} />
      </CardContent>

      <CardFooter>
        <Button onClick={fetchWeather}>Fetch data</Button>
      </CardFooter>
    </Card>
  );
}
