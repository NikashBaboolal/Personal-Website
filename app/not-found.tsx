import type { Metadata } from "next";
import { NotFoundScene } from "@/components/seo/not-found-scene";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Page not found | ${siteConfig.name}`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundScene />;
}
