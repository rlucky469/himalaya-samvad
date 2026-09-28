import { getMessages, setRequestLocale } from "next-intl/server";
import { TopBar } from "@/components/layout/TopBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SkipLink } from "@/components/layout/SkipLink";
import { buildSearchIndex } from "@/lib/search-index";
import { siteConfig } from "@/config/site";
import type { Messages } from "@/types/content";
import type { AppLocale } from "@/i18n/routing";

export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  // Every layout must set the locale itself to keep pages statically generated
  setRequestLocale((await params).locale as AppLocale);
  const content = (await getMessages()) as Messages;
  const currentIssue = content.issues.items.find((i) => i.slug === siteConfig.currentIssueSlug) ?? content.issues.items[0];

  return (
    <>
      <SkipLink />
      <TopBar issueMonth={`${currentIssue.label} • ${currentIssue.month}`} />
      <SiteHeader searchItems={buildSearchIndex(content)} />
      <main id="main" className="min-h-[60vh] overflow-x-clip">
        {children}
      </main>
      <SiteFooter />
      {/* <WhatsAppButton /> */}
    </>
  );
}
