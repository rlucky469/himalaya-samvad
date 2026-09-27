import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Editorial, Gratitude, InThisIssue, IssueHero, NextIssueCta } from "@/components/sections/issues/IssueSections";
import { JsonLd } from "@/components/seo/JsonLd";
import { articlesInIssue, getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { issueSchema } from "@/lib/structured-data";
import { initPage } from "@/lib/page";
import { issueCover } from "@/lib/media";
import { routes } from "@/config/routes";
import hi from "@messages/hi.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return hi.issues.items.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/issues/[slug]">): Promise<Metadata> {
  const { locale, slug } = await initPage(params);
  const issue = (await getContent()).issues.items.find((i) => i.slug === slug);
  if (!issue) return {};
  return buildMetadata({
    locale,
    path: routes.issue(slug),
    title: `${issue.label} — ${issue.title}`,
    description: issue.description,
    image: issueCover(slug),
    imageAlt: issue.title,
  });
}

export default async function IssuePage({ params }: PageProps<"/[locale]/issues/[slug]">) {
  const { locale, slug } = await initPage(params);
  const content = await getContent();
  const issue = content.issues.items.find((i) => i.slug === slug);
  if (!issue) notFound();

  return (
    <>
      <IssueHero issue={issue} />
      <Editorial issue={issue} />
      <InThisIssue
        articles={articlesInIssue(content.articles.items, slug)}
        topics={content.topics.items}
        labels={{ all: content.articles.filterAll, filter: content.articles.filterLabel, empty: content.articles.empty }}
      />
      <Gratitude text={issue.gratitude} />
      <NextIssueCta />
      <JsonLd data={issueSchema(issue, content, locale, issueCover(slug))} />
    </>
  );
}
