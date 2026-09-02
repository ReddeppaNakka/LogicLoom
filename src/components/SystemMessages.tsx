import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp, type SystemMessage } from '@/store/useApp'
import { levelFromXp, rankTitle, rankColor } from '@/lib/xp'
import { RankBadge } from './ui'

/** Toast stack (bottom-right) for XP / quest events, and a full-screen overlay for level-ups and rank-ups. */
export default function SystemMessages() {
  const messages = useApp((s) => s.messages)
  const dismiss = useApp((s) => s.dismissMessage)
  const totalXp = useApp((s) => s.totalXp)

  const toasts = messages.filter((m) => m.kind !== 'levelup' && m.kind !== 'rankup').slice(-3)
  const big = messages.find((m) => m.kind === 'levelup' || m.kind === 'rankup')

  const firstId = toasts[0]?.id
  useEffect(() => {
    if (!firstId) return
    const t = setTimeout(() => dismiss(firstId), 3000)
    return () => clearTimeout(t)
  }, [firstId, dismiss])

  const info = levelFromXp(totalXp)

  return (
    <>
      <div className="fixed right-4 bottom-4 z-[60] flex flex-col gap-2 w-[320px] max-w-[calc(100vw-2rem)] pointer-events-none">
        <AnimatePresence>
          {toasts.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="panel panel-system corner px-4 py-3 pointer-events-auto cursor-pointer"
              onClick={() => dismiss(m.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="eyebrow eyebrow-system">{label(m)}</div>
                  <div className="text-[14px] font-medium mt-0.5 truncate">{m.title}</div>
                  {m.body && <div className="text-[12px] text-bone-dim mt-0.5 line-clamp-2">{m.body}</div>}
                </div>
                {typeof m.amount === 'number' && (
                  <div className="display text-[22px] text-system text-glow shrink-0">+{m.amount}</div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {big && (
          <motion.div
            key={big.id}
            className="fixed inset-0 z-[70] grid place-items-center bg-[rgba(5,7,10,0.72)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dismiss(big.id)}
          >
            <motion.div
              initial={{ scale: 0.86, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="panel panel-system corner system-scan px-10 py-10 text-center w-[min(520px,92vw)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="jp text-[12px]">通知</div>
              <div className="eyebrow eyebrow-system mt-2">System notification</div>
              <div className="flex justify-center my-6">
                <RankBadge rank={info.rank} size={96} />
              </div>
              <div className="display text-[44px] leading-none text-glow" style={{ color: big.kind === 'rankup' ? rankColor[info.rank] : undefined }}>
                {big.title}
              </div>
              <div className="text-bone-dim mt-3">{big.body}</div>
              <div className="text-[12px] text-muted mt-1">
                {rankTitle[info.rank]} · Level {info.level}
              </div>
              <button className="btn btn-system mt-8" onClick={() => dismiss(big.id)}>
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function label(m: SystemMessage) {
  switch (m.kind) {
    case 'xp':
      return 'Experience gained'
    case 'quest':
      return 'Quest update'
    default:
      return 'System'
  }
}
