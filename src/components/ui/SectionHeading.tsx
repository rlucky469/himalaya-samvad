import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  action?: ReactNode;
  className?: string;
  id?: string;
}

export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "mb-3 flex items-center gap-2.5 text-sm font-semibold tracking-wide",
        tone === "light" ? "text-accent" : "text-cta",
        className,
      )}
    >
      <span aria-hidden className={cn("h-0.5 w-6 rounded-full", tone === "light" ? "bg-accent" : "bg-cta")} />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left", tone = "light", as: Tag = "h2", action, className, id }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      data-reveal
      className={cn("mb-10 flex flex-col gap-6 sm:mb-14", action && !centered && "lg:flex-row lg:items-end lg:justify-between", className)}
    >
      <div className={cn("max-w-3xl", centered && "mx-auto text-center [&>p:first-child]:justify-center")}>
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <Tag
          id={id}
          className={cn(
            "text-[1.75rem] leading-tight sm:text-4xl lg:text-[2.6rem]",
            tone === "dark" ? "text-white" : "text-primary",
          )}
        >
          {title}
        </Tag>
        {subtitle && (
          <p className={cn("mt-4 text-base sm:text-lg", tone === "dark" ? "text-on-dark-muted" : "text-muted")}>{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
