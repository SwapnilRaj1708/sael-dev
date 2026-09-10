# Content Model & Data Layer

The backend is **Spring Boot microservices + MySQL**, with **Azure Blob Storage** for PDFs and media. **None of it exists yet.** This document defines the boundary that lets us build the entire frontend now and swap in real endpoints later without touching a component.

---

## 1. Two kinds of content

Be deliberate about which bucket a piece of content falls into. Putting static marketing copy behind an API is a common and expensive mistake.

| | Static content | Dynamic content |
|---|---|---|
| **Examples** | Hero slide copy, Mission/Vision/Ethos, business descriptions, SDG list, nav structure, legal pages | News items, investor documents, notifications, team members, ESG metrics, capacity figures |
| **Changes** | With a design/copy review, i.e. a deploy | Independently, by the business |
| **Lives in** | `src/lib/content/static/*.ts` — typed TS constants | The `ContentRepository` |
| **Rendered** | Prerendered at build | Server-fetched with a 5-minute cache |

**Capacity figures are dynamic**, despite looking static. The homepage stats band (8299 MWp, 5 GW, 3625 MW + 5 GW, 164.9 MW) changes as plants commission and appears in three places. It goes through the repository.

---

## 2. Domain types

`src/lib/content/types.ts`. These are the frontend's model — they are **not** required to mirror the backend's DTOs one-for-one. The API adapter maps between them.

```ts
/** Anything backed by an Azure Blob asset. */
export interface BlobAsset {
  url: string;              // absolute, Azure Blob
  fileName: string;
  mimeType: string;
  sizeBytes?: number;
}

export interface ImageAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

/* ---------- Newsroom ---------- */

export interface NewsItem {
  id: string;
  title: string;
  publishedAt: string;      // ISO 8601 date, e.g. "2026-06-29"
  image: ImageAsset | null;
  /** External publisher URL. SAEL currently links out rather than hosting articles. */
  externalUrl: string | null;
  source: string | null;    // "The Hindu BusinessLine"
  excerpt: string | null;
}

/* ---------- Investors ---------- */

export type InvestorDocumentCategory =
  | 'offer-documents'
  | 'corporate-governance'
  | 'annual-return'
  | 'consolidated-financials'
  | 'standalone-financials'
  | 'subsidiary-financials'
  | 'investor-downloads'
  | 'notifications';

export interface InvestorDocument {
  id: string;
  title: string;
  category: InvestorDocumentCategory;
  /** Grouping label within a category, usually a financial year: "FY 2024-25". */
  group: string | null;
  publishedAt: string | null;
  file: BlobAsset;
}

/* ---------- Company ---------- */

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  photo: ImageAsset | null;
  bio: string | null;       // may contain sanitised HTML
  order: number;
}

export interface CapacityStat {
  id: string;
  label: string;            // "Solar Energy Generation"
  value: string;            // "8299 MWp" — pre-formatted by the backend
  footnote: string | null;  // "*proposed"
  order: number;
}

export interface EsgMetric {
  id: string;
  label: string;
  value: string;
  unit: string | null;
  period: string | null;    // "FY 2024-25"
  category: string | null;  // "Environment" | "Social" | "Governance"
  order: number;
}

/* ---------- Shared ---------- */

export interface Paginated<T> {
  items: T[];
  page: number;             // 1-based
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
```

### Conventions

- **Dates are ISO 8601 strings**, never `Date` objects. `Date` does not survive the server→client boundary and forces every consumer to re-parse. Format at render with `formatDate()`.
- **Pre-formatted display values.** `CapacityStat.value` is `"3625 MW + 5 GW"`, not a number plus a unit. The business owns that string; the frontend must not attempt to compose it.
- **Nullable, not optional.** `foo: string | null` rather than `foo?: string`. Makes "the backend sent nothing" explicit and distinguishable from "we forgot to map it".
- **No `id` invention.** If the backend does not supply a stable id, the adapter derives one deterministically (e.g. slug of title + date) and documents it. Never `Math.random()` or array index — both break React reconciliation and pagination.

---

## 3. The repository contract

`src/lib/content/repository.ts`. **This interface is the entire boundary.** Adding a dynamic surface means adding a method here first.

```ts
export interface ContentRepository {
  // Newsroom
  getLatestNews(params: { limit: number }): Promise<NewsItem[]>;
  getNewsPage(params: { page: number; pageSize: number }): Promise<Paginated<NewsItem>>;

  // Investors
  getInvestorDocuments(params: {
    category: InvestorDocumentCategory;
  }): Promise<InvestorDocument[]>;
  getNotifications(params: { page: number; pageSize: number }): Promise<Paginated<InvestorDocument>>;

  // Company
  getTeamMembers(): Promise<TeamMember[]>;
  getCapacityStats(): Promise<CapacityStat[]>;
  getEsgMetrics(): Promise<EsgMetric[]>;
}
```

Rules:

1. **Every method returns a resolved value or throws `ContentUnavailableError`.** No `undefined`, no silent `null` for a list. An empty list is `[]`.
2. **Callers handle failure locally.** A page wraps its repository call and renders `<EmptyState>` on error. A failed news fetch must not take down the homepage.
3. **Both implementations, always.** Never merge a method implemented only in the mock. The API implementation may be a stub that throws `NotImplementedError` — but it must exist so the cutover is a checklist, not an archaeology exercise.
4. **No pass-through of backend shapes.** If the Spring Boot response calls it `docTitle`, the adapter maps it to `title`. Components never learn the backend's vocabulary.

### The factory

```ts
// src/lib/content/index.ts
import { env } from '@/lib/config/env';

let instance: ContentRepository | null = null;

export function getContentRepository(): ContentRepository {
  if (!instance) {
    instance = env.CONTENT_SOURCE === 'api'
      ? new ApiContentRepository({ baseUrl: env.API_BASE_URL, timeoutMs: env.API_TIMEOUT_MS })
      : new MockContentRepository();
  }
  return instance;
}
```

Components import **only** `getContentRepository` from `@/lib/content`. Importing from `@/lib/content/mock` or `@/lib/content/api` anywhere outside `index.ts` is a review rejection. Add an ESLint `no-restricted-imports` rule to enforce it.

---

## 4. Mock implementation

```
src/lib/content/mock/
├── index.ts              MockContentRepository
└── data/
    ├── news.json
    ├── investor-documents.json
    ├── notifications.json
    ├── team.json
    ├── capacity-stats.json
    └── esg-metrics.json
```

The mock must be a realistic stand-in, not a happy path:

- **Realistic volume.** 25+ news items so pagination is genuinely exercised. 40+ investor documents across all categories and several financial years.
- **Realistic content.** Seed from the live site — real headlines, real dates, real document titles. Placeholder Lorem hides layout failures that real copy exposes.
- **Edge cases included.** At least one news item with no image, one with a 140-character headline, one document with no date, one team member with no photo. These are the cases that break in production.
- **Pagination implemented properly.** `getNewsPage` slices and returns correct `totalItems`/`totalPages`. Do not return everything and let the UI slice.
- **Optional latency.** Honour `MOCK_LATENCY_MS` (default `0`) so loading and error states can be exercised locally.
- **Blob URLs are plausible.** `https://<account>.blob.core.windows.net/public/investors/annual-return-fy2024-25.pdf` — composed via `blobUrl()`, so switching to the real account is one env change. Mock PDFs may 404; that is acceptable and should be noted in the mock's file header.

---

## 5. API implementation

```
src/lib/content/api/
├── index.ts       ApiContentRepository
├── client.ts      apiFetch<T>() — timeout, error normalisation, Zod parse
├── schemas.ts     Zod schemas for every backend response
└── mappers.ts     backend DTO → domain type
```

`apiFetch` responsibilities:

- `AbortController` timeout at `API_TIMEOUT_MS` (default 8000ms).
- Next.js cache options passed through: `{ next: { revalidate, tags } }`.
- Non-2xx → `ContentUnavailableError` carrying status and endpoint.
- **Zod parse before returning.** A schema failure logs the issue paths server-side and throws `ContentUnavailableError` — it never returns half-valid data into the render tree.
- No retries at this layer. A marketing page should fail fast to its empty state rather than hold the request open.

---

## 6. Forms — the write path

Forms do **not** call Spring Boot from the browser.

```
<ContactForm> ──POST──▶ /api/forms/contact ──▶ Spring Boot
   'use client'            Next route handler
```

Why: keeps `API_BASE_URL` and any credential server-side, avoids CORS configuration on the backend, and gives one place to normalise error shapes.

The route handler:

1. Parses the body with the **same Zod schema** the client form uses (`src/lib/forms/schemas.ts` — one definition, imported by both).
2. Returns `400` with `{ ok: false, fieldErrors }` on validation failure.
3. Forwards to the configured backend endpoint.
4. Normalises every outcome to `{ ok: true } | { ok: false, message: string, fieldErrors?: Record<string, string> }`.
5. Never leaks the backend's error body to the client.

While `CONTENT_SOURCE=mock`, the handler logs the payload and returns `{ ok: true }` after a short delay, so the full success/error UI is buildable today.

Forms in scope: **Contact Us** and **Investor Contact**. Both post to `/api/forms/[form]`. Careers is an external redirect and has no form.

---

## 7. Cutover procedure (FE-23)

When the Spring Boot endpoints land:

1. Backend team supplies the OpenAPI spec. Reconcile it against `api-contracts.md` and record any divergence there.
2. Write Zod schemas in `api/schemas.ts` from the actual spec.
3. Write `api/mappers.ts` — backend DTO to domain type.
4. Implement `ApiContentRepository` method by method. Ship them one at a time; the factory is all-or-nothing per environment, so use a staging environment with `CONTENT_SOURCE=api` while `mock` remains the default elsewhere.
5. For each method, diff mock output against API output for the same query. Field-level parity, including nulls.
6. Verify every empty and error state against the real backend (kill the service, confirm pages still render).
7. Flip `CONTENT_SOURCE=api` per environment.
8. **Keep the mock.** It stays as the local-development default and as a fixture source. Do not delete it.

No component file should change during this entire process. If one does, the boundary was wrong and that is the bug to fix.
