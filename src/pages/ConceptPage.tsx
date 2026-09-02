import { useEffect, useState } from 'react'
import { Link, Navigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, ExternalLink, CalendarClock, ArrowRight, ArrowLeft, Lightbulb, NotebookPen, ChevronDown } from 'lucide-react'
import { useApp } from '@/store/useApp'
import { getConcept, getGate, getPattern, nextConceptAfter, concepts } from '@/lib/content'
import { addDaysKey, nextStudyDay, prettyDate, todayKey } from '@/lib/dates'
import Markdown from '@/components/Markdown'
import CodeTabs from '@/components/CodeTabs'
import { Panel, Eyebrow, Chip, Kanji, cx, difficultyLabel } from '@/components/ui'
import type { Problem } from '@/content/types'

const ease = [0.16, 1, 0.3, 1] as const

export default function ConceptPage() {
  const { conceptId = '' } = useParams()
  const c = getConcept(conceptId)
  const loc = useLocation()
  const progress = useApp((s) => s.conceptProgress[conceptId])
  const startConcept = useApp((s) => s.startConcept)
  const markLearned = useApp((s) => s.markConceptLearned)
  const schedule = useApp((s) => s.scheduleConcept)
  const studyDays = useApp((s) => s.profile.studyDays)
  const [picking, setPicking] = useState(false)

  useEffect(() => {
    if (c) startConcept(c.id)
  }, [c, startConcept])

  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150)
    }
  }, [loc.hash, conceptId])

  if (!c) return <Navigate to="/gates" replace />
  const gate = getGate(c.gateId)!
  const idx = concepts.indexOf(c)
  const prev = concepts[idx - 1]
  const next = nextConceptAfter(c.id)
  const done = progress?.status === 'done'
  const today = todayKey()

  return (
    <div className="max-w-[860px]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link to={`/gates/${gate.id}`} className="text-[12px] text-muted hover:text-bone">
          ← {gate.codename}
        </Link>
        <div className="flex items-center gap-2">
          <button className="btn btn-xs btn-ghost" onClick={() => setPicking((p) => !p)}>
            <CalendarClock size={12} /> Schedule for another day
          </button>
        </div>
      </div>
      {picking && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="panel p-3 mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[12px] text-muted mr-1">Move this concept to:</span>
          {[
            { label: 'Tomorrow', date: addDaysKey(today, 1) },
            { label: 'Next study day', date: nextStudyDay(addDaysKey(today, 1), studyDays) },
            { label: 'In 3 days', date: addDaysKey(today, 3) },
            { label: 'Next week', date: addDaysKey(today, 7) },
          ].map((o) => (
            <button key={o.label} className="btn btn-xs" onClick={() => { schedule(c.id, o.date); setPicking(false) }}>
              {o.label} <span className="text-muted">{prettyDate(o.date)}</span>
            </button>
          ))}
          <input type="date" min={today} className="input !w-auto !py-1 !px-2 text-[12px]" onChange={(e) => { if (e.target.value) { schedule(c.id, e.target.value); setPicking(false) } }} />
        </motion.div>
      )}

      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="mt-6 mb-8">
        <div className="flex items-center gap-3">
          <Eyebrow system>
            Gate {String(gate.order).padStart(2, '0')} · Concept {c.order}
          </Eyebrow>
          <Kanji>学</Kanji>
          <span className="text-[11px] text-muted">{c.minutes} min read</span>
          {done && <span className="chip chip-easy">learned</span>}
        </div>
        <h1 className="display text-[40px] md:text-[54px] leading-[1] mt-2">{c.title}</h1>
        <p className="text-bone-dim text-[16px] mt-3 max-w-2xl">{c.summary}</p>
        {c.patternIds.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="eyebrow">Patterns</span>
            {c.patternIds.map((id) => {
              const p = getPattern(id)
              return p ? (
                <Link key={id} to={`/patterns/${id}`} className="chip chip-system hover:brightness-125">
                  {p.name}
                </Link>
              ) : null
            })}
          </div>
        )}
      </motion.header>

      {/* Analogy */}
      <Panel variant="system" corner className="p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={14} className="text-system" />
          <Eyebrow system>Think of it like this</Eyebrow>
        </div>
        <p className="text-[15px] leading-relaxed text-bone">{c.analogy}</p>
      </Panel>

      <Markdown>{c.explanation}</Markdown>

      {/* Naive vs optimized */}
      {(c.naive || c.optimized) && (
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <Eyebrow system>Slow way vs fast way</Eyebrow>
            <Kanji>速</Kanji>
          </div>
          <div className="space-y-5">
            {c.naive && <Approach a={c.naive} tone="ember" label="Naive" />}
            {c.optimized && <Approach a={c.optimized} tone="jade" label="Optimized" />}
          </div>
          {c.whyFaster && (
            <Panel className="p-5 mt-5">
              <Eyebrow className="mb-2">Why the fast way wins</Eyebrow>
              <p className="text-[14.5px] text-bone-dim leading-relaxed">{c.whyFaster}</p>
            </Panel>
          )}
        </section>
      )}

      {/* Key points */}
      <section className="mt-10">
        <Eyebrow system className="mb-3">Remember</Eyebrow>
        <ul className="grid sm:grid-cols-2 gap-3">
          {c.keyPoints.map((k, i) => (
            <li key={i} className="panel px-4 py-3 text-[13.5px] text-bone-dim flex gap-3">
              <span className="mono text-system">{String(i + 1).padStart(2, '0')}</span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Mark learned */}
      <Panel variant={done ? 'gold' : 'system'} corner className="p-6 mt-10 text-center">
        {done ? (
          <>
            <div className="eyebrow text-gold">Concept mastered</div>
            <div className="display text-2xl mt-1">You have absorbed this knowledge.</div>
          </>
        ) : (
          <>
            <div className="eyebrow eyebrow-system">Finished reading?</div>
            <div className="display text-2xl mt-1">Claim your experience.</div>
            <p className="text-[13px] text-muted mt-1">Only mark it when you could explain the fast way to a friend.</p>
            <button className="btn btn-system mt-4" onClick={() => markLearned(c.id)}>
              <Check size={14} /> Mark as learned · +60 XP
            </button>
          </>
        )}
      </Panel>

      {/* Problems */}
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-4">
          <Eyebrow system>Practice · {c.problems.length} problems</Eyebrow>
          <Kanji>題</Kanji>
        </div>
        <p className="text-[13px] text-muted mb-4">Open the problem on LeetCode, try for 20 to 25 minutes, then record the result here. Solved problems come back for memory checks after 3, 7 and 21 days.</p>
        <div className="space-y-3">
          {c.problems.map((p) => (
            <ProblemRow key={p.id} p={p} />
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--line)] gap-3">
        {prev ? (
          <Link to={`/learn/${prev.id}`} className="btn btn-sm">
            <ArrowLeft size={13} /> {prev.title}
          </Link>
        ) : <span />}
        {next && (
          <Link to={`/learn/${next.id}`} className="btn btn-sm btn-system">
            {next.title} <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  )
}

function Approach({ a, tone, label }: { a: NonNullable<ReturnType<typeof getConcept>>['naive'] & object; tone: 'ember' | 'jade'; label: string }) {
  const [open, setOpen] = useState(true)
  return (
    <Panel className="p-5">
      <button className="w-full flex items-start justify-between gap-4 text-left" onClick={() => setOpen((o) => !o)}>
        <div>
          <div className={cx('eyebrow', tone === 'ember' ? 'text-ember' : 'text-jade')}>{label}</div>
          <div className="text-[16px] font-medium mt-0.5">{a.title}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="chip mono">time {a.time}</span>
          <span className="chip mono">space {a.space}</span>
          <ChevronDown size={16} className={cx('text-muted transition-transform', open && 'rotate-180')} />
        </div>
      </button>
      {open && (
        <div className="mt-3">
          <p className="text-[14px] text-bone-dim leading-relaxed mb-3">{a.description}</p>
          <CodeTabs code={a.code} />
        </div>
      )}
    </Panel>
  )
}

export function ProblemRow({ p, showConcept }: { p: Problem & { conceptIds?: string[] }; showConcept?: boolean }) {
  const attempt = useApp((s) => s.attempts[p.id])
  const record = useApp((s) => s.recordAttempt)
  const addNote = useApp((s) => s.addNote)
  const [hint, setHint] = useState(false)
  const [noting, setNoting] = useState(false)
  const [text, setText] = useState('')
  const pattern = getPattern(p.patternId)
  const solved = attempt?.status === 'solved'
  const failed = attempt?.status === 'failed'
  const dueToday = attempt?.nextReviewAt && attempt.nextReviewAt <= todayKey() && attempt.reviewStage < 4

  return (
    <Panel id={`p-${p.id}`} className={cx('p-4', solved && 'border-[rgba(95,212,162,0.3)]', failed && 'border-[rgba(255,90,60,0.35)]')}>
      <div className="flex items-start gap-3">
        <div className={cx('w-8 h-8 rounded-lg grid place-items-center border shrink-0 mt-0.5', solved ? 'border-[rgba(95,212,162,0.4)] text-jade' : failed ? 'border-[rgba(255,90,60,0.4)] text-ember' : 'border-[var(--line)] text-muted')}>
          {solved ? <Check size={14} /> : failed ? <X size={14} /> : <span className="mono text-[10px]">?</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <a href={p.url} target="_blank" rel="noreferrer" className="text-[15px] font-medium hover:text-system transition-colors">
              {p.title}
            </a>
            <Chip tone={p.difficulty}>{difficultyLabel[p.difficulty]}</Chip>
            <span className="text-[11px] text-system">+{p.xp} XP</span>
            {dueToday && <span className="chip chip-system">review due</span>}
            {solved && attempt?.reviewStage >= 4 && <span className="chip chip-easy">mastered</span>}
          </div>
          <div className="text-[12px] text-muted mt-0.5 flex items-center gap-2 flex-wrap">
            {pattern && (
              <Link to={`/patterns/${pattern.id}`} className="hover:text-system">
                pattern: {pattern.name}
              </Link>
            )}
            {showConcept && p.conceptIds?.[0] && (
              <Link to={`/learn/${p.conceptIds[0]}`} className="hover:text-system">
                · concept: {getConcept(p.conceptIds[0])?.title}
              </Link>
            )}
            {attempt && <span>· {attempt.attempts} attempt{attempt.attempts > 1 ? 's' : ''}</span>}
            {attempt?.nextReviewAt && attempt.reviewStage < 4 && <span>· next review {prettyDate(attempt.nextReviewAt)}</span>}
          </div>
          {hint && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[13px] text-bone-dim border-l-2 border-[rgba(77,163,255,0.5)] pl-3">
              {p.hint}
            </motion.div>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-xs">
              <ExternalLink size={12} /> Open
            </a>
            <button className="btn btn-xs btn-ghost" onClick={() => setHint((h) => !h)}>
              <Lightbulb size={12} /> {hint ? 'Hide hint' : 'Hint'}
            </button>
            <button className="btn btn-xs btn-system" onClick={() => record(p.id, 'solved')}>
              <Check size={12} /> {solved ? (dueToday ? 'Re-solved' : 'Solved again') : 'Solved'}
            </button>
            <button className="btn btn-xs" onClick={() => { record(p.id, 'failed'); setNoting(true) }}>
              <X size={12} /> Struggled
            </button>
            <button className="btn btn-xs btn-ghost" onClick={() => setNoting((n) => !n)}>
              <NotebookPen size={12} /> Note
            </button>
          </div>
          {noting && (
            <div className="mt-3">
              <textarea className="input" placeholder="What blocked you? Which pattern did you miss? What will you try next time?" value={text} onChange={(e) => setText(e.target.value)} />
              <div className="flex gap-2 mt-2">
                <button
                  className="btn btn-xs btn-system"
                  disabled={!text.trim()}
                  onClick={() => {
                    addNote({ title: p.title, text: text.trim(), problemId: p.id, patternId: p.patternId, conceptId: p.conceptIds?.[0], tags: [p.difficulty, p.patternId] })
                    setText('')
                    setNoting(false)
                  }}
                >
                  Save to mistake log
                </button>
                <button className="btn btn-xs btn-ghost" onClick={() => setNoting(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}
