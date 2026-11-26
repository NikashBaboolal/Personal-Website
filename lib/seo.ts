import type { Metadata } from "next";
import { person } from "@/lib/content";

/** Host of the live site. Any other host (e.g. nikashb1.web.app, previews) is treated as a mirror. */
const PRODUCTION_HOST = new URL(person.website).hostname;

/** Normalises NEXT_PUBLIC_SITE_URL (ignores empty values, strips trailing slashes). */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const url = fromEnv && fromEnv.length > 0 ? fromEnv : person.website;
  return url.replace(/\/+$/, "");
}

const url = resolveSiteUrl();

export const siteConfig = {
  name: person.name,
  legalName: person.name,
  role: person.role,
  tagline: person.tagline,
  /** Default meta description (kept under ~160 characters so search results don't truncate it). */
  description:
    "Nikash Baboolal is a Process Engineer in Richards Bay, South Africa, working in process optimisation, process safety, Lean Six Sigma and data analytics.",
  /** Public origin, baked in at build time via NEXT_PUBLIC_SITE_URL. */
  url,
  /**
   * Only the production domain may be indexed. Other builds get `noindex` so they
   * never compete with the canonical site.
   */
  indexable: new URL(url).hostname === PRODUCTION_HOST,
  /** Served by `app/opengraph-image.tsx`. */
  ogImage: "/opengraph-image",
  locale: "en_ZA",
  themeColor: "#07081a",
};

/** Root title: name first on the home page, `%s | Nikash Baboolal` everywhere else. */
export const rootTitle: Metadata["title"] = {
  default: `${siteConfig.name} | ${siteConfig.role}`,
  template: `%s | ${siteConfig.name}`,
};

export interface GetSEOOptions {
  /** Page title, rendered through the root template as `${title} | Nikash Baboolal`. Omit on the home page. */
  title?: string;
  description?: string;
  /** Path of the page, e.g. "/products". Used for the canonical URL and og:url. */
  path?: string;
  /** Set to true to keep the page out of search engines. */
  noIndex?: boolean;
}

/**
 * Builds the page level `Metadata`: title, description, canonical, Open Graph and
 * robots. Kept deliberately lean: no `keywords` (ignored by search engines),
 * no author/creator/publisher noise, and Twitter/X reads the Open Graph tags.
 * The OG image is rendered by `app/opengraph-image.tsx`.
 */
export function getSEO({
  title,
  description = siteConfig.description,
  path = "/",
  noIndex = false,
}: GetSEOOptions = {}): Metadata {
  // Static export uses trailing slashes, so canonical URLs end in "/" too.
  const normalised = path.endsWith("/") ? path : `${path}/`;
  const pageUrl = new URL(normalised, `${siteConfig.url}/`).toString();
  const ogTitle = title
    ? `${title} | ${siteConfig.name}`
    : (rootTitle as { default: string }).default;
  const index = siteConfig.indexable && !noIndex;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "profile",
      siteName: siteConfig.name,
      title: ogTitle,
      description,
      url: pageUrl,
      locale: siteConfig.locale,
      // Set explicitly: a page-level `openGraph` object replaces the parent's, so the
      // root `opengraph-image` file would otherwise only appear on the home page.
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${siteConfig.name}: ${siteConfig.role}`,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    robots: index
      ? { index: true, follow: true, "max-image-preview": "large" }
      : { index: false, follow: false },
  };
}
