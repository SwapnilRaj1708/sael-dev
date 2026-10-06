import { HONEYPOT_FIELD } from '@/lib/forms/contract';

export interface HoneypotFieldProps {
  /** Unique on the page — the form's own prefix, say. */
  id: string;
  /** Read only if the page's CSS fails to load: "Leave this field empty". */
  label: string;
}

/**
 * A field no person fills in, for catching bots that fill in every field.
 * Any form posting to `/api/forms/[form]/` takes one; the route acknowledges
 * a submission that fills it as a success and drops it.
 *
 * Kept out of everyone's way three ways: off-screen (`sr-only`, so it is
 * still in the layout a bot reads, where `display: none` is a tell), out of
 * the accessibility tree (`aria-hidden`), and out of the tab order
 * (`tabIndex={-1}`). `autoComplete="off"` keeps a browser from filling it for
 * a person, which would cost that person their message without a word —
 * see `HONEYPOT_FIELD` on why the name is safe from autofill too.
 *
 * Uncontrolled: the form reads it from the submitted `FormData`.
 */
export function HoneypotField({ id, label }: HoneypotFieldProps) {
  return (
    <div aria-hidden="true" className="sr-only">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
