import type { ComponentType } from "react";
import type { skillGroups } from "@/lib/content";
import { ProcessOptimisationIllustration } from "./process-optimisation";
import { ProcessSafetyIllustration } from "./process-safety";
import { ProjectPlanIllustration } from "./project-plan";
import { SopDocumentIllustration } from "./sop-document";
import { SpcChartIllustration } from "./spc-chart";

export type SkillSlug = (typeof skillGroups)[number]["slug"];
export type Tone = "night" | "light";

/** Visual per skill group, keyed by slug (falls back to a plain card if a slug is missing). */
export const skillVisuals: Record<
  string,
  { tone: Tone; Illustration: ComponentType<{ className?: string }> }
> = {
  data: { tone: "night", Illustration: SpcChartIllustration },
  "process-optimisation": { tone: "light", Illustration: ProcessOptimisationIllustration },
  "process-safety": { tone: "night", Illustration: ProcessSafetyIllustration },
  documentation: { tone: "light", Illustration: SopDocumentIllustration },
  "project-management": { tone: "night", Illustration: ProjectPlanIllustration },
};
