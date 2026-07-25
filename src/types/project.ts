export interface Project {
  slug: string;
  title: string;
  /** Always required — the one field every project reliably has from day one. */
  description: string;
  /**
   * Full case-study breakdown (Architecture's Featured Projects content
   * model). Optional: real project data frequently arrives as a
   * description before the problem/approach/outcome narrative and
   * screenshots are written up — better to omit than to invent a case
   * study that wasn't actually provided.
   */
  problem?: string;
  approach?: string;
  outcome?: string;
  /** Concise, scannable capability list for the card — Architecture's Featured Projects content model, extended for this section. */
  features?: string[];
  stack?: string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: {
    src: string;
    alt: string;
  };
}
