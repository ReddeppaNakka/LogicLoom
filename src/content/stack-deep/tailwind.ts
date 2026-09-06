import type { TechDeep } from '../stack-types'

export const tailwindDeep: TechDeep = {
  analogy:
    'Traditional CSS is like naming every outfit before you wear it: "the-Tuesday-meeting-look" is a jacket, a shirt and dark shoes, defined in a wardrobe file somewhere. Tailwind hands you the shirt, the jacket and the shoes as individual pieces with fixed names, and you dress each element right where it stands. There is no wardrobe file to keep in sync, and two people dressing from the same rack end up looking like they belong to the same company.',

  origins: `Tailwind CSS was created by **Adam Wathan** with Jonathan Reinink, David Hemphill and designer Steve Schoger. The first release was in **November 2017**; version 1.0 came in 2019, version 3 in 2021, and **version 4**, used here, in January 2025.

The idea it grew from was utility-first CSS, which Wathan had been arguing for in a 2017 essay titled "CSS Utility Classes and Separation of Concerns". The problem he described: on real projects, semantic class names such as \`.author-bio\` end up either duplicating the same rules a dozen times or being reused for things that are not author bios, and every change means finding the right place in a stylesheet nobody fully understands. Utility classes invert it. \`flex\`, \`gap-3\`, \`text-sm\` each do one thing, live in the markup, and never need naming.

The early objection was file size: a class for every combination of property and value is enormous. Version 3 solved it with the **Just-in-Time engine**, which scans your source files and generates only the classes you actually wrote. Version 4 rebuilt the engine in Rust (the "Oxide" engine), made configuration CSS-first with the \`@theme\` directive, and leaned on modern CSS features such as cascade layers, \`color-mix()\` and container queries.`,

  concepts: [
    {
      title: 'One class, one job',
      body: `A utility class sets one CSS property, or a small deliberate bundle. \`p-4\` is padding of 1rem. \`flex\` is \`display: flex\`. \`text-bone\` is a colour from the theme. You compose the design of an element by listing the utilities it needs in \`className\`.

The immediate objection is that markup gets long. It does. What you get in return is that the styling of an element is fully visible where the element is, there is no naming, and deleting the element deletes its styles with it. Dead CSS, the silent weight of most old stylesheets, cannot accumulate.`,
      lang: 'html',
      code: `<!-- Traditional: name it, define it elsewhere, keep both in sync -->
<div class="rank-card">...</div>
.rank-card { display:flex; align-items:center; gap:.75rem; padding:1rem;
             border-radius:1rem; border:1px solid #333; }

<!-- Utility-first: the same box, nothing to name -->
<div class="flex items-center gap-3 p-4 rounded-2xl border border-[var(--line)]">...</div>`,
    },
    {
      title: 'The scanner generates only what you use',
      body: `Tailwind does not ship a stylesheet. It reads your source files as plain text, finds anything that looks like a class name, and emits CSS for exactly those. Write \`mt-[13px]\` once and a rule for it appears; delete it and the rule disappears. A finished app's CSS is typically 10 to 30 KB regardless of how large Tailwind's vocabulary is.

The consequence you must respect: class names have to appear **complete** in the source. \`'text-' + color\` produces nothing because the scanner never sees \`text-red-500\`. Write a map of full class strings instead.`,
      lang: 'tsx',
      code: `// Broken: the scanner never sees a complete class name
<span className={'text-' + tone + '-500'} />

// Works: every full name exists in the file as text
const TONE = { good: 'text-green-500', warn: 'text-amber-500', bad: 'text-red-500' }
<span className={TONE[tone]} />`,
    },
    {
      title: 'Variants: state, breakpoints and dark mode as prefixes',
      body: `A variant is a prefix that wraps the utility in a condition. \`hover:bg-black\` applies on hover. \`md:grid-cols-2\` applies from the medium breakpoint up (Tailwind is mobile-first: unprefixed rules are the base, prefixes add rules for wider screens). \`dark:\` follows the system preference or a selector. Variants stack: \`md:hover:text-white\`.

This is where Tailwind saves the most typing. Responsive design in hand-written CSS means media query blocks far from the element. Here it is a word away.`,
      lang: 'html',
      code: `<button class="
  px-4 py-2 rounded-xl text-sm
  bg-neutral-900 text-white
  hover:bg-neutral-700 focus-visible:ring-2
  disabled:opacity-50
  sm:px-5 md:text-base
">Start session</button>

<!-- reads as: base, then on hover, on focus, when disabled,
     from sm up, from md up -->`,
    },
    {
      title: 'Design tokens with @theme in v4',
      body: `Version 4 moved configuration out of a JavaScript file and into CSS. Inside \`@theme\` you declare CSS variables with special prefixes: \`--color-*\`, \`--font-*\`, \`--spacing-*\`, \`--breakpoint-*\`. Each one both becomes a real CSS custom property **and** generates utilities. Declare \`--color-bone: #dfe7e0\` and \`text-bone\`, \`bg-bone\`, \`border-bone\` all exist.

This ties Tailwind to the same variables your hand-written CSS uses, which is how this app's nine themes work: the utilities read variables that the theme swaps.`,
      lang: 'css',
      code: `@import "tailwindcss";

@theme {
  --font-display: "Cormorant Garamond", serif;
  --color-bone: #dfe7e0;
  --color-system: rgb(var(--accent-rgb));
  --breakpoint-xs: 30rem;
}

/* now available: font-display, text-bone, bg-system, xs:grid-cols-2 */`,
    },
    {
      title: 'Arbitrary values and CSS variables',
      body: `When the scale does not have what you need, square brackets take any value: \`w-[112px]\`, \`top-[calc(50%-1px)]\`, \`bg-[rgb(var(--accent-rgb)/0.12)]\`. The scanner still emits exactly one rule per distinct value, so there is no penalty. Arbitrary properties also exist: \`[mask-type:luminance]\`.

A good rule: if you write the same arbitrary value more than three times, promote it to a theme token.`,
      lang: 'html',
      code: `<div class="
  w-[112px] h-[112px]
  border border-[rgb(var(--accent-rgb)/0.35)]
  shadow-[0_30px_70px_-40px_rgb(var(--accent-rgb)/0.55)]
  [transform-style:preserve-3d]
"></div>`,
    },
    {
      title: 'Container queries',
      body: `Media queries ask how wide the **screen** is. Container queries ask how wide the **parent** is, which is the question a reusable component actually needs answered. Mark the parent with \`@container\` and use \`@sm:\`, \`@md:\` variants on the children. A card then lays itself out correctly whether it sits in a sidebar or a full-width grid.

Tailwind v4 ships these without a plugin. The bento tiles in this app scale their titles by tile width this way.`,
      lang: 'html',
      code: `<div class="@container rounded-2xl p-5">
  <h3 class="text-[19px] @xs:text-[26px] @sm:text-[30px]">React</h3>
  <!-- sizes by the tile's own width, not the viewport -->
</div>`,
    },
    {
      title: 'Cascade layers keep utilities on top',
      body: `Tailwind v4 emits its CSS inside \`@layer theme, base, components, utilities\`. Layers decide precedence before specificity does: anything in a later layer beats anything in an earlier one regardless of selector weight. Your own unlayered CSS beats all Tailwind layers, which is why a hand-written rule always wins over a utility, and why \`!\` (the important modifier, as in \`!py-0\`) exists for the rare cases you need a utility to win back.`,
      lang: 'css',
      code: `/* What Tailwind emits (abridged) */
@layer theme, base, components, utilities;
@layer utilities {
  .flex { display: flex }
  .p-4 { padding: 1rem }
}

/* Your unlayered rule beats any utility, no specificity war needed */
.stack-tile { padding: 1.25rem }`,
    },
  ],

  visual: {
    title: 'From class names in a file to a stylesheet',
    intro: 'Follow one component through the Tailwind pipeline at build time. The whole point is that nothing you did not write ends up in the output.',
    frames: [
      {
        caption: 'The source. Three utilities, one responsive variant, one arbitrary value.',
        frame: `  src/components/Card.tsx
  ┌──────────────────────────────────────────────┐
  │ <div className="flex gap-3 p-4              │
  │                 md:p-6 rounded-[18px]">      │
  └──────────────────────────────────────────────┘`,
      },
      {
        caption: 'The scanner treats every file as text and extracts anything shaped like a class. It does not parse JSX or know what a prop is.',
        frame: `  scanner (Rust, Oxide)
  reads: src/**/*.{ts,tsx,html,css}

  candidates found:
    flex
    gap-3
    p-4
    md:p-6
    rounded-[18px]
    className        <- not a utility, ignored
    div              <- ignored`,
      },
      {
        caption: 'Each candidate is matched against the utility grammar and the theme, and compiled to a rule.',
        frame: `  compile
    flex           -> .flex { display: flex }
    gap-3          -> .gap-3 { gap: calc(var(--spacing) * 3) }
    p-4            -> .p-4 { padding: calc(var(--spacing) * 4) }
    md:p-6         -> @media (width >= 48rem) {
                        .md\\:p-6 { padding: ... * 6 } }
    rounded-[18px] -> .rounded-\\[18px\\] { border-radius: 18px }`,
      },
      {
        caption: 'Rules are placed in cascade layers and emitted once each, sorted so that variants come after their base utilities.',
        frame: `  output.css
  @layer theme, base, components, utilities;
  @layer theme { :root { --spacing: .25rem; ... } }
  @layer utilities {
    .flex { display: flex }
    .gap-3 { gap: .75rem }
    .p-4 { padding: 1rem }
    .rounded-\\[18px\\] { border-radius: 18px }
    @media (width >= 48rem) { .md\\:p-6 { padding: 1.5rem } }
  }`,
      },
      {
        caption: 'Delete the md:p-6 from the source and rebuild. That rule is gone. The stylesheet only ever contains what the markup asks for.',
        frame: `  before                        after
  .flex                         .flex
  .gap-3                        .gap-3
  .p-4                          .p-4
  .rounded-[18px]               .rounded-[18px]
  @media md { .md:p-6 }         (removed)

  css size: 58 KB for this whole app, all pages`,
      },
    ],
  },

  internals: `## A compiler, not a stylesheet

The mental shift with Tailwind is that it is a build step, not a CSS file you include. Given your source files and your theme, it produces a stylesheet tailored to that exact project. Understanding it means understanding the three stages: scan, compile, emit.

## Scanning

The scanner, rewritten in Rust for v4, reads every file matched by your content configuration (v4 detects sources automatically from the project, ignoring \`.gitignore\`d paths). It does not parse languages. It tokenises text on whitespace and quotes and keeps tokens that could plausibly be classes. This is why any string in any file can produce a utility, including one in a comment or a markdown file, and why concatenated class names are invisible.

## Compiling a candidate

Each candidate is parsed from the right. \`md:hover:bg-red-500/50\` splits into variants \`md\` and \`hover\`, the utility root \`bg\`, the value \`red-500\`, and the modifier \`50\`. The utility registry knows that \`bg\` with a colour value sets \`background-color\`, and the theme resolves \`red-500\` to a variable. The modifier applies an opacity, which in v4 is done with \`color-mix()\` so it works with any colour format. Variants wrap the declaration in a selector or an at-rule. Arbitrary values in brackets skip theme lookup and pass through, after a check that the value is valid for the property.

## Emitting

Rules are deduplicated and sorted. Order matters in CSS when two rules have equal specificity, so Tailwind sorts utilities by a fixed property order and places variants after base utilities and larger breakpoints after smaller ones. That is what makes \`sm:p-2 md:p-4\` behave as you expect regardless of the order you typed them. Everything goes into \`@layer utilities\`, with theme variables in \`@layer theme\` and the preflight reset in \`@layer base\`.

## Preflight

Tailwind ships a reset called Preflight: margins removed, headings unstyled, lists without bullets, images block-level, border colours normalised. It is the reason a fresh Tailwind page looks bare and consistent, and also the reason this app's markdown styles have to put list bullets back explicitly.

## The Vite plugin

\`@tailwindcss/vite\` hooks into Vite's transform pipeline. In development it watches the module graph and regenerates the CSS on any source change, delivering it via HMR so a new class appears without a reload. In production it runs once during the Rollup build. There is no PostCSS in the v4 Vite path, which is part of why it is fast.

## Why v4 uses modern CSS

Custom properties for every token mean the theme is inspectable in devtools and overridable at runtime by plain CSS, which is exactly what this app's theming needs. Cascade layers remove specificity fights. \`color-mix()\` replaces the old RGB-channel trick for opacity modifiers. Container queries and \`@starting-style\` are available as variants. The trade is browser support: v4 targets Safari 16.4, Chrome 111 and Firefox 128 or newer.`,

  buildIt: {
    title: 'A utility generator in 25 lines',
    intro: 'Scan a file for class names, match them against a tiny grammar, and print CSS. Everything Tailwind does is a much larger version of this.',
    steps: [
      {
        title: 'Define a spacing scale and a few utilities',
        body: 'Each utility is a function from a value to declarations. The scale maps numbers to rem.',
        lang: 'js',
        code: `const scale = (n) => n * 0.25 + 'rem'
const utilities = {
  p:    (v) => 'padding:' + scale(v),
  m:    (v) => 'margin:' + scale(v),
  gap:  (v) => 'gap:' + scale(v),
  flex: ()  => 'display:flex',
  text: (v) => 'color:var(--color-' + v + ')',
}`,
      },
      {
        title: 'Scan a source string for candidates',
        body: 'Split on anything that is not a class character, keep the unique tokens.',
        lang: 'js',
        code: `const src = '<div class="flex gap-3 p-4 md:p-6 text-bone">'
const candidates = [...new Set(src.split(/[^\\w:-]+/).filter(Boolean))]
// ['div', 'class', 'flex', 'gap-3', 'p-4', 'md:p-6', 'text-bone']`,
      },
      {
        title: 'Compile each candidate, ignoring what does not match',
        body: 'Peel variants off the front, split the utility from its value, and look it up. Unknown tokens produce nothing, which is how "div" and "class" are ignored.',
        lang: 'js',
        code: `const variants = { md: (rule) => '@media (min-width:48rem){' + rule + '}' }

function compile(c) {
  const parts = c.split(':'), util = parts.pop(), vs = parts
  const [root, ...rest] = util.split('-'), value = rest.join('-')
  const fn = utilities[root]
  if (!fn) return null
  let rule = '.' + c.replace(':', '\\\\:') + '{' + fn(value) + '}'
  for (const v of vs.reverse()) rule = variants[v] ? variants[v](rule) : null
  return rule
}

console.log(candidates.map(compile).filter(Boolean).join('\\n'))`,
      },
      {
        title: 'Read the output',
        body: 'Five rules for five real utilities, nothing for the two false candidates. Add a `hover` variant that wraps the selector in `:hover` and you have stacked variants.',
        lang: 'css',
        code: `.flex{display:flex}
.gap-3{gap:0.75rem}
.p-4{padding:1rem}
@media (min-width:48rem){.md\\:p-6{padding:1.5rem}}
.text-bone{color:var(--color-bone)}`,
      },
    ],
  },

  inTheWild: [
    { who: 'OpenAI', what: 'The ChatGPT web interface is styled with Tailwind, one of the most-visited utility-first UIs in existence.' },
    { who: 'Shopify', what: 'Uses Tailwind across marketing and merchant-facing surfaces, and Hydrogen storefronts ship with it.' },
    { who: 'GitHub Copilot and Vercel marketing sites', what: 'Large marketing sites that need consistency across many designers lean on the shared scale.' },
    { who: 'shadcn/ui', what: 'The most popular React component collection is plain Tailwind classes you copy into your project.' },
    { who: 'Laravel', what: 'The PHP framework\'s starter kits, documentation and ecosystem adopted Tailwind early; the two communities overlap heavily.' },
    { who: 'This app', what: 'Layout, spacing and responsive behaviour on every page; theme colours flow through @theme variables that the nine themes override.' },
  ],

  alternatives: [
    { name: 'CSS Modules', pick: 'When you prefer writing real CSS with local scope and no build-time vocabulary. Vite supports them out of the box with .module.css.' },
    { name: 'Styled-components / Emotion', pick: 'When styles genuinely depend on JavaScript values at runtime. Costs runtime CSS generation and bundle size.' },
    { name: 'UnoCSS', pick: 'The same utility idea with a pluggable engine and a smaller core, popular in the Vue ecosystem.' },
    { name: 'Plain CSS with custom properties', pick: 'A small site or a design-heavy piece where every element is bespoke. This app mixes both: utilities for layout, hand CSS for the visual language.' },
    { name: 'Bootstrap', pick: 'A team that wants ready-made components with a predetermined look and does not mind sites resembling each other.' },
  ],

  glossary: [
    { term: 'Utility class', meaning: 'A class that applies one CSS property or a small fixed bundle, such as p-4 or flex.' },
    { term: 'Variant', meaning: 'A prefix such as hover:, md: or dark: that applies a utility under a condition.' },
    { term: 'Mobile-first', meaning: 'Unprefixed utilities are the base; breakpoint variants add rules for wider screens.' },
    { term: 'Arbitrary value', meaning: 'A bracketed literal such as w-[112px] used when the scale has no matching step.' },
    { term: 'Just-in-Time', meaning: 'Generating CSS only for classes found in your source files.' },
    { term: '@theme', meaning: 'The v4 directive that declares design tokens as CSS variables and generates utilities from them.' },
    { term: 'Preflight', meaning: 'Tailwind\'s base reset that normalises browser default styles.' },
    { term: 'Cascade layer', meaning: 'An @layer group whose order decides precedence before specificity.' },
    { term: 'Container query', meaning: 'A rule that responds to the size of a parent element rather than the viewport.' },
  ],

  quiz: [
    {
      question: 'Why does `className={"text-" + color}` produce no styling?',
      options: ['Tailwind forbids dynamic classes', 'The scanner reads files as text and never sees the complete class name', 'React strips concatenated strings', 'The color is not in the theme'],
      answerIndex: 1,
      explanation: 'Only complete class names present in source files get generated. Keep a map of full strings such as text-red-500 instead.',
    },
    {
      question: 'On a 1200 px screen, which padding applies with `p-2 md:p-4 lg:p-8`?',
      options: ['p-2', 'p-4', 'p-8', 'All three, last wins in source order'],
      answerIndex: 2,
      explanation: 'Utilities are mobile-first. lg (64rem, 1024 px) is the largest matching breakpoint and Tailwind sorts larger breakpoints later so it wins.',
    },
    {
      question: 'What does declaring `--color-bone: #dfe7e0` inside @theme give you?',
      options: ['Only a CSS variable', 'Only utility classes', 'Both a CSS variable and utilities such as text-bone and bg-bone', 'A Sass variable'],
      answerIndex: 2,
      explanation: 'v4 theme tokens are real custom properties and also feed the utility generator, which is why hand-written CSS and utilities can share the same values.',
    },
    {
      question: 'Your hand-written `.card { padding: 2rem }` beats `p-4` on the same element even though both have one class of specificity. Why?',
      options: ['Hand-written CSS is always loaded last', 'Tailwind utilities live in a cascade layer, and unlayered styles beat all layered ones', 'p-4 is lower specificity', 'It is a bug'],
      answerIndex: 1,
      explanation: 'Layers are resolved before specificity. Unlayered author styles outrank anything inside @layer, so your CSS wins by design.',
    },
    {
      question: 'Which variant makes a card lay itself out by the width of its parent rather than the screen?',
      options: ['md:', 'group-hover:', '@sm: with @container on the parent', 'dark:'],
      answerIndex: 2,
      explanation: 'Container query variants respond to the nearest @container ancestor, which is what a reusable component needs.',
    },
  ],
}
