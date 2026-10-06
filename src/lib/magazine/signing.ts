import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export type PageVariant = "full" | "thumb";

const DEV_SECRET = "dev-only-magazine-secret-change-me";

export function signingSecret() {
  const value = process.env.MAGAZINE_SIGNING_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "production") throw new Error("MAGAZINE_SIGNING_SECRET must be set (16+ characters) in production");
  return DEV_SECRET;
}

export const urlTtlSeconds = () => Number(process.env.MAGAZINE_URL_TTL_SECONDS ?? 600);

const encode = (value: string) => Buffer.from(value, "utf8").toString("base64url");
export const decodeWatermark = (value: string) => Buffer.from(value, "base64url").toString("utf8");

function signature(slug: string, page: number, variant: PageVariant, exp: number, wm: string) {
  return createHmac("sha256", signingSecret()).update(`${slug}:${page}:${variant}:${exp}:${wm}`).digest("base64url");
}

/** Short-lived URL for one page image. The watermark text is part of the signature, so it can't be edited. */
export function signedPageUrl(slug: string, page: number, variant: PageVariant, watermark: string) {
  const exp = Math.floor(Date.now() / 1000) + urlTtlSeconds();
  const wm = encode(watermark);
  const sig = signature(slug, page, variant, exp, wm);
  return `/api/magazine/${slug}/page/${page}?v=${variant}&exp=${exp}&wm=${wm}&sig=${sig}`;
}

export function verifyPageSignature(slug: string, page: number, params: URLSearchParams) {
  const variant = params.get("v") === "thumb" ? "thumb" : "full";
  const exp = Number(params.get("exp"));
  const wm = params.get("wm") ?? "";
  const sig = params.get("sig") ?? "";
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  const expected = Buffer.from(signature(slug, page, variant, exp, wm));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return { variant: variant as PageVariant, watermark: decodeWatermark(wm), exp };
}
