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
import { coreTech } from '../src/content/stack-core'
import { stateTech } from '../src/content/stack-state'
import { extraTech } from '../src/content/stack-extras'
import { LAYERS, OPEN_A_PAGE, LEARNING_PATH } from '../src/content/stack-overview'
import * as fs from 'node:fs'

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

  // --- the thirteen teaching sections ---
  const need = (field: string, ok: boolean, detail = '') => {
    if (!ok) errors.push(`concept ${c.id} missing ${field}${detail ? ` (${detail})` : ''}`)
  }
  need('definition', Boolean(c.definition && c.definition.trim().length > 20))
  need('coreIdea', Boolean(c.coreIdea && c.coreIdea.trim().length > 40))
  need('visual', (c.visual?.length ?? 0) >= 3, 'need 3+ frames')
  need('pseudocode', Boolean(c.pseudocode && c.pseudocode.split('\n').length >= 5))
  need('complexity', (c.complexity?.length ?? 0) >= 2)
  need('dryRun', (c.dryRun?.steps.length ?? 0) >= 4, 'need 4+ steps')
  need('mistakes', (c.mistakes?.length ?? 0) >= 3)
  need('whenToUse', (c.whenToUse?.length ?? 0) >= 3)
  need('whenNotToUse', (c.whenNotToUse?.length ?? 0) >= 2)
  need('relatedTopics', (c.relatedTopics?.length ?? 0) >= 2)
  need('quiz', (c.quiz?.length ?? 0) >= 3)
  need('sources', (c.sources?.length ?? 0) >= 1)

  for (const f of c.visual ?? []) {
    const longest = Math.max(...f.frame.split('\n').map((l) => l.length))
    if (longest > 64) warns.push(`concept ${c.id} visual frame line is ${longest} chars, wraps on mobile`)
  }
  for (const q of c.quiz ?? []) {
    if (q.options.length < 3) errors.push(`concept ${c.id} quiz question needs 3+ options`)
    if (q.answerIndex < 0 || q.answerIndex >= q.options.length) errors.push(`concept ${c.id} quiz answerIndex out of range`)
  }
  for (const r of c.relatedTopics ?? []) {
    const exists = r.kind === 'concept' ? conceptIds.has(r.id) : patternIds.has(r.id)
    if (!exists) errors.push(`concept ${c.id} relatedTopics -> unknown ${r.kind} ${r.id}`)
  }
  for (const p of c.problems) if (!p.tier) errors.push(`problem ${p.id} in ${c.id} has no tier`)
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

const withSections = concepts.filter((c) => c.definition && c.visual?.length && c.dryRun && c.quiz?.length).length
const totalQuiz = concepts.reduce((s, c) => s + (c.quiz?.length ?? 0), 0)
const totalFrames = concepts.reduce((s, c) => s + (c.visual?.length ?? 0), 0)
// --- "Under the hood": every documented snippet must really exist in the file
// --- it cites, otherwise the page teaches something that is not true.
// Built from char codes so this file stays free of escape sequences that get
// mangled when the script itself is edited by tooling.
const CRLF = String.fromCharCode(13, 10)
const LF = String.fromCharCode(10)
/** Compare ignoring line-ending style and surrounding blank space. */
const sameText = (a: string, b: string) => a.split(CRLF).join(LF).trim().includes(b.split(CRLF).join(LF).trim())

const tech = [...coreTech, ...stateTech, ...extraTech]
const techIds = new Set(tech.map((t) => t.id))
const seenTech = new Set<string>()
let snippetCount = 0
for (const t of tech) {
  if (seenTech.has(t.id)) errors.push(`duplicate tech id ${t.id}`)
  seenTech.add(t.id)
  if (!t.snippets.length) errors.push(`tech ${t.id} has no snippets`)
  if (t.teaches.length < 3) warns.push(`tech ${t.id} teaches only ${t.teaches.length} ideas`)
  if (!t.docs.length) errors.push(`tech ${t.id} has no doc links`)
  for (const sn of t.snippets) {
    snippetCount++
    let actual: string
    try {
      actual = fs.readFileSync(sn.file, 'utf8')
    } catch {
      errors.push(`tech ${t.id}: snippet cites missing file ${sn.file}`)
      continue
    }
    if (!sameText(actual, sn.code)) {
      errors.push(`tech ${t.id}: snippet no longer matches ${sn.file} — the code changed, update the snippet`)
    }
  }
}
for (const layer of LAYERS) {
  for (const id of layer.techIds) if (!techIds.has(id)) errors.push(`stack layer ${layer.id} references unknown tech ${id}`)
}
for (const stage of LEARNING_PATH) {
  for (const id of stage.techIds) if (!techIds.has(id)) errors.push(`learning path "${stage.stage}" references unknown tech ${id}`)
}
for (const step of OPEN_A_PAGE) {
  for (const f of step.files) if (!fs.existsSync(f)) errors.push(`page-load walkthrough cites missing file ${f}`)
}

console.log(`gates ${gates.length} · concepts ${concepts.length} · patterns ${patterns.length} · problems ${problemIds.size} · drill ${complexityQuestions.length} · tree nodes ${decisionTree.length}`)
console.log(`stack: ${tech.length} technologies · ${snippetCount} verified code snippets`)
console.log(`fully sectioned concepts ${withSections}/${concepts.length} · visual frames ${totalFrames} · concept quiz questions ${totalQuiz}`)
for (const w of warns) console.log('warn:', w)
for (const e of errors) console.log('ERROR:', e)
if (errors.length) process.exit(1)
console.log('content OK')
