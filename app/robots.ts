import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Crawling stays open on preview builds so link-preview bots (WhatsApp, LinkedIn,
  // Slack, X) can still read the Open Graph tags; the pages themselves carry
  // `noindex`, which keeps them out of search results.
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    ...(siteConfig.indexable
      ? { sitemap: `${siteConfig.url}/sitemap.xml` }
      : {}),
  };
}
