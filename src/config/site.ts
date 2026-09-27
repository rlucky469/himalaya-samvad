export type SocialNetwork = "facebook" | "instagram" | "youtube" | "x" | "linkedin";

export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.himalayasamvad.in").replace(/\/$/, ""),
  // Slug of the issue shown in the header, home page and reader
  currentIssueSlug: "pratham-ank-october-2026",
  foundingYear: 2026,
  contact: {
    phoneDisplay: "+91 7500 977 977",
    phoneHref: "tel:+917500977977",
    whatsappNumber: "917500977977",
    website: "www.himalayasamvad.in",
    emails: {
      editor: "editor@himalayasamvad.in",
      ads: "ads@himalayasamvad.in",
      subscription: "subscription@himalayasamvad.in",
      info: "info@himalayasamvad.in",
    },
    mapEmbedUrl: "https://www.google.com/maps?q=Dehradun,Uttarakhand,India&z=12&output=embed",
  },
  // Add the real profile URL when an account is created; null shows the "coming soon" state
  social: [
    { id: "facebook", label: "Facebook", url: null },
    { id: "instagram", label: "Instagram", url: null },
    { id: "youtube", label: "YouTube", url: null },
    { id: "x", label: "X (Twitter)", url: null },
    { id: "linkedin", label: "LinkedIn", url: null },
  ] as { id: SocialNetwork; label: string; url: string | null }[],
} as const;

export type ContactEmailKey = keyof typeof siteConfig.contact.emails;
