import { ArrowRight, BookOpen, Bookmark } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { IssueCover } from "@/components/cards/IssueCover";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";
import { issueCover } from "@/lib/media";
import type { Article, Issue } from "@/types/content";

export async function FeaturedIssue({ issue, articles }: { issue: Issue; articles: Article[] }) {
  const t = await getTranslations("home.featuredIssue");
  const tl = await getTranslations("issues.labels");
  const highlights = issue.highlights.map((slug) => articles.find((a) => a.slug === slug)).filter((a): a is Article => Boolean(a));

  return (
    <Section tone="white" className="border-line border-b-1">
      <div className="relative overflow-hidden rounded-panel border border-line bg-surface p-6 shadow-card sm:p-10 lg:p-14">
        <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-cta-soft blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div {...reveal(0, "zoom")}>
            <IssueCover src={issueCover(issue.slug)} alt={tl("coverAlt", { issue: issue.label })} badge={t("badge")} />
          </div>
          <div {...reveal(1, "right")}>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <span className="inline-flex rounded-md bg-primary px-3 py-1 text-sm font-semibold text-white">
              {issue.label} • {issue.month}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl">{issue.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{issue.description}</p>

            <div className="mt-7 rounded-card border border-primary-soft bg-primary-tint p-5 sm:p-6">
              <p className="flex items-center gap-2 font-sans text-lg font-bold text-primary">
                <Bookmark aria-hidden className="size-4.5 text-accent" />
                {t("highlightsTitle")}
              </p>
              <ul className="mt-3 space-y-2.5">
                {highlights.map((a) => (
                  <li key={a.slug}>
                    <Link href={routes.article(a.slug)} className="group flex items-start gap-2.5 text-ink-soft hover:text-primary">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-cta" />
                      <span className="underline-offset-4 group-hover:underline">{a.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={routes.reader(issue.slug)} icon={<BookOpen />} iconPosition="start">
                {t("primaryCta")}
              </ButtonLink>
              <ButtonLink href={routes.issue(issue.slug)} variant="outline" icon={<ArrowRight />}>
                {t("secondaryCta")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
