# carobarreirov.github.io

Personal portfolio and professional profile for Carolina Barreiro Valdez,
published as a static site on GitHub Pages.

## Design direction

The interface follows a warm editorial research aesthetic: paper-like surfaces,
terracotta and rose accents, strong typographic hierarchy, sharp grids, and
restrained motion. It intentionally avoids framework-default cards and visual
effects that compete with the writing.

The production page has no third-party runtime dependency. Typography uses
carefully selected system font stacks, icons are local or text-based, and all
styles and scripts are served from this repository.

## Architecture

```text
.
├── index.html                   Semantic content and progressive fallbacks
├── style.css                    Local stylesheet manifest
├── styles/
│   ├── tokens.css               Themes, type scale, spacing, and motion tokens
│   ├── base.css                 Reset, document defaults, and accessibility
│   ├── layout.css               Editorial grids and responsive composition
│   ├── components.css           Navigation, cards, lists, controls, and dialog
│   └── motion.css               Transitions and reduced-motion behavior
├── js/
│   ├── main.js                  Feature initialization
│   └── modules/
│       ├── bio-language.js      Biography language selector
│       ├── menu.js              Accessible mobile navigation
│       ├── motion.js            Native in-view reveal animation
│       ├── navigation.js        Active section state
│       ├── papers-viewer.js     Native dialog PDF preview
│       └── theme.js             Theme switching and persistence
├── assets/                      Local images, PDFs, and CVs
└── tests/                       DOM behavior and markup smoke tests
```

The native PDF dialog and animations are progressive enhancements. Papers remain
normal links if JavaScript is unavailable, and reveal animations use the browser
Web Animations and Intersection Observer APIs rather than a runtime library.

## Themes

The active theme is selected with the `data-theme` attribute on `<html>`:

```html
<html data-theme="terracotta"></html>
```

Three themes are defined in `styles/tokens.css`:

- `terracotta` — warm paper, terracotta, and the original rose accent.
- `rose` — softer rose surfaces with berry emphasis.
- `ink` — a dark editorial theme with warm coral details.

Components only consume semantic variables such as `--surface-page`,
`--text-primary`, and `--accent-primary`. To redesign or add a theme, update a
single token block instead of changing component selectors.

## Local development

Use the Node version declared in `.nvmrc`:

```sh
nvm use
npm ci
npm run dev
```

Then open <http://localhost:5501>.

Create an optimized, dependency-free production bundle with:

```sh
npm run build
```

Vite writes the generated site to `dist/`. The unbuilt source also works as a
static site because it uses browser-native modules and local relative URLs.

## Quality checks

Run the complete quality gate before pushing:

```sh
npm run check
```

This checks formatting, JavaScript, HTML, local asset references, accessibility
relationships, interactions, theme switching, and the production build. GitHub
Actions runs the same command for every pull request and push to the default
branch.

## Updating content

- Edit biography and professional history directly in `index.html`.
- Add a paper to `assets/papers/`, then add a normal `.paper-link` entry to
  `#paper-list`.
- Replace CV PDFs in `assets/cv/` while keeping their filenames, or update both
  language links.
- Keep external links using `target="_blank"` paired with
  `rel="noopener noreferrer"`.
- Use existing semantic tokens and components before adding one-off styles.

Run `npm run check` after changing content, file paths, themes, or interactions.
