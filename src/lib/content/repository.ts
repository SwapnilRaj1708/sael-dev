import type { CapacityStat, NewsItem, TeamMember } from './types';

/**
 * The entire boundary between the application and its content. **Adding a
 * dynamic surface means adding a method here first**, then implementing it in
 * *both* the mock and the API adapter, and only then building the UI.
 * docs/content-model.md §3.
 *
 * Three methods so far. Two came from the homepage; `getTeamMembers` was
 * carved out of FE-05 by FE-07, which is the page that consumes it — the same
 * trade FE-04 made for stats and news, and the reason the interface is
 * deliberately ordered after its consumers (docs/features/05 §preamble). FE-05
 * fills in the remaining four from docs/content-model.md §3.
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
   * Most recent first. `limit` is a hint the adapter may satisfy by asking the
   * backend for a page, so callers must not rely on getting exactly that many.
   */
  getNewsItems(options?: { limit?: number }): Promise<NewsItem[]>;
  /**
   * The whole roster, both groups, ascending by `order`.
   *
   * Not split per group and not filtered here: `/our-team/` renders both tabs
   * in one response and switches between them on the client, so two calls
   * would be two round trips for one screen. A caller that wants one group
   * partitions the result.
   */
  getTeamMembers(): Promise<TeamMember[]>;
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
