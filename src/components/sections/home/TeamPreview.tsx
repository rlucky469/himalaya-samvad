import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { TeamCard } from "@/components/cards/TeamCard";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";
import type { TeamMember } from "@/types/content";

export async function TeamPreview({ members }: { members: TeamMember[] }) {
  const t = await getTranslations("home.team");
  return (
    <Section tone="mist">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <ButtonLink href={routes.team} variant="outline" size="sm" icon={<ArrowRight />} className="hidden lg:inline-flex">
            {t("cta")}
          </ButtonLink>
        }
      />
      {/* horizontal swipe on mobile, grid on larger screens */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-5">
        {members.slice(0, 4).map((member, i) => (
          <div key={member.id} {...reveal(i)} className="w-[78%] shrink-0 snap-center sm:w-auto">
            <TeamCard member={member} />
          </div>
        ))}
      </div>
      <div className="mt-8 text-center lg:hidden">
        <ButtonLink href={routes.team} variant="outline" icon={<ArrowRight />}>
          {t("cta")}
        </ButtonLink>
      </div>
    </Section>
  );
}
