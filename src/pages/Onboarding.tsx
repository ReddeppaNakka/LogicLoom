import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '@/components/AppBackground'
import { useApp } from '@/store/useApp'
import { todayKey, WEEKDAY_SHORT } from '@/lib/dates'
import type { Lang } from '@/content/types'
import { LANG_LABEL } from '@/components/CodeTabs'
import { cx, Jp } from '@/components/ui'
import { totals } from '@/lib/content'

const ease = [0.16, 1, 0.3, 1] as const

export default function Onboarding() {
  const complete = useApp((s) => s.completeOnboarding)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [lang, setLang] = useState<Lang>('python')
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6])
  const [start, setStart] = useState(todayKey())
  const [minutes, setMinutes] = useState(90)

  const toggleDay = (d: number) => setDays((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d].sort()))

  const finish = () => complete({ name: name.trim() || 'Hunter', preferredLang: lang, studyDays: days.length ? days : [1, 2, 3, 4, 5, 6], startDate: start, sessionMinutes: minutes })

  return (
    <div className="grain min-h-screen relative overflow-hidden">
      <AppBackground id="motes" motion="full" />
      <div className="relative z-10 min-h-screen grid place-items-center px-5 py-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 1.2, ease }} className="text-center max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1, ease }}><Jp text="覚醒" size="md" /></motion.div>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2, ease }} className="display text-[54px] md:text-[84px] leading-[0.95] mt-4">
                You have been
                <br />
                <span className="text-system text-glow">selected.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 1 }} className="text-bone-dim mt-6 text-[16px] max-w-lg mx-auto leading-relaxed">
                Thirteen gates. {totals.concepts} concepts. {totals.problems} problems. Ninety minutes a day, and the System remembers everything you miss.
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }} className="text-muted mt-3 text-[13px]">
                Built for one hunter who works full time and studies after hours.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 1 }} className="mt-10">
                <button className="btn btn-system px-7 py-3 text-[14px]" onClick={() => setStep(1)}>
                  Accept the quest
                </button>
                <div className="eyebrow mt-6 cue">Cross the threshold</div>
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.9, ease }} className="panel panel-system corner system-scan w-[min(640px,100%)] p-8 md:p-10">
              <Jp text="登録" size="md" />
              <div className="eyebrow eyebrow-system mt-1">Hunter registration</div>
              <h2 className="display text-[38px] mt-2">Tell the System who you are.</h2>

              <label className="block mt-8">
                <span className="eyebrow">Your name</span>
                <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Hunter" autoFocus />
              </label>

              <div className="mt-6">
                <span className="eyebrow">Main language</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
                    <button key={l} onClick={() => setLang(l)} className={cx('btn justify-center', lang === l && 'btn-system')}>
                      {LANG_LABEL[l]}
                    </button>
                  ))}
                </div>
                <p className="text-[12px] text-muted mt-2">Code is shown in your language first. The other languages stay one click away.</p>
              </div>

              <div className="mt-6">
                <span className="eyebrow">Study days</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {WEEKDAY_SHORT.map((d, i) => (
                    <button key={d} onClick={() => toggleDay(i)} className={cx('btn btn-sm w-[52px] justify-center', days.includes(i) && 'btn-system')}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <label className="block">
                  <span className="eyebrow">Start date</span>
                  <input type="date" className="input mt-2" value={start} onChange={(e) => setStart(e.target.value)} />
                </label>
                <label className="block">
                  <span className="eyebrow">Session length</span>
                  <select className="input mt-2" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
                    <option value={60}>60 minutes</option>
                    <option value={75}>75 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button className="btn btn-ghost" onClick={() => setStep(0)}>
                  Back
                </button>
                <button className="btn btn-system px-6" onClick={finish}>
                  Awaken
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
