import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy-policy">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.privacy, seoKey: "privacy" });
}

export default async function PrivacyPolicyPage({ params }: PageProps<"/[locale]/privacy-policy">) {
  await initPage(params);
  const { legal } = await getContent();
  return <LegalPage doc={legal.privacy} href={routes.privacy} updatedLabel={legal.updatedLabel} draftNote={legal.draftNote} />;
}
