import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data/homewizard.db");

export const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS electricity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    power_w INTEGER NOT NULL,
    energy_import_kwh REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    value REAL NOT NULL
  );
`);
