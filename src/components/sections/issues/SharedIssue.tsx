import { BookOpen, CalendarClock, Link2Off, LockOpen, LogIn } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { routes } from "@/config/routes";
import type { AppLocale } from "@/i18n/routing";

interface SharedNoticeProps {
  locale: AppLocale;
  label: string;
  /** Unix seconds; 0 = never expires */
  expiresAt: number;
  readHref: string;
}

/** Strip above a shared issue explaining that the full issue is open through this private link */
export async function SharedNotice({ locale, label, expiresAt, readHref }: SharedNoticeProps) {
  const t = await getTranslations("share");
  const date = expiresAt ? new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", { dateStyle: "long" }).format(new Date(expiresAt * 1000)) : null;

  return (
    <section className="border-b border-nature/20 bg-nature-soft">
      <div className="container-site flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-nature text-white">
            <LockOpen aria-hidden className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-wide text-nature">
              {t("badge")}
              {label ? ` • ${t("sharedFor", { name: label })}` : ""}
            </p>
            <p className="mt-0.5 font-serif text-lg font-bold text-primary">{t("title")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t("text")}</p>
            {date && (
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                <CalendarClock aria-hidden className="size-3.5" />
                {t("validUntil", { date })}
              </p>
            )}
          </div>
        </div>
        <ButtonLink href={readHref} icon={<BookOpen />} iconPosition="start" className="shrink-0">
          {t("readCta")}
        </ButtonLink>
      </div>
    </section>
  );
}

/** Shown when a share link is wrong, expired or switched off */
export async function ShareLinkError({ reason }: { reason: "invalid" | "expired" | "revoked" }) {
  const t = await getTranslations("share");
  const invalid = reason === "invalid";
  return (
    <Section tone="mist" className="bg-contour">
      <div className="mx-auto max-w-xl rounded-panel border border-line bg-surface p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Link2Off aria-hidden className="size-7" />
        </span>
        <h1 className="mt-5 text-3xl">{invalid ? t("invalidTitle") : t("expiredTitle")}</h1>
        <p className="mt-3 text-ink-soft">{invalid ? t("invalidText") : t("expiredText")}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={routes.login} icon={<LogIn />} iconPosition="start">
            {t("loginCta")}
          </ButtonLink>
          <ButtonLink href={routes.issues} variant="outline">
            {t("issuesCta")}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
