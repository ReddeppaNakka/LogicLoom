import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PersistedState, Profile, Quest, Note, AttemptStatus } from './types'
import { buildQuestsForDate, nextReviewDate } from '@/lib/scheduler'
import { addDaysKey, isStudyDay, nextStudyDay, todayKey } from '@/lib/dates'
import { levelFromXp, rankForLevel, XP } from '@/lib/xp'
import { getConcept, getProblem } from '@/lib/content'
import type { Lang } from '@/content/types'
import { defaultAppearance, type Appearance } from '@/lib/appearance'

const uid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2))
const nowIso = () => new Date().toISOString()

export interface SystemMessage {
  id: string
  kind: 'xp' | 'levelup' | 'rankup' | 'info' | 'quest'
  title: string
  body?: string
  amount?: number
}

const defaultProfile: Profile = {
  name: 'Hunter',
  startDate: todayKey(),
  studyDays: [1, 2, 3, 4, 5, 6],
  sessionMinutes: 90,
  preferredLang: 'python',
  onboarded: false,
}

export const initialPersisted: PersistedState = {
  version: 1,
  profile: defaultProfile,
  conceptProgress: {},
  attempts: {},
  quests: [],
  xpEvents: [],
  notes: [],
  quizResults: [],
  dayLogs: {},
  totalXp: 0,
  streak: { current: 0, best: 0 },
  lightDays: [],
}

interface Actions {
  messages: SystemMessage[]
  dismissMessage: (id: string) => void
  pushMessage: (m: Omit<SystemMessage, 'id'>) => void

  /** Distraction-free reading: hides the sidebar and widens the margins. */
  focusMode: boolean
  toggleFocusMode: () => void

  appearance: Appearance
  setAppearance: (patch: Partial<Appearance>) => void
  resetAppearance: () => void

  completeOnboarding: (p: Partial<Profile>) => void
  updateProfile: (p: Partial<Profile>) => void
  setLang: (l: Lang) => void

  rollover: () => void
  ensureToday: () => void
  toggleLightDay: (date: string) => void

  startConcept: (conceptId: string) => void
  markConceptLearned: (conceptId: string) => void
  scheduleConcept: (conceptId: string, date: string) => void

  recordAttempt: (problemId: string, status: AttemptStatus) => void
  completeQuest: (questId: string) => void
  rescheduleQuest: (questId: string, date: string) => void
  rescheduleAllMissed: () => void
  dismissQuest: (questId: string) => void
  addManualQuest: (date: string, title: string, minutes: number) => void

  recordQuiz: (correct: number, total: number) => void
  addNote: (n: Omit<Note, 'id' | 'createdAt'>) => void
  updateNote: (id: string, patch: Partial<Note>) => void
  deleteNote: (id: string) => void

  exportJson: () => string
  importJson: (json: string) => boolean
  resetAll: () => void
}

export type AppState = PersistedState & Actions

const grantXp = (s: PersistedState, amount: number, reason: string, date = todayKey()) => {
  const before = levelFromXp(s.totalXp)
  s.totalXp += amount
  s.xpEvents = [...s.xpEvents, { id: uid(), at: nowIso(), date, amount, reason }]
  const after = levelFromXp(s.totalXp)
  const log = s.dayLogs[date] ?? { date, questsDone: 0, xp: 0, light: s.lightDays.includes(date) }
  s.dayLogs = { ...s.dayLogs, [date]: { ...log, xp: log.xp + amount } }
  return { before, after }
}

const touchStreak = (s: PersistedState, date: string) => {
  const st = { ...s.streak }
  if (st.lastDate === date) return st
  if (!st.lastDate) {
    st.current = 1
  } else {
    // Walk back from `date` to lastDate, skipping rest days. If any study day was skipped the streak resets.
    let d = addDaysKey(date, -1)
    let broken = false
    while (d > st.lastDate) {
      if (isStudyDay(d, s.profile.studyDays)) {
        broken = true
        break
      }
      d = addDaysKey(d, -1)
    }
    st.current = broken ? 1 : st.current + 1
  }
  st.best = Math.max(st.best, st.current)
  st.lastDate = date
  return st
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialPersisted,
      messages: [],
      focusMode: false,
      appearance: defaultAppearance,

      setAppearance: (patch) => set((s) => ({ appearance: { ...s.appearance, ...patch } })),
      resetAppearance: () => set({ appearance: defaultAppearance }),
      toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
      dismissMessage: (id) => set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),
      pushMessage: (m) => set((s) => ({ messages: [...s.messages, { ...m, id: uid() }] })),

      completeOnboarding: (p) => {
        set((s) => ({ profile: { ...s.profile, ...p, onboarded: true } }))
        get().ensureToday()
        get().pushMessage({ kind: 'info', title: 'The System has awakened.', body: 'Your first quest is ready. Clear it to begin your ascent.' })
      },
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setLang: (l) => set((s) => ({ profile: { ...s.profile, preferredLang: l } })),

      rollover: () => {
        const today = todayKey()
        set((s) => ({
          quests: s.quests.map((q) => (q.date < today && q.status === 'pending' ? { ...q, status: 'missed' as const } : q)),
          lastRollover: today,
        }))
      },

      ensureToday: () => {
        get().rollover()
        const s = get()
        const today = todayKey()
        const fresh = buildQuestsForDate(s, today)
        if (fresh.length) set({ quests: [...s.quests, ...fresh] })
      },

      toggleLightDay: (date) => {
        set((s) => {
          const on = s.lightDays.includes(date)
          const lightDays = on ? s.lightDays.filter((d) => d !== date) : [...s.lightDays, date]
          // Drop untouched auto quests for the day so they regenerate at the new budget.
          const quests = s.quests.filter((q) => !(q.date === date && q.origin === 'auto' && q.status === 'pending'))
          return { lightDays, quests }
        })
        const s = get()
        const fresh = buildQuestsForDate(s, date)
        if (fresh.length) set({ quests: [...s.quests, ...fresh] })
      },

      startConcept: (conceptId) =>
        set((s) => {
          if (s.conceptProgress[conceptId]) return {}
          return { conceptProgress: { ...s.conceptProgress, [conceptId]: { conceptId, status: 'learning', startedAt: nowIso() } } }
        }),

      markConceptLearned: (conceptId) => {
        const s0 = get()
        if (s0.conceptProgress[conceptId]?.status === 'done') return
        const today = todayKey()
        const next: PersistedState = { ...s0 }
        next.conceptProgress = { ...s0.conceptProgress, [conceptId]: { conceptId, status: 'done', startedAt: s0.conceptProgress[conceptId]?.startedAt ?? nowIso(), completedAt: nowIso() } }
        const { before, after } = grantXp(next, XP.learnConcept, `Learned ${getConcept(conceptId)?.title ?? conceptId}`, today)
        // close any pending learn quest for this concept
        next.quests = s0.quests.map((q) => (q.kind === 'learn' && q.refId === conceptId && q.status !== 'done' ? { ...q, status: 'done' as const, completedAt: nowIso() } : q))
        const log = next.dayLogs[today] ?? { date: today, questsDone: 0, xp: 0, light: false }
        next.dayLogs = { ...next.dayLogs, [today]: { ...log, questsDone: log.questsDone + 1 } }
        next.streak = touchStreak(next, today)
        set(next)
        get().pushMessage({ kind: 'xp', title: 'Concept mastered', body: getConcept(conceptId)?.title, amount: XP.learnConcept })
        announceLevel(get, before.level, after.level)
      },

      scheduleConcept: (conceptId, date) => {
        const c = getConcept(conceptId)
        if (!c) return
        const q: Quest = {
          id: uid(),
          date,
          kind: 'learn',
          refId: conceptId,
          title: `Learn: ${c.title}`,
          subtitle: `Scheduled by you · ${c.minutes} min read`,
          minutes: c.minutes,
          xp: XP.learnConcept,
          status: 'pending',
          origin: 'manual',
        }
        set((s) => ({ quests: [...s.quests, q] }))
        get().pushMessage({ kind: 'quest', title: 'Quest scheduled', body: `${c.title} moved to ${date}` })
      },

      recordAttempt: (problemId, status) => {
        const s0 = get()
        const today = todayKey()
        const p = getProblem(problemId)
        const prev = s0.attempts[problemId]
        const next: PersistedState = { ...s0 }
        let gained = 0
        let reason = ''
        if (status === 'solved') {
          const first = !prev || prev.status !== 'solved'
          const wasReview = prev?.nextReviewAt && prev.nextReviewAt <= today
          const stage = prev ? (wasReview ? Math.min(4, prev.reviewStage + 1) : prev.reviewStage) : 0
          const newStage = first ? 1 : stage
          next.attempts = {
            ...s0.attempts,
            [problemId]: {
              problemId,
              status: 'solved',
              attempts: (prev?.attempts ?? 0) + 1,
              firstSolvedAt: prev?.firstSolvedAt ?? nowIso(),
              lastAt: nowIso(),
              reviewStage: newStage,
              nextReviewAt: nextReviewDate(newStage - 1, today),
            },
          }
          if (first) {
            gained = p?.xp ?? 20
            reason = `Solved ${p?.title ?? problemId}`
          } else if (wasReview) {
            gained = XP.reviewProblem
            reason = `Reviewed ${p?.title ?? problemId}`
          }
        } else {
          next.attempts = {
            ...s0.attempts,
            [problemId]: {
              problemId,
              status: prev?.status === 'solved' ? 'solved' : 'failed',
              attempts: (prev?.attempts ?? 0) + 1,
              firstSolvedAt: prev?.firstSolvedAt,
              lastAt: nowIso(),
              reviewStage: prev?.status === 'solved' ? Math.max(1, (prev.reviewStage ?? 1) - 1) : 0,
              nextReviewAt: addDaysKey(today, 1),
            },
          }
        }
        // close matching quests for today
        next.quests = s0.quests.map((q) => {
          if (q.date !== today || q.status === 'done') return q
          if ((q.kind === 'solve' || q.kind === 'review') && q.refId === problemId && status === 'solved') return { ...q, status: 'done', completedAt: nowIso() }
          return q
        })
        let levels: { before: number; after: number } | null = null
        if (gained > 0) {
          const r = grantXp(next, gained, reason, today)
          levels = { before: r.before.level, after: r.after.level }
          const log = next.dayLogs[today] ?? { date: today, questsDone: 0, xp: 0, light: false }
          next.dayLogs = { ...next.dayLogs, [today]: { ...log, questsDone: log.questsDone + 1 } }
          next.streak = touchStreak(next, today)
        }
        set(next)
        if (gained > 0) get().pushMessage({ kind: 'xp', title: status === 'solved' ? 'Problem cleared' : 'Recorded', body: p?.title, amount: gained })
        if (status === 'failed') get().pushMessage({ kind: 'info', title: 'Logged as a struggle', body: 'It will return tomorrow as a review. Write down what blocked you.' })
        if (levels) announceLevel(get, levels.before, levels.after)
      },

      completeQuest: (questId) => {
        const s0 = get()
        const q = s0.quests.find((x) => x.id === questId)
        if (!q || q.status === 'done') return
        const today = todayKey()
        const next: PersistedState = { ...s0 }
        next.quests = s0.quests.map((x) => (x.id === questId ? { ...x, status: 'done' as const, completedAt: nowIso() } : x))
        const { before, after } = grantXp(next, q.xp, q.title, today)
        const log = next.dayLogs[today] ?? { date: today, questsDone: 0, xp: 0, light: false }
        next.dayLogs = { ...next.dayLogs, [today]: { ...log, questsDone: log.questsDone + 1 } }
        next.streak = touchStreak(next, today)
        // completing all quests of the day gives a streak bonus
        const dayQuests = next.quests.filter((x) => x.date === today && x.status !== 'rescheduled')
        const allDone = dayQuests.length > 0 && dayQuests.every((x) => x.status === 'done')
        if (allDone && !s0.xpEvents.some((e) => e.date === today && e.reason === 'Daily quest cleared')) {
          grantXp(next, XP.streakBonus, 'Daily quest cleared', today)
        }
        set(next)
        get().pushMessage({ kind: 'xp', title: 'Quest complete', body: q.title, amount: q.xp })
        if (allDone) get().pushMessage({ kind: 'quest', title: 'Daily quest cleared', body: `+${XP.streakBonus} bonus XP. Streak: ${next.streak.current} days.` })
        announceLevel(get, before.level, after.level)
      },

      rescheduleQuest: (questId, date) => {
        set((s) => {
          const q = s.quests.find((x) => x.id === questId)
          if (!q) return {}
          const moved: Quest = { ...q, id: uid(), date, status: 'pending', origin: 'reschedule', rescheduledFrom: q.date, rescheduledTo: undefined }
          const quests = s.quests.map((x) => (x.id === questId ? { ...x, status: 'rescheduled' as const, rescheduledTo: date } : x))
          return { quests: [...quests, moved] }
        })
        get().pushMessage({ kind: 'quest', title: 'Quest rescheduled', body: `Moved to ${date}. The System will remember.` })
      },

      rescheduleAllMissed: () => {
        const s = get()
        const today = todayKey()
        const target = nextStudyDay(today, s.profile.studyDays, true)
        const missed = s.quests.filter((q) => q.status === 'missed')
        missed.forEach((q) => get().rescheduleQuest(q.id, target))
      },

      dismissQuest: (questId) => set((s) => ({ quests: s.quests.filter((q) => q.id !== questId) })),

      addManualQuest: (date, title, minutes) =>
        set((s) => ({
          quests: [...s.quests, { id: uid(), date, kind: 'free', title, minutes, xp: Math.round(minutes / 2), status: 'pending', origin: 'manual' }],
        })),

      recordQuiz: (correct, total) => {
        const s0 = get()
        const today = todayKey()
        const next: PersistedState = { ...s0 }
        next.quizResults = [...s0.quizResults, { at: nowIso(), date: today, correct, total }]
        const { before, after } = grantXp(next, correct * XP.quizCorrect, `Complexity drill ${correct}/${total}`, today)
        next.quests = s0.quests.map((q) => (q.date === today && q.kind === 'quiz' && q.status === 'pending' ? { ...q, status: 'done' as const, completedAt: nowIso() } : q))
        next.streak = touchStreak(next, today)
        set(next)
        get().pushMessage({ kind: 'xp', title: 'Drill complete', body: `${correct} of ${total} correct`, amount: correct * XP.quizCorrect })
        announceLevel(get, before.level, after.level)
      },

      addNote: (n) => set((s) => ({ notes: [{ ...n, id: uid(), createdAt: nowIso() }, ...s.notes] })),
      updateNote: (id, patch) => set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      exportJson: () => {
        const s = get()
        const data: PersistedState = {
          version: s.version,
          profile: s.profile,
          conceptProgress: s.conceptProgress,
          attempts: s.attempts,
          quests: s.quests,
          xpEvents: s.xpEvents,
          notes: s.notes,
          quizResults: s.quizResults,
          dayLogs: s.dayLogs,
          totalXp: s.totalXp,
          streak: s.streak,
          lightDays: s.lightDays,
          lastRollover: s.lastRollover,
        }
        return JSON.stringify(data, null, 2)
      },
      importJson: (json) => {
        try {
          const data = JSON.parse(json) as Partial<PersistedState>
          if (!data || typeof data !== 'object' || !data.profile) return false
          set({ ...initialPersisted, ...data, profile: { ...defaultProfile, ...data.profile } })
          get().ensureToday()
          return true
        } catch {
          return false
        }
      },
      resetAll: () => set({ ...initialPersisted, profile: { ...defaultProfile, startDate: todayKey() }, messages: [] }),
    }),
    {
      name: 'the-system-dsa-v1',
      /** Fill in appearance keys added after a save was written. */
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>
        return { ...current, ...p, appearance: { ...defaultAppearance, ...(p.appearance ?? {}) } }
      },
      partialize: (s) => {
        const { messages: _m, ...rest } = s as AppState
        void _m
        const out: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(rest)) if (typeof v !== 'function') out[k] = v
        return out as unknown as AppState
      },
    },
  ),
)

function announceLevel(get: () => AppState, before: number, after: number) {
  if (after <= before) return
  const rankAfter = rankForLevel(after)
  if (rankAfter !== rankForLevel(before)) {
    get().pushMessage({ kind: 'rankup', title: `Rank up: ${rankAfter}`, body: `You are now ${rankAfter}-rank. Level ${after}.` })
  } else {
    get().pushMessage({ kind: 'levelup', title: `Level ${after}`, body: 'Your stats have increased.' })
  }
}

/** Selectors */
export const selectToday = (s: AppState) => s.quests.filter((q) => q.date === todayKey() && q.status !== 'rescheduled')
export const selectMissed = (s: AppState) => s.quests.filter((q) => q.status === 'missed')
