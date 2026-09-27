import media from "@/content/media.json";

/**
 * Single registry of every image on the site (src/content/media.json).
 * To replace an image: drop the new file into /public/images with the same name,
 * or change its path in media.json.
 */
export { media };

type PageHeroKey = keyof typeof media.pageHeroes;

const lookup = (map: Record<string, string>, key: string, fallback: string) => map[key] ?? fallback;

export const articleImage = (slug: string) => lookup(media.articles, slug, media.fallbacks.article);
export const topicImage = (slug: string) => lookup(media.topics, slug, media.fallbacks.article);
export const teamPhoto = (id: string) => lookup(media.team, id, media.fallbacks.portrait);
export const pageHero = (key: PageHeroKey) => media.pageHeroes[key] ?? media.pageHeroes.default;
export const issueCover = (slug: string) =>
  (media.issues as Record<string, { cover: string }>)[slug]?.cover ?? media.fallbacks.cover;
