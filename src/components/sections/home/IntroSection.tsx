import { Quote } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { reveal } from "@/components/ui/reveal";

export async function IntroSection() {
  const t = await getTranslations("home.intro");
  return (
    <Section tone="mist" spacing="md" className="bg-contour">
      <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div {...reveal(0, "left")}>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-[1.75rem] sm:text-4xl">{t("title")}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t("text")}</p>
        </div>
        <figure {...reveal(1, "right")} className="relative rounded-card border-l-4 border-primary bg-surface p-7 shadow-card sm:p-9">
          <Quote aria-hidden className="size-10 text-accent/30" />
          <blockquote className="mt-2 font-serif text-xl italic leading-relaxed text-primary sm:text-2xl">“{t("quote")}”</blockquote>
          <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4 text-sm font-semibold text-ink-soft">
            <span aria-hidden className="h-0.5 w-8 bg-cta" />
            {t("quoteSource")}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
