import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Feather } from 'lucide-react'
import { addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth } from 'date-fns'
import { useApp } from '@/store/useApp'
import { projectPlan } from '@/lib/scheduler'
import { toKey, todayKey, isStudyDay, prettyLong, addDaysKey, WEEKDAY_SHORT, weekday } from '@/lib/dates'
import { getConcept, getGate } from '@/lib/content'
import QuestCard from '@/components/QuestCard'
import { SectionTitle, Panel, Eyebrow, Kanji, cx } from '@/components/ui'

export default function Calendar() {
  const state = useApp()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selected, setSelected] = useState(todayKey())
  const [view, setView] = useState<'month' | 'week'>('month')
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState(30)
  const today = todayKey()

  const plan = useMemo(() => projectPlan(state, addDaysKey(today, 1)), [state.conceptProgress, state.attempts, state.profile.studyDays])
  const planByDate = useMemo(() => {
    const m: Record<string, typeof plan.entries> = {}
    for (const e of plan.entries) (m[e.date] ??= []).push(e)
    return m
  }, [plan])

  const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }) })
  const questsOf = (key: string) => state.quests.filter((q) => q.date === key && q.status !== 'rescheduled')
  const selectedQuests = state.quests.filter((q) => q.date === selected)
  const selectedPlan = planByDate[selected] ?? []
  const light = state.lightDays.includes(selected)

  return (
    <div>
      <SectionTitle
        eyebrow="Calendar"
        kanji="暦"
        title="Every day the System remembers."
        right={
          <div className="flex gap-1 p-1 rounded-xl border border-[var(--line)] bg-[rgba(5,7,10,0.5)]">
            <button className={cx('btn btn-sm border-0', view === 'month' && 'btn-system')} onClick={() => setView('month')}>
              Month
            </button>
            <button className={cx('btn btn-sm border-0', view === 'week' && 'btn-system')} onClick={() => setView('week')}>
              Timetable
            </button>
          </div>
        }
      />

      {view === 'week' ? (
        <Timetable />
      ) : (
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
          <Panel className="p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <button className="btn btn-xs btn-ghost" onClick={() => setMonth((m) => addMonths(m, -1))}>
                <ChevronLeft size={14} />
              </button>
              <div className="display text-[24px]">{format(month, 'MMMM yyyy')}</div>
              <button className="btn btn-xs btn-ghost" onClick={() => setMonth((m) => addMonths(m, 1))}>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="eyebrow text-center py-1">
                  {d}
                </div>
              ))}
              {days.map((d) => {
                const key = toKey(d)
                const inMonth = isSameMonth(d, month)
                const qs = questsOf(key)
                const done = qs.filter((q) => q.status === 'done').length
                const missed = qs.filter((q) => q.status === 'missed').length
                const pending = qs.filter((q) => q.status === 'pending').length
                const planned = planByDate[key]?.length ?? 0
                const study = isStudyDay(key, state.profile.studyDays)
                const isToday = key === today
                const sel = key === selected
                const past = key < today
                const cleared = qs.length > 0 && done === qs.length
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={cx(
                      'relative aspect-square rounded-lg border text-left p-1.5 transition-all',
                      inMonth ? 'border-[var(--line-soft)]' : 'border-transparent opacity-30',
                      !study && inMonth && 'bg-[rgba(223,231,224,0.02)]',
                      sel && 'border-[rgba(77,163,255,0.7)] shadow-[0_0_16px_-4px_rgba(77,163,255,0.5)]',
                      isToday && !sel && 'border-[rgba(77,163,255,0.35)]',
                      cleared && 'bg-[rgba(95,212,162,0.08)]',
                      missed > 0 && 'bg-[rgba(255,90,60,0.08)]',
                    )}
                  >
                    <span className={cx('mono text-[11px]', isToday ? 'text-system' : study ? 'text-bone-dim' : 'text-muted')}>{format(d, 'd')}</span>
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex gap-0.5 flex-wrap">
                      {Array.from({ length: Math.min(done, 4) }).map((_, i) => (
                        <span key={'d' + i} className="w-1.5 h-1.5 rounded-full bg-jade" />
                      ))}
                      {Array.from({ length: Math.min(missed, 4) }).map((_, i) => (
                        <span key={'m' + i} className="w-1.5 h-1.5 rounded-full bg-ember" />
                      ))}
                      {Array.from({ length: Math.min(pending, 4) }).map((_, i) => (
                        <span key={'p' + i} className={cx('w-1.5 h-1.5 rounded-full', past ? 'bg-ember' : 'bg-system')} />
                      ))}
                      {qs.length === 0 && planned > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[rgba(77,163,255,0.3)]" />}
                    </div>
                    {state.lightDays.includes(key) && <Feather size={10} className="absolute top-1.5 right-1.5 text-muted" />}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-4 mt-4 text-[11px] text-muted flex-wrap">
              <span className="flex items-center gap-1.5"><i className="w-1.5 h-1.5 rounded-full bg-jade inline-block" /> done</span>
              <span className="flex items-center gap-1.5"><i className="w-1.5 h-1.5 rounded-full bg-system inline-block" /> pending</span>
              <span className="flex items-center gap-1.5"><i className="w-1.5 h-1.5 rounded-full bg-ember inline-block" /> missed</span>
              <span className="flex items-center gap-1.5"><i className="w-1.5 h-1.5 rounded-full bg-[rgba(77,163,255,0.3)] inline-block" /> forecast</span>
              <span className="flex items-center gap-1.5"><Feather size={10} /> light day</span>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel variant="system" corner className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Eyebrow system>{selected === today ? 'Today' : selected < today ? 'Past day' : 'Planned'}</Eyebrow>
                  <div className="display text-[22px] mt-0.5">{prettyLong(selected)}</div>
                  <div className="text-[12px] text-muted">{isStudyDay(selected, state.profile.studyDays) ? (light ? 'Light session' : 'Study day') : 'Rest day'}</div>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  {selected >= today && isStudyDay(selected, state.profile.studyDays) && (
                    <button className={cx('btn btn-xs', light && 'btn-system')} onClick={() => state.toggleLightDay(selected)}>
                      <Feather size={12} /> {light ? 'Light' : 'Make light'}
                    </button>
                  )}
                  {selected >= today && (
                    <button className="btn btn-xs" onClick={() => setAdding((a) => !a)}>
                      <Plus size={12} /> Add task
                    </button>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {adding && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-4 flex gap-2">
                      <input className="input" placeholder="e.g. Re-read sliding window notes" value={title} onChange={(e) => setTitle(e.target.value)} />
                      <input type="number" className="input !w-24" min={5} step={5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
                    </div>
                    <button
                      className="btn btn-xs btn-system mt-2"
                      disabled={!title.trim()}
                      onClick={() => {
                        state.addManualQuest(selected, title.trim(), minutes)
                        setTitle('')
                        setAdding(false)
                      }}
                    >
                      Add to this day
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Panel>

            {selectedQuests.length > 0 ? (
              <div className="space-y-3">
                {selectedQuests.map((q) => (
                  <QuestCard key={q.id} quest={q} compact />
                ))}
              </div>
            ) : selectedPlan.length > 0 ? (
              <Panel className="p-5">
                <Eyebrow className="mb-3">Forecast for this day</Eyebrow>
                <div className="space-y-2">
                  {selectedPlan.map((e, i) => {
                    const c = getConcept(e.conceptId)
                    return (
                      <div key={i} className="flex items-center gap-3 text-[13.5px]">
                        <span className="chip">{e.kind === 'learn' ? 'learn' : 'solve'}</span>
                        <span className="flex-1 truncate">{c?.title}</span>
                        <span className="text-[11px] text-muted">{getGate(e.gateId)?.name}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[12px] text-muted mt-3">Forecasts are built from your current pace. Actual quests are generated on the day so they can adapt to what you missed.</p>
              </Panel>
            ) : (
              <Panel className="p-6 text-center text-muted text-sm">Nothing on this day.</Panel>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Timetable() {
  const profile = useApp((s) => s.profile)
  const rows = [
    { slot: 'Warm-up · 10 min', text: 'Re-solve one problem due for review. Say the pattern out loud before typing.' },
    { slot: 'Learn · 25 to 30 min', text: 'Read one concept. Slow way, fast way, why it is faster. Mark it learned only if you can explain it.' },
    { slot: 'Solve · 40 to 45 min', text: 'Two problems from the concept. 20 minutes max per problem before reading the hint.' },
    { slot: 'Close · 10 min', text: 'Complexity drill or write a mistake-log note. Then stop, even if you feel good.' },
  ]
  const light = [
    { slot: 'Review · 12 min', text: 'One or two memory checks.' },
    { slot: 'Read · 20 min', text: 'One concept, no pressure to mark it learned.' },
    { slot: 'Solve · 15 min', text: 'One easy problem. Keep the streak alive.' },
  ]
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Panel variant="system" corner className="p-6">
        <div className="flex items-center gap-3">
          <Eyebrow system>Standard session · {profile.sessionMinutes} min</Eyebrow>
          <Kanji>日課</Kanji>
        </div>
        <div className="mt-4 space-y-3">
          {rows.map((r) => (
            <div key={r.slot} className="flex gap-4 border-b border-[var(--line-soft)] pb-3 last:border-0">
              <div className="mono text-[11.5px] text-system w-[130px] shrink-0 pt-0.5">{r.slot}</div>
              <div className="text-[13.5px] text-bone-dim">{r.text}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel className="p-6">
        <div className="flex items-center gap-3">
          <Eyebrow>Light session · 40 min</Eyebrow>
          <Feather size={13} className="text-muted" />
        </div>
        <div className="mt-4 space-y-3">
          {light.map((r) => (
            <div key={r.slot} className="flex gap-4 border-b border-[var(--line-soft)] pb-3 last:border-0">
              <div className="mono text-[11.5px] text-bone-dim w-[130px] shrink-0 pt-0.5">{r.slot}</div>
              <div className="text-[13.5px] text-bone-dim">{r.text}</div>
            </div>
          ))}
        </div>
        <div className="hairline my-5" />
        <Eyebrow className="mb-2">Your week</Eyebrow>
        <div className="grid grid-cols-7 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => {
            const on = profile.studyDays.includes(d)
            const isBossDay = d === 6
            return (
              <div key={d} className={cx('rounded-lg border p-2 text-center', on ? 'border-[rgba(77,163,255,0.35)] bg-[rgba(77,163,255,0.05)]' : 'border-[var(--line-soft)] opacity-50')}>
                <div className="eyebrow">{WEEKDAY_SHORT[d]}</div>
                <div className="text-[11px] mt-1 text-bone-dim">{on ? (isBossDay ? 'boss / mixed' : 'study') : 'rest'}</div>
              </div>
            )
          })}
        </div>
        <p className="text-[12px] text-muted mt-3">Every second Saturday becomes a timed boss fight once you clear your first gate. Change study days in Settings.</p>
        <div className="text-[11px] text-muted mt-2">Today is {WEEKDAY_SHORT[weekday(todayKey())]}.</div>
      </Panel>
    </div>
  )
}
