import type { routing } from "@/i18n/routing";

// Locale is strictly typed. Message keys are not: the content JSON contains arrays (articles, team, plans…),
// which next-intl's key typing can't handle. Content shape is typed via src/types/content.ts instead,
// and `npm run i18n:check` keeps hi.json and en.json identical in structure.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
  }
}
