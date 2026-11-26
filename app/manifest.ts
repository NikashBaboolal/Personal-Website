import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | Process Engineer`,
    short_name: "Nikash",
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: siteConfig.themeColor,
    background_color: siteConfig.themeColor,
    lang: "en-ZA",
    categories: ["business", "education"],
    icons: [
      // `app/icon.svg` is served by Next.js at /icon.svg.
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
