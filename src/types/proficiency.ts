// Deliberately not a percentage — see Architecture §12.1 for the full
// reasoning (percentages are unfalsifiable and read as templated).
//
// UPDATE: stage/currentFocus/yearsOfPractice are self-assessments that
// only the person themself can honestly supply — none were ever provided
// (MASTER_PORTFOLIO_DATA.md gives a flat language list, nothing more),
// and inferring them from indirect signals (a certification, a project
// stack) would be exactly the fabrication the "no invented experience"
// rule prohibits. All three are optional here and unpopulated in
// data/programmingProficiency.ts until actually supplied. `evidence` is
// new: a concrete, externally-verifiable fact (a certification, a named
// project) — not a self-rating, so it's safe to populate from documents.
export type LearningStage = 'Learning' | 'Comfortable' | 'Proficient';

export interface ProgrammingLanguageProficiency {
  language: string;
  stage?: LearningStage;
  currentFocus?: string;
  yearsOfPractice?: number;
  /** 0–100, optional — used sparingly, only where it adds signal a tier badge doesn't. Architecture §12.2. */
  learningProgress?: number;
  /** A concrete, verifiable fact — a certification, a project that uses this language — never a self-rating. */
  evidence?: string;
}
