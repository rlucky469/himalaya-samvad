import Image from "next/image";
import { BellRing, BookOpenText, Mail, PenLine, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/config/site";
import { media } from "@/lib/media";

export type AuthBadge = "login" | "register" | "verify" | "forgot" | "reset";

const featureIcons = [BookOpenText, BellRing, PenLine];

/** Left navy panel of the auth card (desktop only). */
export async function AuthPanel({ badge }: { badge: AuthBadge }) {
  const t = await getTranslations("auth.panel");
  const tb = await getTranslations("brand");
  const features = t.raw("features") as { title: string; text: string }[];
  const email = siteConfig.contact.emails.info;

  return (
    <aside className="relative isolate hidden flex-col overflow-hidden bg-primary-deep p-9 text-white lg:flex xl:p-10 short:py-6">
      <Image src={media.auth.panel} alt="" fill sizes="45vw" className="-z-20 object-cover opacity-25" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-deep via-primary-deep/90 to-primary/80" />

      <Logo name={tb("name")} tagline={tb("tagline")} tone="dark" size="sm" />
      <span aria-hidden className="mt-6 block h-px bg-white/10 short:mt-4" />

      <div className="mt-6 flex flex-1 flex-col short:mt-4">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15">
          <ShieldCheck aria-hidden className="size-3.5 text-cta" />
          {t(`badges.${badge}`)}
        </span>
        <h2 className="mt-4 text-[2.3rem] leading-tight text-white xl:text-[2.6rem] short:mt-3 short:text-[2.1rem]">{t("title")}</h2>
        <span aria-hidden className="mt-2 block h-1 w-14 rounded-full bg-accent" />
        <p className="mt-4 text-[0.95rem] leading-relaxed text-on-dark-muted">{t("text")}</p>

        <ul className="mt-6 space-y-2.5 short:mt-4 short:space-y-2">
          {features.map((feature, i) => {
            const Icon = featureIcons[i] ?? BookOpenText;
            return (
              <li key={feature.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-3 short:py-2">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-cta">
                  <Icon aria-hidden className="size-[1.1rem]" />
                </span>
                <span>
                  <span className="block font-sans text-base font-bold leading-snug text-white">{feature.title}</span>
                  <span className="block text-xs leading-relaxed text-on-dark-muted">{feature.text}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 border-t border-white/10 pt-5 short:mt-4 short:pt-3">
        <p className="border-l-2 border-accent pl-3 font-serif text-base italic text-white/90">“{(tb.raw("closingLines") as string[]).join(" ")}”</p>
        <a href={`mailto:${email}`} className="mt-3 inline-flex items-center gap-2 text-xs text-on-dark-muted hover:text-white">
          <Mail aria-hidden className="size-3.5" />
          {t("support")}: {email}
        </a>
      </div>
    </aside>
  );
}
