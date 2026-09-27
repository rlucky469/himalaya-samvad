import { Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig, type ContactEmailKey } from "@/config/site";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { CopyButton } from "@/components/ui/CopyButton";
import { whatsappLink } from "@/lib/utils";

/** Side panel next to forms: the relevant email, phone and a WhatsApp shortcut. */
export async function ContactAside({ title, text, email }: { title: string; text: string; email: ContactEmailKey }) {
  const t = await getTranslations("contact.office");
  const tw = await getTranslations("whatsapp");
  const address = siteConfig.contact.emails[email];
  return (
    <aside className="relative overflow-hidden rounded-card bg-primary p-7 text-white shadow-lift">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-mountain-silhouette" />
      <h3 className="relative text-xl text-white">{title}</h3>
      <p className="relative mt-2 text-sm text-on-dark-muted">{text}</p>
      <ul className="relative mt-6 space-y-3">
        <li className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
          <Mail aria-hidden className="size-5 shrink-0 text-cta" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-on-dark-muted">{t("emailLabel")}</p>
            <a href={`mailto:${address}`} className="block truncate font-semibold hover:text-cta">
              {address}
            </a>
          </div>
          <CopyButton value={address} className="text-white/70 hover:bg-white/10 hover:text-white" />
        </li>
        <li className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
          <Phone aria-hidden className="size-5 shrink-0 text-cta" />
          <div>
            <p className="text-xs text-on-dark-muted">{t("phoneLabel")}</p>
            <a href={siteConfig.contact.phoneHref} className="font-semibold hover:text-cta">
              {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </li>
      </ul>
      <a
        href={whatsappLink(siteConfig.contact.whatsappNumber, tw("prefill"))}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-5 flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
      >
        <WhatsappIcon className="size-5" />
        {t("whatsappCta")}
      </a>
    </aside>
  );
}
