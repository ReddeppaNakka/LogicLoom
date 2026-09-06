import type { TechDeep } from '../stack-types'

export const cssArchDeep: TechDeep = {
  analogy:
    'A theatre with one set and nine lighting plots. The furniture never moves between shows; the lighting desk changes which colours fall on it, and the whole stage reads as a different place. CSS custom properties are the lighting desk. Every surface in this app is painted with a variable, and a theme is nothing more than a new set of values on the desk.',

  origins: `This entry is about the platform itself rather than a library, because the visual system of this app is built from four CSS features that arrived between 2016 and 2023 and together changed how front-end styling is organised.

**Custom properties** (CSS Variables) were standardised in 2015 and shipped in every major browser by 2016. Unlike Sass variables, which are replaced at build time, they live in the cascade and can be changed at runtime by any rule, which made real theming possible without a rebuild.

**\`prefers-color-scheme\`** (2019) let a page ask the operating system whether the user wants dark mode. **\`color-mix()\`** (2023) let a stylesheet blend two colours, so a translucent accent no longer needed a separately stored RGB triplet. **Cascade layers** (\`@layer\`, 2022) finally gave authors control over precedence without specificity hacks. **Container queries** (2022 to 2023) let a component respond to the size of its box instead of the viewport.

The architecture pattern that emerged from these, usually called **design tokens**, was formalised by Salesforce's Lightning team around 2014 and adopted by GitHub's Primer, Shopify's Polaris and Adobe's Spectrum: named values for colour, spacing and type, stored once and referenced everywhere. Here the tokens are CSS custom properties, the themes are attribute selectors that overwrite them, and both Tailwind utilities and hand-written rules read the same variables.`,

  concepts: [
    {
      title: 'Custom properties are live values in the cascade',
      body: `A custom property is declared like any other property with a \`--\` prefix and read with \`var()\`. It inherits, so a value set on \`:root\` is visible everywhere below, and a value set on a component overrides it for that subtree only. Change the property with JavaScript, a media query or a different selector, and every \`var()\` that reads it updates immediately. That is the property that build-time variables lack, and it is what a theme switcher depends on.`,
      lang: 'css',
      code: `:root { --accent: #4da3ff; --radius: 14px; }

.btn { background: var(--accent); border-radius: var(--radius); }

/* override for one subtree */
.danger-zone { --accent: #ff5a5a; }
.danger-zone .btn { /* already red, no rule needed */ }

/* a fallback if the variable is unset */
.chip { color: var(--chip-color, var(--accent)); }`,
    },
    {
      title: 'Themes as attribute selectors',
      body: `A theme is a block that sets the same variables to different values under a selector, here \`[data-theme="paper"]\` on the root element. Switching theme is one attribute change on \`<html>\`. Nothing else in the stylesheet knows a theme exists, because every colour is written as a variable read. This is the entire mechanism behind the nine themes: nine blocks, one attribute.`,
      lang: 'css',
      code: `:root, :root[data-theme="shadow"] {
  --bg-rgb: 5 7 10;   --fg-rgb: 223 231 224;   --accent-rgb: 77 163 255;
}
:root[data-theme="paper"] {
  --bg-rgb: 247 243 236;  --fg-rgb: 34 30 26;  --accent-rgb: 178 78 42;
}

/* one component, every theme */
.panel { background: rgb(var(--bg-rgb)); color: rgb(var(--fg-rgb)); }`,
      },
    {
      title: 'RGB triplets and the slash alpha',
      body: `A recurring need is "the accent colour at 12% opacity". If the token is a finished colour like \`#4da3ff\`, you cannot add alpha to it in older CSS. Storing the token as bare channels, \`77 163 255\`, lets you write \`rgb(var(--accent-rgb) / 0.12)\` for any opacity. \`color-mix()\` is the modern alternative that works with any colour format: \`color-mix(in srgb, var(--accent) 12%, transparent)\`. This app uses both: triplets for the core palette, \`color-mix\` where a finished colour is mixed with another.`,
      lang: 'css',
      code: `.tile:hover { border-color: rgb(var(--accent-rgb) / 0.45); }
.tile::before { background: radial-gradient(circle, rgb(var(--accent-rgb) / 0.16), transparent 60%); }

/* the same idea with a finished colour */
.chip-gold { border-color: color-mix(in srgb, var(--gold) 45%, transparent); }`,
    },
    {
      title: 'System preference and user choice',
      body: `\`@media (prefers-color-scheme: dark)\` reports the operating system setting. A well-behaved app respects it by default and lets the user override it. The pattern is: define the light palette on bare \`:root\`, redefine tokens for dark inside the media query guarded with \`:root:not([data-theme="light"])\`, and redefine again under \`:root[data-theme="dark"]\` so an explicit choice wins in both directions. \`color-scheme: dark\` on the root also tells the browser to render scrollbars and form controls in dark style.`,
      lang: 'css',
      code: `:root { --bg: #fff; --fg: #111; color-scheme: light; }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #0b0d10; --fg: #e6e6e6; color-scheme: dark; }
}
:root[data-theme="dark"] { --bg: #0b0d10; --fg: #e6e6e6; color-scheme: dark; }`,
    },
    {
      title: 'Cascade layers decide precedence',
      body: `Before layers, when two rules matched the same element, the more specific selector won, and authors fought that with ever-longer selectors or \`!important\`. \`@layer\` lets you declare an order of groups; a rule in a later layer beats any rule in an earlier layer regardless of specificity. Unlayered rules beat all layers. Tailwind v4 puts its output in layers, which is why a plain hand-written class in this app overrides a utility with no fuss.`,
      lang: 'css',
      code: `@layer reset, base, components, utilities;

@layer utilities  { .p-4 { padding: 1rem } }
@layer components { .card.card.card { padding: 2rem } }   /* very specific */

/* utilities wins: layer order beats specificity */
.card.p-4 { /* padding is 1rem */ }`,
    },
    {
      title: 'Container queries',
      body: `Mark an element with \`container-type: inline-size\` and its descendants can use \`@container (min-width: 400px)\` rules that respond to that element's width. A card in a narrow sidebar and the same card in a wide grid style themselves correctly with no knowledge of the page. Container query units (\`cqw\`, \`cqi\`) size text as a fraction of the container. This is the correct tool for reusable components; media queries remain right for page-level layout.`,
      lang: 'css',
      code: `.tile { container-type: inline-size; }

.tile .title { font-size: 19px; }
@container (min-width: 300px) { .tile .title { font-size: 26px; } }
@container (min-width: 420px) { .tile .title { font-size: 34px; } }

/* the tile is the reference, wherever the tile is placed */`,
    },
    {
      title: 'Fluid type and spacing with clamp()',
      body: `\`clamp(min, preferred, max)\` gives a value that scales with the viewport between two bounds. A display heading written as \`clamp(96px, 16vw, 200px)\` is 96 pixels on a phone, 200 on a wide monitor, and proportional in between, with no breakpoints. Combined with \`min()\` and \`max()\` it replaces most typographic media queries.`,
      lang: 'css',
      code: `.hero-num { font-size: clamp(96px, 16vw, 200px); line-height: 0.85; }
.reading  { max-width: min(68ch, 100% - 2rem); }
.section  { padding-block: clamp(2rem, 6vw, 5rem); }`,
    },
    {
      title: 'Layering the visual language: pseudo-elements, masks and blend',
      body: `Much of what makes a UI feel finished is ambient: a cursor-following glow, a soft mask at a ticker's edges, a texture behind a panel. \`::before\`/\`::after\` give every element two free layers for these without extra markup. \`mask-image\` with a gradient fades content out at an edge. \`mix-blend-mode\` and \`backdrop-filter: blur()\` produce the frosted-glass panels used for the spotlight overlay. All are GPU-friendly when kept to transforms, opacity and filters.`,
      lang: 'css',
      code: `.tile { position: relative; overflow: hidden; }
.tile::before {
  content: ""; position: absolute; inset: 0; opacity: 0; pointer-events: none;
  background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%),
              rgb(var(--accent-rgb) / 0.16), transparent 60%);
  transition: opacity 400ms;
}
.tile:hover::before { opacity: 1; }

.ticker { mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.overlay { background: rgb(var(--bg-rgb) / 0.82); backdrop-filter: blur(18px); }`,
    },
  ],

  visual: {
    title: 'What a theme switch actually changes',
    intro: 'The user picks Paper from the appearance page. Follow the single attribute write through the cascade to the pixels.',
    frames: [
      {
        caption: 'Before. The root has no theme attribute, so the default block applies and every var() resolves to the Shadow palette.',
        frame: `  <html>                     computed on :root
    --bg-rgb ....... 5 7 10
    --fg-rgb ....... 223 231 224
    --accent-rgb ... 77 163 255

  .panel { background: rgb(var(--bg-rgb)) }
                    -> rgb(5 7 10)     near black`,
      },
      {
        caption: 'The store updates and a useEffect writes one attribute. That is the entire JavaScript involved.',
        frame: `  setTheme('paper')
      │
      v
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  <html data-theme="paper">`,
      },
      {
        caption: 'The browser re-matches selectors. The Paper block now matches the root and its declarations override the defaults.',
        frame: `  :root                        (matches, base values)
  :root[data-theme="paper"]    (matches, more specific)

  computed on :root
    --bg-rgb ....... 247 243 236   (overridden)
    --fg-rgb ....... 34 30 26      (overridden)
    --accent-rgb ... 178 78 42     (overridden)`,
      },
      {
        caption: 'Every element that reads a variable is restyled. The rules themselves did not change; only the values they read did.',
        frame: `  .panel  background: rgb(var(--bg-rgb))
                       -> rgb(247 243 236)     warm white
  .btn    border: 1px solid rgb(var(--accent-rgb) / 0.45)
                       -> rgb(178 78 42 / 0.45)
  .text   color: rgb(var(--fg-rgb))
                       -> rgb(34 30 26)

  rules rewritten: 0     elements restyled: all`,
      },
      {
        caption: 'Because tokens are inherited, a component can still override for its own subtree. The theme sets the stage; a component can adjust its corner.',
        frame: `  <div class="danger" style="--accent-rgb: 255 90 90">
    <button class="btn">   border reads 255 90 90
  </div>

  inheritance:
    :root  ->  body  ->  main  ->  .danger (override)  ->  .btn`,
      },
    ],
  },

  internals: `## How the browser resolves a variable

Custom properties go through the cascade like any other property: the winning declaration for \`--accent-rgb\` on an element is found by origin, layer, specificity and order, and if none matches, the value is inherited from the parent. Only after that does \`var()\` substitution happen, during computed-value time, per element. The substituted text is then parsed as the property's value. If it fails to parse, the property becomes "invalid at computed-value time" and falls back to its initial or inherited value, not to the previous declaration. That is why a typo in a variable silently produces \`transparent\` or \`initial\` rather than a red squiggle.

Because substitution happens per element, a variable can hold something that is not a valid value on its own, like the bare triplet \`77 163 255\`, as long as the place it is used makes it valid.

## Style invalidation

When \`data-theme\` changes on the root, the engine invalidates the style of the root and, since the tokens inherit, of every descendant. That sounds expensive, but recomputing style for a few thousand elements is typically a few milliseconds; the cost is dominated by any layout that follows. Theming through variables changes only paint-affecting values (colours, shadows), so there is usually no layout at all, and the switch is instant.

## The cascade order, in full

For each declaration the engine considers, in order: transition declarations, then \`!important\` user-agent, \`!important\` user, \`!important\` author, animation declarations, normal author, normal user, normal user-agent. Within the author origin, cascade layers are compared before specificity: later-declared layers win for normal declarations, and the order flips for \`!important\`. Unlayered styles count as a final, highest layer. Only when origin and layer tie does specificity decide, and only when specificity ties does source order decide. Tailwind places utilities in a layer; your plain CSS is unlayered; so plain CSS wins, and the \`!\` prefix exists for the exceptions.

## Container queries

An element with \`container-type: inline-size\` establishes size containment on the inline axis: its width is decided without looking at its contents, so the engine can lay out the container first and then evaluate \`@container\` rules for descendants against that width. This is why the container's own styles cannot depend on its own container query, and why the tile cannot query itself; a wrapper does.

## Why transforms, opacity and filters are cheap

The rendering pipeline is style, layout, paint, composite. Changing \`width\` triggers layout for that element and possibly its neighbours, then paint, then composite. Changing \`transform\` or \`opacity\` on an element that has its own compositor layer skips layout and paint; the compositor moves an already-painted texture. \`backdrop-filter\` and \`mask-image\` also run in the compositor when the element is promoted. That is the basis of the rule: animate transforms and opacity, avoid animating geometry.

## Where this app keeps things

Tokens and themes live in \`global.css\`, with the Tailwind \`@theme\` block reading the same variables so utilities and hand-written rules never disagree. Background textures live in a separate stylesheet keyed by a second attribute, so background and palette are independent choices. Reading pages add a calm class that swaps the background variable for a flat one. Everything that moves is behind a \`motion-still\` class and a \`prefers-reduced-motion\` query, both of which set \`animation: none\`.`,

  buildIt: {
    title: 'A two-theme, one-attribute system',
    intro: 'Build the pattern from nothing in one HTML file: tokens on the root, a theme block, a component that reads only variables, and a toggle that writes one attribute and remembers it.',
    steps: [
      {
        title: 'Declare tokens and a second theme',
        body: 'Store colours as channels so alpha is available. The dark block only overrides tokens; it has no component rules.',
        lang: 'css',
        code: `:root {
  --bg-rgb: 250 250 249;  --fg-rgb: 20 20 22;  --accent-rgb: 40 90 220;
  --radius: 14px; color-scheme: light;
}
:root[data-theme="dark"] {
  --bg-rgb: 10 12 16;     --fg-rgb: 226 230 235; --accent-rgb: 110 170 255;
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-rgb: 10 12 16;   --fg-rgb: 226 230 235; --accent-rgb: 110 170 255;
    color-scheme: dark;
  }
}`,
      },
      {
        title: 'A component that knows no theme',
        body: 'Every colour is a var() read. The hover glow uses alpha on the accent channels.',
        lang: 'css',
        code: `body { margin: 0; background: rgb(var(--bg-rgb)); color: rgb(var(--fg-rgb)); font: 15px/1.6 system-ui; }
.card {
  padding: 20px; border-radius: var(--radius);
  border: 1px solid rgb(var(--fg-rgb) / 0.12);
  background: rgb(var(--fg-rgb) / 0.03);
  transition: border-color 300ms, box-shadow 300ms;
}
.card:hover { border-color: rgb(var(--accent-rgb) / 0.5); box-shadow: 0 20px 50px -30px rgb(var(--accent-rgb) / 0.6); }
.btn { background: rgb(var(--accent-rgb)); color: rgb(var(--bg-rgb)); border: 0; border-radius: 999px; padding: 8px 14px; }`,
      },
      {
        title: 'The toggle',
        body: 'Read the saved choice on load, write one attribute on click, save it. Do the initial read in a blocking script in the head to avoid a flash of the wrong theme.',
        lang: 'html',
        code: `<script>
  // in <head>, before any paint
  const saved = localStorage.getItem('theme')
  if (saved) document.documentElement.dataset.theme = saved
</script>

<div class="card"><button class="btn" id="t">Toggle theme</button></div>
<script>
  document.getElementById('t').onclick = () => {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next
    localStorage.setItem('theme', next)
  }
</script>`,
      },
      {
        title: 'Add a third theme without touching components',
        body: 'This is the test of the architecture. If a new theme is only a block of token values, the system is right.',
        lang: 'css',
        code: `:root[data-theme="paper"] {
  --bg-rgb: 247 243 236;  --fg-rgb: 34 30 26;  --accent-rgb: 178 78 42;
  color-scheme: light;
}
/* nothing else changes */`,
      },
    ],
  },

  inTheWild: [
    { who: 'GitHub Primer', what: 'Publishes its entire design system as CSS custom properties; dark, light, colour-blind and high-contrast modes are token sets.' },
    { who: 'Shopify Polaris and Adobe Spectrum', what: 'Design tokens as the contract between designers and engineers, exported to CSS variables and native platforms.' },
    { who: 'Stripe', what: 'Known for a documentation site whose theming and code samples are driven by variables and system colour-scheme detection.' },
    { who: 'Tailwind v4 itself', what: 'Built its configuration on custom properties and cascade layers, proof the platform features are ready.' },
    { who: 'This app', what: 'Nine palettes, seventeen backgrounds, a calm reading mode and reduced-motion support, all from attribute-driven tokens.' },
  ],

  alternatives: [
    { name: 'Sass variables and mixins', pick: 'A build-time system where themes are compiled into separate stylesheets. Less flexible at runtime; still common in older codebases.' },
    { name: 'CSS-in-JS theming (styled-components ThemeProvider)', pick: 'When theme values must be read in JavaScript for logic, not only in styles. Costs runtime.' },
    { name: 'Separate theme stylesheets', pick: 'Very simple sites with two looks and no shared components, where swapping a <link> is enough.' },
    { name: 'Design token pipelines (Style Dictionary)', pick: 'Multi-platform products that need the same tokens in CSS, iOS and Android, generated from one JSON source.' },
  ],

  glossary: [
    { term: 'Custom property', meaning: 'A CSS variable declared with a -- prefix and read with var().' },
    { term: 'Design token', meaning: 'A named design value (colour, spacing, type) stored once and referenced everywhere.' },
    { term: 'Cascade', meaning: 'The algorithm deciding which declaration wins: origin, layer, specificity, order.' },
    { term: 'Specificity', meaning: 'The weight of a selector: ids beat classes beat elements.' },
    { term: 'Cascade layer', meaning: 'An @layer group; later layers win over earlier ones before specificity is considered.' },
    { term: 'Inheritance', meaning: 'A property value passing from parent to child when not set on the child.' },
    { term: 'color-mix()', meaning: 'A function blending two colours in a chosen colour space.' },
    { term: 'Container query', meaning: 'A rule that depends on an ancestor container\'s size rather than the viewport.' },
    { term: 'clamp()', meaning: 'A value bounded between a minimum and maximum, fluid in between.' },
    { term: 'Compositor', meaning: 'The stage that combines painted layers; transforms and opacity animate there cheaply.' },
  ],

  quiz: [
    {
      question: 'Why does this app store colours as `--accent-rgb: 77 163 255` instead of `--accent: #4da3ff`?',
      options: ['Shorter to type', 'So the same token can be used at any opacity with rgb(var(--accent-rgb) / a)', 'Hex is not allowed in variables', 'For Sass compatibility'],
      answerIndex: 1,
      explanation: 'Bare channels can be dropped into rgb() with a slash alpha. color-mix() is the modern alternative that works with finished colours.',
    },
    {
      question: 'A variable is set to an invalid value for the property that reads it. What happens?',
      options: ['The previous declaration in the cascade is used', 'The property becomes invalid at computed-value time and falls back to initial or inherited', 'The browser shows an error', 'The rule is ignored entirely'],
      answerIndex: 1,
      explanation: 'var() substitution happens after the cascade, so there is no earlier declaration to fall back to. The result is usually transparent or initial.',
    },
    {
      question: 'Two rules match: `.card.card.card { padding: 2rem }` in @layer components and `.p-4 { padding: 1rem }` in @layer utilities declared later. Which wins?',
      options: ['.card.card.card, higher specificity', '.p-4, because layer order is compared before specificity', 'Whichever appears last in the file', 'Neither; it is a conflict'],
      answerIndex: 1,
      explanation: 'Cascade layers resolve before specificity. The later layer wins regardless of selector weight.',
    },
    {
      question: 'Which query lets a card change its title size based on the width of the card itself?',
      options: ['@media (min-width)', '@container (min-width) with container-type on the card', '@supports', ':has()'],
      answerIndex: 1,
      explanation: 'Media queries measure the viewport. Container queries measure an ancestor marked as a container.',
    },
    {
      question: 'Why is animating transform smoother than animating width?',
      options: ['Transforms are simpler maths', 'Transform skips layout and paint and can run on the compositor thread', 'Width is not animatable', 'The browser caches transforms'],
      answerIndex: 1,
      explanation: 'Width changes force layout of the element and neighbours, then repaint. A transform moves an already-painted layer.',
    },
  ],
}
