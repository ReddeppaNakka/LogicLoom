import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { allTech } from '@/lib/stack'

/**
 * The stack as a constellation. Each technology is a node placed in the band
 * its role belongs to, with a slow current running along the edges that
 * connect it to the things it depends on. Hovering a node lights its edges.
 */

const ROWS: string[][] = [
  ['typescript'],
  ['react'],
  ['vite', 'react-router'],
  ['tailwind', 'css-arch', 'zustand', 'web-storage'],
  ['framer-motion', 'lucide', 'react-markdown', 'monaco'],
  ['three', 'recharts', 'date-fns'],
  ['gh-actions'],
]

const EDGES: [string, string][] = [
  ['typescript', 'react'],
  ['typescript', 'vite'],
  ['react', 'react-router'],
  ['react', 'zustand'],
  ['react', 'framer-motion'],
  ['react', 'lucide'],
  ['react', 'react-markdown'],
  ['react', 'monaco'],
  ['react', 'recharts'],
  ['vite', 'tailwind'],
  ['vite', 'three'],
  ['vite', 'gh-actions'],
  ['tailwind', 'css-arch'],
  ['zustand', 'web-storage'],
  ['zustand', 'date-fns'],
]

const W = 1000
const ROW_H = 104
const TOP = 56

export default function Constellation({ onOpen }: { onOpen: (id: string) => void }) {
  const [hover, setHover] = useState<string | null>(null)
  const reduce = useReducedMotion()

  const pos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    ROWS.forEach((row, r) => {
      row.forEach((id, i) => {
        const x = (W / (row.length + 1)) * (i + 1)
        m.set(id, { x, y: TOP + r * ROW_H })
      })
    })
    return m
  }, [])

  const H = TOP + (ROWS.length - 1) * ROW_H + 60
  const lit = new Set<string>()
  if (hover) {
    lit.add(hover)
    for (const [a, b] of EDGES) if (a === hover || b === hover) lit.add(a).add(b)
  }

  return (
    <div className="relative rounded-2xl border border-[var(--line)] overflow-hidden" style={{ background: 'radial-gradient(80% 60% at 50% 0%, rgb(var(--accent-rgb) / 0.08), transparent 70%)' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Dependency constellation of the stack">
        <defs>
          <radialGradient id="stack-halo">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint band labels */}
        {ROWS.map((_, r) => (
          <line key={r} x1="40" x2={W - 40} y1={TOP + r * ROW_H} y2={TOP + r * ROW_H} stroke="rgb(var(--fg-rgb) / 0.05)" strokeWidth="1" />
        ))}

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const pa = pos.get(a)!
          const pb = pos.get(b)!
          const midY = (pa.y + pb.y) / 2
          const d = `M${pa.x} ${pa.y} C ${pa.x} ${midY}, ${pb.x} ${midY}, ${pb.x} ${pb.y}`
          const isLit = hover && lit.has(a) && lit.has(b) && (a === hover || b === hover)
          return (
            <motion.path
              key={i}
              d={d}
              className={['stack-edge', isLit ? 'lit' : hover ? 'dim' : ''].join(' ')}
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: hover ? (isLit ? 1 : 0.12) : 1 }}
              transition={{ pathLength: { duration: 1.2, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
            />
          )
        })}

        {/* Nodes */}
        {allTech.map((t, i) => {
          const p = pos.get(t.id)
          if (!p) return null
          const active = hover === t.id
          const dimmed = hover && !lit.has(t.id)
          return (
            <motion.g
              key={t.id}
              className={['stack-node', active ? 'active' : ''].join(' ')}
              onMouseEnter={() => setHover(t.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onOpen(t.id)}
              initial={reduce ? undefined : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: dimmed ? 0.3 : 1, scale: 1, y: reduce ? 0 : [0, -3, 0] }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.7, delay: 0.3 + i * 0.04, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 },
              }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle className="halo" cx={p.x} cy={p.y} r={26} fill="url(#stack-halo)" />
              <circle className="core" cx={p.x} cy={p.y} r={7} fill="var(--bg)" stroke="var(--accent)" strokeWidth="1.8" />
              <circle cx={p.x} cy={p.y} r={2.5} fill="var(--accent)" />
              <text x={p.x} y={p.y + 24} textAnchor="middle">{t.name}</text>
              <text className="ver" x={p.x} y={p.y + 37} textAnchor="middle">{t.version}</text>
            </motion.g>
          )
        })}
      </svg>
      <div className="absolute left-4 bottom-3 text-[11px] text-muted">Hover a node to trace what depends on it. Click to open.</div>
    </div>
  )
}
