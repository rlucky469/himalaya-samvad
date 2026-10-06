import { siteConfig } from "./site";

// Every internal URL lives here, so a route rename is a one-line change
export const routes = {
  home: "/",
  about: "/about",
  team: "/editorial-board",
  issues: "/issues",
  issue: (slug: string) => `/issues/${slug}`,
  reader: (slug: string) => `/issues/${slug}/read`,
  // Private share links: full issue without login, only for people who have the link
  shared: (token: string) => `/shared/${token}`,
  sharedReader: (token: string) => `/shared/${token}/read`,
  currentIssue: `/issues/${siteConfig.currentIssueSlug}`,
  currentIssueReader: `/issues/${siteConfig.currentIssueSlug}/read`,
  articles: "/articles",
  article: (slug: string) => `/articles/${slug}`,
  topic: (slug: string) => `/topics/${slug}`,
  membership: "/membership",
  membershipApply: "/membership#apply",
  advertise: "/advertise",
  advertiseEnquiry: "/advertise#enquiry",
  contact: "/contact",
  contactForm: "/contact?subject=article#message",
  login: "/login",
  register: "/register",
  verify: "/verify",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  privacy: "/privacy-policy",
  terms: "/terms",
} as const;

export type NavKey = "home" | "about" | "team" | "currentIssue" | "membership" | "advertise" | "contact";

export const mainNav: { key: NavKey; href: string }[] = [
  { key: "home", href: routes.home },
  { key: "about", href: routes.about },
  { key: "team", href: routes.team },
  { key: "currentIssue", href: routes.currentIssue },
  { key: "membership", href: routes.membership },
  { key: "advertise", href: routes.advertise },
  { key: "contact", href: routes.contact },
];

// Static pages included in the sitemap
export const staticSitemapRoutes = [
  routes.home,
  routes.about,
  routes.team,
  routes.issues,
  routes.articles,
  routes.membership,
  routes.advertise,
  routes.contact,
  routes.privacy,
  routes.terms,
];
