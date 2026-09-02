import type { DecisionNode } from './types'

export const decisionRootId = 'root'

export const decisionTree: DecisionNode[] = [
  // ------------------------------------------------------------------ root
  {
    id: 'root',
    question: 'What is the main input?',
    options: [
      { label: 'An array or a string', next: 'arr' },
      { label: 'A linked list', next: 'll' },
      { label: 'A tree', next: 'tree' },
      { label: 'A graph or a grid', next: 'graph' },
      { label: 'Numbers, bits, words or intervals', next: 'num' },
      { label: 'A "count ways / min cost / max value" question', next: 'opt' },
    ],
  },

  // -------------------------------------------------------- arrays/strings
  {
    id: 'arr',
    question: 'What are you asked to do with the array or string?',
    options: [
      { label: 'Find a pair or triplet, or compare from both ends', next: 'arr-pairs' },
      { label: 'Find the best contiguous subarray or substring', next: 'arr-contig' },
      { label: 'Answer many range-sum queries', patternId: 'prefix-sum' },
      { label: 'Find the next greater or smaller element for each position', patternId: 'monotonic-stack' },
      { label: 'Search for a value, a boundary, or a smallest feasible answer', next: 'arr-search' },
      { label: 'Generate all subsets, permutations or combinations', patternId: 'backtracking' },
      { label: 'Values are 1..n with something missing or duplicated', patternId: 'cyclic-sort' },
      { label: 'Find the top k or the kth largest', patternId: 'top-k-heap' },
      { label: 'It is really a string question', next: 'string-q' },
      { label: 'Something else', next: 'arr-other' },
    ],
  },
  {
    id: 'arr-pairs',
    question: 'Is the array sorted, or can you sort it without breaking the question?',
    options: [
      { label: 'Yes, sorted or sortable (pair sum, remove duplicates, squares)', patternId: 'two-pointers' },
      { label: 'No, and I need "have I seen the partner?" in one pass', patternId: 'hash-map' },
      { label: 'No, and I need to count or group equal values', patternId: 'hash-map' },
    ],
  },
  {
    id: 'arr-contig',
    question: 'What kind of contiguous piece do you need?',
    options: [
      { label: 'Longest or shortest window that satisfies a condition (unique chars, at most k, sum >= target)', patternId: 'sliding-window' },
      { label: 'Maximum sum (or product) subarray', patternId: 'kadane' },
      { label: 'Count subarrays with sum k, or sums of many ranges', patternId: 'prefix-sum' },
    ],
  },
  {
    id: 'arr-search',
    question: 'Is the data sorted, or is the answer monotonic (if x works then x + 1 also works)?',
    options: [
      { label: 'Sorted array, find a value or a boundary (first / last occurrence, rotated array)', patternId: 'binary-search' },
      { label: 'The answer is a number in a range (min capacity, min days, min speed)', patternId: 'binary-search-on-answer' },
      { label: 'Not sorted, but I need fast lookups or counts', patternId: 'hash-map' },
      { label: 'Not sorted, input is tiny, no better idea yet', patternId: 'brute-force' },
    ],
  },
  {
    id: 'string-q',
    question: 'What does the string question look like?',
    options: [
      { label: 'Palindrome check, or reverse / compare from both ends', patternId: 'two-pointers' },
      { label: 'Anagrams, letter counts, first unique character', patternId: 'hash-map' },
      { label: 'Longest substring with a condition', patternId: 'sliding-window' },
      { label: 'Prefixes, autocomplete, or a dictionary of many words', patternId: 'trie' },
      { label: 'Edit distance, wildcard matching, or two strings compared', patternId: 'dp-2d' },
    ],
  },
  {
    id: 'arr-other',
    question: 'Which of these fits best?',
    options: [
      { label: 'Split, sort or combine halves (inversions, several sorted lists)', next: 'arr-merge' },
      { label: 'A local choice at each step (jumps, gas station, scheduling)', patternId: 'greedy' },
      { label: 'Reverse or rotate in place', patternId: 'two-pointers' },
      { label: 'The problem is defined in terms of a smaller copy of itself', next: 'recursion-q' },
    ],
  },
  {
    id: 'arr-merge',
    question: 'How many sorted inputs are involved?',
    options: [
      { label: 'One array that I split into halves and combine', patternId: 'divide-and-conquer' },
      { label: 'k sorted lists or arrays to merge', patternId: 'k-way-merge' },
    ],
  },
  {
    id: 'recursion-q',
    question: 'How does the smaller copy relate to the whole?',
    options: [
      { label: 'One smaller copy (n - 1), simple base case', patternId: 'recursion' },
      { label: 'Split into halves and combine the results', patternId: 'divide-and-conquer' },
      { label: 'Try a choice, recurse, then undo it', patternId: 'backtracking' },
    ],
  },

  // ---------------------------------------------------------- linked lists
  {
    id: 'll',
    question: 'What about the linked list?',
    options: [
      { label: 'Detect a cycle, find the middle, or the nth from the end', patternId: 'fast-slow-pointers' },
      { label: 'Reverse the whole list or a part of it', patternId: 'in-place-reversal' },
      { label: 'Merge k sorted lists', patternId: 'k-way-merge' },
      { label: 'Merge two lists or walk two lists together', patternId: 'two-pointers' },
    ],
  },

  // ----------------------------------------------------------------- trees
  {
    id: 'tree',
    question: 'What do you need from the tree?',
    options: [
      { label: 'Visit nodes in order, compute height, diameter or path sums', patternId: 'tree-traversal' },
      { label: 'Level by level, minimum depth, or right side view', patternId: 'bfs' },
      { label: 'It is a binary search tree', next: 'tree-bst' },
      { label: 'Lowest common ancestor, or does a path exist', patternId: 'dfs' },
      { label: 'Build the tree from traversals, or serialize it', patternId: 'recursion' },
    ],
  },
  {
    id: 'tree-bst',
    question: 'What does the BST question ask?',
    options: [
      { label: 'kth smallest, validate, or range sum (use in-order)', patternId: 'tree-traversal' },
      { label: 'Search, insert or delete a value', patternId: 'binary-search' },
      { label: 'Lowest common ancestor of two values', patternId: 'dfs' },
    ],
  },

  // ---------------------------------------------------------------- graphs
  {
    id: 'graph',
    question: 'What is the question about the graph or grid?',
    options: [
      { label: 'Shortest path or fewest steps', next: 'graph-shortest' },
      { label: 'Count islands, regions, or connected groups', next: 'graph-cc' },
      { label: 'Order tasks with dependencies, or detect a cycle', next: 'graph-order' },
      { label: 'Explore every path, or check whether a path exists', patternId: 'dfs' },
      { label: 'Many "are these connected?" queries as edges are added', patternId: 'union-find' },
    ],
  },
  {
    id: 'graph-shortest',
    question: 'Are the edges weighted?',
    options: [
      { label: 'No, every step costs the same (grid steps, unweighted graph)', patternId: 'bfs' },
      { label: 'Yes, with non-negative weights (roads with distances)', patternId: 'shortest-path' },
      { label: 'Yes, and there may be negative edges or a limit on stops', patternId: 'shortest-path' },
    ],
  },
  {
    id: 'graph-cc',
    question: 'Are all connections known up front?',
    options: [
      { label: 'Yes, and it is a grid (islands, flood fill)', patternId: 'dfs' },
      { label: 'Yes, and it is a grid but I need minimum steps too', patternId: 'bfs' },
      { label: 'No, edges arrive over time or I only need the number of groups', patternId: 'union-find' },
    ],
  },
  {
    id: 'graph-order',
    question: 'Is the graph directed?',
    options: [
      { label: 'Yes, tasks with prerequisites (course schedule, build order)', patternId: 'topological-sort' },
      { label: 'Yes, and I need to detect a cycle', patternId: 'topological-sort' },
      { label: 'No, undirected, detect a cycle or redundant edge', patternId: 'union-find' },
    ],
  },

  // ------------------------------------------- numbers/bits/words/intervals
  {
    id: 'num',
    question: 'What is it about?',
    options: [
      { label: 'Intervals given as [start, end] pairs', next: 'intervals-q' },
      { label: 'Bits, XOR, powers of two, or "appears once, others twice"', patternId: 'bit-manipulation' },
      { label: 'Words, prefixes, autocomplete', patternId: 'trie' },
      { label: 'A stream where I need the k best or the median', next: 'num-heap' },
      { label: 'Fast power, or divide the numbers and combine', patternId: 'divide-and-conquer' },
    ],
  },
  {
    id: 'intervals-q',
    question: 'What about the intervals?',
    options: [
      { label: 'Merge overlapping ones, or insert a new one', patternId: 'merge-intervals' },
      { label: 'Keep the most non-overlapping, or remove the fewest', patternId: 'greedy' },
      { label: 'How many overlap at once (rooms, arrows, events)', patternId: 'greedy' },
    ],
  },
  {
    id: 'num-heap',
    question: 'Do you need the k best, the middle, or a merge?',
    options: [
      { label: 'The k largest, smallest, closest or most frequent', patternId: 'top-k-heap' },
      { label: 'The running median or balancing two halves', patternId: 'two-heaps' },
      { label: 'The next smallest across k sorted sources', patternId: 'k-way-merge' },
    ],
  },

  // ---------------------------------------------------------- optimisation
  {
    id: 'opt',
    question: 'Does taking the locally best option ever hurt later choices?',
    options: [
      { label: 'Never, and I can argue why (earliest finish, furthest reach)', patternId: 'greedy' },
      { label: 'Sometimes, choices interact and sub-answers repeat', next: 'opt-dp' },
      { label: 'Not sure, but n is tiny (<= 20) so I can try everything', patternId: 'backtracking' },
    ],
  },
  {
    id: 'opt-dp',
    question: 'What does one sub-problem depend on?',
    options: [
      { label: 'One index: previous one or two positions (stairs, house robber, decode ways)', patternId: 'dp-1d' },
      { label: 'Two indices: a grid cell or a pair (i, j) (unique paths, min path sum)', patternId: 'dp-2d' },
      { label: 'An item and a remaining capacity or target (coins, subset sum, partition)', patternId: 'knapsack' },
      { label: 'Two sequences or a subsequence (LCS, LIS, edit distance)', patternId: 'lcs-lis' },
    ],
  },
]
