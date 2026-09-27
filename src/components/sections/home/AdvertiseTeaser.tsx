import { ArrowRight, Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { AdSlotDiagram } from "@/components/ui/AdSlotDiagram";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";
import type { AdSlot } from "@/types/content";

export async function AdvertiseTeaser({ slots }: { slots: AdSlot[] }) {
  const t = await getTranslations("home.advertise");
  const preview = ["back-cover", "full-page", "half-page-horizontal", "quarter-page"]
    .map((id) => slots.find((s) => s.id === id))
    .filter((s): s is AdSlot => Boolean(s));

  return (
    <Section tone="white" spacing="md">
      <div className="grid items-center gap-10 rounded-panel bg-mist p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
        <div {...reveal(0, "left")}>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-[1.75rem] sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-ink-soft">{t("text")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={routes.advertise} variant="navy" icon={<ArrowRight />}>
              {t("primaryCta")}
            </ButtonLink>
            <ButtonLink href={routes.advertiseEnquiry} variant="outline" icon={<Send />}>
              {t("secondaryCta")}
            </ButtonLink>
          </div>
        </div>
        <div {...reveal(1, "right")} className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-7">
          <p className="mb-5 font-sans text-lg font-bold text-primary">{t("formatsTitle")}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {preview.map((slot, i) => (
              <div key={slot.id} className="text-center">
                <AdSlotDiagram widthMm={slot.widthMm} heightMm={slot.heightMm} placement={slot.placement} highlight={i === 0 ? "accent" : "cta"} className="mx-auto max-w-[110px]" />
                <p className="mt-2 text-sm font-semibold leading-tight text-ink">{slot.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
