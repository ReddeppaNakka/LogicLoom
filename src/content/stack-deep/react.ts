import type { TechDeep } from '../stack-types'

export const reactDeep: TechDeep = {
  analogy:
    'Imagine describing a room to an interior designer with a single sentence: "a desk by the window, two chairs, the lamp on". When you change your mind ("three chairs"), you do not tell the designer which chair to fetch and where to put it. You repeat the sentence with the new number, and the designer works out that exactly one chair needs adding. React is that designer. You describe the finished screen for the current data; it figures out the minimal edits to get there.',

  origins: `React was written by **Jordan Walke**, a software engineer at Facebook, and first ran in production on the Facebook News Feed in 2011 and on Instagram in 2012. It was open-sourced at JSConf US in **May 2013**.

The problem was the Facebook Ads product and the News Feed. Both were interfaces where many small pieces of state changed at once (a like count, a comment, a notification badge) and the existing approach, updating the page piece by piece with jQuery-style code, produced bugs where the screen and the data disagreed. Walke's idea was borrowed from functional programming: treat the UI as a **pure function of state**, re-render the whole description on every change, and let a diffing algorithm apply the minimal DOM edits. At the time, re-rendering everything sounded absurd. The virtual DOM made it fast enough.

Two later shifts shaped the React you use today:

- **Fiber (React 16, 2017)** rewrote the core so rendering can be paused, split and resumed, which made concurrent features possible.
- **Hooks (React 16.8, February 2019)** let function components hold state and effects, retiring class components for new code.

React 18 (2022) shipped concurrent rendering and automatic batching. **React 19 (2024)**, the version here, added Actions, the \`use\` hook, ref-as-prop, and an optional compiler that memoises for you.`,

  concepts: [
    {
      title: 'Components are functions that return a description',
      body: `A component is a JavaScript function whose return value is a tree of elements. JSX, the HTML-looking syntax, is sugar for calling \`React.createElement\`, so \`<Badge rank="S" />\` becomes a plain object \`{ type: Badge, props: { rank: 'S' } }\`. Nothing is drawn yet. React later turns that object tree into DOM nodes.

Because a component is just a function, it composes like one: pass functions to functions, return them from conditions, put them in arrays. That is the whole component model.`,
      lang: 'tsx',
      code: `function RankBadge({ rank }: { rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' }) {
  return <span className={'badge badge-' + rank}>{rank}</span>
}

// JSX above is exactly this:
// React.createElement('span', { className: 'badge badge-' + rank }, rank)

function Profile() {
  return (
    <div>
      <RankBadge rank="S" />
      {[1, 2, 3].map((n) => <li key={n}>Item {n}</li>)}
    </div>
  )
}`,
    },
    {
      title: 'Props flow down, events flow up',
      body: `Data moves in one direction. A parent passes values to a child as **props**, which the child treats as read-only. When the child needs to change something, it calls a function the parent gave it, and the parent updates its own state. This one-way flow is why React apps stay predictable: to find out why a piece of screen looks a certain way, you walk up the tree to the state that decides it.

The mistake beginners make is trying to reach sideways or upward. If two siblings need the same value, the value moves to their common parent. This is called **lifting state up**.`,
      lang: 'tsx',
      code: `function Quiz() {
  const [picked, setPicked] = useState<number | null>(null)
  return (
    <>
      {options.map((o, i) => (
        <Option key={i} label={o} selected={picked === i} onPick={() => setPicked(i)} />
      ))}
      <Result picked={picked} />
    </>
  )
}

function Option({ label, selected, onPick }: { label: string; selected: boolean; onPick: () => void }) {
  return <button className={selected ? 'on' : ''} onClick={onPick}>{label}</button>
}`,
    },
    {
      title: 'State: memory that survives re-renders',
      body: `A plain variable inside a function is recreated every call. \`useState\` gives a component a slot that React keeps between renders. Calling the setter does two things: stores the new value and **schedules a re-render**. The component function runs again from the top and reads the new value.

Two rules follow. State is a snapshot: within one render, \`count\` is fixed even after you call \`setCount\`. And updates that depend on the previous value should use the function form, \`setCount(c => c + 1)\`, so several updates in one event do not read the same stale snapshot.`,
      lang: 'tsx',
      code: `function Streak() {
  const [days, setDays] = useState(0)

  function logToday() {
    setDays(days + 1)          // uses the snapshot: 0 -> 1
    setDays(days + 1)          // still 0 -> 1. Result: 1, not 2
  }
  function logTwice() {
    setDays((d) => d + 1)      // 0 -> 1
    setDays((d) => d + 1)      // 1 -> 2. Result: 2
  }
  return <button onClick={logTwice}>{days} days</button>
}`,
    },
    {
      title: 'Rendering, reconciliation and keys',
      body: `When state changes React calls your component and gets a new element tree. It then **reconciles**: compares the new tree with the previous one node by node. Same type in the same position means update the props in place. Different type means throw away that subtree and build a new one.

For lists, position is unreliable, so React uses the \`key\` prop to match old and new children. A stable key (an id) lets React move a DOM node instead of destroying it. Using the array index as a key works until items are reordered or removed, at which point state and inputs jump to the wrong row.`,
      lang: 'tsx',
      code: `// Good: stable identity survives sorting and deletion
{problems.map((p) => <ProblemRow key={p.id} problem={p} />)}

// Fragile: after deleting item 0, every row's key shifts by one,
// so React reuses the wrong DOM nodes and internal state
{problems.map((p, i) => <ProblemRow key={i} problem={p} />)}`,
    },
    {
      title: 'Effects: stepping outside React',
      body: `Rendering must be pure: same props and state, same output, no side effects. Anything that touches the outside world (a DOM API, a timer, a subscription, a fetch) belongs in \`useEffect\`. React runs the effect after painting, and runs the returned **cleanup** before the next run and on unmount.

The dependency array lists the values the effect reads. It is not an optimisation knob; it is a correctness contract. An effect that reads \`id\` but omits it from the array will keep using the first \`id\` forever. Most "effect runs twice" confusion in development is StrictMode deliberately mounting and unmounting once to prove your cleanup works.`,
      lang: 'tsx',
      code: `function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - innerHeight
      setPct(Math.min(100, (scrollY / max) * 100))
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)   // cleanup
  }, [])                                                    // subscribe once
  return <div style={{ width: pct + '%' }} className="bar" />
}`,
    },
    {
      title: 'Memoisation and when not to bother',
      body: `Re-rendering is cheap in most apps. When it is not, React offers three tools. \`useMemo\` caches a computed value until its inputs change. \`useCallback\` caches a function identity so a child wrapped in \`React.memo\` can skip rendering when its props are unchanged. \`React.memo\` itself makes a component compare props before re-rendering.

Reach for these after measuring, not before. Every memo adds a comparison and a stale-closure risk. The React 19 Compiler automates most of this, which is a strong hint about how mechanical the rule is.`,
      lang: 'tsx',
      code: `function ConceptPage({ concept }: { concept: Concept }) {
  // Rebuilding the table of contents on every scroll tick would be wasteful
  const toc = useMemo(() => buildToc(concept), [concept])

  const onJump = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return <TableOfContents items={toc} onJump={onJump} />
}

const TableOfContents = React.memo(function TableOfContents(props: TocProps) { /* ... */ })`,
    },
    {
      title: 'Custom hooks: reusable stateful logic',
      body: `Any function whose name starts with \`use\` and that calls other hooks is a custom hook. It is not a component and returns whatever you like. Custom hooks are how React shares behaviour without inheritance: \`useLocalStorage\`, \`useMediaQuery\`, \`useActiveSection\`.

The rules of hooks exist because React tracks hook calls by their **order** within a component. Call them at the top level, never inside conditions or loops, and always in the same sequence, or the slots get misaligned.`,
      lang: 'tsx',
      code: `function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

// Anywhere:
const small = useMediaQuery('(max-width: 640px)')`,
    },
  ],

  visual: {
    title: 'One click, from setState to the screen',
    intro: 'A quiz component with three options. Follow what React does when you click the second one, and notice how little of the real page it touches.',
    frames: [
      {
        caption: 'Initial render. The component runs once, returns a tree, and React builds matching DOM nodes.',
        frame: `  state: picked = null

  Quiz()  returns            DOM
  ┌─────────────────┐        ┌─────────────────┐
  │ <div>           │  --->  │ div             │
  │   <button> A    │        │   button "A"    │
  │   <button> B    │        │   button "B"    │
  │   <button> C    │        │   button "C"    │
  │   <p> pick one  │        │   p "pick one"  │
  └─────────────────┘        └─────────────────┘`,
      },
      {
        caption: 'You click B. The handler calls setPicked(1). React stores 1 and schedules a render. Nothing on screen has changed yet.',
        frame: `  click "B"
     │
     └─> onClick  ->  setPicked(1)

  state queue:  picked: null -> 1
  scheduled:    re-render <Quiz>       (not yet run)`,
      },
      {
        caption: 'React calls Quiz() again. It reads picked = 1 and returns a fresh tree. Two nodes differ from last time.',
        frame: `  state: picked = 1

  previous tree           new tree
  ┌─────────────────┐     ┌─────────────────┐
  │ button A  ""    │     │ button A  ""    │
  │ button B  ""    │  vs │ button B  "on"  │  <- changed
  │ button C  ""    │     │ button C  ""    │
  │ p "pick one"    │     │ p "B chosen"    │  <- changed
  └─────────────────┘     └─────────────────┘`,
      },
      {
        caption: 'Reconciliation. Same element types in the same positions, so React keeps every DOM node and computes just two property edits.',
        frame: `  diff result (the "commit list")

    1. button[1].className  ""  ->  "on"
    2. p.textContent  "pick one" -> "B chosen"

  nodes created:   0
  nodes removed:   0
  nodes updated:   2`,
      },
      {
        caption: 'Commit. The two edits are applied synchronously, the browser paints, then any effects run.',
        frame: `  DOM after commit
  ┌─────────────────┐
  │ div             │
  │   button "A"    │
  │   button "B" on │   <- class edited in place
  │   button "C"    │
  │   p "B chosen"  │   <- text edited in place
  └─────────────────┘
  paint  ->  useEffect callbacks run`,
      },
    ],
  },

  internals: `## Elements, fibers and the two trees

An element is the plain object JSX produces: \`{ type, props, key }\`. It is cheap and immutable. React keeps a second, mutable structure alongside it called the **fiber tree**. Each fiber is a unit of work: one component or DOM node, with pointers to its child, sibling and parent, plus its hook state and pending updates.

React keeps two fiber trees at once. The **current** tree describes what is on screen. The **work-in-progress** tree is built during a render by walking the components and creating or reusing fibers. When the walk completes, React swaps the pointers in a single step. This double-buffering is what lets a render be abandoned halfway with nothing visible half-done.

## Render phase versus commit phase

A React update has two phases with very different rules.

The **render phase** calls your components and diffs the results. It is pure and interruptible. React can pause it to handle a keystroke, throw the partial work away, or restart it with newer state. This is why components must not have side effects: React might call yours twice and discard one result. StrictMode does exactly that on purpose in development.

The **commit phase** applies the collected DOM mutations. It is synchronous and cannot be interrupted, because the user must never see a half-applied update. Layout effects run inside it; passive \`useEffect\` callbacks run after the browser has painted.

## The scheduler and priority lanes

Since Fiber, updates carry a **lane**, a bit representing priority. A click or a keystroke is a discrete, urgent event; a transition marked with \`startTransition\` is deferrable. React processes urgent lanes first and yields back to the browser between fibers when a frame is running out of time, so a heavy render behind a fast typing session never freezes the input. Automatic batching in React 18 means every state update inside one event, or one timeout, or one promise callback, is collected into a single render.

## How hooks are stored

Each function component's fiber holds a linked list of hook cells. On the first render \`useState\` appends a cell; on later renders it reads the cell at the same position. There is no name, only order. That is the entire reason for the rule that hooks must be called unconditionally and in the same sequence: a skipped call shifts every later hook onto the wrong cell.

\`useState\` and \`useReducer\` are the same primitive; \`useState\` is a reducer whose action is the next value. Pending updates form a queue on the cell and are folded together during render, which is why several setter calls in one event produce one result.

## Reconciliation rules

The diff is deliberately linear rather than the theoretical O(n³) tree diff. Three heuristics do the work: different element types at a position mean rebuild the subtree; same type means update props and recurse; children lists are matched by \`key\` and otherwise by index. Those rules explain every "why did my input lose focus" bug: the type or key changed, so React unmounted the old node.

## Synthetic events

React attaches a small number of native listeners at the root and dispatches its own event objects, which is why \`onClick\` works the same in every browser and why event handler props are so cheap: there is no per-element \`addEventListener\`.

## What React 19 changed

Ref is a normal prop on function components. Forms can pass an async function to \`action\`. The new \`use\` hook reads a promise or a context during render, and the optional React Compiler inserts memoisation automatically, treating the rules of React as guarantees it can rely on.`,

  buildIt: {
    title: 'Write a 40-line React from scratch',
    intro: 'The fastest way to stop finding React magical is to write a tiny one. This version renders elements to real DOM, supports useState, and re-renders the whole tree on change. It has no diffing, which is exactly the part React adds.',
    steps: [
      {
        title: 'createElement: JSX becomes a plain object',
        body: 'This is what every JSX tag compiles to. Children may be strings, so wrap them in text elements.',
        lang: 'js',
        code: `function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.flat().map((c) =>
        typeof c === 'object' ? c : { type: 'TEXT', props: { nodeValue: c, children: [] } }
      ),
    },
  }
}`,
      },
      {
        title: 'render: walk the object tree and build DOM',
        body: 'Function types are components: call them to get their element. Everything else is a tag name.',
        lang: 'js',
        code: `function render(el, container) {
  if (typeof el.type === 'function') return render(el.type(el.props), container)
  const dom = el.type === 'TEXT'
    ? document.createTextNode(el.props.nodeValue)
    : document.createElement(el.type)
  for (const [k, v] of Object.entries(el.props)) {
    if (k === 'children') continue
    if (k.startsWith('on')) dom.addEventListener(k.slice(2).toLowerCase(), v)
    else dom[k] = v
  }
  el.props.children.forEach((c) => render(c, dom))
  container.appendChild(dom)
}`,
      },
      {
        title: 'useState: hook cells stored by call order',
        body: 'A global cursor walks an array of cells. Reset it before each render. This is why hook order must never change.',
        lang: 'js',
        code: `let cells = [], cursor = 0, rootEl, rootDom

function useState(initial) {
  const i = cursor++
  cells[i] ??= initial
  const set = (next) => {
    cells[i] = typeof next === 'function' ? next(cells[i]) : next
    rerender()
  }
  return [cells[i], set]
}

function rerender() {
  cursor = 0
  rootDom.innerHTML = ''          // no diffing: throw it all away
  render(rootEl, rootDom)
}

function mount(el, dom) { rootEl = el; rootDom = dom; rerender() }`,
      },
      {
        title: 'Use it',
        body: 'A counter, written with the pieces above. Open it in a browser with a plain script tag and it works.',
        lang: 'js',
        code: `function Counter() {
  const [n, setN] = useState(0)
  return createElement('button', { onClick: () => setN((x) => x + 1) }, 'Clicked ', n)
}

mount(createElement(Counter), document.getElementById('root'))`,
      },
      {
        title: 'Notice what is missing',
        body: 'Every change rebuilds all DOM, so focus and scroll position are lost and large trees are slow. Adding a diff between the previous element tree and the next one, and editing only changed nodes, is reconciliation. Making that diff pausable is Fiber. That is the distance between this file and React.',
        lang: 'js',
        code: `// Exercise: keep the previous element tree in a variable, and in rerender()
// compare old and new children by index. Update dom.nodeValue in place when
// only text changed. You have just written the first heuristic of React's diff.`,
      },
    ],
  },

  inTheWild: [
    { who: 'Facebook and Instagram', what: 'Where React was born. Instagram\'s web app was one of the first full React applications.' },
    { who: 'Netflix', what: 'Uses React for its TV and browser interfaces, chosen for startup performance and the ability to server-render.' },
    { who: 'Airbnb', what: 'Runs its entire web product on React and open-sourced tools such as its style guide and Enzyme testing library.' },
    { who: 'Discord', what: 'The desktop and web client is React, rendering chat with hundreds of thousands of messages using virtualised lists.' },
    { who: 'Shopify', what: 'The merchant admin and its Polaris design system are React components.' },
    { who: 'This app', what: 'Every page, panel and quiz is a function component; state lives in hooks and one Zustand store.' },
  ],

  alternatives: [
    { name: 'Vue', pick: 'When you want templates closer to HTML and a gentler learning curve, with the same component model underneath.' },
    { name: 'Svelte', pick: 'When bundle size matters most. It compiles components to direct DOM code with no virtual DOM at runtime.' },
    { name: 'SolidJS', pick: 'When you like JSX but want fine-grained reactivity: components run once and only the changed text nodes update.' },
    { name: 'Preact', pick: 'A 3 KB React-compatible core for widgets or embedded scripts where every kilobyte counts.' },
    { name: 'Vanilla DOM', pick: 'A single interactive widget on an otherwise static page. Framework overhead is not worth it below a few components.' },
  ],

  glossary: [
    { term: 'Element', meaning: 'The plain object JSX creates: type, props and key. A description, not a DOM node.' },
    { term: 'Component', meaning: 'A function that takes props and returns elements.' },
    { term: 'Props', meaning: 'Read-only inputs passed from a parent to a child.' },
    { term: 'State', meaning: 'A value a component owns and can change, causing a re-render.' },
    { term: 'Hook', meaning: 'A function beginning with use that lets components use React features.' },
    { term: 'Render', meaning: 'React calling your components to get a new element tree.' },
    { term: 'Reconciliation', meaning: 'Diffing the new element tree against the old one to find minimal DOM edits.' },
    { term: 'Commit', meaning: 'Applying those edits to the real DOM in one synchronous pass.' },
    { term: 'Fiber', meaning: 'React\'s internal unit of work, one per component or DOM node, with links to child, sibling and parent.' },
    { term: 'Key', meaning: 'A stable identity for list children so React can match, move and preserve them.' },
    { term: 'Effect', meaning: 'Code that runs after render to synchronise with something outside React, with an optional cleanup.' },
  ],

  quiz: [
    {
      question: 'Inside one click handler you call setCount(count + 1) three times. count was 0. What is it after the render?',
      options: ['3', '1', '0', 'It depends on the browser'],
      answerIndex: 1,
      explanation: 'count is a snapshot for that render, so all three calls compute 0 + 1. Use the function form, setCount(c => c + 1), to chain updates.',
    },
    {
      question: 'Why does React require hooks to be called in the same order on every render?',
      options: ['For readability', 'Hooks are stored in a list on the fiber and looked up by position, not by name', 'Because JavaScript cannot name closures', 'To keep effects synchronous'],
      answerIndex: 1,
      explanation: 'Each useState or useEffect appends a cell on first render and reads the cell at the same index later. A skipped call shifts every later hook onto the wrong cell.',
    },
    {
      question: 'What happens to a text input\'s typed value when its list row is keyed by array index and the row above it is deleted?',
      options: ['Nothing, React tracks inputs', 'The value jumps to the wrong row because React reuses DOM nodes by index', 'React throws an error', 'The input is remounted with the same value'],
      answerIndex: 1,
      explanation: 'With index keys, the deleted row\'s DOM node is reused for the next item, carrying its internal state along. Stable ids as keys prevent this.',
    },
    {
      question: 'Which phase of an update can React pause and throw away?',
      options: ['The commit phase', 'The render phase', 'Both', 'Neither'],
      answerIndex: 1,
      explanation: 'Render is pure and interruptible; it only produces a description. Commit mutates the DOM and must finish in one go so nothing half-applied is visible.',
    },
    {
      question: 'Your useEffect subscribes to scroll but never unsubscribes. What is the consequence?',
      options: ['Nothing, React cleans up automatically', 'A leak: each mount adds another listener, and unmounted components keep running', 'The effect will not run', 'React warns and removes it'],
      answerIndex: 1,
      explanation: 'React only cleans up what you return from the effect. Without a cleanup, listeners accumulate and may call setState on components that no longer exist.',
    },
    {
      question: 'In development, StrictMode runs your effect, cleans it up, then runs it again. Why?',
      options: ['A bug in React', 'To prove your cleanup is correct, since concurrent rendering may mount and unmount trees', 'To warm the cache', 'To measure performance'],
      answerIndex: 1,
      explanation: 'A component that survives a mount, unmount, mount cycle in development will survive React pausing and resuming it in production.',
    },
  ],
}
