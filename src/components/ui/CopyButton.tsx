"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          // clipboard blocked — nothing to do
        }
      }}
      aria-label={`${copied ? t("copied") : t("copy")}: ${value}`}
      title={copied ? t("copied") : t("copy")}
      className={cn("inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-tint hover:text-primary", className)}
    >
      {copied ? <Check className="size-4 text-nature" /> : <Copy className="size-4" />}
    </button>
  );
}
