import { Link, useParams, Navigate } from 'react-router-dom'
import { Check, BookOpen, Sparkles } from 'lucide-react'
import { useApp } from '@/store/useApp'
import { getGate, conceptsOfGate, getPattern, problemsOfGate } from '@/lib/content'
import { rankColor } from '@/lib/xp'
import { Panel, Eyebrow, Chip, Kanji, cx, difficultyLabel } from '@/components/ui'

export default function GateDetail() {
  const { gateId = '' } = useParams()
  const gate = getGate(gateId)
  const progress = useApp((s) => s.conceptProgress)
  const attempts = useApp((s) => s.attempts)
  if (!gate) return <Navigate to="/gates" replace />
  const cs = conceptsOfGate(gate.id)
  const probs = problemsOfGate(gate.id)
  const solved = probs.filter((p) => attempts[p.id]?.status === 'solved').length

  return (
    <div>
      <Link to="/gates" className="text-[12px] text-muted hover:text-bone">
        ← Dungeon map
      </Link>
      <div className="flex items-end justify-between gap-4 mt-3 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <Eyebrow system>Gate {String(gate.order).padStart(2, '0')}</Eyebrow>
            <Kanji>門</Kanji>
          </div>
          <h1 className="display text-[40px] md:text-[52px] leading-none mt-1">{gate.codename}</h1>
          <div className="text-bone-dim mt-1">{gate.name}</div>
        </div>
        <div className="display text-[64px] leading-none" style={{ color: rankColor[gate.rank], textShadow: `0 0 24px color-mix(in srgb, ${rankColor[gate.rank]} 40%, transparent)` }}>
          {gate.rank}
        </div>
      </div>
      <p className="text-bone-dim max-w-2xl mb-8">{gate.description}</p>

      <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6">
        <div className="min-w-0">
          <Eyebrow className="mb-3">Concepts · {cs.filter((c) => progress[c.id]?.status === 'done').length}/{cs.length} learned</Eyebrow>
          <div className="space-y-3">
            {cs.map((c, i) => {
              const done = progress[c.id]?.status === 'done'
              const learning = progress[c.id]?.status === 'learning'
              const cSolved = c.problems.filter((p) => attempts[p.id]?.status === 'solved').length
              return (
                <Link key={c.id} to={`/learn/${c.id}`} className="block group">
                  <Panel className={cx('p-4 flex items-center gap-4 transition-all group-hover:border-[rgb(var(--fg-rgb)/0.28)]', done && 'opacity-80')}>
                    <div className={cx('w-9 h-9 rounded-lg grid place-items-center border shrink-0', done ? 'border-[rgb(var(--good-rgb)/0.4)] text-jade' : 'border-[var(--line)] text-muted')}>
                      {done ? <Check size={15} /> : <span className="mono text-[11px]">{String(i + 1).padStart(2, '0')}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium group-hover:text-system transition-colors">{c.title}</div>
                      <div className="text-[12.5px] text-muted truncate">{c.summary}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-muted">{c.minutes} min</div>
                      <div className="text-[11px] text-bone-dim">
                        {cSolved}/{c.problems.length} solved
                      </div>
                      {learning && <span className="chip chip-system mt-1">in progress</span>}
                    </div>
                  </Panel>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="space-y-5 min-w-0">
          {gate.patternIds.length > 0 && (
            <Panel className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Eyebrow>Patterns in this gate</Eyebrow>
                <Sparkles size={14} className="text-system" />
              </div>
              <div className="space-y-2">
                {gate.patternIds.map((id) => {
                  const p = getPattern(id)
                  if (!p) return null
                  return (
                    <Link key={id} to={`/patterns/${id}`} className="block px-3 py-2 rounded-lg border border-[var(--line)] hover:border-[rgb(var(--accent-rgb)/0.5)] hover:bg-[rgb(var(--accent-rgb)/0.05)] transition-all">
                      <div className="text-[13.5px]">{p.name}</div>
                      <div className="text-[11.5px] text-muted">{p.tagline}</div>
                    </Link>
                  )
                })}
              </div>
            </Panel>
          )}

          <Panel className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Eyebrow>Problems · {solved}/{probs.length}</Eyebrow>
              <BookOpen size={14} className="text-muted" />
            </div>
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {probs.map((p) => {
                const st = attempts[p.id]?.status
                return (
                  <Link key={p.id} to={`/learn/${p.conceptIds[0]}#p-${p.id}`} className="flex items-center gap-2 text-[13px] py-1.5 border-b border-[var(--line-soft)] last:border-0 min-w-0">
                    <span className={cx('w-1.5 h-1.5 rounded-full shrink-0', st === 'solved' ? 'bg-jade' : st === 'failed' ? 'bg-ember' : 'bg-[rgb(var(--fg-rgb)/0.2)]')} />
                    <span className={cx('flex-1 truncate', st === 'solved' && 'text-muted')}>{p.title}</span>
                    <Chip tone={p.difficulty} className="shrink-0">{difficultyLabel[p.difficulty]}</Chip>
                  </Link>
                )
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
