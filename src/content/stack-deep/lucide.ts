import type { TechDeep } from '../stack-types'

export const lucideDeep: TechDeep = {
  analogy:
    'A set of road signs designed by one person with one ruler. Every sign is the same size, drawn with the same pen, and reads instantly at a glance because it follows the rules of every other sign. You never draw a stop sign yourself; you pick it from the set, and it matches the ones already on the road. Lucide is that set, and each icon is a small SVG you pull in by name.',

  origins: `Lucide is a community fork of **Feather Icons**, the minimalist set that Cole Bemis began in 2013 and that became the default look of a generation of admin panels and dashboards. By 2020 Feather had stopped merging contributions, and a group of maintainers forked it as Lucide to keep the set growing under the same ISC licence.

The design language is Feather's: a **24 by 24 grid**, a **2-pixel stroke**, round line caps and joins, no fills, and consistent optical padding so icons sit evenly next to text. What Lucide added was scale and packaging. The set has grown past 1,500 icons, each drawn to the same rules, and ships first-party packages for React, Vue, Svelte, Solid, Angular and vanilla JavaScript, all generated from one source of SVG files.

The React package, \`lucide-react\`, exports each icon as a component. Because every icon is its own named export, a bundler keeps only the ones you import; an app that uses forty icons ships forty small SVG definitions and nothing else. That tree-shakeability, along with the fact that the icons are inline SVG rather than an icon font, is why the set became the default for Tailwind-era component kits such as shadcn/ui.`,

  concepts: [
    {
      title: 'An icon is an inline SVG component',
      body: `Importing \`Layers\` from \`lucide-react\` gives you a component that renders an \`<svg>\` with the icon's paths. Inline SVG means the icon is part of the DOM: it scales without blur, it inherits CSS colour through \`currentColor\`, it can be styled with classes and animated, and it renders instantly with no font download and no flash of missing glyphs. An icon font could do none of the first three reliably.`,
      lang: 'tsx',
      code: `import { Layers, Flame, Check } from 'lucide-react'

<Layers />                       // 24px, stroke 2, colour = currentColor
<Flame size={14} className="text-ember" />
<Check size={12} strokeWidth={3} />

// What renders (abridged):
// <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
//      stroke="currentColor" stroke-width="2" stroke-linecap="round">
//   <path d="..."/> ...
// </svg>`,
    },
    {
      title: 'currentColor: icons take the text colour',
      body: `Every Lucide icon sets \`stroke="currentColor"\`, the SVG keyword meaning "whatever the CSS \`color\` is here". So an icon inside a muted label is muted, inside a red error is red, and on hover it changes with the text with no icon-specific rule. Set \`color\` on the parent or a class on the icon; never hardcode a stroke.`,
      lang: 'tsx',
      code: `<button className="text-muted hover:text-bone">
  <Settings size={16} />   {/* follows the button's text colour, including hover */}
  Settings
</button>

<span style={{ color: 'var(--good)' }}><Check size={14} /> Done</span>`,
    },
    {
      title: 'Sizing, stroke and optical alignment',
      body: `The \`size\` prop sets width and height together; the stroke does not scale with it, so a 12-pixel icon at stroke 2 looks heavy and a 32-pixel one looks thin. Adjust \`strokeWidth\` in proportion, or use the \`absoluteStrokeWidth\` prop to keep the stroke a fixed pixel width. Icons are drawn with about 2 pixels of padding inside the 24-grid so they align optically with text of a similar cap height; at 16 pixels beside 14-pixel text they look right without nudging.`,
      lang: 'tsx',
      code: `<Check size={12} strokeWidth={2.5} />       // small: thicker stroke reads better
<Layers size={32} strokeWidth={1.5} />      // large: thinner stroke stays elegant
<Flame size={48} absoluteStrokeWidth />     // stroke stays 2px regardless of size

// Sit an icon on the text baseline
<span className="inline-flex items-center gap-1.5"><Clock size={14} /> 25 min</span>`,
    },
    {
      title: 'Tree-shaking: pay only for what you import',
      body: `The package is built as ES modules with one export per icon and no side effects, so Rollup drops every icon you did not import. Importing \`{ Layers }\` costs a few hundred bytes. Importing the whole namespace, \`import * as Icons\` and indexing by string, defeats this and pulls in over a megabyte. When you genuinely need icons by name, build a small map of the ones you use.`,
      lang: 'tsx',
      code: `// Good: three icons, three tiny modules in the bundle
import { Layers, Flame, Check } from 'lucide-react'

// Bad: keeps every icon alive because the name is decided at runtime
import * as Icons from 'lucide-react'
const Icon = Icons[name]

// Right way to look up by name
const ICONS = { layers: Layers, flame: Flame, check: Check } as const
const Icon = ICONS[name as keyof typeof ICONS]`,
    },
    {
      title: 'Accessibility: decorative or meaningful',
      body: `An icon next to a text label is decorative; screen readers should skip it. Lucide renders \`aria-hidden="true"\` by default for this reason. An icon that stands alone, such as a close button with only an X, is meaningful and needs a name: put \`aria-label\` on the button, not the icon. Never rely on colour or icon alone to convey state; pair it with text or a label.`,
      lang: 'tsx',
      code: `// Decorative: label carries the meaning, icon is hidden from AT by default
<button><Save size={14} /> Save</button>

// Standalone: name the control, not the picture
<button aria-label="Close"><X size={14} /></button>

// State with more than colour
<span className="text-jade"><Check size={12} /> Completed</span>`,
    },
    {
      title: 'Styling and animating SVG',
      body: `Because the icon is DOM, CSS applies. Rotate a chevron when a section opens, spin a loader, draw a path in with \`stroke-dasharray\`, or recolour one sub-path with a class through the \`className\` prop. Keep animations on \`transform\` and \`opacity\` for smoothness, and gate loops behind the reduced-motion setting.`,
      lang: 'tsx',
      code: `<ChevronRight size={14} className={cx('transition-transform', open && 'rotate-90')} />

<Loader2 size={16} className="animate-spin motion-reduce:animate-none" />

/* draw-in effect on any stroked icon */
.draw path { stroke-dasharray: 60; stroke-dashoffset: 60; animation: draw 800ms forwards }
@keyframes draw { to { stroke-dashoffset: 0 } }`,
    },
  ],

  visual: {
    title: 'From import to pixels',
    intro: 'Follow one icon from the import statement through the bundle to the screen, and see why it is small, sharp and the right colour.',
    frames: [
      {
        caption: 'The source. One named import, used at a small size in a muted button.',
        frame: `  src/components/Shell.tsx
  ┌──────────────────────────────────────────────┐
  │ import { Layers } from 'lucide-react'        │
  │                                              │
  │ <button className="text-muted">              │
  │   <Layers size={16} /> Under the hood        │
  │ </button>                                    │
  └──────────────────────────────────────────────┘`,
      },
      {
        caption: 'Rollup follows the import to one small module. The other 1,500 icons are never referenced and are dropped.',
        frame: `  node_modules/lucide-react/dist/esm/icons/
    layers.js        ← imported      ~420 bytes   KEPT
    flame.js         (not imported)               dropped
    check.js         (not imported)               dropped
    ... 1,500 more                                dropped

  bundle cost of this icon:  ~0.4 KB`,
      },
      {
        caption: 'At render time the component returns an inline SVG. Note stroke="currentColor" and the fixed 24-unit viewBox.',
        frame: `  <svg width="16" height="16" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true">
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08 ... Z"/>
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
  </svg>`,
      },
      {
        caption: 'The browser scales the 24-unit drawing to 16 pixels and strokes it with the inherited colour. Vector, so it is sharp at any zoom.',
        frame: `  viewBox 0 0 24 24  ->  16 x 16 px   (scale 0.667)

  color on <button>: var(--fg-muted)
        │
        └─> currentColor  ->  stroke colour

  ┌────────┐
  │  ◇     │   drawn as three stroked paths
  │ ◇◇◇    │   stroke 2 units = 1.33 px at this size
  │  ◇     │
  └────────┘`,
      },
      {
        caption: 'Hover changes the button colour; the icon follows with no extra rule because it reads currentColor live.',
        frame: `  .text-muted:hover  ->  color: var(--fg)

  button text ......... brighter
  icon stroke ......... brighter   (same property)

  rules written for the icon:  0`,
      },
    ],
  },

  internals: `## One source, many packages

The Lucide repository holds each icon as a plain SVG file plus a small JSON file of metadata: categories, tags for search, contributors. A build script parses the SVG, normalises it (strips the outer element, keeps the path data, checks the viewBox is 24 by 24 and the stroke rules are followed), and generates code for every target framework. The React package's \`layers.js\` is therefore generated text that calls a shared \`createLucideIcon('Layers', [['path', { d: '...' }], ...])\` helper with the path data.

## createLucideIcon

That helper returns a \`forwardRef\` component. On render it merges defaults (\`width\` and \`height\` from \`size\`, \`stroke="currentColor"\`, \`strokeWidth\`, the line cap and join, \`aria-hidden\`) with your props, computes the stroke width if \`absoluteStrokeWidth\` is set (scaling it by 24 divided by the size so the on-screen width stays constant), and maps the path array to \`<path>\` elements. A \`lucide\` class and a per-icon class such as \`lucide-layers\` are added for global styling. Children you pass are rendered inside the SVG, which is how you overlay a badge.

## Why ES modules with sideEffects false

The package.json declares \`"sideEffects": false\` and ships an ESM build with one file per icon, re-exported from an index. Bundlers use those two facts to drop unused exports safely: with no side effects, importing a module and using nothing from it is equivalent to not importing it. This is what makes a 1,500-icon library free to depend on.

## Design rules that keep the set coherent

Every icon is drawn on a 24-unit grid with a 2-unit stroke and 2 units of inner padding. Corners are rounded, arcs are true circles where possible, and coordinates snap to 0.5 units so strokes land on whole pixels at common sizes. Reviewers check new icons against these rules and against existing metaphors, which is why a "settings" cog in Lucide looks like it belongs beside a "calendar" from the same set even though they were drawn years apart.

## Comparison with icon fonts

Icon fonts (Font Awesome's classic mode, Material Icons font) map glyphs to characters. They require a font download, render as text so they can blur at small sizes and are affected by text rendering settings, cannot be multi-coloured, and show a flash of an empty box before the font loads. Inline SVG avoids all of that, at the cost of putting the path data in your bundle rather than a cached font file. For a few dozen icons the bundle cost is negligible.

## Dynamic icons

The package also exports a \`DynamicIcon\` that loads icons by name using dynamic import, so a CMS-driven page can render any icon without bundling all of them, and an \`icons\` map for the rare case you truly need all names. Both are opt-in so the default path stays small.`,

  buildIt: {
    title: 'Make your own icon component',
    intro: 'The whole trick is a helper that turns path data into a consistent SVG. Build it, draw one icon on the 24-grid, and it will sit beside Lucide icons without looking out of place.',
    steps: [
      {
        title: 'The helper',
        body: 'Defaults for everything Lucide sets, merged with props. Absolute stroke keeps the stroke 2 px at any size.',
        lang: 'tsx',
        code: `import { forwardRef, type SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number; absoluteStrokeWidth?: boolean }

export function createIcon(name: string, paths: string[]) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, strokeWidth = 2, absoluteStrokeWidth, ...rest }, ref) => (
      <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
        strokeWidth={absoluteStrokeWidth ? (Number(strokeWidth) * 24) / size : strokeWidth}
        aria-hidden="true" className={'icon icon-' + name} {...rest}>
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
    ),
  )
  Icon.displayName = name
  return Icon
}`,
      },
      {
        title: 'Draw a rank shield on the grid',
        body: 'Coordinates inside 2 to 22 so the 2-unit padding is respected. A shield outline and a check inside it.',
        lang: 'tsx',
        code: `export const Shield = createIcon('shield', [
  'M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6l-8-3Z',
  'm9 12 2 2 4-4',
])`,
      },
      {
        title: 'Use it beside Lucide',
        body: 'Same size, same stroke, same colour inheritance. Nobody can tell which one you drew.',
        lang: 'tsx',
        code: `import { Flame } from 'lucide-react'
import { Shield } from './icons'

<div className="flex items-center gap-2 text-system">
  <Flame size={16} />
  <Shield size={16} />
  <span>Rank up</span>
</div>`,
      },
      {
        title: 'Check it at three sizes',
        body: 'If the small one looks heavy, lower strokeWidth or use absoluteStrokeWidth. If the large one looks thin, raise it. That is the whole craft.',
        lang: 'tsx',
        code: `<Shield size={12} strokeWidth={2.5} />
<Shield size={16} />
<Shield size={40} strokeWidth={1.5} />`,
      },
    ],
  },

  inTheWild: [
    { who: 'shadcn/ui', what: 'The most-used React component kit ships Lucide as its icon set, which put Lucide in tens of thousands of apps.' },
    { who: 'Cal.com, Dub, Resend dashboards', what: 'Open-source SaaS products built on the shadcn stack inherit Lucide for every control.' },
    { who: 'Feather\'s legacy', what: 'Hundreds of admin templates and dashboards drawn in the Feather style are visually continuous with Lucide.' },
    { who: 'Vue, Svelte and Solid ecosystems', what: 'First-party packages mean the same icon names appear across frameworks in one company.' },
    { who: 'This app', what: 'Navigation, buttons, chips and section markers use about forty Lucide icons at sizes from 11 to 18 pixels.' },
  ],

  alternatives: [
    { name: 'Heroicons', pick: 'When you want solid and outline variants of each icon drawn by the Tailwind team. Smaller set, very polished.' },
    { name: 'Phosphor', pick: 'Six weights per icon (thin to duotone) and a huge catalogue, for a softer, friendlier look.' },
    { name: 'Radix Icons', pick: 'A compact 15-pixel-grid set matched to Radix primitives; good for dense UIs.' },
    { name: 'Material Symbols', pick: 'When matching Android or Google product conventions matters more than a custom feel.' },
    { name: 'Custom SVG sprite', pick: 'A brand with its own illustrated icon language. More work, fully yours.' },
  ],

  glossary: [
    { term: 'Inline SVG', meaning: 'An SVG element placed directly in the DOM rather than referenced as an image.' },
    { term: 'viewBox', meaning: 'The coordinate system of an SVG; Lucide icons use 0 0 24 24.' },
    { term: 'Stroke', meaning: 'The outline of a path; Lucide icons are stroke-only with no fills.' },
    { term: 'currentColor', meaning: 'The SVG keyword that resolves to the element\'s CSS color, so icons inherit text colour.' },
    { term: 'Tree-shaking', meaning: 'Dropping unused exports; why importing one icon does not ship all of them.' },
    { term: 'sideEffects: false', meaning: 'A package.json flag telling bundlers it is safe to drop unused modules from this package.' },
    { term: 'aria-hidden', meaning: 'An attribute hiding an element from assistive technology; the default for decorative icons.' },
    { term: 'Optical alignment', meaning: 'Padding and weight tuned so icons look aligned with text even when the maths says otherwise.' },
  ],

  quiz: [
    {
      question: 'Why do Lucide icons change colour on hover along with the button text with no icon-specific CSS?',
      options: ['They use a CSS variable', 'They are stroked with currentColor, which resolves to the inherited CSS color', 'React re-renders them', 'They are icon font glyphs'],
      answerIndex: 1,
      explanation: 'currentColor is a live reference to the element\'s color property, so any change to the text colour applies to the stroke.',
    },
    {
      question: '`import * as Icons from "lucide-react"` and rendering `Icons[name]` makes the bundle huge. Why?',
      options: ['The namespace import is slower', 'The bundler cannot tell which icons are used when the name is chosen at runtime, so it keeps all of them', 'Lucide forbids namespace imports', 'It loads the icons twice'],
      answerIndex: 1,
      explanation: 'Tree-shaking depends on static analysis of named imports. A dynamic lookup forces every export to stay. Build a map of the icons you use instead.',
    },
    {
      question: 'A close button contains only an X icon. What makes it accessible?',
      options: ['A title attribute on the svg', 'aria-label on the button; the icon stays aria-hidden', 'Removing aria-hidden from the icon', 'Adding alt text to the path'],
      answerIndex: 1,
      explanation: 'The control needs the name, not the picture. Screen readers announce the button label and skip the decorative SVG.',
    },
    {
      question: 'A 12-pixel Lucide icon looks too heavy next to small text. What is the right fix?',
      options: ['Use a different icon set', 'Lower strokeWidth (or use absoluteStrokeWidth) since stroke does not scale with size', 'Increase size', 'Add padding'],
      answerIndex: 1,
      explanation: 'The 2-unit stroke is designed for 24 px. At small sizes it needs reducing in proportion to keep the visual weight balanced.',
    },
    {
      question: 'What advantage does inline SVG have over an icon font?',
      options: ['Smaller download always', 'No font load, sharp at any size, styleable with CSS and multi-colour capable', 'Works without JavaScript', 'Supports more icons'],
      answerIndex: 1,
      explanation: 'Fonts blur at small sizes, flash before loading and are single-colour. Inline SVG is part of the DOM and behaves like any element.',
    },
  ],
}
