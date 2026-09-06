import type { TechDeep } from '../stack-types'

export const reactRouterDeep: TechDeep = {
  analogy:
    'A hotel with one front door and many rooms. The address on your key card (the URL) decides which room you are shown. Walk to a different room and the card updates, so you can tell a friend the number and they arrive in the same place. The building never rebuilds itself as you move; the concierge just swaps what is behind the door you are looking at. React Router is that concierge for a single-page app.',

  origins: `React Router was started in **2014** by **Ryan Florence** and **Michael Jackson**, two consultants who kept solving the same problem for clients: React rendered a page beautifully, but the browser's address bar did not know about it. Refresh, and you lost your place. Share a link, and it opened the home page.

The library went through several redesigns as the community learned what routing should feel like. Version 4 (2017) dropped the central route config in favour of \`<Route>\` as an ordinary component you could put anywhere. Version 6 (2021) brought back declarative nesting with \`<Routes>\` and \`<Outlet>\`, ranked matching instead of first-match, and relative links. Version 6.4 imported the data-loading ideas from **Remix**, the full-stack framework the same authors built, adding loaders and actions.

**Version 7** (November 2024) merged Remix into React Router entirely. The package now has three modes: *declarative* (just components, what this app uses), *data* (loaders, actions, pending states) and *framework* (file routing, server rendering, bundling via a Vite plugin). Same package, three levels of commitment.`,

  concepts: [
    {
      title: 'The URL is state you did not have to write',
      body: `In a plain React app, "which page am I on" would be a \`useState\` somewhere near the root. React Router makes the browser's address bar that state instead. Navigating updates the URL; the URL decides what renders. You get back button, forward button, refresh, bookmarks and shareable links for free, because those are the browser's features and the router speaks their language.

That is the whole purpose. Everything else in the library is about doing this well.`,
      lang: 'tsx',
      code: `// Without a router: state that vanishes on refresh
const [page, setPage] = useState<'status' | 'gates'>('status')

// With a router: the URL is the state
<Routes>
  <Route path="/status" element={<Status />} />
  <Route path="/gates" element={<Gates />} />
</Routes>
// visiting #/gates renders Gates; the back button works; links can be shared`,
    },
    {
      title: 'Client-side navigation and the History API',
      body: `A normal \`<a href>\` asks the server for a new document, which throws away your React tree. React Router's \`<Link>\` intercepts the click, calls \`history.pushState\` to change the URL without a request, and re-renders the matching route. The page never reloads, so state elsewhere on screen (a sidebar, a music player, a store) survives.

With **HashRouter**, used by this app, the route lives after a \`#\` in the URL. Browsers never send the hash to the server, so any static host serves \`index.html\` for every route with no configuration. That is the trade: slightly uglier URLs in exchange for zero server setup, which is what GitHub Pages needs.`,
      lang: 'tsx',
      code: `import { Link, useNavigate } from 'react-router-dom'

<Link to="/learn/two-pointers">Two pointers</Link>
// renders <a href="#/learn/two-pointers"> but handles the click itself

const navigate = useNavigate()
function onFinish() {
  navigate('/status', { replace: true })   // replace: no back-button entry
}`,
    },
    {
      title: 'Dynamic segments and params',
      body: `A path can contain placeholders. \`/learn/:conceptId\` matches \`/learn/binary-search\` and \`/learn/heaps\` alike, and \`useParams()\` returns \`{ conceptId: 'heaps' }\`. This is how one \`ConceptPage\` component serves fifty-four concepts: the URL carries the id, the component looks the data up.

Splats (\`*\`) match the rest of a path, and optional segments (\`:lang?\`) match with or without. Search params (\`?tab=quiz\`) are separate state read with \`useSearchParams\`.`,
      lang: 'tsx',
      code: `<Route path="/learn/:conceptId" element={<ConceptPage />} />

function ConceptPage() {
  const { conceptId } = useParams<{ conceptId: string }>()
  const concept = getConcept(conceptId!)
  if (!concept) return <NotFound />
  return <article>{concept.title}</article>
}

const [params, setParams] = useSearchParams()
params.get('tab')                 // 'quiz'
setParams({ tab: 'problems' })    // updates the URL, re-renders`,
    },
    {
      title: 'Nested routes and Outlet',
      body: `Most apps have a layout that stays put (the sidebar, the header) while an inner area changes. Nested routes model that directly. A parent route renders the layout and an \`<Outlet />\` where its child route should appear. \`/gates\` and \`/status\` both render inside the same \`Shell\` because they are children of the route that renders it.

Nesting also makes paths relative. A child at \`path="quiz"\` under a parent at \`/learn/:id\` is \`/learn/:id/quiz\`, and a \`<Link to="quiz">\` inside it resolves relative to where it is rendered.`,
      lang: 'tsx',
      code: `<Routes>
  <Route element={<Shell />}>              {/* layout route: no path */}
    <Route path="/" element={<Status />} />
    <Route path="/gates" element={<Gates />} />
    <Route path="/learn/:conceptId" element={<ConceptPage />} />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>

function Shell() {
  return (
    <div className="flex">
      <Sidebar />
      <main><Outlet /></main>   {/* the matched child renders here */}
    </div>
  )
}`,
    },
    {
      title: 'Ranked matching',
      body: `Given several routes that could match, which wins? Version 6 ranks them by specificity rather than by order in the file. A static segment beats a dynamic one, more segments beat fewer, and a splat ranks last. So \`/learn/new\` beats \`/learn/:id\` no matter how they are ordered, and \`*\` is always the fallback. You stop needing to arrange routes carefully or add \`exact\`.`,
      lang: 'tsx',
      code: `<Route path="/problems/:id" element={<Problem />} />
<Route path="/problems/new" element={<NewProblem />} />
<Route path="*" element={<NotFound />} />

// /problems/new     -> NewProblem  (static beats dynamic, order irrelevant)
// /problems/42      -> Problem
// /anything/else    -> NotFound    (splat ranks last)`,
    },
    {
      title: 'Active links and location',
      body: `\`<NavLink>\` is a \`<Link>\` that knows whether its destination matches the current URL and lets you style it accordingly, which is how a sidebar highlights the current page. \`useLocation()\` gives the full current location, including the hash and any state passed during navigation, and is the hook you reach for to run something when the route changes, such as scrolling to top or deciding whether a page should use the calm reading background.`,
      lang: 'tsx',
      code: `<NavLink to="/gates" className={({ isActive }) => isActive ? 'nav on' : 'nav'}>
  Gates
</NavLink>

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}`,
    },
    {
      title: 'Data mode: loaders, actions and pending UI',
      body: `Beyond this app's needs, React Router can own data too. A route's \`loader\` runs before the component renders and its result is available via \`useLoaderData\`; an \`action\` handles form submissions. The router coordinates them: it fetches in parallel for nested routes, shows the previous page until the new one is ready, and exposes a \`useNavigation\` state for spinners. This is the Remix heritage. It replaces a lot of \`useEffect\` fetching with a declarative description of what a page needs.`,
      lang: 'tsx',
      code: `const router = createHashRouter([
  {
    path: '/learn/:id',
    loader: async ({ params }) => fetchConcept(params.id!),
    element: <ConceptPage />,
  },
])

function ConceptPage() {
  const concept = useLoaderData() as Concept   // already loaded
  const nav = useNavigation()
  return <article style={{ opacity: nav.state === 'loading' ? 0.6 : 1 }}>...</article>
}`,
    },
  ],

  visual: {
    title: 'A click on a sidebar link',
    intro: 'The user is on the Status page and clicks Gates. Watch the URL, the history stack and the React tree, and notice that no request leaves the browser.',
    frames: [
      {
        caption: 'Before the click. The router has matched #/ to the Status route inside the Shell layout.',
        frame: `  URL:      localhost/#/
  history:  [ #/ ]
                 ^ current

  tree:  <HashRouter>
           <Shell>
             <Sidebar/>  <Outlet> -> <Status/>`,
      },
      {
        caption: 'Click. The Link\'s onClick prevents the default navigation and calls history.pushState with the new hash.',
        frame: `  <Link to="/gates">  click
      │
      ├─ event.preventDefault()   (no page load)
      └─ history.pushState(null, '', '#/gates')

  URL:      localhost/#/gates
  history:  [ #/ , #/gates ]
                      ^ current
  server requests: 0`,
      },
      {
        caption: 'The router listens for location changes, reads the new pathname and ranks the routes against it.',
        frame: `  location.pathname = "/gates"

  candidates            score
    "/"                  no match
    "/gates"             static, 1 segment  -> 13   WIN
    "/learn/:conceptId"  no match
    "*"                  splat              ->  1`,
      },
      {
        caption: 'Only the Outlet\'s content changes. Shell and Sidebar keep their DOM and state; NavLink recomputes isActive.',
        frame: `  tree:  <HashRouter>
           <Shell>            (unchanged)
             <Sidebar/>       (Gates link now active)
             <Outlet> -> <Gates/>   (swapped)

  unmounted: Status
  mounted:   Gates`,
      },
      {
        caption: 'Back button. The browser pops the history entry and fires popstate; the router matches the old URL and Status returns.',
        frame: `  user presses  <-  Back

  popstate  ->  location = "#/"
  history:  [ #/ , #/gates ]
               ^ current

  <Outlet> -> <Status/>     (fresh mount: local state resets)`,
      },
    ],
  },

  internals: `## Three layers

React Router is built as three packages stacked on each other. \`@remix-run/router\` (now folded into \`react-router\`) is framework-free logic: matching, ranking, the history abstraction, data loading. \`react-router\` binds that logic to React through context and hooks. \`react-router-dom\` adds the browser pieces: \`Link\`, \`NavLink\`, \`Form\`, and the three routers that talk to the address bar.

## The history abstraction

The browser offers two ways to change the URL without loading a page. \`history.pushState\` and \`replaceState\` change the path and fire nothing; the \`popstate\` event fires when the user presses back or forward. The library wraps these in a small object with \`push\`, \`replace\`, \`go\` and \`listen\`. \`BrowserRouter\` uses the path; \`HashRouter\` reads and writes \`location.hash\` and listens for \`hashchange\` as well; \`MemoryRouter\` keeps a stack in memory for tests and non-browser environments.

## Matching and ranking

When the location changes, the router flattens the route tree into a list of full paths, each with its chain of ancestors. Every path gets a numeric score: each static segment adds 10, a dynamic segment adds 3, a splat subtracts and an index route adds 2, with a bonus per segment. Routes are sorted by score once, at definition time. Matching walks the sorted list, compiles each path to a regular expression, and returns the first that matches along with its extracted params and its ancestor chain. That chain is what \`Outlet\` follows.

## Context and Outlet

\`<Routes>\` performs the match and renders the outermost matched element, wrapped in a \`RouteContext\` that carries the remaining matches. Each \`<Outlet />\` reads that context, renders the next match in the chain, and pushes a new context with the remainder. \`useParams\` merges the params of every match in the chain, which is why a nested route sees its parents' params too. \`useNavigate\` reads the history object from the top-level \`NavigationContext\`.

## Why the Shell keeps its state

Because layout routes render once and only the \`Outlet\` subtree changes, React's reconciliation sees the same \`Shell\` element at the same position and keeps its fibers. Only the child route's element type differs, so only that subtree unmounts and mounts. Scroll position of the main area does reset, since the content is new, which is why apps add a scroll-to-top effect keyed on the pathname.

## Lazy routes and code splitting

\`React.lazy(() => import('./pages/ConceptPage'))\` returns a component that suspends until the chunk loads. Put it in an \`element\` under a \`<Suspense>\` boundary and each page becomes its own bundle, downloaded on first visit. Data mode goes further with a \`lazy\` property on route objects that loads the loader and component together.

## Data routers

In data mode, the router object created by \`createBrowserRouter\` or \`createHashRouter\` owns a small state machine. A navigation moves through \`idle\`, \`loading\` and \`submitting\`, running the loaders of every matched route in parallel, holding the old UI until they resolve, and handling errors through the nearest \`errorElement\`. Actions receive a \`Request\` built from a submitted \`<Form>\`, revalidate loaders afterwards, and this is where the Remix philosophy of modelling mutations as HTML forms lives on.`,

  buildIt: {
    title: 'A hash router in 30 lines',
    intro: 'Match a hash against a few patterns, extract params, and re-render on hashchange. Nesting and ranking are what you would add next.',
    steps: [
      {
        title: 'Turn a path pattern into a matcher',
        body: 'Replace each :param with a capture group and remember the names.',
        lang: 'ts',
        code: `function compile(pattern: string) {
  const names: string[] = []
  const re = new RegExp('^' + pattern.replace(/:(\\w+)/g, (_, n) => { names.push(n); return '([^/]+)' }) + '$')
  return (path: string) => {
    const m = path.match(re)
    return m ? Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(m[i + 1])])) : null
  }
}`,
      },
      {
        title: 'A route table and a match function',
        body: 'Try each route in order. Real React Router ranks first so order does not matter.',
        lang: 'ts',
        code: `type Route = { path: string; render: (params: Record<string, string>) => string }

const routes: Route[] = [
  { path: '/', render: () => '<h1>Status</h1>' },
  { path: '/learn/:id', render: (p) => '<h1>Concept ' + p.id + '</h1>' },
  { path: '/gates', render: () => '<h1>Gates</h1>' },
]
const matchers = routes.map((r) => ({ ...r, match: compile(r.path) }))

function resolve(path: string) {
  for (const r of matchers) { const p = r.match(path); if (p) return r.render(p) }
  return '<h1>Not found</h1>'
}`,
      },
      {
        title: 'Listen to the hash',
        body: 'The browser fires hashchange when the fragment changes, including on back and forward. Read it, strip the #, render.',
        lang: 'ts',
        code: `function render() {
  const path = location.hash.slice(1) || '/'
  document.getElementById('root')!.innerHTML = resolve(path)
}
addEventListener('hashchange', render)
render()

// Navigation is just:  location.hash = '#/learn/heaps'
// Links are just:      <a href="#/gates">Gates</a>`,
      },
      {
        title: 'Notice what React Router adds',
        body: 'Ranking so static paths beat dynamic ones. Nested outlets so layouts persist. A history abstraction that works for hash, path and memory. Hooks so any component can read params or navigate. And optionally, data loading with pending states. The core loop, though, is the twelve lines above.',
        lang: 'ts',
        code: `// Exercise: give each route a score (10 per static segment, 3 per param),
// sort matchers by score descending, and add { path: '/learn/new' }.
// It should now win over /learn/:id regardless of position in the table.`,
      },
    ],
  },

  inTheWild: [
    { who: 'Remix and Shopify', what: 'Shopify acquired Remix in 2022; its ideas are now React Router\'s data and framework modes, used across Shopify\'s storefront tooling.' },
    { who: 'Netflix, Airbnb, Twitter web (historical)', what: 'React Router has been the default choice for React single-page apps since 2015; most large React apps outside the Next.js world use it.' },
    { who: 'Create React App generation', what: 'A decade of tutorials and starter projects paired React with React Router, making it the most-downloaded routing library on npm.' },
    { who: 'GitHub Pages projects', what: 'HashRouter is the standard answer for static hosts that cannot rewrite paths to index.html.' },
    { who: 'This app', what: 'HashRouter with a Shell layout route, dynamic segments for concepts and patterns, and lazy-loaded pages per route.' },
  ],

  alternatives: [
    { name: 'TanStack Router', pick: 'When you want fully type-safe routes and search params, so a typo in a link is a compile error. Newer, more opinionated.' },
    { name: 'Next.js App Router', pick: 'When you are already choosing Next for server rendering; routing comes from the file system.' },
    { name: 'wouter', pick: 'A 2 KB hook-based router for tiny apps that need three routes and nothing else.' },
    { name: 'No router', pick: 'A single-screen tool. If there is only one view, the URL has nothing to carry.' },
  ],

  glossary: [
    { term: 'Route', meaning: 'A path pattern paired with the element to render when the URL matches it.' },
    { term: 'Dynamic segment', meaning: 'A :name placeholder in a path, exposed through useParams.' },
    { term: 'Outlet', meaning: 'The slot in a parent route\'s element where the matched child renders.' },
    { term: 'Layout route', meaning: 'A route with an element but no path, used to wrap children in shared UI.' },
    { term: 'History API', meaning: 'pushState, replaceState and popstate: the browser\'s tools for changing the URL without a load.' },
    { term: 'HashRouter', meaning: 'A router that stores the path after # so static hosts need no configuration.' },
    { term: 'Ranked matching', meaning: 'Choosing the most specific matching route regardless of definition order.' },
    { term: 'Loader', meaning: 'In data mode, a function that fetches a route\'s data before it renders.' },
    { term: 'Splat', meaning: 'The * pattern that matches any remaining path, used for fallbacks.' },
  ],

  quiz: [
    {
      question: 'Why does this app use HashRouter instead of BrowserRouter?',
      options: ['Hash routing is faster', 'GitHub Pages serves static files and cannot map /gates to index.html, but never sees the part after #', 'BrowserRouter does not support nested routes', 'HashRouter is the default'],
      answerIndex: 1,
      explanation: 'Browsers do not send the fragment to the server. Every deep link therefore loads index.html, and the router reads the route from the hash.',
    },
    {
      question: 'Routes /learn/:id and /learn/new are both defined. Which renders for /learn/new?',
      options: ['Whichever is defined first', '/learn/:id, because it is more general', '/learn/new, because static segments outrank dynamic ones', 'Both, nested'],
      answerIndex: 2,
      explanation: 'Version 6+ ranks routes by specificity at definition time, so order in the file does not matter.',
    },
    {
      question: 'What does clicking a <Link> actually do?',
      options: ['Fetches the new page from the server', 'Calls history.pushState and lets the router re-render the matching route without a reload', 'Reloads the page with the new URL', 'Sets a cookie'],
      answerIndex: 1,
      explanation: 'The click is intercepted, the URL changes through the History API, and React swaps the matched subtree. No request leaves the browser.',
    },
    {
      question: 'Where does a matched child route appear inside a layout route?',
      options: ['As children of the layout element', 'Wherever the layout renders <Outlet />', 'Above the layout', 'In a portal'],
      answerIndex: 1,
      explanation: 'Outlet reads the remaining matches from context and renders the next one, which is how sidebars persist while content changes.',
    },
    {
      question: 'A concept page keeps showing the previous concept\'s scroll position after navigating. What is the idiomatic fix?',
      options: ['Use BrowserRouter', 'A small component with useEffect on useLocation().pathname that scrolls to top', 'Add key to Routes', 'Disable the History API'],
      answerIndex: 1,
      explanation: 'Client-side navigation does not reload, so scroll is not reset. Reacting to the pathname change is the standard pattern.',
    },
  ],
}
