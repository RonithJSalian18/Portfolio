# Ronith J Salian: Portfolio

A personal portfolio styled as a trip from space to the bottom of the sea. An illustrated 3D Earth turns to the
coast of Karnataka and dives through a cloud onto a beach; scrolling past the beach takes you under the waves and
down through a shallow reef, open water, the twilight zone and the deep sea, with a diver exploring along the
way. Day and night themes (sun and moon) switch every scene.

Built with Next.js (App Router), React, TypeScript and Tailwind CSS v4. The intro is a small hand-written
WebGL 2 renderer (no 3D library).

## Getting started

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm lint
pnpm build   # type-checks and builds for production
```

Set `NEXT_PUBLIC_SITE_URL` to your domain if you use a custom one (link previews use it). On Vercel the
production URL is picked up automatically.

## Where things live

| Path | What it is |
| --- | --- |
| `lib/content.ts` | All the text: bio, skills, projects, timeline, achievements, links, and the beach coordinates |
| `app/styles/tokens.css` | Design tokens for both themes (sky, sea, water depths, text, glow) |
| `components/intro/` | The globe intro: renderer (`globe.ts`), shaders, camera path, and the shared lat/long maths (`geo.ts`) |
| `scripts/globe-textures.mjs` | Builds the illustrated globe maps in `public/intro/` from NASA data |
| `components/beach/` | Background life on the beach (gulls, sailboat, lighthouse, surfers, beach finds) |
| `components/ocean/` | The dive under the waterline, the depth zones, sea life and the diver |
| `components/sections/` | The page sections |

Section to ocean zone: About and Skills are in the **shallow reef**, Projects and Experience in **open water**,
Achievements and Quotes in the **twilight zone**, and Contact in the **deep sea**, with the footer as the seafloor.

## Performance and accessibility notes

- The intro, each ocean zone's animals and the diver are separate chunks, loaded only when needed. Animations
  pause while off-screen.
- Phones and low-end devices (`data-lite`) get smaller textures, fewer satellites, animals and particles.
- The intro plays once per session, is skipped for links to a section, and is skipped when WebGL isn't
  available or would run without a GPU.
- With `prefers-reduced-motion`, the intro is a still frame and every scene is static.
- The beach coordinates live in `config/site.ts`. Add `?globe-debug` to the URL to stop the dive above the
  beach, mark it, and print where it lands on screen (it should be the exact center).
- Text contrast meets WCAG AA in both themes in every zone.

## Asset credits

Everything is public domain, openly licensed, or made for this project.

**Globe maps** (`public/intro/`), built by `scripts/globe-textures.mjs` from these originals:

| File | Made from | License |
| --- | --- | --- |
| `globe-color-*.webp`, `globe-coast-1024.webp` | NASA Blue Marble Next Generation, December, with topography and bathymetry ([5400×2700 JPEG](https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg)), flattened into biome colors and a coastline distance map | Public domain (NASA) |
| `globe-local-*.webp` | The same series' 500 m tile C1 ([21600×21600 JPEG](https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x21600x21600.C1.jpg)), for a 16° square around the beach | Public domain (NASA) |
| Relief and coastline checks in both | Elevation (GEBCO_08 grid) from NASA Visible Earth ([21600×10800 PNG](https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73934/gebco_08_rev_elev_21600x10800.png)) | Public domain (NASA / GEBCO) |
| `globe-lights-512.webp` | NASA Black Marble 2016, Earth at night ([0.1° JPEG](https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg)) | Public domain (NASA) |

NASA imagery is not copyrighted; see the [NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).
The GEBCO grid is placed in the public domain by GEBCO.

**Made for this project:** the caustics texture (`public/ocean/caustics.webp`, generated procedurally), the
intro's satellites, space station, low-poly clouds and stars (built in code), and all SVG illustrations (sea
life, diver, beach scenes, shells, icons).

**Fonts and icons:** [Poppins](https://fonts.google.com/specimen/Poppins) under the SIL Open Font License
(`assets/fonts/OFL.txt`); icons from [Lucide](https://lucide.dev) (ISC license).
