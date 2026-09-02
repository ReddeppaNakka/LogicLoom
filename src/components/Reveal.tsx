import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Gentle one-time reveal as a block scrolls into view.
 *
 * Short distance and a slow ease, so it reads as the page settling rather than
 * as movement competing with the text. Respects prefers-reduced-motion via the
 * `reduce` prop supplied by the caller when needed.
 */
export default function Reveal({ children, delay = 0, className, y = 12 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px 0px -80px 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
