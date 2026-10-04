# Ronith J Salian: Portfolio

A personal portfolio styled as a trip from space to the bottom of the sea. An illustrated 3D Earth turns to
India's southwest coast and dives through a cloud onto a beach; scrolling past the beach takes you under the waves and
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

## Editing the content

- **All the text** lives in `data/profile.ts`, taken from the résumé: bio and facts, skills (grouped), projects,
  experience and education, achievements, links, and the search and link-preview text. Each project lists the
  skills it uses; that's what the skills sonar shows when you pick a skill.
- **Site settings** live in `config/site.ts`: the beach coordinates the globe lands on, the site address used for
  link previews (`NEXT_PUBLIC_SITE_URL` overrides it).
- **The résumé** is `public/resume.pdf`. The navbar, hero and contact buttons all use `RESUME_URL` in
  `data/profile.ts` and open it in a new tab; replace the file to update it.

## Where things live

| Path | What it is |
| --- | --- |
| `data/profile.ts` | All the content |
| `config/site.ts` | Beach coordinates, site address, résumé path |
| `app/styles/` | Design tokens for both themes (`tokens.css`) and one stylesheet per part of the page |
| `components/intro/` | The globe intro: renderer (`globe.ts`), shaders, camera path, and the shared lat/long maths (`geo.ts`) |
| `scripts/globe-textures.mjs` | Builds the illustrated globe maps in `public/intro/` from NASA data |
| `components/SkillSonar.tsx` | The skills sonar: grouped skill chips, the "used in" readout, and the decorative scope |
| `components/ocean/` | The dive under the waterline, the depth zones and their animals (`life/`), and the diver (`Diver.tsx`, `diverRig.ts`, `MiniDiver.tsx`) |
| `components/beach/` | Life on the beach (gulls, sailboat, lighthouse, surfers, beach finds) |
| `components/sections/` | The page sections |

## Sections and ocean zones

| Zone | Sections | The diver |
| --- | --- | --- |
| Beach | Hero | — |
| Shallow reef | About | Waves at the reef animals |
| Open water | Skills, Projects | Points at project cards; checks its watch or compass in between |
| Twilight zone | Experience & Education, Achievements | Turns its head toward the timeline |
| Deep sea | Contact (the footer is the seafloor) | Switches its headlamp on; the beam lights nearby content, most at night |

Screens 1280px and wider have the full diver in the left margin. Narrower screens get a mini diver that swims
through the gaps between sections, like the fish.

## Performance and accessibility

- The intro (about 12 KB of code, gzipped) and its maps (about 150 KB, 110 KB on low-end devices) only load when
  it plays. It caps the canvas resolution, pauses the page underneath, and releases its GPU memory and WebGL
  context when it ends. It's skipped once per session, for links to a section, and without a GPU.
- Each ocean zone's animals, the diver and the sonar's scope load or start only when they're near the screen,
  and everything off-screen pauses.
- Animations run on the compositor (transform and opacity only). If you add some, keep to these rules:
  - Animate whole elements (an HTML element or a whole `<svg>`), not parts inside an SVG. Those cost the main
    thread a style and paint update on every frame, for every animation on the page.
  - On an `<svg>` element, use `transform` in the keyframes, not the separate `rotate`, `scale` or `translate`
    properties; Chrome won't composite those on SVG.
  - React listens for animation events on the whole document, so every time a looping animation repeats, the
    main thread has to wake up. Short repeating motions are written as several cycles per iteration.
  - Hide theme-specific things with `display: none`, not `opacity: 0`: an invisible animation still runs on the
    main thread.
  - Don't put a `filter` on an element whose children move.
- Switching the theme cross-fades the whole page as one snapshot (View Transitions API) instead of animating
  every color.
- Phones and low-end devices (`data-lite`) get smaller maps, fewer clouds, satellites, animals and particles.
- With `prefers-reduced-motion`, the intro is a still frame and every scene is static.
- The skills are real radio-button groups (one Tab stop, arrow keys to move) with a status readout that screen
  readers announce. Text contrast meets WCAG AA in both themes in every zone.
- Add `?globe-debug` to the URL to stop the dive above the beach, mark it, and print where it lands on screen
  (it should be the exact center).

## Before launch

- Confirm the GitHub links marked `TODO` in `data/profile.ts` (VoxScribeAI, SentinelFi, and
  Space-Derbis-Identification, whose name is spelled "Derbis"), and add UniBank MDM's repository (its card
  shows no Code button until then).
- If the site isn't served at `https://ronith.vercel.app`, set `NEXT_PUBLIC_SITE_URL` (or change
  `config/site.ts`) so link previews point to the right address.

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
