/**
 * start.mjs — production startup wrapper for Next.js standalone
 *
 * Guards against starting without a build, and ensures PORT/HOSTNAME
 * are correctly set for Hostinger's Node.js environment.
 *
 * The prebuilt .next/standalone (excluding node_modules) is committed to git.
 * On first run, this script symlinks the root node_modules into standalone so
 * the server can resolve its dependencies without a full rebuild.
 */
import { existsSync, symlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const serverPath = join(root, ".next", "standalone", "server.js");
const standaloneNmPath = join(root, ".next", "standalone", "node_modules");
const rootNmPath = join(root, "node_modules");

if (!existsSync(serverPath)) {
  console.error(
    "\n[start] ERROR: .next/standalone/server.js does not exist.\n" +
    "       Run 'npm run build' before starting the server.\n"
  );
  process.exit(1);
}

// Symlink root node_modules into standalone if not already present.
// This avoids a full npm install inside the standalone directory.
if (!existsSync(standaloneNmPath) && existsSync(rootNmPath)) {
  try {
    symlinkSync(rootNmPath, standaloneNmPath, "junction");
    console.log("[start] Linked node_modules into .next/standalone");
  } catch (e) {
    console.warn("[start] Could not symlink node_modules (non-fatal):", e.message);
  }
}

// Next.js standalone reads PORT and HOSTNAME from env.
// Default to 3000 / 0.0.0.0 if not set by the host.
process.env.PORT = process.env.PORT || "3000";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

// APP_ROOT lets all API routes resolve the uploads directory relative to the
// real project root, regardless of what process.cwd() returns at runtime.
process.env.APP_ROOT = root;

// Sync schema to DB before starting (no-op if DATABASE_URL not set or DB unreachable)
try {
  await import(join(__dirname, "maybe-migrate.mjs").replace(/\\/g, "/"));
} catch (e) {
  console.warn("[start] maybe-migrate error (non-fatal):", e.message);
}

console.log(`[start] Starting Next.js on ${process.env.HOSTNAME}:${process.env.PORT}`);

// Load the standalone server
const require = createRequire(import.meta.url);
require(serverPath);

