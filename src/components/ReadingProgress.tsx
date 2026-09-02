import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin line at the very top that fills as you move down a concept. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return <motion.div className="reading-progress" style={{ scaleX }} aria-hidden />
}
