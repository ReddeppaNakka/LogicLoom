import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { OPEN_A_PAGE } from '@/content/stack-overview'
import { cx } from '@/components/ui'

/**
 * A packet races through the seven stops between a URL and pixels. Each stop
 * lights as the packet arrives and its explanation slides in. Autoplays, and
 * can be paused or stepped.
 */
const STEP_MS = 3600

export default function Pipeline() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(!reduce)
  const n = OPEN_A_PAGE.length

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setI((v) => (v + 1) % n), STEP_MS)
    return () => clearTimeout(t)
  }, [i, playing, n])

  const step = OPEN_A_PAGE[i]
  const pct = (i / (n - 1)) * 100

  return (
    <div className="rounded-3xl border border-[var(--line)] overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--surface-1), transparent)' }}>
      {/* Track */}
      <div className="px-6 md:px-10 pt-10 pb-6">
        <div className="relative">
          <div className="stack-pipe-track">
            <motion.div className="stack-pipe-fill" animate={{ width: `${pct}%` }} transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }} />
            <motion.div className="stack-packet" animate={{ left: `${pct}%` }} transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }} />
          </div>
          <div className="absolute inset-x-0 top-1/2 flex justify-between -translate-y-1/2">
            {OPEN_A_PAGE.map((s, k) => (
              <button
                key={s.title}
                onClick={() => { setI(k); setPlaying(false) }}
                aria-label={`Step ${k + 1}: ${s.title}`}
                className={cx('stack-stop group relative w-8 h-8 -mx-4 grid place-items-center', k <= i && 'reached', k === i && 'current')}
              >
                <span className="dot w-3.5 h-3.5 rounded-full border-2 border-[rgb(var(--fg-rgb)/0.3)] bg-[var(--bg)] transition-all" />
                <span className={cx('absolute top-full mt-1 mono text-[10px] whitespace-nowrap transition-colors', k === i ? 'text-system' : 'text-muted')}>{String(k + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="px-6 md:px-10 pb-8 pt-4 min-h-[230px]">
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="stack-hero-num !text-[64px] md:!text-[88px]">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <h3 className="display text-[28px] md:text-[36px] leading-tight">{step.title}</h3>
                <p className="text-[15px] text-bone-dim mt-3 leading-relaxed max-w-3xl">{step.detail}</p>
                <div className="flex gap-1.5 mt-4 flex-wrap">
                  {step.files.map((f) => (
                    <span key={f} className="mono text-[11px] text-system px-2.5 py-1 rounded-lg border border-[rgb(var(--accent-rgb)/0.3)] bg-[rgb(var(--accent-rgb)/0.06)]">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
      </div>

      {/* Controls */}
      <div className="px-6 md:px-10 py-3 border-t border-[var(--line)] flex items-center gap-2">
        <button className="btn btn-xs" onClick={() => setPlaying((p) => !p)}>{playing ? <Pause size={12} /> : <Play size={12} />} {playing ? 'Pause' : 'Play'}</button>
        <button className="btn btn-xs btn-ghost" onClick={() => { setI(0); setPlaying(true) }}><RotateCcw size={12} /> Restart</button>
        <span className="text-[11px] text-muted ml-auto">Click any stop to jump there.</span>
      </div>
    </div>
  )
}
