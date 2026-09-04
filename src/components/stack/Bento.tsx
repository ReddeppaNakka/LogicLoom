import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { allTech } from '@/lib/stack'
import type { Tech } from '@/content/stack-types'
import { Signature } from './Signatures'
import { cx } from '@/components/ui'

/**
 * A bento grid: sixteen tiles of varied size, each with the technology's name
 * in display type and a living signature in the corner. Tiles tilt toward the
 * cursor and carry a light that follows it.
 */

// Tile spans, in grid cells. The first five carry the app, so they get room.
const SPAN: Record<string, string> = {
  typescript: 'md:col-span-2 md:row-span-2',
  react: 'md:col-span-2 md:row-span-2',
  vite: 'md:col-span-2',
  tailwind: 'md:col-span-2',
  'react-router': 'md:col-span-1',
  zustand: 'md:col-span-2',
  'framer-motion': 'md:col-span-1',
  'css-arch': 'md:col-span-1',
  'web-storage': 'md:col-span-1',
  lucide: 'md:col-span-1',
  three: 'md:col-span-2',
  recharts: 'md:col-span-1',
  monaco: 'md:col-span-1',
  'react-markdown': 'md:col-span-1',
  'date-fns': 'md:col-span-1',
  'gh-actions': 'md:col-span-2',
}

export default function Bento({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[150px] md:auto-rows-[160px]" style={{ gridAutoFlow: 'dense' }}>
      {allTech.map((t, i) => (
        <Tile key={t.id} tech={t} index={i} onOpen={() => onOpen(t.id)} />
      ))}
    </div>
  )
}

function Tile({ tech, index, onOpen }: { tech: Tech; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 22 })
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 22 })

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    mx.set(x)
    my.set(y)
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }
  const onLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  const big = SPAN[tech.id]?.includes('row-span-2')

  return (
    <motion.button
      ref={ref}
      layoutId={`tile-${tech.id}`}
      onMouseMove={reduce ? undefined : onMove}
      onMouseLeave={onLeave}
      onClick={onOpen}
      className={cx('stack-tile text-left p-5 flex flex-col justify-between', SPAN[tech.id])}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, perspective: 900 }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2">
        <span className="mono text-[10px] text-system">{String(tech.order).padStart(2, '0')}</span>
        <span className="eyebrow">{tech.category}</span>
      </div>
      <div className="relative z-10">
        <div className={cx('display leading-[0.95]', big ? 'text-[42px] md:text-[54px]' : 'text-[26px] md:text-[30px]')}>{tech.name}</div>
        <div className="mono text-[10.5px] text-muted mt-1.5">{tech.version}</div>
        {big && <p className="text-[13px] text-bone-dim mt-3 max-w-[80%] leading-relaxed">{tech.role}</p>}
      </div>
      <Signature id={tech.id} />
    </motion.button>
  )
}
