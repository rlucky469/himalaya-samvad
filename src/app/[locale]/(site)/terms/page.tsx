import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.terms, seoKey: "terms" });
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  await initPage(params);
  const { legal } = await getContent();
  return <LegalPage doc={legal.terms} href={routes.terms} updatedLabel={legal.updatedLabel} draftNote={legal.draftNote} />;
}
