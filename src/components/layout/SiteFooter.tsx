import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Logo } from "./Logo";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tb = await getTranslations("brand");
  const tc = await getTranslations("common");
  const closing = tb.raw("closingLines") as string[];
  const { emails } = siteConfig.contact;

  const quickLinks = [
    { label: tn("home"), href: routes.home },
    { label: tn("about"), href: routes.about },
    { label: tn("team"), href: routes.team },
    { label: tn("currentIssue"), href: routes.currentIssue },
    { label: tn("articles"), href: routes.articles },
    { label: tn("membership"), href: routes.membership },
    { label: tn("advertise"), href: routes.advertise },
    { label: tn("contact"), href: routes.contact },
  ];

  return (
    <footer className="relative overflow-hidden bg-primary-deep text-on-dark-muted">
      <div className="container-site relative grid gap-12 pb-12 pt-20 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1.3fr] lg:gap-10">
        <div className="space-y-5">
          <Logo name={tb("name")} tagline={tb("tagline")} tone="dark" />
          <p className="max-w-xs text-sm leading-relaxed">{t("about")}</p>
          <p className="inline-flex items-center gap-2 text-sm">
            <MapPin aria-hidden className="size-4 text-cta" />
            {tb("location")}
          </p>
        </div>

        <nav aria-label={t("quickLinksTitle")}>
          <h2 className="mb-5 font-sans text-lg font-bold text-white">{t("quickLinksTitle")}</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-1">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex items-center gap-1.5 transition-colors hover:text-cta">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-5 font-sans text-lg font-bold text-white">{t("contactTitle")}</h2>
          <ul className="space-y-3 text-sm">
            {Object.values(emails).map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2.5 break-all transition-colors hover:text-cta">
                  <Mail aria-hidden className="size-4 shrink-0 text-cta" />
                  {email}
                </a>
              </li>
            ))}
            <li>
              <a href={siteConfig.contact.phoneHref} className="inline-flex items-center gap-2.5 transition-colors hover:text-cta">
                <Phone aria-hidden className="size-4 shrink-0 text-cta" />
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-2 font-sans text-lg font-bold text-white">{t("socialTitle")}</h2>
            <p className="mb-4 text-sm">{t("socialText")}</p>
            <SocialLinks comingSoonLabel={tc("comingSoon")} />
          </div>
          <div className="rounded-card border border-white/10 bg-white/5 p-5">
            <h2 className="font-sans text-base font-bold text-white">{t("newsletterTitle")}</h2>
            <p className="mb-3 mt-1 text-xs">{t("newsletterText")}</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="container-site relative border-t border-white/10 py-8 text-center">
        <p className="font-serif text-lg italic text-white/90 sm:text-xl">“{closing.join(" ")}”</p>
        <span aria-hidden className="mx-auto mt-4 block h-0.5 w-20 rounded-full bg-cta" />
        <div className="mt-5 flex flex-col items-center justify-center gap-3 text-xs sm:flex-row sm:gap-6">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-4">
            <Link href={routes.privacy} className="hover:text-cta">
              {t("privacy")}
            </Link>
            <Link href={routes.terms} className="hover:text-cta">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
