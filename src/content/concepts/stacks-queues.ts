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
        tier: 'beginner',
      },
      {
        id: 'implement-queue-using-stacks',
        title: 'Implement Queue using Stacks',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
        patternId: 'monotonic-stack',
        hint: 'Push into an input stack; when the output stack is empty, pour the input stack into it, which reverses the order.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'baseball-game',
        title: 'Baseball Game',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/baseball-game/',
        patternId: 'monotonic-stack',
        hint: 'Keep scores on a stack; C pops, D pushes double the top, + pushes the sum of the top two.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'min-stack',
        title: 'Min Stack',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/min-stack/',
        patternId: 'monotonic-stack',
        hint: 'Keep a second stack whose top is always the minimum of the elements currently in the main stack.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'evaluate-reverse-polish-notation',
        title: 'Evaluate Reverse Polish Notation',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
        patternId: 'monotonic-stack',
        hint: 'Push numbers; on an operator pop b then a, compute a op b, and push the result; watch the division direction.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'decode-string',
        title: 'Decode String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/decode-string/',
        patternId: 'monotonic-stack',
        hint: 'On [ push the current string and repeat count; on ] pop them and append the repeated inner string.',
        xp: 40,
        tier: 'advanced',
      },
    ],
    definition:
      'A stack is a collection where every addition and every removal happens at the same end, called the top. That gives last in, first out order: the item pushed most recently is the first one popped.',
    coreIdea:
      'Many problems contain a "most recent unfinished thing" that has to be settled before older ones: an open bracket, a pending function call, a half-built string. A stack stores exactly that pending work in exactly the right order, so when a closing event arrives, the item it belongs to is already sitting on top and needs no searching. Each item is pushed once and popped once, so a whole scan costs O(n).',
    visual: [
      {
        caption: 'Scanning "([])". Opening brackets are pushed and wait.',
        frame: [
          'input   (  [  ]  )',
          'i = 0   ^   push (',
          '',
          'stack, top first:',
          '  (   <- top',
        ].join('\n'),
      },
      {
        caption: 'The second opening bracket sits on top of the first.',
        frame: [
          'input   (  [  ]  )',
          'i = 1      ^   push [',
          '',
          'stack, top first:',
          '  [   <- top',
          '  (',
        ].join('\n'),
      },
      {
        caption: 'A closing bracket pops the top and checks that it matches.',
        frame: [
          'input   (  [  ]  )',
          'i = 2         ^   pop and compare',
          '',
          'top was [ and we saw ]   ->  match',
          'stack after the pop:',
          '  (   <- top',
        ].join('\n'),
      },
      {
        caption: 'The last closing bracket empties the stack.',
        frame: [
          'input   (  [  ]  )',
          'i = 3            ^   pop and compare',
          '',
          'top was ( and we saw )   ->  match',
          'stack after the pop:',
          '  (empty)',
        ].join('\n'),
      },
      {
        caption: 'The final check matters: anything left over was never closed.',
        frame: [
          'end of input, stack is empty  ->  VALID',
          '',
          'compare with input "((("',
          'stack, top first:',
          '  (   <- top',
          '  (',
          '  (        nothing closed them  ->  INVALID',
        ].join('\n'),
      },
      {
        caption: 'A min stack: a second stack carries the minimum so far.',
        frame: [
          'pushes 5, then 2, then 7',
          '',
          'data        mins',
          '  7   <-top   2   <-top',
          '  2           2',
          '  5           5',
          '',
          'get_min reads the top of mins: 2, in O(1)',
        ].join('\n'),
      },
    ],
    pseudocode: `function isBalanced(text):
    stack = empty stack
    partnerOf = { ")" -> "(", "]" -> "[", "}" -> "{" }
    for each ch in text:
        if ch is an opening bracket:
            push ch onto stack
        else:
            if stack is empty:
                return false           // closer with nothing open
            top = pop from stack
            if top is not partnerOf[ch]:
                return false           // wrong kind of bracket
    return stack is empty              // nothing left unclosed`,
    complexity: [
      { label: 'Push', time: 'O(1)', space: 'O(1)', note: 'amortised on a dynamic array; a resize is O(n) but rare' },
      { label: 'Pop and peek', time: 'O(1)', space: 'O(1)', note: 'only the top is touched' },
      { label: 'Search for a value', time: 'O(n)', space: 'O(1)', note: 'a stack has no index, you must drain it' },
      { label: 'Bracket scan of length n', time: 'O(n)', space: 'O(n)', note: 'each character pushed at most once' },
      { label: 'Min stack get_min', time: 'O(1)', space: 'O(n)', note: 'one running minimum stored per element' },
    ],
    dryRun: {
      input: 'push(5), push(2), push(7), get_min(), pop(), get_min()',
      goal: 'Keep the minimum of the stack readable in O(1) after every operation.',
      steps: [
        {
          state: 'data = [], mins = []',
          action: 'push(5): mins is empty, so cur_min is 5. Now data = [5] and mins = [5].',
        },
        {
          state: 'data = [5], mins = [5]',
          action: 'push(2): cur_min = min(2, 5) = 2. Now data = [5, 2] and mins = [5, 2].',
        },
        {
          state: 'data = [5, 2], mins = [5, 2]',
          action: 'push(7): cur_min = min(7, 2) = 2. Now data = [5, 2, 7] and mins = [5, 2, 2].',
        },
        {
          state: 'data = [5, 2, 7], mins = [5, 2, 2]',
          action: 'get_min() returns mins[-1], which is 2, without looking at data at all.',
        },
        {
          state: 'data = [5, 2, 7], mins = [5, 2, 2]',
          action: 'pop() removes 7 from data and the matching 2 from mins. Now data = [5, 2] and mins = [5, 2].',
        },
        {
          state: 'data = [5, 2], mins = [5, 2]',
          action: 'get_min() returns mins[-1], which is still 2, and that is right for the smaller stack.',
        },
      ],
      result:
        'Both get_min calls answered 2 in O(1). The answers are correct because mins[i] was defined at push time as the minimum of data[0..i], and popping both stacks together keeps that promise true.',
    },
    mistakes: [
      {
        mistake: 'Popping without first checking whether the stack is empty.',
        why: 'An input that starts with a closing bracket, such as ")(", pops an empty list and raises IndexError.',
        fix: 'Test if not stack: return False before every pop that is driven by input.',
      },
      {
        mistake: 'Returning True as soon as the scan finishes with no mismatch.',
        why: 'Leftover openings such as "(((" never trigger a mismatch, yet the string is not balanced.',
        fix: 'Return whether the stack is empty at the end, not a bare True.',
      },
      {
        mistake: 'Counting brackets instead of matching their types.',
        why: 'A counter accepts "([)]" because the totals balance while the nesting does not.',
        fix: 'Push the actual character and compare the popped one with the expected partner.',
      },
      {
        mistake: 'Using a Python list as a queue with pop(0).',
        why: 'pop(0) shifts every remaining element left, so it is O(n) and a loop over n items becomes O(n^2).',
        fix: 'Use collections.deque with popleft(). A plain list is fine as a stack, because append and pop() both work at the end.',
      },
      {
        mistake: 'Tracking the current minimum in a single variable instead of a parallel stack.',
        why: 'When that minimum is popped there is no way to recover the previous one, so get_min returns a value no longer present.',
        fix: 'Push a minimum for every element, or push (value, min_so_far) pairs.',
      },
    ],
    whenToUse: [
      'The input has nesting: brackets, tags, folder paths, nested encodings.',
      'You must undo, or return to the most recent state.',
      'A closing event resolves the most recent unresolved opening.',
      'You are turning a recursive solution into a loop and must hold the pending calls yourself.',
      'You need to reverse the order of a sequence with no extra logic.',
    ],
    whenNotToUse: [
      'The oldest item must be served first; that is a queue, use collections.deque.',
      'You need the smallest or largest item at any moment rather than the newest; use a heap.',
      'You need lookup by key or by index; use a dict or a list.',
      'You need the maximum inside a sliding window; a monotonic deque is the right shape because elements also expire from the front.',
      'Order does not matter at all and you only test membership; a set is simpler and O(1).',
    ],
    relatedTopics: [
      { id: 'monotonic-stack', kind: 'concept', why: 'It is this plain stack plus a single rule about keeping the contents ordered.' },
      { id: 'queue-and-deque', kind: 'concept', why: 'The mirror structure, first in first out, and the reason not to use list.pop(0).' },
      { id: 'recursion-basics', kind: 'concept', why: 'Every recursive call is a frame on the call stack, so recursion is a stack you did not write yourself.' },
      { id: 'tree-basics-and-traversals', kind: 'concept', why: 'Iterative DFS replaces the call stack with an explicit stack of nodes.' },
    ],
    quiz: [
      {
        question: 'Scanning "([)]" with the bracket-matching stack, where exactly does it fail?',
        options: [
          'It never fails; the string is valid',
          'At the ")", because the top of the stack is "[" and not "("',
          'At the end, because the stack is not empty',
          'At the "]", because the stack is already empty',
        ],
        answerIndex: 1,
        explanation: 'The counts balance, but the nesting is wrong, and the stack catches it the moment ")" meets a "[" on top.',
      },
      {
        question: 'A min stack keeps a second stack of running minimums. What does get_min cost, and what does the trick cost in memory?',
        options: [
          'O(n) time, O(1) extra space',
          'O(1) time, O(n) extra space',
          'O(log n) time, O(n) extra space',
          'O(1) time, O(1) extra space',
        ],
        answerIndex: 1,
        explanation: 'The answer always sits on top of the second stack, but that stack holds one value for every element in the main stack.',
      },
      {
        question: 'Why is queue.pop(0) on a Python list a problem inside a loop?',
        options: [
          'It raises an error on an empty list',
          'It is O(n) because every remaining element shifts left, so n removals cost O(n^2)',
          'It removes the wrong element',
          'It is O(1), so there is no problem',
        ],
        answerIndex: 1,
        explanation: 'Python lists are contiguous arrays. Use collections.deque, whose popleft is O(1).',
      },
      {
        question: 'You must evaluate "3 4 + 2 *" written in reverse Polish notation. Is a stack the right tool?',
        options: [
          'No, you need to build a tree first',
          'Yes: push numbers, and on an operator pop the two most recent operands, apply it, and push the result',
          'No, you need a queue because the tokens arrive in order',
          'Yes, but only for addition',
        ],
        answerIndex: 1,
        explanation: 'An operator always applies to the two most recently produced values, which is exactly what a stack keeps within reach.',
      },
      {
        question: 'Your bracket checker returns True whenever the scan finishes without a mismatch. Which input breaks it?',
        options: ['")("', '"()"', '"((("', '"[]"'],
        answerIndex: 2,
        explanation: 'Nothing mismatches, but three openings are left on the stack. The final check has to be that the stack is empty.',
      },
    ],
    sources: [
      'CLRS ch. 10 (stacks and queues)',
      'CLRS ch. 17 (amortised analysis of a dynamic array)',
      'MIT 6.006: Data Structures and Dynamic Arrays',
      'Python documentation: collections.deque',
      'VisuAlgo: List (stack and queue)',
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
        tier: 'beginner',
      },
      {
        id: 'daily-temperatures',
        title: 'Daily Temperatures',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/daily-temperatures/',
        patternId: 'monotonic-stack',
        hint: 'Stack of indexes with decreasing temperatures; when a warmer day arrives, pop and record i - j.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'next-greater-element-ii',
        title: 'Next Greater Element II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/next-greater-element-ii/',
        patternId: 'monotonic-stack',
        hint: 'Loop i from 0 to 2n - 1 and use i % n as the index so the circular wrap-around is handled by the same stack.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'online-stock-span',
        title: 'Online Stock Span',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/online-stock-span/',
        patternId: 'monotonic-stack',
        hint: 'Store (price, span) pairs; while the top price is <= the new price, pop it and add its span to yours.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'car-fleet',
        title: 'Car Fleet',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/car-fleet/',
        patternId: 'monotonic-stack',
        hint: 'Sort cars by position descending, compute each arrival time, and push a new fleet only when a car arrives later than the fleet ahead.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'largest-rectangle-in-histogram',
        title: 'Largest Rectangle in Histogram',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
        patternId: 'monotonic-stack',
        hint: 'Increasing stack of indexes; when a shorter bar arrives, pop and compute height * (i - new_top - 1), and append a 0 bar at the end.',
        xp: 80,
        tier: 'advanced',
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/trapping-rain-water/',
        patternId: 'monotonic-stack',
        hint: 'Decreasing stack; when a taller bar arrives, pop the bottom of a valley and add (min(left, right) - bottom) * width.',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'A monotonic stack is a stack whose contents are deliberately kept in order, either always increasing or always decreasing, by popping every element that would break that order before the new one is pushed. It normally stores indexes rather than values, so distances and widths can be computed.',
    coreIdea:
      'When a new element arrives, every earlier element smaller than it can never again be the answer to "what is the next greater element?" for anything further right, because the new element blocks the view. So those earlier elements can be popped immediately and given their answer on the spot. Each index is pushed once and popped at most once, so the whole scan is O(n) even though the code contains a while loop inside a for loop.',
    visual: [
      {
        caption: 'temps = [73, 74, 71, 69, 72, 76]. i = 0: the stack is empty, so push index 0.',
        frame: [
          'temps   73  74  71  69  72  76',
          'i = 0   ^',
          '',
          'stack, top first:',
          '  [0] 73',
          'ans     -   -   -   -   -   -',
        ].join('\n'),
      },
      {
        caption: 'i = 1: 74 is warmer than 73, so index 0 is popped and answered.',
        frame: [
          'temps   73  74  71  69  72  76',
          'i = 1       ^   (74)',
          '',
          'stack before the push:',
          '  [0] 73   <- POPPED, ans[0] = 1 - 0 = 1',
          'stack after the push:',
          '  [1] 74',
          'ans      1   -   -   -   -   -',
        ].join('\n'),
      },
      {
        caption: 'i = 2 and i = 3 are colder, so they simply stack up in decreasing order.',
        frame: [
          'temps   73  74  71  69  72  76',
          'i = 3               ^   (69)',
          '',
          'stack, top first:',
          '  [3] 69',
          '  [2] 71',
          '  [1] 74     (74 > 71 > 69, still decreasing)',
          'ans      1   -   -   -   -   -',
        ].join('\n'),
      },
      {
        caption: 'i = 4: 72 pops every colder index below it, but 74 survives.',
        frame: [
          'temps   73  74  71  69  72  76',
          'i = 4                   ^   (72)',
          '',
          '  [3] 69   <- POPPED, ans[3] = 4 - 3 = 1',
          '  [2] 71   <- POPPED, ans[2] = 4 - 2 = 2',
          '  [1] 74      stays, 74 > 72',
          'stack after the push:  [4] 72, [1] 74',
          'ans      1   -   2   1   -   -',
        ].join('\n'),
      },
      {
        caption: 'i = 5: 76 is warmer than everything, so the stack empties.',
        frame: [
          'temps   73  74  71  69  72  76',
          'i = 5                       ^   (76)',
          '',
          '  [4] 72   <- POPPED, ans[4] = 5 - 4 = 1',
          '  [1] 74   <- POPPED, ans[1] = 5 - 1 = 4',
          'stack after the push:  [5] 76',
          'ans      1   4   2   1   1   -',
        ].join('\n'),
      },
      {
        caption: 'Whatever is left on the stack never found a warmer day, so it keeps 0.',
        frame: [
          'left on the stack at the end:',
          '  [5] 76   ->  ans[5] stays 0',
          '',
          'final ans   1   4   2   1   1   0',
          '',
          '6 pushes, 5 pops in total  ->  O(n)',
        ].join('\n'),
      },
    ],
    pseudocode: `function nextGreaterDistances(values):
    answer = array of zeros, same length as values
    stack = empty stack of indexes
    for i from 0 to length(values) - 1:
        while stack is not empty and values[top(stack)] < values[i]:
            j = pop from stack
            answer[j] = i - j        // i is the first bigger value after j
        push i onto stack
    return answer                    // indexes still on the stack keep 0`,
    complexity: [
      { label: 'Whole next-greater scan', time: 'O(n)', space: 'O(n)', note: 'each index pushed once, popped at most once' },
      { label: 'One iteration, worst case', time: 'O(n)', space: 'O(1)', note: 'a single element can pop the whole stack' },
      { label: 'Amortised cost per element', time: 'O(1)', space: 'O(1)', note: 'total pops can never exceed total pushes' },
      { label: 'Largest rectangle in histogram', time: 'O(n)', space: 'O(n)', note: 'one pass, plus a sentinel bar to flush' },
      { label: 'Brute force alternative', time: 'O(n^2)', space: 'O(1)', note: 'rescans the tail from every start index' },
    ],
    dryRun: {
      input: 'temps = [73, 74, 71, 69, 72, 76]',
      goal: 'For each day, how many days you must wait for a warmer temperature.',
      steps: [
        {
          state: 'i = 0, t = 73, stack = [], ans = [0, 0, 0, 0, 0, 0]',
          action: 'The stack is empty, so nothing is popped. Push index 0.',
        },
        {
          state: 'i = 1, t = 74, stack = [0]',
          action: 'temps[0] = 73 is less than 74, so pop 0 and set ans[0] = 1 - 0 = 1. The stack is now empty, so push 1.',
        },
        {
          state: 'i = 2, t = 71, stack = [1]',
          action: 'temps[1] = 74 is not less than 71, so nothing pops. Push 2.',
        },
        {
          state: 'i = 3, t = 69, stack = [1, 2]',
          action: 'temps[2] = 71 is not less than 69, so nothing pops. Push 3. The stack now holds 74, 71, 69 in decreasing order.',
        },
        {
          state: 'i = 4, t = 72, stack = [1, 2, 3]',
          action: 'Pop 3 and set ans[3] = 1, then pop 2 and set ans[2] = 2. temps[1] = 74 stops the loop. Push 4.',
        },
        {
          state: 'i = 5, t = 76, stack = [1, 4]',
          action: 'Pop 4 and set ans[4] = 1, then pop 1 and set ans[1] = 4. The stack is empty, so push 5.',
        },
        {
          state: 'loop finished, stack = [5]',
          action: 'Index 5 was never popped, so its answer stays at the initial 0.',
        },
      ],
      result:
        'ans = [1, 4, 2, 1, 1, 0]. Index 5 keeps 0 because being left on the stack means no later day was ever warmer, which is exactly what the problem asks us to report as 0.',
    },
    mistakes: [
      {
        mistake: 'Pushing values onto the stack instead of indexes.',
        why: 'You can still compare, but you cannot compute i - j, a rectangle width, or a span, because the position is gone.',
        fix: 'Push indexes and read the value as values[stack[-1]] whenever you need it.',
      },
      {
        mistake: 'Using if instead of while when comparing with the top.',
        why: 'One new element can answer several older ones at once. With if, only the top gets its answer and the rest are left wrong.',
        fix: 'Pop in a while loop until the order is restored, and only then push the current index.',
      },
      {
        mistake: 'Using < where the problem needs <=, or the other way round, for equal values.',
        why: 'On [3, 3] a strict rule leaves the first 3 unanswered. That is right for "strictly greater" and wrong for "greater or equal".',
        fix: 'Read the wording. Strictly greater: pop while top < current. Greater or equal: pop while top <= current.',
      },
      {
        mistake: 'Forgetting to flush the stack when the loop ends.',
        why: 'In histogram and rectangle problems, bars still on the stack extend all the way to the end of the array, and their rectangles are never measured.',
        fix: 'Append a sentinel (height 0 for a maximum-rectangle stack) so the final iteration pops everything, or run an explicit drain loop.',
      },
      {
        mistake: 'Believing the nested while loop makes the algorithm O(n^2).',
        why: 'People abandon a correct O(n) solution because the code shape looks quadratic.',
        fix: 'Count the pushes: there are n. Pops can never exceed pushes, so the inner loop body runs at most n times across the entire scan.',
      },
    ],
    whenToUse: [
      'The problem asks for the next, or the previous, greater or smaller element.',
      'You need, for each position, how far away the next bigger event is.',
      'You need the span or width over which the current element stays the maximum or the minimum.',
      'A rectangle, a trapped-water volume, or a subarray is bounded by the nearest larger or smaller neighbour.',
      'A brute force would, for every i, scan rightwards and stop at the first qualifying element.',
    ],
    whenNotToUse: [
      'You need the maximum inside a fixed-size window; use a monotonic deque, which can also drop from the front.',
      'You need the k largest values overall; use a heap.',
      'You need range queries over data that keeps changing; use a segment tree or a Fenwick tree.',
      'The comparison is not a consistent ordering, so there is no invariant to maintain.',
      'You need the next greater value for arbitrary queries rather than for array positions; sort and binary search instead.',
    ],
    relatedTopics: [
      { id: 'stack-basics', kind: 'concept', why: 'A monotonic stack is a plain stack plus a single popping rule.' },
      { id: 'queue-and-deque', kind: 'concept', why: 'Sliding window maximum needs the same monotone idea, but with removal from both ends.' },
      { id: 'prefix-sums', kind: 'concept', why: 'Both replace a rescan of the array with something remembered from earlier in the pass.' },
      { id: 'kadane-max-subarray', kind: 'concept', why: 'Another one-pass scan that discards states which can never win again.' },
      { id: 'two-pointers', kind: 'pattern', why: 'Trapping Rain Water can be solved either with this stack or with two pointers moving inward.' },
    ],
    quiz: [
      {
        question: 'The monotonic stack solution has a while loop inside a for loop. What is its time complexity on n elements?',
        options: [
          'O(n^2), because the loops are nested',
          'O(n log n)',
          'O(n), because each index is pushed once and popped at most once',
          'O(n) only when the array is already sorted',
        ],
        answerIndex: 2,
        explanation: 'The inner loop is bounded by the number of pops, and there are at most n pops in the whole run, not n per iteration.',
      },
      {
        question: 'For "next greater element", which order does the stack keep, and what happens when a bigger value arrives?',
        options: [
          'Increasing; you pop while the top is greater',
          'Decreasing; you pop while the top is smaller than the new value, and each popped index gets its answer',
          'Sorted by index only',
          'The order does not matter',
        ],
        answerIndex: 1,
        explanation: 'A newly arrived bigger value is the next greater element for every smaller value still waiting below it.',
      },
      {
        question: 'Why store indexes rather than values?',
        options: [
          'Indexes are smaller integers',
          'Because the answer usually needs a distance or a width, and only a position gives you that',
          'Because values may be negative',
          'Because it makes the stack sort itself',
        ],
        answerIndex: 1,
        explanation: 'You can always read values[i] from an index, but you cannot recover an index from a value.',
      },
      {
        question: 'You need the maximum of every window of size 3 in an array. Will a monotonic stack give it?',
        options: [
          'Yes, it is the same algorithm',
          'No: elements must also leave when they fall out of the window, and a stack only removes from the top. Use a monotonic deque.',
          'No, you need a heap of size 3',
          'Yes, if you reverse the array first',
        ],
        answerIndex: 1,
        explanation: 'A window expires its oldest element, so you need access to the front as well as the back. That is exactly what a deque adds.',
      },
      {
        question: 'Largest Rectangle in Histogram on heights [2, 1, 2] ends with bars still on the stack. What must the code do about them?',
        options: [
          'Nothing, they are not part of any rectangle',
          'Drain the stack at the end, or append a bar of height 0, because those bars extend to the end of the array',
          'Sort the heights first',
          'Restart the scan from the right',
        ],
        answerIndex: 1,
        explanation: 'A bar that is never popped has no smaller bar to its right, so its rectangle runs to the last index. A zero-height sentinel forces those pops.',
      },
    ],
    sources: [
      'CLRS ch. 17 (amortised analysis)',
      'CP-Algorithms: minimum stack and minimum queue',
      'MIT 6.006: Data Structures and Dynamic Arrays',
      'LeetCode editorial: Daily Temperatures',
      'VisuAlgo: List (stack)',
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
        tier: 'beginner',
      },
      {
        id: 'implement-stack-using-queues',
        title: 'Implement Stack using Queues',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/implement-stack-using-queues/',
        patternId: 'monotonic-stack',
        hint: 'After pushing x, rotate the queue size - 1 times so x sits at the front.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'design-circular-queue',
        title: 'Design Circular Queue',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-circular-queue/',
        patternId: 'sliding-window',
        hint: 'Fixed array with head index and count; the tail index is (head + count) % capacity.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'design-circular-deque',
        title: 'Design Circular Deque',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-circular-deque/',
        patternId: 'sliding-window',
        hint: 'Same as the circular queue, but inserting at the front moves head to (head - 1 + capacity) % capacity.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'sliding-window-maximum',
        title: 'Sliding Window Maximum',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/sliding-window-maximum/',
        patternId: 'sliding-window',
        hint: 'Monotonic decreasing deque of indexes; pop smaller values from the back, expire the front, read the front.',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'A queue serves items in the order they arrived: first in, first out. A deque, short for double-ended queue, is the generalisation where you can add and remove at both ends, each in O(1).',
    coreIdea:
      'An element that is both older and smaller than a newly arrived one can never be the maximum of any future window, because every window still containing the old element also contains the new one. Throwing those losers away leaves a deque whose values decrease from front to back, so the window maximum is always sitting at the front. Each index enters and leaves once, so the scan is O(n) instead of O(n k).',
    visual: [
      {
        caption: 'A queue is FIFO. A deque adds and removes at both ends in O(1).',
        frame: [
          'queue   in ->[ a  b  c ]-> out',
          '           push back   pop front',
          '',
          'deque   both ends are O(1)',
          'python  list.pop(0) shifts n items  ->  O(n)',
          '        deque.popleft()             ->  O(1)',
        ].join('\n'),
      },
      {
        caption: 'Window maximum, k = 3. i = 0: the deque is empty, so push index 0.',
        frame: [
          'nums     1   3  -1  -3   5',
          'i = 0    ^',
          '',
          'deque, front to back:  [0]=1',
          'window not full yet, no answer',
        ].join('\n'),
      },
      {
        caption: 'i = 1: the value 3 beats the 1 behind it, so 1 is dropped from the back.',
        frame: [
          'nums     1   3  -1  -3   5',
          'i = 1        ^   (3)',
          '',
          'pop back [0]=1   because 1 <= 3',
          'deque, front to back:  [1]=3',
          'window not full yet, no answer',
        ].join('\n'),
      },
      {
        caption: 'i = 2: -1 does not beat 3, so it queues behind it. First answer appears.',
        frame: [
          'nums     1   3  -1  -3   5',
          'i = 2            ^   (-1)',
          '',
          'deque, front to back:  [1]=3  [2]=-1',
          'front is [1]=3  ->  max of (1, 3, -1) = 3',
          'ans   3',
        ].join('\n'),
      },
      {
        caption: 'i = 3: -3 queues behind too, and the front index 1 is still inside the window.',
        frame: [
          'nums     1   3  -1  -3   5',
          'i = 3                ^   (-3)',
          '',
          'deque:  [1]=3  [2]=-1  [3]=-3',
          'front index 1 > i - k = 0, so it stays',
          'ans   3   3',
        ].join('\n'),
      },
      {
        caption: 'i = 4: 5 beats everything, so the whole deque empties from the back.',
        frame: [
          'nums     1   3  -1  -3   5',
          'i = 4                     ^   (5)',
          '',
          'pop back -3, then -1, then 3  (all <= 5)',
          'deque:  [4]=5',
          'ans   3   3   5',
        ].join('\n'),
      },
    ],
    pseudocode: `function slidingWindowMax(values, k):
    dq = empty deque of indexes
    answer = empty list
    for i from 0 to length(values) - 1:
        while dq is not empty and values[back(dq)] <= values[i]:
            remove from the back        // it can never win again
        add i at the back
        if front(dq) <= i - k:
            remove from the front       // it left the window
        if i >= k - 1:
            append values[front(dq)] to answer
    return answer`,
    complexity: [
      { label: 'Deque push or pop at either end', time: 'O(1)', space: 'O(1)', note: 'no elements are shifted' },
      { label: 'Python list.pop(0)', time: 'O(n)', space: 'O(1)', note: 'every later element shifts left' },
      { label: 'Sliding window maximum', time: 'O(n)', space: 'O(k)', note: 'each index enters and leaves the deque once' },
      { label: 'Brute force window maximum', time: 'O(n k)', space: 'O(1)', note: 'rescans k values for every window' },
      { label: 'BFS over a graph', time: 'O(V + E)', space: 'O(V)', note: 'the queue holds the current frontier' },
    ],
    dryRun: {
      input: 'nums = [1, 3, -1, -3, 5], k = 3',
      goal: 'Report the maximum of every window of three consecutive values.',
      steps: [
        {
          state: 'i = 0, x = 1, dq = [], ans = []',
          action: 'The deque is empty, so nothing is popped from the back. Push index 0. i is less than k - 1 = 2, so no answer yet.',
        },
        {
          state: 'i = 1, x = 3, dq = [0]',
          action: 'nums[0] = 1 is <= 3, so pop index 0 from the back. Push index 1. Still no full window.',
        },
        {
          state: 'i = 2, x = -1, dq = [1]',
          action: 'nums[1] = 3 is not <= -1, so nothing pops. Push index 2. The front index 1 is greater than i - k = -1, so it stays. i >= 2, so append nums[1] = 3.',
        },
        {
          state: 'i = 3, x = -3, dq = [1, 2], ans = [3]',
          action: 'nums[2] = -1 is not <= -3, so nothing pops. Push index 3. Front index 1 is greater than i - k = 0, so it stays. Append nums[1] = 3 again.',
        },
        {
          state: 'i = 4, x = 5, dq = [1, 2, 3], ans = [3, 3]',
          action: 'Pop index 3 (-3 <= 5), then index 2 (-1 <= 5), then index 1 (3 <= 5). The deque is empty, so push index 4.',
        },
        {
          state: 'i = 4, dq = [4], ans = [3, 3]',
          action: 'Front index 4 is greater than i - k = 1, so it stays. i >= 2, so append nums[4] = 5.',
        },
      ],
      result:
        'ans = [3, 3, 5]. Every answer was read straight from the front of the deque, which always holds the index of the largest value still inside the window, because anything smaller and older was discarded on arrival of a bigger value.',
    },
    mistakes: [
      {
        mistake: 'Using a plain Python list and pop(0) as a queue.',
        why: 'Each pop(0) shifts every remaining element, so a BFS over 100000 nodes silently becomes quadratic and times out.',
        fix: 'from collections import deque, then use append and popleft, both O(1).',
      },
      {
        mistake: 'Storing values instead of indexes in the monotonic deque.',
        why: 'You cannot tell whether the front has fallen out of the window without knowing its position.',
        fix: 'Store indexes and compare the front with i - k.',
      },
      {
        mistake: 'Doing the three deque steps in a shuffled order.',
        why: 'At the window boundaries you can read a front that is one step stale, so a handful of answers come out wrong while most look fine.',
        fix: 'Fix one order and keep it: pop losers from the back, push i, expire the front, then record the answer once i >= k - 1.',
      },
      {
        mistake: 'Appending an answer on every iteration from index 0.',
        why: 'The first k - 1 positions do not have a complete window, so the output is longer than n - k + 1 and every value is shifted.',
        fix: 'Only append when i >= k - 1.',
      },
      {
        mistake: 'Assuming a deque replaces a heap for every "largest so far" question.',
        why: 'The deque only works because elements expire in arrival order. With arbitrary removals its invariant does not hold.',
        fix: 'Use a deque for sliding windows, a heap when items are added and removed in an unpredictable order.',
      },
    ],
    whenToUse: [
      'Items must be processed in arrival order: BFS, task scheduling, streaming counts.',
      'You need the maximum or minimum of a sliding window in linear time.',
      'You must drop items older than a time limit, as in "requests in the last 3000 ms".',
      'You need to add and remove at both ends, for example in a 0-1 BFS.',
      'You are doing a level-order traversal of a tree or a shortest path on an unweighted grid.',
    ],
    whenNotToUse: [
      'The most recent item must be handled first; that is a stack.',
      'You need the global minimum or maximum with arbitrary insertions and removals; use a heap.',
      'You need lookup by key or by value; use a hash map.',
      'Edges have different weights and you want shortest paths; a plain queue is wrong, use Dijkstra with a priority queue.',
      'You need the window sum rather than the window maximum; a running total is simpler and O(1) per step.',
    ],
    relatedTopics: [
      { id: 'monotonic-stack', kind: 'concept', why: 'Same monotone invariant, but a stack can only remove from one end.' },
      { id: 'stack-basics', kind: 'concept', why: 'The LIFO mirror image, and the reason a queue built from two stacks works.' },
      { id: 'graph-representation-bfs-dfs', kind: 'concept', why: 'BFS is a queue plus a visited set, and its correctness depends on FIFO order.' },
      { id: 'heap-basics', kind: 'concept', why: 'A heap also answers "largest so far", but in O(log n) and without arrival-order expiry.' },
      { id: 'sliding-window', kind: 'pattern', why: 'The deque is what keeps a window statistic such as the maximum updatable in O(1).' },
    ],
    quiz: [
      {
        question: 'The brute force for sliding window maximum is O(n k). What does the monotonic deque cost, and why?',
        options: [
          'O(n k), the same',
          'O(n log k), because of the ordering',
          'O(n), because each index is pushed once and popped at most once',
          'O(k), because the deque never grows past k',
        ],
        answerIndex: 2,
        explanation: 'Total pushes are n and total pops cannot exceed pushes, so the work is linear no matter how large k is.',
      },
      {
        question: 'Why may an element be discarded from the back when a larger value arrives?',
        options: [
          'To keep the deque no longer than k',
          'Because it is both older and smaller, so every future window that contains it also contains the larger, newer value',
          'Because duplicates are not allowed',
          'To keep the deque sorted by index',
        ],
        answerIndex: 1,
        explanation: 'The newer element expires later and is larger, so the older smaller one can never be a window maximum again.',
      },
      {
        question: 'What does some_list.pop(0) cost on a Python list of n items?',
        options: ['O(1)', 'O(log n)', 'O(n), because the remaining items shift left', 'O(n log n)'],
        answerIndex: 2,
        explanation: 'Python lists are contiguous arrays. Use collections.deque when you need O(1) removal from the front.',
      },
      {
        question: 'You need the sum of every window of size k. Would you reach for a monotonic deque?',
        options: [
          'Yes, the same code works',
          'No: a sum changes predictably, so keep a running total, add the entering value and subtract the leaving one, at O(1) per step',
          'No, you need a heap',
          'Yes, but only for positive numbers',
        ],
        answerIndex: 1,
        explanation: 'The deque exists because a maximum cannot be un-added when an element leaves. A sum can, so no structure is needed at all.',
      },
      {
        question: 'In the sliding window maximum loop, when should a value be appended to the answer?',
        options: [
          'On every iteration',
          'Only when i >= k - 1, because earlier positions do not yet have a full window',
          'Only when the deque is empty',
          'After the loop finishes',
        ],
        answerIndex: 1,
        explanation: 'The first complete window ends at index k - 1, so the output has exactly n - k + 1 values.',
      },
    ],
    sources: [
      'CLRS ch. 10 (stacks and queues)',
      'CP-Algorithms: minimum stack and minimum queue',
      'MIT 6.006: Data Structures and Dynamic Arrays',
      'Python documentation: collections.deque',
      'VisuAlgo: List (queue and deque)',
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
        tier: 'beginner',
      },
      {
        id: 'lru-cache',
        title: 'LRU Cache',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/lru-cache/',
        patternId: 'hash-map',
        hint: 'Hash map from key to a doubly linked list node; move a node to the tail on every access and evict from the head.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'insert-delete-getrandom-o1',
        title: 'Insert Delete GetRandom O(1)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/',
        patternId: 'hash-map',
        hint: 'Keep values in an array and a map from value to index; to delete, swap the value with the last element and pop.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'design-browser-history',
        title: 'Design Browser History',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/design-browser-history/',
        patternId: 'hash-map',
        hint: 'An array plus a current index works: visit truncates everything after the index, back and forward clamp the index.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'lfu-cache',
        title: 'LFU Cache',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/lfu-cache/',
        patternId: 'hash-map',
        hint: 'Map each frequency to its own LRU ordered structure and track the minimum frequency so eviction stays O(1).',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'An LRU cache holds at most a fixed number of key to value pairs and, when it is full, throws away the key that was used longest ago. The standard design is a hash map from key to node plus a doubly linked list that keeps the keys in usage order.',
    coreIdea:
      'The two hard parts, finding a key fast and reordering it fast, need different structures, so use both at once. The hash map jumps straight to the exact node in O(1), and because a doubly linked node knows both of its neighbours, unlinking it and re-attaching it at the recent end is a fixed number of pointer writes. Nothing is ever searched, so get, put and eviction are all O(1).',
    visual: [
      {
        caption: 'Capacity 2. Two sentinel nodes remove every first and last edge case.',
        frame: [
          'map:   {}',
          'list:  H <-> T',
          '       ^least recent   ^most recent end',
        ].join('\n'),
      },
      {
        caption: 'put(1, A): a new node is attached just before the tail.',
        frame: [
          'map:   {1: n1}',
          'list:  H <-> n1(1,A) <-> T',
          '             ^least recent',
          'size 1 of 2',
        ].join('\n'),
      },
      {
        caption: 'put(2, B): also attached at the recent end. The cache is now full.',
        frame: [
          'map:   {1: n1, 2: n2}',
          'list:  H <-> n1(1,A) <-> n2(2,B) <-> T',
          '             ^least recent',
          'size 2 of 2',
        ].join('\n'),
      },
      {
        caption: 'get(1): the map finds n1 instantly, then it moves to the recent end.',
        frame: [
          'unlink n1:  H <-> n2(2,B) <-> T',
          'reattach:   H <-> n2(2,B) <-> n1(1,A) <-> T',
          '                  ^least recent is now key 2',
          'returns A',
        ].join('\n'),
      },
      {
        caption: 'put(3, C): size becomes 3, so head.next is evicted, which is key 2.',
        frame: [
          'after insert:',
          '  H <-> n2(2,B) <-> n1(1,A) <-> n3(3,C) <-> T',
          'victim = head.next = n2',
          'unlink n2, then delete map[n2.key] = map[2]',
          'after:  H <-> n1(1,A) <-> n3(3,C) <-> T',
          'map:    {1: n1, 3: n3}',
        ].join('\n'),
      },
      {
        caption: 'Why each node stores its own key, and why every step is O(1).',
        frame: [
          'eviction reads lru.key to erase the map entry',
          'without the key you would scan the map: O(n)',
          '',
          'every step above touched a fixed number of',
          'pointers and one map slot  ->  O(1) per op',
        ].join('\n'),
      },
    ],
    pseudocode: `structure Node has key, value, prev, next

function init(capacity):
    map = empty hash map
    head, tail = two sentinel nodes linked to each other

function unlink(node):
    node.prev.next = node.next
    node.next.prev = node.prev

function attachAtTail(node):        // the most recent end
    node.prev = tail.prev
    node.next = tail
    tail.prev.next = node
    tail.prev = node

function get(key):
    if key is not in map: return -1
    node = map[key]
    unlink(node)
    attachAtTail(node)
    return node.value

function put(key, value):
    if key is in map: unlink(map[key])
    node = new Node(key, value)
    map[key] = node
    attachAtTail(node)
    if size(map) > capacity:
        victim = head.next
        unlink(victim)
        remove map[victim.key]`,
    complexity: [
      { label: 'get and put', time: 'O(1)', space: 'O(c)', note: 'c = capacity; average O(1), assuming a good hash' },
      { label: 'Eviction', time: 'O(1)', space: 'O(1)', note: 'the victim is always head.next' },
      { label: 'Worst case get and put', time: 'O(n)', space: 'O(c)', note: 'only if every key collides in one bucket' },
      { label: 'Naive: list of keys in usage order', time: 'O(n)', space: 'O(c)', note: 'finding and removing a key scans the list' },
      { label: 'Python OrderedDict.move_to_end', time: 'O(1)', space: 'O(c)', note: 'the same design, provided by the library' },
    ],
    dryRun: {
      input: 'capacity = 2, then put(1, "A"), put(2, "B"), get(1), put(3, "C"), get(2)',
      goal: 'Serve every operation in O(1) and evict the least recently used key when full.',
      steps: [
        {
          state: 'map = {}, list = H <-> T',
          action: 'put(1, "A"): key 1 is new, so build a node, store map[1], and attach it before the tail. Size is 1.',
        },
        {
          state: 'map = {1}, list = H <-> 1 <-> T',
          action: 'put(2, "B"): same again. Size is 2, exactly the capacity, so nothing is evicted.',
        },
        {
          state: 'map = {1, 2}, list = H <-> 1 <-> 2 <-> T',
          action: 'get(1): map[1] hands over the node directly. Unlink it and attach it at the tail so it counts as most recent. Return "A".',
        },
        {
          state: 'list = H <-> 2 <-> 1 <-> T',
          action: 'put(3, "C"): key 3 is new, so attach it at the tail. Size is now 3, which is over capacity.',
        },
        {
          state: 'list = H <-> 2 <-> 1 <-> 3 <-> T, len(map) = 3',
          action: 'The victim is head.next, the node for key 2. Unlink it and delete map[2] using the key stored inside the node.',
        },
        {
          state: 'map = {1, 3}, list = H <-> 1 <-> 3 <-> T',
          action: 'get(2): key 2 is no longer in the map, so return -1.',
        },
      ],
      result:
        'The two gets return "A" and then -1. Key 2 was evicted rather than key 1 because get(1) had just moved key 1 to the recent end, and every step touched only a fixed number of pointers.',
    },
    mistakes: [
      {
        mistake: 'Not moving the node on a get, only on a put.',
        why: 'The usage order stops reflecting reads, so the cache evicts a key that is being read constantly. Test cases that read and then insert catch this immediately.',
        fix: 'get must unlink and re-attach exactly like put does.',
      },
      {
        mistake: 'Storing only the value in the node, not the key.',
        why: 'When you evict head.next you hold the node but not the key, so removing its map entry means scanning the whole map, which is O(n).',
        fix: 'Put both key and value in every node.',
      },
      {
        mistake: 'Using a singly linked list for the usage order.',
        why: 'Unlinking an arbitrary node needs its predecessor, and finding that predecessor is an O(n) walk, so get stops being O(1).',
        fix: 'Make it doubly linked, with prev and next, plus head and tail sentinels.',
      },
      {
        mistake: 'Checking the size against the capacity before inserting rather than after.',
        why: 'Updating an existing key does not grow the cache, so evicting first can throw away a key that should have stayed.',
        fix: 'Insert or update first, then evict while len(map) is greater than the capacity.',
      },
      {
        mistake: 'Handling the first and last nodes with special if branches instead of sentinels.',
        why: 'Every branch is another place to forget a pointer, and the empty-cache case is the easiest one to get wrong.',
        fix: 'Create permanent head and tail nodes in the constructor. Then every real node always has both neighbours.',
      },
    ],
    whenToUse: [
      'The problem says design a cache with a fixed capacity and an eviction rule.',
      'Every operation must be O(1), including the reordering.',
      'You need fast lookup by key and fast reordering of the same items at once.',
      'You must move an arbitrary element inside a sequence without shifting anything.',
      'A follow-up asks for LFU, a TTL, or a most-recently-used variant; the same map-plus-list skeleton adapts.',
    ],
    whenNotToUse: [
      'Eviction must be by smallest or largest value rather than by recency; use a heap.',
      'The cache holds only a handful of keys; a plain list scan is simpler and fast enough.',
      'Eviction must be by access frequency; LFU needs a frequency-to-list map layered on top of this design.',
      'There is no capacity limit at all; a plain dict is the whole answer.',
      'You are writing production Python and are allowed a library; functools.lru_cache or OrderedDict already do this.',
    ],
    relatedTopics: [
      { id: 'linked-list-basics', kind: 'concept', why: 'The O(1) unlink and relink is exactly the pointer rewiring taught there.' },
      { id: 'hash-map-basics', kind: 'concept', why: 'The map is what removes the search from every operation.' },
      { id: 'queue-and-deque', kind: 'concept', why: 'The usage list behaves like a deque: append at one end, evict from the other.' },
      { id: 'heap-basics', kind: 'concept', why: 'An evict-the-smallest cache needs a heap instead of a recency list.' },
      { id: 'hash-map', kind: 'pattern', why: 'This is the map-paired-with-another-structure form of the pattern.' },
    ],
    quiz: [
      {
        question: 'Why does the design need a doubly linked list rather than a singly linked one?',
        options: [
          'To store more data in each node',
          'Because unlinking a node found through the map needs its predecessor, and only a prev pointer gives that in O(1)',
          'Because the list has to be traversed backwards on every get',
          'It does not; a singly linked list works just as well',
        ],
        answerIndex: 1,
        explanation: 'The map jumps straight to the node. Without a prev pointer you would have to walk from the head to find who points at it, which is O(n).',
      },
      {
        question: 'What are the time costs of get and put in the hash map plus doubly linked list design, and what do they assume?',
        options: [
          'O(log n), assuming a balanced tree',
          'O(1) on average, assuming the hash map spreads keys well; a pathological all-collide case degrades to O(n)',
          'O(1) worst case, always and unconditionally',
          'O(n), because the list must be scanned',
        ],
        answerIndex: 1,
        explanation: 'The linked list work is genuinely constant, but the map lookup carries the usual average-case assumption of a good hash and a controlled load factor.',
      },
      {
        question: 'Why does each node store its own key?',
        options: [
          'To keep the list sorted',
          'So that eviction can delete the right entry from the map without searching it',
          'To detect duplicate keys',
          'It is not actually needed',
        ],
        answerIndex: 1,
        explanation: 'You evict head.next and all you hold is that node. Its key is what lets you erase map[key] in O(1).',
      },
      {
        question: 'Your cache keeps a Python list of keys in usage order plus a dict of values, and on a get you remove the key from the list and append it. Is this O(1)?',
        options: [
          'Yes, list append is O(1)',
          'No: list.remove(key) searches and then shifts, so it is O(n) per access',
          'Yes, because the dict lookup is O(1)',
          'No, because the dict lookup is O(n)',
        ],
        answerIndex: 1,
        explanation: 'The dict half is fine, but reordering a Python list costs a linear scan and shift. That is precisely the problem the linked list solves.',
      },
      {
        question: 'put is called on a key that is already in the cache. What must happen?',
        options: [
          'Evict the least recent key, then insert',
          'Update the value and move that key to the recent end, evicting nothing, because the size did not grow',
          'Do nothing, since the key already exists',
          'Insert a second node for the same key',
        ],
        answerIndex: 1,
        explanation: 'An update is not a growth. Evicting before checking that would drop a live key for no reason.',
      },
    ],
    sources: [
      'CLRS ch. 10 and ch. 11 (linked lists and hash tables)',
      'MIT 6.006: Hashing with Chaining',
      'Python documentation: collections.OrderedDict and functools.lru_cache',
      'LeetCode editorial: LRU Cache',
      'VisuAlgo: Hash Table',
    ],
  },
]
