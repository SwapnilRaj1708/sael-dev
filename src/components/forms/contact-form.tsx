'use client';

import { LoaderCircle } from 'lucide-react';
import { useRef, useState, type SubmitEvent } from 'react';
import { flushSync } from 'react-dom';
import { ArrowGlyph } from '@/components/ui/arrow-glyph';
import { Button } from '@/components/ui/button';
import { FormErrorSummary } from '@/components/ui/form-error-summary';
import { FormField } from '@/components/ui/form-field';
import { FormStatus, type FormStatusMessage } from '@/components/ui/form-status';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CONTACT_FIELDS,
  CONTACT_PHONE_PATTERN,
  CONTACT_SUBJECTS,
  contactFormSchema,
  type ContactField,
} from '@/lib/forms/contact';
import {
  fieldErrorCode,
  fieldErrorsFrom,
  formEndpoint,
  HONEYPOT_FIELD,
  type FieldErrorCode,
  type FieldErrors,
} from '@/lib/forms/contract';
import { submitForm } from '@/lib/forms/submit';
import { focusField } from '@/lib/utils/focus-field';

/** Every word the form shows. All of it is the page's copy — `_content/contact-us.ts`. */
export interface ContactFormCopy {
  /**
   * Each field's label and placeholder, verbatim from the legacy form. The
   * subject's placeholder is the select's prompt, "Select Option".
   */
  fields: Record<ContactField, { label: string; placeholder: string }>;
  /** The legacy form's `*`. */
  requiredMarker: string;
  submit: string;
  /** The button's label while sending. */
  pending: string;
  /** The honeypot's label, read only if the CSS fails. */
  honeypotLabel: string;
  /**
   * A sentence per field per code. `invalid` is required on every field, and
   * stands in for a code the field has no sentence of its own for.
   */
  errors: Record<ContactField, Partial<Record<FieldErrorCode, string>> & { invalid: string }>;
  /** The line above the list of errors. */
  summaryTitle: string;
  /** Sent. */
  sent: string;
  /** The reference line under "sent", with `{referenceId}` in it. */
  reference: string;
  /** Not sent: too many attempts. */
  rateLimited: string;
  /** Not sent: anything else — the destination down, the network gone. */
  unavailable: string;
}

export interface ContactFormProps {
  copy: ContactFormCopy;
  /** The id of the heading that names the form. */
  labelledBy: string;
}

const controlId = (field: ContactField) => `contact-${field}`;

function isContactField(name: string): name is ContactField {
  return (CONTACT_FIELDS as readonly string[]).includes(name);
}

/** The control an event bubbled up from, if it is one with a value. */
function controlOf(
  target: EventTarget,
): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  return target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement
    ? target
    : null;
}

/** A field's value from the form, as a string. A select left on its placeholder posts nothing. */
function valueOf(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
}

const SUBJECT_OPTIONS = CONTACT_SUBJECTS.map((subject) => ({ value: subject, label: subject }));

/**
 * The Contact Us form. It posts JSON to `/api/forms/contact/`, never to the
 * backend; the route validates again and forwards. /CLAUDE.md §6.
 *
 * **Validation, in the browser, for the visitor's sake** — the route's check
 * is the real one, against the same schema (`lib/forms/contact.ts`):
 *
 *  - A field is checked when it is left, if it has something in it — so
 *    tabbing through an empty form does not paint it red — and rechecked on
 *    every change once it has an error, so the error goes the moment the
 *    field is right.
 *  - On submit, every field. If any fails: each shows its error, the summary
 *    above the fields lists them, and focus moves to the first, scrolled
 *    into view with its label and error (`focusField`). The route's verdict,
 *    when it disagrees, is shown the same way.
 *
 * **Submitting.** The button says it is sending and is marked
 * `aria-disabled`, but not `disabled`: a disabled button drops focus to the
 * page, and a keyboard user would lose their place. A second press while one
 * request is in flight does nothing (`inFlight`). Sent, the form clears and
 * the outcome is announced from the live region beside the button. Not sent,
 * the fields are left as they were, so nothing has to be retyped.
 *
 * **Without JavaScript** the form still posts to the route rather than
 * putting a name, email and phone number into the URL of a GET; the route
 * accepts only JSON, so that post is refused, and the address, phone and
 * email above the form are the way in.
 */
export function ContactForm({ copy, labelledBy }: ContactFormProps) {
  const [errors, setErrors] = useState<FieldErrors<ContactField>>({});
  const [summary, setSummary] = useState<FieldErrors<ContactField>>({});
  const [status, setStatus] = useState<FormStatusMessage | null>(null);
  const [pending, setPending] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  const inFlight = useRef(false);

  function sentence(field: ContactField, code: FieldErrorCode): string {
    return copy.errors[field][code] ?? copy.errors[field].invalid;
  }

  function check(field: ContactField, value: string): FieldErrorCode | undefined {
    const result = contactFormSchema.shape[field].safeParse(value);
    return result.success ? undefined : fieldErrorCode(result.error);
  }

  /** Shows a failed submit: every error, the summary, and focus on the first. */
  function reject(found: FieldErrors<ContactField>) {
    // Committed before focus moves, so the error the control is described by
    // is already in the page when the screen reader reads it.
    flushSync(() => {
      setErrors(found);
      setSummary(found);
      setStatus(null);
      setAnnouncement((count) => count + 1);
    });
    const first = CONTACT_FIELDS.find((field) => found[field] !== undefined);
    if (first !== undefined) focusField(controlId(first));
  }

  function recheck(name: string, value: string, onlyIfShowing: boolean) {
    if (!isContactField(name)) return;
    if (onlyIfShowing && errors[name] === undefined) return;
    setErrors((current) => ({ ...current, [name]: check(name, value) }));
  }

  async function send(form: HTMLFormElement) {
    const data = new FormData(form);
    const values = Object.fromEntries(CONTACT_FIELDS.map((field) => [field, valueOf(data, field)]));

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      reject(fieldErrorsFrom(parsed.error, CONTACT_FIELDS));
      return;
    }

    inFlight.current = true;
    setPending(true);
    setStatus(null);

    const outcome = await submitForm('contact', {
      ...parsed.data,
      [HONEYPOT_FIELD]: valueOf(data, HONEYPOT_FIELD),
    });

    inFlight.current = false;
    setPending(false);

    if (outcome.ok) {
      form.reset();
      setErrors({});
      setSummary({});
      setStatus({
        tone: 'success',
        title: copy.sent,
        detail:
          outcome.referenceId === null
            ? undefined
            : copy.reference.replace('{referenceId}', outcome.referenceId),
      });
      setAnnouncement((count) => count + 1);
      return;
    }

    if (outcome.error === 'invalid' && outcome.fieldErrors !== undefined) {
      const found: FieldErrors<ContactField> = {};
      for (const field of CONTACT_FIELDS) found[field] = outcome.fieldErrors[field];
      if (CONTACT_FIELDS.some((field) => found[field] !== undefined)) {
        reject(found);
        return;
      }
    }

    setStatus({
      tone: 'error',
      title: outcome.error === 'rate-limited' ? copy.rateLimited : copy.unavailable,
    });
    setAnnouncement((count) => count + 1);
  }

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    void send(event.currentTarget);
  }

  const summaryItems = CONTACT_FIELDS.flatMap((field) => {
    const code = summary[field];
    return code === undefined
      ? []
      : [{ controlId: controlId(field), message: sentence(field, code) }];
  });

  const fieldProps = (field: ContactField) => {
    const code = errors[field];
    return {
      id: controlId(field),
      label: copy.fields[field].label,
      required: true,
      requiredMarker: copy.requiredMarker,
      error: code === undefined ? null : sentence(field, code),
    };
  };

  return (
    <form
      // Without JavaScript, still a POST to the route — never a GET that
      // would put the visitor's details in a URL.
      action={formEndpoint('contact')}
      method="post"
      noValidate
      aria-labelledby={labelledBy}
      onSubmit={onSubmit}
      // Delegated: `blur` and `change` from every field bubble to here. Left
      // empty, a field is only rechecked if it already shows an error.
      onBlur={(event) => {
        const control = controlOf(event.target);
        if (control !== null) recheck(control.name, control.value, control.value.trim() === '');
      }}
      onChange={(event) => {
        const control = controlOf(event.target);
        if (control !== null) recheck(control.name, control.value, true);
      }}
      className="flex flex-col gap-flow"
    >
      {/* Both live regions stay in the page while empty, so that what they
          later say is announced (see `<FormStatus>`). Empty, each cancels
          the gap beside it, or the form would carry space for a message it
          is not showing. */}
      <FormErrorSummary
        title={copy.summaryTitle}
        items={summaryItems}
        announcement={announcement}
        className="empty:-mb-flow"
      />

      <div className="grid grid-cols-1 gap-x-gap-grid gap-y-flow md:grid-cols-2">
        <FormField {...fieldProps('name')}>
          {(control) => (
            <Input
              {...control}
              name="name"
              type="text"
              autoComplete="name"
              enterKeyHint="next"
              placeholder={copy.fields.name.placeholder}
            />
          )}
        </FormField>

        <FormField {...fieldProps('email')}>
          {(control) => (
            <Input
              {...control}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="next"
              placeholder={copy.fields.email.placeholder}
            />
          )}
        </FormField>

        <FormField {...fieldProps('contact')}>
          {(control) => (
            // The legacy field was `type="number"`, which refused "+91" and
            // dropped a leading zero. A phone number is text that a keypad
            // types: `tel` gives the phone keypad and keeps every character.
            <Input
              {...control}
              name="contact"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              pattern={CONTACT_PHONE_PATTERN}
              enterKeyHint="next"
              placeholder={copy.fields.contact.placeholder}
            />
          )}
        </FormField>

        <FormField {...fieldProps('subject')}>
          {(control) => (
            <Select
              {...control}
              name="subject"
              defaultValue=""
              placeholder={copy.fields.subject.placeholder}
              options={SUBJECT_OPTIONS}
            />
          )}
        </FormField>

        <FormField {...fieldProps('message')} className="md:col-span-2">
          {(control) => (
            <Textarea {...control} name="message" placeholder={copy.fields.message.placeholder} />
          )}
        </FormField>
      </div>

      <HoneypotField id="contact-website" label={copy.honeypotLabel} />

      <div className="flex flex-col items-start gap-stack">
        <Button
          type="submit"
          aria-disabled={pending || undefined}
          // `<Button>` lets clicks pass through an aria-disabled button. Not
          // here: a second click would land on the page behind it and take
          // focus off the button. It is kept, and `inFlight` ignores it.
          // The ring is white, as every other control's here: the global
          // blue is 1.84:1 on this ground.
          className="group focus-visible:outline-white aria-disabled:pointer-events-auto aria-disabled:cursor-progress"
        >
          {pending ? (
            <>
              <LoaderCircle
                className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
                focusable="false"
              />
              {copy.pending}
            </>
          ) : (
            <>
              {copy.submit}
              <ArrowGlyph />
            </>
          )}
        </Button>

        <FormStatus
          message={status}
          announcement={announcement}
          className="w-full empty:-mt-stack"
        />
      </div>
    </form>
  );
}
