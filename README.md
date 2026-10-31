# Faris Balubaid: Portfolio

A minimalist, monospaced engineering portfolio. Every section shares one layout: the profile (pixel "FB" avatar, name, short bio, links) sits in a narrow left column, and the section's content sits on the right. Seven sections live in the top navigation:

`home` · `projects` · `experience` · `writing` · `videos` · `reading` · `certifications`

There's also a **terminal** (`/terminal`): a fullscreen, read-only command interpreter over the same content, linked from the home page. It opens to an empty prompt, and guidance appears only when the visitor types `help`.

Everything renders from **one shared, typed content model** in `src/data`. A project is written once in `src/data/projects.ts` and appears in the projects list, its detail page, the terminal, and the sitemap.

## Stack

Next.js 16 (App Router, static export) · TypeScript (strict) · Tailwind CSS v4 · Vitest. No animation library, icon set, canvas, or WebGL.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Dev server                                           |
| `npm run build`     | Production build (static export to `out/`)           |
| `npm run lint`      | ESLint (Next core-web-vitals + TypeScript)           |
| `npm run typecheck` | Route types + `tsc --noEmit`                         |
| `npm test`          | Terminal engine, pixel wipe, and color-audit tests   |

## Design system

### Three colors

| Token     | Value     | Used for                                               |
| --------- | --------- | ------------------------------------------------------ |
| `bg`      | `#0B0B0B` | Page background (dark); text (light)                   |
| `fg`      | `#F2F2F0` | Text (dark); page background (light)                   |
| `surface` | `#242424` | Charcoal accents, the same in both themes              |

Light mode swaps `bg` and `fg`. Two derived tones follow the theme automatically: `muted` (secondary text, inactive nav) and `rule` (hairline dividers). Both are `fg` mixed into `bg` with `color-mix()`, so they stay solid and inside the palette. Everything is defined once in `src/app/globals.css`. Tailwind's default palette is switched off (`--color-*: initial`), so any other color class produces no CSS. There are no gradients.

`src/lib/design-tokens.test.ts` scans `src/` and fails if any other hex value, `rgb()`/`hsl()` color, gradient, or palette class appears. The one deliberate exception is `src/styles/legacy-farisbalubaid.css`, which recreates the old site's look on `/compare/`.

### Typography

- **Fragment Mono** for nearly all text: navigation, body, metadata, terminal. It's the face the reference design uses.
- **Inter Tight Light** for the name and page titles.
- **Silkscreen** (pixel face) for a few short labels on the writing pages.

To change the interface font, swap the import in `src/app/layout.tsx` and the `--font-mono` token in `globals.css`. The type scale is a set of tokens in the same `@theme` block (`--text-nav`, `--text-body`, `--text-aside`, `--text-meta`, `--text-heading`, `--text-name`), used as `text-body`, `text-meta`, and so on.

### Motion

- **Theme switch** (`src/lib/theme.ts`, `src/lib/pixel-wipe.ts`): the new theme is revealed from the right edge toward the left in square pixel tiles, via the View Transitions API. Reduced motion or an unsupported browser switches instantly. The choice is saved in `localStorage` (`fb:theme`), first visits follow the OS, and an inline script applies it before first paint.
- **Navigation**: inactive links are muted, and a hairline underline draws in under the hovered and current link.
- **Page content** settles in with a short rise when a section opens (`app/(site)/template.tsx`).
- **Avatar**: the "FB" initials assemble pixel by pixel (`components/pixel/PixelMark.tsx`). No photo has been supplied; to use one, put it in `public/` and swap it in `components/site/ProfileAside.tsx`.
- **Terminal**: a blinking block cursor.

All of it is skipped or completed instantly under `prefers-reduced-motion`.

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
    (site)/                  The seven sections, sharing the two-column layout
      layout.tsx             Profile column + content column
      template.tsx           Entry animation on every section change
      page.tsx               home
      projects/page.tsx      projects list
      projects/[slug]/       project detail
      experience/  writing/  videos/  reading/  certifications/
    case-study/, compare/    The two writing pieces (listed on /writing/)
    terminal/page.tsx        Fullscreen terminal
    layout.tsx               Fonts, theme boot script, header
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
  components/
    layout/                  SiteHeader, SiteNav, ThemeToggle, InlineScript
    site/                    ProfileAside, SocialLinks, Page (PageHeader, PageSection, EntryHead, EmptyState)
    portfolio/               CaseStudy, SplitCompare, FocusProject
    pixel/                   PixelMark (avatar initials), PixelReveal, glyphs
    terminal/                TerminalApp, TerminalOutput
  data/                      ← all portfolio content lives here
    profile.ts  projects.ts  experience.ts  credentials.ts  skills.ts
    writing.ts  videos.ts  reading.ts  case-study.ts  sectors.ts  site.ts (navigation)
  lib/
    terminal/                Pure TS, no React: parser, filesystem, views, commands, engine, autocomplete, session (+ tests)
    theme.ts, theme-boot.ts  Theme store and no-flash boot script
    pixel-wipe.ts            Theme-wipe geometry (+ tests)
    layout.ts                Page container width, path helper
    design-tokens.test.ts    Color audit
  types/portfolio.ts         Content model
```

### How the terminal works

`execute()` is a pure function: it parses the line, finds the command, and returns **output blocks** (headings, rows, tags, links, clickable commands…) plus **effects** (`clear`, `cwd`, `navigate`, `focus-project`). The React layer only renders blocks and applies effects, so command logic is unit-tested without a browser. Output tones are `default | strong | muted`, which map to font weight, never to color. It's a controlled portfolio interface, not a shell: nothing is executed, and there's no access to real files or environment variables.

### Virtual filesystem

`src/lib/terminal/filesystem.ts` generates a read-only tree from the shared data: `/` contains `home/faris/` (home, shown as `~`), which holds `about.txt`, `experience.log`, `contact.txt`, `projects/<slug>/` (`README.md`, `overview.txt`, `engineering.md`), `skills/` and `credentials/`. Paths are absolute internally; `resolvePath(cwd, input)` handles absolute, `~`, relative, `.`/`..` and trailing slashes, and an empty path means the working directory. `cd`, `ls`, `cat`, `open`, Tab completion and clickable `ls` entries all go through that one resolver. The prompt abbreviates home as `~`; `pwd` prints the absolute path.

### Deep links

- `/projects/<slug>/` opens a project. `/terminal?run=<command>` runs a command on load, e.g. `/terminal?run=projects%20stm32-tetris`.
- A project page links to the same project in the terminal, and the terminal's "← portfolio" link returns to the last project viewed. The terminal transcript is kept while you move around the site.

## Editing content

All content is in `src/data`. Types in `src/types/portfolio.ts` will flag anything missing.

- **Projects**: append to `projects` in `projects.ts`. Give it a unique `slug` (it becomes the URL, the terminal directory, and a Tab-completion target). `engineering`, `results`, `links`, and `notes` are optional and render only when present. Only list verified results.
- **Experience**: `experience.ts` (`kind: "employment" | "education" | "training" | "certification" | "project"`), newest first. Training entries also appear on the certifications page.
- **Certifications & education**: `credentials.ts`. Add `verifyUrl` for a Credly link and it shows as "verify".
- **Writing**: `writing.ts`. `href` is a page on this site (`/case-study/`) or a full URL for writing published elsewhere.
- **Videos**: `videos.ts`. Each entry needs the real video URL; `thumbnail` is an optional image under `public/`.
- **Reading**: `reading.ts`. `title`, `source`, and optionally `href`, `note`, `status` (`reading` / `finished`), and `date`.
- **Skills**: `skills.ts` (shown on the experience page). **Navigation**: `navigation` in `site.ts`.
- **Profile, bio & links**: `profile.ts`. Any contact link set to `null` is hidden everywhere, including its icon. To publish a résumé, put the PDF in `public/resume/` and set `contact.resume` to `"/resume/<file>.pdf"`.

Empty sections (videos and reading, for now) show a plain "nothing yet" note instead of placeholder entries.

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

- Semantic landmarks, skip link, visible focus outlines (fg), and `aria-current` on the active section.
- Terminal output is a `role="log"` with live announcements turned off. A separate polite live region announces a one-line summary per command.
- Commands named in terminal output are clickable, and everything in the terminal is also on the regular pages, so typing is never required.
- The terminal tracks the visual viewport, so the prompt stays above mobile keyboards, and the page behind it never scrolls.
- `prefers-reduced-motion` switches themes instantly, shows the finished avatar immediately, stops the cursor blink, and removes transitions.

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
