import type { Metadata } from 'next';
import { TeamGrid } from '@/components/sections/team-grid';
import { getContentRepository, type TeamMember } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { ourTeamEmpty, ourTeamGroups, ourTeamHero, ourTeamMeta } from '../_content/our-team';

export const metadata: Metadata = buildMetadata({
  title: ourTeamMeta.title,
  // No description: the design file carries a `<title>` and no
  // `<meta name="description">`, and `buildMetadata` omits the tag rather than
  // emitting a placeholder. /CLAUDE.md §2 rule 3. {{TODO: content}} — a meta
  // description for /our-team/.
  //
  // `trailingSlash: true` in next.config.ts, and the legacy site's URL is
  // `/our-team/`. /CLAUDE.md §2 rule 6 — the canonical must match exactly.
  path: '/our-team/',
});

/**
 * Our Team — the first page whose content is entirely repository-driven.
 *
 * Built to `Our Team.dc.html` (Claude Design project
 * `a6a044b5-3829-44df-baae-d700f52344ec`), read through the design MCP.
 *
 * The page fetches and the section renders, which is the split /CLAUDE.md §5
 * asks for: `<TeamGrid>` never calls the repository, so it can be shown
 * anything — a full roster, one group, or nothing — without knowing where it
 * came from.
 *
 * **The failure path is the whole reason this is a `try`/`catch` and not a
 * bare `await`.** `docs/features/07-our-team.md` requires that a repository
 * failure render an empty state rather than a 500, and `<TeamGrid>` already
 * draws one when it is handed no members — so a failure and an empty roster
 * converge on the same screen, and the visitor still gets the heading, the
 * breadcrumb and a page that resolves. The error is logged rather than
 * swallowed: nothing else would record that the backend is down.
 *
 * **No `<PageHero>`** — the one place this departs from `about-us/page.tsx`,
 * and it is explained on `<TeamGrid>` itself. Snapping is *not* a difference
 * between them: this page never had it, and PR 2533 removed it from About Us
 * and from the shared template on 2026-09-10, so neither page snaps now.
 *
 * A Server Component, and so is everything under it bar two leaves — the tab
 * list, and the biography dialog on each card.
 */
export default async function OurTeamPage() {
  let members: TeamMember[] = [];

  try {
    members = await getContentRepository().getTeamMembers();
  } catch (error) {
    // Server-side only, and the one place this failure is visible at all.
    console.error('[our-team] getTeamMembers failed; rendering the empty state.', error);
  }

  return (
    <TeamGrid
      title={ourTeamHero.title}
      intro={ourTeamHero.intro}
      breadcrumb={ourTeamHero.breadcrumb}
      groups={ourTeamGroups}
      members={members}
      emptyTitle={ourTeamEmpty.title}
      emptyDescription={ourTeamEmpty.description}
    />
  );
}
