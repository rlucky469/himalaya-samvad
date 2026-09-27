import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { AboutClosing, Commitment, Journey, LocalVoices, QuoteBand, WhatWePublish, WhoWeAre, WhyDialogue } from "@/components/sections/about/AboutSections";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { pageHero } from "@/lib/media";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.about, seoKey: "about" });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  await initPage(params);
  const { about, brand } = await getContent();

  return (
    <>
      <PageHero title={about.hero.title} subtitle={about.hero.subtitle} image={pageHero("about")} breadcrumbs={[{ label: about.hero.title, href: routes.about }]} />
      <WhoWeAre about={about} logoAlt={brand.logoAlt} />
      <WhyDialogue about={about} />
      <QuoteBand text={about.quote.text} source={about.quote.source} />
      <Commitment about={about} />
      <Journey about={about} />
      <LocalVoices about={about} />
      <WhatWePublish about={about} />
      <AboutClosing about={about} closingLines={brand.closingLines} tagline={brand.tagline} />
    </>
  );
}
