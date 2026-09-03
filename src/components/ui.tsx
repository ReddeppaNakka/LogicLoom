import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from 'react'
import type { Rank, Difficulty } from '@/content/types'
import { rankColor, rankTitle } from '@/lib/xp'
import { glossOf } from '@/lib/kanji'
import { useApp } from '@/store/useApp'

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')

/**
 * Props for a decorative Japanese label: the glyph plus a tooltip giving its
 * reading and English meaning. Returns nothing to render when the reader has
 * turned the decoration off.
 *
 *   const jp = useJp()
 *   <div className="jp" {...jp('覚醒')} />
 */
export function useJp() {
  const show = useApp((s) => s.appearance.japaneseLabels)
  return (text: string) => (show ? { title: glossOf(text), children: text } : { children: null })
}

export function Panel({ className, variant, corner, children, ...rest }: HTMLAttributes<HTMLDivElement> & { variant?: 'system' | 'danger' | 'gold'; corner?: boolean }) {
  return (
    <div className={cx('panel', variant && `panel-${variant}`, corner && 'corner', className)} {...rest}>
      {children}
    </div>
  )
}

export function Eyebrow({ children, system, className }: { children: ReactNode; system?: boolean; className?: string }) {
  return <div className={cx('eyebrow', system && 'eyebrow-system', className)}>{children}</div>
}

/**
 * A Japanese decorative label. Hovering shows the reading and the English
 * meaning; when the reader turns on English labels in Appearance it renders
 * the English word instead.
 */
export function Kanji({ children, className }: { children: ReactNode; className?: string }) {
  const show = useApp((s) => s.appearance.japaneseLabels)
  if (!show) return null
  const raw = typeof children === 'string' ? children : ''
  return (
    <span className={cx('jp text-[11px]', className)} title={raw ? glossOf(raw) : undefined}>
      {children}
    </span>
  )
}

export function Chip({ children, tone, className }: { children: ReactNode; tone?: Difficulty | 'system'; className?: string }) {
  return <span className={cx('chip', tone && `chip-${tone}`, className)}>{children}</span>
}

export function Bar({ value, tone, className }: { value: number; tone?: 'gold' | 'ember' | 'jade'; className?: string }) {
  return (
    <div className={cx('bar', tone && `bar-${tone}`, className)}>
      <span style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
    </div>
  )
}

export function Button({ className, variant, size, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'system' | 'danger' | 'ghost'; size?: 'sm' | 'xs' }) {
  return <button className={cx('btn', variant && `btn-${variant}`, size && `btn-${size}`, className)} {...rest} />
}

export function RankBadge({ rank, size = 44, className }: { rank: Rank; size?: number; className?: string }) {
  const color = rankColor[rank]
  return (
    <div
      className={cx('relative grid place-items-center shrink-0', className)}
      style={{ width: size, height: size }}
      title={`${rank}-rank · ${rankTitle[rank]}`}
    >
      <svg viewBox="0 0 48 48" width={size} height={size} className="absolute inset-0">
        <polygon points="24,3 43,14 43,34 24,45 5,34 5,14" fill="rgb(var(--bg-rgb)/0.7)" stroke={color} strokeWidth="1.2" />
        <polygon points="24,8 39,17 39,31 24,40 9,31 9,17" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="0.8" />
      </svg>
      <span className="display relative" style={{ color, fontSize: size * 0.48, textShadow: `0 0 16px ${color}` }}>
        {rank}
      </span>
    </div>
  )
}

export function SectionTitle({ eyebrow, title, right, kanji }: { eyebrow?: string; title: ReactNode; right?: ReactNode; kanji?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <div className="flex items-center gap-3">
          {eyebrow && <Eyebrow system>{eyebrow}</Eyebrow>}
          {kanji && <Kanji>{kanji}</Kanji>}
        </div>
        <h2 className="display text-[30px] md:text-[36px] mt-1">{title}</h2>
      </div>
      {right}
    </div>
  )
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  const jp = useJp()
  return (
    <div className="text-center py-14 px-6">
      <div className="jp text-[12px] mb-3" {...jp('静寂')} />
      <div className="display text-2xl">{title}</div>
      {body && <p className="text-muted text-sm mt-2 max-w-md mx-auto">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: string }) {
  return (
    <div className="min-w-0">
      <Eyebrow>{label}</Eyebrow>
      <div className="display text-[28px] leading-none mt-1.5" style={tone ? { color: tone } : undefined}>
        {value}
      </div>
      {sub && <div className="text-[12px] text-muted mt-1 truncate">{sub}</div>}
    </div>
  )
}

export const difficultyLabel: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
