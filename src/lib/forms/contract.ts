import { z } from 'zod';
import type { FormId } from './registry';

/**
 * The contract between a form in the browser and the site's own route
 * handler, `/api/forms/[form]/` — both sides import it, so they cannot
 * disagree about a field name, an error code or a response's shape.
 * docs/api-contracts.md §5, docs/content-model.md §6.
 *
 * **Errors travel as codes, not sentences.** A field is rejected as
 * `required`, `invalid` or `too-long`, and a submission fails with one of
 * `FORM_FAILURES`; the words a visitor reads are the form's own copy, keyed by
 * those codes, in the page's content file. So the handler never puts a
 * sentence on screen — not its own, and not one passed through from whatever
 * sits behind it — and every string the visitor can see is in one file the
 * client can review.
 */

export const FIELD_ERROR_CODES = ['required', 'invalid', 'too-long'] as const;
export type FieldErrorCode = (typeof FIELD_ERROR_CODES)[number];

/** One code per rejected field, keyed by the field's name in the request. */
export type FieldErrors<Field extends string = string> = Partial<Record<Field, FieldErrorCode>>;

/**
 * Why a submission as a whole failed. `invalid` is the only one that carries
 * `fieldErrors`; the rest are the handler refusing the request itself
 * (`bad-request` to `too-large`) or the destination behind it not taking it
 * (`rate-limited`, `unavailable`).
 */
export const FORM_FAILURES = [
  'invalid',
  'bad-request',
  'forbidden',
  'not-found',
  'unsupported-media-type',
  'too-large',
  'rate-limited',
  'unavailable',
] as const;
export type FormFailure = (typeof FORM_FAILURES)[number];

/**
 * What the handler answers, success or not. Parsed, not trusted, on the
 * client: a response that does not match — Nginx's own HTML 429 or 502 page,
 * say — is read from its status instead (`lib/forms/submit.ts`).
 */
export const formResponseSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    /** The destination's reference for the enquiry, when it sends one. */
    referenceId: z.string().nullable(),
  }),
  z.object({
    ok: z.literal(false),
    error: z.enum(FORM_FAILURES),
    fieldErrors: z.partialRecord(z.string(), z.enum(FIELD_ERROR_CODES)).optional(),
  }),
]);

export type FormResponse = z.infer<typeof formResponseSchema>;

/**
 * The honeypot's field name, shared by every form. A real person never sees
 * the field (`ui/honeypot-field.tsx`); a bot filling in every input does. The
 * handler acknowledges a submission that fills it as though it succeeded and
 * forwards nothing, so the bot learns nothing from the answer.
 *
 * "website" because form-filling bots reliably fill a field by that name,
 * and because no browser's autofill has a "website" category to fill it for
 * a person — which is the failure a honeypot must not have, since a person it
 * catches loses their message without being told.
 */
export const HONEYPOT_FIELD = 'website';

/** The route a form posts to, with the trailing slash every URL here carries. */
export function formEndpoint(form: FormId): string {
  return `/api/forms/${form}/`;
}

function isFieldErrorCode(value: string): value is FieldErrorCode {
  return (FIELD_ERROR_CODES as readonly string[]).includes(value);
}

/** The code a field's schema raised for one value — its first issue's. */
export function fieldErrorCode(error: z.ZodError): FieldErrorCode {
  const message = error.issues[0]?.message ?? 'invalid';
  return isFieldErrorCode(message) ? message : 'invalid';
}

/**
 * A schema's issues as one code per field — the first issue on each, which is
 * the one the schema puts first (`required` before `invalid`). Each form's
 * schema raises its codes as the issue's message; anything else it raises,
 * Zod's own wording included, is reported as `invalid`. Issues on fields the
 * form does not have are dropped: there is nowhere to show them.
 */
export function fieldErrorsFrom<Field extends string>(
  error: z.ZodError,
  fields: readonly Field[],
): FieldErrors<Field> {
  const errors: FieldErrors<Field> = {};

  for (const issue of error.issues) {
    const field = fields.find((name) => name === issue.path[0]);
    if (field === undefined || errors[field] !== undefined) continue;
    errors[field] = isFieldErrorCode(issue.message) ? issue.message : 'invalid';
  }

  return errors;
}
