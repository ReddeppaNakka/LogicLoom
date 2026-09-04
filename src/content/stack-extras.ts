import type { Tech } from './stack-types'

// ---------------------------------------------------------------------------
// The second half of "Under the hood": the libraries that each do one visible
// job, plus the pipeline that puts the built site on the internet.
//
// Every snippet below is copied out of this repository. Open the file named on
// the snippet and read the code around it.
// ---------------------------------------------------------------------------

export const extraTech: Tech[] = [
  {
    id: 'three',
    name: 'Three.js',
    version: '^0.178.0',
    category: 'graphics',
    role: 'Draws the drifting particle field behind the app, on a WebGL canvas.',
    what: 'Three.js is a JavaScript library for 3D graphics in the browser. Your graphics card can draw triangles very fast, but the raw browser API for talking to it, WebGL, is long and unforgiving. Three.js gives you the familiar nouns instead: a scene, a camera, geometry, a material, and a renderer that draws one frame when you ask it to.',
    why: 'The moving backgrounds in this app are almost all CSS gradients, which cost nothing. Motes is the exception: 420 independent points that drift, wrap around, and lean towards your cursor. Doing that with DOM elements would mean 420 nodes the browser has to lay out sixty times a second. On the GPU it is one draw call. The honest trade-off is weight. Three.js is by far the largest dependency in this project, hundreds of kilobytes on its own, for a decorative background nobody strictly needs. That is why vite.config.ts splits it into its own chunk, and why the canvas is mounted only when you actually pick Drifting motes.',
    howUsedHere: `**src/components/AppBackground.tsx** is the only file in the app that imports Three.js.

\`AppBackground\` looks up the background you chose. Every option except one is a plain CSS class, so it returns a \`<div className={...} />\` and stops there. Only *Drifting motes* falls through to the \`Motes\` component, which is where Three.js runs. **src/components/Shell.tsx** mounts \`AppBackground\` once for the whole app, and **src/pages/Onboarding.tsx** hard-codes \`id="motes"\` for the first screen you ever see.

Inside \`Motes\`, a single \`useEffect\` builds the scene: a \`WebGLRenderer\` bound to the \`<canvas>\` held in a ref, a \`PerspectiveCamera\`, and 420 points packed into a \`Float32Array\`. A \`requestAnimationFrame\` loop nudges each y value upward, flags \`needsUpdate\`, and renders. A \`MutationObserver\` watching \`data-theme\` re-reads the accent colour, so the motes follow your theme. The \`prefers-reduced-motion\` media query, and the app's own motion setting, collapse the loop down to one still frame.

**vite.config.ts** puts \`three\` in its own bundle chunk, so the rest of the app never has to carry it.`,
    snippets: [
      {
        label: 'Scene, camera, renderer',
        file: 'src/components/AppBackground.tsx',
        code: `  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const moving = animate && !reduce

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 8`,
        note: 'Three things every Three.js program has: a scene to hold objects, a camera to look at them, a renderer to draw them. The renderer is handed the canvas React already put on the page, rather than making its own. Note the deliberate downgrades: no antialiasing, a capped pixel ratio, and low-power mode. This is decoration, so it should not spin up the discrete GPU on a laptop.',
      },
      {
        label: 'Particles live in one flat typed array',
        file: 'src/components/AppBackground.tsx',
        code: `    const count = 420
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = 0.15 + Math.random() * 0.5
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))`,
        note: 'There is no array of 420 objects here. All the coordinates sit end to end in one Float32Array: x, y, z, x, y, z. The 3 in BufferAttribute says how many numbers make up one vertex. This is the shape the GPU wants, and it is why the index arithmetic reads i * 3 + 1 instead of p.y. Typed arrays are a normal part of the browser, not a Three.js invention.',
      },
      {
        label: 'The animation loop',
        file: 'src/components/AppBackground.tsx',
        code: `    let raf = 0
    const start = performance.now()
    const tick = () => {
      const t = (performance.now() - start) / 1000
      const arr = geo.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += speeds[i] * 0.004
        arr[i * 3] += Math.sin(t * 0.3 + i) * 0.0015
        if (arr[i * 3 + 1] > 8) arr[i * 3 + 1] = -8
      }
      geo.attributes.position.needsUpdate = true
      points.rotation.z = Math.sin(t * 0.05) * 0.03
      camera.position.x += (mx * 0.4 - camera.position.x) * 0.02
      camera.position.y += (-my * 0.25 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }`,
        note: 'requestAnimationFrame asks the browser to call you back just before the next repaint, so the loop stays in step with the screen instead of racing it. Editing the array is not enough on its own: needsUpdate tells Three.js to re-upload the buffer to the GPU. The two camera lines are a cheap easing trick. Each frame the camera moves two percent of the remaining distance towards the cursor, so it glides instead of snapping.',
      },
      {
        label: 'The cleanup that stops the leak',
        file: 'src/components/AppBackground.tsx',
        code: `    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      geo.dispose()
      geo2.dispose()
      mat.dispose()
      mat2.dispose()
      sprite.dispose()
      renderer.dispose()
    }`,
        note: 'This is the most important block in the file. A function returned from useEffect runs when the component unmounts, and again before the effect re-runs. Ordinary JavaScript objects would be garbage collected, but geometries, materials, textures and the renderer hold memory on the graphics card that the browser will not reclaim for you. Every one of them must be disposed by hand. Change the theme, change the background, or navigate away enough times without this, and the tab slowly eats memory until WebGL gives up.',
      },
    ],
    teaches: [
      'useEffect is for imperative, non-React systems, and its return value is where you tear them down.',
      "requestAnimationFrame is the browser's frame clock, and cancelAnimationFrame is how you stop it.",
      "Some resources live outside JavaScript's garbage collector and must be released explicitly.",
      'Heavy features should be opt-in: mount the expensive thing only when the user asks for it.',
      'Respect prefers-reduced-motion and page visibility, so animation never runs when it should not.',
    ],
    tryThis: [
      "Change count from 420 to 4000 in AppBackground.tsx, run the dev server, and watch the frame rate in your browser's performance panel. Then try 40000.",
      'Comment out geo.attributes.position.needsUpdate = true and reload. The maths still runs, but nothing moves. That single line is the CPU-to-GPU handoff.',
      'Comment out the whole dispose block, then switch the theme thirty times from Settings while watching memory in DevTools. Put it back afterwards.',
      'Add a third layer of points, like geo2 and mat2 but further back and smaller, and remember to dispose it in the cleanup.',
    ],
    gotchas: [
      'Forgetting dispose leaks GPU memory. It never shows up in a quick test, only after minutes of real use.',
      'The effect depends on [animate, accent, light], so a theme change tears the whole scene down and rebuilds it. That is safe here only because the cleanup is honest.',
      'renderer.setSize(w, h, false) passes false so Three.js does not write inline width and height onto the canvas, which would fight the Tailwind classes positioning it.',
      'Browsers limit how many live WebGL contexts a page may hold. Leaked renderers eventually make new canvases fail silently.',
    ],
    docs: [
      { label: 'Three.js manual: creating a scene', url: 'https://threejs.org/docs/#manual/en/introduction/Creating-a-scene' },
      { label: 'Three.js: how to dispose of objects', url: 'https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects' },
      { label: 'MDN: requestAnimationFrame', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame' },
    ],
    order: 11,
  },

  {
    id: 'recharts',
    name: 'Recharts',
    version: '^3.1.0',
    category: 'graphics',
    role: 'Draws the one chart in the app: the skill radar on the dashboard.',
    what: 'Recharts is a charting library built out of React components. Instead of calling a drawing API, you write JSX: a chart element, then axes, grids and series as its children. It renders SVG, so every part of the chart is a real element in the DOM that CSS can reach.',
    why: 'The app needs exactly one chart, a radar with eleven spokes. Writing that by hand in SVG means trigonometry, label placement and resize handling. Recharts is about ten lines instead. The library most people reach for first is Chart.js, which draws to a canvas, and that would have been a problem here: a canvas cannot inherit CSS custom properties, and this app has nine themes. Because Recharts emits SVG, the stroke can literally be var(--accent), and the chart re-colours itself when the theme changes with no JavaScript at all. The trade-off is that one chart pulls in a whole charting library, which is why vite.config.ts gives it its own chunk.',
    howUsedHere: `Recharts appears in exactly one file: **src/pages/Dashboard.tsx**.

The import at the top pulls in five pieces: \`RadarChart\`, \`PolarGrid\`, \`PolarAngleAxis\`, \`Radar\` and \`ResponsiveContainer\`. They are assembled inside the *Skill stats* panel, in a wrapper with a fixed height of 230 pixels.

The data comes from \`gateStats\`, an exported function at the bottom of the same file. It walks every gate, works out what fraction of its concepts you have learned and what fraction of its problems you have solved, averages the two, and returns an array of \`{ name, value }\` objects for eleven chosen gates. Recharts is told which fields to read through \`dataKey="name"\` and \`dataKey="value"\`; it never guesses.

That calculation runs across your whole progress state, so it sits inside \`useMemo\` and recomputes only when \`state.conceptProgress\` or \`state.attempts\` change.

Every colour in the chart is a CSS custom property defined in **src/styles/global.css**, so the radar follows your theme and your accent without a line of JavaScript.`,
    snippets: [
      {
        label: 'The whole chart',
        file: 'src/pages/Dashboard.tsx',
        code: `            <div className="h-[230px] -mx-2 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={stats.radar} outerRadius="72%">
                  <PolarGrid stroke="rgb(var(--fg-rgb)/0.12)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--fg-muted)', fontSize: 10.5 }} />
                  <Radar dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.22} strokeWidth={1.5} isAnimationActive />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-muted -mt-2">Rises as you clear problems in each area.</div>`,
        note: 'Read the colours. They are not hex codes, they are var(--accent) and rgb(var(--fg-rgb)/0.12), the same custom properties the rest of the app uses. That is only possible because Recharts renders SVG. ResponsiveContainer measures its parent and re-renders on resize, which is why the parent div needs a real height; a percentage of nothing is nothing.',
      },
      {
        label: 'Where the numbers come from',
        file: 'src/pages/Dashboard.tsx',
        code: `export function gateStats(state: ReturnType<typeof useApp.getState>) {
  const byGate: Record<string, { progress: number; solved: number; total: number; learned: number; concepts: number }> = {}
  for (const g of gates) {
    const cs = g.conceptIds.map(getConcept).filter(Boolean)
    const probs = problems.filter((p) => p.gateId === g.id)
    const solved = probs.filter((p) => state.attempts[p.id]?.status === 'solved').length
    const learned = cs.filter((c) => state.conceptProgress[c!.id]?.status === 'done').length
    const conceptPart = cs.length ? learned / cs.length : 0
    const probPart = probs.length ? solved / probs.length : 0
    byGate[g.id] = { progress: conceptPart * 0.5 + probPart * 0.5, solved, total: probs.length, learned, concepts: cs.length }
  }
  const radarGates = ['arrays-strings', 'searching-sorting', 'recursion-backtracking', 'linked-lists', 'stacks-queues', 'hashing', 'trees', 'heaps', 'graphs', 'dynamic-programming', 'greedy-bits-tries']
  const radar = radarGates.map((id) => ({ name: shortName(id), value: Math.round((byGate[id]?.progress ?? 0) * 100) }))
  return { byGate, radar }
}`,
        note: 'The chart component is deliberately dumb. All the thinking happens here, and Recharts receives a plain array of { name, value }. Keeping the data shaping out of the JSX means you can test this function, reuse byGate elsewhere on the page, and swap the chart library later without touching any logic.',
      },
      {
        label: 'Do the work once, not on every render',
        file: 'src/pages/Dashboard.tsx',
        code: `  const done = quests.filter((q) => q.status === 'done')
  const minutesPlanned = quests.reduce((s, q) => s + q.minutes, 0)
  const xpToday = state.dayLogs[today]?.xp ?? 0
  const due = dueReviews(state, today).length

  const stats = useMemo(() => gateStats(state), [state.conceptProgress, state.attempts])
  const plan = useMemo(() => projectPlan(state, addDaysKey(today, 1)), [state.conceptProgress, state.attempts, state.profile.studyDays])`,
        note: 'Cheap one-line filters are left plain; nobody needs to memoise a filter over a handful of quests. The two expensive walks over the whole content set are wrapped in useMemo with explicit dependencies. Note that the dependencies are the specific slices that matter, not the whole state object, which changes far more often.',
      },
    ],
    teaches: [
      'Declarative rendering applies to charts too: describe what the chart is, not the steps to draw it.',
      'SVG output stays inside the CSS system, so themes and custom properties come for free.',
      'Shape your data in a plain function and keep the component thin.',
      'A percentage height only works when some ancestor has a real height.',
      'useMemo is for expensive derivations, with dependencies named precisely.',
    ],
    tryThis: [
      'Add <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} /> inside the RadarChart and watch it pin the scale, so one strong area no longer fills the whole web.',
      'Add a second <Radar> series with a fixed target value, so you can see your shape against a goal.',
      'Edit the radarGates array in gateStats to drop a gate, and confirm the chart adapts with no other change.',
      'Switch the theme in Settings with the dashboard open, then inspect the radar path in DevTools and see that stroke is still literally var(--accent).',
    ],
    gotchas: [
      'ResponsiveContainer inside a parent with no measurable height renders an empty box. The h-[230px] wrapper in Dashboard.tsx is what makes it work.',
      'dataKey must match the field names your data actually has. A typo produces an empty chart, not an error.',
      'Recharts inspects its children by type, so plain HTML elements placed inside a chart are quietly ignored.',
      'isAnimationActive replays the entry animation on every data change, which looks busy when values update often.',
    ],
    docs: [
      { label: 'Recharts: RadarChart', url: 'https://recharts.org/en-US/api/RadarChart' },
      { label: 'Recharts: ResponsiveContainer', url: 'https://recharts.org/en-US/api/ResponsiveContainer' },
      { label: 'MDN: SVG tutorial', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Introduction' },
    ],
    order: 12,
  },

  {
    id: 'monaco',
    name: 'Monaco Editor',
    version: '@monaco-editor/react ^4.7.0',
    category: 'content',
    role: 'Provides the code editor on the Scratchpad page, where you try an idea before you trust it.',
    what: 'Monaco is the text editor that powers VS Code, extracted so it can run on a web page. It brings syntax highlighting, bracket matching, multiple cursors and the keyboard shortcuts you already know. The @monaco-editor/react package is a thin wrapper that loads Monaco and exposes it as one React component.',
    why: 'A plain textarea would have been far lighter, but the Scratchpad exists so you can trace a two-pointer loop by hand, and that is painful without indentation help and highlighting. Monaco was chosen over CodeMirror mainly for familiarity: the muscle memory is the same as VS Code. The trade-off is real weight, so it gets its own chunk in vite.config.ts and downloads only when you open the Scratchpad. Running Python is a separate decision. Pyodide, which is CPython compiled to WebAssembly, is roughly ten megabytes, so it is never bundled. It is fetched from a CDN the first time you press Run, and only when you are on the Python tab.',
    howUsedHere: `Everything lives in **src/pages/Scratchpad.tsx**.

\`Editor\` from \`@monaco-editor/react\` is used as a controlled component: \`value\` comes from React state, \`onChange\` writes back to it, and \`language\` is whichever tab you picked. The \`options\` object turns off the minimap and the current-line highlight, sets the app's mono font, and stops scrolling past the last line, so the editor reads as part of the page rather than a tool dropped onto it. A \`loading\` element covers the moment before Monaco arrives.

Your code is kept in state per language and written to \`localStorage\` under \`the-system-scratch\`, debounced by 400 ms so typing does not hit storage on every keystroke.

Running is handled by \`run\`. JavaScript is executed with \`new Function\` and a fake \`console\` that collects log lines. Python goes through \`loadPy\`, which injects a \`<script>\` tag pointing at Pyodide on jsDelivr and caches the resulting promise in a module-level variable, so the ten-megabyte runtime is fetched at most once per page load.`,
    snippets: [
      {
        label: 'The editor as a controlled component',
        file: 'src/pages/Scratchpad.tsx',
        code: `        <Panel className="overflow-hidden">
          <Editor
            height="520px"
            language={lang}
            theme="vs-dark"
            value={code[lang]}
            onChange={(v) => setCode((c) => ({ ...c, [lang]: v ?? '' }))}
            options={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 14 }, tabSize: 4, smoothScrolling: true, renderLineHighlight: 'none' }}
            loading={<div className="p-6 text-muted text-sm">Loading editor…</div>}
          />
        </Panel>`,
        note: 'A whole VS Code editor behind the same value and onChange pair as an input element. React state is the single source of truth. onChange types its argument as string or undefined, hence the ?? fallback. The loading prop matters: Monaco arrives asynchronously, so without it the panel sits blank on a slow connection.',
      },
      {
        label: 'Loading a third-party script at runtime',
        file: 'src/pages/Scratchpad.tsx',
        code: `let pyodidePromise: Promise<PyodideLike> | null = null
const loadPy = () => {
  if (pyodidePromise) return pyodidePromise
  pyodidePromise = new Promise<PyodideLike>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js'
    s.onload = () => {
      window.loadPyodide?.({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/' }).then(resolve).catch(reject)
    }
    s.onerror = () => reject(new Error('Could not load Pyodide. Check your connection.'))
    document.head.appendChild(s)
  })
  return pyodidePromise
}`,
        note: 'This is the general pattern for any script you cannot or should not bundle. Build a script element, append it, and wrap onload and onerror in a promise. The promise is cached in a module-level variable, so pressing Run five times starts one download and four waits on the same promise. Note that onerror is handled: a CDN can be blocked, and the user deserves a sentence rather than a dead button.',
      },
      {
        label: 'Two runtimes, one Run button',
        file: 'src/pages/Scratchpad.tsx',
        code: `      if (lang === 'javascript') {
        const logs: string[] = []
        const fake = { log: (...a: unknown[]) => logs.push(a.map(fmt).join(' ')), error: (...a: unknown[]) => logs.push('[error] ' + a.map(fmt).join(' ')) }
        const fn = new Function('console', code.javascript)
        await Promise.resolve(fn(fake))
        setOut(logs.join('\\n') || '(no output)')
      } else {
        setOut('Loading Python runtime…')
        const py = await loadPy()
        const buf: string[] = []
        py.setStdout({ batched: (s) => buf.push(s) })
        py.setStderr({ batched: (s) => buf.push(s) })
        await py.runPythonAsync(code.python)
        setOut(buf.join('\\n') || '(no output)')
      }
    } catch (e) {
      setOut(String(e))
    } finally {
      setMs(Math.round(performance.now() - t0))
      setRunning(false)
    }
  }`,
        note: "This is the body of run's try block. Both branches have the same shape: capture output into an array, then push it into state. The JavaScript branch passes a fake console as an argument to new Function, so console.log inside your snippet lands in the output panel instead of the browser devtools. The finally block at the end is what guarantees the Run button re-enables even when your code throws.",
      },
      {
        label: 'Debounced persistence',
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
        note: 'The classic debounce: every change cancels the pending timer and starts a new one, so the write happens 400 ms after you stop typing. The timer id lives in a ref because changing it must not cause a re-render. localStorage is wrapped in try and catch because it throws in some private browsing modes and when the quota is full.',
      },
    ],
    teaches: [
      'The controlled-component pattern scales from a text input up to an entire IDE.',
      'How to load an external script at runtime and cache the promise so it happens once.',
      'Code splitting: heavy features should download when they are opened, not on first paint.',
      'Debouncing with setTimeout and a ref, so expensive work follows the user instead of chasing them.',
      'try and finally around async work is how you make sure a loading flag always clears.',
    ],
    tryThis: [
      'Set minimap: { enabled: true } in the options object, reload, and decide which you prefer.',
      "Add wordWrap: 'on' and lineNumbers: 'relative' to options and watch how the gutter changes.",
      'Open DevTools on the Network tab, then open the Scratchpad and find the monaco chunk. Now press Run on the Python tab and watch Pyodide arrive from jsDelivr.',
      'Change the debounce in the save effect from 400 to 3000, type something, and reload after one second to see what you lose.',
    ],
    gotchas: [
      'Monaco loads asynchronously, so the editor instance does not exist on first render. Anything that needs it belongs in onMount, not in the render body.',
      'onChange gives you a string or undefined. Ignoring the undefined case silently clears your state.',
      'new Function runs whatever string you hand it. That is acceptable here because it is your own code in your own browser, but never do this with text from a server.',
      "Pyodide's first load is around ten megabytes. Without the Loading Python runtime message, the app looks frozen on a slow connection.",
    ],
    docs: [
      { label: '@monaco-editor/react on npm', url: 'https://www.npmjs.com/package/@monaco-editor/react' },
      { label: 'Monaco Editor API docs', url: 'https://microsoft.github.io/monaco-editor/docs.html' },
      { label: 'Pyodide documentation', url: 'https://pyodide.org/en/stable/' },
    ],
    order: 13,
  },

  {
    id: 'react-markdown',
    name: 'react-markdown',
    version: '^10.1.0 (with remark-gfm ^4.0.1)',
    category: 'content',
    role: 'Turns the Markdown written in the concept and pattern files into styled React elements.',
    what: 'Markdown is plain text with light punctuation for structure: hashes for headings, asterisks for bold, pipes for tables. react-markdown parses that text and returns React elements. remark-gfm is a plugin that adds the GitHub flavours on top of the base syntax: tables, strikethrough, task lists, and bare URLs that become links.',
    why: 'The teaching content in src/content is long-form prose. Writing it as JSX would bury the words in tags and make it miserable to edit. Markdown keeps the content readable as text. The more common alternative is to run a Markdown-to-HTML converter and inject the result with dangerouslySetInnerHTML. react-markdown does not do that: it builds React elements directly, so no raw HTML string is ever handed to the DOM and script tags in content cannot execute. The trade-off is a parser in the bundle, and slightly less control, since you style the output with CSS descendant rules rather than putting a className on each element.',
    howUsedHere: `**src/components/Markdown.tsx** is the entire integration, eleven lines long. It renders \`ReactMarkdown\` with \`remarkGfm\` enabled, inside a \`div\` carrying the class \`prose-sys\`.

Two pages use it. **src/pages/ConceptPage.tsx** renders \`c.explanation\` inside the *Core concept* section, and **src/pages/PatternDetail.tsx** renders \`p.explanation\`. Both strings come from the typed content files under \`src/content/concepts\` and \`src/content/patterns\`.

Because react-markdown produces ordinary \`h2\`, \`p\`, \`ul\` and \`table\` elements with no classes of their own, all the styling happens in one place: the *Markdown* block near the bottom of **src/styles/global.css**. Every rule is a descendant of \`.prose-sys\`, and every colour is a CSS custom property, so the prose follows your theme.

Two of those rules connect straight to Settings. \`--reading-size\` and \`--reading-width\` set the font size and the line length, which is why the reading controls change an article without React re-rendering anything.`,
    snippets: [
      {
        label: 'The whole component',
        file: 'src/components/Markdown.tsx',
        code: `import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cx } from './ui'

export default function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cx('prose-sys', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}`,
        note: 'The Markdown source is passed as children, which reads naturally in JSX. remarkPlugins takes an array, so more plugins can be added later without touching a single call site. Wrapping it all in one component of your own means the prose-sys class and the GFM plugin can never be forgotten, and the library could be swapped out by editing this one file.',
      },
      {
        label: 'Styling elements you never wrote',
        file: 'src/styles/global.css',
        code: `/* ---------- Markdown ---------- */
.prose-sys { color: var(--fg-dim); font-size: var(--reading-size, 15px); line-height: 1.75; max-width: var(--reading-width, 68ch); }
.prose-sys h2 { font-family: var(--font-display); font-weight: 500; font-size: 1.73em; color: var(--fg); margin: 2em 0 0.6em; line-height: 1.15; scroll-margin-top: 90px; }
.prose-sys h2::before {
  content: ""; display: block; width: 26px; height: 1px; margin-bottom: 14px;
  background: linear-gradient(90deg, var(--accent), transparent);
}
.prose-sys h3 { font-size: 1em; font-weight: 600; color: var(--fg); margin: 1.6em 0 0.5em; letter-spacing: 0.02em; }
.prose-sys p { margin: 0 0 1em; }
.prose-sys p, .prose-sys li { letter-spacing: 0.003em; }
.prose-sys ul, .prose-sys ol { padding-left: 1.3em; margin: 0 0 1em; }
.prose-sys ul { list-style: disc; }
.prose-sys ol { list-style: decimal; }
.prose-sys li { margin: 0.3em 0; }
.prose-sys li::marker { color: var(--accent); }
.prose-sys strong { color: var(--fg); font-weight: 600; }
.prose-sys code { font-family: var(--font-mono); font-size: 0.83em; background: rgb(var(--accent-rgb) / 0.1); color: var(--accent-bright); padding: 1px 6px; border-radius: 6px; }
:root[data-theme="paper"] .prose-sys code,
:root[data-theme="daylight"] .prose-sys code { color: rgb(var(--accent-rgb)); }
.prose-sys pre { background: var(--code-bg); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; overflow-x: auto; margin: 0 0 1.2em; }
.prose-sys pre code { background: transparent; padding: 0; color: var(--fg); font-size: 0.83em; line-height: 1.6; }`,
        note: 'This is why the app uses plain CSS here rather than Tailwind classes. You cannot put a class on an element the parser generated, so you style by descent from one parent class. Two details worth stealing: the h2::before rule draws that small accent line above every heading with no markup at all, and the pre code rule resets the inline-code styling so code inside a fenced block is not decorated twice.',
      },
      {
        label: 'A call site',
        file: 'src/pages/ConceptPage.tsx',
        code: `        {/* 04 Core concept */}
        <Section id="core" n={++n} title="Core concept" sub="Why it works, in full.">
          {c.coreIdea && (
            <Panel variant="gold" className="p-5 mb-6">
              <Eyebrow className="text-gold mb-1.5">The key insight</Eyebrow>
              <p className="text-[15px] leading-relaxed text-bone">{c.coreIdea}</p>
            </Panel>
          )}
          <div className="reading-sheet">
            <Markdown>{c.explanation}</Markdown>
          </div>
        </Section>`,
        note: 'The Markdown component drops into the page like any other element, and the long teaching text stays where it belongs, in the typed content file. The reading-sheet wrapper is a separate styling concern layered on top, so the same Markdown component can be used anywhere without dragging that look along with it.',
      },
    ],
    teaches: [
      'Separating content from presentation: prose lives as data, components decide how it looks.',
      'Wrapping a third-party library in one small component of your own keeps it swappable.',
      'Styling generated HTML with descendant selectors from a single parent class.',
      'Why building React elements is safer than injecting an HTML string with dangerouslySetInnerHTML.',
      'CSS custom properties with fallbacks, like var(--reading-size, 15px), let settings change type without JavaScript.',
    ],
    tryThis: [
      'Open a file under src/content/concepts, add a GFM table to an explanation, and watch remark-gfm render it. Then remove remarkGfm from Markdown.tsx and see the table come back as raw pipes.',
      'Add a .prose-sys h4 rule to global.css and use a level-four heading in some content.',
      'Change the max-width fallback in .prose-sys from 68ch to 45ch and read a concept page. Line length changes reading speed more than font size does.',
      'Pass the components prop to ReactMarkdown so every link renders with target set to _blank, and see how much control that prop gives you.',
    ],
    gotchas: [
      'Markdown is whitespace sensitive. Indenting a template literal in a content file to line up with the surrounding code can turn a paragraph into a code block.',
      'Raw HTML in the source is ignored by default, and it should stay that way. Enabling rehype-raw brings back the injection risk this library avoids.',
      'Tables, strikethrough and task lists come from remark-gfm, not from the base parser. Drop the plugin and they stop working silently.',
      'Nothing in .prose-sys applies to Markdown rendered outside that wrapper div, so always use the Markdown component rather than ReactMarkdown directly.',
    ],
    docs: [
      { label: 'react-markdown on GitHub', url: 'https://github.com/remarkjs/react-markdown' },
      { label: 'remark-gfm', url: 'https://github.com/remarkjs/remark-gfm' },
      { label: 'GitHub Flavored Markdown spec', url: 'https://github.github.com/gfm/' },
    ],
    order: 14,
  },

  {
    id: 'date-fns',
    name: 'date-fns',
    version: '^4.1.0',
    category: 'tooling',
    role: 'Does all the calendar arithmetic behind the schedule, the streak and the review system.',
    what: 'date-fns is a collection of small functions that each take a Date and return something new: add days, format it, find the start of a week, list every day in a range. Nothing is mutated. You import only the functions you use, so the bundle carries only those.',
    why: "The built-in Date can add days and format text, but doing it by hand is where off-by-one bugs live. Moment.js is the old answer and is both large and mutable; Luxon is good but heavier than this app needs. date-fns is plain functions over the built-in Date, which suits a codebase that already prefers small pure helpers. The bigger decision is not the library though: this app never stores a Date at all. Every date is a local 'YYYY-MM-DD' string, and date-fns is used only to convert to and from that key. The trade-off is that you must remember which side of the line you are on. Pass a Date where a key belongs and TypeScript catches it; build a key by hand without toKey and nothing does.",
    howUsedHere: `**src/lib/dates.ts** is the boundary. About twenty lines wide, it imports six functions from date-fns and exports helpers that speak only in string keys: \`toKey\`, \`fromKey\`, \`todayKey\`, \`addDaysKey\`, \`daysBetween\`, \`weekday\`, \`isStudyDay\`, \`nextStudyDay\`, and the two formatters \`prettyDate\` and \`prettyLong\`.

Ten files import from it, among them **src/store/useApp.ts**, **src/lib/scheduler.ts**, **src/components/QuestCard.tsx** and most pages. None of them touch \`Date\`. A quest has \`date: '2026-09-04'\`, the store keys \`dayLogs\` by the same string, and spaced repetition is just \`addDaysKey(today, interval)\`.

Two files use date-fns directly, because they genuinely need calendar objects. **src/pages/Calendar.tsx** builds the month grid with \`startOfMonth\`, \`startOfWeek\`, \`endOfWeek\` and \`eachDayOfInterval\`, then converts every cell back with \`toKey\` before looking anything up. **src/pages/Log.tsx** uses \`format\` and \`parseISO\` for display only.

The payoff: saved data is human-readable, sorts correctly as plain text, and never shifts by a day.`,
    snippets: [
      {
        label: 'The whole boundary',
        file: 'src/lib/dates.ts',
        code: `import { addDays, format, parseISO, startOfDay, differenceInCalendarDays, getDay } from 'date-fns'

/** YYYY-MM-DD in local time. */
export const toKey = (d: Date): string => format(d, 'yyyy-MM-dd')
export const fromKey = (key: string): Date => startOfDay(parseISO(key))
export const todayKey = (): string => toKey(new Date())
export const addDaysKey = (key: string, n: number): string => toKey(addDays(fromKey(key), n))
export const daysBetween = (a: string, b: string): number => differenceInCalendarDays(fromKey(b), fromKey(a))
export const weekday = (key: string): number => getDay(fromKey(key)) // 0 = Sunday
export const isStudyDay = (key: string, studyDays: number[]): boolean => studyDays.includes(weekday(key))`,
        note: "Every function takes strings and gives back strings. Dates exist only inside the function bodies. format(d, 'yyyy-MM-dd') reads the local calendar day, which is the crucial difference from d.toISOString().slice(0, 10): that converts to UTC first, so at nine in the evening in India it hands you tomorrow. differenceInCalendarDays counts date boundaries crossed rather than 24-hour blocks, so it stays right across daylight saving.",
      },
      {
        label: 'Arithmetic that stays in key space',
        file: 'src/lib/dates.ts',
        code: `/** Next study day on or after \`key\`. */
export const nextStudyDay = (key: string, studyDays: number[], includeSelf = true): string => {
  let k = includeSelf ? key : addDaysKey(key, 1)
  for (let i = 0; i < 14; i++) {
    if (isStudyDay(k, studyDays)) return k
    k = addDaysKey(k, 1)
  }
  return k
}`,
        note: 'A loop that walks forward one day at a time and never leaves string space. Because addDaysKey round-trips through a real Date, month ends and leap years are handled for you. The bound of 14 is a deliberate guard: if a user somehow selects zero study days, this returns instead of looping forever. Cheap defensive limits like that are worth writing into any search loop.',
      },
      {
        label: 'Where real Dates are still needed',
        file: 'src/pages/Calendar.tsx',
        code: `  const plan = useMemo(() => projectPlan(state, addDaysKey(today, 1)), [state.conceptProgress, state.attempts, state.profile.studyDays])
  const planByDate = useMemo(() => {
    const m: Record<string, typeof plan.entries> = {}
    for (const e of plan.entries) (m[e.date] ??= []).push(e)
    return m
  }, [plan])

  const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }) })
  const questsOf = (key: string) => state.quests.filter((q) => q.date === key && q.status !== 'rescheduled')`,
        note: 'A month grid is a rectangle, so it must start on the Monday before the first of the month and end on the Sunday after the last. startOfWeek with weekStartsOn: 1 and eachDayOfInterval do that in one line, returning real Date objects for laying out cells. Everything read from state, such as questsOf, is keyed by string, so each cell converts back with toKey. Notice planByDate: grouping entries into an object once makes each of the 42 cells a lookup rather than a scan.',
      },
    ],
    teaches: [
      'Choose one canonical representation for a value and convert only at the edges.',
      'A local calendar day and a UTC instant are different things, and confusing them is the classic off-by-one-day bug.',
      'Storing dates as YYYY-MM-DD strings makes saved state readable, comparable and sortable as plain text.',
      'Small pure functions in a lib file give you one place to fix a bug for the whole app.',
      'Build an index, an object keyed by id, instead of scanning a list inside a render loop.',
    ],
    tryThis: [
      'In the browser console late in the evening, run new Date().toISOString().slice(0, 10) and compare it with the date the app shows as today. That gap is the bug the key format avoids.',
      'Change weekStartsOn from 1 to 0 in Calendar.tsx and watch the grid shift, then check that the WEEKDAY_SHORT headers no longer line up.',
      'Add a monthsBetween helper to dates.ts using differenceInCalendarMonths, following the same key-in, number-out shape.',
      "Set your machine's timezone to somewhere far away, reload, and confirm the streak and today's quests still match your local calendar.",
    ],
    gotchas: [
      'toISOString().slice(0, 10) is the trap. It shifts to UTC and can report yesterday or tomorrow depending on your offset. Always go through toKey.',
      "parseISO('2026-09-04') gives local midnight, but parseISO('2026-09-04T00:00:00Z') gives UTC midnight. Keeping keys bare is what makes fromKey predictable.",
      "date-fns format tokens are not Moment's tokens. Uppercase D is day of year and uppercase Y is week-based year; the library throws a helpful error rather than lying to you.",
      'Never compare two Dates with a triple equals. Two Date objects for the same moment are different objects. Comparing key strings sidesteps this entirely.',
    ],
    docs: [
      { label: 'date-fns: getting started', url: 'https://date-fns.org/docs/Getting-Started' },
      { label: 'date-fns: format tokens', url: 'https://date-fns.org/docs/format' },
      { label: 'MDN: Date', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date' },
    ],
    order: 15,
  },

  {
    id: 'gh-actions',
    name: 'GitHub Actions & Pages',
    version: 'CI/CD',
    category: 'tooling',
    role: 'Checks the content, builds the site, and publishes it, every time you push to main.',
    what: "GitHub Actions runs a script on GitHub's machines when something happens in your repository. The script is a YAML file describing jobs, and steps inside those jobs. GitHub Pages is free static hosting attached to the same repository. Together they mean a push to main becomes a live site, with no server to rent and no upload to remember.",
    why: 'This app is entirely static: after the build there is only HTML, JavaScript, CSS and fonts, with all your data in localStorage. That makes Pages a perfect fit and anything with a server unnecessary. Actions is chosen over building on your own machine and dragging files somewhere, because a build on your laptop passes with whatever happens to be installed there. A fresh Ubuntu runner with npm ci proves the lockfile is complete and the code compiles from nothing. The trade-off is that a broken build is now public, and the feedback loop is a minute or two rather than instant. That cost is repaid the first time the content check catches a broken problem id before anyone sees it.',
    howUsedHere: `**.github/workflows/deploy.yml** holds the pipeline. It runs on every push to \`main\`, and can also be started by hand through \`workflow_dispatch\`.

The \`build\` job checks out the repository, installs Node 22 with the npm cache enabled, then runs three commands in order: \`npm ci\` for an exact install from the lockfile, \`npm run check\` which executes \`scripts/check-content.ts\` to validate the content files, and \`npm run build\`, which is \`tsc -b && vite build\`. Any failing step stops the run, so broken types or dangling ids never reach the site. The finished \`dist\` folder is uploaded as a Pages artifact, and a second job deploys it.

Two settings make it work from a repository sub-path. In **vite.config.ts**, \`base: './'\` tells Vite to write relative asset URLs, so the site works at \`/TimeTable/\` and not only at a domain root. The \`manualChunks\` block splits \`three\`, \`@monaco-editor/react\` and \`recharts\` into separate files. **index.html** is the entry Vite rewrites during the build, replacing the \`/src/main.tsx\` script tag with the hashed bundles.`,
    snippets: [
      {
        label: 'The build job',
        file: '.github/workflows/deploy.yml',
        code: `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist`,
        note: 'Read it as a recipe carried out on a clean machine. uses pulls in a published action; run executes a shell command. It is npm ci, not npm install: ci installs exactly what package-lock.json says and fails if the lockfile is out of step. The order matters, because the cheap content check runs before the slower build. cache: npm keeps the module download between runs, which is most of the wall-clock time.',
      },
      {
        label: 'Permissions and concurrency',
        file: '.github/workflows/deploy.yml',
        code: `permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true`,
        note: 'Permissions are granted narrowly rather than by default: read the code, write Pages, and mint an identity token so the deploy can prove who it is. No secret is stored anywhere. The concurrency block means two quick pushes do not race each other to publish; the older run is cancelled and the newer commit wins.',
      },
      {
        label: 'The two build settings that make it work',
        file: 'vite.config.ts',
        code: `export default defineConfig({
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
        note: "base: './' is the line that makes a Pages sub-path work. Without it Vite writes asset URLs beginning with a slash, the browser asks the domain root for them, and you get a blank page with 404s in the console. manualChunks names the three heavy libraries so each becomes its own file, downloaded on the page that needs it instead of riding along in the main bundle.",
      },
      {
        label: 'What Vite rewrites',
        file: 'index.html',
        code: `  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        note: 'The whole app is one empty div and one script tag. In development the browser really does load /src/main.tsx. During the build Vite follows that script, bundles everything it imports, and rewrites this tag to point at hashed files such as ./assets/index-a1b2c3d4.js. The hash in the name is why browsers can cache assets forever and still pick up your next deploy immediately.',
      },
    ],
    teaches: [
      'Continuous integration: a clean machine builds your code, so it works everywhere and not only on your laptop.',
      'npm ci plus a committed lockfile is what makes a build reproducible.',
      'Static sites need no server, and a static host is cheaper, faster and harder to break.',
      'Relative base paths matter whenever a site is not served from a domain root.',
      'Content-hashed filenames give you aggressive caching and instant cache-busting at the same time.',
    ],
    tryThis: [
      'Break something on purpose: add a type error to a page, push it on a branch, open a pull request, and watch the workflow fail in the Actions tab.',
      'Run npm run build and then npx vite preview locally. That is the closest thing to the deployed site you can see on your machine.',
      'Look inside dist/assets after a build and find the three, monaco and charts chunks. Compare their sizes with the main bundle.',
      "Change base to '/' in vite.config.ts, build, and open dist/index.html straight from the filesystem. Note the 404s in the console, then change it back.",
    ],
    gotchas: [
      'A blank deployed page with 404s for /assets/... almost always means base is wrong.',
      'GitHub Pages must be set to the GitHub Actions source in the repository settings, or the deploy job succeeds while nothing is published.',
      'Client-side routing needs care on Pages: a hard refresh on a deep path asks the host for a file that does not exist, and a static host cannot rewrite it back to index.html. This app sidesteps that with HashRouter in src/main.tsx, so the route lives after the # where the server never sees it.',
      'The workflow only fires on pushes to main. Work on a branch builds nothing until it is merged, so open a pull request if you want the checks to run early.',
    ],
    docs: [
      { label: 'GitHub Actions: workflow syntax', url: 'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions' },
      { label: 'GitHub Pages: publishing with Actions', url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site' },
      { label: 'Vite: building for production', url: 'https://vite.dev/guide/build.html' },
    ],
    order: 16,
  },
]
