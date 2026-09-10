import { env } from '@/lib/config/env';

/**
 * Marker for copy the client has not supplied yet. Grep for it before launch.
 * Never replace one of these with a plausible-looking value — see /CLAUDE.md §3.
 */
export const TODO_CONTENT = '{{TODO: content}}';

/**
 * The one origin that may be indexed. Anything else — a staging box, a preview
 * VM, localhost — must serve `noindex`, because a staging copy indexed under
 * the client's brand is a launch-day incident.
 * docs/accessibility-and-seo.md §4.
 */
export const PRODUCTION_URL = 'https://www.sael.co';

/**
 * Declared explicitly rather than inferred from the literal.
 *
 * With `as const`, every unsupplied field narrows to the type
 * `'{{TODO: content}}'`, and TypeScript then reports the `!== TODO_CONTENT`
 * guards at the call sites as impossible comparisons. Those guards are the
 * whole point — they are what keeps a placeholder out of the footer, out of a
 * `mailto:` and out of the `sameAs` in structured data. So the fields are
 * typed as what they will hold once the client supplies them: `string`.
 */
export interface SiteConfig {
  name: string;
  legalName: string;
  url: string;
  registeredOffice: string;
  cin: string;
  telephone: string;
  /** `TODO_CONTENT` until the client supplies it. Check before rendering. */
  email: string;
  /** Each is `TODO_CONTENT` until supplied. Check before rendering. */
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    x: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'SAEL',
  legalName: 'SAEL INDUSTRIES LIMITED',
  url: env.NEXT_PUBLIC_SITE_URL,
  registeredOffice: 'H. No. 44, Model Town, Firozpur, Guruharsahai, Punjab, India, 152022',
  cin: 'U40106PB2022PLC055755',
  telephone: '011-44910011',
  email: 'info@sael.co',
  // social: {
  //   facebook: TODO_CONTENT,
  //   instagram: TODO_CONTENT,
  //   linkedin: TODO_CONTENT,
  //   x: TODO_CONTENT,
  // },
  social: {
    facebook: 'www.facebook.com/saelindustries',
    instagram: 'www.instagram.com/saelindustries',
    linkedin: 'www.linkedin.com/company/saelindustries',
    x: 'www.x.com/saelindustries',
  },
};

/**
 * Whether this deployment is the real public site. Compared on origin, so a
 * trailing slash or a path in the env var cannot accidentally let a staging
 * host through.
 */
export const isPublicSite: boolean =
  new URL(siteConfig.url).origin === new URL(PRODUCTION_URL).origin;
