import Image from "next/image";
import { ArrowRight, BookOpenText, CalendarDays, Globe2, LayoutGrid } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Parallax } from "@/components/ui/Parallax";
import { routes } from "@/config/routes";
import { media } from "@/lib/media";

const statIcons = [CalendarDays, LayoutGrid, Globe2];

export async function HomeHero() {
  const t = await getTranslations("home.hero");
  const stats = t.raw("stats") as { label: string; value: string }[];

  return (
    <section className="relative isolate overflow-hidden bg-primary-deep text-white">
      <Parallax className="absolute inset-0 -z-20" strength={140}>
        <Image src={media.home.hero} alt={t("imageAlt")} fill priority sizes="100vw" className="animate-ken-burns object-cover" />
      </Parallax>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-deep/95 via-primary/80 to-primary/20" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-primary-deep/80 to-transparent" />
      {/* drifting mist */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[-20%] bottom-24 -z-10 h-40 animate-mist bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.18),transparent_65%)] blur-2xl" />

      <div className="container-site relative pb-12 pt-16 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-28">
        <div className="max-w-3xl">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold shadow-lg sm:text-sm">
            <span aria-hidden className="size-1.5 rounded-full bg-white" />
            {t("eyebrow")}
          </p>
          <h1 className="mt-6 text-[2.6rem] leading-[1.15] text-white sm:text-6xl lg:text-7xl">
            <span className="block animate-fade-up [animation-delay:100ms]">{t("titleLine1")}</span>
            <span className="block animate-fade-up text-primary-soft [animation-delay:220ms]">
              {t("titleLine2")}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl animate-fade-up text-lg text-on-dark-muted [animation-delay:340ms] sm:text-xl">{t("description")}</p>
          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:460ms] sm:flex-row">
            <ButtonLink href={routes.currentIssueReader} size="lg" icon={<ArrowRight />}>
              {t("primaryCta")}
            </ButtonLink>
            <ButtonLink href={routes.about} variant="outlineLight" size="lg" icon={<BookOpenText />}>
              {t("secondaryCta")}
            </ButtonLink>
          </div>
        </div>

        <dl className="mt-14 grid animate-fade-up gap-3 [animation-delay:600ms] sm:mt-20 sm:grid-cols-3">
          {stats.map((stat, i) => {
            const Icon = statIcons[i] ?? CalendarDays;
            return (
              <div key={stat.label} className="flex items-center gap-4 rounded-card border border-white/15 bg-white/[0.07] px-5 py-4 backdrop-blur-md transition-colors hover:bg-white/[0.12]">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-cta/15 text-cta">
                  <Icon aria-hidden className="size-5" />
                </span>
                <div>
                  <dt className="text-xs text-on-dark-muted">{stat.label}</dt>
                  <dd className="font-serif text-lg font-bold text-white">{stat.value}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
