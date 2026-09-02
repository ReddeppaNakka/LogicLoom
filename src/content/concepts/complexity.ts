import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'big-o-basics',
    gateId: 'complexity',
    order: 1,
    title: 'Big-O Basics: Counting Steps, Not Seconds',
    minutes: 25,
    summary: 'Big-O describes how the work your code does grows as the input grows, ignoring the machine it runs on.',
    analogy:
      'Imagine two ways to find a friend in a stadium. You could walk past every seat (slow, and twice as slow if the stadium doubles in size), or you could call their phone (the same one step no matter how big the stadium is). Big-O is the language for describing that difference.',
    explanation: `Big-O is a way to describe how fast the work of a piece of code grows when the input gets bigger. It does not measure seconds. It measures the shape of the growth. This matters because an interviewer does not care that your code ran in 2 seconds on your laptop; they care whether it will still be fine with a million items.

## The idea

- Count the number of "basic steps" your code takes as a function of the input size, usually called **n**.
- Throw away constants and smaller terms. \`3n + 10\` becomes **O(n)**. \`n^2 + n\` becomes **O(n^2)**.
- Keep only the fastest-growing part. That part decides what happens when n is huge.

Why throw away constants? Because for n = 1,000,000 the difference between 3n and n is nothing compared to the difference between n and n^2.

## A tiny example

We want the sum of the numbers from 1 to n.

The slow way loops through every number:

\`\`\`python
def sum_to_n(n):
    total = 0
    for i in range(1, n + 1):   # runs n times
        total += i
    return total
\`\`\`

The loop body runs n times, so this is **O(n)**. Double n, double the work.

The fast way uses the formula from school:

\`\`\`python
def sum_to_n(n):
    return n * (n + 1) // 2      # one multiplication, one division
\`\`\`

This does the same three operations no matter how big n is. That is **O(1)**, called "constant time".

## Step by step: how to read a Big-O

1. Find the input size. It is usually the length of a list or string.
2. Look for loops. One loop over n items is O(n). A loop inside a loop over the same items is O(n^2).
3. Look at what you call. \`list.sort()\` is O(n log n). \`x in my_list\` is O(n). \`x in my_set\` is O(1).
4. Add work that happens one after another. Multiply work that happens inside other work.
5. Drop constants and smaller terms.

## Where people go wrong

- Thinking O(1) means "instant". It means "does not grow with n". A constant step can still be slow, it just stays the same.
- Forgetting that built-in functions have a cost. \`max(arr)\` inside a loop is a hidden nested loop.
- Confusing "fewer lines of code" with "faster". A one-line \`if x in list\` hides an O(n) scan.
- Measuring with a stopwatch on tiny inputs. On 10 items everything looks fast.

## How to recognise it in an interview

- "What is the time complexity of your solution?" is a request for Big-O.
- "Can you do better?" almost always means "drop one level", for example O(n^2) to O(n log n) or O(n).
- Constraints like "n can be up to 10^5" are a hint: O(n^2) would be 10^10 steps, which is too slow. O(n) or O(n log n) is expected.`,
    naive: {
      title: 'Loop: add every number from 1 to n',
      description:
        'Walk through each number and add it to a running total. The amount of work grows directly with n, so if n doubles the loop runs twice as long.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def sum_to_n(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

print(sum_to_n(100))  # 5050`,
        javascript: `function sumToN(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

console.log(sumToN(100)); // 5050`,
        java: `public class Solution {
  public static long sumToN(int n) {
    long total = 0;
    for (int i = 1; i <= n; i++) {
      total += i;
    }
    return total;
  }

  public static void main(String[] args) {
    System.out.println(sumToN(100)); // 5050
  }
}`,
        cpp: `#include <iostream>

long long sumToN(int n) {
  long long total = 0;
  for (int i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

int main() {
  std::cout << sumToN(100) << std::endl; // 5050
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Formula: n * (n + 1) / 2',
      description:
        'Use the closed formula for the sum of the first n numbers. It always does the same tiny amount of work, whether n is 10 or 10 billion.',
      time: 'O(1)',
      space: 'O(1)',
      code: {
        python: `def sum_to_n(n):
    return n * (n + 1) // 2

print(sum_to_n(100))  # 5050`,
        javascript: `function sumToN(n) {
  return (n * (n + 1)) / 2;
}

console.log(sumToN(100)); // 5050`,
        java: `public class Solution {
  public static long sumToN(long n) {
    return n * (n + 1) / 2;
  }

  public static void main(String[] args) {
    System.out.println(sumToN(100)); // 5050
  }
}`,
        cpp: `#include <iostream>

long long sumToN(long long n) {
  return n * (n + 1) / 2;
}

int main() {
  std::cout << sumToN(100) << std::endl; // 5050
  return 0;
}`,
      },
    },
    whyFaster:
      'The loop does n additions, so its work grows in a straight line with n. The formula does three arithmetic operations regardless of n. We went from O(n) to O(1) by replacing repeated work with a direct answer, which is the most extreme kind of speed-up you can get.',
    keyPoints: [
      'Big-O describes how work grows with input size n, not how many seconds code takes.',
      'Drop constants and smaller terms: 3n + 10 is O(n), n^2 + n is O(n^2).',
      'One loop over n items is O(n); a loop inside a loop is O(n^2).',
      'Built-in calls have hidden costs: `x in list` is O(n), `x in set` is O(1), sort is O(n log n).',
      'Problem constraints tell you the target: n up to 10^5 means O(n^2) is too slow.',
    ],
    definition:
      'Big-O notation names an upper bound on how the number of basic steps a piece of code takes grows as the input size n grows. Constant factors and slower-growing terms are dropped, so only the shape of the growth is left.',
    coreIdea:
      'Two programs that solve the same problem can differ by a constant factor because of the machine, the language or the compiler, and that constant tells you nothing about the algorithm. What matters is what happens when n doubles. Because only the fastest-growing term decides the answer for large n, we can throw everything else away and still predict which program survives a million items. That is why 3n + 10 and n collapse into the same class O(n), while n^2 stays in its own, far worse class.',
    visual: [
      {
        caption: 'Count how many times each line runs, then add them up.',
        frame: [
          'code                     times it runs',
          '  total = 0                          1',
          '  for i in 1..n                  n + 1',
          '      total += i                     n',
          '  return total                       1',
          'sum of the column   =   2n + 3 steps',
        ].join('\n'),
      },
      {
        caption: 'Drop constants: 2n + 3 and n grow at the same rate.',
        frame: [
          '   n     2n + 3        n    ratio',
          '  10         23       10      2.3',
          ' 100        203      100      2.0',
          '1000       2003     1000      2.0',
          'the ratio settles, so both are O(n)',
        ].join('\n'),
      },
      {
        caption: 'Same n, four growth classes. The gaps are not small.',
        frame: [
          '    n    log2 n   n log2 n         n^2',
          '   10       3.3         33         100',
          '  100       6.6        664      10,000',
          ' 1000      10.0      9,966   1,000,000',
          '10^6      19.9    2.0e+07       1e+12',
        ].join('\n'),
      },
      {
        caption: 'Nesting multiplies the work; sequence only adds it.',
        frame: [
          'for i in 1..n:         n rounds',
          '    for j in 1..n:     n each round',
          '                       = n^2 steps',
          '',
          'for i in 1..n: ...     n steps',
          'for j in 1..n: ...   + n steps',
          '                       = 2n -> O(n)',
        ].join('\n'),
      },
      {
        caption: 'A budget of about 10^8 steps per second picks the class.',
        frame: [
          'n =   1,000  n^2       = 1e+06   fine',
          'n = 100,000  n^2       = 1e+10   too slow',
          'n = 100,000  n log2 n  = 1.7e+06 fine',
          'so at n = 1e5 aim for O(n) or O(n log n)',
        ].join('\n'),
      },
    ],
    pseudocode: `function bigOh(fragment):
    n <- the size of the input this code walks over
    total <- 0
    for each statement s in fragment, in order:
        if s is a simple step (assign, compare, index):
            cost <- 1
        else if s is a call to a library routine:
            cost <- the documented cost of that routine
        else if s is a loop:
            rounds <- how many times the header succeeds
            body <- bigOh(body of s)        // look inside
            cost <- rounds * body           // nesting multiplies
        else if s is a branch:
            cost <- cost of the more expensive arm
        total <- total + cost               // sequence adds
    drop every constant factor from total
    keep only the fastest-growing term
    return that term, written as O(...)`,
    complexity: [
      { label: 'Closed formula, no loop', time: 'O(1)', space: 'O(1)', note: 'same three operations at any n' },
      { label: 'Loop that halves n each round', time: 'O(log n)', space: 'O(1)', note: 'about 20 rounds at n = 10^6' },
      { label: 'One loop over n items', time: 'O(n)', space: 'O(1)', note: 'one pass, a couple of counters' },
      { label: 'Loop inside a loop over n', time: 'O(n^2)', space: 'O(1)', note: 'n rounds of n steps each' },
    ],
    dryRun: {
      input: 'n = 4, run through both versions of sum_to_n on this page',
      goal: 'Count the exact number of basic steps each version does, so we can see where O(n) and O(1) come from.',
      steps: [
        { state: 'n = 4, total = 0, steps = 1', action: 'Set total to 0. That is one step and it happens once, whatever n is.' },
        { state: 'i = 1, total = 1, steps = 3', action: 'The loop test succeeds (1 step) and total += 1 runs (1 step), so each round costs 2.' },
        { state: 'i = 2, total = 3, steps = 5', action: 'Second round: test plus add. The cost per round never changes.' },
        { state: 'i = 3, total = 6, steps = 7', action: 'Third round, another 2 steps.' },
        { state: 'i = 4, total = 10, steps = 9', action: 'Fourth and last round, another 2 steps. total is now 1 + 2 + 3 + 4 = 10.' },
        { state: 'i = 5, total = 10, steps = 10', action: 'The loop test fails once and the loop ends. That is 1 extra step.' },
        { state: 'total = 10, steps = 11', action: 'Return total. The whole run cost 2n + 3 = 11 steps.' },
        { state: 'formula version, steps = 3', action: 'n * (n + 1) // 2 does one add, one multiply and one divide, then returns.' },
      ],
      result:
        'The loop costs 2n + 3 steps, which is O(n): 11 steps at n = 4, and 2,000,003 at n = 1,000,000. The formula costs 3 steps at every n, which is O(1). Both answer 10 for n = 4, because 1 + 2 + 3 + 4 = 10, so the fast version is not skipping work, it is replacing repetition with arithmetic.',
    },
    mistakes: [
      {
        mistake: 'Writing the answer as O(2n) or O(3n + 10).',
        why: 'Big-O already ignores constant factors and smaller terms, so the 2 and the 10 carry no information and make the answer look unfinished.',
        fix: 'Say O(n). If the constant genuinely matters, mention it in words: "O(n), but it makes two passes over the array".',
      },
      {
        mistake: 'Treating `if x in nums` as one step because it is one line.',
        why: 'On a list that is a scan of every element, so it is O(n). Put it inside a loop over n and the code is quietly O(n^2).',
        fix: 'Look up the cost of every built-in you call. Convert the list to a set first if you only need membership.',
      },
      {
        mistake: 'Reading O(1) as "instant".',
        why: 'O(1) only means the cost does not grow with n. A constant-time step can still be a slow disk read.',
        fix: 'Read O(1) as "the same cost at any n", and compare real constants when two options are both O(1).',
      },
      {
        mistake: 'Using a single n when the input has two independent sizes.',
        why: 'Comparing every word of one list against every word of another is O(n * m), not O(n^2). Collapsing both hides which input actually drives the cost.',
        fix: 'Name each size separately and keep both letters in the final answer.',
      },
      {
        mistake: 'Timing the code on a 10-item example and calling it fast.',
        why: 'Every complexity class looks the same at n = 10. The classes only separate as n grows.',
        fix: 'Count steps as a function of n, or time the code at n, 2n and 4n and watch how the time scales.',
      },
    ],
    whenToUse: [
      'The problem states constraints such as "1 <= n <= 10^5" and you need to know which solution shapes can fit.',
      'The interviewer asks "what is the time complexity?" or "can you do better?".',
      'You have two working solutions and must argue which one to ship.',
      'Your code passes the sample input and you need to predict whether it survives the full input.',
    ],
    whenNotToUse: [
      'You need real seconds on real hardware; Big-O hides constants, so run a benchmark or a profiler instead.',
      'n is fixed and tiny, like a 9-cell board; pick the simplest correct code, not the lowest growth class.',
      'Two candidates sit in the same class; compare exact operation counts and memory traffic, not Big-O.',
      'The cost is dominated by waiting on disk or network; count I/O operations instead of CPU steps.',
      'You need a lower bound or a tight bound; Big-O is only an upper bound, so use Omega for lower and Theta for tight.',
    ],
    relatedTopics: [
      { id: 'common-complexities', kind: 'concept', why: 'It lists the growth classes a Big-O answer lands in and how large n can be for each one.' },
      { id: 'time-vs-space', kind: 'concept', why: 'The same counting method, applied to memory instead of steps.' },
      { id: 'analyzing-loops-and-recursion', kind: 'concept', why: 'It turns the counting rules here into a checklist for loops and recursive calls.' },
      { id: 'hash-map', kind: 'pattern', why: 'The most common way to remove a nested loop once Big-O tells you O(n^2) is too slow.' },
    ],
    quiz: [
      {
        question: 'What is 5n^2 + 100n + 7 in Big-O?',
        options: ['O(n)', 'O(n^2)', 'O(5n^2)', 'O(n^2 + n)'],
        answerIndex: 1,
        explanation: 'Keep only the fastest-growing term and drop its constant. The 100n term loses to n^2 as soon as n is above about 20.',
      },
      {
        question: 'A loop runs over n numbers, and inside it you check `if x in nums` where nums is a Python list. What is the time complexity?',
        options: ['O(1)', 'O(n)', 'O(n^2)', 'O(n log n)'],
        answerIndex: 2,
        explanation: 'The membership test scans the list, which is O(n), and it happens n times. Nested work multiplies, so the total is O(n^2).',
      },
      {
        question: 'The constraints say n can be up to 200,000 and the limit is 1 second. Would an O(n^2) solution work?',
        options: [
          'Yes, 200,000 is a small number',
          'No, that is about 4 * 10^10 steps, so aim for O(n) or O(n log n)',
          'Yes, if you write it in C++ instead of Python',
          'No, and only an O(log n) solution can pass',
        ],
        answerIndex: 1,
        explanation: 'At roughly 10^8 steps per second, 4 * 10^10 steps needs hundreds of seconds. A language change buys a constant factor, not a class.',
      },
      {
        question: 'Your function makes one pass to find the maximum, then a second separate pass to count how many values equal it. What is the total time?',
        options: ['O(n)', 'O(2n)', 'O(n^2)', 'O(n log n)'],
        answerIndex: 0,
        explanation: 'Work done one after the other adds: n + n = 2n. Big-O drops the constant, so the answer is written O(n).',
      },
    ],
    sources: [
      'CLRS ch. 3 (characterizing running times)',
      'MIT 6.006 Lecture 1 (algorithms and computation)',
      'MIT 6.006 Lecture 2 (data structures and asymptotic notation)',
      'CP-Algorithms: Binary Search',
    ],
    patternIds: ['brute-force'],
    problems: [
      {
        id: 'richest-customer-wealth',
        title: 'Richest Customer Wealth',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/richest-customer-wealth/',
        patternId: 'brute-force',
        hint: 'Sum each row, keep the largest sum; count how many times the inner loop runs to name the Big-O.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/contains-duplicate/',
        patternId: 'hash-map',
        hint: 'Compare the nested-loop version to one that remembers what it has seen in a set.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/two-sum/',
        patternId: 'hash-map',
        hint: 'Write the O(n^2) pair check first, then ask what you could store to avoid the inner loop.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'number-of-good-pairs',
        title: 'Number of Good Pairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/number-of-good-pairs/',
        patternId: 'hash-map',
        hint: 'Each time you see a number, the count of earlier copies is how many new pairs it makes.',
        xp: 20,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'time-vs-space',
    gateId: 'complexity',
    order: 2,
    title: 'Time vs Space: The Trade You Make Every Day',
    minutes: 25,
    summary: 'Time complexity is how long code takes; space complexity is how much extra memory it needs, and you can often trade one for the other.',
    analogy:
      'Cooking for a party, you can wash and reuse one bowl (little space, lots of time) or use a fresh bowl for every step (lots of space, little time). Neither is wrong. The right choice depends on how many bowls you own and how much time you have.',
    explanation: `Time complexity counts steps. Space complexity counts extra memory your code needs beyond the input itself. Many fast solutions are fast because they store something: a set, a map, an extra array. Knowing this trade-off lets you choose on purpose instead of by accident.

## The idea

- **Time** = how many basic operations, as a function of n.
- **Space** = how much extra memory, as a function of n. The input does not count. A few variables count as O(1).
- A classic trade: spend O(n) memory to remember things so you do not have to look them up again, and time drops from O(n^2) to O(n).

## A tiny example

Question: does this list contain any duplicate value?

The slow way checks every pair and uses no extra memory:

\`\`\`python
def has_duplicate(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False
\`\`\`

Time is **O(n^2)** because of the nested loop. Space is **O(1)** because we only use i and j.

The fast way remembers what it has seen:

\`\`\`python
def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
\`\`\`

Time is **O(n)** because we visit each number once and set lookups are O(1). Space is **O(n)** because the set may hold every number. We bought time with memory.

## Step by step: measuring space

1. List every container you create: lists, sets, dicts, strings you build.
2. Ask how big each one gets in the worst case. A set of all inputs is O(n). A list of 26 letter counts is O(1) because 26 never changes.
3. Add recursion depth. Each open recursive call sits on the call stack, so a recursion n levels deep uses O(n) space even with no containers.
4. Report the largest term.

## Where people go wrong

- Saying "O(1) space" while building a new list of size n. Copies and slices like \`arr[1:]\` allocate memory.
- Forgetting the recursion stack. A recursive function that goes n deep is O(n) space.
- Assuming less memory is always better. In interviews, O(n) space for an O(n) time solution is usually the expected answer. Only reach for O(1) space if asked.
- Confusing "in-place" (modifies the input) with "no extra memory". In-place solutions are usually O(1) space, but check for hidden helpers.

## How to recognise it in an interview

- "Can you do it in constant space?" or "in-place" means they want you to drop the extra container, often by using two pointers or by reusing the input array.
- "Optimize for time" means it is fine to build a map or set.
- When they ask "what is the space complexity?" mention both containers and recursion depth. That signals you really understand it.`,
    naive: {
      title: 'Nested loop: no extra memory, quadratic time',
      description:
        'Compare every element with every later element. It uses only two counters, so memory is tiny, but the number of comparisons explodes as n grows.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def has_duplicate(nums):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] == nums[j]:
                return True
    return False

print(has_duplicate([3, 1, 4, 1]))  # True`,
        javascript: `function hasDuplicate(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}

console.log(hasDuplicate([3, 1, 4, 1])); // true`,
        java: `public class Solution {
  public static boolean hasDuplicate(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (nums[i] == nums[j]) return true;
      }
    }
    return false;
  }

  public static void main(String[] args) {
    System.out.println(hasDuplicate(new int[]{3, 1, 4, 1})); // true
  }
}`,
        cpp: `#include <iostream>
#include <vector>

bool hasDuplicate(const std::vector<int>& nums) {
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] == nums[j]) return true;
    }
  }
  return false;
}

int main() {
  std::cout << hasDuplicate({3, 1, 4, 1}) << std::endl; // 1
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Hash set: spend memory to save time',
      description:
        'Walk the list once and remember every value in a set. Checking whether a value was seen before is a single O(1) lookup, so the inner loop disappears.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False

print(has_duplicate([3, 1, 4, 1]))  # True`,
        javascript: `function hasDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

console.log(hasDuplicate([3, 1, 4, 1])); // true`,
        java: `import java.util.HashSet;

public class Solution {
  public static boolean hasDuplicate(int[] nums) {
    HashSet<Integer> seen = new HashSet<>();
    for (int x : nums) {
      if (seen.contains(x)) return true;
      seen.add(x);
    }
    return false;
  }

  public static void main(String[] args) {
    System.out.println(hasDuplicate(new int[]{3, 1, 4, 1})); // true
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <unordered_set>

bool hasDuplicate(const std::vector<int>& nums) {
  std::unordered_set<int> seen;
  for (int x : nums) {
    if (seen.count(x)) return true;
    seen.insert(x);
  }
  return false;
}

int main() {
  std::cout << hasDuplicate({3, 1, 4, 1}) << std::endl; // 1
  return 0;
}`,
      },
    },
    whyFaster:
      'The nested loop asks "have I seen this before?" by re-scanning the list, which costs O(n) per element and O(n^2) total. The set answers the same question in O(1) because it remembers everything. We paid O(n) memory for the set and got O(n) time in return; that is the time-space trade-off in its purest form.',
    keyPoints: [
      'Time complexity counts steps; space complexity counts extra memory beyond the input.',
      'The most common trade: store things in a set or map (O(n) space) to avoid a nested loop (O(n^2) time).',
      'Recursion depth counts as space. A recursion n levels deep uses O(n) stack memory.',
      'Slices, copies and new lists allocate memory even if the code looks short.',
      '"In-place" or "constant space" in a problem means: no extra containers, reuse the input.',
    ],
    definition:
      'Time complexity says how the number of steps grows with the input size n. Space complexity says how much extra memory beyond the input grows with n, counting every container you build and every stack frame an open recursive call holds.',
    coreIdea:
      'Most speed-ups are really acts of remembering. A nested loop is slow because it keeps re-deriving a fact it already saw once; if you store that fact, the inner loop disappears. So you pay O(n) memory and buy back a whole factor of n in time. The trade runs both ways: recompute instead of storing and you get the memory back at the cost of time.',
    visual: [
      {
        caption: 'Nested loop: almost no memory, but the pair count squares.',
        frame: [
          'nums = [3, 1, 4, 1]     memory: i and j only',
          '(0,1) (0,2) (0,3)',
          '      (1,2) (1,3)',
          '            (2,3)',
          '6 pairs = n(n-1)/2  ->  O(n^2) time, O(1) space',
        ].join('\n'),
      },
      {
        caption: 'Hash set: one pass, and memory grows with what we keep.',
        frame: [
          'x = 3   seen = {}          miss -> add 3',
          'x = 1   seen = {3}         miss -> add 1',
          'x = 4   seen = {3,1}       miss -> add 4',
          'x = 1   seen = {3,1,4}     HIT  -> return True',
          '4 lookups  ->  O(n) time, O(n) space',
        ].join('\n'),
      },
      {
        caption: 'The trade in numbers: time falls by about n, memory rises to n.',
        frame: [
          '    n   pairs n^2/2   set entries n',
          '   10          50              10',
          '  100       5,000             100',
          ' 1000     500,000           1,000',
          '10000  50,000,000          10,000',
        ].join('\n'),
      },
      {
        caption: 'The space people forget: the call stack grows with depth.',
        frame: [
          'f(4) -> f(3) -> f(2) -> f(1) -> f(0)',
          ' |       |       |       |       |',
          ' 5 frames are alive at the deepest point',
          'no containers at all, still O(n) space',
        ].join('\n'),
      },
      {
        caption: 'A fixed-size helper never grows, so it is O(1) space.',
        frame: [
          'counts = [0] * 26      26 slots, always 26',
          'seen   = set(nums)     up to n slots',
          '',
          'O(1) space             O(n) space',
        ].join('\n'),
      },
    ],
    pseudocode: `function spaceCost(fragment):
    extra <- 0
    for each container c created in fragment:
        extra <- extra + largest size c reaches, in terms of n
    for each copy or slice made in fragment:
        extra <- extra + size of that copy
    if fragment calls itself:
        depth <- longest chain of calls open at once
        frame <- extra memory held by a single call
        extra <- extra + depth * frame
    do not count the input, it was already there
    if the problem must return a big structure,
        report it separately as "output space"
    drop constants, keep the fastest-growing term
    return extra, written as O(...)`,
    complexity: [
      { label: 'Nested-loop scan', time: 'O(n^2)', space: 'O(1)', note: 'two counters, no storage' },
      { label: 'Hash-set pass', time: 'O(n)', space: 'O(n)', note: 'lookups O(1) on average with a good hash' },
      { label: 'Sort, then scan neighbours', time: 'O(n log n)', space: 'O(1) to O(n)', note: 'in-place sorts need O(1); Python Timsort can use O(n)' },
      { label: 'Recursive scan, depth n', time: 'O(n)', space: 'O(n)', note: 'one live stack frame per open call' },
      { label: 'Fixed-size counting array', time: 'O(n)', space: 'O(1)', note: '26 or 128 slots do not grow with n' },
    ],
    dryRun: {
      input: 'nums = [3, 1, 4, 1]',
      goal: 'Trace the hash-set version and count both the operations it does and the values it holds.',
      steps: [
        { state: 'seen = {}, ops = 1, held = 0', action: 'Create the empty set. One step, nothing stored yet.' },
        { state: 'x = 3, seen = {}, ops = 1', action: 'Look up 3 in seen. It is a miss, so add it. That is 2 more set operations.' },
        { state: 'x = 1, seen = {3}, ops = 3, held = 1', action: 'Look up 1. Miss again, so add it. Memory is now 2 values.' },
        { state: 'x = 4, seen = {3, 1}, ops = 5, held = 2', action: 'Look up 4. Miss, add it. Memory is now 3 values.' },
        { state: 'x = 1, seen = {3, 1, 4}, ops = 7, held = 3', action: 'Look up 1. This time it is a hit, so return True without adding anything.' },
        { state: 'ops = 8, held = 3', action: 'Done. Each element cost at most 2 set operations, so the count stays around 2n.' },
        { state: 'now the nested loop on the same input', action: 'It compares (0,1) (0,2) (0,3) (1,2) then (1,3), which matches, so 5 comparisons and no memory.' },
      ],
      result:
        'Both versions answer True, because 1 sits at index 1 and again at index 3. The set version used 8 operations and held 3 values: O(n) time, O(n) space. The loop used 5 comparisons and held nothing: O(n^2) time, O(1) space. On four items the loop looks cheaper, which is the point of Big-O: at n = 1000 the loop needs about 500,000 comparisons while the set still needs about 2,000 operations.',
    },
    mistakes: [
      {
        mistake: 'Saying "O(1) space" while building a slice or a result list.',
        why: 'A slice like arr[1:] copies n - 1 items, and a result list of n items is O(n) memory. Short code can still allocate a lot.',
        fix: 'Pass indices instead of slices. If the big list is the required output, say so: "O(1) extra space besides the output".',
      },
      {
        mistake: 'Forgetting the recursion stack when reporting space.',
        why: 'A recursion n levels deep holds n frames at once, so it is O(n) space even with no containers. In Python it also hits the recursion limit around 1000 levels.',
        fix: 'Count the deepest chain of open calls as space, and rewrite as a loop with your own stack when depth can reach n.',
      },
      {
        mistake: 'Claiming a hash lookup is O(1) with no caveat.',
        why: 'It is O(1) on average with a good hash. With colliding or adversarial keys every lookup degrades toward O(n) and the whole scan becomes O(n^2).',
        fix: 'Say "O(1) average" out loud. If the worst case must be bounded, sort or use a balanced tree for a guaranteed O(log n).',
      },
      {
        mistake: 'Chasing O(1) space when nobody asked for it.',
        why: 'The expected answer is usually the O(n) time solution first. An in-place trick that scrambles the input is a bug if the caller still needs it.',
        fix: 'Give the clean O(n) space solution, then offer the constant-space variant and mention that it mutates the input.',
      },
      {
        mistake: 'Counting a fixed-size array as O(n) space.',
        why: 'counts = [0] * 26 for the lowercase letters is 26 slots whether the string has 10 characters or 10 million.',
        fix: 'Ask whether the size depends on n or on a fixed alphabet. Only n-dependent sizes count toward space complexity.',
      },
    ],
    whenToUse: [
      'The problem says "optimize for time" or gives a big n with a generous memory limit.',
      'A nested loop keeps asking the same question: "have I seen this value?", "which index held this?".',
      'You are asked for the space complexity and want to include containers and recursion depth, not just containers.',
      'Memory is the tight constraint (a huge stream, an embedded target) and you need to trade time back for space.',
    ],
    whenNotToUse: [
      'The problem demands in-place or O(1) extra space; a hash map is out, use two pointers or mark values inside the input array.',
      'The data does not fit in memory at all; stream it or use an external sort instead of an O(n) lookup table.',
      'Values fall in a small fixed range like 1..n or the 26 letters; a counting array beats a hash map on both time and space.',
      'You need worst-case guarantees rather than averages; a balanced tree at O(log n) beats a hash map that can degrade.',
      'The extra structure would be bigger than the input itself; recompute the value instead of caching it.',
    ],
    relatedTopics: [
      { id: 'big-o-basics', kind: 'concept', why: 'Space complexity is counted with exactly the same drop-the-constants rules as time.' },
      { id: 'hash-map-basics', kind: 'concept', why: 'The structure that makes the memory-for-time trade cheap in the first place.' },
      { id: 'recursion-basics', kind: 'concept', why: 'It explains the call stack, which is where hidden O(n) space usually comes from.' },
      { id: 'two-pointers', kind: 'pattern', why: 'The usual way back to O(1) space once the data is sorted.' },
      { id: 'hash-map', kind: 'pattern', why: 'The concrete pattern that turns an O(n^2) scan into O(n) time and O(n) space.' },
    ],
    quiz: [
      {
        question: 'What is the space complexity of the set-based has_duplicate on this page?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        answerIndex: 2,
        explanation: 'If every value is distinct the set ends up holding all n of them, so the extra memory grows in a straight line with n.',
      },
      {
        question: 'A recursive function walks a linked list of n nodes, calling itself once per node and creating no containers. What is its space complexity?',
        options: ['O(1), it stores nothing', 'O(log n)', 'O(n), one live stack frame per open call', 'O(n^2)'],
        answerIndex: 2,
        explanation: 'None of the n calls returns until the last one does, so n frames sit on the stack at the same time. That memory counts.',
      },
      {
        question: 'A problem asks you to find the duplicate in an array of n + 1 integers from 1..n, using O(1) extra space and without modifying the array. Does the hash-set solution qualify?',
        options: [
          'Yes, sets are O(1) space',
          'No, the set can hold up to n values, so it is O(n) space; the fast-and-slow-pointer cycle trick is the O(1) answer',
          'No, but sorting the array first would qualify',
          'Yes, as long as you clear the set before returning',
        ],
        answerIndex: 1,
        explanation: 'The set grows with n, so it breaks the space rule, and sorting breaks the "do not modify" rule. Treating values as next-index pointers gives a cycle you can find with two pointers in O(1) space.',
      },
      {
        question: 'You build counts = [0] * 26 while scanning a string of length n. What is the extra space?',
        options: ['O(n)', 'O(1), because 26 slots never grow with n', 'O(26n)', 'O(n log n)'],
        answerIndex: 1,
        explanation: 'The array size is fixed by the alphabet, not by the input length, so it is a constant no matter how long the string gets.',
      },
    ],
    sources: [
      'CLRS ch. 3 (asymptotic notation)',
      'CLRS ch. 11 (hash tables and average-case lookups)',
      'MIT 6.006 lectures on data structures and hashing',
      'CP-Algorithms: String Hashing (collision behaviour)',
    ],
    patternIds: ['brute-force', 'hash-map'],
    problems: [
      {
        id: 'reverse-string',
        title: 'Reverse String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/reverse-string/',
        patternId: 'two-pointers',
        hint: 'Swap the first and last characters and move both pointers inward; no new array needed.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'missing-number',
        title: 'Missing Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/missing-number/',
        patternId: 'bit-manipulation',
        hint: 'A set works in O(n) space; the sum formula or XOR gets you the same answer in O(1) space.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'find-all-numbers-disappeared-in-an-array',
        title: 'Find All Numbers Disappeared in an Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
        patternId: 'cyclic-sort',
        hint: 'Use the input array itself as the "seen" set by marking index (value - 1) in some way.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'find-all-duplicates-in-an-array',
        title: 'Find All Duplicates in an Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/',
        patternId: 'cyclic-sort',
        hint: 'Values are 1..n, so each value has a home index; a value whose home is already marked is a duplicate.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'common-complexities',
    gateId: 'complexity',
    order: 3,
    title: 'Common Complexities: The Ladder from O(1) to O(n!)',
    minutes: 30,
    summary: 'Learn the handful of growth rates you will meet again and again, what code shapes produce them, and how big an input each one can handle.',
    analogy:
      'Think of complexities as vehicles. O(1) is teleporting. O(log n) is a plane. O(n) is a car. O(n log n) is a car that stops at every toll booth. O(n^2) is walking. O(2^n) is crawling. For a short trip they all arrive; for a long trip only the first few ever get there.',
    explanation: `There are only about seven complexities you need to know by heart. Once you can match each one to the shape of code that produces it, reading and improving solutions becomes much faster. This concept is the reference table you will come back to.

## The ladder, fastest to slowest

- **O(1)** constant. Array index, dict lookup, arithmetic. Does not grow with n.
- **O(log n)** logarithmic. Binary search. Each step halves the problem. For n = 1,000,000 that is only about 20 steps.
- **O(n)** linear. One pass over the data. Finding a max, counting, a single loop.
- **O(n log n)** linearithmic. Good sorting (merge sort, Timsort), or doing a log n thing n times.
- **O(n^2)** quadratic. Nested loops over the same input. Bubble sort, checking all pairs.
- **O(2^n)** exponential. Trying every subset. Doubles with every extra item.
- **O(n!)** factorial. Trying every ordering (permutations). Explodes almost immediately.

## How big can n be?

A rough rule: a computer does about 10^8 simple steps per second. So for a 1-second limit:

- O(n^2) works up to about n = 10^4.
- O(n log n) works up to about n = 10^6.
- O(n) works up to about n = 10^8.
- O(2^n) only works up to about n = 20-25.
- O(n!) only works up to about n = 10-11.

Read the constraints in a problem, find n, and this table tells you which complexity you are allowed.

## A tiny example

Find the smallest difference between any two numbers in a list.

The slow way checks every pair:

\`\`\`python
def min_diff(nums):
    best = float('inf')
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            best = min(best, abs(nums[i] - nums[j]))
    return best
\`\`\`

Two nested loops over n items: **O(n^2)**.

The fast way sorts first. After sorting, the closest pair must be neighbours:

\`\`\`python
def min_diff(nums):
    nums.sort()                       # O(n log n)
    best = float('inf')
    for i in range(1, len(nums)):     # O(n)
        best = min(best, nums[i] - nums[i - 1])
    return best
\`\`\`

Sorting costs O(n log n) and the scan costs O(n). We keep the bigger term: **O(n log n)**. For n = 100,000 that is about 1.7 million steps instead of 5 billion.

## Where people go wrong

- Treating O(n log n) as "basically O(n^2)". They are worlds apart for large n.
- Writing O(2^n) recursion without noticing. If a function calls itself twice with n - 1, that is exponential.
- Forgetting that two separate loops one after another are O(n) + O(n) = O(n), not O(n^2).
- Believing log n is a big number. It is tiny: log2 of a billion is about 30.

## How to recognise it in an interview

- "Sorted" in the problem usually means O(log n) search is available.
- "All subsets" or "all combinations" means O(2^n) is expected and n will be small.
- "All orderings" means O(n!) and n will be under 10.
- n up to 10^5 or larger means you must find O(n) or O(n log n).`,
    naive: {
      title: 'All pairs: compare every number with every other',
      description:
        'Check the difference of every possible pair and keep the smallest. Simple to write, but the pair count grows with the square of n.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def min_diff(nums):
    best = float('inf')
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            best = min(best, abs(nums[i] - nums[j]))
    return best

print(min_diff([8, 1, 5, 12]))  # 3`,
        javascript: `function minDiff(nums) {
  let best = Infinity;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      best = Math.min(best, Math.abs(nums[i] - nums[j]));
    }
  }
  return best;
}

console.log(minDiff([8, 1, 5, 12])); // 3`,
        java: `public class Solution {
  public static int minDiff(int[] nums) {
    int best = Integer.MAX_VALUE;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        best = Math.min(best, Math.abs(nums[i] - nums[j]));
      }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(minDiff(new int[]{8, 1, 5, 12})); // 3
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <climits>
#include <cstdlib>

int minDiff(const std::vector<int>& nums) {
  int best = INT_MAX;
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      best = std::min(best, std::abs(nums[i] - nums[j]));
    }
  }
  return best;
}

int main() {
  std::cout << minDiff({8, 1, 5, 12}) << std::endl; // 3
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Sort first, then compare neighbours',
      description:
        'After sorting, the two closest values must sit next to each other. So sort once and scan adjacent pairs in a single pass.',
      time: 'O(n log n)',
      space: 'O(1)',
      code: {
        python: `def min_diff(nums):
    nums = sorted(nums)
    best = float('inf')
    for i in range(1, len(nums)):
        best = min(best, nums[i] - nums[i - 1])
    return best

print(min_diff([8, 1, 5, 12]))  # 3`,
        javascript: `function minDiff(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  let best = Infinity;
  for (let i = 1; i < sorted.length; i++) {
    best = Math.min(best, sorted[i] - sorted[i - 1]);
  }
  return best;
}

console.log(minDiff([8, 1, 5, 12])); // 3`,
        java: `import java.util.Arrays;

public class Solution {
  public static int minDiff(int[] nums) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int best = Integer.MAX_VALUE;
    for (int i = 1; i < sorted.length; i++) {
      best = Math.min(best, sorted[i] - sorted[i - 1]);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(minDiff(new int[]{8, 1, 5, 12})); // 3
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

int minDiff(std::vector<int> nums) {
  std::sort(nums.begin(), nums.end());
  int best = INT_MAX;
  for (size_t i = 1; i < nums.size(); i++) {
    best = std::min(best, nums[i] - nums[i - 1]);
  }
  return best;
}

int main() {
  std::cout << minDiff({8, 1, 5, 12}) << std::endl; // 3
  return 0;
}`,
      },
    },
    whyFaster:
      'The pair check does about n^2 / 2 comparisons. Sorting costs O(n log n) but gives us structure: the closest pair is now guaranteed to be adjacent, so one O(n) scan finishes the job. O(n log n) + O(n) simplifies to O(n log n), one full rung down the ladder from O(n^2).',
    keyPoints: [
      'The ladder: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!).',
      'About 10^8 simple steps per second: O(n^2) is fine up to n = 10^4, O(n log n) up to 10^6.',
      'Sorting is O(n log n) and often turns an O(n^2) pair problem into a neighbour problem.',
      'Two loops one after another add (still O(n)); a loop inside a loop multiplies (O(n^2)).',
      '"All subsets" hints at O(2^n); "all orderings" hints at O(n!); both mean n is small.',
    ],
    definition:
      'The short ladder of growth classes that almost every interview solution lands on, from O(1) up to O(n!), together with the code shape that produces each one and the largest n it can finish in about a second.',
    coreIdea:
      'Each rung of the ladder comes from a recognisable shape: halving gives a log, one pass gives linear, sorting gives n log n, all pairs gives quadratic, in-or-out for every item gives 2^n, and every ordering gives n!. Because only the largest term survives, a solution built from several parts sits in the class of its slowest part. So naming the class of each part and taking the worst one is usually the entire analysis. Once you know the class, the constraint on n tells you straight away whether it is fast enough.',
    visual: [
      {
        caption: 'The ladder, with the code shape that produces each rung.',
        frame: [
          'O(1)         x = arr[i]',
          'O(log n)     while n > 1: n = n // 2',
          'O(n)         for x in arr: ...',
          'O(n log n)   arr.sort()',
          'O(n^2)       for i: for j: ...',
          'O(2^n)       take item i, or skip item i',
          'O(n!)        try every ordering',
        ].join('\n'),
      },
      {
        caption: 'How many operations each class needs at n = 1,000.',
        frame: [
          'n = 1,000          operations',
          'O(1)                        1',
          'O(log2 n)                  10',
          'O(n)                    1,000',
          'O(n log2 n)             9,966',
          'O(n^2)              1,000,000',
          'O(2^n)         about 1e+301',
        ].join('\n'),
      },
      {
        caption: 'Largest n that finishes in about 10^8 steps.',
        frame: [
          'class         biggest workable n',
          'O(log n)      essentially any n',
          'O(n)          about 10^8',
          'O(n log n)    about 10^6',
          'O(n^2)        about 10^4',
          'O(2^n)        about 25',
          'O(n!)         about 11',
        ].join('\n'),
      },
      {
        caption: 'Double n: how much slower does each class get?',
        frame: [
          'double n  ->  time multiplies by',
          'O(1)                          1',
          'O(log n)          plus one step',
          'O(n)                          2',
          'O(n log n)      a little over 2',
          'O(n^2)                        4',
          'O(2^n)          squares itself',
        ].join('\n'),
      },
      {
        caption: 'Sorting turns an all-pairs problem into a neighbour scan.',
        frame: [
          'unsorted [8, 1, 5, 12]   6 pairs to check',
          'sorted   [1, 5, 8, 12]   3 neighbours',
          '   1  5   diff 4',
          '   5  8   diff 3   <- smallest',
          '   8 12   diff 4',
        ].join('\n'),
      },
    ],
    pseudocode: `function classOf(solution):
    parts <- split solution into its top-level steps
    classes <- empty list
    for each part p in parts:
        if p halves the range it searches each round:
            add O(log n)
        else if p makes one pass over the n items:
            add O(n)
        else if p sorts, or repeats a log-n step n times:
            add O(n log n)
        else if p pairs every item with every other item:
            add O(n^2)
        else if p decides "in or out" for every item:
            add O(2^n)
        else if p tries every ordering of the items:
            add O(n!)
        else:
            add O(1)
    if one part is nested inside another:
        return the product of the nested classes
    return the slowest class in classes`,
    complexity: [
      { label: 'Binary search on sorted data', time: 'O(log n)', space: 'O(1)', note: 'the range halves every round' },
      { label: 'One linear pass', time: 'O(n)', space: 'O(1)', note: 'each item is touched once' },
      { label: 'Comparison sort (merge sort)', time: 'O(n log n)', space: 'O(n)', note: 'log n levels, n work per level; merging needs a buffer' },
      { label: 'All pairs (nested loop)', time: 'O(n^2)', space: 'O(1)', note: 'n(n-1)/2 pairs' },
      { label: 'All subsets (backtracking)', time: 'O(2^n * n)', space: 'O(n)', note: '2^n subsets, up to n work to copy each; stack depth n' },
    ],
    dryRun: {
      input: 'nums = [8, 1, 5, 12]',
      goal: 'Count the operations each version of min_diff does, so the O(n^2) and O(n log n) labels become concrete numbers.',
      steps: [
        { state: 'naive version, best = infinity, comparisons = 0', action: 'The pair loop starts. With n = 4 there are n(n-1)/2 = 6 pairs to look at.' },
        { state: 'i = 0, comparisons = 3, best = 3', action: 'Pairs (8,1) (8,5) (8,12) give gaps 7, 3 and 4. The best so far is 3.' },
        { state: 'i = 1, comparisons = 5, best = 3', action: 'Pairs (1,5) and (1,12) give 4 and 11. Neither beats 3.' },
        { state: 'i = 2, comparisons = 6, best = 3', action: 'The last pair (5,12) gives 7. The loop is done after all 6 comparisons.' },
        { state: 'optimized version, nums = [1, 5, 8, 12]', action: 'Sort the four values first. A comparison sort needs roughly n log2 n, so about 8 comparisons here.' },
        { state: 'i = 1, best = 4, subtractions = 1', action: 'Compare the neighbours 5 and 1: the gap is 4.' },
        { state: 'i = 2, best = 3, subtractions = 2', action: 'Neighbours 8 and 5 give a gap of 3, a new best.' },
        { state: 'i = 3, best = 3, subtractions = 3', action: 'Neighbours 12 and 8 give 4, so nothing changes. The scan did n - 1 = 3 subtractions.' },
      ],
      result:
        'Both return 3, the gap between 5 and 8, and the sorted version is correct because after sorting the two closest values must be adjacent. Notice that at n = 4 the pair loop (6 comparisons) is actually cheaper than sorting. The classes only separate as n grows: at n = 100,000 the pair loop needs about 5 * 10^9 comparisons while sort-then-scan needs about 1.7 * 10^6.',
    },
    mistakes: [
      {
        mistake: 'Treating O(n log n) as "basically the same as O(n^2)".',
        why: 'At n = 1,000,000 they are about 2 * 10^7 steps against 10^12 steps, a factor of fifty thousand.',
        fix: 'Remember that log2 of a million is about 20. The log factor is small; the squaring is not.',
      },
      {
        mistake: 'Adding when the code actually multiplies.',
        why: 'Two sorts one after the other are still O(n log n), but a sort inside a loop over n is O(n^2 log n). People often quote the first while the code does the second.',
        fix: 'Ask whether the second piece of work happens once in total, or once per item.',
      },
      {
        mistake: 'Ignoring the cost of a single comparison.',
        why: 'Sorting n strings of length m is O(m * n log n), not O(n log n), because every comparison can scan up to m characters.',
        fix: 'Multiply the number of comparisons by the cost of one comparison whenever the items are not simple numbers.',
      },
      {
        mistake: 'Assuming every sort is O(n log n).',
        why: 'That bound is for comparison sorts, and it is also their lower bound in the worst case. A hand-written bubble sort is O(n^2), while counting or radix sort can beat n log n when the values are small integers.',
        fix: 'Name the sort you mean. If values sit in a small range k, counting sort gives O(n + k).',
      },
      {
        mistake: 'Trying to beat the size of the output.',
        why: 'If a problem asks you to list all 2^n subsets, nothing can run faster than 2^n, because just writing the answer takes that long.',
        fix: 'Check how big the required output is first. That size is a floor on the complexity.',
      },
    ],
    whenToUse: [
      'The problem gives a bound on n and you want to pick a target complexity before writing any code.',
      'You have a working brute force and need to decide which rung to aim for next.',
      'The word "sorted" appears, which usually opens up O(log n) search or a neighbour scan.',
      'The problem asks for all subsets or all orderings and you need to check that n is small enough to allow it.',
    ],
    whenNotToUse: [
      'Two candidate solutions sit in the same class; compare exact operation counts or benchmark them instead.',
      'The input is a graph with V nodes and E edges; a ladder in n does not fit, use classes in V and E such as O(V + E).',
      'The cost depends on a second parameter such as value range or word length; keep that letter, as in O(n + k) or O(m * n).',
      'You need an amortised or expected bound, as with dynamic array growth or quicksort; state that bound and its assumption rather than a single worst-case rung.',
      'Memory, not time, is the binding constraint; the ladder here only ranks time.',
    ],
    relatedTopics: [
      { id: 'big-o-basics', kind: 'concept', why: 'It gives the counting rules that place a piece of code on this ladder.' },
      { id: 'analyzing-loops-and-recursion', kind: 'concept', why: 'It shows which loop and recursion shapes produce each rung.' },
      { id: 'merge-sort', kind: 'concept', why: 'The standard O(n log n) sort, and the reason sorting is such a common first step.' },
      { id: 'linear-vs-binary-search', kind: 'concept', why: 'Where the O(log n) rung comes from in real code.' },
      { id: 'backtracking', kind: 'pattern', why: 'The source of O(2^n) and O(n!) solutions, and the reason n stays tiny there.' },
    ],
    quiz: [
      {
        question: 'A problem allows n up to 10^5 with a 1 second limit. Which target should you aim for?',
        options: ['O(n^2)', 'O(n) or O(n log n)', 'O(2^n)', 'O(n^3)'],
        answerIndex: 1,
        explanation: 'O(n^2) at n = 10^5 is 10^10 steps, far past a one second budget. O(n log n) is about 1.7 million steps.',
      },
      {
        question: 'You sort an array once, then make two separate linear passes over it. What is the total time?',
        options: ['O(n log n)', 'O(n^2 log n)', 'O(n log n + 2n), which cannot be simplified', 'O(n)'],
        answerIndex: 0,
        explanation: 'Sequential work adds, and n log n dominates 2n, so the sum collapses to O(n log n).',
      },
      {
        question: 'What is the time complexity of sorting n strings, each of length m?',
        options: ['O(n log n)', 'O(m + n log n)', 'O(m * n log n), because each comparison can scan up to m characters', 'O(m * n)'],
        answerIndex: 2,
        explanation: 'A comparison sort makes about n log n comparisons, and here one comparison is not O(1) but O(m).',
      },
      {
        question: 'A problem asks for every permutation of the input and says n <= 8. Is an O(n!) backtracking solution acceptable?',
        options: [
          'No, O(n!) is never acceptable',
          'Yes: 8! = 40,320, and the answer itself has that many entries, so nothing can be faster',
          'Yes, but only if you write it in C++',
          'No, you should look for an O(2^n) solution instead',
        ],
        answerIndex: 1,
        explanation: 'The output size sets the floor. When the problem demands all n! orderings, an O(n!) algorithm is optimal, and the small n is the hint that this is intended.',
      },
    ],
    sources: [
      'CLRS ch. 2 (insertion sort and merge sort)',
      'CLRS ch. 3 (growth of functions)',
      'CLRS ch. 8 (the comparison-sort lower bound and counting sort)',
      'MIT 6.006 lectures on sorting and binary search',
      'CP-Algorithms: Binary Search',
    ],
    patternIds: ['brute-force', 'binary-search', 'backtracking'],
    problems: [
      {
        id: 'guess-number-higher-or-lower',
        title: 'Guess Number Higher or Lower',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/guess-number-higher-or-lower/',
        patternId: 'binary-search',
        hint: 'Each guess in the middle cuts the range in half; count how many halvings n takes to reach 1.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'majority-element',
        title: 'Majority Element',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/majority-element/',
        patternId: 'hash-map',
        hint: 'Count with a map in one pass (O(n)); compare that to sorting and picking the middle (O(n log n)).',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/merge-intervals/',
        patternId: 'merge-intervals',
        hint: 'Sort by start time so overlapping intervals become neighbours, then walk once.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'subsets',
        title: 'Subsets',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subsets/',
        patternId: 'backtracking',
        hint: 'Every element is either in or out, which is why the output has 2^n entries.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'permutations',
        title: 'Permutations',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/permutations/',
        patternId: 'backtracking',
        hint: 'Pick a first element n ways, then n - 1 ways for the next: the output size is n! so n must be small.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
  {
    id: 'analyzing-loops-and-recursion',
    gateId: 'complexity',
    order: 4,
    title: 'Analyzing Loops and Recursion',
    minutes: 30,
    summary: 'Learn the mechanical rules for turning loops, halving steps and recursive calls into a Big-O, including the recursion trap that makes O(2^n) code look innocent.',
    analogy:
      'Analyzing code is like estimating a bill at a restaurant. Items ordered one after another add up. Items ordered "for each person at the table" multiply. And if every guest invites two more guests who each invite two more, you are not paying for dinner, you are paying for a wedding.',
    explanation: `Once you know the ladder of complexities, the next skill is looking at real code and naming its rung. There are only a few rules. Loops multiply or add, halving means log, and recursion means "how many calls, times how much work per call".

## Rules for loops

- One loop over n items: **O(n)**.
- A loop inside a loop, both over n: **O(n^2)**. Three deep: O(n^3).
- Two loops one after the other: O(n) + O(n) = **O(n)**. Sequential work adds; nested work multiplies.
- Inner loop from i to n instead of 0 to n: still **O(n^2)**. It does about half the work, but half of n^2 is still n^2.
- A loop that halves or doubles a value each step (\`i = i * 2\`, \`n = n // 2\`): **O(log n)**.
- A loop over n where each step does an O(log n) thing: **O(n log n)**.

## Rules for recursion

Ask two questions: how many calls happen in total, and how much work does each call do outside the recursive calls?

- One recursive call with n - 1: n calls, so O(n) times the work per call.
- One recursive call with n / 2: log n calls (like binary search).
- Two recursive calls with n - 1 each: the calls double every level, so about 2^n calls. **O(2^n)**.
- Two recursive calls with n / 2 each, plus O(n) work to combine: **O(n log n)** (merge sort).

## A tiny example

Fibonacci: f(n) = f(n - 1) + f(n - 2).

The slow way is the obvious recursion:

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
\`\`\`

Every call makes two more calls. fib(5) calls fib(3) twice and fib(2) three times. The total is about 2^n calls: **O(2^n)** time and O(n) space for the call stack. fib(40) takes seconds; fib(50) takes hours.

The fast way keeps the last two values in a loop:

\`\`\`python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`

One loop of n steps: **O(n)** time, O(1) space. Same answer, no repeated work.

## Step by step: analyze any function

1. Find n (usually the input length).
2. Mark each loop with its number of iterations.
3. Nested? Multiply. Sequential? Add.
4. For recursion, draw the first two levels of the call tree and count the branching.
5. Simplify by dropping constants and smaller terms.

## Where people go wrong

- Seeing one line and assuming O(1). \`sum(arr)\`, \`arr.index(x)\` and \`s in text\` are all O(n).
- Counting a while loop that halves as O(n). Halving is always log n.
- Missing the exponential branch. If a function calls itself more than once per call with almost the same size, alarm bells should ring.
- Forgetting that a recursive call that slices the list (\`arr[1:]\`) costs O(n) per call, turning O(n) into O(n^2).

## How to recognise it in an interview

- If your recursion has two branches and the interviewer asks "what happens for n = 50?", they are pointing at O(2^n). Memoization or a loop is the fix.
- "While the number is bigger than one, divide by two" is your cue to say log n.
- When asked to analyze someone else's code, narrate: "this loop runs n times, and inside it we do a set lookup which is O(1), so O(n) overall". Narration earns points.`,
    naive: {
      title: 'Plain recursion: fib(n) = fib(n-1) + fib(n-2)',
      description:
        'Directly translates the maths into code. Each call spawns two more calls, so the same sub-results are computed again and again. The call tree has about 2^n nodes.',
      time: 'O(2^n)',
      space: 'O(n)',
      code: {
        python: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))  # 55`,
        javascript: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(10)); // 55`,
        java: `public class Solution {
  public static long fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
  }

  public static void main(String[] args) {
    System.out.println(fib(10)); // 55
  }
}`,
        cpp: `#include <iostream>

long long fib(int n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

int main() {
  std::cout << fib(10) << std::endl; // 55
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Iterative: keep only the last two values',
      description:
        'Build the sequence from the bottom up. Each number is computed exactly once from the two before it, so there is no repeated work and no deep call stack.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib(10))  # 55`,
        javascript: `function fib(n) {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a;
}

console.log(fib(10)); // 55`,
        java: `public class Solution {
  public static long fib(int n) {
    long a = 0;
    long b = 1;
    for (int i = 0; i < n; i++) {
      long next = a + b;
      a = b;
      b = next;
    }
    return a;
  }

  public static void main(String[] args) {
    System.out.println(fib(10)); // 55
  }
}`,
        cpp: `#include <iostream>

long long fib(int n) {
  long long a = 0;
  long long b = 1;
  for (int i = 0; i < n; i++) {
    long long next = a + b;
    a = b;
    b = next;
  }
  return a;
}

int main() {
  std::cout << fib(10) << std::endl; // 55
  return 0;
}`,
      },
    },
    whyFaster:
      'The recursive version recomputes fib(k) many times: fib(2) alone is computed millions of times for n = 40, so the call count grows like 2^n. The loop computes each fib(k) exactly once, in order, so the work is n steps. Going from O(2^n) to O(n) is the difference between "never finishes" and "instant" for n = 100.',
    keyPoints: [
      'Sequential loops add; nested loops multiply; a loop that halves each step is O(log n).',
      'For recursion, count total calls times work per call. Two branches with n - 1 means O(2^n).',
      'A recursive call n levels deep uses O(n) stack space even without any containers.',
      'One-line built-ins can hide O(n): sum, index, in on a list, slicing.',
      'Fix exponential recursion by memoizing or by rebuilding bottom-up with a loop.',
    ],
    definition:
      'A set of mechanical rules for turning code into a growth class: work done one after another adds, nested work multiplies, a value that halves each round contributes a log factor, and a recursive function costs the number of calls it makes times the work each call does outside its own recursive calls.',
    coreIdea:
      'Every loop and every recursion is really a tree of work, and the total cost is the sum over that tree. For loops the tree is a rectangle: rounds times cost per round. For recursion you write the recurrence T(n) = a * T(n / b) + f(n), meaning one call splits into a calls on inputs of size n / b plus f(n) work to split and combine. The answer then depends only on which is larger, the work piled up in the leaves (n raised to log base b of a) or the work at the root (f(n)), and comparing those two is exactly what the master theorem does for you.',
    visual: [
      {
        caption: 'Nesting multiplies: n outer rounds, n inner rounds each.',
        frame: [
          'for i in 1..4:',
          '    for j in 1..4:    -> 4 x 4 = 16 body runs',
          '',
          '    n      body runs',
          '    4            16',
          '   10           100',
          '  100        10,000',
        ].join('\n'),
      },
      {
        caption: 'An inner loop starting at i does half the work, same class.',
        frame: [
          'n = 5, inner j runs from i + 1 up to n - 1',
          'i = 0  ->  4 runs',
          'i = 1  ->  3 runs',
          'i = 2  ->  2 runs',
          'i = 3  ->  1 run',
          'total 10 = n(n-1)/2  ->  still O(n^2)',
        ].join('\n'),
      },
      {
        caption: 'Halving each round: the count is log2 n, not n.',
        frame: [
          'n = 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1',
          'round      1     2    3   4   5   6',
          '',
          'log2 64 = 6.  n = 10^6 needs only 20 rounds.',
        ].join('\n'),
      },
      {
        caption: 'Merge sort tree: log n levels, n units of work on each.',
        frame: [
          'level 0   [    n    ]              work n',
          'level 1   [n/2][n/2]               work n',
          'level 2   [n/4][n/4][n/4][n/4]     work n',
          '  ...     log2 n levels in total',
          'n per level x log2 n levels = n log n',
        ].join('\n'),
      },
      {
        caption: 'fib(5) tree: the same values are computed again and again.',
        frame: [
          '            f(5)',
          '        f(4)     f(3)',
          '     f(3) f(2) f(2) f(1)',
          '   f(2) f(1)',
          'f(3) twice, f(2) three times: 15 calls for n = 5',
        ].join('\n'),
      },
      {
        caption: 'Master theorem: compare the leaf work with the root work.',
        frame: [
          'T(n) = a T(n/b) + f(n)',
          'leaf work L = n^(log_b a)',
          '',
          'f smaller than L  -> T = L          (case 1)',
          'f same size as L  -> T = L * log n  (case 2)',
          'f bigger than L   -> T = f(n)       (case 3)',
        ].join('\n'),
      },
    ],
    pseudocode: `function costOf(code):
    if code is several parts in sequence:
        return the slowest part          // adding, then dropping
    if code is a branch:
        return the more expensive arm
    if code is a loop:
        if the counter moves by a fixed step:
            rounds <- n / step           -> O(n)
        if the counter is multiplied or divided by 2:
            rounds <- log2 n             -> O(log n)
        return rounds * costOf(loop body)
    if code calls itself:
        a <- how many recursive calls one call makes
        b <- the factor the input is divided by, if divided
        f <- work in one call outside its recursive calls
        if the input is divided by b:
            solve T(n) = a T(n/b) + f(n) by master theorem
        else if the input only shrinks by subtraction:
            count levels directly: depth d, a^d calls
        return that total
    return O(1)`,
    complexity: [
      { label: 'T(n) = T(n/2) + O(1)', time: 'O(log n)', space: 'O(log n)', note: 'binary search, master case 2; O(1) space if written as a loop' },
      { label: 'T(n) = T(n-1) + O(1)', time: 'O(n)', space: 'O(n)', note: 'linear recursion; master theorem does not apply, count levels' },
      { label: 'T(n) = 2T(n/2) + O(n)', time: 'O(n log n)', space: 'O(n)', note: 'merge sort, master case 2; merge buffer plus O(log n) stack' },
      { label: 'T(n) = 2T(n/2) + O(n^2)', time: 'O(n^2)', space: 'O(log n)', note: 'master case 3, the top level swamps everything below' },
      { label: 'T(n) = T(n-1) + T(n-2) + O(1)', time: 'about O(1.618^n)', space: 'O(n)', note: 'naive Fibonacci; usually quoted loosely as O(2^n)' },
    ],
    dryRun: {
      input: 'n = 5, using the two-branch recursion fib(n) = fib(n-1) + fib(n-2)',
      goal: 'Count every call the recursion makes level by level, then count the loop version, so the exponential gap becomes a real number.',
      steps: [
        { state: 'level 0, calls so far = 1', action: 'fib(5) starts and splits into fib(4) and fib(3). Nothing is remembered between the two branches.' },
        { state: 'level 1, calls so far = 3', action: 'Two calls at this level: fib(4) and fib(3). Each of them will split again.' },
        { state: 'level 2, calls so far = 7', action: 'Four calls: fib(3), fib(2) from fib(4), and fib(2), fib(1) from fib(3). fib(3) is now being computed for the second time.' },
        { state: 'level 3, calls so far = 13', action: 'Six calls. Only fib(2) and above split further; fib(1) and fib(0) return at once.' },
        { state: 'level 4, calls so far = 15', action: 'The last remaining fib(2) splits into fib(1) and fib(0). The call tree is finished.' },
        { state: 'total calls = 15, answer = 5', action: 'fib(5) = 5. The call count 15 equals 2 * fib(6) - 1 = 2 * 8 - 1, so the counts follow the Fibonacci numbers themselves.' },
        { state: 'loop version, a = 0, b = 1, rounds = 5', action: 'Five rounds of a, b = b, a + b. After round k, a holds fib(k), so a ends at fib(5) = 5.' },
        { state: 'compare at n = 40', action: 'The recursion makes 2 * fib(41) - 1 = about 3.3 * 10^8 calls; the loop makes 40 additions.' },
      ],
      result:
        'Both give 5, and the loop is correct because the pair (a, b) always holds two consecutive Fibonacci numbers. The recursion needed 15 calls at n = 5 and about 3.3 * 10^8 at n = 40, because the call count grows like 1.618^n. The loop needs exactly n additions. That is the whole difference between exponential and linear.',
    },
    mistakes: [
      {
        mistake: 'Applying the master theorem to T(n) = T(n - 1) + O(1).',
        why: 'The theorem covers recurrences where the input is divided by a constant b greater than 1. Subtracting 1 is not dividing, so a and b are not defined here.',
        fix: 'For subtract-and-conquer, count levels directly: depth n, O(1) work per level, so O(n).',
      },
      {
        mistake: 'Using master case 3 without checking the regularity condition.',
        why: 'Case 3 needs f(n) to be polynomially bigger than the leaf work and also needs a * f(n / b) <= c * f(n) for some c below 1. Skipping that check can give the wrong bound.',
        fix: 'Verify it once. For the usual polynomial f, such as 2 * f(n/2) = n^2 / 2 when f(n) = n^2, the condition holds with c = 1/2.',
      },
      {
        mistake: 'Slicing the list inside a recursive call, as in helper(arr[1:]).',
        why: 'Every call copies n - 1 items, so a recursion that should be O(n) becomes O(n^2) time and O(n^2) space.',
        fix: 'Pass indices such as (arr, lo, hi) instead of building new lists.',
      },
      {
        mistake: 'Calling a triangular nested loop O(n) because the inner loop is shorter.',
        why: 'An inner loop from i to n runs n(n-1)/2 times in total. Half of n^2 is still n^2.',
        fix: 'Add up the inner counts before naming the class: 1 + 2 + ... + n is about n^2 / 2.',
      },
      {
        mistake: 'Quoting the loop and forgetting the body.',
        why: 'A loop over n that does a binary search or a heap push each round is O(n log n), not O(n). The log hides inside the body.',
        fix: 'Always say it as rounds times body cost: "n rounds, each O(log n), so O(n log n)".',
      },
    ],
    whenToUse: [
      'You are looking at code and need to name its complexity out loud, line by line.',
      'The solution is recursive and the interviewer asks how many calls it makes.',
      'A divide-and-conquer solution splits into a equal parts and you want the closed form quickly.',
      'You are asked "what happens at n = 50?" about a recursion with two branches.',
      'You want to prove that adding memoisation actually changes the class, not just the constant.',
    ],
    whenNotToUse: [
      'The recurrence subtracts instead of dividing, like T(n) = T(n - 1) + n; the master theorem does not apply, expand the sum or draw the tree instead.',
      'The subproblems are unequal, like worst-case quicksort T(n) = T(n - 1) + O(n); use a recursion tree or the substitution method.',
      'The work per level is not polynomially comparable, like T(n) = 2T(n/2) + n / log n; that sits in the gap between cases 1 and 2, so use Akra-Bazzi or a tree.',
      'The recursion memoises; count distinct states times work per state instead of the branching factor.',
      'The structure is amortised, like dynamic array growth or union-find; measure total work over a whole sequence of operations, not per call.',
    ],
    relatedTopics: [
      { id: 'common-complexities', kind: 'concept', why: 'It names the rung that the analysis here lands on.' },
      { id: 'merge-sort', kind: 'concept', why: 'The textbook case-2 recurrence T(n) = 2T(n/2) + O(n) in working code.' },
      { id: 'recursion-basics', kind: 'concept', why: 'It builds the call trees whose shape this analysis counts.' },
      { id: 'dp-intro-memo-and-tabulation', kind: 'concept', why: 'The standard fix for exponential recursion: count distinct states instead of calls.' },
      { id: 'divide-and-conquer', kind: 'pattern', why: 'The pattern that produces the recurrences the master theorem is built for.' },
    ],
    quiz: [
      {
        question: 'What does the master theorem give for T(n) = 2T(n/2) + O(n), the merge sort recurrence?',
        options: [
          'O(n)',
          'O(n log n), because the leaf work n^(log2 2) = n matches f(n) = n, which is case 2',
          'O(n^2)',
          'O(log n)',
        ],
        answerIndex: 1,
        explanation: 'With a = 2 and b = 2 the leaf work is n^1 = n, the same size as f(n) = n, so case 2 multiplies it by an extra log n.',
      },
      {
        question: 'A loop runs n times, and each round performs a binary search over the same n items. What is the time complexity?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n^2)'],
        answerIndex: 2,
        explanation: 'Nested work multiplies: n rounds times O(log n) per round. Forgetting the body cost is the usual error here.',
      },
      {
        question: 'Someone applies the master theorem to T(n) = T(n - 1) + O(1). Is that valid?',
        options: [
          'Yes, with a = 1 and b = 1',
          'No: the theorem needs the input divided by a constant b greater than 1. Expand the recurrence directly and you get O(n)',
          'Yes, and it gives O(log n)',
          'No, but Akra-Bazzi gives O(2^n)',
        ],
        answerIndex: 1,
        explanation: 'Setting b = 1 makes log base b undefined, so the theorem simply does not cover subtract-and-conquer. Unrolling gives n levels of O(1) work.',
      },
      {
        question: 'An inner loop runs from i + 1 to n inside an outer loop over n. How many times does the body run in total?',
        options: ['about n, so O(n)', 'about n^2 / 2, so O(n^2)', 'about n log n', 'exactly n^2'],
        answerIndex: 1,
        explanation: 'The counts are (n-1) + (n-2) + ... + 1 = n(n-1)/2. Halving a quadratic leaves it quadratic.',
      },
      {
        question: 'Which master theorem case applies to T(n) = 7T(n/2) + O(n^2), the Strassen matrix multiplication recurrence?',
        options: [
          'Case 1: the leaf work n^(log2 7) is about n^2.81, which beats n^2, so T(n) = O(n^2.81)',
          'Case 2: T(n) = O(n^2 log n)',
          'Case 3: T(n) = O(n^2)',
          'The theorem does not apply here',
        ],
        answerIndex: 0,
        explanation: 'log base 2 of 7 is about 2.807, so the leaf work n^2.807 is polynomially larger than f(n) = n^2. The leaves dominate, which is case 1.',
      },
    ],
    sources: [
      'CLRS ch. 4 (divide-and-conquer, recursion trees and the master theorem)',
      'CLRS ch. 3 (asymptotic notation)',
      'MIT 6.006 lectures on recurrences and divide and conquer',
      'CP-Algorithms: Binary Exponentiation',
      'CP-Algorithms: Fibonacci Numbers',
    ],
    patternIds: ['brute-force', 'recursion'],
    problems: [
      {
        id: 'fibonacci-number',
        title: 'Fibonacci Number',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/fibonacci-number/',
        patternId: 'recursion',
        hint: 'Write the two-branch recursion, count its calls for n = 30, then replace it with a loop over two variables.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        patternId: 'dp-1d',
        hint: 'Ways to reach step n = ways to reach n - 1 plus ways to reach n - 2; it is Fibonacci in disguise.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'pascals-triangle',
        title: "Pascal's Triangle",
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/pascals-triangle/',
        patternId: 'brute-force',
        hint: 'Row i has i + 1 entries, so building all rows is a nested loop; add up 1 + 2 + ... + n to name the Big-O.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'powx-n',
        title: 'Pow(x, n)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/powx-n/',
        patternId: 'divide-and-conquer',
        hint: 'x^n is (x^(n/2))^2, so one recursive call on half the exponent gives O(log n) instead of n multiplications.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'k-th-symbol-in-grammar',
        title: 'K-th Symbol in Grammar',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-th-symbol-in-grammar/',
        patternId: 'recursion',
        hint: 'Building row n costs O(2^n); instead relate position k in row n to its parent in row n - 1 with one call.',
        xp: 40,
        tier: 'advanced',
      },
    ],
  },
]
