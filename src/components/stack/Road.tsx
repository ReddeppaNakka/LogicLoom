import { motion } from 'framer-motion'
import { LEARNING_PATH } from '@/content/stack-overview'
import { techById } from '@/lib/stack'

/**
 * The learning path as a winding road. Milestones alternate sides of a dashed
 * spine that carries a slow current; each card slides in from its side.
 */
export default function Road({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="relative">
      {/* Spine */}
      <svg className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block" width="60" height="100%" preserveAspectRatio="none" viewBox="0 0 60 1000" aria-hidden>
        <path className="stack-road" d="M30 0 C 30 200, 30 200, 30 400 S 30 800, 30 1000" />
      </svg>

      <div className="space-y-10 md:space-y-16">
        {LEARNING_PATH.map((stage, i) => {
          const left = i % 2 === 0
          return (
            <div key={stage.stage} className={['md:grid md:grid-cols-2 md:gap-16 items-center', left ? '' : ''].join(' ')}>
              <motion.div
                initial={{ opacity: 0, x: left ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={['relative', left ? 'md:col-start-1' : 'md:col-start-2'].join(' ')}
              >
                {/* Milestone dot on the spine */}
                <span className={['hidden md:block absolute top-8 w-4 h-4 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)] shadow-[0_0_18px_rgb(var(--accent-rgb)/0.7)]', left ? '-right-[42px]' : '-left-[42px]'].join(' ')} />
                <div className="stack-tile p-6 md:p-8">
                  <div className="flex items-baseline gap-3">
                    <span className="stack-hero-num !text-[56px] md:!text-[72px]">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="eyebrow eyebrow-system">{stage.stage}</div>
                      <div className="display text-[26px] md:text-[30px] leading-tight mt-1">{stage.goal}</div>
                    </div>
                  </div>
                  <p className="text-[14px] text-bone-dim mt-4 leading-relaxed">{stage.advice}</p>
                  <div className="flex gap-2 mt-5 flex-wrap">
                    {stage.techIds.map((id) => {
                      const t = techById(id)
                      return t ? (
                        <button key={id} onClick={() => onOpen(id)} className="chip chip-system hover:brightness-125">{t.name}</button>
                      ) : null
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
