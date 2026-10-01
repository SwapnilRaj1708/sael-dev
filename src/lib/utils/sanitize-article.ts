import sanitizeHtml from 'sanitize-html';

/**
 * Reduce a Newsroom article body to the markup an article needs, and render
 * nothing else. `sanitize-bio.ts`'s counterpart, for the same reason:
 * `NewsArticle.body` is CMS HTML rendered as markup, so this is the backstop
 * behind the backend's own sanitiser, not a replacement for it.
 *
 * **The allowlist is what the seventeen legacy articles use**, read from
 * their HTML on 2026-10-01 — paragraphs; `h2` and `h3` (an article's `<h1>`
 * is its title, so a body starts at `h2`, and none goes deeper than `h3`;
 * `h4` is admitted because the legacy stylesheet styles it); lists; bold,
 * italic and underlined runs (`b`/`strong`, `i`/`em`, `u` — the "About SAEL"
 * boilerplate underlines its own label); links; and one `<figure>` with an
 * image. Anything else is discarded, not escaped, so a stripped tag leaves no
 * visible residue.
 *
 * - **Links** keep `href` only, on schemes that cannot execute, and are given
 *   `rel="noopener noreferrer"`. They open where the legacy ones did, in the
 *   same tab; `target` is not let through.
 * - **Images** keep `src`, `alt`, `width` and `height` — the last two so the
 *   browser reserves the box before the file arrives — and only an `https:`
 *   source. Each is lazy-loaded. `style` is dropped, which loses only the
 *   legacy editor's `aspect-ratio`, already implied by the two dimensions.
 *   An image with no `src` is removed rather than rendered broken.
 *
 * **Attributes this adds are also on the allowlist**, and must be: the
 * transforms run first, and the attribute filter would otherwise strip them
 * straight back off.
 *
 * Server-side only, for the reason `sanitizeBio` gives. Returns `null` for a
 * body that sanitises down to nothing.
 */
export function sanitizeArticle(body: string): string | null {
  const clean = sanitizeHtml(body, {
    allowedTags: [
      'p',
      'br',
      'h2',
      'h3',
      'h4',
      'ul',
      'ol',
      'li',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'a',
      'blockquote',
      'figure',
      'figcaption',
      'img',
    ],
    allowedAttributes: {
      a: ['href', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['https'] },
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
      img: sanitizeHtml.simpleTransform('img', { loading: 'lazy', decoding: 'async' }),
    },
    exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
  }).trim();

  return clean === '' ? null : clean;
}
