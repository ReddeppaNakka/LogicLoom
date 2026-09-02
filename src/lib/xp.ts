import type { Rank } from '@/content/types'

/** XP needed to go from `level` to `level + 1`. Gentle curve so early levels feel fast. */
export const xpForLevel = (level: number): number => Math.round(120 + (level - 1) * 55 + Math.pow(level - 1, 1.6) * 12)

export interface LevelInfo {
  level: number
  rank: Rank
  intoLevel: number // xp earned inside the current level
  needed: number // xp needed for this level
  progress: number // 0..1
  totalXp: number
}

export const levelFromXp = (totalXp: number): LevelInfo => {
  let level = 1
  let remaining = totalXp
  while (remaining >= xpForLevel(level) && level < 99) {
    remaining -= xpForLevel(level)
    level += 1
  }
  const needed = xpForLevel(level)
  return { level, rank: rankForLevel(level), intoLevel: remaining, needed, progress: Math.min(1, remaining / needed), totalXp }
}

export const rankForLevel = (level: number): Rank => {
  if (level >= 50) return 'S'
  if (level >= 40) return 'A'
  if (level >= 30) return 'B'
  if (level >= 20) return 'C'
  if (level >= 10) return 'D'
  return 'E'
}

export const RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S']

export const rankTitle: Record<Rank, string> = {
  E: 'Awakened',
  D: 'Hunter',
  C: 'Elite Hunter',
  B: 'Vanguard',
  A: 'Shadow Knight',
  S: 'Monarch',
}

/** Rank colours follow the active theme so they stay legible on light backgrounds. */
export const rankColor: Record<Rank, string> = {
  E: 'var(--fg-muted)',
  D: 'var(--good)',
  C: 'var(--accent)',
  B: 'var(--violet)',
  A: 'var(--gold)',
  S: 'var(--warn)',
}

export const XP = {
  learnConcept: 60,
  reviewProblem: 15,
  quizCorrect: 8,
  bossClear: 200,
  streakBonus: 25,
  lightSession: 30,
}
