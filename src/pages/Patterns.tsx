import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Compass, RotateCcw, ArrowRight } from 'lucide-react'
import { patterns, getGate, getPattern } from '@/lib/content'
import { decisionTree, decisionRootId } from '@/content/decision-tree'
import { SectionTitle, Panel, Eyebrow, Kanji, cx } from '@/components/ui'

export default function Patterns() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<'library' | 'wizard'>('library')
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return patterns
    return patterns.filter((p) => [p.name, p.tagline, ...p.triggers].join(' ').toLowerCase().includes(s))
  }, [q])

  return (
    <div>
      <SectionTitle
        eyebrow="Pattern library"
        kanji="型"
        title="Which weapon for which monster."
        right={
          <div className="flex gap-1 p-1 rounded-xl border border-[var(--line)] bg-[rgba(5,7,10,0.5)]">
            <button className={cx('btn btn-sm border-0', tab === 'library' && 'btn-system')} onClick={() => setTab('library')}>
              Library
            </button>
            <button className={cx('btn btn-sm border-0', tab === 'wizard' && 'btn-system')} onClick={() => setTab('wizard')}>
              <Compass size={13} /> Which pattern?
            </button>
          </div>
        }
      />
      <p className="text-bone-dim max-w-2xl -mt-2 mb-6">Almost every interview problem is one of about thirty shapes. Learn the clue words, and the solution shape follows. Use the wizard when a problem looks new.</p>

      {tab === 'wizard' ? (
        <Wizard />
      ) : (
        <>
          <div className="relative max-w-md mb-6">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input pl-9" placeholder="Search clues, e.g. 'sorted', 'subarray', 'shortest path'…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: Math.min(i, 12) * 0.03, ease: [0.16, 1, 0.3, 1] }}>
                <Link to={`/patterns/${p.id}`} className="block group h-full">
                  <Panel className="p-5 h-full transition-all group-hover:border-[rgba(77,163,255,0.45)] group-hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <Eyebrow>{p.relatedGateIds.map((g) => getGate(g)?.name.split(' ')[0]).filter(Boolean).slice(0, 2).join(' · ')}</Eyebrow>
                      <span className="mono text-[10.5px] text-muted">{p.time}</span>
                    </div>
                    <div className="display text-[24px] mt-2 leading-tight group-hover:text-system transition-colors">{p.name}</div>
                    <div className="text-[13px] text-bone-dim mt-1">{p.tagline}</div>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.triggers.slice(0, 3).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Panel>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Wizard() {
  const [path, setPath] = useState<string[]>([decisionRootId])
  const [result, setResult] = useState<string | null>(null)
  const nodeId = path[path.length - 1]
  const node = decisionTree.find((n) => n.id === nodeId)
  const pattern = result ? getPattern(result) : null

  const reset = () => {
    setPath([decisionRootId])
    setResult(null)
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-5">
      <Panel variant="system" corner className="p-6 min-h-[360px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eyebrow system>Pattern finder</Eyebrow>
            <Kanji>診断</Kanji>
          </div>
          <button className="btn btn-xs btn-ghost" onClick={reset}>
            <RotateCcw size={12} /> Start over
          </button>
        </div>
        <AnimatePresence mode="wait">
          {pattern ? (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
              <div className="eyebrow">The System recommends</div>
              <div className="display text-[40px] text-glow mt-1">{pattern.name}</div>
              <p className="text-bone-dim mt-2">{pattern.tagline}</p>
              <div className="mt-4">
                <div className="eyebrow mb-2">Clue words</div>
                <div className="flex flex-wrap gap-1.5">
                  {pattern.triggers.map((t) => (
                    <span key={t} className="chip chip-system">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Link to={`/patterns/${pattern.id}`} className="btn btn-system">
                  Open pattern <ArrowRight size={14} />
                </Link>
                <button className="btn" onClick={reset}>
                  Try another
                </button>
              </div>
            </motion.div>
          ) : node ? (
            <motion.div key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="mt-6">
              <div className="eyebrow">Question {path.length}</div>
              <div className="display text-[30px] mt-1 leading-tight">{node.question}</div>
              <div className="grid sm:grid-cols-2 gap-2 mt-6">
                {node.options.map((o) => (
                  <button
                    key={o.label}
                    className="btn justify-start text-left whitespace-normal py-3"
                    onClick={() => {
                      if (o.patternId) setResult(o.patternId)
                      else if (o.next) setPath((p) => [...p, o.next!])
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {path.length > 1 && (
                <button className="btn btn-xs btn-ghost mt-4" onClick={() => setPath((p) => p.slice(0, -1))}>
                  ← Back
                </button>
              )}
            </motion.div>
          ) : (
            <div className="mt-6 text-muted">The decision tree is missing a node. Start over.</div>
          )}
        </AnimatePresence>
      </Panel>

      <Panel className="p-5">
        <Eyebrow className="mb-3">How to use this</Eyebrow>
        <ol className="text-[13.5px] text-bone-dim space-y-2 list-decimal pl-4">
          <li>Read the problem twice. Underline the nouns (array, tree, graph) and the ask (longest, shortest, count, minimum).</li>
          <li>Answer the questions here honestly based on those words.</li>
          <li>Open the recommended pattern, copy its template, and adapt it.</li>
          <li>If it does not fit after 10 minutes, come back and try the second-best branch.</li>
        </ol>
        <div className="hairline my-4" />
        <Eyebrow className="mb-2">Interview clue cheatsheet</Eyebrow>
        <ul className="text-[12.5px] text-muted space-y-1.5">
          <li><span className="text-bone-dim">sorted</span> → binary search, two pointers</li>
          <li><span className="text-bone-dim">contiguous / substring</span> → sliding window, prefix sum</li>
          <li><span className="text-bone-dim">next greater / previous smaller</span> → monotonic stack</li>
          <li><span className="text-bone-dim">top k / k-th</span> → heap</li>
          <li><span className="text-bone-dim">all combinations</span> → backtracking</li>
          <li><span className="text-bone-dim">shortest path (unweighted)</span> → BFS</li>
          <li><span className="text-bone-dim">count ways / min cost / max value</span> → DP</li>
          <li><span className="text-bone-dim">connected / groups</span> → union-find, DFS</li>
        </ul>
      </Panel>
    </div>
  )
}
