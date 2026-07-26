import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// The `@` alias mirrors tsconfig.app.json's `paths` exactly — the two are
// kept as manually-synced entries (rather than a tsconfig-reading plugin
// like vite-tsconfig-paths) to avoid an extra dependency for something this
// small. If you add or rename the alias, update both files.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Bug fix: "does not provide an export named 'SiXxx'" at dev-server
  // runtime is a known class of Vite issue with very large re-export
  // barrel files (react-icons/si alone has 3000+ named exports) — Vite's
  // esbuild-based dependency pre-bundler can fail to fully resolve every
  // named export when it discovers the module on-demand rather than
  // upfront. Listing both react-icons subpaths actually used in this
  // project here forces Vite to pre-bundle them eagerly and completely
  // before the app ever imports from them, which is the documented fix
  // for this category of error.
  optimizeDeps: {
    include: ['react-icons/pi', 'react-icons/si'],
  },
  build: {
    // No custom manualChunks here — see git history / README for why one
    // existed and was removed. It grouped vendor packages by naive
    // substring matching (react-dom/react/react-router → one chunk;
    // gsap → another; @splinetool → another; everything else, including
    // framer-motion, lenis, and react-icons → a separate generic chunk).
    // framer-motion creates React Context objects at module-evaluation
    // time (for AnimatePresence/MotionConfig/etc.), and it's used in
    // nearly every component in this project — putting it in a
    // DIFFERENT chunk than react/react-dom, with no explicit dependency
    // edge between them, doesn't guarantee the React chunk finishes
    // executing before framer-motion's module code runs. That's the
    // production-only "Cannot read properties of undefined (reading
    // 'createContext')" crash: works in dev (Vite serves native ES
    // modules with no chunk reordering) and breaks specifically once
    // code-splitting is in play. Vite/Rollup's DEFAULT chunking (no
    // manualChunks function at all) analyzes the actual import graph and
    // doesn't have this hazard — trusted over a hand-rolled heuristic
    // that's already caused one production outage.
  },
});
