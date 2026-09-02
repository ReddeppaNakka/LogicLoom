import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Check, ChevronRight } from 'lucide-react'
import { useApp } from '@/store/useApp'
import { gates } from '@/lib/content'
import { currentConcept, projectPlan } from '@/lib/scheduler'
import { addDaysKey, prettyDate, todayKey } from '@/lib/dates'
import { rankColor } from '@/lib/xp'
import { gateStats } from './Dashboard'
import { SectionTitle, Panel, Bar, cx } from '@/components/ui'

const ease = [0.16, 1, 0.3, 1] as const

export default function Gates() {
  const state = useApp()
  const stats = useMemo(() => gateStats(state), [state.conceptProgress, state.attempts])
  const cur = currentConcept(state)
  const curGateIdx = cur ? gates.findIndex((g) => g.id === cur.gateId) : gates.length
  const plan = useMemo(() => projectPlan(state, addDaysKey(todayKey(), 1)), [state.conceptProgress, state.attempts, state.profile.studyDays])

  return (
    <div>
      <SectionTitle eyebrow="Dungeon map" kanji="門" title="Thirteen gates stand between you and the throne." />
      <p className="text-bone-dim max-w-2xl -mt-2 mb-8">Gates open in order. Each one is a topic; inside are concepts to learn and problems to clear. You can always look ahead, but the daily quest follows this path.</p>

      <div className="relative">
        <div className="absolute left-[27px] top-6 bottom-6 w-px bg-[linear-gradient(180deg,rgba(77,163,255,0.5),rgba(223,231,224,0.08))] hidden sm:block" />
        <div className="space-y-4">
          {gates.map((g, i) => {
            const s = stats.byGate[g.id]
            const cleared = s.progress >= 0.999
            const active = i === curGateIdx
            const locked = i > curGateIdx
            return (
              <motion.div key={g.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease, delay: i * 0.04 }}>
                <Link to={`/gates/${g.id}`} className="block group">
                  <Panel variant={active ? 'system' : undefined} corner={active} className={cx('sm:ml-14 p-5 transition-all group-hover:border-[rgba(223,231,224,0.28)]', locked && 'opacity-60')}>
                    <div className="hidden sm:grid absolute -left-[46px] top-1/2 -translate-y-1/2 w-9 h-9 place-items-center rounded-full border bg-ink" style={{ borderColor: cleared ? '#5fd4a2' : active ? '#4da3ff' : 'rgba(223,231,224,0.2)', boxShadow: active ? '0 0 18px rgba(77,163,255,0.5)' : undefined }}>
                      {cleared ? <Check size={14} className="text-jade" /> : locked ? <Lock size={12} className="text-muted" /> : <span className="mono text-[11px] text-system">{String(g.order).padStart(2, '0')}</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="display text-[30px] w-10 text-center shrink-0" style={{ color: rankColor[g.rank], textShadow: `0 0 18px ${rankColor[g.rank]}66` }}>
                        {g.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="eyebrow">Gate {String(g.order).padStart(2, '0')}</span>
                          {active && <span className="chip chip-system">current</span>}
                          {cleared && <span className="chip chip-easy">cleared</span>}
                          {locked && <span className="chip">locked</span>}
                        </div>
                        <div className="display text-[26px] leading-tight mt-0.5">{g.codename}</div>
                        <div className="text-[13px] text-bone-dim">{g.name}</div>
                        <p className="text-[13px] text-muted mt-2 hidden md:block">{g.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Bar value={s.progress} tone={cleared ? 'jade' : undefined} className="flex-1 max-w-sm" />
                          <span className="text-[11px] text-muted mono">
                            {s.learned}/{s.concepts} concepts · {s.solved}/{s.total} problems
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        {!cleared && plan.gateEta[g.id] && (
                          <div className="text-[11px] text-muted">
                            ETA <span className="text-bone-dim">{prettyDate(plan.gateEta[g.id])}</span>
                          </div>
                        )}
                        <ChevronRight size={18} className="text-muted group-hover:text-bone mt-2 ml-auto transition-colors" />
                      </div>
                    </div>
                  </Panel>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
