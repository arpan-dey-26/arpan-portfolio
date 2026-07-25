export type CodingPlatform = 'github' | 'leetcode' | 'hackerrank' | 'codechef' | 'geeksforgeeks';

export interface CodingProfile {
  platform: CodingPlatform;
  username: string;
  /** Optional — not every platform has a confirmed one-line stat yet; omit rather than invent one. */
  statSummary?: string;
  profileUrl: string;
}
