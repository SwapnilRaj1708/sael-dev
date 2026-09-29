import type { Metadata } from 'next';
import {
  audioVisualNotice,
  consentCopy,
  consentExitHref,
  offerDocumentsNav,
  offerDocumentsPages,
  videoFallback,
} from '@/app/_content/offer-documents';
import { revealGatedVideo } from '@/app/investors/actions';
import { SubPage } from '@/components/sections/sub-page';
import { GatedVideo } from '@/components/ui/gated-video';
import { NoticeText } from '@/components/ui/notice-text';
import { buildMetadata } from '@/lib/seo/metadata';

const page = offerDocumentsPages.audioVisualHindi;

export const metadata: Metadata = buildMetadata({
  title: page.meta.title,
  description: page.meta.description,
  path: page.path,
});

/**
 * DRHP - Audio Visual (Hindi) — the DRHP's audio-visual presentation, in
 * Hindi, as a video the reader plays themselves. The disclaimer is the
 * English page's, word for word — as it is on the legacy site.
 *
 * **Gated per page, on arrival** — the legacy behaviour, exactly: the
 * disclaimer is the first thing on the page, "I Confirm" reveals the video,
 * "I Do Not Confirm" sends the reader to the Offer Documents index, and the
 * next visit asks again. Nothing is remembered.
 *
 * The notice stands in the page where the video will be, rather than over it
 * as the legacy modal does. That is presentation only — what it takes to
 * reach the video is unchanged — and `ui/consent-gate.tsx` says why.
 *
 * **The video is not in this page.** The page does not even fetch it: its
 * URL, its poster and its caption tracks are fetched by `revealGatedVideo` on
 * "I Confirm", and until then nothing about the file is in the HTML or the
 * RSC payload. The notice is ordinary server-rendered text, readable without
 * script and by a crawler.
 *
 * No heading over the video: the legacy page has none, and the `<h1>` is its
 * title. The player takes that title as its accessible name.
 *
 * A Server Component; the ripple band and `<GatedVideo>` are the client
 * leaves.
 */
export default function DrhpAudioVisualHindiPage() {
  return (
    <SubPage
      // The ripple band, with this page's own name as the title — the
      // client's ask of 2026-09-29, the same opening as the index.
      masthead="ripple"
      title={page.name}
      nav={offerDocumentsNav(page)}
    >
      <GatedVideo
        title={page.name}
        fallback={videoFallback}
        copy={consentCopy}
        notice={<NoticeText paragraphs={audioVisualNotice} />}
        exitHref={consentExitHref}
        revealKey={page.slug}
        reveal={revealGatedVideo}
      />
    </SubPage>
  );
}
