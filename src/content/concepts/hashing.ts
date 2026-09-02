import type { Concept } from '../types'

export const concepts: Concept[] = [
  {
    id: 'hash-map-basics',
    gateId: 'hashing',
    order: 1,
    title: 'Hash Map Basics: O(1) Lookups',
    minutes: 25,
    summary: 'A hash map turns "have I seen this before?" from a full scan into a single instant check.',
    analogy:
      'Think of a coat check at a restaurant. You hand over your coat and get ticket number 42. Later you show the ticket and the staff walk straight to hook 42. Nobody searches every coat on the rack. The ticket number is the hash, and the hook is the bucket.',
    explanation: `A hash map (Python \`dict\`, JavaScript \`Map\`, Java \`HashMap\`, C++ \`unordered_map\`) stores key to value pairs and finds a key in about O(1) time. That one fact is the engine behind most O(n) solutions to "find a pair", "find a duplicate" and "count things" problems. If you learn only one data structure for interviews, learn this one.

## The idea

- A hash function turns a key (a number, a string) into a bucket index.
- Insert, lookup and delete all go straight to that bucket. Average cost: O(1).
- A hash set is the same thing with no values, just "is this key present?".
- The price is memory: you store every key you want to remember. Time goes down, space goes up.

## A tiny example

Two Sum: given \`nums = [2, 7, 11, 15]\` and \`target = 9\`, return the two indices that add to 9.

The slow way checks every pair. For each \`i\`, loop over every \`j > i\` and test \`nums[i] + nums[j] == target\`. With 4 numbers that is 6 checks. With 10,000 numbers it is about 50 million. That is O(n^2).

The fast way asks a different question. Standing at 7, what number do I need? \`9 - 7 = 2\`. Have I already seen 2? If a map remembers every number I have walked past and its index, that question costs O(1).

\`\`\`python
def two_sum(nums, target):
    seen = {}  # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
\`\`\`

One pass, one map, O(n) time and O(n) space.

## Step by step

- Walk the input once.
- Before storing the current item, ask the map the question you care about ("have I seen the partner?").
- Then store the current item so future items can find it.
- Storing after asking prevents matching an element with itself.

## Where people go wrong

- Using a list for "is x present?". \`x in some_list\` is O(n), which quietly makes your loop O(n^2). Use a set or dict.
- Forgetting that keys must be hashable. In Python a list cannot be a key; convert it to a tuple or a string first.
- Trusting order. A Python dict keeps insertion order, but a Java \`HashMap\` and C++ \`unordered_map\` do not. Never rely on it in an interview.
- Assuming worst case is O(1). With terrible hashing it can degrade, but for interview purposes say "O(1) average".

## How to recognise it in an interview

- "Find two numbers that add up to..." or "find a pair with difference k".
- "Does the array contain a duplicate?" or "return the first repeated element".
- "Group items that share some property" (anagrams, same digit sum).
- Any time you are about to write a nested loop just to look something up again, stop and ask: can a map remember it for me?`,
    naive: {
      title: 'Brute force: check every pair',
      description:
        'For each element, scan every element after it and test whether the two add up to the target. Simple, but the number of pairs grows with the square of the input size.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def two_sum_slow(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
        javascript: `function twoSumSlow(nums, target) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
        java: `public int[] twoSumSlow(int[] nums, int target) {
  int n = nums.length;
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] == target) return new int[] {i, j};
    }
  }
  return new int[0];
}`,
        cpp: `vector<int> twoSumSlow(vector<int>& nums, int target) {
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] == target) return {i, j};
    }
  }
  return {};
}`,
      },
    },
    optimized: {
      title: 'One pass with a hash map',
      description:
        'Walk the array once. For each number, compute the partner it needs and ask the map whether that partner was already seen. Then record the current number for later elements.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return []`,
        javascript: `function twoSum(nums, target) {
  const seen = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
        java: `public int[] twoSum(int[] nums, int target) {
  Map<Integer, Integer> seen = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[] {seen.get(need), i};
    seen.put(nums[i], i);
  }
  return new int[0];
}`,
        cpp: `vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int, int> seen; // value -> index
  for (int i = 0; i < (int)nums.size(); i++) {
    int need = target - nums[i];
    if (seen.count(need)) return {seen[need], i};
    seen[nums[i]] = i;
  }
  return {};
}`,
      },
    },
    whyFaster:
      'The brute force re-scans the array for every element, so the work is n times n. The hash map replaces each inner scan with one O(1) lookup, so the total is n times 1. We paid for that with O(n) extra memory to remember what we walked past.',
    keyPoints: [
      'Hash map insert, lookup and delete are O(1) on average.',
      'Ask the map your question first, then store the current item.',
      'A set is a hash map with no values; use it for "have I seen this?".',
      '"x in list" is O(n); "x in set" is O(1). This one swap fixes many slow solutions.',
      'Keys must be hashable: numbers, strings, tuples. Not lists.',
      'You trade extra memory for speed. Say that trade out loud in an interview.',
    ],
    patternIds: ['hash-map'],
    problems: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/two-sum/',
        patternId: 'hash-map',
        hint: 'For each number, ask the map whether target minus that number was already seen.',
        xp: 20,
      },
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/contains-duplicate/',
        patternId: 'hash-map',
        hint: 'Add each number to a set and stop the moment you try to add one that is already there.',
        xp: 20,
      },
      {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-anagram/',
        patternId: 'hash-map',
        hint: 'Two strings are anagrams when their letter counts are identical; compare the count maps.',
        xp: 20,
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/group-anagrams/',
        patternId: 'hash-map',
        hint: 'Build a key that is the same for all anagrams (sorted letters or a 26-count tuple) and group by it.',
        xp: 40,
      },
      {
        id: 'longest-consecutive-sequence',
        title: 'Longest Consecutive Sequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
        patternId: 'hash-map',
        hint: 'Put everything in a set; only start counting upward from numbers whose predecessor is missing.',
        xp: 40,
      },
    ],
  },
  {
    id: 'frequency-counting',
    gateId: 'hashing',
    order: 2,
    title: 'Frequency Counting',
    minutes: 25,
    summary: 'Count how many times each item appears in one pass, then answer almost any "most", "unique" or "anagram" question instantly.',
    analogy:
      'A teacher taking attendance does not walk the whole room every time someone asks "is Priya here?". She ticks a sheet once at the start. After that, every question is a glance at the sheet. A frequency map is that attendance sheet for your data.',
    explanation: `Frequency counting means building a map from each item to how many times it occurs. It sounds too simple to be a technique, but it is the secret inside a huge number of medium problems: anagrams, majority element, first unique character, top-K frequent, and the whole family of sliding window string problems. Count once, then answer questions cheaply.

## The idea

- Walk the input once and do \`count[x] += 1\` for every item.
- Now \`count[x]\` answers "how many x?" in O(1).
- Two collections are anagrams (same multiset) exactly when their count maps are equal.
- For small alphabets (26 lowercase letters, 10 digits) a fixed-size array works as the map and is even faster.

## A tiny example

First unique character in \`"leetcode"\`.

The slow way: for each character, scan the whole string to see if it appears again. For \`"l"\` we scan 8 characters and find no other \`l\`, so the answer is index 0. In the worst case, like \`"aabbccdd"\`, every character forces a full scan. That is O(n^2).

The fast way: count first, then look.

\`\`\`python
def first_unique(s):
    count = {}
    for ch in s:
        count[ch] = count.get(ch, 0) + 1
    for i, ch in enumerate(s):
        if count[ch] == 1:
            return i
    return -1
\`\`\`

Two passes, each O(n). Total O(n) time, and the map holds at most 26 keys so space is O(1) for lowercase input.

## Step by step

- Decide what you are counting: characters, numbers, words, or something derived like "digit sum".
- Pick the container: a dict for anything, a 26-slot array for lowercase letters.
- Build the counts in one pass.
- Answer the question from the counts. Sometimes that is a second pass, sometimes a comparison of two count maps.

## Where people go wrong

- Sorting to compare anagrams. It works, but it is O(n log n) and the count approach is O(n). Mention both, code the faster one.
- Forgetting to decrement. In sliding window problems the window moves, so you must \`count[left_char] -= 1\` as the left edge passes.
- Comparing maps that hold zeros. \`{'a': 0}\` and \`{}\` are not equal in Python. Delete keys that reach zero, or use fixed arrays.
- Using \`count[x]\` on a missing key. Use \`count.get(x, 0)\`, \`collections.Counter\`, or \`defaultdict(int)\`.

## How to recognise it in an interview

- The words "anagram", "permutation of", "same letters".
- "Most frequent", "appears more than n/2 times", "first non-repeating".
- "Contains all characters of t" or "can be built from the letters in magazine".
- Any question where the order of items does not matter but their counts do.`,
    naive: {
      title: 'Scan the whole string for every character',
      description:
        'For each position, look through the entire string to see whether that character appears anywhere else. The first character with no twin is the answer.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def first_unique_slow(s):
    n = len(s)
    for i in range(n):
        repeated = False
        for j in range(n):
            if i != j and s[i] == s[j]:
                repeated = True
                break
        if not repeated:
            return i
    return -1`,
        javascript: `function firstUniqueSlow(s) {
  const n = s.length;
  for (let i = 0; i < n; i++) {
    let repeated = false;
    for (let j = 0; j < n; j++) {
      if (i !== j && s[i] === s[j]) { repeated = true; break; }
    }
    if (!repeated) return i;
  }
  return -1;
}`,
        java: `public int firstUniqueSlow(String s) {
  int n = s.length();
  for (int i = 0; i < n; i++) {
    boolean repeated = false;
    for (int j = 0; j < n; j++) {
      if (i != j && s.charAt(i) == s.charAt(j)) { repeated = true; break; }
    }
    if (!repeated) return i;
  }
  return -1;
}`,
        cpp: `int firstUniqueSlow(const string& s) {
  int n = s.size();
  for (int i = 0; i < n; i++) {
    bool repeated = false;
    for (int j = 0; j < n; j++) {
      if (i != j && s[i] == s[j]) { repeated = true; break; }
    }
    if (!repeated) return i;
  }
  return -1;
}`,
      },
    },
    optimized: {
      title: 'Count once, then answer',
      description:
        'Build a frequency map of every character in one pass. Then walk the string a second time and return the first index whose character has a count of exactly one.',
      time: 'O(n)',
      space: 'O(1) for a fixed alphabet, O(k) for k distinct keys',
      code: {
        python: `def first_unique(s):
    count = {}
    for ch in s:
        count[ch] = count.get(ch, 0) + 1
    for i, ch in enumerate(s):
        if count[ch] == 1:
            return i
    return -1`,
        javascript: `function firstUnique(s) {
  const count = new Map();
  for (const ch of s) count.set(ch, (count.get(ch) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (count.get(s[i]) === 1) return i;
  }
  return -1;
}`,
        java: `public int firstUnique(String s) {
  int[] count = new int[26];
  for (char c : s.toCharArray()) count[c - 'a']++;
  for (int i = 0; i < s.length(); i++) {
    if (count[s.charAt(i) - 'a'] == 1) return i;
  }
  return -1;
}`,
        cpp: `int firstUnique(const string& s) {
  int count[26] = {0};
  for (char c : s) count[c - 'a']++;
  for (int i = 0; i < (int)s.size(); i++) {
    if (count[s[i] - 'a'] == 1) return i;
  }
  return -1;
}`,
      },
    },
    whyFaster:
      'The slow version answers "does this character repeat?" by rescanning the string, so each of the n characters costs n work. The fast version answers the same question in O(1) by reading a count that was built once. Two linear passes replace one quadratic pass.',
    keyPoints: [
      'Build the count map in one pass; every later question about counts is O(1).',
      'Equal count maps means anagram. No sorting needed.',
      'For lowercase letters a 26-slot array beats a dict: faster and O(1) space.',
      'In sliding windows, decrement counts as the left edge moves and drop keys that hit zero.',
      'Use Counter or defaultdict(int) so missing keys read as zero.',
    ],
    patternIds: ['hash-map', 'sliding-window'],
    problems: [
      {
        id: 'majority-element',
        title: 'Majority Element',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/majority-element/',
        patternId: 'hash-map',
        hint: 'Count every value and return the one whose count passes n/2; then read about Boyer-Moore for O(1) space.',
        xp: 20,
      },
      {
        id: 'first-unique-character-in-a-string',
        title: 'First Unique Character in a String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/first-unique-character-in-a-string/',
        patternId: 'hash-map',
        hint: 'Count all characters first, then scan again for the first one with count 1.',
        xp: 20,
      },
      {
        id: 'ransom-note',
        title: 'Ransom Note',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/ransom-note/',
        patternId: 'hash-map',
        hint: 'Count the magazine letters, then spend them one by one while reading the note.',
        xp: 20,
      },
      {
        id: 'find-all-anagrams-in-a-string',
        title: 'Find All Anagrams in a String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
        patternId: 'sliding-window',
        hint: 'Slide a window of length p over s and keep its letter counts updated; compare to the counts of p.',
        xp: 40,
      },
      {
        id: 'sort-characters-by-frequency',
        title: 'Sort Characters By Frequency',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-characters-by-frequency/',
        patternId: 'hash-map',
        hint: 'Count characters, then sort the distinct characters by their count, or bucket them by count.',
        xp: 40,
      },
      {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/minimum-window-substring/',
        patternId: 'sliding-window',
        hint: 'Track how many required characters the window still lacks; expand until it is zero, then shrink from the left.',
        xp: 80,
      },
    ],
  },
  {
    id: 'hashing-tricks',
    gateId: 'hashing',
    order: 3,
    title: 'Hashing Tricks: Prefix Sums, Clever Keys and O(1) Designs',
    minutes: 30,
    summary: 'Combine a hash map with running sums or a well-chosen key to solve subarray and design problems in one pass.',
    analogy:
      'A running total on a bank statement lets you find how much you spent between two dates by subtracting two balances instead of adding up every transaction. Remember each balance in a map and you can ask "when was my balance exactly 500 less than now?" instantly.',
    explanation: `Once you are comfortable with a plain hash map, three extra tricks unlock a large family of medium problems. First, store running prefix sums in a map to find subarrays with a given sum. Second, design a clever key so that "equivalent" items collide on purpose. Third, pair a map with an array to build structures that do everything in O(1). Each trick is small, but they appear again and again.

## The idea

- **Prefix sum + map.** Let \`prefix[i]\` be the sum of the first \`i\` elements. The sum of a subarray from \`i+1\` to \`j\` is \`prefix[j] - prefix[i]\`. So "is there a subarray ending here with sum k?" becomes "have I seen a prefix equal to \`current - k\`?". That is a map lookup.
- **Clever keys.** Anagrams share a sorted string. Numbers with the same remainder mod k share \`x % k\`. A sudoku cell's constraints can be strings like \`"row3-5"\`. Choose a key so that things that should be grouped land on the same key.
- **Map + array.** A map from value to index, plus an array of values, gives O(1) insert, delete (swap with last) and random pick.

## A tiny example

Subarray Sum Equals K with \`nums = [1, 2, 3]\`, \`k = 3\`. Answer: 2 (\`[1, 2]\` and \`[3]\`).

The slow way tries every start and every end and sums the pieces: O(n^2) pairs, and O(n^3) if you re-add each time.

The fast way walks once, keeping \`running\` and a map \`seen\` of how many times each prefix value has appeared. Start with \`seen = {0: 1}\`, which represents the empty prefix.

\`\`\`python
def subarray_sum(nums, k):
    seen = {0: 1}
    running = 0
    count = 0
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count
\`\`\`

Trace: after 1, running=1, need -2 (0 hits). After 2, running=3, need 0 (1 hit). After 3, running=6, need 3 (1 hit). Total 2. One pass, O(n).

## Step by step

- Write down what quantity you are accumulating (sum, balance of ones vs zeros, remainder mod k).
- Decide what earlier value would complete a match with the current one.
- Seed the map with the "empty prefix" case so subarrays starting at index 0 are counted.
- For each element: update the running value, look up the partner, then store the current value.

## Where people go wrong

- Forgetting \`seen = {0: 1}\`. Without it a subarray starting at index 0 is missed.
- Storing before looking up. With \`k = 0\` this makes an element match itself.
- Using a map of value to last index when you need value to count, or the other way round. Ask: do I need "how many" or "where first"?
- For "contiguous array" of 0s and 1s, count 0 as -1 so the problem becomes "find a subarray with sum 0".

## How to recognise it in an interview

- "Number of subarrays whose sum equals k", "longest subarray with sum k", "subarray sum divisible by k".
- "Equal number of 0s and 1s".
- "Group by", "same letters", "same remainder".
- "Design a structure with O(1) insert, delete and getRandom".
- Any O(n^2) subarray loop where the inner work is a sum: prefix sums plus a map will usually make it O(n).`,
    naive: {
      title: 'Try every subarray and add it up',
      description:
        'Fix a start index, then extend the end index one step at a time while keeping a running sum. Count every time the sum equals k. Every pair of indices is visited.',
      time: 'O(n^2)',
      space: 'O(1)',
      code: {
        python: `def subarray_sum_slow(nums, k):
    n = len(nums)
    count = 0
    for start in range(n):
        total = 0
        for end in range(start, n):
            total += nums[end]
            if total == k:
                count += 1
    return count`,
        javascript: `function subarraySumSlow(nums, k) {
  let count = 0;
  for (let start = 0; start < nums.length; start++) {
    let total = 0;
    for (let end = start; end < nums.length; end++) {
      total += nums[end];
      if (total === k) count++;
    }
  }
  return count;
}`,
        java: `public int subarraySumSlow(int[] nums, int k) {
  int count = 0;
  for (int start = 0; start < nums.length; start++) {
    int total = 0;
    for (int end = start; end < nums.length; end++) {
      total += nums[end];
      if (total == k) count++;
    }
  }
  return count;
}`,
        cpp: `int subarraySumSlow(vector<int>& nums, int k) {
  int count = 0;
  for (int start = 0; start < (int)nums.size(); start++) {
    int total = 0;
    for (int end = start; end < (int)nums.size(); end++) {
      total += nums[end];
      if (total == k) count++;
    }
  }
  return count;
}`,
      },
    },
    optimized: {
      title: 'Prefix sum with a hash map',
      description:
        'Keep a running sum and a map from prefix value to how many times it has occurred. At each step, the number of subarrays ending here with sum k equals the count of earlier prefixes equal to running minus k.',
      time: 'O(n)',
      space: 'O(n)',
      code: {
        python: `def subarray_sum(nums, k):
    seen = {0: 1}  # prefix value -> how many times
    running = 0
    count = 0
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count`,
        javascript: `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let running = 0;
  let count = 0;
  for (const x of nums) {
    running += x;
    count += seen.get(running - k) || 0;
    seen.set(running, (seen.get(running) || 0) + 1);
  }
  return count;
}`,
        java: `public int subarraySum(int[] nums, int k) {
  Map<Integer, Integer> seen = new HashMap<>();
  seen.put(0, 1);
  int running = 0, count = 0;
  for (int x : nums) {
    running += x;
    count += seen.getOrDefault(running - k, 0);
    seen.put(running, seen.getOrDefault(running, 0) + 1);
  }
  return count;
}`,
        cpp: `int subarraySum(vector<int>& nums, int k) {
  unordered_map<int, int> seen;
  seen[0] = 1;
  int running = 0, count = 0;
  for (int x : nums) {
    running += x;
    if (seen.count(running - k)) count += seen[running - k];
    seen[running]++;
  }
  return count;
}`,
      },
    },
    whyFaster:
      'The slow version examines every (start, end) pair, which is about n^2 / 2 pairs. The fast version notices that a subarray sum is a difference of two prefix sums, so for each end it only needs to know how many earlier prefixes have the right value. That count lives in a map, so each step is O(1) and the whole thing is O(n).',
    keyPoints: [
      'Subarray sum from i+1 to j equals prefix[j] minus prefix[i]; look up prefix[j] minus k in a map.',
      'Seed the map with {0: 1} so subarrays starting at index 0 are counted.',
      'Choose a key that makes equivalent items collide: sorted string, count tuple, remainder mod k.',
      'Replace 0 with -1 to turn "equal zeros and ones" into "sum equals zero".',
      'Map plus array gives O(1) insert, delete (swap with last) and random pick.',
      'Ask "how many" (value to count) versus "where first" (value to index) before choosing what to store.',
    ],
    patternIds: ['hash-map', 'prefix-sum'],
    problems: [
      {
        id: 'design-hashmap',
        title: 'Design HashMap',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/design-hashmap/',
        patternId: 'hash-map',
        hint: 'Use an array of buckets where each bucket is a small list of (key, value) pairs; index by key mod bucket count.',
        xp: 20,
      },
      {
        id: 'subarray-sum-equals-k',
        title: 'Subarray Sum Equals K',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
        patternId: 'prefix-sum',
        hint: 'Keep a running sum and count how many earlier prefix sums equal running minus k.',
        xp: 40,
      },
      {
        id: 'contiguous-array',
        title: 'Contiguous Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/contiguous-array/',
        patternId: 'prefix-sum',
        hint: 'Treat 0 as -1, then find the longest subarray with sum 0 by storing the first index of each prefix value.',
        xp: 40,
      },
      {
        id: 'continuous-subarray-sum',
        title: 'Continuous Subarray Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/continuous-subarray-sum/',
        patternId: 'prefix-sum',
        hint: 'Two prefix sums with the same remainder mod k bound a subarray divisible by k; store the first index of each remainder.',
        xp: 40,
      },
      {
        id: 'valid-sudoku',
        title: 'Valid Sudoku',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/valid-sudoku/',
        patternId: 'hash-map',
        hint: 'Keep sets for each row, each column and each 3x3 box keyed by (row // 3, col // 3).',
        xp: 40,
      },
      {
        id: 'insert-delete-getrandom-o1',
        title: 'Insert Delete GetRandom O(1)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/',
        patternId: 'hash-map',
        hint: 'Store values in an array and their positions in a map; delete by swapping the target with the last element.',
        xp: 40,
      },
      {
        id: 'copy-list-with-random-pointer',
        title: 'Copy List with Random Pointer',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
        patternId: 'hash-map',
        hint: 'First pass: map every old node to a new copy. Second pass: wire next and random through the map.',
        xp: 40,
      },
      {
        id: 'number-of-submatrices-that-sum-to-target',
        title: 'Number of Submatrices That Sum to Target',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/',
        patternId: 'prefix-sum',
        hint: 'Fix a pair of rows, collapse the columns between them into a 1D array, then run Subarray Sum Equals K on it.',
        xp: 80,
      },
    ],
  },
]
