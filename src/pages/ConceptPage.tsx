import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check,
  X,
  ExternalLink,
  CalendarClock,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  NotebookPen,
  ChevronDown,
  Maximize2,
  Minimize2,
  BookMarked,
} from 'lucide-react'
import { useApp } from '@/store/useApp'
import { getConcept, getGate, getPattern, nextConceptAfter, concepts } from '@/lib/content'
import { addDaysKey, nextStudyDay, prettyDate, todayKey } from '@/lib/dates'
import Markdown from '@/components/Markdown'
import CodeTabs from '@/components/CodeTabs'
import ReadingProgress from '@/components/ReadingProgress'
import Reveal from '@/components/Reveal'
import TableOfContents, { MobileToc, type TocItem } from '@/components/TableOfContents'
import {
  VisualWalkthrough,
  ComplexityTable,
  DryRunTrace,
  MistakeList,
  UseWhen,
  RelatedList,
  ConceptQuiz,
} from '@/components/ConceptSections'
import { Panel, Eyebrow, Chip, Kanji, cx, difficultyLabel } from '@/components/ui'
import type { Problem, Tier } from '@/content/types'

const ease = [0.16, 1, 0.3, 1] as const

const TIER_LABEL: Record<Tier, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const TIER_ORDER: Tier[] = ['beginner', 'intermediate', 'advanced']

/** One numbered section with an anchor the table of contents can target. */
function Section({ id, n, title, sub, children }: { id: string; n: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mt-12 first:mt-0">
      <Reveal>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="mono text-[11px] text-system">{String(n).padStart(2, '0')}</span>
          <h2 className="display text-[28px] leading-tight">{title}</h2>
        </div>
        {sub && <p className="text-[13px] text-muted mb-4 ml-8">{sub}</p>}
        <div className={sub ? '' : 'mt-4'}>{children}</div>
      </Reveal>
    </section>
  )
}

export default function ConceptPage() {
  const { conceptId = '' } = useParams()
  const c = getConcept(conceptId)
  const loc = useLocation()
  const progress = useApp((s) => s.conceptProgress[conceptId])
  const startConcept = useApp((s) => s.startConcept)
  const markLearned = useApp((s) => s.markConceptLearned)
  const schedule = useApp((s) => s.scheduleConcept)
  const studyDays = useApp((s) => s.profile.studyDays)
  const focusMode = useApp((s) => s.focusMode)
  const toggleFocus = useApp((s) => s.toggleFocusMode)
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

  // Only list sections the concept actually has, so partially written topics
  // still render a sensible page.
  const toc = useMemo<TocItem[]>(() => {
    if (!c) return []
    const items: TocItem[] = []
    const add = (id: string, label: string, present: boolean) => {
      if (present) items.push({ id, label })
    }
    add('definition', 'Definition', Boolean(c.definition || c.summary))
    add('intuition', 'Intuition', Boolean(c.analogy))
    add('visual', 'Visual walkthrough', Boolean(c.visual?.length))
    add('core', 'Core concept', Boolean(c.explanation))
    add('pseudocode', 'Pseudocode', Boolean(c.pseudocode))
    add('code', 'Code', Boolean(c.naive || c.optimized))
    add('complexity', 'Complexity', Boolean(c.complexity?.length))
    add('dry-run', 'Dry run', Boolean(c.dryRun))
    add('mistakes', 'Common mistakes', Boolean(c.mistakes?.length))
    add('when', 'When to use', Boolean(c.whenToUse?.length))
    add('related', 'Related topics', Boolean(c.relatedTopics?.length || c.patternIds.length))
    add('practice', 'Practice', c.problems.length > 0)
    add('quiz', 'Quiz', Boolean(c.quiz?.length))
    return items
  }, [c])

  const byTier = useMemo(() => {
    if (!c) return []
    const groups = TIER_ORDER.map((t) => ({ tier: t, items: c.problems.filter((p) => p.tier === t) })).filter((g) => g.items.length)
    const untiered = c.problems.filter((p) => !p.tier)
    if (untiered.length) groups.push({ tier: 'beginner' as Tier, items: untiered })
    return groups.length ? groups : [{ tier: 'beginner' as Tier, items: c.problems }]
  }, [c])

  if (!c) return <Navigate to="/gates" replace />
  const gate = getGate(c.gateId)!
  const idx = concepts.indexOf(c)
  const prev = concepts[idx - 1]
  const next = nextConceptAfter(c.id)
  const done = progress?.status === 'done'
  const today = todayKey()
  let n = 0

  return (
    <div className="flex gap-10 justify-center">
      <div className="max-w-[820px] w-full min-w-0">
        <ReadingProgress />
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link to={`/gates/${gate.id}`} className="text-[12px] text-muted hover:text-bone">
            ← {gate.codename}
          </Link>
          <div className="flex items-center gap-2">
            <button className="btn btn-xs btn-ghost" onClick={toggleFocus} title="Hide everything except the page">
              {focusMode ? <Minimize2 size={12} /> : <Maximize2 size={12} />} {focusMode ? 'Exit focus' : 'Focus mode'}
            </button>
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

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="mt-6 mb-10">
          <div className="flex items-center gap-3 flex-wrap">
            <Eyebrow system>
              Gate {String(gate.order).padStart(2, '0')} · Concept {c.order}
            </Eyebrow>
            <Kanji>学</Kanji>
            <span className="text-[11px] text-muted">{c.minutes} min read</span>
            {done && <span className="chip chip-easy">learned</span>}
          </div>
          <h1 className="display text-[40px] md:text-[54px] leading-[1] mt-2">{c.title}</h1>
          <p className="text-bone-dim text-[16px] mt-3 max-w-2xl">{c.summary}</p>
        </motion.header>

        <MobileToc items={toc} />

        {/* 01 Definition */}
        <Section id="definition" n={++n} title="Definition" sub="The plain statement of what this is.">
          <Panel className="p-5">
            <p className="text-[16px] leading-relaxed text-bone">{c.definition ?? c.summary}</p>
          </Panel>
          {c.patternIds.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
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
        </Section>

        {/* 02 Intuition */}
        <Section id="intuition" n={++n} title="Intuition" sub="The everyday version of the same idea.">
          <Panel variant="system" corner className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={14} className="text-system" />
              <Eyebrow system>Think of it like this</Eyebrow>
            </div>
            <p className="text-[15px] leading-relaxed text-bone">{c.analogy}</p>
          </Panel>
        </Section>

        {/* 03 Visual walkthrough */}
        {c.visual && c.visual.length > 0 && (
          <Section id="visual" n={++n} title="Visual walkthrough" sub="Step through the mechanism one frame at a time.">
            <VisualWalkthrough frames={c.visual} />
          </Section>
        )}

        {/* 04 Core concept */}
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
        </Section>

        {/* 05 Pseudocode */}
        {c.pseudocode && (
          <Section id="pseudocode" n={++n} title="Pseudocode" sub="Language independent. This is what to write on the whiteboard.">
            <div className="code-block">
              <pre className="whitespace-pre">{c.pseudocode}</pre>
            </div>
          </Section>
        )}

        {/* 06 Code */}
        {(c.naive || c.optimized) && (
          <Section id="code" n={++n} title="Code" sub="The slow way first, then the fast way.">
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
          </Section>
        )}

        {/* 07 Complexity */}
        {c.complexity && c.complexity.length > 0 && (
          <Section id="complexity" n={++n} title="Complexity" sub="What it costs in time and in memory.">
            <ComplexityTable rows={c.complexity} />
          </Section>
        )}

        {/* 08 Dry run */}
        {c.dryRun && (
          <Section id="dry-run" n={++n} title="Dry run" sub="One small input, traced line by line.">
            <DryRunTrace run={c.dryRun} />
          </Section>
        )}

        {/* 09 Common mistakes */}
        {c.mistakes && c.mistakes.length > 0 && (
          <Section id="mistakes" n={++n} title="Common mistakes" sub="The errors that actually cost people interviews.">
            <MistakeList items={c.mistakes} />
          </Section>
        )}

        {/* 10 When to use */}
        {c.whenToUse && c.whenToUse.length > 0 && (
          <Section id="when" n={++n} title="When to use it" sub="Match these signals against the problem statement.">
            <UseWhen use={c.whenToUse} avoid={c.whenNotToUse ?? []} />
          </Section>
        )}

        {/* 11 Related topics */}
        {c.relatedTopics && c.relatedTopics.length > 0 && (
          <Section id="related" n={++n} title="Related topics" sub="Where this sits in the wider map.">
            <RelatedList items={c.relatedTopics} />
          </Section>
        )}

        {/* 12 Key points + practice */}
        <Section id="practice" n={++n} title="Practice" sub="Work down the ladder. Give each problem 20 minutes before opening the hint.">
          <div className="mb-6">
            <Eyebrow className="mb-3">Remember</Eyebrow>
            <ul className="grid sm:grid-cols-2 gap-3">
              {c.keyPoints.map((k, i) => (
                <li key={i} className="panel px-4 py-3 text-[13.5px] text-bone-dim flex gap-3 h-full">
                  <span className="mono text-system">{String(i + 1).padStart(2, '0')}</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            {byTier.map((g) => (
              <div key={g.tier}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Eyebrow>{TIER_LABEL[g.tier]}</Eyebrow>
                  <span className="text-[11px] text-muted">{g.items.length} problems</span>
                </div>
                <div className="space-y-3">
                  {g.items.map((p) => (
                    <ProblemRow key={p.id} p={p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 13 Quiz */}
        {c.quiz && c.quiz.length > 0 && (
          <Section id="quiz" n={++n} title="Quiz" sub="Answer these before you mark the concept learned.">
            <ConceptQuiz questions={c.quiz} />
          </Section>
        )}

        {/* Mark learned */}
        <Panel variant={done ? 'gold' : 'system'} corner className="p-6 mt-12 text-center">
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

        {c.sources && c.sources.length > 0 && (
          <div className="mt-8 pt-5 border-t border-[var(--line)]">
            <div className="flex items-center gap-2 mb-2">
              <BookMarked size={13} className="text-muted" />
              <Eyebrow>Written from</Eyebrow>
            </div>
            <p className="text-[12px] text-muted">{c.sources.join(' · ')}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--line)] gap-3">
          {prev ? (
            <Link to={`/learn/${prev.id}`} className="btn btn-sm">
              <ArrowLeft size={13} /> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/learn/${next.id}`} className="btn btn-sm btn-system">
              {next.title} <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>

      <TableOfContents items={toc} />
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
    <Panel id={`p-${p.id}`} className={cx('p-4', solved && 'border-[rgb(var(--good-rgb)/0.3)]', failed && 'border-[rgb(var(--warn-rgb)/0.35)]')}>
      <div className="flex items-start gap-3">
        <motion.div
          key={solved ? 'solved' : failed ? 'failed' : 'new'}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          className={cx(
            'w-8 h-8 rounded-lg grid place-items-center border shrink-0 mt-0.5',
            solved ? 'border-[rgb(var(--good-rgb)/0.4)] text-jade solved-ring' : failed ? 'border-[rgb(var(--warn-rgb)/0.4)] text-ember' : 'border-[var(--line)] text-muted',
          )}
        >
          {solved ? <Check size={14} /> : failed ? <X size={14} /> : <span className="mono text-[10px]">?</span>}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <a href={p.url} target="_blank" rel="noreferrer" className="text-[15px] font-medium hover:text-system transition-colors">
              {p.title}
            </a>
            <Chip tone={p.difficulty}>{difficultyLabel[p.difficulty]}</Chip>
            {p.tier && <span className="chip !text-[10px] !py-0 !px-1.5">{TIER_LABEL[p.tier]}</span>}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[13px] text-bone-dim border-l-2 border-[rgb(var(--accent-rgb)/0.5)] pl-3">
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
