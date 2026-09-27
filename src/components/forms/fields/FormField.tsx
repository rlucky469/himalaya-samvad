"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldBaseProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  /** A key from the "validation" namespace (zod messages are keys) */
  error?: string;
  className?: string;
}

/** Label + control + hint + translated error, wired for screen readers. */
export function FormField({ id, label, required, optional, hint, error, className, children }: FieldBaseProps & { children: ReactNode }) {
  const tv = useTranslations("validation");
  const tc = useTranslations("common");
  const message = error ? (tv.has(error as never) ? tv(error as never) : error) : null;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-accent" aria-hidden>*</span>}
        {optional && <span className="ml-1.5 text-xs font-normal text-muted">({tc("optional")})</span>}
      </label>
      {children}
      {message ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-accent">
          {message}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const inputClasses = (invalid?: boolean) =>
  cn(
    "w-full rounded-xl border bg-surface px-4 py-3 text-base text-ink shadow-[inset_0_1px_2px_rgb(14_33_67/0.04)] transition-all duration-200 placeholder:text-muted/70",
    "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft",
    "disabled:cursor-not-allowed disabled:bg-mist",
    invalid ? "border-accent focus:border-accent focus:ring-accent-soft" : "border-line-strong",
  );

/** Soft grey input used on the login/register screens */
export const filledInputClasses = (invalid?: boolean) =>
  cn(
    "w-full rounded-xl border px-4 py-3 text-[0.95rem] text-ink transition-all duration-200 placeholder:text-muted/70 short:py-2.5",
    "focus:bg-surface focus:outline-none focus:ring-4",
    "disabled:cursor-not-allowed disabled:opacity-70",
    invalid
      ? "border-accent/40 bg-accent-soft focus:border-accent focus:ring-accent-soft"
      : "border-transparent bg-primary-tint focus:border-primary focus:ring-primary-soft",
  );

export const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;
