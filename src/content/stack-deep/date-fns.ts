import type { TechDeep } from '../stack-types'

export const dateFnsDeep: TechDeep = {
  analogy:
    'A drawer of single-purpose kitchen tools instead of one giant multi-tool. Need to zest a lemon, take the zester; need to pit a cherry, take the pitter. Each tool does one thing, weighs nothing, and never changes the fruit you hand it. date-fns is that drawer: two hundred small functions, each taking a Date and returning a new one, and you carry only the ones you use.',

  origins: `date-fns was started by **Sasha Koss** in **2014** as a collection of date helpers, and grew into the most-used alternative to Moment.js. Version 2 (2018) settled the API, version 3 (January 2024) went ESM-first with full TypeScript types, and **version 4** (September 2024), used here, added first-class time zone support through a companion package.

The problem was Moment. For a decade, Moment.js was how JavaScript handled dates, and it had three faults that grew worse as bundles were scrutinised. Its objects were **mutable**: \`date.add(1, 'day')\` changed the date you already held, a classic source of bugs. It was **monolithic**: importing one function loaded all 70 KB plus locale data. And it wrapped the native \`Date\` in its own class, so every library boundary needed conversion. Moment's own maintainers put it in maintenance mode in 2020 and recommended alternatives.

date-fns made the opposite choices: plain functions that take and return native \`Date\` objects, never mutate their inputs, and are exported one per module so a bundler keeps only what you import. Formatting tokens follow the Unicode standard shared with Java and other platforms. The philosophy is that the language already has a date type; it just lacks a good standard library for it.`,

  concepts: [
    {
      title: 'Native Date, pure functions',
      body: `Every date-fns function takes a \`Date\` (or a timestamp) and returns a new value. It never modifies the argument. There is no wrapper class to learn: the thing you pass in is the thing the browser gives you from \`new Date()\`, the thing \`JSON\` and React and every other library already understand. Because functions are pure, they are trivially safe to call in render.`,
      lang: 'ts',
      code: `import { addDays, isAfter, differenceInCalendarDays } from 'date-fns'

const today = new Date()
const due = addDays(today, 7)            // new Date; today is unchanged

isAfter(due, today)                      // true
differenceInCalendarDays(due, today)     // 7

// Moment, for contrast: today.add(7, 'days') would have mutated today`,
    },
    {
      title: 'Local dates versus instants',
      body: `A \`Date\` is an instant: a count of milliseconds since 1970 in UTC. "Today" is not an instant; it is a calendar day in a time zone. Most bugs in date handling come from mixing the two. A study log keyed by day should use a **local calendar key** like \`2026-09-06\`, produced by \`format\` in the user's zone, not \`toISOString()\`, which is UTC and can roll over to yesterday or tomorrow near midnight. date-fns operates in the environment's local zone by default, which is what a personal app wants.`,
      lang: 'ts',
      code: `import { format, startOfDay, parseISO } from 'date-fns'

const key = format(new Date(), 'yyyy-MM-dd')     // '2026-09-06' in the user's zone
new Date().toISOString()                         // '2026-09-05T20:30:00.000Z' — UTC, wrong key at 2 am IST

const dayStart = startOfDay(new Date())          // local midnight
parseISO('2026-09-06')                           // local midnight of that day`,
    },
    {
      title: 'Formatting and parsing with Unicode tokens',
      body: `\`format(date, pattern)\` uses Unicode Technical Standard 35 tokens: \`yyyy\` year, \`MM\` two-digit month, \`MMM\` short month name, \`EEEE\` weekday name, \`HH\` 24-hour, \`h\` 12-hour with \`a\` for am/pm. Letters in the pattern that are not tokens must be quoted. \`parse\` does the reverse with the same tokens. Watch for \`YYYY\` (week-numbering year) and \`DD\` (day of year), which are legal tokens that mean something else and are the classic source of wrong dates around New Year.`,
      lang: 'ts',
      code: `format(d, 'EEEE, d MMMM yyyy')      // 'Sunday, 6 September 2026'
format(d, 'dd/MM/yy HH:mm')          // '06/09/26 19:32'
format(d, "'Day' D")                 // wrong: D is day-of-year; you meant 'd'
format(d, "'Week of' MMM d")         // 'Week of Sep 6'   (quoted literal text)

parse('06/09/2026', 'dd/MM/yyyy', new Date())   // a Date at local midnight`,
    },
    {
      title: 'Calendar arithmetic',
      body: `Adding a month is not adding 30 days. \`addMonths(Jan 31, 1)\` is Feb 28 (or 29), because the library clamps to the last valid day, which matches what a person expects for a monthly schedule. \`startOfWeek\` respects a \`weekStartsOn\` option so a Monday-first planner and a Sunday-first one both work. \`eachDayOfInterval\` produces the days of a range, which is how a calendar grid or a streak count is built.`,
      lang: 'ts',
      code: `import { addMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'

addMonths(new Date(2026, 0, 31), 1)        // 28 Feb 2026, not 3 Mar

const week = { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) }
const days = eachDayOfInterval(week)       // Mon..Sun as Dates

const studied = days.filter((d) => log.some((entry) => isSameDay(d, entry.date)))`,
    },
    {
      title: 'Relative and human text',
      body: `\`formatDistance\` and \`formatDistanceToNow\` produce "3 days ago" style text; \`formatRelative\` gives "yesterday at 7:30 PM". These read locale data, so importing a locale from \`date-fns/locale\` and passing it as an option translates the output. The English locale is the only one bundled by default; each additional locale is a separate import so you pay only for the languages you offer.`,
      lang: 'ts',
      code: `import { formatDistanceToNow, formatRelative } from 'date-fns'
import { enIN } from 'date-fns/locale'

formatDistanceToNow(lastSession, { addSuffix: true })          // '2 days ago'
formatRelative(lastSession, new Date(), { locale: enIN })     // 'last Friday at 7:32 pm'`,
    },
    {
      title: 'Tree-shaking and the function-per-module design',
      body: `The package exports each function from its own file with no side effects. Import twelve functions and the bundle contains twelve small functions plus a couple of shared helpers, a few kilobytes. The v3 rewrite made every function a default and named export from \`date-fns/<name>\` as well as from the root, so both import styles tree-shake. Compare Moment, where \`import moment\` was the whole library.`,
      lang: 'ts',
      code: `// both forms tree-shake in v3+
import { format, addDays } from 'date-fns'
import format from 'date-fns/format'

// what ships:  format (~3 KB), addDays (~0.3 KB), shared helpers (~1 KB)
// what does not ship:  the other ~200 functions and every other locale`,
    },
    {
      title: 'Time zones with @date-fns/tz',
      body: `The native \`Date\` has no zone; it is an instant, displayed in the environment's zone. When you need "9 am in Kolkata regardless of where the browser is", v4 adds \`TZDate\`, a \`Date\` subclass carrying a zone, and \`tz()\` context options so every date-fns function can operate in a named zone. For a single-user app in one zone the default local behaviour is right; for a shared schedule across zones, this is the tool.`,
      lang: 'ts',
      code: `import { TZDate } from '@date-fns/tz'
import { addHours, format } from 'date-fns'

const kolkata = new TZDate(2026, 8, 6, 9, 0, 'Asia/Kolkata')   // 9:00 IST
format(kolkata, 'HH:mm zzz')                                    // '09:00 IST'
format(addHours(kolkata, 5), 'HH:mm')                           // '14:00', still in IST

// same instant seen from London
format(kolkata.withTimeZone('Europe/London'), 'HH:mm zzz')      // '04:30 BST'`,
    },
  ],

  visual: {
    title: 'Why the day key must be local',
    intro: 'A study session logged at 1:30 am in India. Follow the same instant through two ways of making a day key, and see one of them file it under the wrong day.',
    frames: [
      {
        caption: 'The moment. The user finishes a session at half past one in the morning, Indian Standard Time (UTC+5:30).',
        frame: `  wall clock, Kolkata:    Sun 6 Sep 2026, 01:30 IST
  the Date object:        1757102400000 ms since 1970
                          (one instant, no zone attached)`,
      },
      {
        caption: 'Path A: toISOString(). The instant is rendered in UTC, five and a half hours earlier. The date part says Saturday.',
        frame: `  new Date().toISOString()
     = "2026-09-05T20:00:00.000Z"
                 ^^^^^^^^^^
  .slice(0, 10)  ->  "2026-09-05"     SATURDAY

  the session is filed under yesterday
  the streak counter sees no Sunday entry`,
      },
      {
        caption: 'Path B: format(d, "yyyy-MM-dd"). date-fns reads the local calendar fields. The date part says Sunday.',
        frame: `  format(d, 'yyyy-MM-dd')
     getFullYear()  -> 2026     (local)
     getMonth()+1   -> 9        (local)
     getDate()      -> 6        (local)
     = "2026-09-06"                    SUNDAY

  filed under today, as the user expects`,
      },
      {
        caption: 'The two keys side by side. Same instant, different days. Every calendar cell, streak and "did I study today" check depends on choosing B.',
        frame: `  instant:  1757102400000

  ┌──────────────────────┬──────────────┐
  │ toISOString().slice  │ 2026-09-05   │  x
  │ format yyyy-MM-dd    │ 2026-09-06   │  ✓
  └──────────────────────┴──────────────┘

  the bug only shows between 00:00 and 05:30 local,
  which is exactly when a tired person studies`,
      },
      {
        caption: 'Reading it back. parseISO of the key gives local midnight of that day, so a comparison with isSameDay works in both directions.',
        frame: `  parseISO('2026-09-06')   -> Sun 6 Sep 2026 00:00 local
  isSameDay(that, sessionDate)      -> true

  startOfDay(sessionDate)  -> same local midnight
  differenceInCalendarDays(today, that)  -> 0`,
      },
    ],
  },

  internals: `## What a Date really is

\`Date\` stores one number: milliseconds since 1970-01-01T00:00:00 UTC. Everything else is a view. \`getHours()\` asks the host for the local zone's offset at that instant and applies it; \`getUTCHours()\` does not. The zone is not stored on the object, so two computers in different zones holding the same \`Date\` show different clock times. Daylight saving means the offset itself varies by date, which is why "add 24 hours" and "add one day" can differ by an hour on the changeover night.

## How date-fns functions work

Most functions are short. \`addDays\` constructs a copy, calls \`setDate(getDate() + n)\` and returns it; the setter handles month rollover. \`startOfDay\` copies and calls \`setHours(0, 0, 0, 0)\`. \`differenceInCalendarDays\` truncates both to local midnight, subtracts the timestamps, adjusts for a DST offset difference, and divides by a day. \`isSameDay\` compares \`startOfDay\` of each. The library's value is that these have been written once, correctly, with tests across DST transitions and leap years.

The \`toDate\` helper at the top of every function accepts a \`Date\`, a number, or (in v4) any \`Date\` subclass, and clones it so the input is never mutated. Invalid dates (\`new Date('nope')\`) propagate as invalid, and \`isValid\` exists to check.

## format and parse

\`format\` tokenises the pattern with a regular expression that finds runs of the same letter and quoted literals, then maps each token to a formatter function from a table (\`y\` and \`M\` and \`d\` families, weekday names from the locale, \`a\` for day period). Locale objects provide localised names and the rules for ordinal numbers and week starts. \`parse\` runs the same tokens in reverse, consuming the input string with per-token parsers and setting fields on a reference date, which is why it takes a third argument.

## Locales

A locale is a plain object with \`localize\` (month and day names, ordinal numbers), \`formatLong\` (what "full date" means there), \`match\` (regular expressions for parsing names) and \`options\` (week start, first week of year). Each lives in its own module under \`date-fns/locale\`, around 3 to 5 KB, and is passed explicitly, so the bundle carries only the locales you import.

## Time zones in v4

\`@date-fns/tz\` provides \`TZDate\`, a subclass of \`Date\` that overrides the local getters and setters to use a named zone via \`Intl.DateTimeFormat\` under the hood. Because date-fns functions clone their input preserving its class (v4's \`constructFrom\`), a \`TZDate\` stays a \`TZDate\` through \`addDays\` and \`startOfWeek\`. The \`in\` option on any function does the same for plain dates: \`startOfDay(d, { in: tz('Asia/Kolkata') })\`.

## Temporal, the future

TC39's **Temporal** proposal, at stage 3 and shipping behind flags, replaces \`Date\` with distinct types: \`PlainDate\` for a calendar day, \`ZonedDateTime\` for an instant in a zone, \`Duration\` for spans. It fixes the local-versus-instant confusion at the type level. Until it is everywhere, date-fns on native \`Date\` remains the practical choice, and its function style will port cleanly.`,

  buildIt: {
    title: 'The four date helpers a planner needs',
    intro: 'Write local day keys, a week range, a streak counter and a "next study day" finder with date-fns. Each is under ten lines and each has a trap that the library handles for you.',
    steps: [
      {
        title: 'Local day keys, both ways',
        body: 'Never use toISOString for a calendar key. Format for writing, parseISO for reading.',
        lang: 'ts',
        code: `import { format, parseISO } from 'date-fns'

export const dayKey = (d: Date = new Date()) => format(d, 'yyyy-MM-dd')
export const fromKey = (key: string) => parseISO(key)     // local midnight

dayKey(new Date(2026, 8, 6, 1, 30))   // '2026-09-06' at 1:30 am, correct`,
      },
      {
        title: 'A Monday-first week',
        body: 'The week start is an option, not an assumption. The interval helper gives the seven days for a calendar row.',
        lang: 'ts',
        code: `import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

export function weekOf(d: Date) {
  const start = startOfWeek(d, { weekStartsOn: 1 })
  const end = endOfWeek(d, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })   // [Mon, Tue, ..., Sun]
}`,
      },
      {
        title: 'Streak with rest days',
        body: 'Walk backwards from today. A day counts if it was studied or if it is a planned rest day (Sunday here). Stop at the first real miss.',
        lang: 'ts',
        code: `import { subDays, isSunday } from 'date-fns'

export function streak(studiedKeys: Set<string>, today = new Date()) {
  let n = 0
  for (let d = today; ; d = subDays(d, 1)) {
    if (studiedKeys.has(dayKey(d))) n++
    else if (isSunday(d)) continue            // rest day, streak survives
    else if (d === today) continue            // today not done yet is not a miss
    else break
  }
  return n
}`,
      },
      {
        title: 'Next study day and a due date',
        body: 'Skip Sundays when scheduling a missed topic. Add a review interval in calendar days so DST cannot shift it.',
        lang: 'ts',
        code: `import { addDays, isSunday, differenceInCalendarDays } from 'date-fns'

export function nextStudyDay(from: Date) {
  let d = addDays(from, 1)
  while (isSunday(d)) d = addDays(d, 1)
  return d
}

export function reviewDue(learnedOn: Date, intervalDays: number) {
  const due = addDays(learnedOn, intervalDays)
  return { due, inDays: differenceInCalendarDays(due, new Date()) }
}`,
      },
    ],
  },

  inTheWild: [
    { who: 'The post-Moment migration', what: 'When Moment entered maintenance mode in 2020, date-fns and Day.js were its recommended replacements; date-fns is the more downloaded of the two.' },
    { who: 'React date pickers', what: 'react-day-picker and many calendar components take date-fns as their date engine because it works on native Dates.' },
    { who: 'Dashboards and analytics UIs', what: 'Bucketing events by day, week and month with startOf and eachDayOfInterval is the everyday case.' },
    { who: 'Node services', what: 'The same functions run server-side for scheduling, reporting and log rotation.' },
    { who: 'This app', what: 'Local day keys for the study log, week rows for the calendar, streak and rest-day logic, and relative text on the Status page.' },
  ],

  alternatives: [
    { name: 'Day.js', pick: 'A 2 KB Moment-compatible API for teams migrating Moment code who want to change little. Chainable objects, immutable.' },
    { name: 'Luxon', pick: 'When time zones and internationalisation are central; built on Intl with a DateTime class.' },
    { name: 'Temporal', pick: 'The future standard. Use a polyfill today if you want the correct types now and accept the size.' },
    { name: 'Intl.DateTimeFormat alone', pick: 'Formatting for display in the user\'s locale with no library at all. No arithmetic.' },
  ],

  glossary: [
    { term: 'Instant', meaning: 'A point on the global timeline, what a Date stores as milliseconds since 1970 UTC.' },
    { term: 'Calendar date', meaning: 'A day like 2026-09-06 in some zone; not an instant.' },
    { term: 'Local time', meaning: 'Clock time in the environment\'s zone, what getHours returns.' },
    { term: 'UTC', meaning: 'Coordinated Universal Time, the zero-offset reference.' },
    { term: 'DST', meaning: 'Daylight saving time; why a day can be 23 or 25 hours.' },
    { term: 'Immutable', meaning: 'Functions return new dates and never change the one passed in.' },
    { term: 'Unicode tokens', meaning: 'The yyyy MM dd HH mm pattern letters shared across platforms.' },
    { term: 'Locale', meaning: 'An object of names and rules for one language and region.' },
    { term: 'TZDate', meaning: 'A Date subclass carrying a named time zone, from @date-fns/tz.' },
    { term: 'Temporal', meaning: 'The upcoming JavaScript standard replacing Date with precise types.' },
  ],

  quiz: [
    {
      question: 'At 1:30 am IST, which expression produces the correct calendar key for today?',
      options: ['new Date().toISOString().slice(0, 10)', 'format(new Date(), "yyyy-MM-dd")', 'Date.now()', 'new Date().toUTCString()'],
      answerIndex: 1,
      explanation: 'toISOString renders in UTC, which is still the previous day at that hour. format reads local calendar fields.',
    },
    {
      question: 'What does addMonths(new Date(2026, 0, 31), 1) return?',
      options: ['3 March 2026', '28 February 2026', '2 March 2026', 'An invalid date'],
      answerIndex: 1,
      explanation: 'date-fns clamps to the last valid day of the target month, matching how people expect monthly schedules to behave.',
    },
    {
      question: 'Why did teams move away from Moment.js?',
      options: ['It had bugs', 'Mutable objects, a monolithic bundle and a wrapper class; its maintainers recommended alternatives in 2020', 'It was paid', 'It did not support dates before 1970'],
      answerIndex: 1,
      explanation: 'date-fns answers each fault: immutable pure functions, one module per function, native Date in and out.',
    },
    {
      question: 'format(d, "YYYY-MM-DD") shows the wrong date in the first days of January. Why?',
      options: ['A leap year bug', 'YYYY is the week-numbering year and DD is day-of-year; the correct tokens are yyyy and dd', 'The locale is missing', 'format needs a timezone'],
      answerIndex: 1,
      explanation: 'Unicode tokens are case-sensitive. The uppercase forms are valid but mean different things.',
    },
    {
      question: 'Does a JavaScript Date store a time zone?',
      options: ['Yes, the zone it was created in', 'No; it stores an instant and the host applies the local zone when you read fields', 'Only if created from an ISO string', 'Yes, always UTC'],
      answerIndex: 1,
      explanation: 'Date is a millisecond count. Zone-aware behaviour needs TZDate or Intl.',
    },
  ],
}
