/**
 * Single source of truth for all site copy.
 * Everything here comes from Nikash Baboolal's CV. Do NOT invent facts, figures,
 * employers, clients, certifications or testimonials that are not in the CV.
 */

export const person = {
  name: "Nikash Baboolal",
  firstName: "Nikash",
  initials: "NB",
  role: "Process Engineer",
  tagline: "Process engineering, backed by data",
  disciplines: ["Process Engineering", "Project Management", "Data Science"],
  location: "Richards Bay, South Africa",
  /** Canonical origin of the live site (Firebase Hosting). */
  website: "https://nikash.web.app",
  email: "nikashb1@gmail.com",
  phone: "+27 64 907 1018",
  tel: "+27649071018",
  linkedin: "https://www.linkedin.com/in/nikashbaboolal",
  linkedinHandle: "in/nikashbaboolal",
  github: "https://github.com/NikashBaboolal",
  ecsa: "Candidate Engineer (ECSA)",
} as const;

export const summary =
  "Multi-disciplined Process Engineer with hands-on experience applying advanced process engineering and analytics to deliver cost savings and improve long-term production performance. Skilled in control systems, root cause analysis and continuous improvement, with a strong grounding in process safety (HAZOP, MOC, OHS Act) and Lean Six Sigma methodology.";

export const about = [
  "I'm a multi-disciplined Process Engineer with hands-on experience applying advanced process engineering and analytics to deliver cost savings and improve long-term production performance.",
  "I'm skilled in control systems, root cause analysis and continuous improvement, with a strong grounding in process safety (HAZOP, MOC, OHS Act) and Lean Six Sigma methodology.",
  "I work cross-functionally with production, maintenance and quality teams to improve plant reliability, efficiency and compliance, and I bring a rigorous, safety-first, continuous-improvement approach to every problem.",
  "Alongside engineering, I'm studying an MSc in Financial Engineering at WorldQuant University, building on a data science foundation that runs through my work, from PI dashboards to statistical process control.",
] as const;

/** Headline numbers. Every figure is taken directly from the CV. */
export const stats = [
  { value: 1.5, decimals: 1, prefix: "R", suffix: "m", label: "Annual savings from a product trial I led" },
  { value: 15, decimals: 0, prefix: "", suffix: "%", label: "Yield improvement from root cause analysis" },
  { value: 16, decimals: 0, prefix: "", suffix: "", label: "Tutors led as Head Tutor at UCT" },
  { value: 96, decimals: 0, prefix: "", suffix: "%", label: "Matric Mathematics, first in the district" },
] as const;

export const highlights = [
  {
    title: "R1.5m saved per year",
    description: "Led a product trial at Mondi Group that delivered cost savings of R1.5 million per annum.",
  },
  {
    title: "15% higher yield",
    description: "Investigated process deviation events with root cause analysis and implemented corrective actions that improved yield by 15%.",
  },
  {
    title: "Automated reporting",
    description: "Built PI and Excel-based tools and dashboards that automate routine data extraction and reporting.",
  },
] as const;

export type Skill = { slug: string; title: string; description: string; tags: readonly string[] };

export const skillGroups: readonly Skill[] = [
  {
    slug: "process-optimisation",
    title: "Process Optimisation",
    description: "Improving throughput, yield and consistency by finding and eliminating sources of variance and waste.",
    tags: ["Lean Six Sigma", "Continuous Improvement", "Root Cause Analysis"],
  },
  {
    slug: "process-safety",
    title: "Process Safety & Compliance",
    description: "A safety-first approach grounded in hazard studies, change management and legislation.",
    tags: ["HAZOP", "MOC", "OHS Act", "MHSA"],
  },
  {
    slug: "data",
    title: "Data & Analytics",
    description: "Turning plant data into decisions with statistics, dashboards and code.",
    tags: ["Statistical Process Control", "PI", "Advanced Excel", "Python", "Dashboards"],
  },
  {
    slug: "documentation",
    title: "SOPs & Technical Documentation",
    description: "Developing and maintaining SOPs and work instructions for consistency, compliance and audit readiness.",
    tags: ["SOPs", "Work Instructions", "Audit Readiness"],
  },
  {
    slug: "project-management",
    title: "Project Management & Collaboration",
    description: "Running trials and improvement projects with production, maintenance and quality teams.",
    tags: ["Project Management", "Cross-Functional Collaboration", "Stakeholder Reporting"],
  },
] as const;

export const coreSkills = [
  "Process Optimisation",
  "Lean Six Sigma",
  "Root Cause Analysis",
  "Statistical Process Control (SPC)",
  "Process Safety (HAZOP, MOC, OHS Act)",
  "PI",
  "Advanced Excel",
  "Data Analysis and Dashboards",
  "SOPs and Technical Documentation",
  "Continuous Improvement",
  "Cross-Functional Collaboration",
  "Project Management",
  "Python and Data Science",
] as const;

export type Role = {
  slug: string;
  title: string;
  type: string;
  org: string;
  place: string;
  start: string;
  end: string;
  points: readonly string[];
};

export const experience: readonly Role[] = [
  {
    slug: "mondi",
    title: "Process Engineer in Training",
    type: "Full-time",
    org: "Mondi Group",
    place: "South Africa",
    start: "Aug 2024",
    end: "Jul 2026",
    points: [
      "Optimised production processes to improve throughput, yield and consistency across the plant, applying Lean Six Sigma tools to identify and eliminate sources of variance and waste.",
      "Investigated process deviation events using root cause analysis, implementing corrective actions that improved yield by 15%.",
      "Led a product trial resulting in cost savings of R1.5 million per annum.",
      "Built PI and Excel-based tools and dashboards to automate routine data extraction and reporting, reducing manual reporting time and improving the accuracy of process-performance tracking.",
      "Used statistical process control and data analysis to support data-driven decisions for process and quality improvements.",
      "Developed and maintained SOPs, work instructions and technical documentation to ensure consistency, compliance and audit readiness.",
    ],
  },
  {
    slug: "tu-braunschweig",
    title: "Research Associate",
    type: "Internship",
    org: "Technische Universität Braunschweig",
    place: "Braunschweig, Germany",
    start: "Sep 2023",
    end: "Nov 2023",
    points: [
      "Conducted empirical research on lithium-ion battery technologies, building deep domain knowledge in a sector critical to the global energy transition and clean-tech supply chains.",
    ],
  },
  {
    slug: "phaphama",
    title: "Business Development Consultant",
    type: "Part-time",
    org: "Phaphama SEDI",
    place: "Cape Town, South Africa",
    start: "Jan 2023",
    end: "Dec 2023",
    points: [
      "Performed financial and operational health checks for small and medium enterprises, identifying key levers for profitability and long-term scalability.",
      "Worked with business owners to develop business plans and financial projections focused on cash flow management and sustainable ROI.",
    ],
  },
  {
    slug: "head-tutor",
    title: "Head Tutor",
    type: "Part-time",
    org: "Woolsack Residence, University of Cape Town",
    place: "Cape Town, South Africa",
    start: "Jan 2023",
    end: "Dec 2023",
    points: [
      "Directed and mentored a multidisciplinary team of 16 tutors delivering academic support to a diverse resident student body.",
      "Ran performance reviews and feedback loops for tutoring staff to maintain high standards of academic support and engagement.",
    ],
  },
  {
    slug: "tutor",
    title: "Tutor",
    type: "Part-time",
    org: "Kopano Residence, University of Cape Town",
    place: "Cape Town, South Africa",
    start: "Jan 2022",
    end: "Dec 2022",
    points: [
      "Guided undergraduate students through complex engineering and mathematical principles, translating theory into practical, solvable frameworks.",
      "Identified gaps in understanding and developed supplemental learning materials for core conceptual hurdles.",
    ],
  },
  {
    slug: "misa",
    title: "Data Analyst",
    type: "Internship",
    org: "Municipal Infrastructure Support Agent",
    place: "South Africa",
    start: "Jan 2022",
    end: "Feb 2022",
    points: [
      "Collected, cleaned and analysed municipal infrastructure and service-delivery data to support project planning and reporting.",
      "Built spreadsheet-based tools and summary reports to track infrastructure project status against key performance indicators.",
      "Supported data-driven recommendations to project stakeholders, improving visibility of infrastructure project progress.",
    ],
  },
] as const;

export type Education = {
  slug: string;
  qualification: string;
  institution: string;
  place?: string;
  start?: string;
  end: string;
  points: readonly string[];
};

export const education: readonly Education[] = [
  {
    slug: "wqu",
    qualification: "MSc Financial Engineering",
    institution: "WorldQuant University",
    start: "Jul 2026",
    end: "Jun 2028",
    points: [
      "Coursework: Financial Markets, Financial Econometrics, Derivative Pricing, Stochastic Modeling, Machine Learning in Finance, Deep Learning for Finance, Computational Finance, Portfolio Theory and Asset Pricing, Risk Management, Data Science and Statistical Programming.",
    ],
  },
  {
    slug: "uct",
    qualification: "BSc (Eng) Chemical Engineering (Honours)",
    institution: "University of Cape Town",
    place: "Cape Town, South Africa",
    start: "Jan 2020",
    end: "Mar 2024",
    points: [
      "Specialisation: Mineral and Metallurgical Processing.",
      "Thesis: Lithium-ion Battery Recycling.",
      "South32 Bursary recipient.",
      "Societies: Investment Society (InvestSoc), Association of Black Securities and Investment Professionals (ABSIP), Bhakti Yoga Society.",
    ],
  },
  {
    slug: "matric",
    qualification: "National Senior Certificate",
    institution: "Richards Bay High School",
    place: "Richards Bay, South Africa",
    end: "2019",
    points: [
      "First in the district for Mathematics.",
      "National chess player for Team KZN.",
      "Mathematics 96% · Physics 97% · Accounting 91% · Life Science 88%.",
    ],
  },
] as const;

export const certifications = [
  { code: "ECSA", label: "Candidate Engineer", issuer: "Engineering Council of South Africa" },
  { code: "OHSA & MHSA", label: "Legal Liability", issuer: "Siyakhulisa Skills Academy & Assessment Centre" },
  { code: "Process Safety", label: "Chemical Hazards and Process Safety", issuer: "University of California, Davis" },
  { code: "IBM", label: "Data Science Professional Certificate", issuer: "IBM" },
  { code: "Google", label: "Project Management Professional Certificate", issuer: "Google" },
  { code: "Lean Six Sigma", label: "Lean Six Sigma", issuer: "University System of Georgia" },
  { code: "McKinsey Forward", label: "McKinsey Forward Program", issuer: "McKinsey & Company" },
] as const;

/** Places on the globe (approximate city coordinates). */
export const places = [
  { id: "richards-bay", label: "Richards Bay", detail: "Home · Richards Bay High School", lat: -28.78, lng: 32.04 },
  { id: "cape-town", label: "Cape Town", detail: "University of Cape Town · Phaphama SEDI", lat: -33.92, lng: 18.42 },
  { id: "braunschweig", label: "Braunschweig", detail: "TU Braunschweig research internship", lat: 52.27, lng: 10.52 },
] as const;

/** Navigation used by navbar + footer. */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
] as const;
