# Filling the teaching sections

Each `Concept` in `src/content/concepts/*.ts` already has: id, gateId, order, title, minutes,
summary, analogy, explanation, naive, optimized, whyFaster, keyPoints, patternIds, problems.

Your job is to **add** the new fields below to every concept in your files. Do not delete or rewrite
existing fields except where this guide says to adjust them. Types are in `src/content/types.ts`.

## Research and originality

Consult MIT OpenCourseWare (6.006 / 6.046), CLRS, CP-Algorithms, USACO Guide, CSES Handbook,
Codeforces EDU/blogs, VisuAlgo, LeetCode and AtCoder editorials to check that every claim is right,
especially complexity bounds and edge cases.

**Write everything in your own words.** Never paste a sentence, a table, or a code block from a
source. If two sources disagree (a common case for average-case bounds), state the standard result
and say what it assumes. List the references you actually used in `sources` as plain names, for
example `['CLRS ch. 6', 'CP-Algorithms: Heap', 'MIT 6.006 Lecture 4']`. No URLs, no quotations.

## Audience

A working adult who knows basic Python, studies 90 minutes after work, and is preparing for product
company interviews. They do not know how to reduce complexity or how to pick a technique. Simple
English. Short sentences. Concrete numbers over abstractions. No unexplained jargon.

## The fields

### `definition` (string)
One or two sentences. Precise enough that a textbook would accept it, plain enough that a beginner
reads it once. No analogy here, that comes next.

### `coreIdea` (string)
2-4 sentences naming the one insight that makes the technique work. Usually of the form "because X
is true, we never need to do Y, so the cost drops from A to B."

### `visual` (VisualFrame[], 3-6 items)
ASCII frames showing the mechanism moving. Keep every line under 60 characters. Use real values, not
placeholders. Escape backticks in template literals. Example shape for two pointers:

```
{
  caption: 'Start at both ends. 2 + 15 = 17, too big.',
  frame: [
    'idx   0    1    2    3',
    'val [ 2 ][ 7 ][11 ][15 ]',
    '      ^L                ^R',
    'sum = 17  >  target 9  ->  move R left',
  ].join('\n'),
}
```

Build frames with an array and `.join('\n')` so alignment survives editing.

### `pseudocode` (string)
Language agnostic. Use `function`, `for each`, `while`, `return`, indentation. No Python-only or
C-only syntax. 8-25 lines. This is the thing a reader copies onto paper in an interview.

### `complexity` (ComplexityRow[], 2-5 rows)
Rows are either cases (Best / Average / Worst) or operations (Insert / Search / Delete). Always give
both time and space. Put the reason in `note` in a few words. Be honest about amortised versus
worst-case, and say when a bound assumes a good hash or a balanced tree.

### `dryRun` (DryRun)
One small concrete input, 4-10 steps. `state` lists the live variables as they are at that moment.
`action` says what happens and why. `result` gives the answer and how we know it is right. This must
match the `optimized` code exactly, so a reader can follow along line by line.

### `mistakes` (Mistake[], 3-5 items)
Real errors, not generic advice. Each has what people write, why it breaks, and what to do instead.
Prefer mistakes that cost people interviews: off-by-one in a loop bound, forgetting duplicates,
mutating a list while iterating, integer overflow in other languages, wrong base case.

### `whenToUse` / `whenNotToUse` (string[], 3-5 each)
Short signal phrases a reader can match against a problem statement. `whenNotToUse` must name the
better alternative, for example "the array is unsorted and you cannot sort it, use a hash map".

### `relatedTopics` (RelatedTopic[], 2-5 items)
`id` must be a real `Concept.id` from `src/content/gates.ts` or a canonical pattern id from
`CONTENT_GUIDE.md`. Set `kind` accordingly. `why` is one sentence naming the actual connection.

### `quiz` (QuizQuestion[], 3-5 items)
Answerable straight after reading the page. Test understanding, not recall of a number. At least one
question should be a complexity judgement and one a "would this approach work here" judgement.
Distractors must be plausible: the answer someone gives when they half-understand.

### `problems`: add `tier`
Give every existing problem a `tier` of `'beginner'`, `'intermediate'` or `'advanced'`. Roughly the
first two are beginner, the middle are intermediate, the last one or two are advanced. Keep the
existing ids, urls, hints and xp untouched.

## Mechanics

- Inside template literals escape every backtick as `` \` `` and every `${` as `\${`.
- No tabs. Keep the existing formatting style of the file.
- When done run from the project root:
  `npx tsc --noEmit -p tsconfig.app.json` and `npm run check`
  and fix every error in **your** files.
