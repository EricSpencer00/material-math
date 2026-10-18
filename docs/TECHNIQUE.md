# Material rendering in SVG

Decision: use procedural SVG for editable, self-contained brand materials and mathematical geometry. Use physically based 3D rendering when photographic realism is a hard requirement. A container with an embedded bitmap is technically SVG but does not make that bitmap resolution-independent.

## What creates the physical appearance

1. Macro geometry: terraces and offset ellipses establish overlapping surfaces.
2. Albedo: multiple mineral tones, not one flat saturated fill.
3. Mesoscale deformation: low-frequency fractal noise displaces the contours.
4. Microrelief: higher-frequency noise is converted into alpha, which the SVG lighting primitives use as a height field.
5. Light: diffuse response and restrained specular response share a directional light.
6. Occlusion: shadows sit underneath the stepped boundaries.
7. Finish: sparse veins, brushed scratches and broad exposure falloff.

A crucial implementation detail: the lighting primitives read **alpha**, not RGB. Turbulence's visible noise alone is insufficient if alpha stays constant. Our color matrix copies the noise's red channel into alpha before lighting.

The metal uses a strongly directional noise frequency (`.006 .65`) and fine horizontal strokes. Stone uses isotropic grain plus slower contour displacement. The defaults are repeatable through explicit noise and pseudorandom seeds.

## Mathematical animation

The torus uses `x=(R+r cos v) cos u`, `y=(R+r cos v) sin u`, `z=r sin v`, followed by two rotations and orthographic projection. It exports a 144 × 64 mesh of depth-sorted quadrilaterals, with rotated surface normals, directional diffuse shading and a specular highlight. SMIL rotates the projected group over a 24-second eased loop. This is a 2D rotation of projected geometry, not a dynamic 3D camera or a physical light simulation. Static export contains no animation elements. The generator emits an animated torus unless reduced motion is requested. The static prebuilt companion remains available.

Avoid animating high-frequency turbulence continuously. It makes material boil and repeatedly recomputes filters. Keep the material stable and move geometry or light sparingly. A high-density SVG scene can cost more than a compressed image; vector does not imply fast.

## Sources checked, 18 October 2026

- [MDN: feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence): procedural Perlin noise, seeds, octaves and frequency.
- [MDN: feDiffuseLighting](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDiffuseLighting): alpha-height diffuse lighting.
- [MDN: feSpecularLighting](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feSpecularLighting): light response controlled by height, light position and exponent.
- [MDN: animateTransform](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateTransform): portable declarative transform animation.
- [W3C SVG filter specification](https://www.w3.org/TR/SVG11/filters/): filter composition, displacement, lighting and color spaces.

## Limits and next experiments

Pure SVG offers controllable material cues, not full light transport. It cannot reproduce realistic refraction, volumetric inclusions or complex reflected environments with these simple filters. The translucent purple object in the reference especially favors a 3D render. For that direction use Blender/Cycles or a WebGL material, then retain the mathematical overlay as SVG. Do not market this prototype as an exact visual match.

Inspect Chromium, Safari and Firefox before production use; filter color-space behavior and rasterization may differ. Preview and print apps may drop filters entirely. Keep PNG companions for decks and social exports. Generated assets contain no copied logos or third-party photography.

## Verification in this turnaround

Three automated checks pass: deterministic seeds, self-contained output, and static/motion separation with finite closed mathematical paths. Basalt, copper and shaded torus were rendered with librsvg and inspected. The first grain pass and wireframe torus were replaced after visual review. Full browser, responsive and live-animation checks remain unverified: the in-app browser refused the loopback server and the installed-browser connection closed. No claim of cross-browser parity is made.
