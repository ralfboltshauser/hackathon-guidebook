# Guidebook website

A static, single-page design prototype. Each "page" is a fixed 1024px-wide
artboard drawn procedurally in JavaScript and scaled to fit the viewport.
Navigation is hash-based (`#/home`, `#/phases`, `#/deep-dives`, `#/hack`,
`#/skills`, `#/about`).

## Structure

```
index.html            # skeleton: artboard containers + script tags
css/
  styles.css          # all styling
js/
  helpers.js          # GB namespace: drawing primitives, weights, nav, pill
  pages/
    home.js           # each file draws one artboard onto its container
    phases.js
    deep-dives.js
    hack.js
    skills.js
    about.js
  app.js              # builds every artboard, then wires router + scaler
```

Scripts share a single global namespace, `window.GB`, and must load in the
order declared in `index.html`: `helpers.js` → page files → `app.js`.

## Running

No build step. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server
```

Then visit http://localhost:8000. Works on GitHub Pages as-is.
