import { NextResponse } from "next/server";
import { calendar } from "@/lib/calendar/google";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 60);
    endDate.setHours(23, 59, 59, 999);

    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: startOfToday.toISOString(),
      timeMax: endDate.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const items = res.data.items ?? [];

    return NextResponse.json(
      items.map((event) => ({
        id: event.id ?? crypto.randomUUID(),
        summary: event.summary ?? "Untitled event",
        start: event.start?.dateTime ?? event.start?.date ?? "",
        end: event.end?.dateTime ?? event.end?.date ?? "",
        allDay: !event.start?.dateTime,
      })),
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch calendar events", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 },
    );
  }
}
