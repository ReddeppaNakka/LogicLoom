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
