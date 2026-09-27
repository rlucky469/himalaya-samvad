import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { whatsappLink } from "@/lib/utils";

export async function WhatsAppButton() {
  const t = await getTranslations("whatsapp");
  return (
    <a
      href={whatsappLink(siteConfig.contact.whatsappNumber, t("prefill"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      title={t("label")}
      className="fixed bottom-5 right-5 z-40 inline-flex size-14 animate-pulse-ring items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-300 hover:scale-110 sm:bottom-6 sm:right-6"
    >
      <WhatsappIcon className="size-7" />
    </a>
  );
}
