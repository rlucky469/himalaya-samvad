import { Globe, Mail, MapPin, Megaphone, MessageSquareText, Newspaper, PenLine, Phone, UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { CopyButton } from "@/components/ui/CopyButton";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { reveal } from "@/components/ui/reveal";
import { siteConfig, type ContactEmailKey } from "@/config/site";
import { whatsappLink } from "@/lib/utils";
import type { Messages } from "@/types/content";

type Contact = Messages["contact"];
const cardIcons: Record<string, typeof Mail> = { editor: PenLine, ads: Megaphone, subscription: UserPlus, info: MessageSquareText };

export function ContactIntro({ contact }: { contact: Contact }) {
  return (
    <Section tone="white" spacing="md">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16" {...reveal(0)}>
        <div>
          <Eyebrow>{contact.intro.eyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{contact.intro.title}</h2>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
          {contact.intro.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {contact.cards.map((card, i) => {
          const Icon = cardIcons[card.id] ?? Mail;
          const email = siteConfig.contact.emails[card.id as ContactEmailKey];
          return (
            <li key={card.id} {...reveal(i)} className="group flex flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-soft hover:shadow-lift">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-tint text-primary transition-colors group-hover:bg-cta group-hover:text-white">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="mt-5 text-xl">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{card.text}</p>
              <div className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-mist px-3 py-2">
                <a href={`mailto:${email}`} className="truncate text-sm font-semibold text-primary hover:text-accent">
                  {email}
                </a>
                <CopyButton value={email} />
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export async function OfficeCard({ contact, location }: { contact: Contact; location: string }) {
  const tw = await getTranslations("whatsapp");
  const o = contact.office;
  const rows = [
    { Icon: MapPin, label: o.locationLabel, value: location },
    { Icon: Phone, label: o.phoneLabel, value: siteConfig.contact.phoneDisplay, href: siteConfig.contact.phoneHref },
    { Icon: Mail, label: o.emailLabel, value: siteConfig.contact.emails.info, href: `mailto:${siteConfig.contact.emails.info}` },
    { Icon: Globe, label: o.websiteLabel, value: siteConfig.contact.website, href: siteConfig.url },
  ];
  return (
    <aside className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
      <div className="bg-primary p-6 text-white sm:p-7">
        <p className="text-sm font-semibold text-cta">{o.eyebrow}</p>
        <h3 className="mt-1 text-2xl text-white">{o.title}</h3>
        <p className="text-sm text-on-dark-muted">{o.type}</p>
      </div>
      <ul className="space-y-1 p-4 sm:p-5">
        {rows.map(({ Icon, label, value, href }) => (
          <li key={label} className="flex items-start gap-3 rounded-xl px-2 py-2.5">
            <Icon aria-hidden className="mt-1 size-5 shrink-0 text-cta" />
            <div className="min-w-0">
              <p className="text-xs text-muted">{label}</p>
              {href ? (
                <a href={href} className="break-all font-semibold text-primary hover:text-accent">
                  {value}
                </a>
              ) : (
                <p className="font-semibold text-primary">{value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="px-5 pb-5">
        <a
          href={whatsappLink(siteConfig.contact.whatsappNumber, tw("prefill"))}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <WhatsappIcon className="size-5" />
          {o.whatsappCta}
        </a>
      </div>
      <div className="relative aspect-[4/3] border-t border-line bg-mist">
        <iframe
          title={o.mapTitle}
          src={siteConfig.contact.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0 grayscale-[30%]"
        />
      </div>
    </aside>
  );
}

export function Submissions({ contact }: { contact: Contact }) {
  const s = contact.submissions;
  const email = siteConfig.contact.emails.editor;
  const [before, after] = s.note.split("{email}");
  return (
    <Section tone="mist" spacing="md">
      <div {...reveal(0)} className="rounded-panel border border-line bg-surface p-7 shadow-card sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <h2 className="text-3xl">{s.title}</h2>
            <p className="mt-4 text-lg text-ink-soft">{s.text}</p>
          </div>
          <div className="space-y-6">
            <div>
              <p className="mb-3 font-semibold text-ink">{s.formatsTitle}</p>
              <ul className="flex flex-wrap gap-2">
                {s.formats.map((f) => (
                  <li key={f} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                    <Newspaper aria-hidden className="size-4 text-cta" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-ink">{s.topicsTitle}</p>
              <ul className="flex flex-wrap gap-2">
                {s.topics.map((topic) => (
                  <li key={topic} className="rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-sm text-ink-soft">
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
            <p className="flex items-center gap-3 rounded-xl border border-cta/30 bg-cta-soft px-4 py-3 text-ink-soft">
              <PenLine aria-hidden className="size-5 shrink-0 text-cta" />
              <span>
                {before}
                <a href={`mailto:${email}`} className="font-semibold text-primary underline decoration-cta underline-offset-4">
                  {email}
                </a>
                {after}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function SocialSection({ contact, comingSoon }: { contact: Contact; comingSoon: string }) {
  return (
    <Section tone="white" spacing="sm">
      <div {...reveal(0)} className="flex flex-col items-start justify-between gap-6 rounded-card border border-line bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:p-8">
        <div>
          <Eyebrow>{contact.social.eyebrow}</Eyebrow>
          <h2 className="text-2xl">{contact.social.title}</h2>
          <p className="mt-2 max-w-xl text-ink-soft">{contact.social.text}</p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <SocialLinks tone="light" comingSoonLabel={comingSoon} />
          <p className="text-xs text-muted">({comingSoon})</p>
        </div>
      </div>
    </Section>
  );
}

export function ContactClosing({ contact, closingLines, tagline }: { contact: Contact; closingLines: string[]; tagline: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-primary py-20 text-center text-white sm:py-24">
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-mountain-silhouette" />
      <div className="container-site max-w-3xl" {...reveal(0, "zoom")}>
        <span aria-hidden className="mx-auto block h-1 w-14 rounded-full bg-cta" />
        <h2 className="mt-6 text-3xl text-white sm:text-4xl">{contact.closing.title}</h2>
        {contact.closing.paragraphs.map((p) => (
          <p key={p} className="mt-5 text-lg text-on-dark-muted">
            {p}
          </p>
        ))}
        <p className="mt-8 font-serif text-xl font-semibold text-white sm:text-2xl">{closingLines.join(" ")}</p>
        <p className="mt-2 text-sm font-semibold tracking-wider text-cta">{tagline}</p>
      </div>
    </section>
  );
}
