/**
 * Share-link tokens for the full magazine (used by the website and by scripts/magazine/create-share-link.mjs).
 * Token = base64url("1|slug|expiresAt|id|label") + 22-char HMAC. No "." in it, so the locale proxy still matches the URL.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const VERSION = "1";
const SIG_LENGTH = 22; // 16 bytes of HMAC-SHA256, base64url
const DEV_SECRET = "dev-only-magazine-secret-change-me";

/** Same secret on the server and in the CLI: MAGAZINE_SHARE_SECRET, else MAGAZINE_SIGNING_SECRET */
export function shareSecret(env = process.env) {
  const value = env.MAGAZINE_SHARE_SECRET || env.MAGAZINE_SIGNING_SECRET;
  if (value && value.length >= 16) return value;
  if (env.NODE_ENV === "production") throw new Error("MAGAZINE_SHARE_SECRET or MAGAZINE_SIGNING_SECRET (16+ characters) must be set in production");
  return DEV_SECRET;
}

const sign = (payload, secret) => createHmac("sha256", secret).update(`share:${payload}`).digest().subarray(0, 16).toString("base64url");

export function createShareToken({ slug, label = "", expiresAt = 0, id = randomBytes(6).toString("base64url") }, secret) {
  const cleanLabel = String(label).replace(/\|/g, " ").trim().slice(0, 60);
  const payload = Buffer.from([VERSION, slug, String(expiresAt), id, cleanLabel].join("|"), "utf8").toString("base64url");
  return { token: payload + sign(payload, secret), id };
}

export function readShareToken(token, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (typeof token !== "string" || token.length <= SIG_LENGTH || !/^[A-Za-z0-9_-]+$/.test(token)) return { ok: false, reason: "invalid" };
  const payload = token.slice(0, -SIG_LENGTH);
  const given = Buffer.from(token.slice(-SIG_LENGTH));
  const expected = Buffer.from(sign(payload, secret));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, reason: "invalid" };

  const [version, slug, exp, id, ...labelParts] = Buffer.from(payload, "base64url").toString("utf8").split("|");
  const expiresAt = Number(exp);
  if (version !== VERSION || !slug || !id || !Number.isFinite(expiresAt)) return { ok: false, reason: "invalid" };
  if (expiresAt > 0 && expiresAt < nowSeconds) return { ok: false, reason: "expired" };
  return { ok: true, slug, id, expiresAt, label: labelParts.join("|") };
}
