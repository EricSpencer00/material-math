# material math

[Open the generator](https://ericspencer.us/material-math/)

Click **Randomize**. Everything disappears. A seeded material is generated in your browser; after it is visible alone for one second, Download SVG, Embed and Randomize appear. Escape returns to the start.

No backend, API keys, database, framework, external fonts or runtime dependencies. GitHub Pages serves ordinary HTML, CSS and JavaScript. Node is optional tooling for regenerating the prebuilt SVG files and running tests.

## Direct links

- Generator: `/?kind=basalt&seed=42`
- Image-only embed: `/embed.html?kind=copper&seed=42`
- Prebuilt files: `/assets/basalt.svg`, `/assets/terracotta.svg`, `/assets/limestone.svg`, `/assets/copper.svg`, `/assets/torus.svg`, `/assets/torus-static.svg`

Paths above are relative to the project root, `https://ericspencer.us/material-math/`. The Embed button produces the full iframe snippet. The same kind and seed reproduce the same SVG. Available kinds: `basalt`, `terracotta`, `limestone`, `copper`, `torus`, `sandstone`, `slate`, `jade`, `travertine`, `bronze`, `silver`. Seeds vary lighting, grain, strata geometry and torus proportions; each kind accepts all 4,294,967,296 unsigned 32-bit seeds.

## Local development

Node 22 or newer:

```sh
npm start
npm test
npm run build
```

Open http://localhost:4317. `src/engine.mjs` is the shared browser-compatible math engine; `src/build.mjs` only writes its output to disk. All randomization runs locally, including in embedded views.

## Artwork

Seeded noise, displaced contours, microrelief lighting, shadows and layered mineral color generate stone and metal. A depth-sorted parametric mesh generates the torus. The torus honors reduced-motion preferences at generation time; the static prebuilt companion contains no animation. SVG filters rasterize at the viewer's chosen resolution and may differ across renderers. These are procedural material studies, not full physically based light transport.

See [technique and primary sources](docs/TECHNIQUE.md). Original procedural artwork, without embedded photographs or copied logos.

[Eric Spencer](https://ericspencer.us/)

## Lock a choice

On the start screen, **don't randomize** opens material selection and three color pickers (shadows, midtones, highlights). Lock material and colors independently; Randomize still varies geometry, lighting and texture. The locks remain active for subsequent generations. Custom colors are included in share URLs, embeds and downloaded SVGs. Escape returns to these controls.
