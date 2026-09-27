import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { env } from "@/config/env";
import { routes } from "@/config/routes";
import { AuthPanel, type AuthBadge } from "./AuthPanel";
import { AuthHeading } from "./AuthHeading";

interface AuthCardProps {
  badge: AuthBadge;
  /** Omit when the form renders its own heading (verify / reset show a stepper above it) */
  title?: string;
  subtitle?: ReactNode;
  /** Shown above the heading, e.g. a "back to login" link */
  top?: ReactNode;
  children: ReactNode;
  /** Shown under the form, e.g. "New here? Create an account" */
  footer?: ReactNode;
}

/**
 * Two-column auth card: navy brand panel + form. On desktop it fits the viewport,
 * so the page itself never scrolls (the form column scrolls only on very short screens).
 */
export async function AuthCard({ badge, title, subtitle, top, children, footer }: AuthCardProps) {
  const t = await getTranslations("auth");
  const tf = await getTranslations("footer");

  return (
    <div className="grid w-full max-w-[1120px] overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-lift  lg:grid-cols-[0.82fr_1fr]">
      <AuthPanel badge={badge} />

      <section className="flex min-h-0 flex-col">
        <div className="flex min-h-0 flex-1 flex-col  px-5 py-8 sm:px-10 lg:px-12 lg:py-7 short:py-4">
          <div className="mx-auto my-auto w-full max-w-[480px]">
            {top && <div className="mb-5 short:mb-3">{top}</div>}
            {title && <AuthHeading title={title} subtitle={subtitle} />}
            <div className={title ? "mt-6 short:mt-4" : undefined}>{children}</div>
            {footer && <div className="mt-5 short:mt-3">{footer}</div>}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-t border-line px-5 py-3 text-xs text-muted sm:px-10 lg:px-12 short:py-2">
          {/* {env.useMockApi && <span className="w-full rounded-md bg-cta-soft px-2 py-1 font-medium text-ink-soft sm:mr-auto sm:w-auto">{t("mockNotice")}</span>} */}
          <span className={env.useMockApi ? "hidden" : "ml-auto"} />
          {/* <Link href={routes.privacy} className="whitespace-nowrap hover:text-primary">
            {tf("privacy")}
          </Link>
          <span aria-hidden>•</span>
          <Link href={routes.terms} className="whitespace-nowrap hover:text-primary">
            {tf("terms")}
          </Link> */}
        </div>
      </section>
    </div>
  );
}

/** Light box used under login/register for the "other action" link. */
export function AuthAltLink({ text, linkText, href }: { text: string; linkText: string; href: string }) {
  return (
    <p className="rounded-xl bg-primary-tint px-4 py-3 text-center text-sm text-ink-soft short:py-2">
      {text}{" "}
      <Link href={href} className="font-bold text-primary underline decoration-cta decoration-2 underline-offset-4 hover:text-accent">
        {linkText}
      </Link>
    </p>
  );
}
