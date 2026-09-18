'use client';

import type { StaticImageData } from 'next/image';
import { MediaFrame } from '@/components/ui/media-frame';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils/cn';

export interface VideoFrameProps {
  /** Absolute URL of the file. `null` when the blob host is unconfigured. */
  src: string | null;
  /**
   * The still shown before the first frame arrives, and *instead of* the
   * video for anyone who has asked for reduced motion. `null` holds the box
   * as a plain placeholder, as `<MediaFrame>` does.
   */
  poster: StaticImageData | null;
  /** Describes the poster. The video itself is decorative — see below. */
  posterAlt: string;
  /** `sizes` for the poster image. */
  sizes: string;
  /** The asset's name in docs/asset-inventory.md, for the pending placeholder. */
  pending?: string;
  className?: string;
}

/**
 * A silent, looping, background video that holds the same box whether or
 * not it plays.
 *
 * **Decorative by contract.** This is for a moving backdrop under copy — the
 * Solar Energy hero, first — not for a video that *is* the content. It has no
 * audio, no controls and no captions track, and it is `aria-hidden`, because
 * everything it would say is said by the heading and standfirst laid over
 * it. A video that carries meaning needs controls and a transcript, and is a
 * different component.
 *
 * **Reduced motion gets the poster, not a paused video.** `autoPlay` cannot
 * be gated by a media query in markup, so the choice is made here: the
 * still is rendered on the server and for anyone who prefers reduced motion,
 * and the `<video>` replaces it only once the client knows the preference
 * allows movement. The cost is that a visitor with motion enabled sees the
 * poster for one paint before the video mounts, which is what a poster is
 * for. /CLAUDE.md §5.
 *
 * `muted` is what lets a browser autoplay at all; `playsInline` keeps iOS
 * from taking it full screen; `preload="metadata"` fetches enough to size
 * and start, not the whole file up front. The poster is drawn through
 * `<MediaFrame>` underneath so the box is reserved before either arrives.
 */
export function VideoFrame({ src, poster, posterAlt, sizes, pending, className }: VideoFrameProps) {
  const reducedMotion = useReducedMotion();
  const playing = !reducedMotion && src !== null;

  return (
    <div className={cn('relative overflow-hidden bg-surface-deep', className)}>
      <MediaFrame
        image={poster}
        alt={posterAlt}
        sizes={sizes}
        priority
        pending={pending}
        className="absolute inset-0"
      />
      {playing && (
        <video
          src={src}
          poster={poster?.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  );
}
