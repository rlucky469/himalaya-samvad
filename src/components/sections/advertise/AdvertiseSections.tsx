import { ArrowRight, BookOpen, Building2, CheckCircle2, FileCheck2, Globe2, GraduationCap, HeartHandshake, Landmark, Leaf, Library, MapPinned, PenLine, School, ShieldCheck, Sparkles, Store, TentTree, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { AdSlotDiagram } from "@/components/ui/AdSlotDiagram";
import { buttonClasses } from "@/components/ui/Button";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";
import type { AdSlot, Messages } from "@/types/content";
import { cn } from "@/lib/utils";

type Advertise = Messages["advertise"];

const whoIcons = [Building2, School, Store, HeartHandshake, TentTree, Library];
const readerIcons = [GraduationCap, BookOpen, PenLine, Users, Landmark, Leaf, Library, MapPinned, Globe2];

export function AdvertiseIntro({ advertise }: { advertise: Advertise }) {
  const a = advertise.intro;
  return (
    <Section tone="white">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div {...reveal(0, "left")}>
          <Eyebrow>{a.eyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{a.title}</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
            {a.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div {...reveal(1, "right")} className="rounded-panel border border-line bg-mist p-6 sm:p-8">
          <p className="font-sans text-lg font-bold text-primary">{a.whoTitle}</p>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {a.who.map((item, i) => {
              const Icon = whoIcons[i] ?? Sparkles;
              return (
                <li key={item} className="flex flex-col items-start gap-3 rounded-xl bg-surface p-4 shadow-card">
                  <Icon aria-hidden className="size-6 text-cta" />
                  <span className="font-semibold leading-snug text-ink">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function AdvertiseReaders({ advertise }: { advertise: Advertise }) {
  const r = advertise.readers;
  return (
    <Section tone="mist">
      <SectionHeading eyebrow={r.eyebrow} title={r.title} subtitle={r.subtitle} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {r.items.map((item, i) => {
          const Icon = readerIcons[i] ?? Users;
          return (
            <li key={item} {...reveal(i)} className="group flex items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-primary-soft">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon aria-hidden className="size-6" />
              </span>
              <span className="font-semibold leading-snug text-ink">{item}</span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function SlotSizes({ slot, s }: { slot: AdSlot; s: Advertise["slots"] }) {
  const rows = [
    { label: s.sizeLabel, value: slot.size.includes("×") ? `${slot.size} ${s.mm}` : slot.size },
    "bleed" in slot && slot.bleed ? { label: s.bleedLabel, value: `${slot.bleed} ${s.mm}` } : null,
    "finish" in slot && slot.finish ? { label: s.finishLabel, value: `${slot.finish} ${s.mm}` } : null,
  ].filter(Boolean) as { label: string; value: string }[];
  return (
    <dl className="space-y-1.5 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-3 border-b border-dashed border-line pb-1.5 last:border-0">
          <dt className="text-muted">{row.label}</dt>
          <dd className="font-semibold text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AdvertiseSlots({ advertise }: { advertise: Advertise }) {
  const s = advertise.slots;
  const featured = s.items.find((slot) => "featured" in slot && slot.featured) ?? s.items[0];
  const rest = s.items.filter((slot) => slot.id !== featured.id);
  const enquireHref = (id: string) => `${routes.advertise}?slot=${id}#enquiry`;

  return (
    <Section tone="white" id="slots">
      <SectionHeading eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <article {...reveal(0)} className="relative grid items-center gap-8 overflow-hidden rounded-panel border-2 border-accent/30 bg-accent-soft/40 p-6 sm:p-10 md:grid-cols-[220px_1fr]">
        <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">{s.featuredBadge}</span>
        <AdSlotDiagram widthMm={featured.widthMm} heightMm={featured.heightMm} placement={featured.placement} highlight="accent" className="mx-auto max-w-[200px]" />
        <div>
          <h3 className="text-2xl sm:text-3xl">{featured.name}</h3>
          <p className="mt-2 text-lg text-ink-soft">{featured.description}</p>
          <div className="mt-5 max-w-md rounded-xl bg-surface p-4 shadow-card">
            <SlotSizes slot={featured} s={s} />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href={enquireHref(featured.id)} className={buttonClasses("primary", "md")}>
              {s.enquire}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <span className="text-sm font-semibold text-accent">{s.rateNote}</span>
          </div>
        </div>
      </article>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((slot, i) => (
          <article key={slot.id} {...reveal(i)} className="group flex flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
            <div className="flex gap-5">
              <AdSlotDiagram widthMm={slot.widthMm} heightMm={slot.heightMm} placement={slot.placement} className="w-24 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-xl">{slot.name}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{slot.description}</p>
              </div>
            </div>
            <div className="mt-5 flex-1">
              <SlotSizes slot={slot} s={s} />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
              <span className="text-xs font-semibold text-muted">{s.rateNote}</span>
              <Link href={enquireHref(slot.id)} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">
                {s.enquire}
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function AdvertiseSpecial({ advertise }: { advertise: Advertise }) {
  const sp = advertise.special;
  return (
    <Section tone="mist" spacing="md">
      <SectionHeading eyebrow={sp.eyebrow} title={sp.title} subtitle={sp.subtitle} />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sp.items.map((item, i) => (
          <li key={item} {...reveal(i)} className="flex items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-card">
            <span className="font-serif text-3xl font-bold text-cta">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-semibold text-ink">{item}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function AdvertiseSpecsAndPolicy({ advertise }: { advertise: Advertise }) {
  const { specs, policy } = advertise;
  return (
    <Section tone="white" spacing="md">
      <div className="grid gap-6 lg:grid-cols-2">
        <div {...reveal(0, "left")} className="rounded-panel border border-line bg-surface p-7 shadow-card sm:p-9">
          <Eyebrow>{specs.eyebrow}</Eyebrow>
          <h2 className="text-2xl sm:text-3xl">{specs.title}</h2>
          <p className="mt-2 text-ink-soft">{specs.subtitle}</p>
          <ul className="mt-6 space-y-3">
            {specs.items.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3 font-medium text-ink">
                <FileCheck2 aria-hidden className="size-5 shrink-0 text-nature" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div {...reveal(1, "right")} className={cn("relative overflow-hidden rounded-panel bg-primary p-7 text-white shadow-lift sm:p-9")}>
          <ShieldCheck aria-hidden className="absolute -right-6 -top-6 size-40 text-white/5" />
          <Eyebrow tone="dark">{policy.eyebrow}</Eyebrow>
          <h2 className="text-2xl text-white sm:text-3xl">{policy.title}</h2>
          <div className="mt-6 space-y-4">
            {policy.paragraphs.map((p) => (
              <p key={p} className="flex gap-3 text-on-dark-muted">
                <CheckCircle2 aria-hidden className="mt-1 size-5 shrink-0 text-cta" />
                <span>{p}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
