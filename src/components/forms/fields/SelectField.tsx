"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { FormField, describedBy, inputClasses, type FieldBaseProps } from "./FormField";

export interface SelectOption {
  value: string;
  label: string;
}

type SelectFieldProps = FieldBaseProps & Omit<ComponentProps<"select">, "id" | "className"> & { options: SelectOption[]; placeholder: string };

export function SelectField({ id, label, required, optional, hint, error, className, options, placeholder, ...props }: SelectFieldProps) {
  return (
    <FormField id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={describedBy(id, error, hint)}
          className={inputClasses(!!error) + " appearance-none pr-10"}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
      </div>
    </FormField>
  );
}
