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
 * This file carries what the built pages consume. FE-05 adds the rest of
 * docs/content-model.md §2 — `EsgMetric`, `Paginated<T>` — alongside the
 * methods that return them. The investor types at the foot of the file came
 * in with the Offer Documents area, which is their first consumer.
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
 * The Newsroom's four sections, each one listing at `/newsroom/<category>/`.
 * The values are those URL segments, so the value a page asks for is the
 * value in its address bar.
 *
 *  - `press-release` and `our-views` are articles **hosted here**, each at
 *    `/newsroom/<category>/<slug>/`, with a body.
 *  - `in-the-news` links **out** to the publication that ran the piece.
 *  - `multimedia` is a YouTube video.
 */
export type NewsCategory = 'press-release' | 'in-the-news' | 'our-views' | 'multimedia';

/** The two categories whose items are articles on this site. */
export type NewsArticleCategory = Extract<NewsCategory, 'press-release' | 'our-views'>;

/**
 * An item on the homepage carousel or in a Newsroom listing — everything a
 * card needs, and no article body. docs/content-model.md §2.
 *
 * `imageUrl` is a URL and not a bundled import on purpose: these images come
 * from the CMS, so the frontend cannot know them at build time. The homepage
 * fixture serves the client's supplied stills from `public/news/` —
 * root-relative paths that `next/image` optimises exactly as it optimises the
 * absolute URLs the API returns. A Multimedia item's image is the video's
 * YouTube thumbnail.
 *
 * `href` is where the card goes, resolved by the repository from the fields
 * below it: the article page, the publication, or the video on YouTube.
 * `<Button>` tells internal from external. One field per destination rather
 * than one overloaded URL, so a card can tell an outbound link from a video
 * without parsing it.
 *
 * Which fields are set follows the category — nullable rather than a union,
 * the same trade `InvestorDocument.section` makes:
 *
 * | category        | publishedAt | slug | externalUrl | videoId |
 * |-----------------|-------------|------|-------------|---------|
 * | `press-release` | set         | set  | `null`      | `null`  |
 * | `in-the-news`   | set         | `null` | set       | `null`  |
 * | `our-views`     | `null`      | set  | `null`      | `null`  |
 * | `multimedia`    | `null`      | `null` | `null`    | set     |
 */
export interface NewsItem {
  id: string;
  category: NewsCategory;
  /** Verbatim, as the legacy card reads. */
  title: string;
  /**
   * ISO 8601, or `null` for an item that shows no date — Our Views and
   * Multimedia, whose legacy cards carry none. Rendered by `formatDate()`,
   * and the `<time>` is omitted outright when this is `null`.
   */
  publishedAt: string | null;
  href: string;
  /** `null` when the item has no artwork; the card then shows its empty frame. */
  imageUrl: string | null;
  /**
   * The image's alternative text, verbatim from the legacy `alt`, or `null`
   * when the source has none. A card falls back to the title.
   */
  imageAlt: string | null;
  /** The article's URL segment, verbatim — legacy artefacts and all. */
  slug: string | null;
  /** In The News: the publication's own URL. */
  externalUrl: string | null;
  /** Multimedia: the YouTube video id. */
  videoId: string | null;
  /**
   * The publication's name — "The Hindu BusinessLine". `null` in every
   * current row: the legacy In The News cards do not show one, so none is
   * transcribed. The field exists for when the business decides to.
   */
  publication: string | null;
}

/**
 * A Press Release or Our Views article: its card fields, plus the body.
 *
 * `body` is HTML from the CMS — paragraphs, headings from `h2` down, lists,
 * links and the odd figure. The article page sanitises it again before
 * rendering, as Our Team sanitises a biography: `lib/utils/sanitize-article.ts`.
 */
export interface NewsArticle extends NewsItem {
  category: NewsArticleCategory;
  slug: string;
  body: string;
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
  /**
   * How far the biography dialog zooms this person's portrait into its
   * passport crop — `1` is the card's own framing, `1.5` the house default,
   * `2` a tight head shot. Per person because the client sets it by eye,
   * photograph by photograph (2026-09-17). `null` takes the default, which is
   * `--scale-team-passport` in theme.css.
   */
  portraitZoom: number | null;
  order: number;
}

/* ---------- Investors ---------- */

/**
 * A file in Azure Blob Storage, as a component needs it.
 *
 * `url` is absolute. The mock composes it from a container path with
 * `tryBlobUrl()`; the API returns it whole. Either way no hostname is ever
 * written in this repository. docs/asset-inventory.md §8.
 */
export interface BlobFile {
  url: string;
  /** "SAEL_DRHP.pdf" — the name a visitor's download is saved under. */
  fileName: string;
  /** "application/pdf", "video/mp4". */
  mimeType: string;
  /**
   * `null` when the backend does not report one. Carried because the
   * contract asks for it; whether a page *shows* it is that page's call —
   * the Offer Documents pages do not, because the legacy site does not.
   */
  sizeBytes: number | null;
}

/**
 * Which listing on the site a document belongs to. docs/api-contracts.md §3.
 *
 * One value per investor page that lists documents — except Offer Documents,
 * which is eight sub-pages under one category and is told apart by
 * {@link InvestorListing.section}. `notifications` is served by its own
 * paginated endpoint in the same item shape, and is here so those items
 * type-check when that page is built.
 */
export type InvestorDocumentCategory =
  | 'offer-documents'
  | 'corporate-governance'
  | 'annual-return'
  | 'consolidated-financials'
  | 'standalone-financials'
  | 'subsidiary-financials'
  | 'investor-downloads'
  | 'notifications';

/**
 * The address of one listing: a category, and the sub-page within it.
 *
 * `section` is the sub-page's own URL slug — `drhp`,
 * `information-with-respect-to-group-companies` — so the value a page asks for
 * is the value in its address bar and needs no mapping table. `null` for a
 * category that is a single page.
 */
export interface InvestorListing {
  category: InvestorDocumentCategory;
  section: string | null;
}

/**
 * A downloadable investor document — a PDF, in every case so far.
 *
 * `group` partitions a listing under headings — a financial year ("FY 2025",
 * "FY2026") or a name ("Statutory Policies"); `null` for a listing that is
 * one flat list. `subgroup` partitions a group once more, for the one page
 * that nests: General Meeting's "Extra-Ordinary General Meeting", by year.
 * Both are labels, shown verbatim, so the legacy site's inconsistent year
 * spellings stay as the company wrote them.
 *
 * `order` runs across the whole listing, and the repository returns the
 * listing sorted by it — so the business sets the order of documents *and*
 * of the headings, which appear in the order of their first document. Years
 * newest first on most pages, oldest first on CSR, named groups in the
 * company's own order: none of that is a sort a page could derive from the
 * labels. docs/api-contracts.md §3.
 */
export interface InvestorDocument {
  id: string;
  /** As the link reads, verbatim — "Draft Red Herring Prospectus". */
  title: string;
  category: InvestorDocumentCategory;
  section: string | null;
  group: string | null;
  subgroup: string | null;
  /** ISO 8601, or `null`. None of the investor documents carries one. */
  publishedAt: string | null;
  file: BlobFile;
  order: number;
}

/** A WebVTT caption track for an {@link InvestorVideo}. */
export interface CaptionTrack {
  /** Absolute URL of the `.vtt` file. */
  url: string;
  /** BCP 47 — `en`, `hi`. */
  srcLang: string;
  /** What the player's caption menu shows — "English", "हिन्दी". */
  label: string;
}

/**
 * A self-hosted disclosure video — the DRHP audio-visual presentations.
 *
 * Separate from {@link InvestorDocument} because a video needs two things a
 * document does not — a poster and caption tracks — and folding them into
 * every PDF row as nullable fields would give every document two fields with
 * no meaning. docs/api-contracts.md §3.
 */
export interface InvestorVideo {
  id: string;
  title: string;
  category: InvestorDocumentCategory;
  section: string | null;
  file: BlobFile;
  /** Absolute URL of the still shown before playback, or `null`. */
  posterUrl: string | null;
  /**
   * `[]` when none exist — which is the case for both offer videos today. A
   * spoken presentation needs them, so that is an open action for the client
   * rather than a finished state; docs/asset-inventory.md §9.
   */
  captions: CaptionTrack[];
}

/* ---------- Governance ---------- */

/**
 * A director, as `/investors/corporate-governance/board-of-directors/`
 * lists them.
 *
 * **Not a `TeamMember`**, though some are the same people. This is the
 * governance record — a regulated disclosure of the board — and its
 * designations and biographies are worded for that page, not for Our Team;
 * the two are kept as separate records so that neither can silently rewrite
 * the other. docs/api-contracts.md §4.
 */
export interface BoardMember {
  id: string;
  /** Verbatim, diacritics included — "Øistein Magnar Andresen". */
  name: string;
  /** "Managing Director and Chairperson". Plain text. */
  designation: string;
  /**
   * The "About" text: HTML, `p` and `strong` in practice, sanitised again
   * before it renders exactly as `TeamMember.bio` is. `null` when none.
   */
  bio: string | null;
  order: number;
}

/** One row of a committee's table. Every field verbatim. */
export interface CommitteeMember {
  /** "Mr. Harbhajan Singh" — as the committee page writes it. */
  name: string;
  /** "Non-Executive Independent Director". */
  category: string;
  /** The member's role on the committee — "Chairman", "Member", "Invitee". */
  position: string;
}

/** A board committee and its members, in the order the company lists them. */
export interface BoardCommittee {
  id: string;
  /** "Audit Committee". */
  name: string;
  members: CommitteeMember[];
  order: number;
}
