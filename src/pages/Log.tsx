import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Search } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useApp } from '@/store/useApp'
import { getPattern, getProblem, getConcept, patterns } from '@/lib/content'
import { SectionTitle, Panel, Eyebrow, cx } from '@/components/ui'

export default function Log() {
  const notes = useApp((s) => s.notes)
  const addNote = useApp((s) => s.addNote)
  const deleteNote = useApp((s) => s.deleteNote)
  const [q, setQ] = useState('')
  const [pattern, setPattern] = useState('all')
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [pid, setPid] = useState('')

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return notes.filter((n) => (pattern === 'all' || n.patternId === pattern) && (!s || (n.title + ' ' + n.text + ' ' + n.tags.join(' ')).toLowerCase().includes(s)))
  }, [notes, q, pattern])

  const byPattern = useMemo(() => {
    const m: Record<string, number> = {}
    for (const n of notes) if (n.patternId) m[n.patternId] = (m[n.patternId] ?? 0) + 1
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [notes])

  return (
    <div>
      <SectionTitle
        eyebrow="Mistake log"
        kanji="記"
        title="What the shadows taught you."
        right={
          <button className="btn btn-sm btn-system" onClick={() => setAdding((a) => !a)}>
            <Plus size={13} /> New note
          </button>
        }
      />
      <p className="text-bone-dim max-w-2xl -mt-2 mb-6">Every struggled problem deserves three lines: what blocked you, which pattern you missed, and what you will try next time. Re-read this log every two weeks.</p>

      {adding && (
        <Panel variant="system" corner className="p-5 mb-6">
          <div className="grid md:grid-cols-[minmax(0,1fr)_220px] gap-3">
            <input className="input" placeholder="Title, e.g. Missed the sorted-array clue" value={title} onChange={(e) => setTitle(e.target.value)} />
            <select className="input" value={pid} onChange={(e) => setPid(e.target.value)}>
              <option value="">Pattern (optional)</option>
              {patterns.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <textarea className="input mt-3" placeholder="What blocked you? Which pattern did you miss? What will you try next time?" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex gap-2 mt-3">
            <button
              className="btn btn-sm btn-system"
              disabled={!title.trim() || !text.trim()}
              onClick={() => {
                addNote({ title: title.trim(), text: text.trim(), patternId: pid || undefined, tags: pid ? [pid] : [] })
                setTitle('')
                setText('')
                setPid('')
                setAdding(false)
              }}
            >
              Save
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </Panel>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-5">
        <div>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input className="input pl-9" placeholder="Search notes…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="input !w-auto" value={pattern} onChange={(e) => setPattern(e.target.value)}>
              <option value="all">All patterns</option>
              {patterns.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          {list.length === 0 ? (
            <Panel className="p-10 text-center">
              <div className="jp text-[12px]">空白</div>
              <div className="display text-2xl mt-2">No notes yet.</div>
              <p className="text-muted text-sm mt-1">Press "Struggled" on any problem to start one.</p>
            </Panel>
          ) : (
            <div className="space-y-3">
              {list.map((n) => {
                const p = n.problemId ? getProblem(n.problemId) : undefined
                const pat = n.patternId ? getPattern(n.patternId) : undefined
                const c = n.conceptId ? getConcept(n.conceptId) : undefined
                return (
                  <Panel key={n.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[15px] font-medium">{n.title}</div>
                        <div className="text-[11.5px] text-muted mt-0.5 flex gap-2 flex-wrap">
                          <span>{format(parseISO(n.createdAt), 'd MMM yyyy, HH:mm')}</span>
                          {p && (
                            <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-system">
                              · {p.title}
                            </a>
                          )}
                          {pat && (
                            <Link to={`/patterns/${pat.id}`} className="hover:text-system">
                              · {pat.name}
                            </Link>
                          )}
                          {c && (
                            <Link to={`/learn/${c.id}`} className="hover:text-system">
                              · {c.title}
                            </Link>
                          )}
                        </div>
                      </div>
                      <button className="btn btn-xs btn-ghost text-muted" onClick={() => deleteNote(n.id)} title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <p className="text-[14px] text-bone-dim mt-3 whitespace-pre-wrap leading-relaxed">{n.text}</p>
                  </Panel>
                )
              })}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <Panel className="p-5">
            <Eyebrow className="mb-3">Where you struggle most</Eyebrow>
            {byPattern.length === 0 ? (
              <div className="text-[13px] text-muted">No pattern data yet.</div>
            ) : (
              <div className="space-y-2">
                {byPattern.map(([id, n]) => (
                  <Link key={id} to={`/patterns/${id}`} className="flex items-center justify-between text-[13px] hover:text-system">
                    <span>{getPattern(id)?.name ?? id}</span>
                    <span className={cx('mono text-[11px]', n >= 3 ? 'text-ember' : 'text-muted')}>{n}</span>
                  </Link>
                ))}
              </div>
            )}
          </Panel>
          <Panel className="p-5 text-[13px] text-bone-dim">
            <Eyebrow className="mb-2">A good note looks like</Eyebrow>
            <p className="italic">"I tried brute force pairs and timed out. The array was sorted, which should have screamed two pointers. Next time: read the constraints first, check if sorted."</p>
          </Panel>
        </div>
      </div>
    </div>
  )
}
