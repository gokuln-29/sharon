// Sharon Physiotherapy — daily SQLite backup
// Safe online backup using better-sqlite3 (no need to stop the app).
// Writes to BACKUP_DIR with rotation: keep last N daily + N weekly (Sunday).

import Database from "better-sqlite3";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

const DB_PATH = resolve(PROJECT_ROOT, "dev.db");
const BACKUP_DIR = "D:\\SharonBackups";
const KEEP_DAILY = 14;
const KEEP_WEEKLY = 12;

function log(msg) {
  const stamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`[${stamp}] ${msg}`);
}

async function main() {
  if (!existsSync(DB_PATH)) {
    log(`SKIP: ${DB_PATH} not found. Run the app once to create the database.`);
    return;
  }

  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
    log(`Created backup folder: ${BACKUP_DIR}`);
  }

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateTag = `${yyyy}-${mm}-${dd}`;
  const isSunday = now.getDay() === 0;
  const prefix = isSunday ? "dev-weekly-" : "dev-daily-";
  const dest = join(BACKUP_DIR, `${prefix}${dateTag}.db`);

  const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  try {
    await db.backup(dest);
    const kb = (statSync(dest).size / 1024).toFixed(1);
    log(`Backup OK: ${dest} (${kb} KB)`);
  } finally {
    db.close();
  }

  const all = readdirSync(BACKUP_DIR);
  const dailies = all
    .filter((f) => f.startsWith("dev-daily-") && f.endsWith(".db"))
    .sort()
    .reverse();
  const weeklies = all
    .filter((f) => f.startsWith("dev-weekly-") && f.endsWith(".db"))
    .sort()
    .reverse();

  for (const f of dailies.slice(KEEP_DAILY)) {
    unlinkSync(join(BACKUP_DIR, f));
    log(`Rotated out: ${f}`);
  }
  for (const f of weeklies.slice(KEEP_WEEKLY)) {
    unlinkSync(join(BACKUP_DIR, f));
    log(`Rotated out: ${f}`);
  }

  log("Done.");
}

main().catch((err) => {
  log(`ERROR: ${err.message}`);
  console.error(err);
  process.exit(1);
});
