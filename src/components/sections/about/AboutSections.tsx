import Image from "next/image";
import { ArrowRight, BadgeCheck, BookOpen, Briefcase, Footprints, Globe2, GraduationCap, HeartHandshake, Landmark, Lightbulb, Pickaxe, Quote, Scale, ShieldCheck, Sparkles, Stethoscope, Thermometer, UsersRound, Wheat } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";
import { media } from "@/lib/media";
import type { Messages } from "@/types/content";

type About = Messages["about"];

const issueIcons = [Thermometer, Footprints, GraduationCap, Stethoscope, Pickaxe, Landmark, Briefcase, Wheat];
const valueIcons = [BadgeCheck, Scale, HeartHandshake, UsersRound];
const journeyIcons = [Lightbulb, UsersRound, BookOpen];

export function WhoWeAre({ about, logoAlt }: { about: About; logoAlt: string }) {
  return (
    <Section tone="white">
      <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div {...reveal(0, "left")}>
          <Eyebrow>{about.whoWeAre.eyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{about.whoWeAre.title}</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
            {about.whoWeAre.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div {...reveal(1, "zoom")} className="relative mx-auto w-full max-w-md">
          <div aria-hidden className="absolute inset-6 -z-10 rounded-full bg-gradient-to-br from-cta/25 via-primary-soft to-accent/15 blur-2xl" />
          <div className="rounded-[2rem] border border-line bg-surface p-8 text-center shadow-lift">
            <div className="relative mx-auto aspect-square w-full max-w-xs">
              <Image src={media.brand.logo} alt={logoAlt} fill sizes="320px" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function WhyDialogue({ about }: { about: About }) {
  return (
    <Section tone="mist" className="bg-contour">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div {...reveal(0, "left")}>
          <Eyebrow>{about.why.eyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{about.why.title}</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
            {about.why.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div>
          <p {...reveal(0)} className="mb-5 font-sans text-lg font-bold text-primary">{about.why.issuesTitle}</p>
          <ul className="grid grid-cols-2 gap-3">
            {about.why.issues.map((issue, i) => {
              const Icon = issueIcons[i] ?? Sparkles;
              return (
                <li key={issue} {...reveal(i)} className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary-soft sm:p-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="font-semibold leading-snug text-ink">{issue}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function QuoteBand({ text, source }: { text: string; source: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-primary py-20 text-white sm:py-24">
      <Quote aria-hidden className="absolute -right-6 -top-6 -z-10 size-72 text-white/[0.04]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-mountain-silhouette opacity-70" />
      <figure className="container-site max-w-4xl text-center" {...reveal(0, "zoom")}>
        <Quote aria-hidden className="mx-auto size-10 text-cta" />
        <blockquote className="mt-6 font-serif text-2xl leading-relaxed text-white sm:text-3xl lg:text-[2.1rem]">“{text}”</blockquote>
        <figcaption className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-on-dark-muted">
          <span aria-hidden className="h-0.5 w-10 bg-cta" />
          {source}
        </figcaption>
      </figure>
    </section>
  );
}

export function Commitment({ about }: { about: About }) {
  const c = about.commitment;
  return (
    <Section tone="white">
      <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {c.values.map((value, i) => {
          const Icon = valueIcons[i] ?? BadgeCheck;
          return (
            <div key={value.title} {...reveal(i)} className="group rounded-card border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-cta-soft text-cta transition-transform duration-300 group-hover:scale-110">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="mt-5 text-xl">{value.title}</h3>
              <p className="mt-2 text-ink-soft">{value.text}</p>
            </div>
          );
        })}
      </div>
      <div {...reveal(2)} className="mt-8 flex items-start gap-4 rounded-card border border-primary-soft bg-primary-tint p-6 sm:items-center sm:p-7">
        <ShieldCheck aria-hidden className="size-8 shrink-0 text-primary" />
        <p className="text-lg font-medium leading-relaxed text-primary">{c.nonPartisan}</p>
      </div>
    </Section>
  );
}

export function Journey({ about }: { about: About }) {
  const j = about.journey;
  return (
    <Section tone="mist">
      <SectionHeading eyebrow={j.eyebrow} title={j.title} subtitle={about.belief.paragraphs[0]} />
      <ol className="relative grid gap-6 md:grid-cols-3">
        <span aria-hidden className="absolute left-0 right-0 top-9 hidden h-0.5 bg-gradient-to-r from-primary-soft via-cta to-accent md:block" />
        {j.steps.map((step, i) => {
          const Icon = journeyIcons[i] ?? Sparkles;
          const last = i === j.steps.length - 1;
          return (
            <li key={step.title} {...reveal(i)} className="relative">
              <span className={`relative z-10 inline-flex size-18 items-center justify-center rounded-2xl text-white shadow-lift ${last ? "bg-cta" : "bg-primary"}`}>
                <Icon aria-hidden className="size-7" />
              </span>
              <div className={`mt-5 rounded-card border bg-surface p-6 shadow-card ${last ? "border-cta" : "border-line"}`}>
                <p className={`text-sm font-semibold ${last ? "text-cta" : "text-accent"}`}>{step.label}</p>
                <h3 className="mt-1 text-xl">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

export function LocalVoices({ about }: { about: About }) {
  const lv = about.localVoices;
  const images = media.about.localVoices;
  return (
    <Section tone="white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-2 gap-4" {...reveal(0, "left")}>
          {images.map((src, i) => (
            <figure key={src} className={`group relative overflow-hidden rounded-card shadow-card ${i % 2 === 1 ? "translate-y-8" : ""}`}>
              <div className="relative aspect-[4/5]">
                <Image src={src} alt={lv.captions[i] ?? ""} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-deep/90 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-white">
                {lv.captions[i]}
              </figcaption>
            </figure>
          ))}
        </div>
        <div {...reveal(1, "right")}>
          <Eyebrow>{lv.eyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{lv.title}</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
            {lv.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ButtonLink href={routes.contactForm} variant="outline" className="mt-8" icon={<ArrowRight />}>
            {lv.cta}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

export function WhatWePublish({ about }: { about: About }) {
  const p = about.publish;
  return (
    <Section tone="mist">
      <SectionHeading eyebrow={p.eyebrow} title={p.title} subtitle={p.text} />
      <ul className="flex flex-wrap gap-2.5" {...reveal(0)}>
        {p.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-primary-soft bg-surface px-4 py-2 font-medium text-primary shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white">
            {tag}
          </li>
        ))}
      </ul>
      <p {...reveal(1)} className="mt-8 font-serif text-2xl italic text-accent">“{p.bridge}”</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {[
          { ...about.youth, Icon: Sparkles },
          { ...about.global, Icon: Globe2 },
        ].map(({ title, text, Icon }, i) => (
          <div key={title} {...reveal(i)} className="relative overflow-hidden rounded-card border border-line bg-surface p-7 shadow-card sm:p-8">
            <span aria-hidden className="absolute -right-8 -top-8 size-28 rounded-full bg-cta-soft" />
            <Icon aria-hidden className="relative size-8 text-cta" />
            <h3 className="relative mt-4 text-2xl">{title}</h3>
            <p className="relative mt-3 text-lg leading-relaxed text-ink-soft">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function AboutClosing({ about, closingLines, tagline }: { about: About; closingLines: string[]; tagline: string }) {
  return (
    <Section tone="white" className="text-center">
      <div className="mx-auto max-w-3xl" {...reveal(0, "zoom")}>
        <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">{about.closing.text}</p>
        <div className="mt-10 space-y-1 font-serif text-3xl font-bold sm:text-4xl">
          {closingLines.map((line, i) => (
            <p key={line} className={i === closingLines.length - 1 ? "text-cta" : "text-primary"}>
              {line}
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold tracking-wider text-accent">{tagline}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={routes.team} variant="outline" icon={<ArrowRight />}>
            {about.closing.teamCta}
          </ButtonLink>
          <ButtonLink href={routes.membershipApply}>{about.closing.subscribeCta}</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
