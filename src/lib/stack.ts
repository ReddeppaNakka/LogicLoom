import type { Tech, TechDeep } from '@/content/stack-types'
import { coreTech } from '@/content/stack-core'
import { stateTech } from '@/content/stack-state'
import { extraTech } from '@/content/stack-extras'
import { DEEP } from '@/content/stack-deep'

/** Every technology documented in the "Under the hood" section, in study order. */
export const allTech: Tech[] = [...coreTech, ...stateTech, ...extraTech].sort((a, b) => a.order - b.order)

const byId = new Map(allTech.map((t) => [t.id, t]))
export const techById = (id: string): Tech | undefined => byId.get(id)

/** The deep study material for a technology. */
export const deepOf = (id: string): TechDeep => DEEP[id]

/** Totals for the hero. */
export const stackTotals = {
  tech: allTech.length,
  ideas: allTech.reduce((s, t) => s + (DEEP[t.id]?.concepts.length ?? 0), 0),
  frames: allTech.reduce((s, t) => s + (DEEP[t.id]?.visual.frames.length ?? 0), 0),
  quiz: allTech.reduce((s, t) => s + (DEEP[t.id]?.quiz.length ?? 0), 0),
}
