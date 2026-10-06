import { BookOpen, LockOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/config/routes";

/** Strip at the top of /privileged-access saying the full issue is open here without login */
export async function PrivilegedNotice() {
  const t = await getTranslations("share");
  return (
    <section className="border-b border-nature/20 bg-nature-soft">
      <div className="container-site flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-nature text-white">
            <LockOpen aria-hidden className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-wide text-nature">{t("badge")}</p>
            <p className="mt-0.5 font-serif text-lg font-bold text-primary">{t("title")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t("text")}</p>
          </div>
        </div>
        <ButtonLink href={routes.privilegedReader} icon={<BookOpen />} iconPosition="start" className="shrink-0">
          {t("readCta")}
        </ButtonLink>
      </div>
    </section>
  );
}
