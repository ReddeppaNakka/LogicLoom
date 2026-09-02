import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronLeft, ChevronRight, RotateCcw, ArrowRight } from 'lucide-react'
import type { VisualFrame, ComplexityRow, DryRun, Mistake, RelatedTopic, QuizQuestion } from '@/content/types'
import { getConcept, getPattern } from '@/lib/content'
import { Panel, Eyebrow, cx } from './ui'

/** Frame-by-frame ASCII walkthrough with prev/next controls. */
export function VisualWalkthrough({ frames }: { frames: VisualFrame[] }) {
  const [i, setI] = useState(0)
  const f = frames[i]
  return (
    <Panel variant="system" corner className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)]">
        <Eyebrow system>
          Frame {i + 1} of {frames.length}
        </Eyebrow>
        <div className="flex items-center gap-1">
          <button className="btn btn-xs btn-ghost" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} aria-label="Previous frame">
            <ChevronLeft size={14} />
          </button>
          <button className="btn btn-xs btn-ghost" onClick={() => setI((v) => Math.min(frames.length - 1, v + 1))} disabled={i === frames.length - 1} aria-label="Next frame">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.pre
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mono text-[12.5px] leading-[1.65] overflow-x-auto whitespace-pre text-bone"
          >
            {f.frame}
          </motion.pre>
        </AnimatePresence>
      </div>
      <div className="px-4 pb-4 pt-3">
        <p className="text-[13.5px] text-bone-dim">{f.caption}</p>
        <div className="flex gap-1 mt-3">
          {frames.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Frame ${n + 1}`}
              className={cx('h-1 rounded-full transition-all', n === i ? 'w-7 bg-system' : 'w-3 bg-[rgb(var(--fg-rgb)/0.2)] hover:bg-[rgb(var(--fg-rgb)/0.35)]')}
            />
          ))}
        </div>
      </div>
    </Panel>
  )
}

export function ComplexityTable({ rows }: { rows: ComplexityRow[] }) {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="text-left px-4 py-2.5 eyebrow font-medium">Case</th>
              <th className="text-left px-4 py-2.5 eyebrow font-medium">Time</th>
              <th className="text-left px-4 py-2.5 eyebrow font-medium">Space</th>
              <th className="text-left px-4 py-2.5 eyebrow font-medium">Why</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-[var(--line-soft)] last:border-0">
                <td className="px-4 py-2.5 text-bone whitespace-nowrap">{r.label}</td>
                <td className="px-4 py-2.5 mono text-system whitespace-nowrap">{r.time}</td>
                <td className="px-4 py-2.5 mono text-bone-dim whitespace-nowrap">{r.space}</td>
                <td className="px-4 py-2.5 text-muted">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

export function DryRunTrace({ run }: { run: DryRun }) {
  return (
    <div>
      <Panel className="p-4 mb-3">
        <Eyebrow className="mb-1.5">Input</Eyebrow>
        <div className="mono text-[13px] text-bone break-words">{run.input}</div>
        <div className="text-[13px] text-muted mt-2">{run.goal}</div>
      </Panel>
      <ol className="relative">
        <div className="absolute left-[15px] top-2 bottom-6 w-px bg-[var(--line)]" />
        {run.steps.map((s, i) => (
          <li key={i} className="relative pl-11 pb-3.5">
            <span className="absolute left-0 top-0.5 w-8 h-8 rounded-lg grid place-items-center border border-[rgb(var(--accent-rgb)/0.35)] bg-[var(--bg)] mono text-[11px] text-system">
              {i + 1}
            </span>
            <div className="mono text-[12px] text-bone-dim bg-[rgb(var(--fg-rgb)/0.04)] rounded-md px-2.5 py-1.5 inline-block break-words">{s.state}</div>
            <div className="text-[13.5px] text-bone mt-1.5">{s.action}</div>
          </li>
        ))}
      </ol>
      <Panel variant="gold" className="p-4 mt-1">
        <Eyebrow className="text-gold mb-1.5">Result</Eyebrow>
        <div className="text-[14px] text-bone">{run.result}</div>
      </Panel>
    </div>
  )
}

export function MistakeList({ items }: { items: Mistake[] }) {
  return (
    <div className="space-y-3">
      {items.map((m, i) => (
        <Panel key={i} className="p-4 border-l-2 border-l-[color-mix(in_srgb,var(--warn)_55%,transparent)]">
          <div className="flex items-start gap-2.5">
            <X size={15} className="text-ember shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[14.5px] font-medium">{m.mistake}</div>
              <p className="text-[13px] text-muted mt-1">{m.why}</p>
              <div className="flex items-start gap-2 mt-2.5 pt-2.5 border-t border-[var(--line-soft)]">
                <Check size={14} className="text-jade shrink-0 mt-0.5" />
                <p className="text-[13.5px] text-bone-dim">{m.fix}</p>
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  )
}

export function UseWhen({ use, avoid }: { use: string[]; avoid: string[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Panel variant="system" corner className="p-5">
        <Eyebrow system className="mb-2.5">Reach for it when</Eyebrow>
        <ul className="space-y-2 text-[13.5px]">
          {use.map((t) => (
            <li key={t} className="flex gap-2.5">
              <span className="text-system shrink-0">›</span>
              <span className="text-bone">{t}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel className="p-5">
        <Eyebrow className="mb-2.5 text-ember">Use something else when</Eyebrow>
        <ul className="space-y-2 text-[13.5px]">
          {avoid.map((t) => (
            <li key={t} className="flex gap-2.5">
              <span className="text-ember shrink-0">×</span>
              <span className="text-bone-dim">{t}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

export function RelatedList({ items }: { items: RelatedTopic[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((r) => {
        const target = r.kind === 'concept' ? getConcept(r.id) : getPattern(r.id)
        if (!target) return null
        const name = 'title' in target ? target.title : target.name
        return (
          <Link key={`${r.kind}-${r.id}`} to={r.kind === 'concept' ? `/learn/${r.id}` : `/patterns/${r.id}`} className="group">
            <Panel className="p-4 h-full transition-all group-hover:border-[rgb(var(--accent-rgb)/0.45)]">
              <div className="flex items-center gap-2">
                <span className="chip !text-[10px] !py-0 !px-1.5">{r.kind}</span>
                <span className="text-[14px] font-medium group-hover:text-system transition-colors">{name}</span>
                <ArrowRight size={13} className="text-muted ml-auto group-hover:text-system transition-colors" />
              </div>
              <p className="text-[12.5px] text-muted mt-1.5">{r.why}</p>
            </Panel>
          </Link>
        )
      })}
    </div>
  )
}

/** Self-check quiz. Answers reveal one at a time with an explanation. */
export function ConceptQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({})
  const answered = Object.keys(picked).length
  const correct = questions.filter((q, i) => picked[i] === q.answerIndex).length
  const done = answered === questions.length

  return (
    <Panel variant="system" corner className="p-5">
      <div className="flex items-center justify-between mb-4">
        <Eyebrow system>Check yourself</Eyebrow>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-muted">
            {correct} / {questions.length} correct
          </span>
          {answered > 0 && (
            <button className="btn btn-xs btn-ghost" onClick={() => setPicked({})}>
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>
      <div className="space-y-5">
        {questions.map((q, qi) => {
          const choice = picked[qi]
          const settled = choice !== undefined
          return (
            <div key={qi} className={qi > 0 ? 'pt-5 border-t border-[var(--line-soft)]' : ''}>
              <div className="text-[14.5px] font-medium mb-2.5">
                <span className="mono text-[11px] text-muted mr-2">{String(qi + 1).padStart(2, '0')}</span>
                {q.question}
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((o, oi) => {
                  const isAnswer = oi === q.answerIndex
                  const isChoice = oi === choice
                  return (
                    <button
                      key={oi}
                      disabled={settled}
                      onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                      className={cx(
                        'btn justify-start text-left whitespace-normal !py-2.5 text-[13px]',
                        settled && isAnswer && '!border-[rgb(var(--good-rgb)/0.6)] !bg-[rgb(var(--good-rgb)/0.12)] !text-jade',
                        settled && isChoice && !isAnswer && '!border-[rgb(var(--warn-rgb)/0.6)] !bg-[rgb(var(--warn-rgb)/0.12)] !text-ember',
                        settled && !isAnswer && !isChoice && 'opacity-50',
                      )}
                    >
                      {o}
                    </button>
                  )
                })}
              </div>
              <AnimatePresence>
                {settled && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[13px] text-bone-dim mt-2.5 border-l-2 border-[rgb(var(--accent-rgb)/0.5)] pl-3"
                  >
                    {q.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      {done && (
        <div className="mt-5 pt-4 border-t border-[var(--line)] text-[13.5px] text-bone-dim">
          {correct === questions.length
            ? 'All correct. You can mark this concept learned.'
            : 'Re-read the sections behind the ones you missed before moving on.'}
        </div>
      )}
    </Panel>
  )
}
