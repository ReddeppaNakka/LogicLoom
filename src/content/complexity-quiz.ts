import type { ComplexityQuestion } from './types'

const TIME = 'What is the time complexity?'
const SPACE = 'What is the extra space complexity?'

export const complexityQuestions: ComplexityQuestion[] = [
  // ------------------------------------------------------------------ easy
  {
    id: 'cq-01-single-loop',
    code: {
      python: `def total(nums):
    s = 0
    for x in nums:
        s += x
    return s`,
      javascript: `function total(nums) {
  let s = 0;
  for (const x of nums) s += x;
  return s;
}`,
    },
    question: TIME,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    answerIndex: 2,
    explanation: 'The loop body runs once for each of the n elements and does constant work each time. Total work grows in a straight line with n, so it is O(n).',
    difficulty: 'easy',
  },
  {
    id: 'cq-02-constant',
    code: {
      python: `def first_and_last(nums):
    return nums[0] + nums[-1]`,
      javascript: `function firstAndLast(nums) {
  return nums[0] + nums[nums.length - 1];
}`,
    },
    question: TIME,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    answerIndex: 0,
    explanation: 'Indexing into a list is a direct memory access that does not depend on the list size. Two lookups and one addition is a fixed amount of work: O(1).',
    difficulty: 'easy',
  },
  {
    id: 'cq-03-nested-pairs',
    code: {
      python: `def has_pair(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(n):
            if nums[i] + nums[j] == target:
                return True
    return False`,
      javascript: `function hasPair(nums, target) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (nums[i] + nums[j] === target) return true;
    }
  }
  return false;
}`,
    },
    question: 'What is the worst-case time complexity?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
    answerIndex: 2,
    explanation: 'For each of the n values of i, the inner loop runs n times. In the worst case (no pair found) that is n * n checks, so O(n^2). An early return does not change the worst case.',
    difficulty: 'easy',
  },
  {
    id: 'cq-04-doubling',
    code: {
      python: `def steps(n):
    count = 0
    i = 1
    while i < n:
        i *= 2
        count += 1
    return count`,
      javascript: `function steps(n) {
  let count = 0;
  let i = 1;
  while (i < n) {
    i *= 2;
    count++;
  }
  return count;
}`,
    },
    question: TIME,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answerIndex: 1,
    explanation: 'i doubles every iteration: 1, 2, 4, 8, ... It reaches n after about log2(n) doublings. Whenever a loop variable multiplies or divides by a constant, think logarithm.',
    difficulty: 'easy',
  },
  {
    id: 'cq-05-two-sequential',
    code: {
      python: `def min_and_max(nums):
    lo = nums[0]
    for x in nums:
        lo = min(lo, x)
    hi = nums[0]
    for x in nums:
        hi = max(hi, x)
    return lo, hi`,
      javascript: `function minAndMax(nums) {
  let lo = nums[0];
  for (const x of nums) lo = Math.min(lo, x);
  let hi = nums[0];
  for (const x of nums) hi = Math.max(hi, x);
  return [lo, hi];
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(2n) which is different from O(n)', 'O(n^2)', 'O(n log n)'],
    answerIndex: 0,
    explanation: 'Two loops one after the other add their costs: n + n = 2n. Big-O drops constant factors, so 2n is still O(n). Only nested loops multiply.',
    difficulty: 'easy',
  },
  {
    id: 'cq-06-inner-constant',
    code: {
      python: `def show(nums):
    for x in nums:
        for k in range(10):
            print(x, k)`,
      javascript: `function show(nums) {
  for (const x of nums) {
    for (let k = 0; k < 10; k++) console.log(x, k);
  }
}`,
    },
    question: TIME,
    options: ['O(1)', 'O(n)', 'O(10n) which is different from O(n)', 'O(n^2)'],
    answerIndex: 1,
    explanation: 'The inner loop always runs exactly 10 times, no matter how big n is. 10 * n operations is O(n); the constant 10 is dropped.',
    difficulty: 'easy',
  },
  {
    id: 'cq-07-list-membership',
    code: {
      python: `def contains(nums, target):
    return target in nums`,
      javascript: `function contains(nums, target) {
  return nums.includes(target);
}`,
    },
    question: 'nums is a plain list (array). What is the worst-case time complexity?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    answerIndex: 2,
    explanation: 'The "in" operator on a list checks elements one by one from the start. If the target is missing it has to look at all n. Only sets and dicts give O(1) membership.',
    difficulty: 'easy',
  },
  {
    id: 'cq-08-build-hash-map',
    code: {
      python: `def index_of(nums):
    pos = {}
    for i, x in enumerate(nums):
        pos[x] = i
    return pos`,
      javascript: `function indexOf(nums) {
  const pos = new Map();
  nums.forEach((x, i) => pos.set(x, i));
  return pos;
}`,
    },
    question: TIME,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answerIndex: 2,
    explanation: 'Inserting into a hash map is O(1) on average. Doing that n times costs O(n). Building the map is the price you pay once so later lookups are O(1).',
    difficulty: 'easy',
  },
  {
    id: 'cq-09-matrix-sum',
    code: {
      python: `def matrix_sum(grid):
    s = 0
    for row in grid:
        for value in row:
            s += value
    return s`,
      javascript: `function matrixSum(grid) {
  let s = 0;
  for (const row of grid) {
    for (const value of row) s += value;
  }
  return s;
}`,
    },
    question: 'The grid has r rows and c columns. What is the time complexity?',
    options: ['O(r + c)', 'O(r * c)', 'O(r^2)', 'O(c log r)'],
    answerIndex: 1,
    explanation: 'Every cell is visited exactly once, and there are r * c cells. Nested loops over two different sizes multiply them: O(r * c).',
    difficulty: 'easy',
  },
  {
    id: 'cq-10-triple-loop',
    code: {
      python: `def triples(n):
    count = 0
    for i in range(n):
        for j in range(n):
            for k in range(n):
                count += 1
    return count`,
      javascript: `function triples(n) {
  let count = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++) count++;
  return count;
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(n^2)', 'O(n^3)', 'O(3n)'],
    answerIndex: 2,
    explanation: 'Three nested loops that each run n times give n * n * n iterations. Each nesting level multiplies, so it is O(n^3).',
    difficulty: 'easy',
  },
  {
    id: 'cq-11-binary-search',
    code: {
      python: `def find(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      javascript: `function find(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    },
    question: 'nums is sorted. What is the time complexity?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answerIndex: 1,
    explanation: 'Each iteration throws away half of the remaining range. Halving n until one element is left takes about log2(n) steps, so binary search is O(log n).',
    difficulty: 'easy',
  },
  {
    id: 'cq-12-linear-search',
    code: {
      python: `def find(nums, target):
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1`,
      javascript: `function find(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
    },
    question: 'What is the worst-case time complexity?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    answerIndex: 2,
    explanation: 'In the worst case the target is at the end or missing, so all n elements are checked. Linear search is O(n); it does not need the input to be sorted.',
    difficulty: 'easy',
  },
  {
    id: 'cq-13-space-list',
    code: {
      python: `def zeros(n):
    result = [0] * n
    return result`,
      javascript: `function zeros(n) {
  const result = new Array(n).fill(0);
  return result;
}`,
    },
    question: SPACE,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    answerIndex: 2,
    explanation: 'The function allocates a list with n slots. Memory used grows in step with n, so the space complexity is O(n). Time is also O(n) because each slot is filled.',
    difficulty: 'easy',
  },
  {
    id: 'cq-14-step-two',
    code: {
      python: `def evens(nums):
    out = []
    for i in range(0, len(nums), 2):
        out.append(nums[i])
    return out`,
      javascript: `function evens(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i += 2) out.push(nums[i]);
  return out;
}`,
    },
    question: TIME,
    options: ['O(log n)', 'O(n / 2) which is different from O(n)', 'O(n)', 'O(n^2)'],
    answerIndex: 2,
    explanation: 'Stepping by 2 visits n / 2 elements. Dividing by a constant does not change the growth rate, so it is still O(n). Only multiplying or dividing the loop variable itself gives a logarithm.',
    difficulty: 'easy',
  },
  // ---------------------------------------------------------------- medium
  {
    id: 'cq-15-loop-plus-binary-search',
    code: {
      python: `import bisect

def count_present(queries, sorted_nums):
    found = 0
    for q in queries:
        i = bisect.bisect_left(sorted_nums, q)
        if i < len(sorted_nums) and sorted_nums[i] == q:
            found += 1
    return found`,
      javascript: `function countPresent(queries, sortedNums) {
  let found = 0;
  for (const q of queries) {
    let lo = 0, hi = sortedNums.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sortedNums[mid] === q) { found++; break; }
      if (sortedNums[mid] < q) lo = mid + 1; else hi = mid - 1;
    }
  }
  return found;
}`,
    },
    question: 'Both lists have n elements. What is the time complexity?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    answerIndex: 1,
    explanation: 'The outer loop runs n times and each iteration does one binary search costing O(log n). A loop around a logarithmic operation multiplies: O(n log n).',
    difficulty: 'medium',
  },
  {
    id: 'cq-16-naive-fib',
    code: {
      python: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
      javascript: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(n^2)', 'O(2^n)', 'O(n!)'],
    answerIndex: 2,
    explanation: 'Every call makes two more calls, so the call tree roughly doubles at each level and has depth n. That is about 2^n calls. The same sub-problems are recomputed many times.',
    difficulty: 'medium',
  },
  {
    id: 'cq-17-memo-fib',
    code: {
      python: `def fib(n, memo={}):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]`,
      javascript: `function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, v);
  return v;
}`,
    },
    question: TIME,
    options: ['O(log n)', 'O(n)', 'O(n^2)', 'O(2^n)'],
    answerIndex: 1,
    explanation: 'With memoisation each value of n is computed only once and then answered from the map in O(1). There are n distinct values, so total work is O(n). This is the core idea of dynamic programming.',
    difficulty: 'medium',
  },
  {
    id: 'cq-18-merge-sort',
    code: {
      python: `def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    return merge(left, right)  # merge is O(len(left) + len(right))`,
      javascript: `function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  return merge(left, right); // merge is O(left.length + right.length)
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    answerIndex: 1,
    explanation: 'The array is halved until single elements, which takes log n levels. At each level all n elements are merged once, costing O(n). Levels times work per level gives O(n log n).',
    difficulty: 'medium',
  },
  {
    id: 'cq-19-inner-depends-on-outer',
    code: {
      python: `def count(n):
    total = 0
    for i in range(n):
        for j in range(i, n):
            total += 1
    return total`,
      javascript: `function count(n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) total++;
  }
  return total;
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(n^3)'],
    answerIndex: 2,
    explanation: 'The inner loop runs n, then n - 1, then n - 2 ... down to 1 times. That sum is n(n + 1) / 2, which is about n^2 / 2. Dropping the constant leaves O(n^2), the same as a full nested loop.',
    difficulty: 'medium',
  },
  {
    id: 'cq-20-string-concat',
    code: {
      python: `def build(chars):
    s = ""
    for ch in chars:
        s = s + ch  # assume this copies the whole string
    return s`,
      javascript: `function build(chars) {
  let s = '';
  for (const ch of chars) {
    s = s + ch; // assume this copies the whole string
  }
  return s;
}`,
    },
    question: 'Strings are immutable, so each concatenation copies s. What is the time complexity?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
    answerIndex: 2,
    explanation: 'On iteration k the string has length k and gets copied, so the copies cost 1 + 2 + ... + n, which is O(n^2). Collect the pieces in a list and join once at the end to get O(n).',
    difficulty: 'medium',
  },
  {
    id: 'cq-21-sort-then-scan',
    code: {
      python: `def has_duplicate(nums):
    nums.sort()
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            return True
    return False`,
      javascript: `function hasDuplicate(nums) {
  nums.sort((a, b) => a - b);
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) return true;
  }
  return false;
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    answerIndex: 1,
    explanation: 'The sort costs O(n log n) and the scan costs O(n). Sequential steps add, and the bigger term wins, so the total is O(n log n). A hash set would do it in O(n) with extra memory.',
    difficulty: 'medium',
  },
  {
    id: 'cq-22-sliding-window',
    code: {
      python: `def longest_at_most_k_distinct(s, k):
    count = {}
    left = best = 0
    for right, ch in enumerate(s):
        count[ch] = count.get(ch, 0) + 1
        while len(count) > k:
            count[s[left]] -= 1
            if count[s[left]] == 0:
                del count[s[left]]
            left += 1
        best = max(best, right - left + 1)
    return best`,
      javascript: `function longestAtMostKDistinct(s, k) {
  const count = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    count.set(s[right], (count.get(s[right]) || 0) + 1);
    while (count.size > k) {
      count.set(s[left], count.get(s[left]) - 1);
      if (count.get(s[left]) === 0) count.delete(s[left]);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    },
    question: 'There is a while loop inside a for loop. What is the time complexity?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(n * k)'],
    answerIndex: 0,
    explanation: 'The inner while looks nested, but left only ever moves forward and can advance at most n times in total across the whole run. Each character enters the window once and leaves once, so the total is O(n).',
    difficulty: 'medium',
  },
  {
    id: 'cq-23-bfs',
    code: {
      python: `from collections import deque

def bfs(graph, start):
    seen = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nb in graph[node]:
            if nb not in seen:
                seen.add(nb)
                q.append(nb)
    return seen`,
      javascript: `function bfs(graph, start) {
  const seen = new Set([start]);
  const q = [start];
  let head = 0;
  while (head < q.length) {
    const node = q[head++];
    for (const nb of graph[node]) {
      if (!seen.has(nb)) { seen.add(nb); q.push(nb); }
    }
  }
  return seen;
}`,
    },
    question: 'The graph has V nodes and E edges (adjacency list). What is the time complexity?',
    options: ['O(V)', 'O(V + E)', 'O(V * E)', 'O(V^2)'],
    answerIndex: 1,
    explanation: 'Each node is added to the queue at most once (V pops) and each edge is examined once from each side (E work overall). The two costs add, giving O(V + E). It is not V * E because the inner loop only looks at that node\'s own edges.',
    difficulty: 'medium',
  },
  {
    id: 'cq-24-loop-with-inner-doubling',
    code: {
      python: `def work(n):
    count = 0
    for i in range(n):
        j = 1
        while j < n:
            j *= 2
            count += 1
    return count`,
      javascript: `function work(n) {
  let count = 0;
  for (let i = 0; i < n; i++) {
    let j = 1;
    while (j < n) {
      j *= 2;
      count++;
    }
  }
  return count;
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    answerIndex: 1,
    explanation: 'The outer loop runs n times. The inner loop doubles j, so it runs about log2(n) times. Nested loops multiply: n * log n.',
    difficulty: 'medium',
  },
  {
    id: 'cq-25-space-recursion-depth',
    code: {
      python: `def total(nums, i=0):
    if i == len(nums):
        return 0
    return nums[i] + total(nums, i + 1)`,
      javascript: `function total(nums, i = 0) {
  if (i === nums.length) return 0;
  return nums[i] + total(nums, i + 1);
}`,
    },
    question: SPACE,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    answerIndex: 2,
    explanation: 'No list is created, but each recursive call sits on the call stack until the one below it returns. The stack reaches depth n before it starts unwinding, so the space is O(n). Recursion depth is memory.',
    difficulty: 'medium',
  },
  {
    id: 'cq-26-space-2d-dp',
    code: {
      python: `def lcs(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]`,
      javascript: `function lcs(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n][m];
}`,
    },
    question: 'a has length n and b has length m. What is the space complexity?',
    options: ['O(1)', 'O(n + m)', 'O(n * m)', 'O(max(n, m))'],
    answerIndex: 2,
    explanation: 'The dp table has (n + 1) rows and (m + 1) columns, so it stores about n * m numbers. Time is also O(n * m). Since each row only reads the previous row, you could reduce space to O(m) by keeping two rows.',
    difficulty: 'medium',
  },
  {
    id: 'cq-27-amortised-append',
    code: {
      python: `def collect(n):
    out = []
    for i in range(n):
        out.append(i)
    return out`,
      javascript: `function collect(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(i);
  return out;
}`,
    },
    question: 'A dynamic array occasionally resizes by copying to a bigger block. What is the total time complexity of the n appends?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(n * average size)'],
    answerIndex: 0,
    explanation: 'Resizes happen only when the capacity is full and each resize doubles it, so copies total about 1 + 2 + 4 + ... + n, which is less than 2n. Spread over n appends, each one costs O(1) on average. This is called amortised O(1).',
    difficulty: 'medium',
  },
  {
    id: 'cq-28-dict-lookup-in-loop',
    code: {
      python: `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []`,
      javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    },
    question: TIME,
    options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'],
    answerIndex: 1,
    explanation: 'Dictionary lookup and insert are O(1) on average, so each of the n iterations does constant work. The whole function is O(n) with O(n) extra space for the dictionary.',
    difficulty: 'medium',
  },
  // ------------------------------------------------------------------ hard
  {
    id: 'cq-29-harmonic',
    code: {
      python: `def work(n):
    count = 0
    for i in range(1, n + 1):
        for j in range(0, n, i):
            count += 1
    return count`,
      javascript: `function work(n) {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < n; j += i) count++;
  }
  return count;
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(n sqrt n)'],
    answerIndex: 1,
    explanation: 'For a given i the inner loop runs about n / i times. Summing n/1 + n/2 + n/3 + ... + n/n gives n times the harmonic series, which is about n * ln n. This shape appears in the sieve of Eratosthenes.',
    difficulty: 'hard',
  },
  {
    id: 'cq-30-doubling-outer-inner-linear',
    code: {
      python: `def work(n):
    count = 0
    i = 1
    while i < n:
        for j in range(i):
            count += 1
        i *= 2
    return count`,
      javascript: `function work(n) {
  let count = 0;
  for (let i = 1; i < n; i *= 2) {
    for (let j = 0; j < i; j++) count++;
  }
  return count;
}`,
    },
    question: TIME,
    options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'],
    answerIndex: 1,
    explanation: 'It looks like O(n log n), but the inner loop runs i times where i is 1, 2, 4, 8, ..., up to n. That sum is 1 + 2 + 4 + ... + n, which is less than 2n. So the total is O(n), not n log n.',
    difficulty: 'hard',
  },
  {
    id: 'cq-31-permutations',
    code: {
      python: `def permutations(nums):
    result = []

    def go(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        for i in range(len(remaining)):
            go(path + [remaining[i]], remaining[:i] + remaining[i + 1:])

    go([], nums)
    return result`,
      javascript: `function permutations(nums) {
  const result = [];
  function go(path, remaining) {
    if (remaining.length === 0) { result.push(path.slice()); return; }
    for (let i = 0; i < remaining.length; i++) {
      go(path.concat(remaining[i]), remaining.slice(0, i).concat(remaining.slice(i + 1)));
    }
  }
  go([], nums);
  return result;
}`,
    },
    question: 'nums has n distinct values. What is the time complexity?',
    options: ['O(n^2)', 'O(2^n)', 'O(n * n!)', 'O(n^n)'],
    answerIndex: 2,
    explanation: 'There are n! permutations and the function must produce every one. Building or copying each permutation costs O(n), so the total is O(n * n!). Any algorithm that outputs all permutations has at least this cost.',
    difficulty: 'hard',
  },
  {
    id: 'cq-32-sqrt-inner',
    code: {
      python: `def work(n):
    count = 0
    for i in range(1, n + 1):
        j = 1
        while j * j <= i:
            j += 1
            count += 1
    return count`,
      javascript: `function work(n) {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    let j = 1;
    while (j * j <= i) {
      j++;
      count++;
    }
  }
  return count;
}`,
    },
    question: TIME,
    options: ['O(n)', 'O(n log n)', 'O(n sqrt n)', 'O(n^2)'],
    answerIndex: 2,
    explanation: 'The inner loop stops when j * j passes i, so it runs about sqrt(i) times. Summing sqrt(i) for i from 1 to n gives roughly n * sqrt(n). This is the cost of trial-division primality checks for every number up to n.',
    difficulty: 'hard',
  },
  {
    id: 'cq-33-insert-at-front',
    code: {
      python: `def reversed_copy(nums):
    out = []
    for x in nums:
        out.insert(0, x)
    return out`,
      javascript: `function reversedCopy(nums) {
  const out = [];
  for (const x of nums) out.unshift(x);
  return out;
}`,
    },
    question: 'out is a dynamic array. What is the time complexity?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'],
    answerIndex: 2,
    explanation: 'Inserting at index 0 of an array shifts every existing element one place to the right, which is O(current length). Doing that for n elements costs 1 + 2 + ... + n, which is O(n^2). Append then reverse, or use a deque, to make it O(n).',
    difficulty: 'hard',
  },
  {
    id: 'cq-34-log-squared',
    code: {
      python: `def work(n):
    count = 0
    i = 1
    while i < n:
        j = 1
        while j < n:
            j *= 2
            count += 1
        i *= 2
    return count`,
      javascript: `function work(n) {
  let count = 0;
  for (let i = 1; i < n; i *= 2) {
    for (let j = 1; j < n; j *= 2) count++;
  }
  return count;
}`,
    },
    question: TIME,
    options: ['O(log n)', 'O((log n)^2)', 'O(n)', 'O(n log n)'],
    answerIndex: 1,
    explanation: 'Both loops double their variable, so each runs about log2(n) times. They are nested, so the counts multiply: (log n) * (log n) = (log n)^2. This is far smaller than n for large inputs.',
    difficulty: 'hard',
  },
  {
    id: 'cq-35-two-halves-constant-work',
    code: {
      python: `def count_nodes(n):
    # imagine a perfectly balanced structure of size n
    if n <= 1:
        return n
    return 1 + count_nodes(n // 2) + count_nodes(n // 2)`,
      javascript: `function countNodes(n) {
  // imagine a perfectly balanced structure of size n
  if (n <= 1) return n;
  return 1 + countNodes(Math.floor(n / 2)) + countNodes(Math.floor(n / 2));
}`,
    },
    question: TIME,
    options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(2^n)'],
    answerIndex: 1,
    explanation: 'The recurrence is T(n) = 2T(n/2) + O(1). Two calls on half the size with constant work per call gives a call tree with about 2n nodes in total, so O(n). Compare with merge sort, where the extra O(n) merge per call pushes it to O(n log n).',
    difficulty: 'hard',
  },
  {
    id: 'cq-36-sort-in-loop',
    code: {
      python: `def prefix_medians(nums):
    out = []
    for i in range(1, len(nums) + 1):
        prefix = sorted(nums[:i])
        out.append(prefix[i // 2])
    return out`,
      javascript: `function prefixMedians(nums) {
  const out = [];
  for (let i = 1; i <= nums.length; i++) {
    const prefix = nums.slice(0, i).sort((a, b) => a - b);
    out.push(prefix[Math.floor(i / 2)]);
  }
  return out;
}`,
    },
    question: TIME,
    options: ['O(n log n)', 'O(n^2)', 'O(n^2 log n)', 'O(n^3)'],
    answerIndex: 2,
    explanation: 'Iteration i copies and sorts i elements, costing O(i log i). Summing that for i up to n is dominated by the largest terms and gives O(n^2 log n). The two-heaps pattern solves this in O(n log n) instead.',
    difficulty: 'hard',
  },
]
