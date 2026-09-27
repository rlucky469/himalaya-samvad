import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ArticleFilter } from "@/components/sections/articles/ArticleFilter";
import { JoinCta } from "@/components/sections/JoinCta";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { pageHero } from "@/lib/media";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.articles, seoKey: "articles" });
}

export default async function ArticlesPage({ params }: PageProps<"/[locale]/articles">) {
  await initPage(params);
  const { articles, topics } = await getContent();
  const titles = Object.fromEntries(topics.items.map((t) => [t.slug, t.title]));

  return (
    <>
      <PageHero title={articles.title} subtitle={articles.subtitle} image={pageHero("articles")} breadcrumbs={[{ label: articles.title, href: routes.articles }]} />
      <Section tone="mist">
        <ArticleFilter
          topics={topics.items.map((t) => ({ slug: t.slug, title: t.title }))}
          allLabel={articles.filterAll}
          filterLabel={articles.filterLabel}
          emptyLabel={articles.empty}
          items={articles.items.map((a, i) => ({
            key: a.slug,
            topic: a.topic,
            featured: i === 0,
            content: <ArticleCard article={a} topicTitle={titles[a.topic]} variant={i === 0 ? "featured" : "grid"} priority={i === 0} />,
          }))}
        />
      </Section>
      <JoinCta />
    </>
  );
}
