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

            // INSERT electricity
            db.prepare(
              `
            INSERT INTO electricity (timestamp, power_w, energy_import_kwh)
            VALUES (?, ?, ?)
          `,
            ).run(
              toUnix(parsed.timestamp),
              parsed.power_w,
              parsed.energy_import_kwh,
            );

            // INSERT gas (only if new timestamp)
            if (parsed.external?.[0]) {
              db.prepare(
                `
              INSERT OR IGNORE INTO gas (timestamp, value)
              VALUES (?, ?)
            `,
              ).run(
                toUnix(parsed.external[0].timestamp),
                parsed.external[0].value,
              );
            }

            // Daily kWh total
            const dailyKwh = db
              .prepare(
                `
            SELECT 
              MAX(energy_import_kwh) - MIN(energy_import_kwh) AS kwh_today
            FROM electricity
            WHERE date(timestamp + 7200, 'unixepoch') = date('now', '+2 hours')
          `,
              )
              .get() as { kwh_today: number };

            // Daily m³ total
            const dailyGas = db
              .prepare(
                `
            SELECT 
              MAX(value) - MIN(value) AS m3_today
            FROM gas
            WHERE date(timestamp + 7200, 'unixepoch') = date('now', '+2 hours')
          `,
              )
              .get() as { m3_today: number };

            // Hourly gas usage (for chart)
            const hourlyGas = db
              .prepare(
                `
            SELECT
              strftime('%H:00', timestamp + 7200, 'unixepoch') AS hour,
              MAX(value) - MIN(value) AS usage
            FROM gas
            WHERE date(timestamp + 7200, 'unixepoch') = date('now', '+2 hours')
            GROUP BY hour
            ORDER BY hour
          `,
              )
              .all();

            // Hourly kWh usage (for chart)
            const hourlyKwh = db
              .prepare(
                `
            SELECT
              strftime('%H:00', timestamp + 7200, 'unixepoch') AS hour,
              MAX(energy_import_kwh) - MIN(energy_import_kwh) AS kwh
            FROM electricity
            WHERE date(timestamp + 7200, 'unixepoch') = date('now', '+2 hours')
            GROUP BY hour
            ORDER BY hour
          `,
              )
              .all();

            resolve(
              NextResponse.json({
                today: {
                  kwh: dailyKwh.kwh_today ?? 0,
                  m3: dailyGas.m3_today ?? 0,
                },
                charts: {
                  hourlyGas,
                  hourlyKwh,
                },
                live: {
                  power_w: parsed.power_w,
                },
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
