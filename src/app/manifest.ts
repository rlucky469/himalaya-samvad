import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "हिमालय संवाद — Himalaya Samvad",
    short_name: "हिमालय संवाद",
    description: "स्वतंत्र हिंदी मासिक पत्रिका — An independent Hindi monthly on the Himalaya",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f9fb",
    theme_color: "#1b3a6b",
    lang: "hi",
    icons: [
      { src: "/images/brand/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/brand/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
