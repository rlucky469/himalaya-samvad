"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeMeta, routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Segmented "हिं / EN" switch. The inactive language is a real link to the same page. */
export function LanguageToggle({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")} className={cn("inline-flex items-center rounded-lg bg-primary-tint p-1 text-sm font-bold ring-1 ring-primary-soft", className)}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden className="px-1 text-line-strong">/</span>}
          {l === locale ? (
            <span aria-current="true" className="rounded-md bg-surface px-2.5 py-1 text-primary shadow-card">
              {localeMeta[l].shortLabel}
            </span>
          ) : (
            <Link href={pathname} locale={l} hrefLang={localeMeta[l].hreflang} lang={localeMeta[l].htmlLang} className="rounded-md px-2.5 py-1 text-muted transition-colors hover:text-primary">
              {localeMeta[l].shortLabel}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
