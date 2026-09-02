import type { Lang } from '@/content/types'

export interface Profile {
  name: string
  startDate: string // YYYY-MM-DD
  studyDays: number[] // 0 = Sunday .. 6 = Saturday
  sessionMinutes: number // normal session, default 90
  preferredLang: Lang
  onboarded: boolean
}

export type ConceptStatus = 'learning' | 'done'
export interface ConceptProgress {
  conceptId: string
  status: ConceptStatus
  startedAt?: string
  completedAt?: string
}

export type AttemptStatus = 'solved' | 'failed'
export interface ProblemAttempt {
  problemId: string
  status: AttemptStatus
  attempts: number
  firstSolvedAt?: string
  lastAt: string
  /** spaced repetition stage: 0 = new, 1 = 3 days, 2 = 7 days, 3 = 21 days, 4 = mastered */
  reviewStage: number
  nextReviewAt?: string
}

export type QuestKind = 'learn' | 'solve' | 'review' | 'quiz' | 'boss' | 'light' | 'free'
export type QuestStatus = 'pending' | 'done' | 'missed' | 'rescheduled'
export interface Quest {
  id: string
  date: string
  kind: QuestKind
  refId?: string // conceptId or problemId (or comma separated problem ids for boss)
  title: string
  subtitle?: string
  minutes: number
  xp: number
  status: QuestStatus
  origin: 'auto' | 'reschedule' | 'manual'
  rescheduledTo?: string
  rescheduledFrom?: string
  completedAt?: string
}

export interface XpEvent {
  id: string
  at: string // ISO datetime
  date: string // YYYY-MM-DD
  amount: number
  reason: string
}

export interface Note {
  id: string
  createdAt: string
  text: string
  title: string
  problemId?: string
  conceptId?: string
  patternId?: string
  tags: string[]
}

export interface QuizResult {
  at: string
  date: string
  correct: number
  total: number
}

export interface DayLog {
  date: string
  questsDone: number
  xp: number
  light: boolean
}

export interface Streak {
  current: number
  best: number
  lastDate?: string
}

export interface PersistedState {
  version: number
  profile: Profile
  conceptProgress: Record<string, ConceptProgress>
  attempts: Record<string, ProblemAttempt>
  quests: Quest[]
  xpEvents: XpEvent[]
  notes: Note[]
  quizResults: QuizResult[]
  dayLogs: Record<string, DayLog>
  totalXp: number
  streak: Streak
  lightDays: string[] // dates the user marked as tired / light
  lastRollover?: string
}
