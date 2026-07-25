import type { IconType } from 'react-icons';
import { PiCoffee, PiPaintBrush, PiCode, PiTerminalWindow, PiPaperPlaneTilt } from 'react-icons/pi';
import { SiC, SiCplusplus, SiPython, SiJavascript, SiHtml5, SiMysql, SiGit, SiGithub, SiFigma } from 'react-icons/si';

/**
 * Maps the `icon` keys in data/skills.ts to real icon components.
 *
 * react/nextjs/tailwindcss/nodejs/express/mongodb/postgresql/docker keys
 * (and their icon imports — SiReact, SiNextdotjs, SiTailwindcss,
 * SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiDocker) were removed
 * along with the skills themselves in the authenticity pass — see
 * data/skills.ts's header comment.
 *
 * Brand marks use Simple Icons (react-icons/si) — per the same reasoning
 * as Architecture §10.7 (Phosphor doesn't carry brand-specific logos).
 * Several use Phosphor instead of an exact brand mark — guaranteed to
 * exist (Phosphor's set is a few hundred stable, general-purpose icons vs.
 * Simple Icons' several thousand brand-specific ones, which caused two
 * real runtime crashes in dev — `SiCss3` and `SiVisualstudiocode` —
 * despite both looking correct against documentation):
 * - Java → coffee cup (Simple Icons has no official "Java" mark at all —
 *   Oracle's trademark isn't openly licensed for it)
 * - CSS → paint brush (styling, the underlying concept)
 * - VS Code → generic code icon
 * - IntelliJ IDEA → generic terminal/IDE window icon
 * - Postman → paper airplane (Postman's own logo is a paper-airplane
 *   send symbol, so this is a reasonable conceptual match, not just an
 *   arbitrary substitute)
 *
 * Items not in this map (the conceptual categories: AI & Modern
 * Technologies, Core Computer Science) simply render without an icon —
 * see the comment in data/skills.ts.
 */
export const SKILL_ICON_MAP: Record<string, IconType> = {
  java: PiCoffee,
  c: SiC,
  cpp: SiCplusplus,
  python: SiPython,
  javascript: SiJavascript,
  html: SiHtml5,
  css: PiPaintBrush,
  mysql: SiMysql,
  git: SiGit,
  github: SiGithub,
  figma: SiFigma,
  vscode: PiCode,
  intellij: PiTerminalWindow,
  postman: PiPaperPlaneTilt,
};
