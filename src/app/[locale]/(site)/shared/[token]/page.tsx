import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Editorial, Gratitude, InThisIssue, IssueHero, NextIssueCta } from "@/components/sections/issues/IssueSections";
import { ShareLinkError, SharedNotice } from "@/components/sections/issues/SharedIssue";
import { articlesInIssue, getContent } from "@/lib/content";
import { verifyShareLink } from "@/lib/magazine/share";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { issueCover } from "@/lib/media";
import { routes } from "@/config/routes";

// Every share link is different and checked on each visit
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/shared/[token]">): Promise<Metadata> {
  const { locale, token } = await initPage(params);
  const t = await getTranslations({ locale, namespace: "share" });
  const link = verifyShareLink(token);
  const issue = link.ok ? (await getContent()).issues.items.find((i) => i.slug === link.slug) : undefined;
  const meta = await buildMetadata({
    locale,
    path: routes.shared(token),
    title: issue ? `${issue.label} — ${issue.title}` : t("metaTitle"),
    description: issue?.description,
    image: issue ? issueCover(issue.slug) : undefined,
    noIndex: true,
  });
  // Private link: never indexed and never leaked to other sites through the Referer header
  return { ...meta, alternates: undefined, referrer: "no-referrer" };
}

export default async function SharedIssuePage({ params }: PageProps<"/[locale]/shared/[token]">) {
  const { locale, token } = await initPage(params);
  const link = verifyShareLink(token);
  if (!link.ok) return <ShareLinkError reason={link.reason} />;

  const content = await getContent();
  const issue = content.issues.items.find((i) => i.slug === link.slug);
  if (!issue) return <ShareLinkError reason="invalid" />;

  const readHref = routes.sharedReader(token);
  return (
    <>
      <SharedNotice locale={locale} label={link.label} expiresAt={link.expiresAt} readHref={readHref} />
      <IssueHero issue={issue} readHref={readHref} />
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
