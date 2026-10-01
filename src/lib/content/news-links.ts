import { youtubeThumbnailUrl, youtubeWatchUrl } from '@/lib/utils/youtube';
import type { NewsArticleCategory, NewsCategory } from './types';

/**
 * Where a news item's card goes, and the image a video card shows — resolved
 * once, in the data layer, by both adapters, so neither a component nor the
 * backend has to know the site's route shapes.
 *
 * Shared by the mock and the API adapter for the same reason `blobUrl()` is:
 * one mapping that both implementations call cannot drift between them.
 */

/** The Newsroom's root, and the root of every listing and article below it. */
export const NEWSROOM_PATH = '/newsroom/';

/** A section's listing — `/newsroom/press-release/`. */
export function newsListingPath(category: NewsCategory): string {
  return `${NEWSROOM_PATH}${category}/`;
}

/**
 * An article's page — `/newsroom/press-release/<slug>/`. The slug goes in as
 * it is: these are legacy URLs with search equity, and a slug that looks
 * wrong (`india39s`, a mangled apostrophe) is still the URL that ranks.
 */
export function newsArticlePath(category: NewsArticleCategory, slug: string): string {
  return `${newsListingPath(category)}${slug}/`;
}

export interface NewsDestination {
  category: NewsCategory;
  slug: string | null;
  externalUrl: string | null;
  videoId: string | null;
}

/**
 * The card's href, or `null` when the item lacks the field its category
 * needs — an article with no slug, a video with no id. The caller drops such
 * an item rather than rendering a card that goes nowhere.
 */
export function newsItemHref({
  category,
  slug,
  externalUrl,
  videoId,
}: NewsDestination): string | null {
  switch (category) {
    case 'press-release':
    case 'our-views':
      return slug === null || slug === '' ? null : newsArticlePath(category, slug);
    case 'in-the-news':
      return externalUrl === null || externalUrl === '' ? null : externalUrl;
    case 'multimedia':
      return videoId === null || videoId === '' ? null : youtubeWatchUrl(videoId);
  }
}

/** A video's thumbnail, or `null` for any item that is not a video. */
export function newsVideoThumbnail(videoId: string | null): string | null {
  return videoId === null || videoId === '' ? null : youtubeThumbnailUrl(videoId);
}
