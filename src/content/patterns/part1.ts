import type { Pattern } from '../types'

export const patterns: Pattern[] = [
  // -------------------------------------------------------------------------
  // 1. Brute force
  // -------------------------------------------------------------------------
  {
    id: 'brute-force',
    name: 'Brute Force',
    tagline: 'Try every possibility. Slow, but always a correct starting point.',
    triggers: [
      'small input size (n <= 20)',
      'find all pairs / triplets',
      'no obvious structure in the input',
      'you have no idea where to start',
      'check every subarray',
      'return any valid answer',
    ],
    avoidWhen: [
      'n is 10^5 or more and you need O(n log n) or better',
      'the input is sorted (binary search or two pointers is waiting)',
      'the problem asks for "the best" among a huge number of choices',
    ],
    explanation: `Brute force means: list every possible candidate and check each one. It is the honest, slow way. It is also where every good solution starts, because you cannot make something faster until you know what "correct" looks like.

## The idea
- Ask: what are ALL the things that could be an answer? (every pair, every subarray, every index...)
- Loop over all of them.
- Keep the one that satisfies the rule.

## A tiny example
Problem: in \`[2, 7, 11, 15]\` find two numbers that add to 9.
- Try (2,7) = 9. Found it.
- If it had not worked we would try (2,11), (2,15), (7,11), (7,15), (11,15).
- That is n*(n-1)/2 pairs, which is O(n^2). For n = 4 that is 6 checks. For n = 100,000 it is 5 billion. Too slow.

## Step by step
1. Write the brute force in your head or on paper in under 2 minutes.
2. Say its complexity out loud: "this is O(n^2) because two nested loops".
3. Look at the wasted work. In the example above we re-scan the array for every number. A hash map (see Hash Map pattern) removes that re-scan and gives O(n).
4. Only then optimise.

## Where people go wrong
- Skipping brute force entirely and freezing, because the "clever" idea will not come.
- Writing brute force and forgetting to say why it is slow. Interviewers want to hear the complexity.
- Believing brute force is always wrong. When n <= 20, trying all 2^20 subsets (about one million) is totally fine.

## How to recognise it in an interview
If the constraints are tiny, or the problem says "return any valid answer", brute force may be the whole solution. If constraints are big, brute force is step one and the pattern you upgrade to is step two.`,
    time: 'O(n^2) or worse, depends on how many candidates exist',
    space: 'O(1) usually',
    template: {
      python: `def brute_force(nums, target):
    n = len(nums)
    # Candidate space: every pair (i, j) with i < j
    for i in range(n):
        for j in range(i + 1, n):
            # Check the rule for this candidate
            if nums[i] + nums[j] == target:
                return [i, j]
    return []  # no candidate worked`,
      javascript: `function bruteForce(nums, target) {
  const n = nums.length;
  // Candidate space: every pair (i, j) with i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check the rule for this candidate
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return []; // no candidate worked
}`,
      java: `int[] bruteForce(int[] nums, int target) {
  int n = nums.length;
  // Candidate space: every pair (i, j) with i < j
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      // Check the rule for this candidate
      if (nums[i] + nums[j] == target) return new int[]{i, j};
    }
  }
  return new int[]{}; // no candidate worked
}`,
      cpp: `vector<int> bruteForce(vector<int>& nums, int target) {
  int n = nums.size();
  // Candidate space: every pair (i, j) with i < j
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      // Check the rule for this candidate
      if (nums[i] + nums[j] == target) return {i, j};
    }
  }
  return {}; // no candidate worked
}`,
    },
    relatedGateIds: ['complexity', 'arrays-strings'],
    exampleProblemIds: ['two-sum', 'best-time-to-buy-and-sell-stock', 'maximum-subarray', 'contains-duplicate'],
  },

  // -------------------------------------------------------------------------
  // 2. Recursion
  // -------------------------------------------------------------------------
  {
    id: 'recursion',
    name: 'Recursion',
    tagline: 'A function that solves a big problem by calling itself on a smaller one.',
    triggers: [
      'the structure is nested (trees, folders, brackets)',
      'defined in terms of itself (fibonacci, factorial)',
      'reverse / print a linked list or string',
      'generate all combinations',
      'the problem shrinks by one each step',
    ],
    avoidWhen: [
      'depth could reach 10^5 (Python recursion limit is about 1000)',
      'a simple loop does the same job',
      'the same sub-problem repeats many times (use memoisation / DP)',
    ],
    explanation: `Recursion is when a function calls itself with a smaller input. It feels like magic at first, but it is just a loop written in a different shape. You need two parts: a base case (the tiny input you can answer directly) and a recursive case (shrink the input and trust the function to handle the rest).

## The idea
- Base case: "if the list is empty, the sum is 0".
- Recursive case: "otherwise the sum is the first item plus the sum of the rest".
- The computer keeps a stack of unfinished calls and unwinds them when the base case is hit.

## A tiny example
\`sum([3, 1, 2])\`
- sum([3,1,2]) = 3 + sum([1,2])
- sum([1,2]) = 1 + sum([2])
- sum([2]) = 2 + sum([])
- sum([]) = 0  (base case)
- Now unwind: 2 + 0 = 2, then 1 + 2 = 3, then 3 + 3 = 6.

## Step by step
1. Write the base case FIRST. Ask: what is the smallest input, and what is its answer?
2. Write the recursive case. Shrink the input by one step (drop an item, move to a child node, subtract 1).
3. Check that every call moves toward the base case, or you get infinite recursion.
4. Count the calls to get complexity. One call per item = O(n). Two calls per item without memo = O(2^n).

## Where people go wrong
- Forgetting the base case. The program crashes with "maximum recursion depth exceeded".
- Calling the function on the SAME input instead of a smaller one.
- Ignoring the memory cost: each pending call uses stack space, so depth n costs O(n) space.

## How to recognise it in an interview
If the data is a tree, a linked list, or anything "defined in terms of itself", think recursion. If you see the same sub-problem being solved twice, this pattern grows into Dynamic Programming.`,
    time: 'O(number of calls) - O(n) for one call per step, O(2^n) for two calls without memo',
    space: 'O(depth) for the call stack',
    template: {
      python: `def solve(n):
    # 1. Base case: the smallest input you can answer directly
    if n <= 0:
        return 0
    # 2. Recursive case: shrink the problem and trust the function
    smaller = solve(n - 1)
    # 3. Combine the smaller answer with the current step
    return n + smaller`,
      javascript: `function solve(n) {
  // 1. Base case: the smallest input you can answer directly
  if (n <= 0) return 0;
  // 2. Recursive case: shrink the problem and trust the function
  const smaller = solve(n - 1);
  // 3. Combine the smaller answer with the current step
  return n + smaller;
}`,
      java: `int solve(int n) {
  // 1. Base case: the smallest input you can answer directly
  if (n <= 0) return 0;
  // 2. Recursive case: shrink the problem and trust the function
  int smaller = solve(n - 1);
  // 3. Combine the smaller answer with the current step
  return n + smaller;
}`,
      cpp: `int solve(int n) {
  // 1. Base case: the smallest input you can answer directly
  if (n <= 0) return 0;
  // 2. Recursive case: shrink the problem and trust the function
  int smaller = solve(n - 1);
  // 3. Combine the smaller answer with the current step
  return n + smaller;
}`,
    },
    relatedGateIds: ['recursion-backtracking', 'complexity', 'trees'],
    exampleProblemIds: ['fibonacci-number', 'reverse-string', 'powx-n', 'reverse-linked-list', 'maximum-depth-of-binary-tree'],
  },

  // -------------------------------------------------------------------------
  // 3. Two pointers
  // -------------------------------------------------------------------------
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    tagline: 'Walk two indexes toward each other (or in step) so you never re-scan.',
    triggers: [
      'sorted array',
      'pair with a target sum',
      'palindrome check',
      'remove duplicates in place',
      'move zeroes / partition',
      'container with most water',
      'compare from both ends',
    ],
    avoidWhen: [
      'the array is unsorted and sorting is not allowed (use a hash map)',
      'you need indexes of the original order after sorting',
      'the answer needs subarrays rather than pairs (that is sliding window)',
    ],
    explanation: `Two pointers means keeping two indexes into the same array and moving them according to a rule. Because each pointer only moves in one direction, the total work is O(n) instead of O(n^2). It is the most common trick for sorted arrays and strings.

## The idea
- Put \`left\` at the start and \`right\` at the end (or both at the start).
- Look at the two values. Decide which pointer to move based on what you see.
- Stop when they meet or cross.

## A tiny example
Find two numbers in sorted \`[1, 3, 4, 6, 8]\` that add to 10.
- left=1, right=8: sum 9, too small, so move left up. left=3.
- left=3, right=8: sum 11, too big, so move right down. right=6.
- left=3, right=6: sum 9, too small. left=4.
- left=4, right=6: sum 10. Done in 4 steps instead of 10 pair checks.

The reason this works: if the sum is too small, no pair using the current left can ever be big enough, so left is finished. Each step throws away a whole pointer's worth of candidates.

## Step by step
1. Confirm the array is sorted, or sort it if allowed (O(n log n)).
2. Decide the layout: opposite ends (sums, palindromes) or same direction (remove duplicates, slow/fast writer).
3. Write the loop \`while left < right\` and inside it the rule for moving one pointer.
4. Handle duplicates if the problem wants unique answers (skip equal neighbours).

## Where people go wrong
- Moving both pointers at the same time when only one should move.
- Using it on an unsorted array and getting wrong answers.
- Off-by-one on the stopping condition: \`<\` versus \`<=\`.

## How to recognise it in an interview
Words like "sorted", "pair", "palindrome", "in place", or "from both ends" are strong hints. If the brute force is "check every pair", ask whether sorting would let the pointers make the decision.`,
    time: 'O(n), or O(n log n) if you must sort first',
    space: 'O(1)',
    template: {
      python: `def two_pointers(nums, target):
    nums.sort()  # skip if already sorted
    left, right = 0, len(nums) - 1
    while left < right:
        current = nums[left] + nums[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1   # need a bigger sum
        else:
            right -= 1  # need a smaller sum
    return []`,
      javascript: `function twoPointers(nums, target) {
  nums.sort((a, b) => a - b); // skip if already sorted
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const current = nums[left] + nums[right];
    if (current === target) return [left, right];
    if (current < target) left++;   // need a bigger sum
    else right--;                    // need a smaller sum
  }
  return [];
}`,
      java: `int[] twoPointers(int[] nums, int target) {
  Arrays.sort(nums); // skip if already sorted
  int left = 0, right = nums.length - 1;
  while (left < right) {
    int current = nums[left] + nums[right];
    if (current == target) return new int[]{left, right};
    if (current < target) left++;   // need a bigger sum
    else right--;                    // need a smaller sum
  }
  return new int[]{};
}`,
      cpp: `vector<int> twoPointers(vector<int>& nums, int target) {
  sort(nums.begin(), nums.end()); // skip if already sorted
  int left = 0, right = nums.size() - 1;
  while (left < right) {
    int current = nums[left] + nums[right];
    if (current == target) return {left, right};
    if (current < target) left++;   // need a bigger sum
    else right--;                    // need a smaller sum
  }
  return {};
}`,
    },
    relatedGateIds: ['arrays-strings', 'searching-sorting'],
    exampleProblemIds: ['two-sum-ii-input-array-is-sorted', 'valid-palindrome', 'container-with-most-water', '3sum', 'move-zeroes', 'trapping-rain-water'],
  },

  // -------------------------------------------------------------------------
  // 4. Sliding window
  // -------------------------------------------------------------------------
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    tagline: 'Keep a moving range over the array and update it instead of recomputing.',
    triggers: [
      'contiguous subarray',
      'substring',
      'longest / shortest with at most k',
      'window of size k',
      'without repeating characters',
      'maximum sum of k consecutive',
      'minimum length subarray with sum >= target',
    ],
    avoidWhen: [
      'elements can be negative and you are tracking a sum condition (window logic breaks)',
      'the subsequence does not need to be contiguous',
      'you need the best subarray by sum with negatives (use Kadane or prefix sums)',
    ],
    explanation: `A sliding window is a range \`[left, right]\` over an array or string. You grow the window by moving \`right\`, and when the window breaks a rule you shrink it by moving \`left\`. Because both ends only move forward, you touch each element about twice. That is O(n) instead of the O(n^2) or O(n^3) of checking every subarray.

## The idea
- Keep some running info about the window: a sum, a count, or a dict of characters.
- Add the new right element to that info.
- While the window is invalid, remove the left element and move left forward.
- After each step, the window is valid, so record the answer.

## A tiny example
Longest substring without repeating characters in \`"abcabcbb"\`.
- Add a, b, c. Window "abc", length 3. Best = 3.
- Add a. Now 'a' appears twice. Shrink: remove left 'a'. Window "bca". Length 3.
- Add b. Duplicate 'b'. Shrink: remove 'b'. Window "cab".
- Add c. Duplicate. Shrink: remove 'c'. Window "abc".
- Add b, then b again, shrinking each time. Best stays 3.
We walked the string once. The dict told us instantly whether the window was valid.

## Step by step
1. Decide if the window is fixed size (exactly k) or variable size (at most / at least).
2. Pick the tracking structure: an integer for sums, a dict or array of 26 for characters.
3. Loop right from 0 to n-1. Add nums[right].
4. While invalid: remove nums[left], left += 1.
5. Update the best answer with the current window size.

## Where people go wrong
- Recomputing the whole window sum each step. That brings back O(n*k).
- Using \`if\` instead of \`while\` for shrinking. Sometimes you need to shrink several times.
- Applying it with negative numbers and a sum target. The "shrink when too big" logic fails there.

## How to recognise it in an interview
"Contiguous", "substring", "subarray", "longest", "shortest", "at most k", "exactly k in a row". If the brute force is "try every start and end", sliding window is likely the upgrade.`,
    time: 'O(n)',
    space: 'O(k) for the window tracking structure, often O(1) or O(26)',
    template: {
      python: `def sliding_window(s):
    seen = {}       # info about the current window
    left = 0
    best = 0
    for right in range(len(s)):
        ch = s[right]
        seen[ch] = seen.get(ch, 0) + 1      # add right element
        while seen[ch] > 1:                 # window invalid?
            seen[s[left]] -= 1              # remove left element
            left += 1
        best = max(best, right - left + 1)  # window is valid here
    return best`,
      javascript: `function slidingWindow(s) {
  const seen = new Map(); // info about the current window
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    seen.set(ch, (seen.get(ch) || 0) + 1);     // add right element
    while (seen.get(ch) > 1) {                 // window invalid?
      seen.set(s[left], seen.get(s[left]) - 1); // remove left element
      left++;
    }
    best = Math.max(best, right - left + 1);   // window is valid here
  }
  return best;
}`,
      java: `int slidingWindow(String s) {
  Map<Character, Integer> seen = new HashMap<>(); // window info
  int left = 0, best = 0;
  for (int right = 0; right < s.length(); right++) {
    char ch = s.charAt(right);
    seen.merge(ch, 1, Integer::sum);             // add right element
    while (seen.get(ch) > 1) {                   // window invalid?
      seen.merge(s.charAt(left), -1, Integer::sum); // remove left
      left++;
    }
    best = Math.max(best, right - left + 1);     // window is valid here
  }
  return best;
}`,
      cpp: `int slidingWindow(const string& s) {
  unordered_map<char, int> seen; // info about the current window
  int left = 0, best = 0;
  for (int right = 0; right < (int)s.size(); right++) {
    char ch = s[right];
    seen[ch]++;                                // add right element
    while (seen[ch] > 1) {                     // window invalid?
      seen[s[left]]--;                         // remove left element
      left++;
    }
    best = max(best, right - left + 1);        // window is valid here
  }
  return best;
}`,
    },
    relatedGateIds: ['arrays-strings', 'stacks-queues', 'hashing'],
    exampleProblemIds: ['longest-substring-without-repeating-characters', 'minimum-size-subarray-sum', 'best-time-to-buy-and-sell-stock', 'sliding-window-maximum'],
  },

  // -------------------------------------------------------------------------
  // 5. Prefix sum
  // -------------------------------------------------------------------------
  {
    id: 'prefix-sum',
    name: 'Prefix Sum',
    tagline: 'Precompute running totals so any range sum is one subtraction.',
    triggers: [
      'sum of a range [i, j]',
      'many range queries',
      'subarray sum equals k',
      'count subarrays with sum',
      'array does not change',
      'product of array except self',
    ],
    avoidWhen: [
      'the array is updated between queries (use a Fenwick / segment tree)',
      'you only need one range sum (a plain loop is fine)',
      'the condition is not additive (max in range is not a prefix sum problem)',
    ],
    explanation: `A prefix sum array stores, at index i, the total of everything before i. Once you have it, the sum of any range is \`prefix[j+1] - prefix[i]\`, computed in O(1). You pay O(n) once and then every query is instant.

## The idea
- Build \`prefix\` of length n+1 with prefix[0] = 0.
- prefix[i+1] = prefix[i] + nums[i].
- Range sum from i to j (inclusive) = prefix[j+1] - prefix[i].

## A tiny example
nums = \`[2, 4, 1, 3]\`
- prefix = \`[0, 2, 6, 7, 10]\`
- Sum of nums[1..2] (4 + 1) = prefix[3] - prefix[1] = 7 - 2 = 5. Correct.
- Sum of nums[0..3] = prefix[4] - prefix[0] = 10.

## The powerful twist: prefix sum + hash map
"Count subarrays with sum = k" looks like it needs every (i, j) pair. But a subarray ending at j has sum k exactly when \`prefix[j+1] - k\` equals some earlier prefix. So walk once, keep a dict of "how many times have I seen this prefix value", and for each position add \`count[prefix - k]\` to the answer.

For nums = [1, 1, 1], k = 2: prefixes are 0,1,2,3. At prefix 2 we look for 0 (seen once). At prefix 3 we look for 1 (seen once). Answer 2.

## Step by step
1. Build the prefix array with the extra leading 0. That zero avoids special cases.
2. For fixed queries, answer each with one subtraction.
3. For "count subarrays with property", turn the property into "prefix[j] - prefix[i] == k" and use a dict.

## Where people go wrong
- Forgetting the leading 0, then getting the first range wrong.
- Off-by-one: the range i..j uses prefix[j+1], not prefix[j].
- Using it with the array changing. Every update would rebuild the prefix in O(n).

## How to recognise it in an interview
"Range", "between indexes", "subarray sum", "many queries on a fixed array". The same idea works for prefix products, prefix XOR, and prefix counts of a character.`,
    time: 'O(n) to build, O(1) per range query',
    space: 'O(n)',
    template: {
      python: `def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)   # extra leading zero
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x
    return prefix

def range_sum(prefix, i, j):
    # sum of nums[i..j] inclusive
    return prefix[j + 1] - prefix[i]

def count_subarrays_with_sum(nums, k):
    seen = {0: 1}   # prefix value -> how many times seen
    running, count = 0, 0
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count`,
      javascript: `function buildPrefix(nums) {
  const prefix = new Array(nums.length + 1).fill(0); // leading zero
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;
}

function rangeSum(prefix, i, j) {
  return prefix[j + 1] - prefix[i]; // sum of nums[i..j] inclusive
}

function countSubarraysWithSum(nums, k) {
  const seen = new Map([[0, 1]]); // prefix value -> times seen
  let running = 0, count = 0;
  for (const x of nums) {
    running += x;
    count += seen.get(running - k) || 0;
    seen.set(running, (seen.get(running) || 0) + 1);
  }
  return count;
}`,
      java: `int[] buildPrefix(int[] nums) {
  int[] prefix = new int[nums.length + 1]; // leading zero
  for (int i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;
}

int rangeSum(int[] prefix, int i, int j) {
  return prefix[j + 1] - prefix[i]; // sum of nums[i..j] inclusive
}

int countSubarraysWithSum(int[] nums, int k) {
  Map<Integer, Integer> seen = new HashMap<>(); // prefix -> times seen
  seen.put(0, 1);
  int running = 0, count = 0;
  for (int x : nums) {
    running += x;
    count += seen.getOrDefault(running - k, 0);
    seen.merge(running, 1, Integer::sum);
  }
  return count;
}`,
      cpp: `vector<int> buildPrefix(const vector<int>& nums) {
  vector<int> prefix(nums.size() + 1, 0); // leading zero
  for (size_t i = 0; i < nums.size(); i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;
}

int rangeSum(const vector<int>& prefix, int i, int j) {
  return prefix[j + 1] - prefix[i]; // sum of nums[i..j] inclusive
}

int countSubarraysWithSum(const vector<int>& nums, int k) {
  unordered_map<int, int> seen; // prefix -> times seen
  seen[0] = 1;
  int running = 0, count = 0;
  for (int x : nums) {
    running += x;
    if (seen.count(running - k)) count += seen[running - k];
    seen[running]++;
  }
  return count;
}`,
    },
    relatedGateIds: ['arrays-strings', 'hashing'],
    exampleProblemIds: ['range-sum-query-immutable', 'subarray-sum-equals-k', 'product-of-array-except-self', 'contiguous-array'],
  },

  // -------------------------------------------------------------------------
  // 6. Kadane
  // -------------------------------------------------------------------------
  {
    id: 'kadane',
    name: "Kadane's Algorithm",
    tagline: 'Best subarray sum in one pass: keep it if it helps, restart if it hurts.',
    triggers: [
      'maximum subarray sum',
      'contiguous subarray with largest sum',
      'array contains negative numbers',
      'maximum product subarray',
      'best time to buy and sell (single transaction)',
      'circular subarray',
    ],
    avoidWhen: [
      'the subarray must have a fixed length k (use sliding window)',
      'you need all subarrays above a threshold, not just the best',
      'the "sum" is not additive along the array',
    ],
    explanation: `Kadane's algorithm finds the contiguous subarray with the biggest sum in a single pass. The trick is a simple question at each element: is it better to extend the previous run, or to start fresh here? If the run so far is negative, it can only drag the next number down, so throw it away.

## The idea
- Keep \`current\`: the best sum of a subarray that ENDS at this position.
- current = max(nums[i], current + nums[i]).
- Keep \`best\`: the largest current seen so far.

## A tiny example
nums = \`[-2, 1, -3, 4, -1, 2, 1, -5, 4]\`
- -2: current = -2, best = -2
- 1: current = max(1, -2+1) = 1, best = 1
- -3: current = max(-3, 1-3) = -2, best = 1
- 4: current = max(4, -2+4) = 4, best = 4  (we restarted here)
- -1: current = 3, best = 4
- 2: current = 5, best = 5
- 1: current = 6, best = 6
- -5: current = 1, best = 6
- 4: current = 5, best = 6
Answer 6, from subarray [4, -1, 2, 1]. One pass, O(n). The brute force of trying every start and end is O(n^2).

## Step by step
1. Initialise current and best to nums[0], not to 0. If all numbers are negative, 0 would be wrong.
2. Loop from index 1. Apply the max formula.
3. If the problem asks for the subarray itself, record the start index whenever you restart and the end index whenever best improves.

## Where people go wrong
- Starting best at 0 and returning 0 for an all-negative array.
- Confusing "sum so far" with "best ending here". The reset to nums[i] is the whole point.
- For maximum PRODUCT, forgetting that a negative times a negative is positive. Track both max and min ending here.

## How to recognise it in an interview
"Maximum sum of a contiguous subarray" is Kadane by name. Stock problems (buy once, sell once) are Kadane on the daily differences. The idea generalises to any "best run ending here" DP.`,
    time: 'O(n)',
    space: 'O(1)',
    template: {
      python: `def kadane(nums):
    current = nums[0]   # best sum of a subarray ending here
    best = nums[0]      # best sum seen anywhere
    for i in range(1, len(nums)):
        # extend the run, or start fresh at nums[i]
        current = max(nums[i], current + nums[i])
        best = max(best, current)
    return best`,
      javascript: `function kadane(nums) {
  let current = nums[0]; // best sum of a subarray ending here
  let best = nums[0];    // best sum seen anywhere
  for (let i = 1; i < nums.length; i++) {
    // extend the run, or start fresh at nums[i]
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}`,
      java: `int kadane(int[] nums) {
  int current = nums[0]; // best sum of a subarray ending here
  int best = nums[0];    // best sum seen anywhere
  for (int i = 1; i < nums.length; i++) {
    // extend the run, or start fresh at nums[i]
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}`,
      cpp: `int kadane(const vector<int>& nums) {
  int current = nums[0]; // best sum of a subarray ending here
  int best = nums[0];    // best sum seen anywhere
  for (size_t i = 1; i < nums.size(); i++) {
    // extend the run, or start fresh at nums[i]
    current = max(nums[i], current + nums[i]);
    best = max(best, current);
  }
  return best;
}`,
    },
    relatedGateIds: ['arrays-strings', 'dynamic-programming'],
    exampleProblemIds: ['maximum-subarray', 'best-time-to-buy-and-sell-stock', 'maximum-product-subarray', 'maximum-sum-circular-subarray'],
  },

  // -------------------------------------------------------------------------
  // 7. Binary search
  // -------------------------------------------------------------------------
  {
    id: 'binary-search',
    name: 'Binary Search',
    tagline: 'Throw away half the sorted input every step.',
    triggers: [
      'sorted array',
      'find the position of target',
      'first / last occurrence',
      'rotated sorted array',
      'O(log n) required',
      'insert position',
      'peak element',
    ],
    avoidWhen: [
      'the input is unsorted and has no monotonic structure',
      'the array is tiny (a linear scan is simpler and fine)',
      'you need every match, not just one position',
    ],
    explanation: `Binary search finds something in a sorted array by looking at the middle, deciding which half the answer must be in, and ignoring the other half. Each step halves the search space, so a million items take about 20 steps. That is O(log n) versus O(n) for a linear scan.

## The idea
- Keep \`lo\` and \`hi\` as the edges of where the answer could be.
- mid = (lo + hi) // 2. Compare nums[mid] with the target.
- Too small: the answer is right of mid, so lo = mid + 1.
- Too big: the answer is left of mid, so hi = mid - 1.
- Stop when lo > hi.

## A tiny example
Find 7 in \`[1, 3, 5, 7, 9, 11]\`.
- lo=0, hi=5, mid=2, nums[2]=5 < 7 so lo=3.
- lo=3, hi=5, mid=4, nums[4]=9 > 7 so hi=3.
- lo=3, hi=3, mid=3, nums[3]=7. Found at index 3 in 3 steps.
A linear scan would take 4 steps here, but for 1,000,000 items it takes up to 1,000,000 versus 20.

## Step by step
1. Confirm the array is sorted, or that some yes/no condition is "false false false true true true" along the array. That monotonic shape is all you need.
2. Write lo = 0, hi = n - 1.
3. Loop while lo <= hi. Compute mid, compare, move one edge.
4. For "first occurrence", do not return on equal. Record mid and set hi = mid - 1 to keep searching left.

## Where people go wrong
- Infinite loop when using lo = mid instead of lo = mid + 1.
- Mixing up \`lo <= hi\` with \`lo < hi\`. Pick one style and keep it consistent.
- Forgetting the array might be rotated. Then check which half is sorted before deciding.

## How to recognise it in an interview
"Sorted", "log n", "find first/last", "rotated". If you can answer "is the answer to the left or right of this index?" in O(1), binary search applies.`,
    time: 'O(log n)',
    space: 'O(1)',
    template: {
      python: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1   # answer is to the right
        else:
            hi = mid - 1   # answer is to the left
    return -1  # not found; lo is the insert position`,
      javascript: `function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; // answer is to the right
    else hi = mid - 1;                     // answer is to the left
  }
  return -1; // not found; lo is the insert position
}`,
      java: `int binarySearch(int[] nums, int target) {
  int lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2; // avoids int overflow
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1; // answer is to the right
    else hi = mid - 1;                     // answer is to the left
  }
  return -1; // not found; lo is the insert position
}`,
      cpp: `int binarySearch(const vector<int>& nums, int target) {
  int lo = 0, hi = (int)nums.size() - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2; // avoids int overflow
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1; // answer is to the right
    else hi = mid - 1;                     // answer is to the left
  }
  return -1; // not found; lo is the insert position
}`,
    },
    relatedGateIds: ['searching-sorting'],
    exampleProblemIds: ['binary-search', 'search-insert-position', 'search-in-rotated-sorted-array', 'find-minimum-in-rotated-sorted-array', 'find-first-and-last-position-of-element-in-sorted-array'],
  },

  // -------------------------------------------------------------------------
  // 8. Binary search on answer
  // -------------------------------------------------------------------------
  {
    id: 'binary-search-on-answer',
    name: 'Binary Search on the Answer',
    tagline: 'Guess the answer, check if it works, then halve the guess range.',
    triggers: [
      'minimum speed / capacity / time such that',
      'maximise the minimum',
      'minimise the maximum',
      'smallest k that satisfies',
      'within d days',
      'answer is a number in a known range',
    ],
    avoidWhen: [
      'the check "does answer x work?" is not monotonic',
      'the answer range is huge and the check is expensive (log range * check must fit)',
      'the answer is an arrangement, not a number',
    ],
    explanation: `Sometimes the input is not sorted, but the ANSWER is. Ask "does answer x work?". If a bigger x always works whenever x works (or the reverse), the answers form a "no no no yes yes yes" line. Binary search that line. You do not search the array; you search the space of possible answers.

## The idea
- Find the smallest possible answer \`lo\` and the largest \`hi\`.
- Write a function \`works(x)\` that returns True or False in O(n).
- Binary search for the first x where works(x) is True.

## A tiny example
Koko eats bananas. Piles \`[3, 6, 7, 11]\`, she has 8 hours. Minimum eating speed?
- Speed range: lo=1, hi=11 (the biggest pile).
- Try speed 6: hours = 1+1+2+2 = 6 <= 8. Works. Try smaller: hi=5.
- Try speed 3: hours = 1+2+3+4 = 10 > 8. Fails. lo=4.
- Try speed 4: hours = 1+2+2+3 = 8 <= 8. Works. hi=3.
- lo > hi, stop. Answer 4.
Four checks of O(n) each. Trying every speed from 1 to 11 would be 11 checks; for a max pile of 10^9 it would be a billion.

## Step by step
1. Spot the words "minimum X such that..." or "maximum X such that...".
2. Define works(x) for a single guess. This is usually a greedy simulation.
3. Confirm monotonic: if speed 6 works, speed 7 also works.
4. Binary search on [lo, hi], keeping the best valid guess.

## Where people go wrong
- Bad bounds. lo must be the smallest legal value (often 1 or max(nums)), hi the largest (often sum(nums) or max(nums)).
- A works() that is not monotonic. Then the search can skip the real answer.
- Returning mid instead of the best recorded valid guess.

## How to recognise it in an interview
"Minimum speed", "least capacity", "smallest divisor", "split array to minimise the largest sum", "allocate books". If you can check a guess quickly and the answer is a number between two limits, this is it.`,
    time: 'O(n log(range)) where range is hi - lo',
    space: 'O(1)',
    template: {
      python: `def works(x, data):
    # Return True if answer x is good enough.
    # Usually a greedy pass over data in O(n).
    return True

def search_answer(data, lo, hi):
    best = -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if works(mid, data):
            best = mid        # mid is valid, try smaller
            hi = mid - 1
        else:
            lo = mid + 1      # mid too small, go bigger
    return best`,
      javascript: `function works(x, data) {
  // Return true if answer x is good enough.
  // Usually a greedy pass over data in O(n).
  return true;
}

function searchAnswer(data, lo, hi) {
  let best = -1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (works(mid, data)) {
      best = mid;    // mid is valid, try smaller
      hi = mid - 1;
    } else {
      lo = mid + 1;  // mid too small, go bigger
    }
  }
  return best;
}`,
      java: `boolean works(long x, int[] data) {
  // Return true if answer x is good enough.
  // Usually a greedy pass over data in O(n).
  return true;
}

long searchAnswer(int[] data, long lo, long hi) {
  long best = -1;
  while (lo <= hi) {
    long mid = lo + (hi - lo) / 2;
    if (works(mid, data)) {
      best = mid;    // mid is valid, try smaller
      hi = mid - 1;
    } else {
      lo = mid + 1;  // mid too small, go bigger
    }
  }
  return best;
}`,
      cpp: `bool works(long long x, const vector<int>& data) {
  // Return true if answer x is good enough.
  // Usually a greedy pass over data in O(n).
  return true;
}

long long searchAnswer(const vector<int>& data, long long lo, long long hi) {
  long long best = -1;
  while (lo <= hi) {
    long long mid = lo + (hi - lo) / 2;
    if (works(mid, data)) {
      best = mid;    // mid is valid, try smaller
      hi = mid - 1;
    } else {
      lo = mid + 1;  // mid too small, go bigger
    }
  }
  return best;
}`,
    },
    relatedGateIds: ['searching-sorting', 'greedy-bits-tries'],
    exampleProblemIds: ['koko-eating-bananas', 'capacity-to-ship-packages-within-d-days'],
  },

  // -------------------------------------------------------------------------
  // 9. Divide and conquer
  // -------------------------------------------------------------------------
  {
    id: 'divide-and-conquer',
    name: 'Divide and Conquer',
    tagline: 'Split the input in half, solve each half, then merge the results.',
    triggers: [
      'sort an array',
      'merge k sorted lists',
      'count inversions',
      'the problem splits cleanly into halves',
      'O(n log n) required',
      'build a balanced tree from sorted data',
    ],
    avoidWhen: [
      'the halves overlap and repeat work (that is DP territory)',
      'merging is as hard as the original problem',
      'a linear scan already solves it',
    ],
    explanation: `Divide and conquer breaks a problem into two (or more) smaller copies, solves each recursively, and combines the answers. Merge sort is the classic: split the list in half, sort each half, merge the two sorted halves. Because the depth is log n and each level does O(n) work, the total is O(n log n).

## The idea
- Divide: cut the input into halves.
- Conquer: solve each half with the same function (recursion).
- Combine: merge the two results into one.

## A tiny example
Merge sort on \`[5, 2, 4, 1]\`.
- Split into [5, 2] and [4, 1].
- Split again into [5], [2], [4], [1]. Single items are already sorted (base case).
- Merge [5] and [2] into [2, 5]. Merge [4] and [1] into [1, 4].
- Merge [2, 5] and [1, 4]: compare fronts, take the smaller each time: 1, 2, 4, 5.
The merge step walks both lists once, O(n). There are log2(4) = 2 levels. Total about n log n = 8 comparisons, versus n^2 = 16 for a naive sort.

## Step by step
1. Write the base case: size 0 or 1 returns immediately.
2. Compute mid and recurse on the left half and the right half.
3. Write the combine step. This is where the real thinking goes: it must be fast (O(n)) for the whole thing to be O(n log n).
4. Check: does the combine step use the fact that the halves are already solved? If not, you are not gaining anything.

## Where people go wrong
- A merge step that is O(n^2), which destroys the benefit.
- Forgetting that the halves must be independent. If they share sub-problems, use memoisation.
- Off-by-one on the split so one half never shrinks, causing infinite recursion.

## How to recognise it in an interview
"Sort", "merge sorted", "count pairs where i < j and ...", "kth largest" (quickselect is a cousin), "find the maximum subarray" also has a divide and conquer version. If the combine step is easy given two solved halves, this pattern fits.`,
    time: 'O(n log n) when the combine step is O(n)',
    space: 'O(n) for merge buffers, O(log n) for the recursion stack',
    template: {
      python: `def divide_and_conquer(arr):
    # Base case: nothing to split
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = divide_and_conquer(arr[:mid])    # conquer left half
    right = divide_and_conquer(arr[mid:])   # conquer right half
    return combine(left, right)

def combine(left, right):
    # Merge two sorted lists into one sorted list
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      javascript: `function divideAndConquer(arr) {
  // Base case: nothing to split
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = divideAndConquer(arr.slice(0, mid));  // conquer left
  const right = divideAndConquer(arr.slice(mid));    // conquer right
  return combine(left, right);
}

function combine(left, right) {
  // Merge two sorted arrays into one sorted array
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i), right.slice(j));
}`,
      java: `int[] divideAndConquer(int[] arr) {
  // Base case: nothing to split
  if (arr.length <= 1) return arr;
  int mid = arr.length / 2;
  int[] left = divideAndConquer(Arrays.copyOfRange(arr, 0, mid));
  int[] right = divideAndConquer(Arrays.copyOfRange(arr, mid, arr.length));
  return combine(left, right);
}

int[] combine(int[] left, int[] right) {
  // Merge two sorted arrays into one sorted array
  int[] result = new int[left.length + right.length];
  int i = 0, j = 0, k = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result[k++] = left[i++];
    else result[k++] = right[j++];
  }
  while (i < left.length) result[k++] = left[i++];
  while (j < right.length) result[k++] = right[j++];
  return result;
}`,
      cpp: `vector<int> combine(const vector<int>& left, const vector<int>& right) {
  // Merge two sorted vectors into one sorted vector
  vector<int> result;
  size_t i = 0, j = 0;
  while (i < left.size() && j < right.size()) {
    if (left[i] <= right[j]) result.push_back(left[i++]);
    else result.push_back(right[j++]);
  }
  while (i < left.size()) result.push_back(left[i++]);
  while (j < right.size()) result.push_back(right[j++]);
  return result;
}

vector<int> divideAndConquer(const vector<int>& arr) {
  // Base case: nothing to split
  if (arr.size() <= 1) return arr;
  size_t mid = arr.size() / 2;
  vector<int> left(arr.begin(), arr.begin() + mid);
  vector<int> right(arr.begin() + mid, arr.end());
  return combine(divideAndConquer(left), divideAndConquer(right));
}`,
    },
    relatedGateIds: ['searching-sorting', 'recursion-backtracking'],
    exampleProblemIds: ['sort-an-array', 'merge-k-sorted-lists', 'kth-largest-element-in-an-array', 'convert-sorted-array-to-binary-search-tree', 'count-of-smaller-numbers-after-self'],
  },

  // -------------------------------------------------------------------------
  // 10. Cyclic sort
  // -------------------------------------------------------------------------
  {
    id: 'cyclic-sort',
    name: 'Cyclic Sort',
    tagline: 'Numbers 1..n belong at index value-1. Swap each one home, then look for gaps.',
    triggers: [
      'array contains numbers from 1 to n',
      'numbers in range [0, n]',
      'find the missing number',
      'find the duplicate',
      'O(1) extra space required',
      'first missing positive',
    ],
    avoidWhen: [
      'values are not limited to a small range like 1..n',
      'you are not allowed to modify the input',
      'a hash set is allowed and simpler (O(n) space is fine)',
    ],
    explanation: `When an array holds numbers from 1 to n (or 0 to n), every number has a "home": value v belongs at index v-1. Cyclic sort walks the array once and swaps each number into its home. Afterwards, any index whose value does not match reveals a missing or duplicated number. It sorts in O(n) with no extra space, which normal sorting cannot do.

## The idea
- Stand at index i. Let v = nums[i]. Its home is index v-1.
- If v is not already home, swap nums[i] with nums[v-1]. Do NOT move i yet, because a new number just arrived at i.
- If v is home (or out of range), move to i+1.

## A tiny example
nums = \`[3, 1, 4, 2]\` (range 1..4)
- i=0: v=3, home is index 2. Swap with nums[2]=4. Now [4, 1, 3, 2].
- i=0: v=4, home is index 3. Swap with nums[3]=2. Now [2, 1, 3, 4].
- i=0: v=2, home is index 1. Swap with nums[1]=1. Now [1, 2, 3, 4].
- i=0: v=1, home. Move on. Every index is now correct.
Now if the input were [3, 1, 4, 4], after sorting we would get [1, 4, 3, 4] and index 1 holds 4 instead of 2, so 2 is missing and 4 is duplicated.

## Step by step
1. Confirm the values are in a small known range that matches the indexes.
2. Loop with a while loop over i. Compute the home index for nums[i].
3. If the value is in range and not home and the home slot holds a different value, swap. Otherwise i += 1.
4. Second pass: any index i where nums[i] != i+1 tells you the answer.

## Where people go wrong
- Using a for loop and moving i after a swap. You skip the newly arrived value.
- Infinite loop on duplicates: if nums[i] == nums[home] already, do not swap; move on.
- Forgetting to ignore values outside the range (negatives, or values > n) in "first missing positive".

## How to recognise it in an interview
"Numbers from 1 to n", "0 to n", "missing", "duplicate", "constant extra space". The moment you see "n numbers in the range 1..n", think cyclic sort.`,
    time: 'O(n)',
    space: 'O(1)',
    template: {
      python: `def cyclic_sort(nums):
    # Values are in 1..n; value v belongs at index v - 1
    i = 0
    n = len(nums)
    while i < n:
        home = nums[i] - 1
        # in range, not at home, and home holds a different value
        if 0 <= home < n and nums[i] != nums[home]:
            nums[i], nums[home] = nums[home], nums[i]  # do not move i
        else:
            i += 1
    # Second pass: index i should hold i + 1
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1   # first missing number
    return n + 1`,
      javascript: `function cyclicSort(nums) {
  // Values are in 1..n; value v belongs at index v - 1
  let i = 0;
  const n = nums.length;
  while (i < n) {
    const home = nums[i] - 1;
    // in range, not at home, and home holds a different value
    if (home >= 0 && home < n && nums[i] !== nums[home]) {
      [nums[i], nums[home]] = [nums[home], nums[i]]; // do not move i
    } else {
      i++;
    }
  }
  // Second pass: index i should hold i + 1
  for (let k = 0; k < n; k++) {
    if (nums[k] !== k + 1) return k + 1; // first missing number
  }
  return n + 1;
}`,
      java: `int cyclicSort(int[] nums) {
  // Values are in 1..n; value v belongs at index v - 1
  int i = 0, n = nums.length;
  while (i < n) {
    int home = nums[i] - 1;
    // in range, not at home, and home holds a different value
    if (home >= 0 && home < n && nums[i] != nums[home]) {
      int tmp = nums[i]; nums[i] = nums[home]; nums[home] = tmp; // keep i
    } else {
      i++;
    }
  }
  // Second pass: index k should hold k + 1
  for (int k = 0; k < n; k++) {
    if (nums[k] != k + 1) return k + 1; // first missing number
  }
  return n + 1;
}`,
      cpp: `int cyclicSort(vector<int>& nums) {
  // Values are in 1..n; value v belongs at index v - 1
  int i = 0, n = nums.size();
  while (i < n) {
    int home = nums[i] - 1;
    // in range, not at home, and home holds a different value
    if (home >= 0 && home < n && nums[i] != nums[home]) {
      swap(nums[i], nums[home]); // do not move i
    } else {
      i++;
    }
  }
  // Second pass: index k should hold k + 1
  for (int k = 0; k < n; k++) {
    if (nums[k] != k + 1) return k + 1; // first missing number
  }
  return n + 1;
}`,
    },
    relatedGateIds: ['searching-sorting', 'arrays-strings'],
    exampleProblemIds: ['missing-number', 'find-all-numbers-disappeared-in-an-array', 'find-the-duplicate-number', 'find-all-duplicates-in-an-array', 'first-missing-positive'],
  },

  // -------------------------------------------------------------------------
  // 11. Backtracking
  // -------------------------------------------------------------------------
  {
    id: 'backtracking',
    name: 'Backtracking',
    tagline: 'Build the answer one choice at a time; undo the choice when it fails.',
    triggers: [
      'generate all subsets / permutations / combinations',
      'all valid arrangements',
      'place queens / fill a board',
      'word search in a grid',
      'n is small (n <= 15 or so)',
      'return every solution, not just one',
    ],
    avoidWhen: [
      'you only need to count solutions and n is large (use DP)',
      'n is big (2^n or n! will not finish)',
      'a greedy choice is provably enough',
    ],
    explanation: `Backtracking is recursion that explores every possible sequence of choices. At each step you pick an option, go deeper, and when you come back you remove that option and try the next one. It is a depth-first walk through a tree of decisions. Pruning (stopping early when a partial answer is already invalid) is what keeps it practical.

## The idea
- Keep a \`path\`: the choices made so far.
- If path is a complete answer, save a copy.
- Otherwise, for each allowed next choice: add it, recurse, remove it.
That "add, recurse, remove" is the whole rhythm.

## A tiny example
All subsets of \`[1, 2, 3]\`.
- Start with []. Save it.
- Add 1 -> [1]. Save. Add 2 -> [1,2]. Save. Add 3 -> [1,2,3]. Save. Remove 3. Remove 2.
- Add 3 -> [1,3]. Save. Remove 3. Remove 1.
- Add 2 -> [2]. Save. Add 3 -> [2,3]. Save. Remove 3. Remove 2.
- Add 3 -> [3]. Save. Remove 3.
Result: 8 subsets, which is 2^3. The \`start\` index prevents [2,1] appearing after [1,2].

## Step by step
1. Decide what a "choice" is: an element to include, a column for the queen, a direction in the grid.
2. Decide when the path is complete: length equals k, or index reached n, or all queens placed.
3. Write the loop over choices with add / recurse / remove.
4. Add pruning: skip choices that break a rule (used already, sum too big, queen under attack).
5. Save a COPY of path when complete. Saving path itself gives you an empty list later.

## Where people go wrong
- Forgetting to undo the choice (\`path.pop()\`), so later branches see stale state.
- Appending path instead of path[:] (a copy).
- No pruning, so an n = 12 problem takes minutes.
- For permutations, forgetting the "used" set and repeating an element.

## How to recognise it in an interview
"All", "every", "generate", "combinations", "permutations", "subsets", "valid arrangements", "N-Queens", "Sudoku". Small constraints (n <= 20) are the giveaway.`,
    time: 'O(2^n) for subsets, O(n!) for permutations, times the cost of copying each answer',
    space: 'O(n) for the path and recursion depth, plus the output',
    template: {
      python: `def backtrack_all(nums):
    results = []
    path = []

    def go(start):
        results.append(path[:])          # save a COPY of the current path
        for i in range(start, len(nums)):
            # (optional) prune: if choice i is invalid, continue
            path.append(nums[i])         # 1. choose
            go(i + 1)                    # 2. explore
            path.pop()                   # 3. un-choose

    go(0)
    return results`,
      javascript: `function backtrackAll(nums) {
  const results = [];
  const path = [];
  function go(start) {
    results.push(path.slice());        // save a COPY of the current path
    for (let i = start; i < nums.length; i++) {
      // (optional) prune: if choice i is invalid, continue
      path.push(nums[i]);              // 1. choose
      go(i + 1);                       // 2. explore
      path.pop();                      // 3. un-choose
    }
  }
  go(0);
  return results;
}`,
      java: `List<List<Integer>> results = new ArrayList<>();

List<List<Integer>> backtrackAll(int[] nums) {
  go(nums, 0, new ArrayList<>());
  return results;
}

void go(int[] nums, int start, List<Integer> path) {
  results.add(new ArrayList<>(path));   // save a COPY of the current path
  for (int i = start; i < nums.length; i++) {
    // (optional) prune: if choice i is invalid, continue
    path.add(nums[i]);                  // 1. choose
    go(nums, i + 1, path);              // 2. explore
    path.remove(path.size() - 1);       // 3. un-choose
  }
}`,
      cpp: `vector<vector<int>> results;

void go(const vector<int>& nums, int start, vector<int>& path) {
  results.push_back(path);            // save a COPY of the current path
  for (int i = start; i < (int)nums.size(); i++) {
    // (optional) prune: if choice i is invalid, continue
    path.push_back(nums[i]);          // 1. choose
    go(nums, i + 1, path);            // 2. explore
    path.pop_back();                  // 3. un-choose
  }
}

vector<vector<int>> backtrackAll(const vector<int>& nums) {
  vector<int> path;
  go(nums, 0, path);
  return results;
}`,
    },
    relatedGateIds: ['recursion-backtracking'],
    exampleProblemIds: ['subsets', 'permutations', 'combination-sum', 'word-search', 'n-queens', 'letter-combinations-of-a-phone-number'],
  },

  // -------------------------------------------------------------------------
  // 12. Fast and slow pointers
  // -------------------------------------------------------------------------
  {
    id: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    tagline: 'One pointer moves 1 step, the other 2. They meet in a cycle or find the middle.',
    triggers: [
      'linked list cycle',
      'middle of the linked list',
      'find where the cycle starts',
      'happy number / repeated function',
      'O(1) space on a linked list',
      'kth node from the end',
    ],
    avoidWhen: [
      'you can use a set to remember visited nodes and space is not a concern',
      'the structure is an array with random access (indexes are simpler)',
      'the list is doubly linked and you can walk backwards',
    ],
    explanation: `Also called the tortoise and hare. Two pointers start at the head of a linked list. The slow one moves one node per step, the fast one moves two. If there is a cycle, the fast one laps the slow one and they meet. If there is no cycle, the fast one hits the end. And when fast reaches the end, slow is exactly in the middle. All in O(n) time and O(1) space.

## The idea
- slow = head, fast = head.
- Loop while fast and fast.next exist: slow = slow.next, fast = fast.next.next.
- If slow == fast at any point, there is a cycle.
- If the loop ends, no cycle, and slow is at the middle.

## A tiny example
List: 1 -> 2 -> 3 -> 4 -> 5 -> (back to 3)
- Step 1: slow=2, fast=3
- Step 2: slow=3, fast=5
- Step 3: slow=4, fast=4. They meet. Cycle confirmed.
Without a cycle, list 1 -> 2 -> 3 -> 4 -> 5:
- Step 1: slow=2, fast=3. Step 2: slow=3, fast=5. fast.next is None, stop. slow=3 is the middle.

## Finding where the cycle starts
After they meet, put one pointer back at the head. Move both one step at a time. Where they meet again is the start of the cycle. This is Floyd's algorithm and it also solves "find the duplicate number" when the array is treated as a linked list (index -> value).

## Step by step
1. Start both at head. Check the fast pointer carefully: you need \`fast\` and \`fast.next\` to be non-null before reading \`fast.next.next\`.
2. Move slow by 1 and fast by 2 in the same iteration.
3. Compare AFTER moving, not before, or they are equal at the very start.
4. For "kth from end", give fast a head start of k nodes, then move both by 1.

## Where people go wrong
- Null pointer error when fast.next is None.
- Comparing before moving, so slow == fast on step zero.
- Getting the middle wrong for even-length lists. Decide whether you want the first or second middle and test with 4 nodes.

## How to recognise it in an interview
"Linked list", "cycle", "middle", "O(1) space", "repeated sequence of numbers" (happy number). If a naive solution uses a visited set, this pattern removes it.`,
    time: 'O(n)',
    space: 'O(1)',
    template: {
      python: `def fast_slow(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next           # 1 step
        fast = fast.next.next      # 2 steps
        if slow is fast:
            return True            # cycle found
    # no cycle; here slow is the middle node
    return False`,
      javascript: `function fastSlow(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;          // 1 step
    fast = fast.next.next;     // 2 steps
    if (slow === fast) return true; // cycle found
  }
  // no cycle; here slow is the middle node
  return false;
}`,
      java: `boolean fastSlow(ListNode head) {
  ListNode slow = head, fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;          // 1 step
    fast = fast.next.next;     // 2 steps
    if (slow == fast) return true; // cycle found
  }
  // no cycle; here slow is the middle node
  return false;
}`,
      cpp: `bool fastSlow(ListNode* head) {
  ListNode* slow = head;
  ListNode* fast = head;
  while (fast && fast->next) {
    slow = slow->next;         // 1 step
    fast = fast->next->next;   // 2 steps
    if (slow == fast) return true; // cycle found
  }
  // no cycle; here slow is the middle node
  return false;
}`,
    },
    relatedGateIds: ['linked-lists'],
    exampleProblemIds: ['linked-list-cycle', 'middle-of-the-linked-list', 'linked-list-cycle-ii', 'happy-number', 'find-the-duplicate-number'],
  },

  // -------------------------------------------------------------------------
  // 13. In-place reversal
  // -------------------------------------------------------------------------
  {
    id: 'in-place-reversal',
    name: 'In-place Linked List Reversal',
    tagline: 'Flip the arrows one node at a time using three pointers.',
    triggers: [
      'reverse a linked list',
      'reverse between positions',
      'reverse in groups of k',
      'reorder list',
      'without extra space',
      'palindrome linked list',
    ],
    avoidWhen: [
      'you can just copy values into an array (allowed and simpler)',
      'the list is doubly linked (swap next and prev on each node instead)',
      'you need the original order later and cannot restore it',
    ],
    explanation: `Reversing a linked list in place means turning every \`next\` arrow around without creating new nodes. You walk the list with three pointers: \`prev\`, \`curr\` and \`nxt\`. At each node you save the next one, point the current node backwards, then step forward. The trick is remembering the next node BEFORE you break the link.

## The idea
- prev = None, curr = head.
- Loop: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt.
- When curr becomes None, prev is the new head.

## A tiny example
1 -> 2 -> 3 -> None
- Start: prev=None, curr=1.
- Save nxt=2. Point 1 -> None. prev=1, curr=2.
- Save nxt=3. Point 2 -> 1. prev=2, curr=3.
- Save nxt=None. Point 3 -> 2. prev=3, curr=None.
- Done. New head is 3: 3 -> 2 -> 1 -> None.
Three nodes, three iterations, no new memory. O(n) time, O(1) space.

## Reversing a piece
For "reverse between positions m and n" or "reverse in groups of k", the same loop is used, but you first walk to the node before the piece, reverse exactly the right number of nodes, then reconnect: the node before the piece points to the new first node, and the old first node (now last) points to whatever comes after.

## Step by step
1. Draw the list on paper with arrows. Seriously. It saves ten minutes of confusion.
2. Write the four-line loop from memory.
3. If reversing a sub-list, add a dummy node before head so the "node before the piece" always exists.
4. After reversing, reconnect both ends and return dummy.next.

## Where people go wrong
- Setting curr.next = prev before saving curr.next. The rest of the list is lost.
- Returning head instead of prev. The old head is now the tail.
- For k-groups, reversing a final group that has fewer than k nodes when the problem says to leave it.

## How to recognise it in an interview
"Reverse", "in place", "O(1) extra space", "reorder", "swap pairs", "k-group". Almost every linked list problem on a list of medium problems uses this loop somewhere.`,
    time: 'O(n)',
    space: 'O(1)',
    template: {
      python: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next        # 1. remember the next node
        curr.next = prev       # 2. flip the arrow
        prev = curr            # 3. step prev forward
        curr = nxt             # 4. step curr forward
    return prev                # prev is the new head`,
      javascript: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const nxt = curr.next;  // 1. remember the next node
    curr.next = prev;       // 2. flip the arrow
    prev = curr;            // 3. step prev forward
    curr = nxt;             // 4. step curr forward
  }
  return prev;              // prev is the new head
}`,
      java: `ListNode reverseList(ListNode head) {
  ListNode prev = null, curr = head;
  while (curr != null) {
    ListNode nxt = curr.next; // 1. remember the next node
    curr.next = prev;         // 2. flip the arrow
    prev = curr;              // 3. step prev forward
    curr = nxt;               // 4. step curr forward
  }
  return prev;                // prev is the new head
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
  ListNode* prev = nullptr;
  ListNode* curr = head;
  while (curr) {
    ListNode* nxt = curr->next; // 1. remember the next node
    curr->next = prev;          // 2. flip the arrow
    prev = curr;                // 3. step prev forward
    curr = nxt;                 // 4. step curr forward
  }
  return prev;                  // prev is the new head
}`,
    },
    relatedGateIds: ['linked-lists'],
    exampleProblemIds: ['reverse-linked-list', 'reverse-linked-list-ii', 'swap-nodes-in-pairs', 'reverse-nodes-in-k-group', 'reorder-list', 'palindrome-linked-list'],
  },

  // -------------------------------------------------------------------------
  // 14. Monotonic stack
  // -------------------------------------------------------------------------
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    tagline: 'A stack that stays sorted; popping tells you the next greater or smaller element.',
    triggers: [
      'next greater element',
      'next smaller element',
      'days until a warmer temperature',
      'largest rectangle in histogram',
      'how many previous elements are smaller',
      'stock span',
      'remove k digits to make smallest',
    ],
    avoidWhen: [
      'you need the maximum of a moving window (use a monotonic deque instead)',
      'the relationship is not "nearest to the left/right" (a sorted structure or heap may fit better)',
      'the array is tiny and a double loop is obviously fine',
    ],
    explanation: `A monotonic stack is a normal stack where the values always go in one direction from bottom to top (always increasing or always decreasing). You walk the array once. Before pushing a new element, you pop everything that would break the order. Every popped element just learned its answer: the new element is its "next greater" (or "next smaller"). Each item is pushed once and popped once, so the whole thing is O(n).

## The idea
- Keep a stack of INDEXES whose values are decreasing (for "next greater").
- For each new index i: while the stack top's value is smaller than nums[i], pop it and record answer[popped] = i.
- Push i.
- Anything left on the stack at the end has no next greater element.

## A tiny example
Daily temperatures \`[73, 74, 75, 71, 69, 72, 76]\`. For each day, how many days until a warmer one?
- i=0 (73): stack empty, push 0. Stack [0].
- i=1 (74): 74 > 73, pop 0, answer[0] = 1-0 = 1. Push 1.
- i=2 (75): pop 1, answer[1] = 1. Push 2.
- i=3 (71): 71 < 75, push. Stack [2, 3].
- i=4 (69): push. Stack [2, 3, 4].
- i=5 (72): pop 4 (69), answer[4] = 1. Pop 3 (71), answer[3] = 2. 72 < 75 so stop. Push 5. Stack [2, 5].
- i=6 (76): pop 5, answer[5] = 1. Pop 2, answer[2] = 4. Push 6.
Result [1, 1, 4, 2, 1, 1, 0]. The brute force scans forward for every day: O(n^2). This is O(n).

## Step by step
1. Decide the direction: "next greater" needs a decreasing stack, "next smaller" needs an increasing stack.
2. Store indexes, not values. You usually need the distance or the position.
3. Write the while-pop loop, then push.
4. For "previous greater/smaller", the stack top just before pushing is the answer.

## Where people go wrong
- Storing values and then not knowing where they came from.
- Using \`<\` when you need \`<=\` (or the reverse) for duplicates. Test with [2, 2, 3].
- For histogram problems, forgetting to flush the stack at the end with a sentinel height of 0.

## How to recognise it in an interview
"Next greater", "next smaller", "nearest to the left", "how many days until", "span", "width of the rectangle bounded by smaller bars". Any time the brute force is "for each element scan right until you find something bigger", this pattern makes it linear.`,
    time: 'O(n)',
    space: 'O(n)',
    template: {
      python: `def next_greater(nums):
    n = len(nums)
    answer = [-1] * n          # -1 means no greater element to the right
    stack = []                 # indexes; values are decreasing bottom->top
    for i in range(n):
        # pop everyone smaller than nums[i]; nums[i] is their answer
        while stack and nums[stack[-1]] < nums[i]:
            j = stack.pop()
            answer[j] = nums[i]   # or store i - j for a distance
        stack.append(i)
    return answer`,
      javascript: `function nextGreater(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(-1); // -1 = no greater to the right
  const stack = [];                     // indexes; values decreasing
  for (let i = 0; i < n; i++) {
    // pop everyone smaller than nums[i]; nums[i] is their answer
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      const j = stack.pop();
      answer[j] = nums[i];              // or store i - j for a distance
    }
    stack.push(i);
  }
  return answer;
}`,
      java: `int[] nextGreater(int[] nums) {
  int n = nums.length;
  int[] answer = new int[n];
  Arrays.fill(answer, -1);              // -1 = no greater to the right
  Deque<Integer> stack = new ArrayDeque<>(); // indexes; values decreasing
  for (int i = 0; i < n; i++) {
    // pop everyone smaller than nums[i]; nums[i] is their answer
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
      int j = stack.pop();
      answer[j] = nums[i];              // or store i - j for a distance
    }
    stack.push(i);
  }
  return answer;
}`,
      cpp: `vector<int> nextGreater(const vector<int>& nums) {
  int n = nums.size();
  vector<int> answer(n, -1);            // -1 = no greater to the right
  vector<int> stack;                    // indexes; values decreasing
  for (int i = 0; i < n; i++) {
    // pop everyone smaller than nums[i]; nums[i] is their answer
    while (!stack.empty() && nums[stack.back()] < nums[i]) {
      int j = stack.back(); stack.pop_back();
      answer[j] = nums[i];              // or store i - j for a distance
    }
    stack.push_back(i);
  }
  return answer;
}`,
    },
    relatedGateIds: ['stacks-queues'],
    exampleProblemIds: ['next-greater-element-i', 'daily-temperatures', 'largest-rectangle-in-histogram', 'online-stock-span'],
  },

  // -------------------------------------------------------------------------
  // 15. Hash map
  // -------------------------------------------------------------------------
  {
    id: 'hash-map',
    name: 'Hash Map / Hash Set',
    tagline: 'Trade a little memory for O(1) lookups; stop re-scanning the array.',
    triggers: [
      'have I seen this before',
      'count occurrences / frequency',
      'find a pair that adds to target (unsorted)',
      'group items by some key',
      'contains duplicate',
      'anagrams',
      'longest consecutive sequence',
    ],
    avoidWhen: [
      'the input is sorted and O(1) space is required (two pointers)',
      'keys are not hashable or you need them in sorted order (use a tree map / sorting)',
      'the range of values is tiny (a plain array of counts is faster)',
    ],
    explanation: `A hash map (Python dict) answers "is this key here, and what is stored with it?" in O(1) on average. A hash set does the same without a value. Most O(n^2) solutions are slow because an inner loop searches for something. Replace that search with a dict lookup and the inner loop disappears.

## The idea
- Walk the array once.
- Before using the current element, ask the dict a question about what you have already seen.
- Then store the current element in the dict for future elements.
The "ask, then store" order matters: it guarantees you never pair an element with itself.

## A tiny example
Two Sum on \`[2, 7, 11, 15]\`, target 9.
- 2: need 7. Not in dict. Store {2: 0}.
- 7: need 2. Found at index 0. Answer [0, 1].
Two steps. The brute force checks 6 pairs and grows as n^2.

Frequency counting: \`"banana"\` -> {b:1, a:3, n:2}. Now "which letter appears most" is one loop over the dict.

Grouping: for anagrams, the key is \`''.join(sorted(word))\`. "eat", "tea", "ate" all get key "aet" and land in the same list.

## Step by step
1. Ask: what is the inner loop looking for? That thing becomes the key.
2. Decide the value: index, count, or list of items.
3. Loop once. Query the dict, then update it.
4. For counting, \`collections.Counter\` or \`dict.get(k, 0) + 1\` saves a line.

## Where people go wrong
- Storing before asking, so an element matches itself in Two Sum.
- Using a list as a key. Lists are not hashable; use a tuple or a string.
- Forgetting that dict lookups are O(1) on AVERAGE, not always. It is fine in interviews, but say "average".
- Reaching for a dict when the values are 0..25 (letters). A 26-slot array is simpler and faster.

## How to recognise it in an interview
"Count", "frequency", "duplicate", "seen", "group by", "anagram", "pair sum on unsorted data". If your brute force has an inner loop that searches, a hash map is the first upgrade to try.`,
    time: 'O(n) average',
    space: 'O(n)',
    template: {
      python: `def hash_map_pattern(nums, target):
    seen = {}    # value -> index (or count, or list of items)
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:            # ask first...
            return [seen[need], i]
        seen[x] = i                 # ...then store
    return []

def count_frequency(items):
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts`,
      javascript: `function hashMapPattern(nums, target) {
  const seen = new Map(); // value -> index (or count, or list)
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i]; // ask first...
    seen.set(nums[i], i);                            // ...then store
  }
  return [];
}

function countFrequency(items) {
  const counts = new Map();
  for (const item of items) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}`,
      java: `int[] hashMapPattern(int[] nums, int target) {
  Map<Integer, Integer> seen = new HashMap<>(); // value -> index
  for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i}; // ask
    seen.put(nums[i], i);                                            // store
  }
  return new int[]{};
}

Map<String, Integer> countFrequency(String[] items) {
  Map<String, Integer> counts = new HashMap<>();
  for (String item : items) counts.merge(item, 1, Integer::sum);
  return counts;
}`,
      cpp: `vector<int> hashMapPattern(const vector<int>& nums, int target) {
  unordered_map<int, int> seen; // value -> index
  for (int i = 0; i < (int)nums.size(); i++) {
    int need = target - nums[i];
    if (seen.count(need)) return {seen[need], i}; // ask first...
    seen[nums[i]] = i;                            // ...then store
  }
  return {};
}

unordered_map<string, int> countFrequency(const vector<string>& items) {
  unordered_map<string, int> counts;
  for (const string& item : items) counts[item]++;
  return counts;
}`,
    },
    relatedGateIds: ['hashing', 'arrays-strings'],
    exampleProblemIds: ['two-sum', 'contains-duplicate', 'group-anagrams', 'top-k-frequent-elements', 'longest-consecutive-sequence', 'subarray-sum-equals-k'],
  },

  // -------------------------------------------------------------------------
  // 16. Tree traversal
  // -------------------------------------------------------------------------
  {
    id: 'tree-traversal',
    name: 'Tree Traversal',
    tagline: 'Visit every node in a fixed order: preorder, inorder, postorder, or level by level.',
    triggers: [
      'binary tree',
      'visit all nodes',
      'level order / by depth',
      'inorder of a BST (gives sorted order)',
      'height / depth / diameter',
      'path from root to leaf',
      'serialize a tree',
    ],
    avoidWhen: [
      'the structure has cycles (that is a graph, use a visited set)',
      'you only need one node and the tree is a BST (walk left/right instead of visiting all)',
      'recursion depth could blow the stack on a very deep tree (use an explicit stack)',
    ],
    explanation: `A tree traversal is a fixed recipe for visiting every node exactly once. There are three depth-first orders and one breadth-first order. The names tell you WHEN the current node is handled relative to its children.

## The idea
- Preorder: node, left, right. Good for copying a tree or printing a folder structure.
- Inorder: left, node, right. On a binary search tree this gives sorted order.
- Postorder: left, right, node. Good when the node's answer depends on its children (height, delete).
- Level order (BFS): use a queue, process one level at a time. Good for "by depth" questions.

## A tiny example
Tree:
\`\`\`
    4
   / \\
  2   6
 / \\
1   3
\`\`\`
- Preorder: 4, 2, 1, 3, 6
- Inorder: 1, 2, 3, 4, 6 (sorted, because this is a BST)
- Postorder: 1, 3, 2, 6, 4
- Level order: [4], [2, 6], [1, 3]

Height with postorder: height(1) = 1, height(3) = 1, so height(2) = 1 + max(1, 1) = 2. height(6) = 1. height(4) = 1 + max(2, 1) = 3. The node's answer is built from the children's answers.

## Step by step
1. Ask: does the node need info from its children? Use postorder (return values upward).
2. Does the node need info from its ancestors? Use preorder (pass values downward as parameters).
3. Is the question about depth or "closest to the root"? Use level order with a queue.
4. Base case is always the same: an empty node returns 0, None, or an empty list.
5. Every node is visited once, so all four orders are O(n) time.

## Where people go wrong
- Forgetting the base case for an empty node, so \`None.left\` crashes.
- Using inorder on a non-BST and expecting sorted output.
- In level order, forgetting to record the queue length BEFORE the inner loop, so levels blur together.
- Recomputing height inside a loop (O(n^2)) instead of returning it from postorder (O(n)).

## How to recognise it in an interview
"Binary tree", "depth", "level", "leaf", "ancestor", "path sum", "symmetric", "invert". Nearly every tree problem is one of these four traversals plus a small calculation at each node.`,
    time: 'O(n), every node visited once',
    space: 'O(h) for recursion depth (h = height), O(w) for the BFS queue (w = widest level)',
    template: {
      python: `from collections import deque

def dfs(node):
    if node is None:            # base case
        return 0
    # preorder work here (before children)
    left = dfs(node.left)
    # inorder work here (between children)
    right = dfs(node.right)
    # postorder work here (after children), e.g. height:
    return 1 + max(left, right)

def level_order(root):
    if root is None:
        return []
    levels, queue = [], deque([root])
    while queue:
        size = len(queue)           # nodes on THIS level
        level = []
        for _ in range(size):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        levels.append(level)
    return levels`,
      javascript: `function dfs(node) {
  if (node === null) return 0;    // base case
  // preorder work here (before children)
  const left = dfs(node.left);
  // inorder work here (between children)
  const right = dfs(node.right);
  // postorder work here (after children), e.g. height:
  return 1 + Math.max(left, right);
}

function levelOrder(root) {
  if (root === null) return [];
  const levels = [];
  const queue = [root];
  while (queue.length) {
    const size = queue.length;     // nodes on THIS level
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}`,
      java: `int dfs(TreeNode node) {
  if (node == null) return 0;     // base case
  // preorder work here (before children)
  int left = dfs(node.left);
  // inorder work here (between children)
  int right = dfs(node.right);
  // postorder work here (after children), e.g. height:
  return 1 + Math.max(left, right);
}

List<List<Integer>> levelOrder(TreeNode root) {
  List<List<Integer>> levels = new ArrayList<>();
  if (root == null) return levels;
  Queue<TreeNode> queue = new LinkedList<>();
  queue.add(root);
  while (!queue.isEmpty()) {
    int size = queue.size();       // nodes on THIS level
    List<Integer> level = new ArrayList<>();
    for (int i = 0; i < size; i++) {
      TreeNode node = queue.poll();
      level.add(node.val);
      if (node.left != null) queue.add(node.left);
      if (node.right != null) queue.add(node.right);
    }
    levels.add(level);
  }
  return levels;
}`,
      cpp: `int dfs(TreeNode* node) {
  if (node == nullptr) return 0;  // base case
  // preorder work here (before children)
  int left = dfs(node->left);
  // inorder work here (between children)
  int right = dfs(node->right);
  // postorder work here (after children), e.g. height:
  return 1 + max(left, right);
}

vector<vector<int>> levelOrder(TreeNode* root) {
  vector<vector<int>> levels;
  if (!root) return levels;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    int size = q.size();           // nodes on THIS level
    vector<int> level;
    for (int i = 0; i < size; i++) {
      TreeNode* node = q.front(); q.pop();
      level.push_back(node->val);
      if (node->left) q.push(node->left);
      if (node->right) q.push(node->right);
    }
    levels.push_back(level);
  }
  return levels;
}`,
    },
    relatedGateIds: ['trees', 'recursion-backtracking'],
    exampleProblemIds: ['binary-tree-inorder-traversal', 'binary-tree-level-order-traversal', 'maximum-depth-of-binary-tree', 'kth-smallest-element-in-a-bst', 'validate-binary-search-tree', 'diameter-of-binary-tree'],
  },
]
