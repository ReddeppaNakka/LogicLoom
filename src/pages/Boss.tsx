import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Skull, ExternalLink, Check, X, Swords } from 'lucide-react'
import { useApp } from '@/store/useApp'
import { getProblem, getPattern } from '@/lib/content'
import { Panel, Eyebrow, Chip, Kanji, cx, difficultyLabel } from '@/components/ui'

const LIMIT = 45 * 60

export default function Boss() {
  const { questId = '' } = useParams()
  const quest = useApp((s) => s.quests.find((q) => q.id === questId))
  const complete = useApp((s) => s.completeQuest)
  const record = useApp((s) => s.recordAttempt)
  const [started, setStarted] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const [results, setResults] = useState<Record<string, 'solved' | 'failed'>>({})

  useEffect(() => {
    if (started === null) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [started])

  if (!quest || quest.kind !== 'boss') return <Navigate to="/" replace />
  const ids = (quest.refId ?? '').split(',').filter(Boolean)
  const probs = ids.map(getProblem).filter(Boolean) as NonNullable<ReturnType<typeof getProblem>>[]
  const elapsed = started ? Math.floor((now - started) / 1000) : 0
  const left = Math.max(0, LIMIT - elapsed)
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  const done = quest.status === 'done'
  const allAnswered = probs.every((p) => results[p.id])
  const cleared = probs.filter((p) => results[p.id] === 'solved').length

  const finish = () => {
    probs.forEach((p) => record(p.id, results[p.id] ?? 'failed'))
    if (cleared >= Math.ceil(probs.length / 2)) complete(quest.id)
  }

  return (
    <div className="max-w-[860px]">
      <Link to="/" className="text-[12px] text-muted hover:text-bone">
        ← Status window
      </Link>
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4 mb-6">
        <div className="flex items-center gap-3">
          <Eyebrow className="text-ember">Boss fight</Eyebrow>
          <Kanji>試練</Kanji>
        </div>
        <h1 className="display text-[44px] md:text-[58px] leading-[1] mt-2">
          {done ? 'The boss has fallen.' : 'A red gate has opened.'}
        </h1>
        <p className="text-bone-dim mt-3 max-w-2xl">
          {probs.length} problems. 45 minutes. No hints, no notes. Clear at least half to claim the reward. Record honestly, the System only helps hunters who tell the truth.
        </p>
      </motion.header>

      <Panel variant={done ? 'gold' : 'danger'} corner className="p-6 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl grid place-items-center border border-[rgba(224,35,28,0.5)] bg-[rgba(224,35,28,0.1)] text-ember">
            <Skull size={22} />
          </div>
          <div>
            <div className="eyebrow">{done ? 'Cleared' : started ? 'Time remaining' : 'Ready?'}</div>
            <div className={cx('display text-[40px] leading-none mono', Boolean(left < 300 && started && !done) && 'text-ember glow-pulse')}>{done ? `+${quest.xp} XP` : `${mm}:${ss}`}</div>
          </div>
        </div>
        {!started && !done && (
          <button className="btn btn-danger px-6" onClick={() => setStarted(Date.now())}>
            <Swords size={14} /> Begin the fight
          </button>
        )}
        {started && !done && (
          <button className="btn btn-system" disabled={!allAnswered} onClick={finish}>
            Finish · {cleared}/{probs.length} cleared
          </button>
        )}
      </Panel>

      <div className={cx('space-y-3 transition-all', !started && !done && 'blur-sm pointer-events-none select-none')}>
        {probs.map((p, i) => {
          const r = results[p.id]
          return (
            <Panel key={p.id} className={cx('p-4', r === 'solved' && 'border-[rgba(95,212,162,0.4)]', r === 'failed' && 'border-[rgba(255,90,60,0.4)]')}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="mono text-[11px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                <a href={p.url} target="_blank" rel="noreferrer" className="text-[15px] font-medium hover:text-system">
                  {p.title}
                </a>
                <Chip tone={p.difficulty}>{difficultyLabel[p.difficulty]}</Chip>
                <span className="text-[11.5px] text-muted">{getPattern(p.patternId)?.name}</span>
                <div className="ml-auto flex gap-2">
                  <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-xs">
                    <ExternalLink size={12} /> Open
                  </a>
                  {!done && (
                    <>
                      <button className={cx('btn btn-xs', r === 'solved' && 'btn-system')} onClick={() => setResults((s) => ({ ...s, [p.id]: 'solved' }))}>
                        <Check size={12} /> Solved
                      </button>
                      <button className={cx('btn btn-xs', r === 'failed' && 'btn-danger')} onClick={() => setResults((s) => ({ ...s, [p.id]: 'failed' }))}>
                        <X size={12} /> Failed
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Panel>
          )
        })}
      </div>
    </div>
  )
}
