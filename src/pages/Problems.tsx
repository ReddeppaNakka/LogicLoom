import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useApp } from '@/store/useApp'
import { problems, gates, patterns } from '@/lib/content'
import { dueReviews } from '@/lib/scheduler'
import { todayKey } from '@/lib/dates'
import { SectionTitle, Panel, Eyebrow, Stat, cx } from '@/components/ui'
import { ProblemRow } from './ConceptPage'
import type { Difficulty } from '@/content/types'

type Filter = 'all' | 'due' | 'solved' | 'struggled' | 'unsolved'

export default function Problems() {
  const attempts = useApp((s) => s.attempts)
  const state = useApp()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [gate, setGate] = useState('all')
  const [diff, setDiff] = useState<Difficulty | 'all'>('all')
  const [pattern, setPattern] = useState('all')
  const today = todayKey()
  const due = useMemo(() => new Set(dueReviews(state, today).map((a) => a.problemId)), [attempts, today])

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return problems.filter((p) => {
      const a = attempts[p.id]
      if (filter === 'due' && !due.has(p.id)) return false
      if (filter === 'solved' && a?.status !== 'solved') return false
      if (filter === 'struggled' && a?.status !== 'failed') return false
      if (filter === 'unsolved' && a?.status === 'solved') return false
      if (gate !== 'all' && p.gateId !== gate) return false
      if (diff !== 'all' && p.difficulty !== diff) return false
      if (pattern !== 'all' && p.patternId !== pattern) return false
      if (s && !p.title.toLowerCase().includes(s)) return false
      return true
    })
  }, [q, filter, gate, diff, pattern, attempts, due])

  const solved = problems.filter((p) => attempts[p.id]?.status === 'solved').length
  const struggled = problems.filter((p) => attempts[p.id]?.status === 'failed').length
  const byDiff = (d: Difficulty) => ({ done: problems.filter((p) => p.difficulty === d && attempts[p.id]?.status === 'solved').length, total: problems.filter((p) => p.difficulty === d).length })

  return (
    <div>
      <SectionTitle eyebrow="Problem tracker" kanji="題" title="Every monster you have faced." />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Panel className="p-4"><Stat label="Solved" value={solved} sub={`of ${problems.length}`} tone="var(--good)" /></Panel>
        <Panel className="p-4"><Stat label="Due for review" value={due.size} sub="spaced repetition" tone="var(--accent)" /></Panel>
        <Panel className="p-4"><Stat label="Struggled" value={struggled} sub="come back soon" tone="#ff5a3c" /></Panel>
        <Panel className="p-4"><Stat label="Easy · Medium" value={`${byDiff('easy').done} · ${byDiff('medium').done}`} sub={`of ${byDiff('easy').total} · ${byDiff('medium').total}`} /></Panel>
        <Panel className="p-4"><Stat label="Hard" value={byDiff('hard').done} sub={`of ${byDiff('hard').total}`} tone="#c9a24a" /></Panel>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Search problems…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input !w-auto" value={gate} onChange={(e) => setGate(e.target.value)}>
          <option value="all">All gates</option>
          {gates.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select className="input !w-auto" value={pattern} onChange={(e) => setPattern(e.target.value)}>
          <option value="all">All patterns</option>
          {patterns.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select className="input !w-auto" value={diff} onChange={(e) => setDiff(e.target.value as Difficulty | 'all')}>
          <option value="all">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="flex gap-1 mb-5 flex-wrap">
        {(['all', 'due', 'unsolved', 'solved', 'struggled'] as Filter[]).map((f) => (
          <button key={f} className={cx('btn btn-xs capitalize', filter === f && 'btn-system')} onClick={() => setFilter(f)}>
            {f === 'due' ? `Due (${due.size})` : f}
          </button>
        ))}
        <span className="text-[12px] text-muted self-center ml-2">{list.length} shown</span>
      </div>

      {list.length === 0 ? (
        <Panel className="p-8 text-center text-muted text-sm">
          <Eyebrow className="mb-2">Nothing here</Eyebrow>
          Adjust the filters or go clear some gates.
        </Panel>
      ) : (
        <div className="space-y-3">
          {list.slice(0, 80).map((p) => (
            <ProblemRow key={p.id} p={p} showConcept />
          ))}
          {list.length > 80 && <div className="text-[12px] text-muted text-center py-3">Showing the first 80. Narrow the filters to see more.</div>}
        </div>
      )}
    </div>
  )
}
