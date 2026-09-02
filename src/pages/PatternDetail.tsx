import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPattern, getGate, getProblem, problemsOfPattern } from '@/lib/content'
import Markdown from '@/components/Markdown'
import CodeTabs from '@/components/CodeTabs'
import { Panel, Eyebrow, Kanji } from '@/components/ui'
import { ProblemRow } from './ConceptPage'

export default function PatternDetail() {
  const { patternId = '' } = useParams()
  const p = getPattern(patternId)
  if (!p) return <Navigate to="/patterns" replace />
  const examples = p.exampleProblemIds.map(getProblem).filter(Boolean)
  const more = problemsOfPattern(p.id).filter((x) => !p.exampleProblemIds.includes(x.id))
  const all = [...examples, ...more] as NonNullable<ReturnType<typeof getProblem>>[]

  return (
    <div className="max-w-[860px]">
      <Link to="/patterns" className="text-[12px] text-muted hover:text-bone">
        ← Pattern library
      </Link>
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="mt-4 mb-8">
        <div className="flex items-center gap-3">
          <Eyebrow system>Pattern</Eyebrow>
          <Kanji>型</Kanji>
          {p.relatedGateIds.map((g) => (
            <Link key={g} to={`/gates/${g}`} className="chip hover:border-[rgba(77,163,255,0.5)]">
              {getGate(g)?.name}
            </Link>
          ))}
        </div>
        <h1 className="display text-[40px] md:text-[54px] leading-[1] mt-2">{p.name}</h1>
        <p className="text-bone-dim text-[16px] mt-3">{p.tagline}</p>
        <div className="flex gap-2 mt-3">
          <span className="chip mono">time {p.time}</span>
          <span className="chip mono">space {p.space}</span>
        </div>
      </motion.header>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Panel variant="system" corner className="p-5">
          <Eyebrow system className="mb-2">Use it when you see</Eyebrow>
          <ul className="space-y-1.5 text-[13.5px]">
            {p.triggers.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-system">›</span>
                <span className="text-bone">{t}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-5">
          <Eyebrow className="mb-2 text-ember">Do not force it when</Eyebrow>
          <ul className="space-y-1.5 text-[13.5px]">
            {p.avoidWhen.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-ember">×</span>
                <span className="text-bone-dim">{t}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Markdown>{p.explanation}</Markdown>

      <section className="mt-10">
        <Eyebrow system className="mb-3">Template · copy and adapt</Eyebrow>
        <CodeTabs code={p.template} />
      </section>

      {all.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <Eyebrow system>Problems using this pattern · {all.length}</Eyebrow>
            <Kanji>題</Kanji>
          </div>
          <div className="space-y-3">
            {all.map((pr) => (
              <ProblemRow key={pr.id} p={pr} showConcept />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
