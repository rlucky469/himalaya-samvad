import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reveal } from "@/components/ui/reveal";

export async function VisionSection() {
  const t = await getTranslations("home.vision");
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <Section tone="white">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <ol className="grid gap-x-12 gap-y-2 rounded-panel border border-line bg-mist/60 p-6 sm:p-10 md:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.title} {...reveal(i)} className="group flex gap-5 border-b border-line py-6 last:border-0 md:[&:nth-last-child(2)]:border-0">
            <span className="font-serif text-3xl font-bold leading-none text-accent/80 transition-colors group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}.
            </span>
            <div>
              <h3 className="font-sans text-xl font-bold text-primary">{item.title}</h3>
              <p className="mt-1.5 text-ink-soft">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
