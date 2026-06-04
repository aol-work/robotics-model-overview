# Robotics World Models — Interactive Overview

An interactive overview of robotics foundation model architectures. You start
with a single "Robotics Foundation Model" rectangle and click your way into the
details. This is the first demo layer; visual polish and deeper layers come
later.

## What it does

- Renders a base **Robotics Foundation Model** rectangle (SVG).
- On hover, two architecture choices appear:
  - **Unified World Model** — the shape stays as a single rectangle.
  - **Cascaded** — the shape splits into a left half (**World Model**) and a
    right half (**Action Model**).
- A **Reset** button lets you go back and pick a different architecture.

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- SVG for the shapes (crisp, easy hover/click, trivial to split rectangles)

## Getting started

```bash
npm install
npm run dev      # start the local dev server (http://localhost:5173)
npm run build    # type-check + produce static assets in dist/
npm run preview  # preview the production build locally
```

The `dist/` output is fully static and can be hosted on any static host
(GitHub Pages, Netlify, Cloudflare Pages, etc.).

## Editing the copy

All user-facing strings live in a single file so wording can change without
touching component logic:

- [`src/content/strings.ts`](src/content/strings.ts)

## Project structure

```
src/
  content/
    strings.ts            # single source of truth for all copy
  components/
    Diagram.tsx           # stage + selection state (none/unified/cascaded)
    FoundationModelNode.tsx # base rectangle + hover-revealed choices
    UnifiedShape.tsx      # single world-model rectangle
    CascadedShape.tsx     # split world-model / action-model rectangle
    shapes.ts             # shared SVG geometry / layout constants
  App.tsx                 # layout shell (title + diagram)
  App.css                 # diagram + layout styling
  index.css               # theme variables and base styles
```
