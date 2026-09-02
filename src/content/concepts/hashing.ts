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
        tier: 'beginner',
      },
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/contains-duplicate/',
        patternId: 'hash-map',
        hint: 'Add each number to a set and stop the moment you try to add one that is already there.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/valid-anagram/',
        patternId: 'hash-map',
        hint: 'Two strings are anagrams when their letter counts are identical; compare the count maps.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/group-anagrams/',
        patternId: 'hash-map',
        hint: 'Build a key that is the same for all anagrams (sorted letters or a 26-count tuple) and group by it.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'longest-consecutive-sequence',
        title: 'Longest Consecutive Sequence',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
        patternId: 'hash-map',
        hint: 'Put everything in a set; only start counting upward from numbers whose predecessor is missing.',
        xp: 40,
        tier: 'advanced',
      },
    ],
    definition:
      'A hash map stores key to value pairs and finds, inserts or deletes a key by running the key through a hash function that turns it into a bucket index, so the work does not grow with the number of stored keys. A hash set is the same structure holding keys only.',
    coreIdea:
      'Searching a list costs one comparison per stored item. A hash function computes where a key would live, so you go straight to one short bucket instead of scanning everything. As long as the hash spreads keys evenly and the table is grown to keep the load factor, meaning keys divided by buckets, bounded, the expected number of comparisons is a constant. That is why lookup is O(1) on average and why a scan-inside-a-scan collapses from O(n^2) to O(n). It is an average, not a guarantee: if every key lands in the same bucket, lookup is O(n).',
    visual: [
      {
        caption: 'The hash function computes a bucket. No searching is involved.',
        frame: [
          'key "cat"  --hash-->  some big integer h',
          'bucket = h mod 8  ->  3',
          '',
          'table   0   1   2   3   4   5   6   7',
          '                    cat',
        ].join('\n'),
      },
      {
        caption: 'Different keys can land in the same bucket. That is a collision.',
        frame: [
          'insert cat -> 3, dog -> 6, emu -> 3',
          '',
          '  0 |  -',
          '  1 |  -',
          '  2 |  -',
          '  3 |  cat -> emu     <- collision, chained',
          '  6 |  dog',
        ].join('\n'),
      },
      {
        caption: 'Lookup compares only inside one bucket, not the whole table.',
        frame: [
          'lookup "emu"',
          '  hash  ->  bucket 3',
          '  bucket 3 holds [cat, emu]',
          '  compare cat? no.  compare emu? yes.',
          '',
          '2 comparisons. Still 2 when the map holds 1000 keys.',
        ].join('\n'),
      },
      {
        caption: 'Growing the table keeps the chains short, which keeps lookups O(1).',
        frame: [
          'load factor = keys / buckets',
          '  8 buckets, 6 keys   ->  0.75  (getting full)',
          'the table doubles and every key is rehashed',
          ' 16 buckets, 6 keys   ->  0.375',
          '',
          'a resize is O(n) but rare, so insert is O(1) amortised',
        ].join('\n'),
      },
      {
        caption: 'The honest worst case: a bad hash puts everything in one bucket.',
        frame: [
          '  3 |  k1 -> k2 -> k3 -> ... -> kn',
          '  every other bucket empty',
          '',
          'a lookup now compares all n keys  ->  O(n)',
          'rare with a good hash, but real, so say',
          '"O(1) average, O(n) worst case" out loud',
        ].join('\n'),
      },
      {
        caption: 'Two Sum in one pass: ask the map first, then store.',
        frame: [
          'nums  2   7   11  15      target 9',
          '',
          'i=0  x=2   need 7   seen {}          no',
          '           store seen {2: 0}',
          'i=1  x=7   need 2   seen {2: 0}      YES',
          'answer [0, 1]   one pass, O(n)',
        ].join('\n'),
      },
    ],
    pseudocode: `function twoSum(numbers, target):
    seen = empty hash map        // value -> index
    for i from 0 to length(numbers) - 1:
        need = target - numbers[i]
        if need is a key in seen:
            return [seen[need], i]
        seen[numbers[i]] = i     // store AFTER asking, never before
    return empty`,
    complexity: [
      { label: 'Insert, lookup, delete (average)', time: 'O(1)', space: 'O(1)', note: 'assumes a good hash and a bounded load factor' },
      { label: 'Insert, lookup, delete (worst case)', time: 'O(n)', space: 'O(1)', note: 'every key collides into one bucket' },
      { label: 'Insert with table growth', time: 'O(1) amortised', space: 'O(n)', note: 'a resize rehashes everything but happens rarely' },
      { label: 'Holding n keys', time: 'O(n)', space: 'O(n)', note: 'one entry per key plus the empty buckets' },
      { label: 'Two Sum with a map', time: 'O(n)', space: 'O(n)', note: 'one pass, one average-O(1) lookup per element' },
    ],
    dryRun: {
      input: 'nums = [3, 2, 4], target = 6',
      goal: 'Return the indexes of the two numbers that add up to 6.',
      steps: [
        {
          state: 'i = 0, x = 3, seen = {}',
          action: 'need = 6 - 3 = 3. The map is empty, so 3 is not a key.',
        },
        {
          state: 'i = 0, x = 3, seen = {}',
          action: 'Store seen[3] = 0. Storing after asking is exactly what stops 3 from pairing with itself.',
        },
        {
          state: 'i = 1, x = 2, seen = {3: 0}',
          action: 'need = 6 - 2 = 4, which is not a key yet, so store seen[2] = 1.',
        },
        {
          state: 'i = 2, x = 4, seen = {3: 0, 2: 1}',
          action: 'need = 6 - 4 = 2. The lookup finds it, recorded at index 1.',
        },
        {
          state: 'seen[2] = 1, i = 2',
          action: 'Return [1, 2] straight away without finishing the array.',
        },
      ],
      result:
        '[1, 2], because nums[1] + nums[2] = 2 + 4 = 6. Note that [0, 0] was impossible: 3 + 3 is also 6, but 3 was only stored after its own question had been asked.',
    },
    mistakes: [
      {
        mistake: 'Storing the current element in the map before doing the lookup.',
        why: 'With target 6 and value 3, the map already contains 3, so the code returns [0, 0] and pairs an element with itself.',
        fix: 'Ask first, store second. That single ordering is the whole trick.',
      },
      {
        mistake: 'Using a list for membership tests, as in "if x in some_list".',
        why: 'That compares against every element, so it is O(n). Inside a loop it quietly rebuilds the O(n^2) you were trying to avoid.',
        fix: 'Convert once: candidates = set(some_list). Then "x in candidates" is O(1) on average.',
      },
      {
        mistake: 'Using a list as a dictionary key.',
        why: 'Python requires keys to be hashable, which in practice means immutable. A list can change after insertion, which would move it to a different bucket and lose it. You get TypeError: unhashable type.',
        fix: 'Convert to a tuple, a frozenset or a string. Note that a tuple is hashable only if everything inside it is, so a tuple of lists still fails.',
      },
      {
        mistake: 'Relying on hash map order without checking the language.',
        why: 'Python 3.7 and later do guarantee that a dict preserves insertion order, but Java HashMap and C++ unordered_map guarantee nothing, and no hash map is ordered by key.',
        fix: 'Sort the keys explicitly when you need sorted order. Lean on insertion order only where the language promises it, and say which promise you are using.',
      },
      {
        mistake: 'Claiming a hash map is O(1) in the worst case.',
        why: 'With adversarial or badly distributed keys, every key can chain into one bucket and lookup becomes O(n).',
        fix: 'Say "O(1) on average, assuming a good hash and a load factor kept low by resizing; O(n) worst case". Interviewers listen for that sentence.',
      },
    ],
    whenToUse: [
      '"Have I seen this before?" is being asked inside a loop.',
      'You need a partner, a complement or a difference, as in two sum or pairs with difference k.',
      'You must group items that share a computable property, such as anagrams or the same remainder.',
      'You are about to write a nested loop whose inner loop only searches for something.',
      'You need counts, or the first or last index, of each distinct value.',
    ],
    whenNotToUse: [
      'You need the keys in sorted order, or range queries; use a sorted array with binary search, or a balanced BST.',
      'You need the smallest or largest item repeatedly; use a heap.',
      'The keys are small consecutive integers; a plain array indexed by the value is faster and simpler.',
      'The input is sorted and memory is tight; two pointers solve pair problems in O(1) extra space.',
      'The keys are mutable objects that will change; hashing needs immutability, so key on an id or a tuple snapshot.',
    ],
    relatedTopics: [
      { id: 'frequency-counting', kind: 'concept', why: 'The commonest use of a map: value to how many times it appeared.' },
      { id: 'hashing-tricks', kind: 'concept', why: 'Prefix sums and designed keys build directly on these average O(1) lookups.' },
      { id: 'binary-search-tree', kind: 'concept', why: 'A BST gives O(log n) lookups but keeps the keys sorted, which a hash map cannot.' },
      { id: 'hash-map', kind: 'pattern', why: 'This concept is that pattern spelled out in full.' },
      { id: 'two-pointers', kind: 'pattern', why: 'On sorted input, two pointers solve the same pair problems in O(1) space.' },
    ],
    quiz: [
      {
        question: 'What is the honest complexity of a hash map lookup?',
        options: [
          'O(1) always, in every case',
          'O(1) on average, assuming a good hash and a load factor kept low by resizing; O(n) in the worst case when keys collide',
          'O(log n)',
          'O(n) always',
        ],
        answerIndex: 1,
        explanation: 'The constant-time claim is an expectation over well-spread keys. If everything lands in one bucket, the structure degrades into a linked list.',
      },
      {
        question: 'Why does Python refuse d[[1, 2]] = "x"?',
        options: [
          'Lists are too long to hash',
          'A key must be hashable and therefore immutable, because a mutated key would belong in a different bucket; use a tuple instead',
          'Only strings may be keys',
          'It works fine',
        ],
        answerIndex: 1,
        explanation: 'Lists can change in place, which would silently corrupt the table. tuple([1, 2]) is hashable, as long as its own contents are too.',
      },
      {
        question: 'You insert "a", then "b", then "c" into a Python 3.9 dict and iterate over it. What order do you get?',
        options: [
          'Sorted order, but only by luck',
          'Insertion order a, b, c, which Python has guaranteed since 3.7',
          'A different random order on every run',
          'Reverse insertion order',
        ],
        answerIndex: 1,
        explanation: 'Python dicts preserve insertion order as a language guarantee. Java HashMap and C++ unordered_map make no such promise, so do not port that assumption.',
      },
      {
        question: 'The array is already sorted and you must find two values summing to a target using O(1) extra space. Is a hash map the right tool?',
        options: [
          'Yes, it is always the fastest option',
          'No: it needs O(n) memory. Two pointers from both ends give O(n) time and O(1) space by using the sortedness.',
          'No, you must sort the array again first',
          'Yes, because sorted input hashes more evenly',
        ],
        answerIndex: 1,
        explanation: 'The map is the right answer for unsorted input. Once the data is sorted, two pointers match its time for no extra memory.',
      },
      {
        question: 'In the one-pass Two Sum, why is the current value stored after the lookup rather than before?',
        options: [
          'For speed',
          'To stop an element being matched with itself, for example 3 when the target is 6',
          'Because dicts reject duplicate keys',
          'It makes no difference',
        ],
        answerIndex: 1,
        explanation: 'If 3 were stored first, the lookup for need = 3 would find it and return the same index twice.',
      },
    ],
    sources: [
      'CLRS ch. 11 (hash tables, chaining, and the load factor)',
      'MIT 6.006: Hashing with Chaining',
      'MIT 6.006: Table Doubling and Karp-Rabin',
      'Python documentation: dict, hashable objects and set',
      'VisuAlgo: Hash Table',
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
        tier: 'beginner',
      },
      {
        id: 'first-unique-character-in-a-string',
        title: 'First Unique Character in a String',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/first-unique-character-in-a-string/',
        patternId: 'hash-map',
        hint: 'Count all characters first, then scan again for the first one with count 1.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'ransom-note',
        title: 'Ransom Note',
        difficulty: 'easy',
        url: 'https://leetcode.com/problems/ransom-note/',
        patternId: 'hash-map',
        hint: 'Count the magazine letters, then spend them one by one while reading the note.',
        xp: 20,
        tier: 'beginner',
      },
      {
        id: 'find-all-anagrams-in-a-string',
        title: 'Find All Anagrams in a String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
        patternId: 'sliding-window',
        hint: 'Slide a window of length p over s and keep its letter counts updated; compare to the counts of p.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'sort-characters-by-frequency',
        title: 'Sort Characters By Frequency',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/sort-characters-by-frequency/',
        patternId: 'hash-map',
        hint: 'Count characters, then sort the distinct characters by their count, or bucket them by count.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/minimum-window-substring/',
        patternId: 'sliding-window',
        hint: 'Track how many required characters the window still lacks; expand until it is zero, then shrink from the left.',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'Frequency counting means making one pass over the data to build a map from each distinct item to how many times it appears, and then answering every later question about counts by reading that map. Python provides collections.Counter for exactly this job.',
    coreIdea:
      'Questions such as "does this letter repeat?", "are these two strings anagrams?" and "which value appears most?" all depend on the same set of numbers. Computing those numbers once costs one pass; recomputing them for every query costs a pass per query. Building the table once turns n queries at O(n) each into n queries at O(1) each, so an O(n^2) solution becomes O(n).',
    visual: [
      {
        caption: 'Pass 1 over "swiss": walk the string once and count each letter.',
        frame: [
          'text   s   w   i   s   s',
          'i=0    ^      count {s:1}',
          'i=1        ^  count {s:1, w:1}',
          'i=2            ^  count {s:1, w:1, i:1}',
          'i=3                ^  count {s:2, w:1, i:1}',
          'i=4                    ^  count {s:3, w:1, i:1}',
        ].join('\n'),
      },
      {
        caption: 'The finished table. From here every count question is O(1).',
        frame: [
          'count',
          '  s -> 3',
          '  w -> 1',
          '  i -> 1',
          '',
          'one pass, 5 reads, and no rescanning ever again',
        ].join('\n'),
      },
      {
        caption: 'Pass 2: walk the string again for the first letter with count 1.',
        frame: [
          'text   s   w   i   s   s',
          'i=0    ^   count[s] = 3    not unique',
          'i=1        ^   count[w] = 1    FOUND',
          '',
          'answer: index 1',
        ].join('\n'),
      },
      {
        caption: 'Anagram checking is the same table, built twice and compared.',
        frame: [
          '"listen" -> {l:1, i:1, s:1, t:1, e:1, n:1}',
          '"silent" -> {s:1, i:1, l:1, e:1, n:1, t:1}',
          '',
          'the two tables are equal  ->  anagram',
          'no sorting needed: O(n), not O(n log n)',
        ].join('\n'),
      },
      {
        caption: 'In a sliding window the counts change by one at each edge.',
        frame: [
          'window of size 3 over "abcb"',
          '[a b c] b    count {a:1, b:1, c:1}',
          ' a[b c b]    a leaves: a -> 0, drop the key',
          '             b enters: b -> 2',
          '',
          'each move is O(1), never a full recount',
        ].join('\n'),
      },
      {
        caption: 'A fixed alphabet can use a plain array instead of a dict.',
        frame: [
          'lowercase a..z  ->  26 slots',
          'count[ord(ch) - ord("a")] += 1',
          '',
          '  a   b   c  ...  i  ...  s  ...  w',
          '  0   0   0       1       3       1',
          'same O(n) time, O(1) space, smaller constants',
        ].join('\n'),
      },
    ],
    pseudocode: `function firstUniqueIndex(text):
    count = empty hash map
    for each ch in text:                 // pass 1: build the table
        if ch is not a key in count:
            count[ch] = 0
        count[ch] = count[ch] + 1
    for i from 0 to length(text) - 1:    // pass 2: read it in order
        if count[text[i]] equals 1:
            return i
    return -1`,
    complexity: [
      { label: 'Build the count map', time: 'O(n)', space: 'O(k)', note: 'k distinct keys; O(1) when the alphabet is fixed' },
      { label: 'One count lookup afterwards', time: 'O(1)', space: 'O(1)', note: 'average case for a hash map' },
      { label: 'First unique character', time: 'O(n)', space: 'O(1)', note: 'two passes, at most 26 counters' },
      { label: 'Anagram check by counting', time: 'O(n)', space: 'O(1)', note: 'beats sorting, which is O(n log n)' },
      { label: 'Naive: rescan for each position', time: 'O(n^2)', space: 'O(1)', note: 'one full scan per character' },
    ],
    dryRun: {
      input: 's = "swiss"',
      goal: 'Return the index of the first character that appears exactly once, or -1.',
      steps: [
        {
          state: 'count = {}',
          action: 'Pass 1 begins. Read s: count.get("s", 0) + 1 = 1, so count = {s: 1}.',
        },
        {
          state: 'count = {s: 1}',
          action: 'Read w, then i. Both are new, so count = {s: 1, w: 1, i: 1}.',
        },
        {
          state: 'count = {s: 1, w: 1, i: 1}',
          action: 'Read the last two s characters, giving count = {s: 3, w: 1, i: 1}. Pass 1 is done.',
        },
        {
          state: 'i = 0, ch = "s"',
          action: 'Pass 2 begins over the original string. count["s"] is 3, not 1, so keep going.',
        },
        {
          state: 'i = 1, ch = "w"',
          action: 'count["w"] is exactly 1, so return 1 immediately.',
        },
      ],
      result:
        '1. The letter w is the first one whose count is exactly 1. The second pass reads the string in its original order, and that is what makes "first" mean the right thing.',
    },
    mistakes: [
      {
        mistake: 'Iterating the count map to find the answer instead of walking the string again.',
        why: 'It happens to work in Python because dicts keep insertion order, but it breaks silently in Java or C++ where a hash map has no order at all, and it gives you the character rather than its index.',
        fix: 'Loop over the string by index in the second pass. It is the same cost and it is portable.',
      },
      {
        mistake: 'Writing count[ch] += 1 on a plain dict without initialising the key.',
        why: 'The first time a character is seen the key does not exist, so it raises KeyError.',
        fix: 'Use collections.Counter, or defaultdict(int), or count[ch] = count.get(ch, 0) + 1.',
      },
      {
        mistake: 'Deciding two strings are anagrams by comparing their sets of characters plus their lengths.',
        why: '"aab" and "abb" have the same characters and the same length but different counts, so they are wrongly declared anagrams.',
        fix: 'Compare counts, not sets. A single unequal count is enough to answer no.',
      },
      {
        mistake: 'In a sliding window, decrementing a count but leaving a zero entry in the map.',
        why: 'Conditions written as len(window_count) == len(target_count) then count characters that are no longer inside the window, so the window never matches.',
        fix: 'Delete the key when its count reaches zero, or compare counts key by key instead of by map size.',
      },
      {
        mistake: 'Deleting keys from a dict while looping over that same dict.',
        why: 'Python raises RuntimeError: dictionary changed size during iteration.',
        fix: 'Collect the keys to remove into a list first, or build a new map with a comprehension.',
      },
    ],
    whenToUse: [
      'The problem mentions how many times, most frequent, duplicates, or unique.',
      'You are comparing two collections for the same multiset of items, as in anagram or permutation checks.',
      'A sliding window must know what it currently contains.',
      'You need the top k most frequent items: count first, then a heap or bucket sort.',
      'You must decide whether a rearrangement is possible, as in palindrome permutation or ransom note.',
    ],
    whenNotToUse: [
      'Only presence matters, not how many; a set is smaller and clearer.',
      'Position or order is what matters; use indexes or a two-pointer scan.',
      'You need running sums over ranges rather than counts of values; use prefix sums.',
      'You need only the majority element and O(1) space; use the Boyer-Moore voting algorithm.',
      'You need counts of ranges of values rather than exact values; sort or bucket the data instead.',
    ],
    relatedTopics: [
      { id: 'hash-map-basics', kind: 'concept', why: 'The counting table is a hash map, so it inherits the same average O(1) lookups.' },
      { id: 'hashing-tricks', kind: 'concept', why: 'Grouping by a designed key is counting with a smarter key.' },
      { id: 'top-k-problems', kind: 'concept', why: 'Top k frequent items is counting first, then a heap or a bucket sort.' },
      { id: 'sorting-basics', kind: 'concept', why: 'Sorting also answers anagram questions, but at O(n log n) instead of O(n).' },
      { id: 'sliding-window', kind: 'pattern', why: 'Window problems keep a count map updated at both edges rather than recounting.' },
    ],
    quiz: [
      {
        question: 'Two strings of length n over lowercase letters. Compare sorting them with counting them.',
        options: [
          'Both are O(n)',
          'Sorting is O(n log n) time; counting is O(n) time and O(1) space with 26 counters',
          'Sorting is faster',
          'Counting is O(n^2)',
        ],
        answerIndex: 1,
        explanation: 'Counting reads each character once and the table has a fixed size, so it beats sorting asymptotically and in practice.',
      },
      {
        question: 'count[ch] += 1 on a plain Python dict raises KeyError the first time ch is seen. What is the cleanest fix?',
        options: [
          'Wrap every character in a try/except block',
          'Use collections.Counter, defaultdict(int), or count.get(ch, 0) + 1',
          'Pre-fill the dict with every possible character',
          'Use a list instead of a dict',
        ],
        answerIndex: 1,
        explanation: 'All three read a missing key as zero. Counter is the most direct when you are doing nothing but counting.',
      },
      {
        question: 'To find the first non-repeating character you build a Counter and return the first key whose value is 1. Does this work everywhere?',
        options: [
          'Yes, hash maps are always insertion ordered',
          'In Python it happens to give the right character because dicts keep insertion order, but it is not portable and it gives the character rather than the index; scan the string again instead',
          'No, it never works',
          'Yes, if you sort the map first',
        ],
        answerIndex: 1,
        explanation: 'Java HashMap and C++ unordered_map give no ordering at all. A second pass over the string is the same cost and is always correct.',
      },
      {
        question: 'A sliding window over "eceba" keeps a count map. The left edge moves past an "e" whose count drops to 0. What should happen to that key?',
        options: [
          'Leave it; a zero count is harmless',
          'Delete the key, otherwise conditions based on the number of distinct keys still count it as present',
          'Set it to -1',
          'Rebuild the whole map',
        ],
        answerIndex: 1,
        explanation: 'Many window conditions use len(count) as "how many distinct characters are in the window". A stale zero entry breaks that check.',
      },
      {
        question: 'Which of these can frequency counting NOT decide?',
        options: [
          'Whether two strings are anagrams',
          'Which value appears most often',
          'Whether one string is a substring of another',
          'Whether a string can be rearranged into a palindrome',
        ],
        answerIndex: 2,
        explanation: 'Substring is about order and position, which counts throw away. Use a sliding window or a string search algorithm for that.',
      },
    ],
    sources: [
      'CLRS ch. 11 (hash tables)',
      'MIT 6.006: Hashing with Chaining',
      'Python documentation: collections.Counter and defaultdict',
      'LeetCode editorial: First Unique Character in a String',
      'VisuAlgo: Hash Table',
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
        tier: 'beginner',
      },
      {
        id: 'subarray-sum-equals-k',
        title: 'Subarray Sum Equals K',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
        patternId: 'prefix-sum',
        hint: 'Keep a running sum and count how many earlier prefix sums equal running minus k.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'contiguous-array',
        title: 'Contiguous Array',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/contiguous-array/',
        patternId: 'prefix-sum',
        hint: 'Treat 0 as -1, then find the longest subarray with sum 0 by storing the first index of each prefix value.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'continuous-subarray-sum',
        title: 'Continuous Subarray Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/continuous-subarray-sum/',
        patternId: 'prefix-sum',
        hint: 'Two prefix sums with the same remainder mod k bound a subarray divisible by k; store the first index of each remainder.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'valid-sudoku',
        title: 'Valid Sudoku',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/valid-sudoku/',
        patternId: 'hash-map',
        hint: 'Keep sets for each row, each column and each 3x3 box keyed by (row // 3, col // 3).',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'insert-delete-getrandom-o1',
        title: 'Insert Delete GetRandom O(1)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/',
        patternId: 'hash-map',
        hint: 'Store values in an array and their positions in a map; delete by swapping the target with the last element.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'copy-list-with-random-pointer',
        title: 'Copy List with Random Pointer',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
        patternId: 'hash-map',
        hint: 'First pass: map every old node to a new copy. Second pass: wire next and random through the map.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'number-of-submatrices-that-sum-to-target',
        title: 'Number of Submatrices That Sum to Target',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/',
        patternId: 'prefix-sum',
        hint: 'Fix a pair of rows, collapse the columns between them into a 1D array, then run Subarray Sum Equals K on it.',
        xp: 80,
        tier: 'advanced',
      },
    ],
    definition:
      'Three ways of using a hash map beyond plain lookup: storing running prefix sums so that any subarray sum becomes a difference of two stored values, designing a key so that items you want grouped collide on purpose, and pairing a map with an array so that insert, delete and random pick are all O(1).',
    coreIdea:
      'A subarray sum from i + 1 to j equals prefix[j] minus prefix[i], so asking "is there a subarray ending here with sum k?" is the same as asking "have I already seen the prefix value current minus k?". That second question is one map lookup, which replaces an inner loop over every possible start. The same move works whenever a property of a range can be rewritten as a comparison between two summaries you have already computed.',
    visual: [
      {
        caption: 'Prefix sums turn a subarray sum into a single subtraction.',
        frame: [
          'nums        1     2     3',
          'prefix   0     1     3     6',
          '         p0    p1    p2    p3',
          '',
          'sum of nums[1..2] = p3 - p1 = 6 - 1 = 5',
          'nothing is re-added, it is one subtraction',
        ].join('\n'),
      },
      {
        caption: 'Start with prefix 0 recorded once, standing for the empty prefix.',
        frame: [
          'k = 3',
          'seen = {0: 1}    running = 0    count = 0',
          '',
          'the 0 entry is what lets subarrays that',
          'start at index 0 be counted at all',
        ].join('\n'),
      },
      {
        caption: 'x = 1. running becomes 1. Look for running - k = -2.',
        frame: [
          'running = 1     k = 3     need = -2',
          'seen has no -2   ->   count stays 0',
          '',
          'store: seen = {0: 1, 1: 1}',
        ].join('\n'),
      },
      {
        caption: 'x = 2. running becomes 3. Look for 0, which was seen once.',
        frame: [
          'running = 3     need = 3 - 3 = 0',
          'seen[0] = 1     ->   count = 0 + 1 = 1',
          'that hit is the subarray [1, 2]',
          '',
          'store: seen = {0: 1, 1: 1, 3: 1}',
        ].join('\n'),
      },
      {
        caption: 'x = 3. running becomes 6. Look for 3, which was seen once.',
        frame: [
          'running = 6     need = 6 - 3 = 3',
          'seen[3] = 1     ->   count = 1 + 1 = 2',
          'that hit is the subarray [3]',
          '',
          'store: seen = {0: 1, 1: 1, 3: 1, 6: 1}',
        ].join('\n'),
      },
      {
        caption: 'The second trick: build a key that makes related items collide.',
        frame: [
          '"eat" "tea" "ate"  ->  key ("a","e","t")',
          '"tan" "nat"        ->  key ("a","n","t")',
          '',
          'groups {aet: [eat, tea, ate], ant: [tan, nat]}',
          'other useful keys: (row//3, col//3) for sudoku',
          'boxes, and x mod k for divisibility questions',
        ].join('\n'),
      },
    ],
    pseudocode: `function countSubarraysWithSum(numbers, k):
    seen = empty hash map
    seen[0] = 1                  // the empty prefix, sum 0
    running = 0
    count = 0
    for each x in numbers:
        running = running + x
        need = running - k
        if need is a key in seen:
            count = count + seen[need]     // every earlier match
        if running is not a key in seen:
            seen[running] = 0
        seen[running] = seen[running] + 1   // store AFTER asking
    return count`,
    complexity: [
      { label: 'Subarray sum equals k', time: 'O(n)', space: 'O(n)', note: 'one pass, one entry per distinct prefix value' },
      { label: 'Brute force over all subarrays', time: 'O(n^2)', space: 'O(1)', note: 'a running sum from every start index' },
      { label: 'Group n words of length L', time: 'O(n L log L)', space: 'O(n L)', note: 'sorting each word to build its key' },
      { label: 'Insert, delete, getRandom', time: 'O(1)', space: 'O(n)', note: 'average case; delete swaps with the last slot' },
      { label: 'Worst case for any map lookup above', time: 'O(n)', space: 'O(n)', note: 'if every key collides into one bucket' },
    ],
    dryRun: {
      input: 'nums = [1, 2, 3], k = 3',
      goal: 'Count how many contiguous subarrays add up to exactly 3.',
      steps: [
        {
          state: 'seen = {0: 1}, running = 0, count = 0',
          action: 'Seed the map with prefix 0 seen once, so that a subarray starting at index 0 can be counted.',
        },
        {
          state: 'x = 1, running = 0',
          action: 'running becomes 1. need = 1 - 3 = -2, which is not in seen, so count stays 0.',
        },
        {
          state: 'running = 1, count = 0',
          action: 'Record seen[1] = 1.',
        },
        {
          state: 'x = 2, seen = {0: 1, 1: 1}',
          action: 'running becomes 3. need = 0, and seen[0] is 1, so count becomes 1. That hit is the subarray [1, 2].',
        },
        {
          state: 'running = 3, count = 1',
          action: 'Record seen[3] = 1.',
        },
        {
          state: 'x = 3, seen = {0: 1, 1: 1, 3: 1}',
          action: 'running becomes 6. need = 3, and seen[3] is 1, so count becomes 2. That hit is the subarray [3].',
        },
        {
          state: 'running = 6, count = 2',
          action: 'Record seen[6] = 1 and the loop ends.',
        },
      ],
      result:
        '2, namely [1, 2] and [3]. Nothing was double counted because every hit came from a prefix recorded strictly before the current index, and nothing was missed because every ending position was tested exactly once.',
    },
    mistakes: [
      {
        mistake: 'Forgetting to seed the map with {0: 1}.',
        why: 'Subarrays that begin at index 0 have no earlier prefix to subtract, so they are never counted. On nums = [3] with k = 3 the answer comes out 0 instead of 1.',
        fix: 'Write seen = {0: 1} before the loop and say out loud that it stands for the empty prefix.',
      },
      {
        mistake: 'Recording the current prefix before doing the lookup.',
        why: 'With k = 0 the code then matches the current prefix against itself and counts an empty subarray that does not exist.',
        fix: 'Look up running - k first, then record running. Same ordering rule as one-pass Two Sum.',
      },
      {
        mistake: 'Using a sliding window when the array can contain negative numbers.',
        why: 'A window relies on the sum growing as you extend to the right. With negatives that is false, so shrinking from the left is not a valid move and the answer is wrong.',
        fix: 'Use prefix sums with a map whenever negatives are possible; keep the window for all-positive arrays.',
      },
      {
        mistake: 'Storing occurrence counts when the problem needs the earliest index, or the other way round.',
        why: 'Longest subarray with sum k needs the first index at which each prefix appeared; counting subarrays needs how many times each prefix appeared. Mixing them gives short answers or wrong totals.',
        fix: 'Decide first: "how many" means value to count, "how long" or "where" means value to first index, and in that case never overwrite an index already stored.',
      },
      {
        mistake: 'Building a group key out of a list, such as sorted(word).',
        why: 'A list cannot be a dict key at all, because hashing requires immutability. It raises TypeError: unhashable type.',
        fix: 'Use tuple(sorted(word)), the joined string, or a 26-length tuple of counts. All are immutable and therefore hashable.',
      },
    ],
    whenToUse: [
      'The problem asks about contiguous subarrays with a given sum, or divisible by k, or balanced.',
      'You can rewrite a range property as a difference or a comparison between two running summaries.',
      'Items should be grouped by something you can compute, such as sorted letters or a remainder.',
      'A design question needs insert, delete and random access all in O(1).',
      'You need to remember the first place a state occurred so you can measure a distance back to it.',
    ],
    whenNotToUse: [
      'You want the maximum-sum subarray rather than a target sum; Kadane is O(n) time and O(1) space.',
      'All values are positive and you need the shortest or longest window with a given sum; a sliding window uses O(1) space.',
      'The array is static and you only need range sums; a plain prefix sum array is enough, with no map.',
      'The elements change between queries; use a Fenwick tree or a segment tree instead.',
      'The subsequence does not have to be contiguous; prefix sums say nothing about it, so think dynamic programming.',
    ],
    relatedTopics: [
      { id: 'prefix-sums', kind: 'concept', why: 'The prefix array is the same idea; the map is what turns it into a one-pass answer.' },
      { id: 'hash-map-basics', kind: 'concept', why: 'Every trick here rests on average O(1) lookups and on keys being hashable.' },
      { id: 'frequency-counting', kind: 'concept', why: 'A designed key is counting with a key you built rather than the raw value.' },
      { id: 'kadane-max-subarray', kind: 'concept', why: 'The other one-pass subarray technique, for maximum sum rather than target sum.' },
      { id: 'sliding-window', kind: 'pattern', why: 'The O(1)-space alternative when every value is positive.' },
    ],
    quiz: [
      {
        question: 'Why is the map seeded with {0: 1} before the loop?',
        options: [
          'To avoid a KeyError',
          'So that a subarray starting at index 0, which has no earlier prefix to subtract, is counted',
          'To make the count start at 1',
          'It is optional',
        ],
        answerIndex: 1,
        explanation: 'The empty prefix has sum 0. Without that entry, nums = [3] with k = 3 returns 0 instead of 1.',
      },
      {
        question: 'Counting subarrays with sum k over n values: what do the map version and the brute force cost?',
        options: [
          'Both are O(n^2)',
          'Map: O(n) time and O(n) space. Brute force: O(n^2) time and O(1) space.',
          'Map: O(n log n) time',
          'Map: O(n) time and O(1) space',
        ],
        answerIndex: 1,
        explanation: 'The map trades memory for time: one entry per distinct prefix value replaces the whole inner loop over start positions.',
      },
      {
        question: 'nums may contain negative numbers and you must count subarrays with sum k. Is a sliding window valid?',
        options: [
          'Yes, windows always work on subarrays',
          'No: with negatives the running sum is not monotone, so shrinking the window is not a valid move. Use prefix sums with a map.',
          'Yes, if you sort the array first',
          'No, you need dynamic programming',
        ],
        answerIndex: 1,
        explanation: 'Sorting would destroy contiguity, and a window relies on the sum only growing as you extend right, which negatives break.',
      },
      {
        question: 'Group Anagrams: which key groups "eat", "tea" and "ate" together and is legal as a dict key?',
        options: [
          'The list sorted(word)',
          'tuple(sorted(word)), or the string "".join(sorted(word))',
          'The length of the word',
          'The first letter of the word',
        ],
        answerIndex: 1,
        explanation: 'A list is unhashable because it can change. A tuple or a string is immutable and so can be a key. Length and first letter group unrelated words together.',
      },
      {
        question: 'Insert Delete GetRandom in O(1) uses an array of values plus a map from value to index. How does delete stay O(1)?',
        options: [
          'It shifts the array left after removing the value',
          'It swaps the target with the last element, updates that element index in the map, then pops the end',
          'It rebuilds the map each time',
          'It marks the slot deleted and skips it later',
        ],
        answerIndex: 1,
        explanation: 'Removing from the end of an array is O(1), and the swap keeps the array dense so getRandom can pick a uniform index.',
      },
    ],
    sources: [
      'CLRS ch. 11 (hash tables)',
      'MIT 6.006: Hashing with Chaining',
      'MIT 6.006: Table Doubling and Karp-Rabin',
      'CP-Algorithms: String Hashing',
      'LeetCode editorial: Subarray Sum Equals K',
    ],
  },
]
