import { z } from 'zod';
import { env } from '@/lib/config/env';
import { siteConfig } from '@/lib/config/site';
import { fieldErrorsFrom, HONEYPOT_FIELD, type FormResponse } from '@/lib/forms/contract';
import { forwardSubmission } from '@/lib/forms/forward';
import { FORMS, isFormId } from '@/lib/forms/registry';

/**
 * Every form on the site posts here — `POST /api/forms/contact/` — and only
 * here: the browser never talks to the backend. The handler checks the
 * request, validates the submission against the same schema the form
 * validated it with, and forwards it server-side. /CLAUDE.md §6,
 * docs/api-contracts.md §5 for the contract.
 *
 * **In order:**
 *
 *  1. An unknown form is a `404`. The forms are `lib/forms/registry.ts`.
 *  2. A cross-site request is a `403`, read from `Sec-Fetch-Site`, which
 *     every current browser sends and a page cannot forge. A request without
 *     the header — curl, an old browser — is let through to the next check.
 *  3. Only `application/json` is accepted (`415`). That is also what stands in
 *     for the legacy form's CSRF token: another site can make a browser send
 *     a plain form post here, but not a JSON one without a CORS preflight,
 *     and this route answers no preflight.
 *  4. A body over 16 KB is a `413` — five fields at their limits are ~4 KB.
 *  5. A filled honeypot is acknowledged as a success and dropped, unlogged
 *     beyond the fact. See `HONEYPOT_FIELD`.
 *  6. The schema: a `400` with one code per rejected field.
 *  7. With `FORM_SUBMISSION_URL` unset, a valid submission is acknowledged
 *     and **not forwarded or kept anywhere** — development and staging. Set,
 *     it is forwarded and the destination's answer is passed on.
 *
 * **Not here: rate limiting.** It needs a count that every PM2 instance
 * shares, and this process has nowhere to keep one — memory is per instance
 * and lost on restart, and /CLAUDE.md §7 rules out the local disk. The
 * proposal is Nginx's `limit_req`, which sits in front of every instance:
 * deploy/nginx.conf.sample. A `429` from it, or from the destination, is shown
 * to the visitor as "try again later".
 *
 * POST only; Next answers any other method with a `405`. A POST handler is
 * dynamic, so it needs no `dynamic` export to stay uncached.
 */

const MAX_BODY_BYTES = 16 * 1024;

const record = z.record(z.string(), z.unknown());

function reply(status: number, body: FormResponse): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * The page the form was on, for the destination's benefit — from `Referer`,
 * which a same-origin fetch carries in full, and re-based on the site's own
 * origin so a forged header cannot name another site. `null` when absent.
 */
function sourceUrlFrom(request: Request): string | null {
  const referer = request.headers.get('referer');
  if (referer === null || !URL.canParse(referer)) return null;
  return new URL(new URL(referer).pathname, siteConfig.url).href;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ form: string }> },
): Promise<Response> {
  const { form } = await params;
  if (!isFormId(form)) return reply(404, { ok: false, error: 'not-found' });

  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite !== null && fetchSite !== 'same-origin') {
    return reply(403, { ok: false, error: 'forbidden' });
  }

  if (!/^application\/json\b/i.test(request.headers.get('content-type') ?? '')) {
    return reply(415, { ok: false, error: 'unsupported-media-type' });
  }

  // The declared length first, to refuse a large body without reading it;
  // then the real one, because the header is the client's word.
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return reply(413, { ok: false, error: 'too-large' });
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return reply(413, { ok: false, error: 'too-large' });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, error: 'bad-request' });
  }
  const body = record.safeParse(json);
  if (!body.success) return reply(400, { ok: false, error: 'bad-request' });

  const trap = body.data[HONEYPOT_FIELD];
  if (typeof trap === 'string' && trap.trim() !== '') {
    console.warn(`[forms] ${form}: honeypot filled; acknowledged and dropped.`);
    return reply(200, { ok: true, referenceId: null });
  }

  const { schema, fields } = FORMS[form];
  const submission = schema.safeParse(body.data);
  if (!submission.success) {
    return reply(400, {
      ok: false,
      error: 'invalid',
      fieldErrors: fieldErrorsFrom(submission.error, fields),
    });
  }

  if (env.FORM_SUBMISSION_URL === undefined) {
    console.info(`[forms] ${form}: valid; FORM_SUBMISSION_URL is unset, so not forwarded.`);
    return reply(200, { ok: true, referenceId: null });
  }

  const outcome = await forwardSubmission({
    form,
    url: env.FORM_SUBMISSION_URL,
    fields,
    data: submission.data,
    sourceUrl: sourceUrlFrom(request),
  });

  if (outcome.ok) return reply(200, outcome);
  if (outcome.error === 'invalid') return reply(400, outcome);
  return reply(outcome.error === 'rate-limited' ? 429 : 502, outcome);
}
