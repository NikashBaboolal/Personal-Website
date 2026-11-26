import { PageHero } from "@/components/layout/page-hero";
import { IntroductionEditorial } from "@/components/sections/about";
import { SkillsBento } from "@/components/sections/services";
import { EducationSection } from "@/components/sections/experience";
import { Certifications } from "@/components/sections/certifications";
import { ReachGlobe } from "@/components/sections/reach";
import { person, summary } from "@/lib/content";
import { getSEO } from "@/lib/seo";

export const metadata = getSEO({
  title: "About",
  description:
    "Nikash Baboolal is a Process Engineer and ECSA Candidate Engineer with a UCT Chemical Engineering degree, skilled in process optimisation, process safety and data.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title={`Hi, I'm ${person.firstName}`} lead={summary} image="instrumentation" />
      <IntroductionEditorial />
      <SkillsBento showLink={false} />
      <EducationSection />
      <Certifications />
      <ReachGlobe />
    </>
  );
}
