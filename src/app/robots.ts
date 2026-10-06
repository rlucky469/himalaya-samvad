import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["/api/", "/login", "/register", "/verify", "/forgot-password", "/reset-password", "/issues/*/read", "/shared/"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [...privatePaths, ...privatePaths.map((p) => `/en${p}`)] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
