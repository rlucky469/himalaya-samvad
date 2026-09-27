import type { Metadata } from "next";
import { ArrowLeft, KeyRound, UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/forgot-password">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.forgotPassword, seoKey: "forgotPassword", noIndex: true });
}

export default async function ForgotPasswordPage({ params }: PageProps<"/[locale]/forgot-password">) {
  await initPage(params);
  const t = await getTranslations("auth.forgot");
  const linkClass = "font-bold text-primary underline decoration-cta decoration-2 underline-offset-4 hover:text-accent";

  return (
    <AuthCard
      badge="forgot"
      title={t("title")}
      subtitle={t("subtitle")}
      top={
        <Link href={routes.login} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-primary">
          <ArrowLeft aria-hidden className="size-4" />
          {t("back")}
        </Link>
      }
      footer={
        <div className="flex flex-col gap-2 border-t border-line pt-4 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-1.5">
            <KeyRound aria-hidden className="size-4 text-muted" />
            {t("remember")}{" "}
            <Link href={routes.login} className={linkClass}>
              {t("loginLink")}
            </Link>
          </p>
          <p className="inline-flex items-center gap-1.5">
            <UserPlus aria-hidden className="size-4 text-muted" />
            {t("noAccount")}{" "}
            <Link href={routes.register} className={linkClass}>
              {t("registerLink")}
            </Link>
          </p>
        </div>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
