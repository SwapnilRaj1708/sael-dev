import { env } from '@/lib/config/env';
import type { ContentRepository } from '../repository';
import type { CapacityStat, NewsItem } from '../types';
import capacityStats from './data/capacity-stats.json';
import newsItems from './data/news-items.json';

/**
 * The local-development and pre-backend implementation. docs/content-model.md §4.
 *
 * Seeded from the client's own design rather than from Lorem: the figures are
 * the ones printed in `SAEL - New Website.pdf` and on the live site. Realistic
 * data is not a nicety — placeholder text hides the layout failures that real
 * copy exposes, and "3625 MW + 5 GW" is a good deal wider than "100 MW".
 *
 * **This survives the cutover.** FE-23 flips `CONTENT_SOURCE` per environment
 * and keeps the mock as the local default and as a fixture source. It is not
 * scaffolding to be deleted.
 */
export class MockContentRepository implements ContentRepository {
  /**
   * Optional artificial delay, so loading and error states can be exercised
   * locally without a backend. `MOCK_LATENCY_MS`, default `0`.
   */
  private async settle<T>(value: T): Promise<T> {
    if (env.MOCK_LATENCY_MS > 0) {
      await new Promise((resolve) => setTimeout(resolve, env.MOCK_LATENCY_MS));
    }
    return value;
  }

  getCapacityStats(): Promise<CapacityStat[]> {
    // Sorted here rather than trusted from the file: `order` is the contract,
    // and the API adapter will have to honour it too.
    const stats = [...(capacityStats as CapacityStat[])].sort((a, b) => a.order - b.order);
    return this.settle(stats);
  }

  getNewsItems(options?: { limit?: number }): Promise<NewsItem[]> {
    // Sorted here rather than trusted from the file, for the same reason as
    // above: "most recent first" is the contract, not a property of the
    // fixture's line order.
    const items = [...(newsItems as NewsItem[])].sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt),
    );

    const limit = options?.limit;
    return this.settle(limit === undefined ? items : items.slice(0, limit));
  }
}
