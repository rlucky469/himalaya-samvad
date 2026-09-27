import "server-only";
import { routes } from "@/config/routes";
import type { Messages } from "@/types/content";
import type { SearchItem } from "@/types/search";

/** Small search index sent to the header (titles + one-line descriptions only). */
export function buildSearchIndex(content: Messages): SearchItem[] {
  const { nav, seo } = content;
  const pages: SearchItem[] = [
    { group: "pages", title: nav.home, description: seo.home.description, href: routes.home },
    { group: "pages", title: nav.about, description: seo.about.description, href: routes.about },
    { group: "pages", title: nav.team, description: seo.team.description, href: routes.team },
    { group: "pages", title: nav.currentIssue, description: content.issues.items[0]?.title, href: routes.currentIssue },
    { group: "pages", title: seo.issues.title, description: seo.issues.description, href: routes.issues },
    { group: "pages", title: nav.articles, description: seo.articles.description, href: routes.articles },
    { group: "pages", title: nav.membership, description: seo.membership.description, href: routes.membership },
    { group: "pages", title: nav.advertise, description: seo.advertise.description, href: routes.advertise },
    { group: "pages", title: nav.contact, description: seo.contact.description, href: routes.contact },
  ];
  const topics: SearchItem[] = content.topics.items.map((t) => ({ group: "topics", title: t.title, description: t.short, href: routes.topic(t.slug) }));
  const articles: SearchItem[] = content.articles.items.map((a) => ({ group: "articles", title: a.title, description: a.excerpt, href: routes.article(a.slug) }));
  return [...pages, ...topics, ...articles];
}
