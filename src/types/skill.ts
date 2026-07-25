export interface SkillItem {
  name: string;
  /** Phosphor icon name, e.g. "code" — resolved to a react-icons/pi component where rendered. */
  icon?: string;
}

export interface SkillCategory {
  label: string;
  items: SkillItem[];
}
