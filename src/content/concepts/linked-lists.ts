import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'linked-list-basics',
    gateId: 'linked-lists',
    order: 1,
    title: 'Linked List Basics',
    minutes: 25,
    summary: 'Nodes that each point to the next one; learn to walk, insert and delete by rewiring pointers instead of shifting data.',
    analogy:
      'A treasure hunt where every clue tells you where the next clue is hidden. You cannot jump to clue number 7; you must follow the chain from the start. But adding a new clue in the middle is easy: change one note to point at the new clue, and make the new clue point at the old next one.',
    explanation: `A **linked list** is a chain of nodes. Each node holds a value and a pointer to the next node. The last node points to nothing (\`None\` in Python, \`null\` elsewhere). Unlike an array, the nodes can live anywhere in memory, so inserting or deleting a node does not shift anything. You care because linked lists appear in interviews constantly, and every trick (reversal, cycle detection, merging) builds on the basics here.

## The idea

- A node is a tiny object: \`val\` and \`next\`.
- The list is known only by its **head** (the first node). Lose the head and you lose the list.
- To reach the k-th node you walk k steps from the head. That is O(k), not O(1) like an array.
- To insert after node A: \`new.next = A.next\`, then \`A.next = new\`. Two pointer changes, O(1).
- To delete the node after A: \`A.next = A.next.next\`. One pointer change, O(1).

## A tiny example

The list 1 -> 2 -> 3. Insert 9 after node 2:

\`\`\`python
class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

head = Node(1, Node(2, Node(3)))
second = head.next
new = Node(9)
new.next = second.next   # 9 -> 3
second.next = new        # 2 -> 9
# now 1 -> 2 -> 9 -> 3
\`\`\`

Order of the two lines matters. If you set \`second.next = new\` first, you lose the pointer to 3.

## The dummy node trick

Deleting the head is a special case because nothing points to it. Create a **dummy node** (a fake node placed before the head). Now every real node has a previous node, and the head can be removed with the same code as any other node. Return \`dummy.next\` at the end.

## Step by step: remove every node with value x

The slow way copies all values into a Python list, filters it, and builds a brand new linked list. It works, but it uses O(n) extra memory and misses the point of a linked list.

The fast way walks the list with a \`prev\` pointer starting at the dummy. If \`prev.next.val == x\`, skip that node with \`prev.next = prev.next.next\`. Otherwise advance \`prev\`. Same O(n) time, but O(1) extra space, and it teaches the pointer discipline every later lesson needs.

\`\`\`python
def remove_elements(head, x):
    dummy = Node(0, head)
    prev = dummy
    while prev.next:
        if prev.next.val == x:
            prev.next = prev.next.next
        else:
            prev = prev.next
    return dummy.next
\`\`\`

## Where people go wrong

- Losing the rest of the list by overwriting a \`next\` pointer before saving it.
- Forgetting that the head might be deleted. Use a dummy.
- Writing \`while cur.next.next\` and crashing when \`cur.next\` is None. Check one level at a time.
- Trying to index into the list like an array. There is no \`list[i]\`; walk to it.

## How to recognise it in an interview

- The input is a \`ListNode\` class with \`val\` and \`next\`.
- The statement says "in place" or "O(1) extra space". That means rewire pointers, do not copy to an array.
- Phrases like "remove the node", "insert after", "the k-th node from the end".`,
    naive: {
      title: 'Copy to an array, filter, rebuild',
      description:
        'Walk the list once and push every value into an array. Filter out the unwanted values, then build a brand new list from what remains. Simple, but it allocates a whole second copy.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def remove_elements(head, x):
    vals = []
    cur = head
    while cur:
        if cur.val != x:
            vals.append(cur.val)
        cur = cur.next
    dummy = ListNode(0)
    tail = dummy
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
        javascript: `function removeElements(head, x) {
  const vals = [];
  for (let cur = head; cur; cur = cur.next) {
    if (cur.val !== x) vals.push(cur.val);
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
        java: `import java.util.*;

class Solution {
  public ListNode removeElements(ListNode head, int x) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode cur = head; cur != null; cur = cur.next) {
      if (cur.val != x) vals.add(cur.val);
    }
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    for (int v : vals) {
      tail.next = new ListNode(v);
      tail = tail.next;
    }
    return dummy.next;
  }
}`,
        cpp: `#include <vector>
using namespace std;

class Solution {
public:
  ListNode* removeElements(ListNode* head, int x) {
    vector<int> vals;
    for (ListNode* cur = head; cur; cur = cur->next) {
      if (cur->val != x) vals.push_back(cur->val);
    }
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (int v : vals) {
      tail->next = new ListNode(v);
      tail = tail->next;
    }
    return dummy.next;
  }
};`,
      },
    },
    optimized: {
      title: 'Rewire pointers in place with a dummy node',
      description:
        'Put a dummy node before the head. Keep a prev pointer; whenever prev.next holds the unwanted value, skip it by pointing prev.next one node further. No new nodes are created.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def remove_elements(head, x):
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next:
        if prev.next.val == x:
            prev.next = prev.next.next
        else:
            prev = prev.next
    return dummy.next`,
        javascript: `function removeElements(head, x) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next) {
    if (prev.next.val === x) prev.next = prev.next.next;
    else prev = prev.next;
  }
  return dummy.next;
}`,
        java: `class Solution {
  public ListNode removeElements(ListNode head, int x) {
    ListNode dummy = new ListNode(0, head);
    ListNode prev = dummy;
    while (prev.next != null) {
      if (prev.next.val == x) prev.next = prev.next.next;
      else prev = prev.next;
    }
    return dummy.next;
  }
}`,
        cpp: `class Solution {
public:
  ListNode* removeElements(ListNode* head, int x) {
    ListNode dummy(0, head);
    ListNode* prev = &dummy;
    while (prev->next) {
      if (prev->next->val == x) prev->next = prev->next->next;
      else prev = prev->next;
    }
    return dummy.next;
  }
};`,
      },
    },
    whyFaster:
      'Both versions visit every node once, so the time stays O(n). The difference is memory: the naive version stores every value in an array and then allocates a second list of new nodes, which is O(n) extra space. The in-place version only moves one pointer, so it uses O(1) extra space and does not allocate anything. Interviewers ask for exactly this.',
    keyPoints: [
      'A node is val + next. The list is known only through its head.',
      'Save the next pointer before you overwrite it, or you lose the rest of the list.',
      'Insert and delete are O(1) once you are at the right node; getting there is O(k).',
      'A dummy node before the head removes the special case of deleting the head.',
      'Check for None one step at a time: cur, then cur.next, then cur.next.next.',
    ],
    patternIds: ['two-pointers', 'fast-slow-pointers'],
    problems: [
      {
        id: 'remove-linked-list-elements',
        title: 'Remove Linked List Elements',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/remove-linked-list-elements/',
        patternId: 'two-pointers',
        hint: 'Use a dummy node and a prev pointer; skip prev.next whenever its value matches.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'remove-duplicates-from-sorted-list',
        title: 'Remove Duplicates from Sorted List',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/',
        patternId: 'two-pointers',
        hint: 'Because the list is sorted, duplicates are neighbours: while cur.next.val equals cur.val, skip cur.next.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'delete-node-in-a-linked-list',
        title: 'Delete Node in a Linked List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/delete-node-in-a-linked-list/',
        patternId: 'two-pointers',
        hint: 'You cannot reach the previous node, so copy the next node value into this one and skip the next node instead.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'design-linked-list',
        title: 'Design Linked List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-linked-list/',
        patternId: 'two-pointers',
        hint: 'Keep a dummy head and a size counter; every operation walks to the node just before the target index.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'remove-nth-node-from-end-of-list',
        title: 'Remove Nth Node From End of List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
        patternId: 'fast-slow-pointers',
        hint: 'Move a fast pointer n + 1 steps ahead of a slow pointer starting at a dummy; when fast hits None, slow is right before the node to remove.',
        xp: 40,
        tier: 'advanced',
      },
    ],
    definition:
      'A linked list is a sequence of nodes where each node stores a value and a reference to the next node, and the list as a whole is known only through its first node, the head. The last node points to None, which is what marks the end.',
    coreIdea:
      'An array stores positions; a linked list stores directions. Because a node only has to know who comes next, you can insert or delete by rewriting one or two references instead of shifting every element after it, so those edits cost O(1) instead of O(n). The price is that you lose random access: reaching the k-th node costs k hops, so there is no O(1) indexing and no binary search.',
    visual: [
      {
        caption: 'Three nodes. The head pointer is the only way in.',
        frame: [
          'head',
          ' |',
          ' v',
          ' 1 -> 2 -> 3 -> None',
          'lose the head and the whole list is gone',
        ].join('\n'),
      },
      {
        caption: 'Walking is one hop at a time. Node 3 costs three hops.',
        frame: [
          'step 1:  1 -> 2 -> 3 -> None',
          '         ^cur',
          'step 2:  1 -> 2 -> 3 -> None',
          '              ^cur',
          'step 3:  1 -> 2 -> 3 -> None',
          '                   ^cur',
          'step 4:  cur is None, stop',
        ].join('\n'),
      },
      {
        caption: 'Insert 9 after node 2. First point the new node at node 3.',
        frame: [
          'before:  1 -> 2 -> 3 -> None',
          '              ^prev',
          'step A:  new.next = prev.next',
          '         1 -> 2 -> 3 -> None',
          '              9 ---^',
        ].join('\n'),
      },
      {
        caption: 'Then point node 2 at the new node. Two writes, nothing moved.',
        frame: [
          'step B:  prev.next = new',
          '         1 -> 2 -> 9 -> 3 -> None',
          '',
          'no data was shifted, so the cost is O(1)',
        ].join('\n'),
      },
      {
        caption: 'Delete is one write: skip over the node you no longer want.',
        frame: [
          'delete the node after prev (value 9)',
          '         1 -> 2 -> 9 -> 3 -> None',
          '              ^prev',
          'prev.next = prev.next.next',
          '         1 -> 2 -> 3 -> None',
          'the 9 node is now unreachable',
        ].join('\n'),
      },
      {
        caption: 'A dummy node in front makes deleting the head an ordinary case.',
        frame: [
          '         D -> 1 -> 2 -> 3 -> None',
          '         ^prev',
          'prev.next = prev.next.next',
          '         D -> 2 -> 3 -> None',
          'return dummy.next  ->  2 -> 3 -> None',
        ].join('\n'),
      },
    ],
    pseudocode: `function removeValue(head, x):
    dummy = new Node(0)
    dummy.next = head
    prev = dummy
    while prev.next is not empty:
        if prev.next.value equals x:
            prev.next = prev.next.next   // unlink, do NOT advance
        else:
            prev = prev.next             // keep it, move on
    return dummy.next`,
    complexity: [
      { label: 'Reach the k-th node', time: 'O(k)', space: 'O(1)', note: 'no index, you hop from the head' },
      { label: 'Insert after a node you hold', time: 'O(1)', space: 'O(1)', note: 'two pointer writes' },
      { label: 'Delete the node after one you hold', time: 'O(1)', space: 'O(1)', note: 'one pointer write' },
      { label: 'Search for a value', time: 'O(n)', space: 'O(1)', note: 'scan from the head' },
      { label: 'Remove every node with value x', time: 'O(n)', space: 'O(1)', note: 'one pass with a dummy node' },
    ],
    dryRun: {
      input: 'head = 1 -> 2 -> 6 -> 3 -> 6 -> None, x = 6',
      goal: 'Remove every node whose value is 6, changing pointers only.',
      steps: [
        {
          state: 'list = D -> 1 -> 2 -> 6 -> 3 -> 6, prev = D',
          action: 'prev.next is node 1 and 1 is not 6, so keep it and move prev to node 1.',
        },
        {
          state: 'prev = node 1',
          action: 'prev.next is node 2 and 2 is not 6, so move prev to node 2.',
        },
        {
          state: 'prev = node 2',
          action: 'prev.next is a 6. Set prev.next = prev.next.next so node 2 now points at node 3. prev deliberately stays put.',
        },
        {
          state: 'list = D -> 1 -> 2 -> 3 -> 6, prev = node 2',
          action: 'prev.next is node 3, which is not 6, so move prev to node 3.',
        },
        {
          state: 'prev = node 3',
          action: 'prev.next is the last 6. Unlink it, so prev.next becomes None. prev stays put again.',
        },
        {
          state: 'list = D -> 1 -> 2 -> 3 -> None, prev = node 3',
          action: 'prev.next is None, so the while loop ends.',
        },
      ],
      result:
        'Return dummy.next, which is 1 -> 2 -> 3 -> None. It is correct because prev only advances past a node we decided to keep, so every node was inspected exactly once and no match could be skipped.',
    },
    mistakes: [
      {
        mistake: 'Unlinking a node and then advancing prev in the same iteration.',
        why: 'The node that just became prev.next is never tested, so two matching values in a row (6 -> 6) leave the second one in the list.',
        fix: 'Advance prev only in the else branch. After an unlink, loop again with the same prev.',
      },
      {
        mistake: 'Writing cur.next = something before saving nxt = cur.next.',
        why: 'cur.next is the only reference to the rest of the list. Once you overwrite it, everything after cur is unreachable.',
        fix: 'The order is always save, rewire, advance: nxt = cur.next, then change cur.next, then cur = nxt.',
      },
      {
        mistake: 'Handling deletion of the head with a special if branch instead of a dummy node.',
        why: 'The logic is duplicated, and the case where every node must be removed is easy to get wrong, returning a stale head.',
        fix: 'Put a dummy node before the head, work only through prev, and return dummy.next.',
      },
      {
        mistake: 'Testing cur.next.next before testing cur.next.',
        why: 'On a one-node list cur.next is None, so reading .next on it raises AttributeError. Conditions are evaluated left to right.',
        fix: 'Check pointers in order: cur, then cur.next, then cur.next.next.',
      },
      {
        mistake: 'Assuming len(head) or head[2] works on a linked list.',
        why: 'A linked list stores no length and supports no indexing. Both need a walk from the head.',
        fix: 'Count with a loop if you need the length, or use a two-pointer gap when you need a position measured from the end.',
      },
    ],
    whenToUse: [
      'The problem hands you a head pointer and asks you to change the structure, not the values.',
      'You insert or delete in the middle far more often than you look up by position.',
      'You need O(1) splicing, for example moving a node inside an LRU cache.',
      'The data must grow without a fixed capacity and without copying on resize.',
      'Nodes must keep their identity because other code holds references to them.',
    ],
    whenNotToUse: [
      'You need the k-th element quickly; use an array or Python list, where indexing is O(1).',
      'You want to binary search the data; that needs O(1) indexing, so copy into an array first.',
      'You only append at the end and read; a dynamic array is faster and uses less memory per element.',
      'You often need the previous node; use a doubly linked list, or carry a prev pointer as you walk.',
      'Tight numeric loops where cache locality matters; array elements sit together in memory, nodes do not.',
    ],
    relatedTopics: [
      { id: 'reversal-and-middle', kind: 'concept', why: 'Reversal is the save-then-rewire step from this page applied to every node in turn.' },
      { id: 'cycle-detection', kind: 'concept', why: 'It assumes you can already walk a list safely with the right None checks.' },
      { id: 'lru-cache', kind: 'concept', why: 'An LRU cache is a hash map plus a doubly linked list and lives on O(1) unlinking.' },
      { id: 'arrays-basics', kind: 'concept', why: 'The direct trade-off: arrays give O(1) indexing, linked lists give O(1) splicing.' },
      { id: 'two-pointers', kind: 'pattern', why: 'A prev and cur pair walking one list is the linked-list form of two pointers.' },
    ],
    quiz: [
      {
        question: 'You already hold a pointer to node p in the middle of a singly linked list. What does inserting a new node right after p cost?',
        options: [
          'O(1), because only two next pointers change',
          'O(n), because the nodes after p must shift along',
          'O(log n), because the list is halved',
          'O(n), because the length has to be recomputed',
        ],
        answerIndex: 0,
        explanation:
          'Nothing moves in memory. You set new.next = p.next and then p.next = new. Getting to p may have been slow, but the insert itself is constant.',
      },
      {
        question: 'What is wrong with this loop: cur = head; while cur: cur.next = prev; prev = cur; cur = cur.next',
        options: [
          'Nothing, it reverses the list correctly',
          'cur.next was already overwritten, so cur = cur.next walks backwards instead of forwards',
          'prev should start at head',
          'It only fails on an empty list',
        ],
        answerIndex: 1,
        explanation: 'By the time cur = cur.next runs, cur.next points at prev. Save the next node before rewiring.',
      },
      {
        question: 'You must answer 1000 queries of the form "give me the element at index i" on a list of 100000 nodes. What does each query cost on a linked list?',
        options: [
          'O(1), the same as an array',
          'O(n), because each query walks from the head, which is about 100 million hops in total',
          'O(log n), using binary search',
          'O(n log n)',
        ],
        answerIndex: 1,
        explanation:
          'A linked list has no indexing. If you need many index lookups, copy the values into an array once and pay O(1) per query afterwards.',
      },
      {
        question: 'Why does a dummy node help when you are deleting nodes?',
        options: [
          'It makes the list circular',
          'It gives every real node a predecessor, so removing the head needs no special case',
          'It speeds up traversal',
          'It stores the length of the list',
        ],
        answerIndex: 1,
        explanation:
          'With a dummy in front, the head is just prev.next like any other node. You return dummy.next at the end, which is correct even if everything was removed.',
      },
      {
        question: 'You are given only a pointer to the node you must delete, not the head, and it is not the last node. Does prev.next = prev.next.next work?',
        options: [
          'Yes, prev is reachable in O(1)',
          'No, but you can copy the next value into this node and then unlink the next node',
          'No, deletion is impossible without the head',
          'Yes, because singly linked nodes store a prev pointer',
        ],
        answerIndex: 1,
        explanation:
          'You cannot reach the predecessor, so you overwrite this node with its successor and skip the successor. The trick fails only for the final node, which is why the problem excludes it.',
      },
    ],
    sources: [
      'CLRS ch. 10 (elementary data structures)',
      'MIT 6.006: Data Structures and Dynamic Arrays',
      'VisuAlgo: Linked List',
      'Python documentation: data structures and list performance',
    ],
  },
  {
    id: 'reversal-and-middle',
    gateId: 'linked-lists',
    order: 2,
    title: 'Reversal and Finding the Middle',
    minutes: 30,
    summary: 'Reverse a list in place with three pointers and find the middle with fast and slow pointers; together they solve palindrome and reorder problems.',
    analogy:
      'Reversing a list is like turning around a line of people holding hands: each person lets go of the hand in front and grabs the hand behind, one at a time. Finding the middle is like two runners on a track: one runs twice as fast, and when the fast one finishes the slow one is exactly halfway.',
    explanation: `Two skills appear in almost every linked list interview: reversing a list without extra memory, and finding its middle in one pass. Once you can do both, you can check whether a list is a palindrome, reorder it, or reverse just a part of it. You care because "reverse a linked list" is one of the most asked questions in the world, and the follow-ups are where candidates separate.

## The idea: in-place reversal

Walk the list with three pointers: \`prev\`, \`cur\` and \`nxt\`.

- Save \`nxt = cur.next\` so you do not lose the rest.
- Flip the arrow: \`cur.next = prev\`.
- Step forward: \`prev = cur\`, \`cur = nxt\`.
- When \`cur\` becomes None, \`prev\` is the new head.

## A tiny example

1 -> 2 -> 3. Start: prev = None, cur = 1.

- nxt = 2. 1.next = None. prev = 1, cur = 2.
- nxt = 3. 2.next = 1. prev = 2, cur = 3.
- nxt = None. 3.next = 2. prev = 3, cur = None. Done: 3 -> 2 -> 1.

\`\`\`python
def reverse(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev
\`\`\`

## The idea: fast and slow pointers for the middle

Start both pointers at the head. Move \`slow\` one step and \`fast\` two steps each loop. When \`fast\` reaches the end, \`slow\` is at the middle. For an even length, this version lands on the second middle node. If you want the first middle, loop while \`fast.next and fast.next.next\`.

\`\`\`python
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
\`\`\`

## Step by step: is the list a palindrome?

The slow way copies every value into an array and checks whether the array equals its reverse. O(n) time, but O(n) extra space.

The fast way finds the middle, reverses the second half in place, then walks both halves together comparing values. Still O(n) time, but O(1) extra space. Many interviewers accept the array version only as a warm-up and then ask for the O(1) space version.

## Reversing part of a list

To reverse nodes from position left to right, walk to the node before left, reverse exactly right - left + 1 nodes with the same three-pointer loop, then reconnect: the node before left points to the new head of the reversed part, and the old first node of the part points to whatever came after. Draw it on paper; it is fiddly but mechanical.

## Where people go wrong

- Forgetting \`nxt = cur.next\` before flipping, which disconnects the rest of the list.
- Off-by-one on the middle for even lengths. Decide which middle you need and pick the loop condition to match.
- Not reconnecting the tail after reversing a sub-list.
- Reversing the second half for a palindrome check and then forgetting to reverse it back if the problem says not to modify the input.

## How to recognise it in an interview

- "Reverse", "reorder", "swap pairs", "reverse in groups of k".
- "Middle of the list", "second half", "palindrome".
- "O(1) extra space" or "in place" written in the constraints.`,
    naive: {
      title: 'Copy values to an array and rebuild in reverse',
      description:
        'Walk the list collecting values, then walk the list again writing the values back in reverse order. It works but needs an array as large as the list.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def reverse_list(head):
    vals = []
    cur = head
    while cur:
        vals.append(cur.val)
        cur = cur.next
    cur = head
    for v in reversed(vals):
        cur.val = v
        cur = cur.next
    return head`,
        javascript: `function reverseList(head) {
  const vals = [];
  for (let cur = head; cur; cur = cur.next) vals.push(cur.val);
  let cur = head;
  for (let i = vals.length - 1; i >= 0; i--) {
    cur.val = vals[i];
    cur = cur.next;
  }
  return head;
}`,
        java: `import java.util.*;

class Solution {
  public ListNode reverseList(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode cur = head; cur != null; cur = cur.next) vals.add(cur.val);
    ListNode cur = head;
    for (int i = vals.size() - 1; i >= 0; i--) {
      cur.val = vals.get(i);
      cur = cur.next;
    }
    return head;
  }
}`,
        cpp: `#include <vector>
using namespace std;

class Solution {
public:
  ListNode* reverseList(ListNode* head) {
    vector<int> vals;
    for (ListNode* cur = head; cur; cur = cur->next) vals.push_back(cur->val);
    ListNode* cur = head;
    for (int i = (int)vals.size() - 1; i >= 0; i--) {
      cur->val = vals[i];
      cur = cur->next;
    }
    return head;
  }
};`,
      },
    },
    optimized: {
      title: 'Three-pointer in-place reversal',
      description:
        'Keep prev, cur and nxt. Save nxt, point cur back at prev, then move both pointers forward. When cur runs off the end, prev is the new head. No extra memory at all.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev`,
        javascript: `function reverseList(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }
  return prev;
}`,
        java: `class Solution {
  public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode cur = head;
    while (cur != null) {
      ListNode nxt = cur.next;
      cur.next = prev;
      prev = cur;
      cur = nxt;
    }
    return prev;
  }
}`,
        cpp: `class Solution {
public:
  ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* cur = head;
    while (cur) {
      ListNode* nxt = cur->next;
      cur->next = prev;
      prev = cur;
      cur = nxt;
    }
    return prev;
  }
};`,
      },
    },
    whyFaster:
      'Both approaches touch each node a constant number of times, so time is O(n) either way. The array version needs O(n) extra memory to hold every value, and it also relies on being allowed to overwrite node values. The three-pointer version changes only the next pointers and uses three variables, so extra space is O(1). It also works when nodes must keep their identity, which follow-up questions often require.',
    keyPoints: [
      'Reversal loop: save nxt, flip cur.next to prev, advance prev and cur.',
      'Fast and slow pointers find the middle in one pass; pick the loop condition for the middle you need.',
      'Palindrome check in O(1) space: find middle, reverse second half, compare, optionally restore.',
      'Reversing a sub-list is the same loop plus careful reconnection at both ends.',
      'Draw the pointers on paper before coding; most bugs are lost pointers.',
    ],
    patternIds: ['in-place-reversal', 'fast-slow-pointers'],
    problems: [
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/reverse-linked-list/',
        patternId: 'in-place-reversal',
        hint: 'Three pointers: prev, cur, nxt. Flip one arrow per step.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'middle-of-the-linked-list',
        title: 'Middle of the Linked List',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
        patternId: 'fast-slow-pointers',
        hint: 'Move slow one step and fast two steps; stop when fast or fast.next is None.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'palindrome-linked-list',
        title: 'Palindrome Linked List',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/palindrome-linked-list/',
        patternId: 'fast-slow-pointers',
        hint: 'Find the middle, reverse the second half, then compare the two halves node by node.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'swap-nodes-in-pairs',
        title: 'Swap Nodes in Pairs',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/swap-nodes-in-pairs/',
        patternId: 'in-place-reversal',
        hint: 'Use a dummy node and, for each pair, rewire prev -> second -> first -> rest before moving prev two steps.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'reverse-linked-list-ii',
        title: 'Reverse Linked List II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/reverse-linked-list-ii/',
        patternId: 'in-place-reversal',
        hint: 'Walk to the node before position left, reverse exactly right - left + 1 nodes, then reconnect both ends.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'reorder-list',
        title: 'Reorder List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/reorder-list/',
        patternId: 'fast-slow-pointers',
        hint: 'Find the middle, reverse the second half, then merge the two halves by alternating nodes.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'reverse-nodes-in-k-group',
        title: 'Reverse Nodes in k-Group',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/',
        patternId: 'in-place-reversal',
        hint: 'Check that k nodes remain before reversing a group; reverse it with the standard loop and connect the previous group tail to the new head.',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'Reversing a linked list in place means flipping every next pointer so it points at the previous node, using only three variables and no new nodes. Finding the middle means running one pointer at double speed, so that when the fast one reaches the end the slow one sits at the halfway node.',
    coreIdea:
      'A node only needs to know its new successor, so you can flip one arrow at a time as you walk, provided you save the old next pointer before you overwrite it. That turns reversal into a single pass with three variables instead of a copy of the whole list. The same idea of walking at two speeds finds the middle in one pass: after k rounds slow is at position k and fast is at position 2k, so fast reaching the end puts slow exactly halfway.',
    visual: [
      {
        caption: 'Start. prev is None, cur is the head, nothing flipped yet.',
        frame: [
          'list   1 -> 2 -> 3 -> None',
          '       ^cur',
          'prev = None      nxt = -',
        ].join('\n'),
      },
      {
        caption: 'Step 1: save nxt = 2, flip node 1 back to None, slide both.',
        frame: [
          'save   1 -> 2 -> 3 -> None',
          '       ^cur ^nxt',
          'flip   None <- 1     2 -> 3 -> None',
          'slide  prev = 1, cur = 2',
        ].join('\n'),
      },
      {
        caption: 'Step 2: save nxt = 3, flip node 2 back to node 1, slide both.',
        frame: [
          'now    None <- 1     2 -> 3 -> None',
          '               ^prev ^cur',
          'save   nxt = node 3',
          'flip   None <- 1 <- 2     3 -> None',
          'slide  prev = 2, cur = 3',
        ].join('\n'),
      },
      {
        caption: 'Step 3: save nxt = None, flip node 3 back to node 2, slide both.',
        frame: [
          'now    None <- 1 <- 2     3 -> None',
          '                    ^prev ^cur',
          'save   nxt = None',
          'flip   None <- 1 <- 2 <- 3',
          'slide  prev = 3, cur = None',
        ].join('\n'),
      },
      {
        caption: 'cur is None, so the loop ends and prev is the new head.',
        frame: [
          'result 3 -> 2 -> 1 -> None',
          '       ^prev is what we return',
          '',
          'three variables, zero new nodes, one pass',
        ].join('\n'),
      },
      {
        caption: 'Finding the middle of five nodes: slow moves 1, fast moves 2.',
        frame: [
          'list   1 -> 2 -> 3 -> 4 -> 5 -> None',
          'start    slow = 1   fast = 1',
          'round 1  slow = 2   fast = 3',
          'round 2  slow = 3   fast = 5',
          'check    fast.next is None  ->  stop',
          'slow = 3, the middle node',
        ].join('\n'),
      },
    ],
    pseudocode: `function reverse(head):
    prev = empty
    cur = head
    while cur is not empty:
        nxt = cur.next        // save before overwriting
        cur.next = prev       // flip the arrow
        prev = cur            // slide prev forward
        cur = nxt             // slide cur forward
    return prev               // old tail is the new head

function middle(head):
    slow = head
    fast = head
    while fast is not empty and fast.next is not empty:
        slow = slow.next
        fast = fast.next.next
    return slow               // second middle when length is even`,
    complexity: [
      { label: 'Iterative reverse', time: 'O(n)', space: 'O(1)', note: 'one pass, three variables' },
      { label: 'Recursive reverse', time: 'O(n)', space: 'O(n)', note: 'the call stack is n frames deep' },
      { label: 'Find the middle', time: 'O(n)', space: 'O(1)', note: 'fast walks n while slow walks n/2' },
      { label: 'Palindrome check in place', time: 'O(n)', space: 'O(1)', note: 'middle, reverse half, compare' },
      { label: 'Reverse in groups of k', time: 'O(n)', space: 'O(1)', note: 'every node is flipped exactly once' },
    ],
    dryRun: {
      input: 'head = 1 -> 2 -> 3 -> None',
      goal: 'Reverse the list in place and return the new head.',
      steps: [
        {
          state: 'prev = None, cur = node 1, list = 1 -> 2 -> 3 -> None',
          action: 'cur is not None, so enter the loop and save nxt = cur.next = node 2.',
        },
        {
          state: 'prev = None, cur = node 1, nxt = node 2',
          action: 'cur.next = prev makes node 1 point at None. Then prev = node 1 and cur = node 2.',
        },
        {
          state: 'prev = node 1, cur = node 2, done so far: None <- 1',
          action: 'Save nxt = node 3, flip node 2 to point at node 1, then prev = node 2 and cur = node 3.',
        },
        {
          state: 'prev = node 2, cur = node 3, done so far: None <- 1 <- 2',
          action: 'Save nxt = None, flip node 3 to point at node 2, then prev = node 3 and cur = None.',
        },
        {
          state: 'prev = node 3, cur = None',
          action: 'cur is None, so the while loop ends.',
        },
      ],
      result:
        'Return prev, which is 3 -> 2 -> 1 -> None. Every node was visited once and every arrow flipped once, and prev holds the last node processed, which was the original tail.',
    },
    mistakes: [
      {
        mistake: 'Returning head after the reversal loop instead of prev.',
        why: 'head is now the tail and its next is None, so the caller receives a list of one node.',
        fix: 'Return prev. When the loop exits cur is None and prev is the node you just finished flipping.',
      },
      {
        mistake: 'Writing cur.next = prev before saving nxt = cur.next.',
        why: 'The only reference to the rest of the list is destroyed, so the loop finishes after one node.',
        fix: 'Keep the order: save, flip, slide prev, slide cur.',
      },
      {
        mistake: 'Guarding the middle loop with while fast.next and fast.',
        why: 'Conditions are evaluated left to right, so on an even-length list fast becomes None and reading fast.next raises an error.',
        fix: 'Write while fast and fast.next, in that order.',
      },
      {
        mistake: 'Assuming slow lands on the first middle when the length is even.',
        why: 'With slow and fast both starting at head, a four-node list leaves slow on node 3, the second middle. Split code that expects the first middle then cuts in the wrong place.',
        fix: 'Start fast at head.next, or loop while fast.next and fast.next.next, when you need the first middle.',
      },
      {
        mistake: 'For a palindrome check, comparing until both halves reach None.',
        why: 'On an odd length the two halves differ by one node, so the loop reads past the end of the shorter half.',
        fix: 'Loop only while the reversed second half still has nodes. The extra middle node never needs a partner.',
      },
    ],
    whenToUse: [
      'The statement says reverse, and adds in place or O(1) extra space.',
      'You must compare the front of a list with its back, as in palindrome or reorder problems.',
      'You need the middle node in one pass without first computing the length.',
      'You must process nodes in fixed groups, as in reverse nodes in k-group.',
      'You need the list read backwards but are not allowed to copy the values out.',
    ],
    whenNotToUse: [
      'Copying values is allowed and clarity matters more; push values into an array and read it backwards.',
      'The list is doubly linked; just walk it from the tail, no flipping needed.',
      'You only need the k-th node from the end once; a two-pointer gap is simpler than reversing.',
      'The caller still needs the original list; reversal mutates the input in place.',
      'The data is an array, not a list; swap with two indexes moving inward instead.',
    ],
    relatedTopics: [
      { id: 'linked-list-basics', kind: 'concept', why: 'Reversal is the save-then-rewire step from the basics repeated for every node.' },
      { id: 'cycle-detection', kind: 'concept', why: 'It uses the same fast and slow pair, but to catch a loop rather than find a midpoint.' },
      { id: 'merging-lists', kind: 'concept', why: 'Reorder List splits at the middle, reverses the tail, then merges the two halves.' },
      { id: 'in-place-reversal', kind: 'pattern', why: 'This page is the canonical implementation of that pattern.' },
      { id: 'fast-slow-pointers', kind: 'pattern', why: 'Finding the middle is the simplest possible use of the two-speed walk.' },
    ],
    quiz: [
      {
        question: 'After the loop while cur: nxt = cur.next; cur.next = prev; prev = cur; cur = nxt, what should the function return?',
        options: ['head', 'cur', 'prev', 'nxt'],
        answerIndex: 2,
        explanation: 'cur is None once the loop exits. prev holds the last node processed, which is the original tail and therefore the new head.',
      },
      {
        question: 'What are the time and space costs of the iterative in-place reversal of an n-node list?',
        options: [
          'O(n) time, O(n) space',
          'O(n) time, O(1) space',
          'O(n log n) time, O(1) space',
          'O(n^2) time, O(1) space',
        ],
        answerIndex: 1,
        explanation: 'One pass over the nodes, and only prev, cur and nxt are stored, no matter how large n is.',
      },
      {
        question: 'On 1 -> 2 -> 3 -> 4 -> None with slow = fast = head and the loop while fast and fast.next, where does slow stop?',
        options: ['node 2', 'node 3', 'node 4', 'It raises an error'],
        answerIndex: 1,
        explanation: 'After two rounds slow is at node 3 and fast is None. This loop returns the second middle when the length is even.',
      },
      {
        question: 'A follow-up asks you to check whether a list is a palindrome in O(1) extra space. Is copying the values into a Python list and comparing it with its reverse acceptable?',
        options: [
          'Yes, a Python list does not count as extra space',
          'No: the copy is O(n) memory. Find the middle, reverse the second half in place and compare.',
          'No, palindromes cannot be checked on a linked list',
          'Yes, because slicing is O(1)',
        ],
        answerIndex: 1,
        explanation: 'The copy is correct and O(n) time, but it uses the memory the follow-up forbids. Middle plus in-place reversal is O(1) space.',
      },
      {
        question: 'Why must nxt be saved before executing cur.next = prev?',
        options: [
          'To keep the list sorted',
          'Because cur.next is the only reference to the rest of the list and the flip overwrites it',
          'Because a loop always needs three variables',
          'To make the function tail recursive',
        ],
        answerIndex: 1,
        explanation: 'Nothing else points at the remaining nodes. Overwrite cur.next without saving it and everything after cur is lost.',
      },
    ],
    sources: [
      'CLRS ch. 10 (elementary data structures)',
      'MIT 6.006: Data Structures and Dynamic Arrays',
      'VisuAlgo: Linked List',
      'LeetCode editorial: Reverse Linked List',
    ],
  },
  {
    id: 'cycle-detection',
    gateId: 'linked-lists',
    order: 3,
    title: 'Cycle Detection',
    minutes: 25,
    summary: 'Use a fast and a slow pointer to detect a loop in O(1) space, and find where the loop begins.',
    analogy:
      'Two runners start together on a path. If the path is a straight road, the fast runner reaches the end and never sees the slow one again. If the path loops back on itself, the fast runner eventually laps the slow one and they meet. Meeting proves there is a loop.',
    explanation: `A **cycle** in a linked list means some node's next pointer points back to an earlier node, so walking the list never ends. Detecting cycles is a classic question, and the same idea works on any "follow the pointer" structure such as a function that maps numbers to numbers. You care because the O(1) space trick here, called **Floyd's algorithm** or the tortoise and hare, shows up in several other problems.

## The idea

- Start \`slow\` and \`fast\` at the head.
- Each step, move \`slow\` by one node and \`fast\` by two.
- If \`fast\` reaches None, there is no cycle.
- If \`slow\` and \`fast\` ever point to the same node, there is a cycle.

Why must they meet? Once both are inside the loop, the gap between them shrinks by one each step (fast gains one node on slow per step). A gap that shrinks by one every step must reach zero.

## A tiny example

List: 1 -> 2 -> 3 -> 4 -> back to 2.

- Step 1: slow = 2, fast = 3.
- Step 2: slow = 3, fast = 2 (4 -> 2).
- Step 3: slow = 4, fast = 4. Meet. Cycle found.

## Step by step

The slow way keeps a set of nodes already visited. Walk the list; if the current node is in the set, there is a cycle. This is O(n) time and O(n) space, and it is a perfectly fine first answer.

The fast way is Floyd's algorithm. It is also O(n) time but uses only two pointers, so O(1) space. The interviewer will usually ask "can you do it without extra memory?" and this is the answer.

\`\`\`python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
\`\`\`

Note the check uses \`is\`, not \`==\`. We are asking whether they are the same node, not whether the values are equal.

## Finding where the cycle starts

After slow and fast meet, put one pointer back at the head and leave the other at the meeting point. Move both one step at a time. The node where they meet again is the start of the cycle. The maths: if the distance from head to cycle start is a, and from cycle start to meeting point is b, then when they meet slow has walked a + b and fast has walked 2(a + b). The extra a + b is a whole number of loops, which means walking a more steps from the meeting point lands on the cycle start.

## The same trick on numbers

"Find the duplicate number" gives an array of n + 1 integers in the range 1 to n. Treat each value as a pointer to an index: \`next = nums[cur]\`. A duplicate value means two indexes point to the same place, which creates a cycle. Floyd's algorithm finds the cycle start, which is the duplicate, in O(1) space without modifying the array.

## Where people go wrong

- Starting fast one step ahead and then checking equality before the first move. Start both at head and move before comparing.
- Forgetting to check \`fast.next\` before doing \`fast.next.next\`.
- Comparing values instead of node identity.
- Not resetting one pointer to the head when finding the cycle start.

## How to recognise it in an interview

- "Does the list contain a cycle", "return the node where the cycle begins".
- A sequence defined by repeatedly applying a function: happy numbers, array values used as indexes.
- Two lists that merge into one tail (intersection): a pointer-swap variant of the same idea.`,
    naive: {
      title: 'Remember every visited node in a set',
      description:
        'Walk the list and add each node to a set. If you ever see a node that is already in the set, the list loops. If you reach None, it does not.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def has_cycle(head):
    seen = set()
    cur = head
    while cur:
        if cur in seen:
            return True
        seen.add(cur)
        cur = cur.next
    return False`,
        javascript: `function hasCycle(head) {
  const seen = new Set();
  let cur = head;
  while (cur) {
    if (seen.has(cur)) return true;
    seen.add(cur);
    cur = cur.next;
  }
  return false;
}`,
        java: `import java.util.*;

class Solution {
  public boolean hasCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    ListNode cur = head;
    while (cur != null) {
      if (seen.contains(cur)) return true;
      seen.add(cur);
      cur = cur.next;
    }
    return false;
  }
}`,
        cpp: `#include <unordered_set>
using namespace std;

class Solution {
public:
  bool hasCycle(ListNode* head) {
    unordered_set<ListNode*> seen;
    ListNode* cur = head;
    while (cur) {
      if (seen.count(cur)) return true;
      seen.insert(cur);
      cur = cur->next;
    }
    return false;
  }
};`,
      },
    },
    optimized: {
      title: "Floyd's fast and slow pointers",
      description:
        'Move slow one step and fast two steps. If fast falls off the end there is no cycle; if the two pointers land on the same node there is. Only two variables are used.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
        javascript: `function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
        java: `class Solution {
  public boolean hasCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
      slow = slow.next;
      fast = fast.next.next;
      if (slow == fast) return true;
    }
    return false;
  }
}`,
        cpp: `class Solution {
public:
  bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
      slow = slow->next;
      fast = fast->next->next;
      if (slow == fast) return true;
    }
    return false;
  }
};`,
      },
    },
    whyFaster:
      'Both methods are O(n) in time, because the fast pointer laps the slow one within one trip around the loop. The set-based method must store a reference to every node, which is O(n) memory and, in practice, a lot of hashing work. Floyd\'s method stores two pointers, so its extra space is O(1). It is the version interviewers want when they say "without extra memory".',
    keyPoints: [
      'Slow moves one step, fast moves two; they meet if and only if there is a cycle.',
      'Always check fast and fast.next before moving fast two steps.',
      'Compare node identity, not node value.',
      'To find the cycle start, reset one pointer to the head and move both one step at a time.',
      'Any "follow the pointer" sequence (arrays as indexes, happy numbers) can use the same trick.',
    ],
    patternIds: ['fast-slow-pointers', 'hash-map'],
    problems: [
      {
        id: 'linked-list-cycle',
        title: 'Linked List Cycle',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/linked-list-cycle/',
        patternId: 'fast-slow-pointers',
        hint: 'Slow and fast pointers; return true the moment they point at the same node.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'happy-number',
        title: 'Happy Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/happy-number/',
        patternId: 'fast-slow-pointers',
        hint: 'Treat "sum of squared digits" as next(); a number is happy if the fast pointer reaches 1 before meeting the slow one.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'intersection-of-two-linked-lists',
        title: 'Intersection of Two Linked Lists',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
        patternId: 'two-pointers',
        hint: 'Walk two pointers; when one reaches the end, switch it to the other list head, and they will meet at the intersection or both at None.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'linked-list-cycle-ii',
        title: 'Linked List Cycle II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/linked-list-cycle-ii/',
        patternId: 'fast-slow-pointers',
        hint: 'After the pointers meet, send one back to the head and move both one step at a time until they meet again.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'find-the-duplicate-number',
        title: 'Find the Duplicate Number',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-the-duplicate-number/',
        patternId: 'fast-slow-pointers',
        hint: 'Use nums[i] as the next pointer from index i; the duplicate is the start of the cycle.',
        xp: 40,
        tier: 'advanced',
      },
    ],
    definition:
      'A linked list has a cycle when some node points back at a node that was already visited, so walking forward from the head never reaches None. Floyd cycle detection, the tortoise and hare, finds this by moving one pointer one node per round and another two nodes per round and checking whether they ever stand on the same node.',
    coreIdea:
      'Watch the two pointers from the slow one point of view. Each round fast moves 2 and slow moves 1, so relative to slow, fast advances exactly one node per round around a circle of L nodes. Something that advances one node at a time around a circle cannot jump over anything, so it must land on slow within L rounds. That replaces the question "have I been here before?", which normally needs O(n) stored nodes, with two variables and O(1) memory.',
    visual: [
      {
        caption: 'The list. Node 5 points back at node 3, so 3, 4, 5 form a loop of length 3.',
        frame: [
          '1 -> 2 -> 3 -> 4 -> 5',
          '          ^         |',
          '          +---------+',
          'nodes 1 and 2 are the tail leading in',
        ].join('\n'),
      },
      {
        caption: 'Round by round. Both start on node 1; fast gains one node each round.',
        frame: [
          'round 0   slow = 1    fast = 1',
          'round 1   slow = 2    fast = 3',
          'round 2   slow = 3    fast = 5',
          'round 3   slow = 4    fast = 4   <- MEET',
          '',
          'fast went 5 -> 3 -> 4, slow went 3 -> 4',
        ].join('\n'),
      },
      {
        caption: 'Why they must meet: the gap shrinks by exactly one every round.',
        frame: [
          'loop length L = 3, positions 3=0, 4=1, 5=2',
          'gap = (fast - slow) mod 3',
          'round 2   slow=3 fast=5   gap = 2',
          'round 3   slow=4 fast=4   gap = 0',
          '',
          'gap goes up by 1 each round on a circle of 3,',
          'so it hits 0 within 3 rounds. No skipping.',
        ].join('\n'),
      },
      {
        caption: 'Finding where the loop starts: reset one pointer to the head.',
        frame: [
          'meeting point is node 4',
          'p1 = head = 1        p2 = 4',
          'round 1   p1 = 2     p2 = 5',
          'round 2   p1 = 3     p2 = 3   <- MEET',
          '',
          'node 3 is the entrance of the loop',
        ].join('\n'),
      },
      {
        caption: 'No cycle: the fast pointer simply runs out of list.',
        frame: [
          'list  1 -> 2 -> 3 -> 4 -> None',
          'round 0   slow = 1    fast = 1',
          'round 1   slow = 2    fast = 3',
          'round 2   slow = 3    fast = None',
          'guard "while fast and fast.next" fails',
          'return False',
        ].join('\n'),
      },
      {
        caption: 'The same trick on an array read as a set of pointers.',
        frame: [
          'nums = [1, 3, 4, 2, 2]',
          'read it as   i  ->  nums[i]',
          '0 -> 1 -> 3 -> 2 -> 4 -> 2 -> 4 ...',
          '                   ^ loop starts at 2',
          'the repeated value IS the loop entrance',
        ].join('\n'),
      },
    ],
    pseudocode: `function hasCycle(head):
    slow = head
    fast = head
    while fast is not empty and fast.next is not empty:
        slow = slow.next
        fast = fast.next.next
        if slow is the same node as fast:
            return true
    return false

function cycleStart(head):
    meeting = the node where hasCycle met, or empty
    if meeting is empty:
        return empty
    walker = head
    while walker is not the same node as meeting:
        walker = walker.next
        meeting = meeting.next
    return walker`,
    complexity: [
      { label: 'No cycle present', time: 'O(n)', space: 'O(1)', note: 'fast reaches the end after n/2 rounds' },
      { label: 'Cycle present', time: 'O(n)', space: 'O(1)', note: 'at most tail length plus loop length rounds' },
      { label: 'Find the cycle entrance', time: 'O(n)', space: 'O(1)', note: 'one extra walk of at most n steps' },
      { label: 'Visited-set alternative', time: 'O(n)', space: 'O(n)', note: 'stores a reference to every node seen' },
    ],
    dryRun: {
      input: 'head = 1 -> 2 -> 3 -> 4 -> 5, and node 5 points back at node 3',
      goal: 'Decide whether walking from the head ever repeats a node, using O(1) memory.',
      steps: [
        {
          state: 'slow = node 1, fast = node 1',
          action: 'fast and fast.next both exist, so enter the loop.',
        },
        {
          state: 'slow = node 2, fast = node 3',
          action: 'slow took one step, fast took two. They are different nodes, so keep going.',
        },
        {
          state: 'slow = node 3, fast = node 5',
          action: 'Both pointers are now inside the loop 3 -> 4 -> 5 -> 3. Still different nodes.',
        },
        {
          state: 'slow = node 4, fast = node 4',
          action: 'fast went 5 -> 3 -> 4 while slow went 3 -> 4, so both land on node 4.',
        },
        {
          state: 'slow is fast',
          action: 'The identity check succeeds, so the function returns True.',
        },
      ],
      result:
        'True, and they met on node 4. This proves a cycle exists because a pointer that only ever moves forward can revisit a node only if some next pointer leads backwards.',
    },
    mistakes: [
      {
        mistake: 'Comparing slow.val == fast.val instead of comparing the nodes themselves.',
        why: 'A perfectly normal list such as 1 -> 2 -> 1 -> None has repeated values, so the code reports a cycle that does not exist.',
        fix: 'Compare identity: slow is fast in Python, slow == fast on references in Java or JavaScript.',
      },
      {
        mistake: 'Guarding the loop with while fast.next and fast, or with while fast.next.next.',
        why: 'When fast becomes None the very first attribute read crashes, because conditions are evaluated left to right.',
        fix: 'Use exactly while fast and fast.next.',
      },
      {
        mistake: 'Starting slow at head and fast at head.next, then reusing the meeting point to find the entrance.',
        why: 'The offset start breaks the distance equality that the reset-to-head step relies on, so the second phase lands on the wrong node.',
        fix: 'Start both pointers at head whenever you also need the cycle entrance.',
      },
      {
        mistake: 'Returning the meeting node as the start of the cycle.',
        why: 'The two pointers meet somewhere inside the loop, which is almost never the entrance.',
        fix: 'Reset one pointer to the head and advance both one step at a time. Where they meet again is the entrance.',
      },
      {
        mistake: 'Detecting the cycle with a set of node values.',
        why: 'Values legitimately repeat, and only the node object is unique.',
        fix: 'Store the node objects themselves (or their ids), or use the two-pointer method and pay no memory at all.',
      },
    ],
    whenToUse: [
      'The statement says detect a loop, or warns that the list may not terminate.',
      'The follow-up asks for O(1) extra memory.',
      'A sequence is defined by "the next value comes from the current one", as with happy numbers or nums[nums[i]].',
      'You need where the repetition starts, not just whether it happens.',
      'The input is n + 1 numbers in the range 1 to n and you may not modify the array.',
    ],
    whenNotToUse: [
      'O(n) memory is fine and you want the shortest correct code; a visited set is easier to get right.',
      'You need the full list of nodes on the cycle, not only its entrance; a set records the path directly.',
      'The structure is a general graph with several outgoing edges per node; use DFS with visiting and visited marks.',
      'You are allowed to modify the nodes; marking them as visited is simpler, though it destroys the input.',
      'The list is doubly linked and known to be well formed; there is nothing to detect.',
    ],
    relatedTopics: [
      { id: 'reversal-and-middle', kind: 'concept', why: 'It uses the same two-speed walk, but stops at the midpoint instead of at a meeting.' },
      { id: 'hash-map-basics', kind: 'concept', why: 'The O(n) space alternative is simply a set of the nodes already visited.' },
      { id: 'graph-representation-bfs-dfs', kind: 'concept', why: 'Cycle detection in a general graph needs DFS colouring rather than two pointers.' },
      { id: 'fast-slow-pointers', kind: 'pattern', why: 'This concept is that pattern in its purest form.' },
    ],
    quiz: [
      {
        question: 'Once both pointers are inside a loop of length L, why are they guaranteed to meet?',
        options: [
          'Because L is always even',
          'Because relative to slow, fast advances exactly one node per round around a circle of L nodes, so it cannot skip past slow',
          'Because fast eventually reaches None',
          'Because the values in the loop are sorted',
        ],
        answerIndex: 1,
        explanation: 'Fast gains one position per round. A gap that changes by one each time around a circle of L positions must hit zero within L rounds.',
      },
      {
        question: 'How much extra memory does the tortoise and hare use on a list of n nodes?',
        options: [
          'O(n), one entry per visited node',
          'O(log n)',
          'O(1), just the two pointers',
          'O(n), but only when a cycle exists',
        ],
        answerIndex: 2,
        explanation: 'The algorithm stores slow and fast and nothing else, whatever n is. That is the whole reason it beats a visited set.',
      },
      {
        question: 'Slow and fast meet at some node m. What do you do next to find where the cycle begins?',
        options: [
          'Return m, it is the entrance',
          'Move fast one more step and return it',
          'Reset one pointer to the head, then advance both one step at a time until they meet',
          'Count the loop length and walk that many steps from the head',
        ],
        answerIndex: 2,
        explanation: 'The distance from the head to the entrance equals the remaining distance from m to the entrance around the loop, so both pointers arrive there together.',
      },
      {
        question: 'You must find the one duplicate in an array of n + 1 integers from 1 to n, in O(1) extra space and without modifying the array. Does cycle detection apply?',
        options: [
          'No, it only works on real linked lists',
          'Yes: read i -> nums[i] as a next pointer, and the duplicate is the entrance of the cycle',
          'Yes, but only if the array is sorted first',
          'No, you have to sort the array',
        ],
        answerIndex: 1,
        explanation: 'Two different indexes holding the same value give that value two incoming edges, which is exactly what makes a node the entrance of a cycle.',
      },
      {
        question: 'Which guard is safe before moving fast two steps?',
        options: ['while fast.next and fast', 'while fast and fast.next', 'while fast.next.next', 'while slow and slow.next'],
        answerIndex: 1,
        explanation: 'Conditions are evaluated left to right, so fast must be checked for None before any of its fields are read.',
      },
    ],
    sources: [
      'CLRS ch. 10 (elementary data structures)',
      'CP-Algorithms: cycle detection in a functional graph (Floyd)',
      'MIT 6.006: Data Structures and Dynamic Arrays',
      'LeetCode editorial: Linked List Cycle II',
      'VisuAlgo: Linked List',
    ],
  },
  {
    id: 'merging-lists',
    gateId: 'linked-lists',
    order: 4,
    title: 'Merging Lists',
    minutes: 30,
    summary: 'Merge sorted lists by walking two pointers and attaching the smaller node; extend to k lists with a heap or divide and conquer.',
    analogy:
      'Two queues of people are already sorted by height. To make one sorted queue, look at the two people at the front, send the shorter one through, and repeat. You never look at anyone behind the front of each queue. With many queues, a referee (the heap) tells you which front person is shortest.',
    explanation: `Merging two sorted lists into one sorted list is the heart of merge sort, and on linked lists it needs no extra memory at all: you just reattach existing nodes. You care because the two-pointer merge is asked directly, and it is the building block for sorting a linked list, merging k lists, and adding numbers stored as lists.

## The idea

- Create a dummy node and a \`tail\` pointer that starts at the dummy.
- While both lists have nodes, compare their heads. Attach the smaller one to \`tail.next\`, then move that list's pointer and \`tail\` forward.
- When one list runs out, attach the rest of the other list in one step.
- Return \`dummy.next\`.

## A tiny example

A = 1 -> 4, B = 2 -> 3.

- Compare 1 and 2: attach 1. A = 4.
- Compare 4 and 2: attach 2. B = 3.
- Compare 4 and 3: attach 3. B is empty.
- Attach the rest of A: 4. Result 1 -> 2 -> 3 -> 4.

\`\`\`python
def merge(a, b):
    dummy = ListNode(0)
    tail = dummy
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next
\`\`\`

## Step by step

The slow way collects all values from both lists into an array, sorts it, and builds a new list. That is O((n + m) log(n + m)) time and O(n + m) space, and it ignores the fact that both inputs are already sorted.

The fast way is the two-pointer merge above: O(n + m) time because every node is looked at once, and O(1) extra space because nodes are reused. The \`<=\` in the comparison keeps the merge stable (equal values keep their original order).

## Merging k lists

Merging k sorted lists one after another is slow: the first list gets re-walked for every merge, giving O(k * N) where N is the total number of nodes. Two better options:

- **Min-heap of heads**: push the head of each list into a heap keyed by value. Pop the smallest, attach it, push its next. Each node enters the heap once, so O(N log k).
- **Divide and conquer**: merge lists in pairs, then merge the results in pairs, and so on. There are log k rounds, each touching N nodes: O(N log k).

## Sorting a linked list

Merge sort fits linked lists perfectly. Find the middle with fast and slow pointers, cut the list in two, sort each half recursively, and merge with the function above. Time O(n log n), extra space only for the recursion.

## Where people go wrong

- Creating new nodes instead of reattaching the existing ones. Wastes memory and sometimes breaks "in place" requirements.
- Forgetting to attach the leftover of the non-empty list after the loop.
- In add-two-numbers, forgetting the final carry when both lists are done.
- Merging k lists one by one and wondering why it times out.

## How to recognise it in an interview

- "Two sorted lists", "k sorted lists", "sort a linked list".
- "Numbers stored in reverse order as linked lists", which is a merge-style walk with a carry.
- "Partition a list around a value", which is a split into two lists and then a join.`,
    naive: {
      title: 'Collect all values, sort, rebuild',
      description:
        'Walk both lists pushing values into one array, sort the array, and build a new list from it. Correct, but it throws away the fact that the inputs are already sorted.',
      time: 'O((n + m) log(n + m))',
      space: 'O(n + m)',
      code: {
        python: `def merge_two_lists(a, b):
    vals = []
    for node in (a, b):
        while node:
            vals.append(node.val)
            node = node.next
    vals.sort()
    dummy = ListNode(0)
    tail = dummy
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
        javascript: `function mergeTwoLists(a, b) {
  const vals = [];
  for (let cur = a; cur; cur = cur.next) vals.push(cur.val);
  for (let cur = b; cur; cur = cur.next) vals.push(cur.val);
  vals.sort((x, y) => x - y);
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
        java: `import java.util.*;

class Solution {
  public ListNode mergeTwoLists(ListNode a, ListNode b) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode cur = a; cur != null; cur = cur.next) vals.add(cur.val);
    for (ListNode cur = b; cur != null; cur = cur.next) vals.add(cur.val);
    Collections.sort(vals);
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    for (int v : vals) {
      tail.next = new ListNode(v);
      tail = tail.next;
    }
    return dummy.next;
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    vector<int> vals;
    for (ListNode* cur = a; cur; cur = cur->next) vals.push_back(cur->val);
    for (ListNode* cur = b; cur; cur = cur->next) vals.push_back(cur->val);
    sort(vals.begin(), vals.end());
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (int v : vals) {
      tail->next = new ListNode(v);
      tail = tail->next;
    }
    return dummy.next;
  }
};`,
      },
    },
    optimized: {
      title: 'Two-pointer merge reusing the nodes',
      description:
        'Compare the heads of both lists and attach the smaller node to the tail of the result. When one list is exhausted, attach the remainder of the other. Every node is visited once and no new nodes are made.',
      time: 'O(n + m)',
      space: 'O(1)',
      code: {
        python: `def merge_two_lists(a, b):
    dummy = ListNode(0)
    tail = dummy
    while a and b:
        if a.val <= b.val:
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
    tail.next = a if a else b
    return dummy.next`,
        javascript: `function mergeTwoLists(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a ? a : b;
  return dummy.next;
}`,
        java: `class Solution {
  public ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (a != null && b != null) {
      if (a.val <= b.val) {
        tail.next = a;
        a = a.next;
      } else {
        tail.next = b;
        b = b.next;
      }
      tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
  }
}`,
        cpp: `class Solution {
public:
  ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (a && b) {
      if (a->val <= b->val) {
        tail->next = a;
        a = a->next;
      } else {
        tail->next = b;
        b = b->next;
      }
      tail = tail->next;
    }
    tail->next = a ? a : b;
    return dummy.next;
  }
};`,
      },
    },
    whyFaster:
      'Sorting an array of n + m values costs O((n + m) log(n + m)) and needs a full copy of the data. The two-pointer merge uses the fact that both inputs are already sorted: the smallest remaining value is always at one of the two heads, so one comparison per node is enough. That gives linear time, and because nodes are relinked rather than copied, extra space is constant.',
    keyPoints: [
      'Dummy node plus tail pointer: attach the smaller head, advance, repeat.',
      'After the loop, attach whichever list still has nodes.',
      'Use <= so equal values keep their original order (stable merge).',
      'k lists: min-heap of heads or pairwise divide and conquer, both O(N log k).',
      'Merge sort on a linked list = find middle, split, sort halves, merge.',
    ],
    patternIds: ['two-pointers', 'k-way-merge', 'divide-and-conquer'],
    problems: [
      {
        id: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        patternId: 'two-pointers',
        hint: 'Dummy node, compare heads, attach the smaller, and attach the leftover list at the end.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'add-two-numbers',
        title: 'Add Two Numbers',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/add-two-numbers/',
        patternId: 'two-pointers',
        hint: 'Walk both lists together with a carry; keep looping while either list or the carry is non-zero.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'partition-list',
        title: 'Partition List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/partition-list/',
        patternId: 'two-pointers',
        hint: 'Build two separate lists (less than x, and the rest) with two dummy heads, then join them.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'sort-list',
        title: 'Sort List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-list/',
        patternId: 'divide-and-conquer',
        hint: 'Merge sort: find the middle with slow and fast pointers, cut the list, sort both halves, then merge.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'merge-k-sorted-lists',
        title: 'Merge k Sorted Lists',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        patternId: 'k-way-merge',
        hint: 'Push the head of each list into a min-heap keyed by value; pop the smallest, attach it, and push its next node.',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'Merging two sorted linked lists means producing one sorted list containing all their nodes, by repeatedly taking whichever of the two current front nodes is smaller. On a linked list no new nodes are needed: you reattach the existing ones.',
    coreIdea:
      'Because both inputs are already sorted, the smallest value not yet used is always sitting at one of the two front nodes. One comparison therefore decides the next output node, and each node is decided exactly once. That replaces the O((n + m) log(n + m)) cost of sorting everything with a single linear pass, and because you relink nodes instead of copying them the extra memory is constant.',
    visual: [
      {
        caption: 'Setup: a dummy node D and a tail pointer, so there is no empty-result case.',
        frame: [
          'a:    1 -> 3 -> 5 -> None',
          'b:    2 -> 4 -> None',
          'out:  D',
          '      ^tail',
        ].join('\n'),
      },
      {
        caption: 'Compare the two heads: 1 <= 2, so node 1 is attached and a moves on.',
        frame: [
          'compare  a=1  b=2   ->  take a',
          'out:  D -> 1',
          '           ^tail',
          'a:    3 -> 5 -> None',
          'b:    2 -> 4 -> None',
        ].join('\n'),
      },
      {
        caption: 'Now 2 < 3, so node 2 is attached and b moves on.',
        frame: [
          'compare  a=3  b=2   ->  take b',
          'out:  D -> 1 -> 2',
          '                ^tail',
          'a:    3 -> 5 -> None',
          'b:    4 -> None',
        ].join('\n'),
      },
      {
        caption: 'Back to a: 3 <= 4, so node 3 is attached.',
        frame: [
          'compare  a=3  b=4   ->  take a',
          'out:  D -> 1 -> 2 -> 3',
          '                     ^tail',
          'a:    5 -> None',
          'b:    4 -> None',
        ].join('\n'),
      },
      {
        caption: 'Then 4 < 5, so node 4 is attached and b becomes empty.',
        frame: [
          'compare  a=5  b=4   ->  take b',
          'out:  D -> 1 -> 2 -> 3 -> 4',
          '                          ^tail',
          'a:    5 -> None',
          'b:    None      <- loop ends here',
        ].join('\n'),
      },
      {
        caption: 'One list is empty, so attach the whole remainder of the other in one write.',
        frame: [
          'tail.next = a',
          'out:  D -> 1 -> 2 -> 3 -> 4 -> 5 -> None',
          'return D.next',
          '      1 -> 2 -> 3 -> 4 -> 5 -> None',
          '',
          'no node was created, only relinked',
        ].join('\n'),
      },
    ],
    pseudocode: `function mergeSorted(a, b):
    dummy = new Node(0)
    tail = dummy
    while a is not empty and b is not empty:
        if a.value <= b.value:          // <= keeps it stable
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
    if a is not empty:
        tail.next = a                   // attach the leftover
    else:
        tail.next = b
    return dummy.next`,
    complexity: [
      { label: 'Merge two lists of n and m nodes', time: 'O(n + m)', space: 'O(1)', note: 'one comparison per output node' },
      { label: 'Merge sort a list of n nodes', time: 'O(n log n)', space: 'O(log n)', note: 'log n split levels on the call stack' },
      { label: 'Merge k lists with a min-heap', time: 'O(N log k)', space: 'O(k)', note: 'N nodes total, heap holds one head per list' },
      { label: 'Merge k lists pairwise', time: 'O(N log k)', space: 'O(1)', note: 'log k rounds, each round touches N nodes' },
      { label: 'Merge k lists one after another', time: 'O(N k)', space: 'O(1)', note: 'the growing result is rescanned every round' },
    ],
    dryRun: {
      input: 'a = 1 -> 3 -> 5 -> None, b = 2 -> 4 -> None',
      goal: 'Build one sorted list out of both, without creating any new nodes.',
      steps: [
        {
          state: 'dummy = D, tail = D, a = 1, b = 2',
          action: 'Both lists are non-empty. 1 <= 2, so tail.next = node 1, a moves to node 3, tail moves to node 1.',
        },
        {
          state: 'out = D -> 1, tail = 1, a = 3, b = 2',
          action: '3 <= 2 is false, so tail.next = node 2, b moves to node 4, tail moves to node 2.',
        },
        {
          state: 'out = D -> 1 -> 2, tail = 2, a = 3, b = 4',
          action: '3 <= 4, so tail.next = node 3, a moves to node 5, tail moves to node 3.',
        },
        {
          state: 'out = D -> 1 -> 2 -> 3, tail = 3, a = 5, b = 4',
          action: '5 <= 4 is false, so tail.next = node 4, b becomes None, tail moves to node 4.',
        },
        {
          state: 'out = D -> 1 -> 2 -> 3 -> 4, tail = 4, a = 5, b = None',
          action: 'b is None, so the while loop ends.',
        },
        {
          state: 'a = 5, b = None',
          action: 'tail.next = a attaches the entire rest of a in one write, which here is just node 5.',
        },
      ],
      result:
        'Return dummy.next, which is 1 -> 2 -> 3 -> 4 -> 5 -> None. It is sorted because each step appended the smallest value still available anywhere, and nothing was copied.',
    },
    mistakes: [
      {
        mistake: 'Forgetting to attach the leftover list after the while loop.',
        why: 'The loop stops as soon as either list empties, so the tail of the longer list is silently dropped and nodes disappear.',
        fix: 'Finish with tail.next = a if a else b. One line, and it also covers both lists being empty.',
      },
      {
        mistake: 'Using < instead of <= when comparing the two heads.',
        why: 'Equal values are then taken from the second list first, which breaks stability. Problems that must keep the original relative order of equal items fail.',
        fix: 'Use <= so a tie is always resolved in favour of the first list.',
      },
      {
        mistake: 'Building the result out of brand new nodes.',
        why: 'It doubles the memory for no reason, and it breaks follow-ups where the caller still holds references to the original node objects.',
        fix: 'Relink what already exists: tail.next = a, then advance a.',
      },
      {
        mistake: 'Merging k lists by folding each one into a growing accumulator.',
        why: 'The accumulated result is walked again in every round, so the cost is about N k instead of N log k. With k = 10000 that is the difference between passing and timing out.',
        fix: 'Use a min-heap of the k current heads, or merge lists in pairs so that k halves every round.',
      },
      {
        mistake: 'Splitting a list for merge sort without cutting the first half.',
        why: 'If the node before the middle still points forward, the "first half" runs to the very end, so the sub-problem is not smaller and the recursion never terminates.',
        fix: 'Keep a prev pointer while finding the middle and set prev.next = None before recursing.',
      },
    ],
    whenToUse: [
      'Two or more inputs are already sorted and the output must stay sorted.',
      'The statement says merge, combine or interleave sorted sequences.',
      'You must sort a linked list; merge sort fits because splitting a list is cheap and no random access is needed.',
      'You are walking two sequences in step, with a carry or an offset, as in adding two numbers.',
      'Extra memory is limited and you cannot afford to copy the nodes into an array.',
    ],
    whenNotToUse: [
      'The inputs are not sorted; sort first, or use a hash map if you only need membership.',
      'You need the k smallest of a huge stream rather than a full merge; keep a heap of size k.',
      'The data is in arrays and allocation is fine; a plain two-index merge into a new array is simpler and faster.',
      'You need random access to the merged result; merge into an array so indexing stays O(1).',
      'Only the distinct values matter and duplicates should collapse; a set or sorted set fits better.',
    ],
    relatedTopics: [
      { id: 'merge-sort', kind: 'concept', why: 'The merge here is exactly the combine step of merge sort, written for nodes.' },
      { id: 'heap-basics', kind: 'concept', why: 'A min-heap of the k heads is what keeps the k-way merge at O(N log k).' },
      { id: 'reversal-and-middle', kind: 'concept', why: 'Merge sort on a list needs the fast and slow midpoint in order to split.' },
      { id: 'k-way-merge', kind: 'pattern', why: 'Merging k lists is the general form of this two-list merge.' },
      { id: 'two-pointers', kind: 'pattern', why: 'One pointer per list, each advancing only when its own value is consumed.' },
    ],
    quiz: [
      {
        question: 'You merge k sorted lists holding N nodes in total by repeatedly merging the accumulated result with the next list. What is the total time?',
        options: ['O(N log k)', 'O(N k)', 'O(N)', 'O(k log N)'],
        answerIndex: 1,
        explanation: 'The accumulated result is walked again in every round, so the work adds up to roughly N k / 2. A heap or pairwise merging brings it down to O(N log k).',
      },
      {
        question: 'Why does the merge compare with <= rather than <?',
        options: [
          'It is faster',
          'It keeps the merge stable, so equal values from the first list stay in front',
          'It prevents an infinite loop',
          'It is needed for negative numbers',
        ],
        answerIndex: 1,
        explanation: 'With <= a tie is resolved in favour of list a, which preserves the original relative order of equal values.',
      },
      {
        question: 'What does the dummy node give you?',
        options: [
          'It stores the length of the result',
          'It gives tail a real node to write into before the first output node exists, so no "is the result still empty?" branch is needed',
          'It makes the result circular',
          'It makes the comparison faster',
        ],
        answerIndex: 1,
        explanation: 'Without a dummy you would need a special case for setting the head on the first iteration. You return dummy.next at the end.',
      },
      {
        question: 'Both lists are sorted, and you merge them by pushing every value into a Python list, sorting it and rebuilding the chain. Is that a good solution?',
        options: [
          'Yes, it has the same complexity',
          'It is correct but wasteful: O((n + m) log(n + m)) time and O(n + m) space instead of O(n + m) time and O(1) space',
          'No, it produces the wrong answer',
          'Yes, because Python sort is O(n)',
        ],
        answerIndex: 1,
        explanation: 'It throws away the one fact that makes the linear merge possible, namely that both inputs are already sorted.',
      },
      {
        question: 'For merge sort on a list you find the middle with slow and fast pointers and then call sort(head) and sort(slow). What is missing?',
        options: [
          'Nothing, this is correct',
          'You must cut the first half by setting the node before slow to None, otherwise the recursion never shrinks',
          'You must reverse the second half first',
          'You must sort the halves in the opposite order',
        ],
        answerIndex: 1,
        explanation: 'Without the cut, the first half still runs to the end of the list, so the sub-problem is the same size and the recursion does not terminate.',
      },
    ],
    sources: [
      'CLRS ch. 2 (merge sort)',
      'MIT 6.006: Data Structures and Dynamic Arrays',
      'VisuAlgo: Sorting (merge sort)',
      'LeetCode editorial: Merge k Sorted Lists',
    ],
  },
]
