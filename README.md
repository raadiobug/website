# RadioBug — رادیو باگ

The website for **RadioBug**, a Persian podcast about software testing and quality assurance (QA).

Static, bilingual (فارسی + English), dark/light/system theming, and hosted on GitHub Pages.

🔗 Production: **https://radiobug.net**

---

## Stack

| Concern         | Choice                                                             |
| --------------- | ------------------------------------------------------------------ |
| Framework       | [Astro](https://astro.build) (static output, near-zero JS)         |
| UI islands      | React 19 + [shadcn/ui](https://ui.shadcn.com) (only where needed)  |
| Styling         | Tailwind CSS v4 (CSS-first `@theme`)                               |
| Language        | TypeScript 6 (strict)                                              |
| Content         | Astro Content Collections (episodes are markdown files)            |
| i18n            | Astro built-in routing — `fa` at root, `en` under `/en`, RTL-aware |
| Icons           | `@lucide/astro` + `simple-icons` (brand glyphs), all bundled       |
| Fonts           | Vazirmatn (fa) + Inter (en) — local variable `woff2`, **no CDN**   |
| Package manager | pnpm                                                               |
| Hosting         | GitHub Pages (custom domain `radiobug.net`)                        |

No CDN runtime dependencies — fonts, icons, logo, and the social/OG images are all bundled at build time.

---

## Develop

```bash
pnpm install
pnpm dev          # local dev server (http://localhost:4321)
pnpm build        # production build → ./dist
pnpm preview      # preview the production build
pnpm check        # astro + TypeScript type check
pnpm gen:og       # regenerate public/og.png from the logo
```

Requires Node ≥ 20 and pnpm.

---

## Project structure

```
src/
├── assets/logo/          # logo SVGs (bundled)
├── components/
│   ├── brand/            # Logo, BrandIcon (social/brand glyphs)
│   ├── episodes/         # EpisodeCard, ListenButtons, EpisodePlayer (island)
│   ├── i18n/             # LangToggle
│   ├── nav/              # Header, Footer, MobileNav (island)
│   ├── theme/            # ThemeScript (no-flash), ThemeToggle (island)
│   ├── ui/               # shadcn/ui primitives
│   └── views/            # HomeView, EpisodesView, EpisodeDetailView
├── content/episodes/     # ← episodes live here (one markdown file each)
├── data/socials.ts       # social + listening platform links
├── i18n/                 # ui.ts (dictionaries) + utils.ts (helpers)
├── layouts/BaseLayout.astro
├── lib/                  # episodes.ts, theme.ts, utils.ts
├── pages/                # fa at /, en under /en/
└── styles/global.css     # tokens, fonts, theme
public/
├── fonts/                # Inter + Vazirmatn variable woff2
├── favicon.svg · og.png · robots.txt · CNAME
```

---

## Adding a new episode

Episodes are plain markdown — **add a file, that's it.**

1. Copy the template:
   ```bash
   cp src/content/episodes/_template.md src/content/episodes/004-guest-name.md
   ```
2. Fill the frontmatter (bilingual title/description, guest, date, embeds/links).
   Files starting with `_` are ignored, so `_template.md` never publishes.
3. `pnpm dev` — the new episode appears on the home page and `/episodes`,
   with its own page at `/episodes/<number>` (and `/en/episodes/<number>`).

Notes:

- **Player embeds** (`embed.spotify` / `embed.castbox` / `embed.youtube`) are
  optional. If set, the episode page embeds that player (with a loading skeleton
  and an error fallback). If left empty, it shows "listen on" buttons that fall
  back to the channel links — never a broken iframe.
- `draft: true` hides an episode in production but shows it in `pnpm dev`.
- Publish dates on the seeded episodes are placeholders — update them with the
  real release dates.

---

## Internationalization

- **Persian (`fa`)** is the default and lives at the site root (`/`), rendered RTL with Vazirmatn.
- **English (`en`)** lives under `/en`, LTR with Inter.
- UI strings are in `src/i18n/ui.ts`. Add a key to **both** `fa` and `en` — TypeScript enforces parity.

## Theming

Dark / light / system, defaulting to **system**. An inline script in `<head>`
(`ThemeScript.astro`) applies the theme before first paint, so there is no flash.
The choice is persisted in `localStorage` and the "system" option tracks OS changes live.

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with pnpm
and publishes `dist/` to GitHub Pages.

**One-time setup** in the repo (Settings → Pages):

1. Set **Source** to **GitHub Actions**.
2. Set **Custom domain** to `radiobug.net` (this is also committed as `public/CNAME`).
3. Configure DNS at your registrar to point at GitHub Pages:
   - `A` records for the apex `radiobug.net` →
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (optional) `CNAME` for `www` → `raadiobug.github.io`
4. Enable **Enforce HTTPS** once the certificate is issued.

GitHub then makes `radiobug.net` canonical and **auto-redirects `raadiobug.github.io` → `radiobug.net`**.

---

## Conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
(enforced by commitlint via lefthook). Pre-commit runs Prettier and `astro check`.
Releases/changelogs use git-cliff (`cliff.toml`).
