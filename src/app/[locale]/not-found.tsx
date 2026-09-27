import { ArrowRight, BookOpen, MountainSnow } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/config/routes";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main id="main" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-primary-deep px-4 text-center text-white">
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-mountain-silhouette" />
      <div className="max-w-xl">
        <MountainSnow aria-hidden className="mx-auto size-16 animate-float text-cta" />
        <p className="mt-6 font-serif text-8xl font-bold text-white/90">404</p>
        <h1 className="mt-4 text-3xl text-white">{t("title")}</h1>
        <p className="mt-4 text-lg text-on-dark-muted">{t("text")}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={routes.home} icon={<ArrowRight />}>
            {t("home")}
          </ButtonLink>
          <ButtonLink href={routes.currentIssue} variant="outlineLight" icon={<BookOpen />} iconPosition="start">
            {t("issue")}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
