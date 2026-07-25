/**
 * First focusable element on the page, per Architecture §20 — invisible
 * until it receives keyboard focus, then jumps straight to <main>.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip-link focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
    >
      Skip to content
    </a>
  );
}
