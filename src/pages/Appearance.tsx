import { motion } from 'framer-motion'
import { Check, RotateCcw, Sparkles, BookOpen, Waves, Type } from 'lucide-react'
import { useApp } from '@/store/useApp'
import {
  THEMES,
  BACKGROUNDS,
  MOTION_LEVELS,
  READING_SIZES,
  READING_WIDTHS,
  getBackground,
  type BackgroundId,
} from '@/lib/appearance'
import { SectionTitle, Panel, Eyebrow, Kanji, cx } from '@/components/ui'

export default function Appearance() {
  const a = useApp((s) => s.appearance)
  const set = useApp((s) => s.setAppearance)
  const reset = useApp((s) => s.resetAppearance)

  return (
    <div>
      <SectionTitle
        eyebrow="Appearance"
        kanji="彩"
        title="Make it yours."
        right={
          <button className="btn btn-sm" onClick={reset}>
            <RotateCcw size={13} /> Reset to default
          </button>
        }
      />
      <p className="text-bone-dim max-w-2xl -mt-2 mb-8">
        Every change applies straight away and is remembered. If moving backgrounds break your concentration, set the reading
        background to something still and leave the rest lively.
      </p>

      {/* Themes */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Eyebrow system>Colour theme</Eyebrow>
          <Kanji>色</Kanji>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEMES.map((t) => {
            const active = a.theme === t.id
            return (
              <button key={t.id} onClick={() => set({ theme: t.id })} className="text-left group">
                <Panel variant={active ? 'system' : undefined} corner={active} className="p-4 h-full transition-all group-hover:border-[rgb(var(--accent-rgb)/0.45)]">
                  <div className="flex items-center gap-3">
                    <div className="flex rounded-lg overflow-hidden border border-[var(--line)] shrink-0" style={{ width: 64, height: 40 }}>
                      {t.swatch.map((c, i) => (
                        <span key={i} style={{ background: c, width: i === 0 ? '40%' : '20%' }} />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[14.5px] font-medium">{t.name}</span>
                        {active && <Check size={14} className="text-system" />}
                      </div>
                      <div className="text-[11.5px] text-muted">{t.light ? 'Light' : 'Dark'}</div>
                    </div>
                  </div>
                  <p className="text-[12.5px] text-muted mt-3">{t.note}</p>
                </Panel>
              </button>
            )
          })}
        </div>
      </section>

      {/* Backgrounds */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <Eyebrow system>Background while browsing</Eyebrow>
          <Kanji>背景</Kanji>
        </div>
        <p className="text-[13px] text-muted mb-4">Used on the status window, gates, calendar, problems and log.</p>
        <BackgroundGrid value={a.background} onPick={(id) => set({ background: id })} />
      </section>

      {/* Reading background */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen size={14} className="text-system" />
          <Eyebrow system>Background while reading and practising</Eyebrow>
        </div>
        <p className="text-[13px] text-muted mb-4">
          Used on concepts, patterns, the trainer, boss fights and the scratchpad.
        </p>
        <Panel className="p-4 mb-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[14px]">Use the same background everywhere</div>
            <div className="text-[12px] text-muted">Turn this on if you want one look across the whole app.</div>
          </div>
          <Toggle on={a.sameBackgroundEverywhere} onChange={(v) => set({ sameBackgroundEverywhere: v })} />
        </Panel>
        {!a.sameBackgroundEverywhere && (
          <BackgroundGrid value={a.readingBackground} onPick={(id) => set({ readingBackground: id })} warnAnimated />
        )}
      </section>

      {/* Motion */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Waves size={14} className="text-system" />
          <Eyebrow system>Motion</Eyebrow>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {MOTION_LEVELS.map((m) => (
            <button key={m.id} onClick={() => set({ motion: m.id })} className="text-left">
              <Panel variant={a.motion === m.id ? 'system' : undefined} className="p-4 h-full">
                <div className="flex items-center gap-2">
                  <span className="text-[14.5px] font-medium">{m.name}</span>
                  {a.motion === m.id && <Check size={14} className="text-system" />}
                </div>
                <p className="text-[12.5px] text-muted mt-1">{m.note}</p>
              </Panel>
            </button>
          ))}
        </div>
      </section>

      {/* Reading comfort */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Type size={14} className="text-system" />
          <Eyebrow system>Reading comfort</Eyebrow>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Panel className="p-5">
            <Eyebrow className="mb-3">Text size</Eyebrow>
            <div className="grid grid-cols-3 gap-2">
              {READING_SIZES.map((s) => (
                <button key={s.id} className={cx('btn btn-sm justify-center', a.readingSize === s.id && 'btn-system')} onClick={() => set({ readingSize: s.id })}>
                  {s.name}
                </button>
              ))}
            </div>
            <Eyebrow className="mb-3 mt-5">Line width</Eyebrow>
            <div className="grid grid-cols-3 gap-2">
              {READING_WIDTHS.map((w) => (
                <button key={w.id} className={cx('btn btn-sm justify-center', a.readingWidth === w.id && 'btn-system')} onClick={() => set({ readingWidth: w.id })}>
                  {w.name}
                </button>
              ))}
            </div>
          </Panel>
          <Panel className="p-5">
            <Eyebrow className="mb-3">Texture</Eyebrow>
            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <div className="text-[14px]">Film grain</div>
                <div className="text-[12px] text-muted">A faint noise layer over everything.</div>
              </div>
              <Toggle on={a.grain} onChange={(v) => set({ grain: v })} />
            </div>
            <div className="hairline my-2" />
            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <div className="text-[14px]">Sheet behind text</div>
                <div className="text-[12px] text-muted">Lifts long passages off the background.</div>
              </div>
              <Toggle on={a.readingSheet} onChange={(v) => set({ readingSheet: v })} />
            </div>
          </Panel>
        </div>
      </section>

      {/* Live preview */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={14} className="text-system" />
          <Eyebrow system>Preview</Eyebrow>
        </div>
        <Panel variant="system" corner className="p-6">
          <Eyebrow system>Gate 02 · Concept 3</Eyebrow>
          <h3 className="display text-[32px] mt-1">Two Pointers: Walk from Both Ends</h3>
          <div className="prose-sys mt-4">
            <p>
              Two pointers turns many <code>O(n^2)</code> problems into <code>O(n)</code> by using structure in the data. If you learn
              only one array technique, learn this one.
            </p>
            <ul>
              <li>Opposite ends: they move toward each other.</li>
              <li>Same direction: a fast pointer reads, a slow one writes.</li>
            </ul>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="chip chip-easy">Easy</span>
            <span className="chip chip-medium">Medium</span>
            <span className="chip chip-hard">Hard</span>
            <span className="chip chip-system">pattern</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn btn-sm btn-system">Primary action</button>
            <button className="btn btn-sm">Secondary</button>
          </div>
        </Panel>
      </section>
    </div>
  )
}

function BackgroundGrid({ value, onPick, warnAnimated }: { value: BackgroundId; onPick: (id: BackgroundId) => void; warnAnimated?: boolean }) {
  const groups = [
    { label: 'Still', note: 'Nothing moves.', items: BACKGROUNDS.filter((b) => !b.animated) },
    { label: 'Moving', note: 'These animate continuously.', items: BACKGROUNDS.filter((b) => b.animated) },
  ]
  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="flex items-baseline gap-2 mb-2.5">
            <Eyebrow>{g.label}</Eyebrow>
            <span className="text-[11.5px] text-muted">{g.note}</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {g.items.map((b) => {
              const active = value === b.id
              const discourage = warnAnimated && b.animated
              return (
                <button key={b.id} onClick={() => onPick(b.id)} className="text-left group">
                  <Panel
                    variant={active ? 'system' : undefined}
                    corner={active}
                    className="p-0 h-full overflow-hidden transition-all group-hover:border-[rgb(var(--accent-rgb)/0.45)] group-hover:-translate-y-0.5"
                  >
                    <div className="relative h-[86px] overflow-hidden border-b border-[var(--line)]" style={{ background: 'var(--bg)' }}>
                      <BackgroundThumb id={b.id} />
                      {active && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[rgb(var(--accent-rgb)/0.95)] grid place-items-center">
                          <Check size={12} style={{ color: 'var(--bg)' }} />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13px] font-medium">{b.name}</span>
                        {discourage && <span className="text-[10px] text-ember">avoid here</span>}
                      </div>
                      <p className="text-[11px] text-muted mt-0.5 leading-snug">{b.note}</p>
                    </div>
                  </Panel>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * A small rendering of each background. The thumb class raises --tex-boost and
 * shrinks --tex-scale, so a texture that is nearly invisible at full size reads
 * clearly in an 86 pixel card.
 */
function BackgroundThumb({ id }: { id: BackgroundId }) {
  const def = getBackground(id)
  if (id === 'motes') {
    // The canvas cannot be miniaturised cheaply, so show its frozen equivalent.
    return <div className="bg-thumb bg-stars" />
  }
  if (!def.className) return null
  return <div className={cx('bg-thumb', def.className)} />
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={cx(
        'relative w-[46px] h-[26px] rounded-full border transition-colors shrink-0',
        on ? 'bg-[rgb(var(--accent-rgb)/0.25)] border-[rgb(var(--accent-rgb)/0.6)]' : 'bg-[rgb(var(--fg-rgb)/0.06)] border-[var(--line)]',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 34 }}
        className={cx('absolute top-[3px] w-[18px] h-[18px] rounded-full', on ? 'bg-system' : 'bg-[rgb(var(--fg-rgb)/0.4)]')}
        style={{ left: on ? 24 : 3 }}
      />
    </button>
  )
}
