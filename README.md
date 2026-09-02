# The System — DSA ascension

A personal, Solo Leveling–style trainer for data structures and algorithms. Thirteen gates, 54 concepts, 32 patterns, ~280 LeetCode problems, a daily quest engine that adapts to what you miss, spaced-repetition reviews, boss fights, a complexity trainer, a pattern-finder wizard, a mistake log, and an in-browser Python/JavaScript scratchpad.

Everything runs in the browser. Progress is saved in `localStorage`; export a backup from Settings.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Other scripts

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build
npm run check      # content integrity check (ids, cross-references, decision tree)
npm run typecheck
```

## Deploy to GitHub Pages

1. Create a GitHub repository and push this folder to the `main` branch.
2. In the repo settings, open **Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push.

The app uses hash routing and a relative base path, so it works from any sub-path.

## Project layout

```
src/
  content/        all learning content (typed data)
    gates.ts      the 13 gates and their concept order
    concepts/     one file per gate: explanations, naive vs optimized code, problems
    patterns/     32 patterns with triggers, templates in 4 languages
    decision-tree.ts   "which pattern?" wizard
    complexity-quiz.ts 36 Big-O questions
  lib/
    scheduler.ts  daily quest generation, forecasts, spaced repetition intervals
    xp.ts         levels, ranks, XP values
    content.ts    aggregated lookups
  store/useApp.ts persisted app state and all actions
  pages/          one file per screen
  components/     shell, background, quest card, code tabs, system messages
scripts/check-content.ts   integrity check used by `npm run check`
```

## Editing content

Add or edit concepts in `src/content/concepts/<gate>.ts`. Keep ids in sync with `src/content/gates.ts`, use canonical pattern ids from `src/content/CONTENT_GUIDE.md`, and run `npm run check`.
