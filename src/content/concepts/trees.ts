import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'tree-basics-and-traversals',
    gateId: 'trees',
    order: 1,
    title: 'Tree Basics and Traversals',
    minutes: 30,
    summary: 'A binary tree is nodes with a left and right child; DFS and BFS are the two ways to visit every node exactly once.',
    analogy:
      'A family tree starts with one ancestor at the top and branches downward. You can explore it depth-first (follow one child, then their child, all the way down before coming back) or breadth-first (meet all the children, then all the grandchildren, generation by generation).',
    explanation: `A binary tree is a set of nodes where each node holds a value and up to two children, called left and right. The top node is the root, nodes with no children are leaves, and every node except the root has exactly one parent. Almost every tree problem is "visit the nodes in some order and do a bit of work at each one", so the traversals are the foundation for the whole gate.

## The idea

There are two families of traversal:

- **DFS (depth-first).** Go as deep as you can before backing up. Usually written with recursion. Three flavours differ only in when you handle the current node:
  - Preorder: node, left, right. Good for copying or serializing a tree.
  - Inorder: left, node, right. On a binary search tree this yields sorted order.
  - Postorder: left, right, node. Good when a node's answer depends on its children (height, size).
- **BFS (breadth-first).** Visit level by level using a queue. Good for "level order", "right side view", "minimum depth".

Both visit each node once, so both are O(n) time. DFS uses O(h) stack space where h is the height; BFS uses O(w) queue space where w is the widest level.

## A tiny example

Tree: \`1\` at the root, children \`2\` (left) and \`3\` (right), and \`2\` has children \`4\` and \`5\`.

- Preorder: 1, 2, 4, 5, 3
- Inorder: 4, 2, 5, 1, 3
- Postorder: 4, 5, 2, 3, 1
- Level order: [1], [2, 3], [4, 5]

## Step by step

DFS recursion always looks the same:

\`\`\`python
def inorder(node, out):
    if node is None:
        return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)
\`\`\`

BFS with a queue, one level at a time:

\`\`\`python
from collections import deque

def level_order(root):
    if not root:
        return []
    levels, q = [], deque([root])
    while q:
        size = len(q)
        level = []
        for _ in range(size):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        levels.append(level)
    return levels
\`\`\`

The \`size = len(q)\` trick is the key. It freezes how many nodes belong to the current level before you start adding their children.

## Where people go wrong

- Forgetting the base case \`if node is None: return\`. Every DFS needs it.
- Running a full traversal per level to collect level k. That is O(n * h) and BFS does it in O(n). This is the "slow versus fast" of this lesson.
- Using \`list.pop(0)\` as a queue in Python. It is O(n); use \`collections.deque\`.
- Mixing up which traversal to use. Ask: do I need the answer for the children before the node (postorder) or do I need to pass information down from the parent (preorder)?

## How to recognise it in an interview

- "Return the values level by level", "right side view", "zigzag" mean BFS.
- "Invert", "mirror", "serialize", "build from preorder and inorder" mean a DFS with recursion.
- "Sorted order from a BST" means inorder.
- If you can describe the answer for a node using only the answers for its children, write a postorder DFS.`,
    naive: {
      title: 'One full DFS per level',
      description:
        'To build the level-order output, first find the height, then for each depth d run a DFS from the root that collects exactly the nodes at depth d. Every level re-walks the tree from the top.',
      time: 'O(n * h)',
      space: 'O(h)',
      code: {
        python: `def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))

def collect_depth(node, d, out):
    if node is None:
        return
    if d == 0:
        out.append(node.val)
        return
    collect_depth(node.left, d - 1, out)
    collect_depth(node.right, d - 1, out)

def level_order_slow(root):
    levels = []
    for d in range(height(root)):
        level = []
        collect_depth(root, d, level)
        levels.append(level)
    return levels`,
        javascript: `function height(node) {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

function collectDepth(node, d, out) {
  if (!node) return;
  if (d === 0) { out.push(node.val); return; }
  collectDepth(node.left, d - 1, out);
  collectDepth(node.right, d - 1, out);
}

function levelOrderSlow(root) {
  const levels = [];
  const h = height(root);
  for (let d = 0; d < h; d++) {
    const level = [];
    collectDepth(root, d, level);
    levels.push(level);
  }
  return levels;
}`,
        java: `int height(TreeNode node) {
  if (node == null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

void collectDepth(TreeNode node, int d, List<Integer> out) {
  if (node == null) return;
  if (d == 0) { out.add(node.val); return; }
  collectDepth(node.left, d - 1, out);
  collectDepth(node.right, d - 1, out);
}

public List<List<Integer>> levelOrderSlow(TreeNode root) {
  List<List<Integer>> levels = new ArrayList<>();
  int h = height(root);
  for (int d = 0; d < h; d++) {
    List<Integer> level = new ArrayList<>();
    collectDepth(root, d, level);
    levels.add(level);
  }
  return levels;
}`,
        cpp: `int height(TreeNode* node) {
  if (!node) return 0;
  return 1 + max(height(node->left), height(node->right));
}

void collectDepth(TreeNode* node, int d, vector<int>& out) {
  if (!node) return;
  if (d == 0) { out.push_back(node->val); return; }
  collectDepth(node->left, d - 1, out);
  collectDepth(node->right, d - 1, out);
}

vector<vector<int>> levelOrderSlow(TreeNode* root) {
  vector<vector<int>> levels;
  int h = height(root);
  for (int d = 0; d < h; d++) {
    vector<int> level;
    collectDepth(root, d, level);
    levels.push_back(level);
  }
  return levels;
}`,
      },
    },
    optimized: {
      title: 'BFS with a queue, one pass',
      description:
        'Push the root into a queue. Repeatedly record how many nodes are in the queue, pop exactly that many (they form one level), and push their children. Each node enters and leaves the queue once.',
      time: 'O(n)',
      space: 'O(w) where w is the widest level',
      code: {
        python: `from collections import deque

def level_order(root):
    if root is None:
        return []
    levels = []
    q = deque([root])
    while q:
        size = len(q)
        level = []
        for _ in range(size):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        levels.append(level)
    return levels`,
        javascript: `function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  let queue = [root];
  while (queue.length) {
    const next = [];
    const level = [];
    for (const node of queue) {
      level.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    levels.push(level);
    queue = next;
  }
  return levels;
}`,
        java: `public List<List<Integer>> levelOrder(TreeNode root) {
  List<List<Integer>> levels = new ArrayList<>();
  if (root == null) return levels;
  Deque<TreeNode> q = new ArrayDeque<>();
  q.add(root);
  while (!q.isEmpty()) {
    int size = q.size();
    List<Integer> level = new ArrayList<>();
    for (int i = 0; i < size; i++) {
      TreeNode node = q.poll();
      level.add(node.val);
      if (node.left != null) q.add(node.left);
      if (node.right != null) q.add(node.right);
    }
    levels.add(level);
  }
  return levels;
}`,
        cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
  vector<vector<int>> levels;
  if (!root) return levels;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    int size = q.size();
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
    },
    whyFaster:
      'The slow version restarts from the root for every level, so a node at depth d is visited by every DFS for depths 0 through d. On a skewed tree with height n that is about n^2 / 2 visits. BFS touches each node exactly once because the queue carries the frontier forward instead of rediscovering it.',
    keyPoints: [
      'Preorder = node, left, right. Inorder = left, node, right. Postorder = left, right, node.',
      'Every DFS starts with the base case: if node is None, return.',
      'BFS uses a queue; freeze len(queue) at the start of each level to separate levels.',
      'All traversals are O(n) time; DFS uses O(height) stack, BFS uses O(width) queue.',
      'Postorder when the answer depends on children; preorder when information flows down from the parent.',
    ],
    patternIds: ['tree-traversal', 'dfs', 'bfs'],
    definition:
      'A binary tree is a set of nodes where each node stores a value and links to at most two children, called left and right. One node is the root, every other node has exactly one parent, and there are no cycles. A traversal is an order for visiting every node exactly once.',
    coreIdea:
      'Every node in a binary tree is itself the root of a smaller tree. So any question about the whole tree can be answered by asking the same question of the left child, asking it of the right child, and combining the two answers. Because each node is asked exactly once, every traversal costs O(n); the only thing that changes between preorder, inorder and postorder is the moment you handle the current node. BFS swaps the call stack for a queue so nodes come out grouped by depth.',
    visual: [
      {
        caption: 'One small tree. Every traversal below visits these five nodes.',
        frame: [
          '        1',
          '      /   \\',
          '     2     3',
          '    / \\',
          '   4   5',
          '',
          'root = 1   leaves = 4, 5, 3   height = 3 nodes',
        ].join('\n'),
      },
      {
        caption: 'Preorder (node, left, right): the value is written the moment we arrive.',
        frame: [
          'arrive 1  ->  out: 1',
          'arrive 2  ->  out: 1 2',
          'arrive 4  ->  out: 1 2 4     (4 is a leaf, back up)',
          'arrive 5  ->  out: 1 2 4 5',
          'arrive 3  ->  out: 1 2 4 5 3',
        ].join('\n'),
      },
      {
        caption: 'Inorder (left, node, right): same walk, written on the way back from the left.',
        frame: [
          'go left from 1, from 2, from 4 -> empty, back up',
          'write 4   ->  out: 4',
          'write 2   ->  out: 4 2',
          'write 5   ->  out: 4 2 5',
          'write 1   ->  out: 4 2 5 1',
          'write 3   ->  out: 4 2 5 1 3',
        ].join('\n'),
      },
      {
        caption: 'Postorder (left, right, node): a node is written only after both children are done.',
        frame: [
          'write 4   ->  out: 4',
          'write 5   ->  out: 4 5',
          'write 2   ->  out: 4 5 2      (children first)',
          'write 3   ->  out: 4 5 2 3',
          'write 1   ->  out: 4 5 2 3 1  (root is last)',
        ].join('\n'),
      },
      {
        caption: 'BFS with a queue: freeze the queue size to cut the stream into levels.',
        frame: [
          'queue [1]     size=1  pop 1, push 2,3  -> level [1]',
          'queue [2,3]   size=2  pop 2, push 4,5',
          '                      pop 3            -> level [2,3]',
          'queue [4,5]   size=2  pop 4, pop 5     -> level [4,5]',
          'queue []              loop ends',
          '',
          'levels = [[1], [2,3], [4,5]]',
        ].join('\n'),
      },
    ],
    pseudocode: `function inorder(node, out):
    if node is null:
        return
    inorder(node.left, out)
    append node.value to out    // move this line up for
    inorder(node.right, out)    // preorder, down for postorder

function levelOrder(root):
    if root is null:
        return empty list
    levels = empty list
    queue = new queue holding root
    while queue is not empty:
        count = size of queue          // freeze one level
        level = empty list
        repeat count times:
            node = remove front of queue
            append node.value to level
            if node.left is not null:
                add node.left to queue
            if node.right is not null:
                add node.right to queue
        append level to levels
    return levels`,
    complexity: [
      { label: 'DFS (pre / in / post order)', time: 'O(n)', space: 'O(h)', note: 'each node once; the stack holds the current root-to-node path' },
      { label: 'BFS (level order)', time: 'O(n)', space: 'O(w)', note: 'w is the widest level; the queue holds one frontier' },
      { label: 'DFS on a skewed tree', time: 'O(n)', space: 'O(n)', note: 'height equals n, so the call stack is n frames deep' },
      { label: 'BFS on a complete tree', time: 'O(n)', space: 'O(n)', note: 'the bottom level alone holds about n/2 nodes' },
    ],
    dryRun: {
      input: 'Tree: root 1, left child 2 (children 4 and 5), right child 3. Running level_order.',
      goal: 'Group the values by depth using the optimized BFS code above.',
      steps: [
        { state: 'root=1 q=[1] levels=[]', action: 'Root is not None, so it goes into the queue and we enter the while loop.' },
        { state: 'q=[1] size=1 level=[]', action: 'Freeze size at 1. Pop 1, record it, push its children 2 and 3.' },
        { state: 'q=[2,3] level=[1]', action: 'The inner loop ran exactly once, so append [1] to levels.' },
        { state: 'q=[2,3] levels=[[1]]', action: 'Freeze size at 2. Pop 2, record it, push 4 and 5.' },
        { state: 'q=[3,4,5] level=[2]', action: 'Pop 3 and record it. Node 3 has no children, so nothing is pushed.' },
        { state: 'q=[4,5] level=[2,3]', action: 'The inner loop has now run twice, so append [2,3] to levels.' },
        { state: 'q=[4,5] levels=[[1],[2,3]]', action: 'Freeze size at 2. Pop 4 then 5; both are leaves, so the queue empties.' },
        { state: 'q=[] level=[4,5]', action: 'Append [4,5]. The queue is empty, so the while loop ends.' },
      ],
      result: 'levels = [[1], [2, 3], [4, 5]]. Each node was pushed once and popped once, and the frozen count means every inner loop drained exactly the nodes already waiting, which is exactly one depth.',
    },
    mistakes: [
      {
        mistake: 'Writing the BFS inner loop as "while the queue is not empty" instead of freezing the size first.',
        why: 'Children are pushed while you are still popping, so the loop keeps going and two or more depths get merged into one list.',
        fix: 'Read size = len(queue) before the inner loop and pop exactly that many nodes.',
      },
      {
        mistake: 'Skipping the "if node is None: return" first line of a DFS.',
        why: 'The recursion walks off the bottom of the tree and crashes while reading .left on None.',
        fix: 'Make the null check the first line of every tree function; it is the base case that ends the recursion.',
      },
      {
        mistake: 'Using a plain Python list with pop(0) as the BFS queue.',
        why: 'pop(0) shifts every remaining element, so it costs O(n). Over n nodes that turns an O(n) traversal into O(n^2).',
        fix: 'Use collections.deque and popleft(), which is O(1).',
      },
      {
        mistake: 'Computing the answer at a node before recursing, when that answer depends on the children (height, size, diameter).',
        why: 'In preorder the parent is handled while both children are still unknown, so there is nothing to combine.',
        fix: 'Use postorder: recurse left, recurse right, then combine the two returned values.',
      },
      {
        mistake: 'Assuming an inorder traversal always returns sorted values.',
        why: 'Sorted inorder is a property of binary search trees only. On a plain binary tree inorder is just one of three visiting orders.',
        fix: 'Only rely on sorted inorder when the problem states the tree is a BST.',
      },
    ],
    whenToUse: [
      'The input is a tree, or a hierarchy where each item has children and one parent.',
      'You must touch every node once: count, sum, invert, copy, compare or serialize.',
      'The statement says "level by level", "right side view", "zigzag" or "minimum depth", which is BFS.',
      'The answer at a node needs both child answers first, which is postorder DFS.',
      'Information flows down from the parent (path so far, allowed range, depth), which is preorder DFS.',
    ],
    whenNotToUse: [
      'The structure has cycles or a node can have several parents; that is a graph, so use DFS or BFS with a visited set.',
      'The tree is a BST and you need one value; a guided O(h) walk beats an O(n) full traversal.',
      'You repeatedly need the largest or smallest of a changing set; use a heap instead of re-walking the tree.',
      'The tree can be a 100000-node chain and the language caps recursion depth; switch to an explicit stack or to BFS.',
      'The data is flat and already ordered; a sorted array with binary search is simpler than building a tree.',
    ],
    relatedTopics: [
      { id: 'tree-properties', kind: 'concept', why: 'Height, balance and diameter are all read off a single postorder traversal.' },
      { id: 'binary-search-tree', kind: 'concept', why: 'An inorder traversal of a BST comes out sorted, which is the basis of most BST problems.' },
      { id: 'graph-representation-bfs-dfs', kind: 'concept', why: 'A tree is a graph without cycles, so these are the same two algorithms minus the visited set.' },
      { id: 'recursion-basics', kind: 'concept', why: 'Every DFS is recursion with a null base case and two recursive calls.' },
      { id: 'bfs', kind: 'pattern', why: 'Level order traversal is the tree form of the generic queue loop.' },
    ],
    quiz: [
      {
        question: 'A binary tree of 100000 nodes is one long left-going chain. How much extra memory does a recursive DFS need?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answerIndex: 2,
        explanation: 'DFS stack space is O(height). In a chain the height equals n, so there are n live call frames at the deepest point.',
      },
      {
        question: 'You must print the value of the rightmost node on every level. Which approach fits best?',
        options: [
          'Inorder DFS, then take the last value',
          'BFS, keeping the last node popped in each level',
          'Sort all the nodes by depth first',
          'Postorder DFS, then reverse the output',
        ],
        answerIndex: 1,
        explanation: 'BFS already groups nodes by depth in left-to-right order, so the last node of each level is exactly the right side view.',
      },
      {
        question: 'When does an inorder traversal produce the values in sorted order?',
        options: [
          'Always, for any binary tree',
          'Only when the tree is a binary search tree',
          'Only when the tree is balanced',
          'Only when the tree is complete',
        ],
        answerIndex: 1,
        explanation: 'Sorted inorder comes from the BST ordering rule, not from the traversal itself.',
      },
      {
        question: 'In BFS you loop over the queue without first storing its size. What breaks?',
        options: [
          'Nothing, the result is the same',
          'Nodes pushed from the current level get counted as part of it, so levels merge',
          'The leaves are never visited',
          'The queue never empties and the program hangs',
        ],
        answerIndex: 1,
        explanation: 'Children are appended while you are still draining, so without a frozen count the boundary between depths disappears.',
      },
      {
        question: 'For a complete binary tree with n nodes, which traversal uses less extra memory?',
        options: [
          'BFS, because a queue is cheaper than a stack',
          'DFS, because its stack holds about log n frames while the last BFS level holds about n/2 nodes',
          'They always use the same amount',
          'DFS, because recursion uses no memory',
        ],
        answerIndex: 1,
        explanation: 'DFS memory tracks the height, about log n here, while BFS memory tracks the widest level, which is roughly half the tree.',
      },
    ],
    sources: [
      'CLRS ch. 10 and ch. 12',
      'MIT 6.006 lectures on binary trees and tree traversal',
      'VisuAlgo: Binary Search Tree module (traversal animations)',
      'LeetCode editorials for Binary Tree Level Order Traversal',
    ],
    problems: [
      {
        id: 'binary-tree-inorder-traversal',
        title: 'Binary Tree Inorder Traversal',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
        patternId: 'tree-traversal',
        hint: 'Recurse left, append the node, recurse right; then try it again with an explicit stack.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/invert-binary-tree/',
        patternId: 'dfs',
        hint: 'Swap left and right at the current node, then invert both children.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'binary-tree-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        patternId: 'bfs',
        hint: 'Use a queue and process len(queue) nodes per round so each round is exactly one level.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'binary-tree-right-side-view',
        title: 'Binary Tree Right Side View',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/binary-tree-right-side-view/',
        patternId: 'bfs',
        hint: 'Do a level-order traversal and keep only the last node of each level.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'binary-tree-zigzag-level-order-traversal',
        title: 'Binary Tree Zigzag Level Order Traversal',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/',
        patternId: 'bfs',
        hint: 'Normal BFS, but reverse every other level before adding it to the answer.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
        title: 'Construct Binary Tree from Preorder and Inorder Traversal',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
        patternId: 'divide-and-conquer',
        hint: 'The first preorder value is the root; find it in inorder to split the left and right subtrees, then recurse.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'serialize-and-deserialize-binary-tree',
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
        patternId: 'dfs',
        hint: 'Write a preorder walk that records "null" for missing children; rebuild by reading tokens in the same order.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'tree-properties',
    gateId: 'trees',
    order: 2,
    title: 'Tree Properties: Height, Balance, Diameter',
    minutes: 25,
    summary: 'Compute a property of a tree in one postorder pass by having each call return what its parent needs.',
    analogy:
      'To find the tallest branch in a real tree you do not climb every branch from the trunk again and again. You ask each branch "how tall are you?" and it asks its own sub-branches, and the numbers add up from the leaves back to the trunk in one climb.',
    explanation: `Many tree questions ask for a number that describes the whole tree: its height, whether it is balanced, its diameter, how many "good" nodes it has. All of these share one shape. A node can compute its answer from its children's answers, so a single postorder DFS (children first, then the node) solves them in O(n). This lesson is about spotting that shape and writing the recursion cleanly.

## The idea

- Height of a node = 1 + max(height of left, height of right). A missing node has height 0.
- Balanced = for every node, the two child heights differ by at most 1.
- Diameter = the longest path between any two nodes, counted in edges. At each node the longest path through it is left height + right height.
- The trick: return the height upward, and update a shared "best so far" as a side effect while you are at each node.

## A tiny example

Tree: root \`1\`, left child \`2\`, right child \`3\`, and \`2\` has children \`4\` and \`5\`.

- Heights: 4 and 5 are 1, node 2 is 2, node 3 is 1, root is 3.
- Diameter: at node 2 the path 4 to 5 has length 1 + 1 = 2. At the root, left height 2 plus right height 1 gives 3. Answer 3 (path 4-2-1-3).

## Step by step

The slow way for diameter calls a separate \`height()\` for both children at every node. \`height()\` is itself O(n), and it is called at every node, so the total is O(n^2) on a skewed tree.

The fast way computes height and diameter in the same walk:

\`\`\`python
def diameter(root):
    best = 0

    def height(node):
        nonlocal best
        if node is None:
            return 0
        left = height(node.left)
        right = height(node.right)
        best = max(best, left + right)
        return 1 + max(left, right)

    height(root)
    return best
\`\`\`

Each node is visited once and does O(1) work, so O(n) time and O(h) stack space.

The same template handles balance: return -1 as a special "not balanced" signal so the check short-circuits, or return a pair (height, is_balanced).

## Where people go wrong

- Calling a helper inside the recursion that is itself recursive. That is the O(n^2) trap. If you see \`height(node.left)\` inside a function that also recurses, merge them.
- Confusing edges and nodes. LeetCode's diameter counts edges; height in nodes minus one is edges.
- Forgetting that the answer may not pass through the root. Use a global best, not the root's value.
- Returning the wrong thing. The function returns what the parent needs (height); the answer to the question lives in a separate variable.

## How to recognise it in an interview

- "Maximum depth", "minimum depth", "is it height-balanced".
- "Longest path", "diameter", "maximum path sum".
- "Count nodes where the value is the largest on the path from the root" (pass the max down, count up).
- "Is tree B a subtree of tree A", "are two trees the same" (compare node by node, recurse on both children).
- Whenever the property of a node is a small formula over the same property of its children, write a postorder DFS.`,
    naive: {
      title: 'Recompute height at every node',
      description:
        'For every node, call a standalone height function on the left child and the right child, add them, and keep the maximum. Because height walks the whole subtree, the work repeats for nodes at every level.',
      time: 'O(n^2) worst case (O(n log n) on a balanced tree)',
      space: 'O(h)',
      code: {
        python: `def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))

def diameter_slow(node):
    if node is None:
        return 0
    through_here = height(node.left) + height(node.right)
    return max(through_here, diameter_slow(node.left), diameter_slow(node.right))`,
        javascript: `function height(node) {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

function diameterSlow(node) {
  if (!node) return 0;
  const throughHere = height(node.left) + height(node.right);
  return Math.max(throughHere, diameterSlow(node.left), diameterSlow(node.right));
}`,
        java: `int height(TreeNode node) {
  if (node == null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

public int diameterSlow(TreeNode node) {
  if (node == null) return 0;
  int throughHere = height(node.left) + height(node.right);
  return Math.max(throughHere, Math.max(diameterSlow(node.left), diameterSlow(node.right)));
}`,
        cpp: `int height(TreeNode* node) {
  if (!node) return 0;
  return 1 + max(height(node->left), height(node->right));
}

int diameterSlow(TreeNode* node) {
  if (!node) return 0;
  int throughHere = height(node->left) + height(node->right);
  return max(throughHere, max(diameterSlow(node->left), diameterSlow(node->right)));
}`,
      },
    },
    optimized: {
      title: 'One postorder pass that returns height and updates the best',
      description:
        'Write a single recursive function that returns the height of a node. While it has both child heights in hand, update a shared best-diameter variable. The parent gets the height it needs and the answer is collected on the way.',
      time: 'O(n)',
      space: 'O(h)',
      code: {
        python: `def diameter(root):
    best = 0

    def height(node):
        nonlocal best
        if node is None:
            return 0
        left = height(node.left)
        right = height(node.right)
        best = max(best, left + right)
        return 1 + max(left, right)

    height(root)
    return best`,
        javascript: `function diameter(root) {
  let best = 0;
  function height(node) {
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  }
  height(root);
  return best;
}`,
        java: `private int best = 0;

public int diameter(TreeNode root) {
  best = 0;
  height(root);
  return best;
}

private int height(TreeNode node) {
  if (node == null) return 0;
  int left = height(node.left);
  int right = height(node.right);
  best = Math.max(best, left + right);
  return 1 + Math.max(left, right);
}`,
        cpp: `int best = 0;

int height(TreeNode* node) {
  if (!node) return 0;
  int left = height(node->left);
  int right = height(node->right);
  best = max(best, left + right);
  return 1 + max(left, right);
}

int diameter(TreeNode* root) {
  best = 0;
  height(root);
  return best;
}`,
      },
    },
    whyFaster:
      'The slow version computes the height of a subtree once for every ancestor of that subtree, so deep nodes are counted many times. The fast version computes each height exactly once and passes it upward, using the two child heights at the moment they are both available. Total work drops from a sum over all ancestors to a single visit per node.',
    keyPoints: [
      'Height = 1 + max(left, right); a missing node has height 0.',
      'If a recursive function calls another recursive helper at every node, you are probably at O(n^2). Merge them.',
      'Return what the parent needs (height); keep the answer to the question in a separate best variable.',
      'The best path may not go through the root, so update best at every node.',
      'Diameter is measured in edges: left height + right height.',
      'Balanced check: return -1 as a "not balanced" signal to stop early.',
    ],
    patternIds: ['dfs', 'tree-traversal'],
    definition:
      'The height of a subtree is the number of nodes on its longest downward path, so an empty subtree has height 0 and a single leaf has height 1. A tree is height-balanced when at every node the two subtree heights differ by at most 1, and the diameter is the number of edges on the longest path between any two nodes.',
    coreIdea:
      'Height, balance and diameter all need the same one number at every node: how tall is the subtree below me. If you ask that question from scratch at each node, every subtree is re-measured once for each of its ancestors, which is O(n^2) on a skewed tree. A single postorder traversal computes each height exactly once and hands it up to the parent, so one O(n) pass answers all three questions.',
    visual: [
      {
        caption: 'A deliberately lopsided tree. How tall is it, is it balanced, what is the longest path?',
        frame: [
          '          1',
          '        /   \\',
          '       2     3',
          '      / \\',
          '     4   5',
          '    /     \\',
          '   6       7',
          '  /         \\',
          ' 8           9',
        ].join('\n'),
      },
      {
        caption: 'Postorder starts at the deepest leaves. Height of a null child is 0.',
        frame: [
          'node  leftH  rightH  leftH+rightH  best so far',
          '  8      0      0          0            0',
          '  6      1      0          1            1',
          '  4      2      0          2            2',
          '  9      0      0          0            2',
          '  7      0      1          1            2',
          '  5      0      2          2            2',
        ].join('\n'),
      },
      {
        caption: 'Node 2 finally sees both branches. Its bent path is the longest in the tree.',
        frame: [
          'node  leftH  rightH  leftH+rightH  best so far',
          '  2      3      3          6            6   <-- new best',
          '  3      0      0          0            6',
          '  1      4      1          5            6',
          '',
          'height(2) = 1 + max(3, 3) = 4 goes up to node 1',
        ].join('\n'),
      },
      {
        caption: 'The winning path bends at node 2 and never touches the root.',
        frame: [
          '8 - 6 - 4 - 2 - 5 - 7 - 9   =  6 edges',
          '',
          'through the root: 4 + 1 = 5 edges only',
          '',
          'so best must be updated at EVERY node, not the root',
        ].join('\n'),
      },
      {
        caption: 'Same walk answers "is it balanced?". Node 1 fails, so the whole tree fails.',
        frame: [
          'node  leftH  rightH  |diff|  ok?',
          '  4      2      0       2    NO',
          '  2      3      3       0    yes',
          '  1      4      1       3    NO',
          '',
          'return -1 at the first failure to stop early',
        ].join('\n'),
      },
    ],
    pseudocode: `function diameter(root):
    best = 0                       // shared across all calls

    function height(node):
        if node is null:
            return 0
        leftH  = height(node.left)     // children first
        rightH = height(node.right)
        best = max(best, leftH + rightH)   // path bending here
        return 1 + max(leftH, rightH)      // what the parent needs

    call height(root)
    return best

// balance check: same walk, -1 means "already unbalanced"
function checkBalance(node):
    if node is null:
        return 0
    l = checkBalance(node.left)
    if l = -1: return -1
    r = checkBalance(node.right)
    if r = -1: return -1
    if absolute(l - r) > 1: return -1
    return 1 + max(l, r)`,
    complexity: [
      { label: 'Height of one subtree', time: 'O(n)', space: 'O(h)', note: 'must look at every node below it' },
      { label: 'Diameter, one postorder pass', time: 'O(n)', space: 'O(h)', note: 'each height computed once and reused by the parent' },
      { label: 'Diameter, height recomputed per node', time: 'O(n^2)', space: 'O(h)', note: 'worst case on a skewed tree; O(n log n) when balanced' },
      { label: 'Balanced check with early exit', time: 'O(n)', space: 'O(h)', note: 'same walk; -1 stops the recursion as soon as it fails' },
    ],
    dryRun: {
      input: 'Tree: root 1, left child 2 (children 4 and 5), right child 3. Running diameter.',
      goal: 'Find the longest path in edges, using the single-pass code above.',
      steps: [
        { state: 'best=0, calling height(1)', action: 'Node 1 is not None, so it first recurses into node 2.' },
        { state: 'node=4', action: 'Both children are None, so left=0 and right=0. best stays 0 and height(4) returns 1.' },
        { state: 'node=5 best=0', action: 'Same as node 4: leaf, so height(5) returns 1 and best is still 0.' },
        { state: 'node=2 left=1 right=1', action: 'Both child heights are in hand. best = max(0, 1 + 1) = 2, and height(2) returns 1 + max(1,1) = 2.' },
        { state: 'node=3 best=2', action: 'Node 3 is a leaf, so left=0, right=0, best stays 2, and height(3) returns 1.' },
        { state: 'node=1 left=2 right=1', action: 'best = max(2, 2 + 1) = 3, and height(1) returns 1 + max(2,1) = 3.' },
        { state: 'best=3', action: 'The recursion has finished, so diameter returns best.' },
      ],
      result: 'The diameter is 3. The path is 4 - 2 - 1 - 3, which has 3 edges, and every node was visited exactly once, so no candidate path was missed.',
    },
    mistakes: [
      {
        mistake: 'Calling a separate height() helper from inside the diameter recursion at every node.',
        why: 'A subtree of size k is then measured once for each of its ancestors, so the total is O(n^2) on a skewed tree.',
        fix: 'Use one function that returns the height and updates the best answer while both child heights are on the stack.',
      },
      {
        mistake: 'Returning the best diameter from the recursive function instead of the height.',
        why: 'The parent needs the height to build its own answer. Give it the diameter and the arithmetic upstream is meaningless.',
        fix: 'Return what the parent needs (height) and keep the answer to the question in an outer variable such as nonlocal best.',
      },
      {
        mistake: 'Assuming the longest path passes through the root.',
        why: 'A deep, bushy subtree lower down can hold a longer bent path than anything crossing the root.',
        fix: 'Update best at every node, not only at the top of the recursion.',
      },
      {
        mistake: 'Mixing edges and nodes and returning leftH + rightH + 1 as the diameter.',
        why: 'LeetCode counts a path by edges. With height(null) = 0, leftH + rightH is already the edge count, so the +1 is one too many.',
        fix: 'Decide once which unit you are counting, then keep it consistent between height and the answer.',
      },
      {
        mistake: 'Checking balance by comparing only the two subtree heights at the root.',
        why: 'A tree can have two equally tall subtrees and still be wildly unbalanced deeper down.',
        fix: 'Apply the "differ by at most 1" test at every node, and return -1 upward to stop the moment it fails.',
      },
    ],
    whenToUse: [
      'The question asks for a size, height, depth, count or sum of a subtree.',
      'The answer at a node needs both children answered first, which is exactly postorder.',
      'You need the longest or best path inside the tree, and it may bend at some node.',
      'A validity rule must hold at every node, such as balance or "good nodes on the path".',
      'You want two answers from one walk (height and diameter, or height and balance).',
    ],
    whenNotToUse: [
      'You need the shallowest leaf (minimum depth); BFS stops at the first leaf instead of walking the whole tree.',
      'The tree changes constantly and you need the height after each update; store heights in the nodes, or use a self-balancing tree that maintains them.',
      'The structure has cycles; height is not defined there, so use graph DFS with a visited set.',
      'You only need one node in a BST; a guided O(h) walk beats an O(n) full traversal.',
      'The tree can be a 100000-node chain and recursion will overflow the stack; convert the postorder walk to an explicit stack.',
    ],
    relatedTopics: [
      { id: 'tree-basics-and-traversals', kind: 'concept', why: 'Postorder is the traversal that makes a single-pass height computation possible.' },
      { id: 'lca-and-paths', kind: 'concept', why: 'Maximum path sum reuses the same shape: return one branch upward, update a global best at each node.' },
      { id: 'binary-search-tree', kind: 'concept', why: 'Balance is what keeps BST operations at O(log n) instead of O(n).' },
      { id: 'recursion-basics', kind: 'concept', why: 'The pattern of "return one value, accumulate another" is a general recursion technique.' },
      { id: 'dfs', kind: 'pattern', why: 'This is depth-first search with the work done after the recursive calls.' },
    ],
    quiz: [
      {
        question: 'You compute the diameter by calling a separate height() at every node. On a tree of n nodes shaped as one long chain, what is the total time?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
        answerIndex: 2,
        explanation: 'The node at depth d has its height recomputed by all d ancestors, and summing 1 + 2 + ... + n gives about n^2 / 2 work.',
      },
      {
        question: 'Inside a single-pass height() function, where should the best diameter be updated?',
        options: [
          'Once at the end, after height(root) returns',
          'At every node, right after both child heights are known',
          'Only at the leaves',
          'Only at nodes that have two children',
        ],
        answerIndex: 1,
        explanation: 'The bent path through a node is leftH + rightH, and it is only computable at that node, so the check has to happen there.',
      },
      {
        question: 'Can you get the diameter by running BFS and taking the deepest level?',
        options: [
          'Yes, the deepest level always gives the diameter',
          'No, the longest path may bend at a node and never reach the root',
          'Yes, if the tree is a binary tree',
          'No, because BFS cannot compute depth',
        ],
        answerIndex: 1,
        explanation: 'BFS depth measures a root-to-leaf path only, while the diameter can join two branches of a node far below the root.',
      },
      {
        question: 'The balanced check returns -1 as soon as a node fails. What does that buy you?',
        options: [
          'It changes the complexity from O(n^2) to O(n)',
          'It lets the recursion stop early, but the bound is still O(n) because a balanced tree is checked fully',
          'It removes the need for recursion',
          'It reduces space from O(h) to O(1)',
        ],
        answerIndex: 1,
        explanation: 'The -1 sentinel avoids a second height pass and short-circuits unbalanced inputs, but the worst case still touches every node once.',
      },
      {
        question: 'height(null) = 0 and height(leaf) = 1. What is leftH + rightH at a node measuring?',
        options: [
          'The number of nodes on the bent path through that node',
          'The number of edges on the bent path through that node',
          'The height of the whole tree',
          'The number of leaves below that node',
        ],
        answerIndex: 1,
        explanation: 'Each unit of height counts one node going down, and joining the two branches through the node gives exactly the edge count of that path.',
      },
    ],
    sources: [
      'CLRS ch. 10 and ch. 12',
      'MIT 6.006 lectures on binary trees and recursion',
      'VisuAlgo: Binary Search Tree module (height and balance)',
      'LeetCode editorials for Diameter of Binary Tree and Balanced Binary Tree',
    ],
    problems: [
      {
        id: 'maximum-depth-of-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        patternId: 'dfs',
        hint: 'Depth of a node is 1 plus the larger depth of its two children; an empty tree has depth 0.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'same-tree',
        title: 'Same Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/same-tree/',
        patternId: 'dfs',
        hint: 'Both null means same; one null means different; otherwise compare values and recurse on both pairs of children.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'balanced-binary-tree',
        title: 'Balanced Binary Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/balanced-binary-tree/',
        patternId: 'dfs',
        hint: 'Compute height bottom-up and return -1 as soon as any node has children whose heights differ by more than 1.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'diameter-of-binary-tree',
        title: 'Diameter of Binary Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
        patternId: 'dfs',
        hint: 'At each node the longest path through it is left height plus right height; track the maximum while returning height.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'subtree-of-another-tree',
        title: 'Subtree of Another Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/subtree-of-another-tree/',
        patternId: 'dfs',
        hint: 'At every node of the big tree, run a Same Tree check against the small tree.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'count-good-nodes-in-binary-tree',
        title: 'Count Good Nodes in Binary Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/',
        patternId: 'dfs',
        hint: 'Pass the maximum value seen on the path so far down the recursion and count nodes that are at least that value.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'binary-search-tree',
    gateId: 'trees',
    order: 3,
    title: 'Binary Search Trees',
    minutes: 30,
    summary: 'A BST keeps smaller values on the left and larger on the right, so search, insert and delete take O(height).',
    analogy:
      'A dictionary is ordered so you can open it near the middle, see whether your word comes before or after, and ignore the other half. A BST bakes that rule into its shape: at every node, everything smaller is on the left and everything larger is on the right.',
    explanation: `A binary search tree (BST) is a binary tree with one extra rule: for every node, all values in its left subtree are smaller and all values in its right subtree are larger. That rule lets you throw away half the tree at each step, just like binary search on a sorted array. The rule also means an inorder traversal produces the values in sorted order, which is the key to many BST problems.

## The idea

- Search: compare with the current node. Smaller? Go left. Larger? Go right. Equal? Found.
- Insert: search for the value; when you fall off the tree, attach the new node there.
- Delete: if the node has two children, replace its value with the smallest value in its right subtree (the inorder successor), then delete that successor.
- All of these cost O(h) where h is the height. A balanced BST has h = log n. A skewed BST (inserting sorted data) has h = n, which is why self-balancing trees exist.
- Inorder traversal of a BST is sorted. Kth smallest is just the kth value visited.

## A tiny example

Insert 5, 3, 8, 1, 4 in that order:

- 5 is the root.
- 3 is less than 5, so it goes left.
- 8 is greater than 5, so it goes right.
- 1 goes left of 5, then left of 3.
- 4 goes left of 5, then right of 3.

Inorder: 1, 3, 4, 5, 8. Sorted, as promised. Searching for 4 takes three comparisons (5, 3, 4), not five.

## Step by step: validating a BST

A common mistake is checking only that \`left.val < node.val < right.val\`. That misses a grandchild that breaks the rule. The slow fix compares each node against every node in its subtrees, which is O(n^2).

The fast way passes down the allowed range. The root can be anything. Its left child must be less than root, its right child greater. Each step narrows the range.

\`\`\`python
def is_valid_bst(root):
    def check(node, low, high):
        if node is None:
            return True
        if not (low < node.val < high):
            return False
        return check(node.left, low, node.val) and check(node.right, node.val, high)
    return check(root, float('-inf'), float('inf'))
\`\`\`

Each node is visited once with an O(1) check. O(n) time, O(h) space.

## Where people go wrong

- Checking only the immediate children when validating. Use ranges.
- Using \`<=\` instead of \`<\`. LeetCode BSTs do not allow duplicates, so equal values are invalid.
- Forgetting that a BST built from sorted input is a linked list in disguise. Say "O(h), which is O(log n) if balanced" in interviews.
- Using integer min and max as the initial range when a node can hold that exact value. Use None or infinity.
- Doing a full inorder to a list just to find the kth smallest. Stop the traversal once you have counted k nodes.

## How to recognise it in an interview

- The problem says "binary search tree" or "BST". Immediately think: left smaller, right larger, inorder is sorted.
- "Kth smallest", "closest value", "range sum between low and high".
- "Validate", "is this a valid BST".
- "Lowest common ancestor in a BST": the split point is the first node whose value lies between the two targets.
- "Convert a sorted array into a balanced BST": pick the middle as root and recurse on both halves.`,
    naive: {
      title: 'Compare each node with its whole subtree',
      description:
        'For every node, walk its entire left subtree to confirm all values are smaller and its entire right subtree to confirm all are larger. Correct, but each node triggers a full scan below it.',
      time: 'O(n^2) worst case',
      space: 'O(h)',
      code: {
        python: `def all_less(node, limit):
    if node is None:
        return True
    return node.val < limit and all_less(node.left, limit) and all_less(node.right, limit)

def all_greater(node, limit):
    if node is None:
        return True
    return node.val > limit and all_greater(node.left, limit) and all_greater(node.right, limit)

def is_valid_bst_slow(node):
    if node is None:
        return True
    if not all_less(node.left, node.val) or not all_greater(node.right, node.val):
        return False
    return is_valid_bst_slow(node.left) and is_valid_bst_slow(node.right)`,
        javascript: `function allLess(node, limit) {
  if (!node) return true;
  return node.val < limit && allLess(node.left, limit) && allLess(node.right, limit);
}

function allGreater(node, limit) {
  if (!node) return true;
  return node.val > limit && allGreater(node.left, limit) && allGreater(node.right, limit);
}

function isValidBSTSlow(node) {
  if (!node) return true;
  if (!allLess(node.left, node.val) || !allGreater(node.right, node.val)) return false;
  return isValidBSTSlow(node.left) && isValidBSTSlow(node.right);
}`,
        java: `boolean allLess(TreeNode node, int limit) {
  if (node == null) return true;
  return node.val < limit && allLess(node.left, limit) && allLess(node.right, limit);
}

boolean allGreater(TreeNode node, int limit) {
  if (node == null) return true;
  return node.val > limit && allGreater(node.left, limit) && allGreater(node.right, limit);
}

public boolean isValidBSTSlow(TreeNode node) {
  if (node == null) return true;
  if (!allLess(node.left, node.val) || !allGreater(node.right, node.val)) return false;
  return isValidBSTSlow(node.left) && isValidBSTSlow(node.right);
}`,
        cpp: `bool allLess(TreeNode* node, int limit) {
  if (!node) return true;
  return node->val < limit && allLess(node->left, limit) && allLess(node->right, limit);
}

bool allGreater(TreeNode* node, int limit) {
  if (!node) return true;
  return node->val > limit && allGreater(node->left, limit) && allGreater(node->right, limit);
}

bool isValidBSTSlow(TreeNode* node) {
  if (!node) return true;
  if (!allLess(node->left, node->val) || !allGreater(node->right, node->val)) return false;
  return isValidBSTSlow(node->left) && isValidBSTSlow(node->right);
}`,
      },
    },
    optimized: {
      title: 'Pass an allowed range down the tree',
      description:
        'Each call receives the open interval (low, high) that the node value must fall inside. Going left tightens high to the current value; going right tightens low. One O(1) check per node.',
      time: 'O(n)',
      space: 'O(h)',
      code: {
        python: `def is_valid_bst(root):
    def check(node, low, high):
        if node is None:
            return True
        if not (low < node.val < high):
            return False
        return check(node.left, low, node.val) and check(node.right, node.val, high)
    return check(root, float('-inf'), float('inf'))`,
        javascript: `function isValidBST(root) {
  function check(node, low, high) {
    if (!node) return true;
    if (!(low < node.val && node.val < high)) return false;
    return check(node.left, low, node.val) && check(node.right, node.val, high);
  }
  return check(root, -Infinity, Infinity);
}`,
        java: `public boolean isValidBST(TreeNode root) {
  return check(root, null, null);
}

private boolean check(TreeNode node, Integer low, Integer high) {
  if (node == null) return true;
  if (low != null && node.val <= low) return false;
  if (high != null && node.val >= high) return false;
  return check(node.left, low, node.val) && check(node.right, node.val, high);
}`,
        cpp: `bool check(TreeNode* node, long low, long high) {
  if (!node) return true;
  if (node->val <= low || node->val >= high) return false;
  return check(node->left, low, node->val) && check(node->right, node->val, high);
}

bool isValidBST(TreeNode* root) {
  return check(root, LONG_MIN, LONG_MAX);
}`,
      },
    },
    whyFaster:
      'The slow version re-scans entire subtrees for every node, so a node deep in the tree is examined once for each of its ancestors. The fast version carries the constraints from all ancestors in two numbers, low and high, so each node is examined exactly once. That turns repeated subtree walks into a single traversal.',
    keyPoints: [
      'BST rule: left subtree smaller, right subtree larger, applied at every node, not just to direct children.',
      'Inorder traversal of a BST is sorted; use it for kth smallest and for validation.',
      'Search, insert and delete are O(h); h is log n when balanced and n when skewed.',
      'Validate with a (low, high) range passed down, not by comparing to children only.',
      'Delete a node with two children by swapping in its inorder successor.',
      'Sorted array to balanced BST: middle element becomes the root, recurse on halves.',
    ],
    patternIds: ['dfs', 'tree-traversal', 'binary-search'],
    definition:
      'A binary search tree is a binary tree in which every node obeys one rule: every value in its left subtree is smaller than the node and every value in its right subtree is larger. The rule applies to whole subtrees, not just to the two immediate children.',
    coreIdea:
      'Because the rule covers entire subtrees, a single comparison at a node tells you which half of the remaining tree cannot possibly hold your value, so you discard it and never look at it again. Search, insert and delete therefore follow one root-to-leaf path and cost O(h), where h is the height. The BST rule says nothing about shape, so h is about log2(n) when the tree is bushy but exactly n when values arrive already sorted. That is why real libraries do not ship a plain BST: C++ std::map and Java TreeMap use red-black trees, and other systems use AVL trees, because rotations force h = O(log n) in the worst case.',
    visual: [
      {
        caption: 'Insert 5, 3, 8, 1, 4. Each value walks down until it falls off the tree.',
        frame: [
          '     5',
          '   /   \\',
          '  3     8',
          ' / \\',
          '1   4',
          '',
          'left of 5: 1, 3, 4      right of 5: 8',
        ].join('\n'),
      },
      {
        caption: 'Search for 4: three comparisons, and half the tree is dropped at step one.',
        frame: [
          'at 5:  4 < 5  -> go left, drop {8}',
          'at 3:  4 > 3  -> go right, drop {1}',
          'at 4:  found',
          '',
          '     5',
          '   /   \\',
          ' [3]    8      <- 8 is never even read',
          ' / \\',
          '1  [4]',
        ].join('\n'),
      },
      {
        caption: 'Inorder walk of a BST comes out sorted, which gives kth smallest for free.',
        frame: [
          'left, node, right  ->  1  3  4  5  8',
          '                       ^  ^  ^',
          '                      1st 2nd 3rd',
          '',
          'stop after k visits: O(h + k), not O(n)',
        ].join('\n'),
      },
      {
        caption: 'Delete a node with two children: swap in its inorder successor, then delete that.',
        frame: [
          'before (delete 5)      after',
          '     5                      6',
          '   /   \\                  /   \\',
          '  3     8                3     8',
          ' / \\   /                / \\',
          '1   4 6                1   4',
          '',
          'successor = smallest of the right subtree = 6',
        ].join('\n'),
      },
      {
        caption: 'The same five values inserted in sorted order. Now every operation is O(n).',
        frame: [
          'insert 1, 3, 4, 5, 8',
          '',
          '1',
          ' \\',
          '  3',
          '   \\',
          '    4',
          '     \\',
          '      5',
          '       \\',
          '        8',
          '',
          'h = n = 5, so find(8) takes 5 steps. Still a valid',
          'BST, just useless. AVL / red-black rotations fix it.',
        ].join('\n'),
      },
    ],
    pseudocode: `function search(node, target):
    while node is not null:
        if target = node.value: return node
        if target < node.value: node = node.left
        else:                   node = node.right
    return null                   // fell off the tree

function insert(node, value):
    if node is null: return new Node(value)
    if value < node.value:      node.left  = insert(node.left, value)
    else if value > node.value: node.right = insert(node.right, value)
    return node                   // equal value: already present

function remove(node, value):
    if node is null: return null
    if value < node.value:      node.left  = remove(node.left, value)
    else if value > node.value: node.right = remove(node.right, value)
    else:
        if node.left is null:  return node.right    // 0 or 1 child
        if node.right is null: return node.left
        succ = leftmost node of node.right          // inorder successor
        node.value = succ.value
        node.right = remove(node.right, succ.value)
    return node`,
    complexity: [
      { label: 'Search / Insert / Delete', time: 'O(h)', space: 'O(1) iterative, O(h) recursive', note: 'h is the height, which is not the same as log n' },
      { label: 'Same, on a balanced tree (AVL or red-black)', time: 'O(log n)', space: 'O(1)', note: 'rotations cap h at about 1.44*log2(n) for AVL, 2*log2(n) for red-black' },
      { label: 'Same, on a degenerate tree', time: 'O(n)', space: 'O(1)', note: 'sorted inserts build a chain, so h = n' },
      { label: 'Inorder traversal / validate', time: 'O(n)', space: 'O(h)', note: 'every node is visited once with an O(1) check' },
      { label: 'Build a balanced BST from a sorted array', time: 'O(n)', space: 'O(n)', note: 'take the middle as root and recurse, giving h = log n' },
    ],
    dryRun: {
      input: 'Tree: root 5, left child 4, right child 6 whose children are 3 and 7. Running is_valid_bst.',
      goal: 'Show how the (low, high) range catches a grandchild that a parent-only check would miss.',
      steps: [
        { state: 'node=5 low=-inf high=+inf', action: 'The root may hold anything. -inf < 5 < +inf passes, so recurse left with high tightened to 5.' },
        { state: 'node=4 low=-inf high=5', action: '-inf < 4 < 5 passes. Node 4 has no children, so both of its calls hit the base case.' },
        { state: 'node=None', action: 'The base case returns True, so check(4, ...) returns True and the left half of the tree is clean.' },
        { state: 'back at node=5, left=True', action: 'Now recurse right with low tightened to 5 and high left at +inf.' },
        { state: 'node=6 low=5 high=+inf', action: '5 < 6 < +inf passes. Recurse into its left child with low still 5 and high tightened to 6.' },
        { state: 'node=3 low=5 high=6', action: '3 is not greater than 5, so the range check fails and this call returns False.' },
        { state: 'left=False at node=6', action: 'The two recursive calls are joined by a short-circuiting and, so node 7 is never visited.' },
        { state: 'False bubbles to the root', action: 'check(6, ...) returns False, so check(5, ...) returns False.' },
      ],
      result: 'False. Node 3 sits in the right subtree of 5, so it must be greater than 5. Comparing 3 only with its parent 6 would have said "fine"; the low bound of 5 carried down from the root is what catches it.',
    },
    mistakes: [
      {
        mistake: 'Validating a BST by checking only that left.val < node.val < right.val at each node.',
        why: 'It passes trees where a grandchild breaks the rule, for example 5 with right child 6 whose left child is 3.',
        fix: 'Pass an allowed open range (low, high) down the recursion, tightening high when you go left and low when you go right.',
      },
      {
        mistake: 'Saying "BST search is O(log n)" in an interview.',
        why: 'It is O(h). That equals log n only when the tree is balanced; a BST built from sorted input is a linked list and search is O(n).',
        fix: 'Say O(h), then add "which is O(log n) when balanced and O(n) when degenerate". Mention that libraries use red-black or AVL trees to guarantee the log bound.',
      },
      {
        mistake: 'Writing low <= node.val <= high in the range check.',
        why: 'The usual definition (and every LeetCode BST problem) forbids duplicates, so an equal value on either side is invalid and <= silently accepts it.',
        fix: 'Use strict comparisons, low < node.val < high, unless the problem explicitly allows duplicates on one side.',
      },
      {
        mistake: 'Building a BST by inserting an already-sorted array one element at a time.',
        why: 'Every value is larger than the last, so it becomes a right-going chain and all operations degrade to O(n).',
        fix: 'Insert the middle element first and recurse on the two halves, or use a self-balancing tree.',
      },
      {
        mistake: 'Collecting the full inorder traversal into a list just to read the kth smallest.',
        why: 'That is O(n) time and O(n) memory even when k is 1, and it throws away the early-exit the BST gives you.',
        fix: 'Count nodes during the inorder walk and stop as soon as the counter reaches k, which is O(h + k).',
      },
    ],
    whenToUse: [
      'The problem says "binary search tree", or that the tree is sorted.',
      'You need ordered operations on a changing set: predecessor, successor, floor, ceiling or a range query.',
      'You need the kth smallest, or the values in sorted order, and an inorder walk gives it for free.',
      'You need "the closest value to x" while values are still being inserted and deleted.',
      'You are handed a sorted array and asked to build a balanced tree from it.',
    ],
    whenNotToUse: [
      'The set never changes and you only search it; a sorted array with binary search is the same O(log n) with better cache behaviour.',
      'You only need membership or counting with no ordering; a hash map gives O(1) on average instead of O(log n).',
      'You only ever need the minimum or maximum of a changing set; a heap is smaller and simpler.',
      'Keys arrive sorted and you cannot shuffle or rebalance; a plain BST degenerates, so use a red-black or AVL tree or your language ordered container.',
      'You need prefix or "starts with" lookups over strings; use a trie.',
    ],
    relatedTopics: [
      { id: 'tree-basics-and-traversals', kind: 'concept', why: 'Inorder traversal is the tool that turns a BST into a sorted sequence.' },
      { id: 'lca-and-paths', kind: 'concept', why: 'LCA in a BST is a single O(h) walk to the first node whose value lies between the two targets.' },
      { id: 'linear-vs-binary-search', kind: 'concept', why: 'A BST is binary search with the halving baked into the shape instead of into index arithmetic.' },
      { id: 'tree-properties', kind: 'concept', why: 'Balance is exactly what keeps h at log n, so it is what makes the O(h) bound useful.' },
      { id: 'binary-search', kind: 'pattern', why: 'Each comparison discards one side, which is the same decision binary search makes on an array.' },
    ],
    quiz: [
      {
        question: 'You insert 1, 2, 3, ..., 1000 into an empty BST in that order and then search for 1000. How many comparisons?',
        options: ['About 1', 'About 10', 'About 1000', 'About 10000'],
        answerIndex: 2,
        explanation: 'Every value is bigger than the last, so the tree is a right-going chain with h = n. O(h) is only O(log n) when the tree is balanced.',
      },
      {
        question: 'Which check correctly validates a binary search tree?',
        options: [
          'Compare every node with its two direct children only',
          'Carry an allowed (low, high) range down from the root and test low < value < high',
          'Check that the root is the median of all values',
          'Check that the tree is height-balanced',
        ],
        answerIndex: 1,
        explanation: 'The rule applies to whole subtrees, so a node must respect the constraints of every ancestor, which is exactly what the range carries.',
      },
      {
        question: 'You need the 3rd smallest key from a BST holding a million nodes. What is the best plan?',
        options: [
          'Inorder traversal that stops after 3 nodes have been counted',
          'Full inorder traversal into a list, then take index 2',
          'Copy all values out and sort them',
          'BFS level order, then take the third value',
        ],
        answerIndex: 0,
        explanation: 'Inorder visits values in increasing order, so counting to k and stopping costs O(h + k) instead of O(n) time and memory.',
      },
      {
        question: 'Why do C++ std::map and Java TreeMap use red-black trees rather than plain BSTs?',
        options: [
          'Red-black trees use less memory per node',
          'Rotations keep the height at O(log n), so worst-case operations stay logarithmic',
          'They allow duplicate keys',
          'They make inorder traversal asymptotically faster',
        ],
        answerIndex: 1,
        explanation: 'A plain BST can degenerate to a chain on sorted input; the red-black colouring rules bound the height at about 2*log2(n).',
      },
      {
        question: 'What are the time and space costs of validating a BST with the range method?',
        options: [
          'O(log n) time, O(1) space',
          'O(n) time, O(h) space',
          'O(n log n) time, O(n) space',
          'O(n^2) time, O(h) space',
        ],
        answerIndex: 1,
        explanation: 'Every node gets one constant-time range test, and the only extra memory is the recursion stack, which is as deep as the tree is tall.',
      },
    ],
    sources: [
      'CLRS ch. 12 (binary search trees) and ch. 13 (red-black trees)',
      'MIT 6.006 lectures on binary search trees and balanced BSTs',
      'VisuAlgo: Binary Search Tree and AVL Tree modules',
      'CP-Algorithms: Treap (balanced binary search tree)',
    ],
    problems: [
      {
        id: 'search-in-a-binary-search-tree',
        title: 'Search in a Binary Search Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/',
        patternId: 'dfs',
        hint: 'Go left when the target is smaller, right when larger, and stop when you find it or hit null.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'convert-sorted-array-to-binary-search-tree',
        title: 'Convert Sorted Array to Binary Search Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/',
        patternId: 'divide-and-conquer',
        hint: 'The middle element is the root; build the left subtree from the left half and the right from the right half.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'insert-into-a-binary-search-tree',
        title: 'Insert into a Binary Search Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/',
        patternId: 'dfs',
        hint: 'Walk down as if searching for the value and attach a new node where you would fall off.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'validate-binary-search-tree',
        title: 'Validate Binary Search Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/',
        patternId: 'dfs',
        hint: 'Carry a (low, high) range down the recursion; a node is valid only if its value is strictly inside it.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'kth-smallest-element-in-a-bst',
        title: 'Kth Smallest Element in a BST',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
        patternId: 'tree-traversal',
        hint: 'Inorder traversal visits values in sorted order; stop as soon as you have visited k nodes.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'delete-node-in-a-bst',
        title: 'Delete Node in a BST',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/delete-node-in-a-bst/',
        patternId: 'dfs',
        hint: 'Find the node; if it has two children, copy in the minimum of the right subtree and delete that minimum instead.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'binary-search-tree-iterator',
        title: 'Binary Search Tree Iterator',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/binary-search-tree-iterator/',
        patternId: 'tree-traversal',
        hint: 'Keep a stack of the leftmost path; on next, pop a node and push the leftmost path of its right child.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'lca-and-paths',
    gateId: 'trees',
    order: 4,
    title: 'Lowest Common Ancestor and Path Problems',
    minutes: 30,
    summary: 'Find the deepest shared ancestor of two nodes, and reason about root-to-leaf and node-to-node paths with one DFS.',
    analogy:
      'Two cousins tracing their family tree upward meet at the nearest shared grandparent; that is the lowest common ancestor. Path problems are similar: you walk down from the root carrying a running total, and every time you reach a leaf you check whether the total is what you wanted.',
    explanation: `Two kinds of questions dominate the harder tree problems. Ancestor questions: given two nodes, what is the lowest node that has both of them below it? Path questions: is there a root-to-leaf path with a given sum, how many paths add up to k, what is the maximum sum of any path? Both are solved with a DFS that either passes information down (running sum) or returns information up (which targets were found).

## The idea

**Lowest common ancestor (LCA)** of p and q is the deepest node that has both p and q in its subtree (a node counts as its own ancestor).

- In a plain binary tree: recurse into both children. If a subtree contains p, it returns p; if it contains q, it returns q. If a node gets a non-null result from both sides, that node is the LCA. If only one side is non-null, pass it up.
- In a BST: walk from the root. If both values are smaller, go left. If both are larger, go right. Otherwise the current node is the split point and therefore the LCA. That is O(h) with no recursion needed.

**Path sums** come in three shapes:

- Root to leaf with target: pass \`remaining = target - node.val\` down; at a leaf check \`remaining == 0\`.
- Any downward path with sum k: prefix sum on the path plus a hash map, exactly like Subarray Sum Equals K, but you must remove the current prefix when backtracking.
- Maximum path sum where a path may bend at a node: postorder DFS. Each call returns the best single-branch gain (never negative), and at each node the best bent path is \`node.val + left_gain + right_gain\`.

## A tiny example

Tree: \`3\` at the root, left \`5\` with children \`6\` and \`2\`, right \`1\` with children \`0\` and \`8\`.

- LCA(6, 2) is 5, because 5 has both below it and neither 6 nor 2 does.
- LCA(5, 1) is 3.
- LCA(6, 5) is 5, since a node is its own ancestor.

## Step by step

The slow way for LCA starts at the root and, for each candidate, runs a full subtree search to ask "is p under my left child? is q?". Each search is O(n) and you may do it at every level, giving O(n * h).

The fast way visits each node once:

\`\`\`python
def lca(root, p, q):
    if root is None or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root
    return left or right
\`\`\`

O(n) time, O(h) space. Read it as: "I found something on both sides, so I am the meeting point."

## Where people go wrong

- Returning early without checking both sides. You must look at both children before deciding.
- For max path sum, letting a negative branch drag the total down. Clamp each branch's contribution at 0 with \`max(0, gain)\`.
- In Path Sum III, forgetting to decrement the prefix count when leaving a node. Paths from different branches would then wrongly combine.

## How to recognise it in an interview

- "Lowest common ancestor", "nearest shared parent", "deepest node that contains both".
- "Root-to-leaf path", "sum of all root-to-leaf numbers", "does a path with sum k exist".
- "Maximum path sum" where the path can start and end anywhere: postorder with a global best.
- "Number of paths that sum to k" going downward: prefix sum plus map with backtracking.`,
    naive: {
      title: 'Search both subtrees at every level',
      description:
        'Starting at the root, ask whether both p and q live in the left subtree (go left), both in the right subtree (go right), or split (answer found). Each question is a full subtree search, repeated at each step down.',
      time: 'O(n * h)',
      space: 'O(h)',
      code: {
        python: `def contains(node, target):
    if node is None:
        return False
    if node is target:
        return True
    return contains(node.left, target) or contains(node.right, target)

def lca_slow(root, p, q):
    node = root
    while node:
        in_left = contains(node.left, p) and contains(node.left, q)
        in_right = contains(node.right, p) and contains(node.right, q)
        if in_left:
            node = node.left
        elif in_right:
            node = node.right
        else:
            return node
    return None`,
        javascript: `function contains(node, target) {
  if (!node) return false;
  if (node === target) return true;
  return contains(node.left, target) || contains(node.right, target);
}

function lcaSlow(root, p, q) {
  let node = root;
  while (node) {
    const inLeft = contains(node.left, p) && contains(node.left, q);
    const inRight = contains(node.right, p) && contains(node.right, q);
    if (inLeft) node = node.left;
    else if (inRight) node = node.right;
    else return node;
  }
  return null;
}`,
        java: `boolean contains(TreeNode node, TreeNode target) {
  if (node == null) return false;
  if (node == target) return true;
  return contains(node.left, target) || contains(node.right, target);
}

public TreeNode lcaSlow(TreeNode root, TreeNode p, TreeNode q) {
  TreeNode node = root;
  while (node != null) {
    boolean inLeft = contains(node.left, p) && contains(node.left, q);
    boolean inRight = contains(node.right, p) && contains(node.right, q);
    if (inLeft) node = node.left;
    else if (inRight) node = node.right;
    else return node;
  }
  return null;
}`,
        cpp: `bool contains(TreeNode* node, TreeNode* target) {
  if (!node) return false;
  if (node == target) return true;
  return contains(node->left, target) || contains(node->right, target);
}

TreeNode* lcaSlow(TreeNode* root, TreeNode* p, TreeNode* q) {
  TreeNode* node = root;
  while (node) {
    bool inLeft = contains(node->left, p) && contains(node->left, q);
    bool inRight = contains(node->right, p) && contains(node->right, q);
    if (inLeft) node = node->left;
    else if (inRight) node = node->right;
    else return node;
  }
  return nullptr;
}`,
      },
    },
    optimized: {
      title: 'Single postorder DFS that bubbles up the found targets',
      description:
        'Recurse into both children. A subtree returns p or q if it contains one of them, or the LCA if it contains both. A node that receives non-null results from both sides is the answer.',
      time: 'O(n)',
      space: 'O(h)',
      code: {
        python: `def lca(root, p, q):
    if root is None or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root
    return left if left else right`,
        javascript: `function lca(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lca(root.left, p, q);
  const right = lca(root.right, p, q);
  if (left && right) return root;
  return left ? left : right;
}`,
        java: `public TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
  if (root == null || root == p || root == q) return root;
  TreeNode left = lca(root.left, p, q);
  TreeNode right = lca(root.right, p, q);
  if (left != null && right != null) return root;
  return left != null ? left : right;
}`,
        cpp: `TreeNode* lca(TreeNode* root, TreeNode* p, TreeNode* q) {
  if (!root || root == p || root == q) return root;
  TreeNode* left = lca(root->left, p, q);
  TreeNode* right = lca(root->right, p, q);
  if (left && right) return root;
  return left ? left : right;
}`,
      },
    },
    whyFaster:
      'The slow version asks "does this subtree contain p and q?" as a fresh full search at each step of the walk, so subtrees are scanned repeatedly. The fast version answers that question for every node as a by-product of one postorder traversal, because each call returns what it found below. One pass replaces h passes.',
    keyPoints: [
      'LCA in a binary tree: recurse both sides; the first node with non-null results from both sides is the answer.',
      'LCA in a BST: walk down until the two values are on different sides of the current node.',
      'Root-to-leaf sums: pass the remaining target down and check it at leaves only.',
      'Any-path maximum: each call returns the best single branch clamped at 0; update the global best with a bent path.',
      'Downward paths with sum k: prefix sums in a map, and undo the entry when you backtrack.',
      'A leaf has no children; a node with one child is not a leaf.',
    ],
    patternIds: ['dfs', 'tree-traversal', 'prefix-sum', 'backtracking'],
    definition:
      'The lowest common ancestor of two nodes p and q is the deepest node that has both of them somewhere in its subtree, where a node counts as an ancestor of itself. A path problem asks about a route through the tree, most often root to leaf, or the best route between any two nodes.',
    coreIdea:
      'A postorder DFS can carry an answer upward: every call reports what it found below it. For LCA each call reports p, q, or nothing, and the first node that hears something back from both sides must be the meeting point, because the two targets are then in different subtrees. One traversal answers the question for every node at once, so the cost drops from one containment search per level, O(n*h), to a single O(n) pass. Path problems use the mirror image: information such as the remaining target flows downward on the way in.',
    visual: [
      {
        caption: 'The tree. We want the lowest common ancestor of 7 and 4.',
        frame: [
          '        3',
          '      /   \\',
          '     5     1',
          '    / \\   / \\',
          '   6   2 0   8',
          '      / \\',
          '     7   4',
        ].join('\n'),
      },
      {
        caption: 'Each call returns what it found. Nulls mean "neither target is down here".',
        frame: [
          'lca(6): not a target, both children null -> null',
          'lca(7): equals a target                 -> 7',
          'lca(4): equals a target                 -> 4',
        ].join('\n'),
      },
      {
        caption: 'Node 2 hears back from both sides, so it is the split point and the answer.',
        frame: [
          'lca(2): left=7  right=4   BOTH  -> 2   <-- LCA',
          'lca(5): left=null right=2       -> 2   (pass up)',
          'lca(0), lca(8), lca(1): nothing -> null',
          'lca(3): left=2  right=null      -> 2',
          '',
          'answer 2, found in one pass over 8 nodes',
        ].join('\n'),
      },
      {
        caption: 'LCA(5, 4): a node is its own ancestor, so the recursion stops at 5.',
        frame: [
          'lca(5): node IS a target -> return 5, do not look',
          '                            below it at all',
          'lca(1): finds nothing    -> null',
          'lca(3): left=5 right=null -> 5',
          '',
          'answer 5, even though 4 is inside 5 subtree',
        ].join('\n'),
      },
      {
        caption: 'Path sum with target 17: subtract on the way down, test only at a leaf.',
        frame: [
          'at 3:  rem = 17 - 3 = 14   not a leaf, go left',
          'at 5:  rem = 14 - 5 =  9   not a leaf, go left',
          'at 2:  rem =  9 - 2 =  7   not a leaf, go left',
          'at 7:  rem =  7 - 7 =  0   LEAF and rem = 0 -> yes',
          '',
          'path 3 -> 5 -> 2 -> 7 sums to 17',
        ].join('\n'),
      },
    ],
    pseudocode: `function lca(node, p, q):
    if node is null: return null
    if node = p or node = q:
        return node                  // found one, stop digging
    left  = lca(node.left,  p, q)
    right = lca(node.right, p, q)
    if left is not null and right is not null:
        return node                  // targets split here
    if left is not null: return left
    return right                     // may be null

function lcaInBST(node, p, q):
    while node is not null:
        if p.value < node.value and q.value < node.value:
            node = node.left
        else if p.value > node.value and q.value > node.value:
            node = node.right
        else:
            return node              // the split point

function hasPathSum(node, remaining):
    if node is null: return false
    remaining = remaining - node.value
    if node.left is null and node.right is null:
        return remaining = 0         // test at a LEAF only
    return hasPathSum(node.left,  remaining)
        or hasPathSum(node.right, remaining)`,
    complexity: [
      { label: 'LCA in a binary tree, one DFS', time: 'O(n)', space: 'O(h)', note: 'every node visited once; the stack holds the current path' },
      { label: 'LCA in a BST, walk down', time: 'O(h)', space: 'O(1)', note: 'log n when balanced, n when the BST is a chain' },
      { label: 'Root-to-leaf path sum', time: 'O(n)', space: 'O(h)', note: 'one subtraction per node, answer checked at leaves' },
      { label: 'Count downward paths summing to k', time: 'O(n)', space: 'O(h)', note: 'prefix-sum map holds only the current root path' },
      { label: 'Naive LCA: containment check per level', time: 'O(n*h)', space: 'O(h)', note: 'each step rescans a whole subtree' },
    ],
    dryRun: {
      input: 'Tree: 3 with children 5 and 1; 5 has children 6 and 2; 2 has children 7 and 4; 1 has children 0 and 8. p is node 7, q is node 4.',
      goal: 'Find the lowest common ancestor with the single-pass code above.',
      steps: [
        { state: 'node=3', action: '3 is not null and is neither target, so it recurses into 5 first.' },
        { state: 'node=6', action: '6 is not a target and both children are None, so both sides return None and 6 returns None.' },
        { state: 'node=7', action: '7 is p, so the function returns 7 straight away without looking below it.' },
        { state: 'node=4', action: '4 is q, so it returns 4 the same way.' },
        { state: 'node=2 left=7 right=4', action: 'Both sides came back non-null, so 2 is where the targets split and 2 returns itself.' },
        { state: 'node=5 left=None right=2', action: 'Only one side found anything, so 5 passes 2 upward unchanged.' },
        { state: 'node=1 subtree', action: '0, 8 and 1 contain neither target, so the whole right side of the root returns None.' },
        { state: 'node=3 left=2 right=None', action: 'Only the left side is non-null, so 3 also passes 2 upward.' },
      ],
      result: 'The answer is node 2. It is the deepest node with 7 in one subtree and 4 in the other; every node above 2 sees both targets on the same side, which is exactly the test the code performs.',
    },
    mistakes: [
      {
        mistake: 'Continuing to search below a node that already equals p.',
        why: 'If q happens to sit inside the subtree of p, the deeper call returns q and you report q instead of p.',
        fix: 'Return the node the moment it matches either target. A node is its own ancestor, so p is the correct answer in that case.',
      },
      {
        mistake: 'Checking remaining == 0 at every node instead of only at a leaf.',
        why: 'It reports success halfway down a path, which is not a root-to-leaf path at all.',
        fix: 'Test the remainder only when node.left is None and node.right is None.',
      },
      {
        mistake: 'Treating "node is None" as the leaf case, as in "if node is None: return remaining == 0".',
        why: 'A node with exactly one child has a missing side, so the missing side is mistaken for a leaf and a partial path gets accepted.',
        fix: 'A leaf is a node with no children at all. Check both child pointers explicitly.',
      },
      {
        mistake: 'In Path Sum III, forgetting to remove the current prefix from the map when the recursion returns.',
        why: 'The map then holds prefixes from sibling branches, so it counts paths that do not lie on one downward line.',
        fix: 'Decrement the count for the current prefix after both recursive calls, exactly like undoing a move in backtracking.',
      },
      {
        mistake: 'In Binary Tree Maximum Path Sum, returning node.val + left + right to the parent.',
        why: 'That value describes a path that already bends at this node, so the parent cannot extend it without visiting a node twice.',
        fix: 'Return node.val plus the better single branch, with negative gains clamped to 0, and use the bent sum only to update the global best.',
      },
    ],
    whenToUse: [
      'The statement mentions ancestors, a "closest shared parent", or the distance between two nodes.',
      'You need a root-to-leaf property: a sum, a number built digit by digit, or a count of matching paths.',
      'A path may bend at a node ("from any node to any node"), which calls for postorder plus a global best.',
      'You must count downward paths adding up to k, which is prefix sums applied to the current root path.',
      'Information must travel down (target so far, max seen so far) and an answer must travel back up.',
    ],
    whenNotToUse: [
      'You must answer many LCA queries on a static tree; preprocess with binary lifting or an Euler tour plus sparse table for O(log n) or O(1) per query.',
      'The tree is a BST; the O(h) walk to the split point is simpler and uses O(1) space.',
      'The structure has cycles or several parents; that is a graph, so use BFS/DFS with a visited set or union-find.',
      'You need a shortest path with weights; use Dijkstra or BFS on a graph, not tree recursion.',
      'Nodes carry parent pointers and you have a single query; walk up from both nodes and use a set of seen ancestors.',
    ],
    relatedTopics: [
      { id: 'tree-properties', kind: 'concept', why: 'Maximum path sum uses the same shape as diameter: return one branch upward, update a global best at each node.' },
      { id: 'binary-search-tree', kind: 'concept', why: 'In a BST the LCA is just the first node whose value falls between the two targets.' },
      { id: 'prefix-sums', kind: 'concept', why: 'Counting downward paths that sum to k is Subarray Sum Equals K applied to the current root-to-node path.' },
      { id: 'backtracking', kind: 'pattern', why: 'Path lists and prefix maps must be undone when the recursion returns from a node.' },
      { id: 'dfs', kind: 'pattern', why: 'Both families are one depth-first walk with work done on the way in or on the way out.' },
    ],
    quiz: [
      {
        question: 'While searching for LCA(p, q) the recursion reaches node p. What should that call return?',
        options: [
          'null, because we still have not found q',
          'p itself, without searching below it',
          'q, because q must be deeper',
          'Whatever the left child returns',
        ],
        answerIndex: 1,
        explanation: 'A node is its own ancestor, so if q lies below p then p is already the lowest common ancestor and digging further would return q by mistake.',
      },
      {
        question: 'What does the one-pass LCA cost on a tree with n nodes and height h?',
        options: ['O(log n) time', 'O(n) time and O(h) space', 'O(n log n) time', 'O(n*h) time'],
        answerIndex: 1,
        explanation: 'Each node is visited exactly once with constant work, and the only extra memory is the recursion stack along the current path.',
      },
      {
        question: 'The tree is a BST with a million nodes and you need the LCA of two keys. What is the best plan?',
        options: [
          'The general postorder DFS, which is O(n)',
          'Walk down from the root until the two keys fall on different sides, which is O(h)',
          'Copy all values into a sorted array first',
          'BFS level by level until both keys are seen',
        ],
        answerIndex: 1,
        explanation: 'The ordering rule tells you which side both keys are on, so you can descend directly without ever exploring a subtree that holds neither.',
      },
      {
        question: 'In Path Sum you write "if node is None: return remaining == 0". What goes wrong?',
        options: [
          'Nothing, it is equivalent',
          'A node with exactly one child is treated as a leaf, so a path that has not reached a leaf can be accepted',
          'The recursion never terminates',
          'The complexity becomes O(n^2)',
        ],
        answerIndex: 1,
        explanation: 'The missing child of a one-child node hits the None branch, so the remainder is tested at a point that is not the end of a root-to-leaf path.',
      },
      {
        question: 'In Binary Tree Maximum Path Sum, what should a recursive call return to its parent?',
        options: [
          'The node value plus both child gains',
          'The node value plus the better of the two child gains, with negative gains clamped to 0',
          'The current global best',
          'The larger of the two child gains, ignoring the node value',
        ],
        answerIndex: 1,
        explanation: 'The parent can only extend a straight branch, so a bent path cannot be passed up; clamping at 0 lets a harmful branch be dropped entirely.',
      },
    ],
    sources: [
      'CLRS ch. 12 and ch. 22',
      'MIT 6.006 lectures on trees and depth-first search',
      'CP-Algorithms: Lowest Common Ancestor (binary lifting and Euler tour)',
      'LeetCode editorials for Lowest Common Ancestor of a Binary Tree and Path Sum III',
    ],
    problems: [
      {
        id: 'path-sum',
        title: 'Path Sum',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/path-sum/',
        patternId: 'dfs',
        hint: 'Subtract the node value from the target as you go down and check for zero only at a leaf.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'lowest-common-ancestor-of-a-binary-search-tree',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
        patternId: 'dfs',
        hint: 'Move left while both values are smaller, right while both are larger; stop at the split point.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'lowest-common-ancestor-of-a-binary-tree',
        title: 'Lowest Common Ancestor of a Binary Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
        patternId: 'dfs',
        hint: 'Return the node if it is p or q; otherwise a node that hears back from both children is the answer.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'path-sum-ii',
        title: 'Path Sum II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/path-sum-ii/',
        patternId: 'backtracking',
        hint: 'Carry the current path in a list; append on the way down, record it at a matching leaf, pop on the way back.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'sum-root-to-leaf-numbers',
        title: 'Sum Root to Leaf Numbers',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/',
        patternId: 'dfs',
        hint: 'Pass the number built so far as current times 10 plus the node value; add it to the total at leaves.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'path-sum-iii',
        title: 'Path Sum III',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/path-sum-iii/',
        patternId: 'prefix-sum',
        hint: 'Keep a map of prefix sums along the current root path and remove the current prefix when you return from a node.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'binary-tree-maximum-path-sum',
        title: 'Binary Tree Maximum Path Sum',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
        patternId: 'dfs',
        hint: 'Each call returns node value plus the better child gain (clamped at 0); update the global best with both gains added.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },
]
