import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { BoardGrid, ChiefEditor, TeamCta, TeamIntro, TeamValues } from "@/components/sections/team/TeamSections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { teamSchema } from "@/lib/structured-data";
import { initPage } from "@/lib/page";
import { pageHero } from "@/lib/media";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/editorial-board">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.team, seoKey: "team" });
}

export default async function EditorialBoardPage({ params }: PageProps<"/[locale]/editorial-board">) {
  await initPage(params);
  const { team } = await getContent();
  const chief = team.members.find((m) => "chief" in m && m.chief) ?? team.members[0];
  const others = team.members.filter((m) => m.id !== chief.id);

  return (
    <>
      <PageHero title={team.hero.title} subtitle={team.hero.subtitle} image={pageHero("team")} breadcrumbs={[{ label: team.hero.title, href: routes.team }]} />
      <TeamIntro team={team} />
      <ChiefEditor member={chief} eyebrow={team.chiefEyebrow} focusLabel={team.focusLabel} />
      <BoardGrid team={team} members={others} />
      <TeamValues team={team} />
      <TeamCta team={team} />
      <JsonLd data={teamSchema(team.members)} />
    </>
  );
}
