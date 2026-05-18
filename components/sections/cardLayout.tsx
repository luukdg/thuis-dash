import { CalendarWidget } from "@components/widgets/commuteWidget";
import { WeatherWidget } from "@components/widgets/weatherWidget";

export function CardLayout() {
  return (
    <>
      <div className="flex flex-row mx-5 gap-3 ">
        <CalendarWidget />
        <WeatherWidget />
      </div>
    </>
  );
}
