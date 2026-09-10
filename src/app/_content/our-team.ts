import type { TeamGridGroup } from '@/components/sections/team-grid';
import type { BreadcrumbTrailItem } from '@/lib/seo/json-ld';

/**
 * The Our Team page's static content — everything on it that is *not* a person.
 *
 * The people themselves come from the repository (`getTeamMembers()`), which
 * is what makes this the first page driven entirely by backend data. What is
 * left here is the frame around them: the title, the standfirst, the trail and
 * the tab labels.
 *
 * **Every string is transcribed verbatim from `Our Team.dc.html`**, the
 * client's Claude Design project, which carries the copy from the live
 * https://www.sael.co/our-team/. /CLAUDE.md §2 rule 3: nothing is paraphrased
 * and nothing missing has been invented.
 *
 * There is no artwork. The design opens on the dotted black ground rather than
 * on a banner photograph, so unlike `about-us.ts` this file imports no images
 * and `docs/asset-inventory.md` gains no row.
 */

export const ourTeamMeta = {
  /**
   * The design file's own `<title>`, verbatim — including the hyphen, where
   * `about-us.ts` carries a pipe. The two design files differ and neither is
   * this codebase's invention; **FE-22 should settle which separator the site
   * uses** against the legacy titles, since changing a ranking title is not a
   * decision to make in passing. Flagged in the tracker.
   */
  title: 'Our Team - SAEL',
} as const;

export const ourTeamHero: {
  title: string;
  intro: string;
  breadcrumb: readonly BreadcrumbTrailItem[];
} = {
  title: 'Our Team',
  intro: 'The Minds Steering the Worldwide Energy Evolution',
  breadcrumb: [
    { name: 'Home', href: '/' },
    // No `href`: "Company" groups the pages under it and is not one itself.
    // The same rung About Us hangs from.
    { name: 'Company' },
    { name: 'Our Team', href: '/our-team/' },
  ],
};

/**
 * The two tabs, in the design's order.
 *
 * Labels live here and the ids live in `TeamGroup`, so a rename is a copy
 * change and not a data migration. The order is this array's, not the
 * repository's — `order` sequences people within the roster, not the groups.
 */
export const ourTeamGroups: readonly TeamGridGroup[] = [
  { id: 'leadership', label: 'Leadership' },
  { id: 'management', label: 'Management' },
];

/**
 * Shown when the roster comes back empty, and when the repository fails.
 *
 * Deliberately says nothing about *why*. A visitor cannot act on "the content
 * service timed out", and a page that names its backend in an error message is
 * telling an attacker something it did not need to.
 */
export const ourTeamEmpty = {
  title: 'Team profiles are unavailable',
  description: 'We could not load the team just now. Please try again shortly.',
} as const;
