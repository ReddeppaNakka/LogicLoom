import type { StackLayer, FlowStep } from './stack-types'

/** The stack grouped by the job each part does. */
export const LAYERS: StackLayer[] = [
  {
    id: 'language',
    name: 'The language',
    blurb: 'What the code is written in, and what stops it being wrong before it runs.',
    techIds: ['typescript'],
  },
  {
    id: 'framework',
    name: 'The framework',
    blurb: 'What turns data into what you see, and keeps the two in step.',
    techIds: ['react'],
  },
  {
    id: 'build',
    name: 'The build tool',
    blurb: 'What serves the app while you edit it and packs it for the web.',
    techIds: ['vite'],
  },
  {
    id: 'styling',
    name: 'Styling',
    blurb: 'How everything gets its look, and how nine themes swap with one attribute.',
    techIds: ['tailwind', 'css-arch'],
  },
  {
    id: 'routing',
    name: 'Routing',
    blurb: 'How one HTML file behaves like ten separate pages.',
    techIds: ['react-router'],
  },
  {
    id: 'state',
    name: 'State and storage',
    blurb: 'Where your progress lives, and how it survives a refresh.',
    techIds: ['zustand', 'web-storage'],
  },
  {
    id: 'motion',
    name: 'Motion',
    blurb: 'How things move, and how the whole app is told to hold still.',
    techIds: ['framer-motion'],
  },
  {
    id: 'graphics',
    name: 'Graphics and charts',
    blurb: 'The particle field behind the page and the radar on your dashboard.',
    techIds: ['three', 'recharts'],
  },
  {
    id: 'content',
    name: 'Content and editing',
    blurb: 'Rendering the lessons, the icons, and the code editor you type in.',
    techIds: ['react-markdown', 'monaco', 'lucide'],
  },
  {
    id: 'tooling',
    name: 'Tooling and delivery',
    blurb: 'Dates without timezone bugs, and getting the site onto the internet.',
    techIds: ['date-fns', 'gh-actions'],
  },
]

/** What actually happens between typing the URL and seeing a concept page. */
export const OPEN_A_PAGE: FlowStep[] = [
  {
    title: 'The browser asks for one HTML file',
    detail:
      'index.html is almost empty. It has an empty <div id="root">, a link to the fonts, and one script tag. Everything you see is built by JavaScript afterwards. This is what "single page application" means.',
    files: ['index.html'],
  },
  {
    title: 'React takes over the empty div',
    detail:
      'main.tsx finds that div and hands control to React. From here React owns the contents: you never write HTML into the page by hand again, you describe what it should contain and React makes the DOM match.',
    files: ['src/main.tsx'],
  },
  {
    title: 'The router reads the URL and picks a page',
    detail:
      'App.tsx maps each URL to a component. The address is a hash URL such as #/learn/two-pointers, so the part after the # is the route. Each page is lazily imported, so the code for the scratchpad is not downloaded until you open it.',
    files: ['src/App.tsx'],
  },
  {
    title: 'The shell draws the frame around it',
    detail:
      'Shell.tsx renders the sidebar, the background layer and the toast stack, then drops the matched page into an <Outlet />. It also reads your appearance settings and writes data-theme onto the html element, which is what recolours everything.',
    files: ['src/components/Shell.tsx'],
  },
  {
    title: 'The page pulls content and progress',
    detail:
      'ConceptPage.tsx looks the concept up by id from static typed data, and reads your progress from the store. Content is a plain array in TypeScript; progress is a Zustand store backed by localStorage. Neither involves a network request.',
    files: ['src/pages/ConceptPage.tsx', 'src/lib/content.ts', 'src/store/useApp.ts'],
  },
  {
    title: 'CSS paints it, and the browser shows a frame',
    detail:
      'Tailwind classes and the component classes in global.css resolve against CSS custom properties. Those properties come from the theme block matching the data-theme attribute set in step four, which is why switching theme repaints instantly without React re-rendering anything.',
    files: ['src/styles/global.css'],
  },
  {
    title: 'You click "Solved" and the loop closes',
    detail:
      'The click calls an action on the store. The store computes new state and returns it. React re-renders only the components that read the part which changed, and the persist middleware writes the result to localStorage. Refresh the page and step five reads it back.',
    files: ['src/store/useApp.ts'],
  },
]

/** A suggested order for someone learning front-end from this codebase. */
export const LEARNING_PATH: { stage: string; goal: string; techIds: string[]; advice: string }[] = [
  {
    stage: 'Week 1',
    goal: 'Read the page you are looking at',
    techIds: ['react', 'typescript'],
    advice:
      'Open src/pages/Settings.tsx. It is the simplest real page: some inputs, some state, no animation. Change a label, save, watch the browser update. Then follow one prop into src/components/ui.tsx and see where it lands.',
  },
  {
    stage: 'Week 2',
    goal: 'Make it look different',
    techIds: ['tailwind', 'css-arch'],
    advice:
      'Add a tenth theme in src/styles/global.css by copying a data-theme block and changing its colours, then register it in src/lib/appearance.ts. You will learn CSS custom properties and the cascade faster than from any tutorial, because the feedback is immediate.',
  },
  {
    stage: 'Week 3',
    goal: 'Understand where data lives',
    techIds: ['zustand', 'web-storage'],
    advice:
      'Open devtools, Application, Local Storage, and find the key the-system-dsa-v1. Solve a problem in the app and watch the JSON change. Then read src/store/useApp.ts and find the action that caused it.',
  },
  {
    stage: 'Week 4',
    goal: 'Add a page of your own',
    techIds: ['react-router', 'vite'],
    advice:
      'Add a route in src/App.tsx, a nav entry in src/components/Shell.tsx, and a new file in src/pages. Getting a blank page to appear at your own URL is the moment the framework stops feeling like magic.',
  },
  {
    stage: 'Week 5 and beyond',
    goal: 'The expensive parts',
    techIds: ['framer-motion', 'three', 'recharts', 'gh-actions'],
    advice:
      'These are optional in every sense: the app would work without them. Read them last, and read src/components/AppBackground.tsx especially closely for its cleanup function, which is the single most transferable lesson in this repository.',
  },
]
