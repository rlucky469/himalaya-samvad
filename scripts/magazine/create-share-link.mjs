#!/usr/bin/env node
/**
 * Creates a private link that opens one full issue without login.
 *
 *   npm run share:create -- --slug pratham-ank-october-2026 --for "Amar Ujala desk" --days 30
 *   npm run share:create -- --slug pratham-ank-october-2026 --for "Board copy" --days 0     (never expires)
 *
 * Run it with the same MAGAZINE_SHARE_SECRET / MAGAZINE_SIGNING_SECRET as the live site (.env.local),
 * otherwise the link won't open there. To switch a link off, add its ID to MAGAZINE_REVOKED_SHARE_IDS.
 */
import { access } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { createShareToken, shareSecret } from "../../src/lib/magazine/share-codec.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
nextEnv.loadEnvConfig(root, false, { info: () => {}, error: console.error });

const { values } = parseArgs({
  options: {
    slug: { type: "string" },
    for: { type: "string", default: "" },
    days: { type: "string", default: "30" },
  },
});

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  console.error('Usage: npm run share:create -- --slug <issue-slug> [--for "Name"] [--days 30 | 0 for no expiry]\n');
  process.exit(1);
}

const slug = values.slug ?? "";
const days = Number(values.days);
if (!/^[a-z0-9-]+$/.test(slug)) fail("Missing or invalid --slug");
if (!Number.isFinite(days) || days < 0) fail("--days must be 0 or more");

try {
  await access(path.join(root, "private", "magazine", slug, "manifest.json"));
} catch {
  fail(`No converted magazine found for "${slug}". Run npm run magazine:build first.`);
}

const expiresAt = days > 0 ? Math.floor(Date.now() / 1000) + Math.round(days * 86400) : 0;
const { token, id } = createShareToken({ slug, label: values.for, expiresAt }, shareSecret());
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

console.log(`
Share link created for "${slug}"
  For:      ${values.for || "—"}
  Expires:  ${expiresAt ? new Date(expiresAt * 1000).toISOString().slice(0, 10) : "never"}
  Link ID:  ${id}   (add to MAGAZINE_REVOKED_SHARE_IDS to switch this link off)

  Hindi:    ${site}/shared/${token}
  English:  ${site}/en/shared/${token}
`);
