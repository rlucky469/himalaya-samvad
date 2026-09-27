import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowDown } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { ContactAside } from "@/components/sections/ContactAside";
import { MembershipForm } from "@/components/forms/MembershipForm";
import { MembershipBenefits, MembershipPlans, MembershipSteps, MembershipSupport, MembershipWhy } from "@/components/sections/membership/MembershipSections";
import { JsonLd } from "@/components/seo/JsonLd";
import { reveal } from "@/components/ui/reveal";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/structured-data";
import { initPage } from "@/lib/page";
import { pageHero } from "@/lib/media";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/membership">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.membership, seoKey: "membership" });
}

export default async function MembershipPage({ params }: PageProps<"/[locale]/membership">) {
  await initPage(params);
  const { membership, nav } = await getContent();
  const planOptions = membership.plans.items.map((p) => ({ value: p.id, label: p.name }));

  return (
    <>
      <PageHero title={membership.hero.title} subtitle={membership.hero.subtitle} image={pageHero("membership")} breadcrumbs={[{ label: membership.hero.title, href: routes.membership }]}>
        <ButtonLink href="#apply" icon={<ArrowDown />}>
          {nav.subscribe}
        </ButtonLink>
        <ButtonLink href="#plans" variant="outlineLight">
          {membership.plans.eyebrow}
        </ButtonLink>
      </PageHero>
      <MembershipWhy membership={membership} />
      <MembershipBenefits membership={membership} />
      <MembershipPlans membership={membership} />
      <MembershipSupport membership={membership} />
      <MembershipSteps membership={membership} />

      <Section tone="mist" id="apply">
        <SectionHeading eyebrow={membership.form.eyebrow} title={membership.form.title} subtitle={membership.form.subtitle} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div {...reveal(0)} className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-9">
            <Suspense fallback={<div className="h-[640px] animate-pulse rounded-card bg-mist" />}>
              <MembershipForm plans={planOptions} />
            </Suspense>
          </div>
          <div {...reveal(1, "right")} className="lg:sticky lg:top-28 lg:self-start">
            <ContactAside title={membership.form.sideTitle} text={membership.form.sideText} email="subscription" />
          </div>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow={membership.faq.eyebrow} title={membership.faq.title} />
        <div className="mx-auto max-w-3xl" {...reveal(0)}>
          <Accordion items={membership.faq.items} />
        </div>
      </Section>
      <JsonLd data={faqSchema(membership.faq.items)} />
    </>
  );
}
