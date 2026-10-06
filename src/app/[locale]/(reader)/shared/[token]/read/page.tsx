import type { Metadata } from "next";
import { Suspense } from "react";
import { MagazineReader } from "@/components/reader/MagazineReader";
import { redirect } from "@/i18n/navigation";
import { getContent } from "@/lib/content";
import { verifyShareLink } from "@/lib/magazine/share";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/shared/[token]/read">): Promise<Metadata> {
  const { locale, token } = await initPage(params);
  const meta = await buildMetadata({ locale, path: routes.sharedReader(token), seoKey: "reader", noIndex: true });
  return { ...meta, alternates: undefined, referrer: "no-referrer" };
}

/** Full-screen reader opened through a private share link — every page, no login */
export default async function SharedReaderPage({ params }: PageProps<"/[locale]/shared/[token]/read">) {
  const { locale, token } = await initPage(params);
  const link = verifyShareLink(token);
  const issue = link.ok ? (await getContent()).issues.items.find((i) => i.slug === link.slug) : undefined;
  // A bad or expired link goes back to the share page, which explains what happened
  if (!link.ok || !issue) return redirect({ href: routes.shared(token), locale });

  const { brand } = await getContent();
  return (
    <Suspense fallback={<div className="h-dvh bg-[#0d1424]" />}>
      <MagazineReader slug={issue.slug} title={`${brand.name} • ${issue.label} • ${issue.month}`} backHref={routes.shared(token)} shareToken={token} />
    </Suspense>
  );
}
