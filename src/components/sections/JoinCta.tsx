import { PenLine, UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { reveal } from "@/components/ui/reveal";
import { routes } from "@/config/routes";

/** Navy "be part of the conversation" band with a mountain silhouette — shared by several pages. */
export async function JoinCta() {
  const t = await getTranslations("home.join");
  return (
    <section className="relative isolate overflow-hidden bg-primary py-20 text-center text-white sm:py-24">
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-mountain-silhouette" />
      <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-secondary/30 blur-3xl" />
      <div className="container-site max-w-3xl" {...reveal(0, "zoom")}>
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/10 text-cta ring-1 ring-white/20">
          <PenLine className="size-6" />
        </span>
        <h2 className="mt-6 text-3xl text-white sm:text-5xl">{t("title")}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-on-dark-muted">{t("text")}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={routes.contactForm} variant="light" size="lg" icon={<PenLine />} iconPosition="start">
            {t("writeCta")}
          </ButtonLink>
          <ButtonLink href={routes.membershipApply} size="lg" icon={<UserPlus />} iconPosition="start">
            {t("subscribeCta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
