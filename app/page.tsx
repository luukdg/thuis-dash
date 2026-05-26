import { WidgetLayout } from "@components/sections/widgetLayout";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full flex-col">
        <div className="w-full flex flex-col items-center py-3">
          <h1 className="font-bold">Thuis Dashboard</h1>
        </div>
        <WidgetLayout />
      </main>
    </div>
  );
}
