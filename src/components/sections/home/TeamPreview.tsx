import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import { TeamSlider} from "./TeamSlider"

import type { TeamMember } from "@/types/content";

export async function TeamPreview({ members }: { members: TeamMember[] }) {
  const t = await getTranslations("home.team");
  const tc = await getTranslations("common");
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
      <TeamSlider members={members} labels={{ region: t("title"), prev: tc("previous"), next: tc("next") }} />
      <div className="mt-8 text-center lg:hidden">
        <ButtonLink href={routes.team} variant="outline" icon={<ArrowRight />}>
          {t("cta")}
        </ButtonLink>
      </div>
    </Section>
  );
}