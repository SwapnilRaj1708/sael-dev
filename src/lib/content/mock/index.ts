import { env } from '@/lib/config/env';
import { tryBlobUrl } from '@/lib/utils/blob-url';
import type { ContentRepository } from '../repository';
import type { CapacityStat, NewsItem, TeamMember } from '../types';
import capacityStats from './data/capacity-stats.json';
import newsItems from './data/news-items.json';
import teamMembers from './data/team-members.json';

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

  getTeamMembers(): Promise<TeamMember[]> {
    // Seeded from `Our Team.dc.html`, which carries the roster the live site
    // publishes — seventeen real people, their real designations and their
    // real biographies, two of them long enough (Harbhajan Singh at ~2,500
    // characters, over two paragraphs) to prove that the dialog scrolls rather
    // than that a two-line placeholder fits.
    //
    // Sorted here rather than trusted from the file: `order` is the contract,
    // and the API adapter will have to honour it too.
    //
    // Every row has a portrait, a biography and — for seven of them — a
    // LinkedIn profile. `photoUrl: null` and `bio: null` are therefore **not**
    // exercised by this fixture; the card and the page handle both, but
    // docs/features/05 §3's "a team member with no photo" edge case belongs to
    // FE-05, which owns the fixtures, and inventing an eighteenth person to
    // satisfy it here would put a fabricated director on a page of real ones.
    //
    // `photoUrl` is stored as a **path within the blob container**, not as an
    // absolute URL, so no hostname is committed (/CLAUDE.md §7) and the same
    // fixture works against any environment's container. `tryBlobUrl` composes
    // it with `AZURE_BLOB_BASE_URL`, and passes an already-absolute value
    // through untouched — which is what the API will return in FE-23, so this
    // mapping survives the cutover without a special case.
    //
    // **The non-throwing form on purpose.** With `AZURE_BLOB_BASE_URL` unset
    // this yields `null` and each card falls back to its initials avatar, so a
    // misconfigured environment still renders the roster — every name,
    // designation, biography and LinkedIn link — instead of an empty state.
    // The trade is that the omission is quiet; `.env.example` carries the real
    // base so the default configuration is the working one.
    const members = [...(teamMembers as TeamMember[])]
      .map((member) => ({ ...member, photoUrl: tryBlobUrl(member.photoUrl) }))
      .sort((a, b) => a.order - b.order);
    return this.settle(members);
  }
}
