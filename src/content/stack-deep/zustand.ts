import type { TechDeep } from '../stack-types'

export const zustandDeep: TechDeep = {
  analogy:
    'A shared whiteboard in an office. Anyone can walk up and read the number they care about, and anyone can pick up the marker and change it. The trick is that each person has told the whiteboard which corner they watch, so when someone updates the sales figure, only the sales team looks up; the design team keeps working. Zustand is that whiteboard, and the corner you watch is your selector.',

  origins: `Zustand (German for "state") was written by **Paul Henschel** in 2019 under the **Poimandres** collective, the same group behind react-three-fiber, jotai and valibo. It was built out of frustration with how much ceremony Redux demanded for the react-three-fiber examples: action constants, reducers, providers, connect.

The design goal was a store you could create in one line and read with one hook, with no Provider wrapping the tree and no boilerplate around updates. It weighs about one kilobyte. It exposes the store outside React too, so a game loop or a WebSocket handler can read and write state without a component in sight.

Its timing was good. Hooks had just landed, Redux Toolkit did not exist yet, and React's own Context was being misused as a state manager with all the re-render problems that brings. Zustand, jotai (atoms) and valtio (proxies) became the three Poimandres answers to different tastes, and Zustand became the most downloaded of the post-Redux libraries. Version 5, used here, dropped legacy APIs and rebuilt on React's \`useSyncExternalStore\`.`,

  concepts: [
    {
      title: 'A store is a closure with subscribers',
      body: `\`create\` takes a function that receives \`set\` and \`get\` and returns your initial state, including the functions that update it. It returns a hook. That is the whole API surface for most apps.

Inside, the store is a single object held in a closure, a \`Set\` of listeners, and three methods: \`getState\`, \`setState\`, \`subscribe\`. The hook is a thin layer that subscribes a component and re-renders it when the slice it selected changes.`,
      lang: 'ts',
      code: `import { create } from 'zustand'

interface XpState {
  xp: number
  level: number
  gain: (amount: number) => void
}

export const useXp = create<XpState>((set, get) => ({
  xp: 0,
  level: 1,
  gain: (amount) => {
    const xp = get().xp + amount
    set({ xp, level: Math.floor(xp / 500) + 1 })
  },
}))`,
    },
    {
      title: 'Selectors decide who re-renders',
      body: `Calling \`useXp()\` with no selector subscribes to the whole store, so every change re-renders that component. Passing a selector, \`useXp((s) => s.level)\`, subscribes only to that value: the component re-renders when \`level\` changes and ignores everything else. This is the single most important habit with Zustand and it is what keeps a large app fast.

Selectors compare by reference (\`Object.is\`). A selector that returns a new object or array every call, such as \`(s) => ({ a: s.a, b: s.b })\`, always looks changed. Return primitives, or use \`useShallow\` to compare object contents.`,
      lang: 'tsx',
      code: `// Re-renders only when level changes
const level = useXp((s) => s.level)

// Re-renders on every store change (avoid unless you need everything)
const all = useXp()

// Picking several fields: useShallow compares by contents
import { useShallow } from 'zustand/react/shallow'
const { xp, level } = useXp(useShallow((s) => ({ xp: s.xp, level: s.level })))`,
    },
    {
      title: 'Updates merge, and can be functional',
      body: `\`set({ xp: 10 })\` merges the object into the existing state at the top level, so other fields survive. \`set((s) => ({ xp: s.xp + 10 }))\` reads the latest state, which matters when several updates race. Nested objects are not merged automatically: to change one key inside \`progress\`, spread the old \`progress\` yourself or use the immer middleware. Every \`set\` produces a new top-level object, which is how selectors detect change.`,
      lang: 'ts',
      code: `set({ xp: 10 })                          // level, gain untouched

set((s) => ({ xp: s.xp + 10 }))          // reads current xp

// Nested: you spread, or nothing else survives
set((s) => ({
  progress: { ...s.progress, [conceptId]: { done: true, at: Date.now() } },
}))

set({}, true)    // second arg true = replace the whole state (rare)`,
    },
    {
      title: 'Persist middleware',
      body: `Middleware wraps the store creator to add behaviour. \`persist\` writes the state to \`localStorage\` (or any storage with getItem/setItem) after every change and reads it back on load. Give it a \`name\` (the storage key), a \`partialize\` function to save only some fields, a \`version\` with \`migrate\` to evolve the shape, and a \`merge\` to combine saved data with defaults so a new field added in code is not wiped out by an old save.`,
      lang: 'ts',
      code: `import { persist } from 'zustand/middleware'

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({ /* state and actions */ }),
    {
      name: 'the-system-dsa-v1',
      version: 3,
      partialize: (s) => ({ profile: s.profile, progress: s.progress }),   // no UI state
      merge: (saved, current) => ({ ...current, ...(saved as object) }),   // defaults survive
      migrate: (saved, from) => (from < 3 ? upgradeV2toV3(saved) : saved),
    },
  ),
)`,
    },
    {
      title: 'The store outside React',
      body: `The hook object is also the store. \`useXp.getState()\` reads synchronously anywhere; \`useXp.setState()\` writes; \`useXp.subscribe(listener)\` watches. This is what makes Zustand fit anything with a loop that is not a component: an animation frame, a keyboard shortcut handler, a test. It also means an action can read fresh state through \`get()\` without stale-closure problems.`,
      lang: 'ts',
      code: `// A keyboard shortcut, registered once, outside any component
addEventListener('keydown', (e) => {
  if (e.key === 'f' && e.metaKey) {
    const { focusMode, setFocusMode } = useApp.getState()
    setFocusMode(!focusMode)
  }
})

// A test
useXp.setState({ xp: 999 })
expect(useXp.getState().level).toBe(2)`,
    },
    {
      title: 'Slices: growing a store without one giant file',
      body: `A store can be assembled from several creator functions, each owning one area of state. Each slice receives the same \`set\` and \`get\`, so slices can read each other. This scales to large apps while keeping a single source of truth and a single persist key.`,
      lang: 'ts',
      code: `const createProfileSlice = (set: Set, get: Get) => ({
  name: 'Hunter', rank: 'E' as Rank,
  rename: (name: string) => set({ name }),
})
const createProgressSlice = (set: Set, get: Get) => ({
  done: {} as Record<string, boolean>,
  finish: (id: string) => set((s) => ({ done: { ...s.done, [id]: true } })),
})

export const useApp = create<AppState>()((...a) => ({
  ...createProfileSlice(...a),
  ...createProgressSlice(...a),
}))`,
    },
  ],

  visual: {
    title: 'One set() and who wakes up',
    intro: 'Three components read the same store with different selectors. An action changes one field. See who re-renders and who sleeps through it.',
    frames: [
      {
        caption: 'The store holds one object. Three components have subscribed, each with a selector and the last value it saw.',
        frame: `  store state
  { xp: 120, level: 1, theme: 'shadow' }

  subscribers
  ┌────────────────┬──────────────────┬────────┐
  │ component      │ selector         │ last   │
  ├────────────────┼──────────────────┼────────┤
  │ <XpBar/>       │ s => s.xp        │ 120    │
  │ <RankBadge/>   │ s => s.level     │ 1      │
  │ <Shell/>       │ s => s.theme     │'shadow'│
  └────────────────┴──────────────────┴────────┘`,
      },
      {
        caption: 'A quiz is finished. The action calls set with a merge. A new state object is built; unchanged fields keep their references.',
        frame: `  gain(30)
    set({ xp: 150 })

  old  { xp: 120, level: 1, theme: 'shadow' }
                    │         │
  new  { xp: 150, level: 1, theme: 'shadow' }
         ^ new      ^ same    ^ same`,
      },
      {
        caption: 'Every listener runs, each re-applies its selector to the new state, and compares with what it saw last.',
        frame: `  notify listeners

  <XpBar/>      s.xp     150  vs 120       CHANGED
  <RankBadge/>  s.level    1  vs   1       same
  <Shell/>      s.theme  'shadow' vs same  same`,
      },
      {
        caption: 'Only XpBar re-renders. The other two components never run. React did not diff them; they were never scheduled.',
        frame: `  React render queue
  ┌────────────────┐
  │ <XpBar/>       │   <- one component
  └────────────────┘

  <RankBadge/>  untouched
  <Shell/>      untouched`,
      },
      {
        caption: 'With persist on, the same notification also serialises the partialized state to localStorage.',
        frame: `  persist middleware (after set)
    partialize(state)
      -> { xp: 150, level: 1 }
    JSON.stringify
    localStorage.setItem('the-system-dsa-v1',
      '{"state":{"xp":150,"level":1},"version":3}')`,
      },
    ],
  },

  internals: `## The vanilla core

Strip React away and Zustand is about forty lines. \`createStore\` holds a \`state\` variable and a \`Set\` of listeners. \`setState(partial, replace)\` computes the next state (calling \`partial\` if it is a function), and if the result is not \`Object.is\`-equal to the current state, assigns a new object (merged unless \`replace\`) and calls each listener with the new and previous state. \`subscribe\` adds a listener and returns a function that removes it. \`getState\` returns the current object.

Everything else is layered on this. Middleware such as \`persist\` or \`devtools\` is just a function that receives the creator and returns a wrapped creator that intercepts \`set\`.

## The React binding

\`create\` builds a vanilla store, then returns a hook that calls React's \`useSyncExternalStore(store.subscribe, () => selector(store.getState()))\`. That built-in hook was added in React 18 precisely for libraries like this. It subscribes during render, reads a snapshot, and, critically, guarantees consistency under concurrent rendering: if the store changes while React is in the middle of rendering a tree, React notices the snapshot mismatch and re-renders synchronously rather than showing two components with different versions of the state. Before React 18, external stores had to implement this "tearing" protection themselves.

The snapshot returned must be stable between calls when nothing changed, which is why selectors that return fresh objects cause infinite loops under \`useSyncExternalStore\` and why \`useShallow\` exists: it memoises the selected object and returns the previous reference when the shallow contents are equal.

## Why no Provider

Because the store lives in module scope, any component that imports the hook is talking to the same closure. There is nothing to thread through the tree. The cost is that the store is a singleton per module: rendering two independent copies of the app on one page, or server rendering many requests in one process, needs the context-based pattern (\`createStore\` plus a context) that Zustand also supports.

## Persist in detail

On creation, the middleware reads the storage key. If the value exists it parses it, runs \`migrate\` when the stored version is older than the declared one, then \`merge\`s it into the initial state. It then wraps \`set\` so that after every state change it \`partialize\`s the new state, wraps it as \`{ state, version }\` and writes it. Writes are synchronous with localStorage, which is fine at this app's data size; for large state or async storage (IndexedDB), the middleware supports async storages and exposes a \`hasHydrated\` flag so the UI can wait.

## Immutability by convention

Zustand does not freeze anything. If you mutate \`state.progress.x = 1\` directly, no listener fires and the persisted copy drifts. The rule is the same as React's: produce new objects for anything that changed. The \`immer\` middleware lets you write mutations and turns them into new objects behind the scenes, at the cost of a dependency.

## Comparison with Context

React Context re-renders every consumer whenever the provided value changes, and the usual value is an object rebuilt each render. To get selector-style updates from Context you need to split contexts or add memoisation everywhere. Zustand's subscription model gives per-value updates for free, which is why it is generally recommended for anything that changes often.`,

  buildIt: {
    title: 'Write Zustand in 25 lines',
    intro: 'Build the vanilla store, then the hook on top of useSyncExternalStore. Once you have done this the library stops being magic.',
    steps: [
      {
        title: 'The vanilla store',
        body: 'State, a Set of listeners, and the three methods. Note the merge and the equality check.',
        lang: 'ts',
        code: `type Listener<T> = (next: T, prev: T) => void

export function createStore<T extends object>(init: (set: any, get: () => T) => T) {
  let state: T
  const listeners = new Set<Listener<T>>()
  const getState = () => state
  const setState = (partial: Partial<T> | ((s: T) => Partial<T>), replace = false) => {
    const next = typeof partial === 'function' ? partial(state) : partial
    if (Object.is(next, state)) return
    const prev = state
    state = replace ? (next as T) : { ...state, ...next }
    listeners.forEach((l) => l(state, prev))
  }
  const subscribe = (l: Listener<T>) => { listeners.add(l); return () => listeners.delete(l) }
  state = init(setState, getState)
  return { getState, setState, subscribe }
}`,
      },
      {
        title: 'The React hook',
        body: 'useSyncExternalStore takes a subscribe function and a snapshot getter. The selector runs inside the getter.',
        lang: 'ts',
        code: `import { useSyncExternalStore } from 'react'

export function create<T extends object>(init: (set: any, get: () => T) => T) {
  const store = createStore(init)
  function useStore<U>(selector: (s: T) => U = (s) => s as unknown as U): U {
    return useSyncExternalStore(store.subscribe, () => selector(store.getState()))
  }
  return Object.assign(useStore, store)   // hook + getState/setState/subscribe
}`,
      },
      {
        title: 'Use it exactly like the real thing',
        body: 'The same code you would write against the npm package.',
        lang: 'tsx',
        code: `const useCount = create<{ n: number; inc: () => void }>((set) => ({
  n: 0,
  inc: () => set((s) => ({ n: s.n + 1 })),
}))

function Counter() {
  const n = useCount((s) => s.n)
  const inc = useCount((s) => s.inc)
  return <button onClick={inc}>{n}</button>
}`,
      },
      {
        title: 'A persist middleware in 10 lines',
        body: 'Wrap the creator: hydrate from storage first, and after each set write it back.',
        lang: 'ts',
        code: `export const persist = <T extends object>(init: any, key: string) => (set: any, get: () => T) => {
  const saved = localStorage.getItem(key)
  const wrappedSet = (p: any, r?: boolean) => {
    set(p, r)
    localStorage.setItem(key, JSON.stringify(get()))
  }
  const base = init(wrappedSet, get)
  return saved ? { ...base, ...JSON.parse(saved) } : base
}

const useCount = create(persist((set) => ({ n: 0, inc: () => set((s: any) => ({ n: s.n + 1 })) }), 'count'))`,
      },
    ],
  },

  inTheWild: [
    { who: 'react-three-fiber ecosystem', what: 'Born there; most 3D React apps use Zustand to share scene state between the render loop and the UI.' },
    { who: 'Cal.com', what: 'The open-source scheduling product keeps its booking flow state in Zustand stores.' },
    { who: 'Excalidraw-style editors and canvas tools', what: 'Apps with a hot update path (pointer moves, sixty times a second) favour a store that can be read outside React without re-rendering.' },
    { who: 'Countless dashboards', what: 'Zustand has been the most-downloaded non-Redux React state library since about 2021.' },
    { who: 'This app', what: 'One persisted store holds the profile, progress, schedule, mistakes and appearance; every page reads it through selectors.' },
  ],

  alternatives: [
    { name: 'Redux Toolkit', pick: 'A large team that wants strict conventions, time-travel devtools and a well-trodden path. More structure, more code.' },
    { name: 'jotai', pick: 'When state is naturally many small independent values (atoms) rather than one object. Same authors.' },
    { name: 'React Context', pick: 'Rarely-changing values such as the current user or a theme, where re-rendering all consumers is fine.' },
    { name: 'TanStack Query', pick: 'Server data. Caching, refetching and invalidation of API responses is a different problem from client state.' },
    { name: 'useState alone', pick: 'State that one component and its children need. Do not globalise what does not need to be global.' },
  ],

  glossary: [
    { term: 'Store', meaning: 'The single object holding state plus getState, setState and subscribe.' },
    { term: 'Selector', meaning: 'A function from state to the piece a component needs; controls when it re-renders.' },
    { term: 'Listener', meaning: 'A callback run after every state change; the hook registers one per component.' },
    { term: 'Merge', meaning: 'set() shallow-merges its argument into the top level of state.' },
    { term: 'Middleware', meaning: 'A wrapper around the store creator that adds behaviour such as persistence.' },
    { term: 'partialize', meaning: 'A persist option choosing which fields to save.' },
    { term: 'Hydration', meaning: 'Loading saved state from storage into the store at startup.' },
    { term: 'useSyncExternalStore', meaning: 'React\'s built-in hook for subscribing to stores outside React safely.' },
    { term: 'useShallow', meaning: 'A selector wrapper that compares object contents so a fresh object does not count as a change.' },
  ],

  quiz: [
    {
      question: 'A component uses `useApp((s) => ({ xp: s.xp, level: s.level }))` and re-renders on every store change. Why?',
      options: ['Selectors always re-render', 'The selector returns a new object each call, so reference equality always fails; wrap it in useShallow', 'xp changes constantly', 'Two fields cannot be selected'],
      answerIndex: 1,
      explanation: 'Zustand compares selected values with Object.is. A fresh object literal is never equal to the last one. useShallow compares contents instead.',
    },
    {
      question: 'What does `set({ xp: 10 })` do to the other fields in the store?',
      options: ['Deletes them', 'Leaves them unchanged; set merges at the top level', 'Resets them to defaults', 'Throws unless replace is true'],
      answerIndex: 1,
      explanation: 'set shallow-merges. Only nested objects need manual spreading.',
    },
    {
      question: 'You add a new field to the store in code. Users with an old localStorage save do not get it. Which persist option fixes that?',
      options: ['partialize', 'name', 'merge (or a version plus migrate)', 'storage'],
      answerIndex: 2,
      explanation: 'merge decides how saved data combines with the initial state. Spreading defaults first then saved data keeps new fields. Versioned migrate handles shape changes.',
    },
    {
      question: 'Why does Zustand not need a Provider?',
      options: ['It uses global variables on window', 'The store is a module-scoped closure; importing the hook reaches the same store', 'It patches React', 'It does need one'],
      answerIndex: 1,
      explanation: 'Module scope is the sharing mechanism. The trade-off is one store per module, which matters for server rendering or multiple app instances.',
    },
    {
      question: 'Which React hook does Zustand v5 build on, and what problem does it solve?',
      options: ['useEffect; running side effects', 'useSyncExternalStore; consistent snapshots of external state under concurrent rendering', 'useReducer; batching', 'useContext; sharing values'],
      answerIndex: 1,
      explanation: 'React 18 added useSyncExternalStore so external stores cannot tear, meaning show two different versions of state in one render.',
    },
  ],
}
