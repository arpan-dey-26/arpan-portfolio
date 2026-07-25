/**
 * Deliberately a SEPARATE type from CurrentlyBuildingProject
 * (types/currentlyBuilding.ts), not a reuse of it. That type already
 * backs the PrePit AI teaser in Featured Projects and models a software
 * project (roadmap, GitHub URL, live URL). A research project has a
 * genuinely different shape — a problem statement and methodology, not a
 * repo link — so giving it its own type keeps neither one stretched to
 * fit a case it wasn't designed for.
 */
export interface ResearchWorkflowStep {
  label: string;
  isCurrent?: boolean;
}

export interface ResearchProject {
  title: string;
  overview: string;
  problemStatement: string;
  approach: string;
  /** e.g. "Ongoing Research" */
  status: string;
  /** Verified methods/techniques only — never a specific library/framework unless the source actually states one. */
  techniques?: string[];
  workflow?: ResearchWorkflowStep[];
}
