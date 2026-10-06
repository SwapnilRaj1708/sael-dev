import { z } from 'zod';
import type { FieldErrorCode } from './contract';

/**
 * The Contact Us form — `/contact-us/` — as one Zod schema that the browser
 * checks before sending and the route handler checks again on arrival. The
 * browser's check is for the visitor's sake; the handler's is the real one.
 *
 * **The fields are the legacy form's, by name**: `name`, `email`, `contact`,
 * `subject`, `message`, all required, as https://www.sael.co/contact-us/
 * posts them. Their labels and placeholders are copy, and live in
 * `app/_content/contact-us.ts`.
 *
 * **The limits are new.** The legacy form has none; these are the handler's
 * defence against a request no person would send, sized well clear of
 * anything a person would.
 */

/** The legacy select's options, verbatim — the values it posts and the labels it shows. */
export const CONTACT_SUBJECTS = ['Business Enquiry', 'Job Vacancy', 'Other'] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const CONTACT_LIMITS = {
  name: 100,
  /** RFC 5321's ceiling for a whole address. */
  email: 254,
  /** Room for 15 digits — E.164's most — and their separators. */
  contact: 25,
  message: 3000,
} as const;

/**
 * A phone number as people write one: an optional leading `+`, then 7 to 15
 * digits with spaces, hyphens and brackets anywhere between them —
 * `011 4491 0011`, `+91-11-4491-0011`, `(011) 44910011`.
 *
 * **The legacy field was `type="number"`**, which rejected a `+`, dropped a
 * leading zero and offered a spinner. The field is `type="tel"` now, and this
 * one source is both the schema's rule and the input's `pattern` attribute,
 * so the two cannot drift. Written to compile under the `v` flag, which is
 * how a browser compiles `pattern`: every bracket and hyphen in a class is
 * escaped.
 */
export const CONTACT_PHONE_PATTERN = String.raw`\+?[ \(\)\-]*(?:[0-9][ \(\)\-]*){7,15}`;

const PHONE = new RegExp(`^(?:${CONTACT_PHONE_PATTERN})$`);

const REQUIRED: FieldErrorCode = 'required';
const INVALID: FieldErrorCode = 'invalid';
const TOO_LONG: FieldErrorCode = 'too-long';

/** Absent is `required`; present but not a string — a crafted request — is `invalid`. */
function presence(issue: { input: unknown }): FieldErrorCode {
  return issue.input === undefined ? REQUIRED : INVALID;
}

/** Trimmed before it is measured, so a field of spaces is empty. */
function text(max: number) {
  return z.string({ error: presence }).trim().min(1, REQUIRED).max(max, TOO_LONG);
}

export const contactFormSchema = z.object({
  name: text(CONTACT_LIMITS.name),
  email: text(CONTACT_LIMITS.email).pipe(z.email({ error: INVALID })),
  contact: z
    .string({ error: presence })
    .trim()
    .min(1, REQUIRED)
    .max(CONTACT_LIMITS.contact, INVALID)
    .regex(PHONE, INVALID),
  // The placeholder option, "Select Option", posts an empty string.
  subject: z.enum(CONTACT_SUBJECTS, {
    error: (issue) => (issue.input === undefined || issue.input === '' ? REQUIRED : INVALID),
  }),
  message: text(CONTACT_LIMITS.message),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactField = keyof ContactFormValues;

/** In the form's order — the order errors are listed and the first one focused. */
export const CONTACT_FIELDS = [
  'name',
  'email',
  'contact',
  'subject',
  'message',
] as const satisfies readonly ContactField[];
