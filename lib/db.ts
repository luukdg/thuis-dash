import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data/homewizard.db");

export const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS electricity (
id INTEGER PRIMARY KEY AUTOINCREMENT,
timestamp INTEGER NOT NULL,
power_w INTEGER NOT NULL,
energy_import_kwh REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS gas (
id INTEGER PRIMARY KEY AUTOINCREMENT,
timestamp INTEGER NOT NULL UNIQUE,
value REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_usage (
date TEXT PRIMARY KEY,
kwh  REAL NOT NULL DEFAULT 0,
m3   REAL NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_electricity_timestamp
ON electricity (timestamp);
`);
