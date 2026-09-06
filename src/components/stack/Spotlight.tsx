import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X, ExternalLink, FlaskConical, AlertTriangle, GraduationCap, FileCode2, ChevronLeft, ChevronRight,
  Lightbulb, History, Layers, Eye, Cpu, Hammer, Globe, GitCompare, BookOpen, HelpCircle, Link2, Clock,
} from 'lucide-react'
import type { Tech, TechDeep, DeepConcept, BuildStep } from '@/content/stack-types'
import { allTech, deepOf } from '@/lib/stack'
import Markdown from '@/components/Markdown'
import { VisualWalkthrough, ConceptQuiz } from '@/components/ConceptSections'
import { Signature } from './Signatures'
import { cx } from '@/components/ui'

/**
 * Full-screen study view for one technology. A sticky rail on the left lists
 * the sections; the right side is a long, calm read: analogy, origins, the core
 * ideas with runnable examples, a frame-by-frame visual, how it works inside,
 * the real code from this repository, a build-it-yourself lab, who uses it,
 * alternatives, lessons and traps, exercises, a glossary and a quiz.
 */
export default function Spotlight({ tech, onClose, onNav }: { tech: Tech | null; onClose: () => void; onNav: (id: string) => void }) {
  useEffect(() => {
    if (!tech) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && !isTyping(e)) step(1)
      if (e.key === 'ArrowLeft' && !isTyping(e)) step(-1)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  })

  const idx = tech ? allTech.findIndex((t) => t.id === tech.id) : -1
  const step = (d: number) => {
    const n = allTech[(idx + d + allTech.length) % allTech.length]
    if (n) onNav(n.id)
  }

  // Rendered into <body> so it sits above the sidebar and every page-level
  // stacking context, whatever the route's own layout does.
  return createPortal(
    <AnimatePresence>
      {tech && (
        <motion.div
          key="spot"
          data-spotlight
          className="fixed inset-0 z-[80] flex items-stretch justify-center p-0 md:p-6"
          style={{ background: 'rgb(var(--bg-rgb) / 0.86)', backdropFilter: 'blur(18px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[1240px] md:rounded-3xl border-0 md:border border-[rgb(var(--accent-rgb)/0.35)] overflow-hidden flex flex-col"
            style={{ background: 'linear-gradient(180deg, var(--surface-raised), var(--bg))', boxShadow: '0 60px 140px -50px rgb(0 0 0 / 0.9), 0 0 0 1px rgb(var(--accent-rgb) / 0.08) inset' }}
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: 8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Body key={tech.id} tech={tech} deep={deepOf(tech.id)} onClose={onClose} step={step} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

const isTyping = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
}

const EASE = [0.16, 1, 0.3, 1] as const

type SectionId = 'overview' | 'origins' | 'ideas' | 'watch' | 'inside' | 'code' | 'build' | 'wild' | 'compare' | 'lessons' | 'try' | 'glossary' | 'quiz' | 'docs'

const SECTIONS: { id: SectionId; label: string; icon: typeof Lightbulb }[] = [
  { id: 'overview', label: 'Overview', icon: Lightbulb },
  { id: 'origins', label: 'Where it came from', icon: History },
  { id: 'ideas', label: 'Core ideas', icon: Layers },
  { id: 'watch', label: 'Watch it work', icon: Eye },
  { id: 'inside', label: 'How it works inside', icon: Cpu },
  { id: 'code', label: 'Real code from this app', icon: FileCode2 },
  { id: 'build', label: 'Build it yourself', icon: Hammer },
  { id: 'wild', label: 'In the wild', icon: Globe },
  { id: 'compare', label: 'Alternatives', icon: GitCompare },
  { id: 'lessons', label: 'Lessons and traps', icon: GraduationCap },
  { id: 'try', label: 'Try this', icon: FlaskConical },
  { id: 'glossary', label: 'Glossary', icon: BookOpen },
  { id: 'quiz', label: 'Check yourself', icon: HelpCircle },
  { id: 'docs', label: 'Go deeper', icon: Link2 },
]

/** Rough reading time from every string in the study material. */
function readingMinutes(tech: Tech, deep: TechDeep): number {
  const words = JSON.stringify({ tech, deep }).split(/\s+/).length
  return Math.max(8, Math.round(words / 210))
}

function Body({ tech, deep, onClose, step }: { tech: Tech; deep: TechDeep; onClose: () => void; step: (d: number) => void }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<SectionId>('overview')
  const [progress, setProgress] = useState(0)
  const minutes = useMemo(() => readingMinutes(tech, deep), [tech, deep])

  // Scroll-spy on the panel's own scroll container, position based.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const top = el.scrollTop
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(1, top / max) : 1)
      let current: SectionId = 'overview'
      for (const s of SECTIONS) {
        const node = el.querySelector<HTMLElement>(`[data-section="${s.id}"]`)
        if (node && node.offsetTop - 120 <= top) current = s.id
      }
      // The last sections can never reach the top of a short viewport, so at the
      // very end the final section counts as active.
      if (max - top < 4) current = SECTIONS[SECTIONS.length - 1].id
      setActive(current)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    el.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { el.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  // On narrow screens the rail is a horizontal strip: keep the active chip in view.
  useEffect(() => {
    const el = scroller.current
    const ul = el?.querySelector<HTMLElement>('nav ul')
    const btn = ul?.querySelector<HTMLElement>(`[data-rail="${active}"]`)
    if (ul && btn && ul.scrollWidth > ul.clientWidth + 1) {
      const target = btn.offsetLeft - (ul.clientWidth - btn.offsetWidth) / 2
      ul.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
    }
  }, [active])

  const jump = (id: SectionId) => {
    const el = scroller.current
    const node = el?.querySelector<HTMLElement>(`[data-section="${id}"]`)
    if (el && node) el.scrollTo({ top: node.offsetTop - 24, behavior: 'smooth' })
  }

  return (
    <>
      {/* Progress hairline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 bg-[rgb(var(--fg-rgb)/0.06)]">
        <div className="h-full bg-[var(--accent)]" style={{ width: `${progress * 100}%`, transition: 'width 120ms linear' }} />
      </div>

      {/* Header */}
      <div className="shrink-0 px-5 md:px-8 pt-5 pb-4 border-b border-[var(--line)]" style={{ background: 'radial-gradient(70% 120% at 95% 0%, rgb(var(--accent-rgb) / 0.14), transparent 60%)' }}>
        <div className="flex items-start gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="mono text-[11px] text-system">{String(tech.order).padStart(2, '0')} / {String(allTech.length).padStart(2, '0')}</span>
              <span className="chip !text-[10px] !py-0 !px-1.5">{tech.category}</span>
              <span className="mono text-[10.5px] text-muted">{tech.version}</span>
              <span className="text-[10.5px] text-muted flex items-center gap-1"><Clock size={11} /> {minutes} min read</span>
            </div>
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }} className="display text-[36px] md:text-[54px] leading-[0.95] break-words">
              {tech.name}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-[14px] md:text-[15px] text-bone-dim mt-2 max-w-2xl">
              {tech.role}
            </motion.p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-3">
            <div className="flex gap-1">
              <button className="btn btn-xs btn-ghost" onClick={() => step(-1)} aria-label="Previous"><ChevronLeft size={14} /></button>
              <button className="btn btn-xs btn-ghost" onClick={() => step(1)} aria-label="Next"><ChevronRight size={14} /></button>
              <button className="btn btn-xs" onClick={onClose} aria-label="Close"><X size={14} /></button>
            </div>
            <div className="relative w-[84px] h-[84px] opacity-40 hidden md:block pointer-events-none">
              <Signature id={tech.id} corner="top" />
            </div>
          </div>
        </div>
      </div>

      {/* Body: rail + reading column, one scroll container */}
      <div ref={scroller} className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        <div className="lg:grid lg:grid-cols-[212px_minmax(0,1fr)]">
          {/* Rail: vertical on large screens, a horizontal strip below */}
          <nav className="lg:sticky lg:top-0 lg:self-start lg:h-full lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto sticky top-0 z-10 bg-[rgb(var(--bg-rgb)/0.85)] backdrop-blur-md border-b lg:border-b-0 lg:border-r border-[var(--line)] px-3 lg:px-4 py-2 lg:py-5" aria-label="Sections">
            <ul className="flex lg:flex-col gap-0.5 overflow-x-auto no-scrollbar">
              {SECTIONS.map((s, i) => {
                const on = active === s.id
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      data-rail={s.id}
                      onClick={() => jump(s.id)}
                      className={cx('flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-colors w-full text-left', on ? 'text-bone bg-[rgb(var(--accent-rgb)/0.12)]' : 'text-muted hover:text-bone-dim')}
                    >
                      <span className={cx('mono text-[9.5px] w-4 shrink-0', on ? 'text-system' : 'text-muted')}>{String(i + 1).padStart(2, '0')}</span>
                      <s.icon size={12} className={cx('shrink-0', on ? 'text-system' : 'opacity-60')} />
                      <span className="truncate">{s.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="px-5 md:px-10 pb-16 pt-6 min-w-0">
            {/* 01 Overview */}
            <Section id="overview" title="Overview" first>
              <div className="rounded-2xl border border-[rgb(var(--accent-rgb)/0.3)] bg-[rgb(var(--accent-rgb)/0.06)] p-5 mb-6">
                <div className="eyebrow eyebrow-system mb-2 flex items-center gap-1.5"><Lightbulb size={12} /> Think of it as</div>
                <p className="text-[15px] md:text-[16px] text-bone leading-relaxed">{deep.analogy}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="eyebrow mb-1.5">What it is</div>
                  <p className="text-[14.5px] text-bone leading-relaxed">{tech.what}</p>
                </div>
                <div>
                  <div className="eyebrow mb-1.5">Why it is here</div>
                  <p className="text-[14.5px] text-bone-dim leading-relaxed">{tech.why}</p>
                </div>
              </div>
            </Section>

            {/* 02 Origins */}
            <Section id="origins" title="Where it came from" hint="the people, the year, and the problem it was built to solve">
              <Markdown className="!max-w-none">{deep.origins}</Markdown>
            </Section>

            {/* 03 Core ideas */}
            <Section id="ideas" title="Core ideas" hint={`${deep.concepts.length} ideas, in learning order. Each example stands alone.`}>
              <div className="space-y-5">
                {deep.concepts.map((c, i) => <IdeaCard key={c.title} idea={c} n={i + 1} />)}
              </div>
            </Section>

            {/* 04 Watch it work */}
            <Section id="watch" title={deep.visual.title} eyebrow="Watch it work" hint={deep.visual.intro}>
              <VisualWalkthrough frames={deep.visual.frames} />
            </Section>

            {/* 05 Internals */}
            <Section id="inside" title="How it works inside" hint="the machinery underneath, so nothing about it feels like magic">
              <Markdown className="!max-w-none">{deep.internals}</Markdown>
            </Section>

            {/* 06 Real code */}
            <Section id="code" title="Real code from this repository" hint="every sample is lifted verbatim, and the build refuses to ship if it drifts">
              <RepoCode tech={tech} />
              <div className="mt-6">
                <div className="eyebrow mb-2">Where it shows up across the codebase</div>
                <Markdown className="!max-w-none">{tech.howUsedHere}</Markdown>
              </div>
            </Section>

            {/* 07 Build it */}
            <Section id="build" title={deep.buildIt.title} eyebrow="Build it yourself" hint={deep.buildIt.intro}>
              <ol className="space-y-5">
                {deep.buildIt.steps.map((s, i) => <BuildCard key={s.title} step={s} n={i + 1} />)}
              </ol>
            </Section>

            {/* 08 In the wild */}
            <Section id="wild" title="In the wild" hint="real products and teams, and what they use it for">
              <div className="grid sm:grid-cols-2 gap-3">
                {deep.inTheWild.map((w) => (
                  <div key={w.who} className="rounded-2xl border border-[var(--line)] p-4 bg-[rgb(var(--fg-rgb)/0.02)]">
                    <div className="text-[14px] font-medium text-bone mb-1">{w.who}</div>
                    <p className="text-[13px] text-bone-dim leading-relaxed">{w.what}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 09 Alternatives */}
            <Section id="compare" title="Alternatives" hint="what else does this job, and when each is the better pick">
              <div className="rounded-2xl border border-[var(--line)] overflow-hidden">
                {deep.alternatives.map((a, i) => (
                  <div key={a.name} className={cx('grid sm:grid-cols-[200px_minmax(0,1fr)] gap-1 sm:gap-4 px-4 py-3', i > 0 && 'border-t border-[var(--line-soft)]')}>
                    <div className="text-[13.5px] font-medium text-bone">{a.name}</div>
                    <p className="text-[13px] text-bone-dim leading-relaxed">{a.pick}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 10 Lessons and traps */}
            <Section id="lessons" title="Lessons and traps">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[var(--line)] p-4">
                  <div className="flex items-center gap-2 mb-2"><GraduationCap size={13} className="text-system" /><span className="eyebrow">Ideas it teaches</span></div>
                  <ul className="space-y-1.5 text-[13px]">{tech.teaches.map((x) => <li key={x} className="flex gap-2"><span className="text-system shrink-0">›</span><span className="text-bone-dim">{x}</span></li>)}</ul>
                </div>
                <div className="rounded-2xl border border-[var(--line)] p-4">
                  <div className="flex items-center gap-2 mb-2"><AlertTriangle size={13} className="text-ember" /><span className="eyebrow text-ember">Traps</span></div>
                  <ul className="space-y-1.5 text-[13px]">{tech.gotchas.map((x) => <li key={x} className="flex gap-2"><span className="text-ember shrink-0">×</span><span className="text-bone-dim">{x}</span></li>)}</ul>
                </div>
              </div>
            </Section>

            {/* 11 Try this */}
            <Section id="try" title="Try this in the code" hint="exercises against this repository">
              <div className="rounded-2xl border border-[color-mix(in_srgb,var(--gold)_45%,transparent)] p-4">
                <ol className="space-y-2 text-[13.5px] list-decimal pl-4">{tech.tryThis.map((x) => <li key={x} className="text-bone-dim">{x}</li>)}</ol>
              </div>
            </Section>

            {/* 12 Glossary */}
            <Section id="glossary" title="Glossary">
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {deep.glossary.map((g) => (
                  <div key={g.term} className="border-l-2 border-[rgb(var(--accent-rgb)/0.4)] pl-3">
                    <dt className="text-[13.5px] font-medium text-bone">{g.term}</dt>
                    <dd className="text-[12.5px] text-bone-dim leading-relaxed">{g.meaning}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            {/* 13 Quiz */}
            <Section id="quiz" title="Check yourself" hint={`${deep.quiz.length} questions. Answers explain themselves.`}>
              <ConceptQuiz questions={deep.quiz} />
            </Section>

            {/* 14 Docs */}
            <Section id="docs" title="Go deeper" hint="the official material, when you want the whole story">
              <div className="flex gap-2 flex-wrap">
                {tech.docs.map((d) => <a key={d.url} href={d.url} target="_blank" rel="noreferrer" className="btn btn-xs"><ExternalLink size={11} /> {d.label}</a>)}
              </div>
              <div className="mt-8 pt-5 border-t border-[var(--line)] flex items-center justify-between gap-3 flex-wrap">
                <button className="btn btn-xs btn-ghost" onClick={() => step(-1)}><ChevronLeft size={12} /> Previous technology</button>
                <button className="btn btn-xs btn-system" onClick={() => step(1)}>Next technology <ChevronRight size={12} /></button>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </>
  )
}

function Section({ id, title, eyebrow, hint, first, children }: { id: SectionId; title: string; eyebrow?: string; hint?: string; first?: boolean; children: ReactNode }) {
  const reduce = useReducedMotion()
  const n = SECTIONS.findIndex((s) => s.id === id) + 1
  return (
    <motion.section
      data-section={id}
      className={cx('scroll-mt-6', !first && 'mt-14 pt-10 border-t border-[var(--line-soft)]')}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="mono text-[10px] text-system">{String(n).padStart(2, '0')}</span>
          <span className="eyebrow eyebrow-system">{eyebrow ?? SECTIONS[n - 1].label}</span>
        </div>
        <h3 className="display text-[26px] md:text-[32px] leading-tight">{title}</h3>
        {hint && <p className="text-[13.5px] text-bone-dim mt-1.5 max-w-2xl">{hint}</p>}
      </div>
      {children}
    </motion.section>
  )
}

/** One core idea: numbered, explained, with a standalone example. */
function IdeaCard({ idea, n }: { idea: DeepConcept; n: number }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] overflow-hidden bg-[rgb(var(--fg-rgb)/0.015)]">
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="display text-[26px] leading-none text-system">{String(n).padStart(2, '0')}</span>
          <h4 className="text-[16px] font-medium text-bone">{idea.title}</h4>
        </div>
        <Markdown className="!max-w-none !text-[14px]">{idea.body}</Markdown>
      </div>
      {idea.code && <Code code={idea.code} label={idea.lang ?? 'code'} />}
    </div>
  )
}

function BuildCard({ step, n }: { step: BuildStep; n: number }) {
  return (
    <li className="rounded-2xl border border-[var(--line)] overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-6 h-6 rounded-full grid place-items-center mono text-[10px] bg-[rgb(var(--accent-rgb)/0.12)] text-system border border-[rgb(var(--accent-rgb)/0.35)]">{n}</span>
          <h4 className="text-[15px] font-medium text-bone">{step.title}</h4>
        </div>
        <Markdown className="!max-w-none !text-[13.5px]">{step.body}</Markdown>
      </div>
      <Code code={step.code} label={step.lang ?? 'code'} />
    </li>
  )
}

/** Plain code block with a language tab. Used for standalone examples. */
function Code({ code, label }: { code: string; label: string }) {
  const lines = code.split('\n').length
  return (
    <div className="code-block !rounded-none border-x-0 border-b-0">
      <div className="px-3 py-1.5 border-b border-[var(--line)] mono text-[10.5px] text-muted flex items-center justify-between">
        <span className="text-system">{label}</span>
        <span className="text-[10px]">{lines} {lines === 1 ? 'line' : 'lines'}</span>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-[12.5px] leading-[1.6]">{code}</pre>
    </div>
  )
}

/** The repository snippets: tabs per excerpt, typed in line by line. */
function RepoCode({ tech }: { tech: Tech }) {
  const [snippet, setSnippet] = useState(0)
  const s = tech.snippets[Math.min(snippet, tech.snippets.length - 1)]
  return (
    <div>
      <div className="flex gap-1 mb-2 flex-wrap">
        {tech.snippets.map((sn, i) => (
          <button key={i} className={cx('btn btn-xs', i === snippet && 'btn-system')} onClick={() => setSnippet(i)}>{sn.label}</button>
        ))}
      </div>
      <TypedCode key={s.file + snippet} code={s.code} file={s.file} />
      <p className="text-[13px] text-bone-dim mt-2 border-l-2 border-[rgb(var(--accent-rgb)/0.5)] pl-3">{s.note}</p>
    </div>
  )
}

/** Code that appears one line at a time, like it is being typed. */
function TypedCode({ code, file }: { code: string; file: string }) {
  const reduce = useReducedMotion()
  const lines = code.split('\n')
  return (
    <div className="code-block stack-spot-code">
      <div className="px-3 py-1.5 border-b border-[var(--line)] mono text-[11px] text-muted flex items-center justify-between">
        <span>{file}</span>
        <span className="text-[10px]">{lines.length} lines</span>
      </div>
      <pre className="px-4 py-3 overflow-x-auto">
        {lines.map((l, i) => (
          <motion.span
            key={i}
            className="stack-spot-line mono text-[12.5px] leading-[1.6] text-bone"
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.035, duration: 0.25 }}
          >
            {l || ' '}
          </motion.span>
        ))}
      </pre>
    </div>
  )
}
