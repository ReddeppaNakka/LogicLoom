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
      },
      {
        id: 'remove-duplicates-from-sorted-array',
        title: 'Remove Duplicates from Sorted Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
        patternId: 'two-pointers',
        hint: 'Keep a write index; only copy a value forward when it differs from the last written one.',
        xp: 20,
      },
      {
        id: 'rotate-array',
        title: 'Rotate Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/rotate-array/',
        patternId: 'in-place-reversal',
        hint: 'Reverse everything, then reverse the first k, then reverse the rest.',
        xp: 40,
      },
      {
        id: 'product-of-array-except-self',
        title: 'Product of Array Except Self',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/product-of-array-except-self/',
        patternId: 'prefix-sum',
        hint: 'Answer[i] is (product of everything left of i) times (product of everything right of i); build each side in one pass.',
        xp: 40,
      },
      {
        id: 'spiral-matrix',
        title: 'Spiral Matrix',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/spiral-matrix/',
        patternId: 'brute-force',
        hint: 'Keep four boundaries (top, bottom, left, right) and shrink one after each side is walked.',
        xp: 40,
      },
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
      },
      {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-anagram/',
        patternId: 'hash-map',
        hint: 'Count letters of one string up and the other down; every count must end at zero.',
        xp: 20,
      },
      {
        id: 'first-unique-character-in-a-string',
        title: 'First Unique Character in a String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/first-unique-character-in-a-string/',
        patternId: 'hash-map',
        hint: 'One pass to count every letter, a second pass to find the first letter whose count is 1.',
        xp: 20,
      },
      {
        id: 'find-the-index-of-the-first-occurrence-in-a-string',
        title: 'Find the Index of the First Occurrence in a String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
        patternId: 'brute-force',
        hint: 'Try every start position and compare the needle character by character; note the O(n * m) cost.',
        xp: 20,
      },
      {
        id: 'string-compression',
        title: 'String Compression',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/string-compression/',
        patternId: 'two-pointers',
        hint: 'Use a read pointer to measure each run and a write pointer to overwrite the array in place.',
        xp: 40,
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/group-anagrams/',
        patternId: 'hash-map',
        hint: 'Anagrams share the same sorted string or the same 26-count signature; use that as the map key.',
        xp: 40,
      },
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
      },
      {
        id: 'squares-of-a-sorted-array',
        title: 'Squares of a Sorted Array',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
        patternId: 'two-pointers',
        hint: 'The largest square is at one of the two ends; fill the result from the back.',
        xp: 20,
      },
      {
        id: 'move-zeroes',
        title: 'Move Zeroes',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/move-zeroes/',
        patternId: 'two-pointers',
        hint: 'A slow pointer marks where the next non-zero goes; a fast pointer scans and swaps.',
        xp: 20,
      },
      {
        id: 'two-sum-ii-input-array-is-sorted',
        title: 'Two Sum II - Input Array Is Sorted',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
        patternId: 'two-pointers',
        hint: 'Too small a sum means move left up; too big means move right down.',
        xp: 40,
      },
      {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/container-with-most-water/',
        patternId: 'two-pointers',
        hint: 'Area is limited by the shorter wall, so always move the pointer at the shorter wall inward.',
        xp: 40,
      },
      {
        id: '3sum',
        title: '3Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/3sum/',
        patternId: 'two-pointers',
        hint: 'Sort, fix one number, then run two-pointer two-sum on the rest; skip duplicate values.',
        xp: 40,
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/trapping-rain-water/',
        patternId: 'two-pointers',
        hint: 'Water at a position depends on the smaller of the max heights on each side; move the side with the smaller max.',
        xp: 80,
      },
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
      },
      {
        id: 'best-time-to-buy-and-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        patternId: 'sliding-window',
        hint: 'Keep the lowest price seen so far as the left edge; each day check the profit from selling now.',
        xp: 20,
      },
      {
        id: 'longest-substring-without-repeating-characters',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        patternId: 'sliding-window',
        hint: 'Grow right; when a character repeats, move left past its previous position.',
        xp: 40,
      },
      {
        id: 'max-consecutive-ones-iii',
        title: 'Max Consecutive Ones III',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
        patternId: 'sliding-window',
        hint: 'Count zeroes in the window; shrink from the left whenever that count exceeds k.',
        xp: 40,
      },
      {
        id: 'permutation-in-string',
        title: 'Permutation in String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/permutation-in-string/',
        patternId: 'sliding-window',
        hint: 'Slide a window the length of s1 over s2 and compare 26-letter counts as you go.',
        xp: 40,
      },
      {
        id: 'minimum-size-subarray-sum',
        title: 'Minimum Size Subarray Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
        patternId: 'sliding-window',
        hint: 'Grow until the sum reaches the target, then shrink from the left while it still does, recording the length.',
        xp: 40,
      },
      {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/minimum-window-substring/',
        patternId: 'sliding-window',
        hint: 'Keep a count map of needed characters and a counter of how many are satisfied; shrink whenever all are.',
        xp: 80,
      },
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
      },
      {
        id: 'find-pivot-index',
        title: 'Find Pivot Index',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/find-pivot-index/',
        patternId: 'prefix-sum',
        hint: 'Right sum equals total minus left sum minus the current element; check as you scan.',
        xp: 20,
      },
      {
        id: 'range-sum-query-immutable',
        title: 'Range Sum Query - Immutable',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/range-sum-query-immutable/',
        patternId: 'prefix-sum',
        hint: 'Precompute prefix sums in the constructor so sumRange is one subtraction.',
        xp: 20,
      },
      {
        id: 'subarray-sum-equals-k',
        title: 'Subarray Sum Equals K',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
        patternId: 'prefix-sum',
        hint: 'While scanning, count how many earlier prefix values equal current prefix minus k.',
        xp: 40,
      },
      {
        id: 'contiguous-array',
        title: 'Contiguous Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/contiguous-array/',
        patternId: 'prefix-sum',
        hint: 'Treat 0 as -1; equal counts of 0 and 1 means the prefix sum repeats, so store first index of each prefix value.',
        xp: 40,
      },
      {
        id: 'range-sum-query-2d-immutable',
        title: 'Range Sum Query 2D - Immutable',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/range-sum-query-2d-immutable/',
        patternId: 'prefix-sum',
        hint: 'Store the sum of the rectangle from (0,0) to (i,j); a query subtracts two overlapping strips and adds back the corner.',
        xp: 40,
      },
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
      },
      {
        id: 'maximum-product-subarray',
        title: 'Maximum Product Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-product-subarray/',
        patternId: 'kadane',
        hint: 'Track both the largest and smallest product ending here; a negative number swaps their roles.',
        xp: 40,
      },
      {
        id: 'maximum-sum-circular-subarray',
        title: 'Maximum Sum Circular Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/',
        patternId: 'kadane',
        hint: 'Answer is max(normal Kadane, total - minimum subarray sum), unless every number is negative.',
        xp: 40,
      },
      {
        id: 'longest-turbulent-subarray',
        title: 'Longest Turbulent Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-turbulent-subarray/',
        patternId: 'kadane',
        hint: 'Keep the length of the run ending here for "last step was up" and "last step was down"; extend or restart.',
        xp: 40,
      },
      {
        id: 'maximum-absolute-sum-of-any-subarray',
        title: 'Maximum Absolute Sum of Any Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/',
        patternId: 'kadane',
        hint: 'Run Kadane twice, once for the maximum sum and once for the minimum sum, and take the larger absolute value.',
        xp: 40,
      },
    ],
  },
]
