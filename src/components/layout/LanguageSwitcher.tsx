"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeMeta, routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** A real link to the same page in the other language (crawlable, keeps the current path). */
export function LanguageSwitcher({ tone = "light", variant = "compact", className }: { tone?: "light" | "dark"; variant?: "compact" | "full"; className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={localeMeta[other].hreflang}
      lang={localeMeta[other].htmlLang}
      aria-label={t("switchLanguage")}
      title={t("switchLanguage")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors",
        variant === "compact" ? "px-2.5 py-1 text-xs" : "px-4 py-2.5 text-sm",
        tone === "dark"
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-primary-tint text-primary ring-1 ring-primary-soft hover:bg-primary hover:text-white",
        className,
      )}
    >
      <Languages aria-hidden className="size-3.5" />
      {variant === "compact" ? localeMeta[other].shortLabel : t("switchLanguage")}
    </Link>
  );
}
