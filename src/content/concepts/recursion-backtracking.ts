import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'recursion-basics',
    gateId: 'recursion-backtracking',
    order: 1,
    title: 'Recursion Basics',
    minutes: 25,
    summary: 'A function that calls itself on a smaller input, stopping at a base case, is the foundation of trees, graphs, DP and backtracking.',
    analogy:
      'Imagine you are standing in a long queue and want to know your position. You ask the person in front: "what is your position?" They ask the person in front of them, and so on. The first person answers "1". Each person adds 1 to the answer they receive and passes it back. Nobody counted the whole line; each person solved one tiny piece.',
    explanation: `Recursion is when a function solves a problem by calling itself on a smaller version of the same problem. It feels like magic at first, but it is just two rules: a **base case** (the smallest input you can answer directly) and a **recursive case** (shrink the input and trust the function to handle the rest). You care because trees, graphs, backtracking and dynamic programming are all written this way.

## The idea

- Every recursive function needs a base case. Without it the calls never stop and you get a "maximum recursion depth" error.
- Every recursive call must move toward the base case. Usually that means a smaller number, a shorter list, or a child node.
- Trust the call. When you write \`fact(n - 1)\`, assume it already returns the right answer. Do not try to trace every level in your head.

## A tiny example

Factorial of 4 is 4 * 3 * 2 * 1.

\`\`\`python
def fact(n):
    if n <= 1:          # base case
        return 1
    return n * fact(n - 1)   # recursive case
\`\`\`

The calls stack up: fact(4) waits for fact(3), which waits for fact(2), which waits for fact(1). Then the answers return in reverse order: 1, 2, 6, 24.

## The call stack costs memory

Each waiting call sits on the **call stack** (a list of unfinished function calls the computer keeps). A recursion that goes n levels deep uses O(n) extra space, even if you never create a list. Python limits this depth to about 1000 by default, so for very deep problems you either raise the limit or switch to a loop.

## Step by step: the slow way and the fast way

Fibonacci is the classic example. fib(n) = fib(n - 1) + fib(n - 2).

The slow way calls itself twice per level. fib(5) calls fib(4) and fib(3); fib(4) again calls fib(3). The same sub-problem is solved over and over. The number of calls roughly doubles each level, so the time is O(2^n). fib(40) takes seconds; fib(50) takes minutes.

The fast way remembers each answer in a dictionary the first time it is computed. This is called **memoization** (a cache for function results). Now each fib(k) is computed once, so the time is O(n). The space is also O(n) for the cache and the stack.

\`\`\`python
def fib(n, memo={}):
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
\`\`\`

## Where people go wrong

- Forgetting the base case, or writing one that is never reached (for example checking \`n == 0\` when n can go negative).
- Mutating a shared list inside the recursion and forgetting to undo it.
- Using recursion when a simple loop is cleaner. Summing a list does not need recursion.
- Not noticing repeated sub-problems. If you draw the call tree and see the same node twice, you need memoization (this is the door to dynamic programming).

## How to recognise it in an interview

- The problem is defined in terms of itself: "the answer for n depends on the answer for n - 1".
- The data is nested: trees, folders inside folders, JSON inside JSON.
- You must "try all ways" or "count all ways". That is recursion, and often backtracking or DP on top.
- The input can be split into halves that are solved the same way (merge sort, pow(x, n)). That is divide and conquer, which is recursion with a merge step.`,
    naive: {
      title: 'Plain recursion: recompute every sub-problem',
      description:
        'fib(n) calls fib(n - 1) and fib(n - 2). Both of those call fib(n - 3), and the overlap grows quickly. The call tree has roughly 2^n nodes, so the work explodes for n around 40.',
      time: 'O(2^n)',
      space: 'O(n)',
      code: {
        python: `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))  # 55, but fib(45) is painfully slow`,
        javascript: `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(10)); // 55`,
        java: `class Solution {
  static int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
  }

  public static void main(String[] args) {
    System.out.println(fib(10)); // 55
  }
}`,
        cpp: `#include <iostream>
using namespace std;

int fib(int n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

int main() {
  cout << fib(10) << endl; // 55
}`,
      },
    },
    optimized: {
      title: 'Memoized recursion: solve each sub-problem once',
      description:
        'Keep a dictionary from n to fib(n). Before computing, check the dictionary. After computing, store the result. Every value of n is now computed exactly once.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def fib(n, memo=None):
    if memo is None:
        memo = {}
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

print(fib(45))  # 1134903170, instantly`,
        javascript: `function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}

console.log(fib(45)); // 1134903170`,
        java: `import java.util.*;

class Solution {
  static Map<Integer, Long> memo = new HashMap<>();

  static long fib(int n) {
    if (n < 2) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long result = fib(n - 1) + fib(n - 2);
    memo.put(n, result);
    return result;
  }

  public static void main(String[] args) {
    System.out.println(fib(45)); // 1134903170
  }
}`,
        cpp: `#include <iostream>
#include <unordered_map>
using namespace std;

unordered_map<int, long long> memo;

long long fib(int n) {
  if (n < 2) return n;
  if (memo.count(n)) return memo[n];
  return memo[n] = fib(n - 1) + fib(n - 2);
}

int main() {
  cout << fib(45) << endl; // 1134903170
}`,
      },
    },
    whyFaster:
      'The plain version solves fib(k) many times because the call tree branches twice at every level, giving about 2^n calls. The memoized version stores each fib(k) after the first computation, so there are only n distinct calls that do real work. We trade O(n) memory for the cache to bring time from exponential down to linear.',
    keyPoints: [
      'Every recursive function needs a base case and a step that moves toward it.',
      'Trust the recursive call: assume it returns the correct answer for the smaller input.',
      'Recursion depth costs O(depth) stack memory even with no extra data structures.',
      'If the same sub-problem is solved twice, add a memo dictionary. That is the start of DP.',
      'Divide and conquer is recursion where you split the input, solve both halves, and merge.',
    ],
    definition:
      'A recursive function solves a problem by calling itself on a smaller version of the same problem, and stops at a base case it can answer directly. Every unfinished call waits on the call stack until the call it made returns.',
    coreIdea:
      'If a problem can be described in terms of a smaller copy of itself, you never have to plan the whole computation. You only write down the base case and one step, and the machine keeps track of everything else on the call stack. The cost to watch is that the same smaller problem may be asked for many times, and caching those answers is exactly what turns an exponential call tree into a linear one.',
    visual: [
      {
        caption: 'fact(4) cannot answer yet, so it calls fact(3) and waits. Each waiting call is a frame on the stack.',
        frame: [
          'call stack, newest at the bottom',
          '+----------------------+',
          '| fact(4)   waiting    |',
          '+----------------------+',
          '| fact(3)   waiting    |',
          '+----------------------+',
        ].join('\n'),
      },
      {
        caption: 'Every level pushes one more frame. The stack is now 4 deep, and that depth is the O(n) memory cost.',
        frame: [
          '+----------------------+',
          '| fact(4)   waiting    |',
          '| fact(3)   waiting    |',
          '| fact(2)   waiting    |',
          '| fact(1)   BASE CASE  |',
          '+----------------------+',
          'depth = 4  ->  O(n) stack memory',
        ].join('\n'),
      },
      {
        caption: 'The base case returns 1 and the stack unwinds, each level doing its multiplication on the way out.',
        frame: [
          'fact(1) returns 1',
          'fact(2) returns 2 * 1 = 2',
          'fact(3) returns 3 * 2 = 6',
          'fact(4) returns 4 * 6 = 24',
          'stack is empty again, answer 24',
        ].join('\n'),
      },
      {
        caption: 'fib(5) with no cache. Follow the indentation: whole sub-trees are computed more than once.',
        frame: [
          'fib(5)',
          '+-- fib(4)',
          '|   +-- fib(3)',
          '|   |   +-- fib(2)',
          '|   |   +-- fib(1)',
          '|   +-- fib(2)        <- fib(2) again',
          '+-- fib(3)            <- the whole sub-tree again',
          '    +-- fib(2)',
          '    +-- fib(1)',
        ].join('\n'),
      },
      {
        caption: 'With a memo dictionary the repeats become O(1) lookups and the tree collapses to a line.',
        frame: [
          'fib(5)',
          '+-- fib(4)',
          '|   +-- fib(3)',
          '|   |   +-- fib(2)  computed once, stored',
          '|   |   +-- fib(1)  base case',
          '|   +-- fib(2)      cache hit, O(1)',
          '+-- fib(3)          cache hit, O(1)',
          'real work: fib(2)..fib(5), one call each',
          'so 2^n shrinks to n',
        ].join('\n'),
      },
      {
        caption: 'Depth is a hard limit, not just a cost. Python stops at roughly 1000 nested calls by default.',
        frame: [
          'sum of 1,000 items, recursive:  depth 1000, risky',
          'sum of 100,000 items, recursive: RecursionError',
          'the same sum with a for loop:    O(1) extra space',
          'rule: deep and linear -> loop',
          '      branching or nested -> recursion',
        ].join('\n'),
      },
    ],
    pseudocode: `function solve(input):
    if input is small enough to answer directly:   // base case
        return the direct answer
    smaller = shrink(input)          // must move toward the base case
    partial = solve(smaller)         // trust this call to be correct
    return combine(input, partial)

function factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

function fibMemo(n, cache):
    if n < 2:
        return n
    if cache contains n:
        return cache[n]
    value = fibMemo(n - 1, cache) + fibMemo(n - 2, cache)
    cache[n] = value
    return value`,
    complexity: [
      { label: 'factorial(n)', time: 'O(n)', space: 'O(n)', note: 'one call per level, and the stack holds all n frames' },
      { label: 'fib(n) with no cache', time: 'O(2^n)', space: 'O(n)', note: 'the call tree branches twice per level, but only one path is on the stack' },
      { label: 'fib(n) memoized', time: 'O(n)', space: 'O(n)', note: 'each of the n values is computed once; cache plus stack' },
      { label: 'Divide and conquer, T(n) = 2T(n/2) + O(n)', time: 'O(n log n)', space: 'O(log n)', note: 'log2(n) levels with linear work at each level' },
      { label: 'Linear recursion rewritten as a loop', time: 'O(n)', space: 'O(1)', note: 'no stack frames at all, and no depth limit' },
    ],
    dryRun: {
      input: 'fib(6) using the optimized memoized version, starting with memo = None',
      goal: 'Compute the 6th Fibonacci number while computing each smaller value exactly once.',
      steps: [
        { state: 'n=6, memo={}', action: 'memo is created empty, and 6 is not below 2, so we need fib(5) + fib(4). The call to fib(5) goes first.' },
        { state: 'n=5 -> n=4 -> n=3 -> n=2', action: 'Nothing is cached yet, so each call splits again and the stack grows down to fib(2).' },
        { state: 'n=2, memo={}', action: 'fib(2) calls fib(1) and fib(0). Both are below 2 and return 1 and 0 immediately.' },
        { state: 'memo={2: 1}', action: 'fib(2) stores 1 in memo and returns it. That is the first cache entry.' },
        { state: 'n=3, memo={2: 1}', action: 'fib(3) adds its own fib(2) result of 1 to fib(1) which is 1, and stores memo[3] = 2.' },
        { state: 'memo={2: 1, 3: 2}', action: 'fib(4) needs fib(3) and fib(2). Both are now cache hits, so it stores memo[4] = 3 with no further recursion.' },
        { state: 'memo={2: 1, 3: 2, 4: 3}', action: 'fib(5) adds fib(4) = 3 and fib(3) = 2 straight from the cache and stores memo[5] = 5.' },
        { state: 'memo={2: 1, 3: 2, 4: 3, 5: 5}', action: 'Back at the top, fib(6) still needs its second call fib(4). It is already stored, so it costs one dictionary lookup.' },
        { state: 'fib(5)=5, fib(4)=3', action: 'fib(6) returns 5 + 3 = 8 and stores memo[6] = 8 on the way out.' },
      ],
      result:
        'Returns 8, the 6th Fibonacci number counting fib(0) = 0. It is correct because every value was built from the two below it, and a cached value is never overwritten once stored.',
    },
    mistakes: [
      {
        mistake: 'Writing a base case the recursion can jump straight over, such as if n == 0 when n drops by 2 each call.',
        why: 'From an odd start the argument goes 3, 1, -1, -3 and never equals 0, so the calls continue until the stack overflows.',
        fix: 'Use a range test such as if n <= 0, so any value at or past the boundary stops the recursion.',
      },
      {
        mistake: 'Using a mutable default argument, for example def fib(n, memo={}).',
        why: 'In Python that dictionary is created once when the function is defined and shared by every later call, so results leak between separate calls and between test cases.',
        fix: 'Default to None and build a fresh dictionary inside the function, exactly as the optimized code above does.',
      },
      {
        mistake: 'Recursing over a list by slicing, such as solve(items[1:]).',
        why: 'Each slice copies the rest of the list, so an O(n) recursion quietly becomes O(n^2) in both time and memory.',
        fix: 'Pass an index instead of a slice and read items[i] directly. The recursion shape is identical and the copying disappears.',
      },
      {
        mistake: 'Using deep recursion for a plain linear scan of 100,000 items.',
        why: 'Python raises RecursionError at roughly 1000 nested calls, and even in languages without that limit each frame costs real memory.',
        fix: 'Rewrite plain linear recursion as a loop. Keep recursion for branching structures such as trees, grids and search.',
      },
      {
        mistake: 'Adding a cache but keying it on only part of the state.',
        why: 'If the answer depends on two parameters and you cache by one, different sub-problems overwrite each other and the results are wrong, not merely slow.',
        fix: 'Make the cache key the full tuple of arguments the answer actually depends on, and nothing that it does not.',
      },
    ],
    whenToUse: [
      'The statement defines the answer for n in terms of n - 1, or in terms of halves.',
      'The data is nested: trees, nested lists, folders inside folders, JSON inside JSON.',
      'You must try every option or count every way, which is a branching search.',
      'The input splits into independent halves solved the same way, which is divide and conquer.',
      'You see the same sub-problem more than once in the call tree, which points to memoization and then to dynamic programming.',
    ],
    whenNotToUse: [
      'A single pass over a list or a running total, where a plain for loop is shorter and uses O(1) space.',
      'Depth could reach 100,000 or more, since the stack will overflow; convert to an explicit stack or a loop.',
      'Sub-problems overlap heavily and you cannot cache them, so plain recursion is exponential; use tabulated dynamic programming.',
      'You need the fewest steps in a graph or grid, where breadth-first search finds it and depth-first recursion does not.',
      'A closed formula exists, such as the sum of 1..n, where recursion is slower and adds nothing.',
    ],
    relatedTopics: [
      { id: 'subsets-and-permutations', kind: 'concept', why: 'Backtracking is this same recursion with an explicit undo after every choice.' },
      { id: 'dp-intro-memo-and-tabulation', kind: 'concept', why: 'Memoized recursion is exactly top-down dynamic programming.' },
      { id: 'merge-sort', kind: 'concept', why: 'A concrete divide-and-conquer recursion with a merge step at each level.' },
      { id: 'tree-basics-and-traversals', kind: 'concept', why: 'Tree traversals are the most common recursive shape in interviews.' },
      { id: 'recursion', kind: 'pattern', why: 'This concept is the base template for that pattern.' },
    ],
    quiz: [
      {
        question: 'What are the time and stack space of the plain, uncached fib(n)?',
        options: [
          'O(n) time, O(n) space',
          'O(2^n) time and O(n) space, because the tree branches twice but is only n levels deep',
          'O(2^n) time and O(2^n) space',
          'O(n log n) time, O(log n) space',
        ],
        answerIndex: 1,
        explanation: 'The two recursive calls run one after the other, so the stack ever holds only one root-to-leaf path, which is n frames.',
      },
      {
        question: 'Why does writing def fib(n, memo={}) cause trouble in Python?',
        options: [
          'Dictionaries cannot hold integers',
          'The default dictionary is created once and shared by every call to fib, so state leaks between separate uses',
          'It is slower than using a list',
          'It breaks the base case',
        ],
        answerIndex: 1,
        explanation: 'Default arguments are evaluated once at definition time. The fix is to default to None and create the dictionary inside.',
      },
      {
        question: 'You must add up a list of 200,000 numbers. Is recursion a good choice?',
        options: [
          'Yes, it reads more cleanly',
          'No, it would nest 200,000 calls and hit the recursion limit; a for loop is O(n) with O(1) space',
          'Yes, if you add a memo dictionary',
          'Only when the list is sorted',
        ],
        answerIndex: 1,
        explanation: 'A memo does not help here because no sub-problem repeats. The recursion is linear and deep, which is exactly the case a loop handles better.',
      },
      {
        question: 'A recursive function calls itself twice per level and reaches depth n. What is the maximum stack depth?',
        options: ['2^n', 'n, because only one branch is on the stack at any moment', 'n^2', '1'],
        answerIndex: 1,
        explanation: 'The first call fully finishes and pops before the second one starts, so the stack holds one path from root to leaf, not the whole tree.',
      },
      {
        question: 'You draw the call tree and see solve(3, 2) appear four separate times. What does that tell you?',
        options: [
          'The base case is wrong',
          'The sub-problems overlap, so caching on the key (3, 2) turns the exponential tree into linear work',
          'Recursion is the wrong tool for this problem entirely',
          'You should sort the input first',
        ],
        answerIndex: 1,
        explanation: 'Repeated identical calls are the signature of overlapping sub-problems, which is the entry point to dynamic programming.',
      },
    ],
    sources: [
      'MIT 6.006: recursion and memoization',
      'CLRS ch. 4 (recurrences) and ch. 15 (dynamic programming)',
      'CP-Algorithms: Recursion and divide and conquer',
      'USACO Guide: Introduction to Recursion',
      'Python language documentation on the recursion limit',
    ],
    patternIds: ['recursion', 'divide-and-conquer'],
    problems: [
      {
        id: 'reverse-string',
        title: 'Reverse String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/reverse-string/',
        patternId: 'recursion',
        hint: 'Swap the first and last characters, then recurse on the part in between.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'fibonacci-number',
        title: 'Fibonacci Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/fibonacci-number/',
        patternId: 'recursion',
        hint: 'Write the two-line recursion first, then add a memo dictionary and watch the speed change.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        patternId: 'recursion',
        hint: 'To reach step n you came from step n - 1 or step n - 2, so ways(n) = ways(n - 1) + ways(n - 2).',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'powx-n',
        title: 'Pow(x, n)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/powx-n/',
        patternId: 'divide-and-conquer',
        hint: 'x^n is (x^(n/2))^2 when n is even, so compute the half once and square it.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'k-th-symbol-in-grammar',
        title: 'K-th Symbol in Grammar',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-th-symbol-in-grammar/',
        patternId: 'recursion',
        hint: 'The k-th symbol in row n depends only on the (k+1)//2-th symbol in row n - 1 and whether k is odd or even.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'subsets-and-permutations',
    gateId: 'recursion-backtracking',
    order: 2,
    title: 'Subsets and Permutations',
    minutes: 30,
    summary: 'Generate every combination or ordering by building a partial answer, recursing, and undoing your last choice.',
    analogy:
      'Think of packing a bag for a trip. For each item you make one decision: take it or leave it. Try "take", pack the rest, then unpack it and try "leave". Do this for every item and you will have laid out every possible bag. That is backtracking: choose, explore, un-choose.',
    explanation: `Many interview questions ask you to list every possible selection (subsets, combinations) or every possible ordering (permutations). The tool is **backtracking**: build a partial answer one choice at a time, recurse to complete it, then undo the choice and try the next one. You care because this one template solves dozens of "generate all" problems.

## The idea

- Keep a \`path\` list that holds the partial answer you are building.
- At each step, decide what choices are available. For subsets it is "take the next item or skip it". For permutations it is "any item not used yet".
- Make a choice (append to path), recurse, then **undo** it (pop from path). The undo is the "back" in backtracking.
- When the path is complete, copy it into the results. Copy, because the same path list is reused.

## A tiny example: subsets of [1, 2]

Start with an empty path. At index 0 you can take 1 or skip it.

- Take 1 -> path [1]. At index 1 take 2 -> [1, 2] (done). Undo -> [1]. Skip 2 -> [1] (done). Undo -> [].
- Skip 1 -> path []. Take 2 -> [2] (done). Undo. Skip 2 -> [] (done).

Result: [1, 2], [1], [2], []. Four subsets, which is 2^2.

## Step by step

The slow way for permutations is to generate every sequence of length n where each slot can be any element (n^n sequences), then throw away the ones with repeats. For n = 8 that is 16 million sequences to filter down to 40 thousand valid ones.

The fast way tracks a \`used\` array. At each slot you only try elements that are not used yet. You never build an invalid sequence, so the work is proportional to the output: O(n * n!) because there are n! permutations and copying each costs n.

\`\`\`python
def permute(nums):
    res, path = [], []
    used = [False] * len(nums)

    def go():
        if len(path) == len(nums):
            res.append(path[:])      # copy!
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            go()
            path.pop()               # undo
            used[i] = False
    go()
    return res
\`\`\`

For subsets, replace \`used\` with a \`start\` index. Only pick elements at or after \`start\`, so [1, 2] and [2, 1] are not both produced.

## Handling duplicates

If the input has repeated values, sort it first. Then inside the loop skip an element if it equals the previous element and the previous one was not taken at this level: \`if i > start and nums[i] == nums[i - 1]: continue\`. This gives each unique subset exactly once.

## Where people go wrong

- Appending \`path\` itself instead of a copy. Every result then points to the same empty list.
- Forgetting the undo step, so choices leak into sibling branches.
- Using a \`start\` index for permutations (misses orderings) or a \`used\` array for subsets (produces duplicates).
- Expecting these to be fast. The output itself is exponential. The goal is to not do extra work beyond the output size.

## How to recognise it in an interview

- "Return all possible ..." subsets, combinations, permutations, arrangements.
- The input is tiny (n up to about 10 or 15). That is a giant hint that an exponential answer is expected.
- Combinations of k items, letter combinations of a phone number, all ways to split something.`,
    naive: {
      title: 'Generate every sequence, then filter the valid ones',
      description:
        'Build all n^n sequences where each slot can hold any element, then keep only the ones with no repeated element. Almost all of the generated sequences are thrown away.',
      time: 'O(n^n * n)',
      space: 'O(n)',
      code: {
        python: `def permute(nums):
    n = len(nums)
    res = []

    def go(path):
        if len(path) == n:
            if len(set(path)) == n:   # only keep no-repeat ones
                res.append(path[:])
            return
        for x in nums:                # any element, even if used
            path.append(x)
            go(path)
            path.pop()
    go([])
    return res`,
        javascript: `function permute(nums) {
  const n = nums.length;
  const res = [];
  function go(path) {
    if (path.length === n) {
      if (new Set(path).size === n) res.push(path.slice());
      return;
    }
    for (const x of nums) {
      path.push(x);
      go(path);
      path.pop();
    }
  }
  go([]);
  return res;
}`,
        java: `import java.util.*;

class Solution {
  List<List<Integer>> res = new ArrayList<>();

  public List<List<Integer>> permute(int[] nums) {
    go(nums, new ArrayList<>());
    return res;
  }

  void go(int[] nums, List<Integer> path) {
    if (path.size() == nums.length) {
      if (new HashSet<>(path).size() == nums.length) res.add(new ArrayList<>(path));
      return;
    }
    for (int x : nums) {
      path.add(x);
      go(nums, path);
      path.remove(path.size() - 1);
    }
  }
}`,
        cpp: `#include <vector>
#include <set>
using namespace std;

class Solution {
  vector<vector<int>> res;
  void go(vector<int>& nums, vector<int>& path) {
    if (path.size() == nums.size()) {
      if (set<int>(path.begin(), path.end()).size() == nums.size()) res.push_back(path);
      return;
    }
    for (int x : nums) {
      path.push_back(x);
      go(nums, path);
      path.pop_back();
    }
  }
public:
  vector<vector<int>> permute(vector<int>& nums) {
    vector<int> path;
    go(nums, path);
    return res;
  }
};`,
      },
    },
    optimized: {
      title: 'Backtracking with a used array',
      description:
        'At each slot only try elements that are not used yet. Mark it used, recurse, then unmark it. No invalid sequence is ever built, so the work matches the size of the output.',
      time: 'O(n * n!)',
      space: 'O(n)',
      code: {
        python: `def permute(nums):
    res, path = [], []
    used = [False] * len(nums)

    def go():
        if len(path) == len(nums):
            res.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            go()
            path.pop()
            used[i] = False
    go()
    return res`,
        javascript: `function permute(nums) {
  const res = [];
  const path = [];
  const used = new Array(nums.length).fill(false);
  function go() {
    if (path.length === nums.length) {
      res.push(path.slice());
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      go();
      path.pop();
      used[i] = false;
    }
  }
  go();
  return res;
}`,
        java: `import java.util.*;

class Solution {
  List<List<Integer>> res = new ArrayList<>();

  public List<List<Integer>> permute(int[] nums) {
    go(nums, new ArrayList<>(), new boolean[nums.length]);
    return res;
  }

  void go(int[] nums, List<Integer> path, boolean[] used) {
    if (path.size() == nums.length) {
      res.add(new ArrayList<>(path));
      return;
    }
    for (int i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.add(nums[i]);
      go(nums, path, used);
      path.remove(path.size() - 1);
      used[i] = false;
    }
  }
}`,
        cpp: `#include <vector>
using namespace std;

class Solution {
  vector<vector<int>> res;
  void go(vector<int>& nums, vector<int>& path, vector<bool>& used) {
    if (path.size() == nums.size()) {
      res.push_back(path);
      return;
    }
    for (int i = 0; i < (int)nums.size(); i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push_back(nums[i]);
      go(nums, path, used);
      path.pop_back();
      used[i] = false;
    }
  }
public:
  vector<vector<int>> permute(vector<int>& nums) {
    vector<int> path;
    vector<bool> used(nums.size(), false);
    go(nums, path, used);
    return res;
  }
};`,
      },
    },
    whyFaster:
      'The naive version explores n^n sequences and checks each one at the end, so almost all of its work is wasted on sequences that repeat an element. The backtracking version refuses to place a used element, so every branch it explores leads to a valid permutation. The total work becomes O(n * n!), which is exactly the size of the output and cannot be beaten.',
    keyPoints: [
      'Backtracking template: choose, recurse, un-choose. Never forget the undo.',
      'Append a copy of path to the results, not the path itself.',
      'Subsets and combinations use a start index; permutations use a used array.',
      'Sort first and skip equal neighbours to avoid duplicate results.',
      'The output is exponential; aim to do no extra work beyond the output size.',
    ],
    definition:
      'Backtracking builds an answer one choice at a time: it appends a choice to a partial answer, recurses to finish the rest, then removes that choice before trying the next one. Subsets keep a start index so order does not matter; permutations keep a used flag so each element appears exactly once.',
    coreIdea:
      'Every "generate all" answer is a leaf of a decision tree, and the path from the root down to that leaf is the sequence of choices that built it. Instead of storing a separate list for every path, you reuse one list and undo the last choice on the way back up, so the memory you hold is the depth of the tree, not its size. Because you only ever extend legal partial answers, the work is proportional to the number of answers you output, which is the best any algorithm can do.',
    visual: [
      {
        caption: 'Subsets of [1, 2] as a decision tree. At each level you either take the next item or skip it.',
        frame: [
          '[]',
          '+-- take 1 -> [1]',
          '|   +-- take 2 -> [1,2]   record',
          '|   +-- skip 2 -> [1]     record',
          '+-- skip 1 -> []',
          '    +-- take 2 -> [2]     record',
          '    +-- skip 2 -> []      record',
          '4 leaves = 4 subsets = 2^2',
        ].join('\n'),
      },
      {
        caption: 'The same run seen as one shared path list. Watch the pushes and pops; the list is never copied except when recorded.',
        frame: [
          'path []       record []',
          ' push 1  ->   [1]        record [1]',
          '  push 2 ->   [1,2]      record [1,2]',
          '  pop 2  ->   [1]',
          ' pop 1   ->   []',
          ' push 2  ->   [2]        record [2]',
          ' pop 2   ->   []',
        ].join('\n'),
      },
      {
        caption: 'The undo is what keeps sibling branches clean. Drop the pop and choices leak sideways.',
        frame: [
          'correct: push 1, recurse, pop 1, push 2, recurse',
          'buggy:   push 1, recurse,        push 2, recurse',
          'buggy path on the "2" branch:   [1, 2]',
          'correct path on the "2" branch: [2]',
        ].join('\n'),
      },
      {
        caption: 'Permutations of [1, 2, 3]. The used flags block any value already sitting on the path.',
        frame: [
          'level 0  used=[F F F]  choices: 1, 2, 3',
          'level 1  picked 1, used=[T F F]  choices: 2, 3',
          'level 2  picked 2, used=[T T F]  choice: 3 only',
          'level 3  picked 3, path=[1,2,3]  ->  record a copy',
          'then pop and unmark on the way back up',
        ].join('\n'),
      },
      {
        caption: 'The tree narrows: 3 choices, then 2, then 1. No branch is wasted, but the leaf count explodes.',
        frame: [
          'branching  3 * 2 * 1 = 6 leaves = 3!',
          'n = 8   ->  8!  = 40,320',
          'n = 10  ->  10! = 3,628,800',
          'n = 12  ->  12! = 479,001,600, already too slow',
          'so n above about 10 is not a permutation problem',
        ].join('\n'),
      },
      {
        caption: 'Sorted input with a repeated value. Skipping an equal value at the same level deletes the duplicate branch.',
        frame: [
          'nums = [1, 2, 2]',
          'at the level with start = 1:',
          '  try i=1 (value 2)  ->  explore this branch',
          '  try i=2 (value 2)  ->  identical branch',
          'rule: i > start and nums[i] == nums[i-1]  ->  skip',
          'result: [1,2] is produced once, not twice',
        ].join('\n'),
      },
    ],
    pseudocode: `// subsets: order does not matter, so only ever look forward
function exploreSubsets(nums, start, path, result):
    add a copy of path to result       // every node is a subset
    for i from start to length(nums) - 1:
        append nums[i] to path         // choose
        exploreSubsets(nums, i + 1, path, result)
        remove the last item of path   // un-choose

// permutations: order matters, so any unused value may come next
function explorePermutations(nums, used, path, result):
    if length(path) == length(nums):
        add a copy of path to result
        return
    for i from 0 to length(nums) - 1:
        if used[i]: continue
        used[i] = true
        append nums[i] to path
        explorePermutations(nums, used, path, result)
        remove the last item of path
        used[i] = false

// start either one with an empty path and an empty result:
// subsets with start = 0, permutations with all used = false`,
    complexity: [
      { label: 'All subsets of n items', time: 'O(n * 2^n)', space: 'O(n)', note: '2^n subsets and each copy costs up to n; path depth is n' },
      { label: 'All permutations of n items', time: 'O(n * n!)', space: 'O(n)', note: 'n! results, each copied in O(n); used array and path are O(n)' },
      { label: 'Combinations of k from n', time: 'O(k * C(n, k))', space: 'O(k)', note: 'one copy of length k per result' },
      { label: 'Output size alone', time: 'at least 2^n or n!', space: 'size of the output', note: 'you cannot beat the cost of writing the answers down' },
      { label: 'Naive generate-then-filter permutations', time: 'O(n * n^n)', space: 'O(n)', note: 'builds n^n sequences and throws almost all of them away' },
    ],
    dryRun: {
      input: 'nums = [1, 2, 3], using the optimized permute with the used array',
      goal: 'Produce every ordering of the three numbers exactly once.',
      steps: [
        { state: 'path=[] used=[F,F,F] res=[]', action: 'path is shorter than nums, so the loop tries i = 0. Mark used[0] and push 1.' },
        { state: 'path=[1] used=[T,F,F]', action: 'Recurse. i = 0 is used so it is skipped; i = 1 is free, so mark used[1] and push 2.' },
        { state: 'path=[1,2] used=[T,T,F]', action: 'Recurse again. Only i = 2 is free, so mark used[2] and push 3.' },
        { state: 'path=[1,2,3] used=[T,T,T]', action: 'The length now equals len(nums), so append the copy [1, 2, 3] to res and return.' },
        { state: 'res=[[1,2,3]] path=[1,2]', action: 'Undo the last choice: pop 3 and set used[2] back to False. That level has no more free indexes, so it returns too.' },
        { state: 'path=[1] used=[T,F,F]', action: 'Back at level 1, pop 2 and clear used[1]. The loop continues with i = 2, giving path [1, 3].' },
        { state: 'path=[1,3] used=[T,F,T]', action: 'Only i = 1 is free now, so this branch finishes as [1, 3, 2] and copies it into res.' },
        { state: 'res has [1,2,3] and [1,3,2]; path=[]', action: 'Level 1 unwinds fully, then level 0 pops 1 and clears used[0]. The loop moves to i = 1 and starts a branch with 2.' },
        { state: 'branches starting with 2, then with 3', action: 'The same shape produces [2,1,3], [2,3,1], then [3,1,2] and [3,2,1].' },
      ],
      result:
        'res is [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]], all 3! = 6 permutations with no repeats. Every branch places a distinct unused value in each slot, so nothing is missed and nothing is produced twice.',
    },
    mistakes: [
      {
        mistake: 'Appending path itself instead of a copy of it.',
        why: 'res then holds many references to the same list object, and by the time the search finishes that list is empty, so every result is [].',
        fix: 'Always append a copy: path[:] in Python, path.slice() in JavaScript, new ArrayList<>(path) in Java.',
      },
      {
        mistake: 'Forgetting the undo, that is calling the recursion without popping afterwards.',
        why: 'The choice stays on path when the loop moves to the next sibling, so later branches pick up values from branches you already left.',
        fix: 'Keep choose, recurse, un-choose as one visible three-line block and never separate them or return in the middle of it.',
      },
      {
        mistake: 'Using a start index for permutations, or a used array for subsets.',
        why: 'A start index forbids going back to earlier elements, so [2, 1] is never produced. A used array without a start lets the same subset appear in several orders.',
        fix: 'If order matters, use the used array. If order does not matter, use a start index and recurse with i + 1.',
      },
      {
        mistake: 'Removing duplicate results at the end with a set of tuples.',
        why: 'You still walked every duplicate branch, so the running time is unchanged and the memory is worse. The set only hides the symptom.',
        fix: 'Sort the input, then inside the loop skip nums[i] when i > start and nums[i] equals nums[i - 1], so the duplicate branch is never entered.',
      },
      {
        mistake: 'Recursing with explore(start + 1) instead of explore(i + 1) inside the subsets loop.',
        why: 'start does not move with the loop variable, so an element can be chosen again lower down and you get combinations with repetition instead of subsets.',
        fix: 'Pass i + 1, which pins the next level to everything strictly after the element just chosen.',
      },
    ],
    whenToUse: [
      '"Return all possible ..." subsets, combinations, permutations or arrangements.',
      'n is small, roughly up to 10 for permutations and up to 20 for subsets, which signals that an exponential answer is intended.',
      'Each position in the answer is a choice from a fixed small set, such as the letters on a phone key.',
      'You need every way to split or partition a string or an array.',
      'You must count arrangements and no formula is obvious, so honest enumeration is the starting point.',
    ],
    whenNotToUse: [
      'You only need the count, not the list, and a formula or dynamic programming gives it directly.',
      'n is 30 or more, where 2^n answers cannot even be printed; look for greedy, dynamic programming, or bitmask DP on a smaller state.',
      'You need only the best answer under some score, where dynamic programming or a greedy sweep avoids enumerating everything.',
      'Different branches reach the same remaining state, so memoize on that state instead, which is dynamic programming.',
      'You need only the k-th arrangement in lexicographic order, where a direct combinatorial construction beats generating them all.',
    ],
    relatedTopics: [
      { id: 'backtracking-with-constraints', kind: 'concept', why: 'Adds legality checks so illegal branches are cut before they are explored.' },
      { id: 'backtracking', kind: 'pattern', why: 'This concept is the plain, unpruned form of that pattern.' },
      { id: 'recursion-basics', kind: 'concept', why: 'Choose, recurse, un-choose is ordinary recursion with an explicit undo added.' },
      { id: 'bit-manipulation', kind: 'pattern', why: 'Subsets of up to about 20 items can also be listed with a bitmask counter.' },
      { id: 'knapsack', kind: 'pattern', why: 'Take-or-skip is the same decision, but DP caches the remaining state instead of listing every path.' },
    ],
    quiz: [
      {
        question: 'How much time does generating all subsets of n items take, counting the copies?',
        options: ['O(n^2)', 'O(2^n)', 'O(n * 2^n), because there are 2^n subsets and copying one costs up to n', 'O(n!)'],
        answerIndex: 2,
        explanation: 'The number of subsets is 2^n and each recorded subset must be copied out, which costs up to n, so the product is the honest bound.',
      },
      {
        question: 'You forget to pop after the recursive call in the subsets template. What goes wrong?',
        options: [
          'It crashes immediately',
          'Later branches start from a path that still holds earlier choices, so the results are wrong',
          'It becomes slower but stays correct',
          'Only duplicate results appear',
        ],
        answerIndex: 1,
        explanation: 'Without the undo, path grows monotonically and sibling branches inherit choices that were supposed to be abandoned.',
      },
      {
        question: 'A problem asks for the number of subsets of 40 items whose sum is exactly S. Should you enumerate all subsets?',
        options: [
          'Yes, backtracking always works for subset questions',
          'No, 2^40 is about a trillion; use subset-sum dynamic programming, or meet in the middle',
          'Yes, if you sort the items first',
          'No, use permutations instead',
        ],
        answerIndex: 1,
        explanation: 'The question asks only for a count, so there is no need to build the subsets. DP on the running sum, or splitting into two halves of 20, is tractable.',
      },
      {
        question: 'Why do permutations need a used array while subsets need only a start index?',
        options: [
          'Because permutations are longer than subsets',
          'Because in a permutation any unused element may come next, while in a subset you only look forward so the same set is not produced in several orders',
          'Because subsets are allowed to repeat elements',
          'Because used arrays are faster than indexes',
        ],
        answerIndex: 1,
        explanation: 'Order matters for permutations, so you must be able to reach back to earlier elements; order does not matter for subsets, so looking forward only is exactly right.',
      },
      {
        question: 'For nums = [1, 2, 2], what does the rule "skip nums[i] when i > start and nums[i] == nums[i - 1]" achieve?',
        options: [
          'It sorts the array',
          'It stops the second 2 from starting an identical branch at the same level, so each unique subset appears once',
          'It removes all duplicates from the input array',
          'It makes the algorithm run in O(n)',
        ],
        answerIndex: 1,
        explanation: 'The first equal value at a level still starts its branch; only the repeats at that same level are skipped, which is what removes duplicate results without losing any.',
      },
    ],
    sources: [
      'MIT 6.006: complete search and enumeration',
      'CLRS ch. 15 and ch. 16 for the contrast with dynamic programming and greedy',
      'CP-Algorithms: Generating all subsets and all permutations',
      'USACO Guide: Complete Search and Recursion',
      'LeetCode editorials for Subsets, Subsets II and Permutations',
    ],
    patternIds: ['backtracking', 'recursion'],
    problems: [
      {
        id: 'subsets',
        title: 'Subsets',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subsets/',
        patternId: 'backtracking',
        hint: 'Add the current path to the result at every call, then loop i from start to the end and recurse with i + 1.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'permutations',
        title: 'Permutations',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/permutations/',
        patternId: 'backtracking',
        hint: 'Keep a used array so each element appears once per permutation.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'combinations',
        title: 'Combinations',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/combinations/',
        patternId: 'backtracking',
        hint: 'Same as subsets with a start index, but only record the path when its length reaches k.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'letter-combinations-of-a-phone-number',
        title: 'Letter Combinations of a Phone Number',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
        patternId: 'backtracking',
        hint: 'Recurse over the digits; at digit i, try each letter on that key and move to digit i + 1.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'subsets-ii',
        title: 'Subsets II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subsets-ii/',
        patternId: 'backtracking',
        hint: 'Sort, then skip nums[i] when i > start and nums[i] equals nums[i - 1].',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'permutations-ii',
        title: 'Permutations II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/permutations-ii/',
        patternId: 'backtracking',
        hint: 'Sort, and skip nums[i] if it equals nums[i - 1] and nums[i - 1] is not currently used.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'backtracking-with-constraints',
    gateId: 'recursion-backtracking',
    order: 3,
    title: 'Backtracking with Constraints',
    minutes: 30,
    summary: 'Prune branches early: check the rules before you recurse so you never explore a path that cannot succeed.',
    analogy:
      'You are solving a maze with a pencil. At every fork you pick a path and keep going. The moment you see a wall ahead you turn back to the last fork and try the other way. You do not walk all the way to the dead end and then the whole way back to the start. Checking the wall early is pruning.',
    explanation: `Plain backtracking lists every possibility. **Constrained backtracking** adds a rule check before each recursive call, so branches that already break a rule are cut off early. This is called **pruning** (cutting off a branch of the search tree). You care because pruning is the difference between a solution that finishes in milliseconds and one that never finishes.

## The idea

- Keep the same choose / recurse / un-choose shape from the previous lesson.
- Before choosing an option, ask: "is this option still legal given what I have chosen so far?" If not, skip it.
- Before recursing, ask: "can this partial answer still lead to a full answer?" If not, return.
- Because you check early, whole subtrees are never visited.

## A tiny example: generate parentheses for n = 2

We want all strings with 2 opening and 2 closing brackets that are balanced.

- Rule 1: you may add \`(\` only if you have used fewer than n of them.
- Rule 2: you may add \`)\` only if the count of \`)\` so far is less than the count of \`(\`.

Start with "". Add "(" (open = 1). Now "(" -> add "(" gives "((", or add ")" gives "()". From "((" only ")" is allowed twice: "(())". From "()" add "(" then ")": "()()". Two answers, and we never built "))" or ")(".

## Step by step

The slow way generates every string of length 2n made of brackets (2^(2n) strings) and validates each with a stack. For n = 10 that is about one million strings, most of them garbage.

The fast way only appends a bracket when the two rules above allow it. Every string it builds is valid, so the work is proportional to the number of answers (the Catalan number, roughly 4^n / n^1.5). For n = 10 that is 16,796 answers instead of a million candidates.

\`\`\`python
def generate(n):
    res = []
    def go(s, open_cnt, close_cnt):
        if len(s) == 2 * n:
            res.append(s)
            return
        if open_cnt < n:
            go(s + "(", open_cnt + 1, close_cnt)
        if close_cnt < open_cnt:
            go(s + ")", open_cnt, close_cnt + 1)
    go("", 0, 0)
    return res
\`\`\`

## More constraints you will meet

- **Combination Sum**: stop when the running total exceeds the target. Sorting first lets you break out of the loop instead of continue.
- **Word Search**: only step onto a cell that is inside the grid, unvisited, and holds the next letter. Mark the cell visited, recurse, unmark it.
- **N-Queens**: keep sets of used columns and diagonals. A queen is placed only if its column, row + col diagonal and row - col diagonal are all free.
- **Sudoku**: place a digit only if it is absent from the row, column and 3x3 box.

## Where people go wrong

- Checking the rule after recursing instead of before. The subtree is already explored by then.
- Forgetting to undo the state change (unmark visited, remove from set) so later branches see a wrong state.
- Building strings by concatenation deep in the recursion. In Python that is fine for small n, but for grids use a list and index.
- Trying to find a "clever" formula. If n is small and the problem says "all", the intended answer is a well-pruned search.

## How to recognise it in an interview

- "Find all valid ..." or "does any arrangement exist that satisfies ...".
- Rules about what can be next to what: no two queens attack, letters must be adjacent, sum must not exceed target.
- Grid problems where you walk from cell to cell and may not revisit.
- Small bounds (n up to 9, board up to 9x9, word length up to 15).`,
    naive: {
      title: 'Generate every bracket string, then validate',
      description:
        'Produce all 2^(2n) strings of ( and ), then keep the balanced ones by scanning with a counter. Almost every candidate fails the check.',
      time: 'O(2^(2n) * n)',
      space: 'O(n)',
      code: {
        python: `def generate(n):
    res = []

    def valid(s):
        bal = 0
        for c in s:
            bal += 1 if c == "(" else -1
            if bal < 0:
                return False
        return bal == 0

    def go(s):
        if len(s) == 2 * n:
            if valid(s):
                res.append(s)
            return
        go(s + "(")
        go(s + ")")
    go("")
    return res`,
        javascript: `function generate(n) {
  const res = [];
  function valid(s) {
    let bal = 0;
    for (const c of s) {
      bal += c === '(' ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal === 0;
  }
  function go(s) {
    if (s.length === 2 * n) {
      if (valid(s)) res.push(s);
      return;
    }
    go(s + '(');
    go(s + ')');
  }
  go('');
  return res;
}`,
        java: `import java.util.*;

class Solution {
  List<String> res = new ArrayList<>();

  boolean valid(String s) {
    int bal = 0;
    for (char c : s.toCharArray()) {
      bal += c == '(' ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal == 0;
  }

  void go(String s, int n) {
    if (s.length() == 2 * n) {
      if (valid(s)) res.add(s);
      return;
    }
    go(s + "(", n);
    go(s + ")", n);
  }

  public List<String> generateParenthesis(int n) {
    go("", n);
    return res;
  }
}`,
        cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
  vector<string> res;
  bool valid(const string& s) {
    int bal = 0;
    for (char c : s) {
      bal += c == '(' ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal == 0;
  }
  void go(string s, int n) {
    if ((int)s.size() == 2 * n) {
      if (valid(s)) res.push_back(s);
      return;
    }
    go(s + "(", n);
    go(s + ")", n);
  }
public:
  vector<string> generateParenthesis(int n) {
    go("", n);
    return res;
  }
};`,
      },
    },
    optimized: {
      title: 'Prune with open and close counts',
      description:
        'Only add ( while open < n, and only add ) while close < open. Every string the recursion builds is balanced, so there is nothing to filter.',
      time: 'O(4^n / sqrt(n))',
      space: 'O(n)',
      code: {
        python: `def generate(n):
    res = []

    def go(s, open_cnt, close_cnt):
        if len(s) == 2 * n:
            res.append(s)
            return
        if open_cnt < n:
            go(s + "(", open_cnt + 1, close_cnt)
        if close_cnt < open_cnt:
            go(s + ")", open_cnt, close_cnt + 1)
    go("", 0, 0)
    return res`,
        javascript: `function generate(n) {
  const res = [];
  function go(s, open, close) {
    if (s.length === 2 * n) {
      res.push(s);
      return;
    }
    if (open < n) go(s + '(', open + 1, close);
    if (close < open) go(s + ')', open, close + 1);
  }
  go('', 0, 0);
  return res;
}`,
        java: `import java.util.*;

class Solution {
  List<String> res = new ArrayList<>();

  void go(StringBuilder sb, int open, int close, int n) {
    if (sb.length() == 2 * n) {
      res.add(sb.toString());
      return;
    }
    if (open < n) {
      sb.append('(');
      go(sb, open + 1, close, n);
      sb.deleteCharAt(sb.length() - 1);
    }
    if (close < open) {
      sb.append(')');
      go(sb, open, close + 1, n);
      sb.deleteCharAt(sb.length() - 1);
    }
  }

  public List<String> generateParenthesis(int n) {
    go(new StringBuilder(), 0, 0, n);
    return res;
  }
}`,
        cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
  vector<string> res;
  void go(string& s, int open, int close, int n) {
    if ((int)s.size() == 2 * n) {
      res.push_back(s);
      return;
    }
    if (open < n) {
      s.push_back('(');
      go(s, open + 1, close, n);
      s.pop_back();
    }
    if (close < open) {
      s.push_back(')');
      go(s, open, close + 1, n);
      s.pop_back();
    }
  }
public:
  vector<string> generateParenthesis(int n) {
    string s;
    go(s, 0, 0, n);
    return res;
  }
};`,
      },
    },
    whyFaster:
      'The naive search builds all 2^(2n) strings and only finds out at the very end that most are invalid. The pruned search checks the two rules before each step, so an invalid prefix like ")" is never extended. The number of strings explored drops from 2^(2n) to the number of valid answers, which grows much more slowly.',
    keyPoints: [
      'Check constraints before recursing, not after. That is what makes pruning work.',
      'Track state that makes the check O(1): counts, visited sets, column and diagonal sets.',
      'Always undo state changes after the recursive call returns.',
      'Sorting the choices lets you break out of a loop once a rule fails for the rest.',
      'Small input bounds plus "all valid" in the statement mean pruned backtracking is expected.',
    ],
    definition:
      'Constrained backtracking is the same choose, recurse, un-choose search with a legality test placed before each recursive call. A partial answer that already breaks a rule, or that can no longer be completed, is abandoned at once. Cutting a branch this way is called pruning.',
    coreIdea:
      'The search tree is enormous, but most of it is dead: whole sub-trees hang below a prefix that already violates a rule. Because the rule is checked at the top of the branch instead of at the leaves, cutting one node removes everything below it in a single step. That is why a good prune can shrink the explored tree from 2^(2n) nodes down to roughly the number of valid answers, without changing the shape of the code at all.',
    visual: [
      {
        caption: 'Generate parentheses for n = 2. With no rules at all, every position is a free choice between two brackets.',
        frame: [
          '""',
          '+-- "("',
          '|   +-- "((" ...',
          '|   +-- "()" ...',
          '+-- ")"',
          '    +-- ")(" ...',
          '    +-- "))" ...',
          '16 leaves in total, and only 2 are balanced',
        ].join('\n'),
      },
      {
        caption: 'Rule: add a closing bracket only while close < open. At the root both counts are 0, so the whole right sub-tree is pruned.',
        frame: [
          '""',
          '+-- "("                open=1 close=0, legal',
          '+-- ")"   X PRUNED     close < open is false',
          'one test at depth 1 deleted 8 of the 16 leaves',
        ].join('\n'),
      },
      {
        caption: 'Inside "((", open has already reached n, so the other rule blocks a third opening bracket.',
        frame: [
          '"(("   open=2 close=0',
          '+-- "((("  X PRUNED    open < n is false',
          '+-- "(()"              close < open is true, legal',
        ].join('\n'),
      },
      {
        caption: 'What survives. Every leaf is a finished balanced string, so there is nothing left to filter out.',
        frame: [
          '""',
          '+-- "("',
          '|   +-- "(("',
          '|   |   +-- "(()"',
          '|   |       +-- "(())"     answer 1',
          '|   +-- "()"',
          '|       +-- "()("',
          '|           +-- "()()"     answer 2',
          '+-- ")"  X PRUNED',
        ].join('\n'),
      },
      {
        caption: 'N-Queens on a 4x4 board. One queen at (0,0) blocks a column and a diagonal, so row 1 has only 2 cells worth trying.',
        frame: [
          '. = free   Q = queen   x = attacked',
          'Q  x  x  x',
          'x  x  .  .',
          'x  .  x  .',
          'x  .  .  x',
          'row 1: only columns 2 and 3 survive the check',
        ].join('\n'),
      },
      {
        caption: 'Pruning changes the growth rate, not just the constant factor.',
        frame: [
          'generate parentheses, n = 10',
          'no pruning:  2^20 = 1,048,576 strings, then validate',
          'with rules:  16,796 strings, all of them valid',
          'that count is the 10th Catalan number',
          'same code shape, two extra if tests',
        ].join('\n'),
      },
    ],
    pseudocode: `function search(state):
    if state is a complete answer:
        record a copy of it
        return
    if state can no longer lead to any answer:   // optional bound check
        return
    for each option in choicesFor(state):
        if not isLegal(option, state):           // prune BEFORE recursing
            continue
        apply option to state                    // choose
        search(state)
        undo option from state                   // un-choose

function generateParentheses(n):
    result = empty list
    function build(s, open, close):
        if length(s) == 2 * n:
            add s to result
            return
        if open < n:
            build(s + "(", open + 1, close)
        if close < open:
            build(s + ")", open, close + 1)
    build(empty string, 0, 0)
    return result`,
    complexity: [
      { label: 'Generate parentheses, n pairs', time: 'O(4^n / n^1.5)', space: 'O(n)', note: 'the output is the nth Catalan number; recursion depth is 2n' },
      { label: 'Generate then filter (the naive way)', time: 'O(n * 4^n)', space: 'O(n)', note: '2^(2n) candidates, each validated in O(n)' },
      { label: 'N-Queens on an n x n board', time: 'O(n!) as an upper bound', space: 'O(n)', note: 'n choices then n-1 and so on; pruning lands far below this in practice' },
      { label: 'Word Search, grid r x c, word length L', time: 'O(r * c * 3^L)', space: 'O(L)', note: 'after the first step only 3 neighbours are new, and the path costs O(L)' },
      { label: 'Combination Sum, target T, smallest value m', time: 'O(n^(T/m))', space: 'O(T/m)', note: 'depth is bounded by the target divided by the smallest usable value' },
    ],
    dryRun: {
      input: 'n = 2, using the optimized generate with the open and close counters',
      goal: 'Build every balanced string of 2 opening and 2 closing brackets without ever creating an invalid one.',
      steps: [
        { state: 's="" open=0 close=0', action: 'Not full yet. open < 2 holds so the opening branch runs; close < open is 0 < 0, which is false, so the closing branch is skipped entirely.' },
        { state: 's="(" open=1 close=0', action: 'open < 2 still holds, so the first thing tried is another opening bracket.' },
        { state: 's="((" open=2 close=0', action: 'open is no longer below n, so that branch is pruned. close < open holds, so a closing bracket is added.' },
        { state: 's="(()" open=2 close=1', action: 'Only the closing branch is legal again, which produces a string of length 4.' },
        { state: 's="(())" open=2 close=2', action: 'The length equals 2 * n, so record "(())" and return.' },
        { state: 'back at s="(" open=1 close=0', action: 'The opening branch of this level is finished. Now close < open is 0 < 1, which is true, so a closing bracket is added.' },
        { state: 's="()" open=1 close=1', action: 'open < 2 so an opening bracket is added. close < open is 1 < 1, which is false, so that branch is pruned.' },
        { state: 's="()(" open=2 close=1', action: 'Only a closing bracket is legal here, which makes "()()" of length 4 and records it.' },
        { state: 'res = ["(())", "()()"]', action: 'Every branch has returned. No invalid prefix such as ")" or "))" was ever extended.' },
      ],
      result:
        'Returns ["(())", "()()"], the 2 balanced strings for n = 2, which is the 2nd Catalan number. Each one is valid because the two rules guarantee the closing count never passes the opening count, and both counts finish at n.',
    },
    mistakes: [
      {
        mistake: 'Building the whole candidate and validating it at the base case.',
        why: 'A test at the leaf cannot recover any of the work already spent walking down to that leaf, so the search still visits the entire tree.',
        fix: 'Move the test above the recursive call so the branch is never entered. That is the whole point of pruning.',
      },
      {
        mistake: 'Forgetting to undo a state change such as a visited mark or a set insertion.',
        why: 'The next sibling branch then sees a cell as blocked or a column as taken when it is not, so valid answers are silently missed and no error is raised.',
        fix: 'Undo every change immediately after the recursive call returns, in the reverse order you made them.',
      },
      {
        mistake: 'In Word Search, checking the bounds and the visited mark after recursing rather than on entry.',
        why: 'The recursive call indexes outside the grid before the check ever runs, which crashes or silently reads the wrong cell.',
        fix: 'Validate the row, the column, the visited flag and the expected letter as the first lines of the function, then recurse.',
      },
      {
        mistake: 'Using an O(n) scan of the board to test whether a queen is safe.',
        why: 'That test runs at every node of the search tree, so a linear check multiplies the entire search cost by n.',
        fix: 'Keep sets of used columns, of row + col and of row - col, so each safety check is O(1).',
      },
      {
        mistake: 'Adding a prune that is not actually sound, for example stopping as soon as the running sum passes the target when negative values are allowed.',
        why: 'A later negative value could bring the sum back down to the target, so a real answer is thrown away and the output is simply wrong.',
        fix: 'Prove the prune first: no completion of this prefix may ever succeed. With only positive values the running-sum prune is sound.',
      },
    ],
    whenToUse: [
      '"Find all valid ..." or "does any arrangement satisfy these rules".',
      'Rules constrain what may sit next to what: queens, sudoku digits, adjacent letters, a running total.',
      'Grid walks where a cell may not be revisited on the current path.',
      'Small bounds, such as a 9x9 board, n up to about 12, or a word of length 15.',
      'A partial answer can be judged illegal long before it is complete, which is exactly what makes pruning pay off.',
    ],
    whenNotToUse: [
      'You need one shortest path in an unweighted graph or grid, where breadth-first search is simpler and gives the optimum directly.',
      'The state space is huge and no early test ever fails, so pruning saves nothing; look for dynamic programming instead.',
      'Different branches reach the same remaining sub-problem, where memoizing on that state turns the search into dynamic programming.',
      'You need only a count of solutions and a combinatorial formula exists, which is far cheaper than enumerating them.',
      'The constraints are linear and you want the best objective value, which is an optimisation problem for greedy or DP, not a search.',
    ],
    relatedTopics: [
      { id: 'subsets-and-permutations', kind: 'concept', why: 'The unpruned template that this concept adds legality checks to.' },
      { id: 'backtracking', kind: 'pattern', why: 'This is that pattern in its practical, pruned form.' },
      { id: 'dfs', kind: 'pattern', why: 'Grid backtracking is depth-first search where the visited mark is undone on the way back up.' },
      { id: 'dp-2d', kind: 'pattern', why: 'When branches share the same remaining state, caching that state replaces the search with dynamic programming.' },
      { id: 'graph-representation-bfs-dfs', kind: 'concept', why: 'Explains why breadth-first search, not backtracking, is the tool for shortest paths.' },
    ],
    quiz: [
      {
        question: 'Why must the legality check sit before the recursive call rather than at the base case?',
        options: [
          'Because base cases cannot contain if statements',
          'Because checking at the leaf means the whole sub-tree was already explored, so nothing was saved',
          'Because it is quicker to write that way',
          'Because recursion cannot return early',
        ],
        answerIndex: 1,
        explanation: 'Pruning only pays when it happens above the sub-tree it removes. A check at the leaf filters output but does no work-saving at all.',
      },
      {
        question: 'Without pruning, how many candidate strings does generating parentheses for n = 10 explore?',
        options: ['About 16,796', 'About 2^20, just over a million', 'About 100', 'About 10 factorial'],
        answerIndex: 1,
        explanation: 'Each of the 20 positions is a free choice between two brackets. Pruning cuts this to the 16,796 valid ones, the 10th Catalan number.',
      },
      {
        question: 'You must find the shortest route through a 100 x 100 grid with walls. Is pruned backtracking the right tool?',
        options: [
          'Yes, just add a prune on the path length',
          'No, breadth-first search finds the shortest route in O(rows * cols); backtracking would explore exponentially many paths',
          'Yes, if you sort the cells first',
          'No, use binary search',
        ],
        answerIndex: 1,
        explanation: 'BFS visits each cell once and reaches every cell by a shortest path. Backtracking enumerates paths, of which there are exponentially many.',
      },
      {
        question: 'In N-Queens you keep three sets: used columns, row + col, and row - col. Why?',
        options: [
          'To store the finished answers',
          'So the "is this square attacked" test is O(1) instead of an O(n) scan, and that test runs at every node',
          'To make the search stable',
          'To avoid recursion entirely',
        ],
        answerIndex: 1,
        explanation: 'Cells on one diagonal share row - col and cells on the other share row + col, so a set membership test replaces a full scan.',
      },
      {
        question: 'Suppose Combination Sum allowed negative numbers. Is "return as soon as the running sum passes the target" still a valid prune?',
        options: [
          'Yes, it is always valid',
          'No, a later negative value could bring the sum back to the target, so the prune would discard real answers',
          'Yes, as long as you sort the input first',
          'It only affects performance, never correctness',
        ],
        answerIndex: 1,
        explanation: 'A prune is only sound when no completion of the current prefix can succeed. Negative values break that guarantee for the running-sum test.',
      },
    ],
    sources: [
      'MIT 6.006: complete search and pruning',
      'CLRS ch. 34 for why these problems have no known polynomial algorithm',
      'CP-Algorithms: Backtracking and the N-Queens problem',
      'USACO Guide: Complete Search with Pruning',
      'LeetCode editorials for Generate Parentheses, N-Queens and Word Search',
    ],
    patternIds: ['backtracking'],
    problems: [
      {
        id: 'generate-parentheses',
        title: 'Generate Parentheses',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/generate-parentheses/',
        patternId: 'backtracking',
        hint: 'Add ( while open < n and add ) while close < open; every string you finish is automatically valid.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'combination-sum',
        title: 'Combination Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/combination-sum/',
        patternId: 'backtracking',
        hint: 'Recurse with the same start index so an element can be reused, and return as soon as the remaining target goes below zero.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'word-search',
        title: 'Word Search',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/word-search/',
        patternId: 'backtracking',
        hint: 'DFS from every cell that matches word[0]; mark a cell as visited by overwriting it, and restore it when you backtrack.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'palindrome-partitioning',
        title: 'Palindrome Partitioning',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/palindrome-partitioning/',
        patternId: 'backtracking',
        hint: 'At index i, try every end j where s[i..j] is a palindrome, then recurse from j + 1.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'n-queens',
        title: 'N-Queens',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/n-queens/',
        patternId: 'backtracking',
        hint: 'Place one queen per row; keep sets for used columns, row + col and row - col so the check is O(1).',
        xp: 80,
        tier: 'advanced',
      },
      {
        id: 'sudoku-solver',
        title: 'Sudoku Solver',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/sudoku-solver/',
        patternId: 'backtracking',
        hint: 'Find the next empty cell, try digits 1-9 that are absent from its row, column and box, and return true as soon as the board is full.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },
]
