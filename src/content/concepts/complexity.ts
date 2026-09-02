import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'big-o-basics',
    gateId: 'complexity',
    order: 1,
    title: 'Big-O Basics: Counting Steps, Not Seconds',
    minutes: 25,
    summary: 'Big-O describes how the work your code does grows as the input grows, ignoring the machine it runs on.',
    analogy:
      'Imagine two ways to find a friend in a stadium. You could walk past every seat (slow, and twice as slow if the stadium doubles in size), or you could call their phone (the same one step no matter how big the stadium is). Big-O is the language for describing that difference.',
    explanation: `Big-O is a way to describe how fast the work of a piece of code grows when the input gets bigger. It does not measure seconds. It measures the shape of the growth. This matters because an interviewer does not care that your code ran in 2 seconds on your laptop; they care whether it will still be fine with a million items.

## The idea

- Count the number of "basic steps" your code takes as a function of the input size, usually called **n**.
- Throw away constants and smaller terms. \`3n + 10\` becomes **O(n)**. \`n^2 + n\` becomes **O(n^2)**.
- Keep only the fastest-growing part. That part decides what happens when n is huge.

Why throw away constants? Because for n = 1,000,000 the difference between 3n and n is nothing compared to the difference between n and n^2.

## A tiny example

We want the sum of the numbers from 1 to n.

The slow way loops through every number:

\`\`\`python
def sum_to_n(n):
    total = 0
    for i in range(1, n + 1):   # runs n times
        total += i
    return total
\`\`\`

The loop body runs n times, so this is **O(n)**. Double n, double the work.

The fast way uses the formula from school:

\`\`\`python
def sum_to_n(n):
    return n * (n + 1) // 2      # one multiplication, one division
\`\`\`

This does the same three operations no matter how big n is. That is **O(1)**, called "constant time".

## Step by step: how to read a Big-O

1. Find the input size. It is usually the length of a list or string.
2. Look for loops. One loop over n items is O(n). A loop inside a loop over the same items is O(n^2).
3. Look at what you call. \`list.sort()\` is O(n log n). \`x in my_list\` is O(n). \`x in my_set\` is O(1).
4. Add work that happens one after another. Multiply work that happens inside other work.
5. Drop constants and smaller terms.

## Where people go wrong

- Thinking O(1) means "instant". It means "does not grow with n". A constant step can still be slow, it just stays the same.
- Forgetting that built-in functions have a cost. \`max(arr)\` inside a loop is a hidden nested loop.
- Confusing "fewer lines of code" with "faster". A one-line \`if x in list\` hides an O(n) scan.
- Measuring with a stopwatch on tiny inputs. On 10 items everything looks fast.

## How to recognise it in an interview

- "What is the time complexity of your solution?" is a request for Big-O.
- "Can you do better?" almost always means "drop one level", for example O(n^2) to O(n log n) or O(n).
- Constraints like "n can be up to 10^5" are a hint: O(n^2) would be 10^10 steps, which is too slow. O(n) or O(n log n) is expected.`,
    naive: {
      title: 'Loop: add every number from 1 to n',
      description:
        'Walk through each number and add it to a running total. The amount of work grows directly with n, so if n doubles the loop runs twice as long.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def sum_to_n(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

print(sum_to_n(100))  # 5050`,
        javascript: `function sumToN(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

console.log(sumToN(100)); // 5050`,
        java: `public class Solution {
  public static long sumToN(int n) {
    long total = 0;
    for (int i = 1; i <= n; i++) {
      total += i;
    }
    return total;
  }

  public static void main(String[] args) {
    System.out.println(sumToN(100)); // 5050
  }
}`,
        cpp: `#include <iostream>

long long sumToN(int n) {
  long long total = 0;
  for (int i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

int main() {
  std::cout << sumToN(100) << std::endl; // 5050
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Formula: n * (n + 1) / 2',
      description:
        'Use the closed formula for the sum of the first n numbers. It always does the same tiny amount of work, whether n is 10 or 10 billion.',
      time: 'O(1)',
      space: 'O(1)',
      code: {
        python: `def sum_to_n(n):
    return n * (n + 1) // 2

print(sum_to_n(100))  # 5050`,
        javascript: `function sumToN(n) {
  return (n * (n + 1)) / 2;
}

console.log(sumToN(100)); // 5050`,
        java: `public class Solution {
  public static long sumToN(long n) {
    return n * (n + 1) / 2;
  }

  public static void main(String[] args) {
    System.out.println(sumToN(100)); // 5050
  }
}`,
        cpp: `#include <iostream>

long long sumToN(long long n) {
  return n * (n + 1) / 2;
}

int main() {
  std::cout << sumToN(100) << std::endl; // 5050
  return 0;
}`,
      },
    },
    whyFaster:
      'The loop does n additions, so its work grows in a straight line with n. The formula does three arithmetic operations regardless of n. We went from O(n) to O(1) by replacing repeated work with a direct answer, which is the most extreme kind of speed-up you can get.',
    keyPoints: [
      'Big-O describes how work grows with input size n, not how many seconds code takes.',
      'Drop constants and smaller terms: 3n + 10 is O(n), n^2 + n is O(n^2).',
      'One loop over n items is O(n); a loop inside a loop is O(n^2).',
      'Built-in calls have hidden costs: `x in list` is O(n), `x in set` is O(1), sort is O(n log n).',
      'Problem constraints tell you the target: n up to 10^5 means O(n^2) is too slow.',
    ],
    patternIds: ['brute-force'],
    problems: [
      {
        id: 'richest-customer-wealth',
        title: 'Richest Customer Wealth',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/richest-customer-wealth/',
        patternId: 'brute-force',
        hint: 'Sum each row, keep the largest sum; count how many times the inner loop runs to name the Big-O.',
        xp: 20,
      },
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/contains-duplicate/',
        patternId: 'hash-map',
        hint: 'Compare the nested-loop version to one that remembers what it has seen in a set.',
        xp: 20,
      },
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/two-sum/',
        patternId: 'hash-map',
        hint: 'Write the O(n^2) pair check first, then ask what you could store to avoid the inner loop.',
        xp: 20,
      },
      {
        id: 'number-of-good-pairs',
        title: 'Number of Good Pairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/number-of-good-pairs/',
        patternId: 'hash-map',
        hint: 'Each time you see a number, the count of earlier copies is how many new pairs it makes.',
        xp: 20,
      },
    ],
  },
  {
    id: 'time-vs-space',
    gateId: 'complexity',
    order: 2,
    title: 'Time vs Space: The Trade You Make Every Day',
    minutes: 25,
    summary: 'Time complexity is how long code takes; space complexity is how much extra memory it needs, and you can often trade one for the other.',
    analogy:
      'Cooking for a party, you can wash and reuse one bowl (little space, lots of time) or use a fresh bowl for every step (lots of space, little time). Neither is wrong. The right choice depends on how many bowls you own and how much time you have.',
    explanation: `Time complexity counts steps. Space complexity counts extra memory your code needs beyond the input itself. Many fast solutions are fast because they store something: a set, a map, an extra array. Knowing this trade-off lets you choose on purpose instead of by accident.

## The idea

- **Time** = how many basic operations, as a function of n.
- **Space** = how much extra memory, as a function of n. The input does not count. A few variables count as O(1).
- A classic trade: spend O(n) memory to remember things so you do not have to look them up again, and time drops from O(n^2) to O(n).

## A tiny example

Question: does this list contain any duplicate value?

The slow way checks every pair and uses no extra memory:

\`\`\`python
def has_duplicate(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False
\`\`\`

Time is **O(n^2)** because of the nested loop. Space is **O(1)** because we only use i and j.

The fast way remembers what it has seen:

\`\`\`python
def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
\`\`\`

Time is **O(n)** because we visit each number once and set lookups are O(1). Space is **O(n)** because the set may hold every number. We bought time with memory.

## Step by step: measuring space

1. List every container you create: lists, sets, dicts, strings you build.
2. Ask how big each one gets in the worst case. A set of all inputs is O(n). A list of 26 letter counts is O(1) because 26 never changes.
3. Add recursion depth. Each open recursive call sits on the call stack, so a recursion n levels deep uses O(n) space even with no containers.
4. Report the largest term.

## Where people go wrong

- Saying "O(1) space" while building a new list of size n. Copies and slices like \`arr[1:]\` allocate memory.
- Forgetting the recursion stack. A recursive function that goes n deep is O(n) space.
- Assuming less memory is always better. In interviews, O(n) space for an O(n) time solution is usually the expected answer. Only reach for O(1) space if asked.
- Confusing "in-place" (modifies the input) with "no extra memory". In-place solutions are usually O(1) space, but check for hidden helpers.

## How to recognise it in an interview

- "Can you do it in constant space?" or "in-place" means they want you to drop the extra container, often by using two pointers or by reusing the input array.
- "Optimize for time" means it is fine to build a map or set.
- When they ask "what is the space complexity?" mention both containers and recursion depth. That signals you really understand it.`,
    naive: {
      title: 'Nested loop: no extra memory, quadratic time',
      description:
        'Compare every element with every later element. It uses only two counters, so memory is tiny, but the number of comparisons explodes as n grows.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def has_duplicate(nums):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] == nums[j]:
                return True
    return False

print(has_duplicate([3, 1, 4, 1]))  # True`,
        javascript: `function hasDuplicate(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}

console.log(hasDuplicate([3, 1, 4, 1])); // true`,
        java: `public class Solution {
  public static boolean hasDuplicate(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (nums[i] == nums[j]) return true;
      }
    }
    return false;
  }

  public static void main(String[] args) {
    System.out.println(hasDuplicate(new int[]{3, 1, 4, 1})); // true
  }
}`,
        cpp: `#include <iostream>
#include <vector>

bool hasDuplicate(const std::vector<int>& nums) {
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] == nums[j]) return true;
    }
  }
  return false;
}

int main() {
  std::cout << hasDuplicate({3, 1, 4, 1}) << std::endl; // 1
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Hash set: spend memory to save time',
      description:
        'Walk the list once and remember every value in a set. Checking whether a value was seen before is a single O(1) lookup, so the inner loop disappears.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False

print(has_duplicate([3, 1, 4, 1]))  # True`,
        javascript: `function hasDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

console.log(hasDuplicate([3, 1, 4, 1])); // true`,
        java: `import java.util.HashSet;

public class Solution {
  public static boolean hasDuplicate(int[] nums) {
    HashSet<Integer> seen = new HashSet<>();
    for (int x : nums) {
      if (seen.contains(x)) return true;
      seen.add(x);
    }
    return false;
  }

  public static void main(String[] args) {
    System.out.println(hasDuplicate(new int[]{3, 1, 4, 1})); // true
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <unordered_set>

bool hasDuplicate(const std::vector<int>& nums) {
  std::unordered_set<int> seen;
  for (int x : nums) {
    if (seen.count(x)) return true;
    seen.insert(x);
  }
  return false;
}

int main() {
  std::cout << hasDuplicate({3, 1, 4, 1}) << std::endl; // 1
  return 0;
}`,
      },
    },
    whyFaster:
      'The nested loop asks "have I seen this before?" by re-scanning the list, which costs O(n) per element and O(n^2) total. The set answers the same question in O(1) because it remembers everything. We paid O(n) memory for the set and got O(n) time in return; that is the time-space trade-off in its purest form.',
    keyPoints: [
      'Time complexity counts steps; space complexity counts extra memory beyond the input.',
      'The most common trade: store things in a set or map (O(n) space) to avoid a nested loop (O(n^2) time).',
      'Recursion depth counts as space. A recursion n levels deep uses O(n) stack memory.',
      'Slices, copies and new lists allocate memory even if the code looks short.',
      '"In-place" or "constant space" in a problem means: no extra containers, reuse the input.',
    ],
    patternIds: ['brute-force', 'hash-map'],
    problems: [
      {
        id: 'reverse-string',
        title: 'Reverse String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/reverse-string/',
        patternId: 'two-pointers',
        hint: 'Swap the first and last characters and move both pointers inward; no new array needed.',
        xp: 20,
      },
      {
        id: 'missing-number',
        title: 'Missing Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/missing-number/',
        patternId: 'bit-manipulation',
        hint: 'A set works in O(n) space; the sum formula or XOR gets you the same answer in O(1) space.',
        xp: 20,
      },
      {
        id: 'find-all-numbers-disappeared-in-an-array',
        title: 'Find All Numbers Disappeared in an Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
        patternId: 'cyclic-sort',
        hint: 'Use the input array itself as the "seen" set by marking index (value - 1) in some way.',
        xp: 20,
      },
      {
        id: 'find-all-duplicates-in-an-array',
        title: 'Find All Duplicates in an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/',
        patternId: 'cyclic-sort',
        hint: 'Values are 1..n, so each value has a home index; a value whose home is already marked is a duplicate.',
        xp: 40,
      },
    ],
  },
  {
    id: 'common-complexities',
    gateId: 'complexity',
    order: 3,
    title: 'Common Complexities: The Ladder from O(1) to O(n!)',
    minutes: 30,
    summary: 'Learn the handful of growth rates you will meet again and again, what code shapes produce them, and how big an input each one can handle.',
    analogy:
      'Think of complexities as vehicles. O(1) is teleporting. O(log n) is a plane. O(n) is a car. O(n log n) is a car that stops at every toll booth. O(n^2) is walking. O(2^n) is crawling. For a short trip they all arrive; for a long trip only the first few ever get there.',
    explanation: `There are only about seven complexities you need to know by heart. Once you can match each one to the shape of code that produces it, reading and improving solutions becomes much faster. This concept is the reference table you will come back to.

## The ladder, fastest to slowest

- **O(1)** constant. Array index, dict lookup, arithmetic. Does not grow with n.
- **O(log n)** logarithmic. Binary search. Each step halves the problem. For n = 1,000,000 that is only about 20 steps.
- **O(n)** linear. One pass over the data. Finding a max, counting, a single loop.
- **O(n log n)** linearithmic. Good sorting (merge sort, Timsort), or doing a log n thing n times.
- **O(n^2)** quadratic. Nested loops over the same input. Bubble sort, checking all pairs.
- **O(2^n)** exponential. Trying every subset. Doubles with every extra item.
- **O(n!)** factorial. Trying every ordering (permutations). Explodes almost immediately.

## How big can n be?

A rough rule: a computer does about 10^8 simple steps per second. So for a 1-second limit:

- O(n^2) works up to about n = 10^4.
- O(n log n) works up to about n = 10^6.
- O(n) works up to about n = 10^8.
- O(2^n) only works up to about n = 20-25.
- O(n!) only works up to about n = 10-11.

Read the constraints in a problem, find n, and this table tells you which complexity you are allowed.

## A tiny example

Find the smallest difference between any two numbers in a list.

The slow way checks every pair:

\`\`\`python
def min_diff(nums):
    best = float('inf')
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            best = min(best, abs(nums[i] - nums[j]))
    return best
\`\`\`

Two nested loops over n items: **O(n^2)**.

The fast way sorts first. After sorting, the closest pair must be neighbours:

\`\`\`python
def min_diff(nums):
    nums.sort()                       # O(n log n)
    best = float('inf')
    for i in range(1, len(nums)):     # O(n)
        best = min(best, nums[i] - nums[i - 1])
    return best
\`\`\`

Sorting costs O(n log n) and the scan costs O(n). We keep the bigger term: **O(n log n)**. For n = 100,000 that is about 1.7 million steps instead of 5 billion.

## Where people go wrong

- Treating O(n log n) as "basically O(n^2)". They are worlds apart for large n.
- Writing O(2^n) recursion without noticing. If a function calls itself twice with n - 1, that is exponential.
- Forgetting that two separate loops one after another are O(n) + O(n) = O(n), not O(n^2).
- Believing log n is a big number. It is tiny: log2 of a billion is about 30.

## How to recognise it in an interview

- "Sorted" in the problem usually means O(log n) search is available.
- "All subsets" or "all combinations" means O(2^n) is expected and n will be small.
- "All orderings" means O(n!) and n will be under 10.
- n up to 10^5 or larger means you must find O(n) or O(n log n).`,
    naive: {
      title: 'All pairs: compare every number with every other',
      description:
        'Check the difference of every possible pair and keep the smallest. Simple to write, but the pair count grows with the square of n.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def min_diff(nums):
    best = float('inf')
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            best = min(best, abs(nums[i] - nums[j]))
    return best

print(min_diff([8, 1, 5, 12]))  # 3`,
        javascript: `function minDiff(nums) {
  let best = Infinity;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      best = Math.min(best, Math.abs(nums[i] - nums[j]));
    }
  }
  return best;
}

console.log(minDiff([8, 1, 5, 12])); // 3`,
        java: `public class Solution {
  public static int minDiff(int[] nums) {
    int best = Integer.MAX_VALUE;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        best = Math.min(best, Math.abs(nums[i] - nums[j]));
      }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(minDiff(new int[]{8, 1, 5, 12})); // 3
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <climits>
#include <cstdlib>

int minDiff(const std::vector<int>& nums) {
  int best = INT_MAX;
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      best = std::min(best, std::abs(nums[i] - nums[j]));
    }
  }
  return best;
}

int main() {
  std::cout << minDiff({8, 1, 5, 12}) << std::endl; // 3
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Sort first, then compare neighbours',
      description:
        'After sorting, the two closest values must sit next to each other. So sort once and scan adjacent pairs in a single pass.',
      time: 'O(n log n)',
      space: 'O(1)',
      code: {
        python: `def min_diff(nums):
    nums = sorted(nums)
    best = float('inf')
    for i in range(1, len(nums)):
        best = min(best, nums[i] - nums[i - 1])
    return best

print(min_diff([8, 1, 5, 12]))  # 3`,
        javascript: `function minDiff(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  let best = Infinity;
  for (let i = 1; i < sorted.length; i++) {
    best = Math.min(best, sorted[i] - sorted[i - 1]);
  }
  return best;
}

console.log(minDiff([8, 1, 5, 12])); // 3`,
        java: `import java.util.Arrays;

public class Solution {
  public static int minDiff(int[] nums) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int best = Integer.MAX_VALUE;
    for (int i = 1; i < sorted.length; i++) {
      best = Math.min(best, sorted[i] - sorted[i - 1]);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(minDiff(new int[]{8, 1, 5, 12})); // 3
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

int minDiff(std::vector<int> nums) {
  std::sort(nums.begin(), nums.end());
  int best = INT_MAX;
  for (size_t i = 1; i < nums.size(); i++) {
    best = std::min(best, nums[i] - nums[i - 1]);
  }
  return best;
}

int main() {
  std::cout << minDiff({8, 1, 5, 12}) << std::endl; // 3
  return 0;
}`,
      },
    },
    whyFaster:
      'The pair check does about n^2 / 2 comparisons. Sorting costs O(n log n) but gives us structure: the closest pair is now guaranteed to be adjacent, so one O(n) scan finishes the job. O(n log n) + O(n) simplifies to O(n log n), one full rung down the ladder from O(n^2).',
    keyPoints: [
      'The ladder: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!).',
      'About 10^8 simple steps per second: O(n^2) is fine up to n = 10^4, O(n log n) up to 10^6.',
      'Sorting is O(n log n) and often turns an O(n^2) pair problem into a neighbour problem.',
      'Two loops one after another add (still O(n)); a loop inside a loop multiplies (O(n^2)).',
      '"All subsets" hints at O(2^n); "all orderings" hints at O(n!); both mean n is small.',
    ],
    patternIds: ['brute-force', 'binary-search', 'backtracking'],
    problems: [
      {
        id: 'guess-number-higher-or-lower',
        title: 'Guess Number Higher or Lower',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/guess-number-higher-or-lower/',
        patternId: 'binary-search',
        hint: 'Each guess in the middle cuts the range in half; count how many halvings n takes to reach 1.',
        xp: 20,
      },
      {
        id: 'majority-element',
        title: 'Majority Element',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/majority-element/',
        patternId: 'hash-map',
        hint: 'Count with a map in one pass (O(n)); compare that to sorting and picking the middle (O(n log n)).',
        xp: 20,
      },
      {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/merge-intervals/',
        patternId: 'merge-intervals',
        hint: 'Sort by start time so overlapping intervals become neighbours, then walk once.',
        xp: 40,
      },
      {
        id: 'subsets',
        title: 'Subsets',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subsets/',
        patternId: 'backtracking',
        hint: 'Every element is either in or out, which is why the output has 2^n entries.',
        xp: 40,
      },
      {
        id: 'permutations',
        title: 'Permutations',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/permutations/',
        patternId: 'backtracking',
        hint: 'Pick a first element n ways, then n - 1 ways for the next: the output size is n! so n must be small.',
        xp: 40,
      },
    ],
  },
  {
    id: 'analyzing-loops-and-recursion',
    gateId: 'complexity',
    order: 4,
    title: 'Analyzing Loops and Recursion',
    minutes: 30,
    summary: 'Learn the mechanical rules for turning loops, halving steps and recursive calls into a Big-O, including the recursion trap that makes O(2^n) code look innocent.',
    analogy:
      'Analyzing code is like estimating a bill at a restaurant. Items ordered one after another add up. Items ordered "for each person at the table" multiply. And if every guest invites two more guests who each invite two more, you are not paying for dinner, you are paying for a wedding.',
    explanation: `Once you know the ladder of complexities, the next skill is looking at real code and naming its rung. There are only a few rules. Loops multiply or add, halving means log, and recursion means "how many calls, times how much work per call".

## Rules for loops

- One loop over n items: **O(n)**.
- A loop inside a loop, both over n: **O(n^2)**. Three deep: O(n^3).
- Two loops one after the other: O(n) + O(n) = **O(n)**. Sequential work adds; nested work multiplies.
- Inner loop from i to n instead of 0 to n: still **O(n^2)**. It does about half the work, but half of n^2 is still n^2.
- A loop that halves or doubles a value each step (\`i = i * 2\`, \`n = n // 2\`): **O(log n)**.
- A loop over n where each step does an O(log n) thing: **O(n log n)**.

## Rules for recursion

Ask two questions: how many calls happen in total, and how much work does each call do outside the recursive calls?

- One recursive call with n - 1: n calls, so O(n) times the work per call.
- One recursive call with n / 2: log n calls (like binary search).
- Two recursive calls with n - 1 each: the calls double every level, so about 2^n calls. **O(2^n)**.
- Two recursive calls with n / 2 each, plus O(n) work to combine: **O(n log n)** (merge sort).

## A tiny example

Fibonacci: f(n) = f(n - 1) + f(n - 2).

The slow way is the obvious recursion:

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
\`\`\`

Every call makes two more calls. fib(5) calls fib(3) twice and fib(2) three times. The total is about 2^n calls: **O(2^n)** time and O(n) space for the call stack. fib(40) takes seconds; fib(50) takes hours.

The fast way keeps the last two values in a loop:

\`\`\`python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`

One loop of n steps: **O(n)** time, O(1) space. Same answer, no repeated work.

## Step by step: analyze any function

1. Find n (usually the input length).
2. Mark each loop with its number of iterations.
3. Nested? Multiply. Sequential? Add.
4. For recursion, draw the first two levels of the call tree and count the branching.
5. Simplify by dropping constants and smaller terms.

## Where people go wrong

- Seeing one line and assuming O(1). \`sum(arr)\`, \`arr.index(x)\` and \`s in text\` are all O(n).
- Counting a while loop that halves as O(n). Halving is always log n.
- Missing the exponential branch. If a function calls itself more than once per call with almost the same size, alarm bells should ring.
- Forgetting that a recursive call that slices the list (\`arr[1:]\`) costs O(n) per call, turning O(n) into O(n^2).

## How to recognise it in an interview

- If your recursion has two branches and the interviewer asks "what happens for n = 50?", they are pointing at O(2^n). Memoization or a loop is the fix.
- "While the number is bigger than one, divide by two" is your cue to say log n.
- When asked to analyze someone else's code, narrate: "this loop runs n times, and inside it we do a set lookup which is O(1), so O(n) overall". Narration earns points.`,
    naive: {
      title: 'Plain recursion: fib(n) = fib(n-1) + fib(n-2)',
      description:
        'Directly translates the maths into code. Each call spawns two more calls, so the same sub-results are computed again and again. The call tree has about 2^n nodes.',
      time: 'O(2^n)',
      space: 'O(n)',
      code: {
        python: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))  # 55`,
        javascript: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(10)); // 55`,
        java: `public class Solution {
  public static long fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
  }

  public static void main(String[] args) {
    System.out.println(fib(10)); // 55
  }
}`,
        cpp: `#include <iostream>

long long fib(int n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

int main() {
  std::cout << fib(10) << std::endl; // 55
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Iterative: keep only the last two values',
      description:
        'Build the sequence from the bottom up. Each number is computed exactly once from the two before it, so there is no repeated work and no deep call stack.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib(10))  # 55`,
        javascript: `function fib(n) {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a;
}

console.log(fib(10)); // 55`,
        java: `public class Solution {
  public static long fib(int n) {
    long a = 0;
    long b = 1;
    for (int i = 0; i < n; i++) {
      long next = a + b;
      a = b;
      b = next;
    }
    return a;
  }

  public static void main(String[] args) {
    System.out.println(fib(10)); // 55
  }
}`,
        cpp: `#include <iostream>

long long fib(int n) {
  long long a = 0;
  long long b = 1;
  for (int i = 0; i < n; i++) {
    long long next = a + b;
    a = b;
    b = next;
  }
  return a;
}

int main() {
  std::cout << fib(10) << std::endl; // 55
  return 0;
}`,
      },
    },
    whyFaster:
      'The recursive version recomputes fib(k) many times: fib(2) alone is computed millions of times for n = 40, so the call count grows like 2^n. The loop computes each fib(k) exactly once, in order, so the work is n steps. Going from O(2^n) to O(n) is the difference between "never finishes" and "instant" for n = 100.',
    keyPoints: [
      'Sequential loops add; nested loops multiply; a loop that halves each step is O(log n).',
      'For recursion, count total calls times work per call. Two branches with n - 1 means O(2^n).',
      'A recursive call n levels deep uses O(n) stack space even without any containers.',
      'One-line built-ins can hide O(n): sum, index, in on a list, slicing.',
      'Fix exponential recursion by memoizing or by rebuilding bottom-up with a loop.',
    ],
    patternIds: ['brute-force', 'recursion'],
    problems: [
      {
        id: 'fibonacci-number',
        title: 'Fibonacci Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/fibonacci-number/',
        patternId: 'recursion',
        hint: 'Write the two-branch recursion, count its calls for n = 30, then replace it with a loop over two variables.',
        xp: 20,
      },
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        patternId: 'dp-1d',
        hint: 'Ways to reach step n = ways to reach n - 1 plus ways to reach n - 2; it is Fibonacci in disguise.',
        xp: 20,
      },
      {
        id: 'pascals-triangle',
        title: "Pascal's Triangle",
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/pascals-triangle/',
        patternId: 'brute-force',
        hint: 'Row i has i + 1 entries, so building all rows is a nested loop; add up 1 + 2 + ... + n to name the Big-O.',
        xp: 20,
      },
      {
        id: 'powx-n',
        title: 'Pow(x, n)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/powx-n/',
        patternId: 'divide-and-conquer',
        hint: 'x^n is (x^(n/2))^2, so one recursive call on half the exponent gives O(log n) instead of n multiplications.',
        xp: 40,
      },
      {
        id: 'k-th-symbol-in-grammar',
        title: 'K-th Symbol in Grammar',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-th-symbol-in-grammar/',
        patternId: 'recursion',
        hint: 'Building row n costs O(2^n); instead relate position k in row n to its parent in row n - 1 with one call.',
        xp: 40,
      },
    ],
  },
]
