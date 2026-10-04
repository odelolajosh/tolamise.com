# TODO

## Bugs

- [ ] **The blog is likely empty in production.** `src/lib/api.ts` reads `src/data/posts` from disk relative to the working directory, and the files aren't in `.output/`. The content repo plan in the [README](README.md#planned-content-without-redeploys) fixes this. A stopgap is `import.meta.glob('/src/data/posts/*.md', { query: '?raw', eager: true })`.
- [ ] **`draft: false` hides a post.** `data.draft?.toLowerCase()` throws when YAML reads `draft` as a boolean, and the error drops the post. Use `data.draft === true || data.draft === 'yes'`.
- [ ] **Post dates can show a day early.** `new Date("2025-11-09")` is UTC midnight, so it renders as the previous day west of UTC and can differ between server and client. Format the date with `timeZone: 'UTC'` or parse it as a local date.
- [ ] **Devtools ship to production.** Wrap `TanStackDevtools` in `__root.tsx` with `import.meta.env.DEV`.
- [ ] **`tsc --noEmit` fails.**
  - `markdown.tsx` uses the `inline` prop, which react-markdown v9+ removed.
  - `navigation.tsx` uses `Omit<keyof …, '/'>` where it needs `Exclude<…>`.
- [ ] **`pnpm lint` doesn't run.** `eslint` isn't installed; only `@tanstack/eslint-config` is.
- [ ] **Blog card links are untyped.** `blog-card.tsx` uses `<Link to={blog.slug}>`. Use `to="/blogs/$slug" params={{ slug }}`.
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

- [ ] **`remark-gfm` is installed but not used.** Pass it to `<ReactMarkdown remarkPlugins>` so tables and strikethrough render.
- [ ] **`package.json` is named `odelolajosh.gg`.**
- [ ] **shadcn config with no components.** `components.json` and `.cursorrules` are set up for shadcn, but the site has no shadcn components. Remove them or start using it.

## Content and product

- [ ] **The Projects page is empty.** The homepage links to it, so either fill `projects.ts` or hide the link until there's content.
- [ ] **Projects don't link anywhere.** `Project.github_url` is never rendered.
- [ ] **Posts have no back link and don't show their tags.**
- [ ] **The not-found page is a bare unstyled `<div>`.**
- [ ] **Small text fixes.** "Ops! Nothing yet" should be "Oops", "neareast" should be "nearest", and the neural network post has an empty description.
- [ ] **No tests**, although Vitest and Testing Library are installed. Start with `readPost`: drafts, dates and missing fields.
- [ ] **Frontmatter isn't validated.** Use the `zod` dependency to give clear errors instead of `undefined` titles.

## Done

- [x] Removed dead components, unused fonts (Inter, General Sans, Zodiak) and unused packages.
- [x] Theme: `system` follows the OS, the toggle appears on every page, the cookie lasts a year, an invalid cookie falls back to `system`, and the root loader no longer refetches the theme on every navigation.
