import type { z } from 'zod';
import { CONTACT_FIELDS, contactFormSchema } from './contact';

/**
 * Every form `/api/forms/[form]/` accepts, by the `[form]` segment it is
 * posted to. **A new form is a schema and a line here** — the route, its
 * checks, the honeypot and the forwarding are shared — so Careers or Investor
 * Contact, if either grows a form, adds no route of its own.
 *
 * Imported by the route handler. A form in the browser imports its own schema
 * module (`./contact.ts`) and only the *type* `FormId` from here, so no page
 * ships another form's schema.
 */
interface FormDefinition {
  schema: z.ZodType<Record<string, unknown>>;
  /** The schema's fields, in the form's order. */
  fields: readonly string[];
}

export const FORMS = {
  contact: { schema: contactFormSchema, fields: CONTACT_FIELDS },
} as const satisfies Record<string, FormDefinition>;

export type FormId = keyof typeof FORMS;

export function isFormId(value: string): value is FormId {
  return Object.hasOwn(FORMS, value);
}
