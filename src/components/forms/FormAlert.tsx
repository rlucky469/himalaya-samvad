"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = {
  error: { box: "border-accent/30 bg-accent-soft text-accent-dark", Icon: AlertCircle },
  success: { box: "border-nature/30 bg-nature-soft text-nature", Icon: CheckCircle2 },
  info: { box: "border-cta/30 bg-cta-soft text-ink-soft", Icon: Info },
};

export function FormAlert({ tone = "error", children, className }: { tone?: keyof typeof styles; children: ReactNode; className?: string }) {
  const { box, Icon } = styles[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium", box, className)}>
      <Icon aria-hidden className="mt-0.5 size-4.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
