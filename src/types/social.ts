export type SocialPlatform = 'github' | 'linkedin' | 'x' | 'email' | 'resume';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}
