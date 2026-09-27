import "server-only";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { localeMeta, routing, type AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { media } from "@/lib/media";
import type { Messages } from "@/types/content";

/** Absolute URL of a path in a given locale, e.g. ("/about", "en") → https://…/en/about */
export function localizedUrl(path: string, locale: AppLocale) {
  const localized = getPathname({ href: path, locale });
  return localized === "/" ? siteConfig.url : `${siteConfig.url}${localized}`;
}

/** hreflang map for a path in every locale, plus x-default (Hindi). */
export function languageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[localeMeta[locale].hreflang] = localizedUrl(path, locale);
  languages["x-default"] = localizedUrl(path, routing.defaultLocale);
  return languages;
}

type SeoKey = keyof Messages["seo"];

interface BuildMetadataOptions {
  locale: AppLocale;
  path: string;
  /** Key inside "seo" in the messages JSON — or pass title/description directly */
  seoKey?: SeoKey;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
  /** Use the title as-is, without the "| Himalaya Samvad" suffix */
  absoluteTitle?: boolean;
}

export async function buildMetadata(options: BuildMetadataOptions): Promise<Metadata> {
  const { locale, path, seoKey, image, type = "website", noIndex, publishedTime, absoluteTitle } = options;
  const t = await getTranslations({ locale, namespace: "seo" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  const title = options.title ?? (seoKey ? t(`${seoKey}.title`) : tMeta("defaultTitle"));
  const description = options.description ?? (seoKey ? t(`${seoKey}.description`) : tMeta("defaultDescription"));
  const url = localizedUrl(path, locale);
  const ogImage = image ?? media.brand.ogDefault;
  const otherLocales = routing.locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: tMeta("siteName"),
      locale: localeMeta[locale].ogLocale,
      alternateLocale: otherLocales,
      images: [{ url: ogImage, width: 1200, height: 630, alt: options.imageAlt ?? title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
