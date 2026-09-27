import Image from "next/image";
import { MapPin, MessageCircle, PenLine, Quote, Scale, Sparkles, UsersRound } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TeamCard } from "@/components/cards/TeamCard";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";
import { teamPhoto } from "@/lib/media";
import type { BadgeTone, Messages, TeamMember } from "@/types/content";

type Team = Messages["team"];
const valueIcons = [UsersRound, Scale, Sparkles];

export function TeamIntro({ team }: { team: Team }) {
  return (
    <Section tone="white" spacing="md">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16" {...reveal(0)}>
        <div>
          <Eyebrow>{team.intro.eyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{team.intro.title}</h2>
        </div>
        <div className="space-y-5 border-l-4 border-accent pl-6 text-lg leading-relaxed text-ink-soft">
          {team.intro.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ChiefEditor({ member, eyebrow, focusLabel }: { member: TeamMember; eyebrow: string; focusLabel: string }) {
  return (
    <Section tone="mist" spacing="md">
      <Eyebrow>{eyebrow}</Eyebrow>
      <article {...reveal(0)} className="mt-6 grid overflow-hidden rounded-panel border border-line bg-surface shadow-lift md:grid-cols-[minmax(260px,0.8fr)_2fr]">
        <div className="relative min-h-80 bg-primary-tint">
          <Image src={teamPhoto(member.id)} alt={member.name} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-primary via-cta to-accent" />
        </div>
        <div className="p-7 sm:p-10">
          <Badge tone={member.badge as BadgeTone}>{member.role}</Badge>
          <h3 className="mt-4 text-3xl sm:text-4xl">{member.name}</h3>
          <p className="mt-2 inline-flex items-center gap-1.5 text-muted">
            <MapPin aria-hidden className="size-4" />
            {member.city}
          </p>
          <div className="relative mt-6">
            <Quote aria-hidden className="absolute -left-1 -top-2 size-8 text-accent/15" />
            <p className="relative text-lg leading-relaxed text-ink-soft">{member.bio}</p>
          </div>
          <div className="mt-7 border-t border-line pt-5">
            <p className="mb-3 text-sm font-semibold text-ink">{focusLabel}</p>
            <ul className="flex flex-wrap gap-2">
              {member.focus.map((f) => (
                <li key={f} className="rounded-full bg-primary-tint px-3 py-1.5 text-sm font-medium text-primary">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </Section>
  );
}

export function BoardGrid({ team, members }: { team: Team; members: TeamMember[] }) {
  return (
    <Section tone="white">
      <SectionHeading eyebrow={team.boardEyebrow} title={team.boardTitle} subtitle={team.boardSubtitle} />
      {/* flex-wrap keeps the last row centred whatever the number of members */}
      <div className="flex flex-wrap justify-center gap-5">
        {members.map((member, i) => (
          <div key={member.id} {...reveal(i)} className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]">
            <TeamCard member={member} showFocus fullBio focusLabel={team.focusLabel} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function TeamValues({ team }: { team: Team }) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-deep py-20 text-white sm:py-24">
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-mountain-silhouette" />
      <div className="container-site">
        <SectionHeading eyebrow={team.values.eyebrow} title={team.values.title} tone="dark" align="center" />
        <div className="grid gap-5 md:grid-cols-3">
          {team.values.items.map((item, i) => {
            const Icon = valueIcons[i] ?? Sparkles;
            return (
              <div key={item.title} {...reveal(i)} className="rounded-card border border-white/10 bg-white/[0.06] p-7 text-center backdrop-blur transition-colors hover:bg-white/10">
                <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-cta/15 text-cta">
                  <Icon aria-hidden className="size-6" />
                </span>
                <h3 className="mt-5 text-xl text-white">{item.title}</h3>
                <p className="mt-2 text-on-dark-muted">{item.text}</p>
              </div>
            );
          })}
        </div>
        <p {...reveal(1)} className="mx-auto mt-12 max-w-3xl text-center text-lg leading-relaxed text-on-dark-muted">
          {team.closing}
        </p>
      </div>
    </section>
  );
}

export function TeamCta({ team }: { team: Team }) {
  return (
    <Section tone="white" spacing="md">
      <div {...reveal(0, "zoom")} className="relative mx-auto max-w-4xl overflow-hidden rounded-panel border border-line bg-surface p-8 text-center shadow-lift sm:p-12">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-cta to-accent" />
        <h2 className="text-2xl sm:text-3xl">{team.cta.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">{team.cta.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={routes.contactForm} icon={<PenLine />} iconPosition="start">
            {team.cta.primary}
          </ButtonLink>
          <ButtonLink href={routes.contact} variant="outline" icon={<MessageCircle />} iconPosition="start">
            {team.cta.secondary}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
