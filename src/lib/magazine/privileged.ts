import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { signingSecret } from "./signing";

// How long the reader opened from /privileged-access may keep requesting pages
const GRANT_TTL_SECONDS = 6 * 60 * 60;

const sign = (slug: string, exp: number) => createHmac("sha256", signingSecret()).update(`privileged:${slug}:${exp}`).digest("base64url");

/**
 * Short-lived pass handed to the reader on /privileged-access/read, so the pages API unlocks the full issue.
 * It is created on the server for every visit — nobody has to generate or share it.
 */
export function createAccessGrant(slug: string) {
  const exp = Math.floor(Date.now() / 1000) + GRANT_TTL_SECONDS;
  return `${exp}-${sign(slug, exp)}`;
}

export function verifyAccessGrant(grant: string, slug: string) {
  const [expPart, sig = ""] = grant.split(/-(.*)/s);
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = Buffer.from(sign(slug, exp));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export const PRIVILEGED_WATERMARK = "PRIVILEGED ACCESS  •  himalayasamvad.in";
