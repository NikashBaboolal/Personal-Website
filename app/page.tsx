import { getSEO } from "@/lib/seo";
import { Hero } from "@/components/sections/hero";
import { AboutIntro } from "@/components/sections/about";
import { SkillsBento } from "@/components/sections/services";
import { ExperienceTimeline } from "@/components/sections/experience";
import { Certifications } from "@/components/sections/certifications";
import { ReachGlobe } from "@/components/sections/reach";
import { CtaSection } from "@/components/sections/cta";
import { PersonJsonLd } from "@/components/seo/json-ld";

export const metadata = getSEO({ path: "/" });

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <AboutIntro />
      <SkillsBento />
      <ExperienceTimeline compact />
      <Certifications />
      <ReachGlobe />
      <CtaSection />
    </>
  );
}
