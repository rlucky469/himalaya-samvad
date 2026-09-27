import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hi", "en"],
  defaultLocale: "hi",
  // Hindi lives at "/", English at "/en/..."
  localePrefix: "as-needed",
  // Never auto-redirect by browser language: most Indian browsers report en-IN
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

// Used in hreflang, <html lang> and Open Graph
export const localeMeta: Record<AppLocale, { htmlLang: string; hreflang: string; ogLocale: string; label: string; shortLabel: string }> = {
  hi: { htmlLang: "hi", hreflang: "hi-IN", ogLocale: "hi_IN", label: "हिंदी", shortLabel: "हिं" },
  en: { htmlLang: "en", hreflang: "en-IN", ogLocale: "en_IN", label: "English", shortLabel: "EN" },
};
