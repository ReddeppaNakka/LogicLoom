import type { Tech } from './stack-types'

// ---------------------------------------------------------------------------
// The five pieces that everything else in this app sits on top of.
// Every snippet below is real code from this repository, unedited except for
// trimming to the teaching point.
// ---------------------------------------------------------------------------

export const coreTech: Tech[] = [
  // -------------------------------------------------------------------------
  {
    id: 'typescript',
    name: 'TypeScript',
    version: '~5.8.3',
    category: 'language',
    order: 1,
    role: 'Describes the shape of every concept, problem and theme so the compiler catches a typo before the page renders.',
    what:
      'TypeScript is JavaScript with type annotations. You write the same code you would write in JavaScript, then add labels saying what kind of value each thing holds: a string, a number, an object with these exact fields. A compiler checks those labels and then strips them out, because the browser only ever runs plain JavaScript.',
    why:
      'This app is mostly data. Fifty-four concepts, each with a dozen optional sections. Plain JavaScript would let a missing field slip through and blow up only when you opened that one page. A type error appears while you type instead. The cost is real: you write more code, some type errors are cryptic, and a build step now stands between you and running the app. For a solo project this size the trade is worth it. For a 50-line page it would not be.',
    howUsedHere:
      "The content model lives in `src/content/types.ts`. Every learning file is a typed array checked against it, so a concept missing `problems` fails `npm run typecheck` rather than rendering an empty page.\n\n`src/lib/appearance.ts` uses **union types** for the small closed sets. `ThemeId` is one of nine literal strings and nothing else. That single line is what makes the theme picker impossible to get wrong: pass `'crimson'` and it compiles, pass `'crimsonn'` and it does not.\n\n`src/components/ui.tsx` types the shared building blocks. `Panel` takes `HTMLAttributes<HTMLDivElement>` plus its own `variant`, so it accepts every normal `div` attribute for free while still constraining the app-specific props. `Button` does the same with `ButtonHTMLAttributes`.\n\n`tsconfig.app.json` turns on `strict`, plus `noUnusedLocals` and `noUnusedParameters`. Those last two are why there are no dead imports anywhere in `src/`. The build refuses them.\n\nRemember that types are erased. Nothing in the shipped bundle knows what a `Concept` is.",
    snippets: [
      {
        label: 'Unions and interfaces describe the content',
        file: 'src/content/types.ts',
        code: `export type Lang = 'python' | 'javascript' | 'java' | 'cpp'

/** Code in several languages. Python is required; others are optional but preferred. */
export interface CodeBlock {
  python: string
  javascript?: string
  java?: string
  cpp?: string
}

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

/** Learning order within a concept, independent of the platform's own difficulty label. */
export type Tier = 'beginner' | 'intermediate' | 'advanced'`,
        note:
          "Two ideas here. A union type such as `'easy' | 'medium' | 'hard'` is a set of allowed values, so the compiler rejects anything outside it. The `?` on `javascript` marks the field optional: Python must exist, the rest may be missing, and any code reading `block.javascript` is forced to handle `undefined`.",
      },
      {
        label: 'A tuple type pins an exact shape',
        file: 'src/lib/appearance.ts',
        code: `export interface ThemeDef {
  id: ThemeId
  name: string
  note: string
  light: boolean
  /** Swatch colours for the picker: page, surface, accent, text. */
  swatch: [string, string, string, string]
}

export const THEMES: ThemeDef[] = [
  { id: 'shadow', name: 'Shadow Monarch', note: 'Near-black with electric blue. The original.', light: false, swatch: ['#05070a', '#10161f', '#4da3ff', '#dfe7e0'] },`,
        note:
          '`swatch` is a tuple, not `string[]`. It must hold exactly four entries, so the picker can index `swatch[3]` with no runtime check. `id: ThemeId` ties each entry back to the union, which is what guarantees a matching CSS block exists in `global.css`.',
      },
      {
        label: 'A typed helper the whole UI leans on',
        file: 'src/components/ui.tsx',
        code: `import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from 'react'
import type { Rank, Difficulty } from '@/content/types'
import { rankColor, rankTitle } from '@/lib/xp'
import { glossOf, KANJI } from '@/lib/kanji'
import { useApp } from '@/store/useApp'

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')`,
        note:
          "`import type` says these imports are types only, so the bundler deletes the line entirely. `cx` takes any number of arguments that may be a string or a falsy value, drops the falsy ones and joins the rest. That signature is what lets call sites write `cond && 'some-class'` inline without TypeScript complaining.",
      },
      {
        label: 'The compiler settings that shape the codebase',
        file: 'tsconfig.app.json',
        code: `    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }`,
        note:
          '`noEmit` is the giveaway that TypeScript never produces the JavaScript here. Vite does that, and `tsc` only checks. `jsx: "react-jsx"` is why no file imports React just to write JSX. `paths` is what makes `@/components/ui` resolve, and note that Vite needs the same alias declared again in `vite.config.ts`.',
      },
    ],
    teaches: [
      'A type is a claim about a value that a machine can check for you.',
      'Union types turn a set of magic strings into something the editor can autocomplete and the compiler can verify.',
      'Optional fields marked with `?` push you to handle the missing case at every read site.',
      'Types disappear at build time. They are a development tool, not a runtime feature.',
      'Extending built-in DOM prop types lets a custom component accept everything the underlying element does.',
    ],
    tryThis: [
      "Open `src/lib/appearance.ts` and add `'sunset'` to the `ThemeId` union but not to `THEMES`. Run `npm run typecheck` and read the error. It points at the array, not the union.",
      'In `src/content/types.ts`, delete the `?` from `javascript` in `CodeBlock`. Typecheck, and count how many concept files suddenly fail.',
      'In `src/components/ui.tsx`, pass `variant="gold"` to `Button` instead of `Panel`. The editor underlines it before you save.',
      'Add `const unused = 1` inside any component and run `npm run typecheck`. `noUnusedLocals` rejects it, which is why the repo carries no dead code.',
    ],
    gotchas: [
      'Type checking and building are separate. `npm run dev` will happily serve code with type errors, because Vite strips types without checking them. Run `npm run typecheck` yourself.',
      'The `@/` alias must be declared twice: in `tsconfig.app.json` under `paths` and in `vite.config.ts` under `resolve.alias`. Set one and not the other, and the editor is happy while the app fails to load.',
      '`noUnusedLocals` treats a half-finished refactor as an error. Comment out the import, not just the usage.',
      'A type says nothing about runtime. Data typed as `Concept` is only really a `Concept` because a human wrote it correctly. Nothing validates it when the app runs.',
    ],
    docs: [
      { label: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
      { label: 'Everyday Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
      { label: 'tsconfig reference', url: 'https://www.typescriptlang.org/tsconfig' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'react',
    name: 'React',
    version: '^19.1.0',
    category: 'framework',
    order: 2,
    role: 'Turns the app state into the page, and keeps them in step as you click, scroll and answer quiz questions.',
    what:
      'React is a library for building a user interface out of functions. Each function is called a component. It takes some data and returns a description of what should be on screen. When the data changes, React runs the function again, compares the new description with the old one, and edits only the parts of the real page that differ.',
    why:
      'The alternative is finding elements by hand and setting their text and classes yourself. That works for one widget and falls apart across the thirteen sections of a concept page. React lets you say what the page should look like for a given state and stop tracking how it got there. The price is a mental model that is genuinely strange at first. Re-running your whole function on every keystroke sounds wasteful, and the rules of hooks have to be learned rather than reasoned out.',
    howUsedHere:
      '`src/main.tsx` mounts the whole app once with `createRoot`, wrapped in `React.StrictMode`. Everything below that is function components. There is not a single class component in `src/`.\n\nState lives in three places. Local, throwaway state uses `useState`: the current frame in `VisualWalkthrough`, the picked answers in `ConceptQuiz`, both in `src/components/ConceptSections.tsx`. Shared state lives in a Zustand store and is read through the `useApp` selector hook, as in `src/pages/ConceptPage.tsx`. Anything derivable is computed during render instead of stored.\n\n`useMemo` guards the expensive derivations. `ConceptPage` builds its table-of-contents array and its tier grouping inside `useMemo` keyed on the concept, so scrolling does not rebuild them.\n\n`useEffect` is reserved for stepping outside React. `src/components/TableOfContents.tsx` subscribes to `scroll` and `resize`, and returns a cleanup function that removes both listeners and cancels the pending animation frame. `ConceptPage` uses another to scroll to a hash target after mount, and `src/components/Shell.tsx` uses one to push the theme onto `<html>`.\n\nProps flow down. Nothing writes to a parent directly.',
    snippets: [
      {
        label: 'Mounting the app, once',
        file: 'src/main.tsx',
        code: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)`,
        note:
          'The entire app hangs off one empty `<div id="root">` in `index.html`. Notice CSS being imported from a JavaScript file: that is a bundler feature, not a browser one. `StrictMode` deliberately runs effects twice in development to expose missing cleanup.',
      },
      {
        label: 'Local state with useState',
        file: 'src/components/ConceptSections.tsx',
        code: `/** Frame-by-frame ASCII walkthrough with prev/next controls. */
export function VisualWalkthrough({ frames }: { frames: VisualFrame[] }) {
  const [i, setI] = useState(0)
  const f = frames[i]
  return (
    <Panel variant="system" corner className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)]">
        <Eyebrow system>
          Frame {i + 1} of {frames.length}
        </Eyebrow>
        <div className="flex items-center gap-1">
          <button className="btn btn-xs btn-ghost" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} aria-label="Previous frame">
            <ChevronLeft size={14} />
          </button>
          <button className="btn btn-xs btn-ghost" onClick={() => setI((v) => Math.min(frames.length - 1, v + 1))} disabled={i === frames.length - 1} aria-label="Next frame">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>`,
        note:
          'One number is the entire state. `f` is derived from it during render rather than stored alongside it. `setI((v) => ...)` is the updater form: it receives the current value instead of reading `i` out of the closure, which is the safe way to write state that depends on state.',
      },
      {
        label: 'useMemo for a derived list',
        file: 'src/pages/ConceptPage.tsx',
        code: `  const toc = useMemo<TocItem[]>(() => {
    if (!c) return []
    const items: TocItem[] = []
    const add = (id: string, label: string, present: boolean) => {
      if (present) items.push({ id, label })
    }
    add('definition', 'Definition', Boolean(c.definition || c.summary))
    add('intuition', 'Intuition', Boolean(c.analogy))
    add('visual', 'Visual walkthrough', Boolean(c.visual?.length))
    add('core', 'Core concept', Boolean(c.explanation))
    add('pseudocode', 'Pseudocode', Boolean(c.pseudocode))
    add('code', 'Code', Boolean(c.naive || c.optimized))
    add('complexity', 'Complexity', Boolean(c.complexity?.length))
    add('dry-run', 'Dry run', Boolean(c.dryRun))
    add('mistakes', 'Common mistakes', Boolean(c.mistakes?.length))
    add('when', 'When to use', Boolean(c.whenToUse?.length))
    add('related', 'Related topics', Boolean(c.relatedTopics?.length || c.patternIds.length))
    add('practice', 'Practice', c.problems.length > 0)
    add('quiz', 'Quiz', Boolean(c.quiz?.length))
    return items
  }, [c])`,
        note:
          'The dependency array `[c]` is the whole point. This rebuilds only when the concept changes, not on every scroll-driven re-render. Identity matters too: `toc` keeps the same array reference between renders, which stops the effect inside `TableOfContents` from resubscribing constantly.',
      },
      {
        label: 'useEffect and its cleanup',
        file: 'src/components/TableOfContents.tsx',
        code: `    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])`,
        note:
          'Every subscription an effect opens, its returned cleanup must close. Miss this and listeners pile up on every navigation. The `frame` guard means a burst of scroll events schedules at most one measurement per animation frame.',
      },
    ],
    teaches: [
      'A component is a function from data to a description of the screen. You never touch the DOM directly.',
      'State is what changes. Everything computable from state should be computed, not stored.',
      'Effects are the escape hatch to the world outside React, and every effect that subscribes must unsubscribe.',
      'A dependency array is about identity, not equality. New arrays and functions look changed on every render.',
      'Data flows down through props. A child changes a parent only by calling a function the parent handed it.',
    ],
    tryThis: [
      'In `src/components/ConceptSections.tsx`, change `useState(0)` in `VisualWalkthrough` to `useState(1)` and open a concept with a visual walkthrough. The page starts on frame two.',
      'In `src/components/TableOfContents.tsx`, delete the returned cleanup function, then navigate between five concepts and scroll. Watch the page get slower as listeners accumulate.',
      'In `src/pages/ConceptPage.tsx`, change the `useMemo` dependency array from `[c]` to `[]`. Navigate between two concepts and see the table of contents go stale.',
      'Add a `console.log` at the top of `ConceptPage` and open the page. In development you will see it twice per change. That is `StrictMode` in `src/main.tsx`.',
    ],
    gotchas: [
      'State updates are asynchronous. Reading the state variable straight after calling its setter gives you the old value. Use the updater form, as `VisualWalkthrough` does.',
      'StrictMode mounts, unmounts and remounts every component in development. An effect that only works the first time is a bug it is designed to reveal, not a bug it causes.',
      'An object or array built inline during render is a new value every time. Put it in `useMemo` before using it as an effect dependency, which is exactly why `toc` is memoised.',
      'Every item in a `.map` needs a stable `key`. Using the array index breaks as soon as the list reorders.',
    ],
    docs: [
      { label: 'React: Describing the UI', url: 'https://react.dev/learn/describing-the-ui' },
      { label: 'You Might Not Need an Effect', url: 'https://react.dev/learn/you-might-not-need-an-effect' },
      { label: 'Hooks reference', url: 'https://react.dev/reference/react/hooks' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'vite',
    name: 'Vite',
    version: '^7.0.0',
    category: 'build',
    order: 3,
    role: 'Runs the dev server with instant reloads, and bundles the whole app into static files GitHub Pages can serve.',
    what:
      'A browser cannot run TypeScript, cannot run JSX, and does not understand an import path like `@/components/ui`. Vite is the tool that translates all of it. In development it serves your files one at a time as native modules, so startup is near-instant and a save updates only the module you touched. For production it bundles everything into a handful of hashed JavaScript and CSS files in `dist/`.',
    why:
      'This app is a static site with no backend, so it needs a bundler and nothing more. No server framework, no rendering step. Vite gives that with almost no configuration, and its dev server does not get slower as the app grows, which matters when there are 54 content files. The trade-off is that dev and production use different engines under the hood, so a bug can appear only in `npm run build`. Any real deploy should be checked with `npm run preview`, not just `npm run dev`.',
    howUsedHere:
      '`index.html` is the real entry point, not a template. It is an ordinary HTML file with an empty root div and one module script pointing at `/src/main.tsx`. Vite rewrites that script tag at build time to point at the hashed bundle.\n\n`vite.config.ts` sets four things. `base: \'./\'` makes every asset URL relative, which is what lets the built site work from a GitHub Pages subpath. The React plugin handles JSX and fast refresh. The Tailwind plugin compiles the stylesheet. `resolve.alias` maps `@` to `src`, mirroring `tsconfig.app.json`.\n\nThe `build.rollupOptions.manualChunks` block splits `three`, `@monaco-editor/react` and `recharts` into their own files. Those three are large and only some pages need them, so bundling them separately keeps the first load small.\n\n`src/App.tsx` does the other half of that work with `lazy()` and `Suspense`. Every page is its own dynamic `import()`, fetched the first time its route is visited.\n\n`package.json` wires it together. `build` runs `tsc -b` before `vite build`, so a type error stops the deploy.',
    snippets: [
      {
        label: 'The whole build configuration',
        file: 'vite.config.ts',
        code: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          monaco: ['@monaco-editor/react'],
          charts: ['recharts'],
        },
      },
    },
  },
})`,
        note:
          "`base: './'` is the line that makes GitHub Pages work. The default `'/'` would make the page look for assets at the domain root. `manualChunks` names three heavy libraries so they land in their own files instead of being welded into the main bundle.",
      },
      {
        label: 'index.html is the entry point',
        file: 'index.html',
        code: `    <title>The System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        note:
          'A browser cannot load a `.tsx` file. In development Vite intercepts this request and transforms the file on the fly. In the build it replaces the path with a hashed `.js` file and injects the stylesheet link. That empty root div is all the HTML the app ships with.',
      },
      {
        label: 'Route-level code splitting',
        file: 'src/App.tsx',
        code: `import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import { useApp } from './store/useApp'

const Onboarding = lazy(() => import('./pages/Onboarding'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Gates = lazy(() => import('./pages/Gates'))
const GateDetail = lazy(() => import('./pages/GateDetail'))
const ConceptPage = lazy(() => import('./pages/ConceptPage'))
const Patterns = lazy(() => import('./pages/Patterns'))
const PatternDetail = lazy(() => import('./pages/PatternDetail'))
const Calendar = lazy(() => import('./pages/Calendar'))`,
        note:
          '`import(...)` with parentheses is a function call that returns a promise, not a static import. Vite sees each one and emits a separate chunk. `lazy` wraps it for React, and the `Suspense` boundary further down this file shows the loading state while that chunk downloads.',
      },
      {
        label: 'The scripts that drive it',
        file: 'package.json',
        code: `  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit -p tsconfig.app.json",
    "check": "esbuild scripts/check-content.ts --bundle --platform=node --format=cjs --outfile=node_modules/.cache/check-content.cjs --log-level=error && node node_modules/.cache/check-content.cjs"
  },`,
        note:
          '`build` is two commands. Type-check the project, then bundle. The `&&` means a type error aborts before anything is written to `dist/`. `preview` serves the built output, which is the only honest way to test what will actually deploy.',
      },
    ],
    teaches: [
      'The browser runs one language. Everything else exists because a build step translates it.',
      'Development speed and production output are different problems, and modern tools solve them with different engines.',
      'Code splitting means shipping the code for the page you are on, not the whole app.',
      'Asset paths are relative or absolute, and getting that wrong is the classic works-locally, blank-on-deploy bug.',
      'Path aliases must be configured for both the type checker and the bundler. Neither one reads the other.',
    ],
    tryThis: [
      'Run `npm run build`, then look inside `dist/assets/`. Find the separate `three`, `monaco` and `charts` files that `manualChunks` produced.',
      "Change `base: './'` to `base: '/'` in `vite.config.ts`, rebuild, and open `dist/index.html` straight from the file system. It renders nothing, because every asset URL now points at the wrong place.",
      'Open the browser Network tab, load the dashboard, then click through to a concept page. Watch a new JavaScript chunk arrive at that moment. That is `lazy()` in `src/App.tsx` working.',
      'Add a deliberate type error in any page, then run `npm run build`. It stops at `tsc -b` and never reaches Vite.',
    ],
    gotchas: [
      '`npm run dev` does not type check. Vite strips types without validating them, so code with real type errors runs fine locally and only fails in `npm run build`.',
      'Anything referenced only inside a string is invisible to the bundler. Files that must ship untouched belong in `public/` and are referenced from the site root.',
      'The `@` alias exists in two files. Adding a new alias to `vite.config.ts` alone gives an editor error. Adding it to `tsconfig.app.json` alone gives a runtime failure.',
      '`vite preview` serves `dist/`, not your source. Forgetting to rebuild first means you are previewing the previous version.',
    ],
    docs: [
      { label: 'Vite guide', url: 'https://vite.dev/guide/' },
      { label: 'Building for production', url: 'https://vite.dev/guide/build.html' },
      { label: 'Config reference', url: 'https://vite.dev/config/' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    version: '^4.1.11',
    category: 'styling',
    order: 4,
    role: 'Supplies the layout and spacing classes in the markup, and hands its colour tokens over to the nine swappable themes.',
    what:
      'Tailwind is a set of very small CSS classes, each doing one thing. `flex` sets display to flex, `px-4` sets horizontal padding, `text-muted` sets a colour. You compose them in the `className` attribute instead of writing a stylesheet and inventing names for things. Tailwind then scans your source and emits only the classes you actually used.',
    why:
      'Naming things is the hard part of CSS, and a project like this has hundreds of one-off arrangements that do not deserve names. Utilities also keep the style next to the markup, so deleting a component deletes its styling with it. The honest cost is noisy markup, since some lines here carry a dozen classes, and you must learn the vocabulary before you can read it. Genuinely reusable pieces still get real CSS classes in `global.css`: `.panel`, `.btn`, `.eyebrow`, `.prose-sys`.',
    howUsedHere:
      'There is **no `tailwind.config.js`** in this project. Tailwind v4 is configured in CSS. `src/styles/global.css` starts with `@import "tailwindcss"` and then an `@theme` block that defines the design tokens. The Tailwind plugin listed in `vite.config.ts` compiles it.\n\nThe theming trick is one step. Each Tailwind colour token points at a CSS custom property rather than a literal colour, as in `--color-system: var(--accent)`. Separately, each theme block, `:root[data-theme="crimson"]` and eight others, redefines `--accent-rgb`, `--bg`, `--fg` and friends. So writing `text-system` in any component resolves through whichever theme is currently set.\n\nSwitching a theme is therefore one attribute write. `applyAppearance` in `src/lib/appearance.ts` sets `data-theme` on `<html>`, and every colour in the app changes with no React re-render at all. The same function pushes `--reading-size` and `--reading-width` as inline custom properties.\n\nWhere no token exists, components reach into the variables directly with arbitrary values. `bg-[rgb(var(--accent-rgb)/0.1)]` appears throughout `src/components/Shell.tsx` and `ui.tsx`, and `cx` in `ui.tsx` composes those class strings conditionally.',
    snippets: [
      {
        label: 'Tokens defined in CSS, not a config file',
        file: 'src/styles/global.css',
        code: `@theme {
  --color-ink: var(--bg);
  --color-ink-2: var(--surface-raised);
  --color-ink-3: var(--surface-sunken);
  --color-bone: var(--fg);
  --color-bone-dim: var(--fg-dim);
  --color-muted: var(--fg-muted);
  --color-system: var(--accent);
  --color-system-2: var(--accent-bright);
  --color-vermilion: var(--danger);
  --color-ember: var(--warn);
  --color-gold: var(--gold);
  --color-jade: var(--good);
  --color-violet: var(--violet);`,
        note:
          'This is the whole Tailwind colour configuration. `--color-system` generates `text-system`, `bg-system`, `border-system` and the rest. Crucially the value is `var(--accent)`, not a hex code, so each utility is a pointer rather than a fixed colour.',
      },
      {
        label: 'A theme is just a block of variables',
        file: 'src/styles/global.css',
        code: `/* ---------- Default theme: Shadow Monarch ---------- */
:root,
:root[data-theme="shadow"] {
  color-scheme: dark;
  --bg: #05070a;
  --bg-2: #0a0e14;
  --fg: #dfe7e0;
  --fg-dim: #aab4ad;
  --fg-muted: #78837c;
  --fg-rgb: 223 231 224;
  --accent-rgb: 77 163 255;
  --accent-bright: #7cc0ff;
  --danger: #e0231c;
  --warn: #ff5a3c;
  --gold: #c9a24a;
  --good: #5fd4a2;`,
        note:
          'Eight more blocks like this exist, one per `ThemeId`. Note `--accent-rgb` stored as bare channel numbers. That form lets any component build a translucent version with `rgb(var(--accent-rgb)/0.1)` without needing a separate variable for every opacity.',
      },
      {
        label: 'Switching every colour with one attribute',
        file: 'src/lib/appearance.ts',
        code: `export const getTheme = (id: ThemeId) => THEMES.find((t) => t.id === id) ?? THEMES[0]
export const getBackground = (id: BackgroundId) => BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0]

/** Push the parts of the appearance that live on <html> and :root. */
export const applyAppearance = (a: Appearance) => {
  const root = document.documentElement
  root.setAttribute('data-theme', a.theme)
  root.style.setProperty('--reading-size', READING_SIZES.find((s) => s.id === a.readingSize)?.px ?? '15px')
  root.style.setProperty('--reading-width', READING_WIDTHS.find((w) => w.id === a.readingWidth)?.value ?? '68ch')
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', getTheme(a.theme).swatch[0])
}`,
        note:
          'One `setAttribute` recolours the entire application. No component re-renders, no class name changes, and the CSS transition on `body` makes it fade rather than jump. This is the payoff for pointing Tailwind tokens at custom properties.',
      },
      {
        label: 'Composing classes conditionally',
        file: 'src/components/ui.tsx',
        code: `export function Chip({ children, tone, className }: { children: ReactNode; tone?: Difficulty | 'system'; className?: string }) {
  return <span className={cx('chip', tone && \`chip-\${tone}\`, className)}>{children}</span>
}

export function Bar({ value, tone, className }: { value: number; tone?: 'gold' | 'ember' | 'jade'; className?: string }) {
  return (
    <div className={cx('bar', tone && \`bar-\${tone}\`, className)}>
      <span style={{ width: \`\${Math.max(0, Math.min(100, value * 100))}%\` }} />
    </div>
  )
}

export function Button({ className, variant, size, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'system' | 'danger' | 'ghost'; size?: 'sm' | 'xs' }) {
  return <button className={cx('btn', variant && \`btn-\${variant}\`, size && \`btn-\${size}\`, className)} {...rest} />
}`,
        note:
          'These lean on hand-written classes from `global.css` because `chip`, `btn` and `bar` repeat everywhere and deserve names. The pattern to take away is the shape of the `cx` call: a base class, then conditional modifiers, then the `className` prop last so a caller can always override.',
      },
    ],
    teaches: [
      'CSS custom properties are the runtime layer of styling. JavaScript can change them, unlike compiled class names.',
      'Theming works best through indirection: components refer to roles such as accent, never to colours such as blue.',
      'Utility classes trade readable markup for the elimination of naming and of dead CSS.',
      'Storing a colour as bare RGB channels lets one variable serve every opacity you need.',
      'Repeated multi-property patterns still deserve a real class. Utilities and stylesheets are not mutually exclusive.',
    ],
    tryThis: [
      'Open DevTools, select the `<html>` element and change `data-theme="shadow"` to `data-theme="paper"` by hand. The app goes light without React doing anything.',
      'In `src/styles/global.css`, change `--accent-rgb` in the shadow block to `255 90 60`. Every `text-system`, active nav item and focus ring turns orange at once.',
      "In `src/components/ui.tsx`, add `'ring-2 ring-jade'` to the `cx` call inside `Button`, and watch every button in the app pick up a green ring.",
      'Search the repo for `bg-[rgb(var(--accent-rgb)` and pick one hit. Change its `0.1` to `0.4` and find out which element it was.',
    ],
    gotchas: [
      'Tailwind only emits classes it can see as complete strings in your source. Building a class name by concatenation at runtime produces a class that was never generated, so nothing happens.',
      'There is no `tailwind.config.js` in v4. Searching for one and not finding it is not a broken install. The configuration is the `@theme` block in `global.css`.',
      'A token defined in `@theme` and a variable defined in a `:root` block are different things. `@theme` creates the utility class; the `:root` block supplies the value it points at.',
      'Utility order in the class string does not decide which wins. CSS specificity does. That is why several places here use `!` prefixes, as in the quiz answer buttons in `ConceptSections.tsx`.',
    ],
    docs: [
      { label: 'Tailwind CSS docs', url: 'https://tailwindcss.com/docs' },
      { label: 'Theme variables (v4)', url: 'https://tailwindcss.com/docs/theme' },
      { label: 'MDN: CSS custom properties', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'react-router',
    name: 'React Router',
    version: '^7.6.0',
    category: 'routing',
    order: 5,
    role: 'Maps the URL to a page component, so every gate and concept has its own shareable address without a page reload.',
    what:
      'On a normal website each URL is a separate file the server sends back. This app is one file, so something has to decide which screen the current URL means. React Router is that something. You declare a list of paths and the component each one renders, and it swaps components as the address changes. No reload, no round trip to a server.',
    why:
      'Without it, every screen would be a piece of state, and the back button, bookmarks and shareable links would all break. The choice worth understanding is `HashRouter` over `BrowserRouter`. GitHub Pages serves static files: ask it for `/gates/arrays` and it looks for that folder, finds nothing, and returns a 404. Putting the route after a `#`, as in `/#/gates/arrays`, means the server only ever sees `/` and the browser hands the rest to JavaScript. The cost is uglier URLs and a hash you can no longer use for anything else.',
    howUsedHere:
      '`src/main.tsx` wraps the app in `HashRouter`. That single choice is why every link in the deployed app looks like `#/gates/arrays`.\n\n`src/App.tsx` holds the route table. Routes are nested: an outer `<Route element={<Shell />}>` with no path of its own wraps every page, so the sidebar and the background render once and only the inner content swaps. Two-segment paths use URL parameters, as in `/gates/:gateId`, `/learn/:conceptId` and `/boss/:questId`. The last route, `path="*"`, sends anything unrecognised back to the dashboard with `<Navigate replace />`, which avoids leaving a dead URL in history.\n\n`src/components/Shell.tsx` renders `<Outlet />` inside its `<main>`. That is the hole the matched child route fills. Its sidebar uses `NavLink`, whose `className` accepts a function receiving `isActive`, so the current page highlights itself. `useLocation` drives two effects there: closing the mobile menu and scrolling to the top on every path change.\n\n`src/pages/GateDetail.tsx` and `src/pages/ConceptPage.tsx` read their parameter with `useParams` and redirect when the id does not exist.',
    snippets: [
      {
        label: 'HashRouter at the root',
        file: 'src/main.tsx',
        code: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)`,
        note:
          'The router is a provider wrapping the whole tree, which is why `useParams` and `useLocation` work in any component below it without anything being passed down. Swap this one word to `BrowserRouter` and the app still works locally but 404s on GitHub Pages.',
      },
      {
        label: 'The route table, nested under a layout',
        file: 'src/App.tsx',
        code: `    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gates" element={<Gates />} />
          <Route path="/gates/:gateId" element={<GateDetail />} />
          <Route path="/learn/:conceptId" element={<ConceptPage />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/patterns/:patternId" element={<PatternDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/log" element={<Log />} />
          <Route path="/scratchpad" element={<Scratchpad />} />
          <Route path="/appearance" element={<AppearancePage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/boss/:questId" element={<Boss />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>`,
        note:
          'The outer `Route` has an `element` but no `path`. It is a layout route: it matches everything and renders `Shell` around whichever child matches. `:gateId` is a parameter, not a literal segment. `path="*"` is the catch-all and must come last.',
      },
      {
        label: 'NavLink knows when it is the current page',
        file: 'src/components/Shell.tsx',
        code: `          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cx(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] transition-all',
                  isActive ? 'bg-[rgb(var(--accent-rgb)/0.1)] text-bone' : 'text-bone-dim hover:text-bone hover:bg-[rgb(var(--fg-rgb)/0.04)]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <n.icon size={16} className={cx('shrink-0', isActive ? 'text-system' : 'text-muted group-hover:text-bone-dim')} />
                  <span className="flex-1">{n.label}</span>
                  <Jp text={n.jp} className="shrink-0 opacity-70" />
                </>
              )}
            </NavLink>
          ))}`,
        note:
          "`NavLink` accepts a function for both `className` and its children, handing each an `isActive` flag. `end={n.to === '/'}` matters: without it the `/` link would count as active on every page, since every path starts with a slash. Further down this file, `<Outlet />` is where the matched page renders.",
      },
      {
        label: 'Reading a URL parameter',
        file: 'src/pages/GateDetail.tsx',
        code: `export default function GateDetail() {
  const { gateId = '' } = useParams()
  const gate = getGate(gateId)
  const progress = useApp((s) => s.conceptProgress)
  const attempts = useApp((s) => s.attempts)
  if (!gate) return <Navigate to="/gates" replace />
  const cs = conceptsOfGate(gate.id)
  const probs = problemsOfGate(gate.id)
  const solved = probs.filter((p) => attempts[p.id]?.status === 'solved').length`,
        note:
          "`useParams` returns whatever the `:gateId` segment matched, typed as possibly undefined, hence the `= ''` default. The URL is user input, so the very next thing is a lookup and a redirect if it fails. `replace` swaps the bad URL out of history instead of stacking it up.",
      },
    ],
    teaches: [
      'The URL is application state, and treating it that way is what makes back, forward and bookmarks work.',
      'Nested layout routes let a shell render once while only the inner content changes.',
      'URL parameters are untrusted input. Always look them up and handle the miss.',
      'Hash routing versus history routing is a deployment decision, not a style preference.',
      'Client-side navigation swaps components in place. Nothing is fetched from a server and no in-memory state is lost.',
    ],
    tryThis: [
      'Add `<Route path="/about" element={<div>Hello</div>} />` inside the `Shell` route in `src/App.tsx` and visit `#/about`. It appears with the full sidebar around it.',
      "Remove `end={n.to === '/'}` from the `NavLink` in `src/components/Shell.tsx`. Every page now highlights Status as well as itself.",
      'Visit `#/gates/does-not-exist`. `GateDetail` redirects you to the gate list. Trace the `Navigate` element that did it.',
      'Change `HashRouter` to `BrowserRouter` in `src/main.tsx`, run `npm run dev`, navigate to a concept and hit refresh. The dev server copes; a static host would not.',
    ],
    gotchas: [
      'With `HashRouter` the browser hash is spent on routing. `ConceptPage` therefore cannot rely on native anchor jumping and runs its own effect on `useLocation().hash` to scroll a section into view.',
      'React Router does not scroll to the top on navigation. `Shell` does it explicitly in a `useEffect` keyed on `loc.pathname`. Without that you land halfway down a new page.',
      'Use `Link` and `NavLink`, never a bare `<a href>`. A plain anchor reloads the whole app and throws away in-memory state.',
      'Route order matters for the catch-all. `path="*"` placed above a real route will swallow it.',
    ],
    docs: [
      { label: 'React Router docs', url: 'https://reactrouter.com/' },
      { label: 'Picking a router', url: 'https://reactrouter.com/start/library/routing' },
      { label: 'NavLink API', url: 'https://reactrouter.com/api/components/NavLink' },
    ],
  },
]
