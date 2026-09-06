import type { TechDeep } from '../stack-types'

export const rechartsDeep: TechDeep = {
  analogy:
    'Building a chart in raw SVG is like drawing a bar chart by hand with a ruler: you measure the tallest value, work out a scale, and draw every bar and tick yourself. Recharts is graph paper with the axes pre-printed. You hand it the numbers and say "bars, please", and it does the measuring. Because the graph paper is made of React components, you can still write on it anywhere you like.',

  origins: `Recharts was started in **2015** by a small team at Alibaba, with the goal of making D3-quality charts feel like ordinary React components. Version 1.0 arrived in 2018 and **version 3**, used here, in 2025 with a rewrite of the internal state on a Redux store and first-class support for React 19.

The problem was a mismatch of philosophies. **D3**, the dominant data-visualisation library, works by binding data to DOM nodes and mutating them directly, which is exactly what React forbids. Teams either fought React to let D3 own a subtree, or hand-wrote SVG with D3's maths helpers. Recharts took the second route and packaged it: it uses D3's scale, shape and interpolation modules for the calculations, and lets React own every element in the SVG.

The result is a declarative API where a chart is a tree: \`<LineChart>\` contains \`<XAxis>\`, \`<YAxis>\`, \`<Tooltip>\` and one \`<Line>\` per series. Add a component, get a feature. It became one of the most-used charting libraries in the React world and, from 2024, the engine behind shadcn/ui's chart components.`,

  concepts: [
    {
      title: 'Data in, components out',
      body: `A chart takes an array of plain objects and a \`dataKey\` per visual element saying which field to read. Nothing needs transforming into a special format. The chart computes the domain (min and max), the scales (data value to pixel), and lays out the axes; each \`<Line>\`, \`<Bar>\` or \`<Area>\` draws one series from its key.`,
      lang: 'tsx',
      code: `import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', minutes: 90 }, { day: 'Tue', minutes: 60 },
  { day: 'Wed', minutes: 95 }, { day: 'Thu', minutes: 0 },
  { day: 'Fri', minutes: 80 }, { day: 'Sat', minutes: 120 },
]

<ResponsiveContainer width="100%" height={220}>
  <LineChart data={data}>
    <XAxis dataKey="day" />
    <YAxis />
    <Tooltip />
    <Line dataKey="minutes" stroke="var(--accent)" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>`,
    },
    {
      title: 'Scales: from data space to pixel space',
      body: `A **scale** is a function from a data value to a pixel position. A linear scale maps 0 to 120 minutes onto 200 to 0 pixels (SVG y grows downward, so the axis is flipped). A band scale gives each category a slot of equal width for bars. Recharts builds these from D3's \`d3-scale\` and passes the results to the shapes. Understanding scales explains most layout questions: why the y-axis starts where it does (\`domain\`), why bars have gaps (\`padding\` on the band scale), and why a log axis compresses large values.`,
      lang: 'tsx',
      code: `// Control the y domain: start at 0 and leave headroom above the max
<YAxis domain={[0, (max: number) => Math.ceil(max * 1.1)]} />

// Fixed ticks
<YAxis ticks={[0, 30, 60, 90, 120]} />

// Under the hood (d3-scale):
// const y = scaleLinear().domain([0, 120]).range([200, 0])
// y(90)  ->  50   (pixels from the top)`,
    },
    {
      title: 'Composition: every feature is a child',
      body: `Recharts charts are containers that inspect their children. Put a \`<CartesianGrid>\` inside and a grid appears. Add a second \`<Line>\` with another \`dataKey\` and a second series is drawn against the same scales. \`<ReferenceLine y={60}>\` marks a goal. \`<Legend>\` reads the series names. Nothing is configured through a giant options object; the tree is the configuration, so conditional features are just conditional JSX.`,
      lang: 'tsx',
      code: `<BarChart data={weekly}>
  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--fg-rgb) / 0.08)" />
  <XAxis dataKey="week" />
  <YAxis />
  <ReferenceLine y={goal} stroke="var(--gold)" strokeDasharray="4 4" label="goal" />
  <Bar dataKey="solved" fill="var(--accent)" radius={[6, 6, 0, 0]} />
  <Bar dataKey="reviewed" fill="var(--violet)" radius={[6, 6, 0, 0]} />
  {showLegend && <Legend />}
</BarChart>`,
    },
    {
      title: 'Radar and polar charts',
      body: `Not everything is Cartesian. A radar chart maps several dimensions onto spokes from a centre and connects the values into a polygon, which is the classic "character stats" shape. Recharts has a polar system with \`<PolarGrid>\`, \`<PolarAngleAxis>\` for the spoke labels and \`<PolarRadiusAxis>\` for the scale. The skill radar on this app's Status page is exactly this: one \`<Radar>\` per dataset over six gate names.`,
      lang: 'tsx',
      code: `const stats = [
  { skill: 'Arrays', score: 80 }, { skill: 'Strings', score: 65 },
  { skill: 'Hashing', score: 70 }, { skill: 'Trees', score: 40 },
  { skill: 'Graphs', score: 25 }, { skill: 'DP', score: 15 },
]

<RadarChart data={stats} outerRadius="75%">
  <PolarGrid stroke="rgb(var(--fg-rgb) / 0.12)" />
  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
  <Radar dataKey="score" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} />
</RadarChart>`,
    },
    {
      title: 'Responsive sizing',
      body: `SVG needs a fixed width and height in pixels. \`<ResponsiveContainer>\` measures its parent with a ResizeObserver and passes the size down, so the chart fills whatever box it is in and redraws on resize. The parent must have a real height; a container inside an element with no height renders nothing, which is the most common Recharts support question.`,
      lang: 'tsx',
      code: `// Parent supplies the height; the chart fills it
<div className="h-[240px]">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>...</AreaChart>
  </ResponsiveContainer>
</div>

// Or a fixed height on the container itself
<ResponsiveContainer width="100%" height={240}>`,
    },
    {
      title: 'Tooltips, custom shapes and theming',
      body: `\`<Tooltip>\` tracks the pointer, finds the nearest data point and renders a box. Pass a component to \`content\` to draw your own, receiving the active payload. Most visual elements accept a custom render too: \`<Bar shape={...}>\`, \`<Line dot={...}>\`, \`<XAxis tick={...}>\`. Colours are plain strings, so CSS variables work everywhere and the chart follows the app's theme automatically.`,
      lang: 'tsx',
      code: `function Tip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-2 text-[12px]">
      <div className="text-muted">{label}</div>
      <div className="text-bone">{payload[0].value} min</div>
    </div>
  )
}

<Tooltip content={<Tip />} cursor={{ stroke: 'rgb(var(--accent-rgb) / 0.3)' }} />`,
    },
    {
      title: 'Animation and performance',
      body: `Series animate in by default, interpolating from a baseline. Turn it off with \`isAnimationActive={false}\` for charts that update every second or for reduced-motion users. For large datasets, remember the chart is SVG: a few thousand points is fine, fifty thousand is not. Downsample before charting, or use a canvas-based library at that scale.`,
      lang: 'tsx',
      code: `const reduce = useReducedMotion()

<Line dataKey="xp" isAnimationActive={!reduce} animationDuration={600} />

// Downsample 10,000 daily points to one per week before charting
const weekly = chunk(daily, 7).map((w) => ({ week: w[0].date, xp: sum(w, 'xp') }))`,
    },
  ],

  visual: {
    title: 'Six numbers become a line',
    intro: 'Follow the weekly study minutes through domain, scale and path, to the SVG the browser draws.',
    frames: [
      {
        caption: 'The input: six plain objects. dataKey="minutes" tells the Line which field to read.',
        frame: `  data
  ┌─────┬─────────┐
  │ day │ minutes │
  ├─────┼─────────┤
  │ Mon │   90    │
  │ Tue │   60    │
  │ Wed │   95    │
  │ Thu │    0    │
  │ Fri │   80    │
  │ Sat │  120    │
  └─────┴─────────┘`,
      },
      {
        caption: 'Domain. The y-axis scans the values and finds 0 to 120, then rounds to nice ticks. The x-axis is categorical: six bands.',
        frame: `  y domain:  [0, 120]   ticks: 0 30 60 90 120
  x domain:  [Mon Tue Wed Thu Fri Sat]

  chart box: 320 x 200 px, margins 20
  plot area: x 40..300   y 10..170`,
      },
      {
        caption: 'Scales. Each value is mapped to a pixel. Note y is flipped: 120 minutes is the top of the plot area.',
        frame: `  x (band)           y (linear, flipped)
  Mon -> 62 px       120 -> 10 px
  Tue -> 105         90  -> 50
  Wed -> 148         60  -> 90
  Thu -> 191         30  -> 130
  Fri -> 234         0   -> 170
  Sat -> 277

  points: (62,50) (105,90) (148,43) (191,170) (234,63) (277,10)`,
      },
      {
        caption: 'Path. d3-shape turns the points into an SVG path string. A curve type would insert smooth Bezier segments instead of straight lines.',
        frame: `  d3-shape line()
    -> "M62,50 L105,90 L148,43 L191,170 L234,63 L277,10"

  <path d="M62,50 L105,90 ..." fill="none"
        stroke="var(--accent)" stroke-width="2" />`,
      },
      {
        caption: 'The rendered SVG. Axes, ticks and the line are all React elements; the browser draws vectors, sharp at any size.',
        frame: `  120 ┤                              ●
   90 ┤ ●       ●                ●
   60 ┤     ●
   30 ┤
    0 ┤                  ●
      └───┬─────┬─────┬─────┬─────┬─────
         Mon   Tue   Wed   Thu   Fri   Sat

  hover Wed -> Tooltip finds nearest x, shows 95`,
      },
    ],
  },

  internals: `## A chart is a layout engine over SVG

A Recharts chart component such as \`LineChart\` is a container that, on render, does three jobs: reads the configuration from its children, computes the layout, and renders an \`<svg>\` with each child placed inside it. The children are not rendered where you wrote them; the container inspects their props (\`dataKey\`, \`type\`, \`orientation\`) and builds the chart from that description. This is why a \`<Line>\` outside a chart draws nothing, and why the ordering of children rarely matters.

## The pipeline

**Collect.** The container walks its children and sorts them into axes, grids, graphical items (Line, Bar, Area, Scatter, Radar), reference elements and overlays (Tooltip, Legend, Brush).

**Domains.** For each axis it computes the domain by scanning the data for every graphical item bound to that axis, taking min and max (or the category list). \`domain\` props, \`allowDataOverflow\` and \`includeHidden\` adjust this. Stacked series accumulate before the scan so the domain covers the stack height.

**Scales.** Each axis gets a D3 scale: \`scaleLinear\` for numbers, \`scaleBand\` or \`scalePoint\` for categories, \`scaleLog\` and \`scaleTime\` on request. The range is the plot area, computed by subtracting margins, axis widths and legend height from the container size.

**Ticks.** Nice tick values come from D3's \`ticks()\`; for categories, every band label unless the axis is told to skip. Tick label sizes are measured to reserve axis width, which is why axes can shift when data changes.

**Shapes.** Each graphical item maps its data through the scales into points, then hands them to a shape generator from \`d3-shape\`: \`line()\` with a curve for Lines, \`area()\` for Areas, rectangles for Bars, \`lineRadial()\` for Radars. The output is a path string or a list of rects rendered as React elements.

## Interaction

The chart attaches mouse and touch handlers to an invisible full-size rect. On move it converts the pointer to a data-space coordinate through the inverse scale, finds the nearest data index, and stores it as the *active index*. Tooltip, the active dot on lines and the highlight cursor all read that index. Version 3 moved this shared state into an internal Redux store so that overlays, synchronised charts (\`syncId\`) and custom components can subscribe to it consistently.

## Animation

Series use an internal animation utility that interpolates between the previous and next set of points over a duration with an easing curve, re-rendering the path each frame. For bars, the height grows from the baseline. Because it re-renders React each frame, it is fine for a handful of series and expensive for hundreds, which is why the prop to disable it exists.

## ResponsiveContainer

It renders a wrapper div at the requested width and height (percentages allowed), observes it with a ResizeObserver, and clones its child chart with the measured pixel size. A debounce option avoids re-layout storms during a drag-resize. The wrapper needs a height from somewhere; it cannot invent one.

## Why SVG rather than canvas

SVG elements are DOM nodes: they can be styled with CSS, inspected, animated with transitions, made accessible with titles and ARIA, and hit-tested by the browser. For dashboards with hundreds of points that is a good trade. Canvas wins at tens of thousands of points, where the per-node cost of the DOM becomes the bottleneck.`,

  buildIt: {
    title: 'A bar chart in React with no library',
    intro: 'The core of any charting library is a scale and a loop. Write both and you will understand every prop Recharts exposes.',
    steps: [
      {
        title: 'A linear scale',
        body: 'The mapping from data to pixels. Flip the range for y because SVG grows downward.',
        lang: 'ts',
        code: `function linear(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain, [r0, r1] = range
  return (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)
}

const y = linear([0, 120], [170, 10])
y(0)    // 170  (bottom of the plot area)
y(120)  // 10   (top)`,
      },
      {
        title: 'Nice ticks',
        body: 'Pick a step from 1, 2, 5 times a power of ten so labels read naturally. This is a simplified d3 ticks().',
        lang: 'ts',
        code: `function ticks(max: number, count = 5) {
  const rough = max / count
  const pow = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= rough)!
  const out: number[] = []
  for (let v = 0; v <= max + 1e-9; v += step) out.push(+v.toFixed(6))
  return out
}
ticks(120)   // [0, 30, 60, 90, 120]`,
      },
      {
        title: 'The chart component',
        body: 'A band per category, a rect per value, tick lines and labels. Every part maps to a Recharts child you have used.',
        lang: 'tsx',
        code: `function Bars({ data, width = 320, height = 200 }: { data: { label: string; value: number }[]; width?: number; height?: number }) {
  const m = { top: 10, right: 20, bottom: 30, left: 40 }
  const w = width - m.left - m.right, h = height - m.top - m.bottom
  const max = Math.max(...data.map((d) => d.value))
  const y = linear([0, max], [h, 0])
  const band = w / data.length, pad = band * 0.2
  return (
    <svg width={width} height={height}>
      <g transform={'translate(' + m.left + ',' + m.top + ')'}>
        {ticks(max).map((t) => (
          <g key={t} transform={'translate(0,' + y(t) + ')'}>
            <line x2={w} stroke="currentColor" opacity={0.1} />
            <text x={-8} dy="0.32em" textAnchor="end" fontSize={10}>{t}</text>
          </g>
        ))}
        {data.map((d, i) => (
          <g key={d.label} transform={'translate(' + (i * band + pad) + ',0)'}>
            <rect y={y(d.value)} width={band - pad * 2} height={h - y(d.value)} rx={4} fill="var(--accent)" />
            <text x={(band - pad * 2) / 2} y={h + 16} textAnchor="middle" fontSize={11}>{d.label}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}`,
      },
      {
        title: 'Add hover',
        body: 'Track the pointer, compute the nearest band index, and show a tooltip. This is the whole of Recharts\' Tooltip in miniature.',
        lang: 'tsx',
        code: `const [active, setActive] = useState<number | null>(null)
// on the outer <svg>:
onMouseMove={(e) => {
  const x = e.nativeEvent.offsetX - m.left
  setActive(x < 0 || x > w ? null : Math.floor(x / band))
}}
onMouseLeave={() => setActive(null)}
// and in the bar loop:  fill={active === i ? 'var(--accent-bright)' : 'var(--accent)'}
// and somewhere:        {active !== null && <text ...>{data[active].value}</text>}`,
      },
    ],
  },

  inTheWild: [
    { who: 'shadcn/ui Charts', what: 'The chart components in the most popular React UI kit are thin wrappers over Recharts with theme tokens.' },
    { who: 'Vercel and Supabase dashboards', what: 'Analytics panels in developer platforms commonly use Recharts for usage and latency over time.' },
    { who: 'Internal admin tools everywhere', what: 'Its declarative shape makes it the default pick for teams that need a dozen charts and no custom visualisation.' },
    { who: 'Alibaba', what: 'Where it started; used across internal business dashboards.' },
    { who: 'This app', what: 'The skill radar on the Status page, drawn from your progress across gates.' },
  ],

  alternatives: [
    { name: 'D3 directly', pick: 'Bespoke, editorial visualisations where every pixel is designed. Steepest curve, no ceiling.' },
    { name: 'visx (Airbnb)', pick: 'D3 primitives as low-level React components. More work than Recharts, more control, still React-owned.' },
    { name: 'Nivo', pick: 'A richer set of chart types with strong theming and server-side rendering.' },
    { name: 'Chart.js', pick: 'Canvas-based, framework-agnostic, very fast for large datasets; less React-native.' },
    { name: 'Observable Plot', pick: 'A concise grammar-of-graphics API from the D3 authors for exploratory charts.' },
  ],

  glossary: [
    { term: 'dataKey', meaning: 'The field name a series or axis reads from each data object.' },
    { term: 'Domain', meaning: 'The range of data values an axis covers, such as 0 to 120.' },
    { term: 'Range', meaning: 'The pixel span an axis maps its domain onto.' },
    { term: 'Scale', meaning: 'A function from domain to range; linear, band, log or time.' },
    { term: 'Band scale', meaning: 'A categorical scale giving each category an equal-width slot.' },
    { term: 'Tick', meaning: 'A labelled mark on an axis at a nice value.' },
    { term: 'Series', meaning: 'One set of values drawn as a line, bars or area.' },
    { term: 'Cartesian', meaning: 'Charts with x and y axes, as opposed to polar or radial.' },
    { term: 'Radar', meaning: 'A polar chart mapping several dimensions to spokes and joining the values.' },
    { term: 'ResponsiveContainer', meaning: 'A wrapper that measures its parent and sizes the chart to fit.' },
  ],

  quiz: [
    {
      question: 'What does a scale do in a chart?',
      options: ['Resizes the SVG', 'Maps a data value to a pixel position', 'Sorts the data', 'Chooses colours'],
      answerIndex: 1,
      explanation: 'A scale is a function from the data domain to the pixel range. Every shape in a chart is positioned through one.',
    },
    {
      question: 'A ResponsiveContainer renders nothing. What is the most likely cause?',
      options: ['Missing data', 'The parent element has no height, so the measured size is zero', 'Wrong dataKey', 'Recharts needs a width in pixels'],
      answerIndex: 1,
      explanation: 'The container fills its parent. With no height to fill, the chart is 0 px tall. Give the parent an explicit height.',
    },
    {
      question: 'Why are Recharts components written as children of a chart rather than an options object?',
      options: ['Historical accident', 'The chart inspects its children to build the configuration, so features are added or removed with ordinary JSX', 'Options objects are not allowed in React', 'For animation'],
      answerIndex: 1,
      explanation: 'Composition is the API. Conditional rendering of a child is conditional configuration.',
    },
    {
      question: 'Which library provides the maths for scales and path shapes inside Recharts?',
      options: ['Three.js', 'D3 modules such as d3-scale and d3-shape', 'Chart.js', 'None; it is all custom'],
      answerIndex: 1,
      explanation: 'Recharts uses D3 for calculations and lets React own the DOM, avoiding D3\'s direct mutation.',
    },
    {
      question: 'Why does SVG y decrease as data values increase?',
      options: ['A Recharts bug', 'SVG coordinates grow downward, so the scale range is flipped to put larger values higher', 'Charts are drawn upside down then rotated', 'It does not'],
      answerIndex: 1,
      explanation: 'The origin of SVG is the top-left. A y scale maps the maximum to the top pixel of the plot area.',
    },
  ],
}
