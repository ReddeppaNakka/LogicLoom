import type { Tech } from '@/content/stack-types'
import { coreTech } from '@/content/stack-core'
import { stateTech } from '@/content/stack-state'
import { extraTech } from '@/content/stack-extras'

/** Every technology documented in the "Under the hood" section, in study order. */
export const allTech: Tech[] = [...coreTech, ...stateTech, ...extraTech].sort((a, b) => a.order - b.order)

const byId = new Map(allTech.map((t) => [t.id, t]))
export const techById = (id: string): Tech | undefined => byId.get(id)
