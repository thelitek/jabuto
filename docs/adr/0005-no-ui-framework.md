# 5. No UI framework: light-DOM custom elements and signals

Status: accepted, 2026-11-26

## Context
About six screens, mostly static; during a session only one numeral changes. The app must feel like a static page with no layout jumps.

## Decision
One light-DOM custom element per screen (no shadow DOM, so the shared typography applies everywhere). A small router on `history.pushState` with a single swap function. State in `@preact/signals-core`; screens build their DOM once from `<template>`s and bind nodes with `effect`. User text only through `textContent`.

## Consequences
One runtime dependency besides Capacitor. No templating library, so lists are built by hand. Screen transitions can be added later with the View Transitions API inside the swap function.
