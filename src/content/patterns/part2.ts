import type { Pattern } from '../types'

export const patterns: Pattern[] = [
  // -------------------------------------------------------------------------
  // DFS
  // -------------------------------------------------------------------------
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    tagline: 'Walk as deep as you can down one path, then back up and try the next one.',
    triggers: [
      'number of islands',
      'connected components',
      'clone a graph',
      'does a path exist',
      'flood fill / paint a region',
      'detect a cycle',
      'all paths from source to target',
      'explore a maze or grid',
    ],
    avoidWhen: [
      'you need the SHORTEST path in an unweighted graph (use BFS)',
      'the graph is very deep and recursion could overflow (use an explicit stack)',
      'edges have different weights (use Dijkstra)',
    ],
    explanation: `DFS means: pick a direction, walk as far as you can, and only when you hit a dead end do you come back and try the next direction. It is the simplest way to answer "what can I reach from here?", and that one question hides behind islands, components, cycles and mazes.

## The idea

- Keep a \`visited\` set so you never walk in circles.
- From a node: mark it, then call yourself on every neighbour you have not seen.
- Recursion does the "come back" part for you. That is the whole trick.

## A tiny example

Count the islands (groups of connected 1s) in this grid:

\`\`\`
1 1 0
0 1 0
0 0 1
\`\`\`

- Scan cells left to right, top to bottom. Cell (0,0) is a 1, so islands = 1. Run DFS from it.
- DFS marks (0,0), walks to (0,1), then down to (1,1). Every connected 1 is now marked as seen.
- Keep scanning. (2,2) is still an unseen 1, so islands = 2. Answer: 2.

The slow way would re-explore the same cells again and again. With a visited set, every cell is touched once, so the work is O(rows * cols).

## Step by step

1. Decide what a "node" is (a cell, a graph vertex) and what its "neighbours" are (4 directions, an adjacency list).
2. Write the base cases: out of bounds, wrong value, already visited -> return.
3. Mark the node as visited BEFORE exploring its neighbours.
4. Recurse on each neighbour.
5. If the graph can be disconnected, wrap the DFS in a loop over every possible start point.

## Where people go wrong

- Marking visited after the recursive calls. That gives an infinite loop.
- Forgetting bounds checks in grids.
- Python's recursion limit (about 1000 deep). For big grids, raise it with \`sys.setrecursionlimit\` or use an explicit stack.
- Using DFS for "shortest path". DFS finds *a* path, not the shortest one. Use BFS for that.

## How to recognise it in an interview

"Number of islands", "connected components", "clone", "does a path exist", "flood fill", "all paths" -> reach for DFS.`,
    time: 'O(V + E) for graphs, O(rows * cols) for grids',
    space: 'O(V) for the visited set plus the recursion stack',
    template: {
      python: `def dfs(graph, start):
    visited = set()

    def explore(node):
        if node in visited:
            return
        visited.add(node)          # mark BEFORE exploring neighbours
        # ... do work on node here ...
        for nxt in graph[node]:    # try every neighbour
            explore(nxt)

    explore(start)
    return visited


# grid version: neighbours are up/down/left/right
def dfs_grid(grid, r, c):
    rows, cols = len(grid), len(grid[0])
    if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
        return
    grid[r][c] = '#'               # mark as seen by overwriting
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        dfs_grid(grid, r + dr, c + dc)`,
      javascript: `function dfs(graph, start) {
  const visited = new Set();
  function explore(node) {
    if (visited.has(node)) return;
    visited.add(node);            // mark BEFORE exploring neighbours
    // ... do work on node here ...
    for (const nxt of graph[node] || []) explore(nxt);
  }
  explore(start);
  return visited;
}

// grid version: neighbours are up/down/left/right
function dfsGrid(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return;
  if (grid[r][c] !== '1') return;
  grid[r][c] = '#';               // mark as seen by overwriting
  dfsGrid(grid, r + 1, c); dfsGrid(grid, r - 1, c);
  dfsGrid(grid, r, c + 1); dfsGrid(grid, r, c - 1);
}`,
      java: `import java.util.*;

class DFS {
  Set<Integer> visited = new HashSet<>();

  void explore(Map<Integer, List<Integer>> graph, int node) {
    if (visited.contains(node)) return;
    visited.add(node);            // mark BEFORE exploring neighbours
    // ... do work on node here ...
    for (int nxt : graph.getOrDefault(node, List.of())) explore(graph, nxt);
  }

  // grid version: neighbours are up/down/left/right
  void dfsGrid(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return;
    if (grid[r][c] != '1') return;
    grid[r][c] = '#';             // mark as seen by overwriting
    dfsGrid(grid, r + 1, c); dfsGrid(grid, r - 1, c);
    dfsGrid(grid, r, c + 1); dfsGrid(grid, r, c - 1);
  }
}`,
      cpp: `#include <vector>
#include <unordered_set>
using namespace std;

unordered_set<int> visited;

void explore(vector<vector<int>>& graph, int node) {
  if (visited.count(node)) return;
  visited.insert(node);           // mark BEFORE exploring neighbours
  // ... do work on node here ...
  for (int nxt : graph[node]) explore(graph, nxt);
}

// grid version: neighbours are up/down/left/right
void dfsGrid(vector<vector<char>>& grid, int r, int c) {
  int rows = grid.size(), cols = grid[0].size();
  if (r < 0 || c < 0 || r >= rows || c >= cols) return;
  if (grid[r][c] != '1') return;
  grid[r][c] = '#';               // mark as seen by overwriting
  dfsGrid(grid, r + 1, c); dfsGrid(grid, r - 1, c);
  dfsGrid(grid, r, c + 1); dfsGrid(grid, r, c - 1);
}`,
    },
    relatedGateIds: ['trees', 'graphs', 'recursion-backtracking'],
    exampleProblemIds: ['number-of-islands', 'clone-graph', 'max-area-of-island', 'pacific-atlantic-water-flow', 'course-schedule'],
  },

  // -------------------------------------------------------------------------
  // BFS
  // -------------------------------------------------------------------------
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    tagline: 'Explore in rings: everything 1 step away, then 2 steps, then 3. First arrival = shortest.',
    triggers: [
      'shortest path in unweighted graph',
      'minimum number of steps / moves',
      'level order traversal',
      'rotting oranges / something spreading',
      'nearest / closest cell',
      'word ladder',
      'fewest hops',
    ],
    avoidWhen: [
      'edges have different weights (use Dijkstra)',
      'you need ALL paths, not the shortest one (use DFS / backtracking)',
      'you just need "is it reachable?" and recursion is simpler (DFS works too)',
    ],
    explanation: `BFS explores a graph like ripples in a pond. First you look at everything one step away, then everything two steps away, and so on. Because you reach each node in order of distance, the first time you see a node is guaranteed to be by the shortest route (when every step costs the same).

## The idea

- Use a queue (first in, first out). Put the start in it.
- Pop the front. For each neighbour you have not seen: record its distance, mark it seen, push it to the back.
- The queue naturally processes all distance-1 nodes before any distance-2 node.

## A tiny example

Fewest moves from A to E in this graph: A-B, A-C, B-D, C-D, D-E.

- Queue: [A]. dist(A) = 0.
- Pop A. Neighbours B, C are new: dist = 1. Queue: [B, C].
- Pop B. D is new: dist = 2. Queue: [C, D].
- Pop C. D already seen, skip. Queue: [D].
- Pop D. E is new: dist = 3. Done. Answer: 3.

The slow way (try every path with DFS) can explode: a small grid has thousands of paths. BFS touches each node once, so it is O(V + E).

## Step by step

1. Define the node and its neighbours (like DFS).
2. Create a queue and a \`seen\` set (or a \`dist\` map, which does both jobs).
3. Loop while the queue is not empty: pop, check neighbours, push new ones.
4. If you need "which level am I on", process the queue one whole level at a time: \`for _ in range(len(queue))\` before increasing the level counter.
5. Multi-source BFS (rotting oranges): push ALL starting cells at the beginning.

## Where people go wrong

- Marking a node seen when you POP it instead of when you PUSH it. That lets duplicates into the queue and can blow up memory.
- Using \`list.pop(0)\` in Python. That is O(n). Use \`collections.deque\`.
- Forgetting that BFS only gives shortest paths when all edges cost the same.

## How to recognise it in an interview

"Shortest", "minimum number of steps", "nearest", "level by level", "how long until it spreads everywhere" -> BFS.`,
    time: 'O(V + E) for graphs, O(rows * cols) for grids',
    space: 'O(V) for the queue and the seen set',
    template: {
      python: `from collections import deque


def bfs(graph, start):
    dist = {start: 0}             # also acts as the visited set
    queue = deque([start])
    while queue:
        node = queue.popleft()    # take from the FRONT
        for nxt in graph[node]:
            if nxt not in dist:   # first time we see it = shortest
                dist[nxt] = dist[node] + 1
                queue.append(nxt)
    return dist


# level-by-level version (when you need "which level am I on?")
def bfs_levels(start, neighbours):
    queue, seen, level = deque([start]), {start}, 0
    while queue:
        for _ in range(len(queue)):   # everything now in queue = one level
            node = queue.popleft()
            for nxt in neighbours(node):
                if nxt not in seen:
                    seen.add(nxt)
                    queue.append(nxt)
        level += 1
    return level`,
      javascript: `function bfs(graph, start) {
  const dist = new Map([[start, 0]]); // also acts as the visited set
  const queue = [start];
  let head = 0;                        // index pointer = cheap queue
  while (head < queue.length) {
    const node = queue[head++];        // take from the FRONT
    for (const nxt of graph[node] || []) {
      if (!dist.has(nxt)) {            // first time we see it = shortest
        dist.set(nxt, dist.get(node) + 1);
        queue.push(nxt);
      }
    }
  }
  return dist;
}
// level-by-level: loop "for (let i = size; i > 0; i--)" over the
// current queue size before increasing the level counter.`,
      java: `import java.util.*;

class BFS {
  Map<Integer, Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
    Map<Integer, Integer> dist = new HashMap<>(); // also the visited set
    Deque<Integer> queue = new ArrayDeque<>();
    dist.put(start, 0);
    queue.add(start);
    while (!queue.isEmpty()) {
      int node = queue.poll();                    // take from the FRONT
      for (int nxt : graph.getOrDefault(node, List.of())) {
        if (!dist.containsKey(nxt)) {             // first visit = shortest
          dist.put(nxt, dist.get(node) + 1);
          queue.add(nxt);
        }
      }
    }
    return dist;
  }
  // level-by-level: int size = queue.size(); loop size times, then level++
}`,
      cpp: `#include <vector>
#include <queue>
#include <unordered_map>
using namespace std;

unordered_map<int, int> bfs(vector<vector<int>>& graph, int start) {
  unordered_map<int, int> dist;   // also acts as the visited set
  queue<int> q;
  dist[start] = 0;
  q.push(start);
  while (!q.empty()) {
    int node = q.front(); q.pop(); // take from the FRONT
    for (int nxt : graph[node]) {
      if (!dist.count(nxt)) {      // first time we see it = shortest
        dist[nxt] = dist[node] + 1;
        q.push(nxt);
      }
    }
  }
  return dist;
}
// level-by-level: int size = q.size(); loop size times, then level++`,
    },
    relatedGateIds: ['trees', 'graphs', 'stacks-queues'],
    exampleProblemIds: ['binary-tree-level-order-traversal', 'rotting-oranges', 'number-of-islands', 'word-ladder', 'shortest-path-in-binary-matrix'],
  },

  // -------------------------------------------------------------------------
  // TOP-K HEAP
  // -------------------------------------------------------------------------
  {
    id: 'top-k-heap',
    name: 'Top-K with a Heap',
    tagline: 'Keep a small heap of size k; the answer is whatever survives inside it.',
    triggers: [
      'k largest / k smallest',
      'k most frequent',
      'kth largest element',
      'k closest points',
      'top k',
      'sort characters by frequency',
      'kth smallest in a sorted matrix',
    ],
    avoidWhen: [
      'k is close to n (just sort, it is simpler)',
      'you need the full sorted order anyway',
      'you only need the single max or min (one pass with a variable)',
    ],
    explanation: `A heap is a container that always hands you its smallest (or largest) item in O(log n). The Top-K trick: keep a heap of size k, and every time it grows to k + 1, throw out the worst item. Whatever is left at the end is your answer.

## The idea

To find the k LARGEST items, use a MIN-heap of size k. That sounds backwards, but think about it: the heap's smallest item is the "weakest survivor". When a new item arrives, it either beats the weakest (and stays) or does not (and gets popped).

## A tiny example

Find the 2 largest of [5, 1, 9, 3, 7].

- Push 5 -> heap [5]
- Push 1 -> heap [1, 5]
- Push 9 -> heap [1, 5, 9], size 3 > 2, pop the smallest (1) -> [5, 9]
- Push 3 -> [3, 5, 9], pop 3 -> [5, 9]
- Push 7 -> [5, 7, 9], pop 5 -> [7, 9]

Answer: [7, 9]. The heap top (7) is the 2nd largest.

The slow way sorts everything: O(n log n). The heap never holds more than k items, so each push/pop is O(log k) and the total is O(n log k). When k is small (top 10 out of a million), that is a huge win.

## Step by step

1. Decide what "best" means. Largest? Most frequent? Closest? That decides the heap key.
2. For "k most frequent", first build a count dictionary, then push (count, item) pairs.
3. Push each item. If \`len(heap) > k\`, pop once.
4. At the end the heap contains the answer. Pop everything for sorted order if needed.

## Where people go wrong

- Using a MAX-heap for k largest and popping the max. That throws away the answer.
- In Python \`heapq\` is a MIN-heap only. For a max-heap, push negative numbers.
- Comparing tuples where the second value is not comparable (like a dict). Add an index as a tie-breaker.
- Forgetting that \`heapq.nlargest(k, nums)\` exists and is fine for interviews once you can explain it.

## How to recognise it in an interview

Any sentence with "k" in it: "k largest", "k most frequent", "k closest", "kth smallest" -> heap of size k.`,
    time: 'O(n log k)',
    space: 'O(k) for the heap (plus O(n) if you count frequencies first)',
    template: {
      python: `import heapq
from collections import Counter


def top_k_largest(nums, k):
    heap = []                        # MIN-heap of size k
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:            # too many? drop the smallest
            heapq.heappop(heap)
    return heap                      # the k largest (heap[0] is the k-th largest)


# for "k most frequent": count first, then push (count, item)
def top_k_frequent(nums, k):
    counts = Counter(nums)
    heap = []
    for item, c in counts.items():
        heapq.heappush(heap, (c, item))
        if len(heap) > k:
            heapq.heappop(heap)
    return [item for c, item in heap]`,
      javascript: `// Tiny min-heap on top of an array (JS has no built-in heap).
class MinHeap {
  constructor(cmp) { this.a = []; this.cmp = cmp || ((x, y) => x - y); }
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(v) { this.a.push(v); this.up(this.a.length - 1); }
  pop() {
    const top = this.a[0], last = this.a.pop();
    if (this.a.length) { this.a[0] = last; this.down(0); }
    return top;
  }
  up(i) {
    for (let p; i > 0 && this.cmp(this.a[i], this.a[p = (i - 1) >> 1]) < 0; i = p)
      [this.a[i], this.a[p]] = [this.a[p], this.a[i]];
  }
  down(i) {
    for (;;) {
      let l = 2 * i + 1, r = l + 1, m = i;
      if (l < this.a.length && this.cmp(this.a[l], this.a[m]) < 0) m = l;
      if (r < this.a.length && this.cmp(this.a[r], this.a[m]) < 0) m = r;
      if (m === i) return;
      [this.a[i], this.a[m]] = [this.a[m], this.a[i]]; i = m;
    }
  }
}

function topKLargest(nums, k) {
  const heap = new MinHeap();          // MIN-heap of size k
  for (const x of nums) {
    heap.push(x);
    if (heap.size() > k) heap.pop();   // too many? drop the smallest
  }
  return heap.a;                       // the k largest
}`,
      java: `import java.util.*;

class TopK {
  List<Integer> topKLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(); // MIN-heap of size k
    for (int x : nums) {
      heap.add(x);
      if (heap.size() > k) heap.poll();  // too many? drop the smallest
    }
    return new ArrayList<>(heap);        // the k largest
  }

  // "k most frequent": count first, then heap on the counts
  List<Integer> topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> counts = new HashMap<>();
    for (int x : nums) counts.merge(x, 1, Integer::sum);
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
      heap.add(new int[]{e.getKey(), e.getValue()});
      if (heap.size() > k) heap.poll();
    }
    List<Integer> out = new ArrayList<>();
    for (int[] p : heap) out.add(p[0]);
    return out;
  }
}`,
      cpp: `#include <vector>
#include <queue>
#include <unordered_map>
using namespace std;

vector<int> topKLargest(vector<int>& nums, int k) {
  priority_queue<int, vector<int>, greater<int>> heap; // MIN-heap of size k
  for (int x : nums) {
    heap.push(x);
    if ((int)heap.size() > k) heap.pop();  // too many? drop the smallest
  }
  vector<int> out;
  while (!heap.empty()) { out.push_back(heap.top()); heap.pop(); }
  return out;                               // the k largest
}

// "k most frequent": count first, then heap of (count, value) pairs
vector<int> topKFrequent(vector<int>& nums, int k) {
  unordered_map<int, int> counts;
  for (int x : nums) counts[x]++;
  using P = pair<int, int>;
  priority_queue<P, vector<P>, greater<P>> heap;
  for (auto& kv : counts) {
    heap.push({kv.second, kv.first});
    if ((int)heap.size() > k) heap.pop();
  }
  vector<int> out;
  while (!heap.empty()) { out.push_back(heap.top().second); heap.pop(); }
  return out;
}`,
    },
    relatedGateIds: ['heaps', 'hashing'],
    exampleProblemIds: ['kth-largest-element-in-an-array', 'top-k-frequent-elements', 'k-closest-points-to-origin', 'kth-largest-element-in-a-stream', 'sort-characters-by-frequency'],
  },

  // -------------------------------------------------------------------------
  // TWO HEAPS
  // -------------------------------------------------------------------------
  {
    id: 'two-heaps',
    name: 'Two Heaps',
    tagline: 'Split the numbers into a "lower half" max-heap and an "upper half" min-heap; the median sits on top.',
    triggers: [
      'median of a stream',
      'running median',
      'sliding window median',
      'split numbers into a smaller half and a larger half',
      'maximise capital / IPO style scheduling',
      'balance two groups as items arrive',
    ],
    avoidWhen: [
      'you only need the min or the max (one heap is enough)',
      'all the numbers arrive at once (sort once and index the middle)',
      'you need arbitrary "k-th" positions, not the middle (use Top-K or quickselect)',
    ],
    explanation: `The median is the middle value. If numbers arrive one at a time and someone keeps asking "what is the median right now?", re-sorting every time is O(n log n) per question. Two heaps answer it in O(1) and update in O(log n).

## The idea

- Keep the LOWER half in a max-heap (its top is the biggest of the small numbers).
- Keep the UPPER half in a min-heap (its top is the smallest of the big numbers).
- Keep them balanced: the lower half has the same size, or one more.
- Median = top of the lower half (odd count) or the average of both tops (even count).

## A tiny example

Stream: 5, 2, 8, 1.

- Add 5: push to lower [5], move its top to upper [5], upper is bigger so move it back. lower [5], upper []. Median 5.
- Add 2: push to lower [5, 2], move top (5) to upper. lower [2], upper [5], sizes equal. Median (2 + 5) / 2 = 3.5.
- Add 8: push to lower [8, 2], move top (8) to upper [5, 8]. Upper is bigger, move 5 back. lower [5, 2], upper [8]. Median 5.
- Add 1: push to lower [5, 2, 1], move top (5) to upper [5, 8]. Sizes equal. Median (2 + 5) / 2 = 3.5.

The three-step shuffle (push low, move top to high, rebalance) is a little dance that always ends with everything in the right place.

## Step by step

1. Create \`small\` (max-heap, store negatives in Python) and \`large\` (min-heap).
2. On each new number: push into \`small\`, then pop its top and push into \`large\`.
3. If \`large\` is now bigger than \`small\`, pop from \`large\` and push into \`small\`.
4. Median: if sizes differ, top of \`small\`; else average of both tops.

## Where people go wrong

- Forgetting the negation when using Python's heapq as a max-heap (both when pushing AND when reading).
- Balancing the wrong way so the median ends up in the wrong heap.
- For sliding-window median, removing an item from the middle of a heap is not O(log n); you need "lazy deletion" or a sorted container.

## How to recognise it in an interview

"Median", "stream", "as numbers arrive", "split into two halves" -> two heaps.`,
    time: 'O(log n) per insert, O(1) to read the median',
    space: 'O(n) to hold all the numbers',
    template: {
      python: `import heapq


class MedianFinder:
    def __init__(self):
        self.small = []   # MAX-heap (store negatives) : lower half
        self.large = []   # MIN-heap                    : upper half

    def add(self, num):
        # 1. push into the lower half (as a negative for max-heap)
        heapq.heappush(self.small, -num)
        # 2. move the biggest of the lower half to the upper half
        heapq.heappush(self.large, -heapq.heappop(self.small))
        # 3. rebalance so small has equal or one more element
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def median(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2`,
      javascript: `// Uses the MinHeap class from the Top-K template.
class MedianFinder {
  constructor() {
    this.small = new MinHeap((a, b) => b - a); // MAX-heap: lower half
    this.large = new MinHeap((a, b) => a - b); // MIN-heap: upper half
  }
  add(num) {
    this.small.push(num);                      // 1. into the lower half
    this.large.push(this.small.pop());         // 2. biggest low -> high
    if (this.large.size() > this.small.size()) // 3. keep small >= large
      this.small.push(this.large.pop());
  }
  median() {
    if (this.small.size() > this.large.size()) return this.small.peek();
    return (this.small.peek() + this.large.peek()) / 2;
  }
}`,
      java: `import java.util.*;

class MedianFinder {
  PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder()); // MAX-heap
  PriorityQueue<Integer> large = new PriorityQueue<>();                          // MIN-heap

  void add(int num) {
    small.add(num);                          // 1. into the lower half
    large.add(small.poll());                 // 2. biggest low -> high
    if (large.size() > small.size())         // 3. keep small >= large
      small.add(large.poll());
  }

  double median() {
    if (small.size() > large.size()) return small.peek();
    return (small.peek() + large.peek()) / 2.0;
  }
}`,
      cpp: `#include <queue>
#include <vector>
using namespace std;

class MedianFinder {
  priority_queue<int> small;                              // MAX-heap: lower half
  priority_queue<int, vector<int>, greater<int>> large;   // MIN-heap: upper half
public:
  void add(int num) {
    small.push(num);                          // 1. into the lower half
    large.push(small.top()); small.pop();     // 2. biggest low -> high
    if (large.size() > small.size()) {        // 3. keep small >= large
      small.push(large.top()); large.pop();
    }
  }
  double median() {
    if (small.size() > large.size()) return small.top();
    return (small.top() + large.top()) / 2.0;
  }
};`,
    },
    relatedGateIds: ['heaps'],
    exampleProblemIds: ['find-median-from-data-stream', 'sliding-window-median', 'ipo', 'kth-largest-element-in-a-stream'],
  },

  // -------------------------------------------------------------------------
  // K-WAY MERGE
  // -------------------------------------------------------------------------
  {
    id: 'k-way-merge',
    name: 'K-way Merge',
    tagline: 'Merge many sorted lists by keeping only their "heads" in a heap.',
    triggers: [
      'merge k sorted lists',
      'k sorted arrays',
      'kth smallest in a sorted matrix',
      'k pairs with the smallest sums',
      'smallest range covering elements from k lists',
      'combine several sorted streams into one',
    ],
    avoidWhen: [
      'there are only two lists (a simple two-pointer merge is cleaner)',
      'the inputs are not sorted (sort first, or use a different pattern)',
      'you want everything sorted and memory is not a problem (concatenate and sort is fine)',
    ],
    explanation: `You have k sorted lists and want one sorted output. Merging two lists with two pointers is easy. With k lists you would need k pointers and a "which one is smallest right now?" check every step. A heap does that check in O(log k).

## The idea

- Put the FIRST item of every list into a min-heap, together with "which list it came from".
- Pop the smallest. That is the next output item.
- Advance only that list: push its next item into the heap.
- Repeat until the heap is empty.

The heap never holds more than k items, one per list.

## A tiny example

Lists: A = [1, 4, 7], B = [2, 5], C = [3, 6].

- Heap: {1(A), 2(B), 3(C)}. Pop 1, push A's next (4). Output: [1]
- Heap: {2(B), 3(C), 4(A)}. Pop 2, push 5. Output: [1, 2]
- Heap: {3(C), 4(A), 5(B)}. Pop 3, push 6. Output: [1, 2, 3]
- Pop 4, push 7. Pop 5, B is empty so push nothing. Pop 6. Pop 7.
- Output: [1, 2, 3, 4, 5, 6, 7].

Slow way: concatenate everything and sort, O(N log N) where N is the total count. K-way merge is O(N log k). If k = 3 and N = a million, log k is tiny.

## Step by step

1. Build the heap with \`(value, list_index, position)\` tuples for every non-empty list.
2. While the heap is not empty: pop, append the value to the output.
3. If that list has more items, push the next one with the same list index.
4. For "kth smallest", stop after k pops instead of draining the heap.

## Where people go wrong

- Pushing a whole list instead of one item.
- Ties on value: Python compares the next tuple field, so make sure it is comparable (use the list index, not a node object). For linked lists, add a counter as a tie-breaker.
- Forgetting to check that the list has a next item before pushing.

## How to recognise it in an interview

"k sorted", "merge k", "sorted matrix", "smallest pair sums from two sorted arrays" -> k-way merge.`,
    time: 'O(N log k), N = total number of items, k = number of lists',
    space: 'O(k) for the heap (plus the output)',
    template: {
      python: `import heapq


def k_way_merge(lists):
    heap = []
    # seed the heap with the FIRST item of every list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))   # (value, which list, index)
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)           # smallest of the k heads
        out.append(val)
        if j + 1 < len(lists[i]):                 # advance that list only
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return out`,
      javascript: `// Uses the MinHeap class from the Top-K template.
function kWayMerge(lists) {
  const heap = new MinHeap((a, b) => a[0] - b[0]); // [value, listIdx, idx]
  lists.forEach((lst, i) => {                       // seed with every head
    if (lst.length) heap.push([lst[0], i, 0]);
  });
  const out = [];
  while (heap.size()) {
    const [val, i, j] = heap.pop();                 // smallest of the heads
    out.push(val);
    if (j + 1 < lists[i].length) heap.push([lists[i][j + 1], i, j + 1]);
  }
  return out;
}`,
      java: `import java.util.*;

class KWayMerge {
  List<Integer> merge(List<List<Integer>> lists) {
    // int[]{value, listIdx, idx}
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (int i = 0; i < lists.size(); i++)            // seed with every head
      if (!lists.get(i).isEmpty()) heap.add(new int[]{lists.get(i).get(0), i, 0});
    List<Integer> out = new ArrayList<>();
    while (!heap.isEmpty()) {
      int[] top = heap.poll();                        // smallest of the heads
      int val = top[0], i = top[1], j = top[2];
      out.add(val);
      if (j + 1 < lists.get(i).size())                // advance that list only
        heap.add(new int[]{lists.get(i).get(j + 1), i, j + 1});
    }
    return out;
  }
}`,
      cpp: `#include <vector>
#include <queue>
#include <tuple>
using namespace std;

vector<int> kWayMerge(vector<vector<int>>& lists) {
  using T = tuple<int, int, int>;                  // (value, listIdx, idx)
  priority_queue<T, vector<T>, greater<T>> heap;
  for (int i = 0; i < (int)lists.size(); i++)      // seed with every head
    if (!lists[i].empty()) heap.push({lists[i][0], i, 0});
  vector<int> out;
  while (!heap.empty()) {
    auto [val, i, j] = heap.top(); heap.pop();     // smallest of the heads
    out.push_back(val);
    if (j + 1 < (int)lists[i].size())              // advance that list only
      heap.push({lists[i][j + 1], i, j + 1});
  }
  return out;
}`,
    },
    relatedGateIds: ['heaps', 'linked-lists'],
    exampleProblemIds: ['merge-k-sorted-lists', 'kth-smallest-element-in-a-sorted-matrix', 'find-k-pairs-with-smallest-sums', 'smallest-range-covering-elements-from-k-lists'],
  },

  // -------------------------------------------------------------------------
  // TOPOLOGICAL SORT
  // -------------------------------------------------------------------------
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    tagline: 'Order tasks so every prerequisite comes before the task that needs it.',
    triggers: [
      'prerequisites / order of tasks',
      'course schedule',
      'build order / dependencies',
      'directed acyclic graph (DAG)',
      'is it possible to finish all of them',
      'a must happen before b',
      'alien dictionary / derive a letter order',
    ],
    avoidWhen: [
      'the graph is undirected (there is no "before / after" meaning)',
      'you need the shortest path, not an ordering',
      'cycles are fine and you only care about connectivity (union-find / DFS)',
    ],
    explanation: `Imagine a to-do list where some tasks must be done before others: "wear socks before shoes". Topological sort produces one valid order for the whole list. It also tells you when the list is impossible (a cycle: A before B, B before A).

## The idea (Kahn's algorithm)

- For every task count how many things must come before it. That number is its "in-degree".
- Tasks with in-degree 0 are ready right now. Put them in a queue.
- Pop a task, add it to the order, and "unlock" its dependents: lower their in-degree by one. When one hits 0, it is ready, push it.
- If you finish and some tasks were never unlocked, there was a cycle.

## A tiny example

4 courses. Rules: 0 before 1, 0 before 2, 1 before 3, 2 before 3.

- In-degrees: [0, 1, 1, 2]. Queue: [0].
- Pop 0 -> order [0]. Unlock 1 and 2 -> in-degrees [0, 0, 0, 2]. Queue [1, 2].
- Pop 1 -> order [0, 1]. Unlock 3 -> in-degree 1.
- Pop 2 -> order [0, 1, 2]. Unlock 3 -> in-degree 0. Queue [3].
- Pop 3 -> order [0, 1, 2, 3]. Length 4 = number of courses, so no cycle.

Slow way: try every permutation and check the rules. That is n! which is hopeless past n = 10. Kahn's algorithm is O(V + E): each edge is looked at exactly once.

## Step by step

1. Build the adjacency list \`graph[a] = [b, ...]\` for each rule "a before b" and count \`indeg[b] += 1\`.
2. Push every node with in-degree 0 into a queue.
3. Pop, append to the order, decrement each neighbour's in-degree, push when it reaches 0.
4. If \`len(order) < n\` return "impossible" (cycle). Otherwise return the order.

## Where people go wrong

- Reversing the edge direction. LeetCode gives pairs like [course, prerequisite], so the edge goes prerequisite -> course.
- Forgetting nodes that have no edges at all. They still belong in the order.
- Not checking the final length, which silently ignores cycles.

## How to recognise it in an interview

"Prerequisites", "dependencies", "order in which to", "can all be finished", "directed" -> topological sort.`,
    time: 'O(V + E)',
    space: 'O(V + E) for the graph, in-degrees and queue',
    template: {
      python: `from collections import deque, defaultdict


def topo_sort(n, edges):
    # edges: (a, b) means "a must come BEFORE b"
    graph = defaultdict(list)
    indeg = [0] * n                  # how many things must come before me?
    for a, b in edges:
        graph[a].append(b)
        indeg[b] += 1

    queue = deque(i for i in range(n) if indeg[i] == 0)   # nothing blocks these
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:      # "unlock" the things that depended on node
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                queue.append(nxt)

    if len(order) != n:              # some nodes never unlocked => cycle
        return []
    return order`,
      javascript: `function topoSort(n, edges) {
  // edges: [a, b] means "a must come BEFORE b"
  const graph = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);   // how many things must come before me?
  for (const [a, b] of edges) { graph[a].push(b); indeg[b]++; }

  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const nxt of graph[node]) {     // "unlock" dependents
      if (--indeg[nxt] === 0) queue.push(nxt);
    }
  }
  return order.length === n ? order : []; // shorter => cycle
}`,
      java: `import java.util.*;

class TopoSort {
  List<Integer> topoSort(int n, int[][] edges) {
    // edges[i] = {a, b} means "a must come BEFORE b"
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    int[] indeg = new int[n];             // how many things must come before me?
    for (int[] e : edges) { graph.get(e[0]).add(e[1]); indeg[e[1]]++; }

    Deque<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) queue.add(i);
    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
      int node = queue.poll();
      order.add(node);
      for (int nxt : graph.get(node))     // "unlock" dependents
        if (--indeg[nxt] == 0) queue.add(nxt);
    }
    return order.size() == n ? order : new ArrayList<>(); // shorter => cycle
  }
}`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

vector<int> topoSort(int n, vector<pair<int, int>>& edges) {
  // edge (a, b) means "a must come BEFORE b"
  vector<vector<int>> graph(n);
  vector<int> indeg(n, 0);                // how many things must come before me?
  for (auto& e : edges) { graph[e.first].push_back(e.second); indeg[e.second]++; }

  queue<int> q;
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
  vector<int> order;
  while (!q.empty()) {
    int node = q.front(); q.pop();
    order.push_back(node);
    for (int nxt : graph[node])           // "unlock" dependents
      if (--indeg[nxt] == 0) q.push(nxt);
  }
  if ((int)order.size() != n) return {};  // shorter => cycle
  return order;
}`,
    },
    relatedGateIds: ['graphs'],
    exampleProblemIds: ['course-schedule', 'course-schedule-ii', 'alien-dictionary', 'find-eventual-safe-states'],
  },

  // -------------------------------------------------------------------------
  // UNION-FIND
  // -------------------------------------------------------------------------
  {
    id: 'union-find',
    name: 'Union-Find (Disjoint Set)',
    tagline: 'Group things together and ask "are these two in the same group?" almost instantly.',
    triggers: [
      'number of connected components',
      'redundant connection / which edge creates a cycle',
      'are these two nodes connected',
      'accounts merge / group items that share something',
      'friend circles / provinces',
      'edges arrive one by one',
      'minimum spanning tree (Kruskal)',
    ],
    avoidWhen: [
      'you need the actual path between two nodes (BFS / DFS)',
      'the graph is directed (union-find ignores direction)',
      'edges get REMOVED over time (union-find only merges, it cannot split)',
    ],
    explanation: `Union-Find keeps track of groups. Every item starts alone in its own group. \`union(a, b)\` merges the groups of a and b. \`find(x)\` tells you which group x belongs to by returning the group's "boss" (root). Two items are connected exactly when they have the same boss.

## The idea

- Store \`parent[x]\`. If \`parent[x] == x\`, x is a boss.
- \`find(x)\`: follow parents until you reach a boss. While walking, point every node straight at the boss (path compression) so the next find is faster.
- \`union(a, b)\`: find both bosses. If they differ, make one the parent of the other. Attach the shorter tree under the taller one (union by rank) so trees stay flat.

With both tricks, each operation is effectively O(1).

## A tiny example

5 people (0..4). Friendships: (0,1), (2,3), (1,2), (0,3).

- Start: parent = [0, 1, 2, 3, 4], 5 groups.
- union(0,1): bosses 0 and 1 differ -> parent[1] = 0. 4 groups.
- union(2,3): parent[3] = 2. 3 groups.
- union(1,2): find(1) = 0, find(2) = 2, differ -> parent[2] = 0. 2 groups.
- union(0,3): find(0) = 0, find(3) -> 2 -> 0. Same boss! This edge is redundant. Still 2 groups.

Answer: 2 groups ({0,1,2,3} and {4}), and (0,3) is the edge that would create a cycle.

Slow way: after every edge, run a fresh DFS to count components: O(n * (V + E)). Union-Find does the whole thing in about O(E).

## Step by step

1. Create \`parent = [0, 1, ..., n-1]\` and \`rank = [0] * n\`, and \`count = n\`.
2. For each edge, call \`union\`. If it returns False, the edge joined two already-connected nodes.
3. \`count\` is the number of groups at any time.

## Where people go wrong

- Comparing \`parent[a] == parent[b]\` instead of \`find(a) == find(b)\`. Only the roots matter.
- Skipping path compression. The tree turns into a long chain and find becomes O(n).
- Mapping non-integer items (emails, strings) to indices before starting. Forgetting this makes the code messy.

## How to recognise it in an interview

"Connected components", "redundant connection", "merge accounts", "provinces", "edges added one by one" -> union-find.`,
    time: 'O(alpha(n)), effectively O(1), per find or union',
    space: 'O(n) for the parent and rank arrays',
    template: {
      python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))   # everyone starts as their own boss
        self.rank = [0] * n            # rough tree height, for balancing
        self.count = n                 # number of groups

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False               # already in the same group
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra            # attach the shorter tree under the taller
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        self.count -= 1
        return True`,
      javascript: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i); // own boss at first
    this.rank = new Array(n).fill(0);
    this.count = n;                                       // number of groups
  }
  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];       // path compression
      x = this.parent[x];
    }
    return x;
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                          // already together
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;                                 // short under tall
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    this.count--;
    return true;
  }
}`,
      java: `class UnionFind {
  int[] parent, rank;
  int count;                       // number of groups

  UnionFind(int n) {
    parent = new int[n]; rank = new int[n]; count = n;
    for (int i = 0; i < n; i++) parent[i] = i;   // own boss at first
  }

  int find(int x) {
    while (parent[x] != x) {
      parent[x] = parent[parent[x]];              // path compression
      x = parent[x];
    }
    return x;
  }

  boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;                   // already together
    if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;                              // short under tall
    if (rank[ra] == rank[rb]) rank[ra]++;
    count--;
    return true;
  }
}`,
      cpp: `#include <vector>
#include <utility>
using namespace std;

struct UnionFind {
  vector<int> parent, rnk;
  int count;                            // number of groups

  UnionFind(int n) : parent(n), rnk(n, 0), count(n) {
    for (int i = 0; i < n; i++) parent[i] = i;   // own boss at first
  }

  int find(int x) {
    while (parent[x] != x) {
      parent[x] = parent[parent[x]];              // path compression
      x = parent[x];
    }
    return x;
  }

  bool unite(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;                   // already together
    if (rnk[ra] < rnk[rb]) swap(ra, rb);
    parent[rb] = ra;                              // short under tall
    if (rnk[ra] == rnk[rb]) rnk[ra]++;
    count--;
    return true;
  }
};`,
    },
    relatedGateIds: ['graphs'],
    exampleProblemIds: ['redundant-connection', 'number-of-connected-components-in-an-undirected-graph', 'accounts-merge', 'number-of-provinces', 'graph-valid-tree'],
  },

  // -------------------------------------------------------------------------
  // SHORTEST PATH (DIJKSTRA)
  // -------------------------------------------------------------------------
  {
    id: 'shortest-path',
    name: 'Shortest Path (Dijkstra)',
    tagline: 'BFS with a heap: always expand the cheapest node next, so the first time you settle a node it is optimal.',
    triggers: [
      'minimum cost to reach',
      'network delay time',
      'cheapest flights',
      'weighted edges / travel time / cost per road',
      'shortest path with different costs',
      'path with minimum effort',
      'how long until the signal reaches every node',
    ],
    avoidWhen: [
      'all edges cost the same (plain BFS is simpler and faster)',
      'there are negative edge weights (use Bellman-Ford)',
      'you need shortest paths between ALL pairs on a small graph (Floyd-Warshall)',
    ],
    explanation: `BFS finds the fewest steps when every step costs 1. Dijkstra finds the cheapest route when steps have different costs (road lengths, ticket prices, latencies). It is BFS with one change: replace the queue with a min-heap keyed by "cost so far".

## The idea

- Keep \`dist[node]\` = cheapest known cost to reach node. Start with \`dist[start] = 0\`, everything else infinity.
- Heap holds \`(cost, node)\`. Pop the cheapest.
- For each neighbour, if \`cost + edge_weight\` beats its current dist, update it and push it.
- When you pop a node whose cost is worse than its recorded dist, it is a stale entry. Skip it.

Why it works: the cheapest unfinished node cannot be improved by going through a more expensive one (as long as no edge is negative).

## A tiny example

Edges (with weights): A-B 4, A-C 1, C-B 2, B-D 5, C-D 8. Start at A.

- dist = {A: 0}. Heap [(0, A)].
- Pop A. B: 0 + 4 = 4. C: 0 + 1 = 1. Heap [(1, C), (4, B)].
- Pop C. B: 1 + 2 = 3, better than 4, update. D: 1 + 8 = 9. Heap [(3, B), (4, B), (9, D)].
- Pop (3, B). D: 3 + 5 = 8, better than 9, update. Heap [(4, B), (8, D), (9, D)].
- Pop (4, B): stale (dist[B] is 3), skip. Pop (8, D): done. Skip (9, D).

Answer: A->B costs 3 (via C), A->D costs 8.

Slow way: try every path, exponential. Dijkstra: O((V + E) log V).

## Step by step

1. Build \`graph[u] = [(v, weight), ...]\`.
2. \`dist = {start: 0}\`, \`heap = [(0, start)]\`.
3. Pop; skip if stale; relax each neighbour; push improvements.
4. Read \`dist[target]\` at the end (or return early when target is popped).

## Where people go wrong

- Forgetting the stale-entry check. The answer is still correct, but the code gets slow.
- Putting the node first in the tuple so the heap sorts by node id instead of cost.
- Using Dijkstra with negative weights. It silently gives wrong answers.
- "Cheapest flights within k stops" needs a small twist (track stops too, or use Bellman-Ford with k rounds).

## How to recognise it in an interview

"Weighted", "cost", "time to travel", "minimum effort", "cheapest" together with "reach" -> Dijkstra.`,
    time: 'O((V + E) log V)',
    space: 'O(V + E) for the graph, distances and heap',
    template: {
      python: `import heapq


def dijkstra(graph, start):
    # graph[u] = list of (v, weight)
    dist = {start: 0}
    heap = [(0, start)]                 # (distance so far, node)
    while heap:
        d, node = heapq.heappop(heap)   # closest unfinished node
        if d > dist.get(node, float('inf')):
            continue                    # stale entry, skip it
        for nxt, w in graph[node]:
            nd = d + w
            if nd < dist.get(nxt, float('inf')):   # found a shorter way
                dist[nxt] = nd
                heapq.heappush(heap, (nd, nxt))
    return dist`,
      javascript: `// Uses the MinHeap class from the Top-K template.
function dijkstra(graph, start) {
  // graph[u] = list of [v, weight]
  const dist = new Map([[start, 0]]);
  const heap = new MinHeap((a, b) => a[0] - b[0]);   // [distance, node]
  heap.push([0, start]);
  while (heap.size()) {
    const [d, node] = heap.pop();                     // closest unfinished
    const known = dist.has(node) ? dist.get(node) : Infinity;
    if (d > known) continue;                          // stale entry
    for (const [nxt, w] of graph[node] || []) {
      const nd = d + w;
      const cur = dist.has(nxt) ? dist.get(nxt) : Infinity;
      if (nd < cur) {                                 // shorter way found
        dist.set(nxt, nd);
        heap.push([nd, nxt]);
      }
    }
  }
  return dist;
}`,
      java: `import java.util.*;

class Dijkstra {
  Map<Integer, Integer> run(Map<Integer, List<int[]>> graph, int start) {
    // graph.get(u) = list of {v, weight}
    Map<Integer, Integer> dist = new HashMap<>();
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    dist.put(start, 0);
    heap.add(new int[]{0, start});                    // {distance, node}
    while (!heap.isEmpty()) {
      int[] top = heap.poll();
      int d = top[0], node = top[1];                  // closest unfinished
      if (d > dist.getOrDefault(node, Integer.MAX_VALUE)) continue; // stale
      for (int[] e : graph.getOrDefault(node, List.of())) {
        int nxt = e[0], nd = d + e[1];
        if (nd < dist.getOrDefault(nxt, Integer.MAX_VALUE)) { // shorter
          dist.put(nxt, nd);
          heap.add(new int[]{nd, nxt});
        }
      }
    }
    return dist;
  }
}`,
      cpp: `#include <vector>
#include <queue>
#include <climits>
using namespace std;

vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {
  // graph[u] = list of (v, weight)
  int n = graph.size();
  vector<int> dist(n, INT_MAX);
  using P = pair<int, int>;                         // (distance, node)
  priority_queue<P, vector<P>, greater<P>> heap;
  dist[start] = 0;
  heap.push({0, start});
  while (!heap.empty()) {
    auto [d, node] = heap.top(); heap.pop();        // closest unfinished
    if (d > dist[node]) continue;                   // stale entry
    for (auto [nxt, w] : graph[node]) {
      int nd = d + w;
      if (nd < dist[nxt]) {                         // shorter way found
        dist[nxt] = nd;
        heap.push({nd, nxt});
      }
    }
  }
  return dist;
}`,
    },
    relatedGateIds: ['graphs', 'heaps'],
    exampleProblemIds: ['network-delay-time', 'cheapest-flights-within-k-stops', 'path-with-minimum-effort', 'swim-in-rising-water'],
  },

  // -------------------------------------------------------------------------
  // DP 1D
  // -------------------------------------------------------------------------
  {
    id: 'dp-1d',
    name: '1-D Dynamic Programming',
    tagline: 'The answer for n is built from the answers for n-1, n-2, ... so store them in a list and never recompute.',
    triggers: [
      'count the number of ways',
      'climbing stairs',
      'house robber / cannot pick two adjacent',
      'minimum cost to reach the end',
      'coin change / fewest coins',
      'decode ways',
      'answer for n depends on answers for smaller n',
    ],
    avoidWhen: [
      'the sub-problems never repeat (plain recursion or a greedy sweep is enough)',
      'the state needs two moving indices (that is dp-2d)',
      'you must list every actual combination, not count them (backtracking)',
    ],
    explanation: `Dynamic programming (DP) is a scary name for a simple habit: when a big question is made of smaller copies of the same question, write down the small answers so you never compute them twice. Let's walk the whole road, from recursion to a table, using Climbing Stairs.

## The problem

You climb 1 or 2 steps at a time. How many different ways can you reach step n?

## Step 1: plain recursion

To stand on step n you came from step n-1 or step n-2. So \`ways(n) = ways(n-1) + ways(n-2)\`, with \`ways(0) = ways(1) = 1\`. Correct, but \`ways(5)\` calls \`ways(3)\` twice, \`ways(2)\` three times, and it doubles every level: O(2^n). \`ways(40)\` takes minutes.

## Step 2: memo (remember answers)

Keep a dictionary. Before computing \`ways(n)\`, look it up. After computing, store it. Now every n is computed once: O(n). It is the same code plus two lines.

## Step 3: table (bottom-up)

Instead of starting big and going down, start small and go up. \`dp[0] = 1, dp[1] = 1\`, then for i from 2 to n: \`dp[i] = dp[i-1] + dp[i-2]\`. No recursion, no stack limit.

For n = 5: dp = [1, 1, 2, 3, 5, 8]. Answer: 8.

## Step 4: shrink

\`dp[i]\` only needs the two values before it. Keep two variables instead of a list: O(1) space.

## How to apply it to a new problem

1. Write the state in plain words: "dp[i] = best answer using the first i items".
2. Write the base cases (usually dp[0], dp[1]).
3. Write the recurrence: how dp[i] comes from earlier entries. This is where the "choices" live.
4. Fill from small to big.
5. Read the answer (dp[n], or the max over all entries).

House Robber: \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\` (skip house i, or rob it and skip i-1). Coin Change: \`dp[amount] = 1 + min(dp[amount - coin] for each coin)\`.

## Where people go wrong

- Jumping to code before writing the state in words.
- Off-by-one base cases: decide clearly whether dp[0] means "zero items" or "first item".
- Using DP where sub-problems never repeat. Then it is just recursion with extra memory.

## How to recognise it in an interview

"Number of ways", "minimum cost to reach", "cannot pick adjacent", "answer for n uses n-1 and n-2" -> 1-D DP.`,
    time: 'O(n) or O(n * choices)',
    space: 'O(n) for the table, often O(1) with rolling variables',
    template: {
      python: `from functools import lru_cache


# STEP 1: plain recursion (slow, exponential)
def ways_slow(n):
    if n <= 1:
        return 1
    return ways_slow(n - 1) + ways_slow(n - 2)


# STEP 2: memo - same code, remember answers
@lru_cache(maxsize=None)
def ways_memo(n):
    if n <= 1:
        return 1
    return ways_memo(n - 1) + ways_memo(n - 2)


# STEP 3: table - fill from small to big, no recursion
def ways_table(n):
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1                      # base cases
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]      # the recurrence
    return dp[n]


# STEP 4: only the last two values matter -> O(1) space
def ways_rolling(n):
    a, b = 1, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
      javascript: `// STEP 1: plain recursion (slow, exponential)
function waysSlow(n) {
  if (n <= 1) return 1;
  return waysSlow(n - 1) + waysSlow(n - 2);
}

// STEP 2: memo - same code, remember answers
function waysMemo(n, memo = new Map()) {
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n);
  const ans = waysMemo(n - 1, memo) + waysMemo(n - 2, memo);
  memo.set(n, ans);
  return ans;
}

// STEP 3: table - fill from small to big, no recursion
function waysTable(n) {
  const dp = new Array(n + 2).fill(0);
  dp[0] = dp[1] = 1;                          // base cases
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2]; // recurrence
  return dp[n];
}

// STEP 4: only the last two values matter -> O(1) space
function waysRolling(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) { const c = a + b; a = b; b = c; }
  return b;
}`,
      java: `import java.util.*;

class DP1D {
  // STEP 1: plain recursion (slow, exponential)
  int waysSlow(int n) {
    if (n <= 1) return 1;
    return waysSlow(n - 1) + waysSlow(n - 2);
  }

  // STEP 2: memo - same code, remember answers
  Map<Integer, Integer> memo = new HashMap<>();
  int waysMemo(int n) {
    if (n <= 1) return 1;
    if (memo.containsKey(n)) return memo.get(n);
    int ans = waysMemo(n - 1) + waysMemo(n - 2);
    memo.put(n, ans);
    return ans;
  }

  // STEP 3: table - fill from small to big, no recursion
  int waysTable(int n) {
    int[] dp = new int[n + 2];
    dp[0] = dp[1] = 1;                            // base cases
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2]; // recurrence
    return dp[n];
  }

  // STEP 4: only the last two values matter -> O(1) space
  int waysRolling(int n) {
    int a = 1, b = 1;
    for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
  }
}`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

// STEP 1: plain recursion (slow, exponential)
long long waysSlow(int n) {
  if (n <= 1) return 1;
  return waysSlow(n - 1) + waysSlow(n - 2);
}

// STEP 2: memo - same code, remember answers
unordered_map<int, long long> memo;
long long waysMemo(int n) {
  if (n <= 1) return 1;
  if (memo.count(n)) return memo[n];
  return memo[n] = waysMemo(n - 1) + waysMemo(n - 2);
}

// STEP 3: table - fill from small to big, no recursion
long long waysTable(int n) {
  vector<long long> dp(n + 2, 0);
  dp[0] = dp[1] = 1;                              // base cases
  for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2]; // recurrence
  return dp[n];
}

// STEP 4: only the last two values matter -> O(1) space
long long waysRolling(int n) {
  long long a = 1, b = 1;
  for (int i = 2; i <= n; i++) { long long c = a + b; a = b; b = c; }
  return b;
}`,
    },
    relatedGateIds: ['dynamic-programming', 'recursion-backtracking'],
    exampleProblemIds: ['climbing-stairs', 'house-robber', 'coin-change', 'min-cost-climbing-stairs', 'decode-ways', 'word-break'],
  },

  // -------------------------------------------------------------------------
  // DP 2D
  // -------------------------------------------------------------------------
  {
    id: 'dp-2d',
    name: '2-D Dynamic Programming (grids)',
    tagline: 'When "where am I" needs two numbers, the DP table becomes a grid; each cell looks up and left.',
    triggers: [
      'unique paths in a grid',
      'minimum path sum',
      'move only right or down',
      'count paths with obstacles',
      'two indices / two strings',
      'edit distance',
      'answer for (i, j) depends on (i-1, j) and (i, j-1)',
    ],
    avoidWhen: [
      'one index fully describes the state (dp-1d is simpler)',
      'you can move in all four directions (that is a graph: BFS or Dijkstra, not DP)',
      'the grid is huge and there is no overlap between sub-problems',
    ],
    explanation: `In 1-D DP one number ("which step am I on?") describes the state. Sometimes you need two: a row and a column, or a position in string A and a position in string B. Then the table becomes a grid. The classic case is walking through a grid moving only right or down.

## The idea

\`dp[r][c]\` = the answer for cell (r, c). Because you can only move right or down, you must have arrived from ABOVE (r-1, c) or from the LEFT (r, c-1). So each cell combines those two neighbours. The first row and first column are base cases: there is only one way to reach them.

## A tiny example: Unique Paths, 3 x 3 grid

- Row 0: [1, 1, 1]. Column 0: all 1s.
- dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2
- dp[1][2] = dp[0][2] + dp[1][1] = 1 + 2 = 3
- dp[2][1] = dp[1][1] + dp[2][0] = 2 + 1 = 3
- dp[2][2] = dp[1][2] + dp[2][1] = 3 + 3 = 6. Answer: 6.

Minimum Path Sum has the same shape: \`dp[r][c] = grid[r][c] + min(up, left)\`.

## From recursion to table (gently)

- Recursion: \`paths(r, c) = paths(r-1, c) + paths(r, c-1)\`. Exponential, because (1,1) is reached many ways.
- Memo: same function plus a dictionary keyed by (r, c). O(rows * cols).
- Table: two nested loops, no recursion at all.
- Space trick: a cell only needs the previous row, so keep one row and overwrite it.

## Step by step

1. Say the state out loud: "dp[i][j] = answer for the first i of one thing and the first j of the other".
2. Fill the base cases: row 0 and column 0.
3. Write the recurrence using up, left (and sometimes the diagonal).
4. Fill row by row, left to right.
5. The answer is usually in the bottom-right corner.

## Where people go wrong

- Using a DP grid when moves go in every direction. There is no "earlier" cell then, so DP does not apply.
- Obstacles: set that cell's dp to 0 and keep filling. Do not skip the whole row.
- In Python \`[[0] * cols] * rows\` makes rows that share memory. Use \`[[0] * cols for _ in range(rows)]\`.

## How to recognise it in an interview

"Grid", "only right or down", "two strings", "two indices moving together" -> 2-D DP.`,
    time: 'O(rows * cols)',
    space: 'O(rows * cols), or O(cols) with a single rolling row',
    template: {
      python: `def grid_dp(grid):
    rows, cols = len(grid), len(grid[0])
    # dp[r][c] = best answer for reaching cell (r, c)
    dp = [[0] * cols for _ in range(rows)]

    # base cases: first row and first column have only one way in
    dp[0][0] = grid[0][0]
    for c in range(1, cols):
        dp[0][c] = dp[0][c - 1] + grid[0][c]
    for r in range(1, rows):
        dp[r][0] = dp[r - 1][0] + grid[r][0]

    # fill the rest: each cell looks UP and LEFT
    for r in range(1, rows):
        for c in range(1, cols):
            dp[r][c] = grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])
            # for "count paths" use + instead of min and drop grid[r][c]
    return dp[rows - 1][cols - 1]`,
      javascript: `function gridDp(grid) {
  const rows = grid.length, cols = grid[0].length;
  // dp[r][c] = best answer for reaching cell (r, c)
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

  // base cases: first row and first column have only one way in
  dp[0][0] = grid[0][0];
  for (let c = 1; c < cols; c++) dp[0][c] = dp[0][c - 1] + grid[0][c];
  for (let r = 1; r < rows; r++) dp[r][0] = dp[r - 1][0] + grid[r][0];

  // fill the rest: each cell looks UP and LEFT
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      dp[r][c] = grid[r][c] + Math.min(dp[r - 1][c], dp[r][c - 1]);
      // for "count paths" use + instead of min and drop grid[r][c]
    }
  }
  return dp[rows - 1][cols - 1];
}`,
      java: `class DP2D {
  int gridDp(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    // dp[r][c] = best answer for reaching cell (r, c)
    int[][] dp = new int[rows][cols];

    // base cases: first row and first column have only one way in
    dp[0][0] = grid[0][0];
    for (int c = 1; c < cols; c++) dp[0][c] = dp[0][c - 1] + grid[0][c];
    for (int r = 1; r < rows; r++) dp[r][0] = dp[r - 1][0] + grid[r][0];

    // fill the rest: each cell looks UP and LEFT
    for (int r = 1; r < rows; r++) {
      for (int c = 1; c < cols; c++) {
        dp[r][c] = grid[r][c] + Math.min(dp[r - 1][c], dp[r][c - 1]);
        // for "count paths" use + instead of min and drop grid[r][c]
      }
    }
    return dp[rows - 1][cols - 1];
  }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int gridDp(vector<vector<int>>& grid) {
  int rows = grid.size(), cols = grid[0].size();
  // dp[r][c] = best answer for reaching cell (r, c)
  vector<vector<int>> dp(rows, vector<int>(cols, 0));

  // base cases: first row and first column have only one way in
  dp[0][0] = grid[0][0];
  for (int c = 1; c < cols; c++) dp[0][c] = dp[0][c - 1] + grid[0][c];
  for (int r = 1; r < rows; r++) dp[r][0] = dp[r - 1][0] + grid[r][0];

  // fill the rest: each cell looks UP and LEFT
  for (int r = 1; r < rows; r++) {
    for (int c = 1; c < cols; c++) {
      dp[r][c] = grid[r][c] + min(dp[r - 1][c], dp[r][c - 1]);
      // for "count paths" use + instead of min and drop grid[r][c]
    }
  }
  return dp[rows - 1][cols - 1];
}`,
    },
    relatedGateIds: ['dynamic-programming'],
    exampleProblemIds: ['unique-paths', 'minimum-path-sum', 'unique-paths-ii', 'edit-distance', 'longest-common-subsequence'],
  },

  // -------------------------------------------------------------------------
  // KNAPSACK
  // -------------------------------------------------------------------------
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    tagline: 'For every item ask "take it or leave it?" and keep a table indexed by remaining capacity.',
    triggers: [
      'choose items with capacity',
      'partition into two equal sums',
      'subset that sums to a target',
      'each item used at most once',
      'maximise value under a weight limit',
      'target sum with + and - signs',
      'unlimited coins / unbounded',
    ],
    avoidWhen: [
      'items can be taken in fractions (sort by value per weight and be greedy)',
      'the capacity is enormous (like 10^9) so a table will not fit',
      'the ORDER of the chosen items matters (that is a different DP)',
    ],
    explanation: `You have a bag with a weight limit and a pile of items, each with a weight and a value. Pick items to maximise value without breaking the bag. Each item can be used once. The core question, "take it or leave it?", shows up in disguise as partition, subset sum and target sum.

## Recursion first

\`best(i, cap)\` = best value using items i.. with capacity cap. Two choices: skip item i, or (if it fits) take it and lose its weight. \`best(i, cap) = max(best(i+1, cap), value[i] + best(i+1, cap - weight[i]))\`. Exponential: 2^n.

## Memo

Key the cache by \`(i, cap)\`. There are only n * capacity different pairs, so that is the running time.

## Table (the version to memorise)

\`dp[c]\` = best value with capacity c using the items seen so far. For each item, walk c from capacity DOWN to weight: \`dp[c] = max(dp[c], dp[c - w] + v)\`.

## A tiny example

weights [1, 3, 4], values [15, 20, 30], capacity 4.

- Start: dp = [0, 0, 0, 0, 0]
- Item (w=1, v=15): every c >= 1 becomes 15 -> [0, 15, 15, 15, 15]
- Item (w=3, v=20): c=4: max(15, dp[1] + 20 = 35) = 35. c=3: max(15, dp[0] + 20) = 20 -> [0, 15, 15, 20, 35]
- Item (w=4, v=30): c=4: max(35, dp[0] + 30) = 35 -> unchanged.

Answer: 35 (items 1 and 2).

## Why right-to-left?

If you walked left to right, \`dp[c - w]\` would already include the current item, so you would take it twice. Right-to-left means "each item once". Left-to-right is the UNBOUNDED version (coins you may reuse), which is a feature, not a bug.

## The disguises

- Partition Equal Subset Sum: target = total / 2, \`dp[s]\` is True/False. Odd total -> False immediately.
- Target Sum with + and - : count subsets with sum (total + target) / 2.
- Coin Change (fewest coins): unbounded, use min instead of max.

## Where people go wrong

- Wrong loop direction (the number one bug).
- Forgetting \`dp[0] = True\` for subset sum. Sum 0 is always reachable by taking nothing.
- Treating a "count the ways" problem as max/min or the other way around.

## How to recognise it in an interview

"Capacity", "each at most once", "subset that sums to", "split into two equal halves" -> knapsack.`,
    time: 'O(n * capacity)',
    space: 'O(capacity) with the 1-D table',
    template: {
      python: `# 0/1 knapsack: each item can be used AT MOST once.
def knapsack(weights, values, capacity):
    # dp[c] = best value using capacity c (with the items seen so far)
    dp = [0] * (capacity + 1)
    for w, v in zip(weights, values):
        # go RIGHT-TO-LEFT so each item is counted only once
        for c in range(capacity, w - 1, -1):
            dp[c] = max(dp[c], dp[c - w] + v)   # skip item vs take item
    return dp[capacity]


# subset sum / partition: same table, but store True/False
def can_reach(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True                                # sum 0 is always possible
    for x in nums:
        for s in range(target, x - 1, -1):
            dp[s] = dp[s] or dp[s - x]
    return dp[target]


# unbounded (coins reused): loop LEFT-TO-RIGHT instead
# for c in range(w, capacity + 1): dp[c] = max(dp[c], dp[c - w] + v)`,
      javascript: `// 0/1 knapsack: each item can be used AT MOST once.
function knapsack(weights, values, capacity) {
  // dp[c] = best value using capacity c (with the items seen so far)
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i], v = values[i];
    // go RIGHT-TO-LEFT so each item is counted only once
    for (let c = capacity; c >= w; c--) {
      dp[c] = Math.max(dp[c], dp[c - w] + v);   // skip vs take
    }
  }
  return dp[capacity];
}

// subset sum / partition: same table, but store true/false
function canReach(nums, target) {
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;                                  // sum 0 always possible
  for (const x of nums)
    for (let s = target; s >= x; s--) dp[s] = dp[s] || dp[s - x];
  return dp[target];
}
// unbounded (reuse allowed): loop LEFT-TO-RIGHT: for (c = w; c <= capacity; c++)`,
      java: `class Knapsack {
  // 0/1 knapsack: each item can be used AT MOST once.
  int knapsack(int[] weights, int[] values, int capacity) {
    // dp[c] = best value using capacity c (with the items seen so far)
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
      int w = weights[i], v = values[i];
      // go RIGHT-TO-LEFT so each item is counted only once
      for (int c = capacity; c >= w; c--)
        dp[c] = Math.max(dp[c], dp[c - w] + v);   // skip vs take
    }
    return dp[capacity];
  }

  // subset sum / partition: same table, but store true/false
  boolean canReach(int[] nums, int target) {
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;                                  // sum 0 always possible
    for (int x : nums)
      for (int s = target; s >= x; s--) dp[s] = dp[s] || dp[s - x];
    return dp[target];
  }
  // unbounded (reuse allowed): loop LEFT-TO-RIGHT: for (c = w; c <= capacity; c++)
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

// 0/1 knapsack: each item can be used AT MOST once.
int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
  // dp[c] = best value using capacity c (with the items seen so far)
  vector<int> dp(capacity + 1, 0);
  for (int i = 0; i < (int)weights.size(); i++) {
    int w = weights[i], v = values[i];
    // go RIGHT-TO-LEFT so each item is counted only once
    for (int c = capacity; c >= w; c--)
      dp[c] = max(dp[c], dp[c - w] + v);         // skip vs take
  }
  return dp[capacity];
}

// subset sum / partition: same table, but store true/false
bool canReach(vector<int>& nums, int target) {
  vector<bool> dp(target + 1, false);
  dp[0] = true;                                  // sum 0 always possible
  for (int x : nums)
    for (int s = target; s >= x; s--) dp[s] = dp[s] || dp[s - x];
  return dp[target];
}
// unbounded (reuse allowed): loop LEFT-TO-RIGHT: for (c = w; c <= capacity; c++)`,
    },
    relatedGateIds: ['dynamic-programming'],
    exampleProblemIds: ['partition-equal-subset-sum', 'coin-change', 'target-sum', 'coin-change-ii', 'last-stone-weight-ii'],
  },

  // -------------------------------------------------------------------------
  // LCS / LIS
  // -------------------------------------------------------------------------
  {
    id: 'lcs-lis',
    name: 'LCS and LIS (subsequence DP)',
    tagline: 'Longest Common Subsequence of two strings, Longest Increasing Subsequence of one array: both from a "match or skip" choice.',
    triggers: [
      'two strings, longest common',
      'longest increasing subsequence',
      'subsequence (not substring)',
      'minimum deletions / insertions to make equal',
      'edit distance / operations to convert',
      'longest chain / envelopes / nested boxes',
      'shortest common supersequence',
    ],
    avoidWhen: [
      'you need a SUBSTRING (contiguous); the table looks similar but the rule differs',
      'you only need "is A a subsequence of B?" (two pointers, no table)',
      'the input is tiny and brute force is fine',
    ],
    explanation: `A subsequence keeps some elements, deletes the rest, and never changes the order. "ace" is a subsequence of "abcde". Two classic questions live here: LCS (the longest thing two strings share) and LIS (the longest increasing run hidden inside one array). Both come from one small decision: match, or skip.

## LCS (two strings)

State: \`dp[i][j]\` = LCS length of the first i characters of a and the first j characters of b. Row 0 and column 0 are 0 (empty string).

- If \`a[i-1] == b[j-1]\`: the characters match, extend the diagonal: \`dp[i][j] = dp[i-1][j-1] + 1\`.
- Else: skip one character from either side: \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\`.

Tiny example: a = "abc", b = "ac".

\`\`\`
      ""  a  c
  ""   0  0  0
  a    0  1  1
  b    0  1  1
  c    0  1  2
\`\`\`

Answer: 2 ("ac"). The recursive version (try match / skip left / skip right) is exponential. The table is O(m * n) because every cell is filled once.

## LIS (one array)

Simple table: \`dp[i]\` = length of the longest increasing run ENDING at i. \`dp[i] = 1 + max(dp[j])\` over all j < i with \`nums[j] < nums[i]\`. O(n^2), and fine in most interviews.

Faster: keep a list \`tails\`, where \`tails[k]\` is the smallest possible last value of an increasing run of length k + 1. For each x, binary-search the first tail >= x and replace it (or append if none). The length of \`tails\` is the answer. O(n log n).

Example [3, 1, 4, 1, 5]: tails goes [3] -> [1] -> [1, 4] -> [1, 4] -> [1, 4, 5]. Answer: 3.

## Relatives you get for free

- Edit Distance: same grid, three choices (insert, delete, replace), min instead of max.
- Minimum deletions to make two strings equal: m + n - 2 * LCS.
- Longest common SUBSTRING: same table but reset to 0 on a mismatch.

## Where people go wrong

- Off-by-one: the table has size (m + 1) x (n + 1) and you compare \`a[i-1]\`, not \`a[i]\`.
- Mixing up substring and subsequence.
- Thinking \`tails\` is the actual LIS. It only gives the length.

## How to recognise it in an interview

"Two strings" plus "longest common", "subsequence", "increasing", "chain of pairs", "delete to make equal" -> LCS / LIS.`,
    time: 'LCS: O(m * n). LIS: O(n^2) simple, O(n log n) with binary search',
    space: 'LCS: O(m * n), or O(n) with two rows. LIS: O(n)',
    template: {
      python: `from bisect import bisect_left


# LCS: two strings -> length of longest common subsequence
def lcs(a, b):
    m, n = len(a), len(b)
    # dp[i][j] = LCS of a[:i] and b[:j]  (row/col 0 = empty string)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1      # match: extend the diagonal
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  # skip one char
    return dp[m][n]


# LIS: one array -> length of longest strictly increasing subsequence
def lis(nums):
    tails = []   # tails[k] = smallest tail of an increasing run of length k+1
    for x in nums:
        i = bisect_left(tails, x)     # first tail >= x
        if i == len(tails):
            tails.append(x)           # x extends the longest run
        else:
            tails[i] = x              # x gives a better (smaller) tail
    return len(tails)`,
      javascript: `// LCS: two strings -> length of longest common subsequence
function lcs(a, b) {
  const m = a.length, n = b.length;
  // dp[i][j] = LCS of a[:i] and b[:j]  (row/col 0 = empty string)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1; // match
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);       // skip one
    }
  }
  return dp[m][n];
}

// LIS: one array -> length of longest strictly increasing subsequence
function lis(nums) {
  const tails = []; // tails[k] = smallest tail of an increasing run of length k+1
  for (const x of nums) {
    let lo = 0, hi = tails.length;             // binary search: first tail >= x
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1; else hi = mid;
    }
    if (lo === tails.length) tails.push(x);    // extends the longest run
    else tails[lo] = x;                        // better (smaller) tail
  }
  return tails.length;
}`,
      java: `import java.util.*;

class LcsLis {
  // LCS: two strings -> length of longest common subsequence
  int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];    // dp[i][j] = LCS of a[:i], b[:j]
    for (int i = 1; i <= m; i++) {
      for (int j = 1; j <= n; j++) {
        if (a.charAt(i - 1) == b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);   // skip one
      }
    }
    return dp[m][n];
  }

  // LIS: one array -> length of longest strictly increasing subsequence
  int lis(int[] nums) {
    List<Integer> tails = new ArrayList<>(); // smallest tail per length
    for (int x : nums) {
      int lo = 0, hi = tails.size();          // first tail >= x
      while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (tails.get(mid) < x) lo = mid + 1; else hi = mid;
      }
      if (lo == tails.size()) tails.add(x);   // extends the longest run
      else tails.set(lo, x);                  // better (smaller) tail
    }
    return tails.size();
  }
}`,
      cpp: `#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// LCS: two strings -> length of longest common subsequence
int lcs(const string& a, const string& b) {
  int m = a.size(), n = b.size();
  vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0)); // dp[i][j] = LCS of a[:i], b[:j]
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;   // match
      else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);            // skip one
    }
  }
  return dp[m][n];
}

// LIS: one array -> length of longest strictly increasing subsequence
int lis(vector<int>& nums) {
  vector<int> tails;                          // smallest tail per length
  for (int x : nums) {
    auto it = lower_bound(tails.begin(), tails.end(), x); // first tail >= x
    if (it == tails.end()) tails.push_back(x);            // extends longest run
    else *it = x;                                         // better (smaller) tail
  }
  return tails.size();
}`,
    },
    relatedGateIds: ['dynamic-programming'],
    exampleProblemIds: ['longest-common-subsequence', 'longest-increasing-subsequence', 'edit-distance', 'delete-operation-for-two-strings', 'russian-doll-envelopes'],
  },

  // -------------------------------------------------------------------------
  // GREEDY
  // -------------------------------------------------------------------------
  {
    id: 'greedy',
    name: 'Greedy',
    tagline: 'Take the choice that looks best right now, commit, and never look back.',
    triggers: [
      'minimum number of ... needed',
      'can you reach the end',
      'jump game',
      'gas station / complete the circuit',
      'maximum number of events you can attend',
      'assign cookies / match the smallest that fits',
      'pick as many as possible',
    ],
    avoidWhen: [
      'the problem asks for the NUMBER OF WAYS (that is DP)',
      'a local best choice can block a better later choice (check with a 3-item counterexample)',
      'coin change with odd coin values (coins 1, 3, 4 for amount 6 breaks greedy)',
    ],
    explanation: `Greedy means: at every step take the choice that looks best right now, and never go back. It is the fastest kind of algorithm and also the most dangerous. It only works when a local best choice never blocks a better global one. So the pattern is half code, half "why is this safe?".

## The idea

- Usually sort first so "best right now" is easy to see.
- Sweep once, keeping a tiny bit of state: the last thing you picked, the farthest you can reach, the running total.
- Commit and move on. No backtracking, no table.

## A tiny example: Jump Game

nums = [2, 3, 1, 1, 4]. Each value is the maximum jump from that index. Can you reach the last index?

- Keep \`farthest = 0\`.
- i = 0: 0 <= farthest, farthest = max(0, 0 + 2) = 2.
- i = 1: farthest = max(2, 1 + 3) = 4.
- i = 2, 3: nothing better. i = 4: 4 <= farthest. True.

With [3, 2, 1, 0, 4]: farthest gets stuck at 3, and at i = 4 we find i > farthest. False.

Slow way: try every combination of jumps (exponential), or DP in O(n^2). Greedy: one pass, O(n).

## Another one: Gas Station

If you start at station i and run dry at station j, then no start between i and j can work either (they arrive at j with even less gas). So reset the start to j + 1 and keep going. One pass gives the answer.

## Step by step

1. Ask: "what is the obviously best choice at each step?" (earliest ending, cheapest, farthest reach, smallest that fits).
2. Try to break it with a tiny counterexample of 3 or 4 items. If you cannot, it is probably greedy.
3. Sort if needed, sweep once, keep minimal state.
4. Be ready to say the one-line reason it is safe.

## Where people go wrong

- Coin change with coins [1, 3, 4] for amount 6: greedy takes 4 + 1 + 1 (3 coins), but 3 + 3 (2 coins) is better. That is DP territory.
- Sorting by the wrong key. For intervals: sort by END to keep the most, by START to merge.
- Skipping the counterexample check and confidently coding a wrong solution.

## How to recognise it in an interview

"Minimum number needed", "can you reach", "maximum you can attend", "as many as possible" with a natural "best" choice -> greedy.`,
    time: 'O(n), or O(n log n) when you sort first',
    space: 'O(1)',
    template: {
      python: `# Greedy skeleton: sort (if needed), then sweep and commit to the local best.
def greedy(items):
    items.sort(key=lambda x: x[1])   # 1. order so the "best" choice comes first
    result = 0
    last = float('-inf')             # 2. remember the state of what we chose
    for start, end in items:
        if start >= last:            # 3. can we take it without conflict?
            result += 1              #    yes: commit, never look back
            last = end
    return result


# Example: Jump Game - "can I reach the last index?"
def can_jump(nums):
    farthest = 0                     # farthest index reachable so far
    for i, jump in enumerate(nums):
        if i > farthest:
            return False             # we got stuck before reaching i
        farthest = max(farthest, i + jump)
    return True`,
      javascript: `// Greedy skeleton: sort (if needed), then sweep and commit to the local best.
function greedy(items) {
  items.sort((a, b) => a[1] - b[1]); // 1. order so the "best" choice comes first
  let result = 0;
  let last = -Infinity;              // 2. remember the state of what we chose
  for (const [start, end] of items) {
    if (start >= last) {             // 3. can we take it without conflict?
      result++;                      //    yes: commit, never look back
      last = end;
    }
  }
  return result;
}

// Example: Jump Game - "can I reach the last index?"
function canJump(nums) {
  let farthest = 0;                  // farthest index reachable so far
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;  // we got stuck before reaching i
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}`,
      java: `import java.util.*;

class Greedy {
  // Greedy skeleton: sort (if needed), then sweep and commit to the local best.
  int greedy(int[][] items) {
    Arrays.sort(items, (a, b) -> a[1] - b[1]); // 1. best choice comes first
    int result = 0;
    int last = Integer.MIN_VALUE;              // 2. state of what we chose
    for (int[] it : items) {
      if (it[0] >= last) {                     // 3. no conflict?
        result++;                              //    commit, never look back
        last = it[1];
      }
    }
    return result;
  }

  // Example: Jump Game - "can I reach the last index?"
  boolean canJump(int[] nums) {
    int farthest = 0;                          // farthest index reachable so far
    for (int i = 0; i < nums.length; i++) {
      if (i > farthest) return false;          // stuck before reaching i
      farthest = Math.max(farthest, i + nums[i]);
    }
    return true;
  }
}`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

// Greedy skeleton: sort (if needed), then sweep and commit to the local best.
int greedy(vector<pair<int, int>> items) {
  sort(items.begin(), items.end(),               // 1. best choice comes first
       [](const pair<int, int>& a, const pair<int, int>& b) { return a.second < b.second; });
  int result = 0;
  int last = INT_MIN;                            // 2. state of what we chose
  for (auto& it : items) {
    if (it.first >= last) {                      // 3. no conflict?
      result++;                                  //    commit, never look back
      last = it.second;
    }
  }
  return result;
}

// Example: Jump Game - "can I reach the last index?"
bool canJump(vector<int>& nums) {
  int farthest = 0;                              // farthest index reachable so far
  for (int i = 0; i < (int)nums.size(); i++) {
    if (i > farthest) return false;              // stuck before reaching i
    farthest = max(farthest, i + nums[i]);
  }
  return true;
}`,
    },
    relatedGateIds: ['greedy-bits-tries', 'arrays-strings'],
    exampleProblemIds: ['jump-game', 'gas-station', 'jump-game-ii', 'assign-cookies', 'hand-of-straights', 'partition-labels'],
  },

  // -------------------------------------------------------------------------
  // MERGE INTERVALS
  // -------------------------------------------------------------------------
  {
    id: 'merge-intervals',
    name: 'Merge Intervals',
    tagline: 'Sort by start, sweep once, and compare each interval only with the last one you kept.',
    triggers: [
      'merge overlapping intervals',
      'insert an interval',
      'meeting rooms / can attend all meetings',
      'minimum intervals to remove',
      'start and end times',
      'ranges that overlap',
      'free time between busy slots',
    ],
    avoidWhen: [
      'the intervals are already sorted and disjoint (a plain scan is enough)',
      'you need "how many overlap at each moment" (use a sweep line with +1 / -1 events, or a heap of end times)',
      'there are only two intervals (a single if statement will do)',
    ],
    explanation: `An interval is a start and an end: a meeting from 9 to 10. Interval problems ask you to merge overlapping ones, insert a new one, or find the ones that clash. Almost all of them fall to one move: sort by start, then sweep and compare each interval with the last one you kept.

## The idea

After sorting by start, an interval can only overlap the interval right before it (or the merged blob that interval belongs to). So keep a \`merged\` list and look only at \`merged[-1]\`.

- If \`start <= merged[-1].end\`: they overlap, extend: \`merged[-1].end = max(merged[-1].end, end)\`.
- Else: no overlap, append a new interval.

## A tiny example

[[1, 3], [8, 10], [2, 6], [15, 18]]

- Sort by start: [1, 3], [2, 6], [8, 10], [15, 18].
- merged = [[1, 3]].
- [2, 6]: 2 <= 3, overlap. Extend to [1, 6].
- [8, 10]: 8 > 6, append.
- [15, 18]: 15 > 10, append.

Answer: [[1, 6], [8, 10], [15, 18]].

Slow way: compare every pair and merge repeatedly until nothing changes, O(n^2) or worse. Sort + sweep: O(n log n), and the sweep itself is a single pass.

## The common variations

- Insert Interval: add the new one to the list and merge, or do a one-pass "left part, overlapping part, right part" split.
- Meeting Rooms I: sort by start; if any start is before the previous end, you cannot attend all.
- Non-overlapping Intervals (minimum removals): sort by END and greedily keep the interval that ends first.
- Meeting Rooms II (rooms needed): min-heap of end times, or a sweep with +1 at starts and -1 at ends.

## Step by step

1. Sort. By start for merging, by end for "keep the most".
2. Walk once. Compare with the last kept interval only.
3. Extend or append.
4. Use max when extending: an earlier interval may end later than the current one.

## Where people go wrong

- Forgetting the max, so [1, 10] followed by [2, 3] shrinks to [1, 3].
- Touching intervals: does [1, 3] overlap [3, 5]? Usually yes (\`<=\`). Read the statement.
- Mutating the input when the problem needs the original later.

## How to recognise it in an interview

"Intervals", "meetings", "start and end times", "overlap", "merge", "free time" -> merge intervals.`,
    time: 'O(n log n) for the sort, then O(n) for the sweep',
    space: 'O(n) for the output list',
    template: {
      python: `def merge_intervals(intervals):
    intervals.sort(key=lambda iv: iv[0])     # 1. sort by START
    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:   # 2. overlaps the last one?
            merged[-1][1] = max(merged[-1][1], end)   # extend it
        else:
            merged.append([start, end])         # 3. no overlap: start new
    return merged


# variation: minimum removals so that nothing overlaps (sort by END)
def erase_overlap(intervals):
    intervals.sort(key=lambda iv: iv[1])
    removed, last_end = 0, float('-inf')
    for start, end in intervals:
        if start >= last_end:
            last_end = end               # keep it
        else:
            removed += 1                 # drop it (it ends later, so worse)
    return removed`,
      javascript: `function mergeIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);            // 1. sort by START
  const merged = [];
  for (const [start, end] of intervals) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {                  // 2. overlaps the last?
      last[1] = Math.max(last[1], end);              //    extend it
    } else {
      merged.push([start, end]);                     // 3. no overlap: new one
    }
  }
  return merged;
}

// variation: minimum removals so that nothing overlaps (sort by END)
function eraseOverlap(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0, lastEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= lastEnd) lastEnd = end;             // keep it
    else removed++;                                  // drop it
  }
  return removed;
}`,
      java: `import java.util.*;

class Intervals {
  int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);   // 1. sort by START
    List<int[]> merged = new ArrayList<>();
    for (int[] iv : intervals) {
      if (!merged.isEmpty() && iv[0] <= merged.get(merged.size() - 1)[1]) {
        int[] last = merged.get(merged.size() - 1);  // 2. overlaps: extend
        last[1] = Math.max(last[1], iv[1]);
      } else {
        merged.add(new int[]{iv[0], iv[1]});         // 3. no overlap: new one
      }
    }
    return merged.toArray(new int[0][]);
  }

  // variation: minimum removals so that nothing overlaps (sort by END)
  int eraseOverlap(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int removed = 0, lastEnd = Integer.MIN_VALUE;
    for (int[] iv : intervals) {
      if (iv[0] >= lastEnd) lastEnd = iv[1];         // keep it
      else removed++;                                // drop it
    }
    return removed;
  }
}`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
  sort(intervals.begin(), intervals.end());          // 1. sort by START
  vector<vector<int>> merged;
  for (auto& iv : intervals) {
    if (!merged.empty() && iv[0] <= merged.back()[1]) // 2. overlaps: extend
      merged.back()[1] = max(merged.back()[1], iv[1]);
    else
      merged.push_back(iv);                          // 3. no overlap: new one
  }
  return merged;
}

// variation: minimum removals so that nothing overlaps (sort by END)
int eraseOverlap(vector<vector<int>>& intervals) {
  sort(intervals.begin(), intervals.end(),
       [](const vector<int>& a, const vector<int>& b) { return a[1] < b[1]; });
  int removed = 0, lastEnd = INT_MIN;
  for (auto& iv : intervals) {
    if (iv[0] >= lastEnd) lastEnd = iv[1];           // keep it
    else removed++;                                  // drop it
  }
  return removed;
}`,
    },
    relatedGateIds: ['greedy-bits-tries', 'searching-sorting'],
    exampleProblemIds: ['merge-intervals', 'insert-interval', 'non-overlapping-intervals'],
  },

  // -------------------------------------------------------------------------
  // BIT MANIPULATION
  // -------------------------------------------------------------------------
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    tagline: 'Treat integers as rows of 0s and 1s; XOR, AND and shifts solve some problems in O(1) space.',
    triggers: [
      'every element appears twice except one',
      'count set bits / number of 1 bits',
      'without using extra memory',
      'power of two',
      'XOR',
      'missing number from 0..n',
      'reverse bits',
      'add two numbers without + or -',
    ],
    avoidWhen: [
      'a hash map is clearer and memory is not a concern',
      'the values are not integers (floats, strings)',
      'more than one value is the odd one out and you have not learned the extra split step yet',
    ],
    explanation: `Every integer is a row of bits: 5 is 101, 12 is 1100. A few operators on those bits (AND \`&\`, OR \`|\`, XOR \`^\`, shifts \`<<\` and \`>>\`) let you solve certain problems with no extra memory where a hash map would otherwise be needed. You do not need to be a wizard. Five tricks cover almost everything.

## The five tricks

- \`x & 1\`: is the lowest bit 1? (Is x odd?)
- \`x >> 1\`: drop the lowest bit (divide by 2). \`x << 1\` multiplies by 2.
- \`x & (x - 1)\`: clears the lowest set bit. Great for counting bits and the power-of-two check.
- \`x & -x\`: keeps only the lowest set bit.
- XOR: \`a ^ a = 0\`, \`a ^ 0 = a\`, and order does not matter. Pairs cancel out.

## A tiny example: Single Number

[4, 1, 2, 1, 2]. XOR everything: 4 ^ 1 ^ 2 ^ 1 ^ 2. Reorder freely: (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.

Slow way: a dictionary of counts, O(n) extra space. XOR: one pass, O(1) space.

## A tiny example: counting bits

x = 12 = 1100. \`x & (x - 1)\` = 1100 & 1011 = 1000 (count 1). Again: 1000 & 0111 = 0 (count 2). Two set bits, and the loop ran only twice, not 32 times.

Counting Bits for every number 0..n has a DP flavour: \`bits[i] = bits[i >> 1] + (i & 1)\` (drop the lowest bit, then add it back).

## Step by step

1. Write 3 or 4 sample numbers in binary. Really do it; it makes the pattern visible.
2. Ask which trick fits: pairs cancel -> XOR; count -> \`x & (x - 1)\`; check bit i -> \`(x >> i) & 1\`.
3. When you need to work per position (like Single Number II), loop over the 32 bit positions.

## Where people go wrong

- Negative numbers in Python have infinitely many leading 1s. Mask with \`& 0xFFFFFFFF\` when a problem assumes 32-bit.
- Operator precedence: \`x & 1 == 0\` is parsed as \`x & (1 == 0)\`. Always add parentheses.
- Assuming every "no extra memory" problem needs bits. Sometimes sorting or a math formula (sum of 0..n) is simpler.

## How to recognise it in an interview

"Appears twice except one", "without extra memory", "count 1 bits", "power of two", "XOR", "missing number" -> bit tricks.`,
    time: 'O(1) per operation; O(n) for one pass; O(32) for per-bit loops',
    space: 'O(1)',
    template: {
      python: `# The toolbox (memorise these five):
#   x & 1        -> is the lowest bit set? (odd?)
#   x >> 1       -> drop the lowest bit (divide by 2)
#   x & (x - 1)  -> clear the lowest SET bit
#   x & -x       -> keep only the lowest set bit
#   a ^ a == 0, a ^ 0 == a  (XOR cancels pairs)

def single_number(nums):
    result = 0
    for x in nums:
        result ^= x              # pairs cancel, the lonely one survives
    return result


def count_bits(x):
    count = 0
    while x:
        x &= x - 1               # each step removes one set bit
        count += 1
    return count


def is_power_of_two(x):
    return x > 0 and x & (x - 1) == 0    # exactly one set bit


def get_bit(x, i):
    return (x >> i) & 1          # value of bit i (0 = lowest)


def set_bit(x, i):
    return x | (1 << i)`,
      javascript: `// The toolbox (memorise these five):
//   x & 1        -> is the lowest bit set? (odd?)
//   x >> 1       -> drop the lowest bit (divide by 2)
//   x & (x - 1)  -> clear the lowest SET bit
//   x & -x       -> keep only the lowest set bit
//   a ^ a === 0, a ^ 0 === a  (XOR cancels pairs)
// Note: JS bit operators work on 32-bit signed integers.

function singleNumber(nums) {
  let result = 0;
  for (const x of nums) result ^= x;   // pairs cancel, lonely one survives
  return result;
}

function countBits(x) {
  let count = 0;
  while (x !== 0) { x &= x - 1; count++; }  // each step removes one set bit
  return count;
}

function isPowerOfTwo(x) {
  return x > 0 && (x & (x - 1)) === 0;      // exactly one set bit
}

const getBit = (x, i) => (x >> i) & 1;      // value of bit i (0 = lowest)
const setBit = (x, i) => x | (1 << i);`,
      java: `class Bits {
  // The toolbox (memorise these five):
  //   x & 1        -> is the lowest bit set? (odd?)
  //   x >> 1       -> drop the lowest bit (divide by 2)
  //   x & (x - 1)  -> clear the lowest SET bit
  //   x & -x       -> keep only the lowest set bit
  //   a ^ a == 0, a ^ 0 == a  (XOR cancels pairs)

  int singleNumber(int[] nums) {
    int result = 0;
    for (int x : nums) result ^= x;     // pairs cancel, lonely one survives
    return result;
  }

  int countBits(int x) {
    int count = 0;
    while (x != 0) { x &= x - 1; count++; }  // each step removes one set bit
    return count;
  }

  boolean isPowerOfTwo(int x) {
    return x > 0 && (x & (x - 1)) == 0;      // exactly one set bit
  }

  int getBit(int x, int i) { return (x >> i) & 1; }   // bit i (0 = lowest)
  int setBit(int x, int i) { return x | (1 << i); }
}`,
      cpp: `#include <vector>
using namespace std;

// The toolbox (memorise these five):
//   x & 1        -> is the lowest bit set? (odd?)
//   x >> 1       -> drop the lowest bit (divide by 2)
//   x & (x - 1)  -> clear the lowest SET bit
//   x & -x       -> keep only the lowest set bit
//   a ^ a == 0, a ^ 0 == a  (XOR cancels pairs)

int singleNumber(vector<int>& nums) {
  int result = 0;
  for (int x : nums) result ^= x;       // pairs cancel, lonely one survives
  return result;
}

int countBits(unsigned x) {
  int count = 0;
  while (x) { x &= x - 1; count++; }    // each step removes one set bit
  return count;
}

bool isPowerOfTwo(long long x) {
  return x > 0 && (x & (x - 1)) == 0;   // exactly one set bit
}

int getBit(int x, int i) { return (x >> i) & 1; }   // bit i (0 = lowest)
int setBit(int x, int i) { return x | (1 << i); }`,
    },
    relatedGateIds: ['greedy-bits-tries'],
    exampleProblemIds: ['single-number', 'counting-bits', 'number-of-1-bits', 'missing-number', 'reverse-bits', 'sum-of-two-integers'],
  },

  // -------------------------------------------------------------------------
  // TRIE
  // -------------------------------------------------------------------------
  {
    id: 'trie',
    name: 'Trie (Prefix Tree)',
    tagline: 'A tree of characters where every path is a prefix; answers "starts with" in time equal to the prefix length.',
    triggers: [
      'implement a prefix tree',
      'starts with / prefix search',
      'autocomplete',
      'search many words in a grid',
      'design add and search words (with wildcards)',
      'longest common prefix among many words',
      'replace words with their shortest root',
    ],
    avoidWhen: [
      'you only look up whole words (a hash set is simpler and just as fast)',
      'there is a single query (just loop over the words)',
      'you need to find text in the MIDDLE of words (that is a suffix structure, not a trie)',
    ],
    explanation: `A trie (say "try") is a tree of characters. Each path from the root spells a prefix, and nodes where a word ends carry a flag. It answers "is there any word starting with pre...?" in time proportional to the length of the prefix, no matter how many words you stored. A hash set cannot do that.

## The idea

- A node holds a \`children\` dictionary (char -> node) and an \`is_end\` flag.
- Insert: walk the characters, creating nodes when missing, and mark the last node as a word end.
- Search: walk the characters. If a character is missing, return False. At the end, return \`is_end\`.
- Starts with: same walk, but do not check \`is_end\`.

## A tiny example

Insert "car", "cat", "do".

\`\`\`
root
 |- c - a - r (end)
 |        \\- t (end)
 |- d - o (end)
\`\`\`

- search("ca"): reaches node "a" but \`is_end\` is False -> False.
- starts_with("ca"): the path exists -> True.
- search("cat"): path exists and the "t" node is an end -> True.
- search("dog"): "g" is missing under "o" -> False.

Slow way for "any word with this prefix?" over n words of length L: check every word, O(n * L) per query. Trie: O(L) per query, after an O(total characters) build.

## Step by step

1. Write the TrieNode class. Two fields, that is all.
2. Write \`insert\`.
3. Write a helper \`_walk(text)\` that returns the last node or None. Both \`search\` and \`starts_with\` use it.
4. For Word Search II: build a trie from the word list, then DFS the grid while following trie children. Stop early whenever the current cell has no matching child. That pruning is the whole point.

## Where people go wrong

- Forgetting \`is_end\`, so "ca" is reported as a word.
- Using a fixed array of 26 children when the input has uppercase letters, digits or symbols. A dict is safer.
- Building a trie for a single lookup. A set would do.
- In Word Search II, not removing a word after finding it, which produces duplicates and slows the search.

## How to recognise it in an interview

"Prefix", "starts with", "autocomplete", "many words to find in a grid", "add and search with a wildcard" -> trie.`,
    time: 'O(L) per insert or search, where L is the word length',
    space: 'O(total characters across all inserted words)',
    template: {
      python: `class TrieNode:
    def __init__(self):
        self.children = {}       # char -> TrieNode
        self.is_end = False      # does a word finish here?


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:      # make the branch if missing
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True                   # mark the end of a word

    def _walk(self, text):
        node = self.root
        for ch in text:
            if ch not in node.children:
                return None                  # path breaks: not present
            node = node.children[ch]
        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._walk(prefix) is not None`,
      javascript: `class TrieNode {
  constructor() {
    this.children = new Map();   // char -> TrieNode
    this.isEnd = false;          // does a word finish here?
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;           // mark the end of a word
  }

  walk(text) {
    let node = this.root;
    for (const ch of text) {
      if (!node.children.has(ch)) return null;   // path breaks
      node = node.children.get(ch);
    }
    return node;
  }

  search(word) { const n = this.walk(word); return n !== null && n.isEnd; }
  startsWith(prefix) { return this.walk(prefix) !== null; }
}`,
      java: `class Trie {
  static class Node {
    Node[] children = new Node[26];   // one slot per lowercase letter
    boolean isEnd = false;            // does a word finish here?
  }
  private final Node root = new Node();

  public void insert(String word) {
    Node node = root;
    for (char ch : word.toCharArray()) {
      int i = ch - 'a';
      if (node.children[i] == null) node.children[i] = new Node();
      node = node.children[i];
    }
    node.isEnd = true;                // mark the end of a word
  }

  private Node walk(String text) {
    Node node = root;
    for (char ch : text.toCharArray()) {
      node = node.children[ch - 'a'];
      if (node == null) return null;  // path breaks: not present
    }
    return node;
  }

  public boolean search(String word) { Node n = walk(word); return n != null && n.isEnd; }
  public boolean startsWith(String prefix) { return walk(prefix) != null; }
}`,
      cpp: `#include <string>
using namespace std;

struct TrieNode {
  TrieNode* children[26] = {nullptr};   // one slot per lowercase letter
  bool isEnd = false;                    // does a word finish here?
};

class Trie {
  TrieNode* root = new TrieNode();

  TrieNode* walk(const string& text) {
    TrieNode* node = root;
    for (char ch : text) {
      node = node->children[ch - 'a'];
      if (!node) return nullptr;         // path breaks: not present
    }
    return node;
  }
public:
  void insert(const string& word) {
    TrieNode* node = root;
    for (char ch : word) {
      int i = ch - 'a';
      if (!node->children[i]) node->children[i] = new TrieNode();
      node = node->children[i];
    }
    node->isEnd = true;                  // mark the end of a word
  }
  bool search(const string& word) { TrieNode* n = walk(word); return n && n->isEnd; }
  bool startsWith(const string& prefix) { return walk(prefix) != nullptr; }
};`,
    },
    relatedGateIds: ['greedy-bits-tries', 'trees'],
    exampleProblemIds: ['implement-trie-prefix-tree', 'design-add-and-search-words-data-structure', 'word-search-ii', 'replace-words', 'longest-common-prefix'],
  },
]
