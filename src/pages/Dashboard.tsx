import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { Feather, ArrowRight, Flame, CalendarClock, Sparkles } from 'lucide-react'
import { useApp, selectToday, selectMissed } from '@/store/useApp'
import { levelFromXp, rankTitle, rankColor } from '@/lib/xp'
import { gates, concepts, problems, getConcept, getGate } from '@/lib/content'
import { currentConcept, projectPlan, dueReviews } from '@/lib/scheduler'
import { todayKey, prettyLong, prettyDate, isStudyDay, addDaysKey } from '@/lib/dates'
import QuestCard from '@/components/QuestCard'
import { Panel, Eyebrow, Bar, RankBadge, Stat, Kanji, cx, Jp } from '@/components/ui'

const ease = [0.16, 1, 0.3, 1] as const

export default function Dashboard() {
  const state = useApp()
  const today = todayKey()
  const quests = selectToday(state)
  const missed = selectMissed(state)
  const info = levelFromXp(state.totalXp)
  const light = state.lightDays.includes(today)
  const study = isStudyDay(today, state.profile.studyDays)
  const cur = currentConcept(state)
  const curGate = cur ? getGate(cur.gateId) : undefined

  const done = quests.filter((q) => q.status === 'done')
  const minutesPlanned = quests.reduce((s, q) => s + q.minutes, 0)
  const xpToday = state.dayLogs[today]?.xp ?? 0
  const due = dueReviews(state, today).length

  const stats = useMemo(() => gateStats(state), [state.conceptProgress, state.attempts])
  const plan = useMemo(() => projectPlan(state, addDaysKey(today, 1)), [state.conceptProgress, state.attempts, state.profile.studyDays])
  const solvedCount = Object.values(state.attempts).filter((a) => a.status === 'solved').length
  const learnedCount = Object.values(state.conceptProgress).filter((c) => c.status === 'done').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
        <div className="flex items-center gap-3">
          <Eyebrow system>Status window</Eyebrow>
          <Kanji>状態</Kanji>
        </div>
        <h1 className="display text-[40px] md:text-[56px] leading-[1] mt-2">
          {greeting()}, {state.profile.name}.
        </h1>
        <p className="text-bone-dim mt-2">{prettyLong(today)} · {study ? (light ? 'Light session' : 'Study day') : 'Rest day'}</p>
      </motion.div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-5">
        {/* Profile panel */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.08 }}>
          <Panel variant="system" corner className="p-6 h-full">
            <div className="flex items-center gap-5">
              <RankBadge rank={info.rank} size={84} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <div className="display text-[38px] leading-none">Level {info.level}</div>
                  <div className="text-[13px]" style={{ color: rankColor[info.rank] }}>
                    {info.rank}-rank · {rankTitle[info.rank]}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-muted mb-1.5">
                    <span>XP {info.intoLevel} / {info.needed}</span>
                    <span>{info.totalXp} total</span>
                  </div>
                  <Bar value={info.progress} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7 pt-6 border-t border-[var(--line)]">
              <Stat label="Streak" value={<span className="flex items-center gap-2">{state.streak.current}<Flame size={18} className={state.streak.current ? 'text-ember' : 'text-muted'} /></span>} sub={`best ${state.streak.best}`} />
              <Stat label="Concepts" value={`${learnedCount}/${concepts.length}`} sub="learned" />
              <Stat label="Problems" value={`${solvedCount}/${problems.length}`} sub="solved" />
              <Stat label="XP today" value={`+${xpToday}`} sub={`${done.length}/${quests.length} quests`} />
            </div>
          </Panel>
        </motion.div>

        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.16 }}>
          <Panel className="p-5 h-full">
            <div className="flex items-center justify-between">
              <Eyebrow>Skill stats</Eyebrow>
              <Kanji>能力</Kanji>
            </div>
            <div className="h-[230px] -mx-2 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={stats.radar} outerRadius="72%">
                  <PolarGrid stroke="rgb(var(--fg-rgb)/0.12)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--fg-muted)', fontSize: 10.5 }} />
                  <Radar dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.22} strokeWidth={1.5} isAnimationActive />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-muted -mt-2">Rises as you clear problems in each area.</div>
          </Panel>
        </motion.div>
      </div>

      {/* Missed quests */}
      {missed.length > 0 && (
        <Panel variant="danger" className="p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow className="text-ember">Missed quests · {missed.length}</Eyebrow>
              <div className="text-[14px] text-bone-dim mt-1">Nothing is lost. Move them to a day you can manage.</div>
            </div>
            <button className="btn btn-sm" onClick={state.rescheduleAllMissed}>
              <CalendarClock size={13} /> Move all to next study day
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {missed.slice(0, 6).map((q) => (
              <QuestCard key={q.id} quest={q} compact />
            ))}
          </div>
          {missed.length > 6 && (
            <Link to="/calendar" className="text-[12px] text-system mt-3 inline-block">
              See all in the calendar
            </Link>
          )}
        </Panel>
      )}

      {/* Today's quest */}
      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-5">
        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <Eyebrow system>Daily quest</Eyebrow>
                <Kanji>日課</Kanji>
              </div>
              <h2 className="display text-[30px] mt-1">{study ? "Today's session" : 'Rest day'}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted hidden sm:inline">{minutesPlanned} min planned</span>
              {study && (
                <button className={cx('btn btn-sm', light && 'btn-system')} onClick={() => state.toggleLightDay(today)} title="Shrink today to a 40 minute session">
                  <Feather size={13} /> {light ? 'Light mode on' : 'Tired today'}
                </button>
              )}
            </div>
          </div>
          {quests.length === 0 ? (
            <Panel className="p-8 text-center">
              <Jp text="休息" size="md" />
              <div className="display text-2xl mt-2">The System lets you rest.</div>
              <p className="text-muted text-sm mt-2">No quests today. Reviews that fall due will still appear here.</p>
              <div className="mt-4 flex justify-center gap-2">
                <Link to="/patterns" className="btn btn-sm">
                  <Sparkles size={13} /> Browse patterns
                </Link>
                <Link to="/trainer" className="btn btn-sm">
                  Do a complexity drill
                </Link>
              </div>
            </Panel>
          ) : (
            <div className="space-y-3">
              {quests.map((q) => (
                <QuestCard key={q.id} quest={q} />
              ))}
            </div>
          )}
          {study && quests.length > 0 && done.length === quests.length && (
            <Panel variant="gold" className="p-5 mt-4 text-center">
              <div className="eyebrow text-gold">Daily quest cleared</div>
              <div className="display text-2xl mt-1">Rest, hunter. The gate will still be there tomorrow.</div>
            </Panel>
          )}
        </div>

        <div className="space-y-5">
          {/* Current gate */}
          <Panel className="p-5">
            <div className="flex items-center justify-between">
              <Eyebrow>Current gate</Eyebrow>
              <Kanji>現在</Kanji>
            </div>
            {cur && curGate ? (
              <>
                <div className="display text-[26px] mt-2 leading-tight">{curGate.codename}</div>
                <div className="text-[13px] text-bone-dim">{curGate.name} · {curGate.rank}-rank</div>
                <div className="mt-4 text-[13px]">
                  <span className="text-muted">Next concept:</span> <Link to={`/learn/${cur.id}`} className="text-system hover:underline">{cur.title}</Link>
                </div>
                <Bar value={stats.byGate[curGate.id]?.progress ?? 0} className="mt-3" />
                <div className="flex justify-between text-[11px] text-muted mt-1.5">
                  <span>{Math.round((stats.byGate[curGate.id]?.progress ?? 0) * 100)}% cleared</span>
                  {plan.gateEta[curGate.id] && <span>ETA {prettyDate(plan.gateEta[curGate.id])}</span>}
                </div>
                <Link to={`/gates/${curGate.id}`} className="btn btn-sm mt-4">
                  Enter gate <ArrowRight size={13} />
                </Link>
              </>
            ) : (
              <div className="display text-2xl mt-2">All gates cleared.</div>
            )}
          </Panel>

          {/* Forecast */}
          <Panel className="p-5">
            <Eyebrow>Forecast at your pace</Eyebrow>
            <div className="mt-3 space-y-2.5">
              {gates.slice(0, 13).map((g) => {
                const cleared = (stats.byGate[g.id]?.progress ?? 0) >= 0.999
                const eta = plan.gateEta[g.id]
                return (
                  <div key={g.id} className="flex items-center gap-3 text-[12.5px]">
                    <span className={cx('w-1.5 h-1.5 rounded-full shrink-0', cleared ? 'bg-jade' : g.id === curGate?.id ? 'bg-system glow-pulse' : 'bg-[rgb(var(--fg-rgb)/0.2)]')} />
                    <span className={cx('flex-1 truncate', cleared ? 'text-muted line-through' : 'text-bone-dim')}>{g.name}</span>
                    <span className="text-muted mono text-[11px]">{cleared ? 'cleared' : eta ? prettyDate(eta) : '—'}</span>
                  </div>
                )
              })}
            </div>
            {plan.finishDate && (
              <div className="mt-4 pt-4 border-t border-[var(--line)] text-[12.5px] text-bone-dim">
                Roadmap complete around <span className="text-bone">{prettyLong(plan.finishDate)}</span>. Miss days and this shifts. Do more and it comes closer.
              </div>
            )}
          </Panel>

          {due > 0 && (
            <Panel className="p-4 text-[13px] text-bone-dim">
              <span className="text-system">{due}</span> problem{due > 1 ? 's' : ''} due for memory review. They are included in your quests.
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Still awake'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 22) return 'Good evening'
  return 'Late night'
}

export function gateStats(state: ReturnType<typeof useApp.getState>) {
  const byGate: Record<string, { progress: number; solved: number; total: number; learned: number; concepts: number }> = {}
  for (const g of gates) {
    const cs = g.conceptIds.map(getConcept).filter(Boolean)
    const probs = problems.filter((p) => p.gateId === g.id)
    const solved = probs.filter((p) => state.attempts[p.id]?.status === 'solved').length
    const learned = cs.filter((c) => state.conceptProgress[c!.id]?.status === 'done').length
    const conceptPart = cs.length ? learned / cs.length : 0
    const probPart = probs.length ? solved / probs.length : 0
    byGate[g.id] = { progress: conceptPart * 0.5 + probPart * 0.5, solved, total: probs.length, learned, concepts: cs.length }
  }
  const radarGates = ['arrays-strings', 'searching-sorting', 'recursion-backtracking', 'linked-lists', 'stacks-queues', 'hashing', 'trees', 'heaps', 'graphs', 'dynamic-programming', 'greedy-bits-tries']
  const radar = radarGates.map((id) => ({ name: shortName(id), value: Math.round((byGate[id]?.progress ?? 0) * 100) }))
  return { byGate, radar }
}

const shortName = (id: string) =>
  ({
    'arrays-strings': 'Arrays',
    'searching-sorting': 'Search',
    'recursion-backtracking': 'Recursion',
    'linked-lists': 'Lists',
    'stacks-queues': 'Stacks',
    hashing: 'Hashing',
    trees: 'Trees',
    heaps: 'Heaps',
    graphs: 'Graphs',
    'dynamic-programming': 'DP',
    'greedy-bits-tries': 'Greedy',
  })[id] ?? id
