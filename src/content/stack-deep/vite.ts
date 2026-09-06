import type { TechDeep } from '../stack-types'

export const viteDeep: TechDeep = {
  analogy:
    'An old-style bundler is a chef who cooks the entire banquet before letting anyone sit down, and re-cooks it every time a guest changes their order. Vite in development is a kitchen that plates each dish the moment someone asks for it, and when one order changes, swaps only that plate. For the final production banquet it still cooks everything ahead, because a finished spread served all at once is faster to eat.',

  origins: `Vite (French for "fast", pronounced "veet") was created by **Evan You**, the author of Vue.js, and first released in **April 2020**. Version 2 in early 2021 made it framework-agnostic, and it has been the default build tool for Vue, Svelte, Solid, Astro, Remix and many React projects since.

The problem it attacked was startup time. Tools like webpack read every file in a project, resolve every import, and produce one bundle before the dev server can serve a single page. On a large app that meant thirty seconds to a few minutes on every cold start, and seconds on every save.

Two things had changed by 2020 that made a different design possible:

- **Browsers now understand ES modules natively.** A \`<script type="module">\` can \`import\` another file and the browser fetches it on demand. Bundling for development was no longer required.
- **esbuild** (written in Go by Evan Wallace of Figma) could transform TypeScript and JSX 10 to 100 times faster than JavaScript-based tools.

Vite combined them: serve source files as native modules, transform each one on request with esbuild, and reserve full bundling (via Rollup) for the production build where it still wins. Vite 7, the version here, runs on Node 20+ and is the point where Rolldown, a Rust rewrite of Rollup by the same team, becomes an opt-in bundler.`,

  concepts: [
    {
      title: 'Dev server: no bundle, just modules',
      body: `When you run \`npm run dev\`, Vite starts an HTTP server and serves \`index.html\`. The page has a \`<script type="module" src="/src/main.tsx">\`. The browser requests that file; Vite transforms it (strips types, compiles JSX) and returns JavaScript whose \`import\` lines are rewritten into URLs. The browser then requests each of those, and so on down the tree.

Only files actually imported by the current page are ever touched. A project with two thousand modules starts in the same few hundred milliseconds as a project with twenty.`,
      lang: 'html',
      code: `<!-- index.html: what the browser really receives in dev -->
<script type="module" src="/src/main.tsx"></script>

<!-- /src/main.tsx after Vite's transform. Note the rewritten imports -->
import React from "/node_modules/.vite/deps/react.js?v=8f2a1c"
import { createRoot } from "/node_modules/.vite/deps/react-dom_client.js?v=8f2a1c"
import App from "/src/App.tsx"
import "/src/styles/global.css"`,
    },
    {
      title: 'Dependency pre-bundling',
      body: `Serving \`node_modules\` file by file would be slow: lodash-es alone is six hundred modules, and many packages ship CommonJS that browsers cannot import. So on first start Vite scans your imports, finds third-party packages, and uses esbuild to **pre-bundle** each into a single ES module under \`node_modules/.vite/deps\`. That takes a second or two once and is cached until the lockfile changes.

Your own source files are never pre-bundled. They change constantly and are served one by one.`,
      lang: 'sh',
      code: `$ npm run dev
  VITE v7.0.0  ready in 412 ms
  ➜  Local:   http://localhost:5180/

# behind the scenes, once:
# scanning src/main.tsx ... 14 dependencies found
# pre-bundling react, react-dom, zustand, framer-motion, ...  (esbuild, ~900 ms)
# cached in node_modules/.vite/deps/`,
    },
    {
      title: 'Hot Module Replacement',
      body: `On save, Vite does not reload the page. It sends a message over a WebSocket naming the changed module. The client fetches the new version and swaps it in place. For React, the \`@vitejs/plugin-react\` plugin uses **Fast Refresh** to re-render the edited component while keeping its state, so a form you were filling in stays filled.

The change propagates up the import graph until it reaches a module that knows how to accept an update, called an HMR boundary. React components are boundaries. Edit a shared utility with no boundary above it and Vite falls back to a full reload.`,
      lang: 'ts',
      code: `// What the plugin injects into each component module (simplified)
if (import.meta.hot) {
  import.meta.hot.accept((next) => {
    // re-render this component with the new implementation,
    // preserving useState values
    refresh(next.default)
  })
}`,
    },
    {
      title: 'Production build with Rollup',
      body: `\`npm run build\` is a different pipeline. Vite hands the module graph to Rollup, which bundles everything into a few files, tree-shakes unused exports, minifies with esbuild, hashes filenames for cache-busting, and writes \`dist/\`. Native modules are not used here because hundreds of small requests are slower than a few large ones over real networks.

Dynamic \`import()\` calls become split points: each lazily-imported page becomes its own chunk that downloads only when routed to. That is how a heavy dependency such as Monaco stays out of the initial load.`,
      lang: 'sh',
      code: `$ npm run build
vite v7.0.0 building for production...
✓ 1842 modules transformed.
dist/index.html                    0.86 kB
dist/assets/index-BxT4k2.css      58.31 kB │ gzip: 11.2 kB
dist/assets/index-D8sWq1.js      312.40 kB │ gzip: 98.7 kB
dist/assets/ConceptPage-9aZ3.js   41.02 kB │ gzip: 12.1 kB   <- lazy route
dist/assets/Scratchpad-Kq7p.js    22.18 kB │ gzip:  7.4 kB   <- lazy route`,
    },
    {
      title: 'Plugins and the Rollup-compatible hook API',
      body: `Vite's plugin system is a superset of Rollup's. A plugin is an object with named hooks: \`resolveId\` decides what an import string points to, \`load\` provides a file's content, \`transform\` rewrites it. The React plugin adds JSX and Fast Refresh; the Tailwind plugin injects generated CSS; you can write one in ten lines.

Because the hooks are the same in dev and build, a plugin written once works in both modes.`,
      lang: 'ts',
      code: `// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    { // a ten-line plugin: import any .txt file as a string
      name: 'txt-loader',
      transform(code, id) {
        if (id.endsWith('.txt')) return 'export default ' + JSON.stringify(code)
      },
    },
  ],
  resolve: { alias: { '@': '/src' } },
})`,
    },
    {
      title: 'Assets, env and import.meta',
      body: `Importing a PNG gives you its final URL, hashed in production. Importing a CSS file injects it. \`import.meta.env.VITE_*\` exposes environment variables that start with the \`VITE_\` prefix (the prefix is a safety measure so a database password in \`.env\` cannot leak into the browser bundle). \`import.meta.glob\` imports a whole directory lazily, which is how some apps load every markdown file in a folder.`,
      lang: 'ts',
      code: `import logo from './logo.png'          // '/assets/logo-3f9a.png'
import './theme.css'                    // injected as a <style> / bundled

const api = import.meta.env.VITE_API_URL   // from .env, only VITE_ keys
const isDev = import.meta.env.DEV

const pages = import.meta.glob('./pages/*.tsx')   // { './pages/A.tsx': () => import(...) }`,
    },
  ],

  visual: {
    title: 'What happens when you save a file',
    intro: 'A dev server with the Status page open. You edit one component. Follow the change from disk to screen without a page reload.',
    frames: [
      {
        caption: 'Steady state. The browser has fetched only the modules the Status page imports, each transformed on request.',
        frame: `  browser                     vite dev server
  ┌──────────────────┐        ┌──────────────────────┐
  │ main.tsx         │ <----- │ transform on request │
  │  App.tsx         │        │ esbuild: ts, jsx     │
  │   Shell.tsx      │        │ cache: per file      │
  │   Status.tsx     │        │ watcher: chokidar    │
  │    Radar.tsx     │        └──────────────────────┘
  └──────────────────┘   websocket kept open  <====>`,
      },
      {
        caption: 'You save Radar.tsx. The file watcher fires and Vite invalidates that module in its cache.',
        frame: `  disk: src/components/Radar.tsx  (changed)
              │
              v
  server: invalidate  /src/components/Radar.tsx
          walk importers:  Status.tsx  ->  App.tsx ...
          nearest HMR boundary:  Radar.tsx itself
          (a React component accepts its own updates)`,
      },
      {
        caption: 'A small message goes down the WebSocket naming the module to update. No HTML is re-sent.',
        frame: `  ws message  ->  browser
  {
    "type": "update",
    "updates": [{
      "type": "js-update",
      "path": "/src/components/Radar.tsx",
      "timestamp": 1725600000000
    }]
  }`,
      },
      {
        caption: 'The client re-imports just that module with a fresh timestamp, and Fast Refresh swaps the component while keeping its state.',
        frame: `  browser
  import("/src/components/Radar.tsx?t=1725600000000")
       │
       v
  Fast Refresh:
    old Radar  ->  new Radar
    useState values ....... kept
    DOM ................... patched by React
  elapsed: ~40 ms`,
      },
      {
        caption: 'Production is the opposite shape: Rollup bundles the whole graph once into a few hashed files.',
        frame: `  npm run build
  src/ (1842 modules)
       │  rollup: resolve, tree-shake, split
       │  esbuild: minify
       v
  dist/assets/index-D8sWq1.js     (everything eager)
  dist/assets/ConceptPage-9aZ3.js (import() chunk)
  dist/assets/index-BxT4k2.css
  dist/index.html  -> <script src="/assets/index-D8sWq1.js">`,
      },
    ],
  },

  internals: `## Two engines, one config

Vite is best understood as a thin coordinator around two other tools. In development it uses **esbuild** for single-file transforms and dependency pre-bundling, because esbuild is written in Go and parallelises across cores. In production it uses **Rollup** because Rollup's output is smaller and its plugin ecosystem is mature, and tree-shaking across a whole graph is something esbuild does less thoroughly. The Rolldown project exists to replace both with one Rust engine; Vite 7 lets you opt into it.

## The module graph

The dev server keeps a \`ModuleGraph\`: a node per URL with its transformed code, its importers, its imported modules, and whether it accepts HMR. Every transform result is cached against the file's last-modified time. When the watcher reports a change, Vite marks that node stale and walks the importers to find the boundary that will accept the update. If it reaches the root without finding one, it sends a \`full-reload\` message instead.

## Import analysis

The important transform is not esbuild's; it is Vite's own **import analysis** plugin. After esbuild strips types, Vite parses the result's import statements with a fast lexer (\`es-module-lexer\`) and rewrites each specifier. A bare import like \`'react'\` becomes the pre-bundled path with a version hash. A relative import gets an absolute URL. A CSS import is turned into a request that returns JavaScript which injects a style tag. Timestamps are appended to force the browser past its cache after HMR.

## Pre-bundling in detail

On start, Vite runs esbuild over your entry files in a special "scan" mode that only records bare imports. It then bundles each discovered package into one ESM file, converting CommonJS to ESM on the way. The result is keyed by a hash of the lockfile and config, stored in \`node_modules/.vite\`, and reused across restarts. If a page later imports a dependency the scan missed, Vite discovers it at request time, pre-bundles it, and reloads the page once.

## HMR protocol

The client script Vite injects into \`index.html\` opens a WebSocket. Messages are small JSON objects: \`update\` with a list of changed paths, \`full-reload\`, \`prune\` for removed modules, and \`error\` which draws the red overlay. The client maintains its own map of \`import.meta.hot\` handlers registered by modules. On update it fetches the new module, then calls the accept callbacks with the new exports.

## Production pipeline

\`vite build\` creates a Rollup bundle with Vite's plugins attached. Rollup resolves the graph, marks unused exports for removal, and emits chunks according to the dynamic import boundaries plus any \`manualChunks\` you configure. Vite then post-processes: CSS is extracted per chunk, asset URLs are rewritten to hashed names, and a preload directive list is injected so a lazy chunk's CSS arrives with its JavaScript. The "chunk larger than 500 kB" warning you see in this repo's build output comes from this stage; it is advice, not an error.

## Why the alias must be declared twice

TypeScript's \`paths\` and Vite's \`resolve.alias\` are read by different programs. The compiler needs the alias to check imports; Vite needs it to serve them. Neither reads the other's config. Plugins such as \`vite-tsconfig-paths\` exist to bridge them, but declaring both is the common practice.`,

  buildIt: {
    title: 'A 30-line dev server in the Vite style',
    intro: 'Node has an HTTP server, esbuild has a transform function, and browsers understand modules. Combine them and you have the core idea of Vite. Run it with node server.mjs and open localhost:3000.',
    steps: [
      {
        title: 'Serve index.html with a module script',
        body: 'The page asks the browser to import a TypeScript file. The browser does not know it is TypeScript; it only sees a URL.',
        lang: 'html',
        code: `<!-- index.html -->
<div id="root"></div>
<script type="module" src="/src/main.ts"></script>`,
      },
      {
        title: 'Transform each request with esbuild',
        body: 'For any .ts or .tsx request, read the file, strip types, and return JavaScript. No bundling.',
        lang: 'js',
        code: `// server.mjs
import http from 'node:http'
import fs from 'node:fs/promises'
import { transform } from 'esbuild'

http.createServer(async (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url
  const path = '.' + url.split('?')[0]
  let body = await fs.readFile(path, 'utf8')
  if (/\\.tsx?$/.test(path)) {
    body = (await transform(body, { loader: 'tsx', format: 'esm' })).code
    body = body.replace(/from '(\\.\\/[^']+)'/g, (m, p) => 'from "' + p + '.ts"')
    res.setHeader('content-type', 'text/javascript')
  } else if (path.endsWith('.html')) res.setHeader('content-type', 'text/html')
  res.end(body)
}).listen(3000)`,
      },
      {
        title: 'Write two source modules',
        body: 'main imports xp. Watch the network tab: two separate requests, each transformed on demand.',
        lang: 'ts',
        code: `// src/xp.ts
export const xpFor = (minutes: number): number => Math.round(minutes * 1.5)

// src/main.ts
import { xpFor } from './xp'
document.getElementById('root')!.textContent = 'XP: ' + xpFor(90)`,
      },
      {
        title: 'Add the crudest possible HMR',
        body: 'Watch the source folder and push a message to the page over Server-Sent Events. Real Vite uses a WebSocket and swaps modules in place; this reloads, which is the fallback Vite also has.',
        lang: 'js',
        code: `import { watch } from 'node:fs'
const clients = new Set()
// in the request handler, before the file logic:
// if (url === '/__hmr') { res.setHeader('content-type','text/event-stream'); clients.add(res); return }
watch('./src', () => clients.forEach((c) => c.write('data: reload\\n\\n')))

// in index.html:
// <script>new EventSource('/__hmr').onmessage = () => location.reload()</script>`,
      },
    ],
  },

  inTheWild: [
    { who: 'Vue, Nuxt, SvelteKit, Astro, SolidStart, Qwik', what: 'Every one of these frameworks ships Vite as its build tool and dev server.' },
    { who: 'Remix and React Router 7', what: 'Remix dropped its own compiler for Vite in 2023; the framework mode of React Router 7 is a Vite plugin.' },
    { who: 'Storybook', what: 'Offers a Vite builder that most new projects choose over the webpack one for startup speed.' },
    { who: 'Shopify Hydrogen', what: 'Shopify\'s headless storefront framework builds on Vite.' },
    { who: 'Vitest', what: 'The test runner from the same team reuses Vite\'s transform pipeline so tests see exactly the code the app sees.' },
    { who: 'This app', what: 'Starts the dev server in under half a second, and produces the hashed dist/ folder that GitHub Actions deploys.' },
  ],

  alternatives: [
    { name: 'webpack', pick: 'A large legacy codebase with custom loaders that nobody wants to port. Slower, but the most configurable.' },
    { name: 'esbuild alone', pick: 'A library or a script where you need only a fast bundler and no dev server, plugins or CSS handling.' },
    { name: 'Parcel', pick: 'Zero-config bundling for a small site when you do not want to touch any configuration at all.' },
    { name: 'Next.js / Turbopack', pick: 'A React app that needs server rendering, file routing and API routes built in. Heavier, but batteries included.' },
    { name: 'Rspack', pick: 'A webpack-compatible Rust bundler for teams migrating a webpack config that want speed without rewriting.' },
  ],

  glossary: [
    { term: 'ES module', meaning: 'The standard JavaScript module format with import and export, understood natively by browsers.' },
    { term: 'Bundler', meaning: 'A tool that combines many modules into a few files for delivery.' },
    { term: 'esbuild', meaning: 'A very fast Go-based transformer and bundler Vite uses in development.' },
    { term: 'Rollup', meaning: 'The JavaScript bundler Vite uses for production builds.' },
    { term: 'Pre-bundling', meaning: 'Bundling each third-party dependency once into a single ESM file for the dev server.' },
    { term: 'HMR', meaning: 'Hot Module Replacement: swapping a changed module in the running page without a reload.' },
    { term: 'Fast Refresh', meaning: 'React\'s HMR integration that keeps component state across edits.' },
    { term: 'Tree-shaking', meaning: 'Dropping exports that nothing imports during the production bundle.' },
    { term: 'Code splitting', meaning: 'Emitting separate chunks at dynamic import() points so they load on demand.' },
    { term: 'Content hash', meaning: 'A fingerprint of a file\'s bytes put in its name so browsers can cache it forever.' },
  ],

  quiz: [
    {
      question: 'Why can Vite\'s dev server start in under a second on a project with thousands of modules?',
      options: ['It caches the last build on disk', 'It serves native ES modules and transforms only the files the browser actually requests', 'It uses a faster JavaScript engine', 'It skips TypeScript files'],
      answerIndex: 1,
      explanation: 'No bundle is produced in development. Each module is transformed on request, so startup cost is independent of project size.',
    },
    {
      question: 'What is dependency pre-bundling for?',
      options: ['Minifying node_modules', 'Turning each third-party package into one ESM file so the browser does not fetch hundreds of small modules', 'Checking types in dependencies', 'Removing unused dependencies'],
      answerIndex: 1,
      explanation: 'Packages such as lodash-es are hundreds of files and some are CommonJS. esbuild flattens each into a single browser-ready module, cached until the lockfile changes.',
    },
    {
      question: 'Which tool bundles the production build in Vite 7 by default?',
      options: ['esbuild', 'webpack', 'Rollup', 'Babel'],
      answerIndex: 2,
      explanation: 'esbuild handles transforms and minification; Rollup handles the graph-wide bundling and code splitting. Rolldown is the opt-in successor.',
    },
    {
      question: 'You edit a utility file imported by twenty components and the whole page reloads. Why?',
      options: ['Vite crashed', 'The utility is not an HMR boundary and neither is anything above it, so Vite falls back to full reload', 'Utilities are excluded from HMR by default', 'Twenty is over the HMR limit'],
      answerIndex: 1,
      explanation: 'HMR walks up importers looking for a module that accepts updates. React components accept their own; a plain module often does not, and a walk that reaches the root triggers a reload.',
    },
    {
      question: 'Why must environment variables start with VITE_ to be readable in the browser?',
      options: ['A naming convention only', 'A safety measure so secrets in .env are not accidentally inlined into the public bundle', 'Vite cannot parse other names', 'Browsers require a prefix'],
      answerIndex: 1,
      explanation: 'Everything in the bundle is public. The prefix is an explicit opt-in per variable.',
    },
  ],
}
