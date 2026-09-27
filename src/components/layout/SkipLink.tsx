import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("common");
  return (
    <a href="#main" className="sr-only z-[100] rounded-lg bg-primary px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
      {t("skipToContent")}
    </a>
  );
}
