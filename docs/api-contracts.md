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

### `GET /api/v1/news`

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | int | 1 | 1-based |
| `pageSize` | int | 9 | max 50 |
| `limit` | int | — | When present, returns a bare array of the N most recent and ignores paging. Used by the homepage. |

Response item:

```json
{
  "id": "1783420907",
  "title": "SAEL unveils integrated 5GW solar cell, module manufacturing facility at Jewar",
  "publishedAt": "2026-06-29",
  "imageUrl": "https://<account>.blob.core.windows.net/public/media/jewar-facility.webp",
  "imageAlt": null,
  "externalUrl": "https://www.thehindubusinessline.com/companies/…",
  "source": "The Hindu BusinessLine",
  "excerpt": null
}
```

Sorted `publishedAt` descending.

**Open question for backend:** does SAEL intend to host article bodies eventually, or continue linking to external publishers? If the former, we need a `slug` and a `GET /api/v1/news/{slug}` and the frontend gains a detail route. Currently assumed: link-out only.

---

## 3. Investor documents

One endpoint serves every document listing on the site — Offer Documents, Corporate Governance, all five Financials & Reports sub-pages, and Investor Downloads.

### `GET /api/v1/investor-documents`

| Param | Type | Required | Notes |
|---|---|---|---|
| `category` | enum | yes | See enum below |
| `group` | string | no | Filter to one financial year |

Category enum: `offer-documents`, `corporate-governance`, `annual-return`, `consolidated-financials`, `standalone-financials`, `subsidiary-financials`, `investor-downloads`

Response (bare array):

```json
[
  {
    "id": "doc-1042",
    "title": "Annual Return FY 2024-25 (MGT-7)",
    "category": "annual-return",
    "group": "FY 2024-25",
    "publishedAt": "2025-09-12",
    "fileUrl": "https://<account>.blob.core.windows.net/public/investors/annual-return-fy2024-25.pdf",
    "fileName": "annual-return-fy2024-25.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 2418123
  }
]
```

Requirements on the backend:

- `fileUrl` is an **absolute, publicly readable** Azure Blob URL. The frontend links directly; it does not proxy downloads.
- `sizeBytes` is needed — the UI shows "PDF · 2.4 MB" so users on mobile data know what they are opening. If unavailable, send `null` and the UI omits it.
- `group` drives the accordion grouping on the Financials pages. Use a consistent format (`FY 2024-25`). If `group` is `null` for every item in a category, the UI renders a flat list.
- Sorted by `group` descending, then `publishedAt` descending.

### `GET /api/v1/notifications`

Same item shape with `category: "notifications"`, but **paginated** (envelope from §1). Params: `page`, `pageSize` (default 20).

---

## 4. Company data

### `GET /api/v1/team`

```json
[
  {
    "id": "tm-01",
    "name": "…",
    "designation": "…",
    "photoUrl": "https://…",
    "photoAlt": null,
    "bio": "<p>…</p>",
    "displayOrder": 1
  }
]
```

`bio` may contain HTML. **The backend must sanitise it** — the frontend will additionally sanitise before rendering, but server-side sanitisation is the primary control. Permitted tags: `p, br, strong, em, ul, ol, li, a`.

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

- Authentication or user accounts (no gated investor area)
- Search endpoints
- Multilingual content
- Careers/job endpoints — careers redirects to Oracle
- Analytics or event ingestion
- Static page content (About, Business, Sustainability copy) — this is in the repo
- Any write endpoint other than enquiries

---

## 8. Divergence log

Maintained during FE-23. One row per place the delivered API differs from the proposal above.

| Date | Endpoint | Proposed | Delivered | Handled in |
|---|---|---|---|---|
| — | — | — | — | — |
