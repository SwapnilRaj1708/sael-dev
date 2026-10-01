import type {
  BoardCommittee,
  BoardMember,
  CapacityStat,
  InvestorDocument,
  InvestorListing,
  InvestorVideo,
  NewsArticle,
  NewsArticleCategory,
  NewsCategory,
  NewsItem,
  TeamMember,
} from './types';

/** {@link ContentRepository.getNewsItems}'s options. */
export interface NewsItemsQuery {
  /** One Newsroom section. Omit for the homepage's feed. */
  category?: NewsCategory;
  limit?: number;
}

/**
 * The entire boundary between the application and its content. **Adding a
 * dynamic surface means adding a method here first**, then implementing it in
 * *both* the mock and the API adapter, and only then building the UI.
 * docs/content-model.md §3.
 *
 * Five methods so far. Two came from the homepage; `getTeamMembers` was
 * carved out of FE-05 by FE-07, which is the page that consumes it — the same
 * trade FE-04 made for stats and news, and the reason the interface is
 * deliberately ordered after its consumers (docs/features/05 §preamble). The
 * two investor methods came in with Offer Documents, the first investor area
 * built. FE-05 fills in the rest of docs/content-model.md §3.
 *
 * Contract:
 *
 *  1. Every method resolves or throws {@link ContentUnavailableError}. Never
 *     `undefined`, never a silent `null` for a list — an empty list is `[]`.
 *  2. **Callers handle failure locally.** A page wraps its call and renders an
 *     empty state; one failed fetch must not take down the page around it.
 *  3. Both implementations, always. The API side may throw
 *     {@link NotImplementedError}, but the method must exist, so that the
 *     cutover in FE-23 is a checklist rather than an excavation.
 */
export interface ContentRepository {
  getCapacityStats(): Promise<CapacityStat[]>;
  /**
   * News items, in the order the listing shows them: newest first, and for
   * the undated categories (Our Views, Multimedia) the business's own order.
   *
   * `category` selects one Newsroom section — filtered by the adapter, never
   * by a page fetching everything and discarding most of it. **Omitted, it
   * is the homepage's call**, and returns what the homepage carousel has
   * always shown; see docs/api-contracts.md §2 for what that means against
   * the API, and the mock for why it is a separate fixture there.
   *
   * `limit` is a hint the adapter may satisfy by asking the backend for a
   * page, so callers must not rely on getting exactly that many.
   */
  getNewsItems(options?: NewsItemsQuery): Promise<NewsItem[]>;
  /**
   * One Press Release or Our Views article, body included, by its slug.
   * `null` when there is no such article — the page 404s — and a throw only
   * when the source itself failed.
   */
  getNewsArticle(category: NewsArticleCategory, slug: string): Promise<NewsArticle | null>;
  /**
   * The whole roster, both groups, ascending by `order`.
   *
   * Not split per group and not filtered here: `/our-team/` renders both tabs
   * in one response and switches between them on the client, so two calls
   * would be two round trips for one screen. A caller that wants one group
   * partitions the result.
   */
  getTeamMembers(): Promise<TeamMember[]>;
  /**
   * Every document in one listing, sorted by `order` — the order the page
   * shows them in, headings included (a group appears where its first
   * document does). `[]` for a listing with no documents, never a throw.
   *
   * By listing rather than by page because one listing is one request: the
   * Group Companies page shows three financial years, and asking once and
   * partitioning by `group` is one round trip where asking per year is three.
   */
  getInvestorDocuments(listing: InvestorListing): Promise<InvestorDocument[]>;
  /**
   * The videos in one listing. Only the two DRHP audio-visual pages have any,
   * one each; a list rather than a single item so a listing that grows a
   * second cut (a sign-language version, say) is not a contract change.
   */
  getInvestorVideos(listing: InvestorListing): Promise<InvestorVideo[]>;
  /**
   * The board, in the order the company lists it. Dynamic rather than static
   * copy because the board changes by resolution, not by design review, and
   * the website must reflect a change within days of it (SEBI LODR Reg. 46)
   * — the same record Notifications announces resignations from.
   */
  getBoardMembers(): Promise<BoardMember[]>;
  /** The board's committees and their members, each in the company's order. */
  getBoardCommittees(): Promise<BoardCommittee[]>;
}

/**
 * Content could not be retrieved. Carries where it happened, so the server log
 * says which endpoint failed rather than just that something did.
 */
export class ContentUnavailableError extends Error {
  constructor(
    readonly endpoint: string,
    readonly status?: number,
    options?: { cause?: unknown },
  ) {
    super(
      `Content unavailable from "${endpoint}"${status === undefined ? '' : ` (HTTP ${String(status)})`}.`,
      options,
    );
    this.name = 'ContentUnavailableError';
  }
}

/** A repository method that exists to satisfy the contract but is not wired. */
export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`${method}() is not implemented by this repository yet.`);
    this.name = 'NotImplementedError';
  }
}
