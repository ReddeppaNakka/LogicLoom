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
    definition:
      'Linear search checks elements one at a time until it finds the target. Binary search works only on sorted data: it keeps a window that must contain the target and throws away half of that window with every comparison.',
    coreIdea:
      'In sorted data one comparison tells you far more than "this is not it". Comparing the target with the middle value proves that an entire half is wrong, because everything on that side is either all too small or all too big. Since we never have to look at that half again, the number of steps is just the number of times n can be halved, so O(n) collapses to O(log n).',
    visual: [
      {
        caption: 'Invariant: if 38 is present it lies inside the closed window [lo, hi]. Start with the whole array.',
        frame: [
          'target = 38',
          '[  2  5  8 12 16 23 38 56 ]',
          '   L                    H     lo=0  hi=7',
          '            M                 mid=3  a[3]=12',
          '12 < 38  ->  mid and everything left of it is too small',
        ].join('\n'),
      },
      {
        caption: 'lo = mid + 1. Indexes 0 to 3 are discarded and never looked at again.',
        frame: [
          '[  x  x  x  x 16 23 38 56 ]',
          '               L        H     lo=4  hi=7',
          '                  M           mid=5  a[5]=23',
          '23 < 38  ->  move lo past mid again, lo = 6',
        ].join('\n'),
      },
      {
        caption: 'Two cells left. mid rounds down, so mid lands on lo. The window still contains the target.',
        frame: [
          '[  x  x  x  x  x  x 38 56 ]',
          '                     L  H     lo=6  hi=7',
          '                     M        mid=6  a[6]=38',
          'a[mid] equals the target  ->  return 6',
          '3 comparisons for 8 items, not 7',
        ].join('\n'),
      },
      {
        caption: 'Same array, searching for 30, which is absent. The window shrinks until lo passes hi.',
        frame: [
          '[  x  x  x  x  x  x 38 56 ]',
          '                     L  H     lo=6  hi=7',
          '                     M        mid=6  a[6]=38 > 30',
          'hi = mid - 1 = 5, so now lo=6 and hi=5',
          'lo > hi, the window is empty  ->  return -1',
        ].join('\n'),
      },
      {
        caption: 'The other form. Do not ask "where is 20"; ask "where does the yes/no test first turn true".',
        frame: [
          '[  2  5  8 12 16 23 38 56 ]',
          '   F  F  F  F  F  T  T  T   cond(i): a[i] >= 20',
          '   L                       H  lo=0  hi=8 = n',
          '            M                 mid=3  F  ->  lo = 4',
        ].join('\n'),
      },
      {
        caption: 'When the test is true we set hi = mid, not mid - 1, because mid itself may be the first true. The loop runs while lo < hi.',
        frame: [
          '[  x  x  x  x 16 23 38 56 ]',
          '               F  T  T  T   cond(i)',
          '               L           H  lo=4  hi=8',
          '                  M           mid=5  T  ->  hi = mid',
          'then lo=4 hi=5, mid=4, F -> lo=5; lo == hi, stop',
          'answer: first index with a[i] >= 20 is 5',
        ].join('\n'),
      },
    ],
    pseudocode: `function binarySearchExact(a, target):
    lo = 0
    hi = length(a) - 1              // both ends are inside the window
    while lo <= hi:                 // lo > hi means the window is empty
        mid = lo + (hi - lo) / 2    // integer division, rounds down
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1            // mid is too small, drop it
        else:
            hi = mid - 1            // mid is too big, drop it
    return -1

function lowerBound(a, target):
    lo = 0
    hi = length(a)                  // hi is one past the last index
    while lo < hi:
        mid = lo + (hi - lo) / 2
        if a[mid] >= target:
            hi = mid                // mid may be the answer, keep it
        else:
            lo = mid + 1
    return lo                       // first index with a[i] >= target`,
    complexity: [
      { label: 'Linear search, worst case', time: 'O(n)', space: 'O(1)', note: 'no order to exploit, so every cell may be checked' },
      { label: 'Binary search, best case', time: 'O(1)', space: 'O(1)', note: 'the very first mid is the target' },
      { label: 'Binary search, worst case', time: 'O(log n)', space: 'O(1)', note: 'about log2(n) + 1 comparisons before the window empties' },
      { label: 'Binary search, average case', time: 'O(log n)', space: 'O(1)', note: 'still logarithmic; only the constant changes' },
      { label: 'Recursive binary search', time: 'O(log n)', space: 'O(log n)', note: 'one stack frame per level of halving' },
    ],
    dryRun: {
      input: 'nums = [1, 3, 5, 7, 9, 11, 13], target = 13',
      goal: 'Find the index of 13, or -1 if it is not there, using the optimized binary_search above.',
      steps: [
        { state: 'lo=0 hi=6 target=13', action: 'The window is the whole array. lo <= hi, so the loop body runs.' },
        { state: 'lo=0 hi=6 mid=3 nums[mid]=7', action: 'mid = (0 + 6) // 2 = 3 and nums[3] is 7, which is not 13.' },
        { state: 'lo=0 hi=6 mid=3', action: '7 < 13, so 13 cannot sit at index 3 or below. Set lo = mid + 1 = 4.' },
        { state: 'lo=4 hi=6', action: 'lo is still not past hi, so the window [4, 6] may hold 13. Loop again.' },
        { state: 'lo=4 hi=6 mid=5 nums[mid]=11', action: 'mid = (4 + 6) // 2 = 5 and nums[5] is 11, not 13, and 11 < 13, so lo becomes 6.' },
        { state: 'lo=6 hi=6', action: 'A one-cell window. lo <= hi still holds, and mid = (6 + 6) // 2 = 6.' },
        { state: 'lo=6 hi=6 mid=6 nums[mid]=13', action: 'nums[6] equals the target, so the function returns 6 straight away.' },
      ],
      result:
        'The answer is 6. It is right because nums[6] is 13, and every index that was thrown away was ruled out by a comparison proving the values there were too small.',
    },
    mistakes: [
      {
        mistake: 'Writing while lo < hi while hi starts at n - 1 in the exact-match version.',
        why: 'When the window shrinks to one cell, lo equals hi, the loop stops, and that last cell is never tested. A target sitting there is reported as missing.',
        fix: 'Use while lo <= hi with hi = n - 1, or switch entirely to the half-open form with hi = n and while lo < hi. Do not mix them.',
      },
      {
        mistake: 'Writing lo = mid instead of lo = mid + 1.',
        why: 'mid rounds down, so with two cells left mid equals lo. Setting lo = mid changes nothing, the window never shrinks, and the loop spins forever.',
        fix: 'Every branch must make the window strictly smaller. In the closed form always use lo = mid + 1 and hi = mid - 1.',
      },
      {
        mistake: 'Using hi = mid - 1 inside the lower-bound version.',
        why: 'mid itself may be the first index where the condition turns true, so subtracting one throws the answer away and the search returns a position that is too far right.',
        fix: 'In the first-true form use hi = mid, and keep the loop condition as lo < hi so it still terminates.',
      },
      {
        mistake: 'Computing mid as (lo + hi) / 2 in Java or C++ with very large indexes.',
        why: 'lo + hi can pass the 32-bit signed limit and wrap to a negative number, which then indexes outside the array.',
        fix: 'Write mid = lo + (hi - lo) / 2. Python integers never overflow, but keeping the habit costs nothing.',
      },
      {
        mistake: 'Running binary search on data that is not sorted, or sorting inside the search function on every call.',
        why: 'Without order the halving rule is meaningless and the result is arbitrary. Sorting per call costs O(n log n) and destroys the whole point of an O(log n) search.',
        fix: 'Sort once outside the function, or use a hash set when you only need membership on unsorted data.',
      },
    ],
    whenToUse: [
      'The statement says the input is sorted, non-decreasing, or already in order.',
      'n is large (10^5 or more) and each query must answer in about O(log n).',
      'You will search the same array many times, so one O(n log n) sort pays for itself.',
      'The question asks for a position in an ordered sequence, such as where a value would be inserted.',
      'You can define a yes/no test on indexes that is false for a prefix and true afterwards.',
    ],
    whenNotToUse: [
      'The array is unsorted and you need one single lookup; a plain O(n) scan beats sorting first.',
      'You only need membership on unsorted data with no order requirement, so use a hash set for O(1) average lookups.',
      'The data is a linked list, where you cannot jump to the middle in O(1); use a hash map or copy into an array first.',
      'n is tiny, under about 30, where a linear scan is just as fast and far harder to get wrong.',
      'The yes/no property flips back and forth instead of switching once, so no halving rule is valid; scan the range instead.',
    ],
    relatedTopics: [
      { id: 'binary-search-variants', kind: 'concept', why: 'It reuses this exact window idea to find boundaries and to search over candidate answers.' },
      { id: 'binary-search', kind: 'pattern', why: 'This concept is the canonical implementation of that pattern.' },
      { id: 'sorting-basics', kind: 'concept', why: 'Binary search needs sorted input, and getting there costs O(n log n) up front.' },
      { id: 'hash-map', kind: 'pattern', why: 'The alternative when the data is unsorted and you only need to test membership.' },
    ],
    quiz: [
      {
        question: 'A sorted array has 1,000,000 items. Roughly how many comparisons does binary search need in the worst case?',
        options: ['About 20', 'About 1,000', 'About 500,000', 'About 1,000,000'],
        answerIndex: 0,
        explanation: 'Each comparison halves the window, so the count is log2(1,000,000), which is just under 20.',
      },
      {
        question: 'You must answer exactly one "is x in this unsorted array of 10,000 numbers" question. What is fastest overall?',
        options: [
          'Sort the array, then binary search it',
          'Scan the array once',
          'Build a balanced search tree, then search it',
          'Run binary search on the unsorted array',
        ],
        answerIndex: 1,
        explanation: 'Sorting costs O(n log n) just to save a single O(n) scan, and binary search on unsorted data is simply incorrect.',
      },
      {
        question: 'In the closed-window version, why must the "too small" branch write lo = mid + 1 rather than lo = mid?',
        options: [
          'To keep the search stable',
          'Because mid has already been tested, and lo = mid can leave the window the same size forever',
          'To avoid integer overflow',
          'Because the array might contain duplicates',
        ],
        answerIndex: 1,
        explanation: 'mid rounds down, so with two cells left mid equals lo. Writing lo = mid leaves lo and hi unchanged and the loop never ends.',
      },
      {
        question: 'In the lower-bound version, what does the returned lo mean when no element satisfies the condition?',
        options: ['It is -1', 'It equals n, one past the last index', 'It equals n - 1', 'It is undefined'],
        answerIndex: 1,
        explanation: 'hi starts at n, so if every element fails the test lo climbs all the way to n. That is the standard "nothing qualifies" signal for this form.',
      },
      {
        question: 'How much extra space does the iterative binary search shown here use?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answerIndex: 0,
        explanation: 'It keeps only lo, hi and mid. The recursive version would add O(log n) for the call stack.',
      },
    ],
    sources: [
      'MIT 6.006: searching and sorted arrays',
      'CLRS ch. 2, including the binary search exercise',
      'CP-Algorithms: Binary search',
      'USACO Guide: Binary Search',
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
        tier: 'beginner',
      },
      {
        id: 'search-insert-position',
        title: 'Search Insert Position',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/search-insert-position/',
        patternId: 'binary-search',
        hint: 'When the loop ends without a match, lo is exactly where the target would be inserted.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'first-bad-version',
        title: 'First Bad Version',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/first-bad-version/',
        patternId: 'binary-search',
        hint: 'Versions look like [good, good, bad, bad]; find the first bad by keeping hi on a bad version.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'sqrtx',
        title: 'Sqrt(x)',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/sqrtx/',
        patternId: 'binary-search',
        hint: 'Binary search the answer between 0 and x: find the largest m with m * m <= x.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'valid-perfect-square',
        title: 'Valid Perfect Square',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-perfect-square/',
        patternId: 'binary-search',
        hint: 'Search 1..num for an m with m * m == num; use long arithmetic to avoid overflow.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'search-a-2d-matrix',
        title: 'Search a 2D Matrix',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/search-a-2d-matrix/',
        patternId: 'binary-search',
        hint: 'Treat the matrix as one sorted list of rows * cols items; index i maps to row i / cols and column i % cols.',
        xp: 40,
        tier: 'advanced',
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
    definition:
      'A family of binary searches that look for a boundary instead of an exact value: the first index, or the first candidate answer, where a yes/no test turns true. The range being searched may be a sorted array, a rotated sorted array, or an imaginary list of possible answers.',
    coreIdea:
      'Binary search does not actually need a sorted array. It needs a test that is false for a while along the range and then true forever after. Because the test never flips back, one probe in the middle proves which side the switch point is on, so half the range disappears. Any quantity whose feasibility is monotonic can be searched this way, even when the input itself has no order at all.',
    visual: [
      {
        caption: 'Rewrite the question as a yes/no test on each index. For "first index with value >= 5" the pattern is F F T T T T.',
        frame: [
          'question: first i with a[i] >= 5',
          '[  1  3  5  5  5  8 ]',
          '   F  F  T  T  T  T   cond(i)',
          '   L        M        H   lo=0 hi=6 mid=3',
          'a[3] = 5, cond true  ->  hi = mid = 3',
        ].join('\n'),
      },
      {
        caption: 'hi = mid keeps index 3 in play, because index 3 might be the answer. The window is now the half-open range [0, 3).',
        frame: [
          '[  1  3  5  x  x  x ]',
          '   F  F  T            cond(i)',
          '   L  M     H         lo=0 hi=3 mid=1',
          'a[1] = 3, cond false  ->  lo = mid + 1 = 2',
        ].join('\n'),
      },
      {
        caption: 'One cell left. The test is true, hi drops to 2, and lo == hi ends the loop on the first 5.',
        frame: [
          '[  x  x  5  x  x  x ]',
          '         T            cond(i)',
          '         L  H         lo=2 hi=3 mid=2',
          'cond true  ->  hi = 2, now lo == hi, loop ends',
          'lower bound of 5 = 2; lower bound of 6 = 5',
          'so the last 5 sits at 5 - 1 = 4',
        ].join('\n'),
      },
      {
        caption: 'Rotated array: mid never tells you the direction on its own, but one side of mid is always a normal sorted run.',
        frame: [
          'find 0 in [ 4  5  6  7  0  1  2 ]',
          'idx          0  1  2  3  4  5  6',
          'mid = 3 -> value 7.  a[0]=4 <= a[3]=7,',
          'so the left run 4..7 is properly sorted.',
          '0 is not inside [4, 7]  ->  go right, lo = 4',
        ].join('\n'),
      },
      {
        caption: 'Search on the answer: the piles are unsorted, but "can Koko finish at speed k" is false then true forever.',
        frame: [
          'piles = [3, 6, 7, 11], limit h = 8 hours',
          'k       1  2  3  4  5  6  7  8  9 10 11',
          'hours  27 15 10  8  8  6  5  5  5  5  4',
          'ok?     F  F  F  T  T  T  T  T  T  T  T',
          '                 ^ first T, so the answer is k = 4',
        ].join('\n'),
      },
    ],
    pseudocode: `// first index in [lo, hi) where cond is true, or hi if none is
function firstTrue(lo, hi, cond):
    while lo < hi:
        mid = lo + (hi - lo) / 2
        if cond(mid):
            hi = mid                 // mid may be the answer, keep it
        else:
            lo = mid + 1             // mid is not, so look right
    return lo

// first and last position of target in a sorted array
function firstAndLast(a, target):
    first = firstTrue(0, length(a), index -> a[index] >= target)
    if first == length(a) or a[first] != target:
        return (-1, -1)
    last = firstTrue(0, length(a), index -> a[index] > target) - 1
    return (first, last)

// smallest x in [low, high] for which feasible(x) holds
function searchTheAnswer(low, high, feasible):
    while low < high:
        mid = low + (high - low) / 2
        if feasible(mid): high = mid
        else: low = mid + 1
    return low`,
    complexity: [
      { label: 'First and last occurrence', time: 'O(log n)', space: 'O(1)', note: 'two boundary searches, about 2 * log2(n) probes' },
      { label: 'Rotated sorted array search', time: 'O(log n)', space: 'O(1)', note: 'degrades to O(n) when duplicates hide which half is sorted' },
      { label: 'Search on the answer', time: 'O(C * log R)', space: 'O(1)', note: 'R is the size of the answer range, C is one feasible() check' },
      { label: 'Recursive form of any variant', time: 'O(log n)', space: 'O(log n)', note: 'one stack frame per halving level' },
    ],
    dryRun: {
      input: 'nums = [1, 3, 5, 5, 5, 8], target = 5',
      goal: 'Return the first and last index of 5 using the optimized lower_bound and first_last above.',
      steps: [
        { state: 'target=5 lo=0 hi=6', action: 'lower_bound starts with the half-open window [0, 6). hi = 6 also encodes "maybe nothing qualifies".' },
        { state: 'lo=0 hi=6 mid=3 nums[3]=5', action: '5 >= 5 is true, so index 3 qualifies but an earlier one might too. Set hi = mid = 3.' },
        { state: 'lo=0 hi=3 mid=1 nums[1]=3', action: '3 >= 5 is false, so index 1 and everything left of it are out. Set lo = mid + 1 = 2.' },
        { state: 'lo=2 hi=3 mid=2 nums[2]=5', action: '5 >= 5 is true again, so hi = mid = 2.' },
        { state: 'lo=2 hi=2', action: 'lo is no longer less than hi, the loop ends, and lower_bound returns 2. So first = 2.' },
        { state: 'first=2 nums[2]=5', action: 'nums[first] really is the target, so 5 is present and it is worth finding where the run ends.' },
        { state: 'calling lower_bound(nums, 6)', action: 'The same walk probes index 3 (5 < 6, lo = 4), then index 5 (8 >= 6, hi = 5), then index 4 (5 < 6, lo = 5) and returns 5.' },
        { state: 'first=2 upper=5', action: 'The first value greater than 5 sits at index 5, so the last 5 is one place before it: last = 5 - 1 = 4.' },
      ],
      result:
        'Returns [2, 4]. That is correct because nums[2] through nums[4] are all 5, nums[1] is smaller and nums[5] is larger, so the run of 5s is exactly indexes 2 to 4.',
    },
    mistakes: [
      {
        mistake: 'Mixing the two templates, for example while lo <= hi together with hi = mid.',
        why: 'With one cell left mid equals lo, so hi = mid changes nothing and the condition lo <= hi stays true forever. The program hangs.',
        fix: 'Pick one shape and keep it whole. Closed window: hi = n - 1, lo <= hi, mid plus or minus one. Half-open: hi = n, lo < hi, hi = mid.',
      },
      {
        mistake: 'Computing the last occurrence as upper_bound(target) rather than upper_bound(target) - 1.',
        why: 'upper_bound is the first index strictly greater than the target, which is one place past the last match, so the answer is off by one or points at a different value.',
        fix: 'last = lower_bound(target + 1) - 1, and only after checking that the target exists at all.',
      },
      {
        mistake: 'Binary searching a feasible() function that is not monotonic.',
        why: 'If the pattern is F T F T, a probe in the middle says nothing about which side holds the boundary, so the returned value is essentially arbitrary and may not even be feasible.',
        fix: 'Prove monotonicity first: if speed k works, every speed above k must also work. If that fails, use a different technique.',
      },
      {
        mistake: 'In a rotated array, choosing the direction by comparing nums[mid] with the target alone.',
        why: 'The array is only sorted in pieces, so a plain comparison does not tell you which half can contain the target.',
        fix: 'First decide which half is a sorted run by comparing nums[lo] with nums[mid], then test whether the target falls inside that run.',
      },
      {
        mistake: 'Choosing too narrow a range for a search-on-answer problem.',
        why: 'If the true answer sits outside [low, high], the loop still returns a boundary value, and that value was never actually feasible.',
        fix: 'Start with a range that is obviously safe: for ship capacity that is max(weights) up to sum(weights); for eating speed it is 1 up to max(pile).',
      },
    ],
    whenToUse: [
      '"First position", "last position", or "how many times does x occur" in sorted data.',
      '"Smallest or largest value such that ..." where testing one candidate is easy but the range of candidates is huge.',
      'A rotated or shifted sorted array, or an array with exactly one peak.',
      'A feasibility question where answering yes for x forces yes for everything above x.',
      'Answer bounds up to 10^9 with an O(n) check, since log2(10^9) is only about 30 probes.',
    ],
    whenNotToUse: [
      'The feasibility test flips between true and false more than once, so no single boundary exists; scan the range or use dynamic programming.',
      'The data has no order and no monotonic property at all; sort it first or use a hash map.',
      'You need the k-th smallest of an unsorted array in one go; quickselect gives O(n) average with no ordering assumption.',
      'The candidate answers are not values you can halve, such as arbitrary strings or graph shapes; search the structure instead.',
      'One feasible() check already costs O(n log n), so log R checks may be slower than a direct O(n log n) algorithm.',
    ],
    relatedTopics: [
      { id: 'linear-vs-binary-search', kind: 'concept', why: 'This builds directly on the window and invariant taught there.' },
      { id: 'binary-search-on-answer', kind: 'pattern', why: 'The "smallest feasible value" family is exactly this pattern.' },
      { id: 'quick-sort', kind: 'concept', why: 'Quickselect answers k-th smallest questions without needing any order.' },
      { id: 'greedy', kind: 'pattern', why: 'Most feasible() checks in search-on-answer problems are a single greedy sweep.' },
    ],
    quiz: [
      {
        question: 'For nums = [2, 2, 2, 2], what does lower_bound(nums, 3) return?',
        options: ['0', '3', '4', '-1'],
        answerIndex: 2,
        explanation: 'No element is >= 3, so hi never comes down and lo climbs to n = 4, the signal that nothing qualifies.',
      },
      {
        question: 'You need the smallest number of days d in which a task list can be finished, and you know 5 days is enough. Can you binary search d?',
        options: [
          'No, because days are not stored in a sorted array',
          'Yes, because if d days work then d + 1 days also work, so feasibility is monotonic',
          'Only if the task list is sorted first',
          'Only if d is under 100',
        ],
        answerIndex: 1,
        explanation: 'Binary search needs monotonic feasibility, not a sorted input. Extra days can never make a feasible schedule infeasible.',
      },
      {
        question: 'Koko has n = 10^4 piles with up to 10^9 bananas each. What does binary searching the eating speed cost?',
        options: ['O(n)', 'About O(n * log(max pile)), roughly 30 sweeps of 10^4 piles', 'O(n^2)', 'O(max pile)'],
        answerIndex: 1,
        explanation: 'Each candidate speed costs one O(n) sweep to add up the hours, and halving a range of 10^9 takes about 30 probes.',
      },
      {
        question: 'In a rotated sorted array with mid anywhere in the middle, what is always true?',
        options: [
          'nums[mid] is the minimum',
          'At least one of the two halves around mid is a normally sorted run',
          'Both halves are sorted',
          'The target is always in the left half',
        ],
        answerIndex: 1,
        explanation: 'A single rotation creates one break point, and that break can only fall on one side of mid, so the other side is a clean sorted run.',
      },
      {
        question: 'Why is the last occurrence written as lower_bound(target + 1) - 1 rather than lower_bound(target) plus the count of matches?',
        options: [
          'They are always the same',
          'Because you cannot know the count without scanning, while the second boundary search is still O(log n)',
          'Because lower_bound only works on unique values',
          'To avoid integer overflow',
        ],
        answerIndex: 1,
        explanation: 'Counting the matches would need an O(n) pass; a second boundary search keeps the whole operation logarithmic.',
      },
    ],
    sources: [
      'MIT 6.006: binary search and searching over answers',
      'CLRS ch. 2 and ch. 4',
      'CP-Algorithms: Binary search',
      'USACO Guide: Binary Search on the Answer',
      'Codeforces EDU (ITMO Academy): Binary Search',
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
        tier: 'beginner',
      },
      {
        id: 'find-minimum-in-rotated-sorted-array',
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
        patternId: 'binary-search',
        hint: 'Compare nums[mid] with nums[hi]: if mid is bigger, the minimum is to the right; otherwise it is at mid or left.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'search-in-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        patternId: 'binary-search',
        hint: 'Decide which side of mid is sorted, then check whether the target falls inside that sorted side.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'find-peak-element',
        title: 'Find Peak Element',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-peak-element/',
        patternId: 'binary-search',
        hint: 'If nums[mid] < nums[mid + 1] a peak exists to the right; otherwise one exists at mid or to the left.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'koko-eating-bananas',
        title: 'Koko Eating Bananas',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/koko-eating-bananas/',
        patternId: 'binary-search-on-answer',
        hint: 'Binary search the speed from 1 to max pile; feasible(k) sums ceil(pile / k) and checks it fits in h hours.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'capacity-to-ship-packages-within-d-days',
        title: 'Capacity To Ship Packages Within D Days',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/',
        patternId: 'binary-search-on-answer',
        hint: 'Search capacity from max(weight) to sum(weights); feasible(c) greedily counts how many days are needed.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'median-of-two-sorted-arrays',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
        patternId: 'binary-search',
        hint: 'Binary search how many elements to take from the shorter array so that the left halves of both together form the lower half.',
        xp: 80,
        tier: 'advanced',
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
    definition:
      'Sorting rearranges a collection into a defined order. Sorts that only ask "does a come before b" need about n log n comparisons in the worst case; sorts that use the values themselves as array indexes can beat that when the range of values is small.',
    coreIdea:
      'One comparison has two outcomes, so it can rule out at most half of the orderings still possible. There are n! possible orderings, so no comparison sort can finish in fewer than log2(n!) comparisons, which grows like n log n. Counting sort escapes that floor by never comparing anything: it uses each value as an index into a tally. The practical lesson is to look for structure in the values, not only in their order.',
    visual: [
      {
        caption: 'Selection sort pass 1: scan all seven cells just to learn where the smallest value is, then swap it forward.',
        frame: [
          '[  4  2  2  8  3  3  1 ]',
          '   i                 m',
          'i = slot being filled, m = smallest in the rest',
          '6 comparisons to place one value, then swap',
          '[  1  2  2  8  3  3  4 ]',
        ].join('\n'),
      },
      {
        caption: 'Each pass is one cell shorter, so the totals add up as 6 + 5 + 4 + ... which is n(n-1)/2.',
        frame: [
          'selection sort, comparisons and rough time',
          'n = 100          ~5,000            instant',
          'n = 10,000       ~50,000,000       about a second',
          'n = 1,000,000    ~5 * 10^11        hours',
          'n log n at n = 1,000,000 is only ~2 * 10^7',
        ].join('\n'),
      },
      {
        caption: 'Counting sort, phase 1: one pass over the input fills a tally, with no comparison at all.',
        frame: [
          'input  [  4  2  2  8  3  3  1 ]   values 0..9',
          'value    0  1  2  3  4  5  6  7  8  9',
          'count    0  1  2  2  1  0  0  0  1  0',
          'the counts add up to 7, the input length',
        ].join('\n'),
      },
      {
        caption: 'Phase 2: walk the values in order and write out each one as many times as it was counted.',
        frame: [
          'value 1, count 1  ->  1',
          'value 2, count 2  ->  1 2 2',
          'value 3, count 2  ->  1 2 2 3 3',
          'value 4, count 1  ->  1 2 2 3 3 4',
          'value 8, count 1  ->  1 2 2 3 3 4 8',
          'total work: O(n) to count + O(k) to write',
        ].join('\n'),
      },
      {
        caption: 'Cyclic sort: when the values are exactly 1..n, value v has a home at index v - 1, so no comparison is needed either.',
        frame: [
          '[ 3  1  4  2 ]   a[0]=3, home is index 2, swap',
          '[ 4  1  3  2 ]   a[0]=4, home is index 3, swap',
          '[ 2  1  3  4 ]   a[0]=2, home is index 1, swap',
          '[ 1  2  3  4 ]   done, O(n) time and O(1) space',
        ].join('\n'),
      },
      {
        caption: 'Why no comparison sort can beat n log n: counting how much information each comparison can give you.',
        frame: [
          'n = 5  ->  5! = 120 possible orderings',
          'one comparison has 2 outcomes  ->  halves them',
          'need k with 2^k >= 120  ->  k >= 7 comparisons',
          'in general k >= log2(n!), which grows like n log n',
        ].join('\n'),
      },
    ],
    pseudocode: `function selectionSort(a):              // O(n^2), for teaching only
    n = length(a)
    for i from 0 to n - 1:
        best = i
        for j from i + 1 to n - 1:
            if a[j] < a[best]:
                best = j
        swap a[i] and a[best]

function countingSort(a, k):            // values are integers 0..k
    count = array of size k + 1, all zero
    for each x in a:
        count[x] = count[x] + 1
    write = 0
    for value from 0 to k:
        repeat count[value] times:
            a[write] = value
            write = write + 1

function chooseASort(a):
    if values are small integers in a known range: use countingSort
    else if values are exactly 1..n:              use cyclicSort
    else:                                          call the library sort`,
    complexity: [
      { label: 'Selection sort', time: 'O(n^2)', space: 'O(1)', note: 'the inner scan runs even when the input is already sorted' },
      { label: 'Insertion sort', time: 'O(n) best, O(n^2) worst', space: 'O(1)', note: 'best case is data that is already almost in order' },
      { label: 'Library sort (Timsort, introsort)', time: 'O(n log n)', space: 'O(n) or O(log n)', note: 'Timsort keeps a merge buffer; introsort only a recursion stack' },
      { label: 'Counting sort', time: 'O(n + k)', space: 'O(n + k)', note: 'no comparisons; useless once k is much larger than n' },
      { label: 'Cyclic sort', time: 'O(n)', space: 'O(1)', note: 'only valid when the values are exactly 1..n or 0..n-1' },
    ],
    dryRun: {
      input: 'a = [4, 2, 2, 8, 3, 3, 1], k = 9',
      goal: 'Sort a in place with the optimized counting_sort above, using the values as indexes instead of comparing them.',
      steps: [
        { state: 'a = [4, 2, 2, 8, 3, 3, 1], k = 9', action: 'Create counts as ten zeros, one slot for each possible value 0 through 9.' },
        { state: 'counts = ten zeros, i = 0', action: 'The counting pass begins. x = 4, so counts[4] becomes 1.' },
        { state: 'counts[4]=1', action: 'x = 2 appears twice, so counts[2] becomes 2. Then x = 8 sets counts[8] to 1.' },
        { state: 'counts[2]=2 counts[8]=1', action: 'x = 3 appears twice, giving counts[3] = 2, and x = 1 gives counts[1] = 1.' },
        { state: 'counts = [0,1,2,2,1,0,0,0,1,0]', action: 'The counting pass is finished. The counts add up to 7, which is the length of the input.' },
        { state: 'i = 0, value = 0', action: 'counts[0] is 0, so nothing is written and the loop moves on to value 1.' },
        { state: 'i = 0, value = 1', action: 'counts[1] is 1, so write 1 into a[0]. i becomes 1.' },
        { state: 'i = 1, value = 2', action: 'counts[2] is 2, so write 2 into a[1] and a[2]. i becomes 3.' },
        { state: 'i = 3, values 3 then 4', action: 'Write 3 into a[3] and a[4], then 4 into a[5]. i becomes 6.' },
        { state: 'i = 6, value = 8', action: 'Write 8 into a[6]. Values 5, 6, 7 and 9 have count 0 and are skipped in O(1) each.' },
      ],
      result:
        'a is now [1, 2, 2, 3, 3, 4, 8]. It is correct because every value was written exactly as many times as it was counted, and the writing loop visits values in increasing order.',
    },
    mistakes: [
      {
        mistake: 'Hand-writing an O(n^2) sort in an interview because it is the one you remember.',
        why: 'At n = 100,000 that is roughly 5 * 10^9 comparisons. No judge and no interviewer will accept it, however clean the code looks.',
        fix: 'Call the library sort and say out loud that it is O(n log n). Write a simple sort only when you are explicitly asked to implement one.',
      },
      {
        mistake: 'Using counting sort when the value range is huge, for example values up to 10^9.',
        why: 'The tally needs k + 1 slots, so both the memory and the writing loop explode even when n is small.',
        fix: 'Check that k is comparable to n. Otherwise sort by comparison, or compress the values to ranks 0..n-1 first.',
      },
      {
        mistake: 'Assuming every sort keeps equal elements in their original order.',
        why: 'C++ std::sort and Java Arrays.sort on primitives are not stable, so a first sort by a secondary key is silently undone by the second sort.',
        fix: 'Use std::stable_sort, or sort by a tuple that includes the tie-breaker so the order is fully determined by the key.',
      },
      {
        mistake: 'Sorting the whole array when you only need the largest, the smallest, or the k-th value.',
        why: 'That spends O(n log n) on work you throw away, when a single pass or a size-k heap answers the question directly.',
        fix: 'Use one linear scan for max and min, a heap of size k for top-k, or quickselect for the k-th value.',
      },
      {
        mistake: 'Applying cyclic sort when the values are not exactly in 1..n.',
        why: 'A value outside that range has no home index, so the swap loop can run forever or index outside the array.',
        fix: 'Guard the swap with a range check and simply skip any value below 1 or above n, which is what First Missing Positive needs.',
      },
    ],
    whenToUse: [
      'The problem gets easy once the data is in order, for example pairing, deduplicating, or greedy scheduling.',
      'Values are small integers in a known range such as 0..2 or a..z, so counting sort gives O(n).',
      'The values are exactly 1..n and the question is about a missing or duplicated number, which is cyclic sort.',
      'You need a custom order and can pass a key or comparator without changing the O(n log n) cost.',
      'n log n comfortably fits the limits, roughly n up to a few million.',
    ],
    whenNotToUse: [
      'You only need the maximum, the minimum, or the k-th value; use one scan, a heap of size k, or quickselect.',
      'Equal items must keep their original order and your language sort is not stable; use a stable sort or add a tie-breaker key.',
      'You only need membership tests, where a hash set gives O(1) average lookups instead of O(n log n) sorting.',
      'The data arrives as a stream and you need a running answer; a heap or a balanced tree fits better than re-sorting.',
      'The value range k is far larger than n, so counting sort would use more memory than the input; fall back to comparison sorting.',
    ],
    relatedTopics: [
      { id: 'merge-sort', kind: 'concept', why: 'The concrete O(n log n) comparison sort, and the source of the merge step library sorts borrow.' },
      { id: 'quick-sort', kind: 'concept', why: 'The in-place average O(n log n) sort and the home of the partition trick.' },
      { id: 'cyclic-sort', kind: 'pattern', why: 'The O(n) special case for values that are exactly 1..n.' },
      { id: 'linear-vs-binary-search', kind: 'concept', why: 'Sorting is usually the setup step that makes binary search legal.' },
      { id: 'top-k-heap', kind: 'pattern', why: 'The cheaper option when you need only the k largest values, not a full order.' },
    ],
    quiz: [
      {
        question: 'An interviewer hands you 200,000 unsorted integers to sort. Which option fits in time?',
        options: [
          'Selection sort, because it uses O(1) extra space',
          'Bubble sort with an early-exit flag',
          'The library sort at O(n log n), about 3.5 million comparisons',
          'Counting sort, given values up to 10^9',
        ],
        answerIndex: 2,
        explanation: 'n log n at n = 200,000 is under 4 million comparisons. Both quadratic sorts are around 2 * 10^10, and counting sort would need 10^9 tally slots.',
      },
      {
        question: 'The values are known to be only 0, 1 or 2. What is the cheapest correct approach?',
        options: [
          'The library sort at O(n log n)',
          'Counting sort or a three-way partition, both O(n)',
          'Merge sort, for stability',
          'Binary search',
        ],
        answerIndex: 1,
        explanation: 'With three possible values, one counting pass or one Dutch-flag partition sweep sorts the array in linear time.',
      },
      {
        question: 'Why can no comparison sort do better than about n log n comparisons in the worst case?',
        options: [
          'Because swapping elements is slow',
          'Because there are n! orderings and each comparison rules out at most half of those still possible',
          'Because arrays are stored row by row in memory',
          'Because recursion costs O(log n) space',
        ],
        answerIndex: 1,
        explanation: 'Reaching one ordering out of n! needs at least log2(n!) yes/no answers, and log2(n!) grows like n log n.',
      },
      {
        question: 'You must sort a million employee records by salary and keep employees with equal salary in their original order. Is C++ std::sort enough?',
        options: [
          'Yes, std::sort is stable',
          'No, std::sort is not stable; use std::stable_sort or sort by (salary, original index)',
          'No, you must use counting sort',
          'Yes, because salaries are integers',
        ],
        answerIndex: 1,
        explanation: 'std::sort makes no stability promise. Either call std::stable_sort or make the original index part of the sort key.',
      },
      {
        question: 'You run counting sort on n = 1000 values that range from 0 to 1,000,000,000. What happens?',
        options: [
          'It runs in O(n) as usual',
          'It needs about a billion tally slots, so it is far worse than an O(n log n) sort',
          'It is fine because counting sort is stable',
          'It fails because the values must be unique',
        ],
        answerIndex: 1,
        explanation: 'Counting sort is O(n + k). With k around 10^9 and n only 1000, the k term dominates both time and memory.',
      },
    ],
    sources: [
      'CLRS ch. 2 and ch. 8 (sorting in linear time)',
      'MIT 6.006: sorting and the comparison lower bound',
      'CP-Algorithms: Sorting',
      'USACO Guide: Sorting',
      'CPython listsort notes describing Timsort',
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
        tier: 'beginner',
      },
      {
        id: 'merge-sorted-array',
        title: 'Merge Sorted Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/merge-sorted-array/',
        patternId: 'two-pointers',
        hint: 'Fill from the back of nums1 so you never overwrite values you still need.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'sort-array-by-parity',
        title: 'Sort Array By Parity',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/sort-array-by-parity/',
        patternId: 'two-pointers',
        hint: 'One pointer for the next even slot, one scanning; swap evens forward in a single pass.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'relative-sort-array',
        title: 'Relative Sort Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/relative-sort-array/',
        patternId: 'hash-map',
        hint: 'Count values of arr1, output them in arr2 order, then output the leftovers in ascending order.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'set-mismatch',
        title: 'Set Mismatch',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/set-mismatch/',
        patternId: 'cyclic-sort',
        hint: 'Swap each value to index value - 1; afterwards the index that holds the wrong value reveals both numbers.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'first-missing-positive',
        title: 'First Missing Positive',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/first-missing-positive/',
        patternId: 'cyclic-sort',
        hint: 'Only values 1..n matter; cyclic-sort them into place, then the first index whose value is wrong is the answer.',
        xp: 80,
        tier: 'advanced',
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
    definition:
      'Merge sort sorts an array by splitting it into two halves, sorting each half the same way, and then merging the two sorted halves into one with a single linear pass. It runs in O(n log n) on every input and it is stable.',
    coreIdea:
      'Merging two already-sorted lists is easy, because the next smallest item can only be at the front of one of them, so one comparison per output item is enough. That means the hard part is never the combining, it is getting the halves sorted, and recursion does that for free. Splitting gives log2(n) levels and each level merges every element exactly once, so the cost is n log n no matter how the input was arranged.',
    visual: [
      {
        caption: 'Divide phase. Each piece splits at its middle, and the indentation shows the recursion tree.',
        frame: [
          '[5 2 4 7 1 3]',
          '+-- [5 2 4]',
          '|   +-- [5]',
          '|   +-- [2 4]',
          '|       +-- [2]',
          '|       +-- [4]',
          '+-- [7 1 3]',
          '    +-- [7]',
          '    +-- [1 3]',
          '        +-- [1]',
          '        +-- [3]',
        ].join('\n'),
      },
      {
        caption: 'Every leaf holds one item, which is sorted by definition. Splitting alone costs no comparisons at all.',
        frame: [
          'leaves:  [5]  [2]  [4]  [7]  [1]  [3]',
          'depth = 3 levels of splitting for n = 6',
          'that is ceil(log2(6)) = 3',
        ].join('\n'),
      },
      {
        caption: 'Merge phase, working back up the tree. Each merge is one linear pass over its two inputs.',
        frame: [
          '[2] + [4]         ->  [2 4]      1 comparison',
          '[1] + [3]         ->  [1 3]      1 comparison',
          '[5] + [2 4]       ->  [2 4 5]    2 comparisons',
          '[7] + [1 3]       ->  [1 3 7]    2 comparisons',
          '[2 4 5] + [1 3 7] ->  ?          final merge next',
        ].join('\n'),
      },
      {
        caption: 'The final merge. Two pointers, and each step takes the smaller of the two front values.',
        frame: [
          'left  [ 2  4  5 ]    right [ 1  3  7 ]',
          '        i                     j',
          'out   [ ]',
          'compare 2 with 1  ->  1 is smaller, take it',
        ].join('\n'),
      },
      {
        caption: 'The rest of the merge. Ties take from the left first, and that single choice is what makes merge sort stable.',
        frame: [
          '2 vs 1  take 1   |   2 vs 3  take 2',
          '4 vs 3  take 3   |   4 vs 7  take 4',
          '5 vs 7  take 5   |   left is empty now',
          'copy what is left of right: 7',
          'out [ 1  2  3  4  5  7 ]   5 comparisons',
        ].join('\n'),
      },
      {
        caption: 'Why the total is n log n: every level merges all n elements once, and there are log2(n) levels.',
        frame: [
          'level 0:  1 piece of 6         merge work 6',
          'level 1:  2 pieces of 3        merge work 6',
          'level 2:  4 pieces of 1 or 2   merge work 6',
          'levels = ceil(log2(6)) = 3',
          'total = 6 * 3 = 18  ->  n * log n',
        ].join('\n'),
      },
    ],
    pseudocode: `function mergeSort(a, lo, hi):        // sorts a[lo .. hi - 1]
    if hi - lo <= 1:                  // 0 or 1 element is already sorted
        return
    mid = lo + (hi - lo) / 2
    mergeSort(a, lo, mid)
    mergeSort(a, mid, hi)
    merge(a, lo, mid, hi)

function merge(a, lo, mid, hi):
    buffer = empty list
    i = lo
    j = mid
    while i < mid and j < hi:
        if a[i] <= a[j]:              // <= keeps equal items in order
            append a[i] to buffer
            i = i + 1
        else:
            append a[j] to buffer
            j = j + 1
    while i < mid: append a[i] to buffer; i = i + 1
    while j < hi:  append a[j] to buffer; j = j + 1
    copy buffer back into a[lo .. hi - 1]`,
    complexity: [
      { label: 'Best case', time: 'O(n log n)', space: 'O(n)', note: 'the split ignores whether the input is already sorted' },
      { label: 'Average case', time: 'O(n log n)', space: 'O(n)', note: 'log2(n) levels, one linear merge per level' },
      { label: 'Worst case', time: 'O(n log n)', space: 'O(n)', note: 'the only common sort with no bad input at all' },
      { label: 'The merge step alone', time: 'O(n)', space: 'O(n)', note: 'one comparison and one write per output element' },
      { label: 'On a linked list', time: 'O(n log n)', space: 'O(log n)', note: 'nodes are relinked, so only the recursion stack costs memory' },
    ],
    dryRun: {
      input: 'nums = [5, 2, 4, 7, 1, 3]',
      goal: 'Return a new sorted list using the optimized merge_sort above, which slices, recurses, and merges.',
      steps: [
        { state: 'nums = [5, 2, 4, 7, 1, 3]', action: 'Length 6 is more than 1, so mid = 3 and we recurse on [5, 2, 4] and [7, 1, 3].' },
        { state: 'left call on [5, 2, 4]', action: 'mid = 1, so it recurses on [5] and [2, 4]. [5] returns immediately because its length is 1.' },
        { state: '[2, 4] splits into [2] and [4]', action: 'Both are single elements. Their merge compares 2 with 4 once and returns [2, 4].' },
        { state: 'left = [5], right = [2, 4]', action: 'Merge them: 5 > 2 takes 2, 5 > 4 takes 4, then 5 is left over. The left half is now [2, 4, 5].' },
        { state: 'right call on [7, 1, 3]', action: 'The same shape gives [1, 3], which merges with [7] to produce [1, 3, 7].' },
        { state: 'left = [2, 4, 5], right = [1, 3, 7], i=0 j=0', action: '2 <= 1 is false, so take 1 from the right. merged = [1] and j becomes 1.' },
        { state: 'i=0 j=1 merged=[1]', action: '2 <= 3 is true, so take 2 from the left. merged = [1, 2] and i becomes 1.' },
        { state: 'i=1 j=1 merged=[1, 2]', action: '4 <= 3 is false so take 3; then 4 <= 7 takes 4 and 5 <= 7 takes 5. merged = [1, 2, 3, 4, 5] and i becomes 3.' },
        { state: 'i=3 j=2 merged=[1, 2, 3, 4, 5]', action: 'i has passed the end of left, so the while loop stops and the leftover [7] is extended onto the result.' },
      ],
      result:
        'Returns [1, 2, 3, 4, 5, 7]. It is correct because each merge always takes the smaller of two sorted fronts, which keeps the output sorted, and a single element is sorted by definition.',
    },
    mistakes: [
      {
        mistake: 'Writing the base case as len(nums) == 0 only.',
        why: 'A one-element slice then splits into an empty half and a copy of itself, so the same call repeats forever until the stack overflows.',
        fix: 'Return whenever the length is 0 or 1, that is if len(nums) <= 1.',
      },
      {
        mistake: 'Using < instead of <= when comparing the two fronts in the merge.',
        why: 'Equal elements are then taken from the right half first, so merge sort stops being stable and any earlier sort key is quietly lost.',
        fix: 'Compare with a[i] <= a[j] so ties always come from the left half, which is the earlier part of the original array.',
      },
      {
        mistake: 'Claiming merge sort is in place because the recursion does not allocate.',
        why: 'The merge itself needs somewhere to write while it reads, so every practical version allocates a buffer of size n.',
        fix: 'State O(n) extra space honestly, and offer quick sort or heap sort when the interviewer asks for an in-place sort.',
      },
      {
        mistake: 'Allocating a brand new temporary array inside every merge call.',
        why: 'That is thousands of allocations on a large input. The complexity is unchanged but the real runtime can double or worse.',
        fix: 'Allocate one buffer of size n up front and pass it down, exactly as the index-based Java and C++ versions above do.',
      },
      {
        mistake: 'Recursing on overlapping ranges, such as mergeSort(lo, mid) and mergeSort(mid - 1, hi).',
        why: 'One element then belongs to both halves, so it appears twice in the output and a different element goes missing.',
        fix: 'With a half-open range use [lo, mid) and [mid, hi). With a closed range use [lo, mid] and [mid + 1, hi].',
      },
    ],
    whenToUse: [
      'You need a guaranteed O(n log n) with no bad-input case, for example against adversarial data.',
      'The relative order of equal items must be preserved, that is you need a stable sort.',
      'The data is a linked list, where splitting and merging only relink pointers.',
      'You must count pairs that cross the two halves, such as inversions or reverse pairs, during the merge.',
      'The data is too big for memory and must be sorted as runs from disk, which is external merge sort.',
    ],
    whenNotToUse: [
      'Memory is tight and you cannot afford an O(n) buffer; use quick sort or heap sort in place.',
      'The array is small or nearly sorted, where insertion sort finishes in about O(n) with no allocation.',
      'You only need the k-th smallest element, where quickselect gives O(n) average without sorting anything.',
      'The values are small integers in a known range, where counting or radix sort gives O(n + k).',
      'You just need the data in order and the language already ships an O(n log n) sort, so call it instead of rewriting it.',
    ],
    relatedTopics: [
      { id: 'divide-and-conquer', kind: 'pattern', why: 'Merge sort is the textbook shape of split, solve each part, then combine.' },
      { id: 'two-pointers', kind: 'pattern', why: 'The merge step is a two-pointer sweep across two sorted sequences.' },
      { id: 'quick-sort', kind: 'concept', why: 'The other O(n log n) sort, trading these guarantees for in-place work.' },
      { id: 'merging-lists', kind: 'concept', why: 'Merging two sorted linked lists is exactly the merge step on its own.' },
      { id: 'k-way-merge', kind: 'pattern', why: 'Extends the same merge to more than two sorted sequences using a heap.' },
    ],
    quiz: [
      {
        question: 'Merge sort is handed an array that is already fully sorted. What is its running time?',
        options: ['O(n), it notices the order', 'O(n log n), it splits and merges the same way regardless', 'O(n^2)', 'O(log n)'],
        answerIndex: 1,
        explanation: 'Plain merge sort never checks whether the input is ordered. Timsort adds run detection on top, which is how it reaches O(n) on sorted input.',
      },
      {
        question: 'Why does the merge use <= rather than < when comparing the two fronts?',
        options: [
          'To handle empty halves correctly',
          'To keep the sort stable, so equal items keep their original relative order',
          'To avoid an infinite loop',
          'To save one comparison per merge',
        ],
        answerIndex: 1,
        explanation: 'On a tie, <= takes from the left half, and the left half holds the elements that came first in the original array.',
      },
      {
        question: 'You must sort a singly linked list of 10^6 nodes in O(n log n) using only O(log n) extra space. Does merge sort fit?',
        options: [
          'No, merge sort always needs an O(n) array',
          'Yes, splitting and merging a list only relinks pointers, so only the recursion stack costs space',
          'No, linked lists cannot be sorted efficiently',
          'Only if the list is doubly linked',
        ],
        answerIndex: 1,
        explanation: 'The O(n) buffer is an array-only cost. On a list you rewire next pointers, so the recursion depth of about log2(n) is the only extra memory.',
      },
      {
        question: 'While merging [2, 4, 5] with [1, 3, 7], you take 1 from the right while 3 elements still wait on the left. How many inversions does that reveal?',
        options: ['1', '3, one for each element still waiting on the left', '0', '6'],
        answerIndex: 1,
        explanation: 'Every element still in the left half sits at a smaller original index and is larger than the value just taken, so each one forms an inversion with it.',
      },
      {
        question: 'How much extra space does the array version of merge sort need in total?',
        options: ['O(1)', 'O(log n), for the stack only', 'O(n) for the merge buffer plus O(log n) for the recursion stack', 'O(n log n)'],
        answerIndex: 2,
        explanation: 'The buffer dominates, so the usual short answer is O(n), but the recursion stack of depth log2(n) is genuinely there too.',
      },
    ],
    sources: [
      'CLRS ch. 2 (merge sort) and ch. 4 (recurrences and the master method)',
      'MIT 6.006: divide and conquer, merge sort',
      'MIT 6.046: solving recurrences',
      'CP-Algorithms: Sorting and counting inversions',
      'USACO Guide: Divide and Conquer',
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
        tier: 'beginner',
      },
      {
        id: 'sort-an-array',
        title: 'Sort an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-an-array/',
        patternId: 'divide-and-conquer',
        hint: 'Implement merge sort by hand; the judge rejects O(n^2) solutions.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'sort-list',
        title: 'Sort List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-list/',
        patternId: 'divide-and-conquer',
        hint: 'Find the middle with slow and fast pointers, sort both halves, merge the two lists.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'reverse-pairs',
        title: 'Reverse Pairs',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/reverse-pairs/',
        patternId: 'divide-and-conquer',
        hint: 'Before merging two sorted halves, count pairs with left > 2 * right using two pointers, then merge normally.',
        xp: 80,
        tier: 'advanced',
      },
      {
        id: 'count-of-smaller-numbers-after-self',
        title: 'Count of Smaller Numbers After Self',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/',
        patternId: 'divide-and-conquer',
        hint: 'Merge sort pairs of (value, original index); when taking from the left, add how many right elements have already been taken.',
        xp: 80,
        tier: 'advanced',
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
    definition:
      'Quick sort picks one element as a pivot and rearranges the array in place so every smaller value sits left of the pivot and every larger value sits right of it, then sorts the two sides the same way. After each partition the pivot is already in its final position.',
    coreIdea:
      'One linear partition pass buys two things at once. It puts a single element where it belongs forever, and it guarantees no element will ever need to cross the pivot again. That makes the two sides completely independent sub-problems with no combining step at all, so the entire cost depends only on how evenly the pivot splits the range. This is why pivot choice, and not the partition itself, decides whether you get n log n or n^2.',
    visual: [
      {
        caption: 'Lomuto partition on [3, 8, 2, 5, 1, 4] with the last cell as pivot. s marks the next slot for a small value; i scans.',
        frame: [
          '[ 3  8  2  5  1  4 ]   pivot = 4',
          '  s                    s = 0',
          '  i                    i = 0:  3 < 4  ->  swap, s = 1',
        ].join('\n'),
      },
      {
        caption: 'i = 1 finds 8, which is bigger than the pivot. Nothing moves and s stays behind, marking the big value.',
        frame: [
          '[ 3  8  2  5  1  4 ]',
          '     s                 s = 1  (points at the 8)',
          '     i                 i = 1:  8 > 4  ->  skip',
        ].join('\n'),
      },
      {
        caption: 'i = 2 finds 2, which is small, so it swaps into slot s and pushes the big value rightward.',
        frame: [
          '[ 3  8  2  5  1  4 ]',
          '     s                 swap a[2] with a[1]',
          '        i',
          '[ 3  2  8  5  1  4 ]   s = 2',
        ].join('\n'),
      },
      {
        caption: 'i = 4 finds 1, the last small value. Then the pivot is swapped into slot s and is final forever.',
        frame: [
          '[ 3  2  8  5  1  4 ]',
          '        s              swap a[4] with a[2]',
          '              i',
          '[ 3  2  1  5  8  4 ]   s = 3, scan over',
          '[ 3  2  1  4  8  5 ]   pivot dropped into slot 3',
          'now recurse on [3 2 1] and on [8 5]',
        ].join('\n'),
      },
      {
        caption: 'Good pivots: each split is roughly even, so there are about log2(n) levels and each level does O(n) work.',
        frame: [
          'balanced pivots, n = 8',
          'level 0        [ 8 items ]        work 8',
          'level 1     [4]        [4]        work 8',
          'level 2   [2] [2]    [2] [2]      work 8',
          'levels = log2(8) = 3  ->  total 8 * 3 = 24',
        ].join('\n'),
      },
      {
        caption: 'Bad pivots: always taking the last cell on sorted input peels off one element per level. That is n levels and O(n^2).',
        frame: [
          'sorted input, pivot = last cell',
          '[1 2 3 4 5]  ->  pivot 5, left 4 items, right 0',
          '[1 2 3 4]    ->  pivot 4, left 3 items, right 0',
          '[1 2 3]      ->  pivot 3, and so on',
          '5 levels, work 5+4+3+2+1 = 15, which is n^2 / 2',
          'a random pivot makes this pattern practically impossible',
        ].join('\n'),
      },
    ],
    pseudocode: `function quickSort(a, lo, hi):        // sorts a[lo .. hi], ends included
    while lo < hi:
        p = randomIndexBetween(lo, hi)
        swap a[p] and a[hi]           // move the pivot out of the way
        s = partition(a, lo, hi)
        if s - lo < hi - s:           // recurse into the smaller side only
            quickSort(a, lo, s - 1)   // this keeps the stack O(log n)
            lo = s + 1                // then loop on the bigger side
        else:
            quickSort(a, s + 1, hi)
            hi = s - 1

function partition(a, lo, hi):        // the pivot value sits at a[hi]
    pivot = a[hi]
    s = lo
    for i from lo to hi - 1:
        if a[i] < pivot:
            swap a[i] and a[s]
            s = s + 1
    swap a[s] and a[hi]
    return s                          // a[s] is now in its final place`,
    complexity: [
      { label: 'Best case', time: 'O(n log n)', space: 'O(log n)', note: 'pivot splits evenly, giving about log2(n) levels' },
      { label: 'Average with a random pivot', time: 'O(n log n) expected', space: 'O(log n)', note: 'expected over the random pivots, not over the inputs' },
      { label: 'Worst case', time: 'O(n^2)', space: 'O(n), or O(log n) with the smaller-side trick', note: 'every pivot is the smallest or largest value, so there are n levels' },
      { label: 'Quickselect for the k-th value', time: 'O(n) average, O(n^2) worst', space: 'O(1)', note: 'recurses into one side only: n + n/2 + n/4 + ... = 2n' },
      { label: 'The partition step alone', time: 'O(n)', space: 'O(1)', note: 'one sweep, swapping in place, no extra array' },
    ],
    dryRun: {
      input: 'arr = [3, 8, 2, 5, 1, 4], and the random pivot pick happens to land on index 5',
      goal: 'Sort arr in place with the optimized random-pivot quick_sort above.',
      steps: [
        { state: 'a = [3, 8, 2, 5, 1, 4], lo=0, hi=5', action: 'lo < hi so we partition. The random pick is p = 5, which is already the last cell, so the swap changes nothing and pivot = 4.' },
        { state: 'pivot=4 store=0 i=0 a[0]=3', action: '3 < 4, so swap a[0] with a[0] (no visible change) and move store to 1.' },
        { state: 'store=1 i=1 a[1]=8', action: '8 is not less than 4, so nothing moves and store stays at 1, marking where the 8 sits.' },
        { state: 'store=1 i=2 a[2]=2', action: '2 < 4, so swap a[2] with a[1]. The array becomes [3, 2, 8, 5, 1, 4] and store becomes 2.' },
        { state: 'store=2 i=3 a[3]=5', action: '5 is not less than 4, so skip it and leave store alone.' },
        { state: 'store=2 i=4 a[4]=1', action: '1 < 4, so swap a[4] with a[2]. The array becomes [3, 2, 1, 5, 8, 4] and store becomes 3.' },
        { state: 'store=3, scan finished', action: 'Swap a[3] with a[5] to drop the pivot into place: [3, 2, 1, 4, 8, 5]. Index 3 is now final.' },
        { state: 'left = a[0..2] = [3, 2, 1], right = a[4..5] = [8, 5]', action: 'Recurse on both sides. The pivot at index 3 is never touched again by either call.' },
        { state: 'left becomes [1, 2, 3], right becomes [5, 8]', action: 'Each side runs the same partition dance on three and two elements.' },
      ],
      result:
        'arr becomes [1, 2, 3, 4, 5, 8]. It is correct because after every partition each value left of the pivot is smaller and each value right of it is larger, so sorting the two sides sorts the whole range.',
    },
    mistakes: [
      {
        mistake: 'Always using the first or last element as the pivot in real code.',
        why: 'Sorted, reverse sorted and mostly-equal inputs are all common, and each of them forces n levels, so the sort silently becomes O(n^2).',
        fix: 'Pick the pivot at random, or take the median of the first, middle and last cell, and say why while you write it.',
      },
      {
        mistake: 'Recursing on [lo, s] and [s, hi], leaving the pivot inside a sub-range.',
        why: 'When the pivot lands at an end, one sub-range is the same size as the original, so the recursion never shrinks and never terminates.',
        fix: 'The pivot at index s is already final. Recurse on [lo, s - 1] and [s + 1, hi] only.',
      },
      {
        mistake: 'Saying quick sort is stable, or that its average O(n log n) is a guarantee.',
        why: 'Partitioning swaps distant elements, so equal items can change order, and O(n log n) is only the expectation over pivot choices, not a bound.',
        fix: 'Say it plainly: expected O(n log n), worst case O(n^2), not stable. Offer merge sort when a guarantee or stability is required.',
      },
      {
        mistake: 'Using the two-way Lomuto partition on an array full of equal keys.',
        why: 'The test is a[i] < pivot, so no equal value moves left. The pivot ends up at an end each time and an all-equal array degrades to n levels.',
        fix: 'Use a three-way Dutch national flag partition that groups less, equal and greater, which makes all-equal input O(n).',
      },
      {
        mistake: 'Fully sorting both sides when the question only asks for the k-th value.',
        why: 'Sorting the side that cannot possibly contain index k is wasted work, and it pushes the cost back up to O(n log n).',
        fix: 'After partitioning, compare s with the target index and recurse into that one side only. That is quickselect, O(n) on average.',
      },
    ],
    whenToUse: [
      'You must sort in place with only O(log n) extra memory.',
      'The question is "k-th largest" or "top k" on a large array, where quickselect gives O(n) on average.',
      '"Sort colors" or "move every value below x to the front" is a single partition pass.',
      'Average speed matters more than a worst-case guarantee, for example on random or shuffled data.',
      'The interviewer asks how a library sort works under the hood.',
    ],
    whenNotToUse: [
      'You need a hard worst-case guarantee, for example on adversarial input; merge sort or heap sort are O(n log n) always.',
      'Equal elements must keep their original order, since quick sort is not stable; use merge sort or Timsort.',
      'The data is a linked list, where partitioning needs random access; merge sort is the natural list sort.',
      'The array is small or nearly sorted, where insertion sort finishes in roughly O(n).',
      'Values are small integers in a known range, where counting or radix sort beats any comparison sort at O(n + k).',
    ],
    relatedTopics: [
      { id: 'merge-sort', kind: 'concept', why: 'The stable, guaranteed O(n log n) alternative, trading in-place work for an O(n) buffer.' },
      { id: 'divide-and-conquer', kind: 'pattern', why: 'Quick sort divides with the partition and needs no combine step at all.' },
      { id: 'two-pointers', kind: 'pattern', why: 'Partitioning, including the three-way Dutch flag version, is a two-pointer sweep.' },
      { id: 'top-k-heap', kind: 'pattern', why: 'The heap alternative for top-k: O(n log k) worst case versus quickselect at O(n) average.' },
      { id: 'sorting-basics', kind: 'concept', why: 'Places quick sort among the other sorts and explains what libraries actually run.' },
    ],
    quiz: [
      {
        question: 'What is the worst-case time of quick sort when the pivot is chosen at random?',
        options: [
          'O(n log n), randomness removes the worst case',
          'O(n^2), but the chance of hitting it is vanishingly small',
          'O(n)',
          'O(n log^2 n)',
        ],
        answerIndex: 1,
        explanation: 'Randomness changes the probability, not the set of possible outcomes. The expected time is O(n log n), but a long run of unlucky pivots is still O(n^2).',
      },
      {
        question: 'What do typical modern library sorts actually use?',
        options: [
          'Plain quick sort with the last element as pivot',
          'Bubble sort with an early exit',
          'Introsort, which is quick sort that switches to heap sort when it recurses too deep, for C++; and Timsort, a merge sort with run detection, for Python and Java objects',
          'Counting sort',
        ],
        answerIndex: 2,
        explanation: 'Both designs exist precisely to keep quick sort speed while removing its O(n^2) worst case or adding stability.',
      },
      {
        question: 'You need the 5th largest of 10^6 unsorted integers and memory is tight. Best approach?',
        options: [
          'Sort the whole array, then index it, at O(n log n)',
          'Quickselect with a random pivot: O(n) expected and no extra array',
          'Bubble sort and stop after 5 passes',
          'Binary search the array',
        ],
        answerIndex: 1,
        explanation: 'Quickselect partitions and then recurses into one side only, so the work adds up to about 2n and it needs no extra storage.',
      },
      {
        question: 'Why is the median-of-three pivot rule popular?',
        options: [
          'It makes quick sort stable',
          'It guarantees O(n log n)',
          'It cheaply avoids the worst case on sorted and reverse-sorted data, which are the common bad inputs',
          'It reduces memory use',
        ],
        answerIndex: 2,
        explanation: 'It costs two extra comparisons and removes the everyday bad cases, but a crafted input can still defeat it, unlike a truly random pivot.',
      },
      {
        question: 'The array is [7, 7, 7, 7, 7, 7]. What does the classic two-way Lomuto partition do with it?',
        options: [
          'Finishes in O(n) because all the values are equal',
          'Pushes every element to one side, so the recursion is n levels deep and the sort is O(n^2)',
          'Crashes with an index error',
          'Is unaffected, because the pivot is chosen at random',
        ],
        answerIndex: 1,
        explanation: 'The test is a[i] < pivot, so no equal value moves left and the pivot lands at an end every time. A three-way partition fixes this and a random pivot does not.',
      },
    ],
    sources: [
      'CLRS ch. 7 (quicksort) and ch. 9 (medians and order statistics)',
      'MIT 6.006: randomized selection',
      'MIT 6.046: analysis of randomized quicksort',
      'CP-Algorithms: Sorting and the k-th order statistic',
      'CPython listsort notes, and the introsort design used by C++ standard libraries',
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
        tier: 'beginner',
      },
      {
        id: 'partition-array-according-to-given-pivot',
        title: 'Partition Array According to Given Pivot',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/partition-array-according-to-given-pivot/',
        patternId: 'two-pointers',
        hint: 'Order must be preserved within groups, so collect less, equal and greater in three passes or lists and concatenate.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'kth-largest-element-in-an-array',
        title: 'Kth Largest Element in an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        patternId: 'divide-and-conquer',
        hint: 'Quickselect: partition, then recurse only into the side that contains index n - k.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
        patternId: 'top-k-heap',
        hint: 'Count frequencies, then quickselect (or a heap of size k) on the unique values by frequency.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'k-closest-points-to-origin',
        title: 'K Closest Points to Origin',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
        patternId: 'top-k-heap',
        hint: 'Partition points by squared distance with quickselect until the first k are the closest; no need to sort them.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
]
