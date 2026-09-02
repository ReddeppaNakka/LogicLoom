import { useRef, useState } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { useApp } from '@/store/useApp'
import { WEEKDAY_SHORT } from '@/lib/dates'
import { LANG_LABEL } from '@/components/CodeTabs'
import type { Lang } from '@/content/types'
import { SectionTitle, Panel, Eyebrow, cx } from '@/components/ui'
import { totals } from '@/lib/content'

export default function SettingsPage() {
  const profile = useApp((s) => s.profile)
  const update = useApp((s) => s.updateProfile)
  const exportJson = useApp((s) => s.exportJson)
  const importJson = useApp((s) => s.importJson)
  const resetAll = useApp((s) => s.resetAll)
  const push = useApp((s) => s.pushMessage)
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirm, setConfirm] = useState(false)

  const toggleDay = (d: number) => {
    const days = profile.studyDays.includes(d) ? profile.studyDays.filter((x) => x !== d) : [...profile.studyDays, d].sort()
    if (days.length) update({ studyDays: days })
  }

  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `the-system-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onFile = async (f: File | undefined) => {
    if (!f) return
    const ok = importJson(await f.text())
    push(ok ? { kind: 'info', title: 'Progress restored', body: 'Your backup has been loaded.' } : { kind: 'info', title: 'Import failed', body: 'That file does not look like a System backup.' })
  }

  return (
    <div className="max-w-[760px]">
      <SectionTitle eyebrow="Settings" kanji="設" title="Configure the System." />

      <Panel className="p-6 mb-5">
        <Eyebrow className="mb-4">Hunter profile</Eyebrow>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>
            <span className="eyebrow">Name</span>
            <input className="input mt-2" value={profile.name} onChange={(e) => update({ name: e.target.value })} />
          </label>
          <label>
            <span className="eyebrow">Start date</span>
            <input type="date" className="input mt-2" value={profile.startDate} onChange={(e) => update({ startDate: e.target.value })} />
          </label>
          <label>
            <span className="eyebrow">Session length</span>
            <select className="input mt-2" value={profile.sessionMinutes} onChange={(e) => update({ sessionMinutes: Number(e.target.value) })}>
              <option value={60}>60 minutes</option>
              <option value={75}>75 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
            </select>
          </label>
          <div>
            <span className="eyebrow">Main language</span>
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
                <button key={l} className={cx('btn btn-sm justify-center', profile.preferredLang === l && 'btn-system')} onClick={() => update({ preferredLang: l })}>
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <span className="eyebrow">Study days</span>
          <div className="flex gap-2 mt-2 flex-wrap">
            {WEEKDAY_SHORT.map((d, i) => (
              <button key={d} className={cx('btn btn-sm w-[52px] justify-center', profile.studyDays.includes(i) && 'btn-system')} onClick={() => toggleDay(i)}>
                {d}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-muted mt-2">Rest days never break your streak. Reviews that fall due still show up on them.</p>
        </div>
      </Panel>

      <Panel className="p-6 mb-5">
        <Eyebrow className="mb-2">Backup</Eyebrow>
        <p className="text-[13.5px] text-bone-dim mb-4">Progress lives in this browser only. Export a backup now and then, and import it on a new device or after clearing the browser.</p>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-system" onClick={download}>
            <Download size={14} /> Export progress
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> Import backup
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      </Panel>

      <Panel className="p-6 mb-5">
        <Eyebrow className="mb-2">Content</Eyebrow>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
          <div><div className="display text-[26px]">{totals.gates}</div><div className="text-muted">gates</div></div>
          <div><div className="display text-[26px]">{totals.concepts}</div><div className="text-muted">concepts</div></div>
          <div><div className="display text-[26px]">{totals.patterns}</div><div className="text-muted">patterns</div></div>
          <div><div className="display text-[26px]">{totals.problems}</div><div className="text-muted">problems</div></div>
        </div>
      </Panel>

      <Panel variant="danger" className="p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-ember" />
          <Eyebrow className="text-ember">Danger zone</Eyebrow>
        </div>
        <p className="text-[13.5px] text-bone-dim mt-2">Reset wipes every quest, XP, note and attempt. Export first.</p>
        {!confirm ? (
          <button className="btn btn-danger mt-4" onClick={() => setConfirm(true)}>
            Reset everything
          </button>
        ) : (
          <div className="flex gap-2 mt-4">
            <button className="btn btn-danger" onClick={() => { resetAll(); setConfirm(false) }}>
              Yes, wipe it all
            </button>
            <button className="btn" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </div>
        )}
      </Panel>
    </div>
  )
}
