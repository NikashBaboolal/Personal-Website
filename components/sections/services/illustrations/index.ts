import type { ComponentType } from "react";
import type { skillGroups } from "@/lib/content";
import { DesignEngineeringIllustration } from "./design-engineering";
import { InstallationIllustration } from "./installation";
import { ProjectPlanIllustration } from "./project-plan";
import { SpcChartIllustration } from "./spc-chart";
import { TrainingIllustration } from "./training";

export type SkillSlug = (typeof skillGroups)[number]["slug"];
export type Tone = "night" | "light";

/** Visual per skill group, keyed by slug (falls back to a plain card if a slug is missing). */
export const skillVisuals: Record<
  string,
  { tone: Tone; Illustration: ComponentType<{ className?: string }> }
> = {
  data: { tone: "night", Illustration: SpcChartIllustration },
  "process-optimisation": { tone: "light", Illustration: InstallationIllustration },
  "process-safety": { tone: "night", Illustration: DesignEngineeringIllustration },
  documentation: { tone: "light", Illustration: TrainingIllustration },
  "project-management": { tone: "night", Illustration: ProjectPlanIllustration },
};
