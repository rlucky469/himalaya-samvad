export interface ShareLink {
  ok: true;
  slug: string;
  /** Short id printed by the CLI; add it to MAGAZINE_REVOKED_SHARE_IDS to switch the link off */
  id: string;
  /** Unix seconds; 0 = never expires */
  expiresAt: number;
  /** Who the link was made for */
  label: string;
}

export type ShareLinkFailure = { ok: false; reason: "invalid" | "expired" | "revoked" };

export function shareSecret(env?: Record<string, string | undefined>): string;
export function createShareToken(data: { slug: string; label?: string; expiresAt?: number; id?: string }, secret: string): { token: string; id: string };
export function readShareToken(token: string, secret: string, nowSeconds?: number): ShareLink | { ok: false; reason: "invalid" | "expired" };
