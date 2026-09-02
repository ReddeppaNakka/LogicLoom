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
    definition:
      'A binary heap is a complete binary tree stored in a plain array, in which every parent is ordered before its children: smaller or equal in a min-heap, larger or equal in a max-heap. That one rule forces the minimum (or maximum) to sit at index 0.',
    coreIdea:
      'A heap keeps only the order that matters between a parent and its children and deliberately ignores everything else. Because the tree is complete it is stored contiguously with no pointers, and its height is about log2(n), so a value in the wrong place only has to walk up or down one root-to-leaf path to be fixed. That is why peek is O(1) while push and pop are O(log n), instead of the O(n log n) it costs to re-sort a list every time one element changes.',
    visual: [
      {
        caption: 'The tree lives inside an array. Parent and child are index arithmetic, not pointers.',
        frame: [
          'idx   0    1    2    3    4    5',
          'val [ 1 ][ 3 ][ 2 ][ 7 ][ 4 ][ 9 ]',
          '',
          '          1 (0)',
          '        /       \\',
          '     3 (1)      2 (2)',
          '    /     \\     /',
          '  7 (3)  4 (4) 9 (5)',
          '',
          'parent(i) = (i - 1) / 2   rounded down',
          'left(i)   = 2*i + 1     right(i) = 2*i + 2',
        ].join('\n'),
      },
      {
        caption: 'push(0): append at the end, then sift up. Compare with parent(6) = index 2.',
        frame: [
          'idx   0    1    2    3    4    5    6',
          'val [ 1 ][ 3 ][ 2 ][ 7 ][ 4 ][ 9 ][ 0 ]',
          '                                     ^ i=6',
          '',
          'parent(6) = (6-1)/2 = 2, value 2',
          '0 < 2  ->  swap',
        ].join('\n'),
      },
      {
        caption: 'Sift up continues from index 2, then stops at the root. Two swaps in total.',
        frame: [
          'idx   0    1    2    3    4    5    6',
          'val [ 1 ][ 3 ][ 0 ][ 7 ][ 4 ][ 9 ][ 2 ]',
          '                ^ i=2   parent(2)=0, value 1',
          '0 < 1  ->  swap',
          '',
          'val [ 0 ][ 3 ][ 1 ][ 7 ][ 4 ][ 9 ][ 2 ]',
          '      ^ i=0   at the root, stop',
        ].join('\n'),
      },
      {
        caption: 'pop(): take the root, move the last value into index 0, then sift down.',
        frame: [
          'return 0. Move the last value 2 into index 0.',
          '',
          'idx   0    1    2    3    4    5',
          'val [ 2 ][ 3 ][ 1 ][ 7 ][ 4 ][ 9 ]',
          '      ^ i=0',
          'children: left(0)=1 -> 3,  right(0)=2 -> 1',
          'smaller child is 1 at index 2.  1 < 2  ->  swap',
        ].join('\n'),
      },
      {
        caption: 'Sift down stops as soon as both children are bigger. One swap was enough.',
        frame: [
          'idx   0    1    2    3    4    5',
          'val [ 1 ][ 3 ][ 2 ][ 7 ][ 4 ][ 9 ]',
          '                ^ i=2',
          'children: left(2)=5 -> 9,  right(2)=6 -> off the end',
          '9 > 2  ->  stop.  Heap rule holds again.',
        ].join('\n'),
      },
      {
        caption: 'Building a heap from a raw array is O(n), not O(n log n). Most nodes barely move.',
        frame: [
          'sift down from the last parent, index n/2 - 1, up to 0',
          '',
          'level     nodes     max sink distance',
          'bottom     n/2            0',
          'next       n/4            1',
          'next       n/8            2',
          '...',
          'total = n*(1/4) + n*(2/8) + n*(3/16) + ...  ->  ~n',
          '',
          'the node count halves while the distance grows by 1,',
          'so the sum converges. Pushing one by one is O(n log n).',
        ].join('\n'),
      },
    ],
    pseudocode: `parent(i) = (i - 1) / 2 rounded down
left(i)   = 2*i + 1        right(i) = 2*i + 2

function push(heap, x):              // min-heap
    append x at the end
    i = last index
    while i > 0 and heap[i] < heap[parent(i)]:
        swap heap[i] with heap[parent(i)]      // sift up
        i = parent(i)

function pop(heap):
    top = heap[0]
    move the last element into index 0, shrink size by 1
    i = 0
    while true:                                // sift down
        best = i
        for c in [left(i), right(i)]:
            if c < size(heap) and heap[c] < heap[best]:
                best = c
        if best = i: break
        swap heap[i] with heap[best]
        i = best
    return top

function buildHeap(array):           // O(n), not O(n log n)
    for i from size/2 - 1 down to 0:
        sift down starting at i`,
    complexity: [
      { label: 'peek (read the top)', time: 'O(1)', space: 'O(1)', note: 'the min or max is always at index 0' },
      { label: 'push', time: 'O(log n)', space: 'O(1)', note: 'sift up walks one root path; the height is about log2(n)' },
      { label: 'pop', time: 'O(log n)', space: 'O(1)', note: 'sift down walks one root path, two comparisons per level' },
      { label: 'build a heap from an array (heapify)', time: 'O(n)', space: 'O(1)', note: 'half the nodes are leaves and sink zero levels; the sum converges to about n' },
      { label: 'heapsort (build then pop everything)', time: 'O(n log n)', space: 'O(1)', note: 'n pops of O(log n), in place' },
    ],
    dryRun: {
      input: 'stones = [2, 7, 4, 1, 8, 1]. Running last_stone_weight.',
      goal: 'Smash the two heaviest stones repeatedly and report what is left, using the max-heap code above.',
      steps: [
        { state: 'stones=[2,7,4,1,8,1]', action: 'Negate every stone and call heapify once, in O(n). The array now behaves as a max-heap.' },
        { state: 'heap holds 8,7,4,2,1,1', action: 'Pop twice: a = 8 and b = 7. They differ, so push back 8 - 7 = 1.' },
        { state: 'heap holds 4,2,1,1,1', action: 'Pop a = 4 and b = 2. They differ, so push back the difference 2.' },
        { state: 'heap holds 2,1,1,1', action: 'Pop a = 2 and b = 1. They differ, so push back the difference 1.' },
        { state: 'heap holds 1,1,1', action: 'Pop a = 1 and b = 1. They are equal, so both stones are destroyed and nothing is pushed.' },
        { state: 'heap holds 1', action: 'len(heap) is 1, so the while condition fails and the loop ends.' },
        { state: 'heap = [-1]', action: 'The heap is not empty, so return -heap[0], undoing the negation.' },
      ],
      result: 'The last stone weighs 1. Every round removed exactly the two largest values and reinserted only their difference, which is the smashing rule, and the loop stopped precisely when fewer than two stones remained.',
    },
    mistakes: [
      {
        mistake: 'Faking a max-heap in Python by pushing -x and then forgetting to negate the popped value.',
        why: 'You return -8 where the answer is 8, or compare negatives as if they were the real weights, so every comparison is inverted.',
        fix: 'Negate on the way in and on the way out, every single time. Write a tiny push/pop wrapper if the code has more than two call sites.',
      },
      {
        mistake: 'Calling heapify (or sorted) inside the main loop.',
        why: 'heapify is O(n) and sorting is O(n log n), so doing it once per round puts you back at the slow solution the heap was meant to replace.',
        fix: 'Heapify once before the loop. push and pop maintain the heap rule on their own afterwards.',
      },
      {
        mistake: 'Reading heap[1] to get the second smallest element.',
        why: 'The array is not sorted. Index 1 is one child of the root; the true second smallest is at index 1 or index 2, and nothing tells you which.',
        fix: 'Pop the root to expose the next value, or keep a second structure if you need arbitrary ranks.',
      },
      {
        mistake: 'Pushing tuples whose first elements can tie, with a non-comparable payload behind them.',
        why: 'On a tie Python compares the next field, and comparing two node or dict objects raises a TypeError in the middle of a long run.',
        fix: 'Insert a unique increasing counter as the second field: (priority, counter, payload).',
      },
      {
        mistake: 'Saying that building a heap from n items costs O(n log n).',
        why: 'That is the cost of n separate pushes. Bottom-up heapify is O(n): about half the nodes are leaves and never move, and each level up has half as many nodes but only one extra level to sink.',
        fix: 'Say O(n) for heapify and O(n log n) for n pushes, and use heapify whenever you already have all the data.',
      },
    ],
    whenToUse: [
      'A loop body begins with "take the largest or smallest of what is left".',
      'Items arrive over time and you must always serve the most urgent one next.',
      'You must merge k sorted sequences, or repeatedly combine the two cheapest items.',
      'You need the top k of a stream without keeping the whole stream.',
      'A greedy algorithm needs the best remaining option at each step, as in Dijkstra, Huffman coding or task scheduling.',
    ],
    whenNotToUse: [
      'You need the whole collection in sorted order once; a single sort is O(n log n) with smaller constants and simpler code.',
      'You must look up, update or delete an arbitrary element by key; use a hash map, or an indexed heap or balanced BST.',
      'You need the second or kth smallest without removing anything; a heap only exposes its top, so use a sorted container or a BST.',
      'The values are small integers in a fixed range; counting buckets beat a heap and are O(n).',
      'You need range queries or order statistics; use a Fenwick tree or a segment tree instead.',
    ],
    relatedTopics: [
      { id: 'top-k-problems', kind: 'concept', why: 'Capping the heap at size k is the direct application of push and pop to selection problems.' },
      { id: 'two-heaps-median', kind: 'concept', why: 'Two heaps facing each other keep the median at their tops using only push and pop.' },
      { id: 'sorting-basics', kind: 'concept', why: 'Heapsort is just build-heap followed by n pops, an in-place O(n log n) sort.' },
      { id: 'shortest-paths', kind: 'concept', why: 'Dijkstra is a heap loop: pop the closest unfinished node, relax its edges, push the improvements.' },
      { id: 'top-k-heap', kind: 'pattern', why: 'This is the data structure the pattern is built on.' },
    ],
    quiz: [
      {
        question: 'You call heapify once on an array of n numbers. What does it cost?',
        options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'],
        answerIndex: 1,
        explanation: 'About half the nodes are leaves and sink zero levels, and the node count halves each level up while the sink distance grows by only one, so the total sum stays proportional to n.',
      },
      {
        question: 'In a min-heap stored as an array, a[0] is the smallest value. What is a[1]?',
        options: [
          'The second smallest value',
          'A child of the root; the second smallest is a[1] or a[2] and you must compare to know which',
          'The largest value',
          'The median value',
        ],
        answerIndex: 1,
        explanation: 'The heap rule only orders parents against children, so the array is not sorted; the runner-up must be one of the root two children, but not necessarily the first one.',
      },
      {
        question: 'In a 0-indexed array heap, where are the children of index 3?',
        options: ['Indices 4 and 5', 'Indices 6 and 7', 'Indices 7 and 8', 'Indices 2 and 4'],
        answerIndex: 2,
        explanation: 'left(i) = 2*i + 1 and right(i) = 2*i + 2, so for i = 3 that is 7 and 8.',
      },
      {
        question: 'You must always know the current maximum of a set, but you also need to remove specific values by id. Is a plain binary heap enough?',
        options: [
          'Yes, just pop until you find the value',
          'No, a heap cannot delete an arbitrary element cheaply; use lazy deletion with a map, or a balanced BST',
          'Yes, heaps support delete-by-value in O(1)',
          'No, you should re-sort the list after every removal',
        ],
        answerIndex: 1,
        explanation: 'Finding a specific value inside a heap is O(n), so the standard fix is to mark it deleted and discard it only when it surfaces at the top.',
      },
      {
        question: 'Python heapq only provides a min-heap. How do you get max-heap behaviour for integers?',
        options: [
          'Push -x and negate every value you pop',
          'Call heapq.heapify twice',
          'Reverse the list before heapifying',
          'Use sorted() instead',
        ],
        answerIndex: 0,
        explanation: 'Negating flips the comparison order, so the most negative stored value (the true maximum) becomes the min-heap top.',
      },
    ],
    sources: [
      'CLRS ch. 6 (heapsort and priority queues)',
      'MIT 6.006 lecture on heaps and heapsort',
      'VisuAlgo: Binary Heap module',
      'Python heapq library documentation',
    ],
    problems: [
      {
        id: 'last-stone-weight',
        title: 'Last Stone Weight',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/last-stone-weight/',
        patternId: 'top-k-heap',
        hint: 'Keep all stones in a max-heap; pop two, push the difference if non-zero, repeat until one remains.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'kth-largest-element-in-a-stream',
        title: 'Kth Largest Element in a Stream',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
        patternId: 'top-k-heap',
        hint: 'Keep a min-heap of size k; its top is always the kth largest seen so far.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'task-scheduler',
        title: 'Task Scheduler',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/task-scheduler/',
        patternId: 'greedy',
        hint: 'Always run the most frequent available task; a max-heap of counts plus a cooldown queue simulates the CPU.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'reorganize-string',
        title: 'Reorganize String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/reorganize-string/',
        patternId: 'greedy',
        hint: 'Pop the most frequent character, place it, and hold it back one turn so it is never adjacent to itself.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'single-threaded-cpu',
        title: 'Single-Threaded CPU',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/single-threaded-cpu/',
        patternId: 'top-k-heap',
        hint: 'Sort tasks by arrival, push the ones that have arrived into a min-heap keyed by (duration, index), and pop the next to run.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'merge-k-sorted-lists',
        title: 'Merge k Sorted Lists',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        patternId: 'k-way-merge',
        hint: 'Put the head of each list in a min-heap; pop the smallest, append it, and push that node\'s next.',
        xp: 80,
        tier: 'advanced',
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
    definition:
      'A top-k problem asks for the k largest, k smallest, k closest or k most frequent items out of n, usually in any order. The heap solution keeps a working set of exactly k candidates and makes every other item compete against the weakest one currently inside.',
    coreIdea:
      'You do not need the full sorted order, only the boundary between the winners and the losers. A min-heap capped at size k keeps the weakest current winner on top, so one comparison rejects a hopeless item and one push plus one pop accepts a good one. Each of the n items costs log k instead of log n, and the memory drops from O(n) to O(k), which matters enormously when the input is a stream you cannot store.',
    visual: [
      {
        caption: 'k = 3. The heap fills up with the first three values; nothing is evicted yet.',
        frame: [
          'stream: 3, 1, 5, 12, 2, 11      k = 3',
          '',
          'in 3   ->  heap {3}         top 3',
          'in 1   ->  heap {1, 3}      top 1',
          'in 5   ->  heap {1, 3, 5}   top 1   (size = k)',
        ].join('\n'),
      },
      {
        caption: '12 arrives. Push makes the heap too big, so the pop evicts the weakest winner.',
        frame: [
          'in 12  ->  push  {1, 3, 5, 12}   size 4 > k',
          '       ->  pop 1 {3, 5, 12}      top 3',
          '',
          '1 can never be in the top 3 again, so it is gone',
          'for good after one O(log k) pop.',
        ].join('\n'),
      },
      {
        caption: '2 arrives and immediately evicts itself. That is the correct outcome.',
        frame: [
          'in 2   ->  push  {2, 3, 5, 12}   size 4 > k',
          '       ->  pop 2 {3, 5, 12}      top 3',
          '',
          '2 is smaller than every winner, so the pop that',
          'removes the minimum removes 2 itself.',
        ].join('\n'),
      },
      {
        caption: '11 arrives and pushes 3 out. The boundary moves up.',
        frame: [
          'in 11  ->  push  {3, 5, 11, 12}  size 4 > k',
          '       ->  pop 3 {5, 11, 12}     top 5',
        ].join('\n'),
      },
      {
        caption: 'The stream is done. The heap holds the k largest and its top is the kth largest.',
        frame: [
          'heap = {5, 11, 12}  =  the 3 largest values',
          'top  = 5            =  the 3rd largest',
          '',
          'work: 6 items x log2(3) instead of sorting all 6',
          'memory: 3 slots instead of 6',
        ].join('\n'),
      },
    ],
    pseudocode: `function kthLargest(items, k):
    heap = empty min-heap
    for each x in items:
        push x onto heap
        if size(heap) > k:
            pop heap                 // drop the weakest winner
    return top of heap               // the kth largest

// cheaper variant: reject before you push
function kLargest(items, k):
    heap = empty min-heap
    for each x in items:
        if size(heap) < k:
            push x
        else if x > top of heap:
            pop heap
            push x
    return every item in heap        // in no particular order

// k most frequent
function topKFrequent(items, k):
    counts = map from item to how often it appears
    heap = empty min-heap keyed by count
    for each (item, count) in counts:
        push (count, item)
        if size(heap) > k:
            pop heap
    return the items left in heap`,
    complexity: [
      { label: 'Min-heap capped at size k', time: 'O(n log k)', space: 'O(k)', note: 'each item costs at most one push and one pop' },
      { label: 'Sort everything, then slice', time: 'O(n log n)', space: 'O(n)', note: 'computes far more order than the question asked for' },
      { label: 'Heapify all, then pop k times', time: 'O(n + k log n)', space: 'O(n)', note: 'often the fastest when the whole array is already in memory' },
      { label: 'Quickselect', time: 'O(n) average, O(n^2) worst', space: 'O(1)', note: 'average only, and it reorders the input array' },
      { label: 'Bucket by frequency', time: 'O(n)', space: 'O(n)', note: 'works when the key is a count, which cannot exceed n' },
    ],
    dryRun: {
      input: 'nums = [3, 1, 5, 12, 2, 11], k = 3. Running find_kth_largest.',
      goal: 'Find the 3rd largest value with a min-heap that never grows past 3 items.',
      steps: [
        { state: 'heap={} k=3', action: 'Start with an empty min-heap and walk the list once.' },
        { state: 'x=3 heap={3}', action: 'Push 3. The size is 1, which is not greater than k, so nothing is popped.' },
        { state: 'x=1 heap={1,3}', action: 'Push 1. It becomes the top because a min-heap keeps its smallest member there.' },
        { state: 'x=5 heap={1,3,5}', action: 'Push 5. The heap now holds exactly k items, so its top, 1, is the 3rd largest seen so far.' },
        { state: 'x=12 heap={3,5,12}', action: 'Push 12, the size hits 4, so pop the smallest, 1. It can never re-enter the top 3.' },
        { state: 'x=2 heap={3,5,12}', action: 'Push 2, the size hits 4, so pop the smallest, which is 2 itself. The heap is unchanged.' },
        { state: 'x=11 heap={5,11,12}', action: 'Push 11, the size hits 4, so pop 3, which is now the weakest of the four.' },
        { state: 'heap={5,11,12}', action: 'The list is finished, so return heap[0].' },
      ],
      result: 'The answer is 5. The heap ends holding exactly the three largest values 5, 11 and 12, and a min-heap always keeps its smallest member on top, so heap[0] is the 3rd largest.',
    },
    mistakes: [
      {
        mistake: 'Using a max-heap of size k to find the k largest values.',
        why: 'The top is then the strongest candidate, so every eviction throws away your best item and you end up keeping the k smallest.',
        fix: 'k largest needs a min-heap so the weakest winner is on top; k smallest needs a max-heap. Ask "who do I want to evict?" and put that on top.',
      },
      {
        mistake: 'Popping when the size is greater than or equal to k instead of strictly greater.',
        why: 'The heap settles at k - 1 items, so the top is the (k-1)th element and every answer is off by one.',
        fix: 'Push first, then pop only while size(heap) > k, so the heap holds exactly k items after every step.',
      },
      {
        mistake: 'Returning the heap array directly when the problem wants the k items in sorted order.',
        why: 'A heap array is not sorted; only index 0 is guaranteed. Judges that compare order will reject it.',
        fix: 'If order matters, pop all k items and reverse, or sort the k survivors, which is only O(k log k).',
      },
      {
        mistake: 'Keying the heap only by count in Top K Frequent Words and ignoring the alphabetical tie-break.',
        why: 'Two words with the same count are then evicted arbitrarily, so the wrong one survives whenever counts tie at the boundary.',
        fix: 'Build a key that sorts both fields the way the eviction needs, for example (count, reversed word order), or use an explicit comparator.',
      },
      {
        mistake: 'Assuming the size-k heap is always the fastest option.',
        why: 'If the whole array is already in memory, heapify plus k pops is O(n + k log n), and quickselect averages O(n), both of which can beat O(n log k).',
        fix: 'Use the size-k heap when the data is a stream, when memory must stay at O(k), or when k is far smaller than n; otherwise mention the alternatives.',
      },
    ],
    whenToUse: [
      'The question asks for k of something and k is much smaller than n.',
      'Data arrives as a stream and you cannot hold all of it in memory.',
      'The words "k most frequent", "k closest", "k largest" or "kth largest" appear in the statement.',
      'You must merge or interleave k sorted sources and pull items out in order.',
      'Memory is explicitly limited to something like O(k).',
    ],
    whenNotToUse: [
      'k is close to n; log k is then log n, so a single sort is simpler and has better constants.',
      'The array fits in memory and you need the kth element exactly once; quickselect is O(n) on average.',
      'The key is a small bounded integer such as a frequency; bucket the items by count and read buckets from the top in O(n).',
      'You need the k items in sorted order and k is large; sorting once beats k separate pops.',
      'You need the top k of every sliding window; use a monotonic deque or heaps with lazy deletion instead.',
    ],
    relatedTopics: [
      { id: 'heap-basics', kind: 'concept', why: 'The size-k trick is just push and pop with a size guard, so the O(log k) cost comes straight from sift up and sift down.' },
      { id: 'two-heaps-median', kind: 'concept', why: 'Both keep a boundary value on a heap top; two heaps track the middle instead of the kth.' },
      { id: 'quick-sort', kind: 'concept', why: 'Quickselect is the quicksort partition applied to only the side that contains the kth element.' },
      { id: 'frequency-counting', kind: 'concept', why: 'Every "k most frequent" problem starts by counting with a hash map before the heap runs.' },
      { id: 'top-k-heap', kind: 'pattern', why: 'This concept is the pattern in its most direct form.' },
    ],
    quiz: [
      {
        question: 'n is one million and k is ten. What does the size-k min-heap approach cost in time?',
        options: ['O(k log n)', 'O(n log k)', 'O(n log n)', 'O(n^2)'],
        answerIndex: 1,
        explanation: 'Each of the n items does at most one push and one pop on a heap that never exceeds k items, so each step is log k.',
      },
      {
        question: 'To find the 5 largest numbers in a stream, which structure do you keep?',
        options: [
          'A max-heap of size 5',
          'A min-heap of size 5',
          'A min-heap of size n',
          'A max-heap of size n',
        ],
        answerIndex: 1,
        explanation: 'A min-heap puts the weakest of the current winners on top, which is exactly the item you want to evict when a better one arrives.',
      },
      {
        question: 'The heap already holds k items and the new value is smaller than the top. What is the cheapest correct action?',
        options: [
          'Skip the value entirely after a single comparison',
          'Push it and then pop the minimum',
          'Rebuild the heap from scratch',
          'Pop first, then push',
        ],
        answerIndex: 0,
        explanation: 'Push-then-pop is also correct but costs two O(log k) operations; a value below the current boundary can never win, so one comparison settles it.',
      },
      {
        question: 'You must return the k most frequent words, with ties broken alphabetically. Does a min-heap keyed only by count work?',
        options: [
          'Yes, ties never affect which words survive',
          'No, tied words are evicted arbitrarily, so the tie-break must be part of the heap key',
          'Yes, as long as you sort the result at the end',
          'No, heaps cannot store strings',
        ],
        answerIndex: 1,
        explanation: 'Eviction happens during the pass, so a word lost to an arbitrary tie is gone before the final sort ever runs.',
      },
      {
        question: 'When is plain sorting the better answer than a size-k heap?',
        options: [
          'When the data is a stream that does not fit in memory',
          'When k is close to n, so log k is essentially log n',
          'When k is 1',
          'When all values are distinct',
        ],
        answerIndex: 1,
        explanation: 'The heap advantage is log k versus log n; once k approaches n that gap disappears and sorting wins on simplicity and constants.',
      },
    ],
    sources: [
      'CLRS ch. 6 and ch. 9 (selection)',
      'MIT 6.006 lectures on heaps and order statistics',
      'VisuAlgo: Binary Heap module',
      'LeetCode editorials for Kth Largest Element in an Array and Top K Frequent Elements',
    ],
    problems: [
      {
        id: 'kth-largest-element-in-an-array',
        title: 'Kth Largest Element in an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        patternId: 'top-k-heap',
        hint: 'Maintain a min-heap of size k; after processing all numbers the top is the answer.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
        patternId: 'top-k-heap',
        hint: 'Count with a hash map, then keep a min-heap of (count, value) pairs limited to size k.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'k-closest-points-to-origin',
        title: 'K Closest Points to Origin',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
        patternId: 'top-k-heap',
        hint: 'Use squared distance as the key and a max-heap of size k so the farthest candidate is evicted first.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'top-k-frequent-words',
        title: 'Top K Frequent Words',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/top-k-frequent-words/',
        patternId: 'top-k-heap',
        hint: 'Count words, then heap by (count, word) with a comparator that breaks ties alphabetically.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'kth-smallest-element-in-a-sorted-matrix',
        title: 'Kth Smallest Element in a Sorted Matrix',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',
        patternId: 'k-way-merge',
        hint: 'Seed a min-heap with the first element of each row; pop k times, pushing the next element of the popped row each time.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'find-k-pairs-with-smallest-sums',
        title: 'Find K Pairs with Smallest Sums',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/',
        patternId: 'k-way-merge',
        hint: 'Start with (nums1[i], nums2[0]) for each i in a min-heap; after popping (i, j), push (i, j + 1).',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'smallest-range-covering-elements-from-k-lists',
        title: 'Smallest Range Covering Elements from K Lists',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/',
        patternId: 'k-way-merge',
        hint: 'Keep one pointer per list in a min-heap and track the current max; the range is (heap top, max), advance the list that owns the minimum.',
        xp: 80,
        tier: 'advanced',
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
    definition:
      'The two-heaps technique splits a collection at its middle: a max-heap holds the smaller half and a min-heap holds the larger half, with the two sizes kept equal or differing by exactly one. The two heap tops are the values on either side of the split, so the median is always sitting in plain view.',
    coreIdea:
      'The median depends only on the boundary between the lower half and the upper half, not on the order inside either half. A heap is precisely the structure that keeps a boundary value on top and ignores everything below it. So each new value costs O(log n) to route to the correct side and rebalance, and reading the median stays O(1) - instead of the O(n) element shifting that a sorted list pays on every single insert.',
    visual: [
      {
        caption: 'Add 5. It goes through low, over to high, and bounces back to keep low the bigger half.',
        frame: [
          'low  = max-heap, smaller half   (top = its largest)',
          'high = min-heap, larger half    (top = its smallest)',
          '',
          'low  { 5 }      top = 5',
          'high { }        top = -',
          'sizes 1 / 0     median = 5',
        ].join('\n'),
      },
      {
        caption: 'Add 15. It is bigger than everything, so the move step parks it in high.',
        frame: [
          'low  { 5 }      top = 5',
          'high { 15 }     top = 15',
          'sizes 1 / 1     median = (5 + 15) / 2 = 10',
          '',
          'invariant holds: max(low) = 5  <=  min(high) = 15',
        ].join('\n'),
      },
      {
        caption: 'Add 1, the new smallest. It lands in low and 5 slides across to high, then bounces back.',
        frame: [
          'push 1 to low   low {1, 5}   high {15}',
          'move low top 5  low {1}      high {5, 15}',
          'high bigger, move 5 back',
          '',
          'low  { 1, 5 }   top = 5',
          'high { 15 }     top = 15',
          'sizes 2 / 1     median = 5',
        ].join('\n'),
      },
      {
        caption: 'Add 3. Sizes come out even, so the median is the average of the two tops.',
        frame: [
          'low  { 1, 3 }   top = 3',
          'high { 5, 15 }  top = 5',
          'sizes 2 / 2     median = (3 + 5) / 2 = 4',
          '',
          'sorted view: 1  3 | 5  15    the rope is between',
        ].join('\n'),
      },
      {
        caption: 'Add 8. Five values now, and the odd one out sits on top of low.',
        frame: [
          'low  { 1, 3, 5 }  top = 5',
          'high { 8, 15 }    top = 8',
          'sizes 3 / 2       median = 5',
          '',
          'sorted view: 1  3  [5]  8  15   <- same answer',
        ].join('\n'),
      },
      {
        caption: 'The whole insert is three unconditional lines. No comparisons, no empty-heap cases.',
        frame: [
          'push x into low                 (max-heap)',
          'move the top of low into high   (keeps low <= high)',
          'if size(high) > size(low):',
          '    move the top of high back into low',
          '',
          'invariant 1: max(low) <= min(high)',
          'invariant 2: size(low) = size(high)',
          '             or  size(low) = size(high) + 1',
        ].join('\n'),
      },
    ],
    pseudocode: `low  = empty max-heap        // the smaller half
high = empty min-heap        // the larger half

function add(x):
    push x onto low
    move the top of low onto high     // low may now be short
    if size(high) > size(low):
        move the top of high onto low // keep low the bigger half

function median():
    if size(low) > size(high):
        return top of low             // odd count
    return (top of low + top of high) / 2.0

// sliding window variant: heaps cannot delete from the middle
function removeLazily(x):
    mark one copy of x as deleted in a map
    adjust your own size counters for low and high
    while the top of a heap is marked deleted:
        pop it and clear one mark
    // always clean the tops before reading the median`,
    complexity: [
      { label: 'Add one value', time: 'O(log n)', space: 'O(n)', note: 'at most three heap operations, each one sift up or sift down' },
      { label: 'Read the median', time: 'O(1)', space: 'O(1)', note: 'the answer is already at the tops' },
      { label: 'Sorted list with insert instead', time: 'O(n) per insert', space: 'O(n)', note: 'finding the slot is O(log n) but shifting elements is O(n)' },
      { label: 'Re-sorting after every query', time: 'O(n log n) per query', space: 'O(n)', note: 'wasteful when only one value changed' },
      { label: 'Sliding window median with lazy deletion', time: 'O(log n) amortised per step', space: 'O(n)', note: 'stale entries are discarded only when they reach a top' },
    ],
    dryRun: {
      input: 'MedianFinder: addNum(5), findMedian, addNum(15), findMedian, addNum(1), findMedian.',
      goal: 'Watch the two heaps stay balanced and the median stay readable at the tops.',
      steps: [
        { state: 'low=[] high=[]', action: 'addNum(5): push 5 into low, then move the top of low, which is 5, into high. Now low is empty and high holds 5.' },
        { state: 'low=[] high=[5]', action: 'high is bigger than low, so move its top back. low=[5], high=[].' },
        { state: 'low=[5] high=[]', action: 'findMedian: low is larger, so the median is the top of low, which is 5.' },
        { state: 'low=[5] high=[]', action: 'addNum(15): push 15 into low, which now tops at 15, then move that top into high. low=[5], high=[15].' },
        { state: 'low=[5] high=[15]', action: 'The sizes are equal, so no rebalance. findMedian returns (5 + 15) / 2 = 10.' },
        { state: 'low=[5] high=[15]', action: 'addNum(1): push 1 into low; the top of low is still 5, so 5 is what moves to high. low=[1], high=[5,15].' },
        { state: 'low=[1] high=[5,15]', action: 'high has 2 and low has 1, so move the top of high, which is 5, back into low.' },
        { state: 'low=[1,5] high=[15]', action: 'findMedian: low has 2 and high has 1, so the median is the top of low, which is 5.' },
      ],
      result: 'The median after 5, 15 and 1 is 5. Sorted, the values are 1, 5, 15, and 5 is indeed the middle one. The unconditional push-into-low, move-to-high routine sent 1 to the correct side without a single comparison, even though it was the new minimum.',
    },
    mistakes: [
      {
        mistake: 'Choosing the side by comparing the new value with a heap top, then rebalancing.',
        why: 'It works only if you also handle the empty-heap case; the very first insert reads a top that does not exist and crashes.',
        fix: 'Use the unconditional three-line routine: push into low, move the top of low into high, then move back if high has grown bigger.',
      },
      {
        mistake: 'Rebalancing sizes by moving an element that is not a heap top.',
        why: 'A heap cannot hand you a specific element, and whatever you grab may violate max(low) <= min(high), so the tops stop being the middle values.',
        fix: 'Only ever move a top from one heap to the other; that is the only move that provably preserves the ordering invariant.',
      },
      {
        mistake: 'Using integer division for the even case, as in (low_top + high_top) // 2.',
        why: 'The median of 3 and 4 is 3.5, but integer division reports 3, so every even-sized answer is silently wrong.',
        fix: 'Divide by 2.0, or cast to float before dividing.',
      },
      {
        mistake: 'Trying to delete an arbitrary value from a heap when the window slides.',
        why: 'A binary heap has no O(log n) delete-by-value; finding the element at all is O(n), so the loop degrades badly.',
        fix: 'Use lazy deletion: record the value in a "to remove" map, keep your own size counters, and pop stale entries only when they surface at a top.',
      },
      {
        mistake: 'Rebalancing every few inserts instead of after every insert.',
        why: 'Once the sizes differ by two or more, the tops are no longer the two values next to the middle, so the median is wrong until the next fix-up.',
        fix: 'Run the rebalance check at the end of every single add, so the invariant never breaks.',
      },
    ],
    whenToUse: [
      'A stream of numbers arrives and you must answer "the median so far" repeatedly.',
      'You need the boundary between the cheaper half and the more expensive half as items keep arriving.',
      'A greedy problem has two sides: one heap for what is available now, another for what has already been chosen, as in IPO.',
      'A sliding window needs a middle or threshold value, with lazy deletion bolted on.',
      'You must swap the smallest committed choice for a better one later, as in Furthest Building You Can Reach.',
    ],
    whenNotToUse: [
      'All the values are known up front and you need the median once; quickselect (or nth_element) is O(n) on average.',
      'You need arbitrary order statistics such as the 90th percentile, or the kth for a changing k; use a Fenwick tree over values or a BST with subtree sizes.',
      'You must delete arbitrary values often; an ordered multiset supports it directly in O(log n).',
      'Values are small bounded integers; a counting array with a running total finds the median in O(range).',
      'You only ever need the maximum or the minimum; one heap is enough and half the code.',
    ],
    relatedTopics: [
      { id: 'heap-basics', kind: 'concept', why: 'Everything here is push, pop and peek; the invariants are the only new idea.' },
      { id: 'top-k-problems', kind: 'concept', why: 'Both techniques keep a boundary value on a heap top; top-k tracks the kth, two heaps track the middle.' },
      { id: 'sliding-window', kind: 'concept', why: 'Sliding Window Median is this structure plus window bookkeeping and lazy deletion.' },
      { id: 'greedy-basics', kind: 'concept', why: 'IPO and Furthest Building are greedy algorithms whose "best available option" is served by one of the two heaps.' },
      { id: 'two-heaps', kind: 'pattern', why: 'This concept is the pattern stated in full.' },
    ],
    quiz: [
      {
        question: 'Which heap holds the smaller half of the values?',
        options: [
          'A min-heap, so the smallest value overall is on top',
          'A max-heap, so the largest of the small values sits right at the split',
          'A min-heap, so it can be merged quickly',
          'Either one works',
        ],
        answerIndex: 1,
        explanation: 'The median needs the value immediately below the split, and only a max-heap keeps the largest of its members on top.',
      },
      {
        question: 'You insert n values one at a time. How do two heaps compare with keeping a sorted list?',
        options: [
          'Both are O(n log n) overall',
          'Two heaps are O(n log n) overall, a sorted list is O(n^2) because each insert shifts elements',
          'Two heaps are O(n^2), a sorted list is O(n log n)',
          'Both are O(n) overall',
        ],
        answerIndex: 1,
        explanation: 'Binary search finds the slot in a sorted list in O(log n), but making room shifts up to n elements, so n inserts cost about n^2 / 2 moves.',
      },
      {
        question: 'The current sizes are low = 3 and high = 2. What is the median?',
        options: [
          'The average of the two tops',
          'The top of low',
          'The top of high',
          'You must pop from both heaps to find out',
        ],
        answerIndex: 1,
        explanation: 'With five values the middle one is the third smallest, and the invariant puts exactly the three smallest in low, so its top is that value.',
      },
      {
        question: 'You need the median of every window of size k in a stream, so values also leave the window. Do two plain heaps work unchanged?',
        options: [
          'Yes, heaps support removal by value',
          'No, a heap cannot delete an arbitrary element, so you need lazy deletion with a map plus your own size counters',
          'Yes, if k is small',
          'No, you must sort each window instead',
        ],
        answerIndex: 1,
        explanation: 'A heap only exposes its top, so the standard fix is to mark departed values and discard them when they eventually reach a top.',
      },
      {
        question: 'Why push every new value into low first and only then move the top of low into high?',
        options: [
          'It is faster than comparing with a top',
          'It guarantees the value ends up on the correct side with no comparisons and no empty-heap special cases',
          'It keeps both heaps fully sorted',
          'The heapq library requires it',
        ],
        answerIndex: 1,
        explanation: 'After the push, the top of low is by definition the largest of the smaller half, so moving that top always leaves both heaps correctly split.',
      },
    ],
    sources: [
      'CLRS ch. 6 (priority queues)',
      'MIT 6.006 lectures on heaps and priority queues',
      'VisuAlgo: Binary Heap module',
      'LeetCode editorials for Find Median from Data Stream and Sliding Window Median',
    ],
    problems: [
      {
        id: 'furthest-building-you-can-reach',
        title: 'Furthest Building You Can Reach',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/furthest-building-you-can-reach/',
        patternId: 'top-k-heap',
        hint: 'Use ladders on every climb, keep the climbs in a min-heap, and when ladders run out pay bricks for the smallest climb.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'find-median-from-data-stream',
        title: 'Find Median from Data Stream',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/find-median-from-data-stream/',
        patternId: 'two-heaps',
        hint: 'Max-heap for the lower half, min-heap for the upper half, and rebalance so their sizes differ by at most one.',
        xp: 80,
        tier: 'beginner',
      },
      {
        id: 'ipo',
        title: 'IPO',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/ipo/',
        patternId: 'two-heaps',
        hint: 'Min-heap of projects by capital needed; move affordable ones into a max-heap by profit and pop the best k times.',
        xp: 80,
        tier: 'intermediate',
      },
      {
        id: 'sliding-window-median',
        title: 'Sliding Window Median',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/sliding-window-median/',
        patternId: 'two-heaps',
        hint: 'Two heaps plus a map of values that have left the window; discard stale tops lazily before reading the median.',
        xp: 80,
        tier: 'advanced',
      },
      {
        id: 'minimum-cost-to-hire-k-workers',
        title: 'Minimum Cost to Hire K Workers',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/minimum-cost-to-hire-k-workers/',
        patternId: 'top-k-heap',
        hint: 'Sort workers by wage-to-quality ratio; sweep upward keeping the k smallest qualities in a max-heap and evaluate each ratio as the cap.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },
]
