import { formEndpoint, formResponseSchema, type FormResponse } from './contract';
import type { FormId } from './registry';

/**
 * Posts a form to its route and returns the outcome as a `FormResponse`,
 * whatever came back — this never throws. For the browser.
 *
 * A response that is not the handler's own JSON is read from its status: a
 * `429` or `413` from Nginx in front of the handler is an HTML page, and still
 * means "too many" or "too large". Anything else that cannot be read, and a
 * request that never reached the server, is `unavailable`.
 */
export async function submitForm(
  form: FormId,
  payload: Record<string, unknown>,
): Promise<FormResponse> {
  let response: Response;

  try {
    response = await fetch(formEndpoint(form), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: 'unavailable' };
  }

  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    // Not JSON; the status decides below.
  }

  const body = formResponseSchema.safeParse(json);
  if (body.success) return body.data;

  if (response.status === 429) return { ok: false, error: 'rate-limited' };
  if (response.status === 413) return { ok: false, error: 'too-large' };
  return { ok: false, error: 'unavailable' };
}
