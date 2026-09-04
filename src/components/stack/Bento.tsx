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
  typescript: 'xl:col-span-2 xl:row-span-2',
  react: 'xl:col-span-2 xl:row-span-2',
  vite: 'sm:col-span-2 xl:col-span-2',
  tailwind: 'sm:col-span-2 xl:col-span-2',
  'react-router': 'xl:col-span-1',
  zustand: 'sm:col-span-2 xl:col-span-2',
  'framer-motion': 'xl:col-span-1',
  'css-arch': 'xl:col-span-1',
  'web-storage': 'xl:col-span-1',
  lucide: 'xl:col-span-1',
  three: 'sm:col-span-2 xl:col-span-2',
  recharts: 'xl:col-span-1',
  monaco: 'xl:col-span-1',
  'react-markdown': 'xl:col-span-1',
  'date-fns': 'xl:col-span-1',
  'gh-actions': 'sm:col-span-2 xl:col-span-2',
}

export default function Bento({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 auto-rows-[172px]" style={{ gridAutoFlow: 'dense' }}>
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
      onMouseMove={reduce ? undefined : onMove}
      onMouseLeave={onLeave}
      onClick={onOpen}
      className={cx('stack-tile @container text-left p-5 flex flex-col', SPAN[tech.id])}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, perspective: 900 }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* The top band is as tall as the illustration, so the text below can never rise into it. */}
      <div className={cx('flex items-start gap-2 flex-wrap overflow-hidden shrink-0', big ? 'min-h-[96px] pr-28' : 'min-h-[62px] pr-20')}>
        <span className="mono text-[10px] text-system">{String(tech.order).padStart(2, '0')}</span>
        <span className="eyebrow">{tech.category}</span>
      </div>
      {/* Text sizes by the tile's own width (container queries), not the viewport. */}
      <div className="relative z-10 min-w-0 mt-auto">
        <div
          className={cx(
            'display leading-[0.95] break-words',
            big
              ? 'text-[34px] @sm:text-[42px] @md:text-[54px]'
              : 'text-[19px] @2xs:text-[22px] @xs:text-[26px] @sm:text-[30px]',
          )}
        >
          {tech.name}
        </div>
        <div className="mono text-[10.5px] text-muted mt-1.5">{tech.version}</div>
        {big && <p className="text-[13px] text-bone-dim mt-3 leading-relaxed line-clamp-3">{tech.role}</p>}
      </div>
      <Signature id={tech.id} corner="top" size={big ? 'lg' : 'sm'} />
    </motion.button>
  )
}
