import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowDown, LayoutGrid } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ContactAside } from "@/components/sections/ContactAside";
import { AdvertiseForm } from "@/components/forms/AdvertiseForm";
import { AdvertiseIntro, AdvertiseReaders, AdvertiseSlots, AdvertiseSpecial, AdvertiseSpecsAndPolicy } from "@/components/sections/advertise/AdvertiseSections";
import { reveal } from "@/components/ui/reveal";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { pageHero } from "@/lib/media";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/advertise">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.advertise, seoKey: "advertise" });
}

export default async function AdvertisePage({ params }: PageProps<"/[locale]/advertise">) {
  await initPage(params);
  const { advertise } = await getContent();
  const slotOptions = [
    ...advertise.slots.items.map((s) => ({ value: s.id, label: s.name })),
    ...advertise.special.items.map((label, i) => ({ value: `special-${i + 1}`, label })),
  ];

  return (
    <>
      <PageHero title={advertise.hero.title} subtitle={advertise.hero.subtitle} image={pageHero("advertise")} breadcrumbs={[{ label: advertise.hero.title, href: routes.advertise }]}>
        <ButtonLink href="#enquiry" icon={<ArrowDown />}>
          {advertise.hero.primaryCta}
        </ButtonLink>
        <ButtonLink href="#slots" variant="outlineLight" icon={<LayoutGrid />}>
          {advertise.hero.secondaryCta}
        </ButtonLink>
      </PageHero>
      <AdvertiseIntro advertise={advertise} />
      <AdvertiseReaders advertise={advertise} />
      <AdvertiseSlots advertise={advertise} />
      <AdvertiseSpecial advertise={advertise} />
      <AdvertiseSpecsAndPolicy advertise={advertise} />
      <Section tone="mist" id="enquiry">
        <SectionHeading eyebrow={advertise.enquiry.eyebrow} title={advertise.enquiry.title} subtitle={advertise.enquiry.subtitle} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div {...reveal(0)} className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-9">
            <Suspense fallback={<div className="h-[520px] animate-pulse rounded-card bg-mist" />}>
              <AdvertiseForm slots={slotOptions} />
            </Suspense>
          </div>
          <div {...reveal(1, "right")} className="lg:sticky lg:top-28 lg:self-start">
            <ContactAside title={advertise.enquiry.sideTitle} text={advertise.enquiry.sideText} email="ads" />
          </div>
        </div>
      </Section>
    </>
  );
}
