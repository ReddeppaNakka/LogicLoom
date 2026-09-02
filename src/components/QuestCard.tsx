import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Swords, RotateCcw, Gauge, Skull, Feather, Check, CalendarClock, Trash2, ExternalLink } from 'lucide-react'
import type { Quest } from '@/store/types'
import { useApp } from '@/store/useApp'
import { getProblem, getConcept } from '@/lib/content'
import { addDaysKey, nextStudyDay, prettyDate, todayKey, isStudyDay } from '@/lib/dates'
import { cx } from './ui'

const ICON = { learn: BookOpen, solve: Swords, review: RotateCcw, quiz: Gauge, boss: Skull, light: Feather, free: Feather }
const KIND_LABEL = { learn: 'Learn', solve: 'Solve', review: 'Review', quiz: 'Drill', boss: 'Boss fight', light: 'Light', free: 'Custom' }

export default function QuestCard({ quest, compact }: { quest: Quest; compact?: boolean }) {
  const complete = useApp((s) => s.completeQuest)
  const reschedule = useApp((s) => s.rescheduleQuest)
  const dismiss = useApp((s) => s.dismissQuest)
  const studyDays = useApp((s) => s.profile.studyDays)
  const [picking, setPicking] = useState(false)
  const Icon = ICON[quest.kind]
  const done = quest.status === 'done'
  const missed = quest.status === 'missed'
  const moved = quest.status === 'rescheduled'

  const href = (() => {
    if (quest.kind === 'learn' && quest.refId) return `/learn/${quest.refId}`
    if ((quest.kind === 'solve' || quest.kind === 'review') && quest.refId) {
      const p = getProblem(quest.refId)
      return p ? `/learn/${p.conceptIds[0]}#p-${p.id}` : undefined
    }
    if (quest.kind === 'quiz') return '/trainer'
    if (quest.kind === 'boss') return `/boss/${quest.id}`
    return undefined
  })()

  const external = (quest.kind === 'solve' || quest.kind === 'review') && quest.refId ? getProblem(quest.refId)?.url : undefined
  const gate = quest.kind === 'learn' && quest.refId ? getConcept(quest.refId)?.gateId : undefined
  void gate

  const today = todayKey()
  const options = [
    { label: 'Tomorrow', date: addDaysKey(today, 1) },
    { label: 'Next study day', date: nextStudyDay(addDaysKey(today, 1), studyDays) },
    { label: 'In 3 days', date: addDaysKey(today, 3) },
    { label: 'Next week', date: addDaysKey(today, 7) },
  ]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cx(
        'panel px-4 py-3.5 transition-all',
        quest.kind === 'boss' && !done && 'panel-danger',
        done && 'opacity-55',
        missed && 'border-[rgb(var(--warn-rgb)/0.4)]',
        moved && 'opacity-40',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cx(
            'w-9 h-9 rounded-lg grid place-items-center shrink-0 border',
            done ? 'border-[rgb(var(--good-rgb)/0.4)] text-jade bg-[rgb(var(--good-rgb)/0.08)]' : quest.kind === 'boss' ? 'border-[rgb(var(--danger-rgb)/0.5)] text-ember bg-[rgb(var(--danger-rgb)/0.08)]' : 'border-[rgb(var(--accent-rgb)/0.35)] text-system bg-[rgb(var(--accent-rgb)/0.08)]',
          )}
        >
          {done ? <Check size={16} /> : <Icon size={16} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="eyebrow">{KIND_LABEL[quest.kind]}</span>
            <span className="text-[11px] text-muted">· {quest.minutes} min</span>
            <span className="text-[11px] text-system">· +{quest.xp} XP</span>
            {missed && <span className="chip chip-hard">missed</span>}
            {moved && <span className="chip">moved to {prettyDate(quest.rescheduledTo!)}</span>}
            {quest.rescheduledFrom && !moved && <span className="chip">from {prettyDate(quest.rescheduledFrom)}</span>}
          </div>
          <div className={cx('text-[14.5px] font-medium mt-0.5', done && 'line-through decoration-[rgb(var(--fg-rgb)/0.4)]')}>
            {href ? (
              <Link to={href} className="hover:text-system transition-colors">
                {quest.title}
              </Link>
            ) : (
              quest.title
            )}
          </div>
          {quest.subtitle && !compact && <div className="text-[12px] text-muted mt-0.5">{quest.subtitle}</div>}

          {!done && !moved && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {external && (
                <a href={external} target="_blank" rel="noreferrer" className="btn btn-xs">
                  <ExternalLink size={12} /> Open on LeetCode
                </a>
              )}
              {href && (
                <Link to={href} className="btn btn-xs btn-system">
                  {quest.kind === 'boss' ? 'Enter arena' : 'Open'}
                </Link>
              )}
              {quest.kind !== 'boss' && (
                <button className="btn btn-xs" onClick={() => complete(quest.id)}>
                  <Check size={12} /> Mark done
                </button>
              )}
              <button className="btn btn-xs btn-ghost" onClick={() => setPicking((p) => !p)}>
                <CalendarClock size={12} /> Reschedule
              </button>
              {(missed || quest.origin !== 'auto') && (
                <button className="btn btn-xs btn-ghost text-muted" onClick={() => dismiss(quest.id)} title="Remove">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )}

          {picking && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 flex items-center gap-2 flex-wrap">
              {options.map((o) => (
                <button key={o.label} className="btn btn-xs" onClick={() => { reschedule(quest.id, o.date); setPicking(false) }}>
                  {o.label} <span className="text-muted">{prettyDate(o.date)}</span>
                  {!isStudyDay(o.date, studyDays) && <span className="text-[10px] text-ember">rest day</span>}
                </button>
              ))}
              <input
                type="date"
                min={today}
                className="input !w-auto !py-1 !px-2 text-[12px]"
                onChange={(e) => {
                  if (e.target.value) {
                    reschedule(quest.id, e.target.value)
                    setPicking(false)
                  }
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
