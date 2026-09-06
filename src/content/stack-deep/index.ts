import type { TechDeep } from '../stack-types'
import { typescriptDeep } from './typescript'
import { reactDeep } from './react'
import { viteDeep } from './vite'
import { tailwindDeep } from './tailwind'
import { reactRouterDeep } from './react-router'
import { zustandDeep } from './zustand'
import { framerMotionDeep } from './framer-motion'
import { cssArchDeep } from './css-arch'
import { webStorageDeep } from './web-storage'
import { lucideDeep } from './lucide'
import { threeDeep } from './three'
import { rechartsDeep } from './recharts'
import { monacoDeep } from './monaco'
import { reactMarkdownDeep } from './react-markdown'
import { dateFnsDeep } from './date-fns'
import { ghActionsDeep } from './gh-actions'

/** Deep study material, keyed by Tech.id. Every technology must have one. */
export const DEEP: Record<string, TechDeep> = {
  typescript: typescriptDeep,
  react: reactDeep,
  vite: viteDeep,
  tailwind: tailwindDeep,
  'react-router': reactRouterDeep,
  zustand: zustandDeep,
  'framer-motion': framerMotionDeep,
  'css-arch': cssArchDeep,
  'web-storage': webStorageDeep,
  lucide: lucideDeep,
  three: threeDeep,
  recharts: rechartsDeep,
  monaco: monacoDeep,
  'react-markdown': reactMarkdownDeep,
  'date-fns': dateFnsDeep,
  'gh-actions': ghActionsDeep,
}
