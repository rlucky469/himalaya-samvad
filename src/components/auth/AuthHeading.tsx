import type { ReactNode } from "react";

/** "Title •" heading used on every auth screen. */
export function AuthHeading({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <div>
      <h1 className="text-[1.85rem] leading-tight sm:text-[2.1rem] short:text-[1.65rem]">
        {title}
        <span aria-hidden className="ml-1.5 inline-block size-2.5 rounded-full bg-cta align-middle" />
      </h1>
      {subtitle && <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft short:mt-1 short:text-sm">{subtitle}</p>}
    </div>
  );
}
