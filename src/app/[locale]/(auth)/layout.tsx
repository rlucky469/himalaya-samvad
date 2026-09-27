import { CircleHelp } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { routes } from "@/config/routes";
import type { AppLocale } from "@/i18n/routing";

/** Full-height auth frame: slim header + centred card. On desktop nothing scrolls. */
export default async function AuthLayout({ children, params }: LayoutProps<"/[locale]">) {
  setRequestLocale((await params).locale as AppLocale);
  const t = await getTranslations("auth.header");
  const tb = await getTranslations("brand");

  return (
    <div className="relative isolate flex  flex-col bg-canvas  ">
      <div aria-hidden className="absolute inset-0 -z-10 bg-contour opacity-70" />
      <div aria-hidden className="absolute -left-40 top-1/3 -z-10 size-[28rem] rounded-full bg-primary-soft/60 blur-3xl" />
      <div aria-hidden className="absolute -right-32 bottom-0 -z-10 size-[24rem] rounded-full bg-cta-soft blur-3xl" />

      <header className="shrink-0 border-b border-line/70 bg-surface/80 backdrop-blur">
        <div className="container-site flex h-16 items-center justify-between gap-4 short:h-13">
          <Logo name={tb("name")} tagline={tb("tagline")} size="sm" />
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageToggle />
            <Link href={routes.contact} className="hidden items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-primary sm:inline-flex">
              <CircleHelp aria-hidden className="size-4" />
              {t("help")}
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-6 lg:p-5 short:p-3">
        {children}
      </main>
    </div>
  );
}
