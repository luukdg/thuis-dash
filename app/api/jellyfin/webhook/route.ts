import { NextRequest, NextResponse } from "next/server";
import {
  startPlayback,
  stopPlayback,
  updatePlayback,
  setLastItemAdded,
} from "@/lib/media/playbackStore";

const ticksToSeconds = (ticks: number) => Math.floor(ticks / 10_000_000);

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.NotificationType) {
    return NextResponse.json({ ok: false });
  }

  const sessionId = `${body.DeviceId}-${body.ItemId}`;

  switch (body.NotificationType) {
    case "PlaybackStart":
      startPlayback(sessionId, {
        sessionId,
        title: body.Name,
        series: body.SeriesName,
        season: body.SeasonNumber,
        episode: body.EpisodeNumber,
        user: body.NotificationUsername,
        device: body.DeviceName,
        startedAt: body.Timestamp,
        currentTime: 0,
        duration: ticksToSeconds(body.RunTimeTicks),
      });
      break;

    case "PlaybackProgress":
      updatePlayback(sessionId, {
        currentTime: ticksToSeconds(body.PlaybackPositionTicks),
        duration: ticksToSeconds(body.RunTimeTicks),
      });
      break;

    case "PlaybackStop":
      stopPlayback(sessionId);
      break;

    case "ItemAdded": {
      setLastItemAdded({
        title: body.Name,
        series: body.SeriesName,
        season: body.SeasonNumber,
        episode: body.EpisodeNumber,
        id: body.ItemId,
        type: body.ItemType,
        addedAt: body.Timestamp,
      });

      break;
    }
  }

  return NextResponse.json({ ok: true });
}
