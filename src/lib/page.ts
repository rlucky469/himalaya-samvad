import "server-only";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

/** Reads the locale param and enables static rendering for next-intl. Call first in every page. */
export async function initPage<P extends { locale: string }>(params: Promise<P>) {
  const resolved = await params;
  setRequestLocale(resolved.locale as AppLocale);
  return { ...resolved, locale: resolved.locale as AppLocale };
}
