import { magazineEndpoints } from "@/config/api-endpoints";
import { ApiError } from "./api/errors";
import { sessionStore } from "./api/session-storage";
import type { MagazinePagesResponse } from "@/types/api";

/**
 * Asks for the signed page-image URLs of an issue.
 * Logged-out readers get the free preview pages only; a login token or a share-link token unlocks the rest.
 */
export async function fetchMagazinePages(slug: string, signal?: AbortSignal, shareToken?: string): Promise<MagazinePagesResponse> {
  const token = sessionStore.token();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (shareToken) headers["X-Share-Token"] = shareToken;
  const response = await fetch(magazineEndpoints.pages(slug), {
    headers,
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new ApiError(response.status);
  return response.json();
}
