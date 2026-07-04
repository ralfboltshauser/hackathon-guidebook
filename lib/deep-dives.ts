import type { ComponentType } from "react";

export type DeepDiveStatus = "draft";
export type DeepDivePhase =
  | "Before"
  | "Start"
  | "During"
  | "Final Hours"
  | "Pitch"
  | "After";

export type DeepDive = {
  slug: string;
  title: string;
  description: string;
  socialTitle: string;
  socialDescription: string;
  phase: DeepDivePhase;
  artifact: string;
  readTime: string;
  status: DeepDiveStatus;
  draftNote: string;
  loadContent: () => Promise<{ default: ComponentType }>;
};

const draftNote =
  "Initial content draft. Treat this as a working outline, not validated domain expertise yet.";

export const deepDives = [
  {
    slug: "pitch",
    title: "How to create a hackathon pitch",
    description:
      "A draft structure for turning a weekend project into a credible jury story.",
    socialTitle: "Hackathon pitch",
    socialDescription:
      "Turn a weekend prototype into a clear jury story.",
    phase: "Pitch",
    artifact: "Pitch narrative",
    readTime: "7 min",
    status: "draft",
    draftNote,
    loadContent: () => import("@/content/deep-dives/pitch/index.mdx"),
  },
  {
    slug: "teaser-video",
    title: "How to create a teaser video",
    description:
      "A short draft playbook for making a project video when time is almost gone.",
    socialTitle: "Teaser video",
    socialDescription:
      "Record the proof artifact judges can understand fast.",
    phase: "Final Hours",
    artifact: "Video",
    readTime: "6 min",
    status: "draft",
    draftNote,
    loadContent: () => import("@/content/deep-dives/teaser-video/index.md"),
  },
  {
    slug: "demo-reliability",
    title: "Demo reliability under pressure",
    description:
      "A draft checklist for reducing live-demo failure modes before judging starts.",
    socialTitle: "Demo reliability",
    socialDescription:
      "Plan primary, fallback, and proof paths before judging.",
    phase: "Final Hours",
    artifact: "Demo",
    readTime: "8 min",
    status: "draft",
    draftNote,
    loadContent: () => import("@/content/deep-dives/demo-reliability/index.mdx"),
  },
  {
    slug: "judging-and-emotional-buy-in",
    title: "Judging and emotional buy-in",
    description:
      "A draft model for understanding why judges often decide emotionally first.",
    socialTitle: "Judging psychology",
    socialDescription:
      "Make judges understand, care, and trust the project fast.",
    phase: "Start",
    artifact: "Jury read",
    readTime: "7 min",
    status: "draft",
    draftNote,
    loadContent: () =>
      import("@/content/deep-dives/judging-and-emotional-buy-in/index.md"),
  },
  {
    slug: "domain-research",
    title: "Domain research before building",
    description:
      "A draft approach for learning enough about a domain without pre-building the answer.",
    socialTitle: "Domain research",
    socialDescription:
      "Find the painful moment before you start building.",
    phase: "Before",
    artifact: "Research",
    readTime: "6 min",
    status: "draft",
    draftNote,
    loadContent: () => import("@/content/deep-dives/domain-research/index.md"),
  },
  {
    slug: "team-roles",
    title: "Team roles and ownership",
    description:
      "A draft operating model for keeping build, product, design, and pitch ownership clear.",
    socialTitle: "Team ownership",
    socialDescription:
      "Decide who owns build, product, design, pitch, and submission.",
    phase: "Before",
    artifact: "Team system",
    readTime: "5 min",
    status: "draft",
    draftNote,
    loadContent: () => import("@/content/deep-dives/team-roles/index.md"),
  },
  {
    slug: "challenge-selection",
    title: "Challenge selection",
    description:
      "A draft decision framework for choosing the track where your team has the best odds.",
    socialTitle: "Challenge selection",
    socialDescription:
      "Choose the arena where your team can prove the clearest claim.",
    phase: "Start",
    artifact: "Decision frame",
    readTime: "6 min",
    status: "draft",
    draftNote,
    loadContent: () =>
      import("@/content/deep-dives/challenge-selection/index.mdx"),
  },
  {
    slug: "final-submission-checklist",
    title: "Final submission checklist",
    description:
      "A draft final-hour sequence for avoiding preventable submission mistakes.",
    socialTitle: "Final submission",
    socialDescription:
      "Avoid losing value to broken links, bad access, or late artifacts.",
    phase: "Final Hours",
    artifact: "Checklist",
    readTime: "5 min",
    status: "draft",
    draftNote,
    loadContent: () =>
      import("@/content/deep-dives/final-submission-checklist/index.md"),
  },
  {
    slug: "post-hackathon-leverage",
    title: "Post-hackathon leverage",
    description:
      "A draft follow-up system for turning the weekend into reputation, relationships, and options.",
    socialTitle: "Post-hackathon leverage",
    socialDescription:
      "Turn the weekend into proof, relationships, and options.",
    phase: "After",
    artifact: "Follow-up",
    readTime: "6 min",
    status: "draft",
    draftNote,
    loadContent: () =>
      import("@/content/deep-dives/post-hackathon-leverage/index.mdx"),
  },
] satisfies DeepDive[];

export function getDeepDive(slug: string) {
  return deepDives.find((deepDive) => deepDive.slug === slug);
}

export function getDeepDivePhases() {
  return Array.from(new Set(deepDives.map((deepDive) => deepDive.phase)));
}

export function getDeepDiveOgImagePath(slug: string) {
  return `/deep-dives/${slug}/opengraph-image`;
}
