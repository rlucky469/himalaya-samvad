import Image from "next/image";
import { CheckCircle2, ClipboardList, Heart, ListChecks, Quote, UserCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { PlanCard } from "@/components/cards/PlanCard";
import { benefitIcons } from "@/components/icons/benefit-icons";
import { reveal } from "@/components/ui/reveal";
import { issueCover } from "@/lib/media";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { Messages } from "@/types/content";

type Membership = Messages["membership"];

export function MembershipWhy({ membership }: { membership: Membership }) {
  const w = membership.why;
  const cover = issueCover(siteConfig.currentIssueSlug);
  return (
    <Section tone="white">
      <div className="grid items-center gap-14 lg:grid-cols-[1.3fr_1fr]">
        <div {...reveal(0, "left")}>
          <Eyebrow>{w.eyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{w.title}</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            {w.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div {...reveal(1, "zoom")} className="relative mx-auto h-[420px] w-full max-w-sm sm:h-[460px]">
          {[2, 1].map((n) => (
            <div key={n} aria-hidden className="absolute top-6 h-[85%] w-[62%] overflow-hidden rounded-md opacity-60 shadow-card" style={{ left: `${n * 14}%`, transform: `rotate(${n * 5}deg)` }}>
              <Image src={cover} alt="" fill sizes="220px" className="object-cover grayscale-[40%]" />
            </div>
          ))}
          <div className="absolute left-0 top-0 h-[92%] w-[66%] overflow-hidden rounded-md shadow-cover ring-1 ring-black/10 transition-transform duration-500 hover:-rotate-2">
            <Image src={cover} alt={w.coverCaption} fill sizes="260px" className="object-cover" />
          </div>
          <span className="absolute bottom-0 left-4 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-lift">{w.coverCaption}</span>
        </div>
      </div>
    </Section>
  );
}

export function MembershipBenefits({ membership }: { membership: Membership }) {
  const b = membership.benefits;
  return (
    <Section tone="mist">
      <SectionHeading eyebrow={b.eyebrow} title={b.title} />
      <div className="flex flex-wrap justify-center gap-5">
        {b.items.map((item, i) => {
          const Icon = benefitIcons[item.id];
          return (
            <div key={item.id} {...reveal(i)} className="group w-full rounded-card border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="mt-5 text-xl">{item.title}</h3>
              <p className="mt-2 text-ink-soft">{item.text}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function MembershipPlans({ membership }: { membership: Membership }) {
  const p = membership.plans;
  const labels = { perYear: p.perYear, pricePending: p.pricePending, popular: p.popular, choose: p.choose, contact: p.contact };
  const regular = p.items.filter((plan) => !("contactOnly" in plan && plan.contactOnly));
  const special = p.items.filter((plan) => "contactOnly" in plan && plan.contactOnly);
  return (
    <Section tone="white" id="plans">
      <SectionHeading eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />
      <div className="grid gap-6 pt-4 md:grid-cols-3">
        {regular.map((plan, i) => (
          <div key={plan.id} {...reveal(i)}>
            <PlanCard plan={plan} labels={labels} href={`${routes.membership}?plan=${plan.id}#apply`} />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
        {special.map((plan, i) => (
          <div key={plan.id} {...reveal(i)}>
            <PlanCard plan={plan} labels={labels} href={`${routes.membership}?plan=${plan.id}#apply`} className="bg-primary-tint" />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function MembershipSupport({ membership }: { membership: Membership }) {
  const s = membership.support;
  return (
    <section className="relative isolate overflow-hidden bg-primary-deep py-20 text-white sm:py-24">
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-mountain-silhouette" />
      <div className="container-site">
        <figure className="mx-auto max-w-4xl text-center" {...reveal(0, "zoom")}>
          <Quote aria-hidden className="mx-auto size-10 text-cta" />
          <p className="mt-3 text-sm font-semibold text-cta">{s.title}</p>
          <blockquote className="mt-5 font-serif text-2xl leading-relaxed text-white sm:text-3xl">“{s.quote}”</blockquote>
          <p className="mt-6 text-lg text-on-dark-muted">{s.text}</p>
        </figure>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {s.points.map((point, i) => (
            <li key={point} {...reveal(i)} className="flex items-center justify-center gap-2.5 rounded-card border border-white/10 bg-white/[0.06] px-5 py-4 text-center font-semibold backdrop-blur">
              <Heart aria-hidden className="size-4.5 shrink-0 text-cta" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function MembershipSteps({ membership }: { membership: Membership }) {
  const s = membership.steps;
  const icons = [ListChecks, ClipboardList, UserCheck];
  return (
    <Section tone="white" spacing="md">
      <SectionHeading eyebrow={s.eyebrow} title={s.title} />
      <ol className="grid gap-5 md:grid-cols-3">
        {s.items.map((step, i) => {
          const Icon = icons[i] ?? CheckCircle2;
          return (
            <li key={step.title} {...reveal(i)} className="relative rounded-card border border-line bg-surface p-6 shadow-card">
              <span className="absolute right-5 top-4 font-serif text-5xl font-bold text-primary-tint">{i + 1}</span>
              <span className="relative inline-flex size-12 items-center justify-center rounded-2xl bg-cta text-white shadow-cta">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="relative mt-5 text-xl">{step.title}</h3>
              <p className="relative mt-2 text-ink-soft">{step.text}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
