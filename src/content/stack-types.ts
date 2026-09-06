// ---------------------------------------------------------------------------
// "Under the hood": the front-end stack this app is built from, explained.
//
// The point of difference from a tutorial is that every snippet is real code
// from this repository, with the file it lives in. The reader can open the file
// beside the explanation and see the thing working.
// ---------------------------------------------------------------------------

export type TechCategory =
  | 'language'
  | 'framework'
  | 'build'
  | 'styling'
  | 'routing'
  | 'state'
  | 'motion'
  | 'graphics'
  | 'content'
  | 'tooling'

export interface TechSnippet {
  /** What this excerpt demonstrates. */
  label: string
  /** Repo-relative path the excerpt was taken from. */
  file: string
  /** Real code from that file, trimmed to the teaching point. */
  code: string
  /** What to notice, and why it is written this way. */
  note: string
}

export interface Tech {
  id: string
  name: string
  /** Version range from package.json, or the platform it belongs to. */
  version: string
  category: TechCategory
  /** One line: the job it does in this app. */
  role: string
  /** Plain definition for someone meeting it for the first time. */
  what: string
  /** Why it is here rather than an alternative, including the honest trade-off. */
  why: string
  /** Markdown. Where it shows up across the codebase. */
  howUsedHere: string
  snippets: TechSnippet[]
  /** The transferable front-end ideas this piece teaches. */
  teaches: string[]
  /** Concrete exercises against this codebase. */
  tryThis: string[]
  /** Things that bit during the build, so the reader can skip the bruise. */
  gotchas: string[]
  docs: { label: string; url: string }[]
  /** Suggested order to study, 1 upward. */
  order: number
}

export interface StackLayer {
  id: TechCategory
  name: string
  blurb: string
  techIds: string[]
}

/** A step in the "what happens when you open a page" walkthrough. */
export interface FlowStep {
  title: string
  detail: string
  files: string[]
}

// ---------------------------------------------------------------------------
// The deep study material for one technology. Where `Tech` explains how this
// app uses a piece, `TechDeep` teaches the piece itself: the ideas underneath,
// how it works inside, what it looks like in the wild, and a lab to build a
// miniature of it by hand.
// ---------------------------------------------------------------------------

import type { VisualFrame, QuizQuestion } from './types'

/** One fundamental idea, with a standalone example that runs on its own. */
export interface DeepConcept {
  title: string
  /** Markdown, 80-200 words. Explain as if to someone who has never seen it. */
  body: string
  /** Optional standalone code (not from this repo). */
  code?: string
  /** Language label for the code: ts, tsx, css, js, yaml, html, sh, py. */
  lang?: string
}

/** One step of the build-it-yourself lab. */
export interface BuildStep {
  title: string
  body: string
  code: string
  lang?: string
}

export interface TechDeep {
  /** A real-life analogy in 2-4 sentences. */
  analogy: string
  /** Markdown. Who made it, when, and the problem it was built to solve. */
  origins: string
  /** 5-8 core ideas, in learning order. */
  concepts: DeepConcept[]
  /** A frame-by-frame monospace walkthrough of the central mechanism. */
  visual: { title: string; intro: string; frames: VisualFrame[] }
  /** Markdown with ## headings. How it works inside, 400-900 words. */
  internals: string
  /** A miniature built from scratch in 3-6 steps. */
  buildIt: { title: string; intro: string; steps: BuildStep[] }
  /** Real products and teams, and what they use it for. */
  inTheWild: { who: string; what: string }[]
  /** Alternatives and when each one is the better pick. */
  alternatives: { name: string; pick: string }[]
  glossary: { term: string; meaning: string }[]
  /** 5-6 questions. */
  quiz: QuizQuestion[]
}
