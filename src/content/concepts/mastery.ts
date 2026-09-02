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
    definition: 'Spaced repetition is a review schedule in which the gap before you re-solve a problem grows every time you succeed and resets to one day when you fail. A mistake log is a short written record of the exact error you made, read for five minutes before every session.',
    coreIdea: 'Recall fades quickly, but every successful recall made just before you would have forgotten flattens the curve, so the same total hours spread over growing gaps hold far more than the same hours in one block. The log supplies the other half: it turns a vague feeling of weakness into three or four named rules you can drill. Together they change practice from linear, where you see n problems once, to compounding, where a small set stays producible on demand.',
    visual: [
      {
        caption: 'Memory fades fast. Review just before the drop, not later.',
        frame: [
          'recall',
          '100% |*',
          '     |  *      <- review here: cheap, and it',
          ' 60% |    *       resets the curve higher',
          '     |      * *',
          ' 20% |          * * * *   <- review here: you are',
          '   0 +---------------------> days   relearning',
          '     0   1   2   3   4   5   6',
        ].join('\n'),
      },
      {
        caption: 'The ladder: pass doubles the gap, fail resets it to one day.',
        frame: [
          're-solve  day  gap     outcome   next due',
          '   1       0    -      solved     day 1',
          '   2       1    1 day  solved     day 4',
          '   3       4    3 days FAILED     day 5',
          '   4       5    1 day  solved     day 8',
          '   5       8    3 days solved     day 14',
          'gaps run 1, 3, 6, 15 days: roughly doubling',
        ].join('\n'),
      },
      {
        caption: 'One week of 90-minute evenings, written down in advance.',
        frame: [
          '       due  log   new problems   mock',
          'Mon     3   15m   60m            -',
          'Tue     2   15m   60m            -',
          'Wed     4   15m   60m            -',
          'Thu     2   15m   60m            -',
          'Fri     6   15m   none           -',
          'Sat     0   10m   none           45m + 10m review',
          'Sun     rest, or read one pattern page slowly',
        ].join('\n'),
      },
      {
        caption: 'A log entry that is worth re-reading. Three lines, no essay.',
        frame: [
          '2026-03-04  Non-overlapping Intervals  medium',
          '  pattern : greedy + intervals',
          '  wrong   : sorted by start',
          '  rule    : "keep the most" means sort by END',
          '  retry   : day 1 -> day 4 -> day 10',
          'Longer entries never get read a second time.',
        ].join('\n'),
      },
      {
        caption: 'The deck as a min-heap: you only pay for the cards due today.',
        frame: [
          'today = 8, heap ordered by due day',
          '  (5,  merge-intervals)  <- top, 5 <= 8, pop',
          '  (8,  lru-cache)           8 <= 8, pop',
          '  (12, word-search-ii)      12 > 8, STOP',
          '  (20, tries)               never looked at',
          'Deck of 300 cards, 2 pops today, not 300 checks.',
        ].join('\n'),
      },
    ],
    pseudocode: `function daily_session(deck, log, today):
    read the mistake log for 5 minutes

    due <- pop from deck while the top card is due today
    for each card in due:
        solve it from a blank file, no notes, on a timer
        if it was clean and you never peeked:
            card.gap <- card.gap * 2      # 1, 3, 6, 15 days
        else:
            card.gap <- 1                 # a peek counts as a fail
            append one entry to log
        card.due_day <- today + card.gap
        push card back into deck

    spend the rest of the session on new problems
    for each new problem that failed or ran long:
        append one entry to log
        push a new card with gap = 1

    keep at most 3 cards per pattern; drop the rest
    return deck, log`,
    complexity: [
      { label: 'Find todays due cards by scanning a list', time: 'O(n)', space: 'O(n)', note: 'checks 300 cards even when 2 are due' },
      { label: 'Find todays due cards from a min-heap', time: 'O(k log n), k = cards due', space: 'O(n)', note: 'stops at the first card that is not due' },
      { label: 'Reschedule one card', time: 'O(log n)', space: 'O(1)', note: 'one heap push with the new due day' },
      { label: 'Read the mistake log', time: 'O(entries)', space: 'O(entries)', note: 'keep it under 40 lines or the 5 minutes becomes 20' },
      { label: 'Actually re-solving the due cards', time: 'about 8 minutes each', space: 'your attention', note: 'the real cost; the bookkeeping is noise beside it' },
    ],
    dryRun: {
      input: 'deck as a min-heap by due day: [(5, "merge-intervals"), (8, "lru-cache"), (12, "word-search-ii"), (20, "tries")], today = 8',
      goal: 'Run one evening of the method: find the due cards, re-solve them, and reschedule with the gap rule.',
      steps: [
        { state: 'heap top = (5, "merge-intervals"), today = 8', action: '5 <= 8, so pop it. due = ["merge-intervals"].' },
        { state: 'heap top = (8, "lru-cache")', action: '8 <= 8 counts as due today, so pop it too. due = ["merge-intervals", "lru-cache"].' },
        { state: 'heap top = (12, "word-search-ii")', action: '12 > 8, so the while loop stops. The last two cards were never even inspected.' },
        { state: 'due = ["merge-intervals", "lru-cache"], old gap for merge-intervals = 3', action: 'Re-solve Merge Intervals from a blank file. Clean in 9 minutes with no peeking, so the gap doubles to 6 and the card is pushed back as (14, "merge-intervals").' },
        { state: 'old gap for lru-cache = 6', action: 'LRU Cache fails: the node was re-inserted without being unlinked first. Reset the gap to 1 and push (9, "lru-cache").' },
        { state: 'log has 12 entries', action: 'Add one line: LRU Cache / hash map plus doubly linked list / forgot to unlink before re-inserting / rule: always remove, then add at the head.' },
        { state: 'heap = [(9, "lru-cache"), (12, "word-search-ii"), (14, "merge-intervals"), (20, "tries")]', action: 'Bookkeeping took under a minute, so about 70 minutes remain for new problems.' },
      ],
      result: 'Two cards reviewed rather than four inspected, one gap doubled to day 14, one reset to day 9, and one new log line. The schedule is correct because a min-heap always exposes the earliest due card, so no due card can hide behind a later one.',
    },
    mistakes: [
      {
        mistake: 'Re-reading your old solution and calling it a review.',
        why: 'Recognising code is easy and feels like knowing. Producing it from nothing is the skill an interview tests, and only that predicts whether you can do it again.',
        fix: 'Open a blank file, set a timer, and write it from scratch. Compare with the old solution only afterwards.',
      },
      {
        mistake: 'Writing "I was careless" or "silly bug" in the log.',
        why: 'You cannot drill a feeling. Two weeks later that entry tells you nothing, so the log stops being worth reading and you stop reading it.',
        fix: 'Write the rule you broke: "forgot the is_end flag", "used < instead of <= for touching intervals".',
      },
      {
        mistake: 'Doubling the gap after a solve where you glanced at a hint.',
        why: 'The gap schedule assumes the recall was unaided. One peek makes the next interval far too long and the card silently rots.',
        fix: 'Treat any peek, any hint, any "let me just check the signature" as a failure. Reset to one day.',
      },
      {
        mistake: 'Letting the deck grow to 400 cards.',
        why: 'When 40 cards come due in a day you review none of them, and the whole system is abandoned within a week.',
        fix: 'Cap it at two or three problems per pattern, chosen because they are representative, and delete the rest without guilt.',
      },
      {
        mistake: 'Saving all revision for one long Sunday block.',
        why: 'Massed practice feels productive and decays fast; the whole point is the gap between attempts, which a single block removes.',
        fix: 'Spread 15 minutes of due cards across four or five evenings instead.',
      },
    ],
    whenToUse: [
      'You have solved a hundred problems or more and the early ones are starting to feel unfamiliar.',
      'You can name the pattern in a second but cannot write it without checking your old code.',
      'Your interviews are four or more weeks away, which is long enough for the gaps to do their work.',
      'The same class of bug keeps appearing: wrong sort key, off-by-one bound, forgotten edge case.',
      'Your study time is fixed at about 90 minutes and you must decide what to drop.',
    ],
    whenNotToUse: [
      'You have not learned the pattern properly even once: read and solve it first, there is nothing yet to space out.',
      'The interview is in three days: drop the ladder and run targeted mocks on your two weakest patterns instead.',
      'You are exploring a brand new topic: go for breadth first and start scheduling once you have solved a few.',
      'Card bookkeeping has become more fun than solving: cut the deck to ten cards and get back to problems.',
      'The gap is system design or behavioural interviews: those need their own track, not a re-solve deck.',
    ],
    relatedTopics: [
      { id: 'heap-basics', kind: 'concept', why: 'A min-heap keyed by due date is exactly the structure this schedule needs, and it is the same one you learned in the Heaps gate.' },
      { id: 'mock-interview-method', kind: 'concept', why: 'The weekly mock is the test that tells the deck which cards to reset to one day.' },
      { id: 'top-k-heap', kind: 'pattern', why: 'Same idea as the deck: keep only the extreme element visible instead of sorting everything.' },
      { id: 'greedy', kind: 'pattern', why: 'Always handling the most overdue card first is a greedy scheduling rule, and here it is provably fine.' },
    ],
    quiz: [
      {
        question: 'You re-solve a card correctly, but halfway through you opened your old solution to check one line. What should the next gap be?',
        options: ['Double the gap, since the code was correct in the end', 'Keep the same gap', 'Reset the gap to one day, because a peek is a failed recall', 'Delete the card, since you clearly know it'],
        answerIndex: 2,
        explanation: 'The schedule only works if the recall was unaided. A peek means you could not produce it, so the interval must go back to the start.',
      },
      {
        question: 'Your deck has 300 cards and 4 are due today. Using a min-heap keyed by due day, how much bookkeeping work is that?',
        options: ['O(n), one check per card', 'O(k log n) with k = 4, so a handful of operations', 'O(n log n), because the deck must be re-sorted', 'O(1), heaps answer in constant time'],
        answerIndex: 1,
        explanation: 'You pop only the cards that are actually due and stop at the first one that is not, so the cost follows k, not the deck size. The list scan would be O(300).',
      },
      {
        question: 'Which mistake-log entry is actually worth re-reading in two weeks?',
        options: ['"Merge Intervals: got it wrong, be careful next time"', '"Merge Intervals: assigned last[1] = end instead of max(last[1], end), so [1,10] then [2,3] shrank to [1,3]"', '"Intervals are hard"', '"Merge Intervals: solved in 12 minutes"'],
        answerIndex: 1,
        explanation: 'It names the exact line, the reason, and a concrete input that exposes it, so it is drillable. The others cannot be turned into an action.',
      },
      {
        question: 'You want to keep 12 problems fresh over the next month with the least total time. Does one long Sunday session on all 12 work as well as spreading them?',
        options: ['Yes, total time is what matters', 'Yes, provided you re-solve rather than re-read', 'No, the gap between attempts is what strengthens recall, and one block removes it', 'No, but only because Sundays are tiring'],
        answerIndex: 2,
        explanation: 'Massed practice feels efficient and fades fast. The spacing itself, not the total minutes, is what makes the memory last.',
      },
    ],
    sources: [
      'Ebbinghaus forgetting-curve work and modern replications',
      'Roediger and Karpicke on retrieval practice; Bjork on desirable difficulties',
      'The SM-2 spacing algorithm used by Anki and similar tools',
      'CLRS ch. 6: binary heaps, used here for the due-date queue',
      'USACO Guide: practising and how to improve',
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
        tier: 'beginner',
      },
      {
        id: 'find-all-anagrams-in-a-string',
        title: 'Find All Anagrams in a String',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
        patternId: 'sliding-window',
        hint: 'Slide a window the size of p and compare letter counts as you add one char and drop one.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'top-k-frequent-words',
        title: 'Top K Frequent Words',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/top-k-frequent-words/',
        patternId: 'top-k-heap',
        hint: 'Count with a map, then keep a heap of size k ordered by (frequency, reverse alphabetical).',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'maximum-product-subarray',
        title: 'Maximum Product Subarray',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-product-subarray/',
        patternId: 'dp-1d',
        hint: 'Track both the max and min product ending here, because a negative number can flip them.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'task-scheduler',
        title: 'Task Scheduler',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/task-scheduler/',
        patternId: 'greedy',
        hint: 'Always run the most frequent remaining task; a max-heap plus a cooldown queue simulates it.',
        xp: 40,
        tier: 'advanced',
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
    definition: 'A solo mock interview is a full-length run at an unseen problem under a 45-minute timer, spoken aloud, following one fixed six-step script: clarify, brute force, optimise, code, test, then state the complexity.',
    coreIdea: 'Under stress people fall back on habits, not on knowledge, so the script is the habit you install ahead of time. Fixing the order means you cannot spend the first ten minutes silently panicking or discover at minute 44 that you have no time left to test. It also forces the two things interviewers grade hardest, out-loud reasoning and a stated complexity, into steps that cannot be quietly skipped.',
    visual: [
      {
        caption: 'The 45 minutes, divided before the timer starts.',
        frame: [
          'min 0    5    10   15   20   25   30   35   40   45',
          'clar[==]',
          'brut    [==]',
          'opt         [========]',
          'code                  [=============]',
          'test                                 [=====]',
          'cplx                                        [===]',
        ].join('\n'),
      },
      {
        caption: 'Step 1, clarify: restate, ask, and write two examples by hand.',
        frame: [
          'CLARIFY  minutes 0 to 4        say all of it aloud',
          ' restate: "given nums and a target, return the',
          '           two indices that add up to target"',
          ' ask    : how big is n?  negatives?  duplicates?',
          '          exactly one answer?  what if none?',
          ' write  : [2,7,11,15] t=9  ->  [0,1]',
          '          [3,3]      t=6  ->  [0,1]   duplicates',
        ].join('\n'),
      },
      {
        caption: 'Steps 2 and 3: name the slow way, then run the signal checklist.',
        frame: [
          'BRUTE FORCE  4 to 8',
          '  "every pair is O(n^2); at n = 10^5 that is',
          '   10^10 operations, far too slow" - do not code it',
          'OPTIMISE  8 to 18   run the checklist out loud:',
          '  sorted?          -> binary search / two pointers',
          '  contiguous run?  -> sliding window',
          '  seen before?     -> hash map        <-- matches',
          '  count the ways?  -> dynamic programming',
          '  then say the target: O(n) time, O(n) space',
        ].join('\n'),
      },
      {
        caption: 'Steps 4 to 6: code, then trace a table, then say the cost.',
        frame: [
          'CODE  18 to 33   narrate each block, real names',
          'TEST  33 to 40   trace it in a table:',
          '   x    seen        needed   what happens',
          '   2    {}          7        not there, add 2',
          '   7    {2: 0}      2        found, return [0,1]',
          '  edges: [], [3,3], all negative, no answer',
          'COMPLEXITY  40 to 45',
          '  "O(n) time, one pass; O(n) space, the map can',
          '   hold every value"',
        ].join('\n'),
      },
      {
        caption: 'The 10 minutes after the timer are where the learning is.',
        frame: [
          'scorecard',
          '  finished inside 45 min?     yes / no',
          '  which step overran?         optimise, 14 min',
          '  silent for over 30 seconds? twice',
          '  who found the bug?          my own test',
          '  stated complexity aloud?    yes',
          '  -> one line into the mistake log, then stop',
        ].join('\n'),
      },
    ],
    pseudocode: `function mock_interview(unseen_problem):
    start a 45 minute timer; speak every thought aloud

    # 1. clarify, about 4 minutes
    restate the problem in your own words
    ask about size, value ranges, duplicates, empty input
    write one normal example and one edge case by hand

    # 2. brute force, about 4 minutes
    state the obvious solution and its complexity
    say why it is too slow for the stated limits
    do not write it

    # 3. optimise, about 10 minutes
    for each signal in [sorted, contiguous window,
                        seen before, next greater,
                        count the ways, graph shape]:
        if the problem matches signal:
            name the pattern and the target complexity
    write the plan as three or four bullet lines

    # 4. code, about 15 minutes
    write top to bottom, narrating each block
    if stuck for 60 seconds: say what is blocking you,
                             then reread the plan

    # 5. test, about 7 minutes
    trace one example line by line in a table
    then try empty, one element, all equal, negatives

    # 6. complexity, about 3 minutes
    state time and space and where each one comes from

    stop the timer, then spend 10 minutes reviewing`,
    complexity: [
      { label: 'n up to about 20', time: 'O(2^n) or O(n * 2^n) is expected', space: 'O(2^n)', note: 'bitmask or backtracking; say so early' },
      { label: 'n up to about 10^3', time: 'O(n^2) is accepted', space: 'O(n^2)', note: 'nested loops or a 2D DP table' },
      { label: 'n up to about 10^5', time: 'O(n log n) or O(n)', space: 'O(n)', note: 'sort, hash map, two pointers, heap' },
      { label: 'n up to about 10^6', time: 'O(n)', space: 'O(n)', note: 'one pass; avoid the sort if you can' },
      { label: 'values up to 10^9 or more', time: 'O(log n)', space: 'O(1)', note: 'binary search on the answer, or arithmetic' },
    ],
    dryRun: {
      input: 'A 45-minute solo mock on Contains Duplicate, with nums = [1, 2, 3, 1]',
      goal: 'Run the six-step script once and finish with working code plus a stated complexity, matching the optimized contains_duplicate above.',
      steps: [
        { state: 'timer 0:00, step 1 clarify', action: 'Restate: return True if any value appears more than once. Ask: n up to 10^5, values may be negative, return a boolean. Write [1,2,3,1] -> True and [] -> False.' },
        { state: 'timer 4:00, step 2 brute force', action: 'Say it out loud: compare every pair, O(n^2), which at n = 10^5 is 10^10 comparisons and far too slow. Do not code it.' },
        { state: 'timer 8:00, step 3 optimise', action: 'The signal is "have I seen this value before?", which is a hash set lookup in O(1) on average. State the target before coding: O(n) time, O(n) space.' },
        { state: 'timer 12:00, step 4 code, seen = set()', action: 'Write the loop while narrating: for each x, if x is in seen return True, otherwise add x, and return False at the end.' },
        { state: 'timer 25:00, step 5 test, x = 1, seen = {}', action: '1 is not in seen, so add it. seen = {1}.' },
        { state: 'x = 2, seen = {1}', action: 'Not seen, so add. seen = {1, 2}. Then x = 3 is not seen either, so seen = {1, 2, 3}.' },
        { state: 'x = 1, seen = {1, 2, 3}', action: '1 is already in seen, so return True at the fourth element. Then check the edges: [] never enters the loop and returns False, and [5] returns False.' },
        { state: 'timer 40:00, step 6 complexity', action: 'State it: one pass so O(n) time; the set can hold every value so O(n) space; say out loud that you are trading memory for time.' },
      ],
      result: 'True for [1, 2, 3, 1], returned at the fourth element. The run counts as a pass because all six steps happened in order, no code was written before the approach was named aloud, and the answer ended with an explicit O(n) time and O(n) space statement.',
    },
    mistakes: [
      {
        mistake: 'Starting to type at minute one.',
        why: 'Almost every failed mock begins this way. You end up coding the wrong problem, or an approach you cannot finish, and there is no time left to recover.',
        fix: 'Hands off the keyboard until step 3 has produced three or four bullet lines of plan.',
      },
      {
        mistake: 'Thinking silently for two minutes at a time.',
        why: 'The interviewer only grades what they hear. Silence reads as being stuck, and it also removes their chance to nudge you back on track.',
        fix: 'Narrate the dead ends too: "I considered two pointers, but the array is not sorted, so I am moving to a hash map".',
      },
      {
        mistake: 'Practising on problems you have already solved.',
        why: 'You are testing recognition, not problem solving, so the mock always feels good and teaches nothing about the part that actually fails.',
        fix: 'Keep a small list of unseen mediums reserved for mocks and never touch them outside a timed run.',
      },
      {
        mistake: 'Finishing the code and stopping, or saying only "it is O(n)".',
        why: 'Skipping the test step means the interviewer finds your bug instead of you, and a bare O(n) with no space claim reads as guessing.',
        fix: 'Always trace one example in a table, then say both bounds and where each comes from: the loop, the sort, the map.',
      },
      {
        mistake: 'Running a mock and moving straight to the next problem.',
        why: 'Without the review you never learn which step overran, so the same 15-minute stall repeats every week.',
        fix: 'Spend ten minutes on the scorecard afterwards and write one line into your mistake log.',
      },
    ],
    whenToUse: [
      'You solve mediums fine untimed but freeze or ramble when a clock is running.',
      'You have covered the patterns and now need delivery practice rather than more theory.',
      'Real interviews are two to six weeks away.',
      'You want to find out which of the six steps eats your time, and you can only see that by measuring.',
      'Once or twice a week, on a fresh unseen medium, with the review afterwards.',
    ],
    whenNotToUse: [
      'You cannot yet solve mediums untimed: learn the patterns first, or the mock only trains panic.',
      'You need feedback on tone, follow-up questions and how you handle hints: a human partner or a paid mock beats solo.',
      'The interview is system design or behavioural: those need their own scripts, such as requirements, scale estimate, components, trade-offs.',
      'You are exhausted after work: an untimed re-solve teaches more than a failed mock you will not review.',
      'Every single day: seven rushed mocks with no review teach less than two reviewed ones.',
    ],
    relatedTopics: [
      { id: 'revision-strategy', kind: 'concept', why: 'A failed mock produces log entries and pushes those cards back to a one-day gap.' },
      { id: 'big-o-basics', kind: 'concept', why: 'Step 6 is a complexity statement, so this is where the very first gate finally pays off.' },
      { id: 'competitive-programming-intro', kind: 'concept', why: 'Contests train the same speed with a stricter judge and no talking; treat them as the strength work.' },
      { id: 'hash-map', kind: 'pattern', why: 'The "have I seen this before" signal in step 3 is the single most common optimisation in interviews.' },
      { id: 'brute-force', kind: 'pattern', why: 'Step 2 is a deliberate brute force, said aloud as a fallback rather than written down.' },
    ],
    quiz: [
      {
        question: 'Two minutes in you already see the O(n) hash map solution. What should you do?',
        options: ['Start coding immediately while you remember it', 'Finish clarifying, name the brute force and its complexity, then state your plan before coding', 'Skip straight to testing', 'Ask the interviewer whether your answer is right'],
        answerIndex: 1,
        explanation: 'The steps exist because the interviewer grades your process. Naming the brute force takes thirty seconds and gives you a safety net if the clever idea turns out to be wrong.',
      },
      {
        question: 'The problem says n can be 10^5 and the time limit is normal. Which complexity should you be aiming for?',
        options: ['O(n^2) is fine at that size', 'O(n log n) or O(n)', 'O(2^n) with memoisation', 'O(n^3) if the constant is small'],
        answerIndex: 1,
        explanation: 'At n = 10^5, an O(n^2) solution is about 10^10 operations. Saying the target complexity out loud in step 3 is often what earns the "strong hire" signal.',
      },
      {
        question: 'Which step should get the biggest slice of the 45 minutes?',
        options: ['Clarify', 'Brute force', 'Coding, roughly 15 minutes', 'Complexity'],
        answerIndex: 2,
        explanation: 'Coding gets the largest block, but only about a third. If it needs more than that, the plan from step 3 was not concrete enough.',
      },
      {
        question: 'Is re-running a mock on a problem you solved last week a good use of a 45-minute slot?',
        options: ['Yes, repetition builds speed', 'Yes, if you use a different language', 'No, you would be testing recognition; use a fresh unseen problem and put the old one in your spaced-repetition deck instead', 'No, mocks should only use hard problems'],
        answerIndex: 2,
        explanation: 'A mock measures how you handle something new. Re-solving a known problem is valuable, but it belongs in the revision deck, not in the mock slot.',
      },
    ],
    sources: [
      'Cracking the Coding Interview: the interview process and evaluation chapters',
      'Public mock-interview transcripts and write-ups from interviewing.io',
      'Published engineering-hiring rubrics from large technology companies',
      'LeetCode and NeetCode editorials for Contains Duplicate and Two Sum',
      'CSES Competitive Programmers Handbook ch. 1: constraints and time limits',
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
        tier: 'beginner',
      },
      {
        id: 'string-compression',
        title: 'String Compression',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/string-compression/',
        patternId: 'two-pointers',
        hint: 'Use a read pointer to count a run and a write pointer to overwrite the array in place.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'minimum-size-subarray-sum',
        title: 'Minimum Size Subarray Sum',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
        patternId: 'sliding-window',
        hint: 'Grow the window from the right; while the sum is at least the target, record the length and shrink from the left.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'k-closest-points-to-origin',
        title: 'K Closest Points to Origin',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
        patternId: 'top-k-heap',
        hint: 'Keep a max-heap of size k on squared distance; pop when it grows past k.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'largest-number',
        title: 'Largest Number',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/largest-number/',
        patternId: 'greedy',
        hint: 'Sort strings with a custom comparison: a before b if a + b is greater than b + a.',
        xp: 40,
        tier: 'advanced',
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
    definition: 'Competitive programming is solving algorithm problems against a clock and an automatic judge: your program reads from standard input, must print exactly the expected output, and must finish inside a time limit that is usually one or two seconds.',
    coreIdea: 'The judge grades one thing only, so the constraints in the statement are not decoration, they are the specification of the complexity you are allowed to use. Reading "n up to 2 * 10^5" first tells you the answer is O(n log n) before you have read a word of the story, which turns "invent something" into "pick the technique that fits the budget". Roughly 10^8 simple operations fit in a second, and almost every other rule of thumb follows from that one number.',
    visual: [
      {
        caption: 'The one number to remember: about 10^8 simple steps per second.',
        frame: [
          'n = 10^5   O(n^2)      = 10^10      too slow',
          'n = 10^5   O(n log n)  = 1.7 * 10^6  fine',
          'n = 10^6   O(n)        = 10^6        fine',
          'n = 20     O(2^n)      = 1.0 * 10^6  fine',
          'n = 25     O(2^n)      = 3.4 * 10^7  tight',
          'n = 11     O(n!)       = 4.0 * 10^7  tight',
          'Constants matter, so treat these as rough.',
        ].join('\n'),
      },
      {
        caption: 'Read the constraint, then read the story. The limit names the tool.',
        frame: [
          'n <= 10        O(n!)       permutations',
          'n <= 20        O(2^n)      bitmask, subset DP',
          'n <= 500       O(n^3)      Floyd-Warshall',
          'n <= 5000      O(n^2)      pair DP, LCS, edit dist',
          'n <= 2 * 10^5  O(n log n)  sort, heap, binary',
          '                           search, two pointers',
          'n <= 10^6      O(n)        one pass, counting',
          'value <= 10^18 O(log n)    fast power, binary',
          '                           search on the answer',
        ].join('\n'),
      },
      {
        caption: 'Same O(n), different constant. The judge measures the constant.',
        frame: [
          'reading 2 * 10^5 integers in Python',
          '  for _ in range(n): int(input())   slow',
          '  sys.stdin.buffer.read().split()   about 10x faster',
          'Big-O is identical; only the constant changed,',
          'and the constant is what the time limit sees.',
          'C++ : ios::sync_with_stdio(false); cin.tie(nullptr);',
          'Java: BufferedReader or StreamTokenizer, not Scanner',
        ].join('\n'),
      },
      {
        caption: 'A two-hour Division 2 round for a beginner, in minutes.',
        frame: [
          'min 0   20  40  60  80  100 120',
          'A   [===]                      solve fast, submit',
          'B       [====]                 still comfortable',
          'C            [========]        the real problem',
          'D                     [???]    read it, maybe',
          'E/F                       [-]  skip without guilt',
          'each wrong submission adds about 10 minutes',
        ].join('\n'),
      },
      {
        caption: 'Wrong answer on test 3? Stress test instead of guessing.',
        frame: [
          '1. reread the limits you skimmed',
          '2. write the slow brute force for tiny n',
          '3. generate random small inputs in a loop',
          '4. run both, compare, stop at the first mismatch',
          '5. that mismatch is a 6-element failing case',
          'Resubmitting a guess costs 10 minutes each time;',
          'the stress test usually costs five.',
        ].join('\n'),
      },
    ],
    pseudocode: `function contest_round(problems):
    for each problem in order A, B, C, ...:
        read the constraints FIRST, then the story
        budget <- about 10^8 simple operations per second
        target <- the complexity that fits n in that budget

        if no idea after 5 minutes:
            move on, and come back later

        design a solution whose cost is at most target
        write it with fast input and fast output
        run the samples
        also run: n = 1, all values equal, the maximum n,
                  negatives, and the empty case
        if any of those look wrong:
            fix it before submitting     # a wrong verdict
                                         # costs about 10 min
        submit

    after the round, upsolve:
        pick one problem you did not solve
        try it again untimed before reading anything
        only then read the editorial, and implement it
        yourself until it is accepted`,
    complexity: [
      { label: 'n <= 20', time: 'O(2^n)', space: 'O(2^n) for subset DP', note: 'bitmask over subsets is the intended answer' },
      { label: 'n <= 5000', time: 'O(n^2)', space: 'O(n^2), or O(n) with a rolling row', note: 'pair DP such as LCS or edit distance' },
      { label: 'n <= 2 * 10^5', time: 'O(n log n)', space: 'O(n)', note: 'sort, heap, binary search, two pointers, prefix sums' },
      { label: 'n <= 10^6', time: 'O(n)', space: 'O(n)', note: 'one pass; watch the memory limit as well as the clock' },
      { label: 'values up to 10^18', time: 'O(log n)', space: 'O(1)', note: 'fast exponentiation or binary search on the answer' },
    ],
    dryRun: {
      input: 'Problem: read n, then n integers, and print their sum. Constraints: n up to 2 * 10^5, each value up to 10^9, time limit 1 second.',
      goal: 'Pick the complexity from the constraints and write the version that fits the limit, matching the optimized fast-input code above.',
      steps: [
        { state: 'constraints read first: n <= 2 * 10^5, values <= 10^9', action: 'The budget is about 10^8 operations per second, so O(n) or O(n log n) is safe and anything quadratic (4 * 10^10) is hopeless. One pass is enough here.' },
        { state: 'largest possible sum = 2 * 10^5 * 10^9 = 2 * 10^14', action: 'That does not fit a 32-bit int, whose limit is about 2.1 * 10^9, so C++ and Java need long long or long. Python integers grow on their own.' },
        { state: 'data = sys.stdin.buffer.read().split()', action: 'Read the entire stream in one call and split it into tokens, so the 200000 per-line Python calls disappear.' },
        { state: 'n = int(data[0]) = 200000, total = 0', action: 'Parse n from the first token; everything after it is a value.' },
        { state: 'i = 1, total = 0', action: 'Add int(data[1]) to total. Each step is O(1) and the loop runs exactly n times.' },
        { state: 'i = n, total = the running sum', action: 'After the last token the loop ends. Nothing was sorted and nothing was nested, so the work is exactly n additions.' },
        { state: 'total is computed', action: 'Write the answer once with sys.stdout.write instead of calling print inside a loop.' },
      ],
      result: 'The sum, printed once. It passes because the algorithm is O(n) at n = 2 * 10^5, the parsing happens in one C-level split rather than 200000 interpreted calls, and the accumulator cannot overflow in Python and is declared 64-bit in C++ and Java.',
    },
    mistakes: [
      {
        mistake: 'Getting Time Limit Exceeded and rewriting the algorithm.',
        why: 'In Python the input reading alone can eat most of a one-second limit, so a perfectly good O(n log n) solution fails and you waste the round rewriting the wrong part.',
        fix: 'Switch to sys.stdin.buffer.read().split() and one buffered write first, then re-measure before touching the algorithm.',
      },
      {
        mistake: 'Summing values into an int in C++ or Java.',
        why: 'A 32-bit int stops at about 2.1 * 10^9. Adding 2 * 10^5 values of 10^9 overflows silently and gives a wrong answer with no crash and no warning.',
        fix: 'Use long long in C++ and long in Java whenever a sum or product can exceed 2 * 10^9, and cast before multiplying, not after.',
      },
      {
        mistake: 'Resubmitting a small tweak after each wrong-answer verdict.',
        why: 'Every wrong submission adds a penalty of roughly ten minutes, and guessing rarely finds a logic bug you cannot see.',
        fix: 'Stress test: write the obvious brute force, generate random tiny inputs, and compare until the first mismatch shows you a failing case you can read.',
      },
      {
        mistake: 'Reading the story first and only meeting the constraints at the end.',
        why: 'You design for the example, not for the limit, and then discover your O(n^2) idea is unusable after twenty minutes of thinking.',
        fix: 'Read the constraints block first, write down the target complexity, and only then read the statement.',
      },
      {
        mistake: 'Leaving the contest as soon as it ends.',
        why: 'The problems you failed are the only ones with something left to teach, and without upsolving a contest is just two hours of stress.',
        fix: 'Upsolve exactly one failed problem after every round: retry it untimed, then read the editorial, then get it accepted yourself.',
      },
    ],
    whenToUse: [
      'You want speed and accuracy under pressure rather than new patterns.',
      'You already solve LeetCode mediums comfortably and need harder, timed practice.',
      'You want an external and honest measure of progress, which is what the rating is.',
      'You keep failing on large hidden test cases and need to learn to read constraints properly.',
      'You enjoy competing, and that is what keeps you practising week after week.',
    ],
    whenNotToUse: [
      'Your interview is in two weeks: mocks and pattern revision give a much better return on those hours.',
      'You are still learning the basic patterns: contests will mostly teach frustration, so finish the earlier gates first.',
      'You need system design, testing, or language depth: contests never touch those.',
      'You want clean, reviewable, maintainable code: contest style is deliberately the opposite of production style.',
      'You have started optimising your rating instead of learning: go back to upsolving and virtual rounds.',
    ],
    relatedTopics: [
      { id: 'mock-interview-method', kind: 'concept', why: 'Both are timed practice; the mock adds talking, the contest adds a judge that accepts nothing but exact output.' },
      { id: 'big-o-basics', kind: 'concept', why: 'The constraint-to-complexity table is simply Big-O used as a spending budget.' },
      { id: 'prefix-sums', kind: 'concept', why: 'Turning many range queries into O(1) each is one of the most common contest speed-ups.' },
      { id: 'binary-search-on-answer', kind: 'pattern', why: 'The standard move when n is enormous but the answer is monotone.' },
      { id: 'revision-strategy', kind: 'concept', why: 'Upsolving is spaced repetition applied to contest problems.' },
    ],
    quiz: [
      {
        question: 'A problem has n up to 2 * 10^5 and a one-second limit. Will an O(n^2) solution pass?',
        options: ['Yes, 2 * 10^5 is small', 'No, that is about 4 * 10^10 operations, hundreds of times over the budget', 'Yes, if you write it in C++', 'Only if the constant factor is under 2'],
        answerIndex: 1,
        explanation: 'The budget is roughly 10^8 simple operations per second, and n^2 here is 4 * 10^10. No language constant closes that gap; you need O(n log n) or better.',
      },
      {
        question: 'Your Python solution is O(n log n) but gets Time Limit Exceeded while reading 2 * 10^5 numbers. What is the first thing to change?',
        options: ['Find an O(n) algorithm', 'Switch to fast input: read the whole stream once and split it', 'Rewrite it in C++ immediately', 'Add memoisation'],
        answerIndex: 1,
        explanation: 'The Big-O is already fine, so the problem is the constant. Per-line input() calls can cost most of the limit on their own; one buffered read removes that.',
      },
      {
        question: 'The statement says n is at most 20 and asks for the best over all groupings. Which complexity is the setter expecting?',
        options: ['O(n)', 'O(n log n)', 'O(2^n), a bitmask over subsets', 'O(n^3)'],
        answerIndex: 2,
        explanation: 'A limit of 20 is almost a signature: 2^20 is about a million, which fits easily, and no sane problem sets n = 20 for an O(n) solution.',
      },
      {
        question: 'In C++ you sum 2 * 10^5 values, each up to 10^9, into a variable. Which type do you need?',
        options: ['int is fine', 'long long, because the sum reaches 2 * 10^14', 'unsigned int', 'double, for the extra range'],
        answerIndex: 1,
        explanation: 'A 32-bit int caps at about 2.1 * 10^9, so the sum overflows silently. long long holds it, and double would lose exact integer precision past 2^53.',
      },
    ],
    sources: [
      'CSES Competitive Programmers Handbook (Laaksonen), ch. 1 and 2',
      'CP-Algorithms: complexity guidance and standard techniques',
      'USACO Guide: contest strategy, fast input and output, and debugging',
      'Codeforces blogs on fast input and output and on stress testing',
      'AtCoder Beginner Contest editorials',
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
        tier: 'beginner',
      },
      {
        id: 'powx-n',
        title: 'Pow(x, n)',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/powx-n/',
        patternId: 'divide-and-conquer',
        hint: 'Square the base and halve the exponent each step; handle negative n by inverting.',
        xp: 40,
        tier: 'beginner',
      },
      {
        id: 'maximum-number-of-events-that-can-be-attended',
        title: 'Maximum Number of Events That Can Be Attended',
        difficulty: 'medium',
        url: 'https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/',
        patternId: 'greedy',
        hint: 'Sweep the days; push events that have started into a min-heap by end day and attend the one ending soonest.',
        xp: 40,
        tier: 'intermediate',
      },
      {
        id: 'russian-doll-envelopes',
        title: 'Russian Doll Envelopes',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/russian-doll-envelopes/',
        patternId: 'lcs-lis',
        hint: 'Sort by width ascending and height descending, then run the O(n log n) LIS on heights.',
        xp: 80,
        tier: 'advanced',
      },
      {
        id: 'range-sum-query-mutable',
        title: 'Range Sum Query - Mutable',
        difficulty: 'hard',
        url: 'https://leetcode.com/problems/range-sum-query-mutable/',
        patternId: 'divide-and-conquer',
        hint: 'A Fenwick tree or segment tree gives O(log n) for both update and range sum.',
        xp: 80,
        tier: 'advanced',
      },
    ],
  },
]
