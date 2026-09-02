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

/** Learning order within a concept, independent of the platform's own difficulty label. */
export type Tier = 'beginner' | 'intermediate' | 'advanced'

/** A single practice problem. `url` should point to LeetCode (preferred) or GeeksforGeeks. */
export interface Problem {
  id: string // kebab-case, globally unique, e.g. 'two-sum'
  title: string
  difficulty: Difficulty
  url: string
  patternId: string // must match a Pattern.id
  hint: string // one-sentence nudge, no full solution
  xp: number // easy 20, medium 40, hard 80
  /** Where this sits in the beginner-to-advanced ladder for its concept. */
  tier?: Tier
}

export interface Approach {
  title: string // e.g. 'Brute force: check every pair'
  description: string // 2-4 plain sentences
  time: string // e.g. 'O(n^2)'
  space: string // e.g. 'O(1)'
  code: CodeBlock
}

/** One frame of a hand-drawn walkthrough, rendered in a monospace block. */
export interface VisualFrame {
  caption: string // what this frame shows, one sentence
  /** ASCII diagram. Keep lines under 60 characters so it fits on a phone. */
  frame: string
}

/** A row of the complexity table: a case or an operation. */
export interface ComplexityRow {
  label: string // 'Best case', 'Worst case', 'Insert', 'Search' ...
  time: string // 'O(n log n)'
  space: string // 'O(1)'
  note?: string // why, in a few words
}

export interface DryRunStep {
  state: string // the variables right now, e.g. 'left=0 right=3 sum=17'
  action: string // what happens and why, one sentence
}

/** A worked trace on one concrete input. */
export interface DryRun {
  input: string // 'nums = [2, 7, 11, 15], target = 9'
  goal: string // one sentence on what we are computing
  steps: DryRunStep[] // 4-10 steps
  result: string // the final answer and how we know
}

export interface Mistake {
  mistake: string // what people write
  why: string // why it is wrong
  fix: string // what to do instead
}

/** A cross-link to another concept or pattern in the app. */
export interface RelatedTopic {
  id: string // Concept.id or Pattern.id
  kind: 'concept' | 'pattern'
  why: string // one sentence on the connection
}

export interface QuizQuestion {
  question: string
  options: string[] // 3-4 options
  answerIndex: number
  explanation: string // 1-2 sentences
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

  // --- The teaching sections. Optional in the type so the app never breaks on
  // --- partially written content, but every shipped concept fills all of them.

  /** One or two precise sentences. What it is, stated plainly. */
  definition?: string
  /** The single insight that makes the technique click. 2-4 sentences. */
  coreIdea?: string
  /** 3-6 monospace frames walking through the mechanism. */
  visual?: VisualFrame[]
  /** Language-agnostic pseudocode. Indented, no syntax from any one language. */
  pseudocode?: string
  /** Cases or operations with their costs. */
  complexity?: ComplexityRow[]
  /** A full trace on one small concrete input. */
  dryRun?: DryRun
  /** 3-5 errors people actually make, with the fix. */
  mistakes?: Mistake[]
  /** Signals that this is the right tool. */
  whenToUse?: string[]
  /** Signals that it is the wrong tool. */
  whenNotToUse?: string[]
  /** Cross-links into the rest of the curriculum. */
  relatedTopics?: RelatedTopic[]
  /** 3-5 checks the reader can answer straight after reading. */
  quiz?: QuizQuestion[]
  /** Which references informed this write-up. Names only, no quoted text. */
  sources?: string[]
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
