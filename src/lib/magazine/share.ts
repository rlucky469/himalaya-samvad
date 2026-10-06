import "server-only";
import { readShareToken, shareSecret, type ShareLink, type ShareLinkFailure } from "./share-codec.mjs";

export type { ShareLink };

const revokedIds = () =>
  new Set(
    (process.env.MAGAZINE_REVOKED_SHARE_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );

/** Checks a share link: signature, expiry and the revoke list. Pass a slug to also require that issue. */
export function verifyShareLink(token: string, slug?: string): ShareLink | ShareLinkFailure {
  const result = readShareToken(token, shareSecret());
  if (!result.ok) return result;
  if (slug && result.slug !== slug) return { ok: false, reason: "invalid" };
  if (revokedIds().has(result.id)) return { ok: false, reason: "revoked" };
  return result;
}

/** Burned into every page read through a share link (ASCII only — the watermark font has no Devanagari) */
export function shareWatermark(link: ShareLink) {
  const label = /^[\x20-\x7E]+$/.test(link.label) ? `${link.label}  •  ` : "";
  return `${label}SHARED ${link.id}  •  himalayasamvad.in`;
}
