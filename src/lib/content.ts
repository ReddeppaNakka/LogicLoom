import type { Concept, Pattern, Problem, Gate } from '@/content/types'
import { gates } from '@/content/gates'
import { concepts as c1 } from '@/content/concepts/complexity'
import { concepts as c2 } from '@/content/concepts/arrays-strings'
import { concepts as c3 } from '@/content/concepts/searching-sorting'
import { concepts as c4 } from '@/content/concepts/recursion-backtracking'
import { concepts as c5 } from '@/content/concepts/linked-lists'
import { concepts as c6 } from '@/content/concepts/stacks-queues'
import { concepts as c7 } from '@/content/concepts/hashing'
import { concepts as c8 } from '@/content/concepts/trees'
import { concepts as c9 } from '@/content/concepts/heaps'
import { concepts as c10 } from '@/content/concepts/graphs'
import { concepts as c11 } from '@/content/concepts/dynamic-programming'
import { concepts as c12 } from '@/content/concepts/greedy-bits-tries'
import { concepts as c13 } from '@/content/concepts/mastery'
import { patterns as p1 } from '@/content/patterns/part1'
import { patterns as p2 } from '@/content/patterns/part2'

export { gates }

const allConcepts: Concept[] = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13].flat()
const allPatterns: Pattern[] = [...p1, ...p2]

/** Concepts in roadmap order (gate order, then concept order). */
export const concepts: Concept[] = gates.flatMap((g) =>
  g.conceptIds.map((id) => allConcepts.find((c) => c.id === id)).filter((c): c is Concept => Boolean(c)),
)

export const patterns: Pattern[] = allPatterns

const conceptMap = new Map(concepts.map((c) => [c.id, c]))
const patternMap = new Map(patterns.map((p) => [p.id, p]))
const gateMap = new Map(gates.map((g) => [g.id, g]))

/** Deduplicated problems, keyed by id. A problem may be referenced by several concepts. */
const problemMap = new Map<string, Problem & { conceptIds: string[]; gateId: string }>()
for (const c of concepts) {
  for (const p of c.problems) {
    const existing = problemMap.get(p.id)
    if (existing) existing.conceptIds.push(c.id)
    else problemMap.set(p.id, { ...p, conceptIds: [c.id], gateId: c.gateId })
  }
}
export const problems = Array.from(problemMap.values())

export const getConcept = (id: string): Concept | undefined => conceptMap.get(id)
export const getPattern = (id: string): Pattern | undefined => patternMap.get(id)
export const getGate = (id: string): Gate | undefined => gateMap.get(id)
export const getProblem = (id: string) => problemMap.get(id)
export const conceptsOfGate = (gateId: string): Concept[] => concepts.filter((c) => c.gateId === gateId)
export const problemsOfGate = (gateId: string) => problems.filter((p) => p.gateId === gateId)
export const problemsOfPattern = (patternId: string) => problems.filter((p) => p.patternId === patternId)

export const conceptIndex = (id: string): number => concepts.findIndex((c) => c.id === id)
export const nextConceptAfter = (id: string): Concept | undefined => concepts[conceptIndex(id) + 1]

export const totals = {
  concepts: concepts.length,
  problems: problems.length,
  patterns: patterns.length,
  gates: gates.length,
}
