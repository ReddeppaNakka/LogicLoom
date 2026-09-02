import { concepts, gates, getConcept, problems as allProblems } from '@/lib/content'
import type { Concept } from '@/content/types'
import type { PersistedState, Quest, QuestKind } from '@/store/types'
import { addDaysKey, daysBetween, isStudyDay, weekday } from '@/lib/dates'
import { XP } from '@/lib/xp'

export const REVIEW_INTERVALS = [3, 7, 21] // days for stages 1..3

const uid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2))

const mk = (date: string, kind: QuestKind, partial: Partial<Quest> & { title: string; minutes: number; xp: number }): Quest => ({
  id: uid(),
  date,
  kind,
  status: 'pending',
  origin: 'auto',
  ...partial,
})

/** First concept in roadmap order that is not done. */
export const currentConcept = (state: PersistedState): Concept | undefined =>
  concepts.find((c) => state.conceptProgress[c.id]?.status !== 'done')

export const isConceptDone = (state: PersistedState, id: string) => state.conceptProgress[id]?.status === 'done'
export const isSolved = (state: PersistedState, id: string) => state.attempts[id]?.status === 'solved'

/** Problems whose spaced-repetition review is due on or before `date`. */
export const dueReviews = (state: PersistedState, date: string) =>
  Object.values(state.attempts)
    .filter((a) => a.nextReviewAt && a.nextReviewAt <= date && a.reviewStage < 4)
    .sort((a, b) => (a.nextReviewAt! < b.nextReviewAt! ? -1 : 1))

/** Unsolved problems from a concept, easy first. */
const unsolvedOf = (state: PersistedState, c: Concept) => {
  const order = { easy: 0, medium: 1, hard: 2 }
  return c.problems.filter((p) => !isSolved(state, p.id)).sort((a, b) => order[a.difficulty] - order[b.difficulty])
}

/** Gates whose concepts are all done. */
export const clearedGates = (state: PersistedState) => gates.filter((g) => g.conceptIds.every((id) => isConceptDone(state, id)))

const isBossDay = (state: PersistedState, date: string) => {
  if (weekday(date) !== 6) return false
  const weeks = Math.floor(daysBetween(state.profile.startDate, date) / 7)
  return weeks >= 1 && weeks % 2 === 0 && clearedGates(state).length >= 1
}

/**
 * Build the auto quests for a date, taking into account quests that already exist for that date
 * (rescheduled ones). Returns only the NEW quests to append.
 */
export const buildQuestsForDate = (state: PersistedState, date: string): Quest[] => {
  const existing = state.quests.filter((q) => q.date === date)
  const alreadyAuto = existing.some((q) => q.origin === 'auto')
  if (alreadyAuto) return []

  const study = isStudyDay(date, state.profile.studyDays)
  if (!study && existing.length === 0) return []

  const light = state.lightDays.includes(date)
  const budget = light ? 40 : state.profile.sessionMinutes
  let used = existing.filter((q) => q.status !== 'rescheduled').reduce((s, q) => s + q.minutes, 0)
  const out: Quest[] = []
  const referenced = new Set(existing.flatMap((q) => (q.refId ? q.refId.split(',') : [])))

  const push = (q: Quest) => {
    if (used + q.minutes > budget + 10) return false
    out.push(q)
    used += q.minutes
    if (q.refId) q.refId.split(',').forEach((r) => referenced.add(r))
    return true
  }

  // 1. Reviews due (spaced repetition) - short, first while the mind is fresh.
  const due = dueReviews(state, date).filter((a) => !referenced.has(a.problemId))
  for (const a of due.slice(0, light ? 2 : 3)) {
    const p = allProblems.find((x) => x.id === a.problemId)
    if (!p) continue
    push(
      mk(date, 'review', {
        refId: p.id,
        title: `Re-solve: ${p.title}`,
        subtitle: `Memory check ${a.reviewStage + 1} of 3 · ${p.difficulty}`,
        minutes: 6,
        xp: XP.reviewProblem,
      }),
    )
  }

  if (!study) return out

  // 2. Boss fight every second Saturday once at least one gate is cleared.
  if (!light && isBossDay(state, date)) {
    const solved = Object.values(state.attempts).filter((a) => a.status === 'solved').map((a) => a.problemId)
    const pool = allProblems.filter((p) => solved.includes(p.id) && p.difficulty !== 'easy')
    const pick: string[] = []
    const seenGates = new Set<string>()
    for (const p of shuffle(pool)) {
      if (seenGates.has(p.gateId)) continue
      pick.push(p.id)
      seenGates.add(p.gateId)
      if (pick.length === 3) break
    }
    if (pick.length >= 2) {
      push(
        mk(date, 'boss', {
          refId: pick.join(','),
          title: 'Boss fight: timed mock test',
          subtitle: `${pick.length} problems · 45 minutes · no hints`,
          minutes: 45,
          xp: XP.bossClear,
        }),
      )
    }
  }

  // 3. Main line: learn the current concept, then solve its problems.
  const cur = currentConcept(state)
  if (cur) {
    const learned = state.conceptProgress[cur.id]?.status === 'done'
    if (!learned && !referenced.has(cur.id)) {
      push(
        mk(date, 'learn', {
          refId: cur.id,
          title: `Learn: ${cur.title}`,
          subtitle: `${gates.find((g) => g.id === cur.gateId)?.name ?? ''} · ${cur.minutes} min read`,
          minutes: light ? Math.min(cur.minutes, 25) : cur.minutes,
          xp: XP.learnConcept,
        }),
      )
    }
    const pending = unsolvedOf(state, cur).filter((p) => !referenced.has(p.id))
    const perDay = light ? 1 : 2
    for (const p of pending.slice(0, perDay)) {
      const minutes = p.difficulty === 'easy' ? 15 : p.difficulty === 'medium' ? 25 : 35
      push(
        mk(date, 'solve', {
          refId: p.id,
          title: `Solve: ${p.title}`,
          subtitle: `${p.difficulty} · pattern: ${p.patternId.replace(/-/g, ' ')}`,
          minutes,
          xp: p.xp,
        }),
      )
    }
    // If the concept has no unsolved problems left, pull from the next concept so a session is never empty.
    if (pending.length === 0) {
      const next = concepts[concepts.indexOf(cur) + 1]
      if (next) {
        for (const p of unsolvedOf(state, next).slice(0, 1)) {
          push(
            mk(date, 'solve', {
              refId: p.id,
              title: `Preview: ${p.title}`,
              subtitle: `${p.difficulty} · from the next concept`,
              minutes: 20,
              xp: p.xp,
            }),
          )
        }
      }
    }
  } else {
    // Roadmap complete: daily mixed practice.
    const pool = allProblems.filter((p) => !isSolved(state, p.id) && !referenced.has(p.id))
    for (const p of shuffle(pool).slice(0, light ? 1 : 2)) {
      push(mk(date, 'solve', { refId: p.id, title: `Solve: ${p.title}`, subtitle: `${p.difficulty} · mixed practice`, minutes: 25, xp: p.xp }))
    }
  }

  // 4. Complexity drill on days with spare minutes.
  if (used + 10 <= budget) {
    push(mk(date, 'quiz', { title: 'Complexity drill', subtitle: '5 quick Big-O questions', minutes: 10, xp: XP.quizCorrect * 5 }))
  }

  return out
}

/** Estimate sessions needed for a concept: one learn session then ~2 problems per session. */
const sessionsFor = (state: PersistedState, c: Concept): number => {
  const learned = isConceptDone(state, c.id)
  const remaining = c.problems.filter((p) => !isSolved(state, p.id)).length
  const first = learned ? 0 : 1
  const afterFirst = Math.max(0, remaining - (learned ? 0 : 2))
  return first + Math.ceil(afterFirst / 2)
}

export interface PlanEntry {
  date: string
  conceptId: string
  gateId: string
  kind: 'learn' | 'solve'
}

/** Project the remaining roadmap over future study days, starting at `from` (exclusive of existing auto quests). */
export const projectPlan = (state: PersistedState, from: string, maxDays = 420): { entries: PlanEntry[]; gateEta: Record<string, string>; finishDate?: string } => {
  const entries: PlanEntry[] = []
  const gateEta: Record<string, string> = {}
  let date = from
  let dayCount = 0
  const queue = concepts.filter((c) => !isConceptDone(state, c.id) || c.problems.some((p) => !isSolved(state, p.id)))
  for (const c of queue) {
    let sessions = sessionsFor(state, c)
    let first = !isConceptDone(state, c.id)
    while (sessions > 0 && dayCount < maxDays) {
      if (isStudyDay(date, state.profile.studyDays)) {
        entries.push({ date, conceptId: c.id, gateId: c.gateId, kind: first ? 'learn' : 'solve' })
        first = false
        sessions -= 1
      }
      date = addDaysKey(date, 1)
      dayCount += 1
    }
    const gate = gates.find((g) => g.id === c.gateId)
    if (gate && gate.conceptIds[gate.conceptIds.length - 1] === c.id) gateEta[gate.id] = entries[entries.length - 1]?.date ?? date
  }
  return { entries, gateEta, finishDate: entries[entries.length - 1]?.date }
}

export const nextReviewDate = (stage: number, from: string): string | undefined => {
  const days = REVIEW_INTERVALS[stage]
  return days ? addDaysKey(from, days) : undefined
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const conceptTitle = (id: string) => getConcept(id)?.title ?? id
