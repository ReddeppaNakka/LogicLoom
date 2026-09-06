import type { TechDeep } from '../stack-types'

export const framerMotionDeep: TechDeep = {
  analogy:
    'A stage manager who understands "the actor should end up at the left mark". You do not choreograph each footstep; you state where things should be for each scene, and the manager works out a natural walk between them, complete with the slight overshoot a real person has when they stop. Framer Motion is that manager for elements: you describe the destination and it produces the movement.',

  origins: `Framer Motion was written by **Matt Perry** and released in **2018** as the animation layer of Framer, the design and prototyping tool. It grew out of Perry's earlier library, Popmotion, a set of low-level animation primitives. In late 2024 the library was renamed **Motion** and moved to its own home at motion.dev, with a vanilla JavaScript version alongside the React one; the npm package \`framer-motion\` still installs it, which is what this app uses.

The problem it solved was the gap between CSS transitions and real interaction design. CSS can animate a property between two values on a class change, but it cannot animate an element being removed from the page, cannot animate between two different layouts, and cannot easily be interrupted mid-flight and redirected. Designers prototyping in Framer wanted spring physics, gestures and shared-element transitions that felt like a native app. Motion brought those to React with a declarative API: put \`animate={{ x: 100 }}\` on an element and it goes there, however it is currently moving.

Under the hood it is a **hybrid engine**. Where it can, it hands off to the browser's Web Animations API and hardware-accelerated transforms; where it cannot, it runs its own JavaScript loop with spring and inertia solvers.`,

  concepts: [
    {
      title: 'motion elements animate their props',
      body: `\`motion.div\` is a div that watches its \`animate\` prop. When the values in that object change, the element animates from wherever it is to the new values. \`initial\` is the starting state on mount; \`transition\` describes how to travel. Because \`animate\` is just React props, you drive animation with ordinary state: change the state, the element moves.

Transforms (\`x\`, \`y\`, \`scale\`, \`rotate\`) are first-class shorthand and are the properties to prefer, since the browser can animate them without re-laying out the page.`,
      lang: 'tsx',
      code: `import { motion } from 'framer-motion'

function Toast({ open }: { open: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: open ? 1 : 0, y: open ? 0 : 24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      Saved
    </motion.div>
  )
}`,
    },
    {
      title: 'Springs instead of durations',
      body: `A tween goes from A to B in a fixed time along an easing curve. A **spring** has no duration: it is a physical simulation with stiffness, damping and mass, and it stops when it settles. Springs feel natural because they carry velocity. If you interrupt one mid-flight, the new spring starts with the current velocity and the motion stays continuous, which a restarted tween cannot do.

Motion defaults to springs for transforms and tweens for colours and opacity. Tune with \`stiffness\` (how strong the pull), \`damping\` (how quickly it stops bouncing) and \`mass\`.`,
      lang: 'tsx',
      code: `<motion.div
  animate={{ x: open ? 240 : 0 }}
  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
/>

// stiffness 100, damping 10  -> soft and bouncy
// stiffness 400, damping 32  -> snappy, one small overshoot
// stiffness 700, damping 60  -> almost a tween`,
    },
    {
      title: 'Variants: name states, orchestrate children',
      body: `Instead of inline objects, define named states in a \`variants\` object and reference them by string. A parent's variant name propagates to its children, so setting \`animate="show"\` on a list animates every item that has a \`show\` variant. Transition options such as \`staggerChildren\` and \`delayChildren\` on the parent turn a group of items into a choreographed sequence with no per-item wiring.`,
      lang: 'tsx',
      code: `const list = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

<motion.ul variants={list} initial="hidden" animate="show">
  {problems.map((p) => <motion.li key={p.id} variants={item}>{p.title}</motion.li>)}
</motion.ul>`,
    },
    {
      title: 'AnimatePresence: animating what is leaving',
      body: `React removes an element from the DOM the moment it stops being rendered, so there is nothing left to fade out. \`AnimatePresence\` keeps a removed child mounted until its \`exit\` animation finishes, then removes it. Children need a stable \`key\` so Motion can tell which one is leaving. \`mode="wait"\` makes the outgoing element finish before the incoming one starts, which is the classic page-transition pattern; the default runs both at once.`,
      lang: 'tsx',
      code: `<AnimatePresence>
  {open && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>`,
    },
    {
      title: 'Gestures: hover, tap, drag and in-view',
      body: `\`whileHover\`, \`whileTap\` and \`whileFocus\` accept the same value objects as \`animate\` and apply while the gesture is active, springing back afterwards. \`drag\` makes an element draggable with \`dragConstraints\` for bounds and inertia on release. \`whileInView\` animates when the element scrolls into the viewport, with \`viewport={{ once: true }}\` to play only the first time, which is how reveal-on-scroll is done in this app.`,
      lang: 'tsx',
      code: `<motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Go</motion.button>

<motion.div drag="x" dragConstraints={{ left: -100, right: 100 }} />

<motion.section
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-40px' }}
/>`,
    },
    {
      title: 'Layout animations and layoutId',
      body: `Add \`layout\` to an element and any change to its size or position caused by a re-render (a list reordering, a sibling appearing, a flex direction change) animates instead of jumping. Motion measures the box before and after the change and animates a transform between them, a technique called FLIP.

\`layoutId\` extends this across elements. Two elements with the same \`layoutId\` mounted at different times are treated as the same thing moving: the pill under the active tab that slides between labels is one element unmounting and another mounting with a shared id.`,
      lang: 'tsx',
      code: `{VIEWS.map((v) => (
  <button key={v.id} onClick={() => setView(v.id)} className="relative">
    {view === v.id && (
      <motion.span layoutId="pill" className="absolute inset-0 rounded-xl bg-accent/10" />
    )}
    <span className="relative">{v.label}</span>
  </button>
))}
// clicking another tab: the old pill unmounts, the new one mounts,
// Motion animates the box from the old position to the new`,
    },
    {
      title: 'Motion values, scroll and useSpring',
      body: `A \`MotionValue\` is a value that changes over time without re-rendering React. \`useMotionValue\` creates one, \`useTransform\` derives another (map scroll progress to opacity), \`useSpring\` smooths one, and \`useScroll\` gives you scroll progress as motion values. Attach them to a \`style\` prop and the element updates on every frame straight from the value, bypassing the React render cycle entirely. This is what powers a reading-progress bar or a tilting card that follows the cursor.`,
      lang: 'tsx',
      code: `function ReadingBar() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return <motion.div style={{ scaleX: width, transformOrigin: 'left' }} className="h-0.5 bg-accent" />
}

// Tilt toward the cursor without a single React re-render
const mx = useMotionValue(0.5)
const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]))
<motion.div style={{ rotateY }} onMouseMove={(e) => mx.set(e.nativeEvent.offsetX / e.currentTarget.clientWidth)} />`,
    },
  ],

  visual: {
    title: 'A spring, frame by frame',
    intro: 'A panel is told to move from x = 0 to x = 200 with a spring. Watch the position and velocity on successive frames, and what happens when the target changes mid-flight.',
    frames: [
      {
        caption: 'Frame 0. The element is at rest at 0. The target becomes 200. The spring computes the force from the distance to the target.',
        frame: `  target: 200      stiffness: 300   damping: 26
  x: 0             v: 0

  0 ─────────────────────────────────────── 200
  █
  force = stiffness * (target - x) - damping * v
        = 300 * 200 - 0  =  strong pull`,
      },
      {
        caption: 'Frames 1 to 6. Velocity builds, position accelerates. Each frame integrates force into velocity and velocity into position.',
        frame: `  frame   x       v
    1      3.3    200
    2     12.8    380
    3     27.6    520
    4     46.5    610
    5     68.2    660
    6     91.3    670    <- fastest here, halfway

  0 ─────────────────────────────────────── 200
                       █`,
      },
      {
        caption: 'Frames 7 to 12. Past the midpoint the damping term dominates; velocity falls and the element overshoots slightly.',
        frame: `  frame   x       v
    8    136.0    560
   10    174.5    390
   12    200.8    200
   14    212.4     60    <- overshoot, 6% past target
   16    211.0    -70    <- coming back

  0 ─────────────────────────────────────── 200
                                            █ (212)`,
      },
      {
        caption: 'Interrupted. At frame 10 the user closes the panel: target becomes 0. The spring keeps its velocity and reverses smoothly. No jump, no restart.',
        frame: `  frame 10:  target 200 -> 0    x: 174.5   v: +390

  frame   x       v
   11    185.0   +200     still drifting right
   12    188.2    +10     turning
   13    184.0   -190
   16    140.0   -560     heading home

  a CSS transition would restart from 174.5 with v = 0
  and feel like a hiccup`,
      },
      {
        caption: 'Rest. When both the distance and the velocity drop below thresholds the animation stops and the element settles at exactly the target.',
        frame: `  frame   x       v
   38      0.6    -3
   40      0.2    -1
   41      0.0     0    |x - target| < 0.01 and |v| < 0.01
                        -> done, snap to 0

  0 ─────────────────────────────────────── 200
  █`,
      },
    ],
  },

  internals: `## The visual element and the animation state

Each \`motion.\` component creates a *visual element*: an object that tracks the DOM node, its current motion values, and the animation targets from its props. On every render, Motion diffs the new \`animate\` (and gesture and variant) targets against the last ones. Only values that changed start an animation. This is why \`animate\` can be passed a fresh object every render without restarting anything.

The animation state machine has priority levels: \`animate\` at the bottom, then \`whileInView\`, \`whileHover\`, \`whileTap\`, \`whileDrag\`, \`whileFocus\`, and \`exit\` on top. When a gesture ends, the value falls back to the next active level. That fallback is computed rather than hand-coded, which is why \`whileHover\` needs no "onHoverEnd" animation from you.

## Motion values as the source of truth

Every animatable property is backed by a \`MotionValue\`: a small observable holding a number or string, its velocity (estimated from the last few updates), and a set of subscribers. Animations write to motion values; the renderer reads them. React never re-renders during an animation. When you pass a motion value in \`style\`, Motion subscribes the DOM node to it directly. When the value changes, the node's style is updated in a scheduled frame.

## The frame loop

Motion runs a single \`requestAnimationFrame\` loop with ordered steps: read (measure layout if needed), update (advance every active animation by the elapsed time), preRender, render (write styles to DOM), postRender. Batching all reads before all writes avoids layout thrashing, where alternating measurement and mutation forces the browser to re-lay out repeatedly. Animations that are hardware-accelerated are handed to the browser and skip the update step.

## Hybrid acceleration

Since version 10, Motion uses the **Web Animations API** for simple tweens on transform, opacity, filter and clip-path, so they run on the compositor thread and keep moving even if the main thread is busy. Springs are pre-sampled into keyframes when their parameters allow, and handed to WAAPI too. Anything else, including layout animations and values driven by \`useTransform\`, runs in the JavaScript loop. You get acceleration where it is safe and control where it is needed.

## Springs

The spring solver is a damped harmonic oscillator. Given stiffness \`k\`, damping \`c\` and mass \`m\`, it classifies the system (under-, critically- or over-damped) and uses the closed-form solution for position at time \`t\`, rather than numerically integrating step by step, which is what makes it possible to pre-sample a spring into keyframes. Velocity from the interrupted animation is fed in as the initial condition, which is what keeps redirections smooth. The animation is considered finished when position is within a rest delta of the target and speed is under a rest speed.

## Layout animations: FLIP

For \`layout\` and \`layoutId\`, Motion snapshots the element's bounding box before React commits, lets the commit happen, measures the new box, then applies a transform that makes the element appear at the old position and animates that transform to identity. First, Last, Invert, Play. Because it is transforms only, it is cheap, and it works across elements with a shared \`layoutId\` by treating the unmounting element's last box as the mounting element's first. The projection tree corrects child scaling so text is not distorted while a parent resizes.

## Exit animations

\`AnimatePresence\` renders its children into an internal list and compares keys across renders. A key that disappears is kept in the list with a \`present: false\` flag. The child reads that flag through context, plays its \`exit\` target, and calls back when done, at which point Presence removes it for real. This is why the \`key\` matters and why an element without \`exit\` disappears instantly.

## Reduced motion

\`useReducedMotion\` reads the \`prefers-reduced-motion\` media query. \`MotionConfig reducedMotion="user"\` (or \`"always"\`) turns transform animations into instant changes while keeping opacity fades, app-wide, with no per-element code. This app also exposes a Still setting that removes CSS animations for the same reason.`,

  buildIt: {
    title: 'A spring animator in 40 lines',
    intro: 'Simulate a damped spring with requestAnimationFrame and drive an element\'s transform. Then interrupt it and see why velocity carry-over matters.',
    steps: [
      {
        title: 'The spring step',
        body: 'Semi-implicit Euler: update velocity from force, then position from velocity. Small, stable, and enough for UI.',
        lang: 'ts',
        code: `interface Spring { x: number; v: number; target: number; k: number; c: number; m: number }

function step(s: Spring, dt: number) {
  const force = -s.k * (s.x - s.target) - s.c * s.v
  s.v += (force / s.m) * dt
  s.x += s.v * dt
}

const atRest = (s: Spring) => Math.abs(s.x - s.target) < 0.01 && Math.abs(s.v) < 0.01`,
      },
      {
        title: 'A frame loop that writes to the DOM',
        body: 'One loop, fixed sub-steps for stability, and a transform write per frame.',
        lang: 'ts',
        code: `function animate(el: HTMLElement, s: Spring) {
  let last = performance.now()
  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.064); last = now
    for (let i = 0; i < 4; i++) step(s, dt / 4)
    el.style.transform = 'translateX(' + s.x.toFixed(2) + 'px)'
    if (!atRest(s)) requestAnimationFrame(frame)
    else { s.x = s.target; s.v = 0; el.style.transform = 'translateX(' + s.x + 'px)' }
  }
  requestAnimationFrame(frame)
}`,
      },
      {
        title: 'Retarget without restarting',
        body: 'Because the spring object keeps x and v, changing target mid-flight continues from the current state. That is the behaviour CSS transitions cannot give you.',
        lang: 'ts',
        code: `const panel = document.querySelector<HTMLElement>('.panel')!
const s: Spring = { x: 0, v: 0, target: 0, k: 300, c: 26, m: 1 }

document.querySelector('.open')!.addEventListener('click', () => { s.target = 200; animate(panel, s) })
document.querySelector('.close')!.addEventListener('click', () => { s.target = 0 })
// click open, then close halfway: the panel turns around smoothly`,
      },
      {
        title: 'Turn it into a hook',
        body: 'Wrap the loop in a ref and a useEffect, and you have the skeleton of useSpring. Motion adds the closed-form solver, the frame batching, WAAPI hand-off and the whole prop API on top.',
        lang: 'tsx',
        code: `function useSpringX(target: number) {
  const ref = useRef<HTMLDivElement>(null)
  const s = useRef<Spring>({ x: 0, v: 0, target, k: 300, c: 26, m: 1 })
  useEffect(() => {
    s.current.target = target
    if (ref.current) animate(ref.current, s.current)
  }, [target])
  return ref
}
// <div ref={useSpringX(open ? 200 : 0)} />`,
      },
    ],
  },

  inTheWild: [
    { who: 'Framer', what: 'The design tool whose prototypes and published sites run on this exact engine.' },
    { who: 'Linear-style product UIs', what: 'Command palettes, sliding panels and reorderable lists in modern SaaS apps are very often Motion under the hood.' },
    { who: 'Marketing sites on Awwwards', what: 'Reveal-on-scroll, staggered headlines and shared-element page transitions are the library\'s bread and butter.' },
    { who: 'shadcn/ui and Radix-based kits', what: 'Many component libraries pair Motion with headless primitives for enter and exit animation.' },
    { who: 'This app', what: 'Page transitions, section reveals, the tilting bento tiles, the spotlight overlay, the count-up hero and the reading-progress spring.' },
  ],

  alternatives: [
    { name: 'CSS transitions and @keyframes', pick: 'Simple hover states and loops. Zero JavaScript, runs on the compositor. This app uses CSS for the ambient loops and Motion for state-driven movement.' },
    { name: 'Web Animations API directly', pick: 'A vanilla project needing programmatic, interruptible tweens without a dependency.' },
    { name: 'GSAP', pick: 'Timeline-heavy, designer-driven sequences and SVG morphing. Framework-agnostic and very mature.' },
    { name: 'react-spring', pick: 'A spring-first alternative with a hook-centric API. Similar power, different taste.' },
    { name: 'View Transitions API', pick: 'Cross-page and cross-state transitions handled by the browser, when support is enough for your users.' },
  ],

  glossary: [
    { term: 'motion element', meaning: 'A DOM element wrapper such as motion.div that animates its animate prop.' },
    { term: 'Tween', meaning: 'An animation with a fixed duration and easing curve.' },
    { term: 'Spring', meaning: 'A physics simulation with stiffness, damping and mass; no duration.' },
    { term: 'Variant', meaning: 'A named animation state that can propagate from parent to children.' },
    { term: 'Stagger', meaning: 'A per-child delay so a group animates in sequence.' },
    { term: 'AnimatePresence', meaning: 'Keeps removed children mounted until their exit animation completes.' },
    { term: 'FLIP', meaning: 'First, Last, Invert, Play: animating a layout change with transforms.' },
    { term: 'layoutId', meaning: 'A shared identity so one element appears to move into another\'s place.' },
    { term: 'MotionValue', meaning: 'An observable value updated per frame without React re-rendering.' },
    { term: 'WAAPI', meaning: 'The Web Animations API, the browser\'s native animation engine Motion hands simple tweens to.' },
  ],

  quiz: [
    {
      question: 'Why does an element with only initial and animate props vanish instantly when it is removed, instead of fading out?',
      options: ['A bug in Motion', 'React removes the DOM node immediately; it needs AnimatePresence and an exit prop to stay mounted while animating', 'exit is the default', 'Because it has no key'],
      answerIndex: 1,
      explanation: 'Once React stops rendering an element there is nothing to animate. AnimatePresence defers the removal until the exit animation finishes, using the key to track it.',
    },
    {
      question: 'What advantage does a spring have over a duration-based tween when the target changes mid-animation?',
      options: ['It is faster', 'It carries the current velocity into the new motion, so there is no visible restart', 'It uses less memory', 'None; they behave the same'],
      answerIndex: 1,
      explanation: 'A spring is a simulation with state. Retargeting continues from the current position and velocity, which is what makes interruptions feel natural.',
    },
    {
      question: 'Two buttons each render a motion.span with the same layoutId, only one at a time. What happens on switching?',
      options: ['Both render', 'The span animates from the old button\'s position to the new one\'s using a FLIP transform', 'Nothing special', 'An error about duplicate ids'],
      answerIndex: 1,
      explanation: 'Motion treats the unmounting element\'s last box as the mounting element\'s first box and animates the difference.',
    },
    {
      question: 'How does a motion value attached to style update the screen without re-rendering the component?',
      options: ['It uses a second React root', 'It subscribes the DOM node directly and writes the style each frame', 'It triggers setState internally', 'It uses CSS variables only'],
      answerIndex: 1,
      explanation: 'MotionValues are observables. The renderer writes their current value to the node in the frame loop, bypassing React entirely.',
    },
    {
      question: 'Which properties should you animate for the smoothest results, and why?',
      options: ['width and height, they are intuitive', 'Transforms and opacity, because the browser can composite them without layout or paint', 'Colors, they are cheap', 'Margins, they move things'],
      answerIndex: 1,
      explanation: 'Transform and opacity changes skip layout and paint and can run on the compositor thread. Motion can also hand them to the Web Animations API.',
    },
  ],
}
