import type { Concept } from '../types'

export const concepts: Concept[] = [
  // -------------------------------------------------------------------------
  // 1. Graph representation, BFS and DFS
  // -------------------------------------------------------------------------
  {
    id: 'graph-representation-bfs-dfs',
    gateId: 'graphs',
    order: 1,
    title: 'Graphs: Representation, BFS and DFS',
    minutes: 30,
    summary: 'Store a network as an adjacency list, then walk it ring by ring (BFS) or path by path (DFS).',
    analogy:
      'A city map is a graph: crossings are nodes and streets are edges. BFS is how a rumour spreads, reaching every neighbour before going one block further. DFS is one person walking down a street as far as it goes, then turning back to try the next turn they skipped.',
    explanation: `A graph is a set of things (nodes) plus the connections between them (edges). Cities and roads, people and friendships, courses and prerequisites. Almost every "network" problem in interviews is a graph in disguise, and two walks, BFS and DFS, solve most of them.

## The idea
- **Node** (also called vertex): one item. **Edge**: a link between two nodes.
- **Undirected**: the link works both ways (friendship). **Directed**: one way only (a "follows" on social media).
- **Weighted**: every edge has a cost (road length). **Unweighted**: every edge costs the same.

Store the graph as an **adjacency list**: a dictionary that maps each node to the list of its neighbours. It uses O(V + E) memory (V = nodes, E = edges) and lets you loop over only the neighbours that really exist.

\`\`\`python
edges = [(0, 1), (0, 2), (1, 3)]
adj = {i: [] for i in range(4)}
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)   # remove this line for a directed graph
\`\`\`

The other option is an **adjacency matrix**: a V x V table of 0/1. Asking "is u linked to v?" is O(1), but it costs O(V^2) memory and O(V) just to list one node's neighbours. Use the list unless the graph is tiny or almost fully connected.

## BFS: explore in rings
Breadth-first search starts at one node, visits everything 1 step away, then everything 2 steps away, and so on. It uses a queue. Because it goes ring by ring, the first time BFS touches a node it has found the shortest path to it (counted in edges).

\`\`\`python
from collections import deque

def bfs(adj, start):
    seen = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nxt in adj[node]:
            if nxt not in seen:
                seen.add(nxt)      # mark when you push, not when you pop
                q.append(nxt)
    return seen
\`\`\`

## DFS: go deep, then back up
Depth-first search follows one path as far as it can, then backtracks and tries the next branch. It uses recursion (or your own stack). DFS is the natural choice for "is there any path", "count the groups", "detect a cycle", or "collect everything reachable".

\`\`\`python
def dfs(adj, node, seen):
    seen.add(node)
    for nxt in adj[node]:
        if nxt not in seen:
            dfs(adj, nxt, seen)
\`\`\`

## A tiny example
Edges 0-1, 0-2, 1-3. Start at node 0.
- BFS order: 0, then 1 and 2, then 3.
- DFS order: 0, 1, 3, back up to 0, then 2.
Both visit all four nodes; only the order differs.

## Slow versus fast
- Slow: a matrix plus "for each node, scan every column" is O(V^2) per walk, even when the graph has only a handful of edges.
- Fast: an adjacency list makes the same walk O(V + E). With 10,000 nodes and 20,000 edges that is about 30,000 steps instead of 100,000,000.
- The \`seen\` set is not optional. Without it, any cycle makes the walk loop forever.

## Where people go wrong
- Marking a node as seen when you pop it instead of when you push it. The same node gets queued many times and the queue explodes.
- Forgetting that a graph can be disconnected. To visit everything, loop over all nodes and start a new walk from each unseen one.
- Deep recursion. Python's default limit is about 1000 frames. For long chains use BFS or an explicit stack.

## How to recognise it in an interview
- Words like "connected", "reachable", "neighbours", "network", "friends of friends".
- "Fewest steps / moves" with equal-cost moves: BFS.
- "Does a path exist", "count groups", "copy the structure": DFS.`,
    naive: {
      title: 'Adjacency matrix with full row scans',
      description:
        'Build a V x V table of 0/1 and, for every node you visit, scan the whole row to find its neighbours. It works, but each node costs O(V) even if it has one neighbour, and the table alone needs V^2 cells.',
      time: 'O(V^2)',
      space: 'O(V^2)',
      code: {
        python: `from collections import deque

def bfs_matrix(n, edges, start):
    matrix = [[0] * n for _ in range(n)]
    for u, v in edges:
        matrix[u][v] = 1
        matrix[v][u] = 1
    seen = [False] * n
    seen[start] = True
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in range(n):          # scans every column
            if matrix[node][nxt] and not seen[nxt]:
                seen[nxt] = True
                q.append(nxt)
    return order`,
        javascript: `function bfsMatrix(n, edges, start) {
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [u, v] of edges) {
    matrix[u][v] = 1;
    matrix[v][u] = 1;
  }
  const seen = new Array(n).fill(false);
  seen[start] = true;
  const queue = [start];
  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (let nxt = 0; nxt < n; nxt++) {      // scans every column
      if (matrix[node][nxt] === 1 && !seen[nxt]) {
        seen[nxt] = true;
        queue.push(nxt);
      }
    }
  }
  return order;
}`,
        java: `import java.util.*;

class Solution {
  public List<Integer> bfsMatrix(int n, int[][] edges, int start) {
    int[][] matrix = new int[n][n];
    for (int[] e : edges) {
      matrix[e[0]][e[1]] = 1;
      matrix[e[1]][e[0]] = 1;
    }
    boolean[] seen = new boolean[n];
    seen[start] = true;
    Deque<Integer> q = new ArrayDeque<>();
    q.add(start);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
      int node = q.poll();
      order.add(node);
      for (int nxt = 0; nxt < n; nxt++) {      // scans every column
        if (matrix[node][nxt] == 1 && !seen[nxt]) {
          seen[nxt] = true;
          q.add(nxt);
        }
      }
    }
    return order;
  }
}`,
        cpp: `#include <vector>
#include <queue>
using namespace std;

vector<int> bfsMatrix(int n, vector<pair<int,int>>& edges, int start) {
  vector<vector<int>> matrix(n, vector<int>(n, 0));
  for (auto& e : edges) {
    matrix[e.first][e.second] = 1;
    matrix[e.second][e.first] = 1;
  }
  vector<bool> seen(n, false);
  seen[start] = true;
  queue<int> q;
  q.push(start);
  vector<int> order;
  while (!q.empty()) {
    int node = q.front(); q.pop();
    order.push_back(node);
    for (int nxt = 0; nxt < n; nxt++) {        // scans every column
      if (matrix[node][nxt] == 1 && !seen[nxt]) {
        seen[nxt] = true;
        q.push(nxt);
      }
    }
  }
  return order;
}`,
      },
    },
    optimized: {
      title: 'Adjacency list with BFS',
      description:
        'Map each node to a list of its real neighbours. A walk then touches every node once and every edge at most twice, and the memory grows with the number of edges, not with V squared.',
      time: 'O(V + E)',
      space: 'O(V + E)',
      code: {
        python: `from collections import deque

def bfs_list(n, edges, start):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = [False] * n
    seen[start] = True
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in adj[node]:         # only real neighbours
            if not seen[nxt]:
                seen[nxt] = True
                q.append(nxt)
    return order`,
        javascript: `function bfsList(n, edges, start) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const seen = new Array(n).fill(false);
  seen[start] = true;
  const queue = [start];
  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const nxt of adj[node]) {           // only real neighbours
      if (!seen[nxt]) {
        seen[nxt] = true;
        queue.push(nxt);
      }
    }
  }
  return order;
}`,
        java: `import java.util.*;

class Solution {
  public List<Integer> bfsList(int n, int[][] edges, int start) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
      adj.get(e[0]).add(e[1]);
      adj.get(e[1]).add(e[0]);
    }
    boolean[] seen = new boolean[n];
    seen[start] = true;
    Deque<Integer> q = new ArrayDeque<>();
    q.add(start);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
      int node = q.poll();
      order.add(node);
      for (int nxt : adj.get(node)) {         // only real neighbours
        if (!seen[nxt]) {
          seen[nxt] = true;
          q.add(nxt);
        }
      }
    }
    return order;
  }
}`,
        cpp: `#include <vector>
#include <queue>
using namespace std;

vector<int> bfsList(int n, vector<pair<int,int>>& edges, int start) {
  vector<vector<int>> adj(n);
  for (auto& e : edges) {
    adj[e.first].push_back(e.second);
    adj[e.second].push_back(e.first);
  }
  vector<bool> seen(n, false);
  seen[start] = true;
  queue<int> q;
  q.push(start);
  vector<int> order;
  while (!q.empty()) {
    int node = q.front(); q.pop();
    order.push_back(node);
    for (int nxt : adj[node]) {                // only real neighbours
      if (!seen[nxt]) {
        seen[nxt] = true;
        q.push(nxt);
      }
    }
  }
  return order;
}`,
      },
    },
    whyFaster:
      'The matrix version pays O(V) per node to discover neighbours, so a full walk is O(V^2) no matter how sparse the graph is. The adjacency list only stores edges that exist, so the walk costs O(V + E). Most interview graphs are sparse (E is close to V), which makes the list version roughly V times faster and V times smaller.',
    keyPoints: [
      'Adjacency list = dict/array of neighbour lists. Build it first, in O(V + E).',
      'BFS uses a queue and explores in rings. First arrival = shortest path in edge count.',
      'DFS uses recursion or a stack and explores one path fully before backing up.',
      'Mark a node as seen when you push it, never when you pop it.',
      'Graphs can be disconnected: loop over all nodes and start from every unseen one.',
      'Watch recursion depth in Python; switch to an explicit stack for long chains.',
    ],
    definition:
      'A graph is a set of nodes plus a set of edges that join pairs of them. BFS and DFS are the two standard walks over a graph: BFS visits nodes in order of distance from the start using a queue, while DFS follows one path to its end before backing up, using recursion or a stack.',
    coreIdea:
      'Once a node is marked as seen, visiting it again can never tell you anything new, because everything reachable from it is already queued or already walked. That single rule turns a search that could loop forever into one that touches every node once and every edge once. The cost drops from trying every possible path, which grows exponentially, to O(V + E).',
    visual: [
      {
        caption: 'Five nodes and five edges, stored as an adjacency list.',
        frame: [
          'edges: 0-1  0-2  1-3  2-3  3-4',
          '',
          '  0 --- 1        adjacency list',
          '  |     |        0 -> [1, 2]',
          '  2 --- 3        1 -> [0, 3]',
          '        |        2 -> [0, 3]',
          '        4        3 -> [1, 2, 4]',
          '                 4 -> [3]',
        ].join('\n'),
      },
      {
        caption: 'BFS starts at node 0: mark it seen, then push it.',
        frame: [
          'start = 0',
          'queue   : [0]',
          'visited : {0}',
          'dist    : 0:0',
          'order   : []',
        ].join('\n'),
      },
      {
        caption: 'Pop 0. Neighbours 1 and 2 are both new, so mark and push both.',
        frame: [
          'pop 0  ->  push 1, push 2',
          'queue   : [1, 2]',
          'visited : {0, 1, 2}',
          'dist    : 0:0  1:1  2:1',
          'order   : [0]',
        ].join('\n'),
      },
      {
        caption: 'Pop 1. Neighbour 0 is already seen; neighbour 3 is new.',
        frame: [
          'pop 1  ->  0 seen, push 3',
          'queue   : [2, 3]',
          'visited : {0, 1, 2, 3}',
          'dist    : 0:0  1:1  2:1  3:2',
          'order   : [0, 1]',
        ].join('\n'),
      },
      {
        caption: 'Pop 2. Both its neighbours are seen, so nothing is pushed. This test is what stops the cycle 0-1-3-2-0 from looping.',
        frame: [
          'pop 2  ->  0 seen, 3 seen, push nothing',
          'queue   : [3]',
          'visited : {0, 1, 2, 3}   (unchanged)',
          'dist    : 0:0  1:1  2:1  3:2',
          'order   : [0, 1, 2]',
        ].join('\n'),
      },
      {
        caption: 'Pop 3 and push 4, then pop 4. The queue empties and the walk ends.',
        frame: [
          'pop 3  ->  push 4       pop 4  ->  nothing new',
          'queue   : [4]    then   []',
          'visited : {0, 1, 2, 3, 4}',
          'dist    : 0:0  1:1  2:1  3:2  4:3',
          'order   : [0, 1, 2, 3, 4]',
        ].join('\n'),
      },
    ],
    pseudocode: `function buildAdjacency(n, edgeList):
    adj = array of n empty lists
    for each (u, v) in edgeList:
        add v to adj[u]
        add u to adj[v]            // drop this line if the graph is directed
    return adj

function bfs(adj, start):
    visited = set containing start     // mark on push, never on pop
    dist[start] = 0
    queue = queue holding start
    while queue is not empty:
        node = remove from the front of queue
        for each nxt in adj[node]:
            if nxt is not in visited:
                add nxt to visited
                dist[nxt] = dist[node] + 1
                add nxt to the back of queue
    return dist

function dfs(adj, node, visited):
    add node to visited
    for each nxt in adj[node]:
        if nxt is not in visited:
            dfs(adj, nxt, visited)`,
    complexity: [
      {
        label: 'Build the adjacency list',
        time: 'O(V + E)',
        space: 'O(V + E)',
        note: 'one pass over the edge list',
      },
      {
        label: 'BFS or DFS walk (adjacency list)',
        time: 'O(V + E)',
        space: 'O(V)',
        note: 'each node once, each edge twice in an undirected graph',
      },
      {
        label: 'BFS or DFS walk (adjacency matrix)',
        time: 'O(V^2)',
        space: 'O(V^2)',
        note: 'every visited node scans all V columns',
      },
      {
        label: 'Test whether u and v share an edge',
        time: 'O(degree of u) with a list, O(1) with a matrix',
        space: 'O(1)',
        note: 'the one question a matrix answers faster',
      },
    ],
    dryRun: {
      input: 'n = 5, edges = [(0,1), (0,2), (1,3), (2,3), (3,4)], start = 0',
      goal: 'Visit every node reachable from 0 exactly once and record the order, following bfs_list from the optimised code.',
      steps: [
        {
          state: 'adj = [[1,2], [0,3], [0,3], [1,2,4], [3]]  seen = [T,F,F,F,F]  q = [0]  order = []',
          action: 'The loop over the edge list builds the adjacency list, then node 0 is marked seen and pushed.',
        },
        {
          state: 'node = 0  q = []  order = [0]',
          action: 'Pop 0 and record it. Neighbours 1 and 2 are unseen, so mark both and push both.',
        },
        {
          state: 'seen = [T,T,T,F,F]  q = [1, 2]  order = [0]',
          action: 'The queue now holds the whole ring at distance 1. Marking happened at push time, so neither node can be queued twice.',
        },
        {
          state: 'node = 1  q = [2]  order = [0, 1]',
          action: 'Pop 1. Neighbour 0 is seen and skipped; neighbour 3 is new, so mark it and push it.',
        },
        {
          state: 'seen = [T,T,T,T,F]  q = [2, 3]  order = [0, 1]',
          action: 'Node 3 sits in the queue exactly once even though both 1 and 2 point at it.',
        },
        {
          state: 'node = 2  q = [3]  order = [0, 1, 2]',
          action: 'Pop 2. Its neighbours 0 and 3 are both seen, so nothing is pushed. Without this test the cycle 0-1-3-2-0 would run forever.',
        },
        {
          state: 'node = 3  q = []  order = [0, 1, 2, 3]',
          action: 'Pop 3. Neighbours 1 and 2 are seen; 4 is new, so mark it and push it.',
        },
        {
          state: 'node = 4  q = []  order = [0, 1, 2, 3, 4]',
          action: 'Pop 4. Its only neighbour 3 is seen, the queue is now empty, and the while loop ends.',
        },
      ],
      result:
        'order = [0, 1, 2, 3, 4]. Every node appears exactly once, and they come out ring by ring: 0 at distance 0, then 1 and 2 at distance 1, then 3 at distance 2, then 4 at distance 3. We know nothing was missed because seen is True everywhere.',
    },
    mistakes: [
      {
        mistake: 'Marking a node as seen when you pop it instead of when you push it.',
        why: 'A node with five unseen neighbours can be pushed five times before it is ever popped, so the queue grows far past V and the same subtree is expanded again and again.',
        fix: 'Add the node to the visited set on the same line where you push it. Then a node sits in the queue at most once.',
      },
      {
        mistake: 'Using a plain list as the queue and calling queue.pop(0).',
        why: 'Removing the first element of a Python list shifts every other element, so each pop is O(V) and the whole BFS becomes O(V^2). On 100,000 nodes that is the difference between instant and a timeout.',
        fix: 'Use collections.deque with popleft(), or keep an integer head index into a list and never remove anything.',
      },
      {
        mistake: 'Appending only adj[u].append(v) when the edges are undirected.',
        why: 'Half the graph becomes invisible. A walk from one side reaches nodes that a walk from the other side cannot, so connectivity answers are wrong in a way that tiny test cases often hide.',
        fix: 'For an undirected edge append in both directions, and write the two lines together so you cannot forget one.',
      },
      {
        mistake: 'Running a single BFS from node 0 and assuming everything was visited.',
        why: 'A graph can be disconnected. Nodes in other components are never reached, so counts of components and "can everyone be reached" checks come out wrong.',
        fix: 'Loop i from 0 to V-1 and start a fresh walk from every i that is still unseen. The number of starts is the number of components.',
      },
      {
        mistake: 'Recursive DFS on a long chain in Python.',
        why: 'The default recursion limit is about 1000 frames, so a path of 100,000 nodes raises RecursionError even though the algorithm itself is correct.',
        fix: 'Use BFS, or rewrite the DFS as a loop with an explicit stack. Raising the recursion limit is fragile and can crash the interpreter.',
      },
    ],
    whenToUse: [
      'The input is an edge list, a neighbour list, or a matrix saying who is connected to whom.',
      'The question is "is there a path", "how many groups", or "can everything be reached".',
      'Fewest moves or fewest steps where every move costs exactly the same: BFS.',
      'You must reach, copy or colour everything connected to a start node: DFS.',
      'Levels matter, such as friends of friends or words that differ by one letter: BFS ring by ring.',
    ],
    whenNotToUse: [
      'Edges have different costs and you want the cheapest route: BFS counts edges, so use Dijkstra.',
      'The graph is directed with prerequisites and you need a valid order: use topological sort.',
      'Edges arrive one at a time and you must answer connectivity in between: a fresh BFS per query costs O(V + E) each, use union-find.',
      'You must count or optimise over paths in a DAG with heavy overlap: use DP over a topological order, not a raw DFS.',
      'The graph is nearly complete and you only ever test single edges: an adjacency matrix answers that in O(1).',
    ],
    relatedTopics: [
      { id: 'bfs', kind: 'pattern', why: 'BFS is the queue half of this concept and the base for every unweighted shortest-path problem.' },
      { id: 'dfs', kind: 'pattern', why: 'DFS is the recursion half and the base for cycle detection and component counting.' },
      { id: 'grid-graphs', kind: 'concept', why: 'A grid is the same walk with neighbours computed from row and column offsets instead of stored in a list.' },
      { id: 'tree-basics-and-traversals', kind: 'concept', why: 'A tree is a graph with no cycles, which is why tree traversal is DFS without a visited set.' },
      { id: 'queue-and-deque', kind: 'concept', why: 'BFS needs a real queue; popping from the front of a plain list costs O(n) every single time.' },
    ],
    quiz: [
      {
        question: 'A graph has 100,000 nodes and 200,000 edges. What does one BFS over an adjacency list cost?',
        options: [
          'About V + E, roughly 300,000 steps',
          'O(V^2), about 10,000,000,000 steps',
          'O(E log V), because of the queue',
          'O(V log V), because BFS halves the graph each ring',
        ],
        answerIndex: 0,
        explanation:
          'Each node is popped once and each edge is inspected a constant number of times, so BFS is O(V + E). A queue has O(1) push and pop, so no log factor appears anywhere.',
      },
      {
        question: 'Why should you mark a node as visited when you push it rather than when you pop it?',
        options: [
          'Because otherwise several neighbours can push the same node before it is popped, so the queue grows far beyond V',
          'Because otherwise every distance comes out one too large',
          'Because it uses less memory in the visited set',
          'It makes no difference, it is only a style preference',
        ],
        answerIndex: 0,
        explanation:
          'Marking on pop leaves a window where a node is queued but not yet marked, so every neighbour that sees it queues another copy. The answer stays correct but the work can blow up to O(V * E).',
      },
      {
        question: 'You need the cheapest route in a road network where roads have different lengths. Does plain BFS work?',
        options: [
          'No: BFS minimises the number of edges, not the total length, so use Dijkstra',
          'Yes, BFS always finds the shortest path',
          'Yes, if you sort each adjacency list by weight first',
          'No, use DFS over all paths and keep the best total',
        ],
        answerIndex: 0,
        explanation:
          'BFS treats every edge as costing 1, so one long road looks better to it than two short ones. Non-negative weights call for Dijkstra instead.',
      },
      {
        question: 'A graph has three separate components and you run one BFS from node 0. What happens?',
        options: [
          'Only the component containing node 0 is visited; you must restart from every node still unseen',
          'All nodes are visited, because BFS expands in rings until the queue is empty',
          'BFS raises an error on the unreachable nodes',
          'BFS visits everything but reports distance 0 for the other components',
        ],
        answerIndex: 0,
        explanation:
          'BFS only reaches nodes joined to the start by some path. Counting components means looping over all nodes and starting a new walk from each one still unseen.',
      },
    ],
    sources: [
      'CLRS ch. 22, Elementary Graph Algorithms',
      'MIT 6.006: Breadth-First Search',
      'MIT 6.006: Depth-First Search',
      'CP-Algorithms: Breadth-First Search',
      'CP-Algorithms: Depth-First Search',
      'USACO Guide: Graph Traversal',
    ],
    patternIds: ['bfs', 'dfs'],
    problems: [
      {
        id: 'find-if-path-exists-in-graph',
        title: 'Find if Path Exists in Graph',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/',
        patternId: 'bfs',
        hint: 'Build an adjacency list from the edge list, then BFS or DFS from the source and check whether the destination is ever marked seen.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'keys-and-rooms',
        title: 'Keys and Rooms',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/keys-and-rooms/',
        patternId: 'dfs',
        hint: 'Each room is a node and each key is a directed edge. Start a DFS from room 0 and check if the seen set reaches every room.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'clone-graph',
        title: 'Clone Graph',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/clone-graph/',
        patternId: 'dfs',
        hint: 'Keep a map from original node to its copy. When DFS meets a node already in the map, return the copy instead of creating a new one.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'all-paths-from-source-to-target',
        title: 'All Paths From Source to Target',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/all-paths-from-source-to-target/',
        patternId: 'dfs',
        hint: 'The graph is a DAG, so no seen set is needed. DFS while carrying the current path and record it when you reach the last node.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'is-graph-bipartite',
        title: 'Is Graph Bipartite?',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/is-graph-bipartite/',
        patternId: 'bfs',
        hint: 'Colour the start node 0 and every neighbour the opposite colour during BFS. If a neighbour already has the same colour as you, answer false.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'word-ladder',
        title: 'Word Ladder',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/word-ladder/',
        patternId: 'bfs',
        hint: 'Words are nodes and two words are joined if they differ by one letter. BFS from beginWord and count the rings until you reach endWord.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 2. Grid graphs
  // -------------------------------------------------------------------------
  {
    id: 'grid-graphs',
    gateId: 'graphs',
    order: 2,
    title: 'Grid Graphs: Islands, Flood Fill and Spreading',
    minutes: 25,
    summary: 'Treat every cell of a 2D matrix as a node with four neighbours, then flood-fill with DFS or spread with multi-source BFS.',
    analogy:
      'Think of a paint-bucket tool in an image editor. You click one pixel and the colour spreads to every touching pixel of the same colour, stopping at borders. Counting islands is clicking the bucket on each unpainted land pixel and counting how many clicks you needed.',
    explanation: `A grid of cells is a graph in disguise. Every cell is a node, and its up, down, left and right neighbours are its edges. You never build an adjacency list; you compute neighbours on the fly with four direction offsets. Islands, mazes, flood fill, spreading rot and flowing water are all the same trick.

## The idea
- Cell (r, c) has neighbours (r-1, c), (r+1, c), (r, c-1) and (r, c+1).
- Keep a \`dirs\` list and check the bounds before touching a neighbour.
- Mark cells as visited (a set, a boolean grid, or by overwriting the cell) so you never process one twice.

\`\`\`python
dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
for dr, dc in dirs:
    nr, nc = r + dr, c + dc
    if 0 <= nr < rows and 0 <= nc < cols:
        ...  # safe to look at grid[nr][nc]
\`\`\`

## Flood fill with DFS
Number of Islands asks how many groups of connected 1s exist. Walk the grid. When you find a 1 you have not visited, that is a brand-new island: add one to the count and DFS from it, "sinking" every connected 1 to 0 so it can never be counted again.

\`\`\`python
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        for dr, dc in dirs:
            sink(r + dr, c + dc)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                sink(r, c)
    return count
\`\`\`

## Multi-source BFS
Rotting Oranges asks how many minutes pass until every fresh orange rots, when rot spreads to the four neighbours each minute. Put **all** rotten oranges into the queue at minute 0, then run BFS one ring at a time. Each ring is one minute. The same idea gives "distance to the nearest 0" in 01 Matrix: start BFS from every 0 at once.

## A tiny example
\`\`\`
1 1 0
0 1 0
1 0 1
\`\`\`
Scan row by row. (0,0) is land: island 1, sink (0,0), (0,1), (1,1). (2,0) is land: island 2. (2,2) is land: island 3. Answer: 3.

## Slow versus fast
- Slow: for every land cell, run a full search and compare the cells you found with the islands already collected. That is O((rows x cols)^2).
- Fast: visit each cell once, mark it, and never come back. O(rows x cols) time, and O(rows x cols) space for the visited marks or the recursion stack.
- The only real change is remembering what you have already seen.

## Where people go wrong
- Missing the bounds check and getting an index error.
- Moving diagonally when the problem says 4-directional (or the other way round).
- Using DFS to find a shortest distance. Distances in a grid need BFS.
- Changing the input when the problem forbids it. Use a separate visited grid.
- Deep recursion on a 1000 x 1000 grid. Switch to an explicit stack or to BFS.

## How to recognise it in an interview
- The input is a 2D matrix of 0/1, letters, or heights.
- Words like "islands", "regions", "connected cells", "fill", "spread", "minutes until", "nearest".
- Something spreads over time: multi-source BFS. Counting groups: DFS flood fill.`,
    naive: {
      title: 'Search from every land cell and compare islands',
      description:
        'For each land cell, collect its whole island as a set and add that set to a collection of islands you have already found. Every cell of a big island triggers a full search of that island, so the work multiplies.',
      time: 'O((m*n)^2)',
      space: 'O(m*n)',
      code: {
        python: `def num_islands_slow(grid):
    rows, cols = len(grid), len(grid[0])
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    def collect(r, c, cells):
        if r < 0 or c < 0 or r >= rows or c >= cols:
            return
        if grid[r][c] != '1' or (r, c) in cells:
            return
        cells.add((r, c))
        for dr, dc in dirs:
            collect(r + dr, c + dc, cells)

    islands = set()
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                cells = set()
                collect(r, c, cells)        # full search every time
                islands.add(frozenset(cells))
    return len(islands)`,
        javascript: `function numIslandsSlow(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  function collect(r, c, cells) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const key = r + ',' + c;
    if (grid[r][c] !== '1' || cells.has(key)) return;
    cells.add(key);
    for (const [dr, dc] of dirs) collect(r + dr, c + dc, cells);
  }
  const islands = new Set();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        const cells = new Set();
        collect(r, c, cells);                 // full search every time
        islands.add([...cells].sort().join('|'));
      }
    }
  }
  return islands.size;
}`,
        java: `import java.util.*;

class Solution {
  int rows, cols;
  int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

  public int numIslandsSlow(char[][] grid) {
    rows = grid.length; cols = grid[0].length;
    Set<String> islands = new HashSet<>();
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        if (grid[r][c] == '1') {
          TreeSet<String> cells = new TreeSet<>();
          collect(grid, r, c, cells);        // full search every time
          islands.add(String.join("|", cells));
        }
      }
    }
    return islands.size();
  }

  void collect(char[][] g, int r, int c, Set<String> cells) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    String key = r + "," + c;
    if (g[r][c] != '1' || cells.contains(key)) return;
    cells.add(key);
    for (int[] d : dirs) collect(g, r + d[0], c + d[1], cells);
  }
}`,
        cpp: `#include <vector>
#include <set>
using namespace std;

int rowsN, colsN;
int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

void collect(vector<vector<char>>& g, int r, int c, set<pair<int,int>>& cells) {
  if (r < 0 || c < 0 || r >= rowsN || c >= colsN) return;
  if (g[r][c] != '1' || cells.count({r, c})) return;
  cells.insert({r, c});
  for (auto& d : dirs) collect(g, r + d[0], c + d[1], cells);
}

int numIslandsSlow(vector<vector<char>>& grid) {
  rowsN = grid.size(); colsN = grid[0].size();
  set<set<pair<int,int>>> islands;
  for (int r = 0; r < rowsN; r++)
    for (int c = 0; c < colsN; c++)
      if (grid[r][c] == '1') {
        set<pair<int,int>> cells;
        collect(grid, r, c, cells);          // full search every time
        islands.insert(cells);
      }
  return islands.size();
}`,
      },
    },
    optimized: {
      title: 'DFS flood fill that sinks visited land',
      description:
        'Scan the grid once. Each time you find a 1, count a new island and DFS from it, turning every connected 1 into 0. Every cell is touched a constant number of times.',
      time: 'O(m*n)',
      space: 'O(m*n)',
      code: {
        python: `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    def sink(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'                  # mark as visited
        for dr, dc in dirs:
            sink(r + dr, c + dc)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                sink(r, c)
    return count`,
        javascript: `function numIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  function sink(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';                       // mark as visited
    for (const [dr, dc] of dirs) sink(r + dr, c + dc);
  }
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}`,
        java: `class Solution {
  int rows, cols;
  int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

  public int numIslands(char[][] grid) {
    rows = grid.length; cols = grid[0].length;
    int count = 0;
    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        if (grid[r][c] == '1') {
          count++;
          sink(grid, r, c);
        }
      }
    }
    return count;
  }

  void sink(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || g[r][c] != '1') return;
    g[r][c] = '0';                            // mark as visited
    for (int[] d : dirs) sink(g, r + d[0], c + d[1]);
  }
}`,
        cpp: `#include <vector>
using namespace std;

int dirs4[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

void sink(vector<vector<char>>& g, int r, int c) {
  int rows = g.size(), cols = g[0].size();
  if (r < 0 || c < 0 || r >= rows || c >= cols || g[r][c] != '1') return;
  g[r][c] = '0';                              // mark as visited
  for (auto& d : dirs4) sink(g, r + d[0], c + d[1]);
}

int numIslands(vector<vector<char>>& grid) {
  int count = 0;
  for (int r = 0; r < (int)grid.size(); r++)
    for (int c = 0; c < (int)grid[0].size(); c++)
      if (grid[r][c] == '1') {
        count++;
        sink(grid, r, c);
      }
  return count;
}`,
      },
    },
    whyFaster:
      'The slow version re-explores an island from every one of its cells, so a single island with k cells costs about k^2 work. Sinking each cell as soon as it is visited means no cell is ever explored twice, so the whole grid costs O(m*n). The visited mark is the entire optimisation.',
    keyPoints: [
      'A grid is a graph: cells are nodes, the four (or eight) neighbours are edges.',
      'Always bounds-check before reading grid[nr][nc].',
      'Mark visited by overwriting the cell or with a separate boolean grid.',
      'Counting groups: DFS flood fill. Distances or "minutes until": BFS.',
      'Multi-source BFS starts with every source in the queue at distance 0.',
      'Very large grids can overflow recursion; use an explicit stack or BFS.',
    ],
    definition:
      'A grid graph is a 2D matrix read as a graph: every cell is a node, and every in-bounds neighbour it can move to is an edge. Nothing is stored; the neighbours of a cell are worked out from row and column offsets at the moment you need them.',
    coreIdea:
      'The neighbours of cell (r, c) are always (r-1,c), (r+1,c), (r,c-1) and (r,c+1), so the adjacency list is a formula instead of a data structure. Once you mark each cell the first time you touch it, every cell enters the search once and costs four bounds checks. A whole flood fill over an m by n grid is therefore O(m*n), no matter how tangled the shapes are.',
    visual: [
      {
        caption: 'A 3 x 3 grid of land (1) and water (0). Moves are 4-directional.',
        frame: [
          '      c0 c1 c2',
          ' r0 [  1  1  0 ]',
          ' r1 [  0  1  0 ]',
          ' r2 [  1  0  1 ]',
          '',
          'neighbours of (r,c):',
          '  (r-1,c) (r+1,c) (r,c-1) (r,c+1)',
        ].join('\n'),
      },
      {
        caption: 'The scan reaches (0,0) and finds land. That is a brand-new island, so count it and start sinking. # marks a visited cell.',
        frame: [
          'islands = 1     sinking from (0,0)',
          '      c0 c1 c2',
          ' r0 [  #  1  0 ]',
          ' r1 [  0  1  0 ]',
          ' r2 [  1  0  1 ]',
        ].join('\n'),
      },
      {
        caption: 'DFS walks (0,0) -> (0,1) -> (1,1) and sinks each cell as it arrives. Every neighbour of (1,1) is water or already #.',
        frame: [
          'islands = 1     island fully sunk',
          '      c0 c1 c2',
          ' r0 [  #  #  0 ]',
          ' r1 [  0  #  0 ]',
          ' r2 [  1  0  1 ]',
        ].join('\n'),
      },
      {
        caption: 'The scan keeps going. Rows 0 and 1 hold no land any more, so nothing is recounted. At (2,0) it finds land again.',
        frame: [
          'islands = 2     (2,0) is alone',
          '      c0 c1 c2',
          ' r0 [  #  #  0 ]',
          ' r1 [  0  #  0 ]',
          ' r2 [  #  0  1 ]',
        ].join('\n'),
      },
      {
        caption: 'At (2,2) the last piece of land is found and sunk. The scan finishes with the grid empty.',
        frame: [
          'islands = 3     scan ends',
          '      c0 c1 c2',
          ' r0 [  #  #  0 ]',
          ' r1 [  0  #  0 ]',
          ' r2 [  #  0  # ]',
        ].join('\n'),
      },
      {
        caption: 'The same neighbour rule with a queue gives multi-source BFS: every rotten cell starts in the queue at minute 0, and each ring is one minute.',
        frame: [
          'R = rotten   F = fresh   . = empty',
          '',
          'min 0     min 1     min 2     min 3     min 4',
          'R F F     R R F     R R R     R R R     R R R',
          'F F .     R F .     R R .     R R .     R R .',
          '. F F     . F F     . F F     . R F     . R R',
        ].join('\n'),
      },
    ],
    pseudocode: `DIRS = [(1,0), (-1,0), (0,1), (0,-1)]

function countIslands(grid, rows, cols):
    count = 0
    for r from 0 to rows - 1:
        for c from 0 to cols - 1:
            if grid[r][c] is land:
                count = count + 1
                sink(grid, r, c, rows, cols)
    return count

function sink(grid, r, c, rows, cols):
    if r < 0 or c < 0 or r >= rows or c >= cols: return   // bounds FIRST
    if grid[r][c] is not land: return
    set grid[r][c] to water          // this write is the visited mark
    for each (dr, dc) in DIRS:
        sink(grid, r + dr, c + dc, rows, cols)

function multiSourceBfs(grid, sources):
    queue = every source, each carrying distance 0
    mark every source as visited
    while queue is not empty:
        (r, c, d) = remove from the front of queue
        for each (dr, dc) in DIRS:
            if (r+dr, c+dc) is in bounds, passable and unvisited:
                mark it visited
                add (r+dr, c+dc, d + 1) to the back of queue`,
    complexity: [
      {
        label: 'DFS flood fill over the whole grid',
        time: 'O(m*n)',
        space: 'O(m*n)',
        note: 'each cell sunk once; a snake-shaped island makes the recursion m*n deep',
      },
      {
        label: 'Multi-source BFS',
        time: 'O(m*n)',
        space: 'O(m*n)',
        note: 'the queue holds one ring at a time, the visited grid is full size',
      },
      {
        label: 'Naive re-search from every land cell',
        time: 'O((m*n)^2)',
        space: 'O(m*n)',
        note: 'an island of k cells is explored again from each of its k cells',
      },
      {
        label: 'One neighbour lookup',
        time: 'O(1)',
        space: 'O(1)',
        note: 'two additions and a bounds check, no adjacency list is ever built',
      },
    ],
    dryRun: {
      input: "grid = [['1','1','0'], ['0','1','0'], ['1','0','1']]",
      goal: 'Count the groups of 1s that touch through 4-directional moves, following num_islands from the optimised code.',
      steps: [
        {
          state: 'r=0 c=0  count=0  grid = 110 | 010 | 101',
          action: "grid[0][0] is '1', so this is a new island: count becomes 1 and sink(0, 0) is called.",
        },
        {
          state: 'inside sink(0,0)  count=1  grid = 010 | 010 | 101',
          action: "(0,0) is set to '0'. Its down neighbour (1,0) is water and up is out of bounds, so the recursion moves right into (0,1).",
        },
        {
          state: 'inside sink(0,1)  grid = 000 | 010 | 101',
          action: "(0,1) is set to '0'. Its down neighbour (1,1) is land, so the recursion goes there next.",
        },
        {
          state: 'inside sink(1,1)  grid = 000 | 000 | 101',
          action: "(1,1) is set to '0'. All four of its neighbours are water or out of bounds, so the recursion unwinds back to the scan.",
        },
        {
          state: 'r=0..1 scan continues  count=1  grid = 000 | 000 | 101',
          action: 'The scan finishes rows 0 and 1 without finding another 1, because the whole first island was sunk on the way.',
        },
        {
          state: 'r=2 c=0  count=1',
          action: "grid[2][0] is '1': count becomes 2, sink clears it, and its neighbours (1,0) and (2,1) are both water so it stops immediately.",
        },
        {
          state: 'r=2 c=1  count=2  grid = 000 | 000 | 001',
          action: "grid[2][1] is '0', so the scan just moves on.",
        },
        {
          state: 'r=2 c=2  count=2',
          action: "grid[2][2] is '1': count becomes 3 and sink clears the final cell. The loops end.",
        },
      ],
      result:
        'count = 3. Every cell is 0 when the scan ends, which proves each land cell belonged to exactly one counted island: {(0,0), (0,1), (1,1)}, then {(2,0)}, then {(2,2)}.',
    },
    mistakes: [
      {
        mistake: 'Reading the cell before checking the bounds, as in "if grid[nr][nc] == 1 and 0 <= nr < rows".',
        why: 'In Python a row index of -1 does not raise an error, it silently means the last row. The search wraps around the edge of the grid and joins islands that do not touch, so the answer is wrong with no crash to warn you.',
        fix: 'Put the bounds test first and return early. Python evaluates "and" left to right, so the order of the two tests is the whole fix.',
      },
      {
        mistake: 'Marking a cell visited when it is popped from the BFS queue.',
        why: 'A cell with three rotten neighbours gets pushed three times before it is popped, so the queue holds duplicates and the minute count for later rings can come out too large.',
        fix: 'Mark the cell the moment you push it, exactly as in plain graph BFS.',
      },
      {
        mistake: 'Using DFS to find the shortest distance across a grid.',
        why: 'DFS returns the first path it stumbles on, not the shortest one. Fixing it by exploring all paths and keeping the minimum turns an O(m*n) walk into an exponential search.',
        fix: 'Any "fewest moves" or "minutes until" question on a grid with equal-cost steps is BFS.',
      },
      {
        mistake: 'Sinking cells to 0 when the problem forbids changing the input.',
        why: 'The caller still needs the original grid, and interviewers often ask for the grid to be left alone. Overwriting also breaks the code if the grid must be searched again for a second question.',
        fix: 'Keep a separate boolean visited array of the same size. It costs O(m*n) extra space and nothing in time.',
      },
      {
        mistake: 'Using 8 directions when the statement says 4, or the other way round.',
        why: 'Diagonal moves merge islands that should stay apart, so Number of Islands under-counts. Shortest Path in Binary Matrix, by contrast, really does allow all 8 moves.',
        fix: 'Read the movement rule out loud before writing the DIRS list, and put the list at the top of the function so it is easy to check.',
      },
    ],
    whenToUse: [
      'The input is a 2D matrix of 0/1, characters or heights, and cells connect to their neighbours.',
      'Count regions, islands, provinces or enclosed areas: DFS or BFS flood fill.',
      'Minutes until everything is covered, or distance to the nearest special cell: multi-source BFS.',
      'Fewest moves through a maze where every step costs the same: BFS from the start cell.',
      'Recolour or mark everything connected to one cell: flood fill from that cell.',
    ],
    whenNotToUse: [
      'Moves cost different amounts, such as heights or tolls: use Dijkstra on the grid instead.',
      'You must count paths or optimise over them with heavy overlap: that is 2D dynamic programming, not a flood fill.',
      'Cells switch to land one at a time and you re-count groups after each change: use union-find.',
      'Some moves are free and others cost 1: use 0-1 BFS with a deque, which stays O(m*n).',
      'The grid is 1000 x 1000 and you flood fill recursively in Python: switch to an explicit stack or BFS before the recursion limit stops you.',
    ],
    relatedTopics: [
      { id: 'graph-representation-bfs-dfs', kind: 'concept', why: 'A grid is the same BFS and DFS with the adjacency list replaced by four offsets.' },
      { id: 'bfs', kind: 'pattern', why: 'Multi-source BFS with every source at distance 0 is the standard tool for spreading and nearest-cell questions.' },
      { id: 'shortest-paths', kind: 'concept', why: 'When the grid cells carry different costs, the same walk becomes Dijkstra on a grid.' },
      { id: 'dp-2d-grids', kind: 'concept', why: 'The same matrix becomes a DP table once the question is about counting or optimising over paths instead of just reaching cells.' },
      { id: 'union-find', kind: 'concept', why: 'Union-find counts the same island groups with no recursion, and handles cells becoming land one by one.' },
    ],
    quiz: [
      {
        question: 'A 500 x 500 grid is entirely land. What does one DFS flood fill cost?',
        options: [
          'O(m*n), about 250,000 cell visits, although the recursion can be 250,000 frames deep',
          'O((m*n)^2), about 62,500,000,000 visits',
          'O(m*n log(m*n)), because of the visited set',
          'O(m + n), about 1,000 visits',
        ],
        answerIndex: 0,
        explanation:
          'Every cell is sunk once and each does four bounds checks, so the time is linear in the number of cells. The trap is the space: one giant island makes the call stack as deep as the grid is large.',
      },
      {
        question: 'You forget the bounds check and the DFS reaches row index -1 in Python. What happens?',
        options: [
          'Python reads the last row, so the search silently wraps around the grid and the answer is wrong',
          'Python raises an IndexError, so the bug is loud and easy to find',
          'Python returns None and the branch is skipped',
          'Python treats it as row 0',
        ],
        answerIndex: 0,
        explanation:
          'Negative indices are legal in Python and count from the end. That is why the bounds test must come before the cell is read, not after.',
      },
      {
        question: 'You need the number of minutes until every fresh orange rots, with rot spreading to 4 neighbours each minute. Which approach fits?',
        options: [
          'BFS with every rotten orange already in the queue at minute 0, so each ring is one minute',
          'A separate BFS from each rotten orange, keeping the minimum per cell',
          'DFS from each rotten orange, keeping the minimum depth',
          'Sort the oranges by position and process them in order',
        ],
        answerIndex: 0,
        explanation:
          'Multi-source BFS answers the whole grid in one O(m*n) pass. Running one BFS per source is also correct but costs O(sources * m * n), and DFS does not give distances at all.',
      },
      {
        question: 'The problem says the input grid must not be modified. What replaces the "sink to 0" trick?',
        options: [
          'A separate boolean visited grid of the same size, costing O(m*n) extra space',
          'Copying the whole grid at the start of every DFS call',
          'Running the DFS with no marking at all',
          'Sorting the cells so each is seen only once',
        ],
        answerIndex: 0,
        explanation:
          'A parallel visited array keeps the same linear time and only doubles the memory. Copying per call would make the algorithm quadratic, and no marking at all never terminates on a cycle.',
      },
    ],
    sources: [
      'CLRS ch. 22, Elementary Graph Algorithms',
      'MIT 6.006: Breadth-First Search',
      'CP-Algorithms: Breadth-First Search',
      'USACO Guide: Flood Fill',
      'LeetCode editorials: Number of Islands, Rotting Oranges, 01 Matrix',
    ],
    patternIds: ['dfs', 'bfs'],
    problems: [
      {
        id: 'flood-fill',
        title: 'Flood Fill',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/flood-fill/',
        patternId: 'dfs',
        hint: 'Remember the original colour, then DFS from the start pixel and recolour every 4-neighbour that still has the original colour.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/number-of-islands/',
        patternId: 'dfs',
        hint: 'Scan every cell; when you see an unvisited 1, count one island and DFS to sink all connected 1s to 0.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'max-area-of-island',
        title: 'Max Area of Island',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/max-area-of-island/',
        patternId: 'dfs',
        hint: 'Same flood fill as Number of Islands, but make the DFS return 1 plus the sizes of its four neighbour calls, and track the maximum.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'rotting-oranges',
        title: 'Rotting Oranges',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/rotting-oranges/',
        patternId: 'bfs',
        hint: 'Push every rotten orange into the queue first, then BFS ring by ring counting minutes; at the end check whether any fresh orange survived.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: '01-matrix',
        title: '01 Matrix',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/01-matrix/',
        patternId: 'bfs',
        hint: 'Start a single BFS from all the 0 cells at once; the ring in which you reach a 1 cell is its distance to the nearest 0.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'pacific-atlantic-water-flow',
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
        patternId: 'dfs',
        hint: 'Flow backwards: DFS from every ocean border cell moving only to neighbours that are equal or higher, then return the cells reached by both oceans.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'surrounded-regions',
        title: 'Surrounded Regions',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/surrounded-regions/',
        patternId: 'dfs',
        hint: 'DFS from every O on the border and mark those as safe; every other O is surrounded and can be flipped to X.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 3. Topological sort
  // -------------------------------------------------------------------------
  {
    id: 'topological-sort',
    gateId: 'graphs',
    order: 3,
    title: 'Topological Sort: Ordering with Prerequisites',
    minutes: 25,
    summary: 'Order the nodes of a directed graph so every edge points forward, and detect cycles when no such order exists.',
    analogy:
      'Getting dressed: socks before shoes, shirt before jacket. There are many valid orders, but shoes can never come before socks. If someone tells you shoes must come before socks AND socks before shoes, no order works: that is a cycle.',
    explanation: `Some tasks depend on other tasks. Course B needs course A first. A build step needs its libraries compiled first. A topological sort is any ordering of the nodes of a directed graph where every edge u -> v has u appearing before v. It only exists when the graph has no cycle, so the same algorithm also answers "is this set of dependencies even possible?"

## The idea
Use Kahn's algorithm, which is just BFS with a counter:
- **In-degree** of a node = how many edges point into it = how many prerequisites it still has.
- Every node with in-degree 0 has no prerequisites, so it can go first. Put all of them in a queue.
- Pop a node, add it to the answer, and for each neighbour reduce its in-degree by one (one prerequisite is now done). When a neighbour's in-degree hits 0, push it.
- If the answer has fewer than V nodes at the end, some nodes never reached in-degree 0. That means a cycle.

\`\`\`python
from collections import deque

def topo_order(n, edges):          # edges: (a, b) means a must come before b
    adj = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in edges:
        adj[a].append(b)
        indeg[b] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in adj[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return order if len(order) == n else []   # [] means cycle
\`\`\`

## A tiny example
Courses 0..3 with prerequisites: 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3.
- In-degrees: [0, 1, 1, 2]. Queue starts with 0.
- Pop 0. Lower 1 and 2 to 0, push both. Order: [0].
- Pop 1. Lower 3 to 1. Pop 2. Lower 3 to 0, push it. Order: [0, 1, 2].
- Pop 3. Order: [0, 1, 2, 3]. Four nodes out, no cycle.
Now add edge 3 -> 0. In-degree of 0 becomes 1, the queue starts empty, nothing comes out, and you report a cycle.

## Slow versus fast
- Slow: repeatedly scan every remaining node, find one whose prerequisites are all done, remove it. Each round is O(V + E) and there are V rounds: O(V x (V + E)).
- Fast: keep the in-degree counts up to date and only look at nodes whose count just reached 0. Every edge is processed exactly once: O(V + E).

## The DFS alternative
You can also DFS and record each node after all its neighbours are finished, then reverse the list. To detect cycles you colour nodes: white (unseen), grey (in progress), black (done). Meeting a grey node means a cycle. Both methods are fine; Kahn's is easier to get right under interview pressure.

## Where people go wrong
- Building the edge in the wrong direction. Read the statement twice: "[a, b] means take b before a" flips the arrow.
- Forgetting to check the final count, so a graph with a cycle silently returns a partial order.
- Trying to use topological sort on an undirected graph. It only makes sense with arrows.

## How to recognise it in an interview
- Words like "prerequisite", "depends on", "must come before", "build order", "schedule".
- "Is it possible to finish all" = does a topological order exist = is the graph acyclic.
- "Return any valid order" = return the order Kahn's algorithm produces.`,
    naive: {
      title: 'Repeatedly scan for a node with no remaining prerequisites',
      description:
        'Keep a set of finished nodes. In each round, scan all unfinished nodes and pick one whose prerequisites are all finished. Every round rescans everything, so the cost is V rounds of O(V + E) work.',
      time: 'O(V * (V + E))',
      space: 'O(V + E)',
      code: {
        python: `def topo_slow(n, edges):
    prereqs = [[] for _ in range(n)]
    for a, b in edges:              # a before b
        prereqs[b].append(a)
    done = set()
    order = []
    while len(order) < n:
        progressed = False
        for node in range(n):        # rescans everything each round
            if node in done:
                continue
            if all(p in done for p in prereqs[node]):
                done.add(node)
                order.append(node)
                progressed = True
                break
        if not progressed:
            return []                 # cycle
    return order`,
        javascript: `function topoSlow(n, edges) {
  const prereqs = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) prereqs[b].push(a);     // a before b
  const done = new Set();
  const order = [];
  while (order.length < n) {
    let progressed = false;
    for (let node = 0; node < n; node++) {            // rescans everything
      if (done.has(node)) continue;
      if (prereqs[node].every((p) => done.has(p))) {
        done.add(node);
        order.push(node);
        progressed = true;
        break;
      }
    }
    if (!progressed) return [];                       // cycle
  }
  return order;
}`,
        java: `import java.util.*;

class Solution {
  public List<Integer> topoSlow(int n, int[][] edges) {
    List<List<Integer>> prereqs = new ArrayList<>();
    for (int i = 0; i < n; i++) prereqs.add(new ArrayList<>());
    for (int[] e : edges) prereqs.get(e[1]).add(e[0]);   // e[0] before e[1]
    boolean[] done = new boolean[n];
    List<Integer> order = new ArrayList<>();
    while (order.size() < n) {
      boolean progressed = false;
      for (int node = 0; node < n && !progressed; node++) {  // rescans everything
        if (done[node]) continue;
        boolean ready = true;
        for (int p : prereqs.get(node)) if (!done[p]) ready = false;
        if (ready) {
          done[node] = true;
          order.add(node);
          progressed = true;
        }
      }
      if (!progressed) return new ArrayList<>();          // cycle
    }
    return order;
  }
}`,
        cpp: `#include <vector>
using namespace std;

vector<int> topoSlow(int n, vector<pair<int,int>>& edges) {
  vector<vector<int>> prereqs(n);
  for (auto& e : edges) prereqs[e.second].push_back(e.first);  // first before second
  vector<bool> done(n, false);
  vector<int> order;
  while ((int)order.size() < n) {
    bool progressed = false;
    for (int node = 0; node < n && !progressed; node++) {      // rescans everything
      if (done[node]) continue;
      bool ready = true;
      for (int p : prereqs[node]) if (!done[p]) ready = false;
      if (ready) {
        done[node] = true;
        order.push_back(node);
        progressed = true;
      }
    }
    if (!progressed) return {};                                // cycle
  }
  return order;
}`,
      },
    },
    optimized: {
      title: "Kahn's algorithm with in-degree counts and a queue",
      description:
        'Count incoming edges for every node once. Nodes with zero count go into a queue. Popping a node lowers the count of its neighbours, and any neighbour that reaches zero joins the queue. Each edge is handled exactly once.',
      time: 'O(V + E)',
      space: 'O(V + E)',
      code: {
        python: `from collections import deque

def topo_order(n, edges):
    adj = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in edges:              # a before b
        adj[a].append(b)
        indeg[b] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in adj[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return order if len(order) == n else []   # [] means cycle`,
        javascript: `function topoOrder(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of edges) {                 // a before b
    adj[a].push(b);
    indeg[b]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const nxt of adj[node]) {
      indeg[nxt]--;
      if (indeg[nxt] === 0) queue.push(nxt);
    }
  }
  return order.length === n ? order : [];       // [] means cycle
}`,
        java: `import java.util.*;

class Solution {
  public List<Integer> topoOrder(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] e : edges) {                     // e[0] before e[1]
      adj.get(e[0]).add(e[1]);
      indeg[e[1]]++;
    }
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
      int node = q.poll();
      order.add(node);
      for (int nxt : adj.get(node)) {
        if (--indeg[nxt] == 0) q.add(nxt);
      }
    }
    return order.size() == n ? order : new ArrayList<>();  // empty means cycle
  }
}`,
        cpp: `#include <vector>
#include <queue>
using namespace std;

vector<int> topoOrder(int n, vector<pair<int,int>>& edges) {
  vector<vector<int>> adj(n);
  vector<int> indeg(n, 0);
  for (auto& e : edges) {                       // first before second
    adj[e.first].push_back(e.second);
    indeg[e.second]++;
  }
  queue<int> q;
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
  vector<int> order;
  while (!q.empty()) {
    int node = q.front(); q.pop();
    order.push_back(node);
    for (int nxt : adj[node])
      if (--indeg[nxt] == 0) q.push(nxt);
  }
  if ((int)order.size() != n) return {};        // empty means cycle
  return order;
}`,
      },
    },
    whyFaster:
      'The slow version re-checks every node and all of its prerequisites in every round, and there are V rounds, so it is O(V * (V + E)). Kahn\'s algorithm keeps a running in-degree count, so the moment a prerequisite finishes you decrement one number instead of rescanning. Every node enters the queue once and every edge is decremented once: O(V + E).',
    keyPoints: [
      'A topological order exists only for a directed graph with no cycles (a DAG).',
      'In-degree = number of unfinished prerequisites. Start with all in-degree-0 nodes.',
      'Pop, append, decrement neighbours, push any neighbour that hits 0.',
      'If fewer than V nodes come out, there is a cycle.',
      'Double-check the direction of each edge from the problem statement.',
      'DFS with white/grey/black colouring is the alternative; grey-to-grey means a cycle.',
    ],
    definition:
      'A topological order of a directed graph is a listing of all its nodes in which every edge u -> v has u before v. Such an order exists exactly when the graph contains no directed cycle, so the same computation also answers whether a set of dependencies can be satisfied at all.',
    coreIdea:
      'A node becomes ready the instant its last prerequisite is output, and that instant can be spotted with one counter per node instead of a rescan. So rather than asking every remaining node "are you ready yet?" in every round, you subtract one from a single number per edge. The cost falls from O(V * (V + E)) to O(V + E), and any node whose counter never reaches zero is sitting on a cycle.',
    visual: [
      {
        caption: 'Five tasks with five dependencies. An arrow a -> b means a must finish before b starts.',
        frame: [
          'edges: 0->1  0->2  1->3  2->3  3->4',
          '',
          '  0 --> 1        adjacency     in-degree',
          '  |     |        0: [1, 2]     0 : 0',
          '  v     v        1: [3]        1 : 1',
          '  2 --> 3        2: [3]        2 : 1',
          '        |        3: [4]        3 : 2',
          '        v        4: []         4 : 1',
          '        4',
        ].join('\n'),
      },
      {
        caption: 'Every node whose in-degree is already 0 seeds the queue. Here only node 0 has no prerequisites.',
        frame: [
          'node   : 0  1  2  3  4',
          'in-deg : 0  1  1  2  1',
          'queue  : [0]',
          'order  : []',
        ].join('\n'),
      },
      {
        caption: 'Pop 0 and cut its two out-edges. Both 1 and 2 drop to 0, so both are pushed.',
        frame: [
          'pop 0   cut 0->1 and 0->2',
          'node   : 0  1  2  3  4',
          'in-deg : -  0  0  2  1',
          'queue  : [1, 2]',
          'order  : [0]',
        ].join('\n'),
      },
      {
        caption: 'Pop 1 and cut 1->3. Node 3 drops from 2 to 1: it still waits on node 2, so it is not pushed yet.',
        frame: [
          'pop 1   cut 1->3   (3 goes 2 -> 1)',
          'node   : 0  1  2  3  4',
          'in-deg : -  -  0  1  1',
          'queue  : [2]',
          'order  : [0, 1]',
        ].join('\n'),
      },
      {
        caption: 'Pop 2 and cut 2->3. Now node 3 reaches 0 and joins the queue.',
        frame: [
          'pop 2   cut 2->3   (3 goes 1 -> 0)',
          'node   : 0  1  2  3  4',
          'in-deg : -  -  -  0  1',
          'queue  : [3]',
          'order  : [0, 1, 2]',
        ].join('\n'),
      },
      {
        caption: 'Pop 3, which drops 4 to 0, then pop 4. Five nodes came out of a five-node graph, so there is no cycle. Add an edge 4 -> 0 and the queue would start empty instead.',
        frame: [
          'pop 3   cut 3->4      then   pop 4',
          'node   : 0  1  2  3  4',
          'in-deg : -  -  -  -  -',
          'queue  : []',
          'order  : [0, 1, 2, 3, 4]     5 of 5  ->  no cycle',
        ].join('\n'),
      },
    ],
    pseudocode: `function topologicalOrder(n, edges):    // (a, b) means a before b
    adj = array of n empty lists
    indeg = array of n zeros
    for each (a, b) in edges:
        add b to adj[a]
        indeg[b] = indeg[b] + 1

    queue = empty queue
    for i from 0 to n - 1:
        if indeg[i] = 0:
            add i to queue

    order = empty list
    while queue is not empty:
        node = remove from the front of queue
        append node to order
        for each nxt in adj[node]:
            indeg[nxt] = indeg[nxt] - 1
            if indeg[nxt] = 0:          // only on the way to zero
                add nxt to the back of queue

    if length of order = n:
        return order
    return "no valid order: the graph has a cycle"`,
    complexity: [
      {
        label: 'Build adjacency lists and in-degrees',
        time: 'O(V + E)',
        space: 'O(V + E)',
        note: 'one pass over the edge list',
      },
      {
        label: "Kahn's main loop",
        time: 'O(V + E)',
        space: 'O(V)',
        note: 'each node queued once, each edge decremented once',
      },
      {
        label: 'DFS with white / grey / black colouring',
        time: 'O(V + E)',
        space: 'O(V)',
        note: 'same bound; the recursion stack can reach depth V',
      },
      {
        label: 'Naive repeated scan for a ready node',
        time: 'O(V * (V + E))',
        space: 'O(V + E)',
        note: 'V rounds, and each round rechecks every node and its prerequisites',
      },
    ],
    dryRun: {
      input: 'n = 5, edges = [(0,1), (0,2), (1,3), (2,3), (3,4)], where (a, b) means a must come before b',
      goal: 'Produce an order in which every prerequisite appears before the task that needs it, or report a cycle, following topo_order from the optimised code.',
      steps: [
        {
          state: 'adj = [[1,2], [3], [3], [4], []]  indeg = [0, 1, 1, 2, 1]',
          action: 'One pass over the five edges fills the adjacency lists and counts how many arrows point into each node.',
        },
        {
          state: 'q = [0]  order = []',
          action: 'Only node 0 has in-degree 0, so it alone seeds the queue. Everything else is waiting on something.',
        },
        {
          state: 'node = 0  order = [0]  indeg = [0, 0, 0, 2, 1]',
          action: 'Pop 0 and record it, then walk adj[0]: 1 drops from 1 to 0 and 2 drops from 1 to 0, so both are pushed.',
        },
        {
          state: 'q = [1, 2]  order = [0]',
          action: 'Both tasks that only depended on task 0 are now ready. Either could go next and both give a valid answer.',
        },
        {
          state: 'node = 1  order = [0, 1]  indeg[3] = 1',
          action: 'Pop 1 and decrement 3 from 2 to 1. It is not zero, so 3 is not pushed: it still waits on node 2.',
        },
        {
          state: 'node = 2  order = [0, 1, 2]  indeg[3] = 0',
          action: 'Pop 2 and decrement 3 from 1 to 0, so 3 is pushed. Node 3 entered the queue exactly once even though two edges pointed at it.',
        },
        {
          state: 'node = 3  order = [0, 1, 2, 3]  indeg[4] = 0',
          action: 'Pop 3 and decrement 4 from 1 to 0, so 4 is pushed.',
        },
        {
          state: 'node = 4  q = []  order = [0, 1, 2, 3, 4]',
          action: 'Pop 4. It has no out-edges, the queue is empty, and the loop ends.',
        },
      ],
      result:
        'order = [0, 1, 2, 3, 4] and len(order) == n == 5, so there is no cycle. Check each edge: 0 before 1, 0 before 2, 1 before 3, 2 before 3, 3 before 4. All five hold. Add the edge 4 -> 0 and indeg becomes [1,1,1,2,1], the queue starts empty, order stays [] and the function returns [] to signal a cycle.',
    },
    mistakes: [
      {
        mistake: 'Building the edge in the wrong direction. LeetCode gives prerequisites[i] = [a, b] meaning "take b before a", and people write adj[a].append(b).',
        why: 'Every arrow is reversed, so the algorithm still runs and still returns a full-length order, but the order is backwards. Course Schedule II fails on the hidden tests with no crash to hint at the cause.',
        fix: 'Say the rule out loud before coding: b comes first, so the edge is b -> a and indeg[a] goes up. Then trace one sample pair by hand.',
      },
      {
        mistake: 'Returning the order without checking that its length equals V.',
        why: 'On a graph with a cycle the queue empties early, so you silently return a partial order that looks plausible. Course Schedule then answers "yes, you can finish" when you cannot.',
        fix: 'Always end with "if len(order) == n return order else report a cycle". That one line is the entire cycle detector.',
      },
      {
        mistake: 'Pushing a neighbour every time its in-degree is decremented instead of only when it hits zero.',
        why: 'A node with three incoming edges is queued three times and appears three times in the output, so the order is longer than V and the cycle check misfires.',
        fix: 'Decrement first, then push only inside "if indeg[nxt] == 0".',
      },
      {
        mistake: 'Reaching for topological sort on an undirected graph.',
        why: 'An undirected edge says nothing about order, so in-degrees are just degrees and the result is meaningless. Minimum Height Trees looks like this trap but is really leaf peeling, which uses degree 1, not in-degree 0.',
        fix: 'Only use it when the statement contains a direction: "before", "depends on", "requires".',
      },
      {
        mistake: 'Assuming the topological order is unique and comparing against one expected answer.',
        why: 'Whenever two nodes are ready at the same time, either can go first. Both answers are correct, so a test that compares lists exactly will fail for a correct solution.',
        fix: 'Verify by checking that every edge points forward in your output, not by matching one specific list.',
      },
    ],
    whenToUse: [
      'Words like "prerequisite", "depends on", "must be built before", "install order", "schedule".',
      '"Is it possible to finish all N tasks?", which is exactly "does the directed graph have no cycle".',
      '"Return any valid order" for a directed graph of constraints.',
      'You want DP over a DAG, such as longest path or counting paths: process the nodes in topological order.',
      'Deriving an alphabet or a ranking from pairwise facts of the form "x comes before y".',
    ],
    whenNotToUse: [
      'The graph is undirected, so "before" has no meaning: use BFS or DFS for components, or union-find.',
      'You only need to know whether an undirected graph has a cycle: a DFS with a parent check or union-find is shorter.',
      'Edges carry weights and you want a cheapest route through a graph with cycles: use Dijkstra or Bellman-Ford.',
      'There are no ordering constraints at all and you just want items in some order: plain sorting is enough.',
      'The dependency graph itself changes between every query: recomputing an O(V + E) sort per change is usually the wrong shape for the problem.',
    ],
    relatedTopics: [
      { id: 'topological-sort', kind: 'pattern', why: 'This concept is the full write-up of that pattern, in both its Kahn and DFS forms.' },
      { id: 'graph-representation-bfs-dfs', kind: 'concept', why: "Kahn's algorithm is BFS with an in-degree counter in place of a visited set." },
      { id: 'shortest-paths', kind: 'concept', why: 'On a DAG you can get shortest paths in O(V + E) by relaxing edges in topological order, with no heap and even with negative weights.' },
      { id: 'dp-1d', kind: 'concept', why: 'DP on a DAG evaluates states in topological order so every dependency is already solved when you need it.' },
      { id: 'queue-and-deque', kind: 'concept', why: 'The set of ready nodes is a plain FIFO queue; any order among ready nodes still gives a valid answer.' },
    ],
    quiz: [
      {
        question: 'Course Schedule gives prerequisites[i] = [a, b], meaning you must take b before a. Which edge should you add?',
        options: [
          'b -> a, and indeg[a] increases by one',
          'a -> b, and indeg[b] increases by one',
          'Both directions, since the pair is symmetric',
          'An undirected edge between a and b',
        ],
        answerIndex: 0,
        explanation:
          'The node that must come first is the tail of the arrow. Reversing this still produces a full-length order, which is why the bug is so easy to miss.',
      },
      {
        question: 'A dependency graph has 100,000 nodes and 200,000 edges. What does the queue-and-in-degree algorithm cost?',
        options: [
          'O(V + E), about 300,000 steps: one decrement per edge',
          'O(V * E), about 20,000,000,000 steps',
          'O(E log V), because of the priority queue',
          'O(V^2), because each node checks all the others',
        ],
        answerIndex: 0,
        explanation:
          'Every node enters and leaves the queue once and every edge is decremented once. There is no priority queue here, so no log factor appears.',
      },
      {
        question: 'The loop ends with order holding 4 nodes out of 6. What does that mean?',
        options: [
          'Two nodes never reached in-degree 0, so they lie on a directed cycle and no valid order exists',
          'The graph is disconnected, so you should run the algorithm again from the missing nodes',
          'The queue was implemented incorrectly',
          'The two missing nodes have no edges at all',
        ],
        answerIndex: 0,
        explanation:
          'Disconnected pieces are handled fine, because every in-degree-0 node in every component seeds the queue at the start. A short result can only mean a cycle.',
      },
      {
        question: 'Can a topological order help you find shortest paths in a weighted DAG?',
        options: [
          'Yes: relax each edge once in topological order for O(V + E), and it works even with negative weights',
          'No, weighted graphs always need Dijkstra',
          'Yes, but only when every weight is non-negative',
          'No, only Bellman-Ford works on a DAG',
        ],
        answerIndex: 0,
        explanation:
          'Processing nodes in topological order guarantees that dist[u] is final before any edge out of u is relaxed. No heap is needed, and negative weights cause no trouble because there can be no cycle.',
      },
    ],
    sources: [
      'CLRS ch. 22.4, Topological Sort',
      'MIT 6.006: Depth-First Search and Topological Sort',
      'CP-Algorithms: Topological Sorting',
      'USACO Guide: Topological Sort',
      'CSES Problem Set: Course Schedule and Game Routes',
    ],
    patternIds: ['topological-sort', 'bfs', 'dfs'],
    problems: [
      {
        id: 'course-schedule',
        title: 'Course Schedule',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/course-schedule/',
        patternId: 'topological-sort',
        hint: 'Run Kahn\'s algorithm and return whether the number of courses you popped equals numCourses.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'course-schedule-ii',
        title: 'Course Schedule II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/course-schedule-ii/',
        patternId: 'topological-sort',
        hint: 'Same as Course Schedule, but return the popped order itself (or an empty list when a cycle stops you early).',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'find-eventual-safe-states',
        title: 'Find Eventual Safe States',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-eventual-safe-states/',
        patternId: 'topological-sort',
        hint: 'Reverse every edge and run Kahn\'s algorithm from the terminal nodes; every node that comes out of the queue is safe.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'minimum-height-trees',
        title: 'Minimum Height Trees',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-height-trees/',
        patternId: 'topological-sort',
        hint: 'Peel the leaves (degree 1) layer by layer like Kahn\'s algorithm; the last one or two nodes left are the roots you want.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'all-ancestors-of-a-node-in-a-directed-acyclic-graph',
        title: 'All Ancestors of a Node in a Directed Acyclic Graph',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/',
        patternId: 'topological-sort',
        hint: 'Process nodes in topological order and pass each node\'s ancestor set (plus itself) down to its children.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'alien-dictionary',
        title: 'Alien Dictionary',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/alien-dictionary/',
        patternId: 'topological-sort',
        hint: 'Compare each adjacent pair of words to find the first differing letter, which gives one edge; then topologically sort the letters and detect cycles.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 4. Shortest paths
  // -------------------------------------------------------------------------
  {
    id: 'shortest-paths',
    gateId: 'graphs',
    order: 4,
    title: 'Shortest Paths: BFS and Dijkstra',
    minutes: 30,
    summary: 'Find the cheapest route between nodes: BFS when every edge costs the same, Dijkstra with a min-heap when edges have weights.',
    analogy:
      'Driving with a GPS. If every road takes the same time, the fewest turns wins, and BFS finds that. When roads have different lengths, the GPS always expands the closest unexplored junction first and never revisits one it has settled. That is Dijkstra.',
    explanation: `Many problems ask for the "minimum time", "cheapest cost" or "fewest moves" to get from one node to another. That is a shortest-path question. Which algorithm you use depends on one thing: do the edges have different costs?

## Unweighted: BFS is enough
If every edge costs 1, BFS from the start node visits nodes in order of distance. Record the ring number when you first reach a node; that is its shortest distance. You already know this from grid problems.

## Weighted: Dijkstra
When edges have positive costs, ring order no longer works: two cheap edges can beat one expensive edge. Dijkstra fixes this with a **min-heap** (priority queue) keyed by the total cost so far.

- Start with \`dist[start] = 0\` and everything else infinity. Push (0, start).
- Pop the cheapest (cost, node). If that cost is worse than the \`dist\` we already know, skip it. It is a stale entry.
- Otherwise, for each edge node -> nxt with weight w: if \`dist[node] + w < dist[nxt]\`, update it and push (new cost, nxt).
- The first time a node is popped, its distance is final. The heap guarantees nothing cheaper is left.

\`\`\`python
import heapq

def dijkstra(adj, start, n):          # adj[u] = list of (v, w)
    dist = [float('inf')] * n
    dist[start] = 0
    heap = [(0, start)]
    while heap:
        cost, node = heapq.heappop(heap)
        if cost > dist[node]:
            continue                  # stale entry
        for nxt, w in adj[node]:
            if cost + w < dist[nxt]:
                dist[nxt] = cost + w
                heapq.heappush(heap, (dist[nxt], nxt))
    return dist
\`\`\`

## A tiny example
Edges: 0->1 (4), 0->2 (1), 2->1 (2). Start at 0.
- Pop (0, 0). Relax: dist[1] = 4, dist[2] = 1. Heap: (1,2), (4,1).
- Pop (1, 2). Relax 2->1: 1 + 2 = 3 < 4, so dist[1] = 3. Heap: (3,1), (4,1).
- Pop (3, 1). Final. Later pop (4, 1) is stale and skipped.
Answer: dist = [0, 3, 1]. BFS would have said "0->1 directly" because it counts edges, and that is wrong here.

## Slow versus fast
- Slow: DFS every possible path and keep the cheapest. The number of paths explodes; even 30 nodes can produce billions of paths.
- Fast: Dijkstra touches every edge once and does one heap operation per relaxation: O((V + E) log V).
- The change: instead of exploring paths, we settle nodes, cheapest first, and never revisit a settled node.

## When Dijkstra is the wrong tool
- **Negative edge weights**: Dijkstra can settle a node too early. Use Bellman-Ford, which relaxes all edges V - 1 times.
- **"At most k stops"**: run Bellman-Ford for exactly k + 1 rounds, using a copy of the distances each round so updates do not chain within one round. This is Cheapest Flights Within K Stops.
- **Minimise the maximum edge on the path** (Path With Minimum Effort): Dijkstra still works if the "cost" you push is \`max(cost so far, w)\` instead of a sum.

## Where people go wrong
- Forgetting the "stale entry" check, which makes the heap version slower but still correct.
- Using a visited set and refusing to push a node twice. You must allow re-pushing with a cheaper cost.
- Applying BFS to a weighted graph.

## How to recognise it in an interview
- "Minimum time / cost / effort to reach", "network delay", "cheapest price".
- Equal costs: BFS. Positive weights: Dijkstra. Negative weights or a limit on stops: Bellman-Ford.`,
    naive: {
      title: 'Try every path with DFS and keep the cheapest',
      description:
        'Explore every simple path from the source, adding up the weights, and remember the smallest total per node. Correct, but the number of paths grows exponentially with the size of the graph.',
      time: 'O(V!) in the worst case (exponential)',
      space: 'O(V)',
      code: {
        python: `def shortest_by_dfs(adj, start, n):     # adj[u] = list of (v, w)
    best = [float('inf')] * n
    on_path = [False] * n

    def explore(node, cost):
        if cost >= best[node] and node != start:
            pass                          # still must continue for other nodes
        best[node] = min(best[node], cost)
        on_path[node] = True
        for nxt, w in adj[node]:
            if not on_path[nxt]:          # avoid loops
                explore(nxt, cost + w)    # every path is walked
        on_path[node] = False

    explore(start, 0)
    return best`,
        javascript: `function shortestByDfs(adj, start, n) {   // adj[u] = [[v, w], ...]
  const best = new Array(n).fill(Infinity);
  const onPath = new Array(n).fill(false);
  function explore(node, cost) {
    best[node] = Math.min(best[node], cost);
    onPath[node] = true;
    for (const [nxt, w] of adj[node]) {
      if (!onPath[nxt]) explore(nxt, cost + w);     // every path is walked
    }
    onPath[node] = false;
  }
  explore(start, 0);
  return best;
}`,
        java: `import java.util.*;

class Solution {
  int[] best;
  boolean[] onPath;

  public int[] shortestByDfs(List<List<int[]>> adj, int start, int n) {
    best = new int[n];
    Arrays.fill(best, Integer.MAX_VALUE);
    onPath = new boolean[n];
    explore(adj, start, 0);
    return best;
  }

  void explore(List<List<int[]>> adj, int node, int cost) {
    best[node] = Math.min(best[node], cost);
    onPath[node] = true;
    for (int[] e : adj.get(node)) {                 // e = {nxt, w}
      if (!onPath[e[0]]) explore(adj, e[0], cost + e[1]);   // every path is walked
    }
    onPath[node] = false;
  }
}`,
        cpp: `#include <vector>
#include <climits>
using namespace std;

vector<int> bestCost;
vector<bool> onPath;

void explore(vector<vector<pair<int,int>>>& adj, int node, int cost) {
  bestCost[node] = min(bestCost[node], cost);
  onPath[node] = true;
  for (auto& e : adj[node]) {                       // e = {nxt, w}
    if (!onPath[e.first]) explore(adj, e.first, cost + e.second);  // every path
  }
  onPath[node] = false;
}

vector<int> shortestByDfs(vector<vector<pair<int,int>>>& adj, int start, int n) {
  bestCost.assign(n, INT_MAX);
  onPath.assign(n, false);
  explore(adj, start, 0);
  return bestCost;
}`,
      },
    },
    optimized: {
      title: 'Dijkstra with a min-heap',
      description:
        'Always expand the node with the smallest known cost. Each edge is relaxed once and each improvement costs one heap push. Skip heap entries whose cost is worse than the distance already recorded.',
      time: 'O((V + E) log V)',
      space: 'O(V + E)',
      code: {
        python: `import heapq

def dijkstra(adj, start, n):          # adj[u] = list of (v, w)
    dist = [float('inf')] * n
    dist[start] = 0
    heap = [(0, start)]
    while heap:
        cost, node = heapq.heappop(heap)
        if cost > dist[node]:
            continue                  # stale entry
        for nxt, w in adj[node]:
            new_cost = cost + w
            if new_cost < dist[nxt]:
                dist[nxt] = new_cost
                heapq.heappush(heap, (new_cost, nxt))
    return dist`,
        javascript: `// Minimal binary heap keyed on [cost, node]
class MinHeap {
  constructor() { this.a = []; }
  push(x) { this.a.push(x); this.up(this.a.length - 1); }
  pop() {
    const top = this.a[0], last = this.a.pop();
    if (this.a.length) { this.a[0] = last; this.down(0); }
    return top;
  }
  up(i) { while (i > 0) { const p = (i - 1) >> 1; if (this.a[p][0] <= this.a[i][0]) break; [this.a[p], this.a[i]] = [this.a[i], this.a[p]]; i = p; } }
  down(i) { const n = this.a.length; for (;;) { let m = i; const l = 2 * i + 1, r = l + 1; if (l < n && this.a[l][0] < this.a[m][0]) m = l; if (r < n && this.a[r][0] < this.a[m][0]) m = r; if (m === i) break; [this.a[m], this.a[i]] = [this.a[i], this.a[m]]; i = m; } }
  get size() { return this.a.length; }
}

function dijkstra(adj, start, n) {        // adj[u] = [[v, w], ...]
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  const heap = new MinHeap();
  heap.push([0, start]);
  while (heap.size) {
    const [cost, node] = heap.pop();
    if (cost > dist[node]) continue;      // stale entry
    for (const [nxt, w] of adj[node]) {
      if (cost + w < dist[nxt]) {
        dist[nxt] = cost + w;
        heap.push([dist[nxt], nxt]);
      }
    }
  }
  return dist;
}`,
        java: `import java.util.*;

class Solution {
  public int[] dijkstra(List<List<int[]>> adj, int start, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;
    PriorityQueue<int[]> heap = new PriorityQueue<>((x, y) -> x[0] - y[0]);
    heap.add(new int[]{0, start});
    while (!heap.isEmpty()) {
      int[] top = heap.poll();
      int cost = top[0], node = top[1];
      if (cost > dist[node]) continue;          // stale entry
      for (int[] e : adj.get(node)) {           // e = {nxt, w}
        int newCost = cost + e[1];
        if (newCost < dist[e[0]]) {
          dist[e[0]] = newCost;
          heap.add(new int[]{newCost, e[0]});
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

vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int start, int n) {
  vector<int> dist(n, INT_MAX);
  dist[start] = 0;
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> heap;
  heap.push({0, start});
  while (!heap.empty()) {
    auto [cost, node] = heap.top(); heap.pop();
    if (cost > dist[node]) continue;            // stale entry
    for (auto& [nxt, w] : adj[node]) {
      if (cost + w < dist[nxt]) {
        dist[nxt] = cost + w;
        heap.push({dist[nxt], nxt});
      }
    }
  }
  return dist;
}`,
      },
    },
    whyFaster:
      'Walking every path is exponential because the same node is reached through countless different routes and each route continues independently. Dijkstra settles each node once, at the moment its cheapest cost is known, and the heap makes finding the next cheapest node O(log V). Total work is one relaxation per edge, so O((V + E) log V).',
    keyPoints: [
      'Equal edge costs: BFS gives shortest paths for free.',
      'Positive weights: Dijkstra with a min-heap keyed on total cost.',
      'Pop the cheapest, skip stale entries, relax neighbours, push improvements.',
      'Never block a node from being pushed again with a cheaper cost.',
      'Negative weights or "at most k stops": Bellman-Ford with a copied array per round.',
      '"Minimise the largest edge" still works with Dijkstra using max instead of sum.',
    ],
    patternIds: ['shortest-path', 'bfs'],
    problems: [
      {
        id: 'shortest-path-in-binary-matrix',
        title: 'Shortest Path in Binary Matrix',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/',
        patternId: 'bfs',
        hint: 'All moves cost 1, so plain BFS with eight directions from the top-left cell gives the answer; count rings until you reach the bottom-right.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'network-delay-time',
        title: 'Network Delay Time',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/network-delay-time/',
        patternId: 'shortest-path',
        hint: 'Run Dijkstra from node k and return the largest finite distance; if any node stays at infinity return -1.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'path-with-minimum-effort',
        title: 'Path With Minimum Effort',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/path-with-minimum-effort/',
        patternId: 'shortest-path',
        hint: 'Dijkstra on the grid where the cost of a path is the largest height difference on it, so push max(cost, diff) instead of a sum.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'path-with-maximum-probability',
        title: 'Path with Maximum Probability',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/path-with-maximum-probability/',
        patternId: 'shortest-path',
        hint: 'Dijkstra with a max-heap: multiply probabilities along the path and always expand the most likely node first.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'cheapest-flights-within-k-stops',
        title: 'Cheapest Flights Within K Stops',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/',
        patternId: 'shortest-path',
        hint: 'Run Bellman-Ford for k + 1 rounds, relaxing edges from a copy of the previous round so no path grows by more than one edge per round.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'swim-in-rising-water',
        title: 'Swim in Rising Water',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/swim-in-rising-water/',
        patternId: 'shortest-path',
        hint: 'Treat the answer as the maximum cell height along a path and run Dijkstra pushing max(cost, height); the first time you pop the bottom-right cell you are done.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 5. Union-Find
  // -------------------------------------------------------------------------
  {
    id: 'union-find',
    gateId: 'graphs',
    order: 5,
    title: 'Union-Find: Merging Groups Fast',
    minutes: 25,
    summary: 'Keep track of which nodes belong to the same group while edges are added, with near-constant-time merge and lookup.',
    analogy:
      'At a party, groups of friends stand in circles and each circle has one spokesperson. To check if two people are in the same circle, ask each one who their spokesperson is. When two circles merge, one spokesperson simply starts reporting to the other, and everyone in the smaller circle now belongs to the bigger one.',
    explanation: `Union-Find (also called Disjoint Set Union, DSU) answers two questions very fast: "are these two nodes in the same group?" and "merge these two groups". It shines when edges arrive one by one and you need answers as you go, like detecting which edge closes a cycle or counting how many groups remain.

## The idea
Every node has a \`parent\`. A node whose parent is itself is the **root** (the spokesperson) of its group.
- **find(x)**: follow parents until you reach the root. Two nodes are in the same group if they share a root.
- **union(a, b)**: find both roots. If they differ, make one root point to the other. If they are the same, a and b were already connected, so this edge would create a cycle.

Two small tricks make both operations almost O(1):
- **Path compression**: while finding the root, point every node you pass directly at the root. Next time the walk is one step.
- **Union by size** (or rank): attach the smaller group under the bigger one so trees stay shallow.

\`\`\`python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.groups = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # compress
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                  # already connected
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra              # smaller under bigger
        self.size[ra] += self.size[rb]
        self.groups -= 1
        return True
\`\`\`

## A tiny example
Nodes 0..4, edges arrive: (0,1), (1,2), (3,4), (2,0).
- union(0,1): groups 5 -> 4. union(1,2): 4 -> 3. union(3,4): 3 -> 2.
- union(2,0): find(2) = 0 and find(0) = 0. Same root, return False. This edge is redundant; it closes a cycle.
- Two groups remain: {0,1,2} and {3,4}. That is the "number of connected components".

## Slow versus fast
- Slow: after every new edge, answer "same group?" with a fresh BFS. Each query is O(V + E), so q queries cost O(q x (V + E)).
- Fast: with compression and union by size, each find or union costs O(alpha(n)), where alpha grows so slowly that it is at most 4 for any input you will ever see. q operations cost about O(q).

## Union-Find versus DFS
Both count components in a static graph. Prefer Union-Find when:
- Edges arrive over time and you need answers between additions.
- You need to know which edge first connects two nodes (Redundant Connection, Kruskal's minimum spanning tree).
- You want a very short, iterative solution with no recursion-depth worries.

## Where people go wrong
- Writing \`parent[a] = b\` instead of \`parent[find(a)] = find(b)\`. You must link roots, not the original nodes.
- Skipping compression and by-size, then timing out on long chains.
- Forgetting to map non-integer nodes (emails, strings) to indices first.

## How to recognise it in an interview
- "Connected components", "groups", "provinces", "merge accounts", "same network".
- Edges are given as a list and something is asked about adding or removing one edge.
- "Which edge can be removed so the graph becomes a tree?"`,
    naive: {
      title: 'Run a fresh BFS for every connectivity check',
      description:
        'Store the edges in an adjacency list and, every time you are asked whether a and b are connected, BFS from a and see if b is reached. Simple, but each question costs a full traversal.',
      time: 'O(q * (V + E))',
      space: 'O(V + E)',
      code: {
        python: `from collections import deque

class SlowConnectivity:
    def __init__(self, n):
        self.adj = [[] for _ in range(n)]

    def add_edge(self, a, b):
        self.adj[a].append(b)
        self.adj[b].append(a)

    def connected(self, a, b):
        seen = {a}
        q = deque([a])
        while q:                          # full BFS per query
            node = q.popleft()
            if node == b:
                return True
            for nxt in self.adj[node]:
                if nxt not in seen:
                    seen.add(nxt)
                    q.append(nxt)
        return False`,
        javascript: `class SlowConnectivity {
  constructor(n) {
    this.adj = Array.from({ length: n }, () => []);
  }
  addEdge(a, b) {
    this.adj[a].push(b);
    this.adj[b].push(a);
  }
  connected(a, b) {
    const seen = new Set([a]);
    const queue = [a];
    let head = 0;
    while (head < queue.length) {              // full BFS per query
      const node = queue[head++];
      if (node === b) return true;
      for (const nxt of this.adj[node]) {
        if (!seen.has(nxt)) {
          seen.add(nxt);
          queue.push(nxt);
        }
      }
    }
    return false;
  }
}`,
        java: `import java.util.*;

class SlowConnectivity {
  List<List<Integer>> adj = new ArrayList<>();

  SlowConnectivity(int n) {
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
  }

  void addEdge(int a, int b) {
    adj.get(a).add(b);
    adj.get(b).add(a);
  }

  boolean connected(int a, int b) {
    boolean[] seen = new boolean[adj.size()];
    Deque<Integer> q = new ArrayDeque<>();
    q.add(a);
    seen[a] = true;
    while (!q.isEmpty()) {                   // full BFS per query
      int node = q.poll();
      if (node == b) return true;
      for (int nxt : adj.get(node)) {
        if (!seen[nxt]) { seen[nxt] = true; q.add(nxt); }
      }
    }
    return false;
  }
}`,
        cpp: `#include <vector>
#include <queue>
using namespace std;

class SlowConnectivity {
  vector<vector<int>> adj;
public:
  SlowConnectivity(int n) : adj(n) {}

  void addEdge(int a, int b) {
    adj[a].push_back(b);
    adj[b].push_back(a);
  }

  bool connected(int a, int b) {
    vector<bool> seen(adj.size(), false);
    queue<int> q;
    q.push(a);
    seen[a] = true;
    while (!q.empty()) {                     // full BFS per query
      int node = q.front(); q.pop();
      if (node == b) return true;
      for (int nxt : adj[node])
        if (!seen[nxt]) { seen[nxt] = true; q.push(nxt); }
    }
    return false;
  }
}`,
      },
    },
    optimized: {
      title: 'DSU with path compression and union by size',
      description:
        'Each node stores a parent pointer. find() walks to the root and flattens the path on the way; union() links the smaller root under the bigger one. Both become nearly constant time.',
      time: 'O(alpha(n)) per operation, about O(1)',
      space: 'O(n)',
      code: {
        python: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.groups = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                  # already connected -> cycle edge
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra              # smaller under bigger
        self.size[ra] += self.size[rb]
        self.groups -= 1
        return True

    def connected(self, a, b):
        return self.find(a) == self.find(b)`,
        javascript: `class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array(n).fill(1);
    this.groups = n;
  }
  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];   // path compression
      x = this.parent[x];
    }
    return x;
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                      // already connected
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;                             // smaller under bigger
    this.size[ra] += this.size[rb];
    this.groups--;
    return true;
  }
  connected(a, b) { return this.find(a) === this.find(b); }
}`,
        java: `class DSU {
  int[] parent, size;
  int groups;

  DSU(int n) {
    parent = new int[n];
    size = new int[n];
    groups = n;
    for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
  }

  int find(int x) {
    while (parent[x] != x) {
      parent[x] = parent[parent[x]];                  // path compression
      x = parent[x];
    }
    return x;
  }

  boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;                       // already connected
    if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;                                  // smaller under bigger
    size[ra] += size[rb];
    groups--;
    return true;
  }

  boolean connected(int a, int b) { return find(a) == find(b); }
}`,
        cpp: `#include <vector>
using namespace std;

class DSU {
  vector<int> parent, sz;
public:
  int groups;
  DSU(int n) : parent(n), sz(n, 1), groups(n) {
    for (int i = 0; i < n; i++) parent[i] = i;
  }

  int find(int x) {
    while (parent[x] != x) {
      parent[x] = parent[parent[x]];                  // path compression
      x = parent[x];
    }
    return x;
  }

  bool unite(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;                       // already connected
    if (sz[ra] < sz[rb]) swap(ra, rb);
    parent[rb] = ra;                                  // smaller under bigger
    sz[ra] += sz[rb];
    groups--;
    return true;
  }

  bool connected(int a, int b) { return find(a) == find(b); }
}`,
      },
    },
    whyFaster:
      'A BFS per query re-walks the whole graph every time, so q questions cost q full traversals. DSU keeps the answer pre-computed: each node points toward a root, and compression plus union by size keeps every path only a few steps long. That turns each question into a handful of array reads, O(alpha(n)), which is effectively constant.',
    keyPoints: [
      'parent[x] == x means x is the root of its group.',
      'find walks to the root and compresses the path on the way.',
      'union links roots, not the original nodes; smaller group goes under the bigger.',
      'union returning False means the edge closes a cycle.',
      'Track a groups counter to answer "how many components" instantly.',
      'Map strings or emails to integer ids before using DSU.',
    ],
    patternIds: ['union-find', 'dfs'],
    problems: [
      {
        id: 'number-of-provinces',
        title: 'Number of Provinces',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/number-of-provinces/',
        patternId: 'union-find',
        hint: 'Union every pair (i, j) where isConnected[i][j] is 1 and return the number of groups left.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'number-of-connected-components-in-an-undirected-graph',
        title: 'Number of Connected Components in an Undirected Graph',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
        patternId: 'union-find',
        hint: 'Start with n groups, union each edge, and subtract one every time a union actually merges two different roots.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'redundant-connection',
        title: 'Redundant Connection',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/redundant-connection/',
        patternId: 'union-find',
        hint: 'Process edges in order; the first edge whose two ends already share a root is the one to return.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'graph-valid-tree',
        title: 'Graph Valid Tree',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/graph-valid-tree/',
        patternId: 'union-find',
        hint: 'A tree has exactly n - 1 edges and no cycle: fail if any union returns False, then check that exactly one group remains.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'accounts-merge',
        title: 'Accounts Merge',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/accounts-merge/',
        patternId: 'union-find',
        hint: 'Give every email an id, union all emails inside the same account, then group emails by root and sort each group.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'number-of-operations-to-make-network-connected',
        title: 'Number of Operations to Make Network Connected',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/number-of-operations-to-make-network-connected/',
        patternId: 'union-find',
        hint: 'If there are fewer than n - 1 cables the answer is -1; otherwise count components with DSU and return components - 1.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'similar-string-groups',
        title: 'Similar String Groups',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/similar-string-groups/',
        patternId: 'union-find',
        hint: 'Compare every pair of strings, union them if they differ in at most two positions, and return the number of groups.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },
]
