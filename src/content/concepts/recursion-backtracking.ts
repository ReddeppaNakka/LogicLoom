import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'recursion-basics',
    gateId: 'recursion-backtracking',
    order: 1,
    title: 'Recursion Basics',
    minutes: 25,
    summary: 'A function that calls itself on a smaller input, stopping at a base case, is the foundation of trees, graphs, DP and backtracking.',
    analogy:
      'Imagine you are standing in a long queue and want to know your position. You ask the person in front: "what is your position?" They ask the person in front of them, and so on. The first person answers "1". Each person adds 1 to the answer they receive and passes it back. Nobody counted the whole line; each person solved one tiny piece.',
    explanation: `Recursion is when a function solves a problem by calling itself on a smaller version of the same problem. It feels like magic at first, but it is just two rules: a **base case** (the smallest input you can answer directly) and a **recursive case** (shrink the input and trust the function to handle the rest). You care because trees, graphs, backtracking and dynamic programming are all written this way.

## The idea

- Every recursive function needs a base case. Without it the calls never stop and you get a "maximum recursion depth" error.
- Every recursive call must move toward the base case. Usually that means a smaller number, a shorter list, or a child node.
- Trust the call. When you write \`fact(n - 1)\`, assume it already returns the right answer. Do not try to trace every level in your head.

## A tiny example

Factorial of 4 is 4 * 3 * 2 * 1.

\`\`\`python
def fact(n):
    if n <= 1:          # base case
        return 1
    return n * fact(n - 1)   # recursive case
\`\`\`

The calls stack up: fact(4) waits for fact(3), which waits for fact(2), which waits for fact(1). Then the answers return in reverse order: 1, 2, 6, 24.

## The call stack costs memory

Each waiting call sits on the **call stack** (a list of unfinished function calls the computer keeps). A recursion that goes n levels deep uses O(n) extra space, even if you never create a list. Python limits this depth to about 1000 by default, so for very deep problems you either raise the limit or switch to a loop.

## Step by step: the slow way and the fast way

Fibonacci is the classic example. fib(n) = fib(n - 1) + fib(n - 2).

The slow way calls itself twice per level. fib(5) calls fib(4) and fib(3); fib(4) again calls fib(3). The same sub-problem is solved over and over. The number of calls roughly doubles each level, so the time is O(2^n). fib(40) takes seconds; fib(50) takes minutes.

The fast way remembers each answer in a dictionary the first time it is computed. This is called **memoization** (a cache for function results). Now each fib(k) is computed once, so the time is O(n). The space is also O(n) for the cache and the stack.

\`\`\`python
def fib(n, memo={}):
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
\`\`\`

## Where people go wrong

- Forgetting the base case, or writing one that is never reached (for example checking \`n == 0\` when n can go negative).
- Mutating a shared list inside the recursion and forgetting to undo it.
- Using recursion when a simple loop is cleaner. Summing a list does not need recursion.
- Not noticing repeated sub-problems. If you draw the call tree and see the same node twice, you need memoization (this is the door to dynamic programming).

## How to recognise it in an interview

- The problem is defined in terms of itself: "the answer for n depends on the answer for n - 1".
- The data is nested: trees, folders inside folders, JSON inside JSON.
- You must "try all ways" or "count all ways". That is recursion, and often backtracking or DP on top.
- The input can be split into halves that are solved the same way (merge sort, pow(x, n)). That is divide and conquer, which is recursion with a merge step.`,
    naive: {
      title: 'Plain recursion: recompute every sub-problem',
      description:
        'fib(n) calls fib(n - 1) and fib(n - 2). Both of those call fib(n - 3), and the overlap grows quickly. The call tree has roughly 2^n nodes, so the work explodes for n around 40.',
      time: 'O(2^n)',
      space: 'O(n)',
      code: {
        python: `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))  # 55, but fib(45) is painfully slow`,
        javascript: `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(10)); // 55`,
        java: `class Solution {
  static int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
  }

  public static void main(String[] args) {
    System.out.println(fib(10)); // 55
  }
}`,
        cpp: `#include <iostream>
using namespace std;

int fib(int n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

int main() {
  cout << fib(10) << endl; // 55
}`,
      },
    },
    optimized: {
      title: 'Memoized recursion: solve each sub-problem once',
      description:
        'Keep a dictionary from n to fib(n). Before computing, check the dictionary. After computing, store the result. Every value of n is now computed exactly once.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def fib(n, memo=None):
    if memo is None:
        memo = {}
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

print(fib(45))  # 1134903170, instantly`,
        javascript: `function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}

console.log(fib(45)); // 1134903170`,
        java: `import java.util.*;

class Solution {
  static Map<Integer, Long> memo = new HashMap<>();

  static long fib(int n) {
    if (n < 2) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long result = fib(n - 1) + fib(n - 2);
    memo.put(n, result);
    return result;
  }

  public static void main(String[] args) {
    System.out.println(fib(45)); // 1134903170
  }
}`,
        cpp: `#include <iostream>
#include <unordered_map>
using namespace std;

unordered_map<int, long long> memo;

long long fib(int n) {
  if (n < 2) return n;
  if (memo.count(n)) return memo[n];
  return memo[n] = fib(n - 1) + fib(n - 2);
}

int main() {
  cout << fib(45) << endl; // 1134903170
}`,
      },
    },
    whyFaster:
      'The plain version solves fib(k) many times because the call tree branches twice at every level, giving about 2^n calls. The memoized version stores each fib(k) after the first computation, so there are only n distinct calls that do real work. We trade O(n) memory for the cache to bring time from exponential down to linear.',
    keyPoints: [
      'Every recursive function needs a base case and a step that moves toward it.',
      'Trust the recursive call: assume it returns the correct answer for the smaller input.',
      'Recursion depth costs O(depth) stack memory even with no extra data structures.',
      'If the same sub-problem is solved twice, add a memo dictionary. That is the start of DP.',
      'Divide and conquer is recursion where you split the input, solve both halves, and merge.',
    ],
    patternIds: ['recursion', 'divide-and-conquer'],
    problems: [
      {
        id: 'reverse-string',
        title: 'Reverse String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/reverse-string/',
        patternId: 'recursion',
        hint: 'Swap the first and last characters, then recurse on the part in between.',
        xp: 20,
      },
      {
        id: 'fibonacci-number',
        title: 'Fibonacci Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/fibonacci-number/',
        patternId: 'recursion',
        hint: 'Write the two-line recursion first, then add a memo dictionary and watch the speed change.',
        xp: 20,
      },
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        patternId: 'recursion',
        hint: 'To reach step n you came from step n - 1 or step n - 2, so ways(n) = ways(n - 1) + ways(n - 2).',
        xp: 20,
      },
      {
        id: 'powx-n',
        title: 'Pow(x, n)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/powx-n/',
        patternId: 'divide-and-conquer',
        hint: 'x^n is (x^(n/2))^2 when n is even, so compute the half once and square it.',
        xp: 40,
      },
      {
        id: 'k-th-symbol-in-grammar',
        title: 'K-th Symbol in Grammar',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-th-symbol-in-grammar/',
        patternId: 'recursion',
        hint: 'The k-th symbol in row n depends only on the (k+1)//2-th symbol in row n - 1 and whether k is odd or even.',
        xp: 40,
      },
    ],
  },
  {
    id: 'subsets-and-permutations',
    gateId: 'recursion-backtracking',
    order: 2,
    title: 'Subsets and Permutations',
    minutes: 30,
    summary: 'Generate every combination or ordering by building a partial answer, recursing, and undoing your last choice.',
    analogy:
      'Think of packing a bag for a trip. For each item you make one decision: take it or leave it. Try "take", pack the rest, then unpack it and try "leave". Do this for every item and you will have laid out every possible bag. That is backtracking: choose, explore, un-choose.',
    explanation: `Many interview questions ask you to list every possible selection (subsets, combinations) or every possible ordering (permutations). The tool is **backtracking**: build a partial answer one choice at a time, recurse to complete it, then undo the choice and try the next one. You care because this one template solves dozens of "generate all" problems.

## The idea

- Keep a \`path\` list that holds the partial answer you are building.
- At each step, decide what choices are available. For subsets it is "take the next item or skip it". For permutations it is "any item not used yet".
- Make a choice (append to path), recurse, then **undo** it (pop from path). The undo is the "back" in backtracking.
- When the path is complete, copy it into the results. Copy, because the same path list is reused.

## A tiny example: subsets of [1, 2]

Start with an empty path. At index 0 you can take 1 or skip it.

- Take 1 -> path [1]. At index 1 take 2 -> [1, 2] (done). Undo -> [1]. Skip 2 -> [1] (done). Undo -> [].
- Skip 1 -> path []. Take 2 -> [2] (done). Undo. Skip 2 -> [] (done).

Result: [1, 2], [1], [2], []. Four subsets, which is 2^2.

## Step by step

The slow way for permutations is to generate every sequence of length n where each slot can be any element (n^n sequences), then throw away the ones with repeats. For n = 8 that is 16 million sequences to filter down to 40 thousand valid ones.

The fast way tracks a \`used\` array. At each slot you only try elements that are not used yet. You never build an invalid sequence, so the work is proportional to the output: O(n * n!) because there are n! permutations and copying each costs n.

\`\`\`python
def permute(nums):
    res, path = [], []
    used = [False] * len(nums)

    def go():
        if len(path) == len(nums):
            res.append(path[:])      # copy!
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            go()
            path.pop()               # undo
            used[i] = False
    go()
    return res
\`\`\`

For subsets, replace \`used\` with a \`start\` index. Only pick elements at or after \`start\`, so [1, 2] and [2, 1] are not both produced.

## Handling duplicates

If the input has repeated values, sort it first. Then inside the loop skip an element if it equals the previous element and the previous one was not taken at this level: \`if i > start and nums[i] == nums[i - 1]: continue\`. This gives each unique subset exactly once.

## Where people go wrong

- Appending \`path\` itself instead of a copy. Every result then points to the same empty list.
- Forgetting the undo step, so choices leak into sibling branches.
- Using a \`start\` index for permutations (misses orderings) or a \`used\` array for subsets (produces duplicates).
- Expecting these to be fast. The output itself is exponential. The goal is to not do extra work beyond the output size.

## How to recognise it in an interview

- "Return all possible ..." subsets, combinations, permutations, arrangements.
- The input is tiny (n up to about 10 or 15). That is a giant hint that an exponential answer is expected.
- Combinations of k items, letter combinations of a phone number, all ways to split something.`,
    naive: {
      title: 'Generate every sequence, then filter the valid ones',
      description:
        'Build all n^n sequences where each slot can hold any element, then keep only the ones with no repeated element. Almost all of the generated sequences are thrown away.',
      time: 'O(n^n * n)',
      space: 'O(n)',
      code: {
        python: `def permute(nums):
    n = len(nums)
    res = []

    def go(path):
        if len(path) == n:
            if len(set(path)) == n:   # only keep no-repeat ones
                res.append(path[:])
            return
        for x in nums:                # any element, even if used
            path.append(x)
            go(path)
            path.pop()
    go([])
    return res`,
        javascript: `function permute(nums) {
  const n = nums.length;
  const res = [];
  function go(path) {
    if (path.length === n) {
      if (new Set(path).size === n) res.push(path.slice());
      return;
    }
    for (const x of nums) {
      path.push(x);
      go(path);
      path.pop();
    }
  }
  go([]);
  return res;
}`,
        java: `import java.util.*;

class Solution {
  List<List<Integer>> res = new ArrayList<>();

  public List<List<Integer>> permute(int[] nums) {
    go(nums, new ArrayList<>());
    return res;
  }

  void go(int[] nums, List<Integer> path) {
    if (path.size() == nums.length) {
      if (new HashSet<>(path).size() == nums.length) res.add(new ArrayList<>(path));
      return;
    }
    for (int x : nums) {
      path.add(x);
      go(nums, path);
      path.remove(path.size() - 1);
    }
  }
}`,
        cpp: `#include <vector>
#include <set>
using namespace std;

class Solution {
  vector<vector<int>> res;
  void go(vector<int>& nums, vector<int>& path) {
    if (path.size() == nums.size()) {
      if (set<int>(path.begin(), path.end()).size() == nums.size()) res.push_back(path);
      return;
    }
    for (int x : nums) {
      path.push_back(x);
      go(nums, path);
      path.pop_back();
    }
  }
public:
  vector<vector<int>> permute(vector<int>& nums) {
    vector<int> path;
    go(nums, path);
    return res;
  }
};`,
      },
    },
    optimized: {
      title: 'Backtracking with a used array',
      description:
        'At each slot only try elements that are not used yet. Mark it used, recurse, then unmark it. No invalid sequence is ever built, so the work matches the size of the output.',
      time: 'O(n * n!)',
      space: 'O(n)',
      code: {
        python: `def permute(nums):
    res, path = [], []
    used = [False] * len(nums)

    def go():
        if len(path) == len(nums):
            res.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            go()
            path.pop()
            used[i] = False
    go()
    return res`,
        javascript: `function permute(nums) {
  const res = [];
  const path = [];
  const used = new Array(nums.length).fill(false);
  function go() {
    if (path.length === nums.length) {
      res.push(path.slice());
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      go();
      path.pop();
      used[i] = false;
    }
  }
  go();
  return res;
}`,
        java: `import java.util.*;

class Solution {
  List<List<Integer>> res = new ArrayList<>();

  public List<List<Integer>> permute(int[] nums) {
    go(nums, new ArrayList<>(), new boolean[nums.length]);
    return res;
  }

  void go(int[] nums, List<Integer> path, boolean[] used) {
    if (path.size() == nums.length) {
      res.add(new ArrayList<>(path));
      return;
    }
    for (int i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.add(nums[i]);
      go(nums, path, used);
      path.remove(path.size() - 1);
      used[i] = false;
    }
  }
}`,
        cpp: `#include <vector>
using namespace std;

class Solution {
  vector<vector<int>> res;
  void go(vector<int>& nums, vector<int>& path, vector<bool>& used) {
    if (path.size() == nums.size()) {
      res.push_back(path);
      return;
    }
    for (int i = 0; i < (int)nums.size(); i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push_back(nums[i]);
      go(nums, path, used);
      path.pop_back();
      used[i] = false;
    }
  }
public:
  vector<vector<int>> permute(vector<int>& nums) {
    vector<int> path;
    vector<bool> used(nums.size(), false);
    go(nums, path, used);
    return res;
  }
};`,
      },
    },
    whyFaster:
      'The naive version explores n^n sequences and checks each one at the end, so almost all of its work is wasted on sequences that repeat an element. The backtracking version refuses to place a used element, so every branch it explores leads to a valid permutation. The total work becomes O(n * n!), which is exactly the size of the output and cannot be beaten.',
    keyPoints: [
      'Backtracking template: choose, recurse, un-choose. Never forget the undo.',
      'Append a copy of path to the results, not the path itself.',
      'Subsets and combinations use a start index; permutations use a used array.',
      'Sort first and skip equal neighbours to avoid duplicate results.',
      'The output is exponential; aim to do no extra work beyond the output size.',
    ],
    patternIds: ['backtracking', 'recursion'],
    problems: [
      {
        id: 'subsets',
        title: 'Subsets',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subsets/',
        patternId: 'backtracking',
        hint: 'Add the current path to the result at every call, then loop i from start to the end and recurse with i + 1.',
        xp: 40,
      },
      {
        id: 'permutations',
        title: 'Permutations',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/permutations/',
        patternId: 'backtracking',
        hint: 'Keep a used array so each element appears once per permutation.',
        xp: 40,
      },
      {
        id: 'combinations',
        title: 'Combinations',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/combinations/',
        patternId: 'backtracking',
        hint: 'Same as subsets with a start index, but only record the path when its length reaches k.',
        xp: 40,
      },
      {
        id: 'letter-combinations-of-a-phone-number',
        title: 'Letter Combinations of a Phone Number',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
        patternId: 'backtracking',
        hint: 'Recurse over the digits; at digit i, try each letter on that key and move to digit i + 1.',
        xp: 40,
      },
      {
        id: 'subsets-ii',
        title: 'Subsets II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subsets-ii/',
        patternId: 'backtracking',
        hint: 'Sort, then skip nums[i] when i > start and nums[i] equals nums[i - 1].',
        xp: 40,
      },
      {
        id: 'permutations-ii',
        title: 'Permutations II',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/permutations-ii/',
        patternId: 'backtracking',
        hint: 'Sort, and skip nums[i] if it equals nums[i - 1] and nums[i - 1] is not currently used.',
        xp: 40,
      },
    ],
  },
  {
    id: 'backtracking-with-constraints',
    gateId: 'recursion-backtracking',
    order: 3,
    title: 'Backtracking with Constraints',
    minutes: 30,
    summary: 'Prune branches early: check the rules before you recurse so you never explore a path that cannot succeed.',
    analogy:
      'You are solving a maze with a pencil. At every fork you pick a path and keep going. The moment you see a wall ahead you turn back to the last fork and try the other way. You do not walk all the way to the dead end and then the whole way back to the start. Checking the wall early is pruning.',
    explanation: `Plain backtracking lists every possibility. **Constrained backtracking** adds a rule check before each recursive call, so branches that already break a rule are cut off early. This is called **pruning** (cutting off a branch of the search tree). You care because pruning is the difference between a solution that finishes in milliseconds and one that never finishes.

## The idea

- Keep the same choose / recurse / un-choose shape from the previous lesson.
- Before choosing an option, ask: "is this option still legal given what I have chosen so far?" If not, skip it.
- Before recursing, ask: "can this partial answer still lead to a full answer?" If not, return.
- Because you check early, whole subtrees are never visited.

## A tiny example: generate parentheses for n = 2

We want all strings with 2 opening and 2 closing brackets that are balanced.

- Rule 1: you may add \`(\` only if you have used fewer than n of them.
- Rule 2: you may add \`)\` only if the count of \`)\` so far is less than the count of \`(\`.

Start with "". Add "(" (open = 1). Now "(" -> add "(" gives "((", or add ")" gives "()". From "((" only ")" is allowed twice: "(())". From "()" add "(" then ")": "()()". Two answers, and we never built "))" or ")(".

## Step by step

The slow way generates every string of length 2n made of brackets (2^(2n) strings) and validates each with a stack. For n = 10 that is about one million strings, most of them garbage.

The fast way only appends a bracket when the two rules above allow it. Every string it builds is valid, so the work is proportional to the number of answers (the Catalan number, roughly 4^n / n^1.5). For n = 10 that is 16,796 answers instead of a million candidates.

\`\`\`python
def generate(n):
    res = []
    def go(s, open_cnt, close_cnt):
        if len(s) == 2 * n:
            res.append(s)
            return
        if open_cnt < n:
            go(s + "(", open_cnt + 1, close_cnt)
        if close_cnt < open_cnt:
            go(s + ")", open_cnt, close_cnt + 1)
    go("", 0, 0)
    return res
\`\`\`

## More constraints you will meet

- **Combination Sum**: stop when the running total exceeds the target. Sorting first lets you break out of the loop instead of continue.
- **Word Search**: only step onto a cell that is inside the grid, unvisited, and holds the next letter. Mark the cell visited, recurse, unmark it.
- **N-Queens**: keep sets of used columns and diagonals. A queen is placed only if its column, row + col diagonal and row - col diagonal are all free.
- **Sudoku**: place a digit only if it is absent from the row, column and 3x3 box.

## Where people go wrong

- Checking the rule after recursing instead of before. The subtree is already explored by then.
- Forgetting to undo the state change (unmark visited, remove from set) so later branches see a wrong state.
- Building strings by concatenation deep in the recursion. In Python that is fine for small n, but for grids use a list and index.
- Trying to find a "clever" formula. If n is small and the problem says "all", the intended answer is a well-pruned search.

## How to recognise it in an interview

- "Find all valid ..." or "does any arrangement exist that satisfies ...".
- Rules about what can be next to what: no two queens attack, letters must be adjacent, sum must not exceed target.
- Grid problems where you walk from cell to cell and may not revisit.
- Small bounds (n up to 9, board up to 9x9, word length up to 15).`,
    naive: {
      title: 'Generate every bracket string, then validate',
      description:
        'Produce all 2^(2n) strings of ( and ), then keep the balanced ones by scanning with a counter. Almost every candidate fails the check.',
      time: 'O(2^(2n) * n)',
      space: 'O(n)',
      code: {
        python: `def generate(n):
    res = []

    def valid(s):
        bal = 0
        for c in s:
            bal += 1 if c == "(" else -1
            if bal < 0:
                return False
        return bal == 0

    def go(s):
        if len(s) == 2 * n:
            if valid(s):
                res.append(s)
            return
        go(s + "(")
        go(s + ")")
    go("")
    return res`,
        javascript: `function generate(n) {
  const res = [];
  function valid(s) {
    let bal = 0;
    for (const c of s) {
      bal += c === '(' ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal === 0;
  }
  function go(s) {
    if (s.length === 2 * n) {
      if (valid(s)) res.push(s);
      return;
    }
    go(s + '(');
    go(s + ')');
  }
  go('');
  return res;
}`,
        java: `import java.util.*;

class Solution {
  List<String> res = new ArrayList<>();

  boolean valid(String s) {
    int bal = 0;
    for (char c : s.toCharArray()) {
      bal += c == '(' ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal == 0;
  }

  void go(String s, int n) {
    if (s.length() == 2 * n) {
      if (valid(s)) res.add(s);
      return;
    }
    go(s + "(", n);
    go(s + ")", n);
  }

  public List<String> generateParenthesis(int n) {
    go("", n);
    return res;
  }
}`,
        cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
  vector<string> res;
  bool valid(const string& s) {
    int bal = 0;
    for (char c : s) {
      bal += c == '(' ? 1 : -1;
      if (bal < 0) return false;
    }
    return bal == 0;
  }
  void go(string s, int n) {
    if ((int)s.size() == 2 * n) {
      if (valid(s)) res.push_back(s);
      return;
    }
    go(s + "(", n);
    go(s + ")", n);
  }
public:
  vector<string> generateParenthesis(int n) {
    go("", n);
    return res;
  }
};`,
      },
    },
    optimized: {
      title: 'Prune with open and close counts',
      description:
        'Only add ( while open < n, and only add ) while close < open. Every string the recursion builds is balanced, so there is nothing to filter.',
      time: 'O(4^n / sqrt(n))',
      space: 'O(n)',
      code: {
        python: `def generate(n):
    res = []

    def go(s, open_cnt, close_cnt):
        if len(s) == 2 * n:
            res.append(s)
            return
        if open_cnt < n:
            go(s + "(", open_cnt + 1, close_cnt)
        if close_cnt < open_cnt:
            go(s + ")", open_cnt, close_cnt + 1)
    go("", 0, 0)
    return res`,
        javascript: `function generate(n) {
  const res = [];
  function go(s, open, close) {
    if (s.length === 2 * n) {
      res.push(s);
      return;
    }
    if (open < n) go(s + '(', open + 1, close);
    if (close < open) go(s + ')', open, close + 1);
  }
  go('', 0, 0);
  return res;
}`,
        java: `import java.util.*;

class Solution {
  List<String> res = new ArrayList<>();

  void go(StringBuilder sb, int open, int close, int n) {
    if (sb.length() == 2 * n) {
      res.add(sb.toString());
      return;
    }
    if (open < n) {
      sb.append('(');
      go(sb, open + 1, close, n);
      sb.deleteCharAt(sb.length() - 1);
    }
    if (close < open) {
      sb.append(')');
      go(sb, open, close + 1, n);
      sb.deleteCharAt(sb.length() - 1);
    }
  }

  public List<String> generateParenthesis(int n) {
    go(new StringBuilder(), 0, 0, n);
    return res;
  }
}`,
        cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
  vector<string> res;
  void go(string& s, int open, int close, int n) {
    if ((int)s.size() == 2 * n) {
      res.push_back(s);
      return;
    }
    if (open < n) {
      s.push_back('(');
      go(s, open + 1, close, n);
      s.pop_back();
    }
    if (close < open) {
      s.push_back(')');
      go(s, open, close + 1, n);
      s.pop_back();
    }
  }
public:
  vector<string> generateParenthesis(int n) {
    string s;
    go(s, 0, 0, n);
    return res;
  }
};`,
      },
    },
    whyFaster:
      'The naive search builds all 2^(2n) strings and only finds out at the very end that most are invalid. The pruned search checks the two rules before each step, so an invalid prefix like ")" is never extended. The number of strings explored drops from 2^(2n) to the number of valid answers, which grows much more slowly.',
    keyPoints: [
      'Check constraints before recursing, not after. That is what makes pruning work.',
      'Track state that makes the check O(1): counts, visited sets, column and diagonal sets.',
      'Always undo state changes after the recursive call returns.',
      'Sorting the choices lets you break out of a loop once a rule fails for the rest.',
      'Small input bounds plus "all valid" in the statement mean pruned backtracking is expected.',
    ],
    patternIds: ['backtracking'],
    problems: [
      {
        id: 'generate-parentheses',
        title: 'Generate Parentheses',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/generate-parentheses/',
        patternId: 'backtracking',
        hint: 'Add ( while open < n and add ) while close < open; every string you finish is automatically valid.',
        xp: 40,
      },
      {
        id: 'combination-sum',
        title: 'Combination Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/combination-sum/',
        patternId: 'backtracking',
        hint: 'Recurse with the same start index so an element can be reused, and return as soon as the remaining target goes below zero.',
        xp: 40,
      },
      {
        id: 'word-search',
        title: 'Word Search',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/word-search/',
        patternId: 'backtracking',
        hint: 'DFS from every cell that matches word[0]; mark a cell as visited by overwriting it, and restore it when you backtrack.',
        xp: 40,
      },
      {
        id: 'palindrome-partitioning',
        title: 'Palindrome Partitioning',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/palindrome-partitioning/',
        patternId: 'backtracking',
        hint: 'At index i, try every end j where s[i..j] is a palindrome, then recurse from j + 1.',
        xp: 40,
      },
      {
        id: 'n-queens',
        title: 'N-Queens',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/n-queens/',
        patternId: 'backtracking',
        hint: 'Place one queen per row; keep sets for used columns, row + col and row - col so the check is O(1).',
        xp: 80,
      },
      {
        id: 'sudoku-solver',
        title: 'Sudoku Solver',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/sudoku-solver/',
        patternId: 'backtracking',
        hint: 'Find the next empty cell, try digits 1-9 that are absent from its row, column and box, and return true as soon as the board is full.',
        xp: 80,
      },
    ],
  },
]
