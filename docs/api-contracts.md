# API Contracts (Proposed)

**Status: proposal.** These are the contracts the frontend is built against while `CONTENT_SOURCE=mock`. They are a starting point for the Spring Boot team, not a specification they must accept. Where the backend diverges, record the divergence in §8 and absorb it in `src/lib/content/api/mappers.ts` — **the domain types in `content-model.md` do not change.**

Base URL: `API_BASE_URL` (server-side only, never exposed to the browser).

---

## 1. Conventions

- **Transport:** HTTPS, JSON, UTF-8.
- **Auth:** none assumed for public read endpoints. If the gateway requires a key, it is a server-side header set in `apiFetch`; tell us the header name and we will add it without touching call sites.
- **Dates:** ISO 8601 date (`2026-06-29`) or date-time with offset (`2026-06-29T10:30:00+05:30`). Never epoch millis, never `DD-MM-YYYY`.
- **Pagination:** 1-based `page`, explicit `pageSize`, envelope carries `totalItems` and `totalPages`. Do not use cursor pagination for these listings — the UI needs numbered pages.
- **Sorting:** the backend applies the default sort. The frontend does not re-sort server data.
- **Nulls:** send `null` for absent values. Do not omit the key, and do not send `""` to mean absent.
- **Errors:** non-2xx with a JSON body `{ "timestamp", "status", "error", "message", "path" }` (Spring Boot default is fine). The frontend never renders `message` to the user.
- **CORS:** not required. All calls are server-to-server from the Next.js process.

### Standard envelope

Collections that paginate:

```json
{
  "content": [ /* … */ ],
  "page": 1,
  "pageSize": 9,
  "totalItems": 47,
  "totalPages": 6
}
```

Collections that do not paginate return a bare JSON array.

---

## 2. Newsroom

Revised 2026-10-01, when the Newsroom was built. The legacy site has four sections, and two of them host articles on SAEL's own site, which settles this section's old open question: **yes, SAEL hosts article bodies.** That applies to Press Release and Our Views, which need a `slug` and a detail endpoint; In The News still links out.

| `category` | What an item is | Has a date | Destination |
|---|---|---|---|
| `press-release` | A release, hosted here | yes | `/newsroom/press-release/{slug}/` |
| `in-the-news` | Coverage elsewhere | yes | `externalUrl`, opened in a new tab |
| `our-views` | An opinion piece, hosted here | **no** | `/newsroom/our-views/{slug}/` |
| `multimedia` | A YouTube video | **no** | the video, played in a dialog |

### `GET /api/v1/news`

| Param | Type | Default | Notes |
|---|---|---|---|
| `category` | enum | — | One of the four above. **Omitted, it means every category** — the homepage's call (see below). |
| `limit` | int | — | When present, the first N of the result. |

Returns a **bare array**, no envelope and no paging: the legacy listings put every item on one page (42 is the largest today), and paged listing URLs would be new URLs. If a category ever outgrows the payload ceiling in §6 we will paginate it then, as a deliberate URL decision.

**Order is the backend's**, and the frontend does not re-sort: dated categories newest first, ties in the business's own order; undated categories (Our Views, Multimedia) in the business's own order. A `displayOrder` field is the obvious way to carry that, and the frontend does not need it in the response.

Response item:

```json
{
  "id": "sael-unveils-integrated-5gw-solar-cell-module-manufacturing-facility-at-jewar",
  "category": "in-the-news",
  "title": "SAEL unveils integrated 5GW solar cell, module manufacturing facility at Jewar",
  "publishedAt": "2026-06-29",
  "imageUrl": "https://<account>.blob.core.windows.net/<container>/web-assets/img/media/sael-unveils-integrated-5gw-solar-cell-module-manufacturing-facility-at-jewar-1783420907.webp",
  "imageAlt": "SAEL unveils integrated 5GW solar cell, module manufacturing facility at Jewar",
  "slug": null,
  "externalUrl": "https://www.thehindubusinessline.com/companies/sael-unveils-integrated-5gw-solar-cell-module-manufacturing-facility-at-jewar/article71157439.ece",
  "videoId": null,
  "source": null
}
```

Which fields are set follows `category`, and the others are `null`, not omitted:

- `publishedAt`: set for `press-release` and `in-the-news`, `null` for the other two. ISO 8601 date.
- `slug`: set for `press-release` and `our-views`. The URL segment, **verbatim from the legacy site, artefacts included**: one Our Views slug contains `india39s`, a mangled apostrophe, and it is a live URL with search equity. Slugs must never be regenerated from titles.
- `externalUrl`: set for `in-the-news`.
- `videoId`: set for `multimedia` — the YouTube id, not a URL. The frontend builds the thumbnail, watch and embed URLs.
- `imageUrl`: absolute. May be `null` for `multimedia`, where the frontend uses YouTube's thumbnail.
- `imageAlt`: `null` when none was entered; the frontend falls back to the title.
- `source`: the publication's name. The legacy cards do not show one, so it is `null` today and the frontend shows it only when set.

An item missing the field its category needs (an article with no `slug`, say) is dropped by the frontend rather than rendered as a card that goes nowhere.

**The homepage's call, `category` omitted.** The homepage carousel calls `limit=9` with no category. Against this contract that is the newest items across every category, Multimedia and Our Views included, though they have no date. Decide before cutover which category the homepage should show and pass it. The mock does not follow this: it returns the homepage's original six-item fixture unchanged, so the homepage does not change before that decision. `src/lib/content/mock/index.ts`.

### `GET /api/v1/news/{category}/{slug}`

One Press Release or Our Views article. `category` is `press-release` or `our-views`; anything else is a `404`. The response is the item above plus:

```json
{
  "body": "<p><strong>Rajasthan: </strong>SAEL Industries Ltd. (SIL), …</p><p>…</p>"
}
```

- `body` is HTML, sanitised server-side. The frontend sanitises it again (`src/lib/utils/sanitize-article.ts`) to this allowlist, which is what the legacy articles use: `p br h2 h3 h4 ul ol li strong b em i u a blockquote figure figcaption img`; on `a` only `href`, on `img` only `src alt width height`, and `https:` images only. The article's `<h1>` is its title, so a body starts at `h2`.
- Images in a body are absolute URLs in the container, like `imageUrl`. **Every body image needs `alt`**: the legacy CMS saved none.
- `404` for an unknown slug. The frontend renders its not-found page. Any other non-2xx is treated as unavailable.

The frontend builds every article page at build time from the list endpoint's slugs, and a slug not in that list is a 404 until the next build. There is no on-demand rendering (/CLAUDE.md §7), so **a new article appears on the site at the next deploy**, as do new list items.

## 3. Investor documents

One endpoint serves every document listing on the site — the Offer Documents sub-pages, Corporate Governance, all five Financials & Reports sub-pages, and Investor Downloads. A second serves the two disclosure videos. Both are consumed through `getInvestorDocuments(listing)` and `getInvestorVideos(listing)` on the content repository.

*Revised 2026-09-29 with the Offer Documents area, the first investor pages built.* Offer Documents turned out to be eight sub-pages rather than one listing, so a listing is now addressed by `category` **and** `section`; documents gained an explicit `displayOrder`; and videos got their own endpoint.

*Revised again 2026-09-30 with the rest of the investor area.* Corporate Governance is also one category over several pages, so it takes `section` too; documents gained a `subgroup` (General Meeting nests years under a heading); and `displayOrder` now runs across the whole listing rather than within a group, so the business orders the headings as well as the documents. The Financials pages and Notifications are one category each and need no `section`.

### `GET /api/v1/investor-documents`

| Param | Type | Required | Notes |
|---|---|---|---|
| `category` | enum | yes | See enum below |
| `section` | string | when the category has sections | The sub-page within the category — its URL slug. Only `offer-documents` has sections today; see below. Omit for any other category. |
| `group` | string | no | Filter to one financial year |

Category enum: `offer-documents`, `corporate-governance`, `annual-return`, `consolidated-financials`, `standalone-financials`, `subsidiary-financials`, `investor-downloads`

Sections of `offer-documents` — each the last segment of the page's URL, so the value a page asks for is the one in its address bar:

| `section` | Page | Documents |
|---|---|---|
| `drhp` | `/investors/offer-documents/drhp/` | 1 |
| `corrigendum-to-drhp` | `…/corrigendum-to-drhp/` | 1 |
| `addendum-to-drhp` | `…/addendum-to-drhp/` | 1 |
| `industry-report` | `…/industry-report/` | 1 |
| `information-with-respect-to-group-companies` | `…/information-with-respect-to-group-companies/` | 9, grouped `FY 2025` / `FY 2024` / `FY 2023` |

The two audio-visual pages are served by `/investor-videos` below, and `outstanding-dues-to-material-creditors` is a table transcribed into the frontend, not a document.

Sections of `corporate-governance`, on the same rule. Board of Directors and Board Committees are not document listings — see the governance endpoints in §4.

| `section` | Page | Documents |
|---|---|---|
| `codes-and-policies` | `/investors/corporate-governance/codes-and-policies/` | 24, grouped `Statutory Policies` / `Corporate Policies` |
| `sustainability-reports` | `…/sustainability-reports/` | 5, grouped `ESG and GHG Reports` / `SAEL Solar 300MW MHP1 Project’s Environment & Social Reports` |
| `csr` | `…/csr/` | 3, grouped `FY2026` / `FY2027` — the company's spelling and order |
| `general-meeting` | `…/general-meeting/` | 21, grouped `Annual General` / `Extra-Ordinary General Meeting`, the latter subgrouped `FY 2026` … `FY 2023` |
| `familiarization-programme` | `…/familiarization-programme/` | 1, grouped `FY 2026` |
| `other-documents` | `…/other-documents/` | 4, grouped `Other Documents` / `Composite Scheme of Arrangement` |

The one-page categories, with no `section`: `annual-return` (4), `consolidated-financials` (3), `standalone-financials` (3), `subsidiary-financials` (64), `investor-downloads` (12) and `notifications` (2) — every one grouped by financial year.

Response (bare array):

```json
[
  {
    "id": "doc-1042",
    "title": "Annual Return FY 2024-25 (MGT-7)",
    "category": "annual-return",
    "section": null,
    "group": "FY 2024-25",
    "subgroup": null,
    "publishedAt": "2025-09-12",
    "fileUrl": "https://<account>.blob.core.windows.net/<container>/web-assets/documents/investors/annual-return-fy2024-25.pdf",
    "fileName": "annual-return-fy2024-25.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 2418123,
    "displayOrder": 1
  }
]
```

An Offer Documents row, for comparison:

```json
{
  "id": "group-companies-fy2024-sun-layer-energy",
  "title": "Sun Layer Energy Private Limited",
  "category": "offer-documents",
  "section": "information-with-respect-to-group-companies",
  "group": "FY 2024",
  "subgroup": null,
  "publishedAt": null,
  "fileUrl": "https://<account>.blob.core.windows.net/<container>/web-assets/documents/investors/offer-documents/information-with-respect-to-group-companies/FY-2024/Sun-Layer-Energy-Private-Limited.pdf",
  "fileName": "Sun-Layer-Energy-Private-Limited.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 7208449,
  "displayOrder": 3
}
```

Requirements on the backend:

- `fileUrl` is an **absolute, publicly readable** Azure Blob URL. The frontend links directly; it does not proxy downloads.
- `title` is shown **verbatim** as the link text. For regulated documents it is the text the company published — do not normalise, case or trim it.
- `sizeBytes` is needed — the Financials pages show "PDF · 2.4 MB" so users on mobile data know what they are opening. If unavailable, send `null` and the UI omits it. (The Offer Documents pages deliberately show no size, because the legacy pages show none; they still want the field.)
- `group` partitions a listing: accordions on the Financials pages, stacked year headings on Group Companies. Use a consistent format (`FY 2024-25`, or `FY 2025` where the published label is that). If `group` is `null` for every item in a listing, the UI renders a flat list.
- `group` and `subgroup` are **labels, shown verbatim** — send them exactly as the company writes them, inconsistencies included (`FY 2025`, `FY2026`). The frontend derives each heading's anchor from its label (lower-cased, letters and digits only: `FY 2025` → `#fy2025`), which is how the legacy site formed its tab ids, so old deep links still land.
- `subgroup` divides a group once more, and is `null` everywhere but General Meeting, whose "Extra-Ordinary General Meeting" is divided by financial year. **New 2026-09-30.**
- `displayOrder` runs **across the whole listing**, ascending, and the frontend shows headings in the order of their first document. **Changed 2026-09-30** from "within a group", because a sort on the labels cannot give the order the company publishes: years run newest first on most pages but oldest first on CSR, and named groups ("ESG and GHG Reports" before "SAEL Solar 300MW MHP1 Project’s …") have no natural sort at all. The proposal before that sorted by `publishedAt`, but none of these documents carries a date.
- Sorted by `displayOrder` ascending. The frontend does not re-sort (§1).
- A heading the company shows with nothing under it (General Meeting's "Postal Ballot") is declared by the frontend, not sent — there is no document to carry it.
- `publishedAt` is `null` where the document has no date to show. Never a placeholder date.

### `GET /api/v1/investor-videos`

*New 2026-09-29.* The DRHP's audio-visual presentations, one video per page. Separate from documents because a video carries a poster and caption tracks, which would otherwise be two meaningless fields on every PDF.

| Param | Type | Required | Notes |
|---|---|---|---|
| `category` | enum | yes | As above |
| `section` | string | when the category has sections | `drhp-audio-visuals-english`, `drhp-audio-visuals-hindi` |

Response (bare array — one item per listing today):

```json
[
  {
    "id": "drhp-audio-visuals-english",
    "title": "DRHP - Audio Visual (English)",
    "category": "offer-documents",
    "section": "drhp-audio-visuals-english",
    "fileUrl": "https://<account>.blob.core.windows.net/<container>/web-assets/media/offer-documents/SAEL-DRHP-English.mp4",
    "fileName": "SAEL-DRHP-English.mp4",
    "mimeType": "video/mp4",
    "sizeBytes": 111001343,
    "posterUrl": "https://<account>.blob.core.windows.net/<container>/web-assets/media/offer-documents/drhp-english.png",
    "captions": [
      {
        "url": "https://<account>.blob.core.windows.net/<container>/web-assets/media/offer-documents/SAEL-DRHP-English.en.vtt",
        "srcLang": "en",
        "label": "English"
      }
    ]
  }
]
```

- `captions` is an array of **WebVTT** tracks, `[]` when there are none — which is the case for both videos today. `srcLang` is BCP 47 (`en`, `hi`); `label` is what the player's caption menu shows. The first track is the default.
- A caption track on another origin only loads if the container sends CORS headers for the site's origin (`GET`, `https://www.sael.co` and any staging origin). **Configure that before the first `.vtt` is uploaded** — the player turns on `crossorigin` only when a track is present, because with it on and no CORS rule the video itself fails.
- `posterUrl` may be `null`; the player then shows its own first frame.

### Consent-gated listings — what the backend needs to know

Three Offer Documents pages put their files behind a disclaimer the reader must confirm: `drhp` (per document, on click), and both audio-visual pages (per page, on arrival). **The endpoints do not change for them** — no flag, no auth, no token. The gate is a frontend behaviour:

- The frontend never renders a gated listing's `fileUrl`, `posterUrl` or caption URLs into the page. It fetches them server-side, through a Next.js Server Action, only after the reader presses "I Confirm", and hands the browser just the URL it needs. The rest of the row stays on the server.
- Which listings are gated is recorded in the frontend's content (`src/app/_content/offer-documents.ts`), next to the disclaimer text, because it changes when the legal text changes — with a filing, which is a reviewed deploy.
- The files themselves are public blobs, exactly as they were public files on the legacy site. The gate is the click-through affirmation the disclosure requires, not access control, and nothing here pretends otherwise.

**For legal review — indexing.** The proposal is: the gated pages are indexable (their disclaimer text is ordinary HTML), and the gated files are not linked from anything a crawler reads. What that cannot stop is a search engine finding a blob URL some other way — a share, a referrer. If the gated files must also not be indexed, the container needs to send `X-Robots-Tag: noindex` on them. Azure Blob Storage cannot set arbitrary response headers itself, so that means fronting the container with Azure Front Door or CDN and a rules-engine header on the `web-assets/documents/investors/offer-documents/drhp/` and `web-assets/media/offer-documents/` paths. Not configured; a decision for legal and infrastructure.

### `GET /api/v1/notifications`

Same item shape with `category: "notifications"`, but **paginated** (envelope from §1). Params: `page`, `pageSize` (default 20).

**Not needed yet.** With two notifications, `/investors/notifications/` reads `GET /api/v1/investor-documents?category=notifications` like every other listing, grouped by year. This paginated endpoint stays the proposal for when the list outgrows one page.

---

## 4. Company data

### `GET /api/v1/board-members`

*New 2026-09-30.* The Board of Directors, as `/investors/corporate-governance/board-of-directors/` lists it. Bare array, sorted by `displayOrder`.

```json
[
  {
    "id": "jasbir-singh",
    "name": "Jasbir Singh",
    "designation": "Managing Director and Chairperson",
    "bio": "<p><strong>Jasbir Singh</strong> is the Managing Director and Chairperson of our Company. …</p>",
    "displayOrder": 1
  }
]
```

- **A separate record from `/team`**, even for the same person: this is the governance record, worded for the board page, and neither page may silently rewrite the other.
- `bio` is HTML with the same permitted tags as `/team` (`p, br, strong, em, ul, ol, li, a`), sanitised by the backend and again by the frontend. `null` when there is none.
- Why an endpoint rather than copy in the repo: the board changes by resolution, and SEBI LODR Reg. 46 wants the website current within days of it — faster than a deploy cycle, and in step with the Notifications that announce resignations.

### `GET /api/v1/board-committees`

*New 2026-09-30.* The board's committees, as `/investors/corporate-governance/board-committees/` lists them. Bare array, sorted by `displayOrder`; members in the order sent.

```json
[
  {
    "id": "audit-committee",
    "name": "Audit Committee",
    "members": [
      { "name": "Mr. Harbhajan Singh", "category": "Non-Executive Independent Director", "position": "Chairman" }
    ],
    "displayOrder": 1
  }
]
```

- Every string is shown verbatim, including where it spells a director differently from `/board-members` ("Bjornar" / "Bjørnar"). The frontend does not reconcile them.
- `position` is the member's role on the committee — the page's "Designation" column ("Chairman", "Member", "Invitee").

### `GET /api/v1/team`

```json
[
  {
    "id": "tm-01",
    "name": "…",
    "designation": "…",
    "group": "leadership",
    "photoUrl": "https://…",
    "photoAlt": null,
    "bio": "<p>…</p>",
    "linkedinUrl": "https://www.linkedin.com/in/…",
    "portraitZoom": 1.5,
    "displayOrder": 1
  }
]
```

`portraitZoom` is a positive number, optional. It is how far the biography
dialog zooms the portrait into its head-and-shoulders crop, set per person by
the client (2026-09-17); `1.5` is the default and a missing, null or
non-positive value maps to it.

`bio` may contain HTML. **The backend must sanitise it** — the frontend will additionally sanitise before rendering, but server-side sanitisation is the primary control. Permitted tags: `p, br, strong, em, ul, ol, li, a`.

`group` is `"leadership" | "management"` — the two tabs on `/our-team/`. **Added
by FE-07**, which needed it: the page is one request rendering both tabs, and
the split has to come from the data rather than from a list of names in a
component. Any other value should be treated as a mapping failure for that row,
not silently bucketed.

`photoAlt` is accepted and **ignored**. The frontend uses `name` as the
portrait's alternative text, which is the correct description of a photograph
of a person; a nullable second field that always falls back to `name` has no
consumer. Nothing needs to change server-side — it is simply not mapped.

The frontend's second sanitiser is `src/lib/utils/sanitize-bio.ts`, and its
allowlist is exactly the eight tags above. A tag added here without being added
there will be stripped before it renders.

`linkedinUrl` is an absolute profile URL or `null`, and **added by FE-07** from
the live site, where seven of the seventeen people carry one in their popup. It
is `null` far more often than not; the frontend omits the link rather than
rendering a disabled affordance, so the backend should send `null` and never an
empty string. It is rendered as an outbound link with
`rel="noopener noreferrer"`, so nothing is required of the value beyond it being
a URL the client is happy to send visitors to.

### `GET /api/v1/capacity-stats`

Drives the homepage stats band and the About page figures.

```json
[
  { "id": "solar-ipp",   "label": "Solar Energy Generation",     "value": "8299 MWp",       "footnote": null,        "displayOrder": 1 },
  { "id": "cell-mfg",    "label": "Solar Cell Manufacturing",    "value": "5 GW",           "footnote": "*proposed", "displayOrder": 2 },
  { "id": "module-mfg",  "label": "Solar Module Manufacturing",  "value": "3625 MW + 5 GW", "footnote": "*proposed", "displayOrder": 3 },
  { "id": "wte",         "label": "Agri Waste to Energy",        "value": "164.9 MW",       "footnote": null,        "displayOrder": 4 }
]
```

`value` is a **pre-formatted display string** owned by the business. The frontend does not parse, round, or unit-convert it. `footnote` renders as a superscript marker with the note beneath the band.

### `GET /api/v1/esg-metrics`

```json
[
  {
    "id": "esg-co2",
    "label": "CO₂ emissions avoided",
    "value": "1.2",
    "unit": "million tonnes",
    "period": "FY 2024-25",
    "category": "Environment",
    "displayOrder": 1
  }
]
```

`category` groups the metrics into sections. Expected values: `Environment`, `Social`, `Governance`.

---

## 5. Form submissions

The browser posts to a Next.js route handler; the route handler posts here. The backend decides what happens next (CRM, email, DB) — the frontend has no opinion.

### `POST /api/v1/enquiries`

Request:

```json
{
  "formType": "contact" | "investor-contact",
  "name": "…",
  "email": "…",
  "phone": "…",
  "subject": "…",
  "message": "…",
  "consent": true,
  "meta": {
    "sourceUrl": "https://www.sael.co/contact-us/",
    "submittedAt": "2026-08-03T11:42:07+05:30"
  }
}
```

Response — success `200`/`201`:

```json
{ "success": true, "referenceId": "ENQ-2026-004182" }
```

Response — validation failure `400`:

```json
{
  "success": false,
  "message": "Validation failed",
  "fieldErrors": { "email": "Enter a valid email address" }
}
```

Requirements:

- `fieldErrors` keys **must match the request field names exactly** so the frontend can attach them to the right input.
- The frontend validates client-side with Zod first; this is defence in depth, not the only gate.
- Rate limiting and spam protection are the backend's responsibility (confirmed with client). Return `429` with the standard error body and the frontend will show a retry message.
- `referenceId` is displayed to the user on success if present, omitted if not.

---

## 6. Non-functional expectations

| | |
|---|---|
| Response time | p95 < 500ms for read endpoints. The frontend times out at 8s. |
| Availability | Read failures degrade to an empty state — a page never 500s because a list failed. |
| Caching | Send `Cache-Control` headers if you like; Next caches for 300s regardless. Read endpoints should be safely cacheable. |
| Payload | Keep list responses under ~200KB. If a category exceeds it, we will paginate that category too. |
| Versioning | `/api/v1/` in the path. Breaking changes get `/v2/`. |
| Health | A `GET /actuator/health` (or equivalent) URL, for the infrastructure team. |

---

## 7. What the frontend explicitly does *not* need

Stated so the backend does not build it speculatively:

- Authentication or user accounts (no gated investor area). The Offer Documents consent gates are not an exception: they are a click-through disclaimer handled entirely in the frontend, and need nothing from these endpoints — see §3.
- Search endpoints
- Multilingual content
- Careers/job endpoints — `/career/` is a page since 2026-09-22, but its two "Explore" CTAs link out to the Oracle recruiting portal, which is where applications are made. No listing and no application endpoint.
- Analytics or event ingestion
- Static page content (About, Business, Sustainability, Careers copy) — this is in the repo
- Any write endpoint other than enquiries

---

## 8. Divergence log

Maintained during FE-23. One row per place the delivered API differs from the proposal above.

| Date | Endpoint | Proposed | Delivered | Handled in |
|---|---|---|---|---|
| — | — | — | — | — |
