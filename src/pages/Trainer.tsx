import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gauge, RotateCcw } from 'lucide-react'
import { complexityQuestions } from '@/content/complexity-quiz'
import { useApp } from '@/store/useApp'
import CodeTabs from '@/components/CodeTabs'
import { SectionTitle, Panel, Eyebrow, Chip, Kanji, cx, difficultyLabel, Jp } from '@/components/ui'
import type { Difficulty } from '@/content/types'

const SIZE = 5

export default function Trainer() {
  const recordQuiz = useApp((s) => s.recordQuiz)
  const results = useApp((s) => s.quizResults)
  const [level, setLevel] = useState<Difficulty | 'mixed'>('mixed')
  const [seed, setSeed] = useState(0)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const set = useMemo(() => {
    const pool = level === 'mixed' ? complexityQuestions : complexityQuestions.filter((q) => q.difficulty === level)
    return shuffle(pool, seed).slice(0, SIZE)
  }, [level, seed])

  const q = set[i]
  const total = results.reduce((s, r) => s + r.total, 0)
  const correct = results.reduce((s, r) => s + r.correct, 0)
  const accuracy = total ? Math.round((correct / total) * 100) : 0

  const restart = (lv = level) => {
    setLevel(lv)
    setSeed((s) => s + 1)
    setI(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
  }

  const answer = (idx: number) => {
    if (picked !== null) return
    setPicked(idx)
    if (idx === q.answerIndex) setScore((s) => s + 1)
  }

  const next = () => {
    if (i + 1 >= set.length) {
      recordQuiz(score, set.length)
      setFinished(true)
    } else {
      setI((x) => x + 1)
      setPicked(null)
    }
  }

  return (
    <div>
      <SectionTitle eyebrow="Complexity trainer" kanji="鍛" title="Read code. Feel the cost." />
      <p className="text-bone-dim max-w-2xl -mt-2 mb-6">Five questions per drill. Look at the loops, the halving, the recursion, and guess the Big-O. The explanation after each answer is where the real learning happens.</p>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-5">
        <Panel variant="system" corner className="p-6 min-h-[420px]">
          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <Jp text="完了" size="md" />
                <div className="display text-[48px] text-glow mt-2">
                  {score} / {set.length}
                </div>
                <p className="text-bone-dim mt-2">{score === set.length ? 'Flawless. Your eyes are getting sharp.' : score >= 3 ? 'Solid. Re-read the ones you missed.' : 'Every miss here is a future bug caught early.'}</p>
                <div className="flex justify-center gap-2 mt-6">
                  <button className="btn btn-system" onClick={() => restart()}>
                    <RotateCcw size={14} /> Another drill
                  </button>
                </div>
              </motion.div>
            ) : q ? (
              <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eyebrow system>
                      Question {i + 1} of {set.length}
                    </Eyebrow>
                    <Chip tone={q.difficulty}>{difficultyLabel[q.difficulty]}</Chip>
                  </div>
                  <span className="mono text-[11px] text-muted">score {score}</span>
                </div>
                <div className="mt-4">
                  <CodeTabs code={q.code} />
                </div>
                <div className="display text-[24px] mt-5">{q.question}</div>
                <div className="grid sm:grid-cols-2 gap-2 mt-4">
                  {q.options.map((o, idx) => {
                    const isAns = idx === q.answerIndex
                    const isPick = idx === picked
                    return (
                      <button
                        key={o}
                        onClick={() => answer(idx)}
                        className={cx(
                          'btn justify-start mono text-[13px]',
                          picked !== null && isAns && '!border-[rgb(var(--good-rgb)/0.6)] !bg-[rgb(var(--good-rgb)/0.12)] text-jade',
                          picked !== null && isPick && !isAns && '!border-[rgb(var(--warn-rgb)/0.6)] !bg-[rgb(var(--warn-rgb)/0.12)] text-ember',
                        )}
                      >
                        {o}
                      </button>
                    )
                  })}
                </div>
                {picked !== null && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                    <Panel className="p-4">
                      <Eyebrow className={picked === q.answerIndex ? 'text-jade' : 'text-ember'}>{picked === q.answerIndex ? 'Correct' : 'Not quite'}</Eyebrow>
                      <p className="text-[14px] text-bone-dim mt-1 leading-relaxed">{q.explanation}</p>
                    </Panel>
                    <button className="btn btn-system mt-4" onClick={next}>
                      {i + 1 >= set.length ? 'Finish drill' : 'Next'}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-muted">No questions for this level.</div>
            )}
          </AnimatePresence>
        </Panel>

        <div className="space-y-4">
          <Panel className="p-5">
            <div className="flex items-center justify-between">
              <Eyebrow>Difficulty</Eyebrow>
              <Kanji>難度</Kanji>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {(['mixed', 'easy', 'medium', 'hard'] as const).map((lv) => (
                <button key={lv} className={cx('btn btn-sm justify-center capitalize', level === lv && 'btn-system')} onClick={() => restart(lv)}>
                  {lv}
                </button>
              ))}
            </div>
          </Panel>
          <Panel className="p-5">
            <div className="flex items-center gap-2">
              <Gauge size={14} className="text-system" />
              <Eyebrow>Lifetime accuracy</Eyebrow>
            </div>
            <div className="display text-[40px] mt-2 leading-none">{accuracy}%</div>
            <div className="text-[12px] text-muted mt-1">
              {correct} correct of {total} · {results.length} drills
            </div>
          </Panel>
          <Panel className="p-5 text-[13px] text-bone-dim space-y-2">
            <Eyebrow className="mb-1">Quick rules</Eyebrow>
            <div>Nested loops over n → multiply: O(n²).</div>
            <div>Halving each step → log n.</div>
            <div>Loop + binary search inside → n log n.</div>
            <div>Two loops one after another → add, keep the bigger.</div>
            <div>Recursion that branches twice with no memo → 2ⁿ.</div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice()
  let s = seed * 9301 + 49297 + Date.now() % 1000
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
