import { defineConfig } from 'vite-plus';

export default defineConfig({
  // Relative asset paths: the same build runs from GitHub Pages sub-paths and inside Capacitor.
  base: './',
  build: {
    target: 'es2022',
  },
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
  lint: {
    ignorePatterns: ['dist/**', 'android/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    singleQuote: true,
    ignorePatterns: ['android/**', 'docs/**/*.dc.html', 'CHANGELOG.md'],
  },
});
