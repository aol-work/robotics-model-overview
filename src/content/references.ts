/**
 * Central store of paper references. Add a paper once here, then reference it by
 * id from any node in the architecture tree (see `references` on ArchNode).
 *
 * `authors` and `title` are kept as separate strings so the list can render the
 * title in bold independently of the authors.
 */
export interface Reference {
  /** Concise author string, e.g. "Jane Doe et al." */
  authors: string;
  title: string;
  /** arXiv identifier, e.g. "2605.12090" (used to build the abstract link). */
  arxivId: string;
}

export const references = {
  wamSurvey: {
    authors: "Siyin Wang et al.",
    title: "World Action Models: The Next Frontier in Embodied AI",
    arxivId: "2605.12090",
  },
  wmRobotSurvey: {
    authors: "Bohan Hou et al.",
    title: "World Model for Robot Learning: A Comprehensive Survey",
    arxivId: "2605.00080",
  },
  motus: {
    authors: "Hongzhe Bi et al.",
    title: "Motus: A Unified Latent Action World Model",
    arxivId: "2512.13030",
  },
  gr00tN1: {
    authors: "Johan Bjorck et al.",
    title: "GR00T N1: An Open Foundation Model for Generalist Humanoid Robots",
    arxivId: "2503.14734",
  },
  pi0: {
    authors: "Kevin Black et al.",
    title: "π₀: A Vision-Language-Action Flow Model for General Robot Control",
    arxivId: "2410.24164",
  },
} as const satisfies Record<string, Reference>;

export type ReferenceId = keyof typeof references;

/** Build the arXiv abstract URL for a given identifier. */
export function arxivUrl(arxivId: string): string {
  return `https://arxiv.org/abs/${arxivId}`;
}
