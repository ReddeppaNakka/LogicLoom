import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Map, Sparkles, CalendarDays, Gauge, ListChecks, NotebookPen, Settings, Code2, Menu, X, Flame, Minimize2, Palette, Layers } from 'lucide-react'
import { useApp } from '@/store/useApp'
import { levelFromXp, rankTitle } from '@/lib/xp'
import { MotionConfig } from 'framer-motion'
import AppBackground from './AppBackground'
import SystemMessages from './SystemMessages'
import { applyAppearance } from '@/lib/appearance'
import { glossOf } from '@/lib/kanji'
import { Bar, RankBadge, cx, Jp } from './ui'

/**
 * Pages where the eye must stay still: long-form reading, timed practice and
 * code. These drop the particle field and the drifting aurora entirely.
 */
export const isCalmRoute = (pathname: string) =>
  pathname.startsWith('/learn/') ||
  pathname.startsWith('/boss/') ||
  pathname === '/trainer' ||
  pathname === '/scratchpad' ||
  (pathname.startsWith('/patterns/') && pathname.length > '/patterns/'.length)

const motionSetting = { full: false, calm: false, still: true } as const

const NAV = [
  { to: '/', label: 'Status', icon: LayoutDashboard, jp: '状態' },
  { to: '/gates', label: 'Gates', icon: Map, jp: '門' },
  { to: '/patterns', label: 'Patterns', icon: Sparkles, jp: '型' },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays, jp: '暦' },
  { to: '/trainer', label: 'Trainer', icon: Gauge, jp: '鍛' },
  { to: '/problems', label: 'Problems', icon: ListChecks, jp: '題' },
  { to: '/log', label: 'Mistake log', icon: NotebookPen, jp: '記' },
  { to: '/scratchpad', label: 'Scratchpad', icon: Code2, jp: '書' },
  { to: '/stack', label: 'Under the hood', icon: Layers, jp: '構造' },
  { to: '/appearance', label: 'Appearance', icon: Palette, jp: '彩' },
  { to: '/settings', label: 'Settings', icon: Settings, jp: '設' },
]

export default function Shell() {
  const profile = useApp((s) => s.profile)
  const totalXp = useApp((s) => s.totalXp)
  const streak = useApp((s) => s.streak)
  const ensureToday = useApp((s) => s.ensureToday)
  const focusMode = useApp((s) => s.focusMode)
  const appearance = useApp((s) => s.appearance)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const info = levelFromXp(totalXp)
  const calm = isCalmRoute(loc.pathname)
  const hasOwnFocusToggle = loc.pathname.startsWith('/learn/') || loc.pathname.startsWith('/patterns/')

  // Reading pages get their own background unless the user asked for one look.
  const backgroundId = calm && !appearance.sameBackgroundEverywhere ? appearance.readingBackground : appearance.background
  const effectiveMotion = appearance.motion === 'full' && calm && !appearance.sameBackgroundEverywhere ? 'calm' : appearance.motion

  useEffect(() => {
    applyAppearance(appearance)
  }, [appearance])

  useEffect(() => {
    ensureToday()
    const id = setInterval(ensureToday, 60_000)
    return () => clearInterval(id)
  }, [ensureToday])

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0 })
  }, [loc.pathname])

  return (
    <MotionConfig reducedMotion={motionSetting[appearance.motion] ? 'always' : 'user'}>
    <div
      className={cx(
        'min-h-full',
        appearance.grain && 'grain',
        appearance.motion === 'still' && 'motion-still',
        !appearance.readingSheet && 'no-sheet',
        calm && focusMode && 'focus-mode',
      )}
    >
      <AppBackground id={backgroundId} motion={effectiveMotion} />

      {/* Sidebar */}
      <aside
        className={cx(
          'fixed z-40 top-0 left-0 h-full w-[var(--nav-w)] border-r border-[var(--line)] bg-[rgb(var(--bg-rgb)/0.72)] backdrop-blur-xl flex flex-col transition-transform duration-500',
          calm && focusMode ? '-translate-x-full' : open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 grid place-items-center rounded-lg border border-[rgb(var(--accent-rgb)/0.45)] bg-[rgb(var(--accent-rgb)/0.08)] text-system text-glow font-jp text-lg" title={glossOf('影')}>
              影
            </div>
            <div>
              <div className="display text-[20px] leading-none">The System</div>
              <div className="eyebrow mt-1">DSA ascension</div>
            </div>
          </div>
        </div>

        <NavLink to="/" className="mx-4 panel panel-system px-3 py-3 flex items-center gap-3 hover:brightness-110 transition">
          <RankBadge rank={info.rank} size={40} />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium truncate">{profile.name}</div>
            <div className="text-[11px] text-muted truncate">
              Lv {info.level} · {rankTitle[info.rank]}
            </div>
            <Bar value={info.progress} className="mt-1.5" />
          </div>
        </NavLink>

        <nav className="mt-5 px-3 flex-1 overflow-y-auto no-scrollbar">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cx(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] transition-all',
                  isActive ? 'bg-[rgb(var(--accent-rgb)/0.1)] text-bone' : 'text-bone-dim hover:text-bone hover:bg-[rgb(var(--fg-rgb)/0.04)]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <n.icon size={16} className={cx('shrink-0', isActive ? 'text-system' : 'text-muted group-hover:text-bone-dim')} />
                  <span className="flex-1">{n.label}</span>
                  <Jp text={n.jp} className="shrink-0 opacity-70" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-[var(--line)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-bone-dim">
            <Flame size={14} className={streak.current > 0 ? 'text-ember' : 'text-muted'} />
            <span>{streak.current} day streak</span>
          </div>
          <div className="text-[11px] text-muted">best {streak.best}</div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}

      {/* Top bar for mobile */}
      <header className={cx('md:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between px-4 border-b border-[var(--line)] bg-[rgb(var(--bg-rgb)/0.8)] backdrop-blur-xl', calm && focusMode && 'hidden')}>
        <div className="flex items-center gap-2">
          <span className="font-jp text-system" title={glossOf('影')}>影</span>
          <span className="display text-lg">The System</span>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="p-2 text-bone-dim">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main className={cx('relative z-10 pt-14 md:pt-0 min-h-screen', !(calm && focusMode) && 'md:pl-[var(--nav-w)]')}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-10 py-8 md:py-12">
          <Outlet />
        </div>
      </main>

      {/* Fallback exit for calm pages that carry no toggle of their own. */}
      {calm && focusMode && !hasOwnFocusToggle && (
        <button
          onClick={() => useApp.getState().toggleFocusMode()}
          className="fixed top-4 left-4 z-50 btn btn-xs btn-ghost text-muted hover:text-bone"
          title="Leave focus mode"
        >
          <Minimize2 size={13} /> Exit focus
        </button>
      )}

      <SystemMessages />
    </div>
    </MotionConfig>
  )
}
