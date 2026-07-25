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
    rollupOptions: {
      output: {
        // Forward-configured per Architecture §17 (Bundle optimization).
        // These groupings have nothing to chunk yet since Hero/AskArpanAI
        // aren't built — the config is correct and ready for when they are,
        // so no vite.config.ts change is needed at that point.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router')) {
            return 'vendor-react';
          }
          if (id.includes('@splinetool')) {
            return 'vendor-spline';
          }
          if (id.includes('gsap')) {
            return 'vendor-gsap';
          }
          return 'vendor';
        },
      },
    },
  },
});
