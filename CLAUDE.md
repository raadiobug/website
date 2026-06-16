# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

RadioBug (رادیو باگ) — static bilingual (fa/en) website for a Persian podcast about QA/software testing. Astro + React islands + Tailwind v4 + shadcn/ui, deployed to GitHub Pages at the custom domain **radiobug.net**.

## Commands

```bash
pnpm dev          # dev server (localhost:4321)
pnpm build        # production build → ./dist
pnpm preview      # serve the built dist
pnpm check        # astro check = TypeScript + Astro diagnostics (the "test" gate)
pnpm format       # prettier --write .
pnpm gen:og       # regenerate public/og.png from the logo (run after logo changes)
```

There is no unit-test suite. `pnpm check` (0 errors AND 0 warnings AND 0 hints) plus a clean `pnpm build` is the bar before committing. `lefthook` runs prettier + `astro check` on pre-commit and commitlint (Conventional Commits, subject ≤50 chars) on commit-msg.

## Architecture

**i18n routing (the core structural decision).** Persian is the default locale and lives at the site **root** (`/`); English lives under `/en`. Set via `astro.config.mjs` `i18n` with `prefixDefaultLocale: false`. There is no automatic locale detection — pages pass a `lang` literal explicitly. The page tree is mirrored: `src/pages/*` (fa) and `src/pages/en/*` (en) are thin wrappers that import a shared `*View.astro` from `src/components/views/` and pass `lang`. **Add a route → add it in both trees.** All locale logic lives in `src/i18n/`:

- `ui.ts` — translation dictionaries. `UISchema = Record<keyof typeof fa, string>` forces fa/en key parity at compile time. Also exports `dir` (rtl/ltr), `localeTag` (fa-IR/en-US), `languages`.
- `utils.ts` — `useTranslations(lang)`, `localizedPath(path, lang)` (prefixes `/en` for English), `stripLocale`, `switchLocalePath` (maps the current URL to the other locale, used for the language toggle and hreflang), `formatNumber` (locale digits, no grouping).

**Content = episodes.** Episodes are markdown files in `src/content/episodes/`, schema in `src/content.config.ts` (glob loader, pattern `**/[^_]*.{md,mdx}` so `_`-prefixed files like `_template.md` never publish). Each episode carries **bilingual** `title`/`description` objects plus a guest, optional per-platform `embed` and `links`. To add an episode: copy `_template.md`, fill frontmatter — no code change. All access goes through `src/lib/episodes.ts` (`getEpisodes` sorts by number desc and drops drafts in PROD; `episodeHref` builds `/episodes/<number>`; `listenLinks` falls back to channel links when an episode has none; `primaryEmbed` picks the first available embed).

**Island boundary.** Astro renders everything static; only genuinely interactive pieces are React islands (`client:load`/`client:visible`): `ThemeToggle`, `MobileNav`, `EpisodePlayer`. Everything else (Header, Footer, cards, logo, brand/social icons) is `.astro` and ships zero JS. Keep new UI in `.astro` unless it needs client state.

**Theme.** dark/light/system, default **system**, persisted in `localStorage['radiobug-theme']`. Two halves that MUST stay in sync: `src/components/theme/ThemeScript.astro` is an inline, dependency-free `<head>` script that applies the theme before first paint (no flash); `src/lib/theme.ts` holds the same logic for the React toggle. If you change the storage key or resolution logic, change both.

**Icons.** `@lucide/astro` in `.astro`, `lucide-react` in islands. lucide v1 (and simple-icons) **dropped brand glyphs** — social/brand marks come from `simple-icons` paths via `src/components/brand/BrandIcon.astro`, with LinkedIn's path hardcoded there (removed from both libraries). `src/data/socials.ts` is the single source of social/platform links.

## Conventions & gotchas

- **Persian rendering**: digits must use `formatNumber(n, lang)` (gives `۲۰۲۶` in fa); never interpolate raw numbers in fa-facing UI. Dates via `formatDate` (Intl → Jalali + Persian digits). Fonts switch per element `lang`, not page locale — global.css maps `[lang='fa']`→Vazirmatn, `[lang='en']`→Inter, so a Persian label inside an English page still needs `lang="fa"` on it (see `LangToggle`).
- **Styling**: Tailwind v4, CSS-first. Design tokens + `@theme` live in `src/styles/global.css` (brand red `#E63946`, ink navy `#2B2D42`). No `tailwind.config.js`. shadcn primitives in `src/components/ui/` — only the ones actually imported are kept.
- **pnpm settings** live in `pnpm-workspace.yaml` (not package.json — removed in pnpm v11). `onlyBuiltDependencies` allowlists native build scripts (esbuild, sharp).
- **Content URL fields** use an `optionalUrl` zod preprocess that coerces `''`/null → undefined, so empty placeholder strings in episode frontmatter validate.
- **Assets are bundled, no CDN**: fonts in `public/fonts/`, logo SVGs in `src/assets/logo/`, favicon/og/CNAME/robots in `public/`.
- **Path alias**: `@/*` → `src/*` (no `baseUrl`; removed for TS 6 compatibility).

## Deploy & release

`.github/workflows/deploy.yml` ("Release & Deploy") is the single workflow. It runs **only on `v*` tags** (plus `workflow_dispatch` for a manual redeploy): `build` → `deploy` (Pages) + `release` (git-cliff changelog → GitHub release, guarded by `if: startsWith(github.ref, 'refs/tags/v')` so a manual dispatch deploys without cutting a release). Node/pnpm versions are a single source of truth in the workflow's top-level `env` (Node 24, pnpm 10).

To ship: bump `version` in `package.json` (shown in the footer, links to releases), commit, then `git tag vX.Y.Z && git push origin main --tags`. The tag fires the workflow.

The custom domain is canonical (`public/CNAME` = `radiobug.net`); site serves at root, so there is no `base` path. If you ever preview on `raadiobug.github.io/website/` instead, you must set `base: '/website/'` and drop the CNAME (root-absolute asset paths otherwise 404).

One-time GitHub setup (also in README): Pages → Source = GitHub Actions; the `github-pages` environment's "Deployment branches and tags" must allow tag pattern `v*` (else tagged deploys are rejected); custom domain + DNS records.
