import { investorPage, listingOf, type InvestorPage } from './investors';

/**
 * The Notifications page's static content — its name and `<title>`,
 * verbatim from the legacy https://www.sael.co/investors/notifications/,
 * read on 2026-09-30. The notifications themselves are documents and come
 * from the repository (`category: 'notifications'`).
 *
 * A page on its own, not an area: the legacy page has no side list, so it
 * passes no `nav`. No consent notice on the legacy page, and none here.
 */
export const notificationsPage: InvestorPage = investorPage(
  '/investors/',
  'notifications',
  'Notifications',
  'Notifications - SAEL',
  listingOf('notifications'),
);
