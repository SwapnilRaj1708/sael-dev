import { Fragment, type ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * One run of a paragraph: plain text, or text the source sets in bold.
 *
 * Structured rather than HTML on purpose. Legal text is transcribed, not
 * written, and a string of markup would need sanitising and would let a stray
 * tag change what a sentence says. A run is either what the source printed
 * plainly or what it printed in `<strong>` — nothing else can be expressed,
 * so nothing else can creep in.
 */
export type NoticeRun = string | { readonly strong: string };

/** A paragraph, as the runs it is made of — in source order, spacing kept. */
export type NoticeParagraph = readonly NoticeRun[];

export interface NoticeTextProps extends ComponentPropsWithRef<'div'> {
  paragraphs: readonly NoticeParagraph[];
}

/**
 * Regulatory text, set for reading at length: a disclaimer, a notice.
 *
 * **Rendered exactly as given.** No run is trimmed, cased or joined here —
 * the source's own spacing inside a paragraph (including the odd space before
 * a closing parenthesis) is part of the text, and the ALL-CAPS paragraphs are
 * capitals in the data, not a `text-transform`, so what is copied from the
 * page is what the company published.
 *
 * Paragraphs are keyed by position. They are a fixed transcription that never
 * reorders, so the index is a stable identity here in a way it is not for
 * backend rows.
 *
 * Dark ground only, like every surface it is used on: plain runs take
 * `text-body-on-dark` and bold runs full white, so emphasis reads through
 * weight *and* contrast rather than weight alone.
 *
 * A Server Component with no state; it is also rendered inside the consent
 * dialog, which is client, and is equally at home there.
 */
export function NoticeText({ paragraphs, className, ...props }: NoticeTextProps) {
  return (
    <div
      className={cn(
        'flex max-w-(--measure) flex-col gap-stack text-body-sm text-pretty text-body-on-dark',
        className,
      )}
      {...props}
    >
      {paragraphs.map((runs, paragraph) => (
        <p key={paragraph}>
          {runs.map((run, index) => (
            <Fragment key={index}>
              {typeof run === 'string' ? (
                run
              ) : (
                <strong className="font-bold text-white">{run.strong}</strong>
              )}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
