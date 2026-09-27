import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactClosing, ContactIntro, OfficeCard, SocialSection, Submissions } from "@/components/sections/contact/ContactSections";
import { reveal } from "@/components/ui/reveal";
import { getContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { pageHero } from "@/lib/media";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.contact, seoKey: "contact" });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  await initPage(params);
  const { contact, brand, common } = await getContent();

  return (
    <>
      <PageHero title={contact.hero.title} subtitle={contact.hero.subtitle} image={pageHero("contact")} breadcrumbs={[{ label: contact.hero.title, href: routes.contact }]} />
      <ContactIntro contact={contact} />
      <Section tone="mist" id="message">
        <SectionHeading eyebrow={contact.form.eyebrow} title={contact.form.title} subtitle={contact.form.subtitle} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div {...reveal(0)} className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-9">
            <Suspense fallback={<div className="h-[560px] animate-pulse rounded-card bg-mist" />}>
              <ContactForm />
            </Suspense>
          </div>
          <div {...reveal(1, "right")} className="lg:sticky lg:top-28 lg:self-start">
            <OfficeCard contact={contact} location={brand.location} />
          </div>
        </div>
      </Section>
      <Submissions contact={contact} />
      <SocialSection contact={contact} comingSoon={common.comingSoon} />
      <ContactClosing contact={contact} closingLines={brand.closingLines} tagline={brand.tagline} />
    </>
  );
}
