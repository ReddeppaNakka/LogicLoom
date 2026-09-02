import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'greedy-basics',
    gateId: 'greedy-bits-tries',
    order: 1,
    title: 'Greedy: take the best step now',
    minutes: 25,
    summary: 'A greedy algorithm makes the locally best choice at every step and never looks back, which is fast when that choice is provably safe.',
    analogy: 'Imagine paying 67 cents with the fewest coins. You grab the biggest coin that fits (50), then the next biggest (10), then 5, 1, 1. You never undo a coin. That is greedy: one confident choice per step, no backtracking.',
    explanation: `A greedy algorithm builds the answer one step at a time. At each step it picks the option that looks best right now and commits to it. There is no undo and no "let me try the other branch". When this works, it is usually the fastest solution you can write: one pass, tiny memory.

## The idea

- Break the problem into a sequence of choices.
- At each choice, pick the local best (biggest jump, earliest finish, cheapest item).
- Never revisit a choice.

The catch is that greedy is only correct for some problems. For coin change with coins 1, 5, 10, 25 it is correct. For coins 1, 3, 4 and target 6, greedy picks 4 + 1 + 1 (three coins) but the real answer is 3 + 3 (two coins). So the question is always: "does the local best ever hurt me later?"

## A tiny example: Jump Game

You get an array like \`[2, 3, 1, 1, 4]\`. Each number is the maximum jump you can make from that index. Can you reach the last index?

**The slow way** tries every path. From index 0 you can jump 1 or 2, from each of those you branch again, and so on. The number of paths grows like 2^n. For 30 elements that is already about a billion paths.

**The fast way** only tracks one number: \`farthest\`, the furthest index we can currently reach.

\`\`\`python
def can_jump(nums):
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    return True
\`\`\`

## Step by step on [2, 3, 1, 1, 4]

- i = 0, jump 2: farthest = 2
- i = 1, jump 3: farthest = 4 (already the last index)
- i = 2, 3, 4: never behind farthest, so return True

We never asked "which jump exactly?" We only asked "how far can I possibly go?" That single local fact was enough. One loop, O(n) time, O(1) space.

## How do I know greedy is safe?

Two informal tests you can use in an interview:

- **Exchange argument**: if a solution uses a non-greedy choice, can you swap in the greedy choice without making it worse? If yes, greedy is safe.
- **Try to break it**: spend two minutes hunting for a small input where greedy fails. If you find one, switch to dynamic programming.

Common greedy shapes: sort by some key first, then sweep (intervals, deadlines). Track a running best (furthest reach, current fuel). Always serve the most urgent thing (task scheduling with a heap).

## Where people go wrong

- Assuming greedy works because it worked on the example. Test a tricky case.
- Forgetting to sort first. Many greedy proofs need a specific order.
- Mixing up greedy and DP. Greedy commits; DP keeps every sub-answer. If choices interact, use DP.

## How to recognise it in an interview

Clues: "minimum number of ...", "maximum you can reach", "can you finish", "schedule", "earliest", "fewest". Especially when n is large (10^5) so O(n^2) is out, and the problem seems to have an obvious "just do the sensible thing" answer. Say out loud: "I think greedy works here because ..." and give a one-line reason.`,
    naive: {
      title: 'Brute force: try every jump path',
      description: 'From each index, recursively try every possible jump length until you reach the end or get stuck. It explores every path, and the number of paths explodes.',
      time: 'O(2^n)',
      space: 'O(n) recursion depth',
      code: {
        python: `def can_jump(nums):
    n = len(nums)

    def dfs(i):
        if i >= n - 1:
            return True
        for step in range(1, nums[i] + 1):
            if dfs(i + step):
                return True
        return False

    return dfs(0)`,
        javascript: `function canJump(nums) {
  const n = nums.length;
  function dfs(i) {
    if (i >= n - 1) return true;
    for (let step = 1; step <= nums[i]; step++) {
      if (dfs(i + step)) return true;
    }
    return false;
  }
  return dfs(0);
}`,
        java: `class Solution {
  public boolean canJump(int[] nums) {
    return dfs(nums, 0);
  }
  private boolean dfs(int[] nums, int i) {
    if (i >= nums.length - 1) return true;
    for (int step = 1; step <= nums[i]; step++) {
      if (dfs(nums, i + step)) return true;
    }
    return false;
  }
}`,
        cpp: `#include <vector>
using namespace std;

bool dfs(const vector<int>& nums, int i) {
  if (i >= (int)nums.size() - 1) return true;
  for (int step = 1; step <= nums[i]; step++) {
    if (dfs(nums, i + step)) return true;
  }
  return false;
}

bool canJump(vector<int>& nums) { return dfs(nums, 0); }`,
      },
    },
    optimized: {
      title: 'Greedy: track the furthest reachable index',
      description: 'Walk left to right and keep the furthest index you could reach so far. If the current index is beyond that, you are stuck. One pass, no branching.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def can_jump(nums):
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    return True`,
        javascript: `function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}`,
        java: `class Solution {
  public boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
      if (i > farthest) return false;
      farthest = Math.max(farthest, i + nums[i]);
    }
    return true;
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

bool canJump(vector<int>& nums) {
  int farthest = 0;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (i > farthest) return false;
    farthest = max(farthest, i + nums[i]);
  }
  return true;
}`,
      },
    },
    whyFaster: 'The brute force asks "which exact jump do I take?" and explores every branch, so work doubles with each index. The greedy version asks a weaker question, "how far could I reach at best?", and that single number is enough to decide. One pass replaces an exponential search, and no recursion stack is needed.',
    keyPoints: [
      'Greedy = make the locally best choice, commit, never look back.',
      'It is only correct when the local choice never hurts later. Try to break it with a tiny counter-example.',
      'Common shapes: sort then sweep, track a running best, always serve the most urgent item.',
      'If choices interact and greedy fails, switch to dynamic programming.',
      'Typical cost: O(n) or O(n log n) with a sort, O(1) extra space.',
    ],
    definition: 'A greedy algorithm builds an answer one step at a time, and at every step it takes the option that a fixed rule says is best right now, then never reconsiders it. It is correct only when that local rule provably leads to a globally optimal answer.',
    coreIdea: 'Greedy works when the problem has the greedy-choice property: there is always at least one optimal answer that begins with the greedy move. If that is true, you never have to explore the branch where you chose something else, so a tree of 2^n combinations collapses into a single path. That is how an exponential search becomes one sorted pass, O(n log n), or even one plain scan, O(n).',
    visual: [
      {
        caption: 'Four meetings. Keep the biggest set that does not overlap.',
        frame: [
          'time  0    5    10',
          'A     [-------]',
          'B      [-]',
          'C         [-]',
          'D            [-]',
          'A = 0-8   B = 1-3   C = 4-6   D = 7-9',
        ].join('\n'),
      },
      {
        caption: 'Greedy rule 1: take the one that STARTS first. It fails.',
        frame: [
          'time  0    5    10',
          'A     [-------]   taken (starts at 0)',
          'B      xxx        blocked, starts inside A',
          'C         xxx     blocked, starts inside A',
          'D            xxx  blocked, 7 < 8',
          'kept = 1',
        ].join('\n'),
      },
      {
        caption: 'Greedy rule 2: take the one that FINISHES first. Kept 3.',
        frame: [
          'sorted by end:  B(3)  C(6)  A(8)  D(9)',
          'time  0    5    10',
          'B      [-]        take, free again from 3',
          'C         [-]     4 >= 3, take, free from 6',
          'A     [-------]   0 < 6, skip',
          'D            [-]  7 >= 6, take',
          'kept = 3',
        ].join('\n'),
      },
      {
        caption: 'The exchange argument: why finishing first is always safe.',
        frame: [
          'say the best possible answer starts with X:',
          '  [   X   ][ the rest of that answer ]',
          'greedy starts with G, and G ends no later',
          'than X, because greedy picked the earliest end:',
          '  [ G ][ the rest of that answer ]',
          'everything that fitted after X still fits after G,',
          'so swapping X for G keeps the answer valid and',
          'the same size. No optimal answer beats greedy.',
        ].join('\n'),
      },
      {
        caption: 'Where greedy breaks: coins 1, 3, 4 and a target of 6.',
        frame: [
          'greedy = always take the biggest coin that fits',
          '  6 -4-> 2 -1-> 1 -1-> 0      3 coins',
          'the real best answer',
          '  6 -3-> 3 -3-> 0             2 coins',
          'taking the 4 destroys the 3 + 3 pairing, and',
          'greedy has no way to undo it later.',
        ].join('\n'),
      },
      {
        caption: 'The fix is DP: keep every sub-answer instead of one guess.',
        frame: [
          'best[t] = fewest coins that make exactly t',
          '  t     0  1  2  3  4  5  6',
          '  best  0  1  2  1  1  2  2',
          'best[6] = 1 + min(best[5], best[3], best[2])',
          '        = 1 + min(2, 1, 2) = 2',
          'DP costs O(target * coins) but is always right.',
        ].join('\n'),
      },
    ],
    pseudocode: `function greedy(items):
    sort items by the key that makes the local best obvious
    result <- empty list
    state  <- the starting state (last end time, fuel, reach)
    for each item in sorted order:
        if item is compatible with state:
            append item to result
            update state using item
    return result

# the part that decides whether the loop above is legal
function greedy_is_safe(rule):
    take any optimal answer O that disagrees with the rule
    let g = the choice the rule makes first
    let x = the choice O makes in that same slot
    if replacing x by g inside O keeps O valid
       and keeps O at least as good:
        return true      # exchange argument holds, greedy wins
    return false         # no swap exists, use dynamic programming`,
    complexity: [
      { label: 'Sort, then sweep', time: 'O(n log n)', space: 'O(1) extra', note: 'the sort is the whole cost' },
      { label: 'Running best, no sort', time: 'O(n)', space: 'O(1)', note: 'one number of state, as in Jump Game' },
      { label: 'Greedy with a heap', time: 'O(n log n)', space: 'O(n)', note: 'always serve the most urgent item' },
      { label: 'When greedy is wrong: DP instead', time: 'O(n * target)', space: 'O(target)', note: 'coin change with odd denominations' },
    ],
    dryRun: {
      input: 'nums = [2, 3, 1, 1, 4]',
      goal: 'Decide whether we can reach the last index, using the optimized can_jump above.',
      steps: [
        { state: 'farthest = 0, i = 0, jump = 2', action: 'i is not greater than farthest, so index 0 is reachable. farthest = max(0, 0 + 2) = 2.' },
        { state: 'farthest = 2, i = 1, jump = 3', action: '1 <= 2, so index 1 is reachable. farthest = max(2, 1 + 3) = 4.' },
        { state: 'farthest = 4, i = 2, jump = 1', action: '2 <= 4, reachable. farthest = max(4, 2 + 1) = 4, no improvement.' },
        { state: 'farthest = 4, i = 3, jump = 1', action: '3 <= 4, reachable. farthest = max(4, 3 + 1) = 4, still no improvement.' },
        { state: 'farthest = 4, i = 4, jump = 4', action: '4 <= 4, so the last index is reachable. farthest = max(4, 8) = 8.' },
        { state: 'loop finished, farthest = 8', action: 'No index was ever past farthest, so the function returns True.' },
      ],
      result: 'True. The loop never found an index beyond farthest, which means every cell up to the last one was reachable, so the end can be reached (for example 0 -> 1 -> 4). We never had to know which exact jumps to take.',
    },
    mistakes: [
      {
        mistake: 'Deciding greedy is correct because it matched the sample input.',
        why: 'The sample is chosen to be readable, not to be hard. Greedy failures usually need a specific small shape, like coins 1, 3, 4 with target 6.',
        fix: 'Spend two minutes hunting a counter-example on purpose. If you cannot break it, say the exchange argument out loud. If you can break it, switch to dynamic programming.',
      },
      {
        mistake: 'In Jump Game, updating farthest first and only then testing i > farthest.',
        why: 'After the update farthest is always at least i, so the stuck test can never fire and the function returns True for [0, 1].',
        fix: 'Test i > farthest at the top of the loop body, before touching farthest.',
      },
      {
        mistake: 'Sorting interval-style problems by start time when the goal is to keep the most items.',
        why: 'A long interval that starts early eats the whole axis. Earliest start is not the safe choice; earliest end is.',
        fix: 'For "keep the most non-overlapping" or "fewest removals", sort by end. For merging, sort by start.',
      },
      {
        mistake: 'Using greedy for coin change with arbitrary denominations.',
        why: 'Greedy is only optimal for canonical systems such as 1, 5, 10, 25. With 1, 3, 4 and target 6 it returns 3 coins instead of 2.',
        fix: 'Use the O(amount * number of coins) DP unless the problem states the coin system is canonical.',
      },
      {
        mistake: 'Adding an "if this pick turns out bad, undo it" branch inside the greedy loop.',
        why: 'Undoing is backtracking, and a half-finished backtracking loop is usually both wrong and slow.',
        fix: 'If you need to undo, stop and pick the right tool: full backtracking for "find any valid answer", DP for "find the best answer".',
      },
    ],
    whenToUse: [
      'The question is a minimum count or a maximum count and one sort order makes the next move obvious.',
      'You can state the rule in one line, such as "always take the one that finishes first", and defend it with a swap.',
      'n is 10^5 or bigger, so an O(n^2) DP is out, and the answer still looks reachable in one pass.',
      'The words are schedule, deadline, interval, fuel, refuel, reach the end, fewest coins in a canonical system.',
      'Taking the best option now never removes an option you would have needed later.',
    ],
    whenNotToUse: [
      'A choice now changes which choices remain in a way you cannot bound: use dynamic programming.',
      'Coin change with odd denominations such as 1, 3, 4: greedy over-counts, use the O(amount * coins) DP.',
      'Items have two competing numbers and a limit, as in 0/1 knapsack: sorting by value per weight is wrong, use the knapsack DP.',
      'The problem wants the number of ways or every optimal answer, not just one optimum: DP or backtracking.',
      'You caught yourself wanting to take back an earlier pick: that is backtracking, not greedy.',
    ],
    relatedTopics: [
      { id: 'intervals', kind: 'concept', why: 'Sorting by end time and sweeping is the textbook greedy whose exchange argument actually holds.' },
      { id: 'knapsack', kind: 'concept', why: '0/1 knapsack is the standard case where the greedy value-per-weight rule fails and DP is required.' },
      { id: 'dp-intro-memo-and-tabulation', kind: 'concept', why: 'DP is the fallback when your counter-example hunt succeeds: it keeps every sub-answer instead of committing to one.' },
      { id: 'sorting-basics', kind: 'concept', why: 'Nearly every greedy begins with a sort, and that sort is usually the dominant cost.' },
      { id: 'top-k-heap', kind: 'pattern', why: 'Greedy schedulers that always serve the most urgent job need a heap to find it in O(log n).' },
    ],
    quiz: [
      {
        question: 'Coins are 1, 3 and 4, and the target is 6. What does "always take the biggest coin that fits" return?',
        options: ['2 coins, which is optimal', '3 coins, which is not optimal', '4 coins, which is not optimal', 'It cannot make 6 at all'],
        answerIndex: 1,
        explanation: 'Greedy takes 4, then 1, then 1, so 3 coins. The optimum is 3 + 3, which is 2 coins, so this is the classic case where DP is required.',
      },
      {
        question: 'A greedy solution sorts n items and then does O(1) work per item. What is the total time?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
        answerIndex: 1,
        explanation: 'The sweep is O(n) but the sort is O(n log n), and the larger term wins. Say "O(n log n), dominated by the sort" in an interview.',
      },
      {
        question: 'You must fill a bag of capacity 10 from items with (weight, value) = (6, 30), (5, 20), (5, 20), taking whole items only. Does sorting by value per weight and taking greedily give the best answer?',
        options: ['Yes, ratio order is always optimal', 'No, ratio order takes the 6 and then nothing fits well; the best is the two 5s', 'Yes, but only if the values are distinct', 'No, you must sort by weight instead'],
        answerIndex: 1,
        explanation: 'Ratio order picks (6, 30) for a total of 30, but the two 5-weight items fill the bag exactly for 40. Whole items plus a capacity means 0/1 knapsack DP.',
      },
      {
        question: 'What does the exchange argument actually prove?',
        options: ['That the greedy solution is faster than the alternatives', 'That some optimal answer can be rewritten to start with the greedy choice without getting worse', 'That every optimal answer is identical to the greedy answer', 'That the input must be sorted before you start'],
        answerIndex: 1,
        explanation: 'It only shows that the greedy first move is safe: an optimal answer can absorb it. That is enough, because you can then apply the same argument to what is left.',
      },
    ],
    sources: [
      'CLRS ch. 16: greedy algorithms, activity selection, greedy-choice property',
      'CSES Competitive Programmers Handbook ch. 6: greedy algorithms',
      'USACO Guide: Greedy Algorithms (Bronze and Silver)',
      'CP-Algorithms: scheduling and job sequencing notes',
      'MIT 6.046 lectures on greedy and the exchange argument',
    ],
    patternIds: ['greedy'],
    problems: [
      {
        id: 'assign-cookies',
        title: 'Assign Cookies',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/assign-cookies/',
        patternId: 'greedy',
        hint: 'Sort both lists and give the smallest cookie that satisfies the least greedy child.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'jump-game',
        title: 'Jump Game',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/jump-game/',
        patternId: 'greedy',
        hint: 'Keep the furthest index you can reach; if you ever stand past it, you are stuck.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'gas-station',
        title: 'Gas Station',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/gas-station/',
        patternId: 'greedy',
        hint: 'If the tank goes negative at station i, no start between the last reset and i can work, so restart at i + 1.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'jump-game-ii',
        title: 'Jump Game II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/jump-game-ii/',
        patternId: 'greedy',
        hint: 'Treat each jump as a window: track the end of the current window and the furthest reach inside it.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'partition-labels',
        title: 'Partition Labels',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/partition-labels/',
        patternId: 'greedy',
        hint: 'Record the last index of every letter, then extend the current partition until you pass every last index inside it.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'hand-of-straights',
        title: 'Hand of Straights',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/hand-of-straights/',
        patternId: 'greedy',
        hint: 'Always start a group from the smallest remaining card; count cards in a map and consume runs.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'intervals',
    gateId: 'greedy-bits-tries',
    order: 2,
    title: 'Intervals: sort, then sweep',
    minutes: 25,
    summary: 'Almost every interval problem becomes easy once you sort by start time and sweep once, merging or dropping as you go.',
    analogy: 'Think of a calendar with meetings scribbled in random order. To see when you are busy, you first put the meetings in order of start time, then read down the list, stretching a block of time whenever the next meeting starts before the current block ends.',
    explanation: `An interval is just a pair \`[start, end]\`. Problems ask you to merge overlapping ones, insert a new one, count how many overlap, or remove the fewest to make them all disjoint. Unsorted intervals are chaos. Sorted intervals are a single left-to-right sweep.

## The idea

- Sort intervals by start (sometimes by end, see below).
- Walk through them once, keeping track of the "current" interval.
- Two intervals \`a\` and \`b\` (with \`a\` first) overlap when \`b.start <= a.end\`.
- If they overlap, merge: \`a.end = max(a.end, b.end)\`. If not, close \`a\` and open \`b\`.

That is the whole merge algorithm. The sort costs O(n log n), the sweep costs O(n).

## A tiny example

Input: \`[[1,3], [8,10], [2,6], [15,18]]\`

**The slow way** compares every pair, merges any two that overlap, and repeats until nothing changes. Each pass is O(n^2) and you may need many passes. It also has fiddly index bugs because you delete from the list while looping.

**The fast way** sorts first: \`[[1,3], [2,6], [8,10], [15,18]]\`.

- Start with \`[1,3]\`.
- \`[2,6]\`: 2 <= 3, overlap. Extend to \`[1,6]\`.
- \`[8,10]\`: 8 > 6, no overlap. Push \`[1,6]\`, current becomes \`[8,10]\`.
- \`[15,18]\`: 15 > 10. Push \`[8,10]\`, current becomes \`[15,18]\`.
- End: push \`[15,18]\`.

Result: \`[[1,6], [8,10], [15,18]]\`.

\`\`\`python
def merge(intervals):
    intervals.sort()
    result = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= result[-1][1]:
            result[-1][1] = max(result[-1][1], end)
        else:
            result.append([start, end])
    return result
\`\`\`

## Sort by start or by end?

- **Merging / inserting**: sort by start. You need to know what comes next.
- **Keep the most non-overlapping intervals** (or remove the fewest): sort by end. Always keep the interval that finishes earliest, because it leaves the most room for the others. This is a classic greedy choice.
- **How many rooms / overlaps at once**: split into start events and end events, sort both, and sweep a counter up and down.

## Where people go wrong

- Forgetting to sort. Everything below relies on order.
- Using \`<\` instead of \`<=\` for overlap. Check whether the problem says touching intervals like \`[1,3]\` and \`[3,5]\` count as overlapping (on LeetCode they usually do).
- Updating \`end\` with \`b.end\` instead of \`max(a.end, b.end)\`. \`[1,10]\` followed by \`[2,3]\` must stay \`[1,10]\`.
- Sorting by start when the problem needs earliest finish.

## How to recognise it in an interview

Clues: "intervals", "meetings", "ranges", "overlapping", "merge", "schedule", "minimum number of rooms / arrows / removals", input given as pairs. Your first sentence should be: "I will sort by start (or end) and sweep once." That already shows the interviewer you know the shape.`,
    naive: {
      title: 'Brute force: merge any overlapping pair, repeat',
      description: 'Look at every pair of intervals. If two overlap, replace them with their union and start over. Stop when a full pass finds nothing to merge. Slow and bug-prone because you mutate the list mid-loop.',
      time: 'O(n^3) worst case',
      space: 'O(n)',
      code: {
        python: `def merge(intervals):
    items = [list(x) for x in intervals]
    changed = True
    while changed:
        changed = False
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                a, b = items[i], items[j]
                if a[0] <= b[1] and b[0] <= a[1]:
                    items[i] = [min(a[0], b[0]), max(a[1], b[1])]
                    items.pop(j)
                    changed = True
                    break
            if changed:
                break
    return items`,
        javascript: `function merge(intervals) {
  const items = intervals.map((x) => [x[0], x[1]]);
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        if (a[0] <= b[1] && b[0] <= a[1]) {
          items[i] = [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
          items.splice(j, 1);
          changed = true;
          break outer;
        }
      }
    }
  }
  return items;
}`,
        java: `import java.util.*;

class Solution {
  public List<int[]> merge(int[][] intervals) {
    List<int[]> items = new ArrayList<>();
    for (int[] x : intervals) items.add(new int[]{x[0], x[1]});
    boolean changed = true;
    while (changed) {
      changed = false;
      outer:
      for (int i = 0; i < items.size(); i++) {
        for (int j = i + 1; j < items.size(); j++) {
          int[] a = items.get(i), b = items.get(j);
          if (a[0] <= b[1] && b[0] <= a[1]) {
            items.set(i, new int[]{Math.min(a[0], b[0]), Math.max(a[1], b[1])});
            items.remove(j);
            changed = true;
            break outer;
          }
        }
      }
    }
    return items;
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> merge(vector<vector<int>> items) {
  bool changed = true;
  while (changed) {
    changed = false;
    for (size_t i = 0; i < items.size() && !changed; i++) {
      for (size_t j = i + 1; j < items.size(); j++) {
        auto &a = items[i], &b = items[j];
        if (a[0] <= b[1] && b[0] <= a[1]) {
          items[i] = {min(a[0], b[0]), max(a[1], b[1])};
          items.erase(items.begin() + j);
          changed = true;
          break;
        }
      }
    }
  }
  return items;
}`,
      },
    },
    optimized: {
      title: 'Sort by start, then sweep once',
      description: 'After sorting, any interval that overlaps the current one must come right after it. So you only compare each interval with the last merged one. One sort plus one linear pass.',
      time: 'O(n log n)',
      space: 'O(n) for the output',
      code: {
        python: `def merge(intervals):
    intervals.sort()
    result = [list(intervals[0])]
    for start, end in intervals[1:]:
        last = result[-1]
        if start <= last[1]:
            last[1] = max(last[1], end)
        else:
            result.append([start, end])
    return result`,
        javascript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [[intervals[0][0], intervals[0][1]]];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = result[result.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}`,
        java: `import java.util.*;

class Solution {
  public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> result = new ArrayList<>();
    result.add(new int[]{intervals[0][0], intervals[0][1]});
    for (int i = 1; i < intervals.length; i++) {
      int[] last = result.get(result.size() - 1);
      if (intervals[i][0] <= last[1]) {
        last[1] = Math.max(last[1], intervals[i][1]);
      } else {
        result.add(new int[]{intervals[i][0], intervals[i][1]});
      }
    }
    return result.toArray(new int[0][]);
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
  sort(intervals.begin(), intervals.end());
  vector<vector<int>> result;
  result.push_back(intervals[0]);
  for (size_t i = 1; i < intervals.size(); i++) {
    auto& last = result.back();
    if (intervals[i][0] <= last[1]) {
      last[1] = max(last[1], intervals[i][1]);
    } else {
      result.push_back(intervals[i]);
    }
  }
  return result;
}`,
      },
    },
    whyFaster: 'Sorting guarantees that anything overlapping the current interval sits right next to it, so each interval is compared with exactly one neighbour instead of with every other interval. The repeated pair scan is replaced by one O(n log n) sort and one O(n) sweep, and no list deletion inside a loop is needed.',
    keyPoints: [
      'Sort first. Merging and inserting sort by start; "keep the most non-overlapping" sorts by end.',
      'Overlap test for a before b: b.start <= a.end. Check whether touching counts.',
      'When merging, new end = max(current end, next end).',
      'For "how many at the same time", sweep start and end events with a counter.',
      'Cost is O(n log n) for the sort; the sweep itself is O(n).',
    ],
    definition: 'An interval is a pair [start, end] on a single axis such as time. Interval problems ask you to merge overlapping ranges, insert one, count how many overlap at once, or drop the fewest so none overlap, and nearly all of them are one sort followed by one left-to-right sweep.',
    coreIdea: 'Once the list is sorted by start, anything that overlaps the block you are building must be the very next item in the list, because everything after it starts even later. So a comparison against every other interval collapses into a comparison against one neighbour. That turns O(n^2) pair checks into one O(n log n) sort plus one O(n) pass.',
    visual: [
      {
        caption: 'The input as given. Nothing lines up, so nothing is obvious.',
        frame: [
          'time  0    5    10   15   20',
          '1-3    [-]',
          '8-10          [-]',
          '2-6     [---]',
          '15-18                [--]',
        ].join('\n'),
      },
      {
        caption: 'Sort by start. Overlapping ranges are now neighbours.',
        frame: [
          'time  0    5    10   15   20',
          '1-3    [-]',
          '2-6     [---]',
          '8-10          [-]',
          '15-18                [--]',
          'order: 1, 2, 8, 15',
        ].join('\n'),
      },
      {
        caption: 'Sweep step 1: 2 <= 3, so they overlap. Stretch the block.',
        frame: [
          'time  0    5    10   15   20',
          'cur    [-]              cur = [1,3]',
          'next    [---]           next = [2,6]',
          '2 <= 3  ->  overlap, end = max(3, 6) = 6',
          'cur    [----]           cur = [1,6]',
        ].join('\n'),
      },
      {
        caption: 'Sweep step 2: 8 > 6, no overlap. Close the block, open a new one.',
        frame: [
          'time  0    5    10   15   20',
          'cur    [----]           cur = [1,6]',
          'next          [-]       next = [8,10]',
          '8 > 6  ->  gap, so push [1,6] to the output',
          'cur           [-]       cur = [8,10]',
        ].join('\n'),
      },
      {
        caption: 'After one pass every neighbour has a gap, so we are done.',
        frame: [
          'time  0    5    10   15   20',
          'out    [----]',
          'out           [-]',
          'out                  [--]',
          'result: [1,6] [8,10] [15,18]',
          '4 intervals in, 3 out, each touched once',
        ].join('\n'),
      },
    ],
    pseudocode: `function merge_intervals(intervals):
    if intervals is empty:
        return empty list
    sort intervals by start, ascending
    output <- list holding a copy of the first interval
    for each [s, e] in intervals from the second one on:
        last <- the final interval in output
        if s <= last.end:              # they overlap or touch
            last.end <- max(last.end, e)
        else:
            append a copy of [s, e] to output
    return output

# the other half of this topic: keep the most non-overlapping
function max_non_overlapping(intervals):
    sort intervals by end, ascending
    kept <- 0
    current_end <- minus infinity
    for each [s, e] in sorted order:
        if s >= current_end:           # it fits after the last kept
            kept <- kept + 1
            current_end <- e
    return kept`,
    complexity: [
      { label: 'Sort', time: 'O(n log n)', space: 'O(n)', note: 'the dominant cost of every interval problem' },
      { label: 'Sweep', time: 'O(n)', space: 'O(1) extra', note: 'each interval is looked at once' },
      { label: 'Merge, total', time: 'O(n log n)', space: 'O(n)', note: 'the output can hold all n intervals' },
      { label: 'Input already sorted', time: 'O(n)', space: 'O(n)', note: 'skip the sort when the problem guarantees order' },
      { label: 'Insert one interval into a sorted list', time: 'O(n)', space: 'O(n)', note: 'one pass, no sort needed at all' },
    ],
    dryRun: {
      input: 'intervals = [[1,3], [8,10], [2,6], [15,18]]',
      goal: 'Merge every group of overlapping intervals, following the optimized merge above.',
      steps: [
        { state: 'intervals = [[1,3], [8,10], [2,6], [15,18]]', action: 'intervals.sort() orders by start, giving [[1,3], [2,6], [8,10], [15,18]].' },
        { state: 'result = [[1, 3]]', action: 'Seed the result with a copy of the first interval so there is always a "last" to compare against.' },
        { state: 'start = 2, end = 6, last = [1, 3]', action: '2 <= 3, so they overlap. last[1] = max(3, 6) = 6 and result becomes [[1, 6]].' },
        { state: 'start = 8, end = 10, last = [1, 6]', action: '8 > 6, so there is a gap. Append [8, 10]; result is [[1, 6], [8, 10]].' },
        { state: 'start = 15, end = 18, last = [8, 10]', action: '15 > 10, another gap. Append [15, 18].' },
        { state: 'result = [[1, 6], [8, 10], [15, 18]]', action: 'The loop is finished, so return the result list.' },
      ],
      result: '[[1, 6], [8, 10], [15, 18]]. It is correct because the list was sorted by start, so every remaining neighbour pair now satisfies next.start > previous.end, which means nothing is left to merge.',
    },
    mistakes: [
      {
        mistake: 'Writing last[1] = end instead of last[1] = max(last[1], end).',
        why: 'A short interval swallowed by a long one shrinks the block. [1, 10] followed by [2, 3] wrongly becomes [1, 3].',
        fix: 'Always take the maximum of the two ends when merging.',
      },
      {
        mistake: 'Using start < last_end as the overlap test.',
        why: 'Touching intervals such as [1, 3] and [3, 5] are then treated as separate. Most LeetCode interval problems count touching as overlapping.',
        fix: 'Default to start <= last_end, and ask the interviewer which convention the problem wants.',
      },
      {
        mistake: 'Sorting by start for "remove the fewest intervals so none overlap".',
        why: 'One long early interval blocks the rest. The safe greedy choice is the interval that finishes earliest, because it leaves the most room.',
        fix: 'Merging and inserting sort by start. Keeping the most, or removing the fewest, sorts by end.',
      },
      {
        mistake: 'Building the result from the input tuples and then mutating them.',
        why: 'In Python a tuple cannot be changed, so last[1] = ... raises TypeError, and reusing the caller list mutates their data.',
        fix: 'Push a fresh list or tuple into the result, for example result.append([start, end]).',
      },
      {
        mistake: 'Seeding the result with intervals[0] without checking for empty input.',
        why: 'An empty list raises IndexError before the loop even starts, and LeetCode does test the empty case on some interval problems.',
        fix: 'Return early when the input is empty, or build the result inside the loop with a "result is empty" branch.',
      },
    ],
    whenToUse: [
      'The input is a list of pairs and the statement says merge, overlap, meeting, booking, or range.',
      'You need to know how many things are active at the same moment, such as rooms or servers.',
      'You must remove the fewest, or keep the most, ranges so that none overlap.',
      'A new range has to be inserted into a set of ranges that is already sorted and disjoint.',
      'There are start and end timestamps and n is large enough that comparing every pair is out.',
    ],
    whenNotToUse: [
      'The axis is small and fixed and you only need counts per unit, such as hours in a day: a difference array with prefix sums is simpler and O(range).',
      'Intervals arrive and disappear online with overlap queries in between: use a balanced BST or a segment tree, not a list you resort each time.',
      'The data are single points, not ranges: sorting plus two pointers is enough.',
      'The ranges are rectangles on two axes: one sort is not enough, you need a sweep line backed by a segment tree.',
      'You only need the busiest k moments: a heap or a counting array beats a full merge.',
    ],
    relatedTopics: [
      { id: 'greedy-basics', kind: 'concept', why: 'Sorting by end and keeping the earliest finisher is the greedy whose exchange argument you can actually prove.' },
      { id: 'sorting-basics', kind: 'concept', why: 'The sort is the dominant cost, so the choice of sort key is the real decision here.' },
      { id: 'two-pointers', kind: 'pattern', why: 'Intersecting two already-sorted interval lists walks both with two pointers instead of merging.' },
      { id: 'prefix-sum', kind: 'pattern', why: 'Counting overlaps on a small time axis is a difference array plus a prefix sum, no sorting needed.' },
      { id: 'top-k-heap', kind: 'pattern', why: 'Meeting Rooms II keeps the end times of active meetings in a min-heap while sweeping the starts.' },
    ],
    quiz: [
      {
        question: 'You merge [1, 10] and then meet [2, 3]. What should the merged interval be?',
        options: ['[1, 3]', '[1, 10]', '[2, 10]', '[2, 3]'],
        answerIndex: 1,
        explanation: '[2, 3] sits entirely inside [1, 10], so the end must be max(10, 3) = 10. Assigning the new end directly is the most common bug in this topic.',
      },
      {
        question: 'To keep the largest number of intervals that do not overlap, what should you sort by?',
        options: ['Start time ascending', 'End time ascending', 'Length ascending', 'Length descending'],
        answerIndex: 1,
        explanation: 'The interval that finishes earliest leaves the most room for everything after it, and the exchange argument shows swapping it in never makes an optimal answer worse.',
      },
      {
        question: 'Merge Intervals on n intervals costs what, and why?',
        options: ['O(n), the sweep touches each interval once', 'O(n log n), because of the sort', 'O(n^2), because you compare pairs', 'O(n log n) time only because the output list is sorted'],
        answerIndex: 1,
        explanation: 'The sweep really is O(n), but the sort in front of it is O(n log n) and dominates. If the problem promises sorted input, the whole thing drops to O(n).',
      },
      {
        question: 'A problem gives you 10^5 bookings, each a range of hours inside a single 24-hour day, and asks for the busiest hour. Is sorting and merging the right approach?',
        options: ['Yes, sort by start and sweep as usual', 'No, count starts and ends into a 24-slot difference array and prefix sum it, which is O(n + 24)', 'No, use a min-heap of end times', 'Yes, but sort by end instead'],
        answerIndex: 1,
        explanation: 'When the axis is tiny and fixed, a difference array beats the sort: you add +1 at each start and -1 at each end, then prefix sum over 24 slots.',
      },
    ],
    sources: [
      'CLRS ch. 16.1: the activity-selection problem and its proof',
      'CP-Algorithms: sweep line and interval scheduling notes',
      'USACO Guide: Sorting, Greedy with Sorting, and Sweep Line',
      'CSES Competitive Programmers Handbook ch. 6 and ch. 7',
      'LeetCode editorials for Merge Intervals and Non-overlapping Intervals',
    ],
    patternIds: ['merge-intervals', 'greedy'],
    problems: [
      {
        id: 'summary-ranges',
        title: 'Summary Ranges',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/summary-ranges/',
        patternId: 'merge-intervals',
        hint: 'Walk the sorted numbers and extend the current range while each value is exactly one more than the last.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/merge-intervals/',
        patternId: 'merge-intervals',
        hint: 'Sort by start; compare each interval only with the last one in your result list.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'insert-interval',
        title: 'Insert Interval',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/insert-interval/',
        patternId: 'merge-intervals',
        hint: 'Copy intervals that end before the new one, merge everything that overlaps, then copy the rest.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'non-overlapping-intervals',
        title: 'Non-overlapping Intervals',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/non-overlapping-intervals/',
        patternId: 'greedy',
        hint: 'Sort by end time and always keep the interval that finishes earliest; count the ones you must drop.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'minimum-number-of-arrows-to-burst-balloons',
        title: 'Minimum Number of Arrows to Burst Balloons',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/',
        patternId: 'greedy',
        hint: 'Sort by end; shoot an arrow at the end of the first balloon and skip every balloon that starts before it.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'interval-list-intersections',
        title: 'Interval List Intersections',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/interval-list-intersections/',
        patternId: 'merge-intervals',
        hint: 'Use two pointers; the intersection is [max of starts, min of ends], then advance whichever interval ends first.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'bit-manipulation',
    gateId: 'greedy-bits-tries',
    order: 3,
    title: 'Bit manipulation: tricks on 0s and 1s',
    minutes: 25,
    summary: 'A handful of bit operators (AND, OR, XOR, shifts) solve counting and pairing problems in O(1) extra space.',
    analogy: 'A number is a row of light switches: each switch is on (1) or off (0). AND asks "are both on?", OR asks "is either on?", XOR asks "are they different?". Flipping switches in bulk is faster than asking about each one.',
    explanation: `Every integer is stored as bits. \`5\` is \`101\`, \`6\` is \`110\`. Bit operators work on all the bits at once in a single CPU instruction. That makes a few classic problems trivial, and interviewers like them because they show you understand what a number really is.

## The operators

- \`a & b\` (AND): bit is 1 only if both are 1. \`5 & 6 = 100 = 4\`.
- \`a | b\` (OR): bit is 1 if either is 1. \`5 | 6 = 111 = 7\`.
- \`a ^ b\` (XOR): bit is 1 if they differ. \`5 ^ 6 = 011 = 3\`.
- \`~a\` (NOT): flip every bit.
- \`a << k\`: shift left, same as multiplying by 2^k. \`a >> k\`: shift right, same as dividing by 2^k.

## Four tricks worth memorising

- **XOR cancels pairs.** \`x ^ x = 0\` and \`x ^ 0 = x\`. XOR-ing a whole array leaves only the number that appears an odd number of times.
- **Check bit i**: \`(n >> i) & 1\`.
- **Drop the lowest set bit**: \`n & (n - 1)\`. \`12 = 1100\` becomes \`1000 = 8\`. Counting how many times you can do this counts the 1s (Brian Kernighan's method).
- **Power of two?** \`n > 0 and n & (n - 1) == 0\`.

## A tiny example: Single Number

Every number in \`[4, 1, 2, 1, 2]\` appears twice except one. Find it.

**The slow way** checks every number against every other number to count it. Two nested loops: O(n^2). A hash map fixes time, O(n), but costs O(n) extra memory.

**The fast way** XORs everything together:

\`\`\`python
def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result
\`\`\`

Walk through it: \`4 ^ 1 ^ 2 ^ 1 ^ 2\`. XOR is order-independent, so reorder as \`(1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4\`. Pairs vanish, the loner survives. O(n) time, O(1) space, no data structure at all.

## Counting bits for 0..n

\`countBits(n)\` wants the number of 1s in every number up to n. The trick: \`bits[i] = bits[i >> 1] + (i & 1)\`. Shifting right removes the last bit, and \`i & 1\` tells you whether that last bit was a 1. This is dynamic programming on bits, O(n) total.

## Where people go wrong

- Confusing \`^\` (XOR) with "power" in Python. Power is \`**\`.
- Forgetting operator precedence: write \`(n >> i) & 1\`, not \`n >> i & 1\` and hoping.
- Negative numbers. Python integers are unbounded, so masking with \`0xFFFFFFFF\` is needed for 32-bit problems like reversing bits or adding without plus.
- Using bit tricks where a plain loop is clearer. Bits are a tool for specific shapes, not a style.

## How to recognise it in an interview

Clues: "appears once, all others twice", "count set bits", "without using + or -", "power of two", "O(1) extra space" on a counting problem, "reverse bits", "XOR". Also any time n is small (<= 20) and the problem asks for all subsets: a bitmask from \`0\` to \`2^n - 1\` can represent each subset as a number.`,
    naive: {
      title: 'Brute force: count each number with a nested loop',
      description: 'For every element, walk the whole array and count how many times it appears. Return the one with count 1. Simple but quadratic.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def single_number(nums):
    for x in nums:
        count = 0
        for y in nums:
            if x == y:
                count += 1
        if count == 1:
            return x
    return -1`,
        javascript: `function singleNumber(nums) {
  for (const x of nums) {
    let count = 0;
    for (const y of nums) {
      if (x === y) count++;
    }
    if (count === 1) return x;
  }
  return -1;
}`,
        java: `class Solution {
  public int singleNumber(int[] nums) {
    for (int x : nums) {
      int count = 0;
      for (int y : nums) {
        if (x == y) count++;
      }
      if (count == 1) return x;
    }
    return -1;
  }
}`,
        cpp: `#include <vector>
using namespace std;

int singleNumber(vector<int>& nums) {
  for (int x : nums) {
    int count = 0;
    for (int y : nums) {
      if (x == y) count++;
    }
    if (count == 1) return x;
  }
  return -1;
}`,
      },
    },
    optimized: {
      title: 'XOR everything: pairs cancel out',
      description: 'XOR of two equal numbers is 0, and XOR with 0 changes nothing. XOR the whole array and every pair disappears, leaving only the single number.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result`,
        javascript: `function singleNumber(nums) {
  let result = 0;
  for (const x of nums) {
    result ^= x;
  }
  return result;
}`,
        java: `class Solution {
  public int singleNumber(int[] nums) {
    int result = 0;
    for (int x : nums) {
      result ^= x;
    }
    return result;
  }
}`,
        cpp: `#include <vector>
using namespace std;

int singleNumber(vector<int>& nums) {
  int result = 0;
  for (int x : nums) {
    result ^= x;
  }
  return result;
}`,
      },
    },
    whyFaster: 'The nested loop recounts the whole array for every element, giving n * n comparisons. XOR uses an algebraic fact, x ^ x = 0, so a single pass makes every pair cancel itself without ever comparing elements. Time drops from O(n^2) to O(n), and unlike a hash map it needs no extra memory.',
    keyPoints: [
      'AND (&) both on, OR (|) either on, XOR (^) different, shifts multiply or divide by 2.',
      'x ^ x = 0 and x ^ 0 = x: XOR cancels pairs.',
      'n & (n - 1) drops the lowest set bit; loop it to count 1s or test for powers of two.',
      '(n >> i) & 1 reads bit i; n | (1 << i) sets it.',
      'In Python, mask with 0xFFFFFFFF when a problem assumes 32-bit integers.',
      'A bitmask 0..2^n - 1 can enumerate all subsets when n is small.',
    ],
    definition: 'Bit manipulation means operating directly on the binary digits of an integer with AND, OR, XOR, NOT and the two shifts. Each operator acts on the whole row of bits in one machine instruction, which turns some counting and pairing problems into a single pass with O(1) extra space.',
    coreIdea: 'A number is not an atom, it is a fixed row of switches, and the bit operators are algebra on that row. Because x XOR x is 0 and n AND (n - 1) erases exactly the lowest 1, facts that would otherwise need a hash map or a nested loop can be squeezed out with one integer of state. That is how O(n^2) comparisons or O(n) memory become O(n) time and O(1) space.',
    visual: [
      {
        caption: 'The three operators, on 5 and 6, bit by bit.',
        frame: [
          '     5 = 0101',
          '     6 = 0110',
          ' &  --> 0100 = 4   1 only where BOTH are 1',
          ' |  --> 0111 = 7   1 where EITHER is 1',
          ' ^  --> 0011 = 3   1 where they DIFFER',
        ].join('\n'),
      },
      {
        caption: 'XOR cancellation on [4, 1, 2, 1, 2]: pairs undo themselves.',
        frame: [
          'result       = 0000',
          '^ 4 = 0100   -> 0100',
          '^ 1 = 0001   -> 0101',
          '^ 2 = 0010   -> 0111',
          '^ 1 = 0001   -> 0110   the first 1 is undone',
          '^ 2 = 0010   -> 0100 = 4   the first 2 is undone',
        ].join('\n'),
      },
      {
        caption: 'n & (n - 1) erases the lowest 1. Loop it to count the 1s.',
        frame: [
          'n      = 12 = 1100',
          'n - 1  = 11 = 1011   lowest 1 flips down,',
          '                     all zeros below flip up',
          'n & (n-1)   = 1000 = 8      one 1 gone',
          'again: 8 & 7 = 1000 & 0111 = 0000',
          '2 loops = 2 set bits (Kernighan)',
        ].join('\n'),
      },
      {
        caption: 'n & -n keeps only the lowest 1, using two-complement negation.',
        frame: [
          ' n   =  12 = 0000 1100',
          '~n   =       1111 0011',
          '-n   = -12 = 1111 0100   (~n + 1)',
          'n & -n     = 0000 0100 = 4',
          'walk every set bit:  b = n & -n; n = n - b',
        ].join('\n'),
      },
      {
        caption: 'Shifts move the whole row left or right by k places.',
        frame: [
          '   n  =  1011 = 11',
          'n << 1 = 10110 = 22    times 2, a 0 enters right',
          'n >> 1 =   101 = 5     floor divide by 2',
          'read bit i:  (n >> i) & 1',
          'set  bit i:  n | (1 << i)',
          'clear bit i: n & ~(1 << i)',
        ].join('\n'),
      },
      {
        caption: 'Python has no fixed width, so negative-number tricks differ.',
        frame: [
          'Python ints are arbitrary precision and behave',
          'as if they had endless copies of the sign bit:',
          '  ~5       -> -6      not 1010 in 4 bits',
          '  -1 >> 1  -> -1      sign fills in, never 0',
          '  1 << 40  -> a big int, it never overflows',
          'C++ / Java int is 32 bits and wraps around.',
          'For 32-bit problems in Python:',
          '  v &= 0xFFFFFFFF',
          '  if v >= 1 << 31: v -= 1 << 32',
        ].join('\n'),
      },
    ],
    pseudocode: `function count_set_bits(n):            # Brian Kernighan
    count <- 0
    while n is not 0:
        n <- n AND (n - 1)                 # erase the lowest 1
        count <- count + 1
    return count

function single_number(nums):          # all twice except one
    acc <- 0
    for each x in nums:
        acc <- acc XOR x                   # pairs cancel to 0
    return acc

function lowest_set_bit(n):
    return n AND (0 - n)                   # two-complement trick

function for_each_set_bit(n):
    while n is not 0:
        bit <- n AND (0 - n)
        handle bit
        n <- n - bit

function is_power_of_two(n):
    return n > 0 AND (n AND (n - 1)) = 0`,
    complexity: [
      { label: 'One operator (&, |, ^, shift)', time: 'O(1)', space: 'O(1)', note: 'a single instruction on a fixed-width int' },
      { label: 'XOR the whole array', time: 'O(n)', space: 'O(1)', note: 'one accumulator, no data structure' },
      { label: 'Count set bits, Kernighan loop', time: 'O(k), k = number of 1s', space: 'O(1)', note: 'at most 32 or 64 turns' },
      { label: 'Count set bits, checking every position', time: 'O(w), w = word width', space: 'O(1)', note: 'always 32 checks, even for n = 1' },
      { label: 'Enumerate all subsets with a bitmask', time: 'O(2^n * n)', space: 'O(1) plus output', note: 'only usable up to about n = 20' },
    ],
    dryRun: {
      input: 'nums = [4, 1, 2, 1, 2]',
      goal: 'Find the one value that appears an odd number of times, using the optimized single_number above.',
      steps: [
        { state: 'result = 0 (0000)', action: 'Start the accumulator at 0, which is the identity for XOR.' },
        { state: 'x = 4 (0100), result = 0000', action: 'result = 0000 XOR 0100 = 0100, which is 4.' },
        { state: 'x = 1 (0001), result = 0100', action: 'result = 0100 XOR 0001 = 0101, which is 5.' },
        { state: 'x = 2 (0010), result = 0101', action: 'result = 0101 XOR 0010 = 0111, which is 7.' },
        { state: 'x = 1 (0001), result = 0111', action: 'result = 0111 XOR 0001 = 0110, which is 6. The earlier 1 has now been undone.' },
        { state: 'x = 2 (0010), result = 0110', action: 'result = 0110 XOR 0010 = 0100, which is 4. The earlier 2 has been undone too.' },
        { state: 'loop finished, result = 0100', action: 'Return 4.' },
      ],
      result: '4. XOR is commutative and associative, so the run is the same as (1 XOR 1) XOR (2 XOR 2) XOR 4 = 0 XOR 0 XOR 4. Every paired value cancelled itself and only the loner survived, using one integer of memory.',
    },
    mistakes: [
      {
        mistake: 'Writing if n & 1 == 0 to test for an even number.',
        why: 'In Python, C, C++ and Java, == binds tighter than &, so this parses as n & (1 == 0), which is n & 0 and is always falsy.',
        fix: 'Add the brackets: if (n & 1) == 0. The same applies to (n >> i) & 1.',
      },
      {
        mistake: 'Using ^ when you meant "to the power of" in Python.',
        why: '^ is XOR in Python, so 2 ^ 3 is 1, not 8. The code runs and quietly returns nonsense.',
        fix: 'Power is ** in Python and pow() elsewhere. Reserve ^ for XOR.',
      },
      {
        mistake: 'Porting a 32-bit C++ bit trick to Python unchanged, as in Sum of Two Integers or Reverse Bits.',
        why: 'Python integers are arbitrary precision, so the carry never overflows away and a loop like "while carry: ..." never ends, or the result comes back as a huge positive number instead of a negative one.',
        fix: 'Mask after every step with & 0xFFFFFFFF, and at the end convert back with: if v >= 1 << 31: v -= 1 << 32.',
      },
      {
        mistake: 'Testing for a power of two with just n & (n - 1) == 0.',
        why: 'Zero passes that test, because 0 & -1 is 0, so 0 is reported as a power of two. Negative values misbehave too.',
        fix: 'Write n > 0 and (n & (n - 1)) == 0.',
      },
      {
        mistake: 'In Java or C++, writing 1 << 31 or 1 << 32 on a 32-bit int.',
        why: '1 << 31 overflows a signed int into a negative number, and in Java a shift count is taken modulo 32 so 1 << 32 quietly equals 1, while in C++ it is undefined behaviour.',
        fix: 'Use 1L << k in Java and 1LL << k in C++ whenever k can reach 31 or more.',
      },
    ],
    whenToUse: [
      'Values repeat in pairs and exactly one or two are unpaired, so XOR cancellation applies.',
      'The task is counting 1 bits, testing a power of two, or setting, clearing or flipping one flag.',
      'n is at most about 20 and the problem needs every subset: enumerate masks 0 to 2^n - 1.',
      'The statement forbids + and -, or demands O(1) extra space on a counting problem.',
      'You need a compact set of up to 32 or 64 items, such as visited states in DP over subsets.',
    ],
    whenNotToUse: [
      'Elements repeat three times or an odd number of times: plain XOR no longer cancels, so count each bit position modulo 3 or use a hash map.',
      'Keys are strings or the value range is huge: a bitmask cannot address them, use a hash map or set.',
      'n is above roughly 22: 2^n stops fitting in the time limit, so look for DP, greedy or a maths shortcut.',
      'A plain loop is clear and fast enough: in an interview, readable beats clever on small inputs.',
      'You are in Python and silently assuming 32-bit wraparound: either mask explicitly or solve it with arithmetic instead.',
    ],
    relatedTopics: [
      { id: 'hashing-tricks', kind: 'concept', why: 'A hash map is the general fallback for counting when XOR cancellation does not apply.' },
      { id: 'subsets-and-permutations', kind: 'concept', why: 'Enumerating masks 0 to 2^n - 1 is the iterative twin of the recursive subset build.' },
      { id: 'tries', kind: 'concept', why: 'A binary trie stores numbers bit by bit and answers maximum-XOR queries in 32 steps.' },
      { id: 'knapsack', kind: 'concept', why: 'DP over subsets indexes its table by a bitmask, so these tricks become the loop body.' },
    ],
    quiz: [
      {
        question: 'What is 12 & 11 in binary and decimal?',
        options: ['1111, which is 15', '1000, which is 8', '0100, which is 4', '1100, which is 12'],
        answerIndex: 1,
        explanation: '12 is 1100 and 11 is 1011, so the AND is 1000, which is 8. This is n & (n - 1): it erased the lowest 1 of 12.',
      },
      {
        question: 'Every value in an array appears three times except one, which appears once. Will XOR-ing the whole array find the loner?',
        options: ['Yes, XOR always isolates the odd one out', 'Yes, but only after sorting the array', 'No, three copies XOR down to one copy, so every value survives; count each bit position modulo 3 instead', 'No, XOR of any array is always 0'],
        answerIndex: 2,
        explanation: 'XOR cancels pairs, not triples: x XOR x XOR x is x. So the result is the XOR of every distinct value, which is not the answer. The fix is to count how many times each bit position is 1 and take that count modulo 3.',
      },
      {
        question: 'Counting the 1 bits of a 32-bit integer with the n = n & (n - 1) loop costs what?',
        options: ['Always exactly 32 iterations', 'One iteration per set bit, so at most 32', 'O(log log n)', 'O(n)'],
        answerIndex: 1,
        explanation: 'Each turn erases exactly one 1, so the loop runs as many times as there are set bits. For a fixed 32-bit word that is O(1) with a small constant.',
      },
      {
        question: 'In Python, what does ~5 evaluate to, and why does that matter?',
        options: ['10, because it flips 0101 to 1010', '-6, because Python ints are arbitrary precision with endless sign bits', '4294967290, because Python uses 32-bit words', '0, because NOT of a positive number is 0'],
        answerIndex: 1,
        explanation: 'Python has no fixed width, so ~x is always -x - 1. To imitate C++ or Java behaviour you must mask with 0xFFFFFFFF and convert the top half back to a negative value yourself.',
      },
    ],
    sources: [
      'CSES Competitive Programmers Handbook ch. 10: bit manipulation',
      'CP-Algorithms: bit manipulation and submask enumeration',
      'USACO Guide: Introduction to Bitwise Operators and Bitmask DP',
      'Hacker Delight (Warren): lowest set bit and population count identities',
      'Python language reference: integers are of unlimited precision',
      'Java Language Specification: shift distance is taken modulo the operand width',
    ],
    patternIds: ['bit-manipulation'],
    problems: [
      {
        id: 'number-of-1-bits',
        title: 'Number of 1 Bits',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/number-of-1-bits/',
        patternId: 'bit-manipulation',
        hint: 'Repeat n = n & (n - 1) until n is 0 and count the iterations.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'single-number',
        title: 'Single Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/single-number/',
        patternId: 'bit-manipulation',
        hint: 'XOR every element together; pairs cancel to zero.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'counting-bits',
        title: 'Counting Bits',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/counting-bits/',
        patternId: 'bit-manipulation',
        hint: 'bits[i] = bits[i >> 1] + (i & 1); reuse the answer for the number with the last bit removed.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'reverse-bits',
        title: 'Reverse Bits',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/reverse-bits/',
        patternId: 'bit-manipulation',
        hint: 'Loop 32 times: shift the result left, add the lowest bit of n, shift n right.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'missing-number',
        title: 'Missing Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/missing-number/',
        patternId: 'bit-manipulation',
        hint: 'XOR all indices 0..n together with all values; everything cancels except the missing one.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'sum-of-two-integers',
        title: 'Sum of Two Integers',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sum-of-two-integers/',
        patternId: 'bit-manipulation',
        hint: 'a ^ b is the sum without carries and (a & b) << 1 is the carries; repeat until the carry is zero (mask to 32 bits in Python).',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'tries',
    gateId: 'greedy-bits-tries',
    order: 4,
    title: 'Tries: the prefix tree',
    minutes: 25,
    summary: 'A trie stores words letter by letter in a tree so that prefix lookups cost only the length of the prefix, not the size of the dictionary.',
    analogy: 'A phone contact list on your screen: you type "Ja" and it instantly shows Jack, Jade, James. The app does not scan every contact; it walks a tree where each level is the next letter you typed.',
    explanation: `A trie (say "try") is a tree where each edge is one character. Walking from the root spells out a word. Words that share a prefix share the same path, so "car", "card" and "care" share the nodes c -> a -> r. This makes "does any word start with X?" a walk of length len(X), no matter how many words are stored.

## The idea

- Each node has a map from character to child node, plus a flag \`is_end\` that marks "a word ends here".
- **Insert**: walk the characters, creating missing children, then set \`is_end\` on the last node.
- **Search word**: walk the characters; if a child is missing return False; at the end return \`is_end\`.
- **Starts with prefix**: same walk, but return True as soon as you reach the end of the prefix.

All three cost O(L) where L is the length of the word or prefix.

## A tiny example

Insert "cat", "car", "dog". The tree looks like this:

- root -> c -> a -> t (end)
- root -> c -> a -> r (end)
- root -> d -> o -> g (end)

\`startsWith("ca")\`: root has c, c has a, done, True. \`search("ca")\`: same walk, but the a node is not marked as end, so False. \`search("cow")\`: c has no child o, False.

## The slow way versus the fast way

Suppose you have 100,000 words and must answer many prefix queries.

**Slow**: for each query, loop over all words and call \`word.startswith(prefix)\`. Each query costs O(N * L), where N is the number of words. With 100,000 queries that is 10^10 character comparisons.

**Fast**: build the trie once, O(total characters). Then each query is O(L), a walk of a few nodes.

\`\`\`python
class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False

    def insert(self, word):
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = Trie()
            node = node.children[ch]
        node.is_end = True

    def starts_with(self, prefix):
        node = self
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True
\`\`\`

## Two power moves

- **Wildcard search** ("." matches any letter): when you see ".", recursively try every child. That is Design Add and Search Words.
- **Grid word search**: put the dictionary in a trie, then DFS the grid while walking the trie at the same time. You stop exploring a cell the moment the current path is not a prefix of any word. That is Word Search II, and it is the standard "hard" trie interview problem.
- **Binary trie**: store numbers as 32-bit strings. To maximise XOR, walk the trie always preferring the opposite bit. That solves Maximum XOR of Two Numbers.

## Where people go wrong

- Forgetting \`is_end\`. Without it, "ca" looks like a stored word after inserting "cat".
- Using a fixed 26-slot array when the input has upper case or digits. A dict is safer unless speed matters.
- In Word Search II, not pruning: remove a word from the trie once found, otherwise duplicates and slow runs.
- Memory: a trie can be large. Each node is a dict. That is fine for interview sizes, but mention it.

## How to recognise it in an interview

Clues: "prefix", "starts with", "autocomplete", "dictionary of words", "search with wildcard", "many words and many queries", "find all words in a grid", "maximum XOR". If the input is a list of strings and the questions are about their beginnings, reach for a trie.`,
    naive: {
      title: 'Brute force: scan every word for each prefix query',
      description: 'Keep the words in a list. For each query, loop over the whole list and check startswith. Fine for a few queries, painful for many.',
      time: 'O(N * L) per query',
      space: 'O(total characters)',
      code: {
        python: `class WordStore:
    def __init__(self):
        self.words = []

    def insert(self, word):
        self.words.append(word)

    def starts_with(self, prefix):
        for word in self.words:
            if word.startswith(prefix):
                return True
        return False`,
        javascript: `class WordStore {
  constructor() {
    this.words = [];
  }
  insert(word) {
    this.words.push(word);
  }
  startsWith(prefix) {
    for (const word of this.words) {
      if (word.startsWith(prefix)) return true;
    }
    return false;
  }
}`,
        java: `import java.util.*;

class WordStore {
  private final List<String> words = new ArrayList<>();

  public void insert(String word) {
    words.add(word);
  }

  public boolean startsWith(String prefix) {
    for (String word : words) {
      if (word.startsWith(prefix)) return true;
    }
    return false;
  }
}`,
        cpp: `#include <string>
#include <vector>
using namespace std;

class WordStore {
  vector<string> words;
public:
  void insert(const string& word) { words.push_back(word); }

  bool startsWith(const string& prefix) {
    for (const string& word : words) {
      if (word.compare(0, prefix.size(), prefix) == 0) return true;
    }
    return false;
  }
};`,
      },
    },
    optimized: {
      title: 'Trie: walk one node per character',
      description: 'Store words as paths in a tree. Insert and lookup both walk one node per character, so cost depends only on the length of the word, never on how many words are stored.',
      time: 'O(L) per insert or query',
      space: 'O(total characters)',
      code: {
        python: `class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False

    def insert(self, word):
        node = self
        for ch in word:
            if ch not in node.children:
                node.children[ch] = Trie()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, text):
        node = self
        for ch in text:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node`,
        javascript: `class Trie {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
  insert(word) {
    let node = this;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new Trie());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }
  walk(text) {
    let node = this;
    for (const ch of text) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch);
    }
    return node;
  }
  search(word) {
    const node = this.walk(word);
    return node !== null && node.isEnd;
  }
  startsWith(prefix) {
    return this.walk(prefix) !== null;
  }
}`,
        java: `class Trie {
  private final Trie[] next = new Trie[26];
  private boolean isEnd;

  public void insert(String word) {
    Trie node = this;
    for (char c : word.toCharArray()) {
      int i = c - 'a';
      if (node.next[i] == null) node.next[i] = new Trie();
      node = node.next[i];
    }
    node.isEnd = true;
  }

  private Trie walk(String text) {
    Trie node = this;
    for (char c : text.toCharArray()) {
      node = node.next[c - 'a'];
      if (node == null) return null;
    }
    return node;
  }

  public boolean search(String word) {
    Trie node = walk(word);
    return node != null && node.isEnd;
  }

  public boolean startsWith(String prefix) {
    return walk(prefix) != null;
  }
}`,
        cpp: `#include <string>
using namespace std;

class Trie {
  Trie* next[26] = {};
  bool isEnd = false;

  Trie* walk(const string& text) {
    Trie* node = this;
    for (char c : text) {
      node = node->next[c - 'a'];
      if (!node) return nullptr;
    }
    return node;
  }
public:
  void insert(const string& word) {
    Trie* node = this;
    for (char c : word) {
      if (!node->next[c - 'a']) node->next[c - 'a'] = new Trie();
      node = node->next[c - 'a'];
    }
    node->isEnd = true;
  }
  bool search(const string& word) {
    Trie* node = walk(word);
    return node && node->isEnd;
  }
  bool startsWith(const string& prefix) { return walk(prefix) != nullptr; }
};`,
      },
    },
    whyFaster: 'The list scan touches every stored word on every query, so cost grows with the dictionary size N. The trie shares common prefixes as shared paths, so a query only follows one path of length L and never looks at unrelated words. Per-query cost drops from O(N * L) to O(L), which matters enormously when both N and the number of queries are large.',
    keyPoints: [
      'A trie is a tree where each edge is one character; shared prefixes share nodes.',
      'Every node needs a children map and an is_end flag.',
      'Insert, search and startsWith are all O(L) in the length of the string.',
      'Wildcards: on "." recurse into every child.',
      'Word Search II: DFS the grid and the trie together, prune when the path is not a prefix.',
      'A binary trie over bits solves maximum-XOR problems.',
    ],
    definition: 'A trie, also called a prefix tree, is a tree in which every edge carries a single character, so the path from the root to a node spells one prefix. Each node carries a flag saying whether a stored word ends exactly there.',
    coreIdea: 'Words that share a prefix share the same nodes, so the dictionary is stored once, folded. Answering "is this a prefix of anything?" is then just following one edge per character, and the work depends only on the length of the query, never on how many words are stored. A query drops from O(N * L) scanning to O(L) walking whether N is 100 or 100000.',
    visual: [
      {
        caption: 'Insert "car". Each edge is one character; * marks a word end.',
        frame: [
          'root',
          ' +- c',
          '    +- a',
          '       +- r *        * = a stored word ends here',
        ].join('\n'),
      },
      {
        caption: 'Insert "card" and "care". They reuse the c-a-r path.',
        frame: [
          'root',
          ' +- c',
          '    +- a',
          '       +- r *',
          '          +- d *',
          '          +- e *',
          '3 words, 11 letters, but only 5 nodes below root',
        ].join('\n'),
      },
      {
        caption: 'Insert "cat" and "dog". New branches only where they differ.',
        frame: [
          'root',
          ' +- c',
          ' |  +- a',
          ' |     +- r *',
          ' |     |  +- d *',
          ' |     |  +- e *',
          ' |     +- t *',
          ' +- d',
          '    +- o',
          '       +- g *',
        ].join('\n'),
      },
      {
        caption: 'search("ca") and startsWith("ca") walk the same path.',
        frame: [
          'walk c -> a     both edges exist, we land on "a"',
          'node "a" has no *',
          '  search("ca")      = False   (no word ends here)',
          '  startsWith("ca")  = True    (we arrived at all)',
          'That single * flag is the whole difference.',
        ].join('\n'),
      },
      {
        caption: 'search("cow") stops after 2 characters, not 5 words.',
        frame: [
          'walk c          ok',
          'node c children = { a }      no edge for "o"',
          '  -> return False immediately',
          'Cost = length of the query, never the number',
          'of stored words. Adding 100000 more words',
          'would not change this lookup.',
        ].join('\n'),
      },
    ],
    pseudocode: `node has: children (map from character to node)
          is_end (boolean, false by default)

function insert(root, word):
    node <- root
    for each ch in word:
        if ch is not a key of node.children:
            node.children[ch] <- a new empty node
        node <- node.children[ch]
    node.is_end <- true

function walk(root, text):
    node <- root
    for each ch in text:
        if ch is not a key of node.children:
            return nothing
        node <- node.children[ch]
    return node

function search(root, word):
    node <- walk(root, word)
    return node exists AND node.is_end

function starts_with(root, prefix):
    return walk(root, prefix) exists`,
    complexity: [
      { label: 'Insert a word of length L', time: 'O(L)', space: 'O(L) new nodes worst case', note: 'shared prefixes create nothing new' },
      { label: 'search or startsWith', time: 'O(L)', space: 'O(1)', note: 'does not depend on how many words are stored' },
      { label: 'Build from N words', time: 'O(total characters)', space: 'O(total characters)', note: 'array-of-26 nodes cost 26 slots each even when empty' },
      { label: 'Wildcard query with d dots', time: 'O(26^d * L) worst case', space: 'O(L) recursion', note: 'a query of all dots visits the whole trie' },
      { label: 'The list scan it replaces', time: 'O(N * L) per query', space: 'O(total characters)', note: 'why the trie exists at all' },
    ],
    dryRun: {
      input: 'insert "cat", "car", "dog", then ask search("ca"), starts_with("ca"), search("car"), search("cow")',
      goal: 'Build the trie and answer four queries with the optimized Trie class above.',
      steps: [
        { state: 'root.children = {}', action: 'insert("cat"): c is missing so create it, then a, then t. Set is_end on the t node.' },
        { state: 'root -> c -> a -> t*', action: 'insert("car"): c and a already exist, so the loop reuses them and only r is created. Set is_end on r.' },
        { state: 'root -> c -> a -> {t*, r*}', action: 'insert("dog"): root has no d, so a fresh path d -> o -> g is built and is_end is set on g.' },
        { state: 'text = "ca", node = root', action: '_walk("ca") steps to c, then to a, and returns the a node because both edges existed.' },
        { state: 'node = the a node, node.is_end = False', action: 'search("ca") returns node is not None and node.is_end, which is False. starts_with("ca") only checks that _walk returned a node, so it returns True.' },
        { state: 'text = "car", node = root', action: 'search("car") walks c -> a -> r. The r node has is_end set, so it returns True.' },
        { state: 'text = "cow", node = the c node, ch = "o"', action: 'search("cow"): after c the children map holds only a, with no o, so _walk returns None and search returns False after only 2 characters.' },
      ],
      result: 'search("ca") is False, starts_with("ca") is True, search("car") is True, search("cow") is False. Every answer took at most three node steps, one per character, and the number of stored words never entered the cost.',
    },
    mistakes: [
      {
        mistake: 'Leaving out the is_end flag and treating "we arrived at a node" as "this is a word".',
        why: 'After inserting only "cat", search("ca") would wrongly return True, and every proper prefix of every word becomes a false positive.',
        fix: 'Set is_end on the last node of each insert, and check it in search but not in startsWith.',
      },
      {
        mistake: 'Using a defaultdict, or node.children.setdefault(ch, Trie()), inside search or startsWith.',
        why: 'The lookup silently creates the missing node, so the trie grows on every failed query and startsWith starts returning True for everything.',
        fix: 'Only create nodes in insert. In search use an explicit membership test: if ch not in node.children: return False.',
      },
      {
        mistake: 'Hard-coding a 26-slot array with the index c - "a".',
        why: 'Upper-case letters, digits, spaces or Unicode produce a negative or out-of-range index, which crashes or corrupts a neighbouring slot.',
        fix: 'Use a dictionary or map unless the problem promises lower-case a to z, and say that assumption out loud.',
      },
      {
        mistake: 'In Word Search II, collecting a word every time the DFS reaches it and never pruning.',
        why: 'The same word is reported many times, and the search keeps exploring dead branches, which is the usual cause of a timeout on that problem.',
        fix: 'Store the word on the terminal node, clear it after collecting it once, and delete leaf nodes on the way back up so branches die.',
      },
      {
        mistake: 'Reaching for a trie when the question is only exact-word membership.',
        why: 'A hash set answers "is this word in the dictionary?" in the same O(L) with far less memory and about five lines of code.',
        fix: 'Use a trie only when the questions are about prefixes, wildcards, or matching many words at once.',
      },
    ],
    whenToUse: [
      'The words prefix, starts with, or autocomplete appear in the statement.',
      'There is one fixed dictionary and many queries, so building once and querying in O(L) pays off.',
      'Queries contain wildcards or need partial matching over a word list.',
      'You must find any of many words inside a grid, a stream, or a long text at once.',
      'You need the maximum XOR of a pair: build a binary trie over the 32 bits of each number.',
    ],
    whenNotToUse: [
      'You only need exact-word membership: a hash set gives the same O(L) with much less memory and code.',
      'There are a handful of words and a handful of queries: a plain list scan is shorter and fast enough.',
      'The questions are about suffixes or arbitrary substrings: use KMP, Z-function, a suffix array, or a suffix automaton.',
      'Memory is tight and the alphabet is large: 26-slot arrays per node explode, so use maps or a compressed radix tree.',
      'You need words ranked by frequency rather than by prefix: a hash map plus a heap is the right shape.',
    ],
    relatedTopics: [
      { id: 'tree-basics-and-traversals', kind: 'concept', why: 'A trie is a tree, so collecting every word under a node is an ordinary DFS.' },
      { id: 'hash-map-basics', kind: 'concept', why: 'Each trie node is a small hash map from character to child, and a hash set is the simpler alternative for exact lookups.' },
      { id: 'bit-manipulation', kind: 'concept', why: 'A binary trie stores each number as 32 bits so maximum-XOR queries become a greedy walk.' },
      { id: 'backtracking', kind: 'pattern', why: 'Wildcard search and Word Search II recurse into children and undo their choice on the way back.' },
      { id: 'dfs', kind: 'pattern', why: 'Word Search II walks the grid and the trie in step, pruning the moment the path stops being a prefix.' },
    ],
    quiz: [
      {
        question: 'You insert only the word "cat". What do search("ca") and startsWith("ca") return?',
        options: ['True and True', 'False and True', 'True and False', 'False and False'],
        answerIndex: 1,
        explanation: 'The walk reaches the "a" node, so startsWith is True, but that node has no is_end flag, so search is False. That flag is the only difference between the two operations.',
      },
      {
        question: 'A trie holds 100000 words. How much work is startsWith("code")?',
        options: ['O(N), one check per stored word', 'O(N * L)', 'O(4), one step per character of the prefix', 'O(log N), like a binary search'],
        answerIndex: 2,
        explanation: 'The walk follows one edge per character of the query, so it is O(L) with L = 4. Growing the dictionary to a million words would not change it.',
      },
      {
        question: 'You need to answer "is this exact word in my 10^5-word dictionary?" and nothing else. Trie or hash set?',
        options: ['Trie, because it is designed for words', 'Hash set, same O(L) hashing cost with far less memory and code', 'Trie, because a hash set cannot store strings', 'Neither, sort the list and binary search'],
        answerIndex: 1,
        explanation: 'Hashing the word is already O(L), so the trie buys nothing here. The trie earns its memory only when you ask prefix, wildcard, or many-words-at-once questions.',
      },
      {
        question: 'Why is a node that stores children as a 26-slot array often worse than one that stores a map?',
        options: ['It is slower to follow an edge', 'It reserves 26 pointers per node even when only one child exists, which wastes memory on sparse tries', 'It cannot mark word ends', 'It breaks the O(L) lookup guarantee'],
        answerIndex: 1,
        explanation: 'The array is faster per step but pays 26 slots per node. On a sparse dictionary that is mostly empty space, and it also breaks the moment the input has capitals or digits.',
      },
    ],
    sources: [
      'CP-Algorithms: Trie, and the Aho-Corasick automaton built on top of it',
      'USACO Guide: Tries (Gold and Platinum sections)',
      'CLRS: multiway and radix tree material behind prefix trees',
      'CSES Competitive Programmers Handbook: string processing chapter',
      'LeetCode editorials for Implement Trie, Word Search II and Maximum XOR of Two Numbers',
    ],
    patternIds: ['trie', 'dfs'],
    problems: [
      {
        id: 'longest-common-prefix',
        title: 'Longest Common Prefix',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/longest-common-prefix/',
        patternId: 'trie',
        hint: 'Insert all words, then walk down from the root while each node has exactly one child and is not a word end.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'implement-trie-prefix-tree',
        title: 'Implement Trie (Prefix Tree)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
        patternId: 'trie',
        hint: 'Each node holds a children map and an is_end flag; search and startsWith share the same walk.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'design-add-and-search-words-data-structure',
        title: 'Design Add and Search Words Data Structure',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
        patternId: 'trie',
        hint: 'When the character is ".", recursively search every child at that depth.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'replace-words',
        title: 'Replace Words',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/replace-words/',
        patternId: 'trie',
        hint: 'Put the roots in a trie; for each word, walk until you hit the first is_end node and cut there.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'maximum-xor-of-two-numbers-in-an-array',
        title: 'Maximum XOR of Two Numbers in an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/',
        patternId: 'trie',
        hint: 'Insert each number as 32 bits into a binary trie, then for each number walk preferring the opposite bit.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'word-search-ii',
        title: 'Word Search II',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/word-search-ii/',
        patternId: 'trie',
        hint: 'Build a trie from the words and DFS the board while moving through the trie; stop when the current node has no matching child.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },
]
