import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

const routes: ReadonlyArray<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/about/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/experience/", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact/", changeFrequency: "yearly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Generated at build time, so this reflects the latest deploy.
  const lastModified = new Date();

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, `${siteConfig.url}/`).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));
}
