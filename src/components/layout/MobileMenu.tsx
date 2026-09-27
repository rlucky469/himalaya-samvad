"use client";

import { AnimatePresence, motion } from "motion/react";
import { Mail, Menu, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Portal } from "@/components/ui/Portal";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AuthLinks } from "./AuthLinks";
import { cn } from "@/lib/utils";
import { isActivePath } from "./nav-utils";

export function MobileMenu() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tb = useTranslations("brand");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the drawer after navigating
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={tc("openMenu")}
        aria-expanded={open}
        className="inline-flex size-11 items-center justify-center rounded-xl text-primary transition-colors hover:bg-primary-tint lg:hidden"
      >
        <Menu className="size-6" />
      </button>

      <Portal>
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button type="button" aria-label={tc("closeMenu")} onClick={() => setOpen(false)} className="absolute inset-0 bg-primary-deep/60 backdrop-blur-sm" />
              <motion.nav
                aria-label={t("mainLabel")}
                className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-primary-deep text-white shadow-lift"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <Logo name={tb("name")} tagline={tb("tagline")} tone="dark" size="sm" onClick={() => setOpen(false)} />
                  <button type="button" onClick={() => setOpen(false)} aria-label={tc("closeMenu")} className="rounded-full p-2 hover:bg-white/10">
                    <X className="size-6" />
                  </button>
                </div>

                <ul className="flex flex-col gap-1 px-3 py-5">
                  {mainNav.map((item, i) => {
                    const active = isActivePath(pathname, item.href);
                    return (
                      <motion.li key={item.key} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium transition-colors",
                            active ? "bg-white/10 text-cta" : "text-white/90 hover:bg-white/5",
                          )}
                        >
                          {t(item.key)}
                          {active && <span aria-hidden className="size-2 rounded-full bg-cta" />}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <div className="space-y-4 px-5">
                  <Link href={routes.membershipApply} className={buttonClasses("primary", "lg", "w-full")}>
                    {t("subscribe")}
                  </Link>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm">
                    <AuthLinks tone="dark" />
                    <LanguageSwitcher tone="dark" />
                  </div>
                </div>

                <div className="mt-auto space-y-3 border-t border-white/10 px-5 py-6 text-sm text-on-dark-muted">
                  <a href={siteConfig.contact.phoneHref} className="flex items-center gap-2.5 hover:text-white">
                    <Phone aria-hidden className="size-4 text-cta" />
                    {siteConfig.contact.phoneDisplay}
                  </a>
                  <a href={`mailto:${siteConfig.contact.emails.info}`} className="flex items-center gap-2.5 hover:text-white">
                    <Mail aria-hidden className="size-4 text-cta" />
                    {siteConfig.contact.emails.info}
                  </a>
                  <SocialLinks comingSoonLabel={tc("comingSoon")} className="pt-2" />
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
