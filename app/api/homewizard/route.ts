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

export async function GET() {
  return new Promise((resolve) => {
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

        res.on("end", () => {
          const parsed = JSON.parse(data);

          // insert electricity
          db.prepare(
            `
  INSERT INTO electricity (
    timestamp,
    power_w,
    energy_import_kwh
  )
  VALUES (?, ?, ?)
`,
          ).run(parsed.timestamp, parsed.power_w, parsed.energy_import_kwh);

          // insert gas
          if (parsed.external?.[0]) {
            db.prepare(
              `
    INSERT INTO gas (
      timestamp,
      value
    )
    VALUES (?, ?)
  `,
            ).run(parsed.external[0].timestamp, parsed.external[0].value);
          }

          resolve(
            NextResponse.json(JSON.parse(data), {
              status: res.statusCode,
            }),
          );
        });
      },
    );

    req.on("error", (err) => {
      resolve(NextResponse.json({ error: String(err) }, { status: 500 }));
    });

    req.end();
  });
}
