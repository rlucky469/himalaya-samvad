import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MagazineReader } from "@/components/reader/MagazineReader";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";
import hi from "@messages/hi.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return hi.issues.items.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/issues/[slug]/read">): Promise<Metadata> {
  const { locale, slug } = await initPage(params);
  const issue = (await getContent()).issues.items.find((i) => i.slug === slug);
  // The reader is not indexed; the issue page is the SEO page
  return buildMetadata({ locale, path: routes.reader(slug), title: issue ? `${issue.label} — ${issue.title}` : undefined, seoKey: "reader", noIndex: true });
}

export default async function ReaderPage({ params }: PageProps<"/[locale]/issues/[slug]/read">) {
  const { slug } = await initPage(params);
  const content = await getContent();
  const issue = content.issues.items.find((i) => i.slug === slug);
  if (!issue) notFound();

  return (
    <Suspense fallback={<div className="h-dvh bg-[#0d1424]" />}>
      <MagazineReader slug={slug} title={`${content.brand.name} • ${issue.label} • ${issue.month}`} backHref={routes.issue(slug)} />
    </Suspense>
  );
}
