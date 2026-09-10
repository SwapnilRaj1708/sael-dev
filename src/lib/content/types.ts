/**
 * The frontend's domain model. docs/content-model.md §2.
 *
 * These are **not** required to mirror the backend's DTOs — the API adapter
 * maps between them, so a rename in Spring Boot is a change to one mapper
 * rather than to every component.
 *
 * Conventions, all non-optional:
 *
 *  - **Dates are ISO 8601 strings**, never `Date`. `Date` does not survive the
 *    server→client boundary and forces every consumer to re-parse.
 *  - **Nullable, not optional.** `foo: string | null`, not `foo?: string`, so
 *    "the backend sent nothing" is distinguishable from "we forgot to map it".
 *  - **Pre-formatted display values.** `CapacityStat.value` is the string
 *    `"3625 MW + 5 GW"`, not a number and a unit. The business owns that
 *    string and the frontend must not try to compose it.
 *  - **No invented ids.** Where the backend supplies no stable id, the adapter
 *    derives one deterministically and documents how. Never an array index.
 *
 * This file currently carries only what the homepage consumes. FE-05 adds the
 * rest of docs/content-model.md §2 — `NewsItem`, `InvestorDocument`,
 * `TeamMember`, `EsgMetric`, `Paginated<T>` — alongside the methods that
 * return them.
 */

/**
 * A headline capacity figure.
 *
 * Dynamic despite looking static: these change as plants commission, they are
 * owned by the business rather than by a design review, and they appear in
 * more than one place. docs/content-model.md §1.
 */
export interface CapacityStat {
  /** Stable, and shared with the static copy that surrounds it. */
  id: string;
  /** "Solar Energy Generation" */
  label: string;
  /** Pre-formatted for display: "8299 MWp", "3625 MW + 5 GW". */
  value: string;
  /** Qualifier shown beneath the figure. "Greater Noida — *Upcoming" */
  footnote: string | null;
  order: number;
}

/**
 * A press item on the homepage carousel and the Newsroom page.
 *
 * `imageUrl` is a URL and not a bundled import on purpose: these images come
 * from the CMS, so the frontend cannot know them at build time. The mock
 * serves the client's supplied stills from `public/news/` — root-relative
 * paths that `next/image` optimises exactly as it will optimise the absolute
 * Azure Blob URLs the API returns. docs/content-model.md §2.
 *
 * `href` is where "Read More" goes: an article on this site, or an outbound
 * link to wherever the piece was published. `<Button>` tells the two apart.
 */
export interface NewsItem {
  id: string;
  title: string;
  /** ISO 8601. Rendered by `<DateBadge>`, which also emits `datetime`. */
  publishedAt: string;
  href: string;
  /** `null` when the item has no artwork; the card then shows its placeholder. */
  imageUrl: string | null;
}
