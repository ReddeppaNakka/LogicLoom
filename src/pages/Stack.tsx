import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, animate } from 'framer-motion'
import { allTech, techById } from '@/lib/stack'
import Constellation from '@/components/stack/Constellation'
import Bento from '@/components/stack/Bento'
import Spotlight from '@/components/stack/Spotlight'
import Pipeline from '@/components/stack/Pipeline'
import Road from '@/components/stack/Road'
import { Jp, cx } from '@/components/ui'

type View = 'constellation' | 'bento' | 'pipeline' | 'road'

const VIEWS: { id: View; label: string; hint: string }[] = [
  { id: 'constellation', label: 'Constellation', hint: 'what depends on what' },
  { id: 'bento', label: 'Every piece', hint: 'sixteen tiles' },
  { id: 'pipeline', label: 'A page loads', hint: 'follow the packet' },
  { id: 'road', label: 'The road', hint: 'where to start' },
]

const LINES = 38230

export default function Stack() {
  const [view, setView] = useState<View>('constellation')
  const [openId, setOpenId] = useState<string | null>(null)
  const open = openId ? techById(openId) ?? null : null

  return (
    <div className="-mt-4">
      <Hero />

      {/* View switcher */}
      <div className="sticky top-14 md:top-0 z-20 -mx-5 md:-mx-10 px-5 md:px-10 py-3 mb-8 bg-[rgb(var(--bg-rgb)/0.8)] backdrop-blur-xl border-y border-[var(--line)]">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={cx('relative shrink-0 px-4 py-2 rounded-xl text-[13px] transition-colors', view === v.id ? 'text-bone' : 'text-muted hover:text-bone-dim')}
            >
              {view === v.id && (
                <motion.span layoutId="stack-view-pill" className="absolute inset-0 rounded-xl bg-[rgb(var(--accent-rgb)/0.12)] border border-[rgb(var(--accent-rgb)/0.4)]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{v.label}</span>
              <span className="relative ml-2 text-[10.5px] text-muted hidden sm:inline">{v.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
          {view === 'constellation' && <Constellation onOpen={setOpenId} />}
          {view === 'bento' && <Bento onOpen={setOpenId} />}
          {view === 'pipeline' && <Pipeline />}
          {view === 'road' && <Road onOpen={setOpenId} />}
        </motion.div>
      </AnimatePresence>

      <Spotlight tech={open} onClose={() => setOpenId(null)} onNav={setOpenId} />
    </div>
  )
}

/** Giant numerals count up, and a ticker of the stack drifts underneath. */
function Hero() {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(reduce ? allTech.length : 0)
  const [lines, setLines] = useState(reduce ? LINES : 0)

  useEffect(() => {
    if (reduce) return
    const a = animate(0, allTech.length, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setCount(Math.round(v)) })
    const b = animate(0, LINES, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setLines(Math.round(v)) })
    return () => { a.stop(); b.stop() }
  }, [reduce])

  const ticker = [...allTech, ...allTech]

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="eyebrow eyebrow-system">Under the hood</span>
        <Jp text="構造" />
      </div>
      <div className="grid md:grid-cols-[auto_1fr] gap-x-10 gap-y-4 items-end">
        <div className="flex items-end gap-6">
          <div>
            <div className="stack-hero-num">{String(count).padStart(2, '0')}</div>
            <div className="eyebrow mt-2">technologies</div>
          </div>
          <div className="pb-1">
            <div className="display text-[40px] md:text-[56px] leading-none">{lines.toLocaleString()}</div>
            <div className="eyebrow mt-2">lines of source</div>
          </div>
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="text-[15px] text-bone-dim leading-relaxed max-w-md md:justify-self-end md:text-right md:pb-2">
          The app you are reading, taken apart. Every code sample is lifted from this repository with its file path shown, and the build refuses to ship if a sample no longer matches the source.
        </motion.p>
      </div>

      <div className="stack-ticker mt-8 py-3 border-y border-[var(--line-soft)]">
        <div className="stack-ticker-track">
          {ticker.map((t, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap">
              <span className="display text-[22px] text-bone-dim">{t.name}</span>
              <span className="mono text-[10px] text-muted">{t.version}</span>
              <span className="w-1 h-1 rounded-full bg-[rgb(var(--accent-rgb)/0.6)]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
