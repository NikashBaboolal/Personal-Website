import { PageHero } from "@/components/layout/page-hero";
import { EducationSection, ExperienceTimeline } from "@/components/sections/experience";
import { getSEO } from "@/lib/seo";

export const metadata = getSEO({
  title: "Experience",
  description:
    "Experience of Nikash Baboolal: Process Engineer in Training at Mondi Group, research at TU Braunschweig, business development consulting, tutoring leadership and data analysis.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="Experience"
        title="Process engineering, research and data"
        lead="Two years as a Process Engineer in Training at Mondi Group, preceded by research in Germany, consulting for small businesses, leading a team of tutors and municipal data analysis."
        image="pipes"
      />
      <ExperienceTimeline />
      <EducationSection />
    </>
  );
}
