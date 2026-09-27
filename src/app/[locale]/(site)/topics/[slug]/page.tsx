import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { JoinCta } from "@/components/sections/JoinCta";
import { TopicIcon } from "@/components/icons/topic-icons";
import { reveal } from "@/components/ui/reveal";
import { articlesByTopic, getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { topicImage } from "@/lib/media";
import { routes } from "@/config/routes";
import hi from "@messages/hi.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return hi.topics.items.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/topics/[slug]">): Promise<Metadata> {
  const { locale, slug } = await initPage(params);
  const topic = (await getContent()).topics.items.find((t) => t.slug === slug);
  if (!topic) return {};
  return buildMetadata({ locale, path: routes.topic(slug), title: topic.title, description: topic.short, image: topicImage(slug) });
}

export default async function TopicPage({ params }: PageProps<"/[locale]/topics/[slug]">) {
  const { slug } = await initPage(params);
  const content = await getContent();
  const t = await getTranslations("topics");
  const topic = content.topics.items.find((tp) => tp.slug === slug);
  if (!topic) notFound();

  const articles = articlesByTopic(content.articles.items, slug);
  const others = content.topics.items.filter((tp) => tp.slug !== slug);

  return (
    <>
      <PageHero
        title={topic.title}
        subtitle={topic.short}
        image={topicImage(slug)}
        breadcrumbs={[{ label: content.articles.title, href: routes.articles }, { label: topic.title, href: routes.topic(slug) }]}
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20">
            <TopicIcon slug={slug} aria-hidden className="size-4 text-cta" />
            {t("eyebrow")}
          </span>
        }
      />
      <Section tone="white" spacing="md">
        <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-ink-soft" {...reveal(0)}>
          {topic.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>
      <Section tone="mist">
        <SectionHeading title={t("articlesTitle")} />
        {articles.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <div key={a.slug} {...reveal(i)}>
                <ArticleCard article={a} topicTitle={topic.title} />
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-line-strong p-10 text-center text-muted">{t("emptyArticles")}</p>
        )}
        <div className="mt-14" {...reveal(0)}>
          <p className="mb-4 font-sans text-lg font-bold text-primary">{t("otherTopics")}</p>
          <ul className="flex flex-wrap gap-2.5">
            {others.map((other) => {
              return (
                <li key={other.slug}>
                  <Link href={routes.topic(other.slug)} className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 font-medium text-ink-soft transition-all hover:border-primary hover:text-primary">
                    <TopicIcon slug={other.slug} aria-hidden className="size-4" />
                    {other.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>
      <JoinCta />
    </>
  );
}
