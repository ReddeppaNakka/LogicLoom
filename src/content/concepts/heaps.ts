import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'heap-basics',
    gateId: 'heaps',
    order: 1,
    title: 'Heap Basics: Always Know the Smallest',
    minutes: 30,
    summary: 'A heap gives you the smallest (or largest) item in O(1) and lets you add or remove items in O(log n).',
    analogy:
      'A hospital emergency room does not treat patients in arrival order. Each new patient gets a priority, and the nurse always calls the most urgent one next. The whiteboard that makes "who is most urgent?" instant, even as people keep arriving, is a heap.',
    explanation: `A heap (also called a priority queue) is a container built for one question: "what is the smallest thing in here right now?" It answers in O(1), and adding or removing an item costs O(log n). When a problem repeatedly needs the minimum or maximum of a changing collection, a heap turns a slow rescan into a cheap pop.

## The idea

- A min-heap is a binary tree stored in an array where every parent is smaller than or equal to its children. The root is always the minimum.
- \`push(x)\`: append at the end, then "bubble up" by swapping with the parent while smaller. At most log n swaps.
- \`pop()\`: take the root, move the last element to the root, then "sink down" by swapping with the smaller child. At most log n swaps.
- \`peek()\`: read the root. O(1).
- Building a heap from n items with repeated pushes is O(n log n); the library \`heapify\` does it in O(n).
- Python's \`heapq\` is a min-heap only. For a max-heap, push \`-x\` and negate on the way out. Java's \`PriorityQueue\` and C++'s \`priority_queue\` accept a comparator.

## A tiny example

Last Stone Weight: stones \`[2, 7, 4, 1, 8, 1]\`. Repeatedly smash the two heaviest: if equal, both vanish; otherwise the difference stays. Return the last stone.

The slow way: each round, sort the list (O(n log n)) or scan for the two largest (O(n)), remove them, push the difference. Up to n rounds means O(n^2).

The fast way: put every stone into a max-heap once. Each round pops two (O(log n)) and maybe pushes one (O(log n)). Total O(n log n).

\`\`\`python
import heapq

def last_stone_weight(stones):
    heap = [-s for s in stones]   # negate for a max-heap
    heapq.heapify(heap)
    while len(heap) > 1:
        a = -heapq.heappop(heap)
        b = -heapq.heappop(heap)
        if a != b:
            heapq.heappush(heap, -(a - b))
    return -heap[0] if heap else 0
\`\`\`

## Step by step

- Ask: does the problem keep needing "the smallest" or "the largest" while items are added and removed?
- Choose min or max. If you want the largest, negate values or use a comparator.
- Decide what to store. Often a tuple: \`(priority, tiebreak, payload)\`. Tuples compare left to right, so put the sort key first.
- Push everything (or heapify), then loop: pop, do work, maybe push something back.

## Where people go wrong

- Using a heap as a sorted list. You cannot look at the second smallest without popping the first. If you need arbitrary lookups, a heap is the wrong tool.
- Pushing objects that cannot be compared. In Python, add an index as a tiebreak: \`(priority, i, obj)\`.
- Forgetting to negate on the way out when faking a max-heap.
- Using \`sorted(list)\` inside a loop. Every sort is O(n log n); a heap pop is O(log n).
- Calling \`heapify\` inside a loop, which is O(n) each time and undoes the benefit.

## How to recognise it in an interview

- "Repeatedly remove the largest/smallest", "process the most urgent first", "merge sorted lists".
- "Schedule tasks by priority", "the heaviest two stones", "kth largest as items keep arriving".
- Any loop whose body starts with "find the max of the remaining items" is asking for a heap.`,
    naive: {
      title: 'Sort the whole list every round',
      description:
        'Each round, sort the stones, take the two largest from the end, and put the difference back. The sort repeats up to n times, and each one costs n log n.',
      time: 'O(n^2 log n)',
      space: 'O(1) extra',
      code: {
        python: `def last_stone_weight_slow(stones):
    stones = list(stones)
    while len(stones) > 1:
        stones.sort()
        a = stones.pop()
        b = stones.pop()
        if a != b:
            stones.append(a - b)
    return stones[0] if stones else 0`,
        javascript: `function lastStoneWeightSlow(stones) {
  stones = stones.slice();
  while (stones.length > 1) {
    stones.sort((x, y) => x - y);
    const a = stones.pop();
    const b = stones.pop();
    if (a !== b) stones.push(a - b);
  }
  return stones.length ? stones[0] : 0;
}`,
        java: `public int lastStoneWeightSlow(int[] input) {
  List<Integer> stones = new ArrayList<>();
  for (int s : input) stones.add(s);
  while (stones.size() > 1) {
    Collections.sort(stones);
    int a = stones.remove(stones.size() - 1);
    int b = stones.remove(stones.size() - 1);
    if (a != b) stones.add(a - b);
  }
  return stones.isEmpty() ? 0 : stones.get(0);
}`,
        cpp: `int lastStoneWeightSlow(vector<int> stones) {
  while (stones.size() > 1) {
    sort(stones.begin(), stones.end());
    int a = stones.back(); stones.pop_back();
    int b = stones.back(); stones.pop_back();
    if (a != b) stones.push_back(a - b);
  }
  return stones.empty() ? 0 : stones[0];
}`,
      },
    },
    optimized: {
      title: 'Max-heap: pop two, push the difference',
      description:
        'Build a max-heap once. Each round pops the two largest in O(log n) and pushes back the difference if any. There are at most n rounds.',
      time: 'O(n log n)',
      space: 'O(n)',
      code: {
        python: `import heapq

def last_stone_weight(stones):
    heap = [-s for s in stones]  # negate for a max-heap
    heapq.heapify(heap)
    while len(heap) > 1:
        a = -heapq.heappop(heap)
        b = -heapq.heappop(heap)
        if a != b:
            heapq.heappush(heap, -(a - b))
    return -heap[0] if heap else 0`,
        javascript: `// Minimal max-heap so the idea is visible without a library.
class MaxHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  push(v) {
    const a = this.a; a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p] >= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]]; i = p;
    }
  }
  pop() {
    const a = this.a; const top = a[0]; const last = a.pop();
    if (a.length) {
      a[0] = last; let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < a.length && a[l] > a[m]) m = l;
        if (r < a.length && a[r] > a[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

function lastStoneWeight(stones) {
  const h = new MaxHeap();
  for (const s of stones) h.push(s);
  while (h.size() > 1) {
    const a = h.pop(), b = h.pop();
    if (a !== b) h.push(a - b);
  }
  return h.size() ? h.pop() : 0;
}`,
        java: `public int lastStoneWeight(int[] stones) {
  PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
  for (int s : stones) heap.add(s);
  while (heap.size() > 1) {
    int a = heap.poll();
    int b = heap.poll();
    if (a != b) heap.add(a - b);
  }
  return heap.isEmpty() ? 0 : heap.peek();
}`,
        cpp: `int lastStoneWeight(vector<int>& stones) {
  priority_queue<int> heap(stones.begin(), stones.end()); // max-heap
  while (heap.size() > 1) {
    int a = heap.top(); heap.pop();
    int b = heap.top(); heap.pop();
    if (a != b) heap.push(a - b);
  }
  return heap.empty() ? 0 : heap.top();
}`,
      },
    },
    whyFaster:
      'The slow version re-sorts all remaining stones every round, even though only one value changed. A heap keeps just enough order to know the maximum, so removing the top and inserting a new value each cost O(log n) instead of O(n log n). Over n rounds the total drops from roughly n^2 log n to n log n.',
    keyPoints: [
      'Heap: peek the min or max in O(1); push and pop in O(log n); heapify in O(n).',
      'Python heapq is a min-heap; negate values to get a max-heap.',
      'Store tuples with the sort key first and an index as a tiebreak.',
      'A heap is not a sorted list: you only ever see the top.',
      'If a loop body starts with "find the largest remaining", replace it with a heap pop.',
      'Never sort or heapify inside the loop; do it once before.',
    ],
    patternIds: ['top-k-heap', 'k-way-merge', 'greedy'],
    problems: [
      {
        id: 'last-stone-weight',
        title: 'Last Stone Weight',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/last-stone-weight/',
        patternId: 'top-k-heap',
        hint: 'Keep all stones in a max-heap; pop two, push the difference if non-zero, repeat until one remains.',
        xp: 20,
      },
      {
        id: 'kth-largest-element-in-a-stream',
        title: 'Kth Largest Element in a Stream',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
        patternId: 'top-k-heap',
        hint: 'Keep a min-heap of size k; its top is always the kth largest seen so far.',
        xp: 20,
      },
      {
        id: 'task-scheduler',
        title: 'Task Scheduler',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/task-scheduler/',
        patternId: 'greedy',
        hint: 'Always run the most frequent available task; a max-heap of counts plus a cooldown queue simulates the CPU.',
        xp: 40,
      },
      {
        id: 'reorganize-string',
        title: 'Reorganize String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/reorganize-string/',
        patternId: 'greedy',
        hint: 'Pop the most frequent character, place it, and hold it back one turn so it is never adjacent to itself.',
        xp: 40,
      },
      {
        id: 'single-threaded-cpu',
        title: 'Single-Threaded CPU',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/single-threaded-cpu/',
        patternId: 'top-k-heap',
        hint: 'Sort tasks by arrival, push the ones that have arrived into a min-heap keyed by (duration, index), and pop the next to run.',
        xp: 40,
      },
      {
        id: 'merge-k-sorted-lists',
        title: 'Merge k Sorted Lists',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        patternId: 'k-way-merge',
        hint: 'Put the head of each list in a min-heap; pop the smallest, append it, and push that node\'s next.',
        xp: 80,
      },
    ],
  },
  {
    id: 'top-k-problems',
    gateId: 'heaps',
    order: 2,
    title: 'Top-K Problems',
    minutes: 25,
    summary: 'Find the k largest, smallest, closest or most frequent items in O(n log k) with a heap of size k.',
    analogy:
      'A talent show keeps only three finalists on stage. When a new contestant performs better than the weakest finalist, the weakest leaves and the newcomer takes their place. The stage never holds more than three people, and the weakest is always easy to spot.',
    explanation: `"Top-K" problems ask for the k biggest, k smallest, k closest or k most frequent things. The obvious answer is to sort everything and slice, which is O(n log n). But you do not need the whole list in order, only the k winners. A heap that never grows beyond k items does the job in O(n log k), and when k is small that is close to linear.

## The idea

- To find the k largest, keep a **min-heap** of size k. The heap's top is the weakest of the current winners.
- For each new item: push it, and if the heap now has k + 1 items, pop the smallest. That pop evicts the weakest.
- After the pass, the heap contains exactly the k largest. Its top is the kth largest.
- To find the k smallest, flip it: a max-heap of size k (or negate values in Python).
- For "k most frequent", first count with a hash map, then run top-k on the (count, item) pairs.
- For "k closest points", the key is the distance; store \`(distance, point)\` tuples.

## A tiny example

Kth largest in \`[3, 2, 1, 5, 6, 4]\` with k = 2.

- Push 3, push 2: heap = [2, 3].
- Push 1 makes size 3, pop the smallest (1): heap = [2, 3].
- Push 5, pop 2: heap = [3, 5].
- Push 6, pop 3: heap = [5, 6].
- Push 4, pop 4: heap = [5, 6].
- Top is 5, the 2nd largest. Correct.

## Step by step

\`\`\`python
import heapq

def find_kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]
\`\`\`

The heap never exceeds k + 1 items, so every push and pop is O(log k). Total O(n log k) time and O(k) space.

The slow way is \`sorted(nums)[-k]\`: O(n log n) time and O(n) space. For n = 1,000,000 and k = 10, the heap does about 3.3 million operations while the sort does about 20 million.

## Where people go wrong

- Using a max-heap for k largest. Then you cannot cheaply evict the weakest. Remember: k largest means min-heap, k smallest means max-heap.
- Pushing all n items and then popping k. That works but is O(n + k log n) with O(n) space, and it hides the size-k idea the interviewer wants to hear.
- Forgetting the counting step in "k most frequent". Count first, then heap.
- Ignoring the O(n) alternative. Quickselect gives average O(n) for kth largest, and bucket sort gives O(n) for k most frequent when counts are bounded by n. Mention them after the heap answer.

## How to recognise it in an interview

- "k largest", "k smallest", "kth largest", "k closest", "k most frequent", "top k".
- "Stream of numbers, keep the kth largest at all times".
- "Find the k pairs with the smallest sums" or "kth smallest in a sorted matrix": these use a heap seeded with one candidate per row and expand from there (k-way merge shape).
- If k is much smaller than n, say "O(n log k) with a heap of size k". If k is close to n, sorting is fine.`,
    naive: {
      title: 'Sort everything and take the kth from the end',
      description:
        'Sort the full array in ascending order and read the element k positions from the end. Simple and correct, but it orders every element even though you only need one position.',
      time: 'O(n log n)',
      space: 'O(n) for the sorted copy',
      code: {
        python: `def find_kth_largest_slow(nums, k):
    ordered = sorted(nums)
    return ordered[len(ordered) - k]`,
        javascript: `function findKthLargestSlow(nums, k) {
  const ordered = nums.slice().sort((a, b) => a - b);
  return ordered[ordered.length - k];
}`,
        java: `public int findKthLargestSlow(int[] nums, int k) {
  int[] ordered = nums.clone();
  Arrays.sort(ordered);
  return ordered[ordered.length - k];
}`,
        cpp: `int findKthLargestSlow(vector<int> nums, int k) {
  sort(nums.begin(), nums.end());
  return nums[nums.size() - k];
}`,
      },
    },
    optimized: {
      title: 'Min-heap of size k',
      description:
        'Push each number into a min-heap and pop the smallest whenever the heap grows past k. The heap always holds the k largest seen so far, and its top is the kth largest.',
      time: 'O(n log k)',
      space: 'O(k)',
      code: {
        python: `import heapq

def find_kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
        javascript: `// Assumes a MinHeap class with push, pop, peek and size (see heap-basics).
function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (const x of nums) {
    heap.push(x);
    if (heap.size() > k) heap.pop();
  }
  return heap.peek();
}`,
        java: `public int findKthLargest(int[] nums, int k) {
  PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap
  for (int x : nums) {
    heap.add(x);
    if (heap.size() > k) heap.poll();
  }
  return heap.peek();
}`,
        cpp: `int findKthLargest(vector<int>& nums, int k) {
  priority_queue<int, vector<int>, greater<int>> heap; // min-heap
  for (int x : nums) {
    heap.push(x);
    if ((int)heap.size() > k) heap.pop();
  }
  return heap.top();
}`,
      },
    },
    whyFaster:
      'Sorting puts all n elements in order, which costs n log n comparisons. The heap only maintains order among k candidates, so each of the n elements costs log k instead of log n. When k is small compared to n, log k is tiny and the algorithm is nearly linear, and the memory drops from O(n) to O(k).',
    keyPoints: [
      'k largest: min-heap of size k. k smallest: max-heap of size k.',
      'Push, then pop when the size passes k. The top is the kth element.',
      'Time O(n log k), space O(k); much better than sorting when k is small.',
      'k most frequent: count with a hash map first, then top-k on the counts.',
      'Store (key, payload) tuples so the heap sorts by the key you care about.',
      'Know the alternatives: quickselect (average O(n)) and bucket sort for frequencies.',
    ],
    patternIds: ['top-k-heap', 'k-way-merge', 'hash-map'],
    problems: [
      {
        id: 'kth-largest-element-in-an-array',
        title: 'Kth Largest Element in an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        patternId: 'top-k-heap',
        hint: 'Maintain a min-heap of size k; after processing all numbers the top is the answer.',
        xp: 40,
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
        patternId: 'top-k-heap',
        hint: 'Count with a hash map, then keep a min-heap of (count, value) pairs limited to size k.',
        xp: 40,
      },
      {
        id: 'k-closest-points-to-origin',
        title: 'K Closest Points to Origin',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
        patternId: 'top-k-heap',
        hint: 'Use squared distance as the key and a max-heap of size k so the farthest candidate is evicted first.',
        xp: 40,
      },
      {
        id: 'top-k-frequent-words',
        title: 'Top K Frequent Words',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/top-k-frequent-words/',
        patternId: 'top-k-heap',
        hint: 'Count words, then heap by (count, word) with a comparator that breaks ties alphabetically.',
        xp: 40,
      },
      {
        id: 'kth-smallest-element-in-a-sorted-matrix',
        title: 'Kth Smallest Element in a Sorted Matrix',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',
        patternId: 'k-way-merge',
        hint: 'Seed a min-heap with the first element of each row; pop k times, pushing the next element of the popped row each time.',
        xp: 40,
      },
      {
        id: 'find-k-pairs-with-smallest-sums',
        title: 'Find K Pairs with Smallest Sums',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/',
        patternId: 'k-way-merge',
        hint: 'Start with (nums1[i], nums2[0]) for each i in a min-heap; after popping (i, j), push (i, j + 1).',
        xp: 40,
      },
      {
        id: 'smallest-range-covering-elements-from-k-lists',
        title: 'Smallest Range Covering Elements from K Lists',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/',
        patternId: 'k-way-merge',
        hint: 'Keep one pointer per list in a min-heap and track the current max; the range is (heap top, max), advance the list that owns the minimum.',
        xp: 80,
      },
    ],
  },
  {
    id: 'two-heaps-median',
    gateId: 'heaps',
    order: 3,
    title: 'Two Heaps: Running Median and Friends',
    minutes: 30,
    summary: 'Split a stream into a max-heap of the smaller half and a min-heap of the larger half so the median is always at the tops.',
    analogy:
      'Imagine a queue split into two lines at a rope. Everyone shorter than the rope-holder is on the left, taller on the right, and the two lines are kept the same length. Whoever stands next to the rope is the middle person, and you can see them without counting the whole crowd.',
    explanation: `Some problems need the median, or more generally the boundary between the "lower part" and the "upper part" of a growing collection. Sorting after every insert is O(n log n) each time. The two-heaps trick keeps the lower half in a max-heap and the upper half in a min-heap. The median then lives at one or both heap tops, and each insert costs O(log n).

## The idea

- \`low\` is a max-heap holding the smaller half. Its top is the largest of the small numbers.
- \`high\` is a min-heap holding the larger half. Its top is the smallest of the large numbers.
- Invariant 1 (order): every value in \`low\` is less than or equal to every value in \`high\`.
- Invariant 2 (balance): \`low\` has the same size as \`high\`, or one more.
- Median: if sizes are equal, average the two tops; otherwise it is \`low\`'s top.

## A tiny example

Stream: 5, 15, 1, 3.

- Add 5: low = [5], high = []. Median 5.
- Add 15: push into low, then move low's top (15) to high. low = [5], high = [15]. Median (5 + 15) / 2 = 10.
- Add 1: push 1 into low, so low holds {1, 5}; move low's top (5) to high, so high holds {5, 15}; high is now bigger than low, so move 5 back. low = {1, 5}, high = {15}. Median is low's top: 5.
- Add 3: push 3 into low, so low holds {1, 3, 5}; move low's top (5) to high, so high holds {5, 15}; sizes are equal. Median (3 + 5) / 2 = 4. The sorted stream is 1, 3, 5, 15, so 4 is right.

## Step by step

\`\`\`python
import heapq

class MedianFinder:
    def __init__(self):
        self.low = []   # max-heap via negation
        self.high = []  # min-heap

    def add_num(self, num):
        heapq.heappush(self.low, -num)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def find_median(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2
\`\`\`

Always push into \`low\`, always move its top to \`high\`, then rebalance if \`high\` grew too large. This three-step dance guarantees both invariants without any if-else on the value.

The slow way keeps a sorted list and inserts with \`bisect.insort\`, which is O(n) per insert because the list has to shift. Two heaps make each insert O(log n).

## Beyond the median

- **Sliding window median**: same two heaps plus lazy deletion. Keep a map of values that have left the window and skip them when they surface at a heap top.
- **IPO / maximize capital**: a min-heap of projects by required capital and a max-heap of profits you can currently afford. Move projects from the first to the second as capital grows, then pop the best profit.

## Where people go wrong

- Pushing directly into whichever heap "looks right" and then forgetting to rebalance. Use the fixed three-step routine.
- Letting \`high\` become the larger heap and then reading the wrong top for an odd count.
- In the sliding window version, trying to delete from the middle of a heap. Heaps cannot do that; use lazy deletion.

## How to recognise it in an interview

- "Median of a stream", "median after each insertion", "median of every window".
- "Two groups: the ones we can afford and the ones we cannot", "keep the k cheapest / k most expensive selected".
- Whenever you need both the largest of one group and the smallest of another at the same time, two heaps facing each other is the shape.`,
    naive: {
      title: 'Keep a sorted list and insert in place',
      description:
        'Store all numbers in a list that is kept sorted. Each new number is inserted at its correct position, which shifts everything after it. The median is then a simple index read.',
      time: 'O(n) per insert, O(1) per median',
      space: 'O(n)',
      code: {
        python: `import bisect

class MedianFinderSlow:
    def __init__(self):
        self.data = []

    def add_num(self, num):
        bisect.insort(self.data, num)  # O(n) shift

    def find_median(self):
        n = len(self.data)
        if n % 2 == 1:
            return self.data[n // 2]
        return (self.data[n // 2 - 1] + self.data[n // 2]) / 2`,
        javascript: `class MedianFinderSlow {
  constructor() { this.data = []; }
  addNum(num) {
    let i = 0;
    while (i < this.data.length && this.data[i] < num) i++;
    this.data.splice(i, 0, num); // O(n) shift
  }
  findMedian() {
    const n = this.data.length;
    if (n % 2 === 1) return this.data[(n - 1) / 2];
    return (this.data[n / 2 - 1] + this.data[n / 2]) / 2;
  }
}`,
        java: `class MedianFinderSlow {
  private final List<Integer> data = new ArrayList<>();

  public void addNum(int num) {
    int i = 0;
    while (i < data.size() && data.get(i) < num) i++;
    data.add(i, num); // O(n) shift
  }

  public double findMedian() {
    int n = data.size();
    if (n % 2 == 1) return data.get(n / 2);
    return (data.get(n / 2 - 1) + data.get(n / 2)) / 2.0;
  }
}`,
        cpp: `class MedianFinderSlow {
  vector<int> data;
public:
  void addNum(int num) {
    auto pos = lower_bound(data.begin(), data.end(), num);
    data.insert(pos, num); // O(n) shift
  }
  double findMedian() {
    int n = data.size();
    if (n % 2 == 1) return data[n / 2];
    return (data[n / 2 - 1] + data[n / 2]) / 2.0;
  }
};`,
      },
    },
    optimized: {
      title: 'Two heaps facing each other',
      description:
        'A max-heap holds the smaller half and a min-heap holds the larger half. Every insert goes through the same three steps: push to low, move low top to high, rebalance if high is bigger. The median is read from the tops.',
      time: 'O(log n) per insert, O(1) per median',
      space: 'O(n)',
      code: {
        python: `import heapq

class MedianFinder:
    def __init__(self):
        self.low = []   # max-heap via negation
        self.high = []  # min-heap

    def add_num(self, num):
        heapq.heappush(self.low, -num)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def find_median(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2`,
        javascript: `// Assumes MinHeap and MaxHeap classes with push, pop, peek, size.
class MedianFinder {
  constructor() { this.low = new MaxHeap(); this.high = new MinHeap(); }
  addNum(num) {
    this.low.push(num);
    this.high.push(this.low.pop());
    if (this.high.size() > this.low.size()) this.low.push(this.high.pop());
  }
  findMedian() {
    if (this.low.size() > this.high.size()) return this.low.peek();
    return (this.low.peek() + this.high.peek()) / 2;
  }
}`,
        java: `class MedianFinder {
  private final PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
  private final PriorityQueue<Integer> high = new PriorityQueue<>();

  public void addNum(int num) {
    low.add(num);
    high.add(low.poll());
    if (high.size() > low.size()) low.add(high.poll());
  }

  public double findMedian() {
    if (low.size() > high.size()) return low.peek();
    return (low.peek() + high.peek()) / 2.0;
  }
}`,
        cpp: `class MedianFinder {
  priority_queue<int> low;                                    // max-heap
  priority_queue<int, vector<int>, greater<int>> high;        // min-heap
public:
  void addNum(int num) {
    low.push(num);
    high.push(low.top()); low.pop();
    if (high.size() > low.size()) { low.push(high.top()); high.pop(); }
  }
  double findMedian() {
    if (low.size() > high.size()) return low.top();
    return (low.top() + high.top()) / 2.0;
  }
};`,
      },
    },
    whyFaster:
      'A sorted list must shift up to n elements to make room for each new value, so n inserts cost O(n^2). The two heaps only maintain order at the boundary between halves, and a heap push or pop is O(log n), so n inserts cost O(n log n). Reading the median stays O(1) in both, but the inserts are where the time was going.',
    keyPoints: [
      'low is a max-heap of the smaller half; high is a min-heap of the larger half.',
      'Invariants: every low value <= every high value, and low has the same size as high or one more.',
      'Insert routine: push to low, move low top to high, move back if high is bigger.',
      'Median is low top (odd count) or the average of both tops (even count).',
      'Heaps cannot delete from the middle; use lazy deletion for sliding windows.',
      'The same shape solves "what can I afford now" problems like IPO: one heap feeds the other as a threshold moves.',
    ],
    patternIds: ['two-heaps', 'top-k-heap', 'greedy'],
    problems: [
      {
        id: 'furthest-building-you-can-reach',
        title: 'Furthest Building You Can Reach',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/furthest-building-you-can-reach/',
        patternId: 'top-k-heap',
        hint: 'Use ladders on every climb, keep the climbs in a min-heap, and when ladders run out pay bricks for the smallest climb.',
        xp: 40,
      },
      {
        id: 'find-median-from-data-stream',
        title: 'Find Median from Data Stream',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/find-median-from-data-stream/',
        patternId: 'two-heaps',
        hint: 'Max-heap for the lower half, min-heap for the upper half, and rebalance so their sizes differ by at most one.',
        xp: 80,
      },
      {
        id: 'ipo',
        title: 'IPO',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/ipo/',
        patternId: 'two-heaps',
        hint: 'Min-heap of projects by capital needed; move affordable ones into a max-heap by profit and pop the best k times.',
        xp: 80,
      },
      {
        id: 'sliding-window-median',
        title: 'Sliding Window Median',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/sliding-window-median/',
        patternId: 'two-heaps',
        hint: 'Two heaps plus a map of values that have left the window; discard stale tops lazily before reading the median.',
        xp: 80,
      },
      {
        id: 'minimum-cost-to-hire-k-workers',
        title: 'Minimum Cost to Hire K Workers',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/minimum-cost-to-hire-k-workers/',
        patternId: 'top-k-heap',
        hint: 'Sort workers by wage-to-quality ratio; sweep upward keeping the k smallest qualities in a max-heap and evaluate each ratio as the cap.',
        xp: 80,
      },
    ],
  },
]
