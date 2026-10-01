import { env } from '@/lib/config/env';
import { tryBlobUrl } from '@/lib/utils/blob-url';
import { newsItemHref, newsVideoThumbnail } from '../news-links';
import type { ContentRepository, NewsItemsQuery } from '../repository';
import type {
  BlobFile,
  BoardCommittee,
  BoardMember,
  CapacityStat,
  CaptionTrack,
  InvestorDocument,
  InvestorDocumentCategory,
  InvestorListing,
  InvestorVideo,
  NewsArticle,
  NewsArticleCategory,
  NewsCategory,
  NewsItem,
  TeamMember,
} from '../types';
import boardCommittees from './data/board-committees.json';
import boardMembers from './data/board-members.json';
import capacityStats from './data/capacity-stats.json';
import investorDocuments from './data/investor-documents.json';
import investorVideos from './data/investor-videos.json';
import newsItems from './data/news-items.json';
import newsroomItems from './data/newsroom-items.json';
import teamMembers from './data/team-members.json';

/**
 * A file as the fixtures store it: a path within the blob container, never a
 * URL. `blobFile()` composes the URL at read time.
 */
interface FixtureFile extends Omit<BlobFile, 'url'> {
  path: string;
}

/**
 * The investor fixtures carry one field the domain type does not:
 * `legacyPath`, the file's path on the legacy www.sael.co, recorded so the
 * client can upload every file to its blob path in one pass. It is never
 * handed to a component as such — see `fixtureUrl()` for the one, temporary,
 * way it becomes a URL.
 */
interface DocumentFixture extends Omit<InvestorDocument, 'category' | 'file'> {
  category: InvestorDocumentCategory;
  file: FixtureFile;
  legacyPath: string;
}

interface VideoFixture extends Omit<InvestorVideo, 'category' | 'file' | 'posterUrl' | 'captions'> {
  category: InvestorDocumentCategory;
  file: FixtureFile;
  posterPath: string | null;
  captions: (Omit<CaptionTrack, 'url'> & { path: string })[];
  legacyPath: string;
  legacyPosterPath: string | null;
}

/**
 * A fixture file's URL: its legacy copy while `LEGACY_ASSET_BASE_URL` is set,
 * its blob path otherwise — `null` if neither can be composed.
 *
 * **The legacy branch is temporary**, the client's instruction of 2026-09-29:
 * the Offer Documents files are not in the container yet, so until they are,
 * the links point at the live site's own copies rather than 404ing. The
 * origin comes from the environment, not from here (/CLAUDE.md §7), and the
 * path is the one the fixture already records. Unset the variable after the
 * upload — and before cutover at the latest, when that origin becomes this
 * site and those paths stop existing — and every link falls back to its blob
 * path with no code change.
 */
function fixtureUrl(path: string | null, legacyPath: string | null): string | null {
  const legacyBase = env.LEGACY_ASSET_BASE_URL;
  if (legacyBase !== undefined && legacyPath !== null) {
    return `${legacyBase.replace(/\/+$/, '')}${legacyPath}`;
  }
  return tryBlobUrl(path);
}

/** Resolve a fixture file to a `BlobFile`, or `null` if it has no URL. */
function blobFile({ path, ...file }: FixtureFile, legacyPath: string | null): BlobFile | null {
  const url = fixtureUrl(path, legacyPath);
  return url === null ? null : { ...file, url };
}

/**
 * A homepage carousel row, as `news-items.json` has stored it since FE-04 —
 * the card fields only, `href` written out. Read as it is so the homepage's
 * call returns exactly what it always has; the fields it does not carry are
 * the same in all six rows and are filled in on read.
 */
interface HomepageNewsFixture {
  id: string;
  title: string;
  publishedAt: string;
  href: string;
  imageUrl: string | null;
}

/**
 * A Newsroom row: the domain fields, with the image as a path pair rather
 * than a URL, and the body for an article. Generated from the legacy pages'
 * HTML — see `getNewsItems()`.
 */
interface NewsroomFixture extends Omit<NewsItem, 'category' | 'href' | 'imageUrl'> {
  category: NewsCategory;
  image: { path: string; legacyPath: string } | null;
  body: string | null;
}

/**
 * A body's own images: each `src` is stored as the root-relative legacy path
 * — the legacy CMS wrote them absolute, on a development host — and is
 * resolved exactly as a card's image is, by `fixtureUrl()` with the blob path
 * `web-assets` + legacy path. An image that cannot be resolved loses its
 * `src`, and the sanitiser then drops the element.
 */
function resolveBodyImages(body: string): string {
  return body.replace(
    /(<img\b[^>]*?\ssrc=")(\/[^"]*)(")/g,
    (_match, open: string, path: string, close: string) => {
      const url = fixtureUrl(`web-assets${path}`, path);
      return url === null ? `${open}${close}` : `${open}${url}${close}`;
    },
  );
}

/** A Newsroom row as a card needs it, or `null` if it has nowhere to go. */
function toNewsItem(row: NewsroomFixture): NewsItem | null {
  const href = newsItemHref(row);
  if (href === null) return null;

  return {
    id: row.id,
    category: row.category,
    title: row.title,
    publishedAt: row.publishedAt,
    href,
    imageUrl:
      row.image === null
        ? newsVideoThumbnail(row.videoId)
        : fixtureUrl(row.image.path, row.image.legacyPath),
    imageAlt: row.imageAlt,
    slug: row.slug,
    externalUrl: row.externalUrl,
    videoId: row.videoId,
    publication: row.publication,
  };
}

function inListing(listing: InvestorListing) {
  return (row: { category: InvestorDocumentCategory; section: string | null }) =>
    row.category === listing.category && row.section === listing.section;
}

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

  /**
   * **Two fixtures, on purpose.** With no `category` this is the homepage's
   * call, and it reads `news-items.json` exactly as it always has: six
   * press releases, newest first, with the client's own stills from
   * `public/news/` and every card linking to `/newsroom/`. That set is a
   * snapshot from before the Newsroom existed, and it is kept rather than
   * re-derived so the homepage does not change under this work. Against the
   * API the same call is the newest items across every category — see
   * docs/api-contracts.md §2 — and the homepage should choose a category
   * before cutover.
   *
   * With a `category` it reads `newsroom-items.json`, which is the legacy
   * https://www.sael.co/newsroom/ listings transcribed from their raw HTML
   * on 2026-10-01 by script, not by hand: every title, date, image `alt`,
   * outbound URL, video id and article body exactly as published. The file's
   * line order is each legacy listing's order, which for the dated sections
   * is also newest first — the sort below is stable, so it changes nothing
   * there and leaves Our Views and Multimedia, which carry no date, in the
   * order the company published them.
   *
   * Images resolve like the investor files do: the legacy copy while
   * `LEGACY_ASSET_BASE_URL` is set, the blob path (`web-assets` + legacy
   * path) otherwise. docs/asset-inventory.md §8 lists every one for upload.
   */
  getNewsItems(options?: NewsItemsQuery): Promise<NewsItem[]> {
    const category = options?.category;
    const items =
      category === undefined
        ? (newsItems as HomepageNewsFixture[]).map((row): NewsItem => ({
            ...row,
            category: 'press-release',
            imageAlt: null,
            slug: null,
            externalUrl: null,
            videoId: null,
            publication: null,
          }))
        : (newsroomItems as NewsroomFixture[])
            .filter((row) => row.category === category)
            .flatMap((row) => toNewsItem(row) ?? []);

    // Sorted here rather than trusted from the file: "most recent first" is
    // the contract, not a property of the fixture's line order. Undated items
    // compare equal and keep their place.
    const sorted = items.sort((a, b) =>
      a.publishedAt === null || b.publishedAt === null
        ? 0
        : b.publishedAt.localeCompare(a.publishedAt),
    );

    const limit = options?.limit;
    return this.settle(limit === undefined ? sorted : sorted.slice(0, limit));
  }

  getNewsArticle(category: NewsArticleCategory, slug: string): Promise<NewsArticle | null> {
    const row = (newsroomItems as NewsroomFixture[]).find(
      (candidate) => candidate.category === category && candidate.slug === slug,
    );
    const item = row === undefined ? null : toNewsItem(row);

    if (row === undefined || item === null || row.body === null) return this.settle(null);

    return this.settle({
      ...item,
      category,
      slug,
      body: resolveBodyImages(row.body),
    });
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

  /**
   * Seeded from the legacy https://www.sael.co/investors/offer-documents/
   * sub-pages, read from their HTML on 2026-09-29: every title is the legacy
   * link text verbatim, and every size is the byte count the legacy server
   * reported for that file the same day.
   *
   * **The files are not in the container yet.** Each row's path is where the
   * client is asked to upload it — the legacy path under `web-assets/`, file
   * name unchanged — so until that upload every link here 404s. That is the
   * expected state of a mock (docs/content-model.md §4), not a defect.
   *
   * A row whose URL cannot be composed — `AZURE_BLOB_BASE_URL` unset — is
   * dropped rather than rendered as a title that goes nowhere; the page then
   * shows its empty state.
   */
  getInvestorDocuments(listing: InvestorListing): Promise<InvestorDocument[]> {
    const documents = (investorDocuments as DocumentFixture[])
      .filter(inListing(listing))
      // Mapped field by field rather than spread, so `legacyPath` cannot ride
      // along into a component by accident.
      .flatMap((row): InvestorDocument[] => {
        const file = blobFile(row.file, row.legacyPath);
        if (file === null) return [];

        return [
          {
            id: row.id,
            title: row.title,
            category: row.category,
            section: row.section,
            group: row.group,
            subgroup: row.subgroup,
            publishedAt: row.publishedAt,
            file,
            order: row.order,
          },
        ];
      })
      // `order` alone, across the whole listing — the contract, not the
      // file's line order. Headings follow their first document, so the
      // business orders the groups too (docs/api-contracts.md §3).
      .sort((a, b) => a.order - b.order);
    return this.settle(documents);
  }

  /**
   * The two DRHP audio-visual presentations, seeded from the legacy pages.
   * `captions` is empty in both rows because no caption files exist — the
   * legacy `<video>` carries no `<track>` — and inventing a path for one
   * would render a caption menu that fails to load.
   */
  getInvestorVideos(listing: InvestorListing): Promise<InvestorVideo[]> {
    const videos = (investorVideos as VideoFixture[])
      .filter(inListing(listing))
      .flatMap((row): InvestorVideo[] => {
        const file = blobFile(row.file, row.legacyPath);
        if (file === null) return [];

        return [
          {
            id: row.id,
            title: row.title,
            category: row.category,
            section: row.section,
            file,
            posterUrl: fixtureUrl(row.posterPath, row.legacyPosterPath),
            // A track whose file cannot be addressed is dropped; the video
            // still plays, and the menu offers only what will load.
            captions: row.captions.flatMap(({ path, srcLang, label }): CaptionTrack[] => {
              const url = tryBlobUrl(path);
              return url === null ? [] : [{ url, srcLang, label }];
            }),
          },
        ];
      });
    return this.settle(videos);
  }

  /**
   * The ten directors on the legacy
   * https://www.sael.co/investors/corporate-governance/board-of-directors/,
   * read from its HTML on 2026-09-30 — name, designation and the "About"
   * text exactly as that page has them, bios as the page's own `<p>` and
   * `<strong>` markup with the source whitespace collapsed. **Not** copied
   * from `team-members.json`: the two pages word the same people differently,
   * and this one is the governance record.
   */
  getBoardMembers(): Promise<BoardMember[]> {
    const members = [...(boardMembers as BoardMember[])].sort((a, b) => a.order - b.order);
    return this.settle(members);
  }

  /**
   * The six committees on the legacy board-committees page, same read, same
   * rules: every name, category and position verbatim — including where this
   * page spells a director differently from the board page ("Bjornar",
   * "Kewal Kundanlal Handa").
   */
  getBoardCommittees(): Promise<BoardCommittee[]> {
    const committees = [...(boardCommittees as BoardCommittee[])].sort((a, b) => a.order - b.order);
    return this.settle(committees);
  }
}
