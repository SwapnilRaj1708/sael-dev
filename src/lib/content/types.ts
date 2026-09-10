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

/**
 * A director or a member of the leadership team, on `/our-team/`.
 *
 * **`group` is not in `docs/content-model.md` §2 or `api-contracts.md` §4.**
 * It was added for FE-07: `Our Team.dc.html` splits the page into Leadership
 * and Management tabs, and a tab is a partition of the roster, so it has to
 * come from the data rather than from a hardcoded list of names in a
 * component. Both docs are updated to match; the proposal for the backend is
 * a `group` string on `GET /api/v1/team` with exactly these two values.
 *
 * `photoUrl` rather than the `photo: ImageAsset` that `content-model.md` §2
 * describes, because the portraits are CMS assets that the frontend cannot
 * know at build time — the same reason and the same shape as
 * {@link NewsItem.imageUrl}, which set the precedent in FE-04. The mock serves
 * them from `public/team/`; the API will return absolute Azure Blob URLs, and
 * `next/image` optimises both identically.
 *
 * There is no `photoAlt`. The contract offers one and it is `null` in every
 * row: the correct alternative text for a portrait is the name of the person
 * in it, which this type already carries. A second field that would always
 * fall back to `name` is a field with no consumer.
 *
 * `bio` may contain HTML — `p, br, strong, em, ul, ol, li, a`, per
 * `api-contracts.md` §4. It is sanitised again on this side before it is
 * rendered; see `lib/utils/sanitize-bio.ts` for why that is not redundant.
 */
export type TeamGroup = 'leadership' | 'management';

export interface TeamMember {
  id: string;
  name: string;
  /** "Managing Director and Chairperson". Plain text, never HTML. */
  designation: string;
  group: TeamGroup;
  /** `null` when no portrait exists; the card then shows an initials avatar. */
  photoUrl: string | null;
  /** Sanitised HTML, or `null` when the person has no published biography. */
  bio: string | null;
  /**
   * Absolute URL to this person's LinkedIn profile, or `null`.
   *
   * `null` for most of the board and set for most of the leadership team —
   * whether someone publishes a profile is their own decision, so this is
   * genuinely sparse rather than merely unfilled, and the dialog omits the
   * link entirely rather than showing a disabled one.
   */
  linkedinUrl: string | null;
  order: number;
}
