"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "@/components/ui/Button";

export function SubmitButton({ loading, loadingLabel, children, icon, variant = "primary", className, disabled }: { loading: boolean; loadingLabel: string; children: ReactNode; icon?: ReactNode; variant?: ButtonVariant; className?: string; disabled?: boolean }) {
  return (
    <Button type="submit" variant={variant} size="lg" disabled={loading || disabled} aria-busy={loading} className={className} icon={loading ? <Loader2 className="animate-spin" /> : icon}>
      {loading ? loadingLabel : children}
    </Button>
  );
}
