import { NextResponse } from "next/server";
import https from "https";
import fs from "fs";
import path from "path";

const DEVICE_IP = process.env.HOMEWIZARD_IP!;
const TOKEN = process.env.HOMEWIZARD_TOKEN!;

const ca = fs.readFileSync(path.join(process.cwd(), "certs/homewizard-ca.pem"));

const agent = new https.Agent({
  ca,
  servername: "5c2faf429adc.p1dongle.device.homewizard.energy",
});

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

            resolve(
              NextResponse.json({
                currentElectriciy: parsed.power_w,
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
