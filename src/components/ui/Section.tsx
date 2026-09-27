import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Tone = "white" | "canvas" | "mist" | "navy" | "deep";
type Spacing = "none" | "sm" | "md" | "lg";

const tones: Record<Tone, string> = {
  white: "bg-surface",
  canvas: "bg-canvas",
  mist: "bg-mist",
  navy: "bg-primary text-on-dark",
  deep: "bg-primary-deep text-on-dark",
};

const spacings: Record<Spacing, string> = {
  none: "",
  sm: "py-12 sm:py-14",
  md: "py-16 sm:py-20",
  lg: "py-20 sm:py-24 lg:py-28",
};

interface SectionProps extends ComponentProps<"section"> {
  tone?: Tone;
  spacing?: Spacing;
  container?: boolean;
  containerClassName?: string;
}

export function Section({ tone = "white", spacing = "lg", container = true, className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cn("relative", tones[tone], spacings[spacing], className)} {...props}>
      {container ? <div className={cn("container-site", containerClassName)}>{children}</div> : children}
    </section>
  );
}

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("container-site", className)} {...props} />;
}
