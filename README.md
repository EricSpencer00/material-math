# Material / Math

Original procedural stone, metal and mathematical motion. JavaScript generates self-contained SVG; no embedded photographs, external fonts, shaders or runtime dependencies.

## Run

Requires Node 22 or newer.

```sh
npm run build
npm test
npm start
```

Open http://localhost:4317. The gallery starts still. Play motion explicitly; pause returns to the static artwork. Downloads work without JavaScript.

## Assets

| File | Construction |
|---|---|
| `assets/basalt.svg` | Dark mineral terraces, displaced contours, rough relief |
| `assets/terracotta.svg` | Warm fired-earth variant |
| `assets/limestone.svg` | Pale limestone variant |
| `assets/copper.svg` | Anisotropic grain, directional scratches, copper reflection |
| `assets/torus.svg` | Shaded parametric torus, 9,216 depth-sorted faces, 24-second rotation cycle |
| `assets/torus-static.svg` | Static companion for slides and reduced motion |

Change palette, seed, geometry or lighting in `src/build.mjs`, then rebuild. Generators are also exported as functions. Default viewBox is 1600 × 1200; use any display size. SVG filters are rasterized by the viewer, so final sharpness depends on renderer and export resolution. Not every editor supports these filters equally.

```js
import { material, orbit } from './src/build.mjs';
const svg = material('basalt', 42);
```

## High-resolution export

Use a browser or a renderer with SVG lighting-filter support. For example, with librsvg installed:

```sh
rsvg-convert -w 3840 -h 2880 assets/basalt.svg -o basalt-4k.png
```

This creates a raster companion, not an SVG containing a photograph. For animation, embed the SVG with `<object>` or inline it; use the static companion for slides. The gallery intentionally starts still, including for reduced-motion preferences. SVG motion is SMIL, so standalone animation behavior depends on the host viewer.

## Art direction

A tactile studio specimen: warm paper, mineral color and copper reflections. Georgia display type pairs with Helvetica Neue captions. Large asymmetrical studies keep attention on the materials. A neon wireframe treatment was rejected because it loses the physical reference.

See [the technique and primary sources](docs/TECHNIQUE.md). These are original approximations of material photography, not reconstructions of the supplied screenshot; its production method is unknown. For actual optical photorealism, a physically based 3D render remains the stronger route, with SVG used for typography and mathematical overlays.
