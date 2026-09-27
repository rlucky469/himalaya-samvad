"use client";

import type { ComponentProps } from "react";
import { FormField, describedBy, inputClasses, type FieldBaseProps } from "./FormField";

export function TextArea({ id, label, required, optional, hint, error, className, rows = 5, ...props }: FieldBaseProps & Omit<ComponentProps<"textarea">, "id" | "className">) {
  return (
    <FormField id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, error, hint)}
        className={inputClasses(!!error) + " resize-y leading-relaxed"}
        {...props}
      />
    </FormField>
  );
}
