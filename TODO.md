# TODO

## Bugs

- [ ] **Post dates can show a day early.** `new Date("2025-11-09")` is UTC midnight, so it renders as the previous day west of UTC and can differ between server and client. Format the date with `timeZone: 'UTC'` or parse it as a local date.
- [ ] **`pnpm lint` doesn't run.** `eslint` isn't installed; only `@tanstack/eslint-config` is.
- [ ] **Some CSS in `grid.tsx` has no effect.** `hsl(var(--card))` is invalid because the tokens are oklch, and `bg-grid-black/[0.07]` isn't a Tailwind v4 utility.

## Performance

- [ ] **Fonts are TTF.** Convert Switzer and Limelight to woff2 (about 50–70% smaller) and preload them.
- [ ] **Limelight is faked in bold.** It has one weight but is declared `100 900` and styled `font-semibold`, so the browser synthesizes bold.
- [ ] **The homepage loads `motion` for nothing.** Its animations are commented out. Restore them or use plain elements.
- [ ] **KaTeX CSS loads on every post.** Load it only on posts that contain math.

## Search engines and accessibility

- [ ] **No per-post `<title>` or meta tags.** Add `head` to `blogs.$slug.tsx`, plus Open Graph tags.
- [ ] **No sitemap or RSS feed.**
- [ ] **Two web manifests, neither linked.** `site.webmanifest` also has empty names. Keep one and link it.
- [ ] **Heading levels skip.** The homepage has two `<h1>`s, and the blog and projects pages start at `<h3>`.
- [ ] **Footer icon links have no labels.** Add `aria-label`s.

## Leftovers

- [ ] **`package.json` is named `odelolajosh.gg`.**

## Content and product

- [ ] **The Projects page is empty.** The homepage links to it, so either fill `projects.ts` or hide the link until there's content.
- [ ] **Projects don't link anywhere.** `Project.github_url` is never rendered.
- [ ] **Posts have no back link and don't show their tags.**
- [ ] **The not-found page is a bare unstyled `<div>`.**
- [ ] **Small text fixes.** "Ops! Nothing yet" should be "Oops", "neareast" should be "nearest", and the neural network post has an empty description.
- [ ] **No tests**, although Vitest and Testing Library are installed. Start with `readPost`: drafts, dates and missing fields.
- [ ] **Frontmatter isn't validated.** Use the `zod` dependency to give clear errors instead of `undefined` titles.

## Content repo (`tolamise-content`)

- [ ] **Create the repo** with `posts/`, `projects.json` and a generated `blog.json` (`slug`, `title`, `excerpt`, `createdAt`, `updatedAt`, `tags`, `readingTime`).
- [ ] **Write `scripts/build-index.ts`** with a pre-commit hook and a CI check. Treat `draft: true` (boolean) and `"yes"` as drafts.
- [ ] **Set `CONTENT_OWNER`, `CONTENT_REPO`, `CONTENT_BRANCH` and `GITHUB_TOKEN`** on the host, including at build time for the snapshot.
- [ ] **Post images.** A private repo can't serve images to browsers, so they need a proxy route or a public host.

## Done

- [x] Content comes from `tolamise-content` via the GitHub API, cached for 5 minutes with ETags, falling back to the last good copy and then a build-time snapshot. `CONTENT_DIR` reads a local clone.
- [x] Devtools load only in dev; they crashed production SSR.
- [x] `tsc --noEmit` passes.
- [x] Removed dead components, unused fonts (Inter, General Sans, Zodiak) and unused packages.
- [x] Theme: `system` follows the OS, the toggle appears on every page, the cookie lasts a year, an invalid cookie falls back to `system`, and the root loader no longer refetches the theme on every navigation.
