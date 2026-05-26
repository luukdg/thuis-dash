import { CommuteWidget } from "@components/widgets/commuteWidget";
import { WeatherWidget } from "@components/widgets/weatherWidget";
import { CalendarWidget } from "@components/widgets/calendarWidget";
import { GarbageWidget } from "@components/widgets/garbageWidget";
import { CameraWidget } from "@components/widgets/cameraWidget";
import { EnergyWidget } from "@components/widgets/energyWidget";
import { TodoWidget } from "@components/widgets/todoWidget";

export function WidgetLayout() {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 p-5 w-full flex-1 h-screen">
      {/* Column 1 - Quick Glance */}
      <div className="col-start-1 row-start-1">
        <WeatherWidget />
      </div>
      <div className="col-start-1 row-start-2">
        <CommuteWidget />
      </div>

      {/* Column 2-3 - Primary Focus */}
      <div className="col-start-2 col-span-2 row-span-2">
        <CalendarWidget />
      </div>

      {/* Column 4 - Secondary */}
      <div className="col-start-4 row-span-1">
        <CameraWidget />
      </div>

      <div className="col-start-4 row-start-2 row-span-1">
        <TodoWidget />
      </div>

      {/* Row 3 - Full Width Secondary Info */}
      <div className="col-start-1 col-span-2 row-start-3">
        <EnergyWidget />
      </div>
      <div className="col-start-3 col-span-2 row-start-3">
        <GarbageWidget />
      </div>
    </div>
  );
}
