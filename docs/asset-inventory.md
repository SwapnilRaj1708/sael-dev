# Asset Inventory

The prototype ships ~200MB of assets across two folders with inconsistent naming. This document is the authoritative map from prototype asset to repository asset. **Never reference a prototype filename in code.**

---

## 1. Why this document exists

The prototype references assets from two places:

- **`assets/`** — curated, sensibly named. Mostly usable.
- **`uploads/`** — raw user uploads with generated names. `uploads/pasted-1784663527717-0.png` **is the SAEL logo.** The prototype's own `CLAUDE.md` warns that this folder resyncs and edits do not persist.

Additionally, several assets are enormous unoptimised originals. Shipping them as-is would blow the performance budget on the first page load. Every asset below has a required target size.

---

## 2. Critical findings

| Asset | Size in prototype | Problem |
|---|---|---|
| `news-solar.jpg` | **12.5 MB** | 3 of these load on the homepage. ~34MB of news thumbnails. |
| `news-agri.jpg` | **11.4 MB** | Same. |
| `news-mfg.jpg` | **8.7 MB** | Same. |
| `hero-man.jpg` | **10.7 MB** | Unused in the final homepage — leftover from an earlier hero direction. |
| `hero-boy.jpg` | **9.7 MB** | Unused. |
| `hero-woman.jpg` | **9.4 MB** | Unused. |
| `vision-bg.png` | **8.4 MB** | Photographic content stored as PNG. Must be JPEG/WebP. |
| `solar-plant.png` | **1.7 MB** | Photographic content stored as PNG. Must be JPEG/WebP. |

**Action required from the client before FE-04:** supply the original high-resolution masters for the three news images and confirm which hero photography is final. Do not re-compress an already-compressed 12MB JPEG — request the master.

---

## 3. Naming and placement rules

```
src/assets/
├── fonts/          DIN — client supplied, licensed. WOFF2 only in the repo.
├── images/
│   ├── hero/
│   ├── sections/
│   ├── news/       placeholder only — production news images come from Azure Blob
│   └── decorative/
└── icons/          SVGs imported as React components
public/
└── images/         only assets referenced by URL string (OG image, favicon set)
```

Rules:

- **kebab-case, descriptive, no dates, no dimensions in the name.** `hero-solar-modules.jpg`, not `hero-modules-1920.jpg` or `pasted-1784663527717-0.png`.
- Assets imported by `next/image` live in `src/assets/`, are content-hashed at build, and get automatic width/height. **Prefer this.**
- `public/` is only for assets referenced by a literal URL string that Next cannot process: favicons, `og-image.png`, `robots.txt`.
- Icons that need to inherit `currentColor` become inline React components (via SVGR). Icons that are fixed-colour brand artwork stay as files.
- Photographic content is **never PNG**. PNG is for transparency and flat graphics only.
- Every raster asset is committed at a single sensible master size; `next/image` derives the rest. Do not commit `@2x` variants.

---

## 4. Mapping table

### Logo and identity

| Prototype path | Repository path | Format | Notes |
|---|---|---|---|
| `uploads/pasted-1784663527717-0.png` | `src/assets/images/sael-logo.png` | PNG | **Interim, by decision on 2026-08-04.** See below. |
| *(footer variant)* | `src/assets/images/sael-logo-dark.svg` | SVG | **Supplied 2026-08-27**, and the first vector of the wordmark we have. Drawn for a dark ground: white strapline, the SAEL wordmark on its own red→purple gradient. Consumed by the footer at `--spacing-footer-logo`. **38% of its height is empty** — the ink is 1293 × 329 inside a 1521.67 × 530.77 viewBox — so size the box from the ink, and re-measure if it is re-exported |
| — | `public/images/og-image.png` | PNG | 1200×630. Live site has `sael-thumbnail.png`. |
| — | `public/favicon.ico` + `icon.png` + `apple-icon.png` | — | Generate from the logo mark |

> **The colour logo ships as a raster for now.** The client's handover contains
> `sael-logo.png` but no SVG. The wordmark *is* live vector inside
> `SAEL - New Website.pdf` and could be extracted, and the live site already
> serves `sael-logo.svg`; the call on 2026-08-04 was to use the PNG and swap
> later. The committed file is the supplied 7787×1975 master, alpha-trimmed and
> resampled to **1600×398** (78 KB) — roughly 3× the largest rendered size
> (42px tall at 3× DPR), so it stays crisp without shipping an 8000px asset
> through `next/image` on every build.
>
> The white variant cannot be derived: the wordmark is a purple→red gradient
> over a black strapline, so a white version is a design decision, not a
> recolour. The footer still needs it.

### Hero carousel — **used**

| Prototype | Repository | Target | Notes |
|---|---|---|---|
| `assets/hero-modules.jpg` | `hero/solar-modules.jpg` | ≤ 220KB @ 2400w | Slide 1 — `priority` |
| `assets/hero-generation.jpg` | `hero/energy-generation.jpg` | ≤ 220KB @ 2400w | Slide 2 |
| `assets/hero-vision.jpg` | `hero/clean-energy-vision.jpg` | ≤ 220KB @ 2400w | Slide 3 |
| `assets/hero-agri.jpg` | `hero/agri-waste.jpg` | ≤ 220KB @ 2400w | Slide 4 |

**Each hero slide needs a portrait crop for mobile** (`hero/solar-modules-portrait.jpg` etc., 4:5, ≤ 140KB @ 1080w). Delivered via `<picture>` / `next/image` with a media-conditioned source. Scaling a 2.34:1 landscape into a 4:5 frame crops out the subject — this must be an art-directed crop, not a CSS `object-position` guess. **Client/design to supply the crops.**

### Hero overlay icons — **used**

| Prototype | Repository | Notes |
|---|---|---|
| `assets/icon-1-symbol.svg` | `icons/symbol-solar-generation.svg` | Large watermark symbol, slide 3 |
| `assets/icon-2-symbol.svg` | `icons/symbol-cell-manufacturing.svg` | Slide 1 |
| `assets/icon-3-symbol.svg` | `icons/symbol-module-manufacturing.svg` | Slide 2 |
| `assets/icon-4-symbol.svg` | `icons/symbol-agri-waste.svg` | Slide 4 |

### Business tile icons — **used**

The client supplied these on 2026-08-04 as `Business Icons/Icons-Sael-0N.svg`.
Byte sizes match the prototype's `icon-N.svg` exactly, and the gradient stops
confirm the mapping, so the numbering is the same in both sets.

| Prototype | Client file | Repository | Identifying gradient |
|---|---|---|---|
| `assets/icon-1.svg` | `Icons-Sael-01.svg` | `icons/business-solar-generation.svg` | yellow → red → purple |
| `assets/icon-2.svg` | `Icons-Sael-02.svg` | `icons/business-cell-manufacturing.svg` | indigo → purple → magenta |
| `assets/icon-3.svg` | `Icons-Sael-03.svg` | `icons/business-module-manufacturing.svg` | blue → teal → green |
| `assets/icon-4.svg` | `Icons-Sael-04.svg` | `icons/business-agri-waste.svg` | near-black → green |

Full-colour brand artwork with gradients and `clipPath`s. **Keep as files for
`next/image`; do not run them through SVGR** — each declares its own `.cls-1`
and gradient `id`, so inlining four of them on one page would collide.

> **Open: the labels are baked into the artwork.** Every one of these carries
> its wordmark as outlined letter paths below the icon — `Icons-Sael-03.svg` is
> the mark plus "N-TYPE MODULE MANUFACTURING" in vector outlines (21 of its 22
> shapes are lettering). The supplied PNGs are the same with white text. The
> business tile renders that heading as real HTML as well, so as-is the label
> would be duplicated, and the vector copy is unselectable, untranslatable and
> invisible to screen readers.
>
> Deferred on 2026-08-04 — **resolve before the FE-04 tiles are built.** Either
> the client supplies marks without lettering (they are separate objects
> upstream), or we strip the letter paths and re-crop the viewBox, with design
> confirming the crop.

The PNG variants (`SOLAR Icon.png` and siblings, 1880×2493) have **white**
lettering baked in and are intended for dark backgrounds. Not used on the site.

### Tile shapes — **rebuild, do not import**

| Prototype | Action |
|---|---|
| `assets/rtile-2.svg` … `rtile-5.svg` | **Reimplement in CSS.** |
| `assets/tile-2.svg` … `tile-5.svg` | Unused variants — discard. |

Reason: these are a single path with `preserveAspectRatio="none"` and a hardcoded `fill="#e8e9eb"`. Stretching them to a tall mobile aspect ratio distorts the 18px corner radii into ellipses, and the fill cannot be tokenised. The shape is a rounded rectangle with a chamfered bottom-right corner — express it as:

```css
clip-path: polygon(0 0, 100% 0, 100% calc(100% - 44px), calc(100% - 44px) 100%, 0 100%);
border-radius: var(--radius-card);
background: var(--color-tile-surface); /* #E8E9EB */
```

Note `clip-path` and `border-radius` do not compose on all engines — if the corner rounding is lost, use an inline SVG generated with a viewBox matching the rendered aspect ratio instead of a stretched static file. Confirm the final approach in design review during FE-04.

### Date badge — **rebuild, do not import**

`assets/date-badge.svg` has the same problem: `preserveAspectRatio="none"` with a 16px angled notch that distorts under a variable-width date string. Rebuild in CSS using `--gradient-eyebrow` and a `clip-path` notch. See `design-guidelines.md` §4.

### Section imagery — **used**

| Prototype | Repository | Format change | Target |
|---|---|---|---|
| `uploads/Rectangle 7.png` | `sections/about-workplace.jpg` | PNG → JPEG | ≤ 180KB @ 2000w |
| `uploads/pasted-1784666085151-0.png` | `sections/about-overlay.png` | keep PNG | Transparency required. ≤ 120KB |
| `assets/india-map.png` | `sections/india-presence-map.png` | keep PNG (flat graphic) | 860×721 source. ≤ 90KB. **See §6.** |
| `assets/solar-plant.png` | `sections/mizoram-solar-plant.jpg` | **PNG → JPEG** | 1.7MB → ≤ 200KB @ 2400w |
| `assets/engineer.png` | `sections/field-engineer.png` | keep PNG | Cut-out, transparency required. 968×970. 715KB → ≤ 180KB |
| `assets/vision-bg.png` | `sections/vision-background.jpg` | **PNG → JPEG** | 8.4MB → ≤ 250KB @ 2400w |
| `assets/pixel-strip.png` | `decorative/pixel-strip.png` | keep PNG | 2613×380. 569KB → ≤ 60KB. Decorative, `alt=""` |
| `assets/footer-bg.png` | `sections/footer-background.jpg` | PNG → JPEG | ≤ 100KB |

### News images — **placeholders only**

| Prototype | Repository | Notes |
|---|---|---|
| `assets/news-agri.jpg` | `news/placeholder-agri.jpg` | Mock fixture only |
| `assets/news-solar.jpg` | `news/placeholder-solar.jpg` | Mock fixture only |
| `assets/news-mfg.jpg` | `news/placeholder-manufacturing.jpg` | Mock fixture only |

Production news images come from **Azure Blob** via `NewsItem.image.url`. These three exist so the mock renders realistically; each must be re-encoded to ≤ 120KB at 1200w. Also commit a `news/fallback.jpg` for items where `image` is `null`.

### Unused — **do not migrate**

`assets/hero-man.jpg`, `assets/hero-boy.jpg`, `assets/hero-woman.jpg`, `assets/tile-2..5.svg`, `assets/reference/*`, and the entire `uploads/` folder beyond the three files mapped above. The prototype's `checkpoints/`, `Assets.dc.html`, `Hero FX Lab.dc.html`, `Timeline Experiment.dc.html` and `KnowMoreButton.dc.html` are Designer working files with no repository equivalent.

---

## 5. Fonts

| Client file | Repository | Notes |
|---|---|---|
| `DIN.ttf` | `src/assets/fonts/din-regular.woff2` | Weight 400 |
| `DIN Bold.otf` (preferred) / `DIN Bold.ttf` | `src/assets/fonts/din-bold.woff2` | Weight 700 |

- Convert to **WOFF2** and subset to `latin` (+ `₹`, `–`, `’`, `·`, `#`, `²`). Expect ~70% size reduction.
- Load via `next/font/local` with `display: 'swap'` and `fallback: ['system-ui', 'sans-serif']`.
- Commit **WOFF2 only**. Do not commit the TTF/OTF originals — they are the licensed desktop files.
- **Licensing is unresolved** (`architecture.md` Open Decision #2). DIN is commercial; a webfont licence is a different tier from a desktop licence. Confirm before launch.

---

## 6. India presence map

`india-map.png` is a flat 860×721 raster with baked-in state labels. At mobile widths those labels render below 6px and are illegible. Regardless of which option is chosen, **a text list of the states of operation is required** as the accessible representation.

| Option | Effort | Result |
|---|---|---|
| **A — image + list** (default) | Low | Ships now. Map is decorative below `lg`, list carries the information. |
| **B — inline SVG** | Medium | Client supplies vector. States become paths; tooltips and highlighting become possible; scales cleanly. |
| **C — interactive map** | High | Per-state hover cards with capacity figures. Needs data the backend does not yet expose. |

Option A is implemented in FE-04. B/C are `architecture.md` Open Decision #6.

---

## 7. Optimisation pipeline

Run once, at migration time — not in CI. Committed assets are already optimised.

```bash
# Photographic PNG → JPEG
sharp -i vision-bg.png -o vision-background.jpg --format jpeg --quality 82 resize 2400

# JPEG re-encode
sharp -i hero-modules.jpg -o solar-modules.jpg --format jpeg --quality 80 resize 2400

# PNG with transparency
pngquant --quality=65-85 --strip engineer.png -o field-engineer.png

# SVG
svgo -f src/assets/icons --multipass
```

`next.config.ts` sets `formats: ['image/avif', 'image/webp']`, so AVIF/WebP derivatives are generated at request time. Commit the JPEG/PNG masters only.

**Budget check before any PR that adds an asset:** no committed raster exceeds **250KB**. If it must, note why in the PR description.

---

## 8. Azure Blob conventions

Backend-supplied assets (news images, investor PDFs, team photos) live in Blob Storage and arrive as absolute URLs.

- Compose with `blobUrl(path)` from `@/lib/utils/blob-url` — never string-concatenate at a call site.
- **Store the path, not the URL.** A fixture or a DTO carries `web-assets/images/our-team/jasbir-singh.jpg`; the host comes from `AZURE_BLOB_BASE_URL` at render time. That is what keeps hostnames out of the repository (/CLAUDE.md §7) and lets one fixture work against any environment's container. `blobUrl()` passes an already-absolute value through, so a backend that returns full URLs needs no special case.
- Add the account host to `next.config.ts` `images.remotePatterns`.
- **PDFs are linked, not proxied.** `<a href={doc.file.url} target="_blank" rel="noopener noreferrer">` with the file type and size in the accessible label: *"Annual Return FY 2024-25, PDF, 2.4 MB, opens in a new tab"*.
- Never commit a PDF to the repository.
- **Page furniture can come from the container too, and `cdnImage()` is how.** §8 was
  written for backend-supplied assets that arrive as data. The About Us artwork is not
  data — it is fourteen fixed files a section renders unconditionally — and it moved to
  the container on 2026-09-17 all the same. `cdnImage(path, width, height)` from
  `@/lib/assets/cdn` describes one: it composes the URL with `blobUrl()` and carries the
  intrinsic dimensions a bundled import would otherwise have supplied, returning
  something shaped like `StaticImageData` so no consuming component changes. The
  dimensions must be read from the blob itself. Vectors must be rendered `unoptimized`.
- Never commit a backend-supplied image either. The seventeen `/our-team/` portraits were briefly mirrored into `public/team/` while the client's URLs were outstanding; **the client supplied them on 2026-09-10** and the copies were deleted. They live at `web-assets/images/our-team/<slug>.<ext>` — fifteen `.jpg`, two `.webp`, one `.png`, matching the slugs in `mock/data/team-members.json`.

---

## 9. Handover checklist

Items the client must supply before the relevant tracker item can complete:

- [x] ~~DIN font files~~ — supplied. WOFF2 in `src/assets/fonts/`, bold cut from
      the OTF. See that folder's README.
- [x] ~~Business tile icon SVGs~~ — supplied, mapped above. Lettering still to
      resolve.
- [ ] SAEL logo as **SVG**, colour variant — deferred, PNG in use meanwhile in the
      masthead. `sael-logo-dark.svg` is a vector of the same wordmark and may be
      the answer here too; it has not been checked against a light ground
- [x] ~~SAEL logo, **white** variant~~ — supplied 2026-08-27 as
      `sael-logo-dark.svg`, which unblocked the footer
- [ ] Business tile icons **without baked-in lettering** — *blocks FE-04 tiles*
- [ ] DIN webfont licence confirmation — *blocks launch*
- [ ] A cut of DIN containing `₹` (U+20B9) — absent from every supplied file
- [ ] High-resolution masters for the three news images — *blocks FE-04*
- [ ] Art-directed **portrait crops** of the four hero photographs — *blocks FE-04*
- [ ] Confirmation that hero photography is final (three unused hero images in the prototype) — *blocks FE-04*
- [ ] India map as vector, if Option B or C is chosen — *blocks Open Decision #6*
- [x] ~~**About Us: the page assets**~~ — supplied 2026-09-10 (eleven) and completed
      2026-09-17 (the three cut-out panels), under
      `<container>/web-assets/images/about-us/`: the boardroom banner, the solar-field
      photograph, the Our Ambition portrait, both cut-out panels, the cut-out sitter, and
      `principle-icon-1` … `-8`. They were committed at `src/assets/images/about-us/` and
      imported until the container was populated; **the local copies were deleted on
      2026-09-17** and all fourteen are now described by `cdnImage()` — see
      `src/lib/assets/cdn.ts` and the folder note in `src/app/_content/about-us.ts`
- [ ] **Rename `about-us-hero.JPG` on the CDN to `about-us-hero.jpg`.** Azure Blob names
      are case-sensitive and this is the only file in the folder that is not lowercase,
      so the call site has to spell the extension in upper case. It blocked the CDN swap
      while Turbopack was being asked to bundle the file — it refuses an uppercase
      extension outright (*Unknown module type*) — but nothing bundles it now.
      *tidiness only; blocks nothing*
- [ ] **The Our Ambition sitter's name and role.** The asset is
      `our-ambition-person-image.webp` and the design labelled it only "Portrait
      photograph", so the `alt` describes what is visible — "A person in a business
      suit standing in an office" — and asserts no identity. It should name them

- [ ] Favicon / app icon source
- [ ] OG share image, 1200×630

---

## 10. The client handover dump

On 2026-08-04 the client delivered a raw asset dump. It lives at `/assets/`,
which is **untracked and gitignored** — it holds licensed font originals, and
it has already been replaced once. **Nothing is referenced from there at
runtime.** Anything the site needs is processed into `src/assets/` and
committed. Treat `/assets/` as read-only source material that may vanish.

There is no naming convention in it, folders are nested and duplicated, and
several files appear two or three times under different names.

### What is worth knowing about

| Path (under `assets/Web Assets & Refrences/`) | What it is |
|---|---|
| `SAEL - New Website.pdf` | **The client's own homepage design.** A single-page Illustrator export, and the most useful reference in the dump. |
| `drive-download-…/Business Icons/` | The four business icon SVGs and their white-text PNG variants. Mapped in §4. |
| `drive-download-…/Fonts/` | DIN regular/bold. Already processed — see `src/assets/fonts/README.md`. |
| `drive-download-…/Images/` | 15 photographic masters: solar farms, module and cell manufacturing, the waste-to-energy plant, biomass conveyor, farmers and engineers. |
| `drive-download-…/Website Reference Images/` | The four hero portraits from the design, as high-resolution masters. |
| `shapes/1..14.svg` | 14 chamfered gradient shapes used in the design as image masks and decoration. |
| `Shape reference/linkedin1..4.png` | Screenshots showing those shapes in use on the client's LinkedIn creatives. |
| `SAEL - New Website_Folder/` | Photography plus screenshots of the design. Its `Fonts/` also holds Gotham and Myriad Pro — **ignore both; the project is DIN only.** |
| `…/Social Media Architecture final.ai` | Saved without PDF content, so unreadable outside Illustrator. Its `.txt` sibling is only a package report. |

### How the client's design differs from the prototype

> **Reversed 2026-08-04, later the same day: the PDF is the design, and the
> prototype is reference only.** The client's instruction was explicit — the
> PDF "is the actual thing we have to make", and the Designer prototype "was
> also created by AI, so it's just a reference".
>
> So where the two disagree on **layout or composition**, the PDF wins and the
> feature docs in `docs/features/` are the stale ones. Where the PDF simply has
> no content — it sets Lorem ipsum in the business tile descriptions — the
> prototype supplies it. Neither source may be used to invent a figure.
>
> The earlier decision recorded here said the opposite. It is kept, struck
> through, because the homepage sections built before the reversal were built
> to it, and a reader who finds a prototype-shaped component needs to know why.

The points where the two disagree, and what was built:

1. The four business tiles carry the capacity figures (8299 MWp, 5 GW,
   3625 MW + 5 GW, 144.9 MW). Our docs specify a separate 4-column stats band.
   **Built to the PDF:** `sections/business-tiles/` is both, and
   `features/04` §2's stats band does not exist as a section.
2. The India map is a **dotted pixel-art map** captioned "11 STATES /
   60 PROJECT SITES", not the flat `india-map.png`. **Built to the PDF**, which
   settles Open Decision #6 in favour of a vector map — the geometry arrived
   with the handover as `Mock 3 Approved/mapDots.js` and is transcribed into
   `sections/presence-map/dots.ts`.
3. Solutions is a **carousel of four plants** — Patiala, Mizoram, Kishangarh,
   Bhadra — each a landscape photograph with a gradient plaque naming it.
   `features/04` §6 specifies a single full-bleed `<FeatureBanner>` of the
   Mizoram plant, reusable as a page hero elsewhere. **Built to the PDF** as
   `sections/solutions-carousel/`. The plaque survives the change; the reusable
   one-image banner does not exist yet, and when a business page needs one it
   is a separate primitive rather than a branch in the carousel.
4. Neither the vision timeline nor the "Our Strength" section appears.
   **Not yet decided** — both are specified in `features/04` §7 and §8 and
   neither has been built. Ask before building either.
5. The footer is an undesigned grey block — which is why no social icon
   artwork exists anywhere in the handover.

The pixel-strip divider is live vector in that PDF, and is a better source
than the prototype's 569 KB PNG.

### The 14 shapes use a gradient we do not have a token for

`#2b1b54 → #8a1e42 → #e01f2b`, which is not `--gradient-cta`
(`#F9E800 → #E40F14 → #45258D`) or any other token in `theme.css`. If these
shapes are adopted, that gradient needs to become a token first — do not
inline the stops.
