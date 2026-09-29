'use server';

import { z } from 'zod';
import { gatedDocumentListings, gatedVideoListings } from '@/app/_content/offer-documents';
import type { VideoPlayerSource } from '@/components/ui/video-player';
import { getContentRepository } from '@/lib/content';

/**
 * The investor area's Server Actions — how a consent gate gets the URL it
 * guards, after the reader has confirmed and not before.
 *
 * **Why an action rather than a prop.** Anything a Server Component passes to
 * a client component is serialised into the page — the HTML and the RSC
 * payload both. A gated URL passed as a prop would be in the page source
 * before anyone confirmed anything, which is precisely what the legacy DRHP
 * page did with its inline script. An action runs on the click and returns
 * only then.
 *
 * **Not access control, and not pretending to be.** An action is a POST
 * endpoint that anyone can call, and the files are public blobs that are also
 * published by SEBI and the exchanges. What this guarantees is narrower and is
 * the requirement: nothing gated is in the page until the reader confirms.
 * docs/api-contracts.md §3 records the rest for legal review.
 *
 * Every input is untrusted — the page supplies it, but anything can POST.
 * Keys are validated as short strings and then looked up only inside the
 * gated listings named in the content file; anything else resolves `null`
 * rather than reaching the repository, so an action cannot be pointed at
 * listings it was not written for. Returns carry only what the gate renders.
 *
 * No closures and no bound arguments, so nothing is encrypted into the page:
 * the PM2 instances need no shared `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.
 * A deploy does rotate action IDs, so a tab left open across one gets a
 * rejection here; the gates catch it and ask for a refresh.
 */

const Key = z.string().min(1).max(200);

/**
 * The URL of one gated document, by id — or `null` if the id is not a
 * document in a gated listing, or the repository failed.
 */
export async function revealGatedDocument(id: string): Promise<string | null> {
  const parsed = Key.safeParse(id);
  if (!parsed.success) return null;

  try {
    const repository = getContentRepository();

    for (const listing of gatedDocumentListings) {
      const documents = await repository.getInvestorDocuments(listing);
      const match = documents.find((document) => document.id === parsed.data);
      if (match !== undefined) return match.file.url;
    }
  } catch (error) {
    console.error('[investors] revealGatedDocument failed.', error);
  }

  return null;
}

/**
 * The sources of the video in one gated listing, by its section — or `null`
 * if the section is not gated, it has no video, or the repository failed.
 */
export async function revealGatedVideo(section: string): Promise<VideoPlayerSource | null> {
  const parsed = Key.safeParse(section);
  if (!parsed.success) return null;

  const listing = gatedVideoListings.find((candidate) => candidate.section === parsed.data);
  if (listing === undefined) return null;

  try {
    const [video] = await getContentRepository().getInvestorVideos(listing);
    if (video === undefined) return null;

    return {
      src: video.file.url,
      type: video.file.mimeType,
      poster: video.posterUrl,
      captions: video.captions.map((track) => ({
        src: track.url,
        srcLang: track.srcLang,
        label: track.label,
      })),
    };
  } catch (error) {
    console.error('[investors] revealGatedVideo failed.', error);
    return null;
  }
}
