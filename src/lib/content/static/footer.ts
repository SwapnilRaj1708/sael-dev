import { siteConfig, TODO_CONTENT } from '@/lib/config/site';

/**
 * Footer content. Static — it never comes from the backend, so it does not go
 * through the content repository.
 *
 * **The grouping here is deliberately not the navigation's.** "Know More"
 * mixes Company, Newsroom, Career and Contact, and the Investors column omits
 * Offer Documents. That is how the live site groups them, so it is reproduced
 * rather than derived from `nav-config.ts`. The acceptance criterion about a
 * route appearing everywhere from one edit covers the nav, the drawer and the
 * sitemap — not the footer, for exactly this reason.
 *
 * docs/features/03-app-shell-header-footer.md §3.
 */

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterGroup {
  title: string;
  links: readonly FooterLink[];
}

export const FOOTER_GROUPS: readonly FooterGroup[] = [
  {
    title: 'Know More',
    links: [
      { label: 'About Us', href: '/about-us/' },
      { label: 'Our Team', href: '/our-team/' },
      { label: 'Contact Us', href: '/contact-us/' },
      { label: 'Newsroom', href: '/newsroom/' },
      { label: 'Career', href: '/career/', external: true },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Solar Energy', href: '/solar-energy/' },
      { label: 'Waste To Energy', href: '/waste-to-energy/' },
      { label: 'Module Manufacturing', href: '/module-manufacturing/' },
      { label: 'Solar Cell Manufacturing', href: '/solar-cell-manufacturing/' },
    ],
  },
  {
    title: 'Sustainability',
    links: [
      { label: 'Story of Our Influence', href: '/story-of-our-influence/' },
      { label: 'Our Key ESG Metrics', href: '/our-key-esg-metrics/' },
      { label: 'Our Core Beliefs', href: '/our-core-beliefs/' },
    ],
  },
  {
    title: 'Investors',
    links: [
      { label: 'Corporate Governance', href: '/investors/corporate-governance/' },
      { label: 'Financials & Reports', href: '/investors/financials-and-reports/' },
      { label: 'Notifications', href: '/investors/notifications/' },
      { label: 'Investor Contact', href: '/investors/contact-us/' },
    ],
  },
];

export const LEGAL_LINKS: readonly FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Disclaimer', href: '/disclaimer/' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions/' },
];

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'x';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

/**
 * The social profiles that actually have a URL.
 *
 * All four are still `{{TODO: content}}` in `site.ts`, so today this returns
 * an empty array and the social row does not render. A button linking to `#`
 * is worse than no button: it is focusable, announced as a link, and goes
 * nowhere. Filling in the URLs is the only change needed to bring the row
 * back — see the Blocked table in docs/frontend-progress.md.
 */
export const SOCIAL_LINKS: readonly SocialLink[] = (
  [
    { platform: 'facebook', label: 'Facebook', href: siteConfig.social.facebook },
    { platform: 'instagram', label: 'Instagram', href: siteConfig.social.instagram },
    { platform: 'linkedin', label: 'LinkedIn', href: siteConfig.social.linkedin },
    { platform: 'x', label: 'X', href: siteConfig.social.x },
  ] satisfies readonly SocialLink[]
).filter((link) => link.href !== TODO_CONTENT && link.href !== '');
