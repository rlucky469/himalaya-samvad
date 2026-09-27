import { ChevronRight, Home } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  /** The last crumb is the current page: it renders as text, but its href is still used for structured data */
  href: string;
}

export async function Breadcrumbs({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const t = await getTranslations("common");
  const locale = (await getLocale()) as AppLocale;
  const all: Crumb[] = [{ label: t("home"), href: routes.home }, ...items];
  const linkClass = tone === "dark" ? "text-on-dark-muted hover:text-white" : "text-muted hover:text-primary";

  return (
    <>
      <nav aria-label={t("breadcrumb")} className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((crumb, index) => {
            const last = index === all.length - 1;
            return (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight aria-hidden className={cn("size-3.5", tone === "dark" ? "text-white/40" : "text-line-strong")} />}
                {last ? (
                  <span aria-current={last ? "page" : undefined} className={cn("font-medium", tone === "dark" ? "text-cta" : "text-accent")}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className={cn("inline-flex items-center gap-1", linkClass)}>
                    {index === 0 && <Home aria-hidden className="size-3.5" />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all.map((c) => ({ name: c.label, path: c.href })), locale)} />
    </>
  );
}
