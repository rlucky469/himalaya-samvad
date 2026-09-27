import "@/styles/fonts";
import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { localeMeta, routing, type AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { AuthProvider } from "@/providers/AuthProvider";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { pick } from "@/lib/utils";
import type { Messages } from "@/types/content";

// Only these namespaces are sent to the browser; page content stays on the server
const CLIENT_NAMESPACES = ["common", "brand", "nav", "topBar", "footer", "search", "whatsapp", "forms", "validation", "auth", "reader", "errorPage"] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as AppLocale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
    description: t("defaultDescription"),
    keywords: t.raw("keywords") as string[],
    applicationName: t("siteName"),
    authors: [{ name: t("siteName") }],
    creator: t("siteName"),
    publisher: t("siteName"),
    formatDetection: { telephone: false, email: false, address: false },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: "#1b3a6b",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = (await getMessages()) as Messages;

  return (
    <html lang={localeMeta[locale].htmlLang} dir="ltr">
      <body>
        <NextIntlClientProvider messages={pick(messages, CLIENT_NAMESPACES)}>
          <AuthProvider>
            {children}
            <RevealObserver />
          </AuthProvider>
        </NextIntlClientProvider>
        <JsonLd data={[organizationSchema(messages, locale), websiteSchema(messages, locale)]} />
      </body>
    </html>
  );
}