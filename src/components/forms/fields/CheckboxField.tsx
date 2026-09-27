"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CheckboxFieldProps = Omit<ComponentProps<"input">, "type" | "children"> & { id: string; label: ReactNode; error?: string };

export function CheckboxField({ id, label, error, className, ...props }: CheckboxFieldProps) {
  const tv = useTranslations("validation");
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
        <input
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-4.5 shrink-0 cursor-pointer rounded border-line-strong accent-primary"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="pl-7.5 text-sm font-medium text-accent">
          {tv.has(error as never) ? tv(error as never) : error}
        </p>
      )}
    </div>
  );
}
