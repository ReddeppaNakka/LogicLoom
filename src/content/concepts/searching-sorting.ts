import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'linear-vs-binary-search',
    gateId: 'searching-sorting',
    order: 1,
    title: 'Linear vs Binary Search: Halve It Until It Is Gone',
    minutes: 25,
    summary: 'Linear search checks every element; binary search on sorted data throws away half the remaining elements at every step.',
    analogy:
      'Looking up a word in a dictionary, you do not start at page one. You open the middle, see whether your word comes before or after, and ignore the wrong half. A few flips later you are on the right page. That is binary search, and it only works because the dictionary is sorted.',
    explanation: `Searching is the simplest task there is: is this value in the list, and where? Linear search is the obvious answer and it is fine for small or unsorted data. But when the data is sorted, binary search finds the answer in a handful of steps even for millions of items. Understanding why builds the intuition for O(log n) everywhere else.

## The idea

- **Linear search**: look at index 0, then 1, then 2, until you find the target or run out. Worst case n checks: **O(n)**. Works on any list.
- **Binary search**: keep a range \`[lo, hi]\` that must contain the target. Look at the middle. If it is too small, the target must be in the right half; if too big, the left half. Each step halves the range: **O(log n)**. Requires sorted data.

How small is log n? For n = 1,000, about 10 steps. For n = 1,000,000, about 20. For a billion, about 30.

## A tiny example

\`nums = [1, 3, 5, 7, 9, 11, 13]\`, target 11.

Linear search checks 1, 3, 5, 7, 9, 11: six comparisons.

Binary search:

- lo = 0, hi = 6, mid = 3, nums[3] = 7 < 11, so lo = 4.
- lo = 4, hi = 6, mid = 5, nums[5] = 11, found. Two comparisons.

\`\`\`python
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
\`\`\`

## Step by step: writing binary search correctly

1. Set \`lo = 0\`, \`hi = n - 1\`. Both ends are included.
2. Loop while \`lo <= hi\`. When they cross, the range is empty and the target is absent.
3. Compute \`mid = (lo + hi) // 2\`. In Java and C++ use \`lo + (hi - lo) / 2\` to avoid overflow.
4. Compare and move: \`lo = mid + 1\` or \`hi = mid - 1\`. Always exclude mid, or you can loop forever.
5. Return mid on a match, or -1 after the loop.

## Where people go wrong

- Running binary search on unsorted data. The halving logic gives garbage.
- Writing \`lo = mid\` instead of \`lo = mid + 1\`. With two elements left this never ends.
- Using \`while lo < hi\` with inclusive hi and missing the last element.
- Forgetting that sorting first costs O(n log n). For a single search on unsorted data, linear is better. Binary search pays off when the data is already sorted or you will search many times.

## How to recognise it in an interview

- The array is described as "sorted" or "non-decreasing".
- Constraints demand O(log n), or n is large and you must answer many "does it exist" questions.
- "Find the first version that is bad", "find the square root", "search insert position" are all binary search in disguise.
- A 2D matrix where rows and the row-ends are sorted can be treated as one long sorted array.`,
    naive: {
      title: 'Linear scan from the start',
      description:
        'Check each element in order until you hit the target. It needs no assumptions about the data, but in the worst case it looks at everything.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def linear_search(nums, target):
    for i, x in enumerate(nums):
        if x == target:
            return i
    return -1

print(linear_search([1, 3, 5, 7, 9, 11, 13], 11))  # 5`,
        javascript: `function linearSearch(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}

console.log(linearSearch([1, 3, 5, 7, 9, 11, 13], 11)); // 5`,
        java: `public class Solution {
  public static int linearSearch(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] == target) return i;
    }
    return -1;
  }

  public static void main(String[] args) {
    System.out.println(linearSearch(new int[]{1, 3, 5, 7, 9, 11, 13}, 11)); // 5
  }
}`,
        cpp: `#include <iostream>
#include <vector>

int linearSearch(const std::vector<int>& nums, int target) {
  for (size_t i = 0; i < nums.size(); i++) {
    if (nums[i] == target) return i;
  }
  return -1;
}

int main() {
  std::cout << linearSearch({1, 3, 5, 7, 9, 11, 13}, 11) << std::endl; // 5
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Binary search on the sorted array',
      description:
        'Keep an inclusive range that must contain the target. Compare with the middle and discard the half that cannot contain it. Repeat until found or the range is empty.',
      time: 'O(log n)',
      space: 'O(1)',
      code: {
        python: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11, 13], 11))  # 5`,
        javascript: `function binarySearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

console.log(binarySearch([1, 3, 5, 7, 9, 11, 13], 11)); // 5`,
        java: `public class Solution {
  public static int binarySearch(int[] nums, int target) {
    int lo = 0;
    int hi = nums.length - 1;
    while (lo <= hi) {
      int mid = lo + (hi - lo) / 2;
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }

  public static void main(String[] args) {
    System.out.println(binarySearch(new int[]{1, 3, 5, 7, 9, 11, 13}, 11)); // 5
  }
}`,
        cpp: `#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& nums, int target) {
  int lo = 0;
  int hi = nums.size() - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

int main() {
  std::cout << binarySearch({1, 3, 5, 7, 9, 11, 13}, 11) << std::endl; // 5
  return 0;
}`,
      },
    },
    whyFaster:
      'Linear search can only rule out one element per comparison. Binary search uses the sorted order to rule out half of the remaining elements per comparison, so the number of steps is how many times you can halve n before reaching 1, which is log2(n). For a million elements that is 20 steps instead of up to a million.',
    keyPoints: [
      'Linear search is O(n) and works on anything; binary search is O(log n) but needs sorted data.',
      'log2 of a million is about 20; log2 of a billion is about 30.',
      'Template: lo = 0, hi = n - 1, while lo <= hi, mid = lo + (hi - lo) / 2, move lo = mid + 1 or hi = mid - 1.',
      'Never set lo = mid or hi = mid with an inclusive range; that can loop forever.',
      'Sorting first costs O(n log n), so binary search pays off on already-sorted data or repeated searches.',
    ],
    patternIds: ['binary-search', 'brute-force'],
    problems: [
      {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/binary-search/',
        patternId: 'binary-search',
        hint: 'Inclusive lo and hi, loop while lo <= hi, and always move past mid.',
        xp: 20,
      },
      {
        id: 'search-insert-position',
        title: 'Search Insert Position',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/search-insert-position/',
        patternId: 'binary-search',
        hint: 'When the loop ends without a match, lo is exactly where the target would be inserted.',
        xp: 20,
      },
      {
        id: 'first-bad-version',
        title: 'First Bad Version',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/first-bad-version/',
        patternId: 'binary-search',
        hint: 'Versions look like [good, good, bad, bad]; find the first bad by keeping hi on a bad version.',
        xp: 20,
      },
      {
        id: 'sqrtx',
        title: 'Sqrt(x)',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/sqrtx/',
        patternId: 'binary-search',
        hint: 'Binary search the answer between 0 and x: find the largest m with m * m <= x.',
        xp: 20,
      },
      {
        id: 'valid-perfect-square',
        title: 'Valid Perfect Square',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-perfect-square/',
        patternId: 'binary-search',
        hint: 'Search 1..num for an m with m * m == num; use long arithmetic to avoid overflow.',
        xp: 20,
      },
      {
        id: 'search-a-2d-matrix',
        title: 'Search a 2D Matrix',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/search-a-2d-matrix/',
        patternId: 'binary-search',
        hint: 'Treat the matrix as one sorted list of rows * cols items; index i maps to row i / cols and column i % cols.',
        xp: 40,
      },
    ],
  },
  {
    id: 'binary-search-variants',
    gateId: 'searching-sorting',
    order: 2,
    title: 'Binary Search Variants: Boundaries, Rotations and Searching the Answer',
    minutes: 30,
    summary: 'Binary search is really about finding the boundary between "no" and "yes" in a sorted sequence of answers, which unlocks first/last occurrence, rotated arrays and searching over the answer itself.',
    analogy:
      'A row of light switches goes from all OFF to all ON somewhere in the middle. You do not need to look at every switch to find the first ON one; flip to the middle, see whether it is on, and jump halfway again. Most binary search problems are just "find where the switches change".',
    explanation: `Plain binary search finds an exact match. The powerful version finds a **boundary**: the first index where some condition becomes true. Once you see problems this way, first occurrence, last occurrence, rotated arrays and even "minimum speed to finish in time" all become the same template.

## The idea

Imagine mapping every index to yes or no with a condition that is false for a while and then true forever: \`[F, F, F, T, T, T]\`. Binary search can find the first T in O(log n):

\`\`\`python
def first_true(n, cond):
    lo, hi = 0, n          # hi = n means "maybe none is true"
    while lo < hi:
        mid = (lo + hi) // 2
        if cond(mid):
            hi = mid       # mid could be the answer, keep it
        else:
            lo = mid + 1   # mid is false, answer is to the right
    return lo
\`\`\`

Note the differences from the exact-match version: \`hi\` starts at n, the loop is \`lo < hi\`, and \`hi = mid\` (not mid - 1) because mid might be the answer.

## A tiny example

Find the first and last position of 5 in \`[1, 3, 5, 5, 5, 8]\`.

The slow way scans:

\`\`\`python
def first_last(nums, t):
    first = last = -1
    for i, x in enumerate(nums):
        if x == t:
            if first == -1:
                first = i
            last = i
    return [first, last]
\`\`\`

**O(n)**, ignores the sorted order.

The fast way uses two boundary searches:

- first index where \`nums[i] >= 5\` gives 2 (the first 5).
- first index where \`nums[i] > 5\` gives 5, so the last 5 is at 5 - 1 = 4.

Two searches of **O(log n)** each.

## The three big variants

1. **First / last occurrence**: condition \`nums[i] >= target\` and \`nums[i] > target\`. Also called lower bound and upper bound.
2. **Rotated sorted array**: \`[4, 5, 6, 7, 0, 1, 2]\`. At each mid, one half is properly sorted. Check whether the target lies inside that sorted half; if yes go there, otherwise go to the other half.
3. **Binary search on the answer**: the array is not sorted, but the answer is a number where "is x enough?" is false up to some value and true after it. Example: Koko eats bananas at speed k; can she finish in h hours? Slow speeds fail, fast speeds succeed. Binary search over k from 1 to max pile, checking each candidate in O(n).

## Step by step: binary search on the answer

1. Identify the quantity to search (speed, capacity, days, size).
2. Find the smallest and largest possible values for it.
3. Write \`feasible(x)\` that returns True if x works. Make sure it is monotonic: once true, always true (or the reverse).
4. Run the first-true template over that range.

## Where people go wrong

- Mixing the two templates. Exact match uses \`lo <= hi\` and \`hi = mid - 1\`; boundary uses \`lo < hi\` and \`hi = mid\`.
- A non-monotonic \`feasible\`. If yes/no flips back and forth, binary search is invalid.
- Off-by-one on "last occurrence": it is (first index greater than target) minus 1.
- In rotated arrays, forgetting to check which half is sorted before deciding where to go.

## How to recognise it in an interview

- "First or last position", "how many times does x appear", "lower bound".
- "Rotated sorted array", "find the minimum in a rotated array".
- "Minimum speed / capacity / days such that...", "maximize the minimum...", "smallest x so that it is possible". Combined with a large range, that is binary search on the answer.`,
    naive: {
      title: 'Scan the whole array for the first and last match',
      description:
        'Walk every element, note the first time you see the target and keep updating the last. It works on unsorted data too, which is a sign it is not using the sorted order.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def first_last(nums, target):
    first = last = -1
    for i, x in enumerate(nums):
        if x == target:
            if first == -1:
                first = i
            last = i
    return [first, last]

print(first_last([1, 3, 5, 5, 5, 8], 5))  # [2, 4]`,
        javascript: `function firstLast(nums, target) {
  let first = -1;
  let last = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (first === -1) first = i;
      last = i;
    }
  }
  return [first, last];
}

console.log(firstLast([1, 3, 5, 5, 5, 8], 5)); // [2, 4]`,
        java: `import java.util.Arrays;

public class Solution {
  public static int[] firstLast(int[] nums, int target) {
    int first = -1;
    int last = -1;
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] == target) {
        if (first == -1) first = i;
        last = i;
      }
    }
    return new int[]{first, last};
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(firstLast(new int[]{1, 3, 5, 5, 5, 8}, 5))); // [2, 4]
  }
}`,
        cpp: `#include <iostream>
#include <vector>

std::vector<int> firstLast(const std::vector<int>& nums, int target) {
  int first = -1;
  int last = -1;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (nums[i] == target) {
      if (first == -1) first = i;
      last = i;
    }
  }
  return {first, last};
}

int main() {
  std::vector<int> r = firstLast({1, 3, 5, 5, 5, 8}, 5);
  std::cout << r[0] << ' ' << r[1] << std::endl; // 2 4
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Two boundary searches (lower bound and upper bound)',
      description:
        'Find the first index with value >= target and the first index with value > target. The first is the start; the second minus one is the end. Each search halves the range.',
      time: 'O(log n)',
      space: 'O(1)',
      code: {
        python: `def lower_bound(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] >= target:
            hi = mid
        else:
            lo = mid + 1
    return lo

def first_last(nums, target):
    first = lower_bound(nums, target)
    if first == len(nums) or nums[first] != target:
        return [-1, -1]
    last = lower_bound(nums, target + 1) - 1
    return [first, last]

print(first_last([1, 3, 5, 5, 5, 8], 5))  # [2, 4]`,
        javascript: `function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] >= target) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

function firstLast(nums, target) {
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = lowerBound(nums, target + 1) - 1;
  return [first, last];
}

console.log(firstLast([1, 3, 5, 5, 5, 8], 5)); // [2, 4]`,
        java: `import java.util.Arrays;

public class Solution {
  static int lowerBound(int[] nums, int target) {
    int lo = 0;
    int hi = nums.length;
    while (lo < hi) {
      int mid = lo + (hi - lo) / 2;
      if (nums[mid] >= target) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }

  public static int[] firstLast(int[] nums, int target) {
    int first = lowerBound(nums, target);
    if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
    int last = lowerBound(nums, target + 1) - 1;
    return new int[]{first, last};
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(firstLast(new int[]{1, 3, 5, 5, 5, 8}, 5))); // [2, 4]
  }
}`,
        cpp: `#include <iostream>
#include <vector>

int lowerBound(const std::vector<int>& nums, int target) {
  int lo = 0;
  int hi = nums.size();
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] >= target) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

std::vector<int> firstLast(const std::vector<int>& nums, int target) {
  int first = lowerBound(nums, target);
  if (first == (int)nums.size() || nums[first] != target) return {-1, -1};
  int last = lowerBound(nums, target + 1) - 1;
  return {first, last};
}

int main() {
  std::vector<int> r = firstLast({1, 3, 5, 5, 5, 8}, 5);
  std::cout << r[0] << ' ' << r[1] << std::endl; // 2 4
  return 0;
}`,
      },
    },
    whyFaster:
      'The scan touches every element because it does not trust the order. The boundary search knows that "value >= target" is false for a prefix and true for the rest, so each comparison discards half the range. Two such searches cost 2 * log n, which is still O(log n), versus O(n) for the scan.',
    keyPoints: [
      'Think of binary search as finding the first index where a yes/no condition becomes true.',
      'Boundary template: lo = 0, hi = n, while lo < hi, hi = mid when true, lo = mid + 1 when false.',
      'First occurrence is lower bound of target; last is lower bound of target + 1, minus one.',
      'Rotated arrays: one half around mid is always sorted; check if the target lies in it.',
      'Binary search on the answer: search over a numeric answer with a monotonic feasible(x) check.',
    ],
    patternIds: ['binary-search', 'binary-search-on-answer'],
    problems: [
      {
        id: 'find-first-and-last-position-of-element-in-sorted-array',
        title: 'Find First and Last Position of Element in Sorted Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
        patternId: 'binary-search',
        hint: 'Run lower bound for target and for target + 1; the answer is [first, second - 1].',
        xp: 40,
      },
      {
        id: 'find-minimum-in-rotated-sorted-array',
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
        patternId: 'binary-search',
        hint: 'Compare nums[mid] with nums[hi]: if mid is bigger, the minimum is to the right; otherwise it is at mid or left.',
        xp: 40,
      },
      {
        id: 'search-in-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        patternId: 'binary-search',
        hint: 'Decide which side of mid is sorted, then check whether the target falls inside that sorted side.',
        xp: 40,
      },
      {
        id: 'find-peak-element',
        title: 'Find Peak Element',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-peak-element/',
        patternId: 'binary-search',
        hint: 'If nums[mid] < nums[mid + 1] a peak exists to the right; otherwise one exists at mid or to the left.',
        xp: 40,
      },
      {
        id: 'koko-eating-bananas',
        title: 'Koko Eating Bananas',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/koko-eating-bananas/',
        patternId: 'binary-search-on-answer',
        hint: 'Binary search the speed from 1 to max pile; feasible(k) sums ceil(pile / k) and checks it fits in h hours.',
        xp: 40,
      },
      {
        id: 'capacity-to-ship-packages-within-d-days',
        title: 'Capacity To Ship Packages Within D Days',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/',
        patternId: 'binary-search-on-answer',
        hint: 'Search capacity from max(weight) to sum(weights); feasible(c) greedily counts how many days are needed.',
        xp: 40,
      },
      {
        id: 'median-of-two-sorted-arrays',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
        patternId: 'binary-search',
        hint: 'Binary search how many elements to take from the shorter array so that the left halves of both together form the lower half.',
        xp: 80,
      },
    ],
  },
  {
    id: 'sorting-basics',
    gateId: 'searching-sorting',
    order: 3,
    title: 'Sorting Basics: The Simple Sorts and When to Just Call sort()',
    minutes: 25,
    summary: 'Know how the O(n^2) sorts work, why library sort is O(n log n), and when a special structure lets you sort in O(n).',
    analogy:
      'Sorting a hand of playing cards, most people pick up each card and slide it into place among the cards already sorted. That is insertion sort. It is fine for a hand of 13 cards and hopeless for a deck of a million. Libraries use cleverer methods, and if the cards are numbered 1 to n you can just drop each one into its slot.',
    explanation: `Sorting is a step inside many solutions: sort then two-pointer, sort then binary search, sort then greedy. You will almost always call the built-in sort, but interviewers expect you to know what it costs, how the simple sorts work, and to spot when the data has structure that lets you beat O(n log n).

## The idea

- **Selection sort**: find the smallest element, swap it to the front, repeat for the rest. Always O(n^2).
- **Bubble sort**: repeatedly swap neighbours that are out of order. O(n^2).
- **Insertion sort**: take each element and slide it left into its sorted place. O(n^2) worst case, but O(n) on nearly sorted data.
- **Library sort** (Python's Timsort, Java's dual-pivot quicksort and Timsort, C++ introsort): **O(n log n)**. Use it unless you have a reason not to.
- **Counting sort**: when values are small integers in a known range 0..k, count how many of each value there are and write them out in order. **O(n + k)**.
- **Cyclic sort**: when the values are exactly 1..n (or 0..n - 1), every value has a home index. Swap each element to its home. O(n) and in place.

## A tiny example

Sort \`[4, 2, 2, 8, 3, 3, 1]\`, values known to be between 0 and 9.

The slow way is selection sort:

\`\`\`python
def selection_sort(nums):
    n = len(nums)
    for i in range(n):
        smallest = i
        for j in range(i + 1, n):
            if nums[j] < nums[smallest]:
                smallest = j
        nums[i], nums[smallest] = nums[smallest], nums[i]
\`\`\`

Nested loop: **O(n^2)**.

The fast way for this data is counting sort:

\`\`\`python
def counting_sort(nums, k):
    counts = [0] * (k + 1)
    for x in nums:
        counts[x] += 1
    i = 0
    for value in range(k + 1):
        for _ in range(counts[value]):
            nums[i] = value
            i += 1
\`\`\`

counts becomes [1, 0, 2, 2, 1, 0, 0, 0, 1, 0]. Writing them out gives [1, 2, 2, 3, 3, 4, 8]. **O(n + k)** time, O(k) space.

## Step by step: choosing a sort

1. Default: call the library sort. State that it is O(n log n).
2. Are the values small integers (like 0..2 for colours, or letters a..z)? Counting sort in O(n).
3. Are the values exactly 1..n with possible duplicates or one missing? Cyclic sort in O(n) and O(1) space.
4. Is the data nearly sorted? Insertion sort is O(n) in practice, and library sorts already handle this.
5. Do you need a custom order? Pass a key or comparator; the cost stays O(n log n).

## Where people go wrong

- Claiming a nested-loop sort is fine for n = 10^5. That is 10^10 steps.
- Sorting when you only need the max, min or the k-th item. A single pass or a heap is cheaper.
- Forgetting sort stability. Python and Java's object sort are stable (equal items keep their order); C++ \`std::sort\` is not, use \`std::stable_sort\`.
- Using counting sort with huge value ranges. If k is a billion, O(n + k) is worse than O(n log n).

## How to recognise it in an interview

- "Sort by frequency", "sort by custom rule" means library sort with a key.
- "Values are between 1 and n" or "0, 1 and 2 only" is a strong hint for cyclic or counting sort.
- "Find the missing / duplicate number without extra space" is cyclic sort.
- If a problem becomes easy once the input is sorted, sort it and check that O(n log n) fits the constraints.`,
    naive: {
      title: 'Selection sort: pick the smallest, swap it forward',
      description:
        'For each position, scan the rest of the array for the smallest value and swap it in. Easy to understand, but the inner scan runs for every position.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def selection_sort(nums):
    n = len(nums)
    for i in range(n):
        smallest = i
        for j in range(i + 1, n):
            if nums[j] < nums[smallest]:
                smallest = j
        nums[i], nums[smallest] = nums[smallest], nums[i]

a = [4, 2, 2, 8, 3, 3, 1]
selection_sort(a)
print(a)  # [1, 2, 2, 3, 3, 4, 8]`,
        javascript: `function selectionSort(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let smallest = i;
    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[smallest]) smallest = j;
    }
    [nums[i], nums[smallest]] = [nums[smallest], nums[i]];
  }
}

const a = [4, 2, 2, 8, 3, 3, 1];
selectionSort(a);
console.log(a); // [1, 2, 2, 3, 3, 4, 8]`,
        java: `import java.util.Arrays;

public class Solution {
  public static void selectionSort(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      int smallest = i;
      for (int j = i + 1; j < n; j++) {
        if (nums[j] < nums[smallest]) smallest = j;
      }
      int t = nums[i]; nums[i] = nums[smallest]; nums[smallest] = t;
    }
  }

  public static void main(String[] args) {
    int[] a = {4, 2, 2, 8, 3, 3, 1};
    selectionSort(a);
    System.out.println(Arrays.toString(a)); // [1, 2, 2, 3, 3, 4, 8]
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <utility>

void selectionSort(std::vector<int>& nums) {
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    int smallest = i;
    for (int j = i + 1; j < n; j++) {
      if (nums[j] < nums[smallest]) smallest = j;
    }
    std::swap(nums[i], nums[smallest]);
  }
}

int main() {
  std::vector<int> a = {4, 2, 2, 8, 3, 3, 1};
  selectionSort(a);
  for (int x : a) std::cout << x << ' '; // 1 2 2 3 3 4 8
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Counting sort for small integer ranges',
      description:
        'Count how many times each value from 0 to k appears, then write the values back out in order. No comparisons at all, just counting and writing.',
      time: 'O(n + k)',
      space: 'O(k)',
      code: {
        python: `def counting_sort(nums, k):
    counts = [0] * (k + 1)
    for x in nums:
        counts[x] += 1
    i = 0
    for value in range(k + 1):
        for _ in range(counts[value]):
            nums[i] = value
            i += 1

a = [4, 2, 2, 8, 3, 3, 1]
counting_sort(a, 9)
print(a)  # [1, 2, 2, 3, 3, 4, 8]`,
        javascript: `function countingSort(nums, k) {
  const counts = new Array(k + 1).fill(0);
  for (const x of nums) counts[x]++;
  let i = 0;
  for (let value = 0; value <= k; value++) {
    for (let c = 0; c < counts[value]; c++) {
      nums[i++] = value;
    }
  }
}

const a = [4, 2, 2, 8, 3, 3, 1];
countingSort(a, 9);
console.log(a); // [1, 2, 2, 3, 3, 4, 8]`,
        java: `import java.util.Arrays;

public class Solution {
  public static void countingSort(int[] nums, int k) {
    int[] counts = new int[k + 1];
    for (int x : nums) counts[x]++;
    int i = 0;
    for (int value = 0; value <= k; value++) {
      for (int c = 0; c < counts[value]; c++) {
        nums[i++] = value;
      }
    }
  }

  public static void main(String[] args) {
    int[] a = {4, 2, 2, 8, 3, 3, 1};
    countingSort(a, 9);
    System.out.println(Arrays.toString(a)); // [1, 2, 2, 3, 3, 4, 8]
  }
}`,
        cpp: `#include <iostream>
#include <vector>

void countingSort(std::vector<int>& nums, int k) {
  std::vector<int> counts(k + 1, 0);
  for (int x : nums) counts[x]++;
  int i = 0;
  for (int value = 0; value <= k; value++) {
    for (int c = 0; c < counts[value]; c++) {
      nums[i++] = value;
    }
  }
}

int main() {
  std::vector<int> a = {4, 2, 2, 8, 3, 3, 1};
  countingSort(a, 9);
  for (int x : a) std::cout << x << ' '; // 1 2 2 3 3 4 8
  return 0;
}`,
      },
    },
    whyFaster:
      'Selection sort compares every element with every other, which is O(n^2) no matter what the values are. Counting sort never compares elements; it uses the values as array indexes. One pass to count and one pass over the k + 1 slots to write, so O(n + k). When k is small relative to n this beats even O(n log n).',
    keyPoints: [
      'Selection, bubble and insertion sort are O(n^2); use them only to explain, not in real solutions.',
      'Library sort is O(n log n); call it and say so.',
      'Counting sort is O(n + k) when values are small integers in a known range.',
      'Cyclic sort places values 1..n at their home index in O(n) and O(1) space; great for missing/duplicate number problems.',
      'Do not sort when you only need a max, min or k-th element.',
    ],
    patternIds: ['cyclic-sort', 'two-pointers', 'brute-force'],
    problems: [
      {
        id: 'height-checker',
        title: 'Height Checker',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/height-checker/',
        patternId: 'brute-force',
        hint: 'Compare each position with a sorted copy; heights are small so counting sort gives O(n).',
        xp: 20,
      },
      {
        id: 'merge-sorted-array',
        title: 'Merge Sorted Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/merge-sorted-array/',
        patternId: 'two-pointers',
        hint: 'Fill from the back of nums1 so you never overwrite values you still need.',
        xp: 20,
      },
      {
        id: 'sort-array-by-parity',
        title: 'Sort Array By Parity',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/sort-array-by-parity/',
        patternId: 'two-pointers',
        hint: 'One pointer for the next even slot, one scanning; swap evens forward in a single pass.',
        xp: 20,
      },
      {
        id: 'relative-sort-array',
        title: 'Relative Sort Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/relative-sort-array/',
        patternId: 'hash-map',
        hint: 'Count values of arr1, output them in arr2 order, then output the leftovers in ascending order.',
        xp: 20,
      },
      {
        id: 'set-mismatch',
        title: 'Set Mismatch',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/set-mismatch/',
        patternId: 'cyclic-sort',
        hint: 'Swap each value to index value - 1; afterwards the index that holds the wrong value reveals both numbers.',
        xp: 20,
      },
      {
        id: 'first-missing-positive',
        title: 'First Missing Positive',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/first-missing-positive/',
        patternId: 'cyclic-sort',
        hint: 'Only values 1..n matter; cyclic-sort them into place, then the first index whose value is wrong is the answer.',
        xp: 80,
      },
    ],
  },
  {
    id: 'merge-sort',
    gateId: 'searching-sorting',
    order: 4,
    title: 'Merge Sort: Split in Half, Sort Each Half, Merge',
    minutes: 30,
    summary: 'Merge sort divides the array in half recursively and merges sorted halves with two pointers, giving a guaranteed O(n log n) and a template for counting inversions.',
    analogy:
      'Two friends each sort half a pile of exam papers by student number. Then they merge: each looks at the top paper of their pile and whoever has the smaller number puts it on the final stack. Merging two sorted piles is easy; the trick is that the halves themselves were sorted the same way.',
    explanation: `Merge sort is the cleanest example of divide and conquer: split the problem in half, solve each half, combine. It always runs in O(n log n), it is stable, and the merge step is reused in problems about counting pairs across halves. If you can write merge sort from memory, you understand recursion, two pointers and complexity analysis all at once.

## The idea

- **Divide**: split the array into a left half and a right half.
- **Conquer**: recursively sort each half. An array of size 0 or 1 is already sorted.
- **Combine**: merge the two sorted halves with two pointers, always taking the smaller front element.

There are log n levels of splitting, and merging all pieces at one level costs O(n). Total: **O(n log n)**. The merge needs a temporary array, so space is O(n).

## A tiny example

Sort \`[5, 2, 4, 7, 1, 3]\`.

- Split: [5, 2, 4] and [7, 1, 3].
- Split again: [5] [2, 4] and [7] [1, 3]. Sorting [2, 4] and [1, 3] gives themselves.
- Merge up: [5] + [2, 4] = [2, 4, 5]. [7] + [1, 3] = [1, 3, 7].
- Final merge: [2, 4, 5] + [1, 3, 7]. Compare 2 vs 1 take 1; 2 vs 3 take 2; 4 vs 3 take 3; 4 vs 7 take 4; 5 vs 7 take 5; then 7. Result [1, 2, 3, 4, 5, 7].

\`\`\`python
def merge_sort(nums):
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged
\`\`\`

Compare with insertion sort, which slides each element into place among the earlier ones. On reversed input every element travels all the way left: **O(n^2)**.

## Step by step: the merge

1. Two pointers i and j at the start of left and right.
2. While both have elements, append the smaller and advance that pointer. Use \`<=\` so equal elements from the left go first (stability).
3. Append whatever is left over from either side.
4. The merge is O(len(left) + len(right)).

## Why the merge step matters beyond sorting

While merging, when you take an element from the right before some elements on the left, you have found pairs (left element, right element) that are "out of order". Counting them gives the number of inversions in O(n log n). Problems like Reverse Pairs and Count of Smaller Numbers After Self are exactly this.

## Where people go wrong

- Forgetting the base case (size 0 or 1) and recursing forever.
- Slicing lists in Python at every level. It is fine for interviews, but mention that an index-based version with one temp array avoids the extra copies.
- Using \`<\` instead of \`<=\` when merging, which breaks stability.
- Assuming merge sort is in place. It needs O(n) extra space; quick sort is the in-place option.

## How to recognise it in an interview

- "Sort a linked list in O(n log n)" points to merge sort, since lists split and merge cheaply.
- "Count pairs where i < j and nums[i] > c * nums[j]" is a merge-step counting problem.
- "Merge k sorted lists" reuses the merge step with a heap.
- The interviewer asks for a sort with guaranteed O(n log n) or a stable sort.`,
    naive: {
      title: 'Insertion sort: slide each element into place',
      description:
        'Grow a sorted prefix by taking the next element and shifting it left until it fits. On reversed input every element travels the full distance.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def insertion_sort(nums):
    for i in range(1, len(nums)):
        x = nums[i]
        j = i - 1
        while j >= 0 and nums[j] > x:
            nums[j + 1] = nums[j]
            j -= 1
        nums[j + 1] = x

a = [5, 2, 4, 7, 1, 3]
insertion_sort(a)
print(a)  # [1, 2, 3, 4, 5, 7]`,
        javascript: `function insertionSort(nums) {
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    let j = i - 1;
    while (j >= 0 && nums[j] > x) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = x;
  }
}

const a = [5, 2, 4, 7, 1, 3];
insertionSort(a);
console.log(a); // [1, 2, 3, 4, 5, 7]`,
        java: `import java.util.Arrays;

public class Solution {
  public static void insertionSort(int[] nums) {
    for (int i = 1; i < nums.length; i++) {
      int x = nums[i];
      int j = i - 1;
      while (j >= 0 && nums[j] > x) {
        nums[j + 1] = nums[j];
        j--;
      }
      nums[j + 1] = x;
    }
  }

  public static void main(String[] args) {
    int[] a = {5, 2, 4, 7, 1, 3};
    insertionSort(a);
    System.out.println(Arrays.toString(a)); // [1, 2, 3, 4, 5, 7]
  }
}`,
        cpp: `#include <iostream>
#include <vector>

void insertionSort(std::vector<int>& nums) {
  for (int i = 1; i < (int)nums.size(); i++) {
    int x = nums[i];
    int j = i - 1;
    while (j >= 0 && nums[j] > x) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = x;
  }
}

int main() {
  std::vector<int> a = {5, 2, 4, 7, 1, 3};
  insertionSort(a);
  for (int x : a) std::cout << x << ' '; // 1 2 3 4 5 7
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Merge sort: divide, sort halves, merge with two pointers',
      description:
        'Recursively split until pieces have one element, then merge sorted pieces back together. Each level of merging touches every element once and there are log n levels.',
      time: 'O(n log n)',
      space: 'O(n)',
      code: {
        python: `def merge_sort(nums):
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

print(merge_sort([5, 2, 4, 7, 1, 3]))  # [1, 2, 3, 4, 5, 7]`,
        javascript: `function mergeSort(nums) {
  if (nums.length <= 1) return nums;
  const mid = Math.floor(nums.length / 2);
  const left = mergeSort(nums.slice(0, mid));
  const right = mergeSort(nums.slice(mid));
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++]);
    else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}

console.log(mergeSort([5, 2, 4, 7, 1, 3])); // [1, 2, 3, 4, 5, 7]`,
        java: `import java.util.Arrays;

public class Solution {
  public static void mergeSort(int[] a, int[] tmp, int lo, int hi) {
    if (hi - lo <= 1) return;
    int mid = (lo + hi) / 2;
    mergeSort(a, tmp, lo, mid);
    mergeSort(a, tmp, mid, hi);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
      tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    }
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    for (int t = lo; t < hi; t++) a[t] = tmp[t];
  }

  public static void main(String[] args) {
    int[] a = {5, 2, 4, 7, 1, 3};
    mergeSort(a, new int[a.length], 0, a.length);
    System.out.println(Arrays.toString(a)); // [1, 2, 3, 4, 5, 7]
  }
}`,
        cpp: `#include <iostream>
#include <vector>

void mergeSort(std::vector<int>& a, std::vector<int>& tmp, int lo, int hi) {
  if (hi - lo <= 1) return;
  int mid = (lo + hi) / 2;
  mergeSort(a, tmp, lo, mid);
  mergeSort(a, tmp, mid, hi);
  int i = lo, j = mid, k = lo;
  while (i < mid && j < hi) {
    tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
  }
  while (i < mid) tmp[k++] = a[i++];
  while (j < hi) tmp[k++] = a[j++];
  for (int t = lo; t < hi; t++) a[t] = tmp[t];
}

int main() {
  std::vector<int> a = {5, 2, 4, 7, 1, 3};
  std::vector<int> tmp(a.size());
  mergeSort(a, tmp, 0, a.size());
  for (int x : a) std::cout << x << ' '; // 1 2 3 4 5 7
  return 0;
}`,
      },
    },
    whyFaster:
      'Insertion sort moves each element one slot at a time, so an element can travel up to n slots and the total is O(n^2). Merge sort moves elements in bulk: each merge level is a single O(n) pass, and halving means there are only log n levels. O(n) times log n is O(n log n), at the cost of a temporary array.',
    keyPoints: [
      'Divide in half, sort each half recursively, merge with two pointers.',
      'log n levels times O(n) merging per level gives O(n log n), always, regardless of input order.',
      'Use <= in the merge so it stays stable; needs O(n) extra space.',
      'The merge step can count inversions (pairs out of order) across the two halves.',
      'Best choice for linked lists and whenever a guaranteed O(n log n) is required.',
    ],
    patternIds: ['divide-and-conquer', 'two-pointers', 'recursion'],
    problems: [
      {
        id: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        patternId: 'two-pointers',
        hint: 'This is the merge step alone: keep a tail pointer and attach the smaller head each time.',
        xp: 20,
      },
      {
        id: 'sort-an-array',
        title: 'Sort an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-an-array/',
        patternId: 'divide-and-conquer',
        hint: 'Implement merge sort by hand; the judge rejects O(n^2) solutions.',
        xp: 40,
      },
      {
        id: 'sort-list',
        title: 'Sort List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-list/',
        patternId: 'divide-and-conquer',
        hint: 'Find the middle with slow and fast pointers, sort both halves, merge the two lists.',
        xp: 40,
      },
      {
        id: 'reverse-pairs',
        title: 'Reverse Pairs',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/reverse-pairs/',
        patternId: 'divide-and-conquer',
        hint: 'Before merging two sorted halves, count pairs with left > 2 * right using two pointers, then merge normally.',
        xp: 80,
      },
      {
        id: 'count-of-smaller-numbers-after-self',
        title: 'Count of Smaller Numbers After Self',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/',
        patternId: 'divide-and-conquer',
        hint: 'Merge sort pairs of (value, original index); when taking from the left, add how many right elements have already been taken.',
        xp: 80,
      },
    ],
  },
  {
    id: 'quick-sort',
    gateId: 'searching-sorting',
    order: 5,
    title: 'Quick Sort: Partition Around a Pivot',
    minutes: 30,
    summary: 'Quick sort picks a pivot, moves smaller items to its left and larger to its right in place, then sorts both sides; the same partition step powers quickselect for k-th largest problems.',
    analogy:
      'Sorting a crowd by height, you pick one person as the reference and ask everyone shorter to stand on the left and everyone taller on the right. The reference person is now in their final spot. Repeat inside each group. If you keep picking the shortest person as the reference, it takes forever; pick someone random and it goes fast.',
    explanation: `Quick sort is the sort most libraries build on because it is fast in practice and needs no extra array. Its heart is the **partition** step, which places one element in its final position and splits the rest into "smaller" and "larger". Learn partition once and you get quick sort, quickselect and the Dutch national flag problem for free.

## The idea

- Pick a **pivot** value.
- **Partition**: rearrange in place so everything less than the pivot is on its left and everything greater is on its right. The pivot lands in its final sorted spot.
- Recursively quick sort the left part and the right part.

If the pivot splits the array roughly in half each time there are log n levels and each level does O(n) work: **O(n log n)** on average. If the pivot is always the smallest or largest element, one side is empty and the other has n - 1 items, giving n levels: **O(n^2)** worst case.

## A tiny example

Sort \`[3, 8, 2, 5, 1, 4]\` with pivot = last element 4.

Walk with a "store" index that marks where the next small element goes:

- 3 < 4, swap into store, store = 1.
- 8, skip. 2 < 4, swap with position 1: [3, 2, 8, 5, 1, 4], store = 2.
- 5, skip. 1 < 4, swap with position 2: [3, 2, 1, 5, 8, 4], store = 3.
- Put pivot at store: [3, 2, 1, 4, 8, 5]. 4 is now final.

Recurse on [3, 2, 1] and [8, 5].

\`\`\`python
import random

def quick_sort(a, lo, hi):
    if lo >= hi:
        return
    p = random.randint(lo, hi)            # random pivot
    a[p], a[hi] = a[hi], a[p]
    store = lo
    for i in range(lo, hi):
        if a[i] < a[hi]:
            a[i], a[store] = a[store], a[i]
            store += 1
    a[store], a[hi] = a[hi], a[store]
    quick_sort(a, lo, store - 1)
    quick_sort(a, store + 1, hi)
\`\`\`

## The pivot problem

Always choosing the first or last element is the slow way. On already-sorted input every partition puts everything on one side. n levels times O(n) is O(n^2), and sorted input is common in real data. Choosing a **random** pivot (or the median of three) makes a bad split unlikely at every level, so the expected time is O(n log n).

## Quickselect: the k-th largest in O(n)

Partition once. If the pivot lands at the index you want, done. Otherwise recurse only into the side that contains it. Because you throw away half the array on average each time, the work is n + n/2 + n/4 + ... = **O(n)** on average. This beats sorting (O(n log n)) and even a heap (O(n log k)) for "k-th largest element" questions.

## Step by step: the Lomuto partition

1. Move the chosen pivot to the end.
2. \`store = lo\`. For each i from lo to hi - 1: if \`a[i] < pivot\`, swap a[i] with a[store] and increment store.
3. Swap the pivot into position store. Return store.

## Where people go wrong

- Fixed pivot on sorted or nearly sorted input. Mention random pivot in interviews.
- Recursing on the wrong ranges after partition: it is [lo, store - 1] and [store + 1, hi], never including the pivot again.
- Assuming quick sort is stable. It is not; equal elements can swap order.
- Deep recursion on huge inputs. Randomised pivot keeps depth about log n; libraries also switch to heap sort if it gets too deep.

## How to recognise it in an interview

- "K-th largest / smallest element" or "top k" with n large: quickselect gives O(n) average.
- "Sort colours" or "partition array around a value" is the partition step by itself.
- The interviewer asks to sort in place with O(log n) extra space.
- "Explain the worst case of quick sort" is asking about pivot choice.`,
    naive: {
      title: 'Quick sort with a fixed pivot (last element)',
      description:
        'Always use the last element as the pivot. On random data this is fine, but on sorted or reversed input every partition is lopsided and the recursion depth becomes n.',
      time: 'O(n^2) worst case, O(n log n) average',
      space: 'O(n) worst-case recursion depth',
      code: {
        python: `def quick_sort(a, lo, hi):
    if lo >= hi:
        return
    pivot = a[hi]
    store = lo
    for i in range(lo, hi):
        if a[i] < pivot:
            a[i], a[store] = a[store], a[i]
            store += 1
    a[store], a[hi] = a[hi], a[store]
    quick_sort(a, lo, store - 1)
    quick_sort(a, store + 1, hi)

arr = [3, 8, 2, 5, 1, 4]
quick_sort(arr, 0, len(arr) - 1)
print(arr)  # [1, 2, 3, 4, 5, 8]`,
        javascript: `function quickSort(a, lo, hi) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let store = lo;
  for (let i = lo; i < hi; i++) {
    if (a[i] < pivot) {
      [a[i], a[store]] = [a[store], a[i]];
      store++;
    }
  }
  [a[store], a[hi]] = [a[hi], a[store]];
  quickSort(a, lo, store - 1);
  quickSort(a, store + 1, hi);
}

const arr = [3, 8, 2, 5, 1, 4];
quickSort(arr, 0, arr.length - 1);
console.log(arr); // [1, 2, 3, 4, 5, 8]`,
        java: `import java.util.Arrays;

public class Solution {
  static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

  public static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi];
    int store = lo;
    for (int i = lo; i < hi; i++) {
      if (a[i] < pivot) swap(a, i, store++);
    }
    swap(a, store, hi);
    quickSort(a, lo, store - 1);
    quickSort(a, store + 1, hi);
  }

  public static void main(String[] args) {
    int[] arr = {3, 8, 2, 5, 1, 4};
    quickSort(arr, 0, arr.length - 1);
    System.out.println(Arrays.toString(arr)); // [1, 2, 3, 4, 5, 8]
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <utility>

void quickSort(std::vector<int>& a, int lo, int hi) {
  if (lo >= hi) return;
  int pivot = a[hi];
  int store = lo;
  for (int i = lo; i < hi; i++) {
    if (a[i] < pivot) std::swap(a[i], a[store++]);
  }
  std::swap(a[store], a[hi]);
  quickSort(a, lo, store - 1);
  quickSort(a, store + 1, hi);
}

int main() {
  std::vector<int> arr = {3, 8, 2, 5, 1, 4};
  quickSort(arr, 0, arr.size() - 1);
  for (int x : arr) std::cout << x << ' '; // 1 2 3 4 5 8
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Quick sort with a random pivot',
      description:
        'Swap a randomly chosen element into the pivot position before partitioning. No fixed input pattern can force lopsided splits, so the expected depth is about log n and the expected time is O(n log n).',
      time: 'O(n log n) expected',
      space: 'O(log n) expected recursion depth',
      code: {
        python: `import random

def quick_sort(a, lo, hi):
    if lo >= hi:
        return
    p = random.randint(lo, hi)
    a[p], a[hi] = a[hi], a[p]
    pivot = a[hi]
    store = lo
    for i in range(lo, hi):
        if a[i] < pivot:
            a[i], a[store] = a[store], a[i]
            store += 1
    a[store], a[hi] = a[hi], a[store]
    quick_sort(a, lo, store - 1)
    quick_sort(a, store + 1, hi)

arr = [3, 8, 2, 5, 1, 4]
quick_sort(arr, 0, len(arr) - 1)
print(arr)  # [1, 2, 3, 4, 5, 8]`,
        javascript: `function quickSort(a, lo, hi) {
  if (lo >= hi) return;
  const p = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[p], a[hi]] = [a[hi], a[p]];
  const pivot = a[hi];
  let store = lo;
  for (let i = lo; i < hi; i++) {
    if (a[i] < pivot) {
      [a[i], a[store]] = [a[store], a[i]];
      store++;
    }
  }
  [a[store], a[hi]] = [a[hi], a[store]];
  quickSort(a, lo, store - 1);
  quickSort(a, store + 1, hi);
}

const arr = [3, 8, 2, 5, 1, 4];
quickSort(arr, 0, arr.length - 1);
console.log(arr); // [1, 2, 3, 4, 5, 8]`,
        java: `import java.util.Arrays;
import java.util.Random;

public class Solution {
  static final Random RNG = new Random();
  static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

  public static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int p = lo + RNG.nextInt(hi - lo + 1);
    swap(a, p, hi);
    int pivot = a[hi];
    int store = lo;
    for (int i = lo; i < hi; i++) {
      if (a[i] < pivot) swap(a, i, store++);
    }
    swap(a, store, hi);
    quickSort(a, lo, store - 1);
    quickSort(a, store + 1, hi);
  }

  public static void main(String[] args) {
    int[] arr = {3, 8, 2, 5, 1, 4};
    quickSort(arr, 0, arr.length - 1);
    System.out.println(Arrays.toString(arr)); // [1, 2, 3, 4, 5, 8]
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <utility>
#include <cstdlib>

void quickSort(std::vector<int>& a, int lo, int hi) {
  if (lo >= hi) return;
  int p = lo + std::rand() % (hi - lo + 1);
  std::swap(a[p], a[hi]);
  int pivot = a[hi];
  int store = lo;
  for (int i = lo; i < hi; i++) {
    if (a[i] < pivot) std::swap(a[i], a[store++]);
  }
  std::swap(a[store], a[hi]);
  quickSort(a, lo, store - 1);
  quickSort(a, store + 1, hi);
}

int main() {
  std::vector<int> arr = {3, 8, 2, 5, 1, 4};
  quickSort(arr, 0, arr.size() - 1);
  for (int x : arr) std::cout << x << ' '; // 1 2 3 4 5 8
  return 0;
}`,
      },
    },
    whyFaster:
      'Both versions do the same O(n) partition per level; the difference is how many levels there are. A fixed pivot on sorted input peels off one element per level, giving n levels and O(n^2). A random pivot splits the range near the middle on average, so there are about log n levels and the expected total is O(n log n). Randomness removes the predictable worst case.',
    keyPoints: [
      'Partition puts the pivot in its final place with smaller items left and larger items right, in O(n) and in place.',
      'Average O(n log n); worst case O(n^2) when pivots are consistently bad (fixed pivot on sorted data).',
      'Use a random pivot or median-of-three to make the worst case extremely unlikely.',
      'Quickselect reuses partition to find the k-th largest in O(n) average by recursing into one side only.',
      'Not stable; recursion depth is O(log n) expected. Merge sort is the stable, guaranteed alternative.',
    ],
    patternIds: ['divide-and-conquer', 'two-pointers', 'top-k-heap'],
    problems: [
      {
        id: 'sort-colors',
        title: 'Sort Colors',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-colors/',
        patternId: 'two-pointers',
        hint: 'Three-way partition around the value 1: a low boundary for 0s, a high boundary for 2s, one scan.',
        xp: 40,
      },
      {
        id: 'partition-array-according-to-given-pivot',
        title: 'Partition Array According to Given Pivot',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/partition-array-according-to-given-pivot/',
        patternId: 'two-pointers',
        hint: 'Order must be preserved within groups, so collect less, equal and greater in three passes or lists and concatenate.',
        xp: 40,
      },
      {
        id: 'kth-largest-element-in-an-array',
        title: 'Kth Largest Element in an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        patternId: 'divide-and-conquer',
        hint: 'Quickselect: partition, then recurse only into the side that contains index n - k.',
        xp: 40,
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
        patternId: 'top-k-heap',
        hint: 'Count frequencies, then quickselect (or a heap of size k) on the unique values by frequency.',
        xp: 40,
      },
      {
        id: 'k-closest-points-to-origin',
        title: 'K Closest Points to Origin',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
        patternId: 'top-k-heap',
        hint: 'Partition points by squared distance with quickselect until the first k are the closest; no need to sort them.',
        xp: 40,
      },
    ],
  },
]
