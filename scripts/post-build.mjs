/**
 * post-build.mjs
 * Copies the files that Next.js standalone mode needs but doesn't bundle itself:
 *   .next/static  →  .next/standalone/.next/static
 *   public        →  .next/standalone/public
 *
 * Must run AFTER `next build`. Called automatically by `npm run build`.
 */
import { cpSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function copyDir(src, dest) {
  if (!existsSync(src)) {
    console.log(`[post-build] skipping ${src} (does not exist)`);
    return;
  }
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log(`[post-build] copied ${src} → ${dest}`);
}

copyDir(
  join(root, ".next", "static"),
  join(root, ".next", "standalone", ".next", "static")
);

copyDir(
  join(root, "public"),
  join(root, ".next", "standalone", "public")
);

console.log("[post-build] done");
