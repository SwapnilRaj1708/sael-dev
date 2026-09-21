# Frontend Progress Tracker

**This file is the single source of truth for what to build next.** Read `/CLAUDE.md` §3 for the rules governing it.

Rules, in short:

- Exactly **one** item is In Progress at any time.
- Finish it → move to **Done** → promote the top **Pending** item into **In Progress**.
- Tracker changes are committed **in the same commit** as the code they describe.
- Never skip ahead. If the order looks wrong, raise it — do not reorder alone.

Legend: `Reads` = the supporting docs to load for that item (beyond `/CLAUDE.md` and the item's own feature doc).

---

## ✅ Done

| ID | Item | Feature doc | Owner | Completed |
|---|---|---|---|---|
| FE-09 | Waste to Energy | `features/09-waste-to-energy.md` | Swapnil Raj | 2026-09-19 |
| FE-10 | Module Manufacturing | `features/10-module-manufacturing.md` | Swapnil Raj | 2026-09-19 |
| FE-11 | Solar Cell Manufacturing | `features/11-solar-cell-manufacturing.md` | Swapnil Raj | 2026-09-19 |
| FE-08 | Solar Energy | `features/08-solar-energy.md` | Swapnil Raj | 2026-09-18 |
| FE-07 | Our Team | `features/07-our-team.md` | Swapnil Raj | 2026-09-10 |
| FE-06 | About Us | `features/06-about-us.md` | Swapnil Raj | 2026-09-10 |
| FE-04 | Homepage | `features/04-homepage.md` | Swapnil Raj | 2026-09-10 |
| FE-25 | Design-system reconciliation — guidelines vs. the as-built homepage | `design-reconciliation.md` | Swapnil Raj | 2026-09-10 |
| FE-03 | App shell — header, mobile nav, footer, layout | `features/03-app-shell-header-footer.md` | Swapnil Raj | 2026-08-04 |
| FE-02 | Design system foundation (tokens, fonts, primitives) | `features/02-design-system-foundation.md` | Swapnil Raj | 2026-08-04 |
| FE-01 | Initial project setup | `features/01-initial-project-setup.md` | Swapnil Raj | 2026-08-04 |

### FE-09, FE-10, FE-11 — as built

The three remaining business pages, built together on 2026-09-19 on the FE-08 template,
**worked ahead of FE-05 on the client's instruction** — the same trade FE-07 made. As
with FE-08: the client's reference screenshots fixed the layout, the live sael.co pages
fixed every word, and `features/09`, `10` and `11` were not the spec and have not been
reconciled to what was built. Nothing new was minted; the four pages share
`<PageHero>`, `<ProseSplit>`, `<ProjectsMap>`, `<CapabilitySplit>` and `<ValueGrid>`,
and three of those grew an opt-in to fit.

| Page | Route | Sections | Figure |
|---|---|---|---|
| Waste To Energy | `/waste-to-energy/` | all five — 11 plant pins, 4 technology entries, **6** benefit cards | `164.9 MW`, agri accent |
| Module Manufacturing | `/module-manufacturing/` | five — no "how do we work?" list on the live page or in the screenshot, but a "Product Downloads" list between the map and the cards; 3 state pins, 3 prowess cards | `3625 MW + 5000 MW (proposed)`, module accent |
| Solar Cell Manufacturing | `/solar-cell-manufacturing/` | four — 1 pin, 4 unheaded highlights, no cards | **none** — see below |

**What the shared sections gained, all opt-in so FE-08 is untouched:**

- `<ProjectsMap>` — `figure` is optional, and `business` picks the figure's accent from
  the four `--color-figure-*-bright` tokens so each page's number takes the colour its
  business has on the homepage ledger.
- `<CapabilitySplit>` — `name` is optional; Solar Cell's four highlights are a mark and a
  sentence each, on the live page and in the screenshot.
- `<ValueGrid>` — `name` is optional and `ordinal` renders a numeral above the copy.
  Module's prowess cards were "01 / 02 / 03" over a sentence until the client dropped
  the numerals on 2026-09-21; they are now a mark and a sentence, and no page sets
  `ordinal`. The prop stays.
- **`sections/product-downloads/`** — the one new section, added 2026-09-21 (below).
- **`value-grid/business-marks.tsx`** — seventeen drawn marks, same idiom and same
  instruction as `solar-marks.tsx`.

**Where the screenshots and the live pages disagree, the live page won:**

- Waste To Energy has **six** benefit cards, not the screenshot's four identical
  placeholders, and casts its label "Why Waste-to-Energy?" and heading "Benefits of
  Waste-to-Energy" with a lower-case "to".
- Module Manufacturing's portfolio figure is on the live page and not in the screenshot;
  it is carried. Its `<title>` is `Module Manufacturing - SAEL` with a hyphen, as
  transcribed — FE-22's separator question again.

**Deliberately not built, flagged for the client:**

- **Solar Cell's "5 GW / Portfolio" figure.** The screenshot draws it; the live page has
  no such block — 5 GW appears only in the paragraph and on the pin, and the word
  "Portfolio" nowhere on that page. /CLAUDE.md §2 rule 3 forbids adding the caption, so
  the section renders without a figure. One line restores it once the client confirms.
- **"More Details" links** on three pins (Punjab, Ferozepur, Jaitu) point at
  project-detail pages the new site does not have. Only "Visit Location" is carried.

**Client feedback of 2026-09-21, applied across the four business pages:**

- **Module's "Product Downloads" is built after all.** The client asked for the block
  back, linking to the PDFs where they are today. `sections/product-downloads/` is a
  heading over a `<ul>` of the investor pages' `<DocumentLink>`, which gained a
  `ground="dark"` variant for it (paper stays the default; the investor pages are
  untouched). Two columns from `lg` — heading left, list right — because a three-row
  list capped at the measure left the right half of a 1920px section empty. The hrefs
  are composed on `PRODUCTION_URL` + `/documents/product-downloads/…`, and **they
  become 404s the day the new site takes over www.sael.co** unless the three files are
  moved to blob storage first; the note beside `moduleDownloads` says so. A cutover
  task. The dark variant is on `/dev/design-system` under the DocumentLink entry.
- **Module's prowess cards lost their numerals** — see the `<ValueGrid>` note above.
- **`<CapabilitySplit>` rows** — one rule per row and none under the last (they were
  `inset="block"` with a closing rule: four lines around three cards), the same
  hover accent the guiding-principle and team cards fill across their hairline, and
  the mark above the heading rather than below it, matching the value grid on the
  same page. All three pages that draw the section follow.
- **The map pins' pulse** was hard to see; its radius is now `--map-ping-scale` in
  theme.css, the one place to tune it, read by `saelPing` in animations.css.
- **The artwork moved to blob storage.** Solar Energy's two photographs and hero video,
  and Module Manufacturing's photograph and video, are described by `cdnImage()` /
  `tryBlobUrl()` against `AZURE_BLOB_BASE_URL`; the two `.webp` files that had been
  committed under `assets/images/solarEnergy/` for three days are gone. The two shape
  masks stay in the repo. With it, the media caps and `sizes` hints were renamed from
  `solar-*` to `business-*`, since all four pages share them, and `<ProseSplit>`
  split its `mask` prop into `frame` (the box) and `mask` (the clip) so a pre-shaped
  export can skip the clip.
- A pointer-tracking spotlight on `<Card>` (after reactbits' SpotlightCard) was built,
  reviewed and withdrawn the same day. Nothing of it remains in the tree; if it is
  wanted later it is a client-leaf primitive and a handful of theme tokens.

Still open:

- **Artwork.** Every hero poster is still `null` with a `pending` name. Solar Cell
  Manufacturing has no supplied media at all; the other three carry what the client
  has uploaded so far.
- **Meta descriptions** — all three live pages ship an empty one. `{{TODO: content}}`.
- **Pin coordinates are fitted, not measured**, as on FE-08. Waste To Energy's Punjab
  cluster (Ferozepur, Jaitu, Channu) and its **two Bikaner pins** — the live page lists
  Bikaner 14.9 MW twice with different map links, so both are carried a few units apart
  — want an eye first.
- `features/09`, `10` and `11` want rewriting to the as-built.

### FE-08 — as built

Built to **the client's reference screenshot** for layout and to **the live
https://www.sael.co/solar-energy/** for every word, on the client's instruction of
2026-09-18 that the screenshot fixes the structure and the live page fixes the copy.
`features/08-solar-energy.md` was not the spec for this build and has not been
reconciled to it; the page is the first business page and the first to take the
`<PageHero>` opening with a **video** behind it.

| # | Section | Component | State |
|---|---|---|---|
| 1 | Hero — "Solar Energy" over a looping video | `sections/page-hero/` | **Extended.** Optional `video`; the photograph becomes its poster and the reduced-motion still |
| 2 | Overview — copy beside a masked photograph | `sections/prose-split/` | **Extended.** Optional `eyebrow`, and `media.mask` + `media.sizes` for a designer-supplied shape |
| 3 | Projects — dotted India map, copy, portfolio figure | `sections/projects-map/` | **New.** Composes `<PresenceMapFigure>` beside two paragraphs and a `<CountUp>` |
| 4 | How Do We Work? — three capabilities beside a masked photograph | `sections/capability-split/` | **New.** Hairline `<Card>` rows, closing rule, mask2 on the artwork |
| 5 | How We Reduce Cost? — four practice cards | `sections/value-grid/` | Reused, `variant="outlined"` |

**The map was extracted, not forked.** `sections/presence-map/map-figure.tsx` is the
dotted India artwork, its pins and their callouts, lifted out of `<PresenceMap>` so the
homepage and this page share one implementation; `<PresenceMap>` composes it and renders
identically. A `legend` flag turns off the business name in the callout, which on a
solar-only map would repeat the page's title beside every pin. **A pin with an `href` is
now a real `<a>` to that location in a new tab** — the live page links fourteen of its
twenty-three sites to Google Maps, and until this the "Visit Location" line rendered as
text with nothing behind it. The pins remain the map's text equivalent: every site name
and capacity is real DOM text on a focusable control, in document order.

**Twenty-three site capacities, transcribed as the live page publishes them**, from
Kurnool (Andhra Pradesh) 2707 MW down to Assam 1 MW, including the live page's own
spellings ("Karnatka", "Nagamangla", "Gr. Noida"). Coordinates are fitted through the
homepage's eleven state pins rather than measured, as those were; the three "Other
Locations" entries sit near their state centroid; Khavda was clamped inward from the
artwork's western edge. **The pins want an eye before this ships.**

Landed alongside it:

- **`ui/video-frame.tsx`** — a silent, looping, inline-autoplay `<video>` over a
  `<MediaFrame>` poster, decorative by contract and `aria-hidden`. `autoPlay` cannot be
  gated by a media query in markup, so the client leaf decides: the poster is rendered on
  the server and for anyone preferring reduced motion, and the video mounts only once
  the preference is known to allow it. The file lives in the blob container at
  `web-assets/media/solar-energy/patiala-project.mp4`; only the path is committed.
- **`--mask-solar-overview` and `--mask-solar-execution`** in theme.css — the client's
  `solarEnergy/mask1.svg` and `mask2.svg` carried as alpha masks, the same idiom
  `intro-split` and `endeavour-split` use, with `--aspect-solar-*` from their viewBoxes
  and `--solar-*-media-w` caps (704 / 544) wider than the prose split's own, at the
  client's request of 2026-09-18 — the notched shapes read smaller than a plain
  photograph in the same box. `image-sizes.ts` carries matching hints.
- **`value-grid/solar-marks.tsx`** — seven line-art marks drawn in the `pillar-marks`
  idiom, at the client's request rather than waiting on artwork: a ticked clipboard, a
  gauge, a site pin, two people, a ticked calendar, a pylon, a monitor with a trend line.
  Any one swaps for a supplied file by replacing its line in `page.tsx`.
- **`web-assets/images` → `web-assets/media`**, everywhere, following the client's
  rename of the container folder on 2026-09-18. The About Us artwork and the seventeen
  team portraits resolve from the new prefix; the base URL is unchanged.

**Departures from the reference screenshot, all deliberate:**

- Its four identical EPC cards are placeholder art; the live page's four distinct cards
  are built.
- Its boardroom hero photograph is placeholder art; the hero is the client's video.
- Its "How do we reduce cost?" label reads "How We Reduce Cost?" on the live page, which
  wins on content.
- Its gradient on the portfolio figure is rendered as `--color-figure-solar-bright`, the
  solar business's own accent on the homepage ledger, rather than a new gradient token
  minted for one number.

Still open:

- **The portfolio figure reads `8299.5 MWp`, not the screenshot's `8299 MWp`.** The live
  markup is `<span data-target="8299">0</span><span>.5</span> MWp` — the counter lands on
  8299 and the ".5" is static text after it, so the settled figure is 8299.5. A scrape
  mid-count reads "0.5 MWp", which is the failure the client warned of. The homepage's
  mock capacity stat still reads 8299. **Client to confirm which is right.**
- **No hero poster.** Until a still is supplied (`pending: solar-energy/hero-poster`) the
  box shows the neutral placeholder before the first frame and for reduced-motion users.
- **A meta description for `/solar-energy/`.** The live page ships
  `<meta name="description" content="">`; `{{TODO: content}}` and none emitted.
- **The map pins**, as above.
- **`features/08-solar-energy.md`** describes a page this is not, and wants rewriting to
  the as-built rather than the other way round.

### FE-07 — as built

Merged to `main` on 2026-09-10 (PR 2534). **Revised 2026-09-17 on the client's
feedback**, together with About Us (PR 2535): the card accent that fills across the
hairline on hover now runs on the team cards as well as the About Us principle cards,
matching the two pages to each other.

**FE-05 was skipped to get here, on the client's instruction of 2026-09-10.** It was
still the top of Pending when FE-07 closed, and is In Progress now. What FE-07 needed from
it — `TeamMember`,
`getTeamMembers()` on the interface, and the method in both implementations — was carved
out and landed here, which is exactly the trade FE-04 made for `CapacityStat` and
`NewsItem`. FE-05 is correspondingly smaller now; nothing in it was dropped.

Built to **`Our Team.dc.html`**, the client's Claude Design project
(`a6a044b5-3829-44df-baae-d700f52344ec`), read through the design MCP. The first page
whose content is entirely repository-driven — seventeen real people, no hardcoded names.

| # | Section | Component | State |
|---|---|---|---|
| 1 | Heading, tabs and roster | `sections/team-grid/` | **New.** One `Section background="black-dots"` carrying the breadcrumb, the `<h1>`, the standfirst, a Leadership/Management tab list and both panels of cards. One section and not two because the design draws it as one, and splitting it would put `--spacing-section-y` between a tab and the panel it controls |
| — | Page hero | — | **Not built** — see below |

**The design has no banner hero, and that is the one place it disagrees with
`features/07` §1.** The feature doc specifies `<PageHero>`; the design opens on the dotted
black ground with the `<h1>` and a standfirst, and `asset-inventory.md` has no Our Team
banner to put behind one. **The client's ruling on 2026-09-10 was to follow the design and
keep the breadcrumb** — which the design also omits, but `accessibility-and-seo.md` §3
requires `BreadcrumbList` on every page below the root, and that is an obligation rather
than a visual detail. So the page is the design's opening with `<Breadcrumb>` restored
above the title.

That makes `sections/team-grid/` the **second inner-page opening**, beside
`sections/page-hero/`. It is not a rival template: a page with a supplied banner still
uses `<PageHero>`, and FE-08 → FE-15 should pick by whether the client has supplied
artwork.

**Three smaller departures from `features/07`, all following the design:**

- **The portrait is 3:4, not 1:1.** The feature doc specifies a square; the design draws
  a portrait crop, which is what a head-and-shoulders photograph wants.
- **The grid is `auto-fill`, not the doc's 4/3/2/1 breakpoints.** One
  `repeat(auto-fill, minmax(min(100%, 250px), 1fr))` reflows on the space it has, and
  `auto-fill` rather than `auto-fit` deliberately: Management has seven cards to
  Leadership's ten, and `auto-fit` would collapse the empty tracks and draw the same
  person wider on one tab than on the other.
- **There is no separate `<TeamGrid>` under a `<PageHero>`.** The one component owns both,
  for the reason in the table above.

Landed alongside it:

- **`TeamMember.group`** — new, and in neither `content-model.md` §2 nor
  `api-contracts.md` §4 before this. A tab is a partition of the roster, so the grouping
  has to come from the data rather than a hardcoded list of names. Both docs are updated
  and the backend proposal is a `group` string on `GET /api/v1/team`.
- **`photoUrl: string | null`** rather than the documented `photo: ImageAsset | null`,
  following `NewsItem.imageUrl` — a CMS asset the frontend cannot know at build time is a
  URL for `next/image`, not a bundled import. `photoAlt` is ignored: a portrait's `alt` is
  the name of the person in it, which `name` already carries.
- **`lib/utils/sanitize-bio.ts`** — the frontend half of the two-sided sanitisation
  `api-contracts.md` §4 describes, allowlisting exactly the eight tags it permits. Runs on
  the server, so `sanitize-html` never reaches the browser bundle; only the clean string
  crosses into the client leaf.
- **`rich-text`**, an `@utility` in globals.css, giving those eight tags back the margins
  the preflight reset strips. Type and colour stay on the element that carries it.
- **`<EmptyState ground="dark">`** — its first real consumer. The paper palette's
  near-black type is invisible on `--color-surface-black`; the default is unchanged.
- **`focus-visible:outline-white` on this page's controls and on `<Breadcrumb>`'s links.**
  The global ring is `--color-brand-blue`, which is **1.84:1** on `--color-surface-black`
  — under WCAG 1.4.11's 3.0 floor, so effectively invisible. White is 19.9:1. The
  breadcrumb fix applies to the About Us hero too.
- **Seventeen portraits, served from the client's CDN.** They were briefly mirrored into
  `public/team/` from the legacy site's `/img/team/` while the real URLs were
  outstanding; **the client supplied them on 2026-09-10** and the copies were deleted —
  byte-identical, so nothing changed but where they are served from. The fixture stores
  the **container path** (`web-assets/media/our-team/<slug>`), never the absolute URL,
  so no hostname is committed (/CLAUDE.md §7); `tryBlobUrl()` composes it with
  `AZURE_BLOB_BASE_URL`, which `.env.example` now carries. The same mapping survives
  FE-23 untouched, because `blobUrl()` passes an already-absolute value straight
  through — which is what the API will send.

  `tryBlobUrl` rather than `blobUrl` deliberately: with the base unset each card falls
  back to its initials avatar and the roster still renders in full, instead of the whole
  page becoming an empty state over a configuration mistake. The cost is that the
  omission is quiet, which is why the working base is the documented default.
- **`TeamMember.linkedinUrl`** — added 2026-09-10 from the live site's own popups, where
  **seven of the seventeen** publish a profile and ten do not. Rendered under the
  biography, which is where the live site puts it, as an outbound link with
  `rel="noopener noreferrer"`. Sparse by nature rather than unfilled, so a person without
  one gets no link at all — no disabled affordance. Both contract docs updated.
  **Dialog only, and not on the card**: the card's whole surface is already the trigger's
  `::before`, so a link underneath it would be unreachable.
- **`ui/card.tsx`: `group-focus-within` → `group-has-focus-visible`** — a real bug, found
  on this page and fixed in the shared primitive. See below.

**The card accent was stuck after closing a dialog, and the fix was in `<Card>`.** The
accent keyed off `group-focus-within`. A native `<dialog>` returns focus to its trigger
on close — correctly, and `features/07` requires it — and that trigger is inside the
card, so `:focus-within` stayed true and the bar stayed filled indefinitely, including
while the pointer moved over other cards. `:focus-within` cannot distinguish restored
focus from a deliberate keyboard visit; `:has(:focus-visible)` defers to the browser's
own modality heuristic and can. Measured before and after over CDP:

| path | before | after |
|---|---|---|
| at rest | collapsed | collapsed |
| mouse open → `×` or backdrop close | **filled, no focus ring** | collapsed |
| mouse open → `Esc` close | **filled, no focus ring** | filled, **with** the focus ring — and clears on the next click |
| `Tab` to the trigger | filled | filled |

The `Esc` row is the one that still fills, and that is correct rather than residual: the
browser treats the restored focus as keyboard-visible and draws its ring there, so the
accent agrees with the ring instead of contradicting it. It clears on the next click.
The change touches every `<Card>`; `<ValueGrid>`'s cards contain nothing focusable, and
the news and ledger cards hold links whose focus is genuinely visible when tabbed to, so
all three are unaffected or strictly better.

**Verified in a real browser**, which is new for this project — a headless Chrome driven
over CDP, scripted in the scratchpad rather than committed. Both tabs switch by pointer
and by `ArrowLeft`/`ArrowRight`/`Home`/`End` with a roving `tabIndex`; the dialog opens
modal, moves focus inside, is labelled by the name heading, closes on `Esc` and on a
backdrop click, and returns focus to its trigger. No horizontal overflow at 360 or 390.

Still open:

- **A meta description for `/our-team/`.** The design file carries a `<title>` and no
  `<meta name="description">`, so none is emitted rather than a placeholder being
  invented. `{{TODO: content}}`.
- **The `<title>` separator disagrees between design files** — `Our Team - SAEL` here
  against `About Us | SAEL`. Both are transcribed verbatim. **FE-22 should settle it**
  against the legacy titles; changing a ranking title is not a decision to make in
  passing.
- **Two portraits are not 4:5.** `archana-capoor.webp` is 500x457 and
  `puneet-upneja.webp` 500x533, where the other fifteen are 500x625. In a 3:4 box
  `object-cover` crops them left and right rather than top and bottom. Both read
  correctly, but they are the odd two and want an eye on them.
- **`photoUrl: null` and `bio: null` are unexercised.** Every one of the seventeen has
  both, and inventing an eighteenth person to exercise the branches would put a
  fabricated director on a page of real ones. `features/05` §3 owns that fixture edge
  case; the card and the page already handle both.

### FE-06 — as built

Built to **`About Us.dc.html`**, the client's Claude Design project
(`f05dd0a1-42c8-4f44-b688-f8dceb7f677b`), read through the design MCP. It is the first
content page, so the shared pieces are the deliverable as much as the page is.

**Revised again on 2026-09-17 on the client's feedback** (PR 2535, with FE-07): the
breadcrumb trail was dropped and the hero copy centred; "Our Endeavours" and the "What We
Believe" label are withheld, their copy kept in `_content/about-us.ts`; "Our Ambition"
became the `<CutoutSplit>` composition with the client's shaped panel and cut-out; the
strategic pillars took the new `outlined` card variant; and the principle cards gained
the hover accent. The fourteen About Us assets moved from the repository to the blob
container the same day, described by `cdnImage()`.

**Revised on 2026-09-10 against a second read of `About Us.dc.html`.** The design file
changed in exactly two ways and nothing else — the whole diff is ten hunks, eight of
which are one attribute:

- **Section snapping is gone.** The `scroll-snap-type: y mandatory` block, the
  `section[data-snap-section]` rule, the `footer[data-snap-section]` rule and the
  `prefers-reduced-motion` override that switched snapping off all went, along with
  `data-snap-section` on all seven sections and the footer. The page scrolls normally
  now: `page.tsx` renders no `data-snap-sections`, and `<PageHero>`, `<ProseSplit>` and
  `<ValueGrid>` each lost their `snap` prop entirely rather than keeping a prop with no
  consumer. **FE-07 → FE-15 inherit a template that does not snap**; the homepage still
  does, and `globals.css`, `--spacing-viewport` and the footer's own opt-in are all
  untouched because they still serve it.
- **The hero was resized twice on 2026-09-10.** The design file replaced
  `min-height: 100dvh` with `clamp(420px, 72svh, 760px)`, and that was built; the client
  then asked for a full-viewport hero back, with a floor so it does not collapse on a
  short screen. It is now `--page-hero-h`, `max(36rem, var(--spacing-viewport))`.
  **The floor is a `max()` and not a breakpoint, because the failure is a short viewport
  rather than a narrow one** — a phone held landscape is ~390px tall and needs the floor,
  the same phone upright does not, and no width query separates them. `--spacing-viewport`
  is the screen less whatever the masthead takes, so at `lg` the hero ends exactly at the
  viewport foot rather than 68px past it.

**The hero scrim was lightened in the same pass**, at the client's report that the
photograph looked dull. It was using `--gradient-hero-scrim-stacked`, the homepage
carousel's ramp, which is 0.3 opaque even at the top of the frame and so lays a grey
film over the whole picture — right for a composition where a headline and a progress bar
cross the entire image, wrong for one carrying a breadcrumb and two lines at the foot.
`--gradient-page-hero-scrim` keeps 0.88 under the copy and is fully clear by 82%. The
homepage token is untouched. **No live reference existed to match**: the boardroom
photograph is a new CDN asset and https://www.sael.co/about-us/ has no image hero at all,
only a contact banner, so it was tuned against the source file.

Two things that look like they should have gone with it and did not:

- **`-mt-header lg:mt-0` stays.** It reads as part of the snap opt-in — the homepage's
  own comment introduces it that way — but it is a statement about the masthead: below
  `lg` the bar overlays the page and slides away on scroll, so a full-bleed hero starts
  at the viewport top and has to give back `<main>`'s `pt-header`. Nothing about that
  depends on snapping.
- **The footer keeps its `data-snap-section`.** It is inert here, because both snap
  rules are scoped to `html:has([data-snap-sections])` and this page no longer sets it,
  and it is still load-bearing on the homepage.

Also dropped in the same pass: the `flex items-center` that `<ProseSplit>` and
`<ValueGrid>` put on their `<Section>`. It existed to centre content inside a
viewport-tall snap area, and with the height gone it was making the `<Container>` a
flex item — which sizes to content rather than filling its parent. Removing it restores
ordinary block layout and the section's own `py-section-y` rhythm.

| # | Section | Component | State |
|---|---|---|---|
| 1 | Page hero | `sections/page-hero/` | **New, and the inner-page template.** Full-bleed banner, `--gradient-hero-scrim-stacked`, breadcrumb, the page's single `<h1>`, a standfirst. Takes its own breadcrumb as data — the trail differs per page and a component deriving it from the route would have to know the site's IA |
| 2 | Our Endeavours | `sections/prose-split/` | **New.** Display heading and three paragraphs beside a 4:3 photograph |
| 3 | Our Ambition | `sections/prose-split/` | The same component, one paragraph at `--ledger-measure` beside a 4:5 portrait. The two differ only in props, which is why there is one component and not two |
| 4 | Our Strategic Pillars | `sections/value-grid/` | **New.** Three `<Card>`s a `--spacing-gap-grid` apart, each with a line-art mark that animates one idea — the bars grow, the gear turns, the leaf sways. Drawn in `pillar-marks.tsx` rather than imported, because an exported PNG cannot animate its parts |
| 5 | Our Guiding Principles | `sections/value-grid/` | The same component: eight cards, the 340px column floor, no accent |
| — | Stats band (design §03) | — | **Not built** — see below |
| — | Our Goals triad (design §06) | — | **Not built** — see below |

**Two sections were deliberately omitted, and this is the one place the design and
`features/06` disagree.** The design wraps both in `sc-if` flags whose placeholder value
is `false` — it draws the page with both off — where `features/06` §3–4 asks for both to
be reused from FE-04. The client's ruling on **2026-09-10** was to follow the design.
Both already exist on the homepage, so the cost of reversing this is two lines in
`page.tsx` plus the props; the copy for both is in the design file if it is wanted.

**Three smaller departures from `features/06`, all following the design:**

- **The hero is `min-h-viewport`, not `aspect-ratio`.** §1 of the feature doc specifies
  `3/1` on desktop falling to `4/3` on mobile. The design draws a full-viewport hero on a
  page that snaps, and an aspect-ratio hero inside a snap area either overflows it or
  leaves a band of ground beneath it.
- **No `<FeatureBanner>` and no CTA button** (§5, §6). The design has neither.
- **`<ProseBlock>` is `<ProseSplit>` with `media` omitted.** The feature doc names a
  heading-over-copy component; the design has no such section, only the split twice. With
  `media` undefined the grid has one column and the split *is* that component, so a
  separate primitive would have been the same file with a branch removed.

Landed alongside it:

- **`ui/breadcrumb.tsx`** — Home › Company › About Us, emitting its own `BreadcrumbList`
  from the same array that renders the links, so the markup and the structured data
  cannot drift. `breadcrumbJsonLd()` is in `lib/seo/json-ld.ts` beside the two the root
  layout emits. A rung with no `href` ("Company", which groups pages but is not one)
  emits `name` and `position` and no `item`. **One `<li>` per rung** — the separators are
  `aria-hidden` spans inside the item they follow, not list items, because a screen
  reader announcing "list, five items" for a three-step trail is wrong.
- **Eight tokens**, all in `:root` beside the other component geometry: the two prose
  media caps and their aspects, the split's column floor, the value grid's two floors and
  its mark size. Every token the design itself referenced already existed — it was
  authored against our real theme, so nothing had to be invented to match it.
- **Three animations** in `animations.css`, still state first and motion only inside
  `prefers-reduced-motion: no-preference`.

**The grids are `auto-fit` tracks, not breakpoints.** Each is one
`repeat(auto-fit, minmax(min(100%, <floor>), 1fr))`, so a section reflows on the space it
has rather than on a viewport width — which is what keeps it correct inside a snap area
on a short laptop as well as on a phone. The `min(100%, …)` is what stops a 380px floor
from overflowing a 360px viewport.

**The artwork landed on 2026-09-10** — all eleven assets, supplied as CDN URLs under
`<container>/web-assets/media/about-us/`. Nothing on the page is a placeholder any more.

They were **committed at `src/assets/images/about-us/` and imported** until 2026-09-17,
and that was deliberate: a bundled `StaticImageData` carries the intrinsic width, height
and `blurDataURL` that `next/image` needs in order to reserve the box and avoid a layout
shift, and a bare URL string throws all three away. Wiring them as URLs before the
container was populated would have had to be undone.

**The client populated the container on 2026-09-17** — all fourteen assets, including the
three cut-out panels added that day — and the local copies came out of the repository in
the same pass. `src/lib/assets/cdn.ts` now closes the gap they left: `cdnImage(path,
width, height)` returns an object shaped exactly like the one an `import` produces, so
every `StaticImageData` prop downstream is untouched, but the bytes are fetched from the
container at runtime. Only the *path* is passed; the host comes from
`AZURE_BLOB_BASE_URL` via `blobUrl()`, so no hostname sits in the repository
(/CLAUDE.md §7).

Four notes on the assets themselves:

- **The dimensions are read from the blobs, not from the deleted local copies.** They are
  what the browser reserves before a byte arrives, so a wrong one is a layout shift that
  nothing catches. `cutout.png` is 1076 × 1984, not the 1991 a local `file` reading had
  reported.
- **`about-us-hero.JPG` is the one uppercase name, and it no longer blocks anything.**
  Turbopack refused an uppercase extension outright (*Unknown module type*), which is why
  the repository held a `.jpg` while the only URL that resolved was `.JPG`. Nothing
  bundles the file now, so the call site simply spells it in upper case. It is still the
  odd one out in an otherwise lowercase folder and still wants renaming; it is no longer
  urgent. Raised in `asset-inventory.md` §9.
- **The two panels are SVG and render `unoptimized`.** Next's optimizer refuses a remote
  SVG unless `dangerouslyAllowSVG` is set, which it is not and should not be, and the
  Next docs recommend `unoptimized` for vectors regardless. `sizes` is meaningless
  without a srcset, so neither panel carries one.
- **The eight principle icons are inverted at the call site.** They are monochrome line
  art in near-black on transparent and would be invisible on the black card as supplied.
  `<ValueMark>` applies `brightness-0 invert` — the homepage goal marks' treatment, and
  the right one here because the design file's `invert(1) hue-rotate(180deg)` exists to
  preserve colour through an inversion and there is none to preserve.
- **The icon-to-principle pairing was checked, not assumed.** The filenames are bare
  ordinals. The artwork settles it: a lightbulb for Entrepreneurial, stacked hands for
  Teamwork, a handshake under a tick for Trust and Respect, a brain for Owner Mind-Set
  and a wired brain for Continuous Learning all land on the design's own order.

Both `alt` strings the design was missing are now written from the photographs
themselves — the banner is a boardroom group shot, which the design's slot did not
describe at all.

Still open:

- **The Our Ambition sitter's name and role.** The `alt` describes what is visible and
  asserts no identity, which is as far as it can honestly go without them.
- **`solar-field.webp` is square (1024×1024) in a 4:3 box.** The design drew that slot at
  4:3 against a different asset, so `object-cover` centre-crops roughly an eighth off the
  top and bottom. The horizon and the panel rows both survive it and it reads correctly,
  but it is a deliberate crop rather than a fit and wants an eye on it.
- The responsive checklist at all seven widths, and the breadcrumb JSON-LD through a
  validator. Both need a browser, which this project has no tooling for — the same gap
  that sent three of FE-04's criteria to FE-24.

---

### FE-04 — as built

Built section by section, in the order the client's design lays them out. **Built to
`SAEL - New Website.pdf`, not to the Designer prototype** — that reversal and what it
changes per section is recorded in `asset-inventory.md` §10.

**Revised on 2026-08-20 against `SAEL Home v2.dc.html`**, the client's Claude Design
project (`980d47d4-c8e2-40f1-a514-465c538039fb`, read through the design MCP). That
file is now the reference for the sections marked below; the PDF still governs the
ones it does not cover. Where the client's instruction and v2 disagree, the
instruction wins and the disagreement is recorded beside the token or component.

| # | Section | Component | State |
|---|---|---|---|
| 1 | Hero carousel | `sections/hero-carousel/` | **Rebuilt to v2.** One composition, not four: mark → red rule → headline in a single column, right half above `lg` and bottom-anchored below it. The six per-slide placement coordinates are gone. The progress bar pinned to the section's base runs **one full sweep per slide** — four segments, then a quarter-run per slide, then this (2026-08-22). Headline set at `--text-hero`, not v2's larger size — the client's call. Slide 2's crop is shifted right above `lg` so its subject clears the headline. Autoplay still does not pause on hover, only on keyboard focus |
| 2 | About SAEL | `sections/intro-split/` | **Rebuilt to v2** on 2026-08-21, after being held back a day. The PDF's fixed 1280:528 stage and its whole `--about-*` coordinate set are gone; it is a twelve-column grid with a display heading, a rule and running copy beside the composite. Copy on columns 2–6 and artwork on 7–11, drawn in off the gutters rather than v2's 1–6 / 8–12 — the client's call |
| 3 | Business portfolio | `sections/business-tiles/` | **Rebuilt to v2.** A ledger of four rows on the black dotted ground, not four centred tiles on a light one. Capacity figure is now the largest thing on the row. Solar Cell Manufacturing carries its own frosted-grey ground as the one upcoming business. Marks are at three quarters of v2's own `clamp(92px, 10vw, 176px)` — the design's curve, our scale (2026-08-22). The agri mark's per-row nudge was withdrawn the same day; `iconScale` survives unused for when it returns. The copy is capped at v2's 46ch so it wraps before it reaches the mark, and the gutter beside the mark was deliberately **not** reduced with the mark. Each mark is drawn on **its own aspect ratio**, not forced square: the four run 0.918 to 1.040, so a square box letterboxed each differently and left the agri-waste leaves visibly smallest. **And the mark is in flow**, a real column beside the copy, rather than absolutely positioned over the row with a right padding reserving space for it — an out-of-flow box whose only child is also out of flow has no content to size against, so its height came from `aspect-ratio` alone and kept resolving short, which is what was trimming the artwork. `--spacing-ledger-gutter` went with it; a `gap-x-flow` does that job now. Both 2026-08-24. **All of that box is gone as of 2026-08-26**: the mark is a plain `<Image>` at a width with `h-auto`, so it draws at its own proportions with nothing to letterbox and nothing to clip, and `iconScale`, `--aspect-icon-mark` and the `<MediaFrame>` around it went with it. The four PNGs were re-cut the same day — see the revision note below |
| 4 | Our Current Power Portfolio | `sections/presence-map/` | **Rebuilt to v2** on 2026-08-21, and the layout review it was waiting on is closed: map left, display heading with the footprint label and the two figures right, nothing positioned over the artwork any more. A centred flex row rather than v2's 1–6 / 8–12 grid: on a grid both halves are capped and the slack lands between them, which is what kept reading as a hole. The two figures sit a `--spacing-stack` apart and the rule over the footprint label is capped at `--map-rule-w` — all the client's calls, 2026-08-21 and -22. **The 751-subpath generated map is gone**, replaced by the client's supplied `dotted-map.svg`; the six site coordinates are mapped across from the old viewBox and **want a visual check** — see the note in `presence-map/dots.ts`. Carries a **"Portfolio"** section label as of 2026-08-26 — v2's own screen has none, so this is a deliberate departure at the client's request |
| 5 | Our Endeavour | `sections/endeavour-split/` | Unchanged. Left as-is at the client's request on 2026-08-20. **Moved ahead of Solutions on 2026-08-26** — a two-line reorder in `page.tsx`; the section itself is untouched |
| 6 | Solutions | `sections/solutions-carousel/` | **Rebuilt to v2** — four 4:3 plates a hairline apart, each captioned underneath; the gradient plaque is gone. It was kept **before** Our Endeavour and set on the light ground, both the client's calls on 2026-08-20; **both were withdrawn on 2026-08-26** and it now follows Our Endeavour on the black ground, which is v2's own arrangement. The flip minted no token — every ramp is the declared dark counterpart of the paper one it replaced |
| 7 | Our Goals | `sections/goals-grid/` | **Rebuilt to v2** — three cards a hairline apart inside a hairline frame, on black. **The resting state shows the photograph untreated**: the scrim arrives with the pointer, along with the description. The three marks are the client's own artwork as of 2026-08-21, inverted to white at the call site; the `lucide-react` stand-ins are gone. Sized 40 → 56px, then ~4.5x that on 2026-08-22, then halved again to 60 → 126px on 2026-08-24 against the client's revised artwork — the mark is the card's subject, not an icon over a title. **Two sets of marks are in `src/assets/images/`**: `*-goal.svg`, which is what is wired up, and a later `*-icon.svg` set. Confirm which is current before this ships |
| 8 | In the News | `sections/news-carousel/` | **Rebuilt to v2.** The card lost its box — a hairline it hangs from, the date above a 5:4 thumbnail, the accent filling across the rule on hover. Still the one homepage surface fed by the repository |
| 9 | Pixel strip | `sections/footer-pixel-strip/` | Drawn to a canvas. **Moved into the footer on 2026-08-27** and mirrored to do it — solid along its top, dissolving downward, on the flat footer colour with no dot grid. It closed the page from `sections/pixel-strip/` until then, on the dotted paper ground as of 2026-08-26; that version is **retired** to `sections/_retired/pixel-strip/`, which is lint-blocked from being imported. The two files differ by the ground and by one expression, the row's `y` |
| — | Timeline (v2 §08) | — | **Not built.** Deferred by the client on 2026-08-20; to be revisited |
| — | SDG marquee (`features/04` §9) | — | **Skipped**, confirmed by the client on 2026-08-05: not to be built for now |
| — | Our Strength (§7), vision timeline (§8) | — | Not started. Neither appears in the client's PDF — ask before building either |

Landed alongside the v2 revision:

- **`--text-display` (30 → 64px)**, v2's gradient section heading, now used by About
  SAEL, Solutions and the Power Portfolio. `--text-h2` (24 → 36) is left to headings
  inside a card or a rail. `--text-stat-large` (36 → 76) is the footprint figures.
- **The footer takes v2's ground** — `--color-footer-bg` is `#22262e`, a cool slate
  in place of the green-grey it was, with `--color-footer-icon` a shade deeper again
  because it is painted on a white pill rather than on the ground.
- **New client assets, 2026-08-21**: `dotted-map.svg` and the three goal marks, all in
  `src/assets/images/`. The goal marks are drawn in near-black and inverted to white
  with `brightness-0 invert` — they cannot be inlined as components, because all three
  declare the same `clippath` id.

- **`--text-eyebrow` up ~15%** (13 → 16px becomes 15 → 18px), at the client's request:
  every section label on the site moves with it. Note this is the one place the
  instruction and v2 disagree — v2 sets those labels at 10px.
- **`<CardRail>` is gone**, replaced by `ui/rail/` — a `<Rail>` provider with a
  `<RailTrack>` and a `<RailArrows>` that the section places itself. v2 sets the
  arrows in the heading row rather than over the artwork, and one component cannot
  render its own part into a sibling's layout.
- New primitives: `ui/arrow-glyph.tsx`, and a `micro` size on `<Button>`. `<Eyebrow>`
  gained the `bright` and `deep` tones; `<FlankedEyebrow>` gained `rules="leading"` (and was
  deleted again on 2026-08-26 — see below);
  `<Section>` gained the `black`, `black-dots`, `paper` and `paper-dots` grounds.
- Tokens with no consumer left after the revision were removed (the hero dot sizes,
  the light-ground figure colours, the solutions plaque gradient, the always-on goals
  scrim, the tile type scale, the About stage's coordinates, the map's dot ramp).
  `lib/utils/cn.ts`'s `FONT_SIZES` list was updated to match — a `--text-*` token
  missing from it is silently discarded by `cn()`.

**Revised again on 2026-08-25 and -26**, against the client's review of the deployed
build and a second read of `SAEL Home v2.dc.html` through the design MCP:

- **The masthead's outer bar is v2's, turned over into the light.** A flat 68px at every
  width (the `lg` step to 84px is gone — v2 draws one height), `blur(22px) saturate(1.4)`,
  one flat translucent veil at v2's 0.70 → 0.86 in place of the vertical gradient, the
  hairline at its 0.09 → 0.13, its `.3s` transition, and its 8px scroll threshold in place
  of 80. **No shadow at any scroll position** — v2 draws none, so `--shadow-header` and
  `--gradient-header` went with it. Only the structure crossed over, never the hue: the
  design's bar is dark and this one stays light, which is the client's explicit call.
- **The six nav links are v2's middle section**, read off the deployed design rather than
  guessed: `--text-nav-item` at 11px/700/0.18em uppercase, no pill, a
  `clamp(4px, 1vw, 18px)` gap. `--color-nav-pill` and `--radius-nav-pill` went with the
  pill. The CTA is deliberately *not* moved — it still takes `--text-nav`, which is why
  there are now two nav type tokens. The current-page rule is kept; v2 has no equivalent
  and a prototype can afford that, a site cannot.
- **Section labels lost the leading dash and gained an underline that draws itself in.**
  `<FlankedEyebrow>` is deleted — it existed only to draw that dash — and `<Eyebrow>` now
  carries the rule itself, on by default, in the label's own ramp, so picking a tone picks
  both. The rule is CSS reading the `data-reveal` on the `<Reveal>` it already sits in, so
  it replays with everything else and costs no script.
- **The dot grid is one utility now** (`ground-dots-paper` / `ground-dots-dark` in
  globals.css, colour and image and cell size travelling together) and covers **every
  section but the hero**, the pixel strip included. The dot carries a token radius shared
  by both grounds and a half-pixel of feather, so it survives a zoom-out that used to
  erase it — verified 33% → 300%; below 33% it goes, which is the cost of the alphas
  coming down. Those alphas are ~0.4x their original weight after the first pass rendered
  them roughly three times too heavy: the radius went up for the zoom fix and the alpha
  went up alongside it, and the two multiply.
- **The Business Portfolio marks are plain `<Image>`s.** `<MediaFrame>` is for a photograph
  filling a box its parent sized, so using it for a mark meant undoing it three times over
  — a computed aspect ratio, `object-contain`, `overflow-visible`. A static import already
  carries the artwork's intrinsic size.
- **The four business icon PNGs were re-cut** from the hero masters on 2026-08-26. The
  originals were sliced through at the bottom edge — `icon-solar-module.png` ended in a
  132px run of fully opaque artwork sitting *on* its last row — so the crop the client
  reported was baked into the files and no CSS change could have fixed it. They now run
  0.838 to 1.002. **The hero symbol filenames are crossed**: the lettering baked into the
  masters proves `sael-icon-1` is the solar-energy mark and `-3` the cell mark, where the
  hero slides pair them the other way round. The business icons are mapped by that
  lettering; **the hero carousel is not, and wants a look before this ships.**
- **Smaller, all client-requested:** the Solutions heading block stacks below `lg` and its
  title spans a line of its own above the copy and the arrows (its right-hand column was
  `flex-1`, whose `flex-basis: 0` meant it never wrapped — it was squeezed to a ~100px
  column with its copy running off the side of a phone); an Our Goals card pushes its mark
  and name up and brings the description in beneath a rule, rather than swapping one for
  the other; the capacity figures count up on every pass into view.
- **A rail can no longer scroll vertically.** `overflow-x: auto` drags `overflow-y` with it,
  so the entrance transform on the cards still off the right-hand end left every rail 28px
  scrollable *downward* — enough for one diagonal swipe on a phone to hide a news card's
  date under its own top edge, which is what the client was seeing. `rail-reveal-slack`
  absorbs the transform in end padding it takes straight back out of the flow.

**Revised a third time on 2026-08-26**, against a ten-step section sequence from the
client naming each section and its ground. Six of the ten already matched. Two were
fixed, and they are the same two the client had ruled on six days earlier:

- **Our Endeavour now precedes Solutions**, and **Solutions is on `black-dots`** — both
  restoring `SAEL Home v2.dc.html`'s own arrangement, and both explicitly withdrawing the
  2026-08-20 calls recorded in rows 5 and 6 above. The ground flip is eight token swaps
  and no new token: `paper-dots` → `black-dots`, `<Eyebrow>` `deep` → `bright`,
  `<DisplayHeading>` `paper` → `dark`, `text-body-soft` → `text-on-dark-soft`,
  `<RailArrows>` `paper` → `dark`, `border-hairline-paper` → `border-hairline-dark`,
  `text-meta-paper` → `text-on-dark-muted`, and the plate title's `text-ink` **deleted**
  rather than swapped — `<Section>` sets the ground's full-strength ink itself, so naming
  it at the call site was duplication on either ground.
- **The other two deviations were ruled deliberate by the client** and are not outstanding
  work: the Timeline stays unbuilt, and the pixel strip stays where it is rather than
  moving into the footer.

Both the comparison and the remediation plan are in
`docs/homepage-section-sequence-review.md`.

Also landed inside this item, as `features/05` intends: the content repository slice
(`src/lib/content/`) with its mock and API adapters behind `getContentRepository()`,
now carrying `getCapacityStats()` and `getNewsItems()`.

**And a change to FE-03, which is Done.** The masthead was reworked on 2026-08-05 to
the client's `assets/navbar/` design: pill nav links, a gradient Contact Us button, and
a full-screen mega menu in place of the per-item dropdowns (`nav-dropdown.tsx` is
gone). `features/03` §2 describes the old bar and is now the stale document.

Outstanding content, all rendering as `{{TODO: content}}` or flagged: hero `alt` ×4,
the page meta description, and the map's "Visit Location" URLs. **Kurnool's capacity and
the Patiala question are closed** — the map was rebuilt on 2026-08-27 from
`SAEL-Numbers and data.pdf` page 2, which pins eleven *states* rather than six sites, and
neither site is among them. Two things about that map still want the client: which legend
each figure belongs to (derived from page 1's totals, not read from the icons — the
reasoning is in `_content/homepage.ts`), and why the Solar IPP figures sum to 9090 MW
where the same PDF's page 1 says 8.3 GWp. The news items' `href` all point at `/newsroom/`
because no per-article URLs were supplied, and two of their dates are in the future —
both are the client's own design, transcribed rather than corrected. `alt` text for
Solutions, Our Endeavour, About SAEL and the news thumbnails is written and wants a
review.

Two deferred tasks to raise at the end of the project:

- The photography is committed unoptimised (~86 MB across `src/assets/images/`), by
  the client's decision on 2026-08-04 to proceed and revisit. The Our Goals
  backgrounds are the worst of it — 23 MB serving cards that render ~350px wide.
- ~~The Our Goals icons are `lucide-react` stand-ins.~~ Closed 2026-08-21: the client
  supplied the three marks.

**Closed 2026-09-10.** `pnpm check` is clean — lint, typecheck, all nineteen guardrails
and the production build. What that does *not* cover is recorded here rather than ticked,
because three of `features/04`'s acceptance criteria cannot honestly be marked met:

- **The vision timeline criterion is moot.** The client deferred the timeline on
  2026-08-20 and it was never built, so there is no desktop/mobile pair to verify.
- **Autoplay does not pause on hover**, only on keyboard focus. That is `SAEL Home v2`'s
  own behaviour and a deliberate call, not an oversight — but it is a knowing deviation
  from the criterion as written.
- **The image budget is breached and waived.** 45 files exceed the 250KB cap and
  `src/assets/images/` is ~128MB. The client decided on 2026-08-04 to proceed and revisit;
  it is the first of the two deferred tasks below.

Three more — Lighthouse ≥90/100, `axe` zero criticals, and the 360px `scrollWidth`
check — need a browser, and the project has no Playwright, axe or Lighthouse dependency.
They are **FE-24**'s work by definition and are not claimed here. Everything statically
verifiable does pass: no section imports the repository (`news-carousel`'s lone
`import type { NewsItem }` is erased at compile time and is how a content-agnostic
component declares its props), stats and news both come through
`getContentRepository()`, a forced repository failure degrades to figures-less tiles
rather than a dead page, and every `<Image fill>` on the site carries a `sizes`.

### FE-25 — landed

Closed alongside FE-04 on 2026-09-10, which is what it was always waiting on — it
reconciled the guidelines against the homepage, so it could not be signed off while the
homepage was still moving.
Opened after FE-04 revealed that `design-guidelines.md` named ~80 tokens against the 231
`theme.css` actually declares, so the document a new page is supposed to build from
described a homepage that no longer existed. Its spec is **`design-reconciliation.md`**
rather than a `features/NN-*.md` — it reconciles an existing document instead of
specifying a new surface, so there is nothing for a feature doc to hold that the ledger
does not already hold better.

**Landed as of 2026-08-26.** `design-guidelines.md` is realigned against `565a3dc` and is
authoritative again; the guardrail now enforces all four of `/CLAUDE.md` §2.2's value
rules (**C-5**), and the magic-number drift it was written to stop has been cleared
(**C-4**). Ten further fixes are in — **C-1**, **C-3**, **C-6 … C-12**. The full suite is
green.

**`ui/card.tsx` was rewritten, not just adopted** (**C-1**). Its spec described a boxed,
elevated card that v2 had removed, and it had no call sites, so the page's own shape — a
hairline, an inset, an accent that fills across the hairline — became the primitive.
`news-carousel` and `business-tiles` both consume it. Proved inert element-by-element.
Side effect for a later ruling: `ui/tile-shape.tsx` now has no call site, and three tokens
are stranded with it.

**C-2 closed by declining adoption** (2026-08-26). `ui/section-heading.tsx` cannot be
adopted by the homepage: four of the seven heading sections are an `<Eyebrow>` and nothing
else, and the other three wrap every element in its own `<Reveal>` so they cascade — which
a primitive rendering three siblings in one `<div>` cannot express. Its two consumers,
`error.tsx` and `not-found.tsx`, use it exactly as intended, so it was retained unchanged
and the finding recorded as a **documented non-defect**. What the three sections genuinely
shared — the gradient-clipped `--text-display` heading — was extracted as
**`ui/display-heading.tsx`** and all three migrated. Proved inert by two clean builds with
a byte-identical stylesheet.

**Nothing outstanding.** All twelve code fixes are done and the full suite is green.
**A session opening FE-06 should read `design-reconciliation.md` §9 first** — a handoff
covering the primitives, the ground/ramp rule, the `FONT_SIZES` trap, the magic-number
guardrail and the toolchain.

---

## 🔨 In Progress

| ID | Item | Feature doc | Reads | Owner | Started |
|---|---|---|---|---|---|
| FE-05 | Content repository + mock data layer | `features/05-content-repository.md` | `content-model.md`, `api-contracts.md` | Swapnil Raj | 2026-09-18 |

Promoted 2026-09-18 as the top of Pending once FE-08 closed, per the rule. **FE-09 →
FE-11 were then worked ahead of it on 2026-09-19 on the client's instruction**, the same
trade FE-07 made; it stays In Progress. Most of it has already landed piecemeal —
`CapacityStat` and `NewsItem` inside FE-04, `TeamMember` inside FE-07 — so what remains
is the parts no page has needed yet; see the note under Pending.

---

## 📋 Pending

Delivery order. The critical path — FE-01 → FE-04 plus the FE-25 reconciliation — is
done, and FE-06, FE-07 and FE-08 have since established the inner-page openings, so
FE-12 → FE-15 all build on `sections/page-hero/` (photograph or video) or
`sections/team-grid/` plus `sections/prose-split/`, `sections/value-grid/`,
`sections/projects-map/` and `sections/capability-split/`, rather than starting from
the design system alone. The four business pages (FE-08 → FE-11) are done and are the
worked example.

**FE-05 is In Progress now, and is largely already built.** Its repository slice landed
inside FE-04 and feeds the homepage; FE-07 then carved out the team slice —
`TeamMember`, `getTeamMembers()` and both implementations. What remains is the parts no
page has needed yet.

| ID | Item | Feature doc | Reads |
|---|---|---|---|
| FE-12 | Story of Our Influence | `features/12-story-of-our-influence.md` | `design-guidelines.md` |
| FE-13 | Our Key ESG Metrics | `features/13-our-key-esg-metrics.md` | `content-model.md` |
| FE-14 | Our Core Beliefs | `features/14-our-core-beliefs.md` | `design-guidelines.md` |
| FE-15 | Sustainable Development Goals | `features/15-sustainable-development-goals.md` | `design-guidelines.md`, `accessibility-and-seo.md` |
| FE-16 | Investors hub + Corporate Governance + Notifications | `features/16-investors-hub.md` | `content-model.md`, `api-contracts.md` |
| FE-17 | Financials & Reports (5 nested document pages) | `features/17-financials-and-reports.md` | `content-model.md`, `api-contracts.md` |
| FE-18 | Newsroom (listing + pagination) | `features/18-newsroom.md` | `content-model.md`, `api-contracts.md` |
| FE-19 | Contact Us + Investor Contact (forms) | `features/19-contact-and-forms.md` | `api-contracts.md`, `accessibility-and-seo.md` |
| FE-20 | Career redirect | `features/20-career-redirect.md` | `accessibility-and-seo.md` |
| FE-21 | Legal pages (Privacy, Disclaimer, T&C) | `features/21-legal-pages.md` | — |
| FE-22 | SEO, redirects, sitemap, robots | `features/22-seo-and-redirects.md` | `accessibility-and-seo.md` |
| FE-23 | Backend API cutover (mock → Spring Boot) | `features/23-api-integration-cutover.md` | `content-model.md`, `api-contracts.md` |
| FE-24 | Performance & accessibility hardening pass | `features/24-hardening-pass.md` | `accessibility-and-seo.md`, `responsive-strategy.md` |

---

## 🚧 Blocked

Items that cannot start until an external dependency lands. Move to Pending once unblocked.

| ID | Item | Blocked on | Raised |
|---|---|---|---|
| FE-23 | Backend API cutover | Spring Boot endpoints + OpenAPI spec from backend team | — |
| — | Career redirect target URL | Client to confirm exact Oracle recruiting URL | — |
| — | DIN webfont licence confirmation | Client legal. The supplied files permit embedding (`fsType` 0 on the bold OTF, 8 on the regular), which is not the same as holding a licence | — |
| — | Footer contact email + the four social URLs | Client. Stubbed as `{{TODO: content}}` in `src/lib/config/site.ts` — *blocks FE-03* | 2026-08-04 |
| — | SAEL logo, **white** variant | Client. The colour logo ships as a PNG by decision on 2026-08-04, but white cannot be derived from it — the wordmark is a gradient over a black strapline. The footer renders the wordmark as DIN text meanwhile; swapping in the SVG is a one-element change in `footer.tsx` | 2026-08-04 |
| — | `footer-background.jpg` | Client. Absent from the handover, so the footer uses the flat `--color-footer-bg`. `asset-inventory.md` §4 | 2026-08-04 |
| — | Design sign-off on the mobile nav drawer | Design. Built to `features/03` §2 and verified against its accessibility contract; it has no prototype reference, so the visual treatment still wants a review | 2026-08-04 |
| — | A cut of DIN containing `₹` (U+20B9) | Client. Neither supplied file has the glyph, so rupee figures fall back to another face mid-number. Alternative: design approves writing amounts as `INR` — see `src/assets/fonts/README.md` | 2026-08-04 |

**Resolved 2026-08-05**, both by the client supplying the artwork, both consumed by FE-04:

- *Business tile icons without baked-in lettering* — supplied as PNGs in `src/assets/images/business/`. The tiles render them beside an HTML heading, so nothing is duplicated or cropped.
- *Hero overlay symbol icons* — supplied as `src/assets/images/hero/sael-icon-{1..4}.png` and wired per slide.

> FE-23 also appears in Pending because the mock-side scaffolding (adapter shape, env switch, Zod schemas) can and should be built ahead of the real endpoints. Only the final swap is blocked.

---

## Status definitions

| Status | Meaning |
|---|---|
| **Pending** | Specified, not started. Feature doc exists. |
| **In Progress** | Actively being built. Exactly one at a time. |
| **Done** | Acceptance criteria met, `pnpm check` clean, merged to `main` by PR. |
| **Blocked** | Cannot proceed without an external input. Must name the dependency. |

## Adding a new item

1. Write `features/NN-<slug>.md`.
2. Append a row to **Pending** with the next `FE-NN` ID.
3. If it introduces new data, update `content-model.md` and `api-contracts.md` in the same change.
