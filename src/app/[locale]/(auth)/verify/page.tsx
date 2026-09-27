import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { VerifyForm } from "@/components/auth/VerifyForm";
import { buildMetadata } from "@/lib/seo";
import { initPage } from "@/lib/page";
import { routes } from "@/config/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]/verify">): Promise<Metadata> {
  const { locale } = await initPage(params);
  return buildMetadata({ locale, path: routes.verify, seoKey: "verify", noIndex: true });
}

export default async function VerifyPage({ params }: PageProps<"/[locale]/verify">) {
  await initPage(params);
  // The form renders its own stepper + heading (they change when verification completes)
  return (
    <AuthCard badge="verify">
      <VerifyForm />
    </AuthCard>
  );
}
