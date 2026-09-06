import type { TechDeep } from '../stack-types'

export const webStorageDeep: TechDeep = {
  analogy:
    'A notebook kept in the drawer of one desk. Anyone who sits at that desk can read it and write in it, it is still there tomorrow, but it never leaves the desk. Sit at another desk (another browser, another device) and the drawer is empty. That is localStorage: durable, private to one origin on one machine, and small enough to fit in a drawer.',

  origins: `The browser platform is the one dependency every web app shares, and this entry is about the handful of built-in APIs that a modern app leans on without a library.

Before 2009 the only way to keep data in a browser was the cookie, a 4 KB string sent to the server on every request. The **Web Storage** specification, drafted by Ian Hickson as part of the HTML5 effort and shipped across browsers by 2009 to 2010, added \`localStorage\` and \`sessionStorage\`: a simple key-value store of strings, around 5 MB per origin, never sent over the network. **IndexedDB** followed in 2010 to 2012 for structured, larger, asynchronous storage.

Alongside storage, the same period standardised the APIs an app uses to observe its environment: \`matchMedia\` (2011) to query media conditions from JavaScript, \`requestAnimationFrame\` (2011) to schedule work per frame, the **History API** (2010) to change the URL without a load, **IntersectionObserver** (2016) to know when an element is visible, and **ResizeObserver** (2018). \`navigator.clipboard\` (2018) replaced \`document.execCommand('copy')\`.

The security model that ties them together is the **same-origin policy**: scheme, host and port together make an origin, and storage is partitioned by it. Data written by one site is invisible to another. Since 2023, browsers additionally partition storage by the top-level site when a page is embedded in an iframe, closing a tracking loophole.`,

  concepts: [
    {
      title: 'localStorage: synchronous strings per origin',
      body: `\`localStorage\` has five methods: \`getItem\`, \`setItem\`, \`removeItem\`, \`clear\` and \`key\`, plus \`length\`. Values are strings only; store objects with \`JSON.stringify\` and read them back with \`JSON.parse\`. It is synchronous, so a large write blocks the main thread briefly, and it persists until cleared by the user, the site or the browser's storage pressure logic. \`sessionStorage\` is identical but scoped to one tab and cleared when the tab closes.`,
      lang: 'ts',
      code: `localStorage.setItem('prefs', JSON.stringify({ theme: 'paper', focus: true }))

const raw = localStorage.getItem('prefs')          // string | null
const prefs = raw ? JSON.parse(raw) : DEFAULTS

localStorage.removeItem('prefs')

// Quota: about 5 MB per origin in most browsers. Exceed it and setItem throws.`,
    },
    {
      title: 'Every read from storage is untrusted',
      body: `The data in storage was written by an earlier version of your code, or by the user through devtools, or corrupted by a crash mid-write. \`JSON.parse\` throws on malformed text, and storage access itself throws in some contexts: private windows in older Safari, or a browser set to block site data. Wrap reads in \`try\`/\`catch\`, validate the shape, and always have a default so the app renders correctly with nothing stored. A version number in the saved object lets you migrate old shapes deliberately.`,
      lang: 'ts',
      code: `function load<T>(key: string, fallback: T, isValid: (x: unknown) => x is T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    return isValid(parsed) ? parsed : fallback
  } catch {
    return fallback         // blocked storage, corrupt JSON, anything
  }
}`,
    },
    {
      title: 'The storage event: tabs talking to each other',
      body: `When one tab writes to \`localStorage\`, every **other** tab on the same origin receives a \`storage\` event with the key, old value and new value. The writing tab does not receive it. This gives you cross-tab sync for free: log out in one tab and the others can react. For richer messaging between tabs, \`BroadcastChannel\` sends arbitrary objects.`,
      lang: 'ts',
      code: `addEventListener('storage', (e) => {
  if (e.key === 'the-system-dsa-v1' && e.newValue) {
    useApp.persist.rehydrate()     // pull the other tab's write into this store
  }
})

const bc = new BroadcastChannel('app')
bc.postMessage({ type: 'theme', value: 'paper' })
bc.onmessage = (e) => applyTheme(e.data.value)`,
    },
    {
      title: 'matchMedia: asking the environment',
      body: `\`window.matchMedia(query)\` evaluates any media query from JavaScript and returns an object with a \`matches\` boolean and a \`change\` event. This is how an app learns the user prefers dark mode or reduced motion, whether the pointer is coarse (touch), or whether the viewport is narrow, and updates live when the setting changes without a reload.`,
      lang: 'ts',
      code: `const dark = matchMedia('(prefers-color-scheme: dark)')
const still = matchMedia('(prefers-reduced-motion: reduce)')

apply(dark.matches, still.matches)
dark.addEventListener('change', (e) => apply(e.matches, still.matches))

const touch = matchMedia('(pointer: coarse)').matches   // hide hover-only hints`,
    },
    {
      title: 'requestAnimationFrame: work that belongs to a frame',
      body: `The browser paints about sixty times a second. \`requestAnimationFrame(fn)\` runs \`fn\` right before the next paint, once, with a high-resolution timestamp. Use it for anything visual that reacts to input, such as a scroll-spy or a cursor-following light, so you do one update per frame rather than one per event. Scroll and mousemove can fire far more often than the screen can show. Cancel a pending frame with \`cancelAnimationFrame\` in cleanup.`,
      lang: 'ts',
      code: `let pending = 0
addEventListener('scroll', () => {
  if (pending) return                          // already scheduled this frame
  pending = requestAnimationFrame(() => {
    pending = 0
    updateActiveSection(window.scrollY)        // runs at most once per frame
  })
}, { passive: true })

// on unmount:  cancelAnimationFrame(pending)`,
    },
    {
      title: 'Observers: being told instead of polling',
      body: `\`IntersectionObserver\` calls you when an element enters or leaves the viewport (or any root), which powers lazy images, infinite scroll and reveal-on-scroll without a scroll listener. \`ResizeObserver\` calls you when an element's box changes, which is the JavaScript counterpart to container queries. \`MutationObserver\` watches DOM changes. All three batch their callbacks and run off the hot path, which makes them far cheaper than checking in a scroll handler.`,
      lang: 'ts',
      code: `const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
}, { rootMargin: '-40px' })
document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
ro.observe(tileEl)`,
    },
    {
      title: 'Clipboard, fullscreen, wake lock and friends',
      body: `Small capabilities that used to need plugins are now one call, usually gated on a user gesture and a secure context (HTTPS or localhost). \`navigator.clipboard.writeText\` copies a snippet; \`element.requestFullscreen()\` gives a focus mode; \`navigator.wakeLock.request('screen')\` keeps the screen on during a timed session; \`document.visibilityState\` and the \`visibilitychange\` event tell you when to pause a timer because the tab is hidden.`,
      lang: 'ts',
      code: `await navigator.clipboard.writeText(code)           // after a click

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseSessionTimer(); else resumeSessionTimer()
})

const lock = await navigator.wakeLock?.request('screen')   // optional API
lock?.release()`,
    },
  ],

  visual: {
    title: 'A session survives a refresh',
    intro: 'The user marks a concept done, closes the tab, and comes back tomorrow. Follow the bytes.',
    frames: [
      {
        caption: 'Store update. The persist middleware serialises the chosen slice after every set.',
        frame: `  finish('two-pointers')
     │
     v
  state.progress['two-pointers'] = { done: true }
     │
     v  partialize + JSON.stringify
  '{"state":{"progress":{"two-pointers":
      {"done":true}}},"version":3}'`,
      },
      {
        caption: 'The string is written under one key. The browser stores it on disk in a per-origin database.',
        frame: `  localStorage.setItem('the-system-dsa-v1', '...')

  origin: http://localhost:5180
  ┌──────────────────────┬──────────────────────────────┐
  │ key                  │ value (string)               │
  ├──────────────────────┼──────────────────────────────┤
  │ the-system-dsa-v1    │ {"state":{"progress":...}}   │
  │ appearance           │ {"theme":"paper"}            │
  └──────────────────────┴──────────────────────────────┘
  written synchronously, ~0.2 ms for 20 KB`,
      },
      {
        caption: 'Tab closed. The JavaScript heap is gone. The store object no longer exists anywhere. The disk record remains.',
        frame: `  memory                      disk (origin storage)
  ┌───────────────┐           ┌───────────────────────┐
  │               │           │ the-system-dsa-v1  ✓  │
  │   (empty)     │           │ appearance         ✓  │
  │               │           │                       │
  └───────────────┘           └───────────────────────┘`,
      },
      {
        caption: 'Next day. The app boots, creates the store, and persist reads the key before the first render.',
        frame: `  create(persist(...))
     │
     ├─ localStorage.getItem('the-system-dsa-v1')
     ├─ JSON.parse
     ├─ version 3 == 3, no migrate
     ├─ merge(saved, initialState)
     v
  state.progress['two-pointers'].done === true
  first render already shows the tick`,
      },
      {
        caption: 'A second tab opens and finishes another concept. The first tab hears about it through the storage event.',
        frame: `  tab B:  setItem('the-system-dsa-v1', ...)
             │
             └──> storage event  ──> tab A
                                     key: 'the-system-dsa-v1'
                                     newValue: '{...heaps...}'
                                     rehydrate()
  tab B itself: no event (it did the writing)`,
      },
    ],
  },

  internals: `## Where the bytes live

Each browser keeps a per-profile directory of origin storage. Chromium stores localStorage in a LevelDB database keyed by origin; Firefox uses SQLite. Reads are served from an in-memory copy loaded when the origin's first page opens, which is why \`getItem\` is fast, and writes go to that copy and are flushed to disk shortly after. The synchronous API means the main thread waits for the in-memory write, not the disk flush.

## Quotas and eviction

Web Storage is limited to roughly 5 MB per origin (10 MB in some browsers), counted in UTF-16 code units, so a 2.5-million-character string fills it. \`setItem\` throws a \`QuotaExceededError\` when full. IndexedDB and the Cache API share a much larger origin quota, a percentage of free disk. Under storage pressure browsers evict origins least recently used unless the site has requested \`navigator.storage.persist()\`. Safari deletes script-writable storage for sites not visited in seven days under Intelligent Tracking Prevention, which matters for an app that expects a study log to survive a fortnight's holiday.

## The same-origin boundary

\`https://a.example\` and \`https://b.example\` are different origins; so are \`http://\` and \`https://\` versions of one host, and different ports. Storage never crosses. A GitHub Pages site at \`user.github.io/repo\` shares an origin with \`user.github.io/other-repo\`, which is why this app namespaces its key with an app-specific name rather than a generic one like \`state\`.

## Structured clone and IndexedDB

IndexedDB stores real objects, not strings, using the structured clone algorithm: nested objects, arrays, Dates, Maps, Sets, typed arrays and Blobs survive; functions and DOM nodes do not. It is asynchronous and transactional, supports indexes and cursors, and is the right tool above a few hundred kilobytes or when you need to query. Its raw API is verbose; libraries such as idb or Dexie wrap it.

## Event loop placement

\`requestAnimationFrame\` callbacks run in the rendering step of the event loop, after input events and before style recalculation and paint, so a DOM write inside one lands in the very next frame. \`setTimeout(fn, 0)\` runs in a later task and may straddle a frame. Observers deliver their notifications in a microtask-like step after layout, batched, which is what keeps them cheap.

## Passive listeners and scroll performance

A wheel or touch listener could call \`preventDefault\` and cancel scrolling, so the browser used to wait for the handler before scrolling. Passing \`{ passive: true }\` promises you will not cancel, letting the browser scroll on the compositor thread immediately. Lighthouse flags non-passive scroll listeners for this reason.

## Secure contexts and permissions

Clipboard write, wake lock, fullscreen and most newer APIs require a secure context and, in several cases, a recent user activation such as a click. Calling them from a timer fails silently or throws. Feature-detect (\`'wakeLock' in navigator\`) and treat these as enhancements.`,

  buildIt: {
    title: 'A typed, versioned storage helper',
    intro: 'Forty lines that every app ends up writing: safe reads, versioned writes, cross-tab sync and a React hook on top.',
    steps: [
      {
        title: 'Safe read and write',
        body: 'Every failure path returns the fallback. The write catches quota errors too.',
        lang: 'ts',
        code: `interface Envelope<T> { v: number; data: T }

function read<T>(key: string, version: number, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const env = JSON.parse(raw) as Envelope<T>
    return env.v === version ? env.data : fallback
  } catch { return fallback }
}

function write<T>(key: string, version: number, data: T): boolean {
  try { localStorage.setItem(key, JSON.stringify({ v: version, data })); return true }
  catch { return false }   // quota exceeded or storage blocked
}`,
      },
      {
        title: 'A migration step',
        body: 'When the version differs, transform the old shape instead of discarding it.',
        lang: 'ts',
        code: `function readMigrating<T>(key: string, version: number, fallback: T, migrate: (old: unknown, from: number) => T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const env = JSON.parse(raw) as Envelope<unknown>
    if (env.v === version) return env.data as T
    const upgraded = migrate(env.data, env.v)
    write(key, version, upgraded)
    return upgraded
  } catch { return fallback }
}`,
      },
      {
        title: 'A React hook with cross-tab sync',
        body: 'State initialised from storage, written through on change, and updated when another tab writes.',
        lang: 'tsx',
        code: `function useStored<T>(key: string, version: number, fallback: T) {
  const [value, setValue] = useState(() => read(key, version, fallback))
  useEffect(() => { write(key, version, value) }, [key, version, value])
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(read(key, version, fallback))
    }
    addEventListener('storage', onStorage)
    return () => removeEventListener('storage', onStorage)
  }, [key, version, fallback])
  return [value, setValue] as const
}

const [prefs, setPrefs] = useStored('prefs', 2, { theme: 'shadow' })`,
      },
      {
        title: 'Observe the environment',
        body: 'The same shape as a hook for any matchMedia query, with the change listener cleaned up.',
        lang: 'tsx',
        code: `function useMedia(query: string) {
  const [m, setM] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const on = (e: MediaQueryListEvent) => setM(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return m
}
const reduceMotion = useMedia('(prefers-reduced-motion: reduce)')`,
      },
    ],
  },

  inTheWild: [
    { who: 'Excalidraw', what: 'Saves your whole drawing to localStorage so a refresh never loses work, with IndexedDB for larger scenes.' },
    { who: 'GitHub', what: 'Stores the chosen colour mode and many UI preferences client-side, and reads prefers-color-scheme for the default.' },
    { who: 'Google Docs and Notion', what: 'Use IndexedDB for offline caches of documents, syncing when the connection returns.' },
    { who: 'Every reveal-on-scroll site', what: 'IntersectionObserver replaced scroll listeners for lazy loading and animation triggers across the web.' },
    { who: 'This app', what: 'localStorage through Zustand persist for progress and appearance; matchMedia for reduced motion; requestAnimationFrame for the scroll-spy.' },
  ],

  alternatives: [
    { name: 'IndexedDB (with idb or Dexie)', pick: 'More than a few hundred kilobytes, binary data, or queries. Asynchronous and transactional.' },
    { name: 'Cookies', pick: 'Only when the server must read the value on every request, such as a session id. Small and sent over the network.' },
    { name: 'A backend with accounts', pick: 'When data must follow the user across devices. Local storage is per browser per machine by design.' },
    { name: 'Origin Private File System', pick: 'Large files and high-performance reads and writes, such as an in-browser SQLite database.' },
  ],

  glossary: [
    { term: 'Origin', meaning: 'Scheme plus host plus port. The boundary for storage and most security decisions.' },
    { term: 'localStorage', meaning: 'A synchronous string key-value store per origin that persists across sessions.' },
    { term: 'sessionStorage', meaning: 'The same, but per tab and cleared when the tab closes.' },
    { term: 'Quota', meaning: 'The storage limit per origin; about 5 MB for Web Storage.' },
    { term: 'storage event', meaning: 'Fired in other tabs of the same origin when localStorage changes.' },
    { term: 'matchMedia', meaning: 'Evaluates a media query from JavaScript and reports changes.' },
    { term: 'requestAnimationFrame', meaning: 'Schedules a callback right before the next paint.' },
    { term: 'IntersectionObserver', meaning: 'Reports when an element enters or leaves a viewport or root.' },
    { term: 'Passive listener', meaning: 'A listener that promises not to cancel scrolling so the browser need not wait for it.' },
    { term: 'Secure context', meaning: 'HTTPS or localhost; required for clipboard, wake lock and most new APIs.' },
  ],

  quiz: [
    {
      question: 'What does localStorage.setItem("prefs", { theme: "paper" }) store?',
      options: ['The object', 'The string "[object Object]", because values are coerced to strings', 'A JSON string automatically', 'Nothing; it throws'],
      answerIndex: 1,
      explanation: 'Web Storage holds strings only. Serialise with JSON.stringify and parse on read.',
    },
    {
      question: 'Tab A writes to localStorage. Which tabs receive the storage event?',
      options: ['Tab A only', 'All tabs on the same origin except Tab A', 'All tabs in the browser', 'None; storage has no events'],
      answerIndex: 1,
      explanation: 'The event is for other documents of the same origin. The writer already knows what it wrote.',
    },
    {
      question: 'Why wrap localStorage reads in try/catch even when the key was written by your own code?',
      options: ['Habit', 'Storage can be blocked or the value corrupted or from an older version; JSON.parse and access itself can throw', 'getItem is asynchronous', 'To catch quota errors on read'],
      answerIndex: 1,
      explanation: 'Private modes, blocked site data, crashes mid-write and old schemas are all real. A fallback keeps the app rendering.',
    },
    {
      question: 'A scroll handler runs expensive layout code on every event and the page stutters. What is the standard fix?',
      options: ['Use setTimeout', 'Schedule the work with requestAnimationFrame so it runs at most once per frame, and mark the listener passive', 'Use a faster loop', 'Move it to a Web Worker'],
      answerIndex: 1,
      explanation: 'Scroll events can fire more often than frames. Coalescing into one rAF per frame matches the screen; passive lets the browser scroll without waiting.',
    },
    {
      question: 'Which API tells you a user has asked their operating system for reduced motion?',
      options: ['navigator.userAgent', 'matchMedia("(prefers-reduced-motion: reduce)")', 'localStorage', 'document.visibilityState'],
      answerIndex: 1,
      explanation: 'matchMedia evaluates any media query from script and emits change events when the setting changes.',
    },
  ],
}
