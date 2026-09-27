"use client";

import { FileText, Paperclip, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { FormField, type FieldBaseProps } from "./FormField";
import { cn } from "@/lib/utils";

type FileFieldProps = FieldBaseProps & {
  accept: string;
  value: File | null | undefined;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
};

const formatSize = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`);

export function FileField({ id, label, optional, hint, error, className, accept, value, onChange, onBlur }: FileFieldProps) {
  const t = useTranslations("forms.fields");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField id={id} label={label} optional={optional} hint={hint} error={error} className={className}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        onBlur={onBlur}
      />
      {value ? (
        <div className={cn("flex items-center gap-3 rounded-xl border bg-primary-tint px-4 py-3", error ? "border-accent" : "border-primary-soft")}>
          <FileText aria-hidden className="size-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary">{value.name}</p>
            <p className="text-xs text-muted">{formatSize(value.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label={t("attachmentRemove")}
            className="rounded-lg p-1.5 text-muted hover:bg-white hover:text-accent"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary-tint",
            error ? "border-accent" : "border-line-strong",
          )}
        >
          <Paperclip aria-hidden className="size-5 text-secondary" />
          <span className="text-sm font-semibold text-primary">{t("attachmentButton")}</span>
          <span className="text-xs text-muted">{t("attachmentHint")}</span>
        </label>
      )}
    </FormField>
  );
}
