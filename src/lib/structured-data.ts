import "server-only";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { media } from "@/lib/media";
import { localizedUrl } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import type { Article, Issue, Messages, TeamMember } from "@/types/content";

const abs = (path: string) => `${siteConfig.url}${path}`;
const orgId = `${siteConfig.url}/#organization`;

export function organizationSchema(content: Messages, locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": orgId,
    name: content.meta.siteName,
    alternateName: content.meta.siteNameLatin,
    url: localizedUrl(routes.home, locale),
    logo: abs(media.brand.logo),
    slogan: content.brand.tagline,
    foundingDate: String(siteConfig.foundingYear),
    address: { "@type": "PostalAddress", addressLocality: "Dehradun", addressRegion: "Uttarakhand", addressCountry: "IN" },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "editorial", email: siteConfig.contact.emails.editor, telephone: siteConfig.contact.phoneHref.replace("tel:", "") },
      { "@type": "ContactPoint", contactType: "advertising", email: siteConfig.contact.emails.ads },
      { "@type": "ContactPoint", contactType: "customer support", email: siteConfig.contact.emails.subscription },
    ],
    sameAs: siteConfig.social.map((s) => s.url).filter(Boolean),
  };
}

export function websiteSchema(content: Messages, locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: content.meta.siteName,
    url: localizedUrl(routes.home, locale),
    inLanguage: locale === "hi" ? "hi-IN" : "en-IN",
    publisher: { "@id": orgId },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(item.path, locale),
    })),
  };
}

export function issueSchema(issue: Issue, content: Messages, locale: AppLocale, cover: string) {
  return {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    issueNumber: String(issue.number),
    name: `${issue.label} — ${issue.title}`,
    description: issue.description,
    datePublished: issue.dateISO,
    image: abs(cover),
    url: localizedUrl(routes.issue(issue.slug), locale),
    inLanguage: "hi-IN",
    isPartOf: { "@type": "Periodical", name: content.meta.siteName, publisher: { "@id": orgId } },
  };
}

export function articleSchema(article: Article, issue: Issue | undefined, locale: AppLocale, image: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [abs(image)],
    datePublished: issue?.dateISO,
    author: { "@type": "Person", name: article.author },
    publisher: { "@id": orgId },
    mainEntityOfPage: localizedUrl(routes.article(article.slug), locale),
    isAccessibleForFree: false,
    inLanguage: locale === "hi" ? "hi-IN" : "en-IN",
  };
}

export function teamSchema(members: TeamMember[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: members.map((m, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@type": "Person", name: m.name, jobTitle: m.role, worksFor: { "@id": orgId }, homeLocation: m.city },
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };
}
