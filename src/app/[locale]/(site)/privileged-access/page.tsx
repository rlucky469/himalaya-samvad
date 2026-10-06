import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Editorial, Gratitude, InThisIssue, IssueHero, NextIssueCta } from "@/components/sections/issues/IssueSections";
import { PrivilegedNotice } from "@/components/sections/issues/PrivilegedNotice";
import { articlesInIssue, getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { issueCover } from "@/lib/media";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/privileged-access">): Promise<Metadata> {
  const { locale } = await initPage(params);
  const t = await getTranslations({ locale, namespace: "share" });
  const meta = await buildMetadata({ locale, path: routes.privilegedAccess, title: t("metaTitle"), image: issueCover(siteConfig.currentIssueSlug), noIndex: true });
  return { ...meta, alternates: undefined, referrer: "no-referrer" };
}

/** Unlisted copy of the current issue page — "Read" opens every page without login */
export default async function PrivilegedAccessPage({ params }: PageProps<"/[locale]/privileged-access">) {
  await initPage(params);
  const content = await getContent();
  const issue = content.issues.items.find((i) => i.slug === siteConfig.currentIssueSlug);
  if (!issue) notFound();

  return (
    <>
      <PrivilegedNotice />
      <IssueHero issue={issue} readHref={routes.privilegedReader} />
      <Editorial issue={issue} />
      <InThisIssue
        articles={articlesInIssue(content.articles.items, issue.slug)}
        topics={content.topics.items}
        labels={{ all: content.articles.filterAll, filter: content.articles.filterLabel, empty: content.articles.empty }}
      />
      <Gratitude text={issue.gratitude} />
      <NextIssueCta />
    </>
  );
}
