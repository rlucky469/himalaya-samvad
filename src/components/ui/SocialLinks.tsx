import { siteConfig } from "@/config/site";
import { socialIcons } from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  comingSoonLabel: string;
  tone?: "light" | "dark";
  className?: string;
}

/** Social profiles from siteConfig. Networks without a URL render as disabled "coming soon" icons. */
export function SocialLinks({ comingSoonLabel, tone = "dark", className }: SocialLinksProps) {
  const itemClass = cn(
    "inline-flex size-11 items-center justify-center rounded-xl transition-all duration-300",
    tone === "dark" ? "bg-white/10 text-white" : "bg-primary-tint text-primary",
  );
  return (
    <ul className={cn("flex flex-wrap gap-2.5", className)}>
      {siteConfig.social.map(({ id, label, url }) => {
        const Icon = socialIcons[id];
        return (
          <li key={id}>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn(itemClass, tone === "dark" ? "hover:bg-cta" : "hover:bg-primary hover:text-white", "hover:-translate-y-0.5")}
              >
                <Icon className="size-5" />
              </a>
            ) : (
              <span aria-label={`${label} — ${comingSoonLabel}`} title={comingSoonLabel} className={cn(itemClass, "cursor-not-allowed opacity-60")}>
                <Icon className="size-5" />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
