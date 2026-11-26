import { PageHero } from "@/components/layout/page-hero";
import { ContactSection } from "@/components/sections/contact";
import { getSEO } from "@/lib/seo";

export const metadata = getSEO({
  title: "Contact",
  description:
    "Get in touch with Nikash Baboolal, Process Engineer in Richards Bay, South Africa, by email, phone or LinkedIn.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's work together"
        lead="Whether it's a role, a project or a process problem worth solving, I'd like to hear from you."
      />
      <ContactSection />
    </>
  );
}
