import { coreSkills, education, person } from "@/lib/content";
import { siteConfig } from "@/lib/seo";

/** Serialises JSON-LD safely for inline `<script>` usage (no `</script>` breakouts). */
function serialize(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Structured data for the site owner (`Person`) and the website. Render once on the home page. */
export function PersonJsonLd() {
  const url = siteConfig.url;
  const uct = education.find((e) => e.slug === "uct");

  const personData = {
    "@type": "Person",
    "@id": `${url}/#person`,
    name: person.name,
    givenName: person.firstName,
    familyName: "Baboolal",
    jobTitle: person.role,
    description: siteConfig.description,
    url,
    image: `${url}${siteConfig.ogImage}`,
    email: `mailto:${person.email}`,
    telephone: person.tel,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Richards Bay",
      addressRegion: "KwaZulu-Natal",
      addressCountry: "ZA",
    },
    sameAs: [person.linkedin, person.github],
    ...(uct
      ? { alumniOf: { "@type": "CollegeOrUniversity", name: uct.institution } }
      : {}),
    knowsAbout: [...coreSkills],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: siteConfig.name,
    inLanguage: "en-ZA",
    publisher: { "@id": `${url}/#person` },
  };

  const data = { "@context": "https://schema.org", "@graph": [personData, website] };

  return (
    <script
      type="application/ld+json"
      // Static, build-time data from `@/lib/content` only.
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
