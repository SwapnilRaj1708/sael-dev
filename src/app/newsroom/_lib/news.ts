import type { Metadata } from 'next';
import {
  getContentRepository,
  newsArticlePath,
  type NewsArticle,
  type NewsArticleCategory,
  type NewsCategory,
  type NewsItem,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { articleDescription } from '@/lib/utils/article-description';

/**
 * What the Newsroom's pages share between the repository and the sections.
 * Page code, so it lives beside the pages — a section never fetches
 * (docs/architecture.md §3) — in a `_lib` folder the router ignores. The
 * investor area's `_lib/documents.ts` is the pattern.
 */

/**
 * One section's items, or `[]` if the repository failed. Logged, not
 * swallowed: nothing else would record that the backend is down, and the
 * listing renders its empty state either way. /CLAUDE.md §6.
 *
 * `limit` is a hint to the repository, which may return more, so the list is
 * cut here too.
 */
export async function loadNewsItems(category: NewsCategory, limit?: number): Promise<NewsItem[]> {
  try {
    const items = await getContentRepository().getNewsItems({ category, limit });
    return limit === undefined ? items : items.slice(0, limit);
  } catch (error) {
    console.error(`[newsroom] getNewsItems(${category}) failed; rendering the empty state.`, error);
    return [];
  }
}

/**
 * Every article's slug in a section, for `generateStaticParams`.
 *
 * **A failure builds no article pages rather than failing the build** — the
 * listings' bargain, logged loudly for the same reason. With
 * `dynamicParams = false` those URLs then 404 until the next build; the
 * alternative, generating them on demand, would be a runtime page cache,
 * which /CLAUDE.md §7 rules out on this host.
 */
export async function loadArticleSlugs(category: NewsArticleCategory): Promise<{ slug: string }[]> {
  const items = await loadNewsItems(category);
  return items.flatMap(({ slug }) => (slug === null ? [] : [{ slug }]));
}

/**
 * One article, or `null` for a slug that is not one. **Not caught**: a
 * listing can degrade to an empty state, but an article page has nothing to
 * degrade to, and a source failure is not a 404 — it goes to the error
 * boundary.
 */
export function loadNewsArticle(
  category: NewsArticleCategory,
  slug: string,
): Promise<NewsArticle | null> {
  return getContentRepository().getNewsArticle(category, slug);
}

/**
 * An article page's metadata — the legacy page's own: its `<title>` is the
 * headline alone, with no " - SAEL", its description the legacy derivation
 * from the body, `og:type` `article` with the card image, and the canonical
 * its legacy URL. Unique per article because each of those is.
 */
export function articleMetadata(article: NewsArticle): Metadata {
  return buildMetadata({
    title: article.title,
    description: articleDescription(article.body),
    path: newsArticlePath(article.category, article.slug),
    article: { image: article.imageUrl, publishedTime: article.publishedAt },
  });
}
