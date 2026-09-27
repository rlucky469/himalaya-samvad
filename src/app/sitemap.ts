import type { MetadataRoute } from "next";
import { routes, staticSitemapRoutes } from "@/config/routes";
import { routing } from "@/i18n/routing";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import hi from "@messages/hi.json";

// Every public page in both languages, with hreflang alternates
export default function sitemap(): MetadataRoute.Sitemap {
  const issueDate = new Date(hi.issues.items[0]?.dateISO ?? Date.now());
  const paths: { path: string; priority: number; lastModified?: Date }[] = [
    ...staticSitemapRoutes.map((path) => ({ path, priority: path === routes.home ? 1 : 0.7 })),
    ...hi.issues.items.map((i) => ({ path: routes.issue(i.slug), priority: 0.9, lastModified: new Date(i.dateISO) })),
    ...hi.articles.items.map((a) => ({ path: routes.article(a.slug), priority: 0.8, lastModified: issueDate })),
    ...hi.topics.items.map((t) => ({ path: routes.topic(t.slug), priority: 0.6 })),
  ];

  return paths.flatMap(({ path, priority, lastModified }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(path, locale),
      lastModified: lastModified ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === routing.defaultLocale ? priority : Math.max(0.1, priority - 0.1),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
