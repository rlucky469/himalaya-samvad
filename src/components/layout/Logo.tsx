import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { media } from "@/lib/media";
import { cn } from "@/lib/utils";

interface LogoProps {
  name: string;
  tagline: string;
  tone?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}

/** Emblem from the real logo + a two-tone wordmark (navy first word, red second — as in the logo). */
export function Logo({ name, tagline, tone = "light", size = "md", className, onClick }: LogoProps) {
  const [first, ...rest] = name.split(" ");
  return (
    <Link href={routes.home} onClick={onClick} className={cn("group flex items-center gap-2.5", className)} aria-label={name}>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-105",
          tone === "dark" && "bg-white p-1",
          size === "md" ? "h-11 w-[5.4rem] sm:h-12 sm:w-24" : "h-10 w-20",
        )}
      >
        <Image src={media.brand.emblem} alt="" fill sizes="96px" className="object-contain" priority />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-sans font-bold tracking-tight", size === "md" ? "text-[1.45rem] sm:text-[1.6rem]" : "text-xl")}>
          <span className={tone === "dark" ? "text-white" : "text-primary"}>{first}</span>{" "}
          <span className={tone === "dark" ? "text-cta" : "text-accent"}>{rest.join(" ")}</span>
        </span>
        <span className={cn("mt-1 text-[0.7rem] font-medium tracking-wide sm:text-xs", tone === "dark" ? "text-on-dark-muted" : "text-muted")}>
          {tagline}
        </span>
      </span>
    </Link>
  );
}
