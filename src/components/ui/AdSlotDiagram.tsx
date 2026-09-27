import { cn } from "@/lib/utils";

type Placement = "full" | "bottom" | "right" | "bottom-right";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 12;

/** A4 page sketch that highlights where an ad of a given size sits (drawn to scale). */
export function AdSlotDiagram({ widthMm, heightMm, placement, highlight = "cta", className }: { widthMm: number; heightMm: number; placement: string; highlight?: "cta" | "accent"; className?: string }) {
  const place = placement as Placement;
  const full = place === "full";
  const w = full ? PAGE_W : widthMm;
  const h = full ? PAGE_H : heightMm;
  const x = full ? 0 : place === "bottom" ? (PAGE_W - w) / 2 : PAGE_W - w - MARGIN;
  const y = full ? 0 : place === "right" ? (PAGE_H - h) / 2 : PAGE_H - h - MARGIN;
  const fill = highlight === "accent" ? "var(--color-accent)" : "var(--color-cta)";

  return (
    <svg viewBox={`-4 -4 ${PAGE_W + 8} ${PAGE_H + 8}`} className={cn("h-auto w-full", className)} role="img" aria-label={`${widthMm} × ${heightMm} mm`}>
      <rect x="0" y="0" width={PAGE_W} height={PAGE_H} rx="4" fill="var(--color-surface)" stroke="var(--color-line-strong)" strokeWidth="2" />
      {!full &&
        Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={MARGIN} y={MARGIN + 6 + i * 20} width={i % 3 === 2 ? 110 : 186} height="6" rx="3" fill="var(--color-mist)" />
        ))}
      <rect x={x} y={y} width={w} height={h} rx={full ? 4 : 3} fill={fill} fillOpacity="0.22" stroke={fill} strokeWidth="2.5" strokeDasharray={full ? "0" : "6 4"} />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="700" fill={fill} fontFamily="var(--font-sans)">
        {widthMm}×{heightMm}
      </text>
    </svg>
  );
}
