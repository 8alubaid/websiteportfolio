# Faris Balubaid: Portfolio

A monochrome, pixel-detailed developer portfolio with two interfaces over the same content:

- **Portfolio mode** (`/`): a typographic page with About, a numbered project index with a live preview, Experience, Skills, Education & Certifications, and Contact. Built for anyone, with no terminal knowledge needed. There's no navbar: the opening screen's index (and a side rail on very wide screens) moves between sections.
- **Terminal mode** (`/terminal`): a fullscreen, read-only command interpreter. It opens to an empty prompt, and guidance appears only when the visitor types `help`.

The only persistent control is the small `Portfolio | Terminal` switch in the top-right corner.

Both modes render **one shared, typed content model**. A project is written once in `src/data/projects.ts` and appears in the project index, the detail page, the terminal brief, the terminal filesystem, the sitemap, and the social preview.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript (strict) · Tailwind CSS v4 · Vitest. No animation library, icon set, canvas, or WebGL: the pixel effects are CSS `steps()` animations and SVG.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Dev server                                           |
| `npm run build`     | Production build (all routes prerendered)            |
| `npm start`         | Serve the production build                           |
| `npm run lint`      | ESLint (Next core-web-vitals + TypeScript)           |
| `npm run typecheck` | `tsc --noEmit`                                       |
| `npm test`          | Terminal engine tests + design-system color audit    |

## Design system

### Three colors, nothing else

| Token     | Value     | Used for                                               |
| --------- | --------- | ------------------------------------------------------ |
| `bg`      | `#0B0B0B` | Page and terminal background, text on inverted blocks  |
| `fg`      | `#F2F2F0` | All text, selected states, strong rules, inverted blocks |
| `surface` | `#242424` | Subtle dividers, panel borders, hover and inactive states |

They're defined once in `src/app/globals.css`. Tailwind's default palette is switched off (`--color-*: initial`), so classes like `text-fg`, `bg-surface` and `border-surface` exist and every other color class produces no CSS. There are no gradients, glows, or opacity tints. Hierarchy comes from size, weight (bold for emphasis, light for secondary terminal text), monospace and pixel type, underlines, and the `inverse` utility (fg background, bg text).

`src/lib/design-tokens.test.ts` scans `src/` and fails if any other hex value, `rgb()`/`hsl()` color, gradient, or palette class appears. The only inline hex values are the three tokens in `icon.svg`, which can't read CSS variables.

### Typography

Inter for body text, Inter Tight for headings, JetBrains Mono for the terminal and technical labels, and Silkscreen (pixel face) for a few short labels only (`.pixel-label`). Long text is never set in the pixel face.

### Pixel animation system

Every animation runs on `steps()`, so blocks snap rather than fade. All of it is skipped or completed instantly under `prefers-reduced-motion`.

| Piece | Where | How |
| --- | --- | --- |
| **Signature mark** (`components/pixel/PixelMark.tsx`) | Opening screen | The "FB" initials assemble pixel by pixel over a charcoal offset shadow. Server-rendered SVG with deterministic CSS delays, so it costs no JavaScript and ends as a static mark. |
| **Pixel reveal** (`components/pixel/PixelReveal.tsx`) | Section headings, project title | When first scrolled into view, a grid of solid blocks flashes over the heading in stepped waves (under 0.6 s), then unmounts. The text is never hidden, even without JavaScript. |
| **Pixel hover** (`.pixel-indicator` in `globals.css`) | Project index, page index, prev/next | A square grows in 4 discrete steps on hover/focus/active. Dividers in the project index step to full white on the active entry. |
| **Pixel wipe** (`animate-pixel-wipe`) | Project preview, brief tabs, project summary | Content enters in 8 vertical slices. |
| **Block cursor** (`TerminalApp.tsx`) | Terminal prompt | An inverted character cell that blinks with `steps(1)` and sits on the character under the caret. |

### Pixel art assets

The signature mark is drawn from bitmap data in `src/components/pixel/glyphs.ts` (5×7 grids of `0`/`1`). Edit those strings, or add letters, to change it.

To use artwork made in **Aseprite** or **Piskel** instead:

1. Export a PNG at 1× (one image pixel per art pixel), using only `#0B0B0B`, `#F2F2F0` and `#242424` (or transparency).
2. Put it in `public/pixel/`, for example `public/pixel/mark.png`.
3. Render it scaled up by a whole number with crisp edges: `<img src="/pixel/mark.png" width={…} height={…} style={{ imageRendering: "pixelated" }} alt="" />`. For an animated sprite sheet, use the PNG as a `background-image` and step `background-position` with `steps(<frames>)`.

## Project structure

```
src/
  app/
    page.tsx                 Portfolio home (opening screen + all sections)
    projects/[slug]/page.tsx Project detail (recruiter overview / engineering deep dive)
    terminal/page.tsx        Fullscreen terminal
    (public/og.png)          Social preview image, declared in data/site.ts
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
  components/
    portfolio/               Hero, About, ProjectIndex, SectionRail, SectionHeading, Experience, Skills, Certifications, Contact, BriefTabs, PipelineDiagram
    pixel/                   PixelMark (signature), PixelReveal, glyphs
    terminal/                TerminalApp (input, block cursor, history, effects), TerminalOutput (block renderer)
    layout/                  ModeSwitch (floating Portfolio | Terminal switch)
    ui/                      CopyButton
  data/                      ← all portfolio content lives here
    profile.ts  projects.ts  skills.ts  experience.ts  credentials.ts  sectors.ts  site.ts
  lib/
    terminal/                Pure TS, no React: parser, filesystem, views, commands, engine, autocomplete, session (+ tests)
    design-tokens.test.ts    Three-color audit
    focus.ts                 shared "current project" for mode switching
  types/portfolio.ts         content model
```

### How the terminal works

`execute()` is a pure function: it parses the line, finds the command, and returns **output blocks** (headings, rows, tags, links, clickable commands…) plus **effects** (`clear`, `cwd`, `navigate`, `focus-project`). The React layer only renders blocks and applies effects, so command logic is unit-tested without a browser. Output tones are `default | strong | muted`, which map to font weight, never to color. It's a controlled portfolio interface, not a shell: nothing is executed, and there's no access to real files or environment variables.

### Virtual filesystem

`src/lib/terminal/filesystem.ts` generates a read-only tree from the shared data: `/` contains `home/faris/` (home, shown as `~`), which holds `about.txt`, `experience.log`, `contact.txt`, `projects/<slug>/` (`README.md`, `overview.txt`, `engineering.md`), `skills/` and `credentials/`. Paths are absolute internally; `resolvePath(cwd, input)` handles absolute, `~`, relative, `.`/`..` and trailing slashes, and an empty path means the working directory. `cd`, `ls`, `cat`, `open`, Tab completion and clickable `ls` entries all go through that one resolver. The prompt abbreviates home as `~`; `pwd` prints the absolute path.

### Mode switching & deep links

- `/projects/<slug>` opens a project in Portfolio mode. `#engineering` opens the deep-dive tab. Old `/missions/<slug>` links redirect permanently.
- `/terminal?run=<command>` runs a command on load, e.g. `/terminal?run=projects%20stm32-tetris`.
- `/?sector=ai#projects` opens the project index filtered to an area.
- The switch carries context: from a project page it opens that project in the terminal, and `mode portfolio` (or the switch) returns to the last project viewed in the terminal. `mode explorer` still works as an undocumented alias. The terminal transcript is kept while you move between modes.

## Editing content

All content is in `src/data`. Types in `src/types/portfolio.ts` will flag anything missing.

- **Add a project**: append to `projects` in `src/data/projects.ts`. Its position sets the project number. `name` and `discipline` drive the index; give it a unique `slug` (it becomes the URL, the terminal directory, and a Tab-completion target). `engineering`, `results`, `links`, and `notes` are optional and render only when present. Only list verified results.
- **Skills**: `src/data/skills.ts`. **Timeline**: `src/data/experience.ts` (`kind: "employment" | "education" | "training" | "certification" | "project"`; employment is shown inverted so it can't be confused with the rest). **Degrees & certifications**: `src/data/credentials.ts` (add `verifyUrl` for Credly links).
- **Contact & résumé**: `src/data/profile.ts`. Any link set to `null` is hidden everywhere. To publish a résumé, put the PDF in `public/resume/` and set `contact.resume` to `"/resume/<file>.pdf"`. The download links and the `resume` command appear automatically.

### Content still to confirm (marked `EDIT:` in the code)

| Item | Where |
| --- | --- |
| LinkedIn URL (currently hidden) | `profile.ts` |
| Résumé PDF (currently hidden; the old résumé found locally predates the ECE degree and wasn't used) | `profile.ts` |
| Preferred email (currently the colorado.edu address) | `profile.ts` |
| Exact graduation term ("2022 – Graduated") | `credentials.ts`, `experience.ts` |
| Credly verification links for both AWS certs | `credentials.ts` |
| Balloon altitude (~25 km comes from the brief; local logs only cover ground tests) and your exact capstone role | `projects.ts` |
| STM32 Tetris details (no source files were available, so the entry is minimal and the language is assumed to be C) | `projects.ts` |

## Adding a terminal command

Append an object to `commands` in `src/lib/terminal/commands.ts`:

```ts
{
  name: "uptime",
  aliases: ["status"],
  group: "system",
  summary: "Show site status",
  usage: "uptime",
  complete: (index) => (index === 0 ? ["--verbose"] : []),   // optional Tab completion
  run: (input, ctx) => ({
    blocks: [{ type: "line", spans: [{ text: "All good", tone: "strong" }] }],
    announce: "All good",                                    // screen-reader summary
  }),
}
```

It's automatically available to `help <name>`, Tab completion, and typo suggestions. Add it to the `directory` list to show it in the main `help` output, and add a test in `terminal.test.ts`.

## Accessibility & motion

- Semantic landmarks, skip link, visible focus outlines (fg), and ARIA tabs on project pages.
- Terminal output is a `role="log"` with live announcements turned off. A separate polite live region announces a one-line summary per command.
- Commands named in terminal output are clickable, and everything in the terminal is also reachable in Portfolio mode, so typing is never required.
- The terminal tracks the visual viewport, so the prompt stays above mobile keyboards, and the page behind it never scrolls.
- `prefers-reduced-motion` skips the pixel reveal, shows the finished signature mark immediately, stops the cursor blink, and removes stepped transitions.

## Deploying to GitHub Pages

The site builds as a fully static export (`output: "export"` in `next.config.ts`) into `out/`, and `.github/workflows/deploy.yml` publishes it on every push to `main`. The workflow runs lint, type-check and tests first, so a failing check never deploys.

One-time setup on GitHub:

1. Create a repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push (or run the workflow from the **Actions** tab). The live URL appears in the workflow run and under Settings → Pages.

URLs and base path are automatic. The workflow reads them from GitHub (`actions/configure-pages`) and passes `PAGES_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` to the build:

| Repository name | Site URL | Base path |
| --- | --- | --- |
| `8alubaid.github.io` | `https://8alubaid.github.io/` | none |
| anything else, e.g. `portfolio` | `https://8alubaid.github.io/portfolio/` | `/portfolio` |

To test the exported site locally under a sub-path (Git Bash needs `MSYS_NO_PATHCONV=1` so it doesn't rewrite the path):

```bash
MSYS_NO_PATHCONV=1 PAGES_BASE_PATH=/portfolio npm run build
```

Then serve a folder that contains `out/` renamed to `portfolio/`. Locally, `npm run dev` needs no variables.

Static-hosting notes:

- `next/link` and the router add the base path automatically. Raw URLs (the résumé link) go through `withBasePath` in `src/lib/base-path.ts`.
- The social preview image is a static file, `public/og.png`, declared in `src/data/site.ts`. If you change the headline or the number of projects, replace it with a new 1200×630 PNG.
- GitHub Pages serves `404.html` for unknown paths, and there are no server redirects.
