import type { Gate } from './types'

export const gates: Gate[] = [
  {
    id: 'complexity', order: 1, name: 'Complexity Analysis', codename: 'The Awakening', rank: 'E',
    description: 'Learn to measure how fast and how hungry your code is. Every later gate depends on this.',
    conceptIds: ['big-o-basics', 'time-vs-space', 'common-complexities', 'analyzing-loops-and-recursion'],
    patternIds: [],
  },
  {
    id: 'arrays-strings', order: 2, name: 'Arrays & Strings', codename: 'The Endless Corridor', rank: 'E',
    description: 'The most common interview ground. Master the pointer and window techniques that turn O(n^2) into O(n).',
    conceptIds: ['arrays-basics', 'strings-basics', 'two-pointers', 'sliding-window', 'prefix-sums', 'kadane-max-subarray'],
    patternIds: ['two-pointers', 'sliding-window', 'prefix-sum', 'kadane'],
  },
  {
    id: 'searching-sorting', order: 3, name: 'Searching & Sorting', codename: 'The Sorted Halls', rank: 'D',
    description: 'Binary search and the classic sorts. Learn to cut a problem in half again and again.',
    conceptIds: ['linear-vs-binary-search', 'binary-search-variants', 'sorting-basics', 'merge-sort', 'quick-sort'],
    patternIds: ['binary-search', 'binary-search-on-answer', 'divide-and-conquer', 'cyclic-sort'],
  },
  {
    id: 'recursion-backtracking', order: 4, name: 'Recursion & Backtracking', codename: 'The Mirror Maze', rank: 'D',
    description: 'Solve a problem by solving smaller copies of it. Explore every path and undo your steps.',
    conceptIds: ['recursion-basics', 'subsets-and-permutations', 'backtracking-with-constraints'],
    patternIds: ['backtracking', 'divide-and-conquer'],
  },
  {
    id: 'linked-lists', order: 5, name: 'Linked Lists', codename: 'The Chain Bridge', rank: 'D',
    description: 'Nodes joined by pointers. Reverse, split, detect cycles and merge without extra memory.',
    conceptIds: ['linked-list-basics', 'reversal-and-middle', 'cycle-detection', 'merging-lists'],
    patternIds: ['fast-slow-pointers', 'in-place-reversal'],
  },
  {
    id: 'stacks-queues', order: 6, name: 'Stacks & Queues', codename: 'The Tower of Plates', rank: 'C',
    description: 'Last-in-first-out and first-in-first-out. The monotonic stack alone solves dozens of problems.',
    conceptIds: ['stack-basics', 'monotonic-stack', 'queue-and-deque', 'lru-cache'],
    patternIds: ['monotonic-stack', 'sliding-window'],
  },
  {
    id: 'hashing', order: 7, name: 'Hashing', codename: 'The Vault of Keys', rank: 'C',
    description: 'Constant-time lookups. The trick behind most O(n) solutions to counting and pairing problems.',
    conceptIds: ['hash-map-basics', 'frequency-counting', 'hashing-tricks'],
    patternIds: ['hash-map', 'prefix-sum'],
  },
  {
    id: 'trees', order: 8, name: 'Trees & BST', codename: 'The Ancient Grove', rank: 'C',
    description: 'Hierarchies of nodes. Traversals, heights, ancestors and the ordered power of binary search trees.',
    conceptIds: ['tree-basics-and-traversals', 'tree-properties', 'binary-search-tree', 'lca-and-paths'],
    patternIds: ['tree-traversal', 'dfs', 'bfs'],
  },
  {
    id: 'heaps', order: 9, name: 'Heaps & Priority Queues', codename: 'The Burning Peak', rank: 'B',
    description: 'Always know the smallest or largest thing instantly. Top-K problems live here.',
    conceptIds: ['heap-basics', 'top-k-problems', 'two-heaps-median'],
    patternIds: ['top-k-heap', 'two-heaps', 'k-way-merge'],
  },
  {
    id: 'graphs', order: 10, name: 'Graphs', codename: 'The Web of Gates', rank: 'B',
    description: 'Networks of nodes. BFS, DFS, topological order, shortest paths and union-find.',
    conceptIds: ['graph-representation-bfs-dfs', 'grid-graphs', 'topological-sort', 'shortest-paths', 'union-find'],
    patternIds: ['bfs', 'dfs', 'topological-sort', 'union-find', 'shortest-path'],
  },
  {
    id: 'dynamic-programming', order: 11, name: 'Dynamic Programming', codename: 'The Infinite Library', rank: 'A',
    description: 'Remember answers to sub-problems so you never solve them twice. The gate that separates ranks.',
    conceptIds: ['dp-intro-memo-and-tabulation', 'dp-1d', 'dp-2d-grids', 'knapsack', 'lcs-and-lis', 'dp-on-strings'],
    patternIds: ['dp-1d', 'dp-2d', 'knapsack', 'lcs-lis'],
  },
  {
    id: 'greedy-bits-tries', order: 12, name: 'Greedy, Bits & Tries', codename: 'The Shadow Armory', rank: 'A',
    description: 'Local best choices, binary tricks and prefix trees. Fast weapons for specific problem shapes.',
    conceptIds: ['greedy-basics', 'intervals', 'bit-manipulation', 'tries'],
    patternIds: ['greedy', 'merge-intervals', 'bit-manipulation', 'trie'],
  },
  {
    id: 'mastery', order: 13, name: 'Mastery & Beyond', codename: 'The Monarch\'s Throne', rank: 'S',
    description: 'Revision, mock interviews and the first steps into competitive programming.',
    conceptIds: ['revision-strategy', 'mock-interview-method', 'competitive-programming-intro'],
    patternIds: [],
  },
]

export const gateById = (id: string) => gates.find((g) => g.id === id)
