import { NotImplementedError, type ContentRepository } from '../repository';
import type { CapacityStat, NewsItem } from '../types';

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

  getNewsItems(options?: { limit?: number }): Promise<NewsItem[]> {
    void options;
    return Promise.reject(new NotImplementedError('ApiContentRepository.getNewsItems'));
  }
}
