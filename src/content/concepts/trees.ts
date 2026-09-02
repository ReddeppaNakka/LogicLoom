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
    problems: [
      {
        id: 'binary-tree-inorder-traversal',
        title: 'Binary Tree Inorder Traversal',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
        patternId: 'tree-traversal',
        hint: 'Recurse left, append the node, recurse right; then try it again with an explicit stack.',
        xp: 20,
      },
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/invert-binary-tree/',
        patternId: 'dfs',
        hint: 'Swap left and right at the current node, then invert both children.',
        xp: 20,
      },
      {
        id: 'binary-tree-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        patternId: 'bfs',
        hint: 'Use a queue and process len(queue) nodes per round so each round is exactly one level.',
        xp: 40,
      },
      {
        id: 'binary-tree-right-side-view',
        title: 'Binary Tree Right Side View',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/binary-tree-right-side-view/',
        patternId: 'bfs',
        hint: 'Do a level-order traversal and keep only the last node of each level.',
        xp: 40,
      },
      {
        id: 'binary-tree-zigzag-level-order-traversal',
        title: 'Binary Tree Zigzag Level Order Traversal',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/',
        patternId: 'bfs',
        hint: 'Normal BFS, but reverse every other level before adding it to the answer.',
        xp: 40,
      },
      {
        id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
        title: 'Construct Binary Tree from Preorder and Inorder Traversal',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
        patternId: 'divide-and-conquer',
        hint: 'The first preorder value is the root; find it in inorder to split the left and right subtrees, then recurse.',
        xp: 40,
      },
      {
        id: 'serialize-and-deserialize-binary-tree',
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
        patternId: 'dfs',
        hint: 'Write a preorder walk that records "null" for missing children; rebuild by reading tokens in the same order.',
        xp: 80,
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
    problems: [
      {
        id: 'maximum-depth-of-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        patternId: 'dfs',
        hint: 'Depth of a node is 1 plus the larger depth of its two children; an empty tree has depth 0.',
        xp: 20,
      },
      {
        id: 'same-tree',
        title: 'Same Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/same-tree/',
        patternId: 'dfs',
        hint: 'Both null means same; one null means different; otherwise compare values and recurse on both pairs of children.',
        xp: 20,
      },
      {
        id: 'balanced-binary-tree',
        title: 'Balanced Binary Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/balanced-binary-tree/',
        patternId: 'dfs',
        hint: 'Compute height bottom-up and return -1 as soon as any node has children whose heights differ by more than 1.',
        xp: 20,
      },
      {
        id: 'diameter-of-binary-tree',
        title: 'Diameter of Binary Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
        patternId: 'dfs',
        hint: 'At each node the longest path through it is left height plus right height; track the maximum while returning height.',
        xp: 20,
      },
      {
        id: 'subtree-of-another-tree',
        title: 'Subtree of Another Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/subtree-of-another-tree/',
        patternId: 'dfs',
        hint: 'At every node of the big tree, run a Same Tree check against the small tree.',
        xp: 20,
      },
      {
        id: 'count-good-nodes-in-binary-tree',
        title: 'Count Good Nodes in Binary Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/',
        patternId: 'dfs',
        hint: 'Pass the maximum value seen on the path so far down the recursion and count nodes that are at least that value.',
        xp: 40,
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
    problems: [
      {
        id: 'search-in-a-binary-search-tree',
        title: 'Search in a Binary Search Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/',
        patternId: 'dfs',
        hint: 'Go left when the target is smaller, right when larger, and stop when you find it or hit null.',
        xp: 20,
      },
      {
        id: 'convert-sorted-array-to-binary-search-tree',
        title: 'Convert Sorted Array to Binary Search Tree',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/',
        patternId: 'divide-and-conquer',
        hint: 'The middle element is the root; build the left subtree from the left half and the right from the right half.',
        xp: 20,
      },
      {
        id: 'insert-into-a-binary-search-tree',
        title: 'Insert into a Binary Search Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/',
        patternId: 'dfs',
        hint: 'Walk down as if searching for the value and attach a new node where you would fall off.',
        xp: 40,
      },
      {
        id: 'validate-binary-search-tree',
        title: 'Validate Binary Search Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/',
        patternId: 'dfs',
        hint: 'Carry a (low, high) range down the recursion; a node is valid only if its value is strictly inside it.',
        xp: 40,
      },
      {
        id: 'kth-smallest-element-in-a-bst',
        title: 'Kth Smallest Element in a BST',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
        patternId: 'tree-traversal',
        hint: 'Inorder traversal visits values in sorted order; stop as soon as you have visited k nodes.',
        xp: 40,
      },
      {
        id: 'delete-node-in-a-bst',
        title: 'Delete Node in a BST',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/delete-node-in-a-bst/',
        patternId: 'dfs',
        hint: 'Find the node; if it has two children, copy in the minimum of the right subtree and delete that minimum instead.',
        xp: 40,
      },
      {
        id: 'binary-search-tree-iterator',
        title: 'Binary Search Tree Iterator',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/binary-search-tree-iterator/',
        patternId: 'tree-traversal',
        hint: 'Keep a stack of the leftmost path; on next, pop a node and push the leftmost path of its right child.',
        xp: 40,
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
    problems: [
      {
        id: 'path-sum',
        title: 'Path Sum',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/path-sum/',
        patternId: 'dfs',
        hint: 'Subtract the node value from the target as you go down and check for zero only at a leaf.',
        xp: 20,
      },
      {
        id: 'lowest-common-ancestor-of-a-binary-search-tree',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
        patternId: 'dfs',
        hint: 'Move left while both values are smaller, right while both are larger; stop at the split point.',
        xp: 40,
      },
      {
        id: 'lowest-common-ancestor-of-a-binary-tree',
        title: 'Lowest Common Ancestor of a Binary Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
        patternId: 'dfs',
        hint: 'Return the node if it is p or q; otherwise a node that hears back from both children is the answer.',
        xp: 40,
      },
      {
        id: 'path-sum-ii',
        title: 'Path Sum II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/path-sum-ii/',
        patternId: 'backtracking',
        hint: 'Carry the current path in a list; append on the way down, record it at a matching leaf, pop on the way back.',
        xp: 40,
      },
      {
        id: 'sum-root-to-leaf-numbers',
        title: 'Sum Root to Leaf Numbers',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/',
        patternId: 'dfs',
        hint: 'Pass the number built so far as current times 10 plus the node value; add it to the total at leaves.',
        xp: 40,
      },
      {
        id: 'path-sum-iii',
        title: 'Path Sum III',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/path-sum-iii/',
        patternId: 'prefix-sum',
        hint: 'Keep a map of prefix sums along the current root path and remove the current prefix when you return from a node.',
        xp: 40,
      },
      {
        id: 'binary-tree-maximum-path-sum',
        title: 'Binary Tree Maximum Path Sum',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
        patternId: 'dfs',
        hint: 'Each call returns node value plus the better child gain (clamped at 0); update the global best with both gains added.',
        xp: 80,
      },
    ],
  },
]
