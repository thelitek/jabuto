# 6. Vite+ as the toolchain

Status: accepted, 2026-11-26

## Context
We need a dev server, bundler, test runner, linter and formatter; fewer tools are better.

## Decision
Vite+ (`vp`, MIT): Vite, Vitest, Oxlint and Oxfmt in one dependency. Exact version pinned. Playwright separately for the web build.

## Consequences
Two dev dependencies instead of four or five. Vite+ reached 1.0 on 2026-09-28 and ships pinned forks, so upgrades are deliberate. Falling back to plain Vite + Vitest + Oxlint is a configuration change, not a rewrite.
