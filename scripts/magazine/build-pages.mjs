#!/usr/bin/env node
/**
 * Converts a magazine PDF into protected page images for the online reader.
 *
 *   npm run magazine:build -- --pdf magazine-source/my-issue.pdf --slug pratham-ank-october-2026
 *
 * Output (never inside /public, so pages can only be reached through the signed API):
 *   private/magazine/<slug>/pages/page-001.webp   full-size pages
 *   private/magazine/<slug>/thumbs/page-001.webp  small thumbnails
 *   private/magazine/<slug>/manifest.json         page list used by the reader
 *
 * The original PDF is never copied into the site.
 */
import { mkdir, rm, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { pdf } from "pdf-to-img";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const { values } = parseArgs({
  options: {
    pdf: { type: "string" },
    slug: { type: "string" },
    preview: { type: "string", default: "4" },
    width: { type: "string", default: "1400" },
    quality: { type: "string", default: "80" },
  },
});

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  console.error("Usage: npm run magazine:build -- --pdf <file.pdf> --slug <issue-slug> [--preview 4] [--width 1400] [--quality 80]\n");
  process.exit(1);
}

if (!values.pdf) fail("Missing --pdf");
if (!values.slug || !/^[a-z0-9-]+$/.test(values.slug)) fail("Missing or invalid --slug (use lowercase letters, numbers and dashes)");

const pdfPath = path.resolve(root, values.pdf);
const previewPages = Number(values.preview);
const targetWidth = Number(values.width);
const quality = Number(values.quality);

try {
  await access(pdfPath);
} catch {
  fail(`PDF not found: ${pdfPath}`);
}

const outDir = path.join(root, "private", "magazine", values.slug);
const pagesDir = path.join(outDir, "pages");
const thumbsDir = path.join(outDir, "thumbs");

await rm(outDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });
await mkdir(thumbsDir, { recursive: true });

console.log(`\n📖 Converting ${path.relative(root, pdfPath)} → private/magazine/${values.slug}\n`);

const document = await pdf(pdfPath, { scale: 2.5 });
const pages = [];
let number = 0;

for await (const png of document) {
  number += 1;
  const file = `page-${String(number).padStart(3, "0")}.webp`;

  const full = await sharp(png)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(path.join(pagesDir, file));

  await sharp(png).resize({ width: 320 }).webp({ quality: 70 }).toFile(path.join(thumbsDir, file));

  pages.push({ number, file, width: full.width, height: full.height });
  process.stdout.write(`  ✓ page ${number} (${Math.round(full.size / 1024)} KB)\n`);
}

if (!pages.length) fail("The PDF has no pages");

const manifest = {
  slug: values.slug,
  totalPages: pages.length,
  previewPages: Math.min(previewPages, pages.length),
  pageWidth: pages[0].width,
  pageHeight: pages[0].height,
  pages,
  generatedAt: new Date().toISOString(),
};

await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log(`\n✔ ${pages.length} pages ready. Free preview: first ${manifest.previewPages} pages.`);
console.log("  Keep the original PDF out of /public and out of git.\n");
