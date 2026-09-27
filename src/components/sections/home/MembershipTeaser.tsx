import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { PlanCard } from "@/components/cards/PlanCard";
import { reveal } from "@/components/ui/reveal";
import { benefitIcons } from "@/components/icons/benefit-icons";
import { routes } from "@/config/routes";
import type { Messages } from "@/types/content";

export async function MembershipTeaser({ membership }: { membership: Messages["membership"] }) {
  const t = await getTranslations("home.membership");
  const plans = membership.plans.items.filter((p) => !("contactOnly" in p && p.contactOnly));
  const labels = { perYear: membership.plans.perYear, pricePending: membership.plans.pricePending, popular: membership.plans.popular, choose: membership.plans.choose, contact: membership.plans.contact };

  return (
    <Section tone="white">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
        <div {...reveal(0, "left")}>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-[1.75rem] sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-ink-soft">{t("text")}</p>
          <ul className="mt-7 space-y-3.5">
            {membership.benefits.items.map((b) => {
              const Icon = benefitIcons[b.id];
              return (
                <li key={b.id} className="flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
                    <Icon aria-hidden className="size-4.5" />
                  </span>
                  <span className="font-semibold text-ink">{b.title}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <div className="grid gap-5 pt-4 sm:grid-cols-3">
            {plans.map((plan, i) => (
              <div key={plan.id} {...reveal(i + 1)}>
                <PlanCard plan={plan} labels={labels} href={`${routes.membership}?plan=${plan.id}#apply`} compact />
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted">{membership.plans.subtitle}</p>
          <Link href={routes.membership} className="mt-3 inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent">
            {t("moreLink")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
