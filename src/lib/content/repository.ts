import type { CapacityStat, NewsItem } from './types';

/**
 * The entire boundary between the application and its content. **Adding a
 * dynamic surface means adding a method here first**, then implementing it in
 * *both* the mock and the API adapter, and only then building the UI.
 * docs/content-model.md §3.
 *
 * Two methods so far, because the homepage consumes two. FE-05 fills in the
 * remaining five from docs/content-model.md §3 — the interface is deliberately
 * ordered after the homepage so that its shape is proven by a real consumer
 * before the whole thing is built out (docs/features/05 §preamble).
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
