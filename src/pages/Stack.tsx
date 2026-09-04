import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, ArrowRight, ExternalLink, FlaskConical, AlertTriangle, GraduationCap, FileCode2, Route } from 'lucide-react'
import { allTech, techById } from '@/lib/stack'
import { LAYERS, OPEN_A_PAGE, LEARNING_PATH } from '@/content/stack-overview'
import type { Tech } from '@/content/stack-types'
import Markdown from '@/components/Markdown'
import Reveal from '@/components/Reveal'
import { SectionTitle, Panel, Eyebrow, cx } from '@/components/ui'

type Tab = 'map' | 'tech' | 'flow' | 'path'

const TABS: { id: Tab; label: string }[] = [
  { id: 'map', label: 'The map' },
  { id: 'tech', label: 'Every technology' },
  { id: 'flow', label: 'How a page loads' },
  { id: 'path', label: 'Learning path' },
]

export default function Stack() {
  const [tab, setTab] = useState<Tab>('map')
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div>
      <SectionTitle
        eyebrow="Under the hood"
        kanji="構造"
        title="The app you are reading, explained."
        right={
          <div className="flex gap-1 p-1 rounded-xl border border-[var(--line)] bg-[rgb(var(--bg-rgb)/0.5)] flex-wrap">
            {TABS.map((t) => (
              <button key={t.id} className={cx('btn btn-sm border-0', tab === t.id && 'btn-system')} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        }
      />
      <p className="text-bone-dim max-w-2xl -mt-2 mb-8">
        Every snippet below is real code from this repository, with the file it came from. Open the file beside the
        explanation and you are reading a working example rather than a tutorial exercise. {allTech.length} technologies,
        roughly {LINES.toLocaleString()} lines of source.
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {tab === 'map' && <MapView onOpen={(id) => { setOpenId(id); setTab('tech') }} />}
          {tab === 'tech' && <TechList openId={openId} setOpenId={setOpenId} />}
          {tab === 'flow' && <FlowView />}
          {tab === 'path' && <PathView onOpen={(id) => { setOpenId(id); setTab('tech') }} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const LINES = 38230

/** Layered diagram: what sits on what. */
function MapView({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="space-y-4">
      {LAYERS.map((layer, i) => (
        <Reveal key={layer.id} delay={Math.min(i, 6) * 0.04}>
          <Panel className="p-5">
            <div className="grid md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="mono text-[11px] text-system">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[15px] font-medium">{layer.name}</span>
                </div>
                <p className="text-[12.5px] text-muted mt-1">{layer.blurb}</p>
              </div>
              <div className="flex flex-wrap gap-2 content-start">
                {layer.techIds.map((id) => {
                  const t = techById(id)
                  if (!t) return null
                  return (
                    <button key={id} onClick={() => onOpen(id)} className="text-left group">
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--line)] hover:border-[rgb(var(--accent-rgb)/0.5)] hover:bg-[rgb(var(--accent-rgb)/0.06)] transition-all">
                        <span className="text-[13.5px] group-hover:text-system transition-colors">{t.name}</span>
                        <span className="mono text-[10px] text-muted">{t.version}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Panel>
        </Reveal>
      ))}
    </div>
  )
}

/** The full reference: one expandable entry per technology. */
function TechList({ openId, setOpenId }: { openId: string | null; setOpenId: (id: string | null) => void }) {
  const ordered = useMemo(() => [...allTech].sort((a, b) => a.order - b.order), [])
  return (
    <div className="space-y-3">
      {ordered.map((t) => (
        <TechCard key={t.id} tech={t} open={openId === t.id} onToggle={() => setOpenId(openId === t.id ? null : t.id)} />
      ))}
    </div>
  )
}

function TechCard({ tech, open, onToggle }: { tech: Tech; open: boolean; onToggle: () => void }) {
  const [snippet, setSnippet] = useState(0)
  const s = tech.snippets[Math.min(snippet, tech.snippets.length - 1)]
  return (
    <Panel variant={open ? 'system' : undefined} corner={open} className="overflow-hidden">
      <button onClick={onToggle} className="w-full text-left px-5 py-4 flex items-start gap-4">
        <span className="mono text-[11px] text-system mt-1 shrink-0">{String(tech.order).padStart(2, '0')}</span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2.5 flex-wrap">
            <span className="text-[16px] font-medium">{tech.name}</span>
            <span className="mono text-[10.5px] text-muted">{tech.version}</span>
            <span className="chip !text-[10px] !py-0 !px-1.5">{tech.category}</span>
          </span>
          <span className="block text-[13px] text-bone-dim mt-1">{tech.role}</span>
        </span>
        <ArrowRight size={15} className={cx('text-muted shrink-0 mt-1 transition-transform', open && 'rotate-90')} />
      </button>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 border-t border-[var(--line)] pt-5">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 mb-5">
            <div>
              <Eyebrow className="mb-1.5">What it is</Eyebrow>
              <p className="text-[14px] text-bone-dim leading-relaxed">{tech.what}</p>
            </div>
            <div>
              <Eyebrow className="mb-1.5">Why it is here</Eyebrow>
              <p className="text-[14px] text-bone-dim leading-relaxed">{tech.why}</p>
            </div>
          </div>

          <Eyebrow system className="mb-2">How this app uses it</Eyebrow>
          <Markdown className="!max-w-none mb-5">{tech.howUsedHere}</Markdown>

          {tech.snippets.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <FileCode2 size={13} className="text-system" />
                <Eyebrow system>Real code from this repository</Eyebrow>
              </div>
              <div className="flex gap-1 mb-2 flex-wrap">
                {tech.snippets.map((sn, i) => (
                  <button key={i} className={cx('btn btn-xs', i === snippet && 'btn-system')} onClick={() => setSnippet(i)}>
                    {sn.label}
                  </button>
                ))}
              </div>
              <div className="code-block">
                <div className="px-3 py-1.5 border-b border-[var(--line)] mono text-[11px] text-muted">{s.file}</div>
                <pre>
                  <code>{s.code}</code>
                </pre>
              </div>
              <p className="text-[13px] text-bone-dim mt-2 border-l-2 border-[rgb(var(--accent-rgb)/0.5)] pl-3">{s.note}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <Panel className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={13} className="text-system" />
                <Eyebrow>Ideas it teaches</Eyebrow>
              </div>
              <ul className="space-y-1.5 text-[13px]">
                {tech.teaches.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-system shrink-0">›</span>
                    <span className="text-bone-dim">{x}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={13} className="text-ember" />
                <Eyebrow className="text-ember">Traps</Eyebrow>
              </div>
              <ul className="space-y-1.5 text-[13px]">
                {tech.gotchas.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-ember shrink-0">×</span>
                    <span className="text-bone-dim">{x}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel variant="gold" className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical size={13} className="text-gold" />
              <Eyebrow className="text-gold">Try this in the code</Eyebrow>
            </div>
            <ol className="space-y-1.5 text-[13.5px] list-decimal pl-4">
              {tech.tryThis.map((x) => (
                <li key={x} className="text-bone-dim">
                  {x}
                </li>
              ))}
            </ol>
          </Panel>

          <div className="flex gap-2 flex-wrap">
            {tech.docs.map((d) => (
              <a key={d.url} href={d.url} target="_blank" rel="noreferrer" className="btn btn-xs">
                <ExternalLink size={11} /> {d.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </Panel>
  )
}

/** The lifecycle walkthrough. */
function FlowView() {
  return (
    <div>
      <Panel variant="system" corner className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Route size={14} className="text-system" />
          <Eyebrow system>From URL to pixels</Eyebrow>
        </div>
        <p className="text-[14px] text-bone-dim">
          Seven steps happen between opening a concept and seeing it. Follow them once with the files open and the whole
          architecture stops being mysterious.
        </p>
      </Panel>
      <ol className="relative">
        <div className="absolute left-[15px] top-2 bottom-8 w-px bg-[var(--line)]" />
        {OPEN_A_PAGE.map((step, i) => (
          <Reveal key={step.title} delay={Math.min(i, 6) * 0.05}>
            <li className="relative pl-11 pb-5">
              <span className="absolute left-0 top-0 w-8 h-8 rounded-lg grid place-items-center border border-[rgb(var(--accent-rgb)/0.35)] bg-[var(--bg)] mono text-[11px] text-system">
                {i + 1}
              </span>
              <div className="text-[15px] font-medium">{step.title}</div>
              <p className="text-[13.5px] text-bone-dim mt-1 leading-relaxed">{step.detail}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {step.files.map((f) => (
                  <span key={f} className="mono text-[10.5px] text-muted px-2 py-0.5 rounded border border-[var(--line-soft)]">
                    {f}
                  </span>
                ))}
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

/** The suggested order to study, with an exercise per stage. */
function PathView({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Layers size={14} className="text-system" />
          <Eyebrow>Read in this order</Eyebrow>
        </div>
        <p className="text-[14px] text-bone-dim">
          You do not need to learn all sixteen. The first five carry almost everything; the rest are replaceable parts you
          can read when curiosity strikes.
        </p>
      </Panel>
      {LEARNING_PATH.map((stage, i) => (
        <Reveal key={stage.stage} delay={Math.min(i, 5) * 0.05}>
          <Panel variant={i === 0 ? 'system' : undefined} corner={i === 0} className="p-5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <Eyebrow system>{stage.stage}</Eyebrow>
              <span className="display text-[22px]">{stage.goal}</span>
            </div>
            <p className="text-[13.5px] text-bone-dim mt-2 leading-relaxed">{stage.advice}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {stage.techIds.map((id) => {
                const t = techById(id)
                if (!t) return null
                return (
                  <button key={id} onClick={() => onOpen(id)} className="chip chip-system hover:brightness-125">
                    {t.name}
                  </button>
                )
              })}
            </div>
          </Panel>
        </Reveal>
      ))}
    </div>
  )
}
