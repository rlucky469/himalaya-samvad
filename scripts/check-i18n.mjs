// Verifies that messages/en.json has exactly the same structure as messages/hi.json.
// Run: npm run i18n:check
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (locale) => JSON.parse(readFileSync(path.join(root, "messages", `${locale}.json`), "utf8"));

const base = load("hi");
const other = load("en");
const problems = [];

function compare(a, b, trail) {
  const where = trail || "(root)";
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return problems.push(`${where}: expected an array in en.json`);
    if (a.length !== b.length) problems.push(`${where}: hi has ${a.length} items, en has ${b.length}`);
    a.forEach((item, i) => b[i] !== undefined && compare(item, b[i], `${where}[${i}]`));
    return;
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object") return problems.push(`${where}: expected an object in en.json`);
    for (const key of Object.keys(a)) {
      if (!(key in b)) problems.push(`${where}.${key}: missing in en.json`);
      else compare(a[key], b[key], `${where}.${key}`);
    }
    for (const key of Object.keys(b)) if (!(key in a)) problems.push(`${where}.${key}: extra key in en.json`);
    return;
  }
  if (typeof a !== typeof b) problems.push(`${where}: type differs (${typeof a} vs ${typeof b})`);
  // ICU placeholders like {count} must match between languages
  if (typeof a === "string") {
    const vars = (s) => [...s.matchAll(/\{(\w+)[,}]/g)].map((m) => m[1]).sort().join(",");
    if (vars(a) !== vars(b)) problems.push(`${where}: placeholders differ (hi: ${vars(a)} | en: ${vars(b)})`);
    if (/'\{/.test(b) || /'\{/.test(a)) problems.push(`${where}: apostrophe before "{" breaks ICU formatting`);
  }
}

compare(base, other, "");

if (problems.length) {
  console.error(`✖ ${problems.length} i18n problem(s):\n` + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log("✔ hi.json and en.json have the same structure");
