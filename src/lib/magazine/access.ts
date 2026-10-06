import "server-only";
import { shareWatermark, verifyShareLink } from "./share";

interface ReaderAccess {
  authorized: boolean;
  /** Text burned into every full page: the reader's email/mobile, or a preview label */
  watermark: string;
}

const PREVIEW_WATERMARK = "himalayasamvad.in  •  PREVIEW";
const isMockMode = () => process.env.NEXT_PUBLIC_API_MOCK !== "false";
const apiBase = () => (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Decides whether the request may read the full issue.
 * A valid share link (X-Share-Token) unlocks that one issue without login.
 * Mock mode trusts demo tokens ("mock.<email>"); otherwise the token is checked against the backend's /auth/me.
 */
export async function resolveReaderAccess(request: Request, slug: string): Promise<ReaderAccess> {
  const shareToken = request.headers.get("x-share-token");
  if (shareToken) {
    const link = verifyShareLink(shareToken, slug);
    if (link.ok) return { authorized: true, watermark: shareWatermark(link) };
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return { authorized: false, watermark: PREVIEW_WATERMARK };

  if (isMockMode()) {
    if (!token.startsWith("mock.")) return { authorized: false, watermark: PREVIEW_WATERMARK };
    const email = Buffer.from(token.slice(5), "base64url").toString("utf8") || "reader";
    return { authorized: true, watermark: `${email}  •  himalayasamvad.in` };
  }

  try {
    const res = await fetch(`${apiBase()}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return { authorized: false, watermark: PREVIEW_WATERMARK };
    const user = (await res.json()) as { email?: string; mobile?: string; user?: { email?: string; mobile?: string } };
    const identity = user.user?.email ?? user.email ?? user.user?.mobile ?? user.mobile ?? "reader";
    return { authorized: true, watermark: `${identity}  •  himalayasamvad.in` };
  } catch {
    return { authorized: false, watermark: PREVIEW_WATERMARK };
  }
}
