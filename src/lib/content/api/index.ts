import { NotImplementedError, type ContentRepository, type NewsItemsQuery } from '../repository';
import type {
  BoardCommittee,
  BoardMember,
  CapacityStat,
  InvestorDocument,
  InvestorListing,
  InvestorVideo,
  NewsArticle,
  NewsArticleCategory,
  NewsItem,
  TeamMember,
} from '../types';

export interface ApiContentRepositoryOptions {
  baseUrl: string;
  timeoutMs: number;
}

/**
 * The Spring Boot implementation. **The endpoints do not exist yet.**
 * docs/content-model.md §5.
 *
 * It is here, throwing, on purpose. docs/content-model.md §3 rule 3: never
 * merge a method implemented only in the mock. A skeleton that throws makes
 * the cutover in FE-23 a checklist — every method that still throws is a
 * remaining task, and the compiler enforces that the list is complete. A
 * missing method makes it an excavation.
 *
 * FE-05 adds `client.ts` (`apiFetch` with an `AbortController` timeout, Next
 * cache passthrough and a Zod parse at the boundary), `schemas.ts` and
 * `mappers.ts`. FE-23 wires the bodies.
 */
export class ApiContentRepository implements ContentRepository {
  constructor(private readonly options: ApiContentRepositoryOptions) {}

  getCapacityStats(): Promise<CapacityStat[]> {
    // Referenced so the field is not merely stored — the shape of the call
    // this will make is already decided, only the fetch is missing.
    void this.options;
    return Promise.reject(new NotImplementedError('ApiContentRepository.getCapacityStats'));
  }

  /**
   * `GET /api/v1/news?category=…&limit=…`, `category` omitted for the
   * homepage's call. docs/api-contracts.md §2. Mapped: `href` resolved with
   * `newsItemHref()` — the same function the mock calls — and a row it
   * returns `null` for (an article without a slug, a video without an id) is
   * dropped rather than rendered as a card that goes nowhere; `imageUrl`
   * read through, falling back to `newsVideoThumbnail(videoId)` for a video
   * that arrives without one; `imageAlt`, `slug`, `externalUrl`, `videoId`,
   * `source` → `publication` and `publishedAt` read through. The backend's
   * sort is trusted. FE-23 wires the body.
   */
  getNewsItems(options?: NewsItemsQuery): Promise<NewsItem[]> {
    void options;
    return Promise.reject(new NotImplementedError('ApiContentRepository.getNewsItems'));
  }

  /**
   * `GET /api/v1/news/{category}/{slug}` — a 404 maps to `null`, anything
   * else non-2xx to `ContentUnavailableError`. Mapped as above, plus `body`
   * read through as HTML; the page sanitises it again, as Our Team does a
   * biography. FE-23 wires the body.
   */
  getNewsArticle(category: NewsArticleCategory, slug: string): Promise<NewsArticle | null> {
    void category;
    void slug;
    return Promise.reject(new NotImplementedError('ApiContentRepository.getNewsArticle'));
  }

  /**
   * `GET /api/v1/team`, mapped by `displayOrder` → `order`, `photoUrl` kept,
   * `photoAlt` dropped (a portrait's alternative text is the name beside it),
   * `group` read straight through, and `portraitZoom` read through with a
   * missing or non-positive value mapped to `null` (the dialog then takes the
   * default). FE-23 wires the body.
   */
  getTeamMembers(): Promise<TeamMember[]> {
    return Promise.reject(new NotImplementedError('ApiContentRepository.getTeamMembers'));
  }

  /**
   * `GET /api/v1/investor-documents?category=…&section=…`, `section` omitted
   * when the listing's is `null`. Mapped `fileUrl`/`fileName`/`mimeType`/
   * `sizeBytes` → `file`, `displayOrder` → `order`; `category`, `section`,
   * `group`, `subgroup` and `publishedAt` read straight through. The
   * backend's sort is trusted — `displayOrder` across the listing — per
   * docs/api-contracts.md §1. A row that fails the schema is dropped, not the
   * listing. FE-23 wires the body.
   */
  getInvestorDocuments(listing: InvestorListing): Promise<InvestorDocument[]> {
    void listing;
    return Promise.reject(new NotImplementedError('ApiContentRepository.getInvestorDocuments'));
  }

  /**
   * `GET /api/v1/investor-videos?category=…&section=…`. Mapped as above for
   * the file; `posterUrl` read through; `captions[]` read through with a
   * track missing `url` or `srcLang` dropped rather than rendered as a menu
   * entry that fails to load. FE-23 wires the body.
   */
  getInvestorVideos(listing: InvestorListing): Promise<InvestorVideo[]> {
    void listing;
    return Promise.reject(new NotImplementedError('ApiContentRepository.getInvestorVideos'));
  }

  /**
   * `GET /api/v1/board-members`, mapped `displayOrder` → `order`, `bio` kept
   * as HTML (the page sanitises it again, as it does a team biography).
   * FE-23 wires the body.
   */
  getBoardMembers(): Promise<BoardMember[]> {
    return Promise.reject(new NotImplementedError('ApiContentRepository.getBoardMembers'));
  }

  /**
   * `GET /api/v1/board-committees`, mapped `displayOrder` → `order`, members
   * read through in the order sent. FE-23 wires the body.
   */
  getBoardCommittees(): Promise<BoardCommittee[]> {
    return Promise.reject(new NotImplementedError('ApiContentRepository.getBoardCommittees'));
  }
}
