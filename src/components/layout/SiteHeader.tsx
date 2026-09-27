"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav, routes } from "@/config/routes";
import { buttonClasses } from "@/components/ui/Button";
import type { SearchItem } from "@/types/search";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SiteSearch } from "./SiteSearch";
import { isActivePath } from "./nav-utils";
import { cn } from "@/lib/utils";

export function SiteHeader({ searchItems }: { searchItems: SearchItem[] }) {
  const t = useTranslations("nav");
  const tb = useTranslations("brand");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled ? "border-line bg-surface/90 shadow-card backdrop-blur-md" : "border-transparent bg-surface",
      )}
    >
      <div className={cn("container-site flex items-center justify-between gap-4 transition-all duration-300", scrolled ? "h-16" : "h-header")}>
        <Logo name={tb("name")} tagline={tb("tagline")} />

        <nav aria-label={t("mainLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block whitespace-nowrap px-2.5 py-2 text-[0.95rem] font-medium transition-colors xl:px-3.5",
                      "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300",
                      active ? "text-primary after:scale-x-100" : "text-ink-soft after:scale-x-0 hover:text-primary hover:after:scale-x-100",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <SiteSearch items={searchItems} />
          <Link href={routes.membershipApply} className={buttonClasses("primary", "sm", "hidden sm:inline-flex")}>
            {t("subscribe")}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
