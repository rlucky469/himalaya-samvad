import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { teamPhoto } from "@/lib/media";
import type { BadgeTone, TeamMember } from "@/types/content";
import { cn } from "@/lib/utils";

export function TeamCard({ member, showFocus = false, fullBio = false, focusLabel, className }: { member: TeamMember; showFocus?: boolean; fullBio?: boolean; focusLabel?: string; className?: string }) {
  return (
    <article className={cn("group flex h-full flex-col items-center rounded-card border border-line bg-surface p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift", className)}>
      <div className="relative">
        <span aria-hidden className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-cta via-accent to-primary opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-60" />
        <span className="relative block size-28 overflow-hidden rounded-full ring-4 ring-white">
          <Image src={teamPhoto(member.id)} alt={member.name} fill sizes="112px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
        </span>
      </div>
      <Badge tone={member.badge as BadgeTone} className="mt-5">
        {member.role}
      </Badge>
      <h3 className="mt-3 text-xl">{member.name}</h3>
      <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted">
        <MapPin aria-hidden className="size-3.5" />
        {member.city}
      </p>
      <p className={cn("mt-3 text-sm leading-relaxed text-ink-soft", !fullBio && "line-clamp-4")}>{member.bio}</p>
      {showFocus && (
        <div className="mt-auto w-full pt-5">
          {focusLabel && <p className="sr-only">{focusLabel}</p>}
          <ul className="flex flex-wrap justify-center gap-1.5">
            {member.focus.map((f) => (
              <li key={f} className="rounded-full bg-primary-tint px-2.5 py-1 text-xs font-medium text-primary">
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
