# Arpan — Portfolio

Production portfolio website. This repository currently contains the
**foundation build only** — configuration, design tokens, reusable UI
primitives, and layout. No portfolio sections (Hero, About, Journey,
Featured Projects, Currently Building, Skills, Programming Proficiency,
Coding Profiles, LeetCode Statistics, Certificates, Ask Arpan AI, Contact)
have been built yet, by design.

This implements three approved planning documents, in order:

1. **Product Requirements Document** — vision, audience, information architecture
2. **Design System** — tokens, typography, motion, component rules
3. **Architecture Documentation** — folder structure, component tree, state management, every other engineering decision

Nothing in this codebase should contradict those three documents. Where this
README references a section number (e.g. "Architecture §9"), that's what it
means.

---

## Status

### Phase 6 — real contact form + real AI chatbot (most recent change)

**Both features are now genuinely functional in code — but both need
accounts and credentials only you can create.** I have no network access
in this environment, so I cannot sign up for any service, obtain any API
key, or test either integration end-to-end. What follows is exactly what
you need to do.

#### Contact form → EmailJS

Implemented via EmailJS's plain REST endpoint (not their SDK — this
environment can't `npm install` to verify a new dependency resolves, and
the REST contract is simple enough to implement directly with
confidence). Real validation (empty fields, email format), loading state,
success message, and honest error message on failure — see
`src/services/contactService.ts` and the rewritten `Contact.tsx`.

**To activate it:**
1. Create a free account at emailjs.com.
2. Add an email service (e.g. connect your Gmail) — this is what
   actually delivers to your inbox.
3. Create a template with `{{from_name}}`, `{{from_email}}`, and
   `{{message}}` variables.
4. Copy your Service ID, Template ID, and Public Key into `.env`
   (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
   `VITE_EMAILJS_PUBLIC_KEY`) — and into Vercel's project environment
   variables for production.

Without these three set, the form shows "not configured yet" rather than
failing silently or pretending to succeed.

#### Chatbot → Anthropic's API

The original architecture (from the foundation build, before any of the
visual phases) already scaffolded this as `ANTHROPIC_API_KEY` via a
Vercel Edge Function — implemented that plan now rather than switching to
OpenAI, both for consistency with what was already there and because I
have direct, reliable knowledge of Anthropic's actual API shape, which
meaningfully lowers the risk of guessing wrong the way I would with a
less-familiar provider's exact request/response format.

`api/chat.ts` calls Anthropic's Messages API directly via `fetch` (no
SDK, same reasoning as EmailJS above) with a system prompt built from
`src/content/chatbotKnowledge.ts` — a real, comprehensive knowledge base
compiled from everything already verified elsewhere on this site (About,
Projects, Skills, Journey, Certificates, coding profiles, current
research, contact), respecting the authenticity pass exactly (no
React/Next.js/Node.js/etc. attributed to Arpan). The system prompt
explicitly instructs the model to only use this knowledge and to say so
plainly rather than guess when asked something outside it.

One thing worth knowing: Arpan's phone number is deliberately **not** in
the knowledge base at all, not just instructed against — the assistant
can't leak what was never in its context, which is a stronger guarantee
than an instruction alone would be.

Non-streaming by design: true token-by-token streaming needs
Server-Sent-Event parsing on the frontend I have no way to test
end-to-end here. A single awaited response is slower to first byte but
can't go subtly wrong the way an untested streaming parser could.

**To activate it:**
1. Get an API key at console.anthropic.com.
2. Set `ANTHROPIC_API_KEY` in Vercel's project environment variables
   (not just your local `.env` — the deployed function needs it there).
3. That's it — no separate template/service setup like EmailJS needed.

Until both are configured, the site still works correctly: the contact
form shows an honest "not configured yet" message, and the chatbot
returns a plain "temporarily unavailable" state rather than crashing.

#### Also added this round
- Markdown rendering for assistant messages — a small hand-written
  parser (bold, inline code, code blocks, bullet lists) returning real
  React elements, not `dangerouslySetInnerHTML` — deliberately not a new
  npm dependency I couldn't verify installs correctly.
- Timestamps on every chat message.
- A recurring mistake fixed a fifth time (Tailwind opacity modifiers on
  custom color tokens — this round's instance was the chat error banner)
  — and this time, a prominent warning was added directly in
  `tokens.css` itself, where the colors are defined, since catching it in
  review each time clearly wasn't preventing it from recurring.

### Phase 5 — full audit + signature heading system (most recent change)

**Led with a full re-audit before adding anything**, per this brief's own
emphasis on stability/verification — every risk pattern found in earlier
turns (React namespace imports, opacity modifiers on custom color
tokens, stale breakpoint prefixes, broken imports) was re-checked across
the *entire* project, not just new files. All clean. One scare during the
audit worth recording: `SiCss3` and `SiVisualstudiocode` still show up in
a grep for Simple Icons usage — confirmed these are only in this
project's own historical comment text documenting the earlier bugs, not
actual imports. Real regression risk, checked immediately, turned out to
be nothing.

**New work:**
- `SectionHeading` (the one shared component nearly every section uses)
  now has a subtle accent glow matching Hero's name treatment, plus a
  small underline that draws in shortly after the words do — its own
  independent trigger, not nested into the word-stagger, since I
  couldn't verify Framer Motion's variant propagation through the
  intermediate heading element would work the way a nested version
  needed without a live render to check it against. Cascades to every
  section automatically.
- `LightRays.tsx` (new): two soft diagonal beams behind everything,
  4-6% opacity, reusing the existing `float-glow` keyframe rather than
  defining a second animation for a similar kind of drift.
- Hero's floating badges now respond to hover (lift + accent border) —
  were purely decorative before.

### On the Quality Control checklist

Being direct about what I can and can't actually confirm: **I cannot run
`tsc`, a production build, or a browser in this environment** (no network
access for `npm install`). Everything above was verified the most
rigorous way available to me — systematic grep-based checks for every
failure pattern this build has actually hit, plus manual review — not an
actual compiler or runtime. That's a real, meaningful difference from
"zero TypeScript errors" or "zero console warnings" as literal, tested
facts. Recommend `npm install && npm run build` locally as the first real
confirmation.

### Starfield idle-speed fix (most recent change)

Real bug, from real feedback: the old idle floor (`baseDrift = [3, 6, 10]`
px/sec) had no defined relationship to scroll speed at all — it was a
token "not literally zero" gesture, not a proportion of anything, and at
those values it read as static. Separately, the scroll-boost multiplier
(`* 4`, uncapped beyond a raw velocity clamp) meant fast scrolling could
reach up to ~16x idle rather than the requested ~2x.

Rewritten around one explicit constant per layer (`IDLE_SPEED = [10, 18,
28]` px/sec) that both floors the idle speed at a genuinely perceptible
level and anchors everything else as a multiple of it — normal fast
scrolling lands at exactly 2x idle for every layer, an unusually hard
fling caps at 2.5x (a soft ceiling, not unbounded). Verified with actual
numbers before shipping this time (see the node one-liner in this
session), rather than reasoning about it abstractly — idle: 10/18/28
px/sec, at-2x: 20/36/56, at-cap: 25/45/70, confirmed exact.

Also removed a redundant second per-layer multiplier that had crept in
while first drafting this fix — harmless to the ratio itself (constant
factors cancel out in a before/after comparison), but made the absolute
speeds more extreme than intended and the code harder to reason about.
Caught by recomputing the actual numbers rather than assuming the logic
was right because it looked reasonable.

### Location visualization + scroll-reactive starfield (most recent change)

**West Bengal outline — read this before assuming it's precise.**
`sections/Hero/WestBengalOutline.tsx` is a deliberately simplified,
stylized silhouette, NOT traced from real boundary/GeoJSON data. This
environment's tools couldn't get there: `web_fetch` can't retrieve
Wikimedia Commons' actual SVG source files (confirmed — tried directly),
and the code sandbox has no network access to download and inspect one
another way. Built from general knowledge of the state's distinctive
shape (narrow north near Siliguri, widening south) instead, and
simplified further for a decorative watermark — which the brief itself
asked for anyway ("never look like a traditional map," 5–12% opacity).
Worth a look before publishing if you want geographic precision;
easy to swap the `<path>` for a real one later.

`HeroLocationVisualization.tsx` wraps that outline with a breathing glow,
a pulsing pin roughly at Kolkata's position, and an animated dashed line
reaching toward the actual location badge — real connective tissue
between the two, not just two separate floating elements.

**Starfield replaces ParticleField entirely** (that file is deleted, not
left unused) — a scroll-velocity-reactive effect needs a per-frame read
of current scroll speed, which CSS keyframes have no mechanism for.
Canvas + `requestAnimationFrame`, 3 depth layers (different speed/size
per layer), twinkle via a per-star sine wave, and a streak/hyperspace
draw mode that kicks in past a velocity threshold — all driven by a new
shared `lib/scrollVelocity.ts` store that `useLenis` writes to on every
scroll event and `Starfield` reads directly inside its own animation
loop. Deliberately NOT React state — state updates on every scroll tick
(60+/sec) would themselves hurt the performance this feature needs.
Velocity is smoothed (lerped toward the target each frame, not snapped)
for the "never jump abruptly" / inertia feeling asked for, and decays to
idle based on a staleness timeout rather than a specific Lenis
"scroll ended" event name I couldn't confirm exists in this environment.

### Phase 4 (most recent change)

Most of this brief overlapped with the immediately preceding "final
premium redesign" pass (Hero photo composition, floating badges, glass
frame) — that wasn't rebuilt. What's actually new:

- **Hero's name** now uses fluid `clamp()` sizing (44px–96px depending on
  viewport) instead of the fixed 72px `text-display` token — genuinely
  larger than any existing type step allows, plus a subtle accent-tinted
  text-shadow glow and a hover response (letter-spacing).
- **Three small floating "3D" shapes** in Hero (desktop only, reduced-motion
  aware) — combine a position float with continuous rotateX/rotateY/rotateZ,
  the same mechanism `useTilt` uses for mouse-tracked tilt, just
  timer-driven instead of cursor-driven.
- **"Pinned elements," resolved differently than GSAP `pin: true`**:
  Journey is now a sticky-sidebar layout at laptop+ (heading sticks in a
  left column via plain CSS `position: sticky` while the milestone list
  scrolls in a right column). This is deliberately NOT GSAP's pin
  mechanism — sticky is a native, well-understood, zero-JS-calculation
  browser feature, immune to the wrong-pin-distance/layout-jank failure
  modes GSAP pinning is prone to. A two-column sticky-sidebar was chosen
  over a stacked sticky-heading-over-a-list specifically to avoid any
  visual overlap between the heading and scrolling content — they occupy
  separate horizontal space, so no z-index tricks are needed.

**One real bug caught before shipping**: `HeroFloatingShapes.tsx`
initially used Tailwind opacity modifiers on custom color tokens
(`border-accent-cyan/40` etc.) — the exact same unreliable pattern
already found and fixed twice before in this build (Modal/MobileMenu's
scrim, `surface-glass`). Caught by re-scanning for it immediately after
writing the file, fixed with inline rgba styles instead.

### Final premium redesign pass (most recent change)

**Hero restructured, not just polished** — per explicit permission to
change the layout completely. Photo is now significantly larger and the
grid weights toward it (was 1.1fr/0.9fr text-first, now 0.95fr/1.05fr
photo-first). Two floating badges now occupy the space around the photo
— "Open to opportunities" and location — both real, already-verified
facts (matching Journey's status language and site.config's location),
not invented filler. Hero is now `min-h-screen` (fills the first
viewport) with a scroll-cue at the bottom. The role/tagline split
(distinct accent-colored line for "Building Intelligent Digital
Solutions") is a new visual treatment of heroCopy's existing string, not
new copy.

**Journey's timeline line is now scroll-scrubbed**, not viewport-
triggered — it visibly draws as you scroll past each milestone (GSAP
ScrollTrigger with `scrub`) instead of playing a fixed-duration animation
once. Extracted into its own `JourneyMilestoneItem.tsx` so ScrollTrigger
has a stable per-item ref to target.

**On section pinning, explicitly requested again this round**: I chose
not to implement it. Reasoning: pinning is one of the more failure-prone
GSAP features to ship without a real browser to test in — wrong pin
distance, layout jank on release, and breakpoint-dependent miscalculation
are all common, and this build has already turned up several real bugs
(CSS import order, wrong icon exports, a missing React import) that only
surfaced once an actual `npm run dev` existed to catch them. The
scroll-scrubbed timeline line above delivers the same "motion tied to
scroll position" feeling with substantially less risk. Worth revisiting
specifically for Journey once this can be tested live, if the plain
scroll-scrub isn't dramatic enough once you see it.

**On the reference video**: extracted and reviewed frames directly
(ffmpeg was available in this environment) rather than working blind —
confirmed it's a mobile screen recording (portrait, continuous scroll
capture), which matches the "scroll experience" framing of the brief.
Design decisions here are grounded in the detailed written brief rather
than claimed visual specifics from the video, since that's what I can
actually stand behind.

### Hero photo replaced (most recent change)

`src/assets/images/profile-photo.webp` now comes from
`arpan_25_07_26_photo.jpeg`, not the original `IMG-20260725-WA0003.jpg`
extraction. Context: an earlier upload
(`Firefly_Gemini_Flash_PLAIN_PROFESSIONAL_BACKGROUND...png`) was declined
— Adobe's and Google's AI-image-generation tool names were right there in
the filename, which is exactly what "no AI-generated portraits" rules
out. This replacement was confirmed directly as a real photo and has none
of those signatures, so it was accepted and processed.

Cropped using OpenCV's Haar-cascade face detector, not a visual guess —
the source photo is a casual outdoor shot, not a studio headshot, so
precise framing mattered. Detected face box: 244×244px; crop composed so
the face occupies ~30% of frame height with ~12% headroom above the
hairline, centered horizontally on the face, then resized to a clean
800×800 webp. This also fully excludes the "Galaxy S26 Ultra" watermark
that was in the original photo's corner.

`HeroPhoto.tsx` also picked up the animation nuances from this round that
weren't in the original build: a real entrance animation (scale+fade+y on
mount, distinct from the continuous floating loop), a "breathing" pulse
on the glow layer specifically (not the photo itself — pulsing the photo
would read as zooming), and scroll-scrubbed parallax via the same GSAP
utility Featured Projects' image already uses. That parallax runs on a
separate wrapping element from the tilt/float/breathing animations on
purpose — GSAP and Framer Motion both assume exclusive control of
whatever element's `transform` they're driving, so stacking both sets of
effects on one element would have them overwrite each other every frame
instead of composing.

### Final quality pass (most recent change)

Finished what the authenticity-fix interruption had paused, plus a genuine
mobile-width audit (code-level, not a visual one — see below):

- 3D tilt (`useTilt`, already built for Hero's photo) now also applies to
  both Featured Projects cards — "interactive cards."
- Buttons now use spring physics (real overshoot) for hover/press instead
  of a linear scale — "elastic buttons."
- Journey's milestones now have a connecting timeline line, anchored to
  the fixed-size icon rather than the variable-height list item, so it
  stays correctly positioned regardless of how much detail text any given
  milestone has.
- `Divider` (used by every `SectionWrapper`) now fades at both edges
  instead of a flat line — "beautiful section separators," one change
  that reaches every section.
- **Two real mobile-overflow risks found and fixed**, worked out from
  actual pixel math against this project's own padding tokens, not
  guessed: Skills' card `min-width` left only 12px of margin at a 320px
  viewport (reduced it); LeetCode's platform-rank stat (7 digits) was
  wider than its own 2-column mobile grid cell (grid now steps
  1→2→4 columns instead of 2→4, and the counter's font size steps up
  with it).

**On "final quality check" (Section 8):** I can't literally render this
site and look at it — everything above came from reading the code and
computing actual pixel widths against the real padding/breakpoint values,
not from visual inspection. That's a real, different thing from a human
design review, and worth being direct about rather than implying a level
of certainty a screenshot would actually require confirming.

**Still open** (flagged in earlier passes, unchanged):
PrePit AI's stack (`Prisma ORM`, `Turborepo`) reads oddly without
Node.js/Next.js listed; Hero's "...Full-Stack Developer..." title is
worth a second look now that no backend framework is listed anywhere;
fonts/resume/Spline-scene/GitHub-repo-URLs are all still pending assets
noted since the foundation build.

### Authenticity pass (most recent change)

On Arpan's explicit instruction, React, Next.js, Tailwind CSS, Node.js,
Express.js, MongoDB, PostgreSQL, and Docker were removed everywhere —
Skills, both projects' tech stacks, and the icon map — because he
flagged that he doesn't know them well enough to speak to them
confidently. Nothing was added back to compensate.

This forced two structural changes in Skills (`data/skills.ts`), not just
item removal: the "Backend" category is gone entirely (it only ever held
Node.js + Express.js), and "Frontend" is renamed "Web Fundamentals" (what
remains — HTML, CSS — is markup/styling basics, not framework-level
frontend work). 8 categories → 7; `Skills.tsx` switched from a fixed
3-column grid to a wrapping flex layout so the count doesn't need to
divide evenly to look right.

**Two things flagged, not silently decided, since they're really Arpan's
call:**
1. PrePit AI's remaining stack (`Prisma ORM`, `Turborepo`) are normally
   Node.js-ecosystem tools. Keeping them listed without Node.js/Next.js
   could read oddly in an interview ("used Prisma with what runtime?").
   Neither was in the explicit removal list, so neither was touched.
2. Hero's job title ("...AI & Full-Stack Developer...") and About's "...
   full-stack web development" line weren't changed — "full-stack" doesn't
   strictly require the removed technologies, but worth a second look now
   that no backend framework/runtime is listed anywhere on the site.

✅ Done (foundation):

- Vite + React + TypeScript + Tailwind CSS project setup
- ESLint, Prettier, path aliases, environment variable handling
- Design tokens implemented in `tailwind.config.ts` / `src/styles/tokens.css`
- All 10 reusable UI primitives (`src/components/ui/`)
- Navbar, Footer, Mobile Menu, Layout (`src/components/layout/`)
- Error boundary, focus management, reduced-motion handling, skip link
- SEO/OG/robots/sitemap defaults, `/api` structure, environment variables
- Full approved folder structure, including one placeholder per not-yet-built section

✅ Done (real data, from `MASTER_PORTFOLIO_DATA.md` + uploaded certificates/documents/screenshots):

- `src/data/journey.ts`, `skills.ts` — from the master data document
- `src/data/certificates.ts` — **all 5** certificates now have verified
  exact dates, credential IDs, and a downloadable PDF, read directly off
  the uploaded certificate files
- `src/data/projects.ts` (AyurHerb) — full problem/approach/outcome and
  tech stack, from the uploaded Smart India Hackathon 2024 submission
- `src/data/currentlyBuilding.ts` (PrePit AI) — real milestone, roadmap,
  tech stack, and an actual architecture diagram image, from the uploaded
  Smart Bengal Hackathon 2025 submission
- `src/data/leetcodeStats.ts` — **corrected**: replaced with verified
  numbers from an actual profile screenshot after the master data's
  figures turned out to be inconsistent (see Known content gaps)
- `src/constants/socialLinks.ts`, `src/content/heroCopy.ts` / `aboutCopy.ts`
- `src/config/site.config.ts`, `index.html`'s Person schema
- `src/assets/images/` — real profile photo, two AyurHerb screenshots, and
  the PrePit AI architecture diagram, all optimized to WebP
- `public/certificates/` — 4 real, downloadable certificate PDFs

✅ Done (sections):

- **Hero** — staggered text entrance, lazy-loaded 3D scene slot with a
  code-based fallback (no Spline scene has been authored yet — see
  `sections/Hero/HeroSplineScene.tsx`)
- **About** — real professional summary
- **Journey** — all 6 milestones, real content, one links out to Currently
  Building once that section exists (Architecture §9.7)
- **Featured Projects** — AyurHerb as a full project card; PrePit AI as a
  distinct "Currently Building" teaser card in the same grid, reading from
  `data/currentlyBuilding.ts` rather than duplicating its facts
- **Skills & Technologies** — 8 categories, real items, verified brand
  icons where confidently known (see `sections/Skills/skillIcons.ts`)
- **Programming Proficiency** — deliberately NOT the original tier model
  (Proficient/Comfortable/Learning + years) — no self-assessment was ever
  provided, and inferring one would be fabricating experience. Shows every
  verified language with real, checkable evidence only. See
  `data/programmingProficiency.ts`'s header comment.
- **Coding Profiles** — GitHub, LeetCode, HackerRank, real usernames/links
- **LeetCode Statistics** — verified counts only, animated counters,
  difficulty breakdown as a share of total solved
- **Certificates** — all 5, with real dates, credential IDs, verification
  links, and an in-page PDF preview modal
- **Contact** — real email/phone/location/socials; the form is a genuine
  mailto: handoff, not a fake "sent" state with no backend behind it
  (Phase 1 has no server to submit to yet)
- **Footer** — enhanced with a back-to-top link (small, additive change
  to the existing component, not a rebuild)
- **Ask Arpan AI** — built as a global floating widget (button + panel),
  not a scrollable section — see "A note on Ask Arpan AI" below. Frontend
  only, no model connected yet, per this round's explicit scope.
- **Currently Building** — the confirmed active research project (see
  `data/currentResearch.ts`'s header comment). Concise by explicit
  request: no metrics, no PDF, no tables.

✅ Done (Phase 2 — premium animation system):

- Word-reveal headings (`SectionHeading`, applies to every section using it)
- Magnetic hover + press animation on every `Button`
- Border-glow hover on all card components (new `shadow-glow` token)
- Desktop-only cursor follower, scroll progress bar, ambient background glow
- Navbar: glass only once scrolled, hide-on-scroll-down/show-on-scroll-up,
  sliding active-link indicator
- Subtle mouse-tilt parallax on Hero's visual (desktop only)
- Contact form success state, honestly worded (see note below)
- Ask Arpan AI's open animation given spring physics

All of the above respects `prefers-reduced-motion` and only runs on
`(hover: hover) and (pointer: fine)` devices where relevant — see "A note
on Phase 2" below for three real bugs found and fixed along the way.

✅ Done (Phase 3 — audited Phase 1/2 first; only built genuine gaps):

- **Lenis**: anchor-link clicks (`href="#section"`) now actually go
  through Lenis's smooth scroll instead of the browser's native instant
  jump — a real gap, not a new feature. Mobile touch config made explicit.
- **GSAP ScrollTrigger**: given its one genuine job in this build — subtle
  scroll-scrubbed parallax on the Featured Projects image (`gsapUtils.ts`,
  extended, not duplicated). No pinning, no cinematic scroll-jacking —
  didn't fit this site's content, not built.
- **`Divider`** (built in the foundation, never used) now provides
  consistent section dividers via `SectionWrapper`, on by default
  everywhere except Hero
- **`LazyImage`** (new, shared): load-triggered fade + zoom-on-hover +
  optional parallax, consolidating what was duplicated inline in
  `ProjectCard` — and surfacing the PrePit AI architecture-diagram image
  that was wired into data back when Certificates was built but never
  actually rendered anywhere
- **`CursorFollower`** now scales over interactive elements (genuinely new
  — Phase 2 only had a static-size dot)
- **`ChatButton`** now uses the shared `useMagneticHover` hook instead of
  its own one-off hover animation
- **`ChatWindow`** is now lazy-loaded — doesn't ship in the initial bundle
  for visitors who never open the chat
- **`AppLoader`** (new): a real loading screen tied to `document.fonts.ready`
  with a small minimum (avoids a flash) and hard maximum (never blocks a
  slow connection) — not a fake `setTimeout` progress bar
- Footer's social icons now match Contact's hover-lift; `Pill`'s default
  variant gets a subtle hover; Hero's name reveals word-by-word (same
  timed pattern as its other text) with a soft depth glow behind the visual

Explicitly **not** built, and why: section pinning (this site's content
isn't narrative enough to earn it), extra per-button shine effects beyond
what Phase 2 already gives every button, and any GSAP usage that would
duplicate what Framer already handles well.

Every one of these files documents, inline, exactly which fields are real
vs. still missing — see **Known content gaps** below for the full list in
one place.

⬜ Not done:

- Ask Arpan AI's actual model connection (Phase 3, explicitly out of scope)
- Deployment, Spline/3D (explicitly out of scope for Phase 2)

### A note on Ask Arpan AI's frontend

Built as a global floating widget (fixed button + panel, mounted in
`Layout.tsx`), not a scrollable `<section>` in the page flow — that's what
"floating chatbot button" + "chat window" in the brief describes, and it's
why it has no entry in `constants/navLinks.ts` (a scroll-to link doesn't
apply to something already always visible). Sending a message shows a
real typing indicator, then a plain, honestly-worded system message
explaining the model isn't connected yet — never a fabricated AI-sounding
reply. The glassmorphism here is intentional and correct — this is the
one spot the Design System always reserved it for.

### A note on Featured Projects vs. Currently Building

Featured Projects' build brief asked for PrePit AI to be previewed there
too, which raised a real question at the time: Architecture §9's
dedicated "Currently Building" section already existed for exactly this
kind of content, so would it become redundant? That's resolved now —
the dedicated Currently Building section turned out to be for a different
active project entirely (the Marigold research, confirmed by Arpan), not
PrePit AI. So both stand: PrePit AI stays a teaser card inside Featured
Projects (reading from `data/currentlyBuilding.ts`), and Currently
Building is the research project (reading from `data/currentResearch.ts`)
— two distinct active projects, not a duplication of one.

Glassmorphism was also requested for Featured Projects' cards (and again
for Skills), which the approved Design System rules out everywhere except
the Ask Arpan AI panel — the cards use the existing solid-surface system
instead.

### A note on Currently Building's content

Now built, per Arpan's direct confirmation that this is his real,
ongoing final-year research project (the uploaded draft's author block
simply wasn't finalized, which is why his name didn't appear in it).
Content is deliberately minimal per explicit instruction: title,
overview, problem statement, high-level approach, status, the two
techniques the paper actually names (CNN, SVM — no specific
framework/library, since none is stated in the paper's own empty
Methodology section), and a workflow that mirrors the paper's own section
structure. No metrics, no PDF viewer, no tables — see
`data/currentResearch.ts`'s header comment for the full sourcing detail.

### A note on Phase 2 (Premium Animation System)

Three real bugs were found and fixed while building this round:

1. **`Button.tsx` referenced `React.Ref<...>` without ever importing
   `React` as a namespace** — present since the foundation build, would
   have failed to compile. Fixed by importing `Ref` as a named type.
2. **The same mistake, freshly introduced this round** in `Hero.tsx`'s
   new parallax handler (`React.MouseEvent`) — caught and fixed
   immediately after.
3. **`Modal.tsx` and `MobileMenu.tsx` used `bg-bg/80` / `bg-bg/90`** — a
   Tailwind opacity modifier on a CSS-variable-based color, the same
   unreliable pattern already flagged when `surface-glass` was first
   built for the chatbot panel. Fixed with a proper `scrim` rgba token,
   same approach as `surface-glass`/`accent-muted`.

None of these were visible in any screenshot — they'd only surface at
build time, which this sandbox can't run (no network). Worth an
`npm install && npm run build` locally as a first check.

Also fixed earlier in this project: Framer Motion animations across the
whole app weren't wired to `prefers-reduced-motion` at all until
`<MotionConfig reducedMotion="user">` was added to `App.tsx` — Phase 2's
new interactions (magnetic hover, cursor follower, parallax, ambient
background) all check it explicitly too, rather than assuming
MotionConfig alone covers every case (it doesn't reliably cover
non-transform effects like text content or continuous CSS animations).

---

## Tech stack

React · Vite · TypeScript · Tailwind CSS · Framer Motion · GSAP · Lenis ·
Spline · React Icons · React Router (installed, not yet wired up —
"future ready" per the current single-page Information Architecture) ·
Vercel

---

## Getting started

This environment has no network access, so dependencies could not be
installed or the build verified here. Locally:

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check (tsc -b) and produce a production build
npm run preview   # preview the production build locally
npm run lint       # ESLint
npm run format     # Prettier (writes)
```

Copy `.env.example` to `.env` and fill in the public `VITE_*` values before
running `dev`/`build` — see **Environment variables** below.

Since dependencies couldn't be installed in this environment, this code
hasn't been run through `tsc`/ESLint here. Run `npm install && npm run build`
locally as a first check.

### Two real bugs found via actual local runs (things this sandbox couldn't catch)

Neither was hypothetical — both came from real `npm run dev` output/console
errors:

1. **`global.css` had `@import` after `@tailwind`.** CSS requires
   `@import` to come before everything except `@charset`. Fixed — see the
   comment at the top of that file.
2. **Two `react-icons/si` names didn't exist in the installed version**:
   `SiCss3`, then `SiVisualstudiocode`. The first looked like it might be
   a Vite dependency pre-bundling issue rather than a wrong name (the
   `optimizeDeps` fix in `vite.config.ts` addresses that category
   regardless); the second broke *despite* that fix working correctly
   (confirmed by the error referencing the actual pre-bundled file), which
   is strong evidence it was genuinely the wrong name, not tooling.
   `vscode`, `intellij`, and `postman` in `sections/Skills/skillIcons.ts`
   now all use Phosphor instead of a Simple Icons brand mark — Phosphor's
   set is far smaller and has had zero issues across ~25 uses in this
   project, versus 2 real failures out of ~20 Simple Icons uses.

**Residual risk, stated plainly**: the remaining Simple Icons imports
(`SiReact`, `SiJavascript`, `SiHtml5`, `SiTailwindcss`, `SiNextdotjs`,
`SiNodedotjs`, `SiMysql`, `SiPostgresql`, `SiMongodb`, `SiPython`,
`SiHackerrank`, `SiLeetcode`) haven't all been verified against the
*actual installed* package the same way `SiC`/`SiCplusplus`/`SiDocker`/
`SiExpress`/`SiFigma`/`SiGit`/`SiGithub` were (confirmed directly against
react-icons' own generated source file). They're extremely common,
frequently-used icons, which is reassuring but not the same as certainty.
If any of them throws the same "does not provide an export" error, it's
`src/sections/Skills/skillIcons.ts` — swap that specific one for a
Phosphor icon the same way the others were handled, rather than assuming
it's tooling again.

---

## Environment variables

See `.env.example`. Two categories, and the distinction matters:

| Variable | Prefix | Where it's read |
|---|---|---|
| `ANTHROPIC_API_KEY` | **none** | Server-side only, inside `/api` functions |
| `VITE_SITE_URL`, `VITE_SITE_TITLE`, `VITE_SITE_DESCRIPTION`, `VITE_OG_IMAGE` | `VITE_` | Client — `index.html` (build-time interpolation) and `src/config/env.ts` |

**Never** add a `VITE_` prefix to a secret. Any `VITE_`-prefixed variable is
bundled into client-side JavaScript and is publicly visible to anyone who
opens the site. This is the single most important rule in this codebase
(Architecture §21.4).

---

## Path aliases

One alias: `@` → `src/`. For example `import { Button } from '@/components/ui'`.

Defined in two places that must stay in sync: `tsconfig.app.json` (`compilerOptions.paths`)
and `vite.config.ts` (`resolve.alias`). A tsconfig-reading plugin
(`vite-tsconfig-paths`) would remove the duplication but adds a dependency
for something this small — see the comment at the top of `vite.config.ts`.

---

## Design tokens — how they map to Tailwind

Full source of truth: the approved Design System. A few mappings worth
knowing so you're not hunting for a `space-*` scale that doesn't exist:

- **Spacing**: Tailwind's default spacing scale already matches the Design
  System's exactly (`p-4` = 16px = `space-4`, `py-20` = 80px = `space-20`,
  etc.) — use Tailwind's numeric utilities directly. See the comment block
  at the top of `tailwind.config.ts` for the full value-by-value mapping.
- **Colors, border radius**: custom, and Tailwind's defaults are fully
  replaced (not extended) so an off-system value like `bg-blue-500` or
  `rounded-2xl` isn't even available to reach for by accident.
- **Breakpoints**: `tablet` (768px) / `laptop` (1024px) / `desktop`
  (1280px) — there is no `sm:`/`md:`/`lg:`/`xl:` in this project.
- **Z-index**: the Design System names this as a token category without
  specifying values — `tailwind.config.ts` defines the minimal functional
  scale needed (navbar/mobile-menu/modal/skip-link), flagged there as a
  foundation-level gap-fill, not a restatement of an approved value.

---

## Folder structure

```
portfolio/
├── public/              static files served as-is (favicon, robots.txt, sitemap.xml)
├── api/                 Vercel serverless functions (currently just the chat.ts stub)
├── src/
│   ├── assets/           images, icons, brand mark, platform/org logos
│   ├── components/
│   │   ├── ui/            10 reusable primitives — see below
│   │   └── layout/         Navbar, Footer, MobileMenu, Layout, ErrorBoundary, SkipToContent
│   ├── sections/          one folder per IA section — all placeholders for now
│   ├── hooks/             useReducedMotion, useMediaQuery/useBreakpoint, useActiveSection,
│   │                        useOnClickOutside, useFocusTrap, useLenis
│   ├── utils/             cn, formatDate, slugify, throttle
│   ├── types/             one file per data entity, barrel-exported from index.ts
│   ├── constants/         breakpoints, navLinks, socialLinks, promptChips
│   ├── animations/        motion tokens, Framer variants, a GSAP ScrollTrigger helper
│   ├── content/           long-form prose (hero/about/contact copy, chatbot knowledge base)
│   ├── data/               structured, typed records (projects, certificates, journey, etc.)
│   ├── services/          chatService (stub), analyticsService
│   ├── config/             env.ts, seo.config.ts, site.config.ts
│   ├── styles/             global.css, tokens.css, fonts.css
│   ├── App.tsx
│   └── main.tsx
```

Full rationale for every folder: Architecture §4.

### UI primitives (`src/components/ui/`)

`Button` · `IconButton` · `SectionHeading` · `Pill` · `ProgressBar` ·
`Divider` · `Spinner` · `Modal`

Notable design decisions baked into these:

- **`Pill`** backs tech tags, prompt chips, *and* proficiency stage badges
  — one primitive, three future call sites (Architecture §5).
- **`ProgressBar`** always renders in the single accent color — no
  green/yellow/red difficulty variants, per the Design System's "one accent
  color only" rule (§2.1).
- **`SectionHeading`**'s `as` prop is `'h2' | 'h3'` only, never `'h1'` — the
  page has exactly one `<h1>` (the Hero's name), so this is enforced at the
  type level, not just by convention.
- **`Modal`**'s overlay is a solid scrim, not blurred — the Design System's
  one sanctioned blur/glass moment is already spent on the future chatbot
  panel (§10.2 of that document).
- **`IconButton`** requires `aria-label` at the type level — an icon-only
  button can't compile without an accessible name.

### Layout components (`src/components/layout/`)

`Navbar` (scroll-spy, resume CTA, mobile toggle) · `MobileMenu` (focus-trapped
slide-in panel) · `Footer` · `Layout` (composes the three) · `ErrorBoundary` ·
`SkipToContent` · `SectionWrapper` / `PageContainer` (padding/max-width
enforcement every section will use).

---

## Assets you still need to add

### Files

| Asset | Expected path | Notes |
|---|---|---|
| Resume | `public/resume.pdf` | Source data says this is genuinely still pending |
| AyurHerb / PrePit AI GitHub repo URLs | — | Confirmed to exist in the source material, but no actual link text was given anywhere |
| Favicon | `public/favicon/favicon.ico`, `icon.svg`, `apple-touch-icon.png` | See `public/favicon/README.md` |
| `ANTHROPIC_API_KEY` value | Vercel project env vars | Route (`api/chat.ts`) is implemented; needs your actual key |
| `VITE_EMAILJS_*` values | Vercel project env vars | Route is implemented; needs your actual EmailJS credentials |

Resolved since first flagged: Geist and JetBrains Mono are now loaded
directly from Google Fonts (see `index.html`'s `<link>` tags) rather than
self-hosted — both are confirmed genuinely hosted there
(fonts.google.com/specimen/Geist and .../JetBrains+Mono), so this is the
same typography, not a substitute, and no local font files are needed at
all. This is also what fixed the production 404s these files were
causing (`public/fonts/` never existed). Profile photo, AyurHerb
screenshots, the PrePit AI architecture diagram, all 5 certificate PDFs,
and the OG image (`public/og-image.png`, generated from the real photo)
are also now in the repo — see the changelog above.

### Known content gaps (facts, not files)

| Gap | Where | Why it's blank |
|---|---|---|
| PrePit AI / AyurHerb GitHub repo URLs | `data/currentlyBuilding.ts`, `data/projects.ts` | Confirmed to exist, URL not given |
| Phone number | Not added anywhere | Provided in the source data, but no approved doc specifies a public phone field for Contact — left out pending an explicit decision |

### Resolved this round (previously flagged, now fixed)

- **All 5 certificates are now complete.** Android Application Development
  (Ardent Computech, Feb 4–12 2025, ID `ARDENT/132955`) was the last one
  missing a file — it's now got a verified date, credential ID,
  verification link, and downloadable PDF like the other four.
- **Fixed a leftover inconsistency**: `data/codingProfiles.ts`'s LeetCode
  card still said "183+ problems solved" after `data/leetcodeStats.ts` had
  already been corrected to the verified 25 — now both agree.
- **Phone number** is now included in Contact — this round's brief
  explicitly asked for it, which is the direct decision that was pending.

---

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/): `feat:`,
`fix:`, `chore:`, `docs:`, `refactor:`, `perf:` (Architecture §21.2). No
enforcement tooling — this is a personal-project discipline, not a CI gate.

First commit, once you've reviewed the code:

```bash
git init
git add -A
git commit -m "chore: scaffold production-ready project foundation"
```

---

## Deployment (Vercel)

Connect the repository; `main` deploys to production, every branch/PR gets
a preview URL. `vercel.json` includes a SPA rewrite (everything except
`/api/*` falls back to `index.html`) so client-side routing works correctly
once React Router is actually wired up. Set `ANTHROPIC_API_KEY` and the
public `VITE_*` variables in Vercel's project settings before deploying.

---

## What's next

Sections are built next, in the approved Information Architecture order
(Architecture §3): Hero → About → Journey → Featured Projects → Currently
Building → Skills → Programming Proficiency → Coding Profiles → LeetCode
Statistics → Certificates → Ask Arpan AI → Contact. Each section folder
under `src/sections/` currently has a placeholder `README.md` pointing to
its Architecture Documentation section.

---

## License

MIT — see `LICENSE`.
