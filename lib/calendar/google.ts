import { google } from "googleapis";

export const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
});

export const calendar = google.calendar({
  version: "v3",
  auth,
});
