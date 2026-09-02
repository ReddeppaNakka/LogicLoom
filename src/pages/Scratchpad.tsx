import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Loader2 } from 'lucide-react'
import { useApp } from '@/store/useApp'
import { SectionTitle, Panel, Eyebrow, cx } from '@/components/ui'

type RunLang = 'python' | 'javascript'

const STARTER: Record<RunLang, string> = {
  python: `# Scratchpad. Runs Python in your browser (Pyodide loads on first run, ~10 MB).
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []

print(two_sum([2, 7, 11, 15], 9))
`,
  javascript: `// Scratchpad. Runs JavaScript in your browser.
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
    seen.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideLike>
  }
}
interface PyodideLike {
  runPythonAsync: (code: string) => Promise<unknown>
  setStdout: (o: { batched: (s: string) => void }) => void
  setStderr: (o: { batched: (s: string) => void }) => void
}

let pyodidePromise: Promise<PyodideLike> | null = null
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
}

export default function Scratchpad() {
  const preferred = useApp((s) => s.profile.preferredLang)
  const [lang, setLang] = useState<RunLang>(preferred === 'javascript' ? 'javascript' : 'python')
  const [code, setCode] = useState<Record<RunLang, string>>(() => {
    try {
      const saved = localStorage.getItem('the-system-scratch')
      if (saved) return { ...STARTER, ...JSON.parse(saved) }
    } catch {
      /* ignore */
    }
    return STARTER
  })
  const [out, setOut] = useState('')
  const [running, setRunning] = useState(false)
  const [ms, setMs] = useState<number | null>(null)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem('the-system-scratch', JSON.stringify(code))
      } catch {
        /* ignore */
      }
    }, 400)
  }, [code])

  const run = async () => {
    setRunning(true)
    setOut('')
    setMs(null)
    const t0 = performance.now()
    try {
      if (lang === 'javascript') {
        const logs: string[] = []
        const fake = { log: (...a: unknown[]) => logs.push(a.map(fmt).join(' ')), error: (...a: unknown[]) => logs.push('[error] ' + a.map(fmt).join(' ')) }
        const fn = new Function('console', code.javascript)
        await Promise.resolve(fn(fake))
        setOut(logs.join('\n') || '(no output)')
      } else {
        setOut('Loading Python runtime…')
        const py = await loadPy()
        const buf: string[] = []
        py.setStdout({ batched: (s) => buf.push(s) })
        py.setStderr({ batched: (s) => buf.push(s) })
        await py.runPythonAsync(code.python)
        setOut(buf.join('\n') || '(no output)')
      }
    } catch (e) {
      setOut(String(e))
    } finally {
      setMs(Math.round(performance.now() - t0))
      setRunning(false)
    }
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Scratchpad"
        kanji="書"
        title="Try the idea before you trust it."
        right={
          <div className="flex items-center gap-2">
            <div className="flex gap-1 p-1 rounded-xl border border-[var(--line)] bg-[rgb(var(--bg-rgb)/0.5)]">
              {(['python', 'javascript'] as RunLang[]).map((l) => (
                <button key={l} className={cx('btn btn-sm border-0 capitalize', lang === l && 'btn-system')} onClick={() => setLang(l)}>
                  {l}
                </button>
              ))}
            </div>
            <button className="btn btn-system" onClick={run} disabled={running}>
              {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Run
            </button>
          </div>
        }
      />
      <p className="text-bone-dim max-w-2xl -mt-2 mb-5">Paste a template, plug in a tiny input, and print what happens at each step. Watching the pointers move is the fastest way to understand a pattern. Java and C++ are read-only here, so use LeetCode's editor for those.</p>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <Panel className="overflow-hidden">
          <Editor
            height="520px"
            language={lang}
            theme="vs-dark"
            value={code[lang]}
            onChange={(v) => setCode((c) => ({ ...c, [lang]: v ?? '' }))}
            options={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 14 }, tabSize: 4, smoothScrolling: true, renderLineHighlight: 'none' }}
            loading={<div className="p-6 text-muted text-sm">Loading editor…</div>}
          />
        </Panel>
        <Panel className="p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Eyebrow>Output</Eyebrow>
            {ms !== null && <span className="mono text-[11px] text-muted">{ms} ms</span>}
          </div>
          <pre className="mono text-[12.5px] text-bone-dim whitespace-pre-wrap flex-1 overflow-auto min-h-[200px]">{out || 'Press Run.'}</pre>
        </Panel>
      </div>
    </div>
  )
}

const fmt = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v))
