// ---------------------------------------------------------------------------
// "Under the hood", part two: state, motion, styling, storage and icons.
//
// Every snippet below is copied from a file in this repository. Open the file
// named under each one and read the lines around it; the explanation is only
// half the lesson.
// ---------------------------------------------------------------------------

import type { Tech } from './stack-types'

export const stateTech: Tech[] = [
  // -------------------------------------------------------------------------
  {
    id: 'zustand',
    name: 'Zustand',
    version: '^5.0.6',
    category: 'state',
    order: 6,
    role: 'Holds every piece of your progress in one store, and saves it to the browser so a refresh loses nothing.',
    what:
      'Zustand is a small state library for React. You create one store that holds data and the functions that change it, then any component reads the exact slice it needs. There is no provider to wrap the app in and no reducer ceremony: you call a function, it calls set, and everything reading that slice re-renders.',
    why:
      'The alternative was React Context, which is built in but re-renders every consumer whenever any part of the value changes, so a single XP gain would repaint the whole app. Redux Toolkit solves that too but adds slices, actions and a lot of vocabulary for a solo project. Zustand gives per-slice subscriptions and localStorage saving in about thirty lines of setup. The honest trade-off: nothing stops the store from growing without limit. useApp.ts is now over four hundred lines and mixes scheduling, XP and appearance in one object, because Zustand never asked you to split it.',
    howUsedHere: `One store, **src/store/useApp.ts**, is the whole app's memory. Its shape is \`PersistedState & Actions\`: the data half is declared in **src/store/types.ts** (profile, quests, attempts, notes, XP events, streak) and the actions half is declared in the \`Actions\` interface right in the store file.

Components never read the store as a whole. They subscribe with a selector: **src/components/Shell.tsx** takes six separate slices, and **src/components/QuestCard.tsx** pulls just the three action functions it calls. That is why marking a quest done repaints the card and the sidebar XP bar, and nothing else.

Actions are plain functions closed over \`set\` and \`get\`. Read \`completeQuest\` and \`recordAttempt\`: both build a whole next state object, mutate that local copy through helpers like \`grantXp\` and \`touchStreak\`, then hand it to \`set\` once. One write, one render.

Two module-level selectors, \`selectToday\` and \`selectMissed\`, live at the bottom of the file so pages share the same filtering rather than each writing their own.

Outside React the store is still reachable: Shell.tsx calls \`useApp.getState().toggleFocusMode()\` from a click handler that sits outside the subscribed tree.`,
    snippets: [
      {
        label: 'Creating the store, wrapped in persist',
        file: 'src/store/useApp.ts',
        code: `export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialPersisted,
      messages: [],
      focusMode: false,
      appearance: defaultAppearance,

      setAppearance: (patch) => set((s) => ({ appearance: { ...s.appearance, ...patch } })),
      resetAppearance: () => set({ appearance: defaultAppearance }),
      toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
      dismissMessage: (id) => set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),
      pushMessage: (m) => set((s) => ({ messages: [...s.messages, { ...m, id: uid() }] })),`,
        note:
          'Data and the functions that change it live in the same object. Every action returns a new object rather than editing the old one, which is what lets React tell that something changed. Note the double call, create<AppState>()(...): that empty pair is a TypeScript quirk of Zustand v5 that lets it infer the middleware types.',
      },
      {
        label: 'The persist options: key, merge, partialize',
        file: 'src/store/useApp.ts',
        code: `    {
      name: 'the-system-dsa-v1',
      /** Fill in appearance keys added after a save was written. */
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>
        return { ...current, ...p, appearance: { ...defaultAppearance, ...(p.appearance ?? {}) } }
      },
      partialize: (s) => {
        const { messages: _m, ...rest } = s as AppState
        void _m
        const out: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(rest)) if (typeof v !== 'function') out[k] = v
        return out as unknown as AppState
      },
    },`,
        note:
          'name is the localStorage key: everything you have done is one JSON string under the-system-dsa-v1. partialize decides what gets written, dropping functions and the transient toast queue. merge decides what happens when an old save meets new code; without that appearance line, a save written before the Japanese-label setting existed would load an appearance object missing that key, and the UI would read undefined.',
      },
      {
        label: 'Subscribing to slices, not to the whole store',
        file: 'src/components/Shell.tsx',
        code: `  const profile = useApp((s) => s.profile)
  const totalXp = useApp((s) => s.totalXp)
  const streak = useApp((s) => s.streak)
  const ensureToday = useApp((s) => s.ensureToday)
  const focusMode = useApp((s) => s.focusMode)
  const appearance = useApp((s) => s.appearance)`,
        note:
          'Six calls, six subscriptions. Each one re-renders Shell only when that particular value changes by reference. Writing useApp((s) => s) once would undo all of it and re-render on every keystroke anywhere in the app.',
      },
    ],
    teaches: [
      'A selector is a subscription: what you read decides what re-renders.',
      'Immutable updates are how React detects change; spread a new object instead of editing the old one.',
      'Keeping state outside the component tree means click handlers, timers and non-React code can all reach it.',
      'Saved state and current code drift apart over time, so migration has to be designed, not assumed.',
      'One action should produce one write, or the user sees intermediate renders.',
    ],
    tryThis: [
      'Open DevTools, Application, Local Storage, and read the-system-dsa-v1. Complete a quest and watch the JSON change.',
      'Temporarily change one Shell.tsx line to const state = useApp((s) => s), then use the React DevTools profiler to see how much more re-renders.',
      'Add a boolean to Appearance in src/lib/appearance.ts with a default, reload without clearing storage, and confirm merge fills it in.',
      'Move selectToday and selectMissed out of useApp.ts into a new src/store/selectors.ts and fix the imports.',
    ],
    gotchas: [
      'Returning the same object reference from set means no re-render. That is why grantXp builds next.dayLogs as a fresh object each time.',
      'Selectors that build a new array or object inline, such as (s) => s.quests.filter(...), return a new reference every render and can loop. Filter after subscribing, or memoise.',
      'partialize here skips functions by name-checking typeof v !== "function". Add a non-function field you do not want saved and it will be saved silently.',
      'Bumping the store name would abandon every existing save. The version field inside PersistedState is the intended place to record a shape change.',
    ],
    docs: [
      { label: 'Zustand documentation', url: 'https://zustand.docs.pmnd.rs/' },
      { label: 'persist middleware', url: 'https://zustand.docs.pmnd.rs/integrations/persisting-store-data' },
      { label: 'TypeScript guide', url: 'https://zustand.docs.pmnd.rs/guides/typescript' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    version: '^12.23.0',
    category: 'motion',
    order: 7,
    role: 'Animates panels in, toasts out and the reading progress bar, and turns all of it off when you ask for stillness.',
    what:
      'Framer Motion is an animation library for React. You swap a div for a motion.div and describe states as props: where it starts, where it should end, how long the trip takes. It also animates elements as they leave the tree, which plain CSS cannot do, because a removed element is simply gone.',
    why:
      'Most of the movement here could have been CSS keyframes, and much of it is: the backgrounds in backgrounds.css animate without any JavaScript. Framer Motion earns its place for three things CSS is bad at: exit animations, scroll-linked values, and one central switch that disables everything. The trade-off is weight and coupling. It is one of the larger dependencies in package.json, and every animated element is now a React component that re-renders, where a CSS class would have cost nothing.',
    howUsedHere: `Four patterns cover almost all of it.

**src/components/Reveal.tsx** is a wrapper used across pages: it fades and lifts a block once, when it scrolls into view. \`viewport={{ once: true }}\` is what makes it settle rather than flicker on every scroll pass.

**src/components/ReadingProgress.tsx** links the page scroll to the width of the hairline at the top. \`useScroll\` gives a value from 0 to 1, \`useSpring\` softens it so the bar eases instead of snapping.

**src/components/SystemMessages.tsx** is the only place exit animations matter. XP toasts and the level-up overlay are wrapped in \`AnimatePresence\`, which keeps a removed element mounted long enough to play its \`exit\` prop.

**src/components/Shell.tsx** wraps the entire app in \`MotionConfig\`. The Appearance setting "Still" maps through \`motionSetting\` to \`reducedMotion="always"\`, which flattens every animation below it. The same setting also adds a \`motion-still\` class, and global.css uses it to kill the CSS animations Framer Motion cannot see.

**src/components/QuestCard.tsx** adds \`layout\`, so cards slide into place when one is removed.`,
    snippets: [
      {
        label: 'A reusable scroll-into-view reveal',
        file: 'src/components/Reveal.tsx',
        code: `export default function Reveal({ children, delay = 0, className, y = 12 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px 0px -80px 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}`,
        note:
          'Three props describe the whole animation: where it starts, where it goes, how it travels. The negative viewport margin fires the reveal slightly before the block is fully on screen, so the movement has finished by the time you look at it. That ease array is the same cubic-bezier stored as --ease-out-expo in global.css.',
      },
      {
        label: 'Scroll position as an animated value',
        file: 'src/components/ReadingProgress.tsx',
        code: `import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin line at the very top that fills as you move down a concept. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return <motion.div className="reading-progress" style={{ scaleX }} aria-hidden />
}
`,
        note:
          'scrollYProgress is a motion value, not React state, so scrolling does not re-render this component at all; the value is written straight to the DOM. useSpring wraps it in physics so the bar lags slightly behind your thumb. Scaling a 100%-wide bar is far cheaper than animating its width, because scale does not force layout.',
      },
      {
        label: 'One switch for the whole tree',
        file: 'src/components/Shell.tsx',
        code: `  return (
    <MotionConfig reducedMotion={motionSetting[appearance.motion] ? 'always' : 'user'}>
    <div
      className={cx(
        'min-h-full',
        appearance.grain && 'grain',
        appearance.motion === 'still' && 'motion-still',
        !appearance.readingSheet && 'no-sheet',
        calm && focusMode && 'focus-mode',
      )}
    >`,
        note:
          'motionSetting is { full: false, calm: false, still: true }, so only the Still setting forces reducedMotion. "user" means defer to the operating system\'s reduce-motion preference. Notice the app never overrides that preference downward: the user can always ask for less, never for more.',
      },
      {
        label: 'Animating something that is being removed',
        file: 'src/components/SystemMessages.tsx',
        code: `        <AnimatePresence>
          {toasts.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="panel panel-system corner px-4 py-3 pointer-events-auto cursor-pointer"
              onClick={() => dismiss(m.id)}
            >`,
        note:
          'This is the thing CSS cannot do. When dismissMessage removes a toast from the store, React would normally unmount it instantly; AnimatePresence holds it in the DOM until exit finishes. The stable key={m.id} is what lets it track which toast left, so ids from the store must never be reused.',
      },
    ],
    teaches: [
      'Animate transform and opacity. They are handled by the compositor; width, height and top force the browser to lay the page out again.',
      'Enter and exit are different problems: exit needs something to delay the unmount.',
      'Motion should be a user setting, wired once at the root, not sprinkled per component.',
      'Values that change every frame are better kept out of React state entirely.',
      'Shared easing belongs in one place, so animation feels like one hand made it.',
    ],
    tryThis: [
      'Set Appearance to Still and confirm the toasts appear instantly. Then find which CSS in global.css handles the parts MotionConfig does not.',
      'Change viewport once: true to false in Reveal.tsx and scroll a concept page up and down. Decide whether you prefer it.',
      'Delete the exit prop in SystemMessages.tsx and watch a toast vanish instead of leaving.',
      'Give the ReadingProgress spring stiffness 800 and damping 10, then 40 and 30, and feel the difference.',
    ],
    gotchas: [
      'AnimatePresence only animates its direct children, and each needs a stable key. Move the conditional outside it and exits stop working.',
      'The layout prop on QuestCard is not free: it measures the element before and after every change.',
      'Animating filter: blur, as the toasts do, is more expensive than opacity. It is fine for three toasts and would not be for a long list.',
      'MotionConfig cannot reach CSS keyframes. That is why appearance.motion === "still" also has to add the motion-still class.',
    ],
    docs: [
      { label: 'Motion for React', url: 'https://motion.dev/docs/react' },
      { label: 'AnimatePresence', url: 'https://motion.dev/docs/react-animate-presence' },
      { label: 'Accessibility and reduced motion', url: 'https://motion.dev/docs/react-accessibility' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'css-arch',
    name: 'CSS architecture',
    version: 'no library',
    category: 'styling',
    order: 8,
    role: 'Nine themes, seventeen backgrounds and every panel and button in the app, driven by custom properties rather than by JavaScript.',
    what:
      'CSS custom properties are variables that live in the page itself. You declare --accent-rgb once, and every rule that reads it updates the moment the value changes. Because they cascade, setting one attribute high in the document rewrites the colours of everything beneath it, with no re-render and no component knowing it happened.',
    why:
      'The obvious alternative was to keep the theme in React and pass colours down as props, or to generate a stylesheet per theme. Both mean JavaScript work on every theme change and a rebuild for every new theme. Here a theme is a block of CSS and a single attribute write, done in applyAppearance in src/lib/appearance.ts. The trade-off is that TypeScript cannot see any of it. Add a theme id without adding the matching CSS block and the compiler stays silent; you find out by looking. The same applies to every class name typed into a component.',
    howUsedHere: `**src/styles/global.css** is the spine. It opens with an \`@theme\` block that points Tailwind's colour tokens at custom properties, so the utility class \`text-system\` resolves to \`--accent\` and follows the theme like everything else.

Below that are nine \`:root[data-theme="..."]\` blocks, one per theme in \`THEMES\` in **src/lib/appearance.ts**. Each defines the same names: \`--bg\`, \`--fg\`, \`--accent-rgb\`, \`--surface-1\`, and so on. Switching a theme is one line, \`root.setAttribute('data-theme', a.theme)\`.

Colours are stored twice on purpose: \`--accent\` as a hex value, and \`--accent-rgb\` as three bare numbers. The bare numbers let any rule compose its own alpha with \`rgb(var(--accent-rgb) / 0.35)\`, which is why one triplet drives borders, glows, selection and hover states without nine more variables.

The component classes come next, \`.panel\`, \`.btn\`, \`.chip\`, \`.input\`, \`.eyebrow\`, each built only from those properties. Components then mix them with Tailwind utilities for layout.

**src/styles/backgrounds.css** adds a second idea: \`--tex-boost\` and \`--tex-scale\`, so one pattern can render subtly full-page and loudly in a 92-pixel preview.`,
    snippets: [
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
  --gold: #c9a24a;`,
        note:
          'Names are semantic, never literal: --accent, not --blue. Eight more blocks follow with exactly these names and different values. --accent-rgb holds three bare numbers so any rule can pick its own transparency. color-scheme tells the browser to draw native scrollbars and form controls dark.',
      },
      {
        label: 'A component class built only from properties',
        file: 'src/styles/global.css',
        code: `.panel {
  position: relative;
  background: linear-gradient(180deg, var(--surface-1), var(--surface-2));
  border: 1px solid var(--line);
  border-radius: 14px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 rgb(255 255 255 / 0.03) inset, 0 20px 60px -30px rgb(0 0 0 / var(--shadow-strength));
}
.panel-system {
  border-color: rgb(var(--accent-rgb) / 0.35);
  box-shadow:
    0 0 0 1px rgb(var(--accent-rgb) / 0.08) inset,
    0 0 28px -6px var(--glow),
    0 30px 80px -40px rgb(0 0 0 / var(--shadow-strength));
}`,
        note:
          'Not one literal colour except a white inset highlight. rgb(var(--accent-rgb) / 0.35) is the whole trick: one triplet, many alphas. .panel-system is a modifier that only adds, so a component can write className="panel panel-system" and get the accented version of the same box.',
      },
      {
        label: 'Two variables that let one pattern serve two sizes',
        file: 'src/styles/backgrounds.css',
        code: `/* ---------------------------------------------------------------------------
   Background styles.

   Every pattern scales its opacity by --tex-boost and its tile size by
   --tex-scale. The full-page layer leaves both at 1 so the texture stays
   almost subliminal; the preview thumbnails raise the boost and shrink the
   tiles so the difference between options is obvious at 92 pixels tall.
   --------------------------------------------------------------------------- */

.bg-layer { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.bg-thumb { position: absolute; inset: 0; pointer-events: none; overflow: hidden; --tex-boost: 4; --tex-scale: 0.34; }
.bg-thumb, .bg-thumb::before, .bg-thumb::after { animation: none !important; }`,
        note:
          'Custom properties inherit, so setting --tex-boost on .bg-thumb changes every pattern rule underneath it. Seventeen backgrounds are written once and rendered at two intensities. Note also that thumbnails freeze their animations: seventeen animated previews on the Appearance page would cook a laptop.',
      },
      {
        label: 'A pattern reading those variables',
        file: 'src/styles/backgrounds.css',
        code: `/* Rain: thin streaks falling at a slight angle. */
.bg-rain {
  background-image: repeating-linear-gradient(
    99deg,
    transparent 0 22px,
    rgb(var(--accent-rgb) / calc(0.16 * var(--tex-boost, 1))) 22px 23px,
    transparent 23px 46px
  );
  background-size: auto calc(220px * var(--tex-scale, 1));
  mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent);
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent);
  animation: rain-fall 2.6s linear infinite;
}`,
        note:
          'A whole texture with no image file and no canvas: a repeating gradient, an accent colour it did not choose, and calc() to scale itself. The fallback in var(--tex-boost, 1) is what makes it correct full-page, where nobody set the variable. The mask fades it out at top and bottom so it never fights the text.',
      },
    ],
    teaches: [
      'Name colours by role, not by hue, and theming becomes possible later without a rewrite.',
      'Custom properties cascade, so one attribute on <html> can restyle a whole page with no JavaScript.',
      'Storing a colour as bare numbers lets one value serve many transparencies.',
      'Small composable classes plus modifiers beat one class per screen.',
      'calc() and variable fallbacks let a single rule adapt to the context it is dropped into.',
    ],
    tryThis: [
      'Add a tenth theme: copy a :root[data-theme] block in global.css, rename it, then add the id to ThemeId and THEMES in src/lib/appearance.ts.',
      'In DevTools, edit --accent-rgb on the html element and watch borders, glows, links and text selection all move together.',
      'Change --tex-boost on .bg-thumb from 4 to 1 and look at the Appearance page previews.',
      'Find every rule in global.css that mentions data-theme="paper" and work out why light themes needed the exception.',
    ],
    gotchas: [
      'rgb(var(--accent-rgb) / 0.35) only works because --accent-rgb is three space-separated numbers with no rgb() wrapper. Store it as a hex and every alpha in the file breaks at once.',
      'A misspelled property is not an error. The declaration is dropped and you get a transparent or default value with no warning.',
      'Light themes needed real exceptions, not just different values: glow, grain blend mode and button contrast all have their own paper and daylight rules.',
      'backdrop-filter on .panel is expensive. Many overlapping panels on a weak machine is the first place scrolling gets rough.',
    ],
    docs: [
      { label: 'MDN: using CSS custom properties', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties' },
      { label: 'MDN: cascade and inheritance', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts' },
      { label: 'MDN: color-scheme', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'web-storage',
    name: 'localStorage & the browser platform',
    version: 'browser API',
    category: 'state',
    order: 9,
    role: 'The entire database. Progress, settings and scratchpad code live in your browser, and nothing is ever sent anywhere.',
    what:
      'localStorage is a small key-value store built into every browser. Keys and values are strings, so objects go in through JSON.stringify and come out through JSON.parse. It is tied to one origin and one browser profile, it survives closing the tab and the machine, and it is synchronous, which means reading it blocks the page until it answers.',
    why:
      'There is no server, no account and no database in this project, and that was deliberate: no hosting to pay for, no login to build, no privacy question about a personal study log. localStorage is the simplest thing that keeps data across refreshes. The trade-offs are real. Your progress is stuck in one browser on one machine, and clearing site data deletes it. That is exactly why Settings has an export and import button: a JSON file is the sync mechanism, operated by hand.',
    howUsedHere: `Three uses, in increasing order of directness.

Most writing is invisible. Zustand's \`persist\` middleware in **src/store/useApp.ts** serialises the store to the key \`the-system-dsa-v1\` after every change, and reads it back before the first render. No component calls the API at all.

**src/pages/Scratchpad.tsx** goes direct, because editor text does not belong in the app store. It reads once in a lazy \`useState\` initialiser, so the read happens on the first render only, and writes on a 400 ms debounce, so typing does not hit the disk on every keystroke. Both are wrapped in try/catch.

**src/pages/Settings.tsx** provides the escape hatch. \`exportJson\` in the store rebuilds a clean \`PersistedState\` object, \`download\` wraps it in a \`Blob\`, and \`URL.createObjectURL\` turns that into a link the browser can save. Import is the mirror: \`file.text()\`, then \`importJson\`, which validates loosely and refuses anything without a profile.

The whole platform layer is like this: \`crypto.randomUUID\` for ids, \`performance.now\` for timings, \`setInterval\` in Shell.tsx to roll the day over.`,
    snippets: [
      {
        label: 'Reading once, defensively',
        file: 'src/pages/Scratchpad.tsx',
        code: `  const [code, setCode] = useState<Record<RunLang, string>>(() => {
    try {
      const saved = localStorage.getItem('the-system-scratch')
      if (saved) return { ...STARTER, ...JSON.parse(saved) }
    } catch {
      /* ignore */
    }
    return STARTER
  })`,
        note:
          'Two failures are handled by one try: localStorage itself throwing, and JSON.parse choking on corrupted text. Either way you get the starter code instead of a white screen. Passing a function to useState makes this a lazy initialiser, so the read runs on the first render only. Spreading STARTER first means a save missing a language still has one.',
      },
      {
        label: 'Writing on a debounce',
        file: 'src/pages/Scratchpad.tsx',
        code: `  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem('the-system-scratch', JSON.stringify(code))
      } catch {
        /* ignore */
      }
    }, 400)
  }, [code])`,
        note:
          'Every keystroke cancels the pending save and books a new one, so a burst of typing costs one write. This matters because localStorage is synchronous: a large setItem on every character would show up as input lag. The timer id lives in a ref because changing it must not cause a render.',
      },
      {
        label: 'Handing the user a file, with no server',
        file: 'src/pages/Settings.tsx',
        code: `  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`the-system-backup-\${new Date().toISOString().slice(0, 10)}.json\`
    a.click()
    URL.revokeObjectURL(url)
  }`,
        note:
          'A Blob is a lump of data in memory; createObjectURL gives it a temporary address the browser can treat like a file. Creating a link element and clicking it in code is the standard way to trigger a save dialog. revokeObjectURL releases the memory; skip it and the blob is held until the tab closes.',
      },
      {
        label: 'Taking a file back in, without trusting it',
        file: 'src/store/useApp.ts',
        code: `      importJson: (json) => {
        try {
          const data = JSON.parse(json) as Partial<PersistedState>
          if (!data || typeof data !== 'object' || !data.profile) return false
          set({ ...initialPersisted, ...data, profile: { ...defaultProfile, ...data.profile } })
          get().ensureToday()
          return true
        } catch {
          return false
        }
      },`,
        note:
          'The cast to Partial<PersistedState> is a promise to the compiler, not a check; at runtime the JSON could be anything, so there is a real guard as well. Spreading over initialPersisted means a backup from an older version still lands in a complete state object. It returns a boolean rather than throwing, and Settings.tsx turns that into a message.',
      },
    ],
    teaches: [
      'Persistence is a design decision with consequences: no backend means no sync, and an export button becomes a feature rather than a nicety.',
      'Anything that can throw at the edge of your app gets a try/catch and a sensible fallback.',
      'Data you did not create is untrusted, whatever its TypeScript type claims.',
      'Debounce writes that follow typing; the user should never feel storage.',
      'Blobs and object URLs let a purely client-side app produce and consume real files.',
    ],
    tryThis: [
      'Open the app in a private window, use it, close it, and reopen. Notice what survives and what does not.',
      'Export a backup, edit one number in the JSON, import it, and see the change in the app.',
      'Delete the profile key from an exported file and import it. Confirm the guard in importJson refuses it.',
      'Remove the debounce in Scratchpad.tsx so it writes on every keystroke, then type fast in a long file and watch for lag.',
    ],
    gotchas: [
      'localStorage throws, it does not return null, when a browser blocks site data or in some private modes. Every access in this app is wrapped for that reason.',
      'The quota is small, roughly 5 MB per origin, and setItem throws QuotaExceededError when you cross it. Storing solutions or long notes is what would eventually hit it.',
      'It is synchronous. Big JSON.stringify calls on every change block the main thread.',
      'Two tabs of this app both write the same key and the last write wins. Nothing here listens for the storage event.',
    ],
    docs: [
      { label: 'MDN: Window.localStorage', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage' },
      { label: 'MDN: URL.createObjectURL', url: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static' },
      { label: 'MDN: Blob', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Blob' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'lucide',
    name: 'Lucide React',
    version: '^0.525.0',
    category: 'content',
    order: 10,
    role: 'Every icon in the app, imported as a React component so it inherits the current theme colour.',
    what:
      'Lucide is an open source icon set, and lucide-react ships each icon as a small React component that renders an inline SVG. You import the ones you want by name and use them as tags. They take props such as size and strokeWidth, and their stroke is set to currentColor, so a text colour class on the icon is enough to colour it.',
    why:
      'The alternatives were an icon font, which brings a whole font file and blurry off-pixel rendering, or hand-written SVG files, which means finding an import strategy and drawing anything missing yourself. Lucide gives around a thousand icons in a consistent stroke style, tree-shaken so only the imported ones ship. The trade-off is that the set has a fixed personality: one weight, one corner radius. Where this app needed something else, it drew its own, such as the rank badge in src/components/ui.tsx.',
    howUsedHere: `**src/components/Shell.tsx** imports twelve icons on one line and puts them straight into the \`NAV\` array as values. Each nav entry carries its icon component next to its route, so the render loop writes \`<n.icon size={16} />\` and never touches a switch statement.

**src/components/QuestCard.tsx** does the same trick for quest kinds: the \`ICON\` map turns \`learn\`, \`solve\`, \`review\`, \`quiz\`, \`boss\`, \`light\` and \`free\` into components, so \`const Icon = ICON[quest.kind]\` picks the right one by type. Because \`QuestKind\` is a union in **src/store/types.ts**, adding a new kind makes TypeScript demand an entry in the map.

Colour is never passed as a prop. Icons take Tailwind text classes that resolve to theme properties, so an active nav item gets \`text-system\` and a streak flame gets \`text-ember\`, and both follow whichever of the nine themes is set.

Sizes are deliberately small and consistent: 16 in the sidebar, 12 to 14 on \`.btn-xs\` buttons, matched to the text beside them.`,
    snippets: [
      {
        label: 'Icons stored as data, next to what they label',
        file: 'src/components/QuestCard.tsx',
        code: `import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Swords, RotateCcw, Gauge, Skull, Feather, Check, CalendarClock, Trash2, ExternalLink } from 'lucide-react'
import type { Quest } from '@/store/types'
import { useApp } from '@/store/useApp'
import { getProblem, getConcept } from '@/lib/content'
import { addDaysKey, nextStudyDay, prettyDate, todayKey, isStudyDay } from '@/lib/dates'
import { cx } from './ui'

const ICON = { learn: BookOpen, solve: Swords, review: RotateCcw, quiz: Gauge, boss: Skull, light: Feather, free: Feather }
const KIND_LABEL = { learn: 'Learn', solve: 'Solve', review: 'Review', quiz: 'Drill', boss: 'Boss fight', light: 'Light', free: 'Custom' }`,
        note:
          'A React component is an ordinary value, so it can sit in an object like any string. ICON and KIND_LABEL are keyed identically, which is why the component can do ICON[quest.kind] and KIND_LABEL[quest.kind] with no branching. Named imports are what let the bundler drop the other thousand icons.',
      },
      {
        label: 'Choosing an icon by type at render time',
        file: 'src/components/QuestCard.tsx',
        code: `        <div
          className={cx(
            'w-9 h-9 rounded-lg grid place-items-center shrink-0 border',
            done ? 'border-[rgb(var(--good-rgb)/0.4)] text-jade bg-[rgb(var(--good-rgb)/0.08)]' : quest.kind === 'boss' ? 'border-[rgb(var(--danger-rgb)/0.5)] text-ember bg-[rgb(var(--danger-rgb)/0.08)]' : 'border-[rgb(var(--accent-rgb)/0.35)] text-system bg-[rgb(var(--accent-rgb)/0.08)]',
          )}
        >
          {done ? <Check size={16} /> : <Icon size={16} />}
        </div>`,
        note:
          'Icon is capitalised because JSX treats a lowercase tag as an HTML element; the variable had to be named Icon, not icon, to be rendered. No colour is given to the icon itself. The wrapper sets text-jade, text-ember or text-system, and the SVG stroke follows currentColor down into it.',
      },
      {
        label: 'The same pattern across the sidebar',
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
          'n.icon is a component held on a plain object, rendered directly as <n.icon />. The whole sidebar, ten routes with icons, active states and hover colours, is one map over the NAV array. Adding a page means adding one line to that array, not editing JSX.',
      },
    ],
    teaches: [
      'Components are values: they can live in arrays and maps and be chosen at runtime.',
      'JSX decides element versus component by capitalisation, which is why dynamic tags need a capitalised variable.',
      'currentColor is the cleanest way to let an icon follow the text it sits with.',
      'Inline SVG stays sharp at any zoom and can be styled by CSS, unlike an image or an icon font.',
      'Keeping a lookup table beside a union type turns "did you handle the new case" into a compile error.',
    ],
    tryThis: [
      'Add a nav entry to the NAV array in Shell.tsx with an icon of your choice and see it appear with no other change.',
      'Add a kind to QuestKind in src/store/types.ts and watch tsc point at the ICON and KIND_LABEL maps.',
      'Replace <Icon size={16} /> with <Icon size={16} strokeWidth={1} /> in QuestCard.tsx and compare the weight against the text.',
      'Inspect a sidebar icon in DevTools, find the inline SVG, and change the text colour on its parent to see the stroke follow.',
    ],
    gotchas: [
      'Import from lucide-react by name. A default or namespace import pulls the entire set into the bundle.',
      'Icons are inline SVGs, so a long list means a lot of DOM nodes; a hundred rows with four icons each is four hundred SVGs.',
      'A decorative icon next to a text label needs no accessible name, but an icon-only button does. The reschedule and delete buttons in QuestCard.tsx lean on the title attribute for that.',
      'Lucide version numbers move fast and icons are occasionally renamed, so an upgrade can break an import that was fine yesterday.',
    ],
    docs: [
      { label: 'Lucide icons', url: 'https://lucide.dev/icons/' },
      { label: 'Lucide for React', url: 'https://lucide.dev/guide/packages/lucide-react' },
      { label: 'MDN: SVG and currentColor', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword' },
    ],
  },
]
