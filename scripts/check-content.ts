/* Content integrity check. Run: npm run check */
import { gates } from '../src/content/gates'
import { concepts as c1 } from '../src/content/concepts/complexity'
import { concepts as c2 } from '../src/content/concepts/arrays-strings'
import { concepts as c3 } from '../src/content/concepts/searching-sorting'
import { concepts as c4 } from '../src/content/concepts/recursion-backtracking'
import { concepts as c5 } from '../src/content/concepts/linked-lists'
import { concepts as c6 } from '../src/content/concepts/stacks-queues'
import { concepts as c7 } from '../src/content/concepts/hashing'
import { concepts as c8 } from '../src/content/concepts/trees'
import { concepts as c9 } from '../src/content/concepts/heaps'
import { concepts as c10 } from '../src/content/concepts/graphs'
import { concepts as c11 } from '../src/content/concepts/dynamic-programming'
import { concepts as c12 } from '../src/content/concepts/greedy-bits-tries'
import { concepts as c13 } from '../src/content/concepts/mastery'
import { patterns as p1 } from '../src/content/patterns/part1'
import { patterns as p2 } from '../src/content/patterns/part2'
import { decisionTree, decisionRootId } from '../src/content/decision-tree'
import { complexityQuestions } from '../src/content/complexity-quiz'

const concepts = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13].flat()
const patterns = [...p1, ...p2]
const patternIds = new Set(patterns.map((p) => p.id))
const conceptIds = new Set(concepts.map((c) => c.id))
const problemIds = new Set(concepts.flatMap((c) => c.problems.map((p) => p.id)))
const errors: string[] = []
const warns: string[] = []

// gates <-> concepts
for (const g of gates) {
  for (const id of g.conceptIds) if (!conceptIds.has(id)) errors.push(`gate ${g.id} references missing concept ${id}`)
  for (const id of g.patternIds) if (!patternIds.has(id)) errors.push(`gate ${g.id} references missing pattern ${id}`)
}
for (const c of concepts) {
  if (!gates.some((g) => g.id === c.gateId)) errors.push(`concept ${c.id} has unknown gate ${c.gateId}`)
  if (!gates.find((g) => g.id === c.gateId)?.conceptIds.includes(c.id)) errors.push(`concept ${c.id} not listed in gate ${c.gateId}`)
  for (const id of c.patternIds) if (!patternIds.has(id)) errors.push(`concept ${c.id} uses unknown pattern ${id}`)
  for (const p of c.problems) {
    if (!patternIds.has(p.patternId)) errors.push(`problem ${p.id} uses unknown pattern ${p.patternId}`)
    if (!p.url.includes(p.id)) warns.push(`problem ${p.id} url does not contain its id: ${p.url}`)
    for (const lang of ['javascript', 'java', 'cpp'] as const) {
      if (c.naive && !c.naive.code[lang]) warns.push(`concept ${c.id} naive missing ${lang}`)
      if (c.optimized && !c.optimized.code[lang]) warns.push(`concept ${c.id} optimized missing ${lang}`)
    }
  }
  const words = c.explanation.split(/\s+/).length
  if (words < 200) warns.push(`concept ${c.id} explanation is short (${words} words)`)
}
// duplicate concept ids
const seen = new Set<string>()
for (const c of concepts) {
  if (seen.has(c.id)) errors.push(`duplicate concept id ${c.id}`)
  seen.add(c.id)
}
// patterns
const seenP = new Set<string>()
for (const p of patterns) {
  if (seenP.has(p.id)) errors.push(`duplicate pattern id ${p.id}`)
  seenP.add(p.id)
  for (const g of p.relatedGateIds) if (!gates.some((x) => x.id === g)) errors.push(`pattern ${p.id} unknown gate ${g}`)
  const missing = p.exampleProblemIds.filter((id) => !problemIds.has(id))
  if (missing.length) warns.push(`pattern ${p.id} example problems not in any concept: ${missing.join(', ')}`)
  for (const lang of ['javascript', 'java', 'cpp'] as const) if (!p.template[lang]) warns.push(`pattern ${p.id} template missing ${lang}`)
}
// decision tree
const nodeIds = new Set(decisionTree.map((n) => n.id))
if (!nodeIds.has(decisionRootId)) errors.push('decision tree root missing')
for (const n of decisionTree) {
  for (const o of n.options) {
    if (o.next && !nodeIds.has(o.next)) errors.push(`decision node ${n.id} option "${o.label}" -> missing node ${o.next}`)
    if (o.patternId && !patternIds.has(o.patternId)) errors.push(`decision node ${n.id} option "${o.label}" -> missing pattern ${o.patternId}`)
    if (!o.next && !o.patternId) errors.push(`decision node ${n.id} option "${o.label}" has no target`)
  }
}
// quiz
for (const q of complexityQuestions) {
  if (q.options.length !== 4) errors.push(`quiz ${q.id} needs 4 options`)
  if (q.answerIndex < 0 || q.answerIndex > 3) errors.push(`quiz ${q.id} bad answerIndex`)
}

console.log(`gates ${gates.length} · concepts ${concepts.length} · patterns ${patterns.length} · problems ${problemIds.size} · quiz ${complexityQuestions.length} · tree nodes ${decisionTree.length}`)
for (const w of warns) console.log('warn:', w)
for (const e of errors) console.log('ERROR:', e)
if (errors.length) process.exit(1)
console.log('content OK')
