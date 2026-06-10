import { NextResponse } from "next/server";
import https from "https";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";

const DEVICE_IP = process.env.HOMEWIZARD_IP!;
const TOKEN = process.env.HOMEWIZARD_TOKEN!;

const ca = fs.readFileSync(path.join(process.cwd(), "certs/homewizard-ca.pem"));

const agent = new https.Agent({
  ca,
  servername: "5c2faf429adc.p1dongle.device.homewizard.energy",
});

const toUnix = (ts: string) => Math.floor(new Date(ts).getTime() / 1000);

const HISTORY_DAYS = 7;

export function GET(): Promise<Response> {
  return new Promise<Response>((resolve) => {
    const req = https.request(
      {
        hostname: DEVICE_IP,
        path: "/api/measurement",
        method: "GET",
        agent,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "X-Api-Version": "2",
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("error", (err) => {
          resolve(NextResponse.json({ error: String(err) }, { status: 500 }));
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);

            // 1. Ruwe metingen opslaan (nodig voor MAX - MIN van vandaag)
            db.prepare(
              `INSERT INTO electricity (timestamp, power_w, energy_import_kwh)
           VALUES (?, ?, ?)`,
            ).run(
              toUnix(parsed.timestamp),
              parsed.power_w,
              parsed.energy_import_kwh,
            );

            if (parsed.external?.[0]) {
              db.prepare(
                `INSERT OR IGNORE INTO gas (timestamp, value)
             VALUES (?, ?)`,
              ).run(
                toUnix(parsed.external[0].timestamp),
                parsed.external[0].value,
              );
            }

            // 2. Bepaal de lokale datum één keer (DST-proof via 'localtime')
            const { d: today } = db
              .prepare(`SELECT date('now', 'localtime') AS d`)
              .get() as { d: string };

            // 3. Totalen van vandaag
            const dailyKwh = db
              .prepare(
                `SELECT MAX(energy_import_kwh) - MIN(energy_import_kwh) AS kwh_today
             FROM electricity
             WHERE date(timestamp, 'unixepoch', 'localtime') = ?`,
              )
              .get(today) as { kwh_today: number | null };

            const dailyGas = db
              .prepare(
                `SELECT MAX(value) - MIN(value) AS m3_today
             FROM gas
             WHERE date(timestamp, 'unixepoch', 'localtime') = ?`,
              )
              .get(today) as { m3_today: number | null };

            const kwhToday = dailyKwh.kwh_today ?? 0;
            const m3Today = dailyGas.m3_today ?? 0;

            // 4. Dagtotaal wegschrijven (upsert) -> historie blijft bestaan
            db.prepare(
              `INSERT INTO daily_usage (date, kwh, m3)
           VALUES (?, ?, ?)
           ON CONFLICT(date) DO UPDATE SET
             kwh = excluded.kwh,
             m3  = excluded.m3`,
            ).run(today, kwhToday, m3Today);

            // 👇 5. OPRUIMEN — hier plaatsen
            db.prepare(
              `DELETE FROM electricity WHERE timestamp < strftime('%s', 'now', '-2 days')`,
            ).run();
            db.prepare(
              `DELETE FROM gas WHERE timestamp < strftime('%s', 'now', '-2 days')`,
            ).run();

            // 6. Historie voor het staafdiagram (oud -> nieuw)
            const history = db
              .prepare(
                `SELECT date, kwh, m3
             FROM daily_usage
             ORDER BY date DESC
             LIMIT ?`,
              )
              .all(HISTORY_DAYS)
              .reverse();

            resolve(
              NextResponse.json({
                today: {
                  kwh: kwhToday,
                  m3: m3Today,
                },
                history, // [{ date, kwh, m3 }, ...]
              }),
            );
          } catch (err) {
            resolve(NextResponse.json({ error: String(err) }, { status: 500 }));
          }
        });
      },
    );

    req.on("error", (err) => {
      resolve(NextResponse.json({ error: String(err) }, { status: 500 }));
    });

    req.end();
  });
}
