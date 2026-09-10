import { siteConfig, TODO_CONTENT } from '@/lib/config/site';

/**
 * Structured data. Emitted from the root layout as `application/ld+json`.
 *
 * `Organization` and `WebSite` only — `docs/accessibility-and-seo.md` §3 is
 * explicit that `NewsArticle` is **not** emitted, because SAEL links out to
 * articles it does not host, and marking up someone else's article as your own
 * is misrepresentation, not SEO.
 *
 * Nothing here is invented. Every value comes from `site.ts`, and anything the
 * client has not supplied is omitted rather than guessed — a wrong `sameAs` or
 * a placeholder address in structured data is worse than no structured data,
 * because search engines treat it as a factual claim about a real company.
 */

/** JSON-LD is an open-ended shape; this is as far as it is worth typing. */
type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  const socialProfiles = Object.values(siteConfig.social).filter(
    (url) => url !== TODO_CONTENT && url !== '',
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    telephone: siteConfig.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'H. No. 44, Model Town',
      addressLocality: 'Guruharsahai',
      addressRegion: 'Punjab',
      postalCode: '152022',
      addressCountry: 'IN',
    },
    // Omitted entirely while the profile URLs are unsupplied. An empty
    // `sameAs` array is noise; a placeholder in one would be a false claim.
    ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
    ...(siteConfig.email !== TODO_CONTENT ? { email: siteConfig.email } : {}),
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { '@id': `${siteConfig.url}/#organization` },
    // No SearchAction — there is no site search, and claiming one produces a
    // sitelinks search box that 404s.
  };
}

/** One step of a breadcrumb trail. `href` is absent for a rung that is not a page. */
export interface BreadcrumbTrailItem {
  name: string;
  /** Root-relative, e.g. `/about-us/`. Omitted for a grouping label. */
  href?: string;
}

/**
 * `BreadcrumbList` for an inner page. Rendered by `ui/breadcrumb.tsx` beside
 * the trail it describes, rather than from the root layout, because the trail
 * is per-page and the markup must not be able to disagree with the visible
 * links. docs/accessibility-and-seo.md §3.
 *
 * A rung without an `href` — "Company", which groups pages but is not one —
 * emits `name` and `position` and no `item`. That is schema.org's own answer
 * for an intermediate node, and it is why `item` is spread in rather than set
 * to a placeholder: a URL that 404s is a worse claim than no URL.
 */
export function breadcrumbJsonLd(items: readonly BreadcrumbTrailItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href === undefined ? {} : { item: `${siteConfig.url}${item.href}` }),
    })),
  };
}
