import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { IntroSection } from "@/components/sections/home/IntroSection";
import { VisionSection } from "@/components/sections/home/VisionSection";
import { TopicsSection } from "@/components/sections/home/TopicsSection";
import { LatestArticles } from "@/components/sections/home/LatestArticles";
import { FeaturedIssue } from "@/components/sections/home/FeaturedIssue";
import { MembershipTeaser } from "@/components/sections/home/MembershipTeaser";
import { TeamPreview } from "@/components/sections/home/TeamPreview";
import { AdvertiseTeaser } from "@/components/sections/home/AdvertiseTeaser";
import { JoinCta } from "@/components/sections/JoinCta";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.home, seoKey: "home", absoluteTitle: true });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await initPage(params);
  const content = await getContent();
  const topicTitles = Object.fromEntries(content.topics.items.map((t) => [t.slug, t.title]));
  const articleCounts = content.articles.items.reduce<Record<string, number>>((acc, a) => ({ ...acc, [a.topic]: (acc[a.topic] ?? 0) + 1 }), {});
  const issue = content.issues.items.find((i) => i.slug === siteConfig.currentIssueSlug) ?? content.issues.items[0];

  return (
    <>
      <HomeHero />
      <IntroSection />
      <VisionSection />
      <TopicsSection topics={content.topics.items} articleCounts={articleCounts} />
      {/* <LatestArticles articles={content.articles.items} topicTitles={topicTitles} /> */}
      <FeaturedIssue issue={issue} articles={content.articles.items} />
      <MembershipTeaser membership={content.membership} />
      <TeamPreview members={content.team.members} />
      <AdvertiseTeaser slots={content.advertise.slots.items} />
      <JoinCta />
    </>
  );
}
