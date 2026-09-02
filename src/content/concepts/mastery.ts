import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'revision-strategy',
    gateId: 'mastery',
    order: 1,
    title: 'Revision: spaced repetition and the mistake log',
    minutes: 20,
    summary: 'Forgetting is normal; a small schedule of re-solves plus a written mistake log turns one-time solutions into skills you keep.',
    analogy: 'Watering a plant every day for a week and then never again kills it. Watering it on a schedule that stretches out as it grows keeps it alive with far less water. Your memory of a pattern works the same way.',
    explanation: `You have now met every core pattern. The danger at this stage is not that you cannot learn new things. It is that you quietly forget the old ones. Two weeks after solving Merge Intervals you may stare at it like a stranger. This concept gives you a light, repeatable system so that does not happen.

## The idea: spaced repetition

Memory fades on a curve. Each time you recall something just before you forget it, the curve flattens and the memory lasts longer. So instead of re-solving a problem ten times in one evening, you re-solve it a few times with growing gaps:

- Day 0: solve it.
- Day 1: solve it again from a blank file.
- Day 4: again.
- Day 10: again.
- Day 25: again.

If a re-solve goes badly (you needed the solution), reset the gap back to 1 day. If it goes well, roughly double the gap. That is the whole rule. A spreadsheet with columns "problem, pattern, next due date, streak" is enough; you do not need an app.

## The idea: the mistake log

A mistake log is a plain text file where every failed or slow attempt gets one short entry:

- **Problem**: Non-overlapping Intervals
- **What went wrong**: sorted by start instead of by end.
- **The rule I forgot**: "keep the most non-overlapping" means sort by end.
- **Pattern**: greedy / intervals.

Reading this log for five minutes before each session is the highest-value five minutes of your day. You will notice the same three or four mistakes repeating. Those are your real weaknesses, and they are specific enough to fix.

## A tiny example: which cards are due today?

**The slow way**: every day, scan all your cards and pick those whose due date has passed. With 300 problems that is 300 checks per day, O(n), even when only 5 are due.

**The fast way**: keep the cards in a min-heap ordered by due date. Pop from the top while the top is due. Each pop is O(log n) and you only pay for cards that are actually due.

\`\`\`python
import heapq

def due_today(heap, today):
    due = []
    while heap and heap[0][0] <= today:
        _, name = heapq.heappop(heap)
        due.append(name)
    return due
\`\`\`

The point is not the speed. The point is that the tool you learned in the Heaps gate solves a problem from your own life. That is what mastery feels like.

## A weekly rhythm that fits 90 minutes a day

- **Mon to Thu**: 15 min mistake log + due re-solves, then 60 min of new problems, then 15 min writing new log entries.
- **Fri**: only re-solves. No new problems.
- **Sat**: one timed mock interview (next concept).
- **Sun**: rest, or read one pattern page slowly.

## Where people go wrong

- Re-reading solutions instead of re-solving from blank. Reading feels like learning but it is not recall.
- Logging "I was careless". Be specific: "forgot the is_end flag in the trie".
- Keeping too many cards. If you have 400 due, cut it down: keep only two or three problems per pattern.
- Skipping the log because you solved the problem. Slow solves count as mistakes too.

## How to recognise it in an interview

This is a method, not a pattern, but it shows up in interviews as speed. When you say "this is the sort-by-end greedy" within thirty seconds, that speed came from spaced re-solves, and the interviewer can tell.`,
    naive: {
      title: 'Scan every card each day',
      description: 'Store all cards in a list and check every single one to find which are due. Works, but the work is proportional to the whole deck even when almost nothing is due.',
      time: 'O(n) per day',
      space: 'O(n)',
      code: {
        python: `def due_today(cards, today):
    # cards: list of (due_day, name)
    due = []
    for due_day, name in cards:
        if due_day <= today:
            due.append(name)
    return due`,
        javascript: `function dueToday(cards, today) {
  // cards: array of [dueDay, name]
  const due = [];
  for (const [dueDay, name] of cards) {
    if (dueDay <= today) due.push(name);
  }
  return due;
}`,
        java: `import java.util.*;

class Revision {
  // cards: each entry is {dueDay, name}
  static List<String> dueToday(List<Object[]> cards, int today) {
    List<String> due = new ArrayList<>();
    for (Object[] card : cards) {
      if ((Integer) card[0] <= today) due.add((String) card[1]);
    }
    return due;
  }
}`,
        cpp: `#include <string>
#include <vector>
using namespace std;

vector<string> dueToday(const vector<pair<int, string>>& cards, int today) {
  vector<string> due;
  for (const auto& card : cards) {
    if (card.first <= today) due.push_back(card.second);
  }
  return due;
}`,
      },
    },
    optimized: {
      title: 'Min-heap keyed by due date',
      description: 'Keep cards in a heap ordered by due date. The earliest card is always on top, so you pop only the cards that are actually due and stop immediately when the top is in the future.',
      time: 'O(k log n) for k due cards',
      space: 'O(n)',
      code: {
        python: `import heapq

def due_today(heap, today):
    # heap: list of (due_day, name), already heapified
    due = []
    while heap and heap[0][0] <= today:
        _, name = heapq.heappop(heap)
        due.append(name)
    return due`,
        javascript: `// heap: array of [dueDay, name] kept sorted ascending by dueDay
// (a real min-heap gives O(log n) pops; a sorted array shows the idea)
function dueToday(heap, today) {
  const due = [];
  while (heap.length > 0 && heap[0][0] <= today) {
    const [, name] = heap.shift();
    due.push(name);
  }
  return due;
}`,
        java: `import java.util.*;

class Revision {
  static List<String> dueToday(PriorityQueue<int[]> heap, String[] names, int today) {
    // heap entries: {dueDay, cardIndex}, ordered by dueDay
    List<String> due = new ArrayList<>();
    while (!heap.isEmpty() && heap.peek()[0] <= today) {
      int[] top = heap.poll();
      due.add(names[top[1]]);
    }
    return due;
  }
}`,
        cpp: `#include <queue>
#include <string>
#include <vector>
using namespace std;

typedef pair<int, string> Card;

vector<string> dueToday(priority_queue<Card, vector<Card>, greater<Card>>& heap, int today) {
  vector<string> due;
  while (!heap.empty() && heap.top().first <= today) {
    due.push_back(heap.top().second);
    heap.pop();
  }
  return due;
}`,
      },
    },
    whyFaster: 'The list scan pays for every card every day. The heap keeps the earliest due card on top, so the loop stops the moment it sees a card that is not due yet. Work becomes proportional to the number of due cards (k) times log n, instead of the whole deck size n.',
    keyPoints: [
      'Re-solve from a blank file on day 1, 4, 10, 25; double the gap on success, reset to 1 on failure.',
      'Keep a mistake log with a specific "rule I forgot" line for every slow or failed attempt.',
      'Read the log for five minutes before every session; the repeats are your real weaknesses.',
      'Keep the deck small: two or three problems per pattern is enough.',
      'Reading a solution is not recall. Only re-solving counts.',
    ],
    patternIds: ['top-k-heap', 'greedy'],
    problems: [
      {
        id: 'boats-to-save-people',
        title: 'Boats to Save People',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/boats-to-save-people/',
        patternId: 'two-pointers',
        hint: 'Sort, then pair the heaviest person with the lightest if they fit, otherwise the heaviest goes alone.',
        xp: 40,
      },
      {
        id: 'find-all-anagrams-in-a-string',
        title: 'Find All Anagrams in a String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
        patternId: 'sliding-window',
        hint: 'Slide a window the size of p and compare letter counts as you add one char and drop one.',
        xp: 40,
      },
      {
        id: 'top-k-frequent-words',
        title: 'Top K Frequent Words',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/top-k-frequent-words/',
        patternId: 'top-k-heap',
        hint: 'Count with a map, then keep a heap of size k ordered by (frequency, reverse alphabetical).',
        xp: 40,
      },
      {
        id: 'maximum-product-subarray',
        title: 'Maximum Product Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-product-subarray/',
        patternId: 'dp-1d',
        hint: 'Track both the max and min product ending here, because a negative number can flip them.',
        xp: 40,
      },
      {
        id: 'task-scheduler',
        title: 'Task Scheduler',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/task-scheduler/',
        patternId: 'greedy',
        hint: 'Always run the most frequent remaining task; a max-heap plus a cooldown queue simulates it.',
        xp: 40,
      },
    ],
  },
  {
    id: 'mock-interview-method',
    gateId: 'mastery',
    order: 2,
    title: 'The 45-minute mock interview, solo',
    minutes: 25,
    summary: 'A fixed six-step script (clarify, brute force, optimise, code, test, explain complexity) turns interview panic into a routine you can run alone with a timer.',
    analogy: 'Pilots run a checklist before every take-off, even after thousands of flights. Not because they forgot how to fly, but because a checklist works when your brain is under stress. The interview script is your checklist.',
    explanation: `Knowing the patterns is half of the job. The other half is performing under a clock while someone watches. You can train that alone. Pick one medium problem you have never seen, set a 45-minute timer, and talk out loud the whole time. Yes, out loud, even alone. Silence is the number one habit that fails real interviews.

## The six steps and their time budget

**1. Clarify (3-5 min).** Restate the problem in your own words. Ask about size of input, value ranges, duplicates, empty input, sorted or not, what to return on no answer. Write two tiny examples by hand, one normal and one edge case.

**2. Brute force (5 min).** Say the obvious slow solution and its complexity. "I could check every pair, that is O(n^2)." Do not code it. Naming it proves you understand the problem and gives you a fallback if the clever idea fails.

**3. Optimise (10 min).** Ask yourself the pattern questions: is it sorted, is it a contiguous window, do I need pairs, is there a next-greater shape, is it a count-ways question? Say the pattern name and the target complexity. Sketch the plan in three or four bullet lines before coding.

**4. Code (12-15 min).** Write clean code top to bottom, narrating each block. Use real variable names. If you get stuck, say what you are stuck on, then go back to the plan rather than freezing.

**5. Test (5-7 min).** Walk one example through your code line by line, tracking variables in a small table. Then hit the edge cases: empty, one element, all equal, negative numbers. Fix bugs calmly; finding your own bug is a plus, not a minus.

**6. Explain complexity (2 min).** State time and space, and where each comes from. "O(n log n) because of the sort, the sweep is O(n); O(n) space for the result."

## A tiny example: Contains Duplicate

Question: does the array have any repeated value?

- Clarify: integers, can be negative, n up to 10^5, return a boolean.
- Brute force: compare every pair, O(n^2). Too slow for 10^5.
- Optimise: I need "have I seen this before?" in O(1). That is a hash set. O(n) time, O(n) space.
- Code: loop, check set, add to set.
- Test: \`[1,2,3,1]\` returns True at the second 1; \`[]\` returns False.
- Complexity: O(n) time, O(n) space.

\`\`\`python
def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
\`\`\`

## After the timer

Spend ten more minutes reviewing. Did you finish? Which step ate too much time? Add a line to your mistake log. Then read the top community solution and note any pattern you missed.

## Where people go wrong

- Jumping into code at minute one. Nearly every failed mock starts this way.
- Staying silent while thinking. Narrate even "I am considering two pointers but the array is not sorted".
- Skipping tests because "it looks right". It rarely is.
- Choosing problems you have already solved. A mock must be a fresh problem.
- Running mocks every day. One or two per week, with proper review, beats seven rushed ones.

## How to recognise it in an interview

The real interview looks exactly like your mock, which is the whole point. When the interviewer says "let's start", you start step one. When they ask "can you do better?" you are at step three. When they say "can you walk me through an example?" you are at step five. Nothing surprises you because you have run this script twenty times.`,
    naive: {
      title: 'Brute force: compare every pair',
      description: 'For each element, compare it with every element after it. This is what you should say first in the interview, then immediately explain why it is too slow for large input.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def contains_duplicate(nums):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] == nums[j]:
                return True
    return False`,
        javascript: `function containsDuplicate(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}`,
        java: `class Solution {
  public boolean containsDuplicate(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (nums[i] == nums[j]) return true;
      }
    }
    return false;
  }
}`,
        cpp: `#include <vector>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] == nums[j]) return true;
    }
  }
  return false;
}`,
      },
    },
    optimized: {
      title: 'Hash set: have I seen this before?',
      description: 'Walk once and keep a set of values already seen. Each membership check is O(1) on average. This is the optimised step of the script: name the need ("seen before, fast"), name the tool (hash set), then code.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,
        javascript: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
        java: `import java.util.*;

class Solution {
  public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
      if (!seen.add(x)) return true;
    }
    return false;
  }
}`,
        cpp: `#include <unordered_set>
#include <vector>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
  unordered_set<int> seen;
  for (int x : nums) {
    if (seen.count(x)) return true;
    seen.insert(x);
  }
  return false;
}`,
      },
    },
    whyFaster: 'The brute force asks "is this equal to any later element?" by actually looking at every later element, which is n comparisons per position. The hash set answers "seen before?" in O(1) on average, so the total is one pass. You trade O(n) extra memory for dropping the time from O(n^2) to O(n), and in the interview you should say that trade out loud.',
    keyPoints: [
      'Six steps: clarify, brute force, optimise, code, test, explain complexity. Budget your 45 minutes across them.',
      'Talk out loud the whole time, even when practising alone.',
      'Always name the brute force and its complexity before optimising; it is your safety net.',
      'Test by tracing one example line by line, then hit empty and single-element cases.',
      'Review for ten minutes after every mock and log what slowed you down.',
      'One or two fresh-problem mocks per week, not seven rushed ones.',
    ],
    patternIds: ['hash-map', 'brute-force'],
    problems: [
      {
        id: 'valid-palindrome-ii',
        title: 'Valid Palindrome II',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-palindrome-ii/',
        patternId: 'two-pointers',
        hint: 'Move pointers inward; on the first mismatch, check whether skipping either side leaves a palindrome.',
        xp: 20,
      },
      {
        id: 'string-compression',
        title: 'String Compression',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/string-compression/',
        patternId: 'two-pointers',
        hint: 'Use a read pointer to count a run and a write pointer to overwrite the array in place.',
        xp: 40,
      },
      {
        id: 'minimum-size-subarray-sum',
        title: 'Minimum Size Subarray Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
        patternId: 'sliding-window',
        hint: 'Grow the window from the right; while the sum is at least the target, record the length and shrink from the left.',
        xp: 40,
      },
      {
        id: 'k-closest-points-to-origin',
        title: 'K Closest Points to Origin',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
        patternId: 'top-k-heap',
        hint: 'Keep a max-heap of size k on squared distance; pop when it grows past k.',
        xp: 40,
      },
      {
        id: 'largest-number',
        title: 'Largest Number',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/largest-number/',
        patternId: 'greedy',
        hint: 'Sort strings with a custom comparison: a before b if a + b is greater than b + a.',
        xp: 40,
      },
    ],
  },
  {
    id: 'competitive-programming-intro',
    gateId: 'mastery',
    order: 3,
    title: 'Competitive programming: a first look',
    minutes: 25,
    summary: 'Contests such as Codeforces reward the same patterns but add strict time limits, huge inputs, fast I/O and a rating that tracks your growth.',
    analogy: 'Interview prep is like learning to drive with an instructor: calm, one skill at a time, explanation matters. Competitive programming is go-karting: same steering and pedals, but now there is a clock, other drivers, and nobody cares how nicely you explained your turn.',
    explanation: `Competitive programming (CP) is solving algorithm problems in timed online contests. The best-known site is Codeforces; others are AtCoder, LeetCode contests and CodeChef. Everything you learned in the earlier gates applies. What changes is the environment.

## How CP differs from interviews

- **Nobody talks.** There is no clarify step and no partial credit for explaining. Only correct output within the time limit counts.
- **Input is huge and exact.** n is often 2 * 10^5 and you read it from standard input. A time limit of 1 or 2 seconds means roughly 10^8 simple operations, so O(n^2) at n = 10^5 fails.
- **Many problems, one clock.** A Codeforces Div 2 round has 5-7 problems in about 2 hours, ordered easy (A) to hard (F). Most people solve A-C. Solving them fast matters as much as solving them at all.
- **Wrong answers cost.** Each failed submission adds a penalty. Testing your own edge cases before submitting is worth real points.
- **Rating.** After each rated contest your rating moves up or down depending on how you placed. Newcomers start around 1000-1200 and climb through colours: grey, green, cyan, blue, purple and beyond. The rating is a noisy but honest measure of speed and accuracy.

## Fast input and output

This is the first surprise for Python users. Reading 2 * 10^5 numbers with \`input()\` in a loop can take a full second on its own. Read everything at once instead:

\`\`\`python
import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))
\`\`\`

Print with one \`sys.stdout.write\` or join your answers into one string. In C++ add \`ios::sync_with_stdio(false); cin.tie(nullptr);\` at the top of \`main\`. In Java use \`BufferedReader\` instead of \`Scanner\`. This alone turns many "Time Limit Exceeded" verdicts into "Accepted".

## Reading the constraints first

CP problems tell you the limits, and the limits tell you the complexity you need:

- n <= 20: try everything, bitmask or backtracking, O(2^n).
- n <= 5000: O(n^2) is fine.
- n <= 2 * 10^5: you need O(n log n) or O(n): sorting, binary search, two pointers, prefix sums, heaps, hashing.
- n <= 10^9 or more: O(log n) or O(1) with maths, or binary search on the answer.

Reading the constraints before the story is the fastest way to guess the intended pattern.

## Contest strategy for a beginner

- Read A and B, solve A quickly, submit, move on. Do not polish.
- Use small hand examples to test before every submission.
- If stuck for 20 minutes, switch problems. Come back later.
- After the contest, "upsolve" one problem you failed. That is where the learning happens.
- Do virtual contests (past rounds under a timer) when there is no live round.

## Where people go wrong

- Using slow input and blaming the algorithm.
- Ignoring integer overflow in C++ or Java; use 64-bit \`long long\` / \`long\` when sums can pass 2 * 10^9.
- Worrying about rating drops. Early rating swings are normal; consistency over months is what climbs.
- Skipping upsolving. A contest without review is just stress.

## How to recognise it in an interview

Interviewers rarely ask CP-only tricks, but CP habits show. Reading constraints before designing, testing edge cases before declaring victory, and writing fast code without stalling are all things a CP background makes automatic. Treat contests as strength training for interviews.`,
    naive: {
      title: 'Slow input: call input() once per line',
      description: 'The natural way to read numbers in Python. Each input() call has overhead, and for 200,000 lines that overhead alone can exceed a one-second limit.',
      time: 'O(n) with a large constant per line',
      space: 'O(n)',
      code: {
        python: `n = int(input())
nums = []
for _ in range(n):
    nums.append(int(input()))
total = 0
for x in nums:
    total += x
print(total)`,
        javascript: `// Node.js: reading line by line with readline
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  const n = parseInt(lines[0], 10);
  let total = 0;
  for (let i = 1; i <= n; i++) total += parseInt(lines[i], 10);
  console.log(total);
});`,
        java: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    long total = 0;
    for (int i = 0; i < n; i++) {
      total += sc.nextLong();
    }
    System.out.println(total);
  }
}`,
        cpp: `#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  long long total = 0;
  for (int i = 0; i < n; i++) {
    long long x;
    cin >> x;
    total += x;
  }
  cout << total << endl;
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Fast input: read the whole stream at once',
      description: 'Read all of standard input in one call and split it into tokens. The per-line overhead disappears, and the same algorithm now runs several times faster.',
      time: 'O(n) with a tiny constant',
      space: 'O(n)',
      code: {
        python: `import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
total = 0
for i in range(1, n + 1):
    total += int(data[i])
sys.stdout.write(str(total) + '\\n')`,
        javascript: `// Node.js: read all of stdin in one go
const fs = require('fs');
const data = fs.readFileSync(0, 'utf8').split(/\\s+/);
const n = parseInt(data[0], 10);
let total = 0;
for (let i = 1; i <= n; i++) total += parseInt(data[i], 10);
process.stdout.write(total + '\\n');`,
        java: `import java.io.*;
import java.util.*;

public class Main {
  public static void main(String[] args) throws IOException {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    StreamTokenizer in = new StreamTokenizer(br);
    in.nextToken();
    int n = (int) in.nval;
    long total = 0;
    for (int i = 0; i < n; i++) {
      in.nextToken();
      total += (long) in.nval;
    }
    System.out.println(total);
  }
}`,
        cpp: `#include <iostream>
using namespace std;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
  int n;
  cin >> n;
  long long total = 0;
  for (int i = 0; i < n; i++) {
    long long x;
    cin >> x;
    total += x;
  }
  cout << total << '\\n';
  return 0;
}`,
      },
    },
    whyFaster: 'Both versions are O(n), so the Big-O does not change. What changes is the constant: input() decodes, strips and returns one line at a time with Python-level overhead on every call, while reading the buffer once and splitting is done in C. In contests, a constant-factor speedup of 5-10x is the difference between passing and failing a tight time limit.',
    keyPoints: [
      'CP uses the same patterns, but with no talking, strict time limits and exact I/O.',
      'Read constraints first: n <= 20 means brute force, n ~ 2 * 10^5 means O(n log n).',
      'Use fast I/O: sys.stdin.buffer.read() in Python, sync_with_stdio(false) in C++, BufferedReader in Java.',
      'About 10^8 simple operations fit in one second.',
      'Test with small hand examples before submitting; wrong answers carry a penalty.',
      'Upsolve one failed problem after every contest; rating follows consistency.',
    ],
    patternIds: ['prefix-sum', 'binary-search-on-answer', 'greedy'],
    problems: [
      {
        id: 'range-sum-query-immutable',
        title: 'Range Sum Query - Immutable',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/range-sum-query-immutable/',
        patternId: 'prefix-sum',
        hint: 'Precompute prefix sums once so every query is a subtraction.',
        xp: 20,
      },
      {
        id: 'powx-n',
        title: 'Pow(x, n)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/powx-n/',
        patternId: 'divide-and-conquer',
        hint: 'Square the base and halve the exponent each step; handle negative n by inverting.',
        xp: 40,
      },
      {
        id: 'maximum-number-of-events-that-can-be-attended',
        title: 'Maximum Number of Events That Can Be Attended',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/',
        patternId: 'greedy',
        hint: 'Sweep the days; push events that have started into a min-heap by end day and attend the one ending soonest.',
        xp: 40,
      },
      {
        id: 'russian-doll-envelopes',
        title: 'Russian Doll Envelopes',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/russian-doll-envelopes/',
        patternId: 'lcs-lis',
        hint: 'Sort by width ascending and height descending, then run the O(n log n) LIS on heights.',
        xp: 80,
      },
      {
        id: 'range-sum-query-mutable',
        title: 'Range Sum Query - Mutable',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/range-sum-query-mutable/',
        patternId: 'divide-and-conquer',
        hint: 'A Fenwick tree or segment tree gives O(log n) for both update and range sum.',
        xp: 80,
      },
    ],
  },
]
