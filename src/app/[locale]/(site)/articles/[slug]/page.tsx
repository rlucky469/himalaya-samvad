import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen, CalendarDays, Clock, FileText, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { IssueCover } from "@/components/cards/IssueCover";
import { JsonLd } from "@/components/seo/JsonLd";
import { reveal } from "@/components/ui/reveal";
import { articlesInIssue, getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/structured-data";
import { initPage } from "@/lib/page";
import { articleImage, issueCover } from "@/lib/media";
import { routes } from "@/config/routes";
import hi from "@messages/hi.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return hi.articles.items.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> {
  const { locale, slug } = await initPage(params);
  const content = await getContent();
  const article = content.articles.items.find((a) => a.slug === slug);
  if (!article) return {};
  const issue = content.issues.items.find((i) => i.slug === article.issueSlug);
  return buildMetadata({
    locale,
    path: routes.article(slug),
    title: article.title,
    description: article.excerpt,
    image: articleImage(slug),
    type: "article",
    publishedTime: issue?.dateISO,
  });
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/articles/[slug]">) {
  const { locale, slug } = await initPage(params);
  const content = await getContent();
  const t = await getTranslations("articles");
  const tc = await getTranslations("common");
  const tl = await getTranslations("issues.labels");
  const article = content.articles.items.find((a) => a.slug === slug);
  if (!article) notFound();

  const topic = content.topics.items.find((tp) => tp.slug === article.topic);
  const issue = content.issues.items.find((i) => i.slug === article.issueSlug);
  const titles = Object.fromEntries(content.topics.items.map((tp) => [tp.slug, tp.title]));
  const related = articlesInIssue(content.articles.items, article.issueSlug).filter((a) => a.slug !== slug).slice(0, 3);
  const readerHref = `${routes.reader(article.issueSlug)}?page=${article.page}`;

  return (
    <>
      <article>
        <header className="relative overflow-hidden bg-mist bg-contour">
          <div className="container-site pb-28 pt-10 sm:pb-36 sm:pt-14">
            <Breadcrumbs tone="light" items={[{ label: t("title"), href: routes.articles }, { label: article.title, href: routes.article(slug) }]} />
            <div className="mx-auto mt-10 max-w-4xl text-center">
              {topic && (
                <Link href={routes.topic(topic.slug)} className="inline-flex rounded-full bg-accent px-3.5 py-1 text-sm font-semibold text-white hover:bg-accent-dark">
                  {topic.title}
                </Link>
              )}
              <h1 className="mt-5 animate-fade-up text-3xl sm:text-4xl lg:text-5xl">{article.title}</h1>
              <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-lg text-ink-soft [animation-delay:120ms]">{article.excerpt}</p>
              <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
                <li className="inline-flex items-center gap-1.5">
                  <UserRound aria-hidden className="size-4" />
                  {article.author}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden className="size-4" />
                  {tc("minutesRead", { count: article.readMinutes })}
                </li>
                {issue && (
                  <li className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden className="size-4" />
                    {t("publishedIn")}: {issue.label} • {issue.month}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </header>

        <div className="bg-surface">
          <div className="container-site">
            <div className="relative z-10 mx-auto -mt-20 aspect-[16/8] max-w-5xl overflow-hidden rounded-panel shadow-lift sm:-mt-28">
              <Image src={articleImage(slug)} alt={article.title} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="animate-ken-burns object-cover" />
            </div>
          </div>
        </div>

        <Section tone="white" className="pt-12 sm:pt-16">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_300px]">
            <div className="prose-reading">
              {article.summary.map((p, i) => (
                <p key={i} className={i === 0 ? "drop-cap font-serif" : "font-serif"}>
                  {p}
                </p>
              ))}
              <div className="!mt-10 flex flex-col gap-4 rounded-card border border-cta/30 bg-cta-soft p-6 sm:flex-row sm:items-center">
                <FileText aria-hidden className="size-8 shrink-0 text-cta" />
                <p className="flex-1 text-base text-ink-soft">{t("summaryNote", { issue: issue?.label ?? "", page: article.page })}</p>
              </div>
              <ButtonLink href={readerHref} className="!mt-6" icon={<BookOpen />} iconPosition="start">
                {t("readInIssue")}
              </ButtonLink>
            </div>
            {issue && (
              <aside className="lg:sticky lg:top-28 lg:self-start" {...reveal(0, "right")}>
                <div className="rounded-card border border-line bg-mist p-6 text-center">
                  <IssueCover src={issueCover(issue.slug)} alt={tl("coverAlt", { issue: issue.label })} className="max-w-[200px]" sizes="200px" />
                  <p className="mt-6 text-sm font-semibold text-accent">
                    {issue.label} • {issue.month}
                  </p>
                  <p className="mt-1 font-serif text-lg font-bold text-primary">{issue.title}</p>
                  <ButtonLink href={routes.issue(issue.slug)} variant="outline" size="sm" className="mt-5 w-full">
                    {tl("viewDetails")}
                  </ButtonLink>
                </div>
              </aside>
            )}
          </div>
        </Section>
      </article>

      {related.length > 0 && (
        <Section tone="mist">
          <SectionHeading title={t("relatedTitle")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <div key={a.slug} {...reveal(i)}>
                <ArticleCard article={a} topicTitle={titles[a.topic]} />
              </div>
            ))}
          </div>
        </Section>
      )}
      <JsonLd data={articleSchema(article, issue, locale, articleImage(slug))} />
    </>
  );
}
