/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ECCELLERE — Submit New Asset Agent
 *  Automates logging in and submitting a new asset on the Specialist Portal.
 *
 *  HOW TO RUN:
 *    npm run agent:submit-asset
 *
 *  CONFIGURATION:
 *    Edit the CREDENTIALS and ASSET sections below before running.
 *    For FILE_PATH, provide an absolute or relative path to the file you want
 *    to upload (PDF, Excel, PowerPoint, Word or ZIP — max 50 MB).
 *    Set FILE_PATH to null to skip file upload.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CREDENTIALS = {
  email: "testspecialist@eccellere.in",
  password: "Specialist1234",
};

const ASSET = {
  title: "MSME Growth Strategy Playbook",
  tagline: "A proven 90-day framework to unlock sustainable growth for small and mid-size enterprises.",
  category: "Strategy & Planning",       // must match one of the site's categories
  format: "PDF",                          // PDF | Excel / Spreadsheet | PowerPoint | Word Document | ZIP Bundle
  price: "4999",
  description: `This playbook delivers a structured, step-by-step growth strategy framework specifically designed for MSME founders and leadership teams.

It covers:
- Market positioning and competitive differentiation
- Revenue diversification and new channel identification
- Cost optimisation levers across operations and procurement
- Team scaling roadmap aligned to business milestones
- 30/60/90-day execution plan with accountability checkpoints

Whether you are preparing for a funding round, entering a new market, or recovering from a slow quarter, this playbook gives you the clarity and tools to move with confidence.`,
  targetAudience: "MSME founders, CFOs, operations managers, business development leads",
  tags: ["MSME", "strategy", "growth", "playbook", "SME", "execution", "planning"],
  // Folder to pick a file from — agent will upload the first supported file it finds.
  uploadFolder: "D:\\Cowork\\Output",
};

// ─── AGENT ────────────────────────────────────────────────────────────────────

test("Submit New Asset on Specialist Portal", async ({ page }) => {

  // ── Step 1: Login ──────────────────────────────────────────────────────────
  console.log("→ Navigating to login page…");
  await page.goto("/login");
  await expect(page).toHaveTitle(/Eccellere/i);

  await page.getByLabel(/email/i).fill(CREDENTIALS.email);
  await page.getByLabel(/password/i).fill(CREDENTIALS.password);
  await page.getByRole("button", { name: /sign in/i }).click();

  // Wait for redirect to specialist portal after successful login
  await page.waitForURL(/\/specialist/, { timeout: 20_000 });
  console.log("✓ Logged in — at:", page.url());

  // ── Step 2: Navigate to Submit New Asset ───────────────────────────────────
  console.log("→ Navigating to Submit New Asset page…");
  await page.goto("/specialist/assets/new");
  await expect(page.getByRole("heading", { name: /Submit New Asset/i })).toBeVisible();
  console.log("✓ On Submit New Asset page");

  // ── Step 3: Core Details ───────────────────────────────────────────────────
  console.log("→ Filling Core Details…");

  await page.locator("#title").fill(ASSET.title);
  await page.locator("#tagline").fill(ASSET.tagline);

  await page.locator("#category").selectOption(ASSET.category);
  await page.locator("#format").selectOption(ASSET.format);
  await page.locator("#price").fill(ASSET.price);

  console.log("✓ Core Details filled");

  // ── Step 4: Description ────────────────────────────────────────────────────
  console.log("→ Filling Description…");

  await page.locator("#description").fill(ASSET.description);
  await page.locator("#targetAudience").fill(ASSET.targetAudience);

  // Add tags one by one
  for (const tag of ASSET.tags) {
    await page.locator('[name="tagInput"]').fill(tag);
    await page.getByRole("button", { name: /^Add$/i }).click();
    // Brief pause to allow React state update
    await page.waitForTimeout(200);
  }
  console.log(`✓ Description filled — ${ASSET.tags.length} tags added`);

  // ── Step 5: File Upload — pick first supported file from uploadFolder ─────
  const ALLOWED_EXTS = [".pdf", ".xlsx", ".xls", ".pptx", ".ppt", ".docx", ".doc", ".zip"];

  const folderPath = path.resolve(ASSET.uploadFolder);
  const allFiles = fs.readdirSync(folderPath);
  const uploadFile = allFiles.find((f) =>
    ALLOWED_EXTS.includes(path.extname(f).toLowerCase())
  );

  if (uploadFile) {
    const resolvedPath = path.join(folderPath, uploadFile);
    console.log("→ Uploading file:", resolvedPath);
    // The file input is visually hidden (sr-only) inside a <label>
    await page.locator('input[type="file"]').setInputFiles(resolvedPath);
    // Confirm file name appears in the upload zone
    await expect(page.getByText(uploadFile)).toBeVisible({ timeout: 10_000 });
    console.log("✓ File uploaded:", uploadFile);
  } else {
    console.log(`⚠ No supported file found in "${folderPath}" — skipping file upload`);
  }

  // ── Step 6: Terms & Conditions checkbox ───────────────────────────────────
  console.log("→ Accepting terms…");
  await page.locator('[name="termsAccepted"]').check();
  await expect(page.locator('[name="termsAccepted"]')).toBeChecked();
  console.log("✓ Terms accepted");

  // ── Step 7: Submit ─────────────────────────────────────────────────────────
  console.log("→ Submitting asset…");
  await page.getByRole("button", { name: /Submit for Review/i }).click();

  // Wait for success state — heading changes to "Asset Submitted for Review"
  await expect(
    page.getByRole("heading", { name: /Asset Submitted for Review/i })
  ).toBeVisible({ timeout: 30_000 });

  console.log(`✓ SUCCESS — "${ASSET.title}" submitted for review!`);
});
