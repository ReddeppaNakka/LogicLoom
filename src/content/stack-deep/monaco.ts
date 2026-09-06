import type { TechDeep } from '../stack-types'

export const monacoDeep: TechDeep = {
  analogy:
    'A textarea is a blank sheet of paper: it holds letters and nothing more. Monaco is a full desk: the paper, a ruler that keeps lines numbered, a highlighter that colours keywords as you write, a folding board for long sections and a set of keyboard habits everyone already knows from VS Code. Pyodide, which runs beside it here, is a Python interpreter that fits in the same drawer and runs entirely at your desk, without sending anything away.',

  origins: `Monaco Editor is the code editor at the heart of **Visual Studio Code**, extracted as a standalone library by Microsoft in **2016**. Before VS Code, the same editor powered the browser-based Visual Studio Online ("Monaco" was the project's codename), and its lineage explains its strengths: it was built for large files, precise keyboard behaviour and language services from day one.

The problem it solves is that a browser has no code editor. \`<textarea>\` cannot highlight syntax, number lines, indent automatically, fold blocks or show an error squiggle. Earlier libraries (Ace, CodeMirror 5) filled the gap, but Monaco brought the exact behaviour of a desktop editor that millions already used. Its distinguishing feature is the language service architecture: TypeScript, JavaScript, CSS, HTML and JSON get real semantic analysis (completion, hover types, diagnostics) running in a web worker.

The \`@monaco-editor/react\` wrapper, used here, loads Monaco from a CDN on demand and exposes it as a component with \`value\` and \`onChange\` props. The editor weighs several megabytes, which is why this app loads it only on the Scratchpad and Trainer routes, and why the wrapper's CDN loading, rather than bundling, is the default.

**Pyodide**, the runtime that executes the Python you type, is a separate project: CPython compiled to **WebAssembly** with Emscripten, started at Mozilla in 2018 by Michael Droettboom for the Iodide notebook. It brings the real Python interpreter, plus NumPy and much of the scientific stack, into the browser with no server.`,

  concepts: [
    {
      title: 'The editor as a controlled component',
      body: `The wrapper turns Monaco into something that feels like an input. Give it \`value\`, \`language\` and \`onChange\`, and treat the text as React state. Under the hood it creates a Monaco *model* (the text buffer) and an *editor* (the view onto it) once, then keeps the model in sync with \`value\`. The \`onMount\` callback hands you the raw editor and the \`monaco\` namespace for anything the props do not cover.`,
      lang: 'tsx',
      code: `import Editor from '@monaco-editor/react'

function Scratchpad() {
  const [code, setCode] = useState('def solve(nums):\\n    return sorted(nums)\\n')
  return (
    <Editor
      height="60vh"
      language="python"
      theme="vs-dark"
      value={code}
      onChange={(v) => setCode(v ?? '')}
      options={{ fontSize: 14, minimap: { enabled: false }, tabSize: 4, wordWrap: 'on' }}
    />
  )
}`,
    },
    {
      title: 'Models, editors and languages',
      body: `Monaco separates the text from the view. A **model** is a text buffer with a language id, a URI and an undo stack. An **editor** displays a model and can switch between models, which is how VS Code tabs work: one editor, many models. The language id chooses a tokenizer for highlighting and, for the built-in web languages, a worker that provides completions and errors. For Python, highlighting is provided by a Monarch grammar; semantic features would need a language server.`,
      lang: 'ts',
      code: `// Everything the React wrapper does, by hand
const model = monaco.editor.createModel('print("hi")', 'python', monaco.Uri.parse('file:///main.py'))
const editor = monaco.editor.create(el, { model, theme: 'vs-dark', automaticLayout: true })

editor.setModel(otherModel)          // switch tabs
model.getValue()                     // current text
model.onDidChangeContent(() => save(model.getValue()))
editor.dispose(); model.dispose()    // on unmount`,
    },
    {
      title: 'Themes and language definitions',
      body: `A theme maps token types (keyword, string, comment, number) to colours and can restyle the editor chrome. Define one with \`defineTheme\` from a base and a list of rules, and colours can be pulled from your CSS variables at runtime so the editor follows the app's theme. Registering a new language is a Monarch grammar: a set of regular-expression rules per state that emit token names.`,
      lang: 'ts',
      code: `const css = getComputedStyle(document.documentElement)
monaco.editor.defineTheme('system', {
  base: 'vs-dark', inherit: true,
  rules: [
    { token: 'keyword', foreground: css.getPropertyValue('--accent-hex').trim() },
    { token: 'string', foreground: '9ece6a' },
    { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
  ],
  colors: { 'editor.background': '#00000000', 'editorLineNumber.foreground': '#4b5563' },
})
monaco.editor.setTheme('system')`,
    },
    {
      title: 'Commands, keybindings and actions',
      body: `Monaco has a command system identical to VS Code's. \`addCommand\` binds a key chord to a function; \`addAction\` also puts it in the command palette (F1) with a label. This is how a Run button gets a Ctrl+Enter shortcut, and how you keep the editor from swallowing shortcuts your app needs.`,
      lang: 'ts',
      code: `editor.addAction({
  id: 'run-code',
  label: 'Run',
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
  run: () => runPython(editor.getValue()),
})

// Show a diagnostic squiggle from your own checker
monaco.editor.setModelMarkers(model, 'py', [{
  startLineNumber: 3, startColumn: 5, endLineNumber: 3, endColumn: 9,
  message: 'undefined name "nusm"', severity: monaco.MarkerSeverity.Error,
}])`,
    },
    {
      title: 'Loading strategy: heavy things load late',
      body: `Monaco is roughly 3 MB of JavaScript plus workers. Loading it on every page would make the whole app slow to start. Two techniques keep it out of the way: the page that uses it is a lazy route (its chunk downloads only when visited), and the wrapper fetches Monaco itself from a CDN at first use through a loader. The same applies to Pyodide, which is around 10 MB and loads on the first Run, with a visible "loading interpreter" state.`,
      lang: 'tsx',
      code: `// App.tsx: the route chunk is separate
const Scratchpad = lazy(() => import('@/pages/Scratchpad'))

// Pyodide, first run only
let py: Promise<any> | null = null
function getPython() {
  py ??= import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.mjs')
    .then((m) => m.loadPyodide())
  return py
}`,
    },
    {
      title: 'Running Python in the browser with Pyodide',
      body: `Pyodide is CPython compiled to WebAssembly. \`loadPyodide()\` fetches the runtime and the standard library, then \`runPython\` or \`runPythonAsync\` executes source in a persistent interpreter. Standard output is captured by setting \`stdout\` handlers. Values cross between Python and JavaScript through proxies. Nothing leaves the machine; the code you type runs in the tab.`,
      lang: 'ts',
      code: `const pyodide = await getPython()
const out: string[] = []
pyodide.setStdout({ batched: (line: string) => out.push(line) })
pyodide.setStderr({ batched: (line: string) => out.push(line) })

try {
  await pyodide.runPythonAsync(code)
} catch (e) {
  out.push(String(e))          // a Python traceback, as text
}
setOutput(out.join('\\n'))

// JS -> Python: pyodide.globals.set('nums', [3, 1, 2])
// Python -> JS: pyodide.globals.get('result').toJs()`,
    },
    {
      title: 'Keeping the UI responsive',
      body: `Both Monaco and Pyodide can do heavy work. Monaco already runs its language services in web workers. Pyodide runs on the main thread unless you put it in a worker yourself; an infinite loop in user code will freeze the page. The robust pattern is a worker that owns the interpreter, receives code by \`postMessage\`, and is terminated and recreated if it exceeds a time limit.`,
      lang: 'ts',
      code: `// runner.worker.ts
importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js')
let ready = (self as any).loadPyodide()
self.onmessage = async (e) => {
  const py = await ready
  const out: string[] = []
  py.setStdout({ batched: (s: string) => out.push(s) })
  try { await py.runPythonAsync(e.data.code) } catch (err) { out.push(String(err)) }
  self.postMessage(out.join('\\n'))
}

// main thread: a 5 s budget
const w = new Worker(new URL('./runner.worker.ts', import.meta.url))
const timer = setTimeout(() => { w.terminate(); setOutput('Stopped: took longer than 5 s') }, 5000)
w.onmessage = (e) => { clearTimeout(timer); setOutput(e.data) }
w.postMessage({ code })`,
    },
  ],

  visual: {
    title: 'From keystroke to coloured token, and from Run to output',
    intro: 'Two pipelines share the scratchpad. Watch a character enter the editor and get highlighted, then watch the Run button hand the text to a Python interpreter inside the tab.',
    frames: [
      {
        caption: 'A keystroke. Monaco captures it in a hidden textarea, applies the edit to the model, and records it in the undo stack.',
        frame: `  key "d"  (after "def solve(nums):\\n    return sorte")
     │
     v
  hidden <textarea>  ->  edit operation
     { range: (2,17)-(2,17), text: "d" }
     │
     v
  model  line 2:  "    return sorted"
  undo stack:  push`,
      },
      {
        caption: 'Tokenisation. The Python Monarch grammar re-scans the changed line and emits typed tokens.',
        frame: `  line 2:  "    return sorted"
            ────┬───── ──┬───
              keyword  identifier

  tokens: [ {start:4, type:'keyword.python'},
            {start:11, type:'identifier.python'} ]

  only the edited line is re-tokenised;
  state carries over from line 1`,
      },
      {
        caption: 'Rendering. The view layer draws only the visible lines as spans coloured by the theme. Line numbers, cursor and selection are separate layers.',
        frame: `  ┌────┬──────────────────────────────────────┐
  │ 1  │ def solve(nums):                     │
  │ 2  │     return sorted▏                   │
  │ 3  │                                      │
  └────┴──────────────────────────────────────┘
   gutter   text layer (spans per token)
            cursor layer  ▏
            theme:  keyword -> accent colour`,
      },
      {
        caption: 'Run. The editor\'s text goes to Pyodide, a real CPython compiled to WebAssembly, running inside the page.',
        frame: `  Ctrl+Enter
     │
     v  editor.getValue()
  "def solve(nums):\\n    return sorted(nums)\\n"
  + "print(solve([3,1,2]))"
     │
     v  pyodide.runPythonAsync(code)
  ┌──────────────────────────────────┐
  │ CPython 3.12 (WebAssembly)       │
  │  compile -> bytecode -> execute  │
  │  print -> stdout hook            │
  └──────────────────────────────────┘`,
      },
      {
        caption: 'Output. Captured stdout lines are joined and shown. An exception arrives as a traceback string. Nothing was sent to any server.',
        frame: `  stdout hook receives:  "[1, 2, 3]"

  output panel
  ┌──────────────────────────────────┐
  │ [1, 2, 3]                        │
  │                                  │
  │ ✓ ran in 4 ms                    │
  └──────────────────────────────────┘

  network requests during run: 0`,
      },
    ],
  },

  internals: `## Monaco's architecture

Monaco is VS Code's editor core with the Node-specific parts removed. Its layers are the **text model** (a piece-table buffer that makes inserts in the middle of a huge file cheap), the **tokeniser** (either a Monarch grammar interpreted in JavaScript or, in VS Code proper, a TextMate grammar), the **view model** (which lines are visible, folding, word wrap) and the **view** (DOM rendering of just the visible lines, with virtualisation so a 100,000-line file stays fast).

Editing goes through a command pipeline. Every keystroke becomes an edit operation with a range and replacement text; the model applies it, updates line starts incrementally, bumps a version number, and fires change events. The undo stack stores inverse operations. Multi-cursor editing is a list of selections that each receive the same command.

## Language services in workers

For TypeScript, JavaScript, CSS, HTML and JSON, Monaco ships worker scripts that run a real language service (the TypeScript compiler itself, for TS) off the main thread. The editor sends the model's text and version to the worker and asks it for completions, hovers, diagnostics and formatting. Responses are matched to the version so stale results are dropped. Other languages, including Python, get syntax highlighting from a Monarch grammar and can be given semantic features by connecting a language server over the Language Server Protocol, which is what browser IDEs do.

## Loading

Monaco is built as AMD modules with a loader, and the editor plus workers are several megabytes. The React wrapper uses a small loader script that fetches Monaco from a CDN and resolves a promise with the \`monaco\` namespace; the component renders a placeholder until then. Bundling Monaco yourself is possible with Vite plugins, at the cost of build complexity and bundle size, so CDN loading is the common choice for apps where the editor is not the main feature.

## Pyodide's architecture

Pyodide is the CPython interpreter compiled to WebAssembly with Emscripten, plus a virtual file system holding the standard library, plus a foreign-function layer between Python objects and JavaScript objects. \`loadPyodide\` fetches the \`.wasm\` binary (about 10 MB, cached by the browser afterwards) and the packaged stdlib, instantiates the module, and runs Python's startup. From then on the interpreter is persistent: variables defined in one run exist in the next, which is convenient for a scratchpad and surprising if you expect a clean slate. Call \`pyodide.runPython('globals().clear()')\` or recreate the interpreter for isolation.

Python and JavaScript exchange values through proxies. A Python list handed to JavaScript is a \`PyProxy\` that you convert with \`.toJs()\`; a JavaScript object in Python is a \`JsProxy\`. Pure-Python packages install from PyPI wheels through \`micropip\`; compiled packages such as NumPy come pre-built for WebAssembly.

## Performance characteristics

WebAssembly runs CPython at roughly one third to one half of native speed, which is plenty for algorithm practice. The costs to watch are the first load and the main-thread blocking. Running the interpreter in a Web Worker isolates infinite loops and keeps the editor responsive, at the price of message-passing for input and output. Pyodide also supports a synchronous \`input()\` only with extra setup, so exercises are best written with function arguments rather than stdin.

## Why this pairing

Together Monaco and Pyodide give a real editor and a real interpreter with zero backend, zero accounts and zero data leaving the machine. That is the right shape for a personal trainer: a solver you can type into at any hour, with the Python you will actually use in interviews.`,

  buildIt: {
    title: 'A runnable Python scratchpad',
    intro: 'Monaco for editing, Pyodide for running, a worker for safety, and a time limit. This is the skeleton of the Scratchpad page.',
    steps: [
      {
        title: 'The editor',
        body: 'Controlled value, Python language, and an onMount that registers a Run action.',
        lang: 'tsx',
        code: `import Editor, { type OnMount } from '@monaco-editor/react'

const [code, setCode] = useState(STARTER)
const runRef = useRef<() => void>(() => {})

const onMount: OnMount = (editor, monaco) => {
  editor.addAction({
    id: 'run', label: 'Run',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
    run: () => runRef.current(),
  })
}

<Editor height="50vh" language="python" theme="vs-dark" value={code}
        onChange={(v) => setCode(v ?? '')} onMount={onMount} />`,
      },
      {
        title: 'The worker that owns Python',
        body: 'Loads Pyodide once, then answers each message with captured output.',
        lang: 'ts',
        code: `// py.worker.ts
importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js')
const ready = (self as any).loadPyodide()

self.onmessage = async ({ data }) => {
  const py = await ready
  const out: string[] = []
  py.setStdout({ batched: (s: string) => out.push(s) })
  py.setStderr({ batched: (s: string) => out.push(s) })
  const t0 = performance.now()
  try { await py.runPythonAsync(data.code) } catch (e) { out.push(String(e)) }
  self.postMessage({ out: out.join('\\n'), ms: Math.round(performance.now() - t0) })
}`,
      },
      {
        title: 'A runner hook with a time budget',
        body: 'Create the worker lazily, kill and recreate it on timeout so a runaway loop cannot hang the page.',
        lang: 'ts',
        code: `function useRunner(limitMs = 5000) {
  const w = useRef<Worker | null>(null)
  const make = () => (w.current = new Worker(new URL('./py.worker.ts', import.meta.url)))
  return (code: string) =>
    new Promise<{ out: string; ms: number }>((resolve) => {
      const worker = w.current ?? make()
      const timer = setTimeout(() => {
        worker.terminate(); w.current = null
        resolve({ out: 'Stopped: exceeded ' + limitMs / 1000 + ' s. Check for an infinite loop.', ms: limitMs })
      }, limitMs)
      worker.onmessage = (e) => { clearTimeout(timer); resolve(e.data) }
      worker.postMessage({ code })
    })
}`,
      },
      {
        title: 'Wire it up',
        body: 'The Run button and the keyboard action call the same function. Show loading state on the first run while Pyodide downloads.',
        lang: 'tsx',
        code: `const run = useRunner()
const [output, setOutput] = useState('')
const [busy, setBusy] = useState(false)

runRef.current = async () => {
  setBusy(true)
  const r = await run(code)
  setOutput(r.out + '\\n\\n' + (r.ms >= 5000 ? '' : 'ran in ' + r.ms + ' ms'))
  setBusy(false)
}

<button className="btn btn-system" onClick={runRef.current} disabled={busy}>
  {busy ? 'Running…' : 'Run  Ctrl+Enter'}
</button>
<pre className="code-block p-4 whitespace-pre-wrap">{output}</pre>`,
      },
    ],
  },

  inTheWild: [
    { who: 'Visual Studio Code', what: 'Monaco is its editor. Every feature you rely on there, from multi-cursor to bracket colouring, is the same code.' },
    { who: 'github.dev and GitHub Codespaces', what: 'Press the period key on any GitHub repository and VS Code for the web opens, Monaco included.' },
    { who: 'LeetCode', what: 'The problem editor on the most-used interview practice site is Monaco.' },
    { who: 'StackBlitz and the TypeScript Playground', what: 'In-browser IDEs and language playgrounds lean on Monaco\'s built-in TypeScript worker for live diagnostics.' },
    { who: 'JupyterLite and PyScript', what: 'Both run Python in the browser on Pyodide; JupyterLite is a full notebook with no server.' },
    { who: 'This app', what: 'The Scratchpad and Trainer pages: Monaco for editing, Pyodide for running your Python locally.' },
  ],

  alternatives: [
    { name: 'CodeMirror 6', pick: 'A smaller, modular editor (a few hundred kilobytes) with excellent mobile support. The better default when Monaco\'s size is a problem.' },
    { name: 'A styled textarea with Prism highlighting', pick: 'Read-mostly snippets with occasional edits. Tiny, but no editor features.' },
    { name: 'Judge0 or a server runner', pick: 'When you need many languages, real compilers or resource isolation. Requires a backend and sends code off the machine.' },
    { name: 'WebContainers', pick: 'Running Node.js and npm in the browser for JavaScript projects, as StackBlitz does.' },
  ],

  glossary: [
    { term: 'Model', meaning: 'Monaco\'s text buffer with a language, a URI and an undo stack.' },
    { term: 'Editor', meaning: 'The view that displays a model and handles input.' },
    { term: 'Monarch', meaning: 'Monaco\'s declarative tokenizer format for syntax highlighting.' },
    { term: 'Language service', meaning: 'Semantic features such as completion and diagnostics, run in a worker for built-in languages.' },
    { term: 'Marker', meaning: 'A diagnostic (error, warning) shown as a squiggle and in the problems list.' },
    { term: 'Action', meaning: 'A named command with an optional keybinding and palette entry.' },
    { term: 'WebAssembly', meaning: 'A binary instruction format browsers execute near native speed; how CPython runs in a tab.' },
    { term: 'Pyodide', meaning: 'CPython compiled to WebAssembly with a JavaScript bridge.' },
    { term: 'PyProxy', meaning: 'A JavaScript handle to a Python object; convert with toJs().' },
    { term: 'Web Worker', meaning: 'A background thread for JavaScript; used to keep heavy work off the UI thread.' },
  ],

  quiz: [
    {
      question: 'Why does this app load Monaco from a CDN only on the Scratchpad route rather than bundling it?',
      options: ['Licensing', 'It is several megabytes; loading it lazily keeps every other page fast to start', 'Vite cannot bundle it', 'CDNs are faster than local files'],
      answerIndex: 1,
      explanation: 'The editor is heavy and used on two routes. A lazy route chunk plus on-demand loading keeps it out of the initial download.',
    },
    {
      question: 'Where does the Python code you type in the Scratchpad execute?',
      options: ['On a server', 'In the browser tab, in CPython compiled to WebAssembly', 'In Node.js', 'It is transpiled to JavaScript'],
      answerIndex: 1,
      explanation: 'Pyodide is the real CPython interpreter running in WebAssembly. No code leaves the machine.',
    },
    {
      question: 'User code contains while True: pass. What protects the page?',
      options: ['Pyodide detects infinite loops', 'Running the interpreter in a Web Worker and terminating it on a time limit', 'The browser kills slow scripts', 'Monaco refuses to run it'],
      answerIndex: 1,
      explanation: 'A worker is a separate thread that can be terminated. On the main thread, a runaway loop would freeze the whole tab.',
    },
    {
      question: 'What is the difference between a Monaco model and an editor?',
      options: ['None', 'The model is the text buffer; the editor is a view that can display any model', 'The editor stores text; the model renders it', 'Models are for read-only files'],
      answerIndex: 1,
      explanation: 'One editor can switch between many models, which is how tabs work in VS Code.',
    },
    {
      question: 'Variables from a previous Run are still defined on the next Run. Why?',
      options: ['A bug', 'The Pyodide interpreter is persistent across runs unless you clear globals or recreate it', 'The browser caches results', 'Monaco resends the old code'],
      answerIndex: 1,
      explanation: 'Pyodide keeps one live interpreter. Clear globals or create a fresh instance for an isolated run.',
    },
  ],
}
