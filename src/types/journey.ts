// Milestone types are fixed by the approved Design System (§11.3) — do not
// add types here without an approved Design System change.
export type JourneyMilestoneType =
  | 'education'
  | 'achievement'
  | 'certification'
  | 'hackathon'
  | 'project'
  | 'status';

export interface JourneyMilestone {
  id: string;
  type: JourneyMilestoneType;
  label: string;
  headline: string;
  detail: string;
  order: number;
  /** e.g. '#currently-building' — the "current flagship project" entry links out, Architecture §9.7. */
  linkTo?: string;
}
