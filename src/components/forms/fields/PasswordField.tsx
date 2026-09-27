"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ComponentProps } from "react";
import { passwordStrength } from "@/lib/validation/schemas";
import { FormField, describedBy, filledInputClasses, inputClasses, type FieldBaseProps } from "./FormField";
import { cn } from "@/lib/utils";

type PasswordFieldProps = FieldBaseProps &
  Omit<ComponentProps<"input">, "id" | "className" | "type"> & {
    showStrength?: boolean;
    value?: string;
    variant?: "outline" | "filled";
  };

// weak · fair · good · strong
const strengthColors = ["bg-accent", "bg-cta", "bg-cta", "bg-nature"];
const strengthText = ["text-accent", "text-cta", "text-cta", "text-nature"];

export function PasswordField({ id, label, required, hint, error, className, showStrength, value = "", variant = "outline", ...props }: PasswordFieldProps) {
  const t = useTranslations("auth.password");
  const [visible, setVisible] = useState(false);
  const filled = variant === "filled";
  const score = passwordStrength(value);
  const labels = t.raw("strength") as string[];

  return (
    <FormField id={id} label={label} required={required} hint={showStrength ? undefined : hint} error={error} className={className}>
      <div className="relative">
        {filled && <Lock aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-[1.1rem] -translate-y-1/2 text-muted" />}
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(filled ? filledInputClasses(!!error) : inputClasses(!!error), "pr-12", filled && "pl-11")}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t("hide") : t("show")}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-primary"
        >
          {visible ? <EyeOff className="size-[1.1rem]" /> : <Eye className="size-[1.1rem]" />}
        </button>
      </div>
      {showStrength && (
        <div aria-live="polite">
          <div className="mt-1.5 flex gap-1.5 short:mt-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", value && i <= score ? strengthColors[score] : "bg-primary-soft")} />
            ))}
          </div>
          <div className="mt-1.5 flex items-start justify-between gap-3 text-xs short:mt-1">
            <span className="shrink-0 text-muted">
              {value ? (
                <>
                  {t("strengthShort")}: <span className={cn("font-bold", strengthText[score])}>{labels[score]}</span>
                </>
              ) : null}
            </span>
            {hint && <span className="text-right text-muted">{hint}</span>}
          </div>
        </div>
      )}
    </FormField>
  );
}
