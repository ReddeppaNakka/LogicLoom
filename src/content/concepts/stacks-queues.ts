import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'stack-basics',
    gateId: 'stacks-queues',
    order: 1,
    title: 'Stack Basics',
    minutes: 25,
    summary: 'Last in, first out: push and pop from one end in O(1), and use it to match brackets, evaluate expressions and undo actions.',
    analogy:
      'A stack of plates in a canteen. You put a clean plate on top, and the next person takes the plate from the top. Nobody digs out a plate from the middle. The last plate placed is the first plate taken.',
    explanation: `A **stack** is a list where you only add and remove at one end, called the top. Adding is **push**, removing is **pop**, and looking without removing is **peek**. All three are O(1). This is called LIFO: last in, first out. You care because stacks are the natural tool whenever the most recent unfinished thing must be handled first: matching brackets, undo buttons, function calls, and expression evaluation.

## The idea

- In Python a plain list is a stack: \`append\` is push, \`pop()\` is pop, \`stack[-1]\` is peek.
- The stack remembers things you have seen but not yet finished with.
- When something "closes" or "resolves", it always resolves the most recent open item. That is exactly a pop.

## A tiny example: valid brackets

Is \`"([]){}"\` balanced? Walk the string.

- \`(\`: push. Stack: [ ( ]
- \`[\`: push. Stack: [ ( [ ]
- \`]\`: pop, it was \`[\`, matches. Stack: [ ( ]
- \`)\`: pop, it was \`(\`, matches. Stack: []
- \`{\`: push. \`}\`: pop, matches. Stack: []

Empty stack at the end means balanced. A mismatch, or popping from an empty stack, means not balanced.

\`\`\`python
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
        else:
            stack.append(c)
    return not stack
\`\`\`

## Step by step: min stack

Design a stack that also returns its minimum in O(1).

The slow way stores values in a list and, for \`get_min\`, scans the whole list. Push and pop are O(1) but \`get_min\` is O(n). Call it a million times and you have a problem.

The fast way keeps a second stack of minimums. When you push x, also push \`min(x, current_min)\` onto the min stack. When you pop, pop both. The top of the min stack is always the minimum of what remains. Every operation is now O(1), at the cost of O(n) extra space for the second stack.

## Other classic uses

- **Reverse Polish notation**: push numbers; on an operator pop two, compute, push the result.
- **Decode string** like \`3[a2[c]]\`: push the current string and count when you see \`[\`, pop and repeat when you see \`]\`.
- **Queue from two stacks**: push into stack A; to pop, move everything to stack B once and pop from B. Each element moves at most twice, so operations are O(1) on average.
- **The call stack**: recursion is a stack the language manages for you. Any recursive DFS can be rewritten with an explicit stack.

## Where people go wrong

- Popping without checking for an empty stack.
- Forgetting the final check: a leftover \`(\` at the end means the string is not valid.
- Using \`list.pop(0)\` for a queue in Python. That is O(n). Use \`collections.deque\`.
- Storing only values in a min stack and trying to recompute the minimum after a pop.

## How to recognise it in an interview

- Matching or nesting: brackets, tags, nested encodings.
- "Most recent" or "last unfinished": undo, browser back button, backspace in a string.
- Evaluate an expression, especially postfix or with nested parentheses.
- "Design a data structure with O(1) push, pop and X". X is usually served by a second stack.`,
    naive: {
      title: 'Min stack that scans for the minimum',
      description:
        'Keep the values in a list. Push and pop are direct. To get the minimum, walk the whole list every time. Correct but getMin becomes O(n).',
      time: 'O(n) per getMin',
      space: 'O(n)',
      code: {
        python: `class MinStack:
    def __init__(self):
        self.data = []

    def push(self, x):
        self.data.append(x)

    def pop(self):
        self.data.pop()

    def top(self):
        return self.data[-1]

    def get_min(self):
        return min(self.data)   # scans everything`,
        javascript: `class MinStack {
  constructor() {
    this.data = [];
  }
  push(x) {
    this.data.push(x);
  }
  pop() {
    this.data.pop();
  }
  top() {
    return this.data[this.data.length - 1];
  }
  getMin() {
    return Math.min(...this.data); // scans everything
  }
}`,
        java: `import java.util.*;

class MinStack {
  private Deque<Integer> data = new ArrayDeque<>();

  public void push(int x) { data.push(x); }
  public void pop() { data.pop(); }
  public int top() { return data.peek(); }

  public int getMin() {
    int best = Integer.MAX_VALUE;
    for (int v : data) best = Math.min(best, v); // scans everything
    return best;
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

class MinStack {
  vector<int> data;
public:
  void push(int x) { data.push_back(x); }
  void pop() { data.pop_back(); }
  int top() { return data.back(); }
  int getMin() {
    return *min_element(data.begin(), data.end()); // scans everything
  }
};`,
      },
    },
    optimized: {
      title: 'Min stack with a parallel stack of minimums',
      description:
        'Alongside the values, keep a second stack where each entry is the minimum of everything at or below that position. Push and pop both stacks together; the top of the second stack is the current minimum.',
      time: 'O(1) per operation',
      space: 'O(n)',
      code: {
        python: `class MinStack:
    def __init__(self):
        self.data = []
        self.mins = []

    def push(self, x):
        self.data.append(x)
        cur_min = min(x, self.mins[-1]) if self.mins else x
        self.mins.append(cur_min)

    def pop(self):
        self.data.pop()
        self.mins.pop()

    def top(self):
        return self.data[-1]

    def get_min(self):
        return self.mins[-1]`,
        javascript: `class MinStack {
  constructor() {
    this.data = [];
    this.mins = [];
  }
  push(x) {
    this.data.push(x);
    const curMin = this.mins.length ? Math.min(x, this.mins[this.mins.length - 1]) : x;
    this.mins.push(curMin);
  }
  pop() {
    this.data.pop();
    this.mins.pop();
  }
  top() {
    return this.data[this.data.length - 1];
  }
  getMin() {
    return this.mins[this.mins.length - 1];
  }
}`,
        java: `import java.util.*;

class MinStack {
  private Deque<Integer> data = new ArrayDeque<>();
  private Deque<Integer> mins = new ArrayDeque<>();

  public void push(int x) {
    data.push(x);
    mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
  }
  public void pop() {
    data.pop();
    mins.pop();
  }
  public int top() { return data.peek(); }
  public int getMin() { return mins.peek(); }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

class MinStack {
  vector<int> data, mins;
public:
  void push(int x) {
    data.push_back(x);
    mins.push_back(mins.empty() ? x : min(x, mins.back()));
  }
  void pop() {
    data.pop_back();
    mins.pop_back();
  }
  int top() { return data.back(); }
  int getMin() { return mins.back(); }
};`,
      },
    },
    whyFaster:
      'Scanning for the minimum costs O(n) on every getMin call, so n calls cost O(n^2). The parallel stack records "the minimum so far" at every level as it is pushed, so after any number of pops the answer for the remaining elements is already sitting on top. Each operation becomes O(1), paid for with one extra integer per element.',
    keyPoints: [
      'Stack = push, pop, peek at one end, all O(1). LIFO: last in, first out.',
      'The stack holds things that are open but not yet resolved; a closing event pops the most recent one.',
      'Always check for an empty stack before popping, and check for leftovers at the end.',
      'To add an O(1) query (min, max) to a stack, keep a parallel stack of running answers.',
      'A Python list is a stack; for a queue use collections.deque, never pop(0).',
    ],
    patternIds: ['monotonic-stack'],
    problems: [
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        patternId: 'monotonic-stack',
        hint: 'Push opening brackets; on a closing bracket, pop and check it matches, and make sure the stack is empty at the end.',
        xp: 20,
      },
      {
        id: 'implement-queue-using-stacks',
        title: 'Implement Queue using Stacks',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
        patternId: 'monotonic-stack',
        hint: 'Push into an input stack; when the output stack is empty, pour the input stack into it, which reverses the order.',
        xp: 20,
      },
      {
        id: 'baseball-game',
        title: 'Baseball Game',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/baseball-game/',
        patternId: 'monotonic-stack',
        hint: 'Keep scores on a stack; C pops, D pushes double the top, + pushes the sum of the top two.',
        xp: 20,
      },
      {
        id: 'min-stack',
        title: 'Min Stack',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/min-stack/',
        patternId: 'monotonic-stack',
        hint: 'Keep a second stack whose top is always the minimum of the elements currently in the main stack.',
        xp: 40,
      },
      {
        id: 'evaluate-reverse-polish-notation',
        title: 'Evaluate Reverse Polish Notation',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
        patternId: 'monotonic-stack',
        hint: 'Push numbers; on an operator pop b then a, compute a op b, and push the result; watch the division direction.',
        xp: 40,
      },
      {
        id: 'decode-string',
        title: 'Decode String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/decode-string/',
        patternId: 'monotonic-stack',
        hint: 'On [ push the current string and repeat count; on ] pop them and append the repeated inner string.',
        xp: 40,
      },
    ],
  },
  {
    id: 'monotonic-stack',
    gateId: 'stacks-queues',
    order: 2,
    title: 'Monotonic Stack',
    minutes: 30,
    summary: 'Keep a stack sorted as you scan so every element finds its next greater or smaller neighbour in O(n) total.',
    analogy:
      'People stand in a line and each one wants to know the first taller person to their right. Walk from the right, keeping a group of candidates. When a new person arrives, everyone shorter than them in the group can never be the answer for anyone further left, so they leave. The group is always sorted, tallest at the bottom.',
    explanation: `A **monotonic stack** is a stack whose elements are always in sorted order (all increasing or all decreasing from bottom to top). You keep it sorted by popping elements that would break the order before you push. This one idea answers "next greater element" style questions for every position in O(n) total, replacing the obvious O(n^2). You care because it solves an unusually large family of interview problems: daily temperatures, stock spans, histogram areas, trapping rain water, and more.

## The idea

- Scan the array once. The stack holds indexes of elements that are still waiting for their answer.
- Before pushing the current element, pop every stack element that is smaller (for "next greater"). The current element is the answer for each of them.
- Push the current index.
- Whatever is left on the stack at the end has no answer (use -1 or 0).

Each index is pushed once and popped at most once, so the total work is O(n) even though there is a loop inside a loop.

## A tiny example: daily temperatures

Temperatures [73, 74, 75, 71, 76]. We want, for each day, how many days until a warmer day.

- i = 0 (73): stack empty, push 0. Stack: [0]
- i = 1 (74): 74 > 73, pop 0, answer[0] = 1 - 0 = 1. Push 1. Stack: [1]
- i = 2 (75): pop 1, answer[1] = 1. Push 2. Stack: [2]
- i = 3 (71): 71 < 75, push 3. Stack: [2, 3]
- i = 4 (76): pop 3, answer[3] = 1. Pop 2, answer[2] = 2. Push 4.
- End: index 4 has no warmer day, answer[4] = 0.

Result: [1, 1, 2, 1, 0].

## Step by step

The slow way, for each day, scans to the right until it finds a warmer day. On a decreasing list like [100, 99, 98, ...] every scan runs to the end, which is O(n^2). For n = 100,000 that is ten billion steps.

The fast way is the monotonic stack above. Each element enters and leaves the stack once. O(n) time and O(n) space for the stack.

\`\`\`python
def daily_temperatures(temps):
    ans = [0] * len(temps)
    stack = []                       # indexes, temps decreasing
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            ans[j] = i - j
        stack.append(i)
    return ans
\`\`\`

## Choosing the direction

- Next greater to the right: scan left to right, pop while top < current.
- Next smaller to the right: pop while top > current.
- Previous greater or smaller to the left: the element left on top after popping is the answer for the current index.
- Largest rectangle in a histogram: for each bar you need the nearest shorter bar on both sides. One increasing stack pass gives both, because the moment a bar is popped, the current index is its right boundary and the new top is its left boundary.

## Where people go wrong

- Storing values instead of indexes. You almost always need the index to compute distances or widths.
- Getting the comparison backwards. Say out loud which order the stack must keep, then pop whatever breaks it.
- Forgetting to handle equal elements. Decide whether equal counts as "greater" and use < or <= to match.
- Forgetting the leftover elements at the end. Sometimes you add a sentinel (a fake final element of value 0 or infinity) to flush the stack.

## How to recognise it in an interview

- "Next greater element", "next warmer day", "how many days until".
- "Previous smaller element", "span of consecutive days with price less than or equal".
- "Largest rectangle", "maximum area", "water trapped between bars".
- Any question about the nearest element to the left or right that satisfies a comparison.`,
    naive: {
      title: 'For each day, scan forward for a warmer day',
      description:
        'Two nested loops. For every index i, walk j from i + 1 until you find a larger temperature. Fine for small inputs, but decreasing sequences make every scan run to the end.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def daily_temperatures(temps):
    n = len(temps)
    ans = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            if temps[j] > temps[i]:
                ans[i] = j - i
                break
    return ans`,
        javascript: `function dailyTemperatures(temps) {
  const n = temps.length;
  const ans = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temps[j] > temps[i]) {
        ans[i] = j - i;
        break;
      }
    }
  }
  return ans;
}`,
        java: `class Solution {
  public int[] dailyTemperatures(int[] temps) {
    int n = temps.length;
    int[] ans = new int[n];
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (temps[j] > temps[i]) {
          ans[i] = j - i;
          break;
        }
      }
    }
    return ans;
  }
}`,
        cpp: `#include <vector>
using namespace std;

class Solution {
public:
  vector<int> dailyTemperatures(vector<int>& temps) {
    int n = temps.size();
    vector<int> ans(n, 0);
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (temps[j] > temps[i]) {
          ans[i] = j - i;
          break;
        }
      }
    }
    return ans;
  }
};`,
      },
    },
    optimized: {
      title: 'Monotonic decreasing stack of indexes',
      description:
        'Scan once. Keep a stack of indexes whose temperatures are decreasing. When the current temperature is warmer than the top, pop it and record the distance. Each index is pushed and popped at most once.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def daily_temperatures(temps):
    ans = [0] * len(temps)
    stack = []
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            ans[j] = i - j
        stack.append(i)
    return ans`,
        javascript: `function dailyTemperatures(temps) {
  const ans = new Array(temps.length).fill(0);
  const stack = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
      const j = stack.pop();
      ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}`,
        java: `import java.util.*;

class Solution {
  public int[] dailyTemperatures(int[] temps) {
    int[] ans = new int[temps.length];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < temps.length; i++) {
      while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {
        int j = stack.pop();
        ans[j] = i - j;
      }
      stack.push(i);
    }
    return ans;
  }
}`,
        cpp: `#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
  vector<int> dailyTemperatures(vector<int>& temps) {
    vector<int> ans(temps.size(), 0);
    stack<int> st;
    for (int i = 0; i < (int)temps.size(); i++) {
      while (!st.empty() && temps[st.top()] < temps[i]) {
        int j = st.top();
        st.pop();
        ans[j] = i - j;
      }
      st.push(i);
    }
    return ans;
  }
};`,
      },
    },
    whyFaster:
      'The nested-loop version can rescan the same stretch of the array for many different starting points, which is where the n^2 comes from. The stack version never rescans: once an element is popped it has its answer and is never looked at again. Because each index is pushed once and popped at most once, the inner while loop runs at most n times across the entire scan, so the total is O(n).',
    keyPoints: [
      'Keep the stack sorted; pop whatever breaks the order before pushing the current index.',
      'Store indexes, not values, so you can compute distances and widths.',
      'Each element is pushed once and popped once, so nested loops still add up to O(n).',
      'Next greater: pop while top < current. Next smaller: pop while top > current.',
      'The element left on top after popping is the previous greater/smaller for the current index.',
      'Use a sentinel value at the end to flush the stack when every element needs an answer.',
    ],
    patternIds: ['monotonic-stack'],
    problems: [
      {
        id: 'next-greater-element-i',
        title: 'Next Greater Element I',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/next-greater-element-i/',
        patternId: 'monotonic-stack',
        hint: 'Run a monotonic stack over nums2 to fill a map from value to next greater value, then look up each element of nums1.',
        xp: 20,
      },
      {
        id: 'daily-temperatures',
        title: 'Daily Temperatures',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/daily-temperatures/',
        patternId: 'monotonic-stack',
        hint: 'Stack of indexes with decreasing temperatures; when a warmer day arrives, pop and record i - j.',
        xp: 40,
      },
      {
        id: 'next-greater-element-ii',
        title: 'Next Greater Element II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/next-greater-element-ii/',
        patternId: 'monotonic-stack',
        hint: 'Loop i from 0 to 2n - 1 and use i % n as the index so the circular wrap-around is handled by the same stack.',
        xp: 40,
      },
      {
        id: 'online-stock-span',
        title: 'Online Stock Span',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/online-stock-span/',
        patternId: 'monotonic-stack',
        hint: 'Store (price, span) pairs; while the top price is <= the new price, pop it and add its span to yours.',
        xp: 40,
      },
      {
        id: 'car-fleet',
        title: 'Car Fleet',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/car-fleet/',
        patternId: 'monotonic-stack',
        hint: 'Sort cars by position descending, compute each arrival time, and push a new fleet only when a car arrives later than the fleet ahead.',
        xp: 40,
      },
      {
        id: 'largest-rectangle-in-histogram',
        title: 'Largest Rectangle in Histogram',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
        patternId: 'monotonic-stack',
        hint: 'Increasing stack of indexes; when a shorter bar arrives, pop and compute height * (i - new_top - 1), and append a 0 bar at the end.',
        xp: 80,
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/trapping-rain-water/',
        patternId: 'monotonic-stack',
        hint: 'Decreasing stack; when a taller bar arrives, pop the bottom of a valley and add (min(left, right) - bottom) * width.',
        xp: 80,
      },
    ],
  },
  {
    id: 'queue-and-deque',
    gateId: 'stacks-queues',
    order: 3,
    title: 'Queue and Deque',
    minutes: 25,
    summary: 'First in, first out with O(1) at both ends; a deque powers the sliding window maximum in O(n).',
    analogy:
      'A queue is the line at a ticket counter: first to arrive, first served. A deque is a train platform with doors at both ends: passengers can board or leave at the front or the back, but nobody climbs through a window in the middle.',
    explanation: `A **queue** adds at the back and removes at the front: first in, first out (FIFO). A **deque** ("double-ended queue", said "deck") allows push and pop at both ends in O(1). You care because queues drive breadth-first search and any "process in arrival order" task, and the deque is the secret behind the O(n) sliding window maximum, a very common hard-ish interview question.

## The idea

- Python: \`from collections import deque\`. \`append\` and \`popleft\` for a queue; \`appendleft\` and \`pop\` give the other end.
- Never use a plain list with \`pop(0)\`. That shifts every element and costs O(n).
- A **circular queue** stores items in a fixed array with head and tail indexes that wrap around using modulo. This is how queues are built in languages without a deque.

## A tiny example: a queue

\`\`\`python
from collections import deque
q = deque()
q.append(1)      # [1]
q.append(2)      # [1, 2]
q.popleft()      # returns 1, queue is [2]
\`\`\`

## Step by step: sliding window maximum

Given [1, 3, -1, -3, 5, 3, 6, 7] and k = 3, output the maximum of each window of size 3: [3, 3, 5, 5, 6, 7].

The slow way computes \`max(nums[i:i+k])\` for each window. That is O(n * k). With n = 100,000 and k = 50,000 it is far too slow.

The fast way uses a deque of indexes that keeps the values **decreasing** from front to back. The front is always the maximum of the current window.

- Before adding index i, pop from the back while \`nums[back] <= nums[i]\`. Those elements are smaller and older, so they can never be the max again.
- Push i to the back.
- If the front index is out of the window (\`front <= i - k\`), pop it from the front.
- Once i >= k - 1, the front is the answer for this window.

\`\`\`python
from collections import deque

def max_sliding_window(nums, k):
    dq, ans = deque(), []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            ans.append(nums[dq[0]])
    return ans
\`\`\`

Each index is added once and removed at most once, so the whole thing is O(n). This is a monotonic stack that also loses elements from the front, which is why it must be a deque.

## Queue from stacks, stack from queues

Interviewers like these small design questions. A queue from two stacks: push into stack A; to pop, if stack B is empty, move everything from A to B, then pop B. A stack from one queue: after pushing x, rotate the queue by popping and re-pushing size - 1 elements so x is at the front.

## Where people go wrong

- \`list.pop(0)\` in a loop. It looks O(1) but it is O(n).
- In sliding window maximum, storing values instead of indexes, which makes it impossible to know when the front expires.
- Forgetting the \`<=\` versus \`<\` choice. Using \`<=\` removes duplicates of equal value, which is fine for a maximum.
- Off-by-one on when to start recording answers (i >= k - 1).

## How to recognise it in an interview

- "Process in the order they arrive", "first come first served", "level by level" (that is BFS).
- "Maximum or minimum of every window of size k".
- "Recent requests within the last t milliseconds": push new times, pop old times from the front.
- "Design a circular queue or deque".`,
    naive: {
      title: 'Take the max of each window separately',
      description:
        'For every window start i, look at all k elements and take the maximum. Each window costs O(k), and there are about n windows.',
      time: 'O(n * k)',
      space: 'O(1)',
      code: {
        python: `def max_sliding_window(nums, k):
    ans = []
    for i in range(len(nums) - k + 1):
        ans.append(max(nums[i:i + k]))
    return ans`,
        javascript: `function maxSlidingWindow(nums, k) {
  const ans = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let best = nums[i];
    for (let j = i + 1; j < i + k; j++) best = Math.max(best, nums[j]);
    ans.push(best);
  }
  return ans;
}`,
        java: `class Solution {
  public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] ans = new int[n - k + 1];
    for (int i = 0; i + k <= n; i++) {
      int best = nums[i];
      for (int j = i + 1; j < i + k; j++) best = Math.max(best, nums[j]);
      ans[i] = best;
    }
    return ans;
  }
}`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> ans;
    for (int i = 0; i + k <= (int)nums.size(); i++) {
      ans.push_back(*max_element(nums.begin() + i, nums.begin() + i + k));
    }
    return ans;
  }
};`,
      },
    },
    optimized: {
      title: 'Monotonic deque of indexes',
      description:
        'Keep a deque of indexes whose values decrease from front to back. Pop smaller values from the back before pushing, drop the front when it leaves the window, and read the max from the front.',
      time: 'O(n)',
      space: 'O(k)',
      code: {
        python: `from collections import deque

def max_sliding_window(nums, k):
    dq, ans = deque(), []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            ans.append(nums[dq[0]])
    return ans`,
        javascript: `function maxSlidingWindow(nums, k) {
  const dq = []; // indexes; use head pointer to avoid shift()
  let head = 0;
  const ans = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[head] <= i - k) head++;
    if (i >= k - 1) ans.push(nums[dq[head]]);
  }
  return ans;
}`,
        java: `import java.util.*;

class Solution {
  public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] ans = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
      while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
      dq.addLast(i);
      if (dq.peekFirst() <= i - k) dq.pollFirst();
      if (i >= k - 1) ans[i - k + 1] = nums[dq.peekFirst()];
    }
    return ans;
  }
}`,
        cpp: `#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
  vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> ans;
    for (int i = 0; i < (int)nums.size(); i++) {
      while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
      dq.push_back(i);
      if (dq.front() <= i - k) dq.pop_front();
      if (i >= k - 1) ans.push_back(nums[dq.front()]);
    }
    return ans;
  }
};`,
      },
    },
    whyFaster:
      'The naive method re-examines almost the same k elements for every window, so the total is n times k. The deque throws away any element that is both older and smaller than a newer one, because such an element can never be a window maximum again. Every index enters the deque once and leaves at most once, so the total number of operations is bounded by 2n regardless of k.',
    keyPoints: [
      'Queue = FIFO. Use collections.deque; list.pop(0) is O(n).',
      'Deque supports O(1) push and pop at both ends.',
      'Sliding window maximum: monotonic decreasing deque of indexes, front is the answer.',
      'Pop from the back while the new value is >= the back value; pop the front when it leaves the window.',
      'Each index enters and leaves the deque at most once, giving O(n) total.',
    ],
    patternIds: ['sliding-window', 'monotonic-stack', 'bfs'],
    problems: [
      {
        id: 'number-of-recent-calls',
        title: 'Number of Recent Calls',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/number-of-recent-calls/',
        patternId: 'sliding-window',
        hint: 'Append each new time to a deque and pop from the front while the front is older than t - 3000; the length is the answer.',
        xp: 20,
      },
      {
        id: 'implement-stack-using-queues',
        title: 'Implement Stack using Queues',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/implement-stack-using-queues/',
        patternId: 'monotonic-stack',
        hint: 'After pushing x, rotate the queue size - 1 times so x sits at the front.',
        xp: 20,
      },
      {
        id: 'design-circular-queue',
        title: 'Design Circular Queue',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-circular-queue/',
        patternId: 'sliding-window',
        hint: 'Fixed array with head index and count; the tail index is (head + count) % capacity.',
        xp: 40,
      },
      {
        id: 'design-circular-deque',
        title: 'Design Circular Deque',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-circular-deque/',
        patternId: 'sliding-window',
        hint: 'Same as the circular queue, but inserting at the front moves head to (head - 1 + capacity) % capacity.',
        xp: 40,
      },
      {
        id: 'sliding-window-maximum',
        title: 'Sliding Window Maximum',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/sliding-window-maximum/',
        patternId: 'sliding-window',
        hint: 'Monotonic decreasing deque of indexes; pop smaller values from the back, expire the front, read the front.',
        xp: 80,
      },
    ],
  },
  {
    id: 'lru-cache',
    gateId: 'stacks-queues',
    order: 4,
    title: 'LRU Cache',
    minutes: 30,
    summary: 'Combine a hash map with a doubly linked list to get O(1) get and put while evicting the least recently used item.',
    analogy:
      'A small desk with room for five books. Whenever you read a book you put it back on the right end of the desk. When a sixth book arrives, you remove the book on the left end, because it is the one you have not touched for the longest time. A sticky-note index tells you instantly where each book sits.',
    explanation: `An **LRU cache** (least recently used) stores a fixed number of key-value pairs. When it is full and a new key arrives, it throws out the item that was used longest ago. Both \`get\` and \`put\` must run in O(1). You care because it is one of the most frequently asked design questions, and it teaches a powerful combination: a hash map for instant lookup plus a linked list for instant reordering.

## The idea

- A **doubly linked list** (each node has prev and next) keeps items in usage order: most recent at the tail, least recent at the head.
- A **hash map** maps each key to its node, so you can jump to a node without walking the list.
- On \`get(key)\`: look up the node, move it to the tail (most recent), return its value.
- On \`put(key, value)\`: if the key exists, update the value and move it to the tail. Otherwise create a node at the tail; if the size is over capacity, remove the node at the head and delete its key from the map.

Moving a node is O(1) because with prev and next pointers you can unlink it from wherever it is and relink it at the tail without searching.

## A tiny example

Capacity 2.

- put(1, A): list [1]
- put(2, B): list [1, 2]
- get(1): returns A, move 1 to the end. List [2, 1]
- put(3, C): full, evict head (key 2). List [1, 3]
- get(2): not found, return -1

## Step by step

The slow way keeps a Python list of keys in usage order plus a dict of values. On every access you \`remove(key)\` from the list, which scans it, and append it to the end. That makes get and put O(n) where n is the capacity. For a cache of a million entries under heavy traffic this is far too slow.

The fast way is the map plus doubly linked list. Use two **sentinel nodes**, a fake head and a fake tail, so that every real node always has a prev and a next. That removes all the "is this the first or last node" special cases.

\`\`\`python
class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.map = {}
        self.head, self.tail = Node(), Node()
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _add_to_tail(self, node):
        node.prev, node.next = self.tail.prev, self.tail
        self.tail.prev.next = node
        self.tail.prev = node
\`\`\`

\`get\` and \`put\` are then a few lines using \`_remove\` and \`_add_to_tail\`.

## The Python shortcut

\`collections.OrderedDict\` already keeps insertion order and offers \`move_to_end(key)\` and \`popitem(last=False)\` in O(1). It is a fine answer in a real code base. In an interview, mention it, then build the linked list version, because that is what is being tested.

## Where people go wrong

- Forgetting to store the key in the node. When you evict from the head you need the key to delete it from the map.
- Not moving the node on \`get\`. A get is a use and must refresh recency.
- Updating an existing key without moving it to the tail.
- Wiring the doubly linked list wrongly. Write \`_remove\` and \`_add_to_tail\` as tiny helpers and test them separately.

## How to recognise it in an interview

- "Design a cache", "least recently used", "evict", "capacity".
- "O(1) get and put", or O(1) insert, delete and random access. The answer is nearly always a map plus another structure.
- LFU cache (least frequently used) is the follow-up: a map of frequency to its own LRU list.`,
    naive: {
      title: 'Dictionary plus a list of keys in usage order',
      description:
        'Keep values in a dict and the order of use in a plain list. On every access, remove the key from the list (a linear scan) and append it at the end. Evict by popping index 0.',
      time: 'O(n) per operation',
      space: 'O(n)',
      code: {
        python: `class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.vals = {}
        self.order = []          # oldest first

    def get(self, key):
        if key not in self.vals:
            return -1
        self.order.remove(key)   # O(n) scan
        self.order.append(key)
        return self.vals[key]

    def put(self, key, value):
        if key in self.vals:
            self.order.remove(key)
        elif len(self.vals) == self.cap:
            oldest = self.order.pop(0)
            del self.vals[oldest]
        self.vals[key] = value
        self.order.append(key)`,
        javascript: `class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.vals = new Map();
    this.order = []; // oldest first
  }
  get(key) {
    if (!this.vals.has(key)) return -1;
    this.order.splice(this.order.indexOf(key), 1); // O(n)
    this.order.push(key);
    return this.vals.get(key);
  }
  put(key, value) {
    if (this.vals.has(key)) {
      this.order.splice(this.order.indexOf(key), 1);
    } else if (this.vals.size === this.cap) {
      const oldest = this.order.shift();
      this.vals.delete(oldest);
    }
    this.vals.set(key, value);
    this.order.push(key);
  }
}`,
        java: `import java.util.*;

class LRUCache {
  private int cap;
  private Map<Integer, Integer> vals = new HashMap<>();
  private List<Integer> order = new ArrayList<>(); // oldest first

  public LRUCache(int capacity) { this.cap = capacity; }

  public int get(int key) {
    if (!vals.containsKey(key)) return -1;
    order.remove(Integer.valueOf(key)); // O(n)
    order.add(key);
    return vals.get(key);
  }

  public void put(int key, int value) {
    if (vals.containsKey(key)) {
      order.remove(Integer.valueOf(key));
    } else if (vals.size() == cap) {
      int oldest = order.remove(0);
      vals.remove(oldest);
    }
    vals.put(key, value);
    order.add(key);
  }
}`,
        cpp: `#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class LRUCache {
  int cap;
  unordered_map<int, int> vals;
  vector<int> order; // oldest first
public:
  LRUCache(int capacity) : cap(capacity) {}

  int get(int key) {
    if (!vals.count(key)) return -1;
    order.erase(find(order.begin(), order.end(), key)); // O(n)
    order.push_back(key);
    return vals[key];
  }

  void put(int key, int value) {
    if (vals.count(key)) {
      order.erase(find(order.begin(), order.end(), key));
    } else if ((int)vals.size() == cap) {
      vals.erase(order.front());
      order.erase(order.begin());
    }
    vals[key] = value;
    order.push_back(key);
  }
};`,
      },
    },
    optimized: {
      title: 'Hash map plus doubly linked list with sentinels',
      description:
        'The map gives O(1) access to a node; the doubly linked list lets you unlink and relink that node in O(1). Fake head and tail nodes remove every edge case.',
      time: 'O(1) per operation',
      space: 'O(n)',
      code: {
        python: `class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.map = {}
        self.head, self.tail = Node(), Node()
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _add_to_tail(self, node):
        node.prev, node.next = self.tail.prev, self.tail
        self.tail.prev.next = node
        self.tail.prev = node

    def get(self, key):
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._add_to_tail(node)
        return node.val

    def put(self, key, value):
        if key in self.map:
            self._remove(self.map[key])
        node = Node(key, value)
        self.map[key] = node
        self._add_to_tail(node)
        if len(self.map) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.map[lru.key]`,
        javascript: `class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  _addToTail(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._addToTail(node);
    return node.val;
  }
  put(key, value) {
    if (this.map.has(key)) this._remove(this.map.get(key));
    const node = new Node(key, value);
    this.map.set(key, node);
    this._addToTail(node);
    if (this.map.size > this.cap) {
      const lru = this.head.next;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}`,
        java: `import java.util.*;

class LRUCache {
  private class Node {
    int key, val;
    Node prev, next;
    Node(int k, int v) { key = k; val = v; }
  }

  private int cap;
  private Map<Integer, Node> map = new HashMap<>();
  private Node head = new Node(0, 0), tail = new Node(0, 0);

  public LRUCache(int capacity) {
    cap = capacity;
    head.next = tail;
    tail.prev = head;
  }

  private void remove(Node n) {
    n.prev.next = n.next;
    n.next.prev = n.prev;
  }

  private void addToTail(Node n) {
    n.prev = tail.prev;
    n.next = tail;
    tail.prev.next = n;
    tail.prev = n;
  }

  public int get(int key) {
    if (!map.containsKey(key)) return -1;
    Node n = map.get(key);
    remove(n);
    addToTail(n);
    return n.val;
  }

  public void put(int key, int value) {
    if (map.containsKey(key)) remove(map.get(key));
    Node n = new Node(key, value);
    map.put(key, n);
    addToTail(n);
    if (map.size() > cap) {
      Node lru = head.next;
      remove(lru);
      map.remove(lru.key);
    }
  }
}`,
        cpp: `#include <unordered_map>
using namespace std;

class LRUCache {
  struct Node {
    int key, val;
    Node *prev = nullptr, *next = nullptr;
    Node(int k, int v) : key(k), val(v) {}
  };
  int cap;
  unordered_map<int, Node*> map;
  Node* head = new Node(0, 0);
  Node* tail = new Node(0, 0);

  void remove(Node* n) {
    n->prev->next = n->next;
    n->next->prev = n->prev;
  }
  void addToTail(Node* n) {
    n->prev = tail->prev;
    n->next = tail;
    tail->prev->next = n;
    tail->prev = n;
  }
public:
  LRUCache(int capacity) : cap(capacity) {
    head->next = tail;
    tail->prev = head;
  }
  int get(int key) {
    if (!map.count(key)) return -1;
    Node* n = map[key];
    remove(n);
    addToTail(n);
    return n->val;
  }
  void put(int key, int value) {
    if (map.count(key)) {
      remove(map[key]);
      delete map[key];
    }
    Node* n = new Node(key, value);
    map[key] = n;
    addToTail(n);
    if ((int)map.size() > cap) {
      Node* lru = head->next;
      remove(lru);
      map.erase(lru->key);
      delete lru;
    }
  }
};`,
      },
    },
    whyFaster:
      'The list-based version must search the order list to find and remove a key, which is O(n) on every get and put. The doubly linked list version never searches: the hash map hands you the exact node in O(1), and because the node knows its prev and next neighbours, unlinking and relinking it at the tail is a constant number of pointer updates. Eviction is also O(1) because the least recent node is always right after the head sentinel.',
    keyPoints: [
      'LRU = hash map (key to node) + doubly linked list (usage order).',
      'get and put both move the touched node to the most-recent end.',
      'Store the key inside the node so eviction can delete it from the map.',
      'Sentinel head and tail nodes remove all first/last edge cases.',
      'Write _remove and _add_to_tail as helpers; the rest is a few lines each.',
      'Python OrderedDict does this for you, but interviewers want the linked list version.',
    ],
    patternIds: ['hash-map'],
    problems: [
      {
        id: 'design-hashmap',
        title: 'Design HashMap',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/design-hashmap/',
        patternId: 'hash-map',
        hint: 'Use an array of buckets where each bucket is a small list of (key, value) pairs, indexed by key % bucket_count.',
        xp: 20,
      },
      {
        id: 'lru-cache',
        title: 'LRU Cache',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/lru-cache/',
        patternId: 'hash-map',
        hint: 'Hash map from key to a doubly linked list node; move a node to the tail on every access and evict from the head.',
        xp: 40,
      },
      {
        id: 'insert-delete-getrandom-o1',
        title: 'Insert Delete GetRandom O(1)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/',
        patternId: 'hash-map',
        hint: 'Keep values in an array and a map from value to index; to delete, swap the value with the last element and pop.',
        xp: 40,
      },
      {
        id: 'design-browser-history',
        title: 'Design Browser History',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-browser-history/',
        patternId: 'hash-map',
        hint: 'An array plus a current index works: visit truncates everything after the index, back and forward clamp the index.',
        xp: 40,
      },
      {
        id: 'lfu-cache',
        title: 'LFU Cache',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/lfu-cache/',
        patternId: 'hash-map',
        hint: 'Map each frequency to its own LRU ordered structure and track the minimum frequency so eviction stays O(1).',
        xp: 80,
      },
    ],
  },
]
