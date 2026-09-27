import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/reset-password">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.resetPassword, seoKey: "resetPassword", noIndex: true });
}

export default async function ResetPasswordPage({ params }: PageProps<"/[locale]/reset-password">) {
  await initPage(params);
  // The form renders its own stepper + heading (they change after a successful reset)
  return (
    <AuthCard badge="reset">
      <ResetPasswordForm />
    </AuthCard>
  );
}
