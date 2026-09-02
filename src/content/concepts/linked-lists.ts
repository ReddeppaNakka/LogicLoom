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
      },
      {
        id: 'remove-duplicates-from-sorted-list',
        title: 'Remove Duplicates from Sorted List',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/',
        patternId: 'two-pointers',
        hint: 'Because the list is sorted, duplicates are neighbours: while cur.next.val equals cur.val, skip cur.next.',
        xp: 20,
      },
      {
        id: 'delete-node-in-a-linked-list',
        title: 'Delete Node in a Linked List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/delete-node-in-a-linked-list/',
        patternId: 'two-pointers',
        hint: 'You cannot reach the previous node, so copy the next node value into this one and skip the next node instead.',
        xp: 40,
      },
      {
        id: 'design-linked-list',
        title: 'Design Linked List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-linked-list/',
        patternId: 'two-pointers',
        hint: 'Keep a dummy head and a size counter; every operation walks to the node just before the target index.',
        xp: 40,
      },
      {
        id: 'remove-nth-node-from-end-of-list',
        title: 'Remove Nth Node From End of List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
        patternId: 'fast-slow-pointers',
        hint: 'Move a fast pointer n + 1 steps ahead of a slow pointer starting at a dummy; when fast hits None, slow is right before the node to remove.',
        xp: 40,
      },
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
      },
      {
        id: 'middle-of-the-linked-list',
        title: 'Middle of the Linked List',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
        patternId: 'fast-slow-pointers',
        hint: 'Move slow one step and fast two steps; stop when fast or fast.next is None.',
        xp: 20,
      },
      {
        id: 'palindrome-linked-list',
        title: 'Palindrome Linked List',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/palindrome-linked-list/',
        patternId: 'fast-slow-pointers',
        hint: 'Find the middle, reverse the second half, then compare the two halves node by node.',
        xp: 20,
      },
      {
        id: 'swap-nodes-in-pairs',
        title: 'Swap Nodes in Pairs',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/swap-nodes-in-pairs/',
        patternId: 'in-place-reversal',
        hint: 'Use a dummy node and, for each pair, rewire prev -> second -> first -> rest before moving prev two steps.',
        xp: 40,
      },
      {
        id: 'reverse-linked-list-ii',
        title: 'Reverse Linked List II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/reverse-linked-list-ii/',
        patternId: 'in-place-reversal',
        hint: 'Walk to the node before position left, reverse exactly right - left + 1 nodes, then reconnect both ends.',
        xp: 40,
      },
      {
        id: 'reorder-list',
        title: 'Reorder List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/reorder-list/',
        patternId: 'fast-slow-pointers',
        hint: 'Find the middle, reverse the second half, then merge the two halves by alternating nodes.',
        xp: 40,
      },
      {
        id: 'reverse-nodes-in-k-group',
        title: 'Reverse Nodes in k-Group',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/',
        patternId: 'in-place-reversal',
        hint: 'Check that k nodes remain before reversing a group; reverse it with the standard loop and connect the previous group tail to the new head.',
        xp: 80,
      },
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
      },
      {
        id: 'happy-number',
        title: 'Happy Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/happy-number/',
        patternId: 'fast-slow-pointers',
        hint: 'Treat "sum of squared digits" as next(); a number is happy if the fast pointer reaches 1 before meeting the slow one.',
        xp: 20,
      },
      {
        id: 'intersection-of-two-linked-lists',
        title: 'Intersection of Two Linked Lists',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
        patternId: 'two-pointers',
        hint: 'Walk two pointers; when one reaches the end, switch it to the other list head, and they will meet at the intersection or both at None.',
        xp: 20,
      },
      {
        id: 'linked-list-cycle-ii',
        title: 'Linked List Cycle II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/linked-list-cycle-ii/',
        patternId: 'fast-slow-pointers',
        hint: 'After the pointers meet, send one back to the head and move both one step at a time until they meet again.',
        xp: 40,
      },
      {
        id: 'find-the-duplicate-number',
        title: 'Find the Duplicate Number',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-the-duplicate-number/',
        patternId: 'fast-slow-pointers',
        hint: 'Use nums[i] as the next pointer from index i; the duplicate is the start of the cycle.',
        xp: 40,
      },
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
      },
      {
        id: 'add-two-numbers',
        title: 'Add Two Numbers',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/add-two-numbers/',
        patternId: 'two-pointers',
        hint: 'Walk both lists together with a carry; keep looping while either list or the carry is non-zero.',
        xp: 40,
      },
      {
        id: 'partition-list',
        title: 'Partition List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/partition-list/',
        patternId: 'two-pointers',
        hint: 'Build two separate lists (less than x, and the rest) with two dummy heads, then join them.',
        xp: 40,
      },
      {
        id: 'sort-list',
        title: 'Sort List',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-list/',
        patternId: 'divide-and-conquer',
        hint: 'Merge sort: find the middle with slow and fast pointers, cut the list, sort both halves, then merge.',
        xp: 40,
      },
      {
        id: 'merge-k-sorted-lists',
        title: 'Merge k Sorted Lists',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        patternId: 'k-way-merge',
        hint: 'Push the head of each list into a min-heap keyed by value; pop the smallest, attach it, and push its next node.',
        xp: 80,
      },
    ],
  },
]
