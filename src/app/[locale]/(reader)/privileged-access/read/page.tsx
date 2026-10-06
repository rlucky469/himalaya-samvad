import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MagazineReader } from "@/components/reader/MagazineReader";
import { getContent } from "@/lib/content";
import { createAccessGrant } from "@/lib/magazine/privileged";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

// A fresh access grant is made on every visit
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/privileged-access/read">): Promise<Metadata> {
  const { locale } = await initPage(params);
  const meta = await buildMetadata({ locale, path: routes.privilegedReader, seoKey: "reader", noIndex: true });
  return { ...meta, alternates: undefined, referrer: "no-referrer" };
}

/** Full-screen reader with every page unlocked, no login needed */
export default async function PrivilegedReaderPage({ params }: PageProps<"/[locale]/privileged-access/read">) {
  await initPage(params);
  const { brand, issues } = await getContent();
  const issue = issues.items.find((i) => i.slug === siteConfig.currentIssueSlug);
  if (!issue) notFound();

  return (
    <Suspense fallback={<div className="h-dvh bg-[#0d1424]" />}>
      <MagazineReader
        slug={issue.slug}
        title={`${brand.name} • ${issue.label} • ${issue.month}`}
        backHref={routes.privilegedAccess}
        accessGrant={createAccessGrant(issue.slug)}
      />
    </Suspense>
  );
}
