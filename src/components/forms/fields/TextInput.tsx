"use client";

import { AlertCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { FormField, describedBy, filledInputClasses, inputClasses, type FieldBaseProps } from "./FormField";
import { cn } from "@/lib/utils";

type TextInputProps = FieldBaseProps &
  Omit<ComponentProps<"input">, "id" | "className" | "prefix"> & {
    inputClassName?: string;
    /** Fixed text before the input, e.g. "+91" */
    prefix?: string;
    /** Icon shown inside the input on the left */
    icon?: ReactNode;
    variant?: "outline" | "filled";
  };

export function TextInput({ id, label, required, optional, hint, error, className, inputClassName, prefix, icon, variant = "outline", ...inputProps }: TextInputProps) {
  const filled = variant === "filled";
  const input = (
    <div className="relative min-w-0 flex-1">
      {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted [&>svg]:size-[1.1rem]">{icon}</span>}
      <input
        id={id}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(filled ? filledInputClasses(!!error) : inputClasses(!!error), icon && "pl-11", filled && error && "pr-11", prefix && "rounded-l-none", inputClassName)}
        {...inputProps}
      />
      {filled && error && <AlertCircle aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-accent" />}
    </div>
  );

  return (
    <FormField id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      {prefix ? (
        <div className="flex">
          <span
            className={cn(
              "inline-flex items-center rounded-l-xl px-3.5 text-sm font-bold",
              filled ? "bg-primary-soft text-primary" : "border border-r-0 border-line-strong bg-mist text-ink-soft",
            )}
          >
            {prefix}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
    </FormField>
  );
}
