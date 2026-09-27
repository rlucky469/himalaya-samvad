"use client";

import { LogIn, LogOut, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

export function AuthLinks({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const t = useTranslations("topBar");
  const { status, user, signOut } = useAuth();
  const linkClass = cn("inline-flex items-center gap-1.5 font-medium transition-colors", tone === "dark" ? "text-white/85 hover:text-cta" : "text-primary hover:text-accent");

  if (status === "loading") return <span className={cn("inline-block h-4 w-24 animate-pulse rounded bg-current opacity-10", className)} aria-hidden />;

  if (status === "authenticated" && user) {
    return (
      <span className={cn("inline-flex items-center gap-3", className)}>
        <span className={cn("inline-flex max-w-40 items-center gap-1.5 truncate", tone === "dark" ? "text-white" : "text-ink")}>
          <UserRound aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">{user.name}</span>
        </span>
        <button type="button" onClick={() => void signOut()} className={linkClass}>
          <LogOut aria-hidden className="size-3.5" />
          {t("logout")}
        </button>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Link href={routes.login} className={linkClass}>
        <LogIn aria-hidden className="size-3.5" />
        {t("login")}
      </Link>
      <span aria-hidden className="opacity-30">|</span>
      <Link href={routes.register} className={linkClass}>
        {t("register")}
      </Link>
    </span>
  );
}
