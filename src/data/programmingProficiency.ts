import type { ProgrammingLanguageProficiency } from '@/types';

// ---------------------------------------------------------------------------
// IMPORTANT: this is deliberately NOT the full tier-based model Architecture
// §12 describes. That model needs a self-assessed stage, years of practice,
// and current focus PER LANGUAGE — none of which have ever been provided
// (MASTER_PORTFOLIO_DATA.md gives only a flat language list). Those are
// judgments only the person themself can honestly make; inferring them from
// indirect signals (a certification, a project stack) would be exactly the
// fabrication "do not invent experience" prohibits.
//
// What follows instead: every verified language, each with real,
// externally-checkable EVIDENCE where it exists (a certification, a named
// project that actually uses it) and nothing invented where it doesn't.
// stage/currentFocus/yearsOfPractice are left unset for all five — populate
// them once actually provided, don't guess at them now.
// ---------------------------------------------------------------------------
export const programmingProficiency: ProgrammingLanguageProficiency[] = [
  { language: 'Java', evidence: 'NPTEL Certified — Programming in Java (90%, Elite + Gold)' },
  { language: 'JavaScript', evidence: 'Used in AyurHerb' },
  { language: 'Python', evidence: 'Used in AyurHerb' },
  { language: 'C++' },
  { language: 'C' },
];
