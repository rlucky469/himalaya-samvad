import { Check } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/** 1 ✓ ——— 2 ——— 3 progress line for verify / reset. `current` is 0-based. */
export function AuthStepper({ steps, current, label }: { steps: string[]; current: number; label: string }) {
  return (
    <ol aria-label={label} className="flex items-center gap-2 border-b border-line pb-5 sm:gap-3 short:pb-3">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <Fragment key={step}>
            {i > 0 && <li aria-hidden className={cn("h-px flex-1 transition-colors", done || active ? "bg-nature/40" : "bg-line")} />}
            <li aria-current={active ? "step" : undefined} className="flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done && "bg-nature-soft text-nature",
                  active && "bg-cta text-white",
                  !done && !active && "bg-primary-tint text-muted",
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn("text-sm font-semibold", done && "text-nature", active && "text-cta", !done && !active && "text-muted")}>{step}</span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
