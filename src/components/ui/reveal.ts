import type { CSSProperties } from "react";

type RevealVariant = "up" | "fade" | "left" | "right" | "zoom";

/**
 * Props for the scroll-reveal animation (see RevealObserver + globals.css).
 * Content stays visible if JavaScript is off, which keeps it crawlable.
 */
export function reveal(index = 0, variant: RevealVariant = "up", step = 90) {
  return {
    "data-reveal": variant === "up" ? "" : variant,
    style: { "--reveal-delay": `${Math.min(index, 8) * step}ms` } as CSSProperties,
  };
}
