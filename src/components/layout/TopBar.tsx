import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AuthLinks } from "./AuthLinks";

/** Thin strip above the header (desktop only): current issue, location, language and login. */
export async function TopBar({ issueMonth }: { issueMonth: string }) {
  const t = await getTranslations("topBar");
  return (
    <div className="hidden border-b border-line bg-primary-tint text-[0.8rem] text-ink-soft lg:block">
      <div className="container-site flex h-10 items-center justify-between gap-6">
        <p className="flex items-center gap-2">
          <span className="font-semibold text-primary">{issueMonth}</span>
          <span aria-hidden className="text-line-strong">|</span>
          <span>{t("descriptor")}</span>
        </p>
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5 text-accent" />
            {t("location")}
          </span>
          <AuthLinks />
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
