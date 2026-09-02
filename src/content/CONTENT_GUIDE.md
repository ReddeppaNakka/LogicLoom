# Content writing guide

Audience: a working adult who knows basic Python (loops, functions, lists, dicts) but has NEVER learned
how to reduce time/space complexity or which technique fits which problem. They study 90 minutes a day
after work and are tired. Write like a calm, friendly mentor. Simple English. Short sentences. No jargon
without a one-line definition. Every idea gets a concrete tiny example.

## Files and types
- Types live in `src/content/types.ts`. Import them with `import type { Concept } from '../types'` (or `'./types'` for files directly in src/content).
- Gate definitions live in `src/content/gates.ts`. Concept ids MUST match `conceptIds` there exactly.
- Concept files: `src/content/concepts/<gateId>.ts` exporting `export const concepts: Concept[] = [...]`.
- Pattern files: `src/content/patterns/part1.ts` and `part2.ts` exporting `export const patterns: Pattern[] = [...]`.

## Canonical pattern ids (use ONLY these in patternId / patternIds)
two-pointers, sliding-window, prefix-sum, kadane, binary-search, binary-search-on-answer, divide-and-conquer,
cyclic-sort, backtracking, fast-slow-pointers, in-place-reversal, monotonic-stack, hash-map, tree-traversal,
dfs, bfs, top-k-heap, two-heaps, k-way-merge, topological-sort, union-find, shortest-path, dp-1d, dp-2d,
knapsack, lcs-lis, greedy, merge-intervals, bit-manipulation, trie, brute-force, recursion

## Problem ids
Use the LeetCode URL slug as the id, e.g. url https://leetcode.com/problems/two-sum/ => id 'two-sum'.
This keeps ids unique across files and lets patterns reference problems from concepts.
XP: easy 20, medium 40, hard 80. Every problem needs a real LeetCode URL. Prefer well-known problems
from NeetCode 150 / Striver A2Z / Blind 75.

## Code rules
- `python` is required in every CodeBlock. Also provide `javascript`, `java`, and `cpp` for every
  CodeBlock in `naive`, `optimized` and pattern `template`. Keep each snippet short (8-30 lines) and runnable-looking.
- Write code inside TypeScript template literals (backticks). INSIDE a template literal you MUST escape
  every backtick as \` and every `${` as `\${`. Avoid backticks in code where possible (in JS use
  string concatenation instead of template strings).
- Markdown `explanation` fields are also template literals; code fences there must be written as
  \`\`\`python ... \`\`\` (escaped backticks).
- Do not use tabs. Use 4-space indentation in Python, 2-space in JS/Java/C++.

## Style for `explanation` (Markdown)
- Start with a 2-3 sentence "what is this and why care".
- Use `##` headings such as "The idea", "A tiny example", "Step by step", "Where people go wrong".
- Use bullet lists. Keep paragraphs to 2-3 sentences. 300-600 words.
- Always show the SLOW way first and then the FAST way and explain what changed in complexity.
- End with a short "How to recognise it in an interview" section (clues in the problem statement).

## Verification
After writing, run from the project root:
  npx tsc --noEmit -p tsconfig.app.json
and fix every error in the files you wrote. Also make sure each file `export`s exactly the named symbol.
