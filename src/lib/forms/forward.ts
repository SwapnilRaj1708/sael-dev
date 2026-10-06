import { z } from 'zod';
import { env } from '@/lib/config/env';
import type { FieldErrors, FormFailure } from './contract';
import type { FormId } from './registry';

/**
 * Hands a validated submission to `FORM_SUBMISSION_URL` — server to server,
 * so the destination's address and any credential stay off the client and it
 * needs no CORS rule. Imported by the route handler only. /CLAUDE.md §6,
 * docs/api-contracts.md §5.
 *
 * **Nothing is logged but the outcome.** PM2 writes the process's output to
 * disk on the VM, so a logged submission would be a visitor's name, email and
 * phone number in a log file nobody agreed to keep. The form's name and an
 * HTTP status are enough to find a fault.
 */

export interface ForwardRequest {
  form: FormId;
  url: string;
  /** The form's fields — the only keys of a destination's `fieldErrors` that can be shown. */
  fields: readonly string[];
  /** The submission as the schema returned it: validated and trimmed. */
  data: Record<string, unknown>;
  /** The page the form was sent from, or `null` when the browser did not say. */
  sourceUrl: string | null;
}

export type ForwardOutcome =
  | { ok: true; referenceId: string | null }
  | { ok: false; error: 'invalid'; fieldErrors: FieldErrors }
  | { ok: false; error: Extract<FormFailure, 'rate-limited' | 'unavailable'> };

const accepted = z.object({ referenceId: z.string().min(1).nullish() });
const rejected = z.object({ fieldErrors: z.record(z.string(), z.unknown()) });

/** A response body as JSON, or `null` if it is empty or not JSON. */
async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export async function forwardSubmission({
  form,
  url,
  fields,
  data,
  sourceUrl,
}: ForwardRequest): Promise<ForwardOutcome> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        formType: form,
        ...data,
        meta: { sourceUrl, submittedAt: new Date().toISOString() },
      }),
      signal: AbortSignal.timeout(env.API_TIMEOUT_MS),
    });
  } catch (error) {
    // A timeout, a refused connection, a DNS failure. The error names the
    // cause, not the submission.
    console.error(`[forms] ${form}: forwarding failed before a response.`, error);
    return { ok: false, error: 'unavailable' };
  }

  if (response.ok) {
    const body = accepted.safeParse(await readJson(response));
    return { ok: true, referenceId: body.success ? (body.data.referenceId ?? null) : null };
  }

  if (response.status === 429) {
    console.warn(`[forms] ${form}: the destination is rate limiting (429).`);
    return { ok: false, error: 'rate-limited' };
  }

  if (response.status === 400) {
    // The destination's verdict on a field is shown against that field, as
    // `invalid` — its own wording never reaches the page. A 400 that names no
    // field this form has is a disagreement between the two schemas, which
    // the visitor cannot fix, so it is reported as the destination failing.
    const body = rejected.safeParse(await readJson(response));
    const fieldErrors: FieldErrors = {};
    if (body.success) {
      for (const field of fields) {
        if (field in body.data.fieldErrors) fieldErrors[field] = 'invalid';
      }
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, error: 'invalid', fieldErrors };
    }
  }

  console.error(`[forms] ${form}: the destination answered ${String(response.status)}.`);
  return { ok: false, error: 'unavailable' };
}
