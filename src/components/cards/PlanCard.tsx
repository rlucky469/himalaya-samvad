import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import type { MembershipPlan } from "@/types/content";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: MembershipPlan;
  labels: { perYear: string; pricePending: string; popular: string; choose: string; contact: string };
  href: string;
  className?: string;
  compact?: boolean;
}

export function PlanCard({ plan, labels, href, className, compact }: PlanCardProps) {
  const featured = "featured" in plan && plan.featured;
  const contactOnly = "contactOnly" in plan && plan.contactOnly;
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-card border bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift sm:p-7",
        featured ? "border-primary shadow-lift ring-2 ring-primary lg:-translate-y-2" : "border-line shadow-card",
        className,
      )}
    >
      {featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow">{labels.popular}</span>
      )}
      <p className={cn("text-xs font-semibold tracking-wide", featured ? "text-accent" : "text-secondary")}>{plan.label}</p>
      <h3 className={cn("mt-1.5", compact ? "text-xl" : "text-2xl")}>{plan.name}</h3>
      {!contactOnly && (
        <p className="mt-4 flex items-baseline gap-1.5">
          <span className="font-serif text-4xl font-bold text-primary">{plan.price || labels.pricePending}</span>
          <span className="text-sm text-muted">{labels.perYear}</span>
        </p>
      )}
      <p className={cn("mb-6 text-[0.95rem] leading-relaxed text-ink-soft", contactOnly ? "mt-4" : "mt-3", compact && "line-clamp-3")}>
        <Check aria-hidden className="mr-1.5 inline size-4 -translate-y-px text-nature" />
        {plan.audience}
      </p>
      <Link href={href} className={buttonClasses(featured ? "primary" : contactOnly ? "outline" : "navy", "md", "mt-auto w-full")}>
        {contactOnly ? labels.contact : labels.choose}
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </article>
  );
}
