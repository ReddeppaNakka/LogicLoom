import type { TechDeep } from '../stack-types'

export const reactMarkdownDeep: TechDeep = {
  analogy:
    'A translator at a border between two countries. On one side, a writer speaks Markdown: hashes for headings, dashes for lists, backticks for code. On the other side, the browser only understands HTML. The translator does not just swap words; it listens to the whole sentence, builds an understanding of its structure, and then says it again in the other language. react-markdown is that translator, and it never lets the writer smuggle raw HTML across.',

  origins: `react-markdown was created by **Espen Hovlandsdal** in **2015** and is maintained alongside the **unified** ecosystem, the family of text-processing tools led by Titus Wormer that includes **remark** (Markdown) and **rehype** (HTML).

The problem it solved was a security one as much as a convenience one. The obvious way to show Markdown in React is to convert it to an HTML string with a library like marked and inject it with \`dangerouslySetInnerHTML\`. That works until the Markdown comes from a user, or a database, or a language model, at which point a \`<script>\` or an \`onerror\` attribute in the input becomes a cross-site scripting hole. It also gives you no way to customise how a heading or a link renders.

react-markdown takes a different route. It parses Markdown into a **syntax tree**, converts that tree into React elements directly, and never produces an HTML string at all. Raw HTML in the source is dropped by default. Every node type maps to a component you can replace, so a code block can become a Monaco editor and a link can become a router \`Link\`.

**Markdown** itself was designed by John Gruber with Aaron Swartz in 2004 as a plain-text format that reads well unrendered. **CommonMark** (2014) gave it a precise specification, and **GitHub Flavored Markdown** (GFM) extended it with tables, task lists, strikethrough and automatic links, which the \`remark-gfm\` plugin used here adds.`,

  concepts: [
    {
      title: 'Markdown is a text format with structure',
      body: `Markdown is plain text where a few characters carry meaning. A line starting with \`#\` is a heading. A line starting with \`-\` is a list item. Text between backticks is inline code; a fenced block between triple backticks is a code block with an optional language. Asterisks make emphasis, brackets and parentheses make links. The design goal was that the source reads fine as text, which is why it is the format of README files, GitHub comments, and the study content in this app.`,
      lang: 'md',
      code: `## Two pointers

Move **two indices** toward each other while a condition holds.

- Works on *sorted* input
- Runs in O(n)

\`\`\`python
def pair_sum(nums, target):
    i, j = 0, len(nums) - 1
\`\`\`

See [the pattern page](#/patterns/two-pointers).`,
    },
    {
      title: 'Parsing to a tree, not a string',
      body: `react-markdown runs the text through remark, which produces an **mdast** (Markdown abstract syntax tree): a nested object where a \`heading\` node with \`depth: 2\` has children of type \`text\`, a \`list\` has \`listItem\` children, and so on. This tree is the whole document's structure in a form a program can walk. Only after any plugins have transformed the tree is it converted to React elements. There is no intermediate HTML string, which is why nothing can be injected.`,
      lang: 'json',
      code: `{
  "type": "root",
  "children": [
    { "type": "heading", "depth": 2,
      "children": [{ "type": "text", "value": "Two pointers" }] },
    { "type": "paragraph",
      "children": [
        { "type": "text", "value": "Move " },
        { "type": "strong", "children": [{ "type": "text", "value": "two indices" }] },
        { "type": "text", "value": " toward each other." }
      ] },
    { "type": "code", "lang": "python", "value": "def pair_sum(nums, target): ..." }
  ]
}`,
    },
    {
      title: 'Plugins: remark and rehype',
      body: `The pipeline has two plugin points. **remark plugins** transform the Markdown tree: \`remark-gfm\` teaches the parser tables and task lists; \`remark-math\` recognises \`$...$\`. **rehype plugins** transform the HTML-shaped tree that comes after: \`rehype-highlight\` adds syntax colouring to code, \`rehype-slug\` adds ids to headings so a table of contents can link to them. Pass arrays of them as props. Order matters: each plugin sees the tree left by the previous one.`,
      lang: 'tsx',
      code: `import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
  {text}
</ReactMarkdown>

// GFM adds:  | tables |   - [x] task lists   ~~strike~~   https://auto.links`,
    },
    {
      title: 'Components: replace any element',
      body: `The \`components\` prop maps an HTML tag name to a React component. The component receives the usual props (\`href\`, \`children\`) plus the node. This is the feature that turns a Markdown renderer into part of your design system: internal links become router links, code blocks get a copy button or a language tab, images get lazy loading, headings get anchor icons.`,
      lang: 'tsx',
      code: `<ReactMarkdown
  components={{
    a: ({ href = '', children }) =>
      href.startsWith('#/') ? <Link to={href.slice(1)}>{children}</Link>
                            : <a href={href} target="_blank" rel="noreferrer">{children}</a>,
    code: ({ className, children }) => {
      const lang = /language-(\\w+)/.exec(className ?? '')?.[1]
      return lang ? <CodeBlock lang={lang} code={String(children)} /> : <code>{children}</code>
    },
    h2: ({ children }) => <h2 className="display text-2xl mt-10 mb-3">{children}</h2>,
  }}
>{text}</ReactMarkdown>`,
    },
    {
      title: 'Safety by default',
      body: `Because output is built from the tree, a \`<script>\` in the source is treated as HTML syntax and dropped (or shown as text with \`skipHtml\` off and no rehype-raw). URLs in links and images go through a sanitiser that rejects \`javascript:\` schemes. If you genuinely need raw HTML from a trusted source, \`rehype-raw\` parses it, and \`rehype-sanitize\` applies an allow-list afterwards. The default stance is the safe one, which matters most when the text comes from users or from a language model.`,
      lang: 'tsx',
      code: `// Input from somewhere untrusted
const text = 'Hello <img src=x onerror="alert(1)"> [click](javascript:alert(2))'

<ReactMarkdown>{text}</ReactMarkdown>
// renders: "Hello " and a link with the href removed. No alert.

// Trusted HTML, explicitly allowed and then sanitised
<ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{trusted}</ReactMarkdown>`,
    },
    {
      title: 'Styling the output',
      body: `The renderer emits plain elements with no classes, so styling is a wrapper class and descendant selectors: \`.prose h2\`, \`.prose code\`, \`.prose ul\`. Tailwind's preflight removes list bullets and heading sizes, so a prose stylesheet must put them back. This app's \`.prose-sys\` does exactly that, with reading width and size driven by CSS variables the user can change on the Appearance page.`,
      lang: 'css',
      code: `.prose-sys { max-width: var(--reading-width, 68ch); font-size: var(--reading-size, 15px); line-height: 1.75; }
.prose-sys h2 { font-family: var(--font-display); font-size: 1.73em; margin: 2em 0 .6em; }
.prose-sys ul { list-style: disc; padding-left: 1.3em; }
.prose-sys code { font-family: var(--font-mono); background: rgb(var(--accent-rgb) / .1); padding: 1px 6px; border-radius: 6px; }
.prose-sys pre { background: var(--code-bg); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; overflow-x: auto; }`,
    },
  ],

  visual: {
    title: 'A paragraph, from text to React elements',
    intro: 'One line of Markdown with emphasis and a link travels through the unified pipeline. Notice that HTML never appears as a string at any stage.',
    frames: [
      {
        caption: 'Input. A string of Markdown with one bold span and one link.',
        frame: `  "Move **two indices** toward [the middle](#mid)."`,
      },
      {
        caption: 'remark-parse tokenises it into an mdast tree. Structure is explicit; the asterisks and brackets are gone.',
        frame: `  paragraph
   ├─ text      "Move "
   ├─ strong
   │   └─ text  "two indices"
   ├─ text      " toward "
   ├─ link      url: "#mid"
   │   └─ text  "the middle"
   └─ text      "."`,
      },
      {
        caption: 'remark plugins run here, such as remark-gfm. Then remark-rehype converts the Markdown tree into an HTML-shaped tree (hast).',
        frame: `  element p
   ├─ text "Move "
   ├─ element strong
   │   └─ text "two indices"
   ├─ text " toward "
   ├─ element a   properties: { href: "#mid" }
   │   └─ text "the middle"
   └─ text "."

  rehype plugins run here (slug, highlight, sanitize)`,
      },
      {
        caption: 'Each hast node becomes a React element via createElement, using your components map where provided.',
        frame: `  createElement('p', null,
    'Move ',
    createElement('strong', null, 'two indices'),
    ' toward ',
    createElement(Link, { to: '#mid' }, 'the middle'), <- custom
    '.'
  )

  HTML strings produced:  0
  dangerouslySetInnerHTML:  never`,
      },
      {
        caption: 'React renders the elements. A hostile input takes the same path and its tags are simply nodes that get dropped.',
        frame: `  input:  "Hi <script>steal()</script>"

  mdast:  paragraph
           ├─ text "Hi "
           └─ html "<script>steal()</script>"   <- typed as html

  default: html node skipped
  output: <p>Hi </p>`,
      },
    ],
  },

  internals: `## The unified pipeline

unified is a small framework for processing text through syntax trees. A processor is built by chaining plugins: a parser turns text into a tree, transformers modify the tree, and a compiler turns the tree into output. react-markdown assembles a processor with \`remark-parse\`, your remark plugins, \`remark-rehype\`, your rehype plugins, and finally its own compiler that walks the hast tree and returns React elements. Running it is synchronous, which is why the component can render on the first pass without a loading state.

## mdast and hast

Both trees follow the **unist** shape: nodes with a \`type\`, optional \`children\`, and \`position\` data. mdast node types are Markdown concepts: \`heading\`, \`paragraph\`, \`list\`, \`listItem\`, \`code\`, \`inlineCode\`, \`emphasis\`, \`strong\`, \`link\`, \`image\`, \`table\`. hast node types are HTML concepts: \`element\` with a \`tagName\` and \`properties\`, \`text\`, \`comment\`. \`remark-rehype\` maps between them with a table of handlers: a \`heading\` of depth 2 becomes an \`element\` with tag \`h2\`; a \`code\` node becomes \`pre > code\` with a \`language-python\` class.

## micromark

Since remark version 13, parsing is done by **micromark**, a CommonMark-compliant tokenizer that processes the input as a state machine over characters rather than with regular expressions. It handles the notoriously tricky parts of the spec (nested emphasis, lazy continuation lines, link reference definitions) exactly as CommonMark defines them, which means the output matches GitHub's rendering. Extensions such as GFM tables are micromark extensions plus mdast handlers, packaged together as \`remark-gfm\`.

## From hast to React

The compiler walks the hast tree. For each \`element\` it looks up the tag in your \`components\` map, falling back to the tag string. It converts hast \`properties\` to React props (\`className\` from \`class\`, camel-cased SVG attributes, \`style\` strings parsed to objects) and recurses into children, assigning stable keys from the node position. \`text\` nodes become strings. The result is an ordinary React element tree that reconciles like anything else.

## URL handling

Every \`href\` and \`src\` passes through a \`urlTransform\` (formerly \`transformLinkUri\`). The default allows \`http\`, \`https\`, \`mailto\`, \`tel\`, relative paths and fragments, and strips anything else, including \`javascript:\` and \`data:\` for links. You can supply your own transform to, for example, rewrite relative image paths to a CDN.

## Raw HTML

Markdown allows inline HTML. Without \`rehype-raw\`, those nodes are \`html\` nodes in mdast that remark-rehype turns into \`raw\` hast nodes, and react-markdown skips \`raw\` nodes. With \`rehype-raw\`, the raw strings are parsed by a real HTML parser into elements, which is why \`rehype-sanitize\` should follow it whenever the source is not fully trusted.

## Performance

Parsing is fast, but it runs on every render of the component. For long documents that re-render often, memoise the element with \`useMemo\` keyed on the text, or move the parse into a build step. This app's concept pages render a few thousand words each, which parses in a millisecond or two.`,

  buildIt: {
    title: 'A tiny Markdown-to-React renderer',
    intro: 'Headings, paragraphs, bold, inline code and links, parsed to a tree and rendered as elements with no HTML string. The shape is the same as react-markdown; the grammar is a toy.',
    steps: [
      {
        title: 'Block parsing',
        body: 'Split the text into blocks by blank lines, and classify each as a heading, a code fence or a paragraph.',
        lang: 'ts',
        code: `type Block =
  | { type: 'heading'; depth: number; text: string }
  | { type: 'code'; lang: string; value: string }
  | { type: 'paragraph'; text: string }

function parseBlocks(src: string): Block[] {
  return src.split(/\\n{2,}/).map((b) => {
    const h = /^(#{1,6}) (.*)$/.exec(b)
    if (h) return { type: 'heading', depth: h[1].length, text: h[2] }
    const c = /^\`\`\`(\\w*)\\n([\\s\\S]*?)\\n\`\`\`$/.exec(b)
    if (c) return { type: 'code', lang: c[1], value: c[2] }
    return { type: 'paragraph', text: b }
  })
}`,
      },
      {
        title: 'Inline parsing',
        body: 'Scan for bold, inline code and links with one alternation. Everything else is text.',
        lang: 'ts',
        code: `type Inline =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; text: string; href: string }

const RE = /\\*\\*(.+?)\\*\\*|\`([^\`]+)\`|\\[([^\\]]+)\\]\\(([^)]+)\\)/g

function parseInline(text: string): Inline[] {
  const out: Inline[] = []
  let last = 0
  for (const m of text.matchAll(RE)) {
    if (m.index! > last) out.push({ type: 'text', value: text.slice(last, m.index) })
    if (m[1]) out.push({ type: 'strong', value: m[1] })
    else if (m[2]) out.push({ type: 'code', value: m[2] })
    else out.push({ type: 'link', text: m[3], href: m[4] })
    last = m.index! + m[0].length
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) })
  return out
}`,
      },
      {
        title: 'Render the tree as React elements',
        body: 'No strings of HTML anywhere. A hostile link scheme is dropped here, the same job urlTransform does.',
        lang: 'tsx',
        code: `const safe = (href: string) => (/^(https?:|mailto:|#|\\/)/.test(href) ? href : undefined)

function Inlines({ nodes }: { nodes: Inline[] }) {
  return <>{nodes.map((n, i) => {
    if (n.type === 'text') return n.value
    if (n.type === 'strong') return <strong key={i}>{n.value}</strong>
    if (n.type === 'code') return <code key={i}>{n.value}</code>
    return <a key={i} href={safe(n.href)}>{n.text}</a>
  })}</>
}

export function MiniMarkdown({ children }: { children: string }) {
  const blocks = useMemo(() => parseBlocks(children), [children])
  return <div className="prose-sys">{blocks.map((b, i) => {
    if (b.type === 'heading') return createElement('h' + b.depth, { key: i }, <Inlines nodes={parseInline(b.text)} />)
    if (b.type === 'code') return <pre key={i}><code className={'language-' + b.lang}>{b.value}</code></pre>
    return <p key={i}><Inlines nodes={parseInline(b.text)} /></p>
  })}</div>
}`,
      },
      {
        title: 'Test it with something hostile',
        body: 'The script tag is just paragraph text and the javascript: link loses its href. That is the property you get for free by never building an HTML string.',
        lang: 'tsx',
        code: `<MiniMarkdown>{'## Hi\\n\\n<script>alert(1)</script> and [x](javascript:alert(2))'}</MiniMarkdown>
// -> <h2>Hi</h2><p>&lt;script&gt;alert(1)&lt;/script&gt; and <a>x</a></p>`,
      },
    ],
  },

  inTheWild: [
    { who: 'Chat interfaces for language models', what: 'Streaming model output is Markdown; rendering it safely with custom code blocks is exactly react-markdown\'s use case, and most open-source chat UIs use it.' },
    { who: 'Documentation sites and CMS front ends', what: 'Content stored as Markdown in a database or a headless CMS is rendered with custom components for callouts and embeds.' },
    { who: 'GitHub', what: 'Not react-markdown, but the same unified and micromark engine powers GitHub\'s own Markdown rendering, so output matches.' },
    { who: 'MDX', what: 'The Markdown-plus-JSX format used by Docusaurus and Next.js docs sites is built on the same remark and rehype pipeline.' },
    { who: 'This app', what: 'Every concept body, pattern explanation and stack note is Markdown rendered through the Markdown component with GFM enabled.' },
  ],

  alternatives: [
    { name: 'MDX', pick: 'Authoring documents that embed React components inline. Needs a build step; content becomes code.' },
    { name: 'marked + DOMPurify', pick: 'A vanilla project without React. Fast HTML string output; sanitise before injecting.' },
    { name: 'markdown-it', pick: 'A pluggable HTML-string renderer popular in Vue and Node projects.' },
    { name: 'Pre-rendering at build time', pick: 'Static content that never changes: convert once in a script and ship HTML, skipping runtime parsing entirely.' },
  ],

  glossary: [
    { term: 'Markdown', meaning: 'A plain-text format where a few characters mark headings, lists, emphasis and code.' },
    { term: 'CommonMark', meaning: 'The precise specification of Markdown that parsers agree on.' },
    { term: 'GFM', meaning: 'GitHub Flavored Markdown: CommonMark plus tables, task lists, strikethrough and autolinks.' },
    { term: 'unified', meaning: 'The framework of parsers, transformers and compilers that remark and rehype belong to.' },
    { term: 'remark', meaning: 'The Markdown side of unified; plugins that work on the Markdown tree.' },
    { term: 'rehype', meaning: 'The HTML side of unified; plugins that work on the HTML-shaped tree.' },
    { term: 'mdast', meaning: 'The Markdown abstract syntax tree.' },
    { term: 'hast', meaning: 'The HTML abstract syntax tree.' },
    { term: 'micromark', meaning: 'The CommonMark-compliant tokenizer under remark.' },
    { term: 'XSS', meaning: 'Cross-site scripting: injected script running in a page. Avoided here by never rendering HTML strings.' },
  ],

  quiz: [
    {
      question: 'Why is react-markdown safer than converting Markdown to HTML and using dangerouslySetInnerHTML?',
      options: ['It escapes everything', 'It builds React elements from a syntax tree and never produces an HTML string, so injected tags are dropped', 'It runs in a sandbox', 'It disables links'],
      answerIndex: 1,
      explanation: 'Raw HTML in the source becomes a typed node that is skipped by default. There is no string for an attacker to smuggle markup into.',
    },
    {
      question: 'Tables in your Markdown render as plain text. What is missing?',
      options: ['A CSS class', 'The remark-gfm plugin, since tables are a GitHub extension, not CommonMark', 'rehype-raw', 'A components entry for table'],
      answerIndex: 1,
      explanation: 'CommonMark has no tables. remark-gfm adds the syntax to the parser.',
    },
    {
      question: 'How do you make Markdown links to #/patterns/x use the app router instead of a full navigation?',
      options: ['Edit the Markdown', 'Pass a components map that renders a for internal hrefs as a router Link', 'Use rehype-raw', 'Set skipHtml'],
      answerIndex: 1,
      explanation: 'The components prop replaces any element type with your own component, receiving href and children.',
    },
    {
      question: 'In which order do the two plugin kinds run?',
      options: ['rehype then remark', 'remark on the Markdown tree, then remark-rehype converts, then rehype on the HTML tree', 'Both at once', 'Order is random'],
      answerIndex: 1,
      explanation: 'The pipeline is parse, remark plugins, convert to hast, rehype plugins, compile to React.',
    },
    {
      question: 'Your list bullets vanish in a Tailwind project. Why, and where is the fix?',
      options: ['react-markdown removes them', 'Tailwind preflight resets list styles; restore list-style in your prose CSS', 'GFM disables bullets', 'Use rehype-sanitize'],
      answerIndex: 1,
      explanation: 'The renderer emits plain ul and li. Preflight strips their default style, so a prose stylesheet must set list-style again.',
    },
  ],
}
