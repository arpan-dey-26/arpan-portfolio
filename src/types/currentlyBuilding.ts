export interface BuildingMilestoneStep {
  label: string;
  isCurrent: boolean;
}

export interface CurrentlyBuildingProject {
  title: string;
  overview: string;
  currentMilestone: string;
  /** e.g. "Active Development", "Private Beta" — Architecture §9.3. */
  status: string;
  roadmap: BuildingMilestoneStep[];
  stack: string[];
  githubUrl?: string;
  /** Conditionally rendered — omitted from the DOM entirely when absent, Architecture §9.3/§20. */
  liveUrl?: string;
  architecturePreview?: {
    src: string;
    alt: string;
  };
}
