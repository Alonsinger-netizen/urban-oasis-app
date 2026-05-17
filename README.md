# Urban Oasis App

Single-page React/Vite app for the Urban Oasis hotel dashboard.

## App Structure

- `index.html` is the only HTML entry point.
- `src/main.jsx` contains the SPA shell and pages.
- `src/index.css` contains Tailwind imports plus app-specific CSS.
- Staff roster and inventory are SPA pages, not standalone HTML files.
- Do not re-add `roster.html`, `inventory.html`, or `reservations.html`.

## Local Development

```bash
npm install
npm run dev
```

Build locally before deployment-related changes:

```bash
npm run build
```

Vite may warn that the JS chunk is larger than 500 kB. That warning is currently expected and does not fail the build.

## GitHub Pages Deployment

Deployment is intentionally branch-based GitHub Pages.

The production URL is:

```text
https://alonsinger-netizen.github.io/urban-oasis-app/
```

Because this is a project Pages site, `vite.config.js` must keep:

```js
base: '/urban-oasis-app/',
```

Changing this base path will break loaded CSS/JS assets on GitHub Pages.

## Deploy Flow

Every push to `main` triggers:

1. `.github/workflows/deploy-gh-pages.yml`
2. GitHub Actions installs dependencies with `npm ci`
3. GitHub Actions runs `npm run build`
4. The workflow publishes `dist/` to the `gh-pages` branch
5. GitHub Pages' internal `pages build and deployment` job publishes the `gh-pages` branch

Seeing two GitHub jobs is expected:

- `Deploy GitHub Pages`: this repo's workflow that builds and updates `gh-pages`
- `pages build and deployment`: GitHub Pages' internal publishing job

## Required GitHub Pages Setting

In GitHub:

```text
Settings -> Pages
Source: Deploy from a branch
Branch: gh-pages
Folder: / (root)
```

Do not set Pages to deploy directly from `main`, because `main` contains source code, not the built Vite assets.

## Notes For AI Agents

- Keep deployment source as `gh-pages` branch/root unless explicitly asked otherwise.
- Do not replace this with direct `main` Pages hosting.
- Do not remove `.nojekyll` creation from the deploy workflow.
- Keep `.claude/settings.local.json` out of commits unless the user explicitly asks to version local tool settings.
