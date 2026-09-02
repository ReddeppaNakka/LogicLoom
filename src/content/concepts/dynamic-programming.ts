import type { Concept } from '../types'

export const concepts: Concept[] = [
  // -------------------------------------------------------------------------
  // 1. DP intro: memoization and tabulation
  // -------------------------------------------------------------------------
  {
    id: 'dp-intro-memo-and-tabulation',
    gateId: 'dynamic-programming',
    order: 1,
    title: 'DP Intro: From Recursion to Memo to Table',
    minutes: 30,
    summary: 'Dynamic programming is plain recursion plus a notebook: write down each answer once so you never compute it twice.',
    analogy:
      'Imagine a friend asks you "what is 17 x 23?" and you work it out on paper. Five minutes later they ask again. You do not redo the multiplication; you glance at the paper. DP is exactly that habit: solve each small question once, write it down, and look it up from then on.',
    explanation: `Dynamic programming (DP) sounds scary, but it is just a fix for one specific problem: a recursive function that keeps answering the same question over and over. We add a notebook. That is the whole trick. Let us walk through it very slowly with one example.

## Step 1: plain recursion
Climbing Stairs: you can climb 1 or 2 steps at a time. How many ways to reach step n? To reach step n you came from step n-1 or step n-2, so \`ways(n) = ways(n-1) + ways(n-2)\`, with \`ways(1) = 1\` and \`ways(2) = 2\`.

\`\`\`python
def ways(n):
    if n <= 2:
        return n
    return ways(n - 1) + ways(n - 2)
\`\`\`

Correct, short, and hopeless for n = 40. Why?

## Step 2: see the repeated work
Draw the calls for ways(5):
- ways(5) calls ways(4) and ways(3)
- ways(4) calls ways(3) and ways(2)
- ways(3) calls ways(2) and ways(1)... and ways(3) gets called again from ways(5)

ways(3) is computed twice, ways(2) three times. For ways(40) the same tiny questions are answered billions of times. The call tree doubles at every level: about 2^n calls. There are only n different questions, though. That gap is the whole opportunity.

## Step 3: memoization (top-down)
Keep the recursion. Add a dictionary. Before computing, check the dictionary. After computing, store the answer.

\`\`\`python
def ways(n, memo={}):
    if n <= 2:
        return n
    if n in memo:
        return memo[n]          # already solved, look it up
    memo[n] = ways(n - 1, memo) + ways(n - 2, memo)
    return memo[n]
\`\`\`

Now each n is computed once. n questions, each O(1) work: O(n) time, O(n) space for the memo plus the call stack. From 2^40 to 40 steps, by adding three lines.

## Step 4: tabulation (bottom-up)
Instead of starting at n and going down, start from the smallest answers and fill a table upward. No recursion at all.

\`\`\`python
def ways(n):
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
\`\`\`

Same O(n) time, and no risk of hitting the recursion limit.

## Step 5: shrink the table
dp[i] only looks at the two cells before it. So keep two variables instead of the whole list: O(1) space.

\`\`\`python
def ways(n):
    a, b = 1, 2                 # ways(1), ways(2)
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b if n >= 2 else a
\`\`\`

## The general recipe
1. Write the recursive relation: answer(n) in terms of smaller answers. This is called the **state** and the **transition**.
2. Identify the base cases.
3. Add a memo (top-down), or fill a table from the base cases up (bottom-up).
4. If each cell only needs a few previous cells, drop to O(1) space.

## Where people go wrong
- Jumping straight to the table without writing the recursion first. The recursion IS the design; the table is only a speed-up.
- Using a mutable default argument for the memo in Python and forgetting it persists between calls. Use \`functools.lru_cache\` or pass a fresh dict.
- Wrong base cases. Test by hand for n = 1, 2, 3.

## How to recognise it in an interview
- "Count the number of ways", "minimum cost to reach", "maximum value you can get".
- The answer for a big input depends on the answers for slightly smaller inputs.
- Your recursive solution is correct but times out. That is the signal to add the notebook.`,
    naive: {
      title: 'Plain recursion that re-solves the same steps',
      description:
        'Call ways(n - 1) and ways(n - 2) and add them. Every call spawns two more, and the same small values are recomputed an enormous number of times.',
      time: 'O(2^n)',
      space: 'O(n) call stack',
      code: {
        python: `def climb_stairs_slow(n):
    if n <= 2:
        return n
    # both branches recompute the same smaller values
    return climb_stairs_slow(n - 1) + climb_stairs_slow(n - 2)`,
        javascript: `function climbStairsSlow(n) {
  if (n <= 2) return n;
  // both branches recompute the same smaller values
  return climbStairsSlow(n - 1) + climbStairsSlow(n - 2);
}`,
        java: `class Solution {
  public int climbStairsSlow(int n) {
    if (n <= 2) return n;
    // both branches recompute the same smaller values
    return climbStairsSlow(n - 1) + climbStairsSlow(n - 2);
  }
}`,
        cpp: `int climbStairsSlow(int n) {
  if (n <= 2) return n;
  // both branches recompute the same smaller values
  return climbStairsSlow(n - 1) + climbStairsSlow(n - 2);
}`,
      },
    },
    optimized: {
      title: 'Memoize, then tabulate with two variables',
      description:
        'First version: same recursion plus a memo so each n is solved once. Second version: fill from the bottom with two rolling variables and no recursion at all.',
      time: 'O(n)',
      space: 'O(1) for the rolling version, O(n) with memo',
      code: {
        python: `from functools import lru_cache

@lru_cache(maxsize=None)
def climb_memo(n):
    if n <= 2:
        return n
    return climb_memo(n - 1) + climb_memo(n - 2)   # each n computed once

def climb_table(n):
    if n <= 2:
        return n
    a, b = 1, 2                     # ways(1), ways(2)
    for _ in range(3, n + 1):
        a, b = b, a + b             # slide the window up one step
    return b`,
        javascript: `function climbMemo(n, memo = new Map()) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n);
  const result = climbMemo(n - 1, memo) + climbMemo(n - 2, memo);
  memo.set(n, result);                       // each n computed once
  return result;
}

function climbTable(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;                          // ways(1), ways(2)
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;                                // slide the window up one step
  }
  return b;
}`,
        java: `import java.util.*;

class Solution {
  Map<Integer, Integer> memo = new HashMap<>();

  public int climbMemo(int n) {
    if (n <= 2) return n;
    if (memo.containsKey(n)) return memo.get(n);
    int result = climbMemo(n - 1) + climbMemo(n - 2);
    memo.put(n, result);                     // each n computed once
    return result;
  }

  public int climbTable(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;                        // ways(1), ways(2)
    for (int i = 3; i <= n; i++) {
      int next = a + b;
      a = b;
      b = next;                              // slide the window up one step
    }
    return b;
  }
}`,
        cpp: `#include <unordered_map>
using namespace std;

unordered_map<int, int> memo;

int climbMemo(int n) {
  if (n <= 2) return n;
  if (memo.count(n)) return memo[n];
  return memo[n] = climbMemo(n - 1) + climbMemo(n - 2);   // each n once
}

int climbTable(int n) {
  if (n <= 2) return n;
  int a = 1, b = 2;                          // ways(1), ways(2)
  for (int i = 3; i <= n; i++) {
    int next = a + b;
    a = b;
    b = next;                                // slide the window up one step
  }
  return b;
}`,
      },
    },
    whyFaster:
      'The plain recursion makes about 2^n calls because every call branches twice and nothing is remembered. There are only n distinct sub-problems, so a memo caps the work at n computations: O(n). Tabulation does the same n computations in a loop, and because each step needs only the two previous answers, two variables replace the whole table: O(1) space.',
    keyPoints: [
      'DP = recursion + remembering answers. Write the recursion first.',
      'Repeated sub-problems are the signal: the same function call happens many times.',
      'Memoization: top-down, add a dict/cache to the recursive function.',
      'Tabulation: bottom-up, fill an array from the base cases upward.',
      'If dp[i] only needs a few earlier cells, keep just those in variables.',
      'Verify base cases by hand for the smallest inputs.',
    ],
    patternIds: ['recursion', 'dp-1d'],
    definition:
      'Dynamic programming is a way to solve a problem by splitting it into smaller sub-problems, solving each different sub-problem exactly once, and storing that answer so every later use is only a lookup. It applies when the sub-problems overlap and when the best answer to the whole is built from best answers to the parts.',
    coreIdea:
      'The plain recursion is slow not because recursion is slow, but because it answers the same question over and over. The value of ways(3) never changes, so it only ever needs to be worked out once. Climbing Stairs makes about 2^n calls while asking only n different questions, so writing each answer down cuts the cost from O(2^n) to O(n). Memoization does this from the top down, tabulation does the same work from the bottom up.',
    visual: [
      {
        caption: 'Plain recursion for ways(5) fans out into a tree of calls.',
        frame: [
          'ways(5)',
          ' +-- ways(4)',
          ' |    +-- ways(3)',
          ' |    |    +-- ways(2)',
          ' |    |    +-- ways(1)',
          ' |    +-- ways(2)',
          ' +-- ways(3)',
          '      +-- ways(2)',
          '      +-- ways(1)',
        ].join('\n'),
      },
      {
        caption: 'The repeated subtrees, circled. Only 5 different questions exist.',
        frame: [
          'ways(5)',
          ' +-- ways(4)',
          ' |    +-- ( ways(3) )   <-- circled',
          ' |    +-- ways(2)',
          ' +-- ( ways(3) )        <-- the same subtree again',
          '',
          'call counts: ways(3) x2, ways(2) x3, ways(1) x2',
          '9 calls for n = 5, and about 2^n for larger n',
        ].join('\n'),
      },
      {
        caption: 'The same computation as a table. State dp[i] = ways to stand on step i. Base: dp[1]=1, dp[2]=2.',
        frame: [
          'i       1    2    3    4    5',
          'dp    [ 1 ][ 2 ][ . ][ . ][ . ]',
          '        ^    ^',
          '        base cases, no decision to make yet',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[3]. Transition: dp[i] = dp[i-1] + dp[i-2].',
        frame: [
          'i       1    2    3    4    5',
          'dp    [ 1 ][ 2 ][ 3 ][ . ][ . ]',
          '        ^    ^    ^',
          '        |    |    +- new cell dp[3]',
          '        +----+------ sources dp[1] and dp[2]',
          '',
          'dp[3] = dp[2] + dp[1] = 2 + 1 = 3',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[4] from the two cells on its left.',
        frame: [
          'i       1    2    3    4    5',
          'dp    [ 1 ][ 2 ][ 3 ][ 5 ][ . ]',
          '             ^    ^    ^',
          '             |    |    +- new cell dp[4]',
          '             +----+------ sources dp[2] and dp[3]',
          '',
          'dp[4] = dp[3] + dp[2] = 3 + 2 = 5',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[5] and stop. Five additions replace nine recursive calls.',
        frame: [
          'i       1    2    3    4    5',
          'dp    [ 1 ][ 2 ][ 3 ][ 5 ][ 8 ]',
          '                  ^    ^    ^',
          '                  +----+----+',
          '',
          'dp[5] = dp[4] + dp[3] = 5 + 3 = 8',
          'answer = dp[5] = 8',
        ].join('\n'),
      },
    ],
    pseudocode: `// Climbing Stairs.
// State:      dp[i] = number of ways to stand on step i.
// Transition: dp[i] = dp[i - 1] + dp[i - 2].
// Base case:  dp[1] = 1, dp[2] = 2.

function topDown(i, memo):
    if i <= 2:
        return i                       // base case
    if memo contains i:
        return memo[i]                 // answered before, only a lookup
    memo[i] = topDown(i - 1, memo) + topDown(i - 2, memo)
    return memo[i]

function bottomUp(n):
    if n <= 2:
        return n
    create table dp with n + 1 cells
    dp[1] = 1
    dp[2] = 2
    for i from 3 to n:
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
    complexity: [
      { label: 'Plain recursion', time: 'O(2^n)', space: 'O(n)', note: 'every call branches twice and nothing is stored; space is the call stack' },
      { label: 'Top-down with memo', time: 'O(n)', space: 'O(n)', note: 'n states with O(1) work each; memo plus call stack' },
      { label: 'Bottom-up table', time: 'O(n)', space: 'O(n)', note: 'one loop, no recursion, so no stack limit' },
      { label: 'Rolling variables', time: 'O(n)', space: 'O(1)', note: 'only the two previous cells are ever read' },
    ],
    dryRun: {
      input: 'n = 5, steps of size 1 or 2 (Climbing Stairs)',
      goal: 'Count the ways to reach step 5 with the rolling-variable version, where a holds ways(i-2) and b holds ways(i-1).',
      steps: [
        { state: 'n=5 a=1 b=2', action: 'Set the base cases: a = ways(1) = 1 and b = ways(2) = 2.' },
        { state: 'i=3 a=1 b=2', action: 'ways(3) = a + b = 1 + 2 = 3; slide the pair so a=2 and b=3.' },
        { state: 'i=4 a=2 b=3', action: 'ways(4) = 2 + 3 = 5; slide so a=3 and b=5.' },
        { state: 'i=5 a=3 b=5', action: 'ways(5) = 3 + 5 = 8; slide so a=5 and b=8.' },
        { state: 'loop finished a=5 b=8', action: 'The loop has passed n, so return b, which now holds ways(5).' },
      ],
      result: '8. It matches the table dp = [-, 1, 2, 3, 5, 8], and the 8 routes can be listed by hand: 11111, 1112, 1121, 1211, 2111, 122, 212, 221.',
    },
    mistakes: [
      {
        mistake: 'Writing def ways(n, memo={}) in Python.',
        why: 'The default dictionary is created once and shared by every call, so answers from one input leak into the next and a later test quietly reuses stale values.',
        fix: 'Pass a fresh dict from the caller, build the memo inside a wrapper function, or decorate with functools.lru_cache.',
      },
      {
        mistake: 'Setting dp[2] = 1 for Climbing Stairs.',
        why: 'There really are two ways to stand on step 2 (1+1 and 2). Every later cell is built from dp[2], so dp[3] onward is too small and the final answer is wrong.',
        fix: 'Check the base cases by hand for n = 1, 2 and 3 before writing the loop.',
      },
      {
        mistake: 'Jumping straight to a table without writing the recursion.',
        why: 'The table is only a storage trick. If the transition is guessed, the cells hold something you cannot define, and the bug stays invisible until a large test fails.',
        fix: 'Write the state, the transition and the base case in one sentence each, then translate them into a loop.',
      },
      {
        mistake: 'Memoizing on part of the state, for example caching by index when the answer also depends on the remaining budget.',
        why: 'Two genuinely different sub-problems collide on one key, so the second one is handed the first one answer.',
        fix: 'The memo key must contain every variable the answer depends on, and nothing else.',
      },
      {
        mistake: 'Using top-down recursion for n = 100000 in Python.',
        why: 'The default recursion limit is about 1000, so a correct memoized solution still crashes with a RecursionError.',
        fix: 'Convert it to a bottom-up loop, which uses no call stack at all.',
      },
    ],
    whenToUse: [
      'You already have a correct recursive solution and it times out because the same call repeats.',
      'The question asks for a count of ways, a minimum cost, or a maximum value.',
      'The answer for n is built from the answers for a few slightly smaller inputs.',
      'The number of different states is small, say a few million, and each state costs O(1) to fill.',
    ],
    whenNotToUse: [
      'Sub-problems never repeat, as in merge sort; plain divide and conquer is enough and a memo only wastes memory.',
      'One greedy rule is provably safe, as in picking the earliest finishing meeting; greedy is O(n log n) and much shorter.',
      'The state has to remember the exact set chosen so far and n is large; that is backtracking, and bitmask DP only survives up to about n = 20.',
      'You need a shortest path in a graph with cycles; there is no safe order to fill the states, so use BFS or Dijkstra.',
      'The state is an amount up to 10^9; the table will not fit in memory, so look for a maths or greedy argument.',
    ],
    relatedTopics: [
      { id: 'recursion-basics', kind: 'concept', why: 'Every DP starts as a recursive relation, so you must be able to write and trust the recursion first.' },
      { id: 'analyzing-loops-and-recursion', kind: 'concept', why: 'Counting states times work per state is exactly how you predict whether a DP will run in time.' },
      { id: 'hash-map-basics', kind: 'concept', why: 'A memo is a hash map from state to answer, which is why each lookup costs O(1).' },
      { id: 'dp-1d', kind: 'concept', why: 'The next step: the same notebook trick applied to sequences, where the state is a single index.' },
    ],
    quiz: [
      {
        question: 'Plain recursive climbStairs(n) makes roughly how many calls, and what does adding a memo change that to?',
        options: [
          'About n^2 calls, and a memo makes it O(n log n)',
          'About 2^n calls, and a memo makes it O(n)',
          'About n! calls, and a memo makes it O(n^2)',
          'About n calls already, so the memo only saves space',
        ],
        answerIndex: 1,
        explanation: 'The call tree branches twice at every level, so it grows like 2^n. There are only n different states, so caching them caps the work at n computations of O(1) each.',
      },
      {
        question: 'What is the safest first step when a problem smells like DP?',
        options: [
          'Guess the shape of the table and start filling cells',
          'Write the state, the transition and the base case, then add a memo',
          'Sort the input first',
          'Convert the problem into a graph and run BFS',
        ],
        answerIndex: 1,
        explanation: 'The recursion is the design and the table is only storage. If you cannot say what dp[i] means in one sentence, the table will be wrong.',
      },
      {
        question: 'You must find the fewest coins for amount 1000000000 with coins [1, 7, 11]. Is a dp array over every amount a good plan?',
        options: [
          'Yes, it is O(amount), which is linear and therefore fine',
          'No, the table would need 10^9 cells; the state space is too large, so look for a maths or greedy argument',
          'Yes, as long as you use memoization instead of a table',
          'No, because coin change is never a DP problem',
        ],
        answerIndex: 1,
        explanation: 'O(amount) is linear in the value of the amount but exponential in the number of digits you were handed. A billion cells is gigabytes of memory, so the state space itself is the blocker.',
      },
      {
        question: 'For Climbing Stairs with dp[i] = dp[i-1] + dp[i-2], what happens if you set dp[2] = 1?',
        options: [
          'Nothing, because dp[2] is never read',
          'Every answer from dp[3] upward is too small, since two real routes reach step 2',
          'The program crashes with an index error',
          'Only odd values of n are affected',
        ],
        answerIndex: 1,
        explanation: 'dp[3] is dp[2] + dp[1], so an undercount in the base case flows into every later cell. Wrong base cases are the most common silent DP bug.',
      },
    ],
    sources: [
      'MIT 6.006 lectures on dynamic programming',
      'CLRS ch. 15, Dynamic Programming',
      'CP-Algorithms, dynamic programming section',
      'USACO Guide, Introduction to DP',
      'AtCoder Educational DP Contest, problems A and B',
      'CSES Problem Set, Dynamic Programming section',
    ],
    problems: [
      {
        id: 'fibonacci-number',
        title: 'Fibonacci Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/fibonacci-number/',
        patternId: 'dp-1d',
        hint: 'Write the plain recursion, then add a memo, then replace it with two rolling variables and compare how each behaves for n = 30.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        patternId: 'dp-1d',
        hint: 'To stand on step n you came from step n-1 or n-2, so add those two counts together.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'n-th-tribonacci-number',
        title: 'N-th Tribonacci Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/n-th-tribonacci-number/',
        patternId: 'dp-1d',
        hint: 'Same as Fibonacci but each value is the sum of the previous three; keep three rolling variables.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'min-cost-climbing-stairs',
        title: 'Min Cost Climbing Stairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
        patternId: 'dp-1d',
        hint: 'dp[i] is the cheapest way to stand on step i: cost[i] plus the smaller of dp[i-1] and dp[i-2].',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'perfect-squares',
        title: 'Perfect Squares',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/perfect-squares/',
        patternId: 'dp-1d',
        hint: 'dp[n] is 1 plus the minimum of dp[n - s] over every square s not larger than n; start from the memoized recursion if the table feels hard.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 2. 1D DP
  // -------------------------------------------------------------------------
  {
    id: 'dp-1d',
    gateId: 'dynamic-programming',
    order: 2,
    title: '1D DP: One Array, One Decision Per Step',
    minutes: 30,
    summary: 'Solve problems where the best answer at position i depends on the best answers at a few earlier positions.',
    analogy:
      'You are walking down a street of houses deciding which to rob. At every house the only thing that matters is "what is the best I could have by the previous house, and by the one before that?" You do not need the whole history, just the last couple of totals.',
    explanation: `One-dimensional DP is the bread and butter of the topic. The state is a single index i (a position, an amount, a length) and dp[i] stores the best answer up to that point. Once you can say "dp[i] depends on dp[i-1] and dp[i-2]" or "dp[i] depends on dp[i - coin] for each coin", the code writes itself.

## Example 1: House Robber
Houses hold money; you cannot rob two neighbours. Maximise the loot.

Plain recursion first. At house i you either **skip** it (best up to i-1) or **rob** it (money[i] plus best up to i-2):

\`\`\`python
def rob(nums, i):
    if i < 0:
        return 0
    return max(rob(nums, i - 1), nums[i] + rob(nums, i - 2))
\`\`\`

Same shape as climbing stairs, so it has the same problem: rob(i-2) is computed from rob(i) and again from rob(i-1). Exponential. Turn it into a table:

\`\`\`python
def rob(nums):
    prev2, prev1 = 0, 0             # best up to i-2, best up to i-1
    for money in nums:
        prev2, prev1 = prev1, max(prev1, money + prev2)
    return prev1
\`\`\`

Trace [2, 7, 9, 3, 1]: prev1 becomes 2, 7, 11, 11, 12. Answer 12 (rob 2, 9, 1).

## Example 2: Coin Change (fewest coins)
Coins [1, 2, 5], amount 11. Here dp[a] = fewest coins to make amount a. To make a, the last coin was some c, so \`dp[a] = 1 + min(dp[a - c])\` over every coin c that fits.

\`\`\`python
def coin_change(coins, amount):
    INF = float('inf')
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1
\`\`\`

dp[11] = 3 (5 + 5 + 1). Time O(amount x coins). The naive "try every combination" recursion is exponential.

## The three questions to ask
1. **What is the state?** What single number describes "where I am"? Index i, amount a, step n.
2. **What choices exist at that state?** Skip or take. Which coin last. Jump 1 or 2.
3. **What is the base case?** Usually dp[0] = 0 or dp[0] = 1.

Answer those three and you have the transition. Write it as recursion, check it on a tiny input, then tabulate.

## Slow versus fast
- Slow: recursion branches at every step and forgets everything: O(2^n) or worse.
- Fast: one table entry per state, each filled in O(choices): O(n x choices). For House Robber that is O(n) time and, with two variables, O(1) space.

## Where people go wrong
- Forgetting the "skip" choice. The best answer at i is often the same as at i-1.
- Off-by-one on the table size. dp needs n + 1 cells if the state goes from 0 to n.
- Initialising with 0 when the problem is a minimum. Use infinity so untouched cells do not look like free wins.
- Circular variants (House Robber II): run the linear version twice, once without the first house and once without the last.

## How to recognise it in an interview
- A single sequence or a single number, and the words "maximum", "minimum", "number of ways".
- "You cannot pick two adjacent", "reach the end", "make up the amount".
- A choice at each step that only depends on a few previous results.`,
    naive: {
      title: 'Recursive skip-or-rob without memory',
      description:
        'At each house return the better of skipping it or robbing it plus the best from two houses back. The two branches overlap almost completely, so the same house is re-solved an exponential number of times.',
      time: 'O(2^n)',
      space: 'O(n) call stack',
      code: {
        python: `def rob_slow(nums):
    def best(i):
        if i < 0:
            return 0
        skip = best(i - 1)
        take = nums[i] + best(i - 2)   # re-solves the same i over and over
        return max(skip, take)
    return best(len(nums) - 1)`,
        javascript: `function robSlow(nums) {
  function best(i) {
    if (i < 0) return 0;
    const skip = best(i - 1);
    const take = nums[i] + best(i - 2);    // re-solves the same i over and over
    return Math.max(skip, take);
  }
  return best(nums.length - 1);
}`,
        java: `class Solution {
  public int robSlow(int[] nums) {
    return best(nums, nums.length - 1);
  }

  int best(int[] nums, int i) {
    if (i < 0) return 0;
    int skip = best(nums, i - 1);
    int take = nums[i] + best(nums, i - 2);  // re-solves the same i over and over
    return Math.max(skip, take);
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

int best(vector<int>& nums, int i) {
  if (i < 0) return 0;
  int skip = best(nums, i - 1);
  int take = nums[i] + best(nums, i - 2);    // re-solves the same i over and over
  return max(skip, take);
}

int robSlow(vector<int>& nums) {
  return best(nums, (int)nums.size() - 1);
}`,
      },
    },
    optimized: {
      title: 'Bottom-up with two rolling variables',
      description:
        'Walk the houses once. Keep the best total up to the previous house and up to the house before that. Each step computes max(skip, take) in O(1) and slides the two variables forward.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def rob(nums):
    prev2, prev1 = 0, 0             # best up to i-2, best up to i-1
    for money in nums:
        current = max(prev1, money + prev2)
        prev2, prev1 = prev1, current
    return prev1`,
        javascript: `function rob(nums) {
  let prev2 = 0, prev1 = 0;        // best up to i-2, best up to i-1
  for (const money of nums) {
    const current = Math.max(prev1, money + prev2);
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
        java: `class Solution {
  public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;      // best up to i-2, best up to i-1
    for (int money : nums) {
      int current = Math.max(prev1, money + prev2);
      prev2 = prev1;
      prev1 = current;
    }
    return prev1;
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

int rob(vector<int>& nums) {
  int prev2 = 0, prev1 = 0;        // best up to i-2, best up to i-1
  for (int money : nums) {
    int current = max(prev1, money + prev2);
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
      },
    },
    whyFaster:
      'The recursion explores both "skip" and "take" at every house and never remembers a result, so the call tree has about 2^n leaves. There are only n distinct states (best up to house i). Filling them in order means each state is computed once from two neighbours, so the total is O(n), and keeping only the last two values makes the space O(1).',
    keyPoints: [
      'State = one index. dp[i] = best answer using the first i items or amount i.',
      'List the choices at each state (skip / take, which coin last) and take max or min.',
      'Base case is usually dp[0]; use infinity for minimisation tables.',
      'dp[i] depends on a constant number of earlier cells: shrink to variables.',
      'Circular arrays: run the linear DP twice with one end removed.',
      'Trace a 5-element example by hand before you trust the code.',
    ],
    patternIds: ['dp-1d'],
    definition:
      'One-dimensional DP covers problems where a single number describes the state, such as an index, an amount or a length, and dp[i] stores the best value or the count for that state. Each cell is built from a small fixed set of earlier cells.',
    coreIdea:
      'At house i the only things that matter are the best total you could already hold at house i-1 and at house i-2; which exact houses were robbed is irrelevant. Because the whole past collapses into two numbers, there are only n states instead of 2^n subsets, and each state costs O(1). That turns O(2^n) into O(n), and since only two cells are ever read, the O(n) array shrinks to two variables and O(1) space.',
    visual: [
      {
        caption: 'House Robber on [2, 7, 9, 3, 1]. State: dp[i] = most money from the first i houses. Base: dp[0]=0, dp[1]=2.',
        frame: [
          'money      -    2    7    9    3    1',
          'i          0    1    2    3    4    5',
          'dp      [  0 ][  2 ][  . ][  . ][  . ][  . ]',
          '           ^     ^',
          '           base cells, no decision to make yet',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[2]. Transition: dp[i] = max(dp[i-1], money[i-1] + dp[i-2]).',
        frame: [
          'money      -    2    7    9    3    1',
          'i          0    1    2    3    4    5',
          'dp      [  0 ][  2 ][  7 ][  . ][  . ][  . ]',
          '           ^     ^     ^',
          '           |     |     +- new cell dp[2]',
          '           +-----+------- sources dp[0]=0 and dp[1]=2',
          '',
          'dp[2] = max(2, 7 + 0) = 7   (rob the 7)',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[3] from dp[1] and dp[2].',
        frame: [
          'money      -    2    7    9    3    1',
          'i          0    1    2    3    4    5',
          'dp      [  0 ][  2 ][  7 ][ 11 ][  . ][  . ]',
          '                 ^     ^     ^',
          '                 |     |     +- new cell dp[3]',
          '                 +-----+------- dp[1]=2 and dp[2]=7',
          '',
          'dp[3] = max(7, 9 + 2) = 11  (rob 2 and 9)',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[4]. Here skipping wins, so the running best simply carries over.',
        frame: [
          'money      -    2    7    9    3    1',
          'i          0    1    2    3    4    5',
          'dp      [  0 ][  2 ][  7 ][ 11 ][ 11 ][  . ]',
          '                       ^     ^     ^',
          '                       |     |     +- new cell dp[4]',
          '                       +-----+------- dp[2]=7 and dp[3]=11',
          '',
          'dp[4] = max(11, 3 + 7) = 11  (skip the 3)',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[5] and read the answer off the last cell.',
        frame: [
          'money      -    2    7    9    3    1',
          'i          0    1    2    3    4    5',
          'dp      [  0 ][  2 ][  7 ][ 11 ][ 11 ][ 12 ]',
          '                             ^     ^     ^',
          '                             +-----+-----+',
          '',
          'dp[5] = max(11, 1 + 11) = 12',
          'answer 12 = houses 2 + 9 + 1, no two adjacent',
        ].join('\n'),
      },
    ],
    pseudocode: `// House Robber shape.
// State:      dp[i] = best total using only the first i items.
// Transition: dp[i] = max(dp[i - 1], value[i - 1] + dp[i - 2]).
// Base case:  dp[0] = 0, dp[1] = value[0].

function bestOverSequence(value):
    n = length of value
    create table dp with n + 1 cells
    dp[0] = 0
    dp[1] = value[0]
    for i from 2 to n:
        skip = dp[i - 1]                       // leave item i alone
        take = value[i - 1] + dp[i - 2]        // take it, so item i-1 is out
        dp[i] = max(skip, take)
    return dp[n]

// Only two cells are ever read, so the array is not needed.
function bestRolling(value):
    prev2 = 0
    prev1 = 0
    for each v in value:
        current = max(prev1, v + prev2)
        prev2 = prev1
        prev1 = current
    return prev1`,
    complexity: [
      { label: 'Recursion, no memo', time: 'O(2^n)', space: 'O(n)', note: 'skip or take branches at every index; space is the call stack' },
      { label: 'DP table', time: 'O(n)', space: 'O(n)', note: 'n + 1 cells with O(1) work per cell' },
      { label: 'Rolling variables', time: 'O(n)', space: 'O(1)', note: 'keep only dp[i-1] and dp[i-2]' },
      { label: 'Coin Change shape', time: 'O(amount * coins)', space: 'O(amount)', note: 'every amount tries every coin; the bound follows the value of amount, not its digit count' },
    ],
    dryRun: {
      input: 'nums = [2, 7, 9, 3, 1]',
      goal: 'Find the largest total with no two neighbouring houses robbed, using the rolling variables prev2 and prev1.',
      steps: [
        { state: 'prev2=0 prev1=0', action: 'Start before the first house: with no houses the best total is 0.' },
        { state: 'money=2 prev2=0 prev1=0', action: 'current = max(0, 2 + 0) = 2, so robbing the first house wins; slide to prev2=0, prev1=2.' },
        { state: 'money=7 prev2=0 prev1=2', action: 'current = max(2, 7 + 0) = 7; slide to prev2=2, prev1=7.' },
        { state: 'money=9 prev2=2 prev1=7', action: 'current = max(7, 9 + 2) = 11, taking 9 plus the best from two houses back; slide to prev2=7, prev1=11.' },
        { state: 'money=3 prev2=7 prev1=11', action: 'current = max(11, 3 + 7) = 11, so skipping wins and the total stands still; slide to prev2=11, prev1=11.' },
        { state: 'money=1 prev2=11 prev1=11', action: 'current = max(11, 1 + 11) = 12; slide to prev2=11, prev1=12.' },
        { state: 'loop finished prev1=12', action: 'Every house has been considered, so return prev1.' },
      ],
      result: '12, from robbing 2, 9 and 1 (indices 0, 2 and 4). Every other legal set is smaller: 2+9=11, 7+3=10, 9+1=10, 7+1=8.',
    },
    mistakes: [
      {
        mistake: 'Writing dp[i] = value[i] + dp[i-2] and dropping the skip branch.',
        why: 'It forces you to take every second item. On [2, 1, 1, 2] it returns 3 instead of 4, because the best answer takes both ends and skips two in a row.',
        fix: 'Always compare both choices: dp[i] = max(dp[i-1], value[i-1] + dp[i-2]).',
      },
      {
        mistake: 'Filling a minimisation table such as Coin Change with zeros.',
        why: 'A zero means free, so an amount that cannot be built looks cheaper than one that can, and the minimum never rises above 0.',
        fix: 'Fill with a large sentinel (infinity, or amount + 1), keep dp[0] = 0, and translate the sentinel into -1 at the end.',
      },
      {
        mistake: 'Swapping the loop order between Coin Change II and Combination Sum IV.',
        why: 'Coins outside and amounts inside counts each combination once; amounts outside and coins inside counts every ordering separately. Both versions compile and quietly return the wrong count.',
        fix: 'Decide first whether order matters, then match the loops: unordered combinations put the items on the outside.',
      },
      {
        mistake: 'Handling House Robber II by wrapping the index with a modulo.',
        why: 'The real constraint is that the first and last house cannot both be taken, which a modulo does not express, so the DP happily robs both ends.',
        fix: 'Run the linear House Robber twice, once without the first house and once without the last, and take the larger. Handle n = 1 separately.',
      },
      {
        mistake: 'Allocating dp with n cells when the state runs from 0 to n.',
        why: 'dp[n] is then out of range, or the loop stops one step early and the last item is never considered.',
        fix: 'If the state includes the empty prefix, the table needs n + 1 cells. Say out loud what dp[0] and dp[n] mean before allocating.',
      },
    ],
    whenToUse: [
      'One sequence or one number, with the words maximum, minimum, or number of ways.',
      'The choice at position i depends only on a couple of earlier positions.',
      'A constraint like "you cannot pick two adjacent" or "reach the last index".',
      'An amount, capacity or length small enough to be used directly as an array index.',
    ],
    whenNotToUse: [
      'You must print the chosen set itself and n is at most about 20; backtracking gives you the sets directly.',
      'The amount goes up to 10^9; an array that long will not fit, so look for maths or a greedy rule.',
      'An exchange argument proves a greedy rule works, as in Jump Game reachability; greedy is shorter and O(n).',
      'The state needs two independent indices, such as two strings or a grid; that is 2D DP, not 1D.',
      'Each cell needs the best over all earlier cells under a range condition; plain O(n^2) DP times out, so add a segment tree or a monotonic structure.',
    ],
    relatedTopics: [
      { id: 'dp-intro-memo-and-tabulation', kind: 'concept', why: 'Every 1D DP here is the memoized recursion from the intro, rewritten as a loop.' },
      { id: 'kadane-max-subarray', kind: 'concept', why: 'Kadane is the smallest 1D DP: best subarray ending at i, kept in a single rolling variable.' },
      { id: 'knapsack', kind: 'concept', why: 'Coin Change is a 1D table over amounts, which is the knapsack table with capacity as the index.' },
      { id: 'greedy-basics', kind: 'concept', why: 'Some 1D DP problems, such as Jump Game, collapse into a one-line greedy once the exchange argument is proved.' },
    ],
    quiz: [
      {
        question: 'Coin Change with coins [1, 2, 5] and amount 100 fills a table of 101 cells. What is the time complexity?',
        options: [
          'O(amount), because there is one loop over amounts',
          'O(amount * number of coins), since every amount tries every coin',
          'O(2^amount), because each coin can be used many times',
          'O(coins * log amount), thanks to binary search',
        ],
        answerIndex: 1,
        explanation: 'The outer loop runs over amounts and the inner loop over coins, so the work is the product of the two sizes: 101 x 3 steps here.',
      },
      {
        question: 'On House Robber, why can the dp array be thrown away and replaced by two variables?',
        options: [
          'Because the values in the array are always increasing',
          'Because dp[i] only ever reads dp[i-1] and dp[i-2], so older cells are dead',
          'Because the answer is always the sum of alternating elements',
          'Because the input happens to be sorted',
        ],
        answerIndex: 1,
        explanation: 'Space can be reduced whenever the transition reaches back a fixed, small number of cells. Nothing older is read again, so it can be dropped.',
      },
      {
        question: 'Would 1D DP be the right tool for "maximum sum of a subarray of exactly k elements"?',
        options: [
          'Yes, and it is the natural tool here',
          'It works, but a fixed-size sliding window is simpler and also O(n)',
          'No, that problem needs a 2D table',
          'No, the array must be sorted first',
        ],
        answerIndex: 1,
        explanation: 'A fixed window length is a window problem, not a decision-per-step problem. Add the entering element and subtract the leaving one, in O(n) time and O(1) space.',
      },
      {
        question: 'A Coin Change table is initialised to 0 everywhere instead of infinity. What goes wrong?',
        options: [
          'Nothing, 0 is a safe starting value for a minimum',
          'Unreachable amounts look like they cost 0 coins, so the minimum is never correct',
          'The program crashes on amount 0',
          'It only breaks when one of the coins has value 1',
        ],
        answerIndex: 1,
        explanation: 'A minimisation table must start worse than any real answer. A 0 is better than every real answer, so it wins every comparison and poisons the table.',
      },
    ],
    sources: [
      'CLRS ch. 15, Dynamic Programming',
      'MIT 6.006 lectures on dynamic programming',
      'USACO Guide, Introduction to DP',
      'CSES Problem Set, Dice Combinations and Minimizing Coins',
      'AtCoder Educational DP Contest, problems A to C',
      'CP-Algorithms, dynamic programming section',
    ],
    problems: [
      {
        id: 'house-robber',
        title: 'House Robber',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/house-robber/',
        patternId: 'dp-1d',
        hint: 'At each house take max(best up to previous house, this house plus best up to two houses back).',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'delete-and-earn',
        title: 'Delete and Earn',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/delete-and-earn/',
        patternId: 'dp-1d',
        hint: 'Bucket the points by value so that choosing value v forbids v-1 and v+1; that is House Robber over the value axis.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'house-robber-ii',
        title: 'House Robber II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/house-robber-ii/',
        patternId: 'dp-1d',
        hint: 'The first and last house cannot both be robbed, so run the linear House Robber on nums[1:] and on nums[:-1] and take the larger.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'coin-change',
        title: 'Coin Change',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/coin-change/',
        patternId: 'dp-1d',
        hint: 'dp[a] is the fewest coins to make amount a; for every coin c that fits, try 1 + dp[a - c], and keep infinity where no coins work.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'maximum-product-subarray',
        title: 'Maximum Product Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-product-subarray/',
        patternId: 'dp-1d',
        hint: 'A negative number flips the best and worst, so track both the maximum and the minimum product ending at each index.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'jump-game',
        title: 'Jump Game',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/jump-game/',
        patternId: 'dp-1d',
        hint: 'dp[i] says whether index i is reachable; or simpler, keep the furthest index you can reach so far and stop if you fall behind it.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'minimum-cost-for-tickets',
        title: 'Minimum Cost For Tickets',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-cost-for-tickets/',
        patternId: 'dp-1d',
        hint: 'dp[day] is the cheapest cover through that day; on a travel day take the min over buying a 1, 7 or 30-day pass ending today.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 3. 2D DP on grids
  // -------------------------------------------------------------------------
  {
    id: 'dp-2d-grids',
    gateId: 'dynamic-programming',
    order: 3,
    title: '2D DP on Grids: Paths and Sums',
    minutes: 25,
    summary: 'When you can only move right or down, every cell answer comes from the cell above and the cell to the left.',
    analogy:
      'Counting the routes to a shop in a city where you can only go east or south. The number of ways to reach any crossing is the ways to reach the crossing north of it plus the ways to reach the one west of it, because you must have come from one of those two.',
    explanation: `Grid DP is 1D DP with two indices. The state is a cell (r, c) and, because movement is restricted (usually right or down), each cell depends on only its top and left neighbours. That makes the table easy to fill row by row.

## Step 1: recursion
Unique Paths: an m x n grid, start top-left, move only right or down, count the ways to reach bottom-right.

You can only arrive at (r, c) from (r-1, c) or (r, c-1). So:

\`\`\`python
def paths(r, c):
    if r == 0 or c == 0:
        return 1                    # only one way along an edge
    return paths(r - 1, c) + paths(r, c - 1)
\`\`\`

## Step 2: see the repeated work
paths(2, 2) calls paths(1, 2) and paths(2, 1). Both of those call paths(1, 1). The same cell is asked for again and again; for a 15 x 15 grid this is millions of calls for only 225 distinct cells.

## Step 3: memo, then table
Memo: cache on the pair (r, c). Table: create an m x n grid, fill the first row and first column with 1, then fill the rest left to right, top to bottom.

\`\`\`python
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[m - 1][n - 1]
\`\`\`

For a 3 x 3 grid the table is:
\`\`\`
1 1 1
1 2 3
1 3 6
\`\`\`
Six paths.

## Step 4: one row is enough
Row r only reads row r-1 and the cell just to its left. Keep a single array: \`dp[c] += dp[c - 1]\` while walking each row. When you read dp[c] it still holds the value from the row above, and dp[c-1] is already the new row. O(n) space.

## Same skeleton, different operation
- **Minimum Path Sum**: dp[r][c] = grid[r][c] + min(top, left). Fill the first row and column with running sums.
- **Unique Paths II** (obstacles): an obstacle cell gets 0 and stops the chain.
- **Triangle / Minimum Falling Path**: each cell picks the best of the two or three cells above it.
- **Maximal Square**: dp[r][c] = 1 + min(top, left, top-left) if the cell is 1. This is the size of the largest square whose bottom-right corner is here.

## Slow versus fast
- Slow: recursion from the target cell back to the start: about 2^(m+n) calls.
- Fast: fill m x n cells once, each in O(1): O(m x n) time, O(n) space with the rolling row.
- Nothing about the logic changed; we just stopped recomputing cells.

## Where people go wrong
- Filling the table in the wrong order so a cell reads a neighbour that is still empty. Top and left must be done first.
- Base cases: the first row and first column are special. Handle them before the double loop.
- Using min with 0 defaults; initialise with infinity when minimising.
- Trying to use grid DP when moves go in all four directions. Then it is a graph problem (BFS/Dijkstra), not DP.

## How to recognise it in an interview
- A matrix plus "only move right or down" (or "down / diagonal").
- "Number of paths", "minimum path sum", "largest square", "falling path".
- The value at a cell can be built from neighbours that were processed earlier.`,
    naive: {
      title: 'Recursive count from the target cell backwards',
      description:
        'The number of ways to reach a cell is the ways to reach the cell above plus the cell to the left. Without a memo the same cell is asked for exponentially many times.',
      time: 'O(2^(m+n))',
      space: 'O(m + n) call stack',
      code: {
        python: `def unique_paths_slow(m, n):
    def paths(r, c):
        if r == 0 or c == 0:
            return 1
        return paths(r - 1, c) + paths(r, c - 1)   # same cell asked many times
    return paths(m - 1, n - 1)`,
        javascript: `function uniquePathsSlow(m, n) {
  function paths(r, c) {
    if (r === 0 || c === 0) return 1;
    return paths(r - 1, c) + paths(r, c - 1);     // same cell asked many times
  }
  return paths(m - 1, n - 1);
}`,
        java: `class Solution {
  public int uniquePathsSlow(int m, int n) {
    return paths(m - 1, n - 1);
  }

  int paths(int r, int c) {
    if (r == 0 || c == 0) return 1;
    return paths(r - 1, c) + paths(r, c - 1);     // same cell asked many times
  }
}`,
        cpp: `int paths(int r, int c) {
  if (r == 0 || c == 0) return 1;
  return paths(r - 1, c) + paths(r, c - 1);       // same cell asked many times
}

int uniquePathsSlow(int m, int n) {
  return paths(m - 1, n - 1);
}`,
      },
    },
    optimized: {
      title: 'Fill a table row by row, then keep one row',
      description:
        'Initialise the first row with 1s. For each following row, walk left to right: dp[c] (still the value from above) plus dp[c-1] (already the new row). Each cell is computed once.',
      time: 'O(m * n)',
      space: 'O(n)',
      code: {
        python: `def unique_paths(m, n):
    dp = [1] * n                     # first row: one way to each cell
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c - 1]       # above (old dp[c]) + left (new dp[c-1])
    return dp[n - 1]`,
        javascript: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);   // first row: one way to each cell
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[c] += dp[c - 1];            // above (old dp[c]) + left (new dp[c-1])
    }
  }
  return dp[n - 1];
}`,
        java: `class Solution {
  public int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    java.util.Arrays.fill(dp, 1);    // first row: one way to each cell
    for (int r = 1; r < m; r++) {
      for (int c = 1; c < n; c++) {
        dp[c] += dp[c - 1];          // above (old dp[c]) + left (new dp[c-1])
      }
    }
    return dp[n - 1];
  }
}`,
        cpp: `#include <vector>
using namespace std;

int uniquePaths(int m, int n) {
  vector<int> dp(n, 1);              // first row: one way to each cell
  for (int r = 1; r < m; r++)
    for (int c = 1; c < n; c++)
      dp[c] += dp[c - 1];            // above (old dp[c]) + left (new dp[c-1])
  return dp[n - 1];
}`,
      },
    },
    whyFaster:
      'The recursion branches into two calls per cell and never stores results, so the number of calls grows like 2^(m+n). There are only m*n distinct cells. Filling them in an order where top and left are always ready means each cell costs O(1), so the total is O(m*n). Because a row only needs the previous row, one array of length n is enough.',
    keyPoints: [
      'State = (row, col). Transition = top and left (or the cells above for triangles).',
      'Fill order matters: every neighbour you read must already be computed.',
      'First row and first column are base cases; set them before the double loop.',
      'Counting: add. Min cost: grid value + min. Max square: 1 + min of three.',
      'Roll the table down to one row when only the previous row is read.',
      'Four-direction movement is not grid DP; reach for BFS or Dijkstra instead.',
    ],
    patternIds: ['dp-2d'],
    definition:
      'Grid DP solves problems on a matrix where the state is a cell (row, column) and movement is restricted, usually to right and down. Each cell is computed from neighbours that were already filled, so one sweep of the table answers the whole question.',
    coreIdea:
      'If you can only step right or down, every route into cell (r, c) passes through the cell above it or the cell to its left, and nothing else. So the answer for a cell is a one-line combination of two numbers that are already known. There are m*n cells and each costs O(1), which replaces the roughly 2^(m+n) routes the plain recursion would walk one at a time.',
    visual: [
      {
        caption: 'Unique Paths on a 3x3 grid. State: dp[r][c] = routes from the start to that cell. Base: the top row and left column are all 1.',
        frame: [
          '          c0    c1    c2',
          'r0     [  1 ][  1 ][  1 ]',
          'r1     [  1 ][  . ][  . ]',
          'r2     [  1 ][  . ][  . ]',
          '',
          'only one straight line reaches an edge cell',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[1][1]. Transition: dp[r][c] = dp[r-1][c] + dp[r][c-1].',
        frame: [
          '          c0    c1    c2',
          'r0     [  1 ][  1u][  1 ]',
          'r1     [  1l][  2*][  . ]',
          'r2     [  1 ][  . ][  . ]',
          '',
          'u = source above, l = source left, * = new cell',
          'dp[1][1] = 1 (above) + 1 (left) = 2',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[1][2], still moving left to right along row 1.',
        frame: [
          '          c0    c1    c2',
          'r0     [  1 ][  1 ][  1u]',
          'r1     [  1 ][  2l][  3*]',
          'r2     [  1 ][  . ][  . ]',
          '',
          'dp[1][2] = 1 (above) + 2 (left) = 3',
        ].join('\n'),
      },
      {
        caption: 'Fill dp[2][1] at the start of the next row.',
        frame: [
          '          c0    c1    c2',
          'r0     [  1 ][  1 ][  1 ]',
          'r1     [  1 ][  2u][  3 ]',
          'r2     [  1l][  3*][  . ]',
          '',
          'dp[2][1] = 2 (above) + 1 (left) = 3',
        ].join('\n'),
      },
      {
        caption: 'Fill the last cell. The answer sits in the bottom-right corner.',
        frame: [
          '          c0    c1    c2',
          'r0     [  1 ][  1 ][  1 ]',
          'r1     [  1 ][  2 ][  3u]',
          'r2     [  1 ][  3l][  6*]',
          '',
          'dp[2][2] = 3 (above) + 3 (left) = 6',
          'answer: 6 routes across a 3x3 grid',
        ].join('\n'),
      },
    ],
    pseudocode: `// Unique Paths.
// State:      dp[r][c] = number of routes from (0,0) to (r,c).
// Transition: dp[r][c] = dp[r-1][c] + dp[r][c-1].
// Base case:  dp[0][c] = 1 and dp[r][0] = 1, one straight line each.

function uniquePaths(rows, cols):
    create table dp of size rows x cols
    for c from 0 to cols - 1:
        dp[0][c] = 1
    for r from 0 to rows - 1:
        dp[r][0] = 1
    for r from 1 to rows - 1:                 // top and left are ready first
        for c from 1 to cols - 1:
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[rows - 1][cols - 1]

// Minimum Path Sum is the same sweep with one line changed:
//     dp[r][c] = grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])
// Maximal Square, for a cell holding 1:
//     dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1])`,
    complexity: [
      { label: 'Recursion, no memo', time: 'O(2^(m+n))', space: 'O(m + n)', note: 'one branch per direction and the same cell asked many times' },
      { label: 'Full table', time: 'O(m * n)', space: 'O(m * n)', note: 'each cell filled once; keep the table if the path must be rebuilt' },
      { label: 'Rolling row', time: 'O(m * n)', space: 'O(n)', note: 'a row only reads the row above and the cell to its left' },
      { label: 'Empty grid, closed form', time: 'O(m + n)', space: 'O(1)', note: 'with no obstacles the count is the binomial C(m+n-2, m-1)' },
    ],
    dryRun: {
      input: 'm = 3, n = 3 (a 3x3 grid, moving only right or down)',
      goal: 'Count the routes from the top-left to the bottom-right using the single rolling row dp of length 3.',
      steps: [
        { state: 'dp = [1, 1, 1]', action: 'Row 0 is the base case: exactly one route reaches each cell of the top row.' },
        { state: 'row 1, c=1, dp = [1, 1, 1]', action: 'dp[1] += dp[0] gives 1 + 1 = 2. The old dp[1] was the cell above, dp[0] is the cell to the left in the new row.' },
        { state: 'row 1, c=2, dp = [1, 2, 1]', action: 'dp[2] += dp[1] gives 1 + 2 = 3, so row 1 is now [1, 2, 3].' },
        { state: 'row 2, c=1, dp = [1, 2, 3]', action: 'dp[1] += dp[0] gives 2 + 1 = 3.' },
        { state: 'row 2, c=2, dp = [1, 3, 3]', action: 'dp[2] += dp[1] gives 3 + 3 = 6, so row 2 is [1, 3, 6].' },
        { state: 'rows finished, dp = [1, 3, 6]', action: 'Return the last cell of the row, which is the bottom-right corner.' },
      ],
      result: '6. It matches the binomial check C(4, 2) = 6, and the routes can be listed as the arrangements of two rights and two downs: RRDD, RDRD, RDDR, DRRD, DRDR, DDRR.',
    },
    mistakes: [
      {
        mistake: 'Sweeping bottom to top and right to left while the transition reads the cell above and to the left.',
        why: 'A cell then reads a neighbour that is still empty, so it silently adds zeros and every count comes out too small.',
        fix: 'Match the loop order to the transition: if you read up and left, sweep rows top to bottom and columns left to right.',
      },
      {
        mistake: 'Setting the whole first row of Unique Paths II to 1 even after an obstacle.',
        why: 'Once the top row is blocked, no cell beyond the block is reachable along that row, but the loop keeps writing 1 and invents routes that do not exist.',
        fix: 'Walk the first row and column and stop writing 1 the moment you hit an obstacle; every cell after it is 0.',
      },
      {
        mistake: 'Using 0 as the starting value for a minimum-cost grid.',
        why: 'min(0, real cost) always picks 0, so the answer collapses to the cheapest single cell instead of a whole path.',
        fix: 'Set the base row and column to running sums, and use infinity for any cell that must not be entered.',
      },
      {
        mistake: 'Reaching for grid DP when moves go up, down, left and right.',
        why: 'Four-way movement creates cycles, so no order exists in which every neighbour is already final; the DP either loops or returns wrong answers.',
        fix: 'Treat it as a graph: BFS for unweighted shortest steps, Dijkstra when the cells carry costs.',
      },
      {
        mistake: 'Rolling the table down to one row and then trying to print the actual path.',
        why: 'The rolling row overwrites history, so the choices that produced the answer are gone.',
        fix: 'Keep the full m x n table, or store a separate matrix of the direction chosen in each cell, whenever the path itself is required.',
      },
    ],
    whenToUse: [
      'A matrix plus a movement rule such as "only right or down" or "down, down-left, down-right".',
      'The question asks for the number of paths, the minimum path sum, or the best falling path.',
      'A cell value can be written using only neighbours that come earlier in the sweep.',
      'Largest square or rectangle of ones, where a cell summarises the block that ends at it.',
    ],
    whenNotToUse: [
      'Movement is allowed in all four directions, so cycles exist; use BFS for unweighted grids and Dijkstra for weighted ones.',
      'Cells may be revisited or items collected in any order; that is a graph or state-space search, not a table sweep.',
      'The grid is empty and enormous; plain Unique Paths is the binomial C(m+n-2, m-1), computed in O(m+n).',
      'The grid is huge but only a few cells matter; compress the coordinates and run the DP over those cells instead.',
      'You need the path itself under tight memory; a rolling row cannot reconstruct it, so store parent choices.',
    ],
    relatedTopics: [
      { id: 'dp-1d', kind: 'concept', why: 'A single grid row is a 1D DP; grid DP is the same loop nested once more.' },
      { id: 'grid-graphs', kind: 'concept', why: 'The moment movement becomes four-directional the same matrix stops being a DP and becomes a graph traversal.' },
      { id: 'shortest-paths', kind: 'concept', why: 'Weighted grids with free movement need Dijkstra, the general version of the minimum-path-sum sweep.' },
      { id: 'lcs-and-lis', kind: 'concept', why: 'The LCS table is the same two-index sweep, with strings on the axes instead of grid coordinates.' },
    ],
    quiz: [
      {
        question: 'On a 100 x 100 grid with moves only right or down, how many cells does the DP compute and what is the time complexity?',
        options: [
          '10000 cells, O(m * n)',
          '200 cells, O(m + n)',
          'About 2^200 cells, O(2^(m+n))',
          '10000 cells, but O(m * n * log n) because of the max operation',
        ],
        answerIndex: 0,
        explanation: 'One cell per position and O(1) work per cell gives 100 x 100 = 10000 constant-time steps. The exponential figure is what the memo-free recursion would cost.',
      },
      {
        question: 'Which loop order is correct when dp[r][c] reads the cell above and the cell to the left?',
        options: [
          'Rows bottom to top, columns right to left',
          'Rows top to bottom, columns left to right',
          'Any order, since the values settle after one pass',
          'Diagonals only, starting from the bottom-right corner',
        ],
        answerIndex: 1,
        explanation: 'Every source cell must already hold its final value. Reading up and left means sweeping downwards and rightwards.',
      },
      {
        question: 'A robot may move up, down, left and right on a grid of costs and wants the cheapest route. Does the right-or-down table still work?',
        options: [
          'Yes, just run the same sweep four times',
          'No, four-way movement creates cycles with no valid fill order; use Dijkstra',
          'Yes, if you take the minimum over all four neighbours in one pass',
          'No, and the problem cannot be solved in polynomial time',
        ],
        answerIndex: 1,
        explanation: 'DP needs an order in which every source is already final. With cycles no such order exists, so you need a shortest-path algorithm that settles nodes by cost.',
      },
      {
        question: 'Maximal Square uses dp[r][c] = 1 + min of three neighbours. Why min and not max?',
        options: [
          'To keep the numbers small and avoid overflow',
          'Because a square can only grow as far as its weakest corner allows, so the smallest neighbour is the limit',
          'Because max would be slower',
          'Because the grid contains only zeros and ones',
        ],
        answerIndex: 1,
        explanation: 'The new square has to be solid, so it is limited by the smallest of the squares ending above, to the left and diagonally. Using max would claim squares that contain a zero.',
      },
    ],
    sources: [
      'CLRS ch. 15, Dynamic Programming',
      'MIT 6.006 lectures on dynamic programming',
      'USACO Guide, Introduction to DP and grid paths',
      'CSES Problem Set, Grid Paths',
      'AtCoder Educational DP Contest, problem H (Grid 1)',
      'CP-Algorithms, dynamic programming section',
    ],
    problems: [
      {
        id: 'unique-paths',
        title: 'Unique Paths',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/unique-paths/',
        patternId: 'dp-2d',
        hint: 'Every cell equals the cell above plus the cell to the left; the first row and column are all 1.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'unique-paths-ii',
        title: 'Unique Paths II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/unique-paths-ii/',
        patternId: 'dp-2d',
        hint: 'Same as Unique Paths but an obstacle cell is set to 0 ways, including in the first row and column.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'minimum-path-sum',
        title: 'Minimum Path Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-path-sum/',
        patternId: 'dp-2d',
        hint: 'dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]); you can overwrite the grid itself.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'triangle',
        title: 'Triangle',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/triangle/',
        patternId: 'dp-2d',
        hint: 'Work from the bottom row up: each cell becomes its value plus the smaller of the two cells below it.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'minimum-falling-path-sum',
        title: 'Minimum Falling Path Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-falling-path-sum/',
        patternId: 'dp-2d',
        hint: 'Each cell adds the minimum of the three cells above it (up-left, up, up-right); answer is the minimum of the last row.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'maximal-square',
        title: 'Maximal Square',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximal-square/',
        patternId: 'dp-2d',
        hint: 'For a 1 cell, dp = 1 + min(top, left, top-left) gives the largest square ending there; track the max and square it.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'dungeon-game',
        title: 'Dungeon Game',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/dungeon-game/',
        patternId: 'dp-2d',
        hint: 'Fill from the bottom-right backwards: the health needed at a cell is max(1, min(need right, need down) - cell value).',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 4. Knapsack
  // -------------------------------------------------------------------------
  {
    id: 'knapsack',
    gateId: 'dynamic-programming',
    order: 4,
    title: 'Knapsack: Pick Items Under a Limit',
    minutes: 30,
    summary: 'Choose a subset of items to hit a target sum or maximise value under a capacity, by building a table of reachable totals.',
    analogy:
      'Packing a suitcase with a weight limit. For each item you ask "if I include this, what is the best I can do with the remaining allowance?" and compare with leaving it out. The table remembers the best packing for every possible remaining allowance.',
    explanation: `Knapsack problems ask you to pick some items so a total (weight, sum, count) stays within a limit or hits a target exactly. Each item is either taken or not. The state is "which item am I looking at, and how much capacity is left", and the answer at each state is the better of taking or skipping.

## Step 1: recursion
Partition Equal Subset Sum: can you split nums into two groups with equal sums? Equivalent question: is there a subset that adds up to total / 2?

\`\`\`python
def can_make(nums, i, target):
    if target == 0:
        return True
    if i == len(nums) or target < 0:
        return False
    take = can_make(nums, i + 1, target - nums[i])
    skip = can_make(nums, i + 1, target)
    return take or skip
\`\`\`

Every item doubles the number of paths: 2^n subsets. For 200 numbers that is not going to finish.

## Step 2: notice the repeated work
The state is only (i, target). Different paths reach the same state: taking 3 then skipping 5 lands where skipping 3 and taking... well, different subsets can have the same sum. There are at most n x target distinct states, far fewer than 2^n.

## Step 3: the table
dp[t] = True if some subset of the items seen so far sums to t. Start with dp[0] = True. For each number, update every t that could now be reached.

\`\`\`python
def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for t in range(target, num - 1, -1):     # go DOWN
            dp[t] = dp[t] or dp[t - num]
    return dp[target]
\`\`\`

Why loop **downwards**? dp[t - num] must still be the value from before this item. Going upward would let the same item be used twice.

## A tiny example
nums = [1, 5, 11, 5], target = 11.
- After 1: reachable {0, 1}
- After 5: {0, 1, 5, 6}
- After 11: {0, 1, 5, 6, 11, 12, ...} -> 11 is reachable. True.

## The 0/1 versus unbounded switch
- **0/1 knapsack** (each item once): inner loop goes from high to low.
- **Unbounded knapsack** (reuse allowed, like Coin Change II): inner loop goes from low to high, so the item can build on itself.
That one line direction is the whole difference. Memorise it.

## Counting and maximising
- Count ways: dp[t] += dp[t - num] with dp[0] = 1.
- Maximise value with weights: dp[w] = max(dp[w], value + dp[w - weight]).
- Target Sum (+/- signs): the "+" group must sum to (total + S) / 2, then count subsets.

## Slow versus fast
- Slow: try all 2^n subsets.
- Fast: O(n x target) table cells, each O(1). With n = 200 and target = 10,000 that is 2 million steps instead of 2^200.

## Where people go wrong
- Looping upward in 0/1 knapsack and accidentally reusing items.
- Forgetting the parity check or a target that is impossible from the start.
- Using a 2D table when the 1D version is simpler and enough.
- Treating a "count the ways" problem as a "can we reach" problem, or vice versa.

## How to recognise it in an interview
- "Subset", "choose items", "capacity", "sum equals", "split into two groups".
- A limit (weight, budget, count) and a value to maximise or a target to hit.
- Each item can be used once (0/1) or many times (unbounded).`,
    naive: {
      title: 'Try every subset with take-or-skip recursion',
      description:
        'For each number decide to take it (subtract from the target) or skip it. Both branches recurse on the next index, so all 2^n subsets are explored and the same (index, target) pairs are hit again and again.',
      time: 'O(2^n)',
      space: 'O(n) call stack',
      code: {
        python: `def can_partition_slow(nums):
    total = sum(nums)
    if total % 2:
        return False

    def can_make(i, target):
        if target == 0:
            return True
        if i == len(nums) or target < 0:
            return False
        # every path is explored, states repeat
        return can_make(i + 1, target - nums[i]) or can_make(i + 1, target)

    return can_make(0, total // 2)`,
        javascript: `function canPartitionSlow(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  function canMake(i, target) {
    if (target === 0) return true;
    if (i === nums.length || target < 0) return false;
    // every path is explored, states repeat
    return canMake(i + 1, target - nums[i]) || canMake(i + 1, target);
  }
  return canMake(0, total / 2);
}`,
        java: `class Solution {
  public boolean canPartitionSlow(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % 2 != 0) return false;
    return canMake(nums, 0, total / 2);
  }

  boolean canMake(int[] nums, int i, int target) {
    if (target == 0) return true;
    if (i == nums.length || target < 0) return false;
    // every path is explored, states repeat
    return canMake(nums, i + 1, target - nums[i]) || canMake(nums, i + 1, target);
  }
}`,
        cpp: `#include <vector>
#include <numeric>
using namespace std;

bool canMake(vector<int>& nums, int i, int target) {
  if (target == 0) return true;
  if (i == (int)nums.size() || target < 0) return false;
  // every path is explored, states repeat
  return canMake(nums, i + 1, target - nums[i]) || canMake(nums, i + 1, target);
}

bool canPartitionSlow(vector<int>& nums) {
  int total = accumulate(nums.begin(), nums.end(), 0);
  if (total % 2 != 0) return false;
  return canMake(nums, 0, total / 2);
}`,
      },
    },
    optimized: {
      title: '1D reachable-sum table with a downward inner loop',
      description:
        'dp[t] records whether sum t is reachable with the items seen so far. For each item, sweep t from target down to the item value so each item is used at most once.',
      time: 'O(n * target)',
      space: 'O(target)',
      code: {
        python: `def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for t in range(target, num - 1, -1):    # downward: use item once
            if dp[t - num]:
                dp[t] = True
    return dp[target]`,
        javascript: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums) {
    for (let t = target; t >= num; t--) {       // downward: use item once
      if (dp[t - num]) dp[t] = true;
    }
  }
  return dp[target];
}`,
        java: `class Solution {
  public boolean canPartition(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % 2 != 0) return false;
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums) {
      for (int t = target; t >= num; t--) {     // downward: use item once
        if (dp[t - num]) dp[t] = true;
      }
    }
    return dp[target];
  }
}`,
        cpp: `#include <vector>
#include <numeric>
using namespace std;

bool canPartition(vector<int>& nums) {
  int total = accumulate(nums.begin(), nums.end(), 0);
  if (total % 2 != 0) return false;
  int target = total / 2;
  vector<bool> dp(target + 1, false);
  dp[0] = true;
  for (int num : nums)
    for (int t = target; t >= num; t--)         // downward: use item once
      if (dp[t - num]) dp[t] = true;
  return dp[target];
}`,
      },
    },
    whyFaster:
      'The recursion explores all 2^n subsets even though many of them land on the same (index, remaining target) state. The table has only n * target states and fills each in O(1). The downward loop lets a single array stand in for the whole 2D table while still guaranteeing each item is counted once.',
    keyPoints: [
      'State = (item index, remaining capacity). Choice = take or skip.',
      'dp[0] = True (or 1 for counting, 0 for max value).',
      '0/1 knapsack: inner loop goes DOWN so each item is used once.',
      'Unbounded knapsack: inner loop goes UP so items can repeat.',
      'Convert tricky statements (partition, +/- signs) into "subset with sum = X".',
      'Complexity O(n * target); check that target is small enough for a table.',
    ],
    patternIds: ['knapsack', 'dp-1d'],
    problems: [
      {
        id: 'partition-equal-subset-sum',
        title: 'Partition Equal Subset Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
        patternId: 'knapsack',
        hint: 'If the total is odd answer false; otherwise ask whether some subset reaches total / 2 with a downward-loop reachable table.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'target-sum',
        title: 'Target Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/target-sum/',
        patternId: 'knapsack',
        hint: 'The numbers given a plus sign must add to (total + target) / 2; count the subsets that reach that sum.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'coin-change-ii',
        title: 'Coin Change II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/coin-change-ii/',
        patternId: 'knapsack',
        hint: 'Unbounded knapsack: loop coins on the outside and amounts upward on the inside so each combination is counted once.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'last-stone-weight-ii',
        title: 'Last Stone Weight II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/last-stone-weight-ii/',
        patternId: 'knapsack',
        hint: 'Split the stones into two groups as close to equal as possible; find the largest reachable sum not exceeding total / 2.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'ones-and-zeroes',
        title: 'Ones and Zeroes',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/ones-and-zeroes/',
        patternId: 'knapsack',
        hint: 'A knapsack with two capacities (zeros and ones); loop both capacities downward for each string.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'combination-sum-iv',
        title: 'Combination Sum IV',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/combination-sum-iv/',
        patternId: 'knapsack',
        hint: 'Order matters here, so loop the target on the outside and the numbers on the inside; dp[t] += dp[t - num].',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'profitable-schemes',
        title: 'Profitable Schemes',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/profitable-schemes/',
        patternId: 'knapsack',
        hint: 'A 2D knapsack over (people used, profit capped at minProfit); loop both dimensions downward per crime and sum the states with enough profit.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 5. LCS and LIS
  // -------------------------------------------------------------------------
  {
    id: 'lcs-and-lis',
    gateId: 'dynamic-programming',
    order: 5,
    title: 'LCS and LIS: Subsequence DP',
    minutes: 30,
    summary: 'Find the longest subsequence that is increasing (one array) or shared (two strings) by building answers that end at each position.',
    analogy:
      'Two friends compare their holiday photo albums to find the longest series of moments they both captured, in the same order but with gaps allowed. That is LCS. LIS is one friend picking the longest series of photos where each one is taken at a higher altitude than the last.',
    explanation: `A subsequence keeps the order of elements but may skip some. "ace" is a subsequence of "abcde". Two classic questions: the Longest Increasing Subsequence (LIS) of one array, and the Longest Common Subsequence (LCS) of two strings. Both become easy once you define dp by "the best subsequence that **ends here**".

## LIS, step 1: recursion
For each index i, the best increasing subsequence ending at i is 1 plus the best ending at some earlier j where nums[j] < nums[i]. Try every subsequence and you are at 2^n.

## LIS, step 2: the table
\`\`\`python
def length_of_lis(nums):
    n = len(nums)
    dp = [1] * n                      # each element alone is length 1
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
\`\`\`

nums = [10, 9, 2, 5, 3, 7, 101, 18] gives dp = [1, 1, 1, 2, 2, 3, 4, 4], answer 4 (2, 5, 7, 101). O(n^2) time, O(n) space.

## LIS, step 3: the O(n log n) upgrade
Keep a list \`tails\` where tails[k] is the smallest possible last value of an increasing subsequence of length k+1. For each number, binary-search its position in tails and either replace or append. The length of tails is the answer. This is only needed when n is around 10^5; the O(n^2) version is what interviewers usually expect first.

## LCS: two strings, one table
dp[i][j] = length of the LCS of the first i letters of A and the first j letters of B.
- If A[i-1] == B[j-1], both letters extend the answer: dp[i][j] = dp[i-1][j-1] + 1.
- Otherwise, drop one letter from either side: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).

\`\`\`python
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
\`\`\`

A = "abcde", B = "ace": the table ends at 3. O(m x n) time, and O(n) space if you keep two rows.

## A tiny example of the LCS table
a = "ab", b = "ba". Row for "a": [0, 0, 1]. Row for "ab": [0, 1, 1]. Answer 1: only one letter can match in order.

## Slow versus fast
- Slow: enumerate all 2^n subsequences of one string and check them against the other: exponential.
- Fast: fill n^2 (LIS) or m x n (LCS) cells, each O(1).
- The state "best answer ending at position i (and j)" is what turns exponential into polynomial.

## Cousins you will meet
- Uncrossed Lines is LCS with numbers instead of letters.
- Delete Operation for Two Strings: answer is m + n - 2 x LCS.
- Longest Palindromic Subsequence: LCS of the string with its reverse.
- Number of LIS: keep a second array counting how many ways reach each dp[i].
- Russian Doll Envelopes: sort by width, then LIS on heights with a tie trick.

## Where people go wrong
- Using i and j directly on the string instead of i-1 and j-1 in the padded table.
- Forgetting that the LIS answer is max(dp), not dp[n-1].
- Confusing subsequence (gaps allowed) with substring (contiguous).

## How to recognise it in an interview
- "Longest increasing / common / palindromic subsequence".
- Two strings and "delete characters", "make them equal", "insertions".
- One array and "strictly increasing", "chain", "nesting".`,
    naive: {
      title: 'Enumerate every subsequence and keep the longest increasing one',
      description:
        'Recursively decide for each element whether to include it, only allowing it when it is larger than the previous chosen value. All 2^n subsequences are visited.',
      time: 'O(2^n)',
      space: 'O(n) call stack',
      code: {
        python: `def lis_slow(nums):
    def longest(i, prev):
        if i == len(nums):
            return 0
        skip = longest(i + 1, prev)
        take = 0
        if prev is None or nums[i] > prev:
            take = 1 + longest(i + 1, nums[i])   # 2^n paths in total
        return max(skip, take)
    return longest(0, None)`,
        javascript: `function lisSlow(nums) {
  function longest(i, prev) {
    if (i === nums.length) return 0;
    const skip = longest(i + 1, prev);
    let take = 0;
    if (prev === null || nums[i] > prev) {
      take = 1 + longest(i + 1, nums[i]);        // 2^n paths in total
    }
    return Math.max(skip, take);
  }
  return longest(0, null);
}`,
        java: `class Solution {
  public int lisSlow(int[] nums) {
    return longest(nums, 0, Integer.MIN_VALUE);
  }

  int longest(int[] nums, int i, int prev) {
    if (i == nums.length) return 0;
    int skip = longest(nums, i + 1, prev);
    int take = 0;
    if (nums[i] > prev) {
      take = 1 + longest(nums, i + 1, nums[i]);   // 2^n paths in total
    }
    return Math.max(skip, take);
  }
}`,
        cpp: `#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

int longest(vector<int>& nums, int i, int prev) {
  if (i == (int)nums.size()) return 0;
  int skip = longest(nums, i + 1, prev);
  int take = 0;
  if (nums[i] > prev) take = 1 + longest(nums, i + 1, nums[i]);  // 2^n paths
  return max(skip, take);
}

int lisSlow(vector<int>& nums) {
  return longest(nums, 0, INT_MIN);
}`,
      },
    },
    optimized: {
      title: 'dp[i] = longest increasing subsequence ending at i',
      description:
        'Every element starts as a subsequence of length 1. For each i, look at every earlier j with a smaller value and extend the best of those. The answer is the largest cell.',
      time: 'O(n^2)',
      space: 'O(n)',
      code: {
        python: `def length_of_lis(nums):
    n = len(nums)
    if n == 0:
        return 0
    dp = [1] * n                      # each element alone has length 1
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)   # extend the best earlier chain
    return max(dp)`,
        javascript: `function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const dp = new Array(n).fill(1);   // each element alone has length 1
  let best = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);  // extend
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}`,
        java: `class Solution {
  public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    if (n == 0) return 0;
    int[] dp = new int[n];
    int best = 1;
    for (int i = 0; i < n; i++) {
      dp[i] = 1;                       // each element alone has length 1
      for (int j = 0; j < i; j++) {
        if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);  // extend
      }
      best = Math.max(best, dp[i]);
    }
    return best;
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

int lengthOfLIS(vector<int>& nums) {
  int n = nums.size();
  if (n == 0) return 0;
  vector<int> dp(n, 1);              // each element alone has length 1
  int best = 1;
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++)
      if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);  // extend
    best = max(best, dp[i]);
  }
  return best;
}`,
      },
    },
    whyFaster:
      'Enumerating subsequences repeats the same (index, previous value) situations across 2^n branches. Defining dp[i] as "the best chain ending exactly at i" means each index is settled once by looking back at earlier indices, so the total work is n^2 comparisons. The same idea for two strings gives the m*n LCS table, and a binary-search variant brings LIS down to O(n log n) when needed.',
    keyPoints: [
      'Define dp by "best subsequence that ends at this position".',
      'LIS: dp[i] = 1 + max(dp[j]) for j < i with nums[j] < nums[i]; answer is max(dp).',
      'LCS: match -> diagonal + 1; mismatch -> max(up, left). Pad the table with a zero row and column.',
      'Many string problems reduce to LCS: deletions, palindromic subsequence, uncrossed lines.',
      'O(n log n) LIS with a tails array and binary search when n is large.',
      'Subsequence allows gaps; substring does not.',
    ],
    patternIds: ['lcs-lis', 'dp-2d'],
    problems: [
      {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        patternId: 'lcs-lis',
        hint: 'dp[i] is the longest strictly increasing chain ending at i; check every earlier smaller element and return the maximum cell.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'longest-common-subsequence',
        title: 'Longest Common Subsequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-common-subsequence/',
        patternId: 'lcs-lis',
        hint: 'Build an (m+1) x (n+1) table: matching letters add 1 to the diagonal, otherwise take the max of the cell above and to the left.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'uncrossed-lines',
        title: 'Uncrossed Lines',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/uncrossed-lines/',
        patternId: 'lcs-lis',
        hint: 'Lines cannot cross exactly when the matched pairs keep their order, so this is LCS on two integer arrays.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'maximum-length-of-pair-chain',
        title: 'Maximum Length of Pair Chain',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-length-of-pair-chain/',
        patternId: 'lcs-lis',
        hint: 'Sort the pairs by first value, then run LIS where pair j can precede pair i if j\'s second value is smaller than i\'s first.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'delete-operation-for-two-strings',
        title: 'Delete Operation for Two Strings',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/delete-operation-for-two-strings/',
        patternId: 'lcs-lis',
        hint: 'Keep the LCS and delete everything else: the answer is len(a) + len(b) - 2 * LCS.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'number-of-longest-increasing-subsequence',
        title: 'Number of Longest Increasing Subsequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/number-of-longest-increasing-subsequence/',
        patternId: 'lcs-lis',
        hint: 'Alongside length[i] keep count[i]; when a j gives a strictly longer chain reset the count, when it ties add to it.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'russian-doll-envelopes',
        title: 'Russian Doll Envelopes',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/russian-doll-envelopes/',
        patternId: 'lcs-lis',
        hint: 'Sort by width ascending and height descending for equal widths, then find the LIS of the heights with the O(n log n) tails method.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 6. DP on strings
  // -------------------------------------------------------------------------
  {
    id: 'dp-on-strings',
    gateId: 'dynamic-programming',
    order: 6,
    title: 'DP on Strings: Breaks, Palindromes and Edits',
    minutes: 30,
    summary: 'Solve string questions by defining a table over prefixes or over (start, end) ranges and building longer answers from shorter ones.',
    analogy:
      'A spell-checker turning "kitten" into "sitting" counts the fewest keystrokes: replace a letter, insert one, or delete one. To fix the whole word it first works out the cheapest fix for every shorter prefix pair and reuses those numbers instead of trying all combinations of keystrokes.',
    explanation: `String DP problems look different from each other (word breaking, palindromes, edit distance) but they use only two table shapes. Learn to spot which one a problem needs and the rest is filling cells.

## Shape 1: dp over prefixes
dp[i] describes the first i characters. Used when the question is about building or splitting the string from left to right.

**Word Break**: can s be split into dictionary words? dp[i] = True if some j < i has dp[j] True and s[j:i] in the dictionary.

\`\`\`python
def word_break(s, words):
    words = set(words)
    dp = [False] * (len(s) + 1)
    dp[0] = True                      # empty prefix is fine
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]
\`\`\`

s = "leetcode", words {"leet", "code"}: dp[4] becomes True from dp[0], then dp[8] from dp[4]. O(n^2) checks.

**Decode Ways** is the same shape: dp[i] = dp[i-1] if the last digit is valid, plus dp[i-2] if the last two digits make 10..26.

## Shape 2: dp over ranges (i, j)
dp[i][j] describes the substring from i to j. Used for palindromes and anything about "the inside" of a string. Fill by increasing length, or expand from the diagonal, so shorter ranges are ready before longer ones.

**Palindromic Substrings**: s[i..j] is a palindrome if s[i] == s[j] and the inside s[i+1..j-1] is a palindrome (or has length under 2).

\`\`\`python
def count_palindromes(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    count = 0
    for i in range(n - 1, -1, -1):        # start from the end
        for j in range(i, n):
            if s[i] == s[j] and (j - i < 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
                count += 1
    return count
\`\`\`

The same table gives the Longest Palindromic Substring (track the longest True cell) and, with a "max of inside" instead of a boolean, the Longest Palindromic Subsequence.

## Shape 3: two strings, two prefixes
dp[i][j] describes the first i letters of A and the first j letters of B. You saw this with LCS. Edit Distance is the same grid with three moves:
- letters match: dp[i][j] = dp[i-1][j-1]
- otherwise 1 + min(dp[i-1][j-1] replace, dp[i-1][j] delete, dp[i][j-1] insert)
Base rows: dp[i][0] = i and dp[0][j] = j (delete or insert everything).

\`\`\`python
def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
\`\`\`

"horse" -> "ros" gives 3.

## Slow versus fast
- Slow: recursion that tries every split, every centre, or every sequence of edits: exponential (3^n for edit distance).
- Fast: O(n^2) or O(m x n) cells, each O(1).

## Where people go wrong
- Off-by-one: dp[i] means the first i letters, so the letter is s[i-1].
- Filling range tables in the wrong order so dp[i+1][j-1] is still empty. Loop i from the end.
- Not converting the dictionary to a set, so each lookup is O(words).
- Forgetting dp[0] = True for prefix tables.

## How to recognise it in an interview
- Prefix shape: "can the string be segmented", "number of ways to decode", "break into words".
- Range shape: "palindrome", "substring from i to j", "remove characters from both ends".
- Two-prefix shape: "edit", "transform A into B", "interleave", "match a pattern".`,
    naive: {
      title: 'Recursive edit distance trying all three moves',
      description:
        'Compare the last characters; if they differ, recurse three ways (replace, delete, insert) and take the cheapest. The same prefix pair is re-solved an exponential number of times.',
      time: 'O(3^(m+n))',
      space: 'O(m + n) call stack',
      code: {
        python: `def edit_distance_slow(a, b):
    def solve(i, j):                       # i letters of a, j letters of b
        if i == 0:
            return j                       # insert the rest
        if j == 0:
            return i                       # delete the rest
        if a[i - 1] == b[j - 1]:
            return solve(i - 1, j - 1)
        replace = solve(i - 1, j - 1)      # three branches every mismatch
        delete = solve(i - 1, j)
        insert = solve(i, j - 1)
        return 1 + min(replace, delete, insert)
    return solve(len(a), len(b))`,
        javascript: `function editDistanceSlow(a, b) {
  function solve(i, j) {                   // i letters of a, j letters of b
    if (i === 0) return j;                 // insert the rest
    if (j === 0) return i;                 // delete the rest
    if (a[i - 1] === b[j - 1]) return solve(i - 1, j - 1);
    const replace = solve(i - 1, j - 1);   // three branches every mismatch
    const del = solve(i - 1, j);
    const insert = solve(i, j - 1);
    return 1 + Math.min(replace, del, insert);
  }
  return solve(a.length, b.length);
}`,
        java: `class Solution {
  public int editDistanceSlow(String a, String b) {
    return solve(a, b, a.length(), b.length());
  }

  int solve(String a, String b, int i, int j) {   // i letters of a, j of b
    if (i == 0) return j;                          // insert the rest
    if (j == 0) return i;                          // delete the rest
    if (a.charAt(i - 1) == b.charAt(j - 1)) return solve(a, b, i - 1, j - 1);
    int replace = solve(a, b, i - 1, j - 1);       // three branches every mismatch
    int delete = solve(a, b, i - 1, j);
    int insert = solve(a, b, i, j - 1);
    return 1 + Math.min(replace, Math.min(delete, insert));
  }
}`,
        cpp: `#include <string>
#include <algorithm>
using namespace std;

int solve(const string& a, const string& b, int i, int j) {   // i of a, j of b
  if (i == 0) return j;                          // insert the rest
  if (j == 0) return i;                          // delete the rest
  if (a[i - 1] == b[j - 1]) return solve(a, b, i - 1, j - 1);
  int replace = solve(a, b, i - 1, j - 1);       // three branches every mismatch
  int del = solve(a, b, i - 1, j);
  int ins = solve(a, b, i, j - 1);
  return 1 + min({replace, del, ins});
}

int editDistanceSlow(string a, string b) {
  return solve(a, b, a.size(), b.size());
}`,
      },
    },
    optimized: {
      title: 'Edit distance table over the two prefixes',
      description:
        'dp[i][j] is the cost of turning the first i letters of a into the first j letters of b. Base row and column count pure inserts or deletes; every other cell is the match diagonal or 1 plus the cheapest of three neighbours.',
      time: 'O(m * n)',
      space: 'O(m * n), or O(n) with two rows',
      code: {
        python: `def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i                       # delete everything
    for j in range(n + 1):
        dp[0][j] = j                       # insert everything
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j - 1],   # replace
                                   dp[i - 1][j],       # delete
                                   dp[i][j - 1])       # insert
    return dp[m][n]`,
        javascript: `function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;       // delete everything
  for (let j = 0; j <= n; j++) dp[0][j] = j;       // insert everything
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],   // replace
                                dp[i - 1][j],       // delete
                                dp[i][j - 1]);      // insert
      }
    }
  }
  return dp[m][n];
}`,
        java: `class Solution {
  public int editDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;     // delete everything
    for (int j = 0; j <= n; j++) dp[0][j] = j;     // insert everything
    for (int i = 1; i <= m; i++) {
      for (int j = 1; j <= n; j++) {
        if (a.charAt(i - 1) == b.charAt(j - 1)) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          int replace = dp[i - 1][j - 1], delete = dp[i - 1][j], insert = dp[i][j - 1];
          dp[i][j] = 1 + Math.min(replace, Math.min(delete, insert));
        }
      }
    }
    return dp[m][n];
  }
}`,
        cpp: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int editDistance(const string& a, const string& b) {
  int m = a.size(), n = b.size();
  vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
  for (int i = 0; i <= m; i++) dp[i][0] = i;     // delete everything
  for (int j = 0; j <= n; j++) dp[0][j] = j;     // insert everything
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + min({dp[i - 1][j - 1],    // replace
                            dp[i - 1][j],        // delete
                            dp[i][j - 1]});      // insert
      }
    }
  }
  return dp[m][n];
}`,
      },
    },
    whyFaster:
      'The recursion branches three ways at every mismatch and revisits the same (i, j) prefix pair through countless different edit sequences, giving roughly 3^(m+n) calls. There are only (m+1)*(n+1) distinct prefix pairs. The table computes each once from three already-filled neighbours, so the total is O(m*n), and keeping two rows drops the space to O(n).',
    keyPoints: [
      'Three table shapes: prefix dp[i], range dp[i][j], two-prefix dp[i][j].',
      'Prefix tables start with dp[0] = True/1 for the empty string.',
      'Range tables must be filled by increasing length or with i running backwards.',
      'Edit distance: match = diagonal; mismatch = 1 + min(diagonal, up, left).',
      'Palindrome check: ends match and the inside is a palindrome.',
      'Table index i refers to the first i letters, so the letter is s[i-1].',
    ],
    patternIds: ['dp-2d', 'dp-1d', 'lcs-lis'],
    problems: [
      {
        id: 'word-break',
        title: 'Word Break',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/word-break/',
        patternId: 'dp-1d',
        hint: 'dp[i] is true if some earlier dp[j] is true and s[j:i] is a dictionary word; put the words in a set first.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'decode-ways',
        title: 'Decode Ways',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/decode-ways/',
        patternId: 'dp-1d',
        hint: 'dp[i] adds dp[i-1] when the last digit is 1-9 and dp[i-2] when the last two digits form 10-26.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'palindromic-substrings',
        title: 'Palindromic Substrings',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/palindromic-substrings/',
        patternId: 'dp-2d',
        hint: 'Fill dp[i][j] from the end of the string: a range is a palindrome when its ends match and dp[i+1][j-1] is true or the range is short.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'longest-palindromic-substring',
        title: 'Longest Palindromic Substring',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-palindromic-substring/',
        patternId: 'dp-2d',
        hint: 'Same palindrome table as Palindromic Substrings, but remember the start and length of the longest true cell.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'longest-palindromic-subsequence',
        title: 'Longest Palindromic Subsequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-palindromic-subsequence/',
        patternId: 'lcs-lis',
        hint: 'Either compute the LCS of s with its reverse, or use a range table where matching ends add 2 to the inside answer.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'edit-distance',
        title: 'Edit Distance',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/edit-distance/',
        patternId: 'dp-2d',
        hint: 'Build the (m+1) x (n+1) table with base row and column 0..n and 0..m, then match = diagonal, mismatch = 1 + min of three neighbours.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'interleaving-string',
        title: 'Interleaving String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/interleaving-string/',
        patternId: 'dp-2d',
        hint: 'dp[i][j] is true if the first i+j letters of s3 can be built from the first i of s1 and first j of s2; check which string could have supplied the last letter.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'regular-expression-matching',
        title: 'Regular Expression Matching',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/regular-expression-matching/',
        patternId: 'dp-2d',
        hint: 'dp[i][j] means s[:i] matches p[:j]; a star either uses zero of the previous pattern char (dp[i][j-2]) or one more of it when the current letter matches.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },
]
