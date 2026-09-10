import type { SVGProps } from 'react';
import type { SocialPlatform } from '@/lib/content/static/footer';

/**
 * Social platform brand marks, from each platform's own brand resources.
 *
 * Inline components rather than files, because they inherit `currentColor` —
 * the footer paints them `--color-footer-icon` on white, the mobile drawer
 * paints them differently. A fixed-colour file could not do both.
 * docs/asset-inventory.md §3.
 *
 * Every path is `fill="currentColor"` and every glyph is drawn inside a
 * 24×24 box, so they line up optically at any size without per-icon nudging.
 *
 * These carry no `aria-label` and no `<title>`. They are always rendered
 * inside a link that already has an accessible name, and a second name on the
 * icon would have the platform announced twice.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      {children}
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </Svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.64-.07 4.85-.07Zm0 2.16c-3.15 0-3.52.01-4.77.07-1.15.05-1.77.24-2.19.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.62-.07 4.77s.01 3.52.07 4.77c.05 1.15.24 1.77.4 2.19.21.55.47.94.88 1.35.41.41.8.67 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.62.07 4.77.07s3.52-.01 4.77-.07c1.15-.05 1.77-.24 2.19-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.62.07-4.77s-.01-3.52-.07-4.77c-.05-1.15-.24-1.77-.4-2.19a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.62-.07-4.77-.07Zm0 3.67a5.01 5.01 0 1 1 0 10.02 5.01 5.01 0 0 1 0-10.02Zm0 8.26a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm6.38-8.46a1.17 1.17 0 1 1-2.34 0 1.17 1.17 0 0 1 2.34 0Z" />
    </Svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.32 20.5h3.32V8.98H3.32V20.5Zm5.4-11.52h3.18v1.58h.05c.44-.84 1.53-1.73 3.14-1.73 3.36 0 3.98 2.21 3.98 5.08v6.59h-3.32v-5.84c0-1.39-.03-3.18-1.94-3.18-1.94 0-2.24 1.52-2.24 3.08v5.94H8.72V8.98Z" />
    </Svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17.53 3h3.06l-6.69 7.64L21.75 21h-6.16l-4.83-6.3L5.24 21H2.18l7.15-8.17L2.5 3h6.32l4.36 5.77L17.53 3Zm-1.07 16.17h1.69L7.6 4.74H5.79l10.67 14.43Z" />
    </Svg>
  );
}

/** Lookup by platform, so a `SocialLink` can render without a switch at each site. */
export const SOCIAL_ICONS: Record<SocialPlatform, (props: IconProps) => React.JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
};
