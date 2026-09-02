import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'arrays-basics',
    gateId: 'arrays-strings',
    order: 1,
    title: 'Arrays Basics: What Is Cheap and What Is Not',
    minutes: 25,
    summary: 'An array is a row of boxes with numbered positions; reading by index is O(1), but inserting, deleting or shifting in the middle is O(n).',
    analogy:
      'An array is like a row of numbered parking spots. Finding spot 42 is instant because you know exactly where it is. But if a car in the middle leaves and you want no gaps, every car behind it has to move up one spot.',
    explanation: `Arrays are the most common input in interviews, so it pays to know exactly which operations are cheap and which are secretly expensive. Most array tricks in later concepts exist to avoid one specific expensive operation: shifting elements.

## The idea

- Elements sit next to each other in memory. Position i is found by simple arithmetic, so \`arr[i]\` is **O(1)**.
- Appending to the end is O(1) on average in Python, JavaScript and Java lists.
- Inserting or deleting at index i shifts everything after it: **O(n)**. \`arr.insert(0, x)\` and \`arr.pop(0)\` are both O(n).
- Searching for a value in an unsorted array is **O(n)**. There is no shortcut without extra structure.
- Slicing \`arr[a:b]\` copies b - a elements: O(b - a) time and space.

## A tiny example

Rotate an array to the right by k steps: \`[1, 2, 3, 4, 5]\` with k = 2 becomes \`[4, 5, 1, 2, 3]\`.

The slow way rotates by one step, k times:

\`\`\`python
def rotate(nums, k):
    for _ in range(k):
        last = nums.pop()      # O(1)
        nums.insert(0, last)   # O(n) shift every element
\`\`\`

Each insert at the front shifts n elements, and we do it k times: **O(n * k)**. With n = k = 10^5 that is 10^10 steps.

The fast way uses three reversals and never shifts anything:

\`\`\`python
def rotate(nums, k):
    n = len(nums)
    k %= n
    def rev(i, j):
        while i < j:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
            j -= 1
    rev(0, n - 1)      # [5, 4, 3, 2, 1]
    rev(0, k - 1)      # [4, 5, 3, 2, 1]
    rev(k, n - 1)      # [4, 5, 1, 2, 3]
\`\`\`

Each element is swapped a constant number of times: **O(n)** time, **O(1)** extra space.

## Step by step: thinking about an array problem

1. Ask what the cheap operations are: index read, index write, append, swap.
2. Ask what the expensive operations are: insert or delete in the middle, search, copy.
3. If your plan needs an expensive operation inside a loop, look for a way to swap or overwrite instead.
4. If you need to look up a value quickly, consider a set or map (hashing gate) or sorting first.

## Where people go wrong

- Deleting from a list while looping over it. It shifts elements and skips items. Build a new list or overwrite in place instead.
- Using \`arr.pop(0)\` as a queue. That is O(n) per pop. Use a deque.
- Forgetting that \`k\` might be larger than \`n\` in rotation problems. Always take \`k % n\`.
- Off-by-one on the last index. The last valid index is \`len(arr) - 1\`.

## How to recognise it in an interview

- "In-place" and "O(1) extra space" mean: overwrite and swap, do not build a new array.
- "Rotate", "shift", "remove all occurrences" are all about avoiding repeated O(n) shifts.
- A 2D grid is just an array of arrays. Row i, column j is \`grid[i][j]\`, and the same cost rules apply.`,
    naive: {
      title: 'Rotate one step at a time',
      description:
        'Pop the last element and push it at the front, k times. Each front insert shifts the whole array, so the work multiplies.',
      time: 'O(n * k)',
      space: 'O(1)',
      code: {
        python: `def rotate(nums, k):
    n = len(nums)
    k %= n
    for _ in range(k):
        last = nums.pop()
        nums.insert(0, last)

a = [1, 2, 3, 4, 5]
rotate(a, 2)
print(a)  # [4, 5, 1, 2, 3]`,
        javascript: `function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  for (let i = 0; i < k; i++) {
    const last = nums.pop();
    nums.unshift(last);
  }
}

const a = [1, 2, 3, 4, 5];
rotate(a, 2);
console.log(a); // [4, 5, 1, 2, 3]`,
        java: `import java.util.Arrays;

public class Solution {
  public static void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;
    for (int step = 0; step < k; step++) {
      int last = nums[n - 1];
      for (int i = n - 1; i > 0; i--) {
        nums[i] = nums[i - 1];
      }
      nums[0] = last;
    }
  }

  public static void main(String[] args) {
    int[] a = {1, 2, 3, 4, 5};
    rotate(a, 2);
    System.out.println(Arrays.toString(a)); // [4, 5, 1, 2, 3]
  }
}`,
        cpp: `#include <iostream>
#include <vector>

void rotate(std::vector<int>& nums, int k) {
  int n = nums.size();
  k %= n;
  for (int step = 0; step < k; step++) {
    int last = nums[n - 1];
    for (int i = n - 1; i > 0; i--) {
      nums[i] = nums[i - 1];
    }
    nums[0] = last;
  }
}

int main() {
  std::vector<int> a = {1, 2, 3, 4, 5};
  rotate(a, 2);
  for (int x : a) std::cout << x << ' '; // 4 5 1 2 3
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Three reversals, in place',
      description:
        'Reverse the whole array, then reverse the first k elements, then reverse the rest. Every element is swapped at most twice and nothing is shifted.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def rotate(nums, k):
    n = len(nums)
    k %= n

    def rev(i, j):
        while i < j:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
            j -= 1

    rev(0, n - 1)
    rev(0, k - 1)
    rev(k, n - 1)

a = [1, 2, 3, 4, 5]
rotate(a, 2)
print(a)  # [4, 5, 1, 2, 3]`,
        javascript: `function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  const rev = (i, j) => {
    while (i < j) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
      j--;
    }
  };
  rev(0, n - 1);
  rev(0, k - 1);
  rev(k, n - 1);
}

const a = [1, 2, 3, 4, 5];
rotate(a, 2);
console.log(a); // [4, 5, 1, 2, 3]`,
        java: `import java.util.Arrays;

public class Solution {
  private static void rev(int[] a, int i, int j) {
    while (i < j) {
      int t = a[i]; a[i] = a[j]; a[j] = t;
      i++; j--;
    }
  }

  public static void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;
    rev(nums, 0, n - 1);
    rev(nums, 0, k - 1);
    rev(nums, k, n - 1);
  }

  public static void main(String[] args) {
    int[] a = {1, 2, 3, 4, 5};
    rotate(a, 2);
    System.out.println(Arrays.toString(a)); // [4, 5, 1, 2, 3]
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

void rotate(std::vector<int>& nums, int k) {
  int n = nums.size();
  k %= n;
  std::reverse(nums.begin(), nums.end());
  std::reverse(nums.begin(), nums.begin() + k);
  std::reverse(nums.begin() + k, nums.end());
}

int main() {
  std::vector<int> a = {1, 2, 3, 4, 5};
  rotate(a, 2);
  for (int x : a) std::cout << x << ' '; // 4 5 1 2 3
  return 0;
}`,
      },
    },
    whyFaster:
      'Inserting at the front is an O(n) shift, and doing it k times gives O(n * k). Reversal only swaps pairs, and each element takes part in at most two swaps, so the total is O(n). We replaced a repeated expensive operation (shift) with a cheap one (swap).',
    keyPoints: [
      'Index read and write are O(1); insert or delete in the middle is O(n) because of shifting.',
      'Never insert or delete in the middle inside a loop; overwrite or swap instead.',
      'Slicing copies: arr[a:b] is O(b - a) time and space.',
      'Take k % n before rotating; k may be larger than the array.',
      'A 2D grid is an array of arrays with the same cost rules.',
    ],
    patternIds: ['brute-force', 'in-place-reversal', 'two-pointers'],
    problems: [
      {
        id: 'concatenation-of-array',
        title: 'Concatenation of Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/concatenation-of-array/',
        patternId: 'brute-force',
        hint: 'Create an array of size 2n and fill positions i and i + n with the same value.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'remove-duplicates-from-sorted-array',
        title: 'Remove Duplicates from Sorted Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
        patternId: 'two-pointers',
        hint: 'Keep a write index; only copy a value forward when it differs from the last written one.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'rotate-array',
        title: 'Rotate Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/rotate-array/',
        patternId: 'in-place-reversal',
        hint: 'Reverse everything, then reverse the first k, then reverse the rest.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'product-of-array-except-self',
        title: 'Product of Array Except Self',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/product-of-array-except-self/',
        patternId: 'prefix-sum',
        hint: 'Answer[i] is (product of everything left of i) times (product of everything right of i); build each side in one pass.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'spiral-matrix',
        title: 'Spiral Matrix',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/spiral-matrix/',
        patternId: 'brute-force',
        hint: 'Keep four boundaries (top, bottom, left, right) and shrink one after each side is walked.',
        xp: 40,
        tier: 'advanced',
      },
    ],
    definition:
      'An array is a row of equally sized slots laid out in one continuous block of memory, where slot i is reached by arithmetic on the starting address instead of by walking. Reading or writing a slot is constant time; changing the length anywhere but the end is not.',
    coreIdea:
      'Because the slots sit next to each other, the machine can jump straight to any index in one step, no matter how long the array is. That same tight packing is what makes inserting or deleting in the middle expensive: every later element has to physically move one slot. So almost every array trick you will learn is the same move, replace shifting with swapping or overwriting, which turns O(n) work per operation into O(1).',
    visual: [
      {
        caption: 'Rotate [1, 2, 3, 4, 5] right by k = 2. Start state.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ]',
          '      ^i                  ^j',
          'plan: reverse all, then the first 2, then the rest',
        ].join('\n'),
      },
      {
        caption: 'Step 1: reverse the whole array. Two swaps, nothing shifted.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 5 ][ 4 ][ 3 ][ 2 ][ 1 ]',
          '      ^    ^',
          'next: reverse indexes 0..1 (the k = 2 block)',
        ].join('\n'),
      },
      {
        caption: 'Step 2: reverse the first k = 2 slots to put them back in order.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 4 ][ 5 ][ 3 ][ 2 ][ 1 ]',
          '                ^         ^',
          'next: reverse indexes 2..4 (the remaining block)',
        ].join('\n'),
      },
      {
        caption: 'Step 3: reverse the rest. Done, and every element moved at most twice.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 4 ][ 5 ][ 1 ][ 2 ][ 3 ]',
          '',
          '4 swaps for 5 elements  ->  O(n), O(1) space',
        ].join('\n'),
      },
      {
        caption: 'Compare with the shifting version: one front insert moves everything.',
        frame: [
          'insert(0, 9) into [ 1 ][ 2 ][ 3 ][ 4 ]',
          '',
          'before [ 1 ][ 2 ][ 3 ][ 4 ][   ]',
          '         \\    \\    \\    \\   each steps right',
          'after  [ 9 ][ 1 ][ 2 ][ 3 ][ 4 ]',
          '4 moves for 1 insert  ->  O(n) every time',
        ].join('\n'),
      },
    ],
    pseudocode: `function rotateRight(A, k):
    n = length(A)
    k = k mod n            // k may be bigger than n
    if k = 0:
        return             // nothing to do

    reverse(A, 0, n - 1)   // whole array
    reverse(A, 0, k - 1)   // first k slots
    reverse(A, k, n - 1)   // the rest

function reverse(A, i, j):
    while i < j:
        swap A[i] and A[j]
        i = i + 1
        j = j - 1`,
    complexity: [
      { label: 'Read or write A[i]', time: 'O(1)', space: 'O(1)', note: 'address arithmetic, no scan' },
      { label: 'Append at the end', time: 'O(1) amortised', space: 'O(1)', note: 'a dynamic array occasionally doubles, so one append can cost O(n)' },
      { label: 'Insert or delete at index i', time: 'O(n)', space: 'O(1)', note: 'every element after i shifts one slot' },
      { label: 'Search an unsorted array', time: 'O(n)', space: 'O(1)', note: 'no order to exploit; sort or hash first if you ask often' },
      { label: 'Slice A[a:b]', time: 'O(b - a)', space: 'O(b - a)', note: 'a slice is a copy, not a view' },
    ],
    dryRun: {
      input: 'nums = [1, 2, 3, 4, 5], k = 2',
      goal: 'Rotate the array right by two places using only swaps, never shifting.',
      steps: [
        { state: 'nums=[1,2,3,4,5] n=5 k=2', action: 'k mod n is still 2 and it is not zero, so there is real work to do.' },
        { state: 'rev(0, 4): i=0 j=4', action: 'Swap 1 and 5 giving [5,2,3,4,1]; i becomes 1 and j becomes 3.' },
        { state: 'rev(0, 4): i=1 j=3', action: 'Swap 2 and 4 giving [5,4,3,2,1]; i becomes 2 and j becomes 2, so the loop stops.' },
        { state: 'nums=[5,4,3,2,1] rev(0, 1): i=0 j=1', action: 'Swap 5 and 4 giving [4,5,3,2,1]; the first two slots now hold the last two originals in the right order.' },
        { state: 'nums=[4,5,3,2,1] rev(2, 4): i=2 j=4', action: 'Swap 3 and 1 giving [4,5,1,2,3]; i becomes 3 and j becomes 3, so the loop stops.' },
        { state: 'nums=[4,5,1,2,3]', action: 'All three reversals are finished, so the function returns.' },
      ],
      result:
        'nums = [4, 5, 1, 2, 3]. Check it by hand: the last two originals, 4 and 5, moved to the front and 1, 2, 3 followed in their old order, which is exactly a right rotation by 2. Four swaps for five elements, so O(n) time and O(1) extra space.',
    },
    mistakes: [
      {
        mistake: 'Deleting from a list while looping over it, for example "for x in arr: if x == 0: arr.remove(x)".',
        why: 'remove shifts every later element left while the loop counter still moves forward, so the item right after a deleted one is skipped. It is also O(n) per removal, making the whole loop O(n^2).',
        fix: 'Build a new list with a comprehension, or keep a write index and overwrite in place, then trim the tail. Both are one pass, O(n).',
      },
      {
        mistake: 'Using arr.pop(0) as if it were a queue.',
        why: 'Popping the front shifts all remaining elements one slot left, so n pops cost about n^2 / 2 moves. On 10^5 items that is billions of operations.',
        fix: 'Use collections.deque and popleft(), which is O(1) at both ends.',
      },
      {
        mistake: 'Forgetting k = k mod n in a rotation problem.',
        why: 'With n = 5 and k = 7 you reverse a block that runs past the end, or with k = 5 you reverse an empty prefix and return the wrong array. Test cases love k > n.',
        fix: 'Reduce k modulo n first and return early when the result is 0.',
      },
      {
        mistake: 'Writing b = a to "copy" a list and then editing b.',
        why: 'In Python that binds a second name to the same list object, so every change also shows up in a. Interviewers use this to check whether you know reference semantics.',
        fix: 'Use b = a[:] or list(a) for a real copy (O(n) time and space), and copy.deepcopy for nested lists.',
      },
      {
        mistake: 'Treating arr[i:j] as free because it looks like one expression.',
        why: 'Slicing copies j - i elements, so a slice inside an O(n) loop quietly makes the whole function O(n^2) in time and memory.',
        fix: 'Pass indexes instead of slices, and slice at most once outside the loop.',
      },
    ],
    whenToUse: [
      'The problem hands you a list and asks for an answer "in place" with O(1) extra space.',
      'You need random access by position: the k-th element, the element at index i.',
      'Items are only ever added or removed at the end.',
      'The data is a fixed grid or matrix where grid[i][j] is a single step.',
      'You will scan front to back many times but never change the length.',
    ],
    whenNotToUse: [
      'You add or remove at the front repeatedly, use collections.deque for O(1) at both ends.',
      'You keep asking "is this value present?", use a set or dict for O(1) lookups.',
      'You repeatedly need the smallest or largest item, use a heap.',
      'The keys are strings or sparse ids rather than 0..n-1 positions, use a hash map.',
      'You need sorted order maintained under insertions, use a balanced tree or a sorted container, not an array you re-sort.',
    ],
    relatedTopics: [
      { id: 'strings-basics', kind: 'concept', why: 'A string is an array of characters, so every cost rule here applies to strings too.' },
      { id: 'two-pointers', kind: 'concept', why: 'Two pointers is the standard way to rewrite an array in place without ever shifting.' },
      { id: 'in-place-reversal', kind: 'pattern', why: 'The three-reversal rotation trick is this pattern applied to a plain array.' },
      { id: 'hash-map-basics', kind: 'concept', why: 'When lookup by value matters more than lookup by position, a hash map replaces the array scan.' },
    ],
    quiz: [
      {
        question: 'You call nums.insert(0, x) inside a loop that runs n times on a list that grows to size n. What is the total time?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1) amortised, so O(n) overall'],
        answerIndex: 2,
        explanation: 'Each front insert shifts every element already present, so the moves add up to 1 + 2 + ... + n, which is O(n^2).',
      },
      {
        question: 'Which of these list operations is NOT O(1)?',
        options: ['nums[5]', 'nums.append(9)', 'nums.pop()', 'nums.pop(0)'],
        answerIndex: 3,
        explanation: 'pop(0) removes from the front, so every remaining element shifts one slot left: O(n). The other three touch only one index or the end.',
      },
      {
        question: 'You must remove every zero from a list of 100000 numbers in place and stay O(n). Which plan works?',
        options: [
          'Loop over the list and call remove(0) each time you see a zero',
          'Keep a write index, copy each non-zero forward, then cut the tail',
          'Sort the list so the zeros gather at one end, then slice',
          'Build the answer with insert(0, x) for each non-zero value',
        ],
        answerIndex: 1,
        explanation: 'The write-pointer scan touches each element once. remove and insert(0, ...) both shift the array, and sorting costs O(n log n) and destroys the original order.',
      },
      {
        question: 'What does b = a[:] cost when a holds 1000 numbers?',
        options: [
          'O(1) time and O(1) space, it is just another name for a',
          'O(n) time and O(n) space, it copies every element into a new list',
          'O(n) time but O(1) space, because it reuses the same memory',
          'O(log n) time',
        ],
        answerIndex: 1,
        explanation: 'A slice builds a new list and copies each selected element, so both time and memory grow with the number of elements copied.',
      },
    ],
    sources: [
      'MIT 6.006 Introduction to Algorithms: sequence interfaces, static and dynamic arrays',
      'CLRS ch. 10 (elementary data structures)',
      'Python Wiki: TimeComplexity for list operations',
      'USACO Guide: Introduction to Data Structures',
      'LeetCode editorial: Rotate Array',
    ],
  },
  {
    id: 'strings-basics',
    gateId: 'arrays-strings',
    order: 2,
    title: 'Strings Basics: Immutable Arrays of Characters',
    minutes: 25,
    summary: 'A string behaves like an array of characters that you cannot change, so building, comparing and counting characters has costs you need to know.',
    analogy:
      'A string is like a word carved into stone. You can read any letter instantly, but to change one letter you must carve a whole new stone. If you carve a new stone for every letter you add, you spend most of your day carving.',
    explanation: `Strings show up in a huge share of interview questions: anagrams, palindromes, substrings, parsing. Under the hood a string is an array of characters, so everything from the arrays concept still applies. The one big difference is that in Python, Java and JavaScript strings are **immutable**: you cannot change a character in place.

## The idea

- \`s[i]\` is O(1). \`len(s)\` is O(1).
- \`s + t\` creates a brand new string of length len(s) + len(t). Doing that inside a loop n times can cost **O(n^2)** total.
- Build strings with a list and \`''.join(parts)\` in Python, an array and \`join\` in JavaScript, or \`StringBuilder\` in Java. That keeps building at O(n).
- Comparing two strings is O(min(len)). Checking \`sub in s\` is O(n * m) in the worst case.
- Counting characters is the most useful string trick. For lowercase letters an array of 26 counts is O(1) space.

## A tiny example

Are "listen" and "silent" anagrams (same letters, any order)?

The slow way sorts both strings and compares:

\`\`\`python
def is_anagram(s, t):
    return sorted(s) == sorted(t)
\`\`\`

Sorting is **O(n log n)**. It works, and it is a fine first answer.

The fast way counts letters:

\`\`\`python
def is_anagram(s, t):
    if len(s) != len(t):
        return False
    counts = [0] * 26
    for ch in s:
        counts[ord(ch) - ord('a')] += 1
    for ch in t:
        counts[ord(ch) - ord('a')] -= 1
    return all(c == 0 for c in counts)
\`\`\`

Two passes over the strings: **O(n)** time, O(1) space because 26 never changes.

## Step by step: common string tasks

1. **Reverse**: convert to a list of characters, use two pointers to swap, join back.
2. **Count**: dictionary or a 26-size array. Use \`ord(ch) - ord('a')\` to map a letter to an index.
3. **Build**: collect pieces in a list, join once at the end.
4. **Compare ignoring case or punctuation**: normalise first (lowercase, filter), then compare.
5. **Substring search**: for interviews, a nested loop over positions is acceptable unless they ask for KMP.

## Where people go wrong

- \`result += ch\` inside a long loop. In the worst case it copies the string every time, giving O(n^2).
- Forgetting that \`s.split()\` and \`s.strip()\` create new strings and cost O(n).
- Treating uppercase and lowercase as equal without converting.
- Using \`s[::-1]\` and calling it O(1). It copies the whole string: O(n) time and space.

## How to recognise it in an interview

- "Anagram", "same characters" or "permutation of" means count characters.
- "Palindrome" means two pointers from both ends.
- "Group by" means use a canonical key such as the sorted string or the count tuple in a hash map.
- "Build the output string" means collect parts and join once.`,
    naive: {
      title: 'Sort both strings and compare',
      description:
        'If two strings contain the same letters, their sorted versions are identical. Simple and correct, but sorting costs more than a linear pass.',
      time: 'O(n log n)',
      space: 'O(n)',
      code: {
        python: `def is_anagram(s, t):
    return sorted(s) == sorted(t)

print(is_anagram("listen", "silent"))  # True`,
        javascript: `function isAnagram(s, t) {
  const a = s.split('').sort().join('');
  const b = t.split('').sort().join('');
  return a === b;
}

console.log(isAnagram('listen', 'silent')); // true`,
        java: `import java.util.Arrays;

public class Solution {
  public static boolean isAnagram(String s, String t) {
    char[] a = s.toCharArray();
    char[] b = t.toCharArray();
    Arrays.sort(a);
    Arrays.sort(b);
    return Arrays.equals(a, b);
  }

  public static void main(String[] args) {
    System.out.println(isAnagram("listen", "silent")); // true
  }
}`,
        cpp: `#include <iostream>
#include <string>
#include <algorithm>

bool isAnagram(std::string s, std::string t) {
  std::sort(s.begin(), s.end());
  std::sort(t.begin(), t.end());
  return s == t;
}

int main() {
  std::cout << isAnagram("listen", "silent") << std::endl; // 1
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Count letters with a 26-slot array',
      description:
        'Add one for every letter in s and subtract one for every letter in t. If every count ends at zero the strings are anagrams. One pass, fixed memory.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def is_anagram(s, t):
    if len(s) != len(t):
        return False
    counts = [0] * 26
    for ch in s:
        counts[ord(ch) - ord('a')] += 1
    for ch in t:
        counts[ord(ch) - ord('a')] -= 1
    return all(c == 0 for c in counts)

print(is_anagram("listen", "silent"))  # True`,
        javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Array(26).fill(0);
  for (const ch of s) counts[ch.charCodeAt(0) - 97]++;
  for (const ch of t) counts[ch.charCodeAt(0) - 97]--;
  return counts.every((c) => c === 0);
}

console.log(isAnagram('listen', 'silent')); // true`,
        java: `public class Solution {
  public static boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] counts = new int[26];
    for (char ch : s.toCharArray()) counts[ch - 'a']++;
    for (char ch : t.toCharArray()) counts[ch - 'a']--;
    for (int c : counts) {
      if (c != 0) return false;
    }
    return true;
  }

  public static void main(String[] args) {
    System.out.println(isAnagram("listen", "silent")); // true
  }
}`,
        cpp: `#include <iostream>
#include <string>

bool isAnagram(const std::string& s, const std::string& t) {
  if (s.size() != t.size()) return false;
  int counts[26] = {0};
  for (char ch : s) counts[ch - 'a']++;
  for (char ch : t) counts[ch - 'a']--;
  for (int c : counts) {
    if (c != 0) return false;
  }
  return true;
}

int main() {
  std::cout << isAnagram("listen", "silent") << std::endl; // 1
  return 0;
}`,
      },
    },
    whyFaster:
      'Sorting rearranges n characters and costs O(n log n). Counting only needs to look at each character once and bump a counter, which is O(n). The counts array has 26 slots no matter how long the strings are, so space drops from O(n) to O(1).',
    keyPoints: [
      'Strings are immutable in Python, Java and JavaScript; every edit creates a new string.',
      'Never build a long string with += in a loop; collect parts and join once.',
      'Character counting with a 26-size array (or a dict) is O(n) time and the go-to trick for anagram problems.',
      'Map a lowercase letter to an index with ord(ch) - ord("a").',
      'Reversal, slicing and split all cost O(n) and allocate memory.',
    ],
    patternIds: ['hash-map', 'two-pointers', 'brute-force'],
    problems: [
      {
        id: 'longest-common-prefix',
        title: 'Longest Common Prefix',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/longest-common-prefix/',
        patternId: 'brute-force',
        hint: 'Compare character position i across all words; stop at the first mismatch or the shortest word.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-anagram/',
        patternId: 'hash-map',
        hint: 'Count letters of one string up and the other down; every count must end at zero.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'first-unique-character-in-a-string',
        title: 'First Unique Character in a String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/first-unique-character-in-a-string/',
        patternId: 'hash-map',
        hint: 'One pass to count every letter, a second pass to find the first letter whose count is 1.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'find-the-index-of-the-first-occurrence-in-a-string',
        title: 'Find the Index of the First Occurrence in a String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
        patternId: 'brute-force',
        hint: 'Try every start position and compare the needle character by character; note the O(n * m) cost.',
        xp: 20,
        tier: 'intermediate',
      },
      {
        id: 'string-compression',
        title: 'String Compression',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/string-compression/',
        patternId: 'two-pointers',
        hint: 'Use a read pointer to measure each run and a write pointer to overwrite the array in place.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/group-anagrams/',
        patternId: 'hash-map',
        hint: 'Anagrams share the same sorted string or the same 26-count signature; use that as the map key.',
        xp: 40,
        tier: 'advanced',
      },
    ],
    definition:
      'A string is a sequence of characters stored like an array, so reading position i is one step. In Python, Java and JavaScript it is also immutable: any edit builds a brand new string rather than changing the old one.',
    coreIdea:
      'Because a string cannot be changed in place, every + copies both sides into fresh memory. Doing that inside a loop copies a longer and longer result each time, so n small appends copy about 1 + 2 + ... + n characters, which is O(n^2). Collecting the pieces in a list and calling join once copies every character exactly once, so the same job becomes O(n). The other big lever is counting: a fixed 26-slot table answers most "same letters" questions in a single pass.',
    visual: [
      {
        caption: 'Are "listen" and "silent" anagrams? Same length, so counting is worth it.',
        frame: [
          'idx   0    1    2    3    4    5',
          's   [ l ][ i ][ s ][ t ][ e ][ n ]',
          't   [ s ][ i ][ l ][ e ][ n ][ t ]',
          'lengths match (6 = 6), keep going',
        ].join('\n'),
      },
      {
        caption: 'Walk s and add one to the slot of each letter.',
        frame: [
          'after scanning s = listen',
          '',
          'letter :  e   i   l   n   s   t',
          'count  :  1   1   1   1   1   1',
          '(the other 20 slots are still 0)',
        ].join('\n'),
      },
      {
        caption: 'Walk t and subtract one. Every slot lands back on zero.',
        frame: [
          'after scanning t = silent',
          '',
          'letter :  e   i   l   n   s   t',
          'count  :  0   0   0   0   0   0',
          'all zero  ->  anagrams. O(n) time, O(1) space',
        ].join('\n'),
      },
      {
        caption: 'The building trap: += copies the whole result every single time.',
        frame: [
          'out = ""            characters copied: 0',
          'out = out + "a"  -> "a"        copied: 1',
          'out = out + "b"  -> "ab"       copied: 2',
          'out = out + "c"  -> "abc"      copied: 3',
          '',
          'n pieces  ->  1+2+...+n copies  ->  O(n^2)',
        ].join('\n'),
      },
      {
        caption: 'The fix: append to a list (cheap), then join once.',
        frame: [
          'parts = [ a ][ b ][ c ]   append is O(1) each',
          '',
          'join(parts) walks the list once and copies',
          'every character exactly one time',
          '',
          'total  ->  O(n)',
        ].join('\n'),
      },
    ],
    pseudocode: `function isAnagram(s, t):
    if length(s) != length(t):
        return false

    counts = array of 26 zeros
    for each character c in s:
        counts[slot of c] = counts[slot of c] + 1
    for each character c in t:
        counts[slot of c] = counts[slot of c] - 1
        if counts[slot of c] < 0:
            return false       // t has a letter s lacks
    return true

// build a long string without the quadratic trap
function buildString(pieces):
    parts = empty list
    for each p in pieces:
        append p to parts      // O(1), no copying
    return join(parts, "")     // one pass over the total`,
    complexity: [
      { label: 'Read s[i] or length(s)', time: 'O(1)', space: 'O(1)', note: 'stored like an array' },
      { label: 'Concatenate s + t', time: 'O(len s + len t)', space: 'O(len s + len t)', note: 'builds a whole new string' },
      { label: 'Build with += in a loop, n pieces', time: 'O(n^2)', space: 'O(n)', note: 'each step copies the result so far; CPython sometimes optimises this away, never rely on it' },
      { label: 'Build with join, n pieces', time: 'O(n)', space: 'O(n)', note: 'each character copied once' },
      { label: 'Count characters / anagram check', time: 'O(n)', space: 'O(1)', note: '26 slots, fixed lowercase alphabet' },
    ],
    dryRun: {
      input: 's = "listen", t = "silent"',
      goal: 'Decide whether the two strings use exactly the same letters the same number of times.',
      steps: [
        { state: 'len(s)=6 len(t)=6', action: 'The lengths match, so we do not return False early. Different lengths would be an instant no.' },
        { state: 'counts = 26 zeros', action: 'Make one slot per lowercase letter. This table never grows with the input, which is why space is O(1).' },
        { state: 'reading s: l, i, s', action: 'counts[l] = 1, counts[i] = 1, counts[s] = 1 after the first three characters.' },
        { state: 'reading s: t, e, n', action: 'counts[t] = 1, counts[e] = 1, counts[n] = 1. The first loop is done and s is fully counted.' },
        { state: 'counts: e=1 i=1 l=1 n=1 s=1 t=1', action: 'Now walk t and subtract one for every letter we meet.' },
        { state: 'reading t: s, i, l', action: 'counts[s] = 0, counts[i] = 0, counts[l] = 0. Nothing has gone negative, so t has used no letter twice.' },
        { state: 'reading t: e, n, t', action: 'counts[e] = 0, counts[n] = 0, counts[t] = 0. The second loop is done.' },
        { state: 'counts = 26 zeros', action: 'all(c == 0) is true, so the function returns True.' },
      ],
      result:
        'True. Every letter added while reading "listen" was removed again while reading "silent", so the two strings hold the same multiset of characters. Two passes over 6 characters plus one pass over 26 fixed slots: O(n) time and O(1) space, against O(n log n) for the sorting version.',
    },
    mistakes: [
      {
        mistake: 'Writing out += ch inside a loop over a long string.',
        why: 'Each += builds a new string and copies everything written so far, so n appends copy roughly n^2 / 2 characters. CPython has an in-place trick that sometimes hides this, but it only fires when nothing else refers to the string and it does not exist in every runtime, so the guaranteed cost is quadratic.',
        fix: 'Append the pieces to a list and call "".join(parts) once at the end. That is O(n) and always safe.',
      },
      {
        mistake: 'Assuming s[::-1] or s[a:b] is free because it is one short expression.',
        why: 'Slicing copies the characters it selects, so it costs O(b - a) in both time and memory. A slice inside a loop turns an O(n) scan into O(n^2).',
        fix: 'Compare using indexes or two pointers, and slice at most once, outside the loop.',
      },
      {
        mistake: 'Using counts[ord(ch) - ord("a")] on input that is not plain lowercase.',
        why: 'An uppercase letter, a space or a digit produces an index outside 0..25. Python wraps negative indexes silently, so you update the wrong slot and get a wrong answer with no error at all.',
        fix: 'Normalise first with lower() and a filter, or use a dict (or collections.Counter) when the alphabet is not known in advance.',
      },
      {
        mistake: 'Comparing strings with "is" instead of "==".',
        why: '"is" asks whether the two names point at the same object. Short literals are often interned so it appears to work in testing, then fails on strings built at runtime.',
        fix: 'Always compare string values with ==. Reserve "is" for None and other singletons.',
      },
      {
        mistake: 'Calling sorted(s) == sorted(t) an O(n) solution.',
        why: 'Sorting is O(n log n) and allocates two lists of n characters, so it is neither the fastest nor the smallest answer. Interviewers ask for the cost out loud.',
        fix: 'It is a fine first answer, but say "this is O(n log n)" and then offer the O(n) counting version.',
      },
    ],
    whenToUse: [
      'The question mentions anagrams, permutations or "the same characters" - count with a fixed-size table.',
      'You must check a palindrome or compare characters from both ends.',
      'You have to build one output string out of many small pieces.',
      'You are grouping words by a canonical key such as the sorted string or the 26-count signature.',
      'The alphabet is small and fixed: lowercase letters, digits, DNA bases.',
    ],
    whenNotToUse: [
      'You need to edit characters repeatedly, convert to a list of characters first and join once at the end.',
      'You must find a pattern inside a very long text under tight limits, use KMP or Rabin-Karp instead of a nested loop.',
      'You need prefix lookups across many words, use a trie.',
      'The alphabet is large or unknown (full unicode), use a dict or Counter rather than a 26-slot array.',
      'The problem is about non-contiguous subsequences of characters, that is string dynamic programming, not scanning.',
    ],
    relatedTopics: [
      { id: 'arrays-basics', kind: 'concept', why: 'A string is an array of characters, so the same index and copy costs apply.' },
      { id: 'hash-map', kind: 'pattern', why: 'Character counting is a hash map with a tiny, fixed key space.' },
      { id: 'sliding-window', kind: 'concept', why: 'Most substring questions are a moving window over a string plus a count map.' },
      { id: 'tries', kind: 'concept', why: 'When many words share prefixes, a trie beats repeated string comparison.' },
    ],
    quiz: [
      {
        question: 'You build a 100000-character string with result += ch inside a loop. What is the guaranteed worst-case cost?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1) per step, so O(n) overall'],
        answerIndex: 2,
        explanation: 'Each += copies the whole result built so far, so the copies add up to about n^2 / 2 characters. Collecting pieces in a list and calling join once gives O(n).',
      },
      {
        question: 'What does s[1:4] cost on a string of length n?',
        options: [
          'O(1) time and space, it is a view into s',
          'Time and space proportional to the slice length, because it copies the selected characters',
          'O(n) time, because Python has to scan forward to reach index 1',
          'O(log n) time',
        ],
        answerIndex: 1,
        explanation: 'A Python slice builds a new string and copies exactly the characters it selects, so the cost tracks the slice length, not the whole string.',
      },
      {
        question: 'Two strings of length 100000 may contain any unicode symbol, and you must decide whether they are anagrams. Which plan is right?',
        options: [
          'A 26-slot int array indexed by ord(ch) - ord("a")',
          'A dict counting +1 for each character of s and -1 for each of t, then check every value is 0',
          'Sort both strings, there is no faster way',
          'Compare s[i] with t[i] at every index',
        ],
        answerIndex: 1,
        explanation: 'A 26-slot array only covers lowercase ASCII and silently breaks on anything else. A dict keeps the O(n) counting idea while handling an unknown alphabet.',
      },
      {
        question: 'Why is letter counting called O(1) space for lowercase words?',
        options: [
          'Because the counts table has 26 slots no matter how long the strings are',
          'Because Python stores small integers outside the heap',
          'Because strings are immutable, so nothing is allocated',
          'Because we reuse the input string as storage',
        ],
        answerIndex: 0,
        explanation: 'Extra space is measured by how it grows with the input. The table is a constant 26 slots, so it does not grow at all.',
      },
    ],
    sources: [
      'MIT 6.006 Introduction to Algorithms: strings, hashing and string matching',
      'CLRS ch. 32 (string matching)',
      'Python Wiki: TimeComplexity, and CPython notes on string concatenation',
      'CP-Algorithms: Prefix function (Knuth-Morris-Pratt)',
      'LeetCode editorials: Valid Anagram, Group Anagrams, String Compression',
    ],
  },
  {
    id: 'two-pointers',
    gateId: 'arrays-strings',
    order: 3,
    title: 'Two Pointers: Walk from Both Ends',
    minutes: 30,
    summary: 'Use two indexes that move toward each other or in the same direction to replace a nested loop with a single pass over sorted or structured data.',
    analogy:
      'Two people search a long bookshelf for two books whose prices add to exactly 100. One starts at the cheap end and one at the expensive end. If the pair is too cheap, the cheap-side person steps right; if too expensive, the other steps left. They meet in the middle after one walk instead of checking every pair.',
    explanation: `Two pointers is the first real "pattern" in this course. It turns many O(n^2) problems into O(n) by using structure in the data, usually that the array is sorted or that we are comparing from both ends. If you learn only one array technique, learn this one.

## The idea

- Keep two indexes, say \`left\` and \`right\`.
- Each step, look at the values at both pointers and move exactly one of them based on a rule.
- Because each pointer only moves in one direction, the total number of moves is at most n. That is why it is O(n).

There are two common shapes:

- **Opposite ends**: left starts at 0, right at n - 1, they move toward each other. Used for sorted pair sums, palindromes, container problems.
- **Same direction (slow and fast)**: both start near 0. The fast pointer reads, the slow pointer writes. Used for removing elements in place, moving zeroes, deduplication.

## A tiny example

Find two numbers in a **sorted** array that add up to a target. \`[1, 3, 4, 6, 9]\`, target 10.

The slow way checks every pair:

\`\`\`python
def two_sum_sorted(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
\`\`\`

Nested loop: **O(n^2)**.

The fast way walks from both ends:

\`\`\`python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        if s < target:
            left += 1     # need a bigger sum
        else:
            right -= 1    # need a smaller sum
\`\`\`

Trace: 1 + 9 = 10, found immediately. Try target 7: 1 + 9 too big, right moves; 1 + 6 = 7 found. Each step moves a pointer, at most n steps: **O(n)**, O(1) space.

## Step by step: applying the pattern

1. Check if the data is sorted or can be sorted (sorting costs O(n log n), still cheaper than n^2).
2. Decide the shape: opposite ends for pair or symmetry questions; slow and fast for in-place rewriting.
3. Write the rule for which pointer moves. The rule must guarantee you never skip the answer.
4. Stop when the pointers cross (opposite ends) or the fast pointer reaches the end (same direction).

## Where people go wrong

- Using opposite-end pointers on an unsorted array. The move rule only works when order carries meaning.
- Moving both pointers at once and skipping the answer. Move exactly one per step.
- Off-by-one on the stopping condition: usually \`while left < right\`.
- Forgetting to skip duplicates in problems like 3Sum that ask for unique triplets.

## How to recognise it in an interview

- The input is sorted, or the problem says you may sort it.
- You need a pair or triplet with a target sum or difference.
- The words "palindrome", "in-place", "remove", "move zeroes", "partition" appear.
- The problem compares elements from both ends, like heights of walls or containers.`,
    naive: {
      title: 'Check every pair',
      description:
        'For each element, scan all later elements for a partner. It ignores the fact that the array is sorted, so it does far more work than needed.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def two_sum_sorted(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

print(two_sum_sorted([1, 3, 4, 6, 9], 7))  # [0, 3]`,
        javascript: `function twoSumSorted(nums, target) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}

console.log(twoSumSorted([1, 3, 4, 6, 9], 7)); // [0, 3]`,
        java: `import java.util.Arrays;

public class Solution {
  public static int[] twoSumSorted(int[] nums, int target) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        if (nums[i] + nums[j] == target) return new int[]{i, j};
      }
    }
    return new int[]{};
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(twoSumSorted(new int[]{1, 3, 4, 6, 9}, 7))); // [0, 3]
  }
}`,
        cpp: `#include <iostream>
#include <vector>

std::vector<int> twoSumSorted(const std::vector<int>& nums, int target) {
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] == target) return {i, j};
    }
  }
  return {};
}

int main() {
  std::vector<int> r = twoSumSorted({1, 3, 4, 6, 9}, 7);
  std::cout << r[0] << ' ' << r[1] << std::endl; // 0 3
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Two pointers from both ends',
      description:
        'Start at the smallest and largest values. If the sum is too small move the left pointer right; if too big move the right pointer left. Sorted order guarantees you never miss the answer.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        if s < target:
            left += 1
        else:
            right -= 1
    return []

print(two_sum_sorted([1, 3, 4, 6, 9], 7))  # [0, 3]`,
        javascript: `function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const s = nums[left] + nums[right];
    if (s === target) return [left, right];
    if (s < target) left++;
    else right--;
  }
  return [];
}

console.log(twoSumSorted([1, 3, 4, 6, 9], 7)); // [0, 3]`,
        java: `import java.util.Arrays;

public class Solution {
  public static int[] twoSumSorted(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left < right) {
      int s = nums[left] + nums[right];
      if (s == target) return new int[]{left, right};
      if (s < target) left++;
      else right--;
    }
    return new int[]{};
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(twoSumSorted(new int[]{1, 3, 4, 6, 9}, 7))); // [0, 3]
  }
}`,
        cpp: `#include <iostream>
#include <vector>

std::vector<int> twoSumSorted(const std::vector<int>& nums, int target) {
  int left = 0;
  int right = nums.size() - 1;
  while (left < right) {
    int s = nums[left] + nums[right];
    if (s == target) return {left, right};
    if (s < target) left++;
    else right--;
  }
  return {};
}

int main() {
  std::vector<int> r = twoSumSorted({1, 3, 4, 6, 9}, 7);
  std::cout << r[0] << ' ' << r[1] << std::endl; // 0 3
  return 0;
}`,
      },
    },
    whyFaster:
      'The nested loop tests roughly n^2 / 2 pairs. With two pointers each step throws away one element for good: if the sum is too small, the left value can never be part of the answer with any remaining partner, and the same logic applies on the right. At most n steps happen, so O(n^2) becomes O(n) with no extra memory.',
    keyPoints: [
      'Two indexes that each move in one direction give at most n total moves, hence O(n).',
      'Opposite-end pointers need sorted or symmetric data; slow-fast pointers rewrite arrays in place.',
      'Write the move rule so it never skips the answer, and move exactly one pointer per step.',
      'Sorting first (O(n log n)) is still a big win over an O(n^2) pair search.',
      'Clues: sorted input, pair or triplet sum, palindrome, in-place removal.',
    ],
    patternIds: ['two-pointers'],
    problems: [
      {
        id: 'valid-palindrome',
        title: 'Valid Palindrome',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-palindrome/',
        patternId: 'two-pointers',
        hint: 'Skip non-alphanumeric characters on each side, compare lowercase versions, move inward.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'squares-of-a-sorted-array',
        title: 'Squares of a Sorted Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
        patternId: 'two-pointers',
        hint: 'The largest square is at one of the two ends; fill the result from the back.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'move-zeroes',
        title: 'Move Zeroes',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/move-zeroes/',
        patternId: 'two-pointers',
        hint: 'A slow pointer marks where the next non-zero goes; a fast pointer scans and swaps.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'two-sum-ii-input-array-is-sorted',
        title: 'Two Sum II - Input Array Is Sorted',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
        patternId: 'two-pointers',
        hint: 'Too small a sum means move left up; too big means move right down.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/container-with-most-water/',
        patternId: 'two-pointers',
        hint: 'Area is limited by the shorter wall, so always move the pointer at the shorter wall inward.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: '3sum',
        title: '3Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/3sum/',
        patternId: 'two-pointers',
        hint: 'Sort, fix one number, then run two-pointer two-sum on the rest; skip duplicate values.',
        xp: 40,
        tier: 'advanced',
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/trapping-rain-water/',
        patternId: 'two-pointers',
        hint: 'Water at a position depends on the smaller of the max heights on each side; move the side with the smaller max.',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'Two pointers is a scan that keeps two indexes into the same sequence and moves exactly one of them per step, according to a rule read off the values under them. Because neither index ever goes backwards, the whole scan costs O(n) even though it is reasoning about pairs.',
    coreIdea:
      'In a sorted array, one comparison tells you about a whole group of pairs at once. If nums[left] + nums[right] is too small, then nums[left] paired with anything still in range is also too small, so that entire row of pairs is dead and left can move once and forget it. Each move retires a row or a column of the n^2 pairs, and there are at most n moves, so the pair search collapses from O(n^2) to O(n) with no extra memory.',
    visual: [
      {
        caption: 'Opposite ends on a sorted array. nums = [1, 3, 4, 6, 9], target 7.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 1 ][ 3 ][ 4 ][ 6 ][ 9 ]',
          '      ^L                  ^R',
          'sum = 1 + 9 = 10  >  7  ->  move R left',
        ].join('\n'),
      },
      {
        caption: 'R stepped in. The new pair hits the target exactly.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 1 ][ 3 ][ 4 ][ 6 ][ 9 ]',
          '      ^L             ^R',
          'sum = 1 + 6 = 7  =  7  ->  answer (0, 3)',
        ].join('\n'),
      },
      {
        caption: 'Why dropping 9 was safe, and why the scan is linear.',
        frame: [
          '9 was the largest value still in range.',
          '1 was the smallest still in range.',
          'So 1 + 9 is the biggest sum any pair using 9',
          'can reach, and it already overshot 7.',
          'No pair with 9 can work  ->  retire the column.',
        ].join('\n'),
      },
      {
        caption: 'The other shape: slow writes, fast reads. Move all zeros to the end.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 0 ][ 1 ][ 0 ][ 3 ][ 5 ]',
          '      ^w   ^r',
          'r = 1 holds 1, non-zero  ->  swap with w',
        ].join('\n'),
      },
      {
        caption: 'w only advances when something real is written there.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 1 ][ 0 ][ 0 ][ 3 ][ 5 ]',
          '           ^w        ^r',
          'r = 3 holds 3, non-zero  ->  swap with w',
        ].join('\n'),
      },
      {
        caption: 'One pass, and the zeros are pushed to the back for free.',
        frame: [
          'idx   0    1    2    3    4',
          'val [ 1 ][ 3 ][ 0 ][ 0 ][ 5 ]',
          '                ^w        ^r',
          'r moved n times, w moved at most n  ->  O(n)',
        ].join('\n'),
      },
    ],
    pseudocode: `// shape 1: opposite ends, needs sorted data
function twoSumSorted(A, target):
    left = 0
    right = length(A) - 1
    while left < right:
        sum = A[left] + A[right]
        if sum = target:
            return (left, right)
        else if sum < target:
            left = left + 1      // need a bigger value
        else:
            right = right - 1    // need a smaller value
    return none

// shape 2: same direction, fast reads and slow writes
function removeValue(A, target):
    write = 0
    for read from 0 to length(A) - 1:
        if A[read] != target:
            A[write] = A[read]
            write = write + 1
    return write                 // the new logical length`,
    complexity: [
      { label: 'Opposite ends, data already sorted', time: 'O(n)', space: 'O(1)', note: 'each step retires one index for good' },
      { label: 'Opposite ends, you must sort first', time: 'O(n log n)', space: 'O(1) to O(n)', note: 'the sort dominates; space depends on the sort used' },
      { label: 'Same direction (read and write pointers)', time: 'O(n)', space: 'O(1)', note: 'one pass, overwriting in place' },
      { label: '3Sum: fix one value, two-point the rest', time: 'O(n^2)', space: 'O(1) extra', note: 'n outer choices times one O(n) scan' },
      { label: 'Brute force over all pairs, for contrast', time: 'O(n^2)', space: 'O(1)', note: 'inspects every one of the n(n-1)/2 pairs' },
    ],
    dryRun: {
      input: 'nums = [1, 3, 4, 6, 9], target = 13',
      goal: 'Find two indexes whose values add to exactly 13, in one pass over the sorted array.',
      steps: [
        { state: 'left=0 right=4', action: 'Compute s = nums[0] + nums[4] = 1 + 9 = 10.' },
        { state: 'left=0 right=4 s=10', action: 's is below 13, so we need a bigger sum. Only a bigger left value can help, so left becomes 1. The value 1 is now retired: paired with the largest partner available it still fell short.' },
        { state: 'left=1 right=4', action: 'Compute s = nums[1] + nums[4] = 3 + 9 = 12.' },
        { state: 'left=1 right=4 s=12', action: 'Still below 13 by one, so left becomes 2 and the value 3 is retired for the same reason.' },
        { state: 'left=2 right=4', action: 'Compute s = nums[2] + nums[4] = 4 + 9 = 13.' },
        { state: 'left=2 right=4 s=13', action: 's equals the target, so return the pair of indexes (2, 4) immediately.' },
      ],
      result:
        'Indexes (2, 4), holding 4 and 9, which add to 13. Three sum comparisons instead of the ten pairs a nested loop would test on five elements. Each iteration moved a pointer exactly once and neither pointer ever went back, so the work is bounded by n: O(n) time, O(1) space.',
    },
    mistakes: [
      {
        mistake: 'Running opposite-end pointers on an unsorted array.',
        why: 'The rule "sum too small, move left" is only valid when everything to the right of left is at least as large. Without sorted order a bigger value may sit behind left, so you walk straight past the answer and return nothing.',
        fix: 'Sort first when the original indexes do not matter (O(n log n) still beats O(n^2)). When the answer must be reported as original indexes, use a hash map instead, which is the classic one-pass Two Sum.',
      },
      {
        mistake: 'Moving both pointers in the same iteration.',
        why: 'Doing left = left + 1 and right = right - 1 together skips the pair (new left, old right), which can be the only valid answer. The linear argument only holds because each step eliminates exactly one candidate.',
        fix: 'Move exactly one pointer per iteration. The only exception is after recording a hit in problems such as 3Sum that must find every distinct pair.',
      },
      {
        mistake: 'Writing while left <= right when the two picks must be different elements.',
        why: 'At left == right you are using the same element twice, so you report a "pair" like (2, 2) that adds a number to itself, which the problem almost never allows.',
        fix: 'Use while left < right for pair problems. Use left <= right only in binary search, where a single remaining element is still a valid candidate.',
      },
      {
        mistake: 'Forgetting to skip duplicate values in 3Sum.',
        why: 'Sorted input groups equal values together, so the same triplet is discovered several times and the output contains duplicates even though the algorithm is otherwise correct.',
        fix: 'After recording a hit, advance left while nums[left] equals nums[left - 1], pull right back the same way, and skip a repeated fixed value in the outer loop too.',
      },
      {
        mistake: 'In the read and write shape, forgetting to return the write index.',
        why: 'The slots behind the write pointer still hold stale leftovers from the original array, so the caller cannot tell where the real answer ends and prints garbage at the tail.',
        fix: 'Return write as the new length, and make sure only A[0..write-1] is compared or printed.',
      },
    ],
    whenToUse: [
      'The array is sorted, or you may sort it and the original indexes do not matter.',
      'You need a pair, a triplet, or a difference that hits a target.',
      'The problem says "in place" and "O(1) extra space" for removing, moving or compacting elements.',
      'The question is symmetric: palindrome, compare from both ends, water between two walls.',
      'You are merging or comparing two already sorted sequences from the front.',
    ],
    whenNotToUse: [
      'The array is unsorted and you must report original indexes, use a hash map for one-pass Two Sum.',
      'You need the best contiguous range under a condition, use a sliding window.',
      'The rule depends on sums and the values can be negative, use prefix sums with a hash map.',
      'You will be asked many arbitrary range queries later, use a prefix sum array or a segment tree.',
      'The picks may be non-contiguous with dependencies between them, that is dynamic programming.',
    ],
    relatedTopics: [
      { id: 'sliding-window', kind: 'concept', why: 'A window is the same-direction two-pointer shape with a running summary of the range between the pointers.' },
      { id: 'sorting-basics', kind: 'concept', why: 'Most two-pointer solutions begin with a sort, so you need to know what that costs and whether it destroys required index order.' },
      { id: 'cycle-detection', kind: 'concept', why: 'Fast and slow pointers on a linked list are the same trick applied to nodes instead of indexes.' },
      { id: 'hash-map', kind: 'pattern', why: 'When sorting is not allowed, a hash map is the usual replacement for the opposite-end scan.' },
    ],
    quiz: [
      {
        question: '3Sum sorts the array and then, for each fixed first number, runs a two-pointer scan over the rest. What is the total time?',
        options: ['O(n log n)', 'O(n^2)', 'O(n^3)', 'O(n^2 log n)'],
        answerIndex: 1,
        explanation: 'The sort costs O(n log n) once, then n outer choices each run an O(n) scan. O(n^2) dominates.',
      },
      {
        question: 'nums = [3, 1, 8, 2] and you must return the indexes, in the original array, of the two values that add to 5. Do opposite-end two pointers work?',
        options: [
          'Yes, start left at 0 and right at 3 and apply the usual rule',
          'No; the array is unsorted, and sorting it would destroy the original indexes, so use a hash map',
          'Yes, but only after reversing the array',
          'No, this needs a sliding window',
        ],
        answerIndex: 1,
        explanation: 'The move rule needs sorted order, and the problem needs original positions. A hash map from value to index solves it in one O(n) pass.',
      },
      {
        question: 'Why is an opposite-end two-pointer scan O(n) rather than O(n^2)?',
        options: [
          'Because it still checks every pair, but each check is O(1)',
          'Because every iteration moves one pointer one step in a fixed direction, so at most n iterations can happen',
          'Because sorted arrays have fewer pairs than unsorted ones',
          'Because it uses only O(1) memory',
        ],
        answerIndex: 1,
        explanation: 'left only rises and right only falls, so together they can take at most n steps before crossing. Memory use is a separate question from running time.',
      },
      {
        question: 'In the slow-and-fast shape used for Move Zeroes, what does the slow pointer mean?',
        options: [
          'The index of the next zero to delete',
          'The index where the next kept value should be written',
          'How many zeros have been seen so far',
          'The midpoint of the array',
        ],
        answerIndex: 1,
        explanation: 'Slow is a write cursor: everything before it is already the finished prefix of the answer, which is what makes the one-pass rewrite correct.',
      },
    ],
    sources: [
      'USACO Guide: Two Pointers',
      'CSES Problem Set: Sum of Two Values, Sum of Three Values',
      'CLRS ch. 2 and ch. 7 (sorting as preprocessing)',
      'MIT 6.006 Introduction to Algorithms: sorting and search',
      'LeetCode editorials: Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water',
    ],
  },
  {
    id: 'sliding-window',
    gateId: 'arrays-strings',
    order: 4,
    title: 'Sliding Window: Reuse the Work from the Last Step',
    minutes: 30,
    summary: 'Keep a moving range over the array and update its state by adding one element and removing one element, instead of recomputing from scratch.',
    analogy:
      'You are looking out of a train window at a row of houses. When the train moves one house forward, you do not count all the houses again. One house leaves your view on the left and one enters on the right. You just adjust your count by one on each side.',
    explanation: `Sliding window is the tool for "best contiguous piece" problems: the largest sum of k items in a row, the longest substring with some property, the shortest subarray reaching a target. It is a special two-pointer setup where the two pointers mark the start and end of a range and you carry the range's state as it moves.

## The idea

- Maintain a window \`[left, right]\` and some summary of what is inside it: a sum, a count map, a number of distinct items.
- Grow the window by moving \`right\` and updating the summary with the new element.
- When the window breaks a rule (too long, too many distinct, sum too big), shrink it by moving \`left\` and updating the summary with the removed element.
- Each element enters once and leaves once, so the total work is O(n).

There are two flavours:

- **Fixed size**: window is always k wide. Slide by one: add \`nums[right]\`, remove \`nums[left]\`.
- **Variable size**: window grows while valid and shrinks while invalid. You record the best size seen.

## A tiny example

Largest sum of any k consecutive numbers. \`[2, 1, 5, 1, 3, 2]\`, k = 3.

The slow way sums every window from scratch:

\`\`\`python
def max_sum_k(nums, k):
    best = 0
    for i in range(len(nums) - k + 1):
        best = max(best, sum(nums[i:i + k]))   # O(k) each
    return best
\`\`\`

There are about n windows and each sum costs k: **O(n * k)**.

The fast way keeps a running sum:

\`\`\`python
def max_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for right in range(k, len(nums)):
        window += nums[right]          # element enters
        window -= nums[right - k]      # element leaves
        best = max(best, window)
    return best
\`\`\`

Trace: first window 2+1+5 = 8. Slide: +1 -2 = 7. Slide: +3 -1 = 9. Slide: +2 -5 = 6. Best is 9. Each step is O(1): **O(n)** total.

## Step by step: variable-size window

1. Set \`left = 0\` and an empty summary.
2. For each \`right\`, add \`nums[right]\` to the summary.
3. While the window is invalid, remove \`nums[left]\` from the summary and do \`left += 1\`.
4. Now the window is valid; update the best answer with \`right - left + 1\`.

For "longest" problems you update the answer after shrinking. For "shortest" problems you update while the window is valid, before shrinking further.

## Where people go wrong

- Recomputing the summary inside the loop (for example calling \`sum\` on the slice). That silently brings back O(n * k).
- Forgetting to remove the left element from a count map when shrinking.
- Using a sliding window when the array has negative numbers and the rule depends on sum. Shrinking no longer guarantees the sum goes down; use prefix sums instead.
- Confusing "subarray" (contiguous) with "subsequence" (not contiguous). Sliding window only fits contiguous.

## How to recognise it in an interview

- "Contiguous subarray" or "substring" plus "longest", "shortest", "maximum sum" or "at most k".
- A fixed size k appears in the statement.
- A condition about counts inside the range: "at most k distinct", "no repeating characters", "contains all characters of t".`,
    naive: {
      title: 'Recompute every window from scratch',
      description:
        'For each starting index, add up the next k numbers. Every window repeats most of the work of the previous one.',
      time: 'O(n * k)',
      space: 'O(1)',
      code: {
        python: `def max_sum_k(nums, k):
    best = float('-inf')
    for i in range(len(nums) - k + 1):
        total = 0
        for j in range(i, i + k):
            total += nums[j]
        best = max(best, total)
    return best

print(max_sum_k([2, 1, 5, 1, 3, 2], 3))  # 9`,
        javascript: `function maxSumK(nums, k) {
  let best = -Infinity;
  for (let i = 0; i + k <= nums.length; i++) {
    let total = 0;
    for (let j = i; j < i + k; j++) total += nums[j];
    best = Math.max(best, total);
  }
  return best;
}

console.log(maxSumK([2, 1, 5, 1, 3, 2], 3)); // 9`,
        java: `public class Solution {
  public static int maxSumK(int[] nums, int k) {
    int best = Integer.MIN_VALUE;
    for (int i = 0; i + k <= nums.length; i++) {
      int total = 0;
      for (int j = i; j < i + k; j++) total += nums[j];
      best = Math.max(best, total);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxSumK(new int[]{2, 1, 5, 1, 3, 2}, 3)); // 9
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>

int maxSumK(const std::vector<int>& nums, int k) {
  int best = INT_MIN;
  for (int i = 0; i + k <= (int)nums.size(); i++) {
    int total = 0;
    for (int j = i; j < i + k; j++) total += nums[j];
    best = std::max(best, total);
  }
  return best;
}

int main() {
  std::cout << maxSumK({2, 1, 5, 1, 3, 2}, 3) << std::endl; // 9
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Slide the window: add one, remove one',
      description:
        'Compute the first window once. Then for each step add the element entering on the right and subtract the element leaving on the left. Each step is constant time.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def max_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for right in range(k, len(nums)):
        window += nums[right] - nums[right - k]
        best = max(best, window)
    return best

print(max_sum_k([2, 1, 5, 1, 3, 2], 3))  # 9`,
        javascript: `function maxSumK(nums, k) {
  let window = 0;
  for (let i = 0; i < k; i++) window += nums[i];
  let best = window;
  for (let right = k; right < nums.length; right++) {
    window += nums[right] - nums[right - k];
    best = Math.max(best, window);
  }
  return best;
}

console.log(maxSumK([2, 1, 5, 1, 3, 2], 3)); // 9`,
        java: `public class Solution {
  public static int maxSumK(int[] nums, int k) {
    int window = 0;
    for (int i = 0; i < k; i++) window += nums[i];
    int best = window;
    for (int right = k; right < nums.length; right++) {
      window += nums[right] - nums[right - k];
      best = Math.max(best, window);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxSumK(new int[]{2, 1, 5, 1, 3, 2}, 3)); // 9
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

int maxSumK(const std::vector<int>& nums, int k) {
  int window = 0;
  for (int i = 0; i < k; i++) window += nums[i];
  int best = window;
  for (int right = k; right < (int)nums.size(); right++) {
    window += nums[right] - nums[right - k];
    best = std::max(best, window);
  }
  return best;
}

int main() {
  std::cout << maxSumK({2, 1, 5, 1, 3, 2}, 3) << std::endl; // 9
  return 0;
}`,
      },
    },
    whyFaster:
      'The naive version re-adds k numbers for each of about n windows, so O(n * k). The sliding version notices that neighbouring windows share k - 1 elements, so it only needs one addition and one subtraction per move. Every element enters once and leaves once, making the total O(n) regardless of k.',
    keyPoints: [
      'A window is a range [left, right] plus a summary (sum, count map) that you update incrementally.',
      'Each element enters once and leaves once, so the whole scan is O(n).',
      'Fixed-size windows slide by one; variable-size windows grow while valid and shrink while invalid.',
      'Never recompute the summary from scratch inside the loop; that reintroduces the O(k) cost.',
      'Only for contiguous ranges, and be careful with negative numbers when the rule depends on the sum.',
    ],
    patternIds: ['sliding-window', 'two-pointers'],
    problems: [
      {
        id: 'maximum-average-subarray-i',
        title: 'Maximum Average Subarray I',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
        patternId: 'sliding-window',
        hint: 'Track the sum of a fixed window of size k; the best average is the best sum divided by k.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'best-time-to-buy-and-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        patternId: 'sliding-window',
        hint: 'Keep the lowest price seen so far as the left edge; each day check the profit from selling now.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'longest-substring-without-repeating-characters',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        patternId: 'sliding-window',
        hint: 'Grow right; when a character repeats, move left past its previous position.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'max-consecutive-ones-iii',
        title: 'Max Consecutive Ones III',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
        patternId: 'sliding-window',
        hint: 'Count zeroes in the window; shrink from the left whenever that count exceeds k.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'permutation-in-string',
        title: 'Permutation in String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/permutation-in-string/',
        patternId: 'sliding-window',
        hint: 'Slide a window the length of s1 over s2 and compare 26-letter counts as you go.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'minimum-size-subarray-sum',
        title: 'Minimum Size Subarray Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
        patternId: 'sliding-window',
        hint: 'Grow until the sum reaches the target, then shrink from the left while it still does, recording the length.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/minimum-window-substring/',
        patternId: 'sliding-window',
        hint: 'Keep a count map of needed characters and a counter of how many are satisfied; shrink whenever all are.',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'A sliding window is a contiguous range [left, right] over a sequence, carried along with a small summary of what is inside it: a running sum, a count map, a number of distinct values. The window advances by adding the element that enters on the right and removing the element that leaves on the left, so the summary is updated in O(1) instead of recomputed from scratch.',
    coreIdea:
      'Two neighbouring windows of width k share k - 1 elements, so recomputing the whole sum throws away work you already did. If the summary can be repaired with one addition and one subtraction, then every element enters the window once and leaves once, which is at most 2n updates in the entire run. That is why an O(n * k) scan becomes O(n) and why the width k stops appearing in the cost at all.',
    visual: [
      {
        caption: 'Fixed window k = 3 over [2, 1, 5, 1, 3, 2]. Sum the first window once.',
        frame: [
          'idx   0    1    2    3    4    5',
          'val [ 2 ][ 1 ][ 5 ][ 1 ][ 3 ][ 2 ]',
          '    |<--- k=3 --->|',
          '      ^L        ^R',
          'sum = 2 + 1 + 5 = 8     best = 8',
        ].join('\n'),
      },
      {
        caption: 'Slide one step: 1 enters on the right, 2 leaves on the left.',
        frame: [
          'idx   0    1    2    3    4    5',
          'val [ 2 ][ 1 ][ 5 ][ 1 ][ 3 ][ 2 ]',
          '         |<--- k=3 --->|',
          '           ^L        ^R',
          'sum = 8 + 1 - 2 = 7     best stays 8',
        ].join('\n'),
      },
      {
        caption: 'Slide again: 3 enters, 1 leaves. A new best appears.',
        frame: [
          'idx   0    1    2    3    4    5',
          'val [ 2 ][ 1 ][ 5 ][ 1 ][ 3 ][ 2 ]',
          '              |<--- k=3 --->|',
          '                ^L        ^R',
          'sum = 7 + 3 - 1 = 9     best = 9',
        ].join('\n'),
      },
      {
        caption: 'Last slide: 2 enters, 5 leaves. Two operations per step, never k.',
        frame: [
          'idx   0    1    2    3    4    5',
          'val [ 2 ][ 1 ][ 5 ][ 1 ][ 3 ][ 2 ]',
          '                   |<--- k=3 --->|',
          '                     ^L        ^R',
          'sum = 9 + 2 - 5 = 6     best stays 9',
        ].join('\n'),
      },
      {
        caption: 'Variable window: shortest run with sum at least 8. Grow until valid.',
        frame: [
          'grow R while the sum is still under 8:',
          '',
          '[ 2 ]              L=0 R=0  sum=2   too small',
          '[ 2 ][ 1 ]         L=0 R=1  sum=3   too small',
          '[ 2 ][ 1 ][ 5 ]    L=0 R=2  sum=8   valid, len 3',
        ].join('\n'),
      },
      {
        caption: 'Now contract from the left while it stays valid, then grow again.',
        frame: [
          'shrink: drop 2  ->  [ 1 ][ 5 ]  sum=6  invalid',
          'so best length so far = 3, and L stays at 1',
          '',
          'grow to R=4: [ 1 ][ 5 ][ 1 ][ 3 ] sum=10 valid',
          'shrink: drop 1 -> [ 5 ][ 1 ][ 3 ] sum=9  len 3',
          'shrink: drop 5 -> [ 1 ][ 3 ]      sum=4  stop',
        ].join('\n'),
      },
    ],
    pseudocode: `// fixed width k: best sum of any k neighbours
function bestFixedWindow(A, k):
    sum = 0
    for i from 0 to k - 1:
        sum = sum + A[i]
    best = sum
    for right from k to length(A) - 1:
        sum = sum + A[right] - A[right - k]
        best = max(best, sum)
    return best

// variable width: shortest range with sum >= target
function shortestAtLeast(A, target):
    left = 0
    sum = 0
    best = infinity
    for right from 0 to length(A) - 1:
        sum = sum + A[right]            // element enters
        while sum >= target:            // still valid?
            best = min(best, right - left + 1)
            sum = sum - A[left]         // element leaves
            left = left + 1
    if best = infinity:
        return 0
    return best`,
    complexity: [
      { label: 'Fixed window of width k', time: 'O(n)', space: 'O(1)', note: 'one add and one subtract per slide, k does not appear' },
      { label: 'Variable window, numeric summary', time: 'O(n)', space: 'O(1)', note: 'each index enters once and leaves once' },
      { label: 'Variable window with a count map', time: 'O(n)', space: 'O(min(n, alphabet))', note: 'at most one map entry per distinct value inside the window' },
      { label: 'Naive: recompute each window', time: 'O(n * k)', space: 'O(1)', note: 're-adds k elements for each of about n windows' },
      { label: 'Window maximum with a monotonic deque', time: 'O(n)', space: 'O(k)', note: 'amortised: each index is pushed once and popped once' },
    ],
    dryRun: {
      input: 'nums = [2, 1, 5, 1, 3, 2], k = 3',
      goal: 'Find the largest sum of any three numbers that sit next to each other.',
      steps: [
        { state: 'window=8 best=8', action: 'Add up the first window nums[0..2] = 2 + 1 + 5 = 8. This is the only time we ever add k numbers.' },
        { state: 'right=3 window=8', action: 'Add nums[3] = 1 for the element entering and subtract nums[0] = 2 for the element leaving: window = 8 + 1 - 2 = 7.' },
        { state: 'right=3 window=7 best=8', action: '7 does not beat 8, so best stays 8.' },
        { state: 'right=4 window=7', action: 'Add nums[4] = 3 and subtract nums[1] = 1: window = 7 + 3 - 1 = 9.' },
        { state: 'right=4 window=9 best=9', action: '9 beats 8, so best becomes 9. This window is [5, 1, 3].' },
        { state: 'right=5 window=9', action: 'Add nums[5] = 2 and subtract nums[2] = 5: window = 9 + 2 - 5 = 6.' },
        { state: 'right=5 window=6 best=9', action: '6 does not beat 9, and right has reached the last index, so the loop ends.' },
      ],
      result:
        'best = 9, from the subarray [5, 1, 3] at indexes 2..4. The naive version would have added three numbers for each of four windows, twelve additions. This one did three for the first window plus two operations per slide, nine in total, and the gap widens as k grows because sliding never depends on k.',
    },
    mistakes: [
      {
        mistake: 'Calling sum(nums[i:i + k]) inside the loop.',
        why: 'The slice copies k elements and sum adds k elements, so you are back to O(n * k) even though the code looks like a sliding window. This is the single most common way people accidentally fail the time limit.',
        fix: 'Carry a running total and repair it with window = window + nums[right] - nums[right - k].',
      },
      {
        mistake: 'Shrinking with an if instead of a while.',
        why: 'Removing one element from the left may not be enough to make the window valid again, so an invalid window survives into the answer and the result is silently wrong on some inputs.',
        fix: 'Shrink inside a while loop that runs until the window satisfies the rule again.',
      },
      {
        mistake: 'Using a sliding window on a sum problem where the array contains negative numbers.',
        why: 'The method relies on "growing the window can only raise the sum, shrinking can only lower it". With negatives that is false, so shrinking is no longer a reliable way to fix an over-large sum and whole valid answers get skipped.',
        fix: 'Use prefix sums with a hash map, the Subarray Sum Equals K technique, which stays O(n) and handles negatives.',
      },
      {
        mistake: 'Forgetting to remove the leaving element from the count map, or leaving zero-count keys behind.',
        why: 'People use len(count_map) as "number of distinct values in the window". A stale key whose count fell to zero still counts, so the window looks more varied than it is and the answer is too small.',
        fix: 'Decrement on removal and delete the key when its count reaches 0, or keep an explicit distinct counter you adjust by hand.',
      },
      {
        mistake: 'Updating the best answer at the wrong moment.',
        why: 'For a "longest valid" question the length only means something after shrinking has restored validity. For a "shortest valid" question you must record while the window is still valid, just before shrinking further. Swapping the two gives off-by-one answers that pass the sample and fail the tests.',
        fix: 'Decide which of the two shapes you are in before writing the loop, and put the update on the matching side of the while.',
      },
    ],
    whenToUse: [
      'The words "contiguous subarray" or "substring" appear with "longest", "shortest" or "maximum sum".',
      'A fixed width k is given: every window of size k, the average of k days.',
      'There is a budget-style limit: at most k distinct characters, at most k zeros you may flip.',
      'All the values are non-negative, so growing the range can only grow the total.',
      'You need the frequency picture of a moving range, such as an anagram check across a long string.',
    ],
    whenNotToUse: [
      'The chosen elements need not be next to each other, that is a subsequence, use dynamic programming.',
      'The array has negative numbers and the condition is about the sum, use prefix sums with a hash map.',
      'You will be asked the sum of arbitrary ranges chosen later, build a prefix sum array instead.',
      'You need the k largest values in the whole array rather than inside a range, use a heap.',
      'You need the maximum inside each window rather than the sum, add a monotonic deque, a plain running summary cannot do it.',
    ],
    relatedTopics: [
      { id: 'two-pointers', kind: 'concept', why: 'A window is the same-direction two-pointer shape with a running summary attached to the range.' },
      { id: 'prefix-sums', kind: 'concept', why: 'Prefix sums take over exactly where windows fail, when the values can be negative.' },
      { id: 'queue-and-deque', kind: 'concept', why: 'A monotonic deque upgrades a window so it can also report the maximum or minimum inside it.' },
      { id: 'frequency-counting', kind: 'concept', why: 'Variable windows over strings carry a count map, which is frequency counting applied to a moving range.' },
    ],
    quiz: [
      {
        question: 'A fixed window of width k slides across n elements while a running sum is maintained. What is the time?',
        options: ['O(n * k)', 'O(n)', 'O(n log k)', 'O(k)'],
        answerIndex: 1,
        explanation: 'The first window costs k, then each slide is one addition and one subtraction, giving O(n + k), which is O(n) because k is at most n.',
      },
      {
        question: 'nums = [1, -2, 3, -1, 4]. You need the shortest subarray with sum at least 4. Does a grow-and-shrink window work?',
        options: [
          'Yes: grow while the sum is under 4 and shrink while it is at least 4',
          'No: negative values break the assumption that shrinking lowers the sum, so use prefix sums with a monotonic deque or a hash map',
          'Yes, but sort the array first',
          'No, the answer is always the whole array',
        ],
        answerIndex: 1,
        explanation: 'Shrinking from the left can raise the sum when a negative number leaves, so the window can skip valid answers. Prefix sums keep working with negatives.',
      },
      {
        question: 'In "longest substring without repeating characters", when should you record the answer?',
        options: [
          'Right after adding the new character, before any shrinking',
          'After the while loop has removed characters until the window is valid again',
          'Only at the moment the window becomes invalid',
          'Once, after the whole loop has finished',
        ],
        answerIndex: 1,
        explanation: 'The length right - left + 1 only describes a legal substring once the duplicate has been shrunk away, so the update belongs after the while loop.',
      },
      {
        question: 'A variable window has a while loop nested inside a for loop. Why is it still O(n) and not O(n^2)?',
        options: [
          'Because left and right each move forward at most n times across the whole run',
          'Because the inner while loop can run at most k times per outer step',
          'Because the array is sorted',
          'Because the count map holds at most 26 keys',
        ],
        answerIndex: 0,
        explanation: 'The inner loop can be long on one iteration, but left never goes backwards, so all its steps together add up to at most n for the entire scan.',
      },
    ],
    sources: [
      'USACO Guide: Sliding Window, and Two Pointers',
      'CSES Problem Set: Subarray Sums I, Playlist, Sliding Window Median',
      'MIT 6.006 Introduction to Algorithms: amortised analysis',
      'CP-Algorithms: Minimum stack and minimum queue (sliding window minimum)',
      'LeetCode editorials: Minimum Size Subarray Sum, Longest Substring Without Repeating Characters, Minimum Window Substring',
    ],
  },
  {
    id: 'prefix-sums',
    gateId: 'arrays-strings',
    order: 5,
    title: 'Prefix Sums: Precompute Once, Answer Ranges Instantly',
    minutes: 25,
    summary: 'Store the running total up to each index so that the sum of any range becomes a single subtraction.',
    analogy:
      'A car odometer shows total distance since new. To know how far you drove between two cities, you do not re-measure the road; you subtract the reading at departure from the reading at arrival. A prefix sum array is an odometer for your list.',
    explanation: `Many problems ask "what is the sum of elements between index i and j?" many times over. Answering each one with a loop is O(n) per question. Prefix sums let you answer each in O(1) after a single O(n) setup. The same idea powers subarray-sum problems, 2D grid sums and several counting tricks.

## The idea

- Build an array \`prefix\` where \`prefix[i]\` is the sum of the first i elements (so \`prefix[0] = 0\`).
- The sum of \`nums[l..r]\` (inclusive) is \`prefix[r + 1] - prefix[l]\`.
- Building costs O(n) once. Each range query costs O(1) afterwards.

Using a leading zero (\`prefix[0] = 0\`) avoids special cases when l = 0.

## A tiny example

\`nums = [3, 1, 4, 1, 5]\`. Queries: sum of indexes 1..3, sum of indexes 0..4.

The slow way loops per query:

\`\`\`python
def range_sum(nums, l, r):
    total = 0
    for i in range(l, r + 1):
        total += nums[i]
    return total
\`\`\`

Each query is **O(n)**. With q queries that is O(n * q).

The fast way precomputes:

\`\`\`python
prefix = [0]
for x in nums:
    prefix.append(prefix[-1] + x)
# prefix = [0, 3, 4, 8, 9, 14]

def range_sum(l, r):
    return prefix[r + 1] - prefix[l]
\`\`\`

Sum of 1..3 is prefix[4] - prefix[1] = 9 - 3 = 6 (that is 1 + 4 + 1). Sum of 0..4 is 14 - 0 = 14. Setup **O(n)**, then each query **O(1)**.

## Step by step: the subarray-sum trick

The most famous use is "count subarrays whose sum equals k". A subarray from l to r has sum k exactly when \`prefix[r + 1] - prefix[l] = k\`, which means \`prefix[l] = prefix[r + 1] - k\`. So while scanning, keep a hash map of how many times each prefix value has appeared:

1. Start with \`seen = {0: 1}\` and \`running = 0\`.
2. For each element, add it to \`running\`.
3. Add \`seen[running - k]\` to the answer (that many earlier starts work).
4. Increase \`seen[running]\` by one.

This is O(n) and it works with negative numbers, which sliding window cannot handle.

## Where people go wrong

- Off-by-one: with a leading zero, the range l..r is \`prefix[r + 1] - prefix[l]\`, not \`prefix[r] - prefix[l]\`.
- Forgetting \`seen = {0: 1}\`. Without it you miss subarrays that start at index 0.
- Rebuilding the prefix array for every query. Build once, reuse forever, unless the array changes.
- Trying sliding window on a sum problem with negatives. Reach for prefix sums plus a hash map instead.

## How to recognise it in an interview

- "Sum of elements between i and j", asked many times, or an "immutable" array with many queries.
- "Number of subarrays with sum equal to k", "subarray sum divisible by k".
- "Pivot index", "equilibrium", "left sum equals right sum".
- 2D versions: "sum of a rectangle in a matrix" uses the same idea with inclusion-exclusion.`,
    naive: {
      title: 'Loop over the range for every query',
      description:
        'Each time someone asks for a range sum, walk from l to r and add. Correct, but with many queries the repeated walking dominates.',
      time: 'O(n) per query',
      space: 'O(1)',
      code: {
        python: `def range_sum(nums, l, r):
    total = 0
    for i in range(l, r + 1):
        total += nums[i]
    return total

nums = [3, 1, 4, 1, 5]
print(range_sum(nums, 1, 3))  # 6
print(range_sum(nums, 0, 4))  # 14`,
        javascript: `function rangeSum(nums, l, r) {
  let total = 0;
  for (let i = l; i <= r; i++) total += nums[i];
  return total;
}

const nums = [3, 1, 4, 1, 5];
console.log(rangeSum(nums, 1, 3)); // 6
console.log(rangeSum(nums, 0, 4)); // 14`,
        java: `public class Solution {
  public static int rangeSum(int[] nums, int l, int r) {
    int total = 0;
    for (int i = l; i <= r; i++) total += nums[i];
    return total;
  }

  public static void main(String[] args) {
    int[] nums = {3, 1, 4, 1, 5};
    System.out.println(rangeSum(nums, 1, 3)); // 6
    System.out.println(rangeSum(nums, 0, 4)); // 14
  }
}`,
        cpp: `#include <iostream>
#include <vector>

int rangeSum(const std::vector<int>& nums, int l, int r) {
  int total = 0;
  for (int i = l; i <= r; i++) total += nums[i];
  return total;
}

int main() {
  std::vector<int> nums = {3, 1, 4, 1, 5};
  std::cout << rangeSum(nums, 1, 3) << std::endl; // 6
  std::cout << rangeSum(nums, 0, 4) << std::endl; // 14
  return 0;
}`,
      },
    },
    optimized: {
      title: 'Prefix array: build once, subtract per query',
      description:
        'Store running totals with a leading zero. Any range sum is then the difference of two stored values, so every query is a single subtraction.',
      time: 'O(n) build, O(1) per query',
      space: 'O(n)',
      code: {
        python: `class RangeSum:
    def __init__(self, nums):
        self.prefix = [0]
        for x in nums:
            self.prefix.append(self.prefix[-1] + x)

    def query(self, l, r):
        return self.prefix[r + 1] - self.prefix[l]

rs = RangeSum([3, 1, 4, 1, 5])
print(rs.query(1, 3))  # 6
print(rs.query(0, 4))  # 14`,
        javascript: `class RangeSum {
  constructor(nums) {
    this.prefix = [0];
    for (const x of nums) {
      this.prefix.push(this.prefix[this.prefix.length - 1] + x);
    }
  }

  query(l, r) {
    return this.prefix[r + 1] - this.prefix[l];
  }
}

const rs = new RangeSum([3, 1, 4, 1, 5]);
console.log(rs.query(1, 3)); // 6
console.log(rs.query(0, 4)); // 14`,
        java: `public class RangeSum {
  private final int[] prefix;

  public RangeSum(int[] nums) {
    prefix = new int[nums.length + 1];
    for (int i = 0; i < nums.length; i++) {
      prefix[i + 1] = prefix[i] + nums[i];
    }
  }

  public int query(int l, int r) {
    return prefix[r + 1] - prefix[l];
  }

  public static void main(String[] args) {
    RangeSum rs = new RangeSum(new int[]{3, 1, 4, 1, 5});
    System.out.println(rs.query(1, 3)); // 6
    System.out.println(rs.query(0, 4)); // 14
  }
}`,
        cpp: `#include <iostream>
#include <vector>

class RangeSum {
  std::vector<long long> prefix;
public:
  RangeSum(const std::vector<int>& nums) : prefix(nums.size() + 1, 0) {
    for (size_t i = 0; i < nums.size(); i++) {
      prefix[i + 1] = prefix[i] + nums[i];
    }
  }
  long long query(int l, int r) const {
    return prefix[r + 1] - prefix[l];
  }
};

int main() {
  RangeSum rs({3, 1, 4, 1, 5});
  std::cout << rs.query(1, 3) << std::endl; // 6
  std::cout << rs.query(0, 4) << std::endl; // 14
  return 0;
}`,
      },
    },
    whyFaster:
      'The loop version pays O(n) for every question, so q questions cost O(n * q). The prefix version pays O(n) once to store running totals, and then each question is one subtraction. For n = q = 10^5 that is 10^5 + 10^5 steps instead of 10^10. We traded O(n) memory for a huge cut in repeated work.',
    keyPoints: [
      'prefix[i] is the sum of the first i elements; use a leading zero so prefix[0] = 0.',
      'Sum of nums[l..r] is prefix[r + 1] - prefix[l], an O(1) operation.',
      'Build once in O(n); ideal when there are many queries on an unchanging array.',
      'Count subarrays with sum k by storing how often each prefix value has appeared in a hash map, starting with {0: 1}.',
      'Prefix sums handle negative numbers; sliding window on sums does not.',
    ],
    patternIds: ['prefix-sum', 'hash-map'],
    problems: [
      {
        id: 'running-sum-of-1d-array',
        title: 'Running Sum of 1d Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/running-sum-of-1d-array/',
        patternId: 'prefix-sum',
        hint: 'Each output is the previous output plus the current number; this is the prefix array itself.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'find-pivot-index',
        title: 'Find Pivot Index',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/find-pivot-index/',
        patternId: 'prefix-sum',
        hint: 'Right sum equals total minus left sum minus the current element; check as you scan.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'range-sum-query-immutable',
        title: 'Range Sum Query - Immutable',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/range-sum-query-immutable/',
        patternId: 'prefix-sum',
        hint: 'Precompute prefix sums in the constructor so sumRange is one subtraction.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'subarray-sum-equals-k',
        title: 'Subarray Sum Equals K',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
        patternId: 'prefix-sum',
        hint: 'While scanning, count how many earlier prefix values equal current prefix minus k.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'contiguous-array',
        title: 'Contiguous Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/contiguous-array/',
        patternId: 'prefix-sum',
        hint: 'Treat 0 as -1; equal counts of 0 and 1 means the prefix sum repeats, so store first index of each prefix value.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'range-sum-query-2d-immutable',
        title: 'Range Sum Query 2D - Immutable',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/range-sum-query-2d-immutable/',
        patternId: 'prefix-sum',
        hint: 'Store the sum of the rectangle from (0,0) to (i,j); a query subtracts two overlapping strips and adds back the corner.',
        xp: 40,
        tier: 'advanced',
      },
    ],
    definition:
      'A prefix sum array stores, at position i, the total of the first i elements of the original array, with prefix[0] set to 0. Once it is built, the sum of any range nums[l..r] is prefix[r + 1] - prefix[l], a single subtraction.',
    coreIdea:
      'The total of a middle range equals the total up to its end minus the total up to just before its start, because the shared front part cancels exactly. So instead of walking the range you look up two stored numbers and subtract. You pay O(n) time and O(n) memory once, and every question afterwards costs one step no matter how wide the range is.',
    visual: [
      {
        caption: 'The input, and the question we keep being asked.',
        frame: [
          'idx    0    1    2    3    4',
          'nums [ 3 ][ 1 ][ 4 ][ 1 ][ 5 ]',
          '',
          'what is the sum of indexes 1..3?',
          'walking it costs 3 additions, every single time',
        ].join('\n'),
      },
      {
        caption: 'Build the prefix array in one pass. Start with a leading zero.',
        frame: [
          'prefix[0] = 0            (no elements yet)',
          'prefix[1] = 0 + 3  =  3',
          'prefix[2] = 3 + 1  =  4',
          'prefix[3] = 4 + 4  =  8',
          'prefix[4] = 8 + 1  =  9',
          'prefix[5] = 9 + 5  = 14',
        ].join('\n'),
      },
      {
        caption: 'Line them up. prefix is one longer than nums, and shifted right by one.',
        frame: [
          'nums      [ 3 ][ 1 ][ 4 ][ 1 ][ 5 ]',
          'pre  [ 0 ][ 3 ][ 4 ][ 8 ][ 9 ][14 ]',
          '       0    1    2    3    4    5',
          '',
          'pre[i] = sum of the FIRST i elements',
        ].join('\n'),
      },
      {
        caption: 'The query resolves in one subtraction: sum of nums[1..3].',
        frame: [
          'pre  [ 0 ][ 3 ][ 4 ][ 8 ][ 9 ][14 ]',
          '            ^l=1           ^r+1=4',
          '',
          '9 - 3 = 6',
          'check by hand: 1 + 4 + 1 = 6   correct',
        ].join('\n'),
      },
      {
        caption: 'Why the subtraction is exactly right.',
        frame: [
          'pre[4] = 3 + 1 + 4 + 1     (indexes 0..3)',
          'pre[1] = 3                 (index 0)',
          '',
          'the shared 3 cancels, leaving 1 + 4 + 1,',
          'which is precisely indexes 1..3',
        ].join('\n'),
      },
      {
        caption: 'The famous extension: count subarrays whose sum is exactly k = 5.',
        frame: [
          'nums = [3, 1, 4, 1, 5], running prefix:',
          '  3    4    8    9    14',
          'start with seen = {0: 1}',
          'at  8: need  8-5= 3, seen once  ->  count 1',
          'at  9: need  9-5= 4, seen once  ->  count 2',
          'at 14: need 14-5= 9, seen once  ->  count 3',
        ].join('\n'),
      },
    ],
    pseudocode: `function buildPrefix(A):
    prefix = new array of length(A) + 1
    prefix[0] = 0                    // leading zero
    for i from 0 to length(A) - 1:
        prefix[i + 1] = prefix[i] + A[i]
    return prefix

function rangeSum(prefix, l, r):     // inclusive l..r
    return prefix[r + 1] - prefix[l]

// count subarrays whose sum is exactly k
function countSubarrays(A, k):
    seen = empty map from sum to how often it appeared
    seen[0] = 1                      // the empty prefix
    running = 0
    count = 0
    for each x in A:
        running = running + x
        if seen contains (running - k):
            count = count + seen[running - k]
        seen[running] = seen[running] + 1
    return count`,
    complexity: [
      { label: 'Build the prefix array', time: 'O(n)', space: 'O(n)', note: 'one pass, one extra array of n + 1 numbers' },
      { label: 'One range-sum query', time: 'O(1)', space: 'O(1)', note: 'a single subtraction of two stored values' },
      { label: 'Build plus q queries', time: 'O(n + q)', space: 'O(n)', note: 'beats the O(n * q) loop as soon as q grows' },
      { label: 'Count subarrays with sum k', time: 'O(n) average', space: 'O(n)', note: 'assumes hash map lookups are O(1), which needs a good hash' },
      { label: 'Update one element after building', time: 'O(n)', space: 'O(n)', note: 'every later prefix changes; use a Fenwick tree for O(log n) updates' },
    ],
    dryRun: {
      input: 'nums = [3, 1, 4, 1, 5], then query(1, 3) and query(0, 4)',
      goal: 'Answer both range sums with one subtraction each, after a single build pass.',
      steps: [
        { state: 'prefix=[0]', action: 'Start with the leading zero so that "the sum of the first 0 elements" has a real slot to live in.' },
        { state: 'prefix=[0,3]', action: 'Take x = 3 and append 0 + 3 = 3.' },
        { state: 'prefix=[0,3,4]', action: 'Take x = 1 and append 3 + 1 = 4.' },
        { state: 'prefix=[0,3,4,8]', action: 'Take x = 4 and append 4 + 4 = 8.' },
        { state: 'prefix=[0,3,4,8,9]', action: 'Take x = 1 and append 8 + 1 = 9.' },
        { state: 'prefix=[0,3,4,8,9,14]', action: 'Take x = 5 and append 9 + 5 = 14. The build is finished after exactly five additions.' },
        { state: 'query(1, 3): l=1 r=3', action: 'Return prefix[r + 1] - prefix[l] = prefix[4] - prefix[1] = 9 - 3 = 6.' },
        { state: 'query(0, 4): l=0 r=4', action: 'Return prefix[5] - prefix[0] = 14 - 0 = 14. The leading zero is what makes l = 0 need no special case.' },
      ],
      result:
        'The answers are 6 and 14. Check them by hand: nums[1] + nums[2] + nums[3] = 1 + 4 + 1 = 6, and the whole array is 3 + 1 + 4 + 1 + 5 = 14. Each query touched exactly two stored numbers, so a million queries would still cost about a million steps instead of a million times n.',
    },
    mistakes: [
      {
        mistake: 'Writing prefix[r] - prefix[l] for an inclusive range l..r.',
        why: 'With a leading zero, prefix[r] stops just before index r, so the element at r is dropped and every answer is short by one element. This is the number one prefix sum bug.',
        fix: 'Say the invariant out loud before you code: prefix[i] is the sum of the FIRST i elements. Then inclusive l..r must be prefix[r + 1] - prefix[l].',
      },
      {
        mistake: 'Building the prefix array without the leading zero.',
        why: 'Then a query with l = 0 needs its own special case, and people forget it, so the very first query of every test comes back wrong.',
        fix: 'Always make prefix one longer than nums, with prefix[0] = 0. The extra slot costs nothing and removes the branch.',
      },
      {
        mistake: 'Forgetting seen = {0: 1} in the count-subarrays-with-sum-k trick.',
        why: 'A subarray that starts at index 0 needs the empty prefix as the thing it subtracts. Without that entry every such subarray is missed, so the count is too low on exactly the cases the samples cover badly.',
        fix: 'Seed the map with one occurrence of the sum 0 before the loop starts.',
      },
      {
        mistake: 'Rebuilding the prefix array inside the query loop.',
        why: 'That puts the O(n) build back on every single query, so q queries cost O(n * q) again and the whole optimisation is gone even though the code looks right.',
        fix: 'Build once, outside. If the underlying array changes between queries, switch to a Fenwick (binary indexed) tree for O(log n) update and query.',
      },
      {
        mistake: 'Letting the running totals overflow in Java or C++.',
        why: '100000 values of up to 10^9 sum to 10^14, which does not fit in a 32-bit int. Python integers are unbounded so you may never see this locally, but interview code in Java or C++ will silently wrap.',
        fix: 'Declare the prefix array as long in Java or long long in C++.',
      },
    ],
    whenToUse: [
      'Many range-sum questions are asked about an array that never changes.',
      'The statement says "number of subarrays with sum equal to k" or "sum divisible by k".',
      'The statement says "pivot index", "equilibrium point", or "left sum equals right sum".',
      'The values may be negative and you still need subarray sums.',
      'You need the sum of a rectangle in a fixed matrix, which is the same idea in two dimensions.',
    ],
    whenNotToUse: [
      'The array changes between queries, use a Fenwick tree or a segment tree for O(log n) updates.',
      'You need the maximum or minimum of a range instead of the sum, use a sparse table or a segment tree.',
      'All values are non-negative and you want the best contiguous range, a sliding window does it in O(1) space.',
      'You will ask exactly one range sum, a plain loop is simpler and uses no extra memory.',
      'You need the single largest subarray sum rather than counting or querying, use Kadane.',
    ],
    relatedTopics: [
      { id: 'sliding-window', kind: 'concept', why: 'Windows and prefix sums split the same problem space: windows need non-negative values, prefix sums do not.' },
      { id: 'kadane-max-subarray', kind: 'concept', why: 'Kadane can be read as running prefix minus the smallest prefix seen so far.' },
      { id: 'hash-map-basics', kind: 'concept', why: 'The subarray-sum-equals-k trick is a prefix sum plus a frequency map of prefix values.' },
      { id: 'frequency-counting', kind: 'concept', why: 'Counting how often each prefix value has appeared is exactly frequency counting on derived data.' },
    ],
    quiz: [
      {
        question: 'prefix = [0, 3, 4, 8, 9, 14] was built from nums = [3, 1, 4, 1, 5]. What is the sum of nums[2..4]?',
        options: [
          'prefix[4] - prefix[2] = 5',
          'prefix[5] - prefix[2] = 10',
          'prefix[4] - prefix[1] = 6',
          'prefix[5] - prefix[3] = 6',
        ],
        answerIndex: 1,
        explanation: 'Inclusive l..r is prefix[r + 1] - prefix[l], so prefix[5] - prefix[2] = 14 - 4 = 10. Checking by hand, 4 + 1 + 5 = 10.',
      },
      {
        question: 'You build a prefix array once and then answer q range-sum queries. What is the total time?',
        options: ['O(n * q)', 'O(n + q)', 'O(q log n)', 'O(n log n + q)'],
        answerIndex: 1,
        explanation: 'The build is O(n) once and each query is a single subtraction, so the total is O(n + q). That is the whole point of precomputing.',
      },
      {
        question: 'nums = [2, -1, 3, -2, 4] and you must count the subarrays with sum exactly 3. Which technique fits?',
        options: [
          'A sliding window: grow while the sum is under 3 and shrink while it is above',
          'Prefix sums with a hash map, because the negative values break the sliding window rule',
          'Either one, they solve the same class of problems',
          'Sort the array first and then use two pointers',
        ],
        answerIndex: 1,
        explanation: 'With negative values, growing the window does not always raise the sum, so the window can skip answers. Prefix sums plus a count map stays correct and O(n).',
      },
      {
        question: 'Why does the counting trick start with seen = {0: 1}?',
        options: [
          'To avoid dividing by zero',
          'So that a subarray starting at index 0 has an empty prefix to subtract',
          'Because 0 always appears somewhere in the array',
          'To keep the map non-empty, which is faster',
        ],
        answerIndex: 1,
        explanation: 'A subarray from index 0 to r has sum prefix[r + 1] - prefix[0], and prefix[0] is 0, so that value must already be recorded once.',
      },
    ],
    sources: [
      'USACO Guide: Introduction to Prefix Sums, and More on Prefix Sums',
      'CSES Problem Set: Range Sum Queries I, Subarray Sums I and II, Subarray Divisibility',
      "Competitive Programmer's Handbook (CSES) ch. 9, range queries",
      'CP-Algorithms: Fenwick Tree',
      'LeetCode editorials: Range Sum Query Immutable, Subarray Sum Equals K, Contiguous Array',
    ],
  },
  {
    id: 'kadane-max-subarray',
    gateId: 'arrays-strings',
    order: 6,
    title: "Kadane's Algorithm: Maximum Subarray in One Pass",
    minutes: 25,
    summary: 'Find the contiguous subarray with the largest sum by asking at each element "extend the current run or start fresh here?"',
    analogy:
      'You are walking a trail collecting coins, but some spots take coins away. At every spot you decide: keep the streak you are on, or drop it and start counting fresh from this spot. You never need to look back; you only need the best streak so far and the current streak.',
    explanation: `The maximum subarray problem asks for the contiguous run of numbers with the biggest total. It sounds like it needs every possible range, but Kadane's algorithm solves it in one pass. It is also your first taste of dynamic programming: each step reuses the answer from the previous step.

## The idea

- Walk left to right and keep \`current\`: the best sum of a subarray that **ends at this index**.
- At each element x, either extend the previous run (\`current + x\`) or start a new run at x alone. Take the bigger: \`current = max(x, current + x)\`.
- Keep \`best\` as the largest \`current\` seen. That is the answer.

Why does this work? A negative running total can never help a future subarray. If \`current + x < x\`, the old run was dragging us down, so we drop it.

## A tiny example

\`nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\`.

The slow way tries every start and end:

\`\`\`python
def max_subarray(nums):
    best = float('-inf')
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            best = max(best, total)
    return best
\`\`\`

Nested loops: **O(n^2)**. (Recomputing the sum inside would even be O(n^3).)

The fast way:

\`\`\`python
def max_subarray(nums):
    current = best = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best
\`\`\`

Trace of \`current\`: -2, 1, -2, 4, 3, 5, 6, 1, 5. \`best\` reaches 6 from the run [4, -1, 2, 1]. One pass: **O(n)**, O(1) space.

## Step by step

1. Initialise \`current\` and \`best\` to the first element (not zero; the array may be all negative).
2. For each next element x: \`current = max(x, current + x)\`.
3. \`best = max(best, current)\`.
4. Return \`best\`. If you need the actual subarray, record the start index whenever you restart and the end index whenever best improves.

## Variations you will meet

- **Maximum product subarray**: keep both the max and min product ending here, because a negative times a negative becomes large.
- **Circular array**: the answer is either normal Kadane, or total minus the minimum subarray (the wrap-around case).
- **Best time to buy and sell stock**: run Kadane on the daily price differences.

## Where people go wrong

- Starting \`best = 0\`. For \`[-3, -1, -2]\` the answer is -1, not 0.
- Resetting \`current\` to 0 instead of to x. Same all-negative bug.
- Confusing this with sliding window. Kadane has no explicit left pointer; it "restarts" implicitly when the running sum would hurt.
- Trying to apply it to "subsequence" problems. Kadane is only for contiguous ranges.

## How to recognise it in an interview

- "Maximum sum of a contiguous subarray" or "largest sum of consecutive elements".
- "Maximum product subarray", "maximum circular subarray sum" are named variants.
- Any time you can phrase the question as "best value ending at index i depends only on the best value ending at i - 1", you are in Kadane territory.`,
    naive: {
      title: 'Try every start and end',
      description:
        'For each start index, extend the end index one at a time while keeping a running sum, and remember the largest. It examines every one of the n^2 / 2 ranges.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def max_subarray(nums):
    best = float('-inf')
    n = len(nums)
    for i in range(n):
        total = 0
        for j in range(i, n):
            total += nums[j]
            best = max(best, total)
    return best

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6`,
        javascript: `function maxSubarray(nums) {
  let best = -Infinity;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let total = 0;
    for (let j = i; j < n; j++) {
      total += nums[j];
      best = Math.max(best, total);
    }
  }
  return best;
}

console.log(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`,
        java: `public class Solution {
  public static int maxSubarray(int[] nums) {
    int best = Integer.MIN_VALUE;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
      int total = 0;
      for (int j = i; j < n; j++) {
        total += nums[j];
        best = Math.max(best, total);
      }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxSubarray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>

int maxSubarray(const std::vector<int>& nums) {
  int best = INT_MIN;
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    int total = 0;
    for (int j = i; j < n; j++) {
      total += nums[j];
      best = std::max(best, total);
    }
  }
  return best;
}

int main() {
  std::cout << maxSubarray({-2, 1, -3, 4, -1, 2, 1, -5, 4}) << std::endl; // 6
  return 0;
}`,
      },
    },
    optimized: {
      title: "Kadane: extend or restart at each element",
      description:
        'Keep the best sum of a run ending at the current index. If adding the current element to the previous run is worse than the element alone, restart. Track the global best as you go.',
      time: 'O(n)',
      space: 'O(1)',
      code: {
        python: `def max_subarray(nums):
    current = best = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6`,
        javascript: `function maxSubarray(nums) {
  let current = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}

console.log(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`,
        java: `public class Solution {
  public static int maxSubarray(int[] nums) {
    int current = nums[0];
    int best = nums[0];
    for (int i = 1; i < nums.length; i++) {
      current = Math.max(nums[i], current + nums[i]);
      best = Math.max(best, current);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxSubarray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
  }
}`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>

int maxSubarray(const std::vector<int>& nums) {
  int current = nums[0];
  int best = nums[0];
  for (size_t i = 1; i < nums.size(); i++) {
    current = std::max(nums[i], current + nums[i]);
    best = std::max(best, current);
  }
  return best;
}

int main() {
  std::cout << maxSubarray({-2, 1, -3, 4, -1, 2, 1, -5, 4}) << std::endl; // 6
  return 0;
}`,
      },
    },
    whyFaster:
      'The nested loop looks at every one of the roughly n^2 / 2 ranges. Kadane observes that the best run ending at index i is fully determined by the best run ending at i - 1, so there is no need to revisit earlier starts. One decision per element turns O(n^2) into O(n) with two variables of memory.',
    keyPoints: [
      'current = max(x, current + x): extend the run or restart at x.',
      'best is the largest current seen; initialise both to nums[0], never to 0.',
      'A negative running total can never help later, which is why restarting is safe.',
      'Variants: product (track min and max), circular (total minus min subarray), stock profit (Kadane on differences).',
      'This is the simplest dynamic programming idea: the answer at i depends only on the answer at i - 1.',
    ],
    patternIds: ['kadane', 'dp-1d'],
    problems: [
      {
        id: 'maximum-subarray',
        title: 'Maximum Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-subarray/',
        patternId: 'kadane',
        hint: 'At each index keep the best sum ending there: max(x, previous + x).',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'maximum-product-subarray',
        title: 'Maximum Product Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-product-subarray/',
        patternId: 'kadane',
        hint: 'Track both the largest and smallest product ending here; a negative number swaps their roles.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'maximum-sum-circular-subarray',
        title: 'Maximum Sum Circular Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/',
        patternId: 'kadane',
        hint: 'Answer is max(normal Kadane, total - minimum subarray sum), unless every number is negative.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'longest-turbulent-subarray',
        title: 'Longest Turbulent Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-turbulent-subarray/',
        patternId: 'kadane',
        hint: 'Keep the length of the run ending here for "last step was up" and "last step was down"; extend or restart.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'maximum-absolute-sum-of-any-subarray',
        title: 'Maximum Absolute Sum of Any Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/',
        patternId: 'kadane',
        hint: 'Run Kadane twice, once for the maximum sum and once for the minimum sum, and take the larger absolute value.',
        xp: 40,
        tier: 'advanced',
      },
    ],
    definition:
      "Kadane's algorithm finds the contiguous subarray with the largest sum in one left-to-right pass, holding only two numbers: the best sum of a subarray that ends at the current index, and the best sum seen anywhere so far.",
    coreIdea:
      'The best subarray ending at index i is either the best one ending at i - 1 stretched to include nums[i], or nums[i] standing alone. Nothing else is possible, because any run that ends at i is some run ending at i - 1 plus nums[i], or just nums[i] by itself. That single fact removes any need to revisit earlier start positions, so the roughly n^2 / 2 candidate ranges collapse into n small decisions.',
    visual: [
      {
        caption: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]. Start both counters at nums[0].',
        frame: [
          'idx   0    1    2    3    4    5    6    7    8',
          'val [-2 ][ 1 ][-3 ][ 4 ][-1 ][ 2 ][ 1 ][-5 ][ 4 ]',
          '      ^',
          'cur = -2      best = -2',
        ].join('\n'),
      },
      {
        caption: 'At index 1 the old run is negative, so it is dropped: restart.',
        frame: [
          'idx   0    1    2    3    4    5    6    7    8',
          'val [-2 ][ 1 ][-3 ][ 4 ][-1 ][ 2 ][ 1 ][-5 ][ 4 ]',
          '           ^',
          'cur + x = -2 + 1 = -1   vs   x = 1   ->  restart',
          'cur = 1       best = 1',
        ].join('\n'),
      },
      {
        caption: 'Indexes 2 and 3: extend once, then restart when the run turns bad.',
        frame: [
          'i=2:  cur = max(-3,  1 + -3 = -2) = -2   best = 1',
          'i=3:  cur = max( 4, -2 +  4 =  2) =  4   best = 4',
          '',
          'at i=3 the losing run is thrown away and',
          'a fresh run begins at the value 4',
        ].join('\n'),
      },
      {
        caption: 'Indexes 4 to 6: the run grows, and best follows it up.',
        frame: [
          'i=4:  cur = max(-1, 4 + -1 = 3) = 3      best = 4',
          'i=5:  cur = max( 2, 3 +  2 = 5) = 5      best = 5',
          'i=6:  cur = max( 1, 5 +  1 = 6) = 6      best = 6',
          '',
          'best only ever moves up, never down',
        ].join('\n'),
      },
      {
        caption: 'Indexes 7 and 8: cur dips and recovers, but never beats 6 again.',
        frame: [
          'i=7:  cur = max(-5, 6 + -5 =  1) = 1     best = 6',
          'i=8:  cur = max( 4, 1 +  4 =  5) = 5     best = 6',
          '',
          'full cur trace: -2 1 -2 4 3 5 6 1 5',
          'full best trace: -2 1  1 4 4 5 6 6 6',
        ].join('\n'),
      },
      {
        caption: 'The winning run, found without ever looking backwards.',
        frame: [
          'idx   0    1    2    3    4    5    6    7    8',
          'val [-2 ][ 1 ][-3 ][ 4 ][-1 ][ 2 ][ 1 ][-5 ][ 4 ]',
          '                   |<--- best run --->|',
          'answer = 4 + -1 + 2 + 1 = 6, indexes 3..6',
        ].join('\n'),
      },
    ],
    pseudocode: `function maxSubarraySum(A):
    current = A[0]     // best sum of a run ending here
    best = A[0]        // best sum seen anywhere so far
    for i from 1 to length(A) - 1:
        if current + A[i] > A[i]:
            current = current + A[i]   // extend the run
        else:
            current = A[i]             // restart at A[i]
        if current > best:
            best = current
    return best

// same idea, but also reporting where the run sits
function maxSubarrayRange(A):
    current = A[0], best = A[0]
    start = 0, bestLeft = 0, bestRight = 0
    for i from 1 to length(A) - 1:
        if current + A[i] > A[i]:
            current = current + A[i]
        else:
            current = A[i]
            start = i                  // a new run begins
        if current > best:
            best = current
            bestLeft = start
            bestRight = i
    return (best, bestLeft, bestRight)`,
    complexity: [
      { label: 'Kadane, single pass', time: 'O(n)', space: 'O(1)', note: 'two variables, no extra array' },
      { label: 'Brute force with a running sum', time: 'O(n^2)', space: 'O(1)', note: 'n start points times n end points' },
      { label: 'Brute force re-adding each range', time: 'O(n^3)', space: 'O(1)', note: 'a third loop just to total the range' },
      { label: 'Divide and conquer (the CLRS version)', time: 'O(n log n)', space: 'O(log n)', note: 'recursion stack; the crossing case merges in O(n)' },
      { label: 'Maximum product subarray variant', time: 'O(n)', space: 'O(1)', note: 'track both max and min ending here, a negative swaps them' },
    ],
    dryRun: {
      input: 'nums = [4, -1, 2, -7, 3]',
      goal: 'Find the largest sum of any run of neighbouring numbers, in one pass.',
      steps: [
        { state: 'current=4 best=4 (i=0)', action: 'Both start at nums[0] = 4, never at 0. Starting at nums[0] is what keeps all-negative arrays correct.' },
        { state: 'i=1 x=-1', action: 'current + x = 3 versus x alone = -1. Extending wins, so current = 3. best stays 4.' },
        { state: 'i=2 x=2', action: 'current + x = 5 versus x alone = 2. Extending wins, so current = 5. That beats 4, so best = 5.' },
        { state: 'i=3 x=-7', action: 'current + x = -2 versus x alone = -7. Extending is still the lesser evil, so current = -2. best stays 5.' },
        { state: 'i=4 x=3', action: 'current + x = 1 versus x alone = 3. Starting fresh wins, so current = 3 and the old losing run is dropped for good.' },
        { state: 'current=3 best=5', action: '3 does not beat 5, and the array is finished, so return best.' },
      ],
      result:
        'best = 5, from the run [4, -1, 2] at indexes 0..2. Check it by hand: [4] = 4, [4,-1] = 3, [4,-1,2] = 5, [2] = 2, [-7] = -7, [3] = 3, and no other contiguous run beats 5. Five decisions, one per element: O(n) time and O(1) space.',
    },
    mistakes: [
      {
        mistake: 'Initialising best = 0 (or current = 0) before the loop.',
        why: 'For an all-negative array such as [-3, -1, -2] the true answer is -1, but starting at 0 returns 0, which is the sum of the empty subarray. Almost every version of the problem requires at least one element.',
        fix: 'Set both current and best to nums[0] and begin the loop at index 1.',
      },
      {
        mistake: 'Resetting current to 0 after a bad run instead of to nums[i].',
        why: 'It is the same all-negative bug in disguise, and it breaks the invariant that current is the best sum of a run ENDING at i, because an empty run does not end at i.',
        fix: 'Write current = max(nums[i], current + nums[i]) and nothing else.',
      },
      {
        mistake: 'Updating best before recomputing current for the current index.',
        why: 'best then lags one element behind, so the very last element can never contribute to the answer and inputs whose best run touches the end come back wrong.',
        fix: 'Recompute current for index i first, then compare current with best in that same iteration.',
      },
      {
        mistake: 'Applying Kadane to a problem about subsequences.',
        why: 'The whole argument depends on runs being contiguous. If you are allowed to skip elements the answer is simply the sum of the positive numbers, which is a different, easier question.',
        fix: 'Read the statement for the word "subarray" or "contiguous" before reaching for Kadane. "Subsequence" means a different technique.',
      },
      {
        mistake: 'On the circular variant, forgetting the all-negative case.',
        why: 'The wrap-around answer is total - (minimum subarray sum), but when every value is negative the minimum subarray is the whole array, so that formula returns 0, the empty subarray again.',
        fix: 'If the plain Kadane answer is negative, return it directly instead of the wrap-around value.',
      },
    ],
    whenToUse: [
      'The statement says "maximum sum of a contiguous subarray" or "largest sum of consecutive elements".',
      'You can phrase the problem as "the best answer ending at i depends only on the best answer ending at i - 1".',
      'It is one of the named variants: maximum product subarray, maximum circular subarray sum, longest turbulent subarray.',
      'A stock problem where the answer is really the best run of daily differences.',
      'Values may be negative and you need one best range, not a count of ranges.',
    ],
    whenNotToUse: [
      'You need how many subarrays reach an exact sum, use prefix sums with a hash map.',
      'You need the sum of an arbitrary range chosen later, build a prefix sum array.',
      'The chosen elements need not be adjacent, that is a different dynamic programming problem.',
      'All values are non-negative and you want the shortest range hitting a target, use a sliding window.',
      'You need the maximum inside every window of a fixed size k, use a monotonic deque.',
    ],
    relatedTopics: [
      { id: 'dp-1d', kind: 'concept', why: 'Kadane is the smallest one-dimensional dynamic program there is: one state, one transition, no table.' },
      { id: 'prefix-sums', kind: 'concept', why: 'The same answer can be written as running prefix minus the smallest prefix seen so far.' },
      { id: 'sliding-window', kind: 'concept', why: 'Both scan contiguous ranges, but Kadane restarts implicitly instead of shrinking from the left.' },
      { id: 'divide-and-conquer', kind: 'pattern', why: 'The textbook O(n log n) solution splits the array and merges a crossing case; Kadane beats it with one pass.' },
    ],
    quiz: [
      {
        question: 'nums = [-3, -1, -2]. What does correct Kadane return, and what would a version that starts with best = 0 return?',
        options: ['-1 and -1', '-1 and 0', '0 and 0', '-6 and 0'],
        answerIndex: 1,
        explanation: 'The best contiguous run is the single element -1. Starting best at 0 wrongly allows the empty subarray as an answer.',
      },
      {
        question: 'What are the time and space costs of Kadane?',
        options: [
          'O(n log n) time and O(log n) space',
          'O(n) time and O(n) space',
          'O(n) time and O(1) space',
          'O(n^2) time and O(1) space',
        ],
        answerIndex: 2,
        explanation: 'One pass over the array, and only current and best are ever stored, so memory does not grow with n at all.',
      },
      {
        question: 'From [3, -1, 4, -2] you may pick any elements, and they do NOT have to be next to each other. Does Kadane answer this?',
        options: [
          'Yes, it returns 6',
          'No; without the contiguity rule the answer is just the sum of the positive values, 7, so this is not a Kadane problem',
          'Yes, but you must sort the array first',
          'No, use a sliding window instead',
        ],
        answerIndex: 1,
        explanation: 'Kadane returns 6, the best contiguous run [3, -1, 4]. But 3 + 4 = 7 is allowed here, which shows the problem is a different one.',
      },
      {
        question: 'Why is it safe to throw away the previous run when current + x is less than x?',
        options: [
          'Because x is guaranteed to be positive',
          'Because current must then be negative, and a negative running total can only reduce every later sum',
          'Because the array is sorted',
          'Because best has already been recorded',
        ],
        answerIndex: 1,
        explanation: 'current + x < x means current < 0. Carrying a negative total forward can never help any subarray that extends past this point.',
      },
    ],
    sources: [
      'CLRS ch. 4, the maximum-subarray problem and its linear-time exercise',
      'MIT 6.006 and 6.046: divide and conquer versus dynamic programming',
      'USACO Guide: Introduction to Prefix Sums, maximum subarray sum section',
      'CSES Problem Set: Maximum Subarray Sum',
      'LeetCode editorials: Maximum Subarray, Maximum Product Subarray, Maximum Sum Circular Subarray',
    ],
  },
]
