import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BellRing, BookOpen } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { IssueCover } from "@/components/cards/IssueCover";
import { reveal } from "@/components/ui/reveal";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { issueCover, pageHero } from "@/lib/media";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/issues">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.issues, seoKey: "issues" });
}

export default async function IssuesPage({ params }: PageProps<"/[locale]/issues">) {
  await initPage(params);
  const { issues, nav } = await getContent();
  const { archive, labels } = issues;
  const t = await getTranslations("issues.labels");

  return (
    <>
      <PageHero title={archive.title} subtitle={archive.subtitle} image={pageHero("issues")} breadcrumbs={[{ label: archive.title, href: routes.issues }]} />
      <Section tone="mist">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {issues.items.map((issue, i) => (
            <article key={issue.slug} {...reveal(i)} className="flex flex-col rounded-panel border border-line bg-surface p-6 shadow-card sm:p-8">
              {issue.slug === siteConfig.currentIssueSlug && (
                <span className="mb-5 self-start rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">{archive.current}</span>
              )}
              <IssueCover src={issueCover(issue.slug)} alt={t("coverAlt", { issue: issue.label })} className="max-w-[240px]" sizes="240px" />
              <p className="mt-8 text-sm font-semibold text-accent">
                {issue.label} • {issue.month}
              </p>
              <h2 className="mt-1 text-2xl">{issue.title}</h2>
              <p className="mt-3 line-clamp-3 flex-1 text-ink-soft">{issue.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={routes.reader(issue.slug)} size="sm" icon={<BookOpen />} iconPosition="start">
                  {labels.readOnline}
                </ButtonLink>
                <ButtonLink href={routes.issue(issue.slug)} size="sm" variant="outline" icon={<ArrowRight />}>
                  {labels.viewDetails}
                </ButtonLink>
              </div>
            </article>
          ))}
          <article {...reveal(1)} className="flex flex-col items-center justify-center rounded-panel border-2 border-dashed border-line-strong p-8 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-cta-soft text-cta">
              <BellRing className="size-7" />
            </span>
            <h2 className="mt-5 text-2xl">{archive.upcomingTitle}</h2>
            <p className="mt-3 max-w-xs text-ink-soft">{archive.upcomingText}</p>
            <ButtonLink href={routes.membershipApply} variant="navy" size="sm" className="mt-6">
              {nav.subscribe}
            </ButtonLink>
          </article>
        </div>
      </Section>
    </>
  );
}
