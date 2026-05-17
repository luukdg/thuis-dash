import { CalendarCard } from "@components/widgets/calendarWidget";

export function CardLayout() {
  return (
    <>
      <div className="flex flex-1 flex-col mx-5 gap-3">
        <CalendarCard />
      </div>
    </>
  );
}
