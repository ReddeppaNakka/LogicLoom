// ---------------------------------------------------------------------------
// Content model for The System (DSA trainer).
// All learning content is static data typed against these interfaces.
// ---------------------------------------------------------------------------

export type Lang = 'python' | 'javascript' | 'java' | 'cpp'

/** Code in several languages. Python is required; others are optional but preferred. */
export interface CodeBlock {
  python: string
  javascript?: string
  java?: string
  cpp?: string
}

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

/** A single practice problem. `url` should point to LeetCode (preferred) or GeeksforGeeks. */
export interface Problem {
  id: string // kebab-case, globally unique, e.g. 'two-sum'
  title: string
  difficulty: Difficulty
  url: string
  patternId: string // must match a Pattern.id
  hint: string // one-sentence nudge, no full solution
  xp: number // easy 20, medium 40, hard 80
}

export interface Approach {
  title: string // e.g. 'Brute force: check every pair'
  description: string // 2-4 plain sentences
  time: string // e.g. 'O(n^2)'
  space: string // e.g. 'O(1)'
  code: CodeBlock
}

/** One learnable unit (~25-30 min of reading). Belongs to exactly one Gate. */
export interface Concept {
  id: string // kebab-case, globally unique, e.g. 'two-pointers-basics'
  gateId: string // must match a Gate.id
  order: number // 1-based order inside the gate
  title: string
  minutes: number // reading time estimate, usually 20-30
  summary: string // one sentence, shown on cards
  analogy: string // a real-life analogy in 2-3 sentences
  /** Markdown. Simple English, short paragraphs, use ## headings, bullet lists, and ```python fences. 300-600 words. */
  explanation: string
  naive?: Approach // the obvious slow way
  optimized?: Approach // the better way
  whyFaster?: string // 2-4 sentences explaining what changed in complexity and why
  keyPoints: string[] // 3-6 bullets to remember
  patternIds: string[] // Pattern.id values used here
  problems: Problem[] // 3-8 problems, easy -> hard
}

/** A reusable problem-solving technique. */
export interface Pattern {
  id: string // kebab-case, e.g. 'sliding-window'
  name: string
  tagline: string // one line: what it does
  /** Clues in a problem statement that hint this pattern. 4-8 short phrases. */
  triggers: string[]
  /** Situations where people misuse it. 2-4 short phrases. */
  avoidWhen: string[]
  /** Markdown. 200-400 words. Explain the idea, a tiny worked example, and the steps to apply. */
  explanation: string
  time: string
  space: string
  template: CodeBlock // generic reusable skeleton with comments
  relatedGateIds: string[]
  exampleProblemIds: string[] // 3-6 Problem.id values that appear in concepts
}

/** A decision-tree node for "which pattern should I use?". */
export interface DecisionNode {
  id: string
  question: string // e.g. 'Is the input sorted?'
  options: { label: string; next?: string; patternId?: string }[]
}

/** A complexity quiz question. */
export interface ComplexityQuestion {
  id: string
  code: CodeBlock // short snippet, python required
  question: string // usually 'What is the time complexity?'
  options: string[] // 4 options, e.g. ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)']
  answerIndex: number
  explanation: string // 2-3 sentences
  difficulty: Difficulty
}

/** A major topic area, presented as a dungeon gate. */
export interface Gate {
  id: string
  order: number
  name: string // plain name, e.g. 'Arrays & Strings'
  codename: string // dungeon-style name, e.g. 'The Endless Corridor'
  rank: Rank // difficulty rank of the gate
  description: string // 1-2 sentences
  conceptIds: string[] // ordered
  patternIds: string[]
}
