import { NextResponse } from "next/server";
import { readManifest } from "@/lib/magazine/manifest";
import { resolveReaderAccess } from "@/lib/magazine/access";
import { signedPageUrl } from "@/lib/magazine/signing";
import type { MagazinePagesResponse } from "@/types/api";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow" };

/** Signed page-image URLs for an issue: the free preview for everyone, every page for logged-in readers. */
export async function GET(request: Request, ctx: RouteContext<"/api/magazine/[slug]/pages">) {
  const { slug } = await ctx.params;
  const manifest = await readManifest(slug);
  if (!manifest) return NextResponse.json({ message: "Issue not found" }, { status: 404, headers: noStore });

  const access = await resolveReaderAccess(request);
  const allowed = access.authorized ? manifest.pages : manifest.pages.slice(0, manifest.previewPages);

  const body: MagazinePagesResponse = {
    slug,
    totalPages: manifest.totalPages,
    previewPages: manifest.previewPages,
    unlocked: access.authorized,
    pages: allowed.map((p) => ({
      number: p.number,
      width: p.width,
      height: p.height,
      src: signedPageUrl(slug, p.number, "full", access.watermark),
      thumb: signedPageUrl(slug, p.number, "thumb", access.watermark),
    })),
  };
  return NextResponse.json(body, { headers: noStore });
}
