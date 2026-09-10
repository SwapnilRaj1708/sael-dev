import { notFound, permanentRedirect } from 'next/navigation';
import { env } from '@/lib/config/env';

/**
 * Careers is not a page — it is a redirect to the client's Oracle recruiting
 * system. The target URL is unconfirmed (docs/frontend-progress.md → Blocked),
 * so an unset CAREER_REDIRECT_URL 404s rather than sending visitors nowhere.
 * Finalised in FE-20 — see docs/features/20-career-redirect.md.
 */
export const dynamic = 'force-dynamic';

export function GET(): never {
  if (env.CAREER_REDIRECT_URL === undefined) {
    notFound();
  }

  permanentRedirect(env.CAREER_REDIRECT_URL);
}
