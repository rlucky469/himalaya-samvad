import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthAltLink, AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/register">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.register, seoKey: "register", noIndex: true });
}

export default async function RegisterPage({ params }: PageProps<"/[locale]/register">) {
  await initPage(params);
  const t = await getTranslations("auth.register");
  return (
    <AuthCard badge="register" title={t("title")} subtitle={t("subtitle")} footer={<AuthAltLink text={t("haveAccount")} linkText={t("loginLink")} href={routes.login} />}>
      <RegisterForm />
    </AuthCard>
  );
}
