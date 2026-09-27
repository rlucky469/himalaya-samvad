import { readFile } from "node:fs/promises";
import { pageFilePath, readManifest } from "@/lib/magazine/manifest";
import { verifyPageSignature } from "@/lib/magazine/signing";
import { watermarkPage } from "@/lib/magazine/watermark";

export const dynamic = "force-dynamic";

const deny = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

/** Serves one page image — only with a valid, unexpired signature. Opening the URL directly in a tab is refused. */
export async function GET(request: Request, ctx: RouteContext<"/api/magazine/[slug]/page/[page]">) {
  const { slug, page: pageParam } = await ctx.params;
  const pageNumber = Number(pageParam);
  const url = new URL(request.url);

  // Browsers send "document" when someone pastes the image URL into the address bar
  if (request.headers.get("sec-fetch-dest") === "document") return deny(403);

  const verified = Number.isInteger(pageNumber) ? verifyPageSignature(slug, pageNumber, url.searchParams) : null;
  if (!verified) return deny(403);

  const manifest = await readManifest(slug);
  const entry = manifest?.pages.find((p) => p.number === pageNumber);
  if (!entry) return deny(404);

  try {
    const original = await readFile(pageFilePath(slug, entry.file, verified.variant));
    const body = verified.variant === "full" ? await watermarkPage(original, verified.watermark) : original;
    const maxAge = Math.max(0, verified.exp - Math.floor(Date.now() / 1000));
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": "inline",
        "Cache-Control": `private, max-age=${maxAge}`,
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow, noimageindex",
        "Cross-Origin-Resource-Policy": "same-origin",
      },
    });
  } catch {
    return deny(404);
  }
}
