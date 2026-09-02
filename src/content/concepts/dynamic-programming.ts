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
    problems: [
      {
        id: 'fibonacci-number',
        title: 'Fibonacci Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/fibonacci-number/',
        patternId: 'dp-1d',
        hint: 'Write the plain recursion, then add a memo, then replace it with two rolling variables and compare how each behaves for n = 30.',
        xp: 20,
      },
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        patternId: 'dp-1d',
        hint: 'To stand on step n you came from step n-1 or n-2, so add those two counts together.',
        xp: 20,
      },
      {
        id: 'n-th-tribonacci-number',
        title: 'N-th Tribonacci Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/n-th-tribonacci-number/',
        patternId: 'dp-1d',
        hint: 'Same as Fibonacci but each value is the sum of the previous three; keep three rolling variables.',
        xp: 20,
      },
      {
        id: 'min-cost-climbing-stairs',
        title: 'Min Cost Climbing Stairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
        patternId: 'dp-1d',
        hint: 'dp[i] is the cheapest way to stand on step i: cost[i] plus the smaller of dp[i-1] and dp[i-2].',
        xp: 20,
      },
      {
        id: 'perfect-squares',
        title: 'Perfect Squares',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/perfect-squares/',
        patternId: 'dp-1d',
        hint: 'dp[n] is 1 plus the minimum of dp[n - s] over every square s not larger than n; start from the memoized recursion if the table feels hard.',
        xp: 40,
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
    problems: [
      {
        id: 'house-robber',
        title: 'House Robber',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/house-robber/',
        patternId: 'dp-1d',
        hint: 'At each house take max(best up to previous house, this house plus best up to two houses back).',
        xp: 40,
      },
      {
        id: 'delete-and-earn',
        title: 'Delete and Earn',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/delete-and-earn/',
        patternId: 'dp-1d',
        hint: 'Bucket the points by value so that choosing value v forbids v-1 and v+1; that is House Robber over the value axis.',
        xp: 40,
      },
      {
        id: 'house-robber-ii',
        title: 'House Robber II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/house-robber-ii/',
        patternId: 'dp-1d',
        hint: 'The first and last house cannot both be robbed, so run the linear House Robber on nums[1:] and on nums[:-1] and take the larger.',
        xp: 40,
      },
      {
        id: 'coin-change',
        title: 'Coin Change',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/coin-change/',
        patternId: 'dp-1d',
        hint: 'dp[a] is the fewest coins to make amount a; for every coin c that fits, try 1 + dp[a - c], and keep infinity where no coins work.',
        xp: 40,
      },
      {
        id: 'maximum-product-subarray',
        title: 'Maximum Product Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-product-subarray/',
        patternId: 'dp-1d',
        hint: 'A negative number flips the best and worst, so track both the maximum and the minimum product ending at each index.',
        xp: 40,
      },
      {
        id: 'jump-game',
        title: 'Jump Game',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/jump-game/',
        patternId: 'dp-1d',
        hint: 'dp[i] says whether index i is reachable; or simpler, keep the furthest index you can reach so far and stop if you fall behind it.',
        xp: 40,
      },
      {
        id: 'minimum-cost-for-tickets',
        title: 'Minimum Cost For Tickets',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-cost-for-tickets/',
        patternId: 'dp-1d',
        hint: 'dp[day] is the cheapest cover through that day; on a travel day take the min over buying a 1, 7 or 30-day pass ending today.',
        xp: 40,
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
    problems: [
      {
        id: 'unique-paths',
        title: 'Unique Paths',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/unique-paths/',
        patternId: 'dp-2d',
        hint: 'Every cell equals the cell above plus the cell to the left; the first row and column are all 1.',
        xp: 40,
      },
      {
        id: 'unique-paths-ii',
        title: 'Unique Paths II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/unique-paths-ii/',
        patternId: 'dp-2d',
        hint: 'Same as Unique Paths but an obstacle cell is set to 0 ways, including in the first row and column.',
        xp: 40,
      },
      {
        id: 'minimum-path-sum',
        title: 'Minimum Path Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-path-sum/',
        patternId: 'dp-2d',
        hint: 'dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]); you can overwrite the grid itself.',
        xp: 40,
      },
      {
        id: 'triangle',
        title: 'Triangle',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/triangle/',
        patternId: 'dp-2d',
        hint: 'Work from the bottom row up: each cell becomes its value plus the smaller of the two cells below it.',
        xp: 40,
      },
      {
        id: 'minimum-falling-path-sum',
        title: 'Minimum Falling Path Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-falling-path-sum/',
        patternId: 'dp-2d',
        hint: 'Each cell adds the minimum of the three cells above it (up-left, up, up-right); answer is the minimum of the last row.',
        xp: 40,
      },
      {
        id: 'maximal-square',
        title: 'Maximal Square',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximal-square/',
        patternId: 'dp-2d',
        hint: 'For a 1 cell, dp = 1 + min(top, left, top-left) gives the largest square ending there; track the max and square it.',
        xp: 40,
      },
      {
        id: 'dungeon-game',
        title: 'Dungeon Game',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/dungeon-game/',
        patternId: 'dp-2d',
        hint: 'Fill from the bottom-right backwards: the health needed at a cell is max(1, min(need right, need down) - cell value).',
        xp: 80,
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
      },
      {
        id: 'target-sum',
        title: 'Target Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/target-sum/',
        patternId: 'knapsack',
        hint: 'The numbers given a plus sign must add to (total + target) / 2; count the subsets that reach that sum.',
        xp: 40,
      },
      {
        id: 'coin-change-ii',
        title: 'Coin Change II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/coin-change-ii/',
        patternId: 'knapsack',
        hint: 'Unbounded knapsack: loop coins on the outside and amounts upward on the inside so each combination is counted once.',
        xp: 40,
      },
      {
        id: 'last-stone-weight-ii',
        title: 'Last Stone Weight II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/last-stone-weight-ii/',
        patternId: 'knapsack',
        hint: 'Split the stones into two groups as close to equal as possible; find the largest reachable sum not exceeding total / 2.',
        xp: 40,
      },
      {
        id: 'ones-and-zeroes',
        title: 'Ones and Zeroes',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/ones-and-zeroes/',
        patternId: 'knapsack',
        hint: 'A knapsack with two capacities (zeros and ones); loop both capacities downward for each string.',
        xp: 40,
      },
      {
        id: 'combination-sum-iv',
        title: 'Combination Sum IV',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/combination-sum-iv/',
        patternId: 'knapsack',
        hint: 'Order matters here, so loop the target on the outside and the numbers on the inside; dp[t] += dp[t - num].',
        xp: 40,
      },
      {
        id: 'profitable-schemes',
        title: 'Profitable Schemes',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/profitable-schemes/',
        patternId: 'knapsack',
        hint: 'A 2D knapsack over (people used, profit capped at minProfit); loop both dimensions downward per crime and sum the states with enough profit.',
        xp: 80,
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
      },
      {
        id: 'longest-common-subsequence',
        title: 'Longest Common Subsequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-common-subsequence/',
        patternId: 'lcs-lis',
        hint: 'Build an (m+1) x (n+1) table: matching letters add 1 to the diagonal, otherwise take the max of the cell above and to the left.',
        xp: 40,
      },
      {
        id: 'uncrossed-lines',
        title: 'Uncrossed Lines',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/uncrossed-lines/',
        patternId: 'lcs-lis',
        hint: 'Lines cannot cross exactly when the matched pairs keep their order, so this is LCS on two integer arrays.',
        xp: 40,
      },
      {
        id: 'maximum-length-of-pair-chain',
        title: 'Maximum Length of Pair Chain',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-length-of-pair-chain/',
        patternId: 'lcs-lis',
        hint: 'Sort the pairs by first value, then run LIS where pair j can precede pair i if j\'s second value is smaller than i\'s first.',
        xp: 40,
      },
      {
        id: 'delete-operation-for-two-strings',
        title: 'Delete Operation for Two Strings',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/delete-operation-for-two-strings/',
        patternId: 'lcs-lis',
        hint: 'Keep the LCS and delete everything else: the answer is len(a) + len(b) - 2 * LCS.',
        xp: 40,
      },
      {
        id: 'number-of-longest-increasing-subsequence',
        title: 'Number of Longest Increasing Subsequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/number-of-longest-increasing-subsequence/',
        patternId: 'lcs-lis',
        hint: 'Alongside length[i] keep count[i]; when a j gives a strictly longer chain reset the count, when it ties add to it.',
        xp: 40,
      },
      {
        id: 'russian-doll-envelopes',
        title: 'Russian Doll Envelopes',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/russian-doll-envelopes/',
        patternId: 'lcs-lis',
        hint: 'Sort by width ascending and height descending for equal widths, then find the LIS of the heights with the O(n log n) tails method.',
        xp: 80,
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
      },
      {
        id: 'decode-ways',
        title: 'Decode Ways',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/decode-ways/',
        patternId: 'dp-1d',
        hint: 'dp[i] adds dp[i-1] when the last digit is 1-9 and dp[i-2] when the last two digits form 10-26.',
        xp: 40,
      },
      {
        id: 'palindromic-substrings',
        title: 'Palindromic Substrings',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/palindromic-substrings/',
        patternId: 'dp-2d',
        hint: 'Fill dp[i][j] from the end of the string: a range is a palindrome when its ends match and dp[i+1][j-1] is true or the range is short.',
        xp: 40,
      },
      {
        id: 'longest-palindromic-substring',
        title: 'Longest Palindromic Substring',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-palindromic-substring/',
        patternId: 'dp-2d',
        hint: 'Same palindrome table as Palindromic Substrings, but remember the start and length of the longest true cell.',
        xp: 40,
      },
      {
        id: 'longest-palindromic-subsequence',
        title: 'Longest Palindromic Subsequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-palindromic-subsequence/',
        patternId: 'lcs-lis',
        hint: 'Either compute the LCS of s with its reverse, or use a range table where matching ends add 2 to the inside answer.',
        xp: 40,
      },
      {
        id: 'edit-distance',
        title: 'Edit Distance',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/edit-distance/',
        patternId: 'dp-2d',
        hint: 'Build the (m+1) x (n+1) table with base row and column 0..n and 0..m, then match = diagonal, mismatch = 1 + min of three neighbours.',
        xp: 40,
      },
      {
        id: 'interleaving-string',
        title: 'Interleaving String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/interleaving-string/',
        patternId: 'dp-2d',
        hint: 'dp[i][j] is true if the first i+j letters of s3 can be built from the first i of s1 and first j of s2; check which string could have supplied the last letter.',
        xp: 40,
      },
      {
        id: 'regular-expression-matching',
        title: 'Regular Expression Matching',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/regular-expression-matching/',
        patternId: 'dp-2d',
        hint: 'dp[i][j] means s[:i] matches p[:j]; a star either uses zero of the previous pattern char (dp[i][j-2]) or one more of it when the current letter matches.',
        xp: 80,
      },
    ],
  },
]
