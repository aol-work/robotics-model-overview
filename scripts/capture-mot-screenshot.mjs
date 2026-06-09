import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs");
const outFile = path.join(outDir, "screenshot-mot.png");
const baseUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4173/";

/** Choice button label fragments at each drill-down step. */
const labels = ["World-Action Model", "Unified", "Diffusion Based", "MoT"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
await page.goto(baseUrl, { waitUntil: "networkidle" });

async function openChoices(page) {
  await page.locator(".hover-zone").hover({ force: true });
  await page.waitForSelector(".choice", { timeout: 5000 });
}

for (const label of labels) {
  await openChoices(page);
  await page.locator(".choice", { hasText: label }).click({ timeout: 5000 });
  await page.waitForTimeout(450);
}

await mkdir(outDir, { recursive: true });
await page.screenshot({ path: outFile, fullPage: true });
await browser.close();

console.log(`Saved ${outFile}`);
