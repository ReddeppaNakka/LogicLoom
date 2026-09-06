import type { TechDeep } from '../stack-types'

export const ghActionsDeep: TechDeep = {
  analogy:
    'A robot assistant that lives at the post office. Every time you drop a parcel (a push) in the box, it opens it, runs the checks you wrote on a card, builds the finished product, and walks it over to the shop window (the live site). You wrote the card once. The robot follows it identically every time, at three in the morning if that is when you pushed. GitHub Actions is the robot, and the workflow file is the card.',

  origins: `GitHub Actions was announced in **October 2018** and became generally available with full CI/CD support in **November 2019**. Before it, projects on GitHub used third-party services (Travis CI, CircleCI, Jenkins) that watched the repository from outside. Actions moved automation into the platform: the workflow definition lives in the repository, runs on GitHub's own machines, and can react to any event GitHub knows about, from a push to an issue comment to a schedule.

The idea it built on is **continuous integration**, a practice from the early 2000s: every change is built and tested automatically, so a broken build is discovered in minutes rather than at release. **Continuous deployment** extends that: if the checks pass, the result is published without a human step.

Actions' distinctive design is the **marketplace of reusable steps**. A step can be a shell command or a published action such as \`actions/checkout\`, and anyone can publish one. The deploy pipeline in this app uses three official actions to fetch the code, upload the built site as an artifact, and publish that artifact to **GitHub Pages**, GitHub's free static hosting. The Pages integration via Actions (2022) replaced the older method of committing built files to a branch.`,

  concepts: [
    {
      title: 'A workflow is a YAML file in .github/workflows',
      body: `A workflow has a name, an \`on\` block saying which events trigger it, and \`jobs\`. Each job runs on a fresh virtual machine (the \`runs-on\` runner) and is a list of \`steps\`. Steps either \`run\` a shell command or \`uses\` a published action. The file is versioned with your code, so a change to the pipeline is a normal pull request.`,
      lang: 'yaml',
      code: `name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:          # a manual "Run workflow" button too

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build`,
    },
    {
      title: 'Events and filters',
      body: `\`on\` can list many events: \`push\`, \`pull_request\`, \`schedule\` (cron), \`workflow_dispatch\` (manual), \`release\`, \`issues\`. Filters narrow them: only certain branches, only when certain paths changed, only certain tags. A deploy workflow typically runs on push to \`main\` while a check workflow runs on every pull request, so broken code is caught before it reaches \`main\`.`,
      lang: 'yaml',
      code: `on:
  pull_request:                 # every PR: run checks
  push:
    branches: [main]            # main only: deploy
    paths-ignore: ['**.md']     # docs-only commits skip the pipeline
  schedule:
    - cron: '0 3 * * 1'         # Mondays at 03:00 UTC: a weekly audit`,
    },
    {
      title: 'Jobs run in parallel, needs makes them sequential',
      body: `Jobs in one workflow run at the same time on separate machines unless one declares \`needs\` on another. A deploy job that \`needs: build\` waits for the build to succeed and can consume what it produced. If the build fails, the deploy never starts. This is the structure of nearly every publish pipeline: build and check in parallel, deploy after both.`,
      lang: 'yaml',
      code: `jobs:
  check:
    runs-on: ubuntu-latest
    steps: [ { uses: actions/checkout@v4 }, { run: npm ci }, { run: npm run typecheck }, { run: npm run check } ]
  build:
    runs-on: ubuntu-latest
    steps: [ { uses: actions/checkout@v4 }, { run: npm ci }, { run: npm run build } ]
  deploy:
    needs: [check, build]       # both must pass
    runs-on: ubuntu-latest
    steps: [ ... ]`,
    },
    {
      title: 'Artifacts: passing files between jobs',
      body: `Each job's machine is thrown away when it ends. To hand the \`dist/\` folder from the build job to the deploy job, upload it as an **artifact** with \`actions/upload-artifact\` (or the Pages-specific \`actions/upload-pages-artifact\`) and download it in the next job. Artifacts are also kept for a retention period so you can download a build from the run page.`,
      lang: 'yaml',
      code: `  build:
    steps:
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }         # tarred and stored for the deploy job

  deploy:
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4    # fetches the artifact and publishes it`,
    },
    {
      title: 'Permissions and the GITHUB_TOKEN',
      body: `Every run gets a short-lived token to call the GitHub API. The \`permissions\` block sets what it may do, and the safe default is as little as possible. Deploying to Pages needs \`pages: write\` and \`id-token: write\` (to prove the run's identity to the Pages service); reading the code needs \`contents: read\`. Secrets such as API keys go in the repository settings and are referenced as \`\${{ secrets.NAME }}\`, never written in the file.`,
      lang: 'yaml',
      code: `permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true     # a newer push cancels an older deploy

env:
  API_URL: \${{ secrets.API_URL }}   # from Settings -> Secrets, masked in logs`,
    },
    {
      title: 'Environments, caching and matrices',
      body: `An \`environment\` names a deployment target, shows its URL on the run, and can require approval. \`cache\` on setup-node keeps \`node_modules\` downloads between runs so \`npm ci\` takes seconds. A \`strategy.matrix\` runs the same job across several versions or platforms at once, which is how libraries test on Node 18, 20 and 22 in one workflow.`,
      lang: 'yaml',
      code: `  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}

  test:
    strategy:
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with: { node-version: \${{ matrix.node }}, cache: npm }`,
    },
    {
      title: 'GitHub Pages and the hash router',
      body: `Pages serves static files from a path like \`user.github.io/repo/\`. It cannot rewrite \`/repo/gates\` to \`index.html\`, so a client-side router with real paths 404s on refresh. Two fixes: a hash router, which this app uses, or a \`404.html\` that redirects to the index with the path stashed in the query. Asset URLs must also work under the repository sub-path: either set Vite's \`base\` to \`'/repo/'\`, or, as this app does, to \`'./'\` so every URL is relative to index.html, which is always the page being served.`,
      lang: 'ts',
      code: `// vite.config.ts
export default defineConfig({
  base: './',                     // asset URLs relative to index.html: ./assets/...
  plugins: [react(), tailwindcss()],
})

// App.tsx: routes live after #, which the server never sees
<HashRouter> ... </HashRouter>
// https://user.github.io/LogicLoom/#/gates  -> always serves index.html`,
    },
  ],

  visual: {
    title: 'From git push to a live page',
    intro: 'Follow one push to main through the deploy workflow in this repository. Two jobs, three official actions, no server of your own.',
    frames: [
      {
        caption: 'Push. GitHub receives the commit and checks every workflow file for a matching trigger.',
        frame: `  git push origin main
       │
       v
  github.com/ReddeppaNakka/LogicLoom
    event: push   ref: refs/heads/main
    scan .github/workflows/*.yml
      deploy.yml   on.push.branches: [main]   MATCH`,
      },
      {
        caption: 'Build job. A fresh Ubuntu VM is provisioned. Steps run in order; a failing step stops the job.',
        frame: `  job: build   runner: ubuntu-latest (fresh VM)
  ┌───────────────────────────────────────────┐
  │ 1. actions/checkout@v4      clone repo    │ ✓  3 s
  │ 2. actions/setup-node@v4    node 22,cache │ ✓  6 s
  │ 3. npm ci                   install       │ ✓ 18 s
  │ 4. npm run build            vite build    │ ✓ 41 s
  │ 5. upload-pages-artifact    tar dist/     │ ✓  2 s
  └───────────────────────────────────────────┘`,
      },
      {
        caption: 'The artifact. dist/ is compressed and stored by GitHub, then the build VM is destroyed.',
        frame: `  dist/                        artifact "github-pages"
    index.html                 ┌────────────────────┐
    assets/index-D8sWq1.js  -> │ github-pages.tar   │
    assets/index-BxT4k2.css    │ 1.9 MB             │
    assets/ConceptPage-*.js    └────────────────────┘
                               stored, VM deleted`,
      },
      {
        caption: 'Deploy job. Waits for build (needs), presents the OIDC id-token to the Pages service, and publishes the artifact.',
        frame: `  job: deploy   needs: build   environment: github-pages
  ┌───────────────────────────────────────────┐
  │ 1. actions/deploy-pages@v4                │
  │      id-token  ->  Pages service          │
  │      fetch artifact                       │
  │      publish to CDN                       │ ✓ 12 s
  └───────────────────────────────────────────┘
  output: page_url = https://reddeppanakka.github.io/LogicLoom/`,
      },
      {
        caption: 'Live. The CDN serves the new files; hashed asset names mean browsers fetch only what changed.',
        frame: `  https://reddeppanakka.github.io/LogicLoom/#/stack
       │
       v  GET /LogicLoom/index.html
  <script src="/LogicLoom/assets/index-D8sWq1.js">
       │
       v  new hash -> fresh download
       v  unchanged chunks -> browser cache

  total time from push:  ~90 s
  servers you maintain:  0`,
      },
    ],
  },

  internals: `## Runners

A runner is a virtual machine (or container) that executes a job. GitHub-hosted runners are provisioned per job from images with common tools preinstalled (Node, Python, Docker, browsers) and destroyed when the job ends, so nothing persists between runs unless you cache or upload it. Self-hosted runners let you use your own machines for special hardware or private networks. Each job gets its own runner; steps within a job share the filesystem and environment.

## How an action runs

\`uses: actions/checkout@v4\` resolves the repository \`actions/checkout\` at the tag \`v4\`, downloads it into the runner, reads its \`action.yml\`, and executes its entry point. There are three kinds: **JavaScript actions** run directly on the runner's Node; **Docker actions** build or pull a container; **composite actions** are a list of steps. Pinning to a full commit SHA instead of a tag guards against a compromised tag, which matters for supply-chain security.

## Contexts and expressions

\`\${{ ... }}\` evaluates an expression at runtime. Contexts expose data: \`github\` (event payload, ref, actor), \`env\`, \`secrets\`, \`matrix\`, \`steps\` (outputs of earlier steps by id), \`needs\` (outputs of earlier jobs). Functions such as \`contains\`, \`startsWith\` and \`format\` make conditions expressive, and \`if:\` on a step or job gates it: \`if: github.event_name == 'push'\`.

## Steps communicate through files

A step sets an output by appending \`name=value\` to the file at \`$GITHUB_OUTPUT\`, sets an environment variable for later steps through \`$GITHUB_ENV\`, and adds to the log summary through \`$GITHUB_STEP_SUMMARY\`. This file-based protocol is why any language can write an action.

## The Pages deployment model

The modern Pages flow has three parts. \`configure-pages\` (optional) sets up the site configuration. \`upload-pages-artifact\` packages a directory as a specially named artifact. \`deploy-pages\` requests an OpenID Connect token that proves the workflow identity, exchanges it with the Pages API, and triggers publication to GitHub's CDN. The \`environment: github-pages\` block ties the run to the deployment record you see on the repository's home page. The repository setting **Pages: Source** must be set to GitHub Actions for this flow to publish; otherwise the deploy job fails with a permissions error.

## Caching

\`actions/cache\` stores and restores directories keyed by a string you choose, usually a hash of the lockfile. \`setup-node\` with \`cache: npm\` does this for the npm cache directory automatically. Caches are scoped to branches with fallback to the default branch, evicted after seven days unused, and limited per repository, so they are a speed-up, never a source of truth.

## Concurrency and cancellation

A \`concurrency\` group ensures only one run of that group is active. With \`cancel-in-progress: true\`, a new push cancels the older, still-running deploy so the site never goes backwards. For pull request checks the usual pattern keys the group on the PR number.

## Security notes

Workflows triggered by \`pull_request\` from forks run with read-only tokens and no secrets, by design. \`pull_request_target\` runs with secrets and is dangerous with untrusted code. Third-party actions run with the job's permissions, so the \`permissions\` block should grant the minimum, and pinning to SHAs is the recommended practice for anything sensitive.`,

  buildIt: {
    title: 'The complete deploy workflow for a Vite app',
    intro: 'Everything needed to publish a Vite site to GitHub Pages on every push to main, with checks that gate the deploy. Copy it, set Pages to GitHub Actions, push.',
    steps: [
      {
        title: 'Triggers and permissions',
        body: 'Run on main pushes and on demand. Grant only what Pages needs. One deploy at a time.',
        lang: 'yaml',
        code: `# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true`,
      },
      {
        title: 'The build job with checks',
        body: 'Type-check and content-check before building. If either fails the artifact is never uploaded and deploy never runs.',
        lang: 'yaml',
        code: `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run check
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist`,
      },
      {
        title: 'The deploy job',
        body: 'Waits on build, publishes the artifact, and records the URL on the environment.',
        lang: 'yaml',
        code: `  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4`,
      },
      {
        title: 'Make the app path-aware',
        body: 'Make asset URLs relative and use a hash router, so the site works under the repository sub-path. Then enable Pages with Source set to GitHub Actions in the repository settings.',
        lang: 'ts',
        code: `// vite.config.ts
export default defineConfig({
  base: './',                    // or '/repo-name/' if you prefer absolute URLs
  plugins: [react(), tailwindcss()],
})

// Settings -> Pages -> Build and deployment -> Source: GitHub Actions
// Then: git push origin main  ->  live in about 90 seconds`,
      },
    ],
  },

  inTheWild: [
    { who: 'The TypeScript, React and Vite repositories', what: 'All three run their test suites and releases on GitHub Actions; React moved from CircleCI to Actions in 2023.' },
    { who: 'Most open-source projects on GitHub', what: 'Actions is the default CI for the platform, with billions of minutes run per month.' },
    { who: 'Documentation sites', what: 'Docusaurus, VitePress and Astro docs commonly publish to GitHub Pages through the same upload and deploy actions used here.' },
    { who: 'Release automation', what: 'Semantic-release, changesets and npm publish flows run as workflows triggered by tags.' },
    { who: 'This app', what: 'Push to main, and the site is type-checked, content-checked, built and published to GitHub Pages without a manual step.' },
  ],

  alternatives: [
    { name: 'Vercel or Netlify', pick: 'Zero-config hosting with preview deployments per pull request and path rewrites, so BrowserRouter works. Free tiers are generous.' },
    { name: 'Cloudflare Pages', pick: 'Fast global CDN with a build pipeline and edge functions; similar convenience to Netlify.' },
    { name: 'GitLab CI', pick: 'Teams already on GitLab. The same concepts in a .gitlab-ci.yml.' },
    { name: 'Manual gh-pages branch', pick: 'The old way: build locally and push dist to a branch. Works, but nothing checks the code and the build depends on one machine.' },
  ],

  glossary: [
    { term: 'Workflow', meaning: 'A YAML file describing when to run and what jobs to execute.' },
    { term: 'Job', meaning: 'A set of steps that runs on one runner; jobs run in parallel unless linked with needs.' },
    { term: 'Step', meaning: 'A shell command or a published action inside a job.' },
    { term: 'Runner', meaning: 'The virtual machine that executes a job, discarded afterwards.' },
    { term: 'Action', meaning: 'A reusable step published in a repository, referenced with uses.' },
    { term: 'Artifact', meaning: 'Files uploaded from a job so another job or a person can download them.' },
    { term: 'GITHUB_TOKEN', meaning: 'The short-lived credential each run receives, scoped by the permissions block.' },
    { term: 'OIDC', meaning: 'OpenID Connect; how a run proves its identity to services such as Pages without a stored secret.' },
    { term: 'Concurrency group', meaning: 'A name ensuring only one run of that group is active at a time.' },
    { term: 'GitHub Pages', meaning: 'GitHub\'s free static-site hosting, served from a CDN.' },
  ],

  quiz: [
    {
      question: 'What happens to files a job created once the job finishes?',
      options: ['They persist for the next run', 'They are lost with the runner unless uploaded as an artifact or cached', 'They are committed to the repository', 'They are emailed'],
      answerIndex: 1,
      explanation: 'Each job gets a fresh machine that is destroyed afterwards. Artifacts and caches are the only ways to keep files.',
    },
    {
      question: 'Why does the deploy job declare needs: build?',
      options: ['To share environment variables', 'So it waits for build to succeed and can consume its artifact; a failed build blocks deploy', 'To run on the same machine', 'Because deploy jobs must be last'],
      answerIndex: 1,
      explanation: 'Jobs are parallel by default. needs creates the dependency and the gate.',
    },
    {
      question: 'Which two permissions does actions/deploy-pages require?',
      options: ['contents: write and issues: write', 'pages: write and id-token: write', 'actions: write and packages: read', 'None'],
      answerIndex: 1,
      explanation: 'pages: write allows publishing; id-token: write lets the run obtain an OIDC token proving its identity to the Pages service.',
    },
    {
      question: 'A refresh on user.github.io/repo/gates returns 404 while the app works from the home page. Why?',
      options: ['The build is broken', 'Pages serves static files and cannot rewrite paths to index.html; use a hash router or a 404 redirect', 'The token expired', 'Caching'],
      answerIndex: 1,
      explanation: 'There is no server logic on Pages. The hash router keeps the route in the fragment, which is never sent to the server.',
    },
    {
      question: 'What does cancel-in-progress: true in a concurrency group do?',
      options: ['Retries failed jobs', 'Cancels an older running deploy when a newer one starts, so the site never regresses', 'Cancels all workflows', 'Speeds up builds'],
      answerIndex: 1,
      explanation: 'Only one run of the group is active. A new push supersedes the old deploy instead of racing it.',
    },
  ],
}
