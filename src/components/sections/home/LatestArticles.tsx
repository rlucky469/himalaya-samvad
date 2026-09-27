import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";
import type { Article } from "@/types/content";

export async function LatestArticles({ articles, topicTitles }: { articles: Article[]; topicTitles: Record<string, string> }) {
  const t = await getTranslations("home.latest");
  const featured = articles.find((a) => "featured" in a && a.featured) ?? articles[0];
  const others = articles.filter((a) => a.slug !== featured.slug).slice(0, 4);

  return (
    <Section tone="white">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <ButtonLink href={routes.articles} variant="outline" size="sm" icon={<ArrowRight />} className="hidden lg:inline-flex">
            {t("cta")}
          </ButtonLink>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div {...reveal(0)}>
          <ArticleCard article={featured} topicTitle={topicTitles[featured.topic]} variant="featured" />
        </div>
        <div className="flex flex-col gap-4">
          {others.map((article, i) => (
            <div key={article.slug} {...reveal(i + 1, "right")}>
              <ArticleCard article={article} topicTitle={topicTitles[article.topic]} variant="compact" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 text-center lg:hidden">
        <ButtonLink href={routes.articles} variant="outline" icon={<ArrowRight />}>
          {t("cta")}
        </ButtonLink>
      </div>
    </Section>
  );
}
