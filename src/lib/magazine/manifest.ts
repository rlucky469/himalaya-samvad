import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface MagazineManifest {
  slug: string;
  totalPages: number;
  previewPages: number;
  pageWidth: number;
  pageHeight: number;
  pages: { number: number; file: string; width: number; height: number }[];
}

const SLUG_RE = /^[a-z0-9-]+$/;
// Page images are kept outside /public so they can only be reached through the signed API
export const MAGAZINE_ROOT = path.join(process.cwd(), "private", "magazine");

export async function readManifest(slug: string): Promise<MagazineManifest | null> {
  if (!SLUG_RE.test(slug)) return null;
  try {
    const raw = await readFile(path.join(MAGAZINE_ROOT, slug, "manifest.json"), "utf8");
    return JSON.parse(raw) as MagazineManifest;
  } catch {
    return null;
  }
}

export function pageFilePath(slug: string, file: string, variant: "full" | "thumb") {
  return path.join(MAGAZINE_ROOT, slug, variant === "thumb" ? "thumbs" : "pages", path.basename(file));
}
