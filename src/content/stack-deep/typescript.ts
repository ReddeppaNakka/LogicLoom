import type { TechDeep } from '../stack-types'

export const typescriptDeep: TechDeep = {
  analogy:
    'Think of a busy restaurant kitchen. JavaScript is a kitchen where any container can hold anything, so a cook can pour soup into a bread basket and nobody notices until a customer complains. TypeScript is the same kitchen with labels on every container and a head chef who checks each hand-off before it leaves the pass. The food is identical. The number of ruined dinners is not.',

  origins: `TypeScript was created at Microsoft by a team led by **Anders Hejlsberg**, the designer of Turbo Pascal, Delphi and C#. It was announced publicly in **October 2012** and reached version 1.0 in 2014.

The problem it solved was scale. By 2010 Microsoft was writing very large browser applications, Office for the web among them, in a language that had no way to say what a function expected. A change in one file would break a call in another, and nobody found out until a user clicked the button. Hejlsberg's team wanted the tooling they had in C# (autocomplete, go-to-definition, safe rename) without leaving JavaScript.

Two design decisions made it win where earlier attempts such as Google's Closure and Dart did not:

- **It is a superset.** Every valid JavaScript file is already a valid TypeScript file. You can rename \`.js\` to \`.ts\`, fix nothing, and start adding types one function at a time.
- **It erases.** The output is plain JavaScript with the annotations removed. There is no runtime, no virtual machine, no new browser support to wait for.

Adoption tipped in 2015 when Google chose TypeScript for Angular 2, and again in 2016 when version 2.0 added \`strictNullChecks\`, which turned the most common JavaScript crash, reading a property of \`undefined\`, into a compile-time error. Today the State of JS survey reports more developers writing TypeScript than plain JavaScript for new projects.`,

  concepts: [
    {
      title: 'Annotations describe, they do not convert',
      body: `A type annotation is a colon followed by a claim: \`age: number\` says "age holds a number". It does not convert anything. If a network response puts a string there, the string is still there at runtime. What the annotation buys you is that every line of code *reading* \`age\` is checked against the claim, so \`age.toFixed(1)\` is allowed and \`age.toUpperCase()\` is an error before you run anything.

The compiler infers most types itself. \`const total = price * qty\` needs no annotation because multiplying two numbers is a number. Annotate function parameters and public shapes; let inference handle local variables.`,
      lang: 'ts',
      code: `function greet(name: string, times: number): string {
  return (name + ' ').repeat(times).trim()
}

greet('Reddy', 2)     // ok  -> 'Reddy Reddy'
greet(2, 'Reddy')     // error: Argument of type 'number' is not
                      //        assignable to parameter of type 'string'

const total = 19.5 * 3   // inferred as number, no annotation needed`,
    },
    {
      title: 'Structural typing: shape is what matters',
      body: `In Java or C#, a value has a type because it was declared with that class. TypeScript is **structural**: a value fits a type if it has the right shape, regardless of where it came from. An object literal, a class instance and a JSON response are all a \`Point\` if they carry a numeric \`x\` and \`y\`.

This is why TypeScript feels natural on top of JavaScript, where objects are built on the fly. It is also why extra properties are usually fine when passing a variable, but flagged when passing a fresh object literal, since a literal with an unknown key is almost always a typo.`,
      lang: 'ts',
      code: `interface Point { x: number; y: number }

function dist(p: Point) { return Math.hypot(p.x, p.y) }

const fromJson = JSON.parse('{"x":3,"y":4,"label":"A"}')
dist(fromJson)                    // ok: any is allowed through
dist({ x: 3, y: 4, z: 0 })        // error: 'z' does not exist in Point
const p3 = { x: 3, y: 4, z: 0 }
dist(p3)                          // ok: extra keys on a variable are fine`,
    },
    {
      title: 'Union types and narrowing',
      body: `A union \`A | B\` means "one of these". \`'easy' | 'medium' | 'hard'\` is a type with exactly three allowed strings, so a typo is a compile error and the editor autocompletes the options.

Unions become powerful with **narrowing**. Inside an \`if\` that checks \`typeof\`, a \`switch\` on a literal field, or an \`in\` test, TypeScript shrinks the type to the branch that survived. A **discriminated union**, where every member carries a literal \`kind\` field, is the standard way to model "a message can be one of these shapes" and have the compiler prove you handled each one.`,
      lang: 'ts',
      code: `type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'rect'; w: number; h: number }

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2   // s is the circle branch here
    case 'rect':   return s.w * s.h            // and the rect branch here
  }
  // add a 'triangle' member above and this function fails to compile
  // until you handle it: the return type would include undefined
}`,
    },
    {
      title: 'Optional, undefined and strict null checks',
      body: `Tony Hoare called null references his "billion-dollar mistake". TypeScript's answer is that \`null\` and \`undefined\` are ordinary types that a value may or may not include. With \`strict\` on, a \`string\` can never be \`undefined\`; if it might be, you must write \`string | undefined\` or mark the field \`name?\`.

The payoff is that every place you read an optional value, the compiler asks "what if it is missing?" and refuses \`user.name.length\` until you guard it. The \`?.\` optional chaining and \`??\` nullish coalescing operators exist to make those guards short.`,
      lang: 'ts',
      code: `interface User { name: string; nickname?: string }

function label(u: User) {
  u.nickname.length            // error: 'u.nickname' is possibly undefined
  return (u.nickname ?? u.name).toUpperCase()   // ok
}

const first = users[0]        // with noUncheckedIndexedAccess: User | undefined
first?.name                    // optional chaining: undefined if first is missing`,
    },
    {
      title: 'Generics: types that take parameters',
      body: `A function that returns the first element of an array should work for arrays of anything, and should return the *right* anything. Writing it with \`any\` throws the information away. A **generic** parameter, written \`<T>\`, is a placeholder type that is filled in at each call site.

You use generics constantly without writing them: \`Array<string>\`, \`Promise<User>\`, \`Map<string, number>\`, \`useState<number>\`. Constraints such as \`T extends { id: string }\` let a generic function still rely on some structure.`,
      lang: 'ts',
      code: `function first<T>(xs: T[]): T | undefined { return xs[0] }

const n = first([1, 2, 3])         // n: number | undefined
const s = first(['a', 'b'])        // s: string | undefined

function byId<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((x) => x.id === id)
}

const concept = byId(concepts, 'two-pointers')   // typed as Concept | undefined`,
    },
    {
      title: 'Utility types reshape other types',
      body: `Rather than writing the same interface four ways, TypeScript ships type-level functions. \`Partial<T>\` makes every field optional (good for an update payload). \`Pick<T, 'a' | 'b'>\` and \`Omit<T, 'c'>\` select fields. \`Record<K, V>\` is an object keyed by a union. \`ReturnType<typeof fn>\` reads a function's result type.

Behind them are two features worth knowing: \`keyof T\` gives the union of a type's keys, and **mapped types** (\`{ [K in keyof T]: ... }\`) iterate over those keys to build a new type. Most of the standard library is written with them.`,
      lang: 'ts',
      code: `interface Settings { theme: string; fontSize: number; focus: boolean }

type SettingsPatch = Partial<Settings>           // every field optional
type Look = Pick<Settings, 'theme' | 'fontSize'>  // only those two
type ByTheme = Record<'dark' | 'light', Settings> // { dark: Settings; light: Settings }

// The same idea by hand: a mapped type
type ReadonlyOf<T> = { readonly [K in keyof T]: T[K] }`,
    },
    {
      title: 'Types are erased: the runtime boundary',
      body: `After compilation, no type exists. \`interface User\` produces zero bytes of JavaScript. This has a consequence people learn the hard way: data arriving from a network, \`localStorage\` or a file is **not** checked by TypeScript. Writing \`const u = JSON.parse(text) as User\` is a promise you are making, not a check the machine performs.

At those boundaries you validate at runtime, either by hand or with a schema library such as Zod or Valibot that both checks the data and derives the TypeScript type from the same definition. Inside the boundary, types carry the guarantee for you.`,
      lang: 'ts',
      code: `// This compiles, and is a lie if the stored JSON is stale or corrupted
const saved = JSON.parse(localStorage.getItem('prefs') ?? '{}') as Prefs

// Validate once at the edge, then trust the type inside
function isPrefs(x: unknown): x is Prefs {
  return typeof x === 'object' && x !== null && 'theme' in x
}
const raw: unknown = JSON.parse(localStorage.getItem('prefs') ?? '{}')
const prefs = isPrefs(raw) ? raw : DEFAULT_PREFS`,
    },
  ],

  visual: {
    title: 'From a .ts file to the browser',
    intro: 'The compiler checks, then a bundler strips. Watch a single function make the trip, and see exactly where the types stop existing.',
    frames: [
      {
        caption: 'You write TypeScript. The annotation says what the function expects; the call is wrong.',
        frame: `  src/xp.ts
  ┌────────────────────────────────────────┐
  │ function xpFor(minutes: number) {      │
  │   return Math.round(minutes * 1.5)     │
  │ }                                      │
  │                                        │
  │ xpFor("90")        // <- a string      │
  └────────────────────────────────────────┘`,
      },
      {
        caption: 'tsc reads the file, builds a type for every expression, and compares each use against its claim.',
        frame: `  tsc --noEmit
  ┌────────────────────────────────────────┐
  │ minutes ........... number   (declared)│
  │ minutes * 1.5 ..... number   (inferred)│
  │ xpFor ............. (number) => number │
  │ "90" .............. string             │
  │                                        │
  │ "90"  assignable to  number ?    NO    │
  └────────────────────────────────────────┘`,
      },
      {
        caption: 'The error points at the exact call with a message. Nothing has run. No browser is involved.',
        frame: `  src/xp.ts:6:7 - error TS2345
  Argument of type 'string' is not assignable
  to parameter of type 'number'.

  6   xpFor("90")
          ~~~~

  Found 1 error.`,
      },
      {
        caption: 'You fix the call. Now the bundler (Vite, via esbuild) takes the same file and deletes every annotation.',
        frame: `  src/xp.ts                 dist/xp.js
  ┌──────────────────────┐  ┌──────────────────────┐
  │ function xpFor(      │  │ function xpFor(      │
  │   minutes: number    │->│   minutes            │
  │ ): number {          │  │ ) {                  │
  │   return Math.round( │  │   return Math.round( │
  │     minutes * 1.5)   │  │     minutes * 1.5)   │
  │ }                    │  │ }                    │
  │ xpFor(90)            │  │ xpFor(90)            │
  └──────────────────────┘  └──────────────────────┘`,
      },
      {
        caption: 'The browser receives plain JavaScript. It never knew a type was there, which is why data from outside must be checked by hand.',
        frame: `  browser
  ┌────────────────────────────────────────┐
  │ xpFor(90)                    -> 135    │
  │ xpFor(JSON.parse('"90"'))    -> 135 ?  │
  │                                        │
  │  "90" * 1.5  is  135  in JavaScript.   │
  │  The type was erased. Only code that   │
  │  validates at the edge would catch it. │
  └────────────────────────────────────────┘`,
      },
    ],
  },

  internals: `## Two programs in one

The TypeScript package contains two very different things that happen to share a parser.

The **checker** is the part people mean when they say "TypeScript". It builds a syntax tree, resolves every identifier to a symbol, computes a type for every expression, and reports where a type is not assignable to what a position demands. It is a large piece of software, around a hundred thousand lines, and it is what powers the red squiggles in your editor through the *language server*.

The **emitter** turns the tree back into JavaScript with annotations removed, and optionally down-levels newer syntax for older browsers. It is small and, crucially, it does not need the checker. That independence is what lets tools such as esbuild, SWC and Babel strip types in milliseconds without checking anything, and why \`npm run dev\` can serve code that does not type-check.

## Assignability, not equality

The central question the checker asks is never "are these types the same?" but "**is this type assignable to that one?**" A \`{ x: number; y: number; z: number }\` is assignable to \`{ x: number; y: number }\` because everything the target needs is present. \`'circle'\` is assignable to \`string\`. \`number\` is not assignable to \`number | undefined\`'s reverse. The rules are directional and structural, and once you internalise that one idea most error messages become readable.

## Control-flow analysis

The checker walks each function as a graph of possible paths. When it passes an \`if (typeof x === 'string')\`, the type of \`x\` inside that branch becomes the part of its union that survives the test, and in the \`else\` branch the remainder. Early returns, \`throw\`, truthiness checks, \`in\`, \`instanceof\`, equality with a literal and user-defined type guards (\`x is Foo\`) all feed this analysis. It is why you rarely need casts: the compiler already knows what you know at that line.

## Inference and the contextual type

Inference runs in two directions. Bottom-up, a literal \`3\` has type \`number\`, an array of them is \`number[]\`. Top-down, the **contextual type** flows from a declared destination into an expression: a callback passed to \`arr.map\` gets its parameter type from the array without you writing it. Generic functions tie both together, solving for type parameters from the arguments and, when needed, from the expected return type.

## Declaration files

A \`.d.ts\` file contains only types. Every package on npm either ships them or has community ones under \`@types/\` from the DefinitelyTyped project. When you import \`framer-motion\`, the editor reads its \`.d.ts\` to know that \`motion.div\` accepts an \`animate\` prop. The DOM itself is described by a giant \`lib.dom.d.ts\` that ships with TypeScript, which is where \`HTMLAttributes<HTMLDivElement>\` comes from.

## Project references and incremental builds

For large codebases, \`tsconfig\` files can reference each other, and \`.tsbuildinfo\` files record what was checked last time so only changed files are re-examined. That is what the two \`tsbuildinfo\` files in this repository's root are: a cache written by \`tsc -b\`, not source.`,

  buildIt: {
    title: 'Type a tiny event system from scratch',
    intro: 'Five short steps that use interfaces, unions, generics and narrowing on a problem small enough to hold in your head. Paste each into a scratch .ts file and run npm run typecheck.',
    steps: [
      {
        title: 'Describe the events as a discriminated union',
        body: 'Each event carries a literal `type` so the compiler can tell them apart later.',
        lang: 'ts',
        code: `type AppEvent =
  | { type: 'concept:done'; conceptId: string; minutes: number }
  | { type: 'quiz:answered'; correct: boolean }
  | { type: 'theme:changed'; theme: 'shadow' | 'paper' }`,
      },
      {
        title: 'Derive the set of names from the union',
        body: 'Indexed access on a union gives you the union of one field. No list to keep in sync.',
        lang: 'ts',
        code: `type EventName = AppEvent['type']
// 'concept:done' | 'quiz:answered' | 'theme:changed'

type EventOf<N extends EventName> = Extract<AppEvent, { type: N }>
// EventOf<'quiz:answered'>  ->  { type: 'quiz:answered'; correct: boolean }`,
      },
      {
        title: 'A generic subscribe that knows the payload',
        body: 'The listener for a given name receives exactly that event shape.',
        lang: 'ts',
        code: `const listeners: { [N in EventName]?: Array<(e: EventOf<N>) => void> } = {}

function on<N extends EventName>(name: N, fn: (e: EventOf<N>) => void) {
  ;(listeners[name] ??= []).push(fn as never)
}

on('quiz:answered', (e) => {
  e.correct          // boolean, autocompleted
  e.conceptId        // error: does not exist on this event
})`,
      },
      {
        title: 'Emit with narrowing',
        body: 'The emit function accepts any event and dispatches by `type`. Adding a fourth event without a listener key is still fine; forgetting to handle one in a switch is not.',
        lang: 'ts',
        code: `function emit(e: AppEvent) {
  const fns = listeners[e.type] as Array<(x: AppEvent) => void> | undefined
  fns?.forEach((fn) => fn(e))
}

function describe(e: AppEvent): string {
  switch (e.type) {
    case 'concept:done':  return e.conceptId + ' in ' + e.minutes + ' min'
    case 'quiz:answered': return e.correct ? 'correct' : 'wrong'
    case 'theme:changed': return 'now ' + e.theme
  }
}`,
      },
      {
        title: 'Break it on purpose',
        body: 'Add a member `{ type: "streak:lost"; days: number }` to `AppEvent` and run the checker. The `describe` switch stops compiling because its return type gained `undefined`. That is exhaustiveness checking, and it is the whole reason to model with unions.',
        lang: 'sh',
        code: `npm run typecheck
# error TS2366: Function lacks ending return statement and
# return type does not include 'undefined'.`,
      },
    ],
  },

  inTheWild: [
    { who: 'Visual Studio Code', what: 'The editor itself is written in TypeScript, roughly two million lines, and is the single largest public TypeScript codebase.' },
    { who: 'Angular (Google)', what: 'Chose TypeScript for Angular 2 in 2015, the moment the language went from Microsoft project to industry default.' },
    { who: 'Slack', what: 'Converted the desktop app to TypeScript in 2017 and reported finding real bugs in code the team had believed correct for years.' },
    { who: 'Airbnb', what: 'Migrated its front end and estimated, from post-mortems, that a large share of production incidents would have been caught by types.' },
    { who: 'Deno and Bun', what: 'Both modern JavaScript runtimes execute TypeScript files directly, stripping types on load.' },
    { who: 'This app', what: 'Fifty-four concept files, thirty-two patterns and every store are typed, so a missing field fails the build instead of a page.' },
  ],

  alternatives: [
    { name: 'Plain JavaScript with JSDoc', pick: 'A small script or a team that wants editor hints without a build step. TypeScript can check JSDoc comments with checkJs.' },
    { name: 'Flow (Meta)', pick: 'Rare outside Meta today. Similar goals, smaller ecosystem, worth knowing the name.' },
    { name: 'Zod or Valibot alongside TypeScript', pick: 'Whenever data crosses a boundary. Not an alternative but the missing half: runtime validation that also produces the type.' },
    { name: 'ReScript, Elm, PureScript', pick: 'When you want a sound type system with no escape hatches and accept a different language and smaller library pool.' },
  ],

  glossary: [
    { term: 'Annotation', meaning: 'The `: type` after a name that states what it holds.' },
    { term: 'Inference', meaning: 'The compiler working out a type from context so you do not have to write it.' },
    { term: 'Structural typing', meaning: 'Compatibility decided by shape (which fields exist), not by declared name.' },
    { term: 'Union', meaning: 'A type meaning one of several, written A | B.' },
    { term: 'Narrowing', meaning: 'Shrinking a union to a branch after a runtime check such as typeof or a switch.' },
    { term: 'Discriminated union', meaning: 'A union whose members each carry a literal tag field so they can be told apart.' },
    { term: 'Generic', meaning: 'A type parameter, written <T>, filled in per use.' },
    { term: 'Erasure', meaning: 'Removing all types at build time. Nothing about them survives into the browser.' },
    { term: 'Declaration file', meaning: 'A .d.ts file holding only types, used to describe JavaScript libraries.' },
    { term: 'strict', meaning: 'The tsconfig flag bundle that turns on null checks and the other checks worth having.' },
  ],

  quiz: [
    {
      question: 'What does `const u = JSON.parse(text) as User` guarantee at runtime?',
      options: ['That the parsed object has every User field', 'Nothing; the assertion is erased and no check runs', 'That missing fields are filled with defaults', 'That an exception is thrown if the shape is wrong'],
      answerIndex: 1,
      explanation: 'Types are erased. An `as` assertion tells the compiler what to assume and produces no code. Data from outside must be validated by hand or with a schema library.',
    },
    {
      question: 'Why does passing `{ x: 3, y: 4, z: 0 }` directly to a function expecting `{ x: number; y: number }` error, while passing a variable holding the same object does not?',
      options: ['Variables are checked less strictly', 'Object literals get excess-property checks because an unknown key in a fresh literal is usually a typo', 'Functions cannot accept literals', 'The variable is inferred as any'],
      answerIndex: 1,
      explanation: 'TypeScript is structural, so extra fields are fine in general. Fresh literals are the one place it flags extras, because there is no other reason to write a key the target does not know.',
    },
    {
      question: 'Which feature lets the compiler tell you that a `switch` over a union is missing a case?',
      options: ['Generics', 'Exhaustiveness checking via control-flow analysis and the function return type', 'Declaration files', 'Optional chaining'],
      answerIndex: 1,
      explanation: 'When a branch is unhandled, the function can fall through and return undefined, which no longer matches the declared return type. That mismatch is the error.',
    },
    {
      question: '`npm run dev` starts fine but `npm run typecheck` fails. Why can that happen?',
      options: ['The dev server uses a different TypeScript version', 'Vite strips types with esbuild without checking them; only tsc checks', 'Type errors are warnings in development', 'The tsconfig is ignored by Vite'],
      answerIndex: 1,
      explanation: 'The emitter and the checker are separate. Bundlers run only the fast strip step, so type errors never stop the dev server.',
    },
    {
      question: 'What is `keyof Settings` if Settings has fields theme, fontSize and focus?',
      options: ["The tuple ['theme', 'fontSize', 'focus']", "The union 'theme' | 'fontSize' | 'focus'", 'An array of strings at runtime', 'The type Settings itself'],
      answerIndex: 1,
      explanation: 'keyof produces a union of the property names as literal types. Mapped types iterate over that union to build new object types.',
    },
  ],
}
