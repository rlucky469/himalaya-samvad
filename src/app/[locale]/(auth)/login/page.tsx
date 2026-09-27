import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AuthAltLink, AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.login, seoKey: "login", noIndex: true });
}

export default async function LoginPage({ params }: PageProps<"/[locale]/login">) {
  await initPage(params);
  const t = await getTranslations("auth.login");
  return (
    <AuthCard badge="login" title={t("title")} subtitle={t("subtitle")} footer={<AuthAltLink text={t("noAccount")} linkText={t("registerLink")} href={routes.register} />}>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-card bg-mist" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
