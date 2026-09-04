import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ExternalLink, FlaskConical, AlertTriangle, GraduationCap, FileCode2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Tech } from '@/content/stack-types'
import { allTech } from '@/lib/stack'
import Markdown from '@/components/Markdown'
import { Signature } from './Signatures'
import { cx } from '@/components/ui'

/**
 * Full-screen spotlight for one technology. Sections stagger in, the code
 * types itself line by line, and the arrows walk to the neighbouring entries.
 */
export default function Spotlight({ tech, onClose, onNav }: { tech: Tech | null; onClose: () => void; onNav: (id: string) => void }) {
  useEffect(() => {
    if (!tech) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
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

  return (
    <AnimatePresence>
      {tech && (
        <motion.div
          key="spot"
          data-spotlight
          className="fixed inset-0 z-[80] flex items-start md:items-center justify-center p-3 md:p-8 overflow-y-auto"
          style={{ background: 'rgb(var(--bg-rgb) / 0.82)', backdropFilter: 'blur(18px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            layoutId={`tile-${tech.id}`}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[980px] rounded-3xl border border-[rgb(var(--accent-rgb)/0.35)] overflow-hidden"
            style={{ background: 'linear-gradient(180deg, var(--surface-raised), var(--bg))', boxShadow: '0 60px 140px -50px rgb(0 0 0 / 0.9), 0 0 0 1px rgb(var(--accent-rgb) / 0.08) inset' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <Body key={tech.id} tech={tech} onClose={onClose} step={step} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const EASE = [0.16, 1, 0.3, 1] as const
const stagger = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.07, duration: 0.55, ease: EASE } }),
}

function Body({ tech, onClose, step }: { tech: Tech; onClose: () => void; step: (d: number) => void }) {
  const [snippet, setSnippet] = useState(0)
  const s = tech.snippets[Math.min(snippet, tech.snippets.length - 1)]
  return (
    <>
      {/* Header */}
      <div className="relative px-6 md:px-10 pt-8 pb-6 overflow-hidden" style={{ background: 'radial-gradient(70% 90% at 90% 0%, rgb(var(--accent-rgb) / 0.16), transparent 60%)' }}>
        <div className="absolute right-6 top-4 opacity-40 scale-[1.6] origin-top-right pointer-events-none">
          <Signature id={tech.id} />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="mono text-[11px] text-system">{String(tech.order).padStart(2, '0')} / {String(allTech.length).padStart(2, '0')}</span>
          <span className="chip !text-[10px] !py-0 !px-1.5">{tech.category}</span>
          <span className="mono text-[10.5px] text-muted">{tech.version}</span>
        </div>
        <motion.h2 custom={0} variants={stagger} initial="hidden" animate="show" className="display text-[44px] md:text-[64px] leading-[0.95]">
          {tech.name}
        </motion.h2>
        <motion.p custom={1} variants={stagger} initial="hidden" animate="show" className="text-[15px] text-bone-dim mt-3 max-w-2xl">
          {tech.role}
        </motion.p>
        <div className="absolute right-4 top-4 flex gap-1">
          <button className="btn btn-xs btn-ghost" onClick={() => step(-1)} aria-label="Previous"><ChevronLeft size={14} /></button>
          <button className="btn btn-xs btn-ghost" onClick={() => step(1)} aria-label="Next"><ChevronRight size={14} /></button>
          <button className="btn btn-xs" onClick={onClose} aria-label="Close"><X size={14} /></button>
        </div>
      </div>

      <div className="px-6 md:px-10 pb-8 max-h-[70vh] overflow-y-auto">
        <motion.div custom={2} variants={stagger} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-6 mb-7">
          <div>
            <div className="eyebrow mb-1.5">What it is</div>
            <p className="text-[14.5px] text-bone leading-relaxed">{tech.what}</p>
          </div>
          <div>
            <div className="eyebrow mb-1.5">Why it is here</div>
            <p className="text-[14.5px] text-bone-dim leading-relaxed">{tech.why}</p>
          </div>
        </motion.div>

        <motion.div custom={3} variants={stagger} initial="hidden" animate="show" className="mb-7">
          <div className="eyebrow eyebrow-system mb-2">How this app uses it</div>
          <Markdown className="!max-w-none">{tech.howUsedHere}</Markdown>
        </motion.div>

        <motion.div custom={4} variants={stagger} initial="hidden" animate="show" className="mb-7">
          <div className="flex items-center gap-2 mb-2">
            <FileCode2 size={13} className="text-system" />
            <span className="eyebrow eyebrow-system">Real code from this repository</span>
          </div>
          <div className="flex gap-1 mb-2 flex-wrap">
            {tech.snippets.map((sn, i) => (
              <button key={i} className={cx('btn btn-xs', i === snippet && 'btn-system')} onClick={() => setSnippet(i)}>{sn.label}</button>
            ))}
          </div>
          <TypedCode key={s.file + snippet} code={s.code} file={s.file} />
          <p className="text-[13px] text-bone-dim mt-2 border-l-2 border-[rgb(var(--accent-rgb)/0.5)] pl-3">{s.note}</p>
        </motion.div>

        <motion.div custom={5} variants={stagger} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="rounded-2xl border border-[var(--line)] p-4">
            <div className="flex items-center gap-2 mb-2"><GraduationCap size={13} className="text-system" /><span className="eyebrow">Ideas it teaches</span></div>
            <ul className="space-y-1.5 text-[13px]">{tech.teaches.map((x) => <li key={x} className="flex gap-2"><span className="text-system shrink-0">›</span><span className="text-bone-dim">{x}</span></li>)}</ul>
          </div>
          <div className="rounded-2xl border border-[var(--line)] p-4">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle size={13} className="text-ember" /><span className="eyebrow text-ember">Traps</span></div>
            <ul className="space-y-1.5 text-[13px]">{tech.gotchas.map((x) => <li key={x} className="flex gap-2"><span className="text-ember shrink-0">×</span><span className="text-bone-dim">{x}</span></li>)}</ul>
          </div>
        </motion.div>

        <motion.div custom={6} variants={stagger} initial="hidden" animate="show" className="rounded-2xl border border-[color-mix(in_srgb,var(--gold)_45%,transparent)] p-4 mb-5">
          <div className="flex items-center gap-2 mb-2"><FlaskConical size={13} className="text-gold" /><span className="eyebrow text-gold">Try this in the code</span></div>
          <ol className="space-y-1.5 text-[13.5px] list-decimal pl-4">{tech.tryThis.map((x) => <li key={x} className="text-bone-dim">{x}</li>)}</ol>
        </motion.div>

        <motion.div custom={7} variants={stagger} initial="hidden" animate="show" className="flex gap-2 flex-wrap">
          {tech.docs.map((d) => <a key={d.url} href={d.url} target="_blank" rel="noreferrer" className="btn btn-xs"><ExternalLink size={11} /> {d.label}</a>)}
        </motion.div>
      </div>
    </>
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
