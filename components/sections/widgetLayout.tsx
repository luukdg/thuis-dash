import { CommuteWidget } from "@components/widgets/commuteWidget";
import { WeatherWidget } from "@components/widgets/weatherWidget";
import { CalendarWidget } from "@components/widgets/calendarWidget";
import { GarbageWidget } from "@components/widgets/garbageWidget";

export function WidgetLayout() {
  return (
    <>
      <div className="flex flex-row mx-5 gap-3 ">
        <CommuteWidget />
        <WeatherWidget />
        <CalendarWidget />
        <GarbageWidget />
      </div>
    </>
  );
}
