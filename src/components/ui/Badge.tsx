import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { BadgeTone } from "@/types/content";

const tones: Record<BadgeTone | "soft" | "white", string> = {
  primary: "bg-primary text-white",
  accent: "bg-accent text-white",
  nature: "bg-nature text-white",
  secondary: "bg-secondary text-white",
  cta: "bg-cta text-white",
  soft: "bg-accent-soft text-accent",
  white: "bg-white/15 text-white ring-1 ring-white/25",
};

export function Badge({ children, tone = "primary", className }: { children: ReactNode; tone?: keyof typeof tones; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-tight", tones[tone], className)}>
      {children}
    </span>
  );
}
