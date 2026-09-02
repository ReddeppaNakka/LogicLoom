import { useEffect, useRef, useState } from 'react'
import { cx } from './ui'

export interface TocItem {
  id: string
  label: string
}

/**
 * Sticky section list for long concept pages, with scroll-spy.
 *
 * Concept pages now run thirteen sections, which is far past what a reader can
 * hold in their head. This shows where they are and lets them jump.
 */
/** Tracks which section is currently in view. */
function useActiveSection(items: TocItem[]) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el))
    if (!targets.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 },
    )
    targets.forEach((t) => obs.observe(t))
    return () => obs.disconnect()
  }, [items])
  return active
}

const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items)

  return (
    <nav className="hidden xl:block sticky top-10 self-start w-[212px] shrink-0">
      <div className="eyebrow mb-3">On this page</div>
      <ul className="space-y-0.5 border-l border-[var(--line)]">
        {items.map((i, n) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              onClick={(e) => {
                e.preventDefault()
                jumpTo(i.id)
              }}
              className={cx(
                'flex items-baseline gap-2 py-1.5 pl-3 -ml-px border-l text-[12.5px] transition-all',
                active === i.id
                  ? 'border-l-[var(--accent)] text-bone'
                  : 'border-l-transparent text-muted hover:text-bone-dim',
              )}
            >
              <span className="mono text-[10px] opacity-60">{String(n + 1).padStart(2, '0')}</span>
              <span>{i.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Compact horizontal jumper for screens too narrow for the sidebar.
 * Sticks under the top bar so the reader can move between sections at any depth.
 */
export function MobileToc({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items)
  const stripRef = useRef<HTMLDivElement>(null)

  // Keep the current section's chip in view as the reader scrolls the page.
  useEffect(() => {
    const strip = stripRef.current
    if (!strip || !active) return
    const chip = strip.querySelector<HTMLElement>(`[data-section="${active}"]`)
    if (!chip) return
    const target = chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2
    strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [active])

  return (
    <div className="xl:hidden sticky top-14 md:top-0 z-20 -mx-5 md:-mx-10 px-5 md:px-10 py-2 mb-8 bg-[rgb(var(--bg-rgb)/0.85)] backdrop-blur-lg border-b border-[var(--line)]">
      <div ref={stripRef} className="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        {items.map((i, n) => (
          <button
            key={i.id}
            data-section={i.id}
            onClick={() => jumpTo(i.id)}
            className={cx(
              'shrink-0 px-2.5 py-1 rounded-lg text-[11.5px] whitespace-nowrap transition-colors border',
              active === i.id
                ? 'border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.1)] text-bone'
                : 'border-transparent text-muted hover:text-bone-dim',
            )}
          >
            <span className="mono text-[9.5px] opacity-60 mr-1.5">{String(n + 1).padStart(2, '0')}</span>
            {i.label}
          </button>
        ))}
      </div>
    </div>
  )
}
