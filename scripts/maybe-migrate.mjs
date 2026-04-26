/**
 * maybe-migrate.mjs
 * Runs `prisma db push` to sync the schema to the live DB.
 * Uses db push (not migrate deploy) because the DB was originally bootstrapped
 * with db push and has no migrations history table.
 * If DATABASE_URL is not set, or the database is unreachable, warns and exits 0.
 */
import { spawnSync } from "child_process";

// Guard: skip entirely if no DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.warn("[maybe-migrate] DATABASE_URL not set — skipping schema push.");
  process.exit(0);
}

const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--accept-data-loss"],
  {
    stdio: ["inherit", "inherit", "pipe"],
    shell: true,
  }
);

const stderr = result.stderr ? result.stderr.toString() : "";

if (result.status === 0) {
  process.exit(0);
}

if (
  stderr.includes("P1001") ||
  stderr.includes("ECONNREFUSED") ||
  stderr.includes("Can't reach database") ||
  stderr.includes("datasource.url") ||
  stderr.includes("DATABASE_URL") ||
  stderr.includes("property is required")
) {
  console.warn(
    "[maybe-migrate] DB not reachable — skipping schema push."
  );
  process.exit(0);
}

// Real error — print it and fail the build
console.error(stderr);
process.exit(result.status ?? 1);
