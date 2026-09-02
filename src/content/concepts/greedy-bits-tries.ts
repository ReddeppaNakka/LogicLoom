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
      },
      {
        id: 'jump-game',
        title: 'Jump Game',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/jump-game/',
        patternId: 'greedy',
        hint: 'Keep the furthest index you can reach; if you ever stand past it, you are stuck.',
        xp: 40,
      },
      {
        id: 'gas-station',
        title: 'Gas Station',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/gas-station/',
        patternId: 'greedy',
        hint: 'If the tank goes negative at station i, no start between the last reset and i can work, so restart at i + 1.',
        xp: 40,
      },
      {
        id: 'jump-game-ii',
        title: 'Jump Game II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/jump-game-ii/',
        patternId: 'greedy',
        hint: 'Treat each jump as a window: track the end of the current window and the furthest reach inside it.',
        xp: 40,
      },
      {
        id: 'partition-labels',
        title: 'Partition Labels',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/partition-labels/',
        patternId: 'greedy',
        hint: 'Record the last index of every letter, then extend the current partition until you pass every last index inside it.',
        xp: 40,
      },
      {
        id: 'hand-of-straights',
        title: 'Hand of Straights',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/hand-of-straights/',
        patternId: 'greedy',
        hint: 'Always start a group from the smallest remaining card; count cards in a map and consume runs.',
        xp: 40,
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
      },
      {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/merge-intervals/',
        patternId: 'merge-intervals',
        hint: 'Sort by start; compare each interval only with the last one in your result list.',
        xp: 40,
      },
      {
        id: 'insert-interval',
        title: 'Insert Interval',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/insert-interval/',
        patternId: 'merge-intervals',
        hint: 'Copy intervals that end before the new one, merge everything that overlaps, then copy the rest.',
        xp: 40,
      },
      {
        id: 'non-overlapping-intervals',
        title: 'Non-overlapping Intervals',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/non-overlapping-intervals/',
        patternId: 'greedy',
        hint: 'Sort by end time and always keep the interval that finishes earliest; count the ones you must drop.',
        xp: 40,
      },
      {
        id: 'minimum-number-of-arrows-to-burst-balloons',
        title: 'Minimum Number of Arrows to Burst Balloons',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/',
        patternId: 'greedy',
        hint: 'Sort by end; shoot an arrow at the end of the first balloon and skip every balloon that starts before it.',
        xp: 40,
      },
      {
        id: 'interval-list-intersections',
        title: 'Interval List Intersections',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/interval-list-intersections/',
        patternId: 'merge-intervals',
        hint: 'Use two pointers; the intersection is [max of starts, min of ends], then advance whichever interval ends first.',
        xp: 40,
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
      },
      {
        id: 'single-number',
        title: 'Single Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/single-number/',
        patternId: 'bit-manipulation',
        hint: 'XOR every element together; pairs cancel to zero.',
        xp: 20,
      },
      {
        id: 'counting-bits',
        title: 'Counting Bits',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/counting-bits/',
        patternId: 'bit-manipulation',
        hint: 'bits[i] = bits[i >> 1] + (i & 1); reuse the answer for the number with the last bit removed.',
        xp: 20,
      },
      {
        id: 'reverse-bits',
        title: 'Reverse Bits',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/reverse-bits/',
        patternId: 'bit-manipulation',
        hint: 'Loop 32 times: shift the result left, add the lowest bit of n, shift n right.',
        xp: 20,
      },
      {
        id: 'missing-number',
        title: 'Missing Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/missing-number/',
        patternId: 'bit-manipulation',
        hint: 'XOR all indices 0..n together with all values; everything cancels except the missing one.',
        xp: 20,
      },
      {
        id: 'sum-of-two-integers',
        title: 'Sum of Two Integers',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sum-of-two-integers/',
        patternId: 'bit-manipulation',
        hint: 'a ^ b is the sum without carries and (a & b) << 1 is the carries; repeat until the carry is zero (mask to 32 bits in Python).',
        xp: 40,
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
      },
      {
        id: 'implement-trie-prefix-tree',
        title: 'Implement Trie (Prefix Tree)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
        patternId: 'trie',
        hint: 'Each node holds a children map and an is_end flag; search and startsWith share the same walk.',
        xp: 40,
      },
      {
        id: 'design-add-and-search-words-data-structure',
        title: 'Design Add and Search Words Data Structure',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
        patternId: 'trie',
        hint: 'When the character is ".", recursively search every child at that depth.',
        xp: 40,
      },
      {
        id: 'replace-words',
        title: 'Replace Words',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/replace-words/',
        patternId: 'trie',
        hint: 'Put the roots in a trie; for each word, walk until you hit the first is_end node and cut there.',
        xp: 40,
      },
      {
        id: 'maximum-xor-of-two-numbers-in-an-array',
        title: 'Maximum XOR of Two Numbers in an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/',
        patternId: 'trie',
        hint: 'Insert each number as 32 bits into a binary trie, then for each number walk preferring the opposite bit.',
        xp: 40,
      },
      {
        id: 'word-search-ii',
        title: 'Word Search II',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/word-search-ii/',
        patternId: 'trie',
        hint: 'Build a trie from the words and DFS the board while moving through the trie; stop when the current node has no matching child.',
        xp: 80,
      },
    ],
  },
]
