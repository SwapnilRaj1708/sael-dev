import { Card } from '@/components/ui/card';
import { JumpLinks } from '@/components/ui/jump-links';

export interface ContactField {
  /** The label, verbatim, colon included — "Email ID:". */
  label: string;
  /** The value, verbatim. */
  value: string;
  /** `email` renders a `mailto:` link, `tel` a `tel:` link, `text` plain. */
  kind: 'text' | 'email' | 'tel';
}

export interface ContactBlock {
  /** The block's anchor — the legacy tab id, `investorContact`. */
  id: string;
  /** Verbatim — "Registered Office". */
  heading: string;
  /** A line before the details, verbatim, or `null`. */
  intro: string | null;
  fields: readonly ContactField[];
}

export interface ContactBlocksProps {
  blocks: readonly ContactBlock[];
  /** The jump row's accessible name — functional copy, "On this page". */
  jumpLabel: string;
}

/** `tel:` takes digits only — the footer's rule, so the two agree. */
function telHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, '')}`;
}

/**
 * Contact details in blocks — an address, a company number, an officer —
 * each under its own `<h2>`, as a description list: the label is a `<dt>`,
 * the value a `<dd>`, so a screen reader pairs them.
 *
 * **Every block on the page at once**, where the legacy Investor Contact page
 * put each behind a tab: three short blocks are no reason to hide two. The
 * tab row survives as the investor pages' row of jump links, and each block
 * keeps its legacy tab id as its anchor.
 *
 * Emails are `mailto:` links and phone numbers `tel:` links; the text shown
 * is the value as published. Outlined cards, one per block, stacked on a
 * phone and three across from `xl`, where the addresses still wrap in a
 * readable measure.
 *
 * Not interactive beyond its links, so the cards take no hover light.
 * A Server Component.
 */
export function ContactBlocks({ blocks, jumpLabel }: ContactBlocksProps) {
  return (
    <div className="flex flex-col gap-flow">
      {blocks.length >= 2 && (
        <JumpLinks
          label={jumpLabel}
          links={blocks.map((block) => ({ label: block.heading, href: `#${block.id}` }))}
        />
      )}

      <div className="grid grid-cols-1 gap-gap-grid xl:grid-cols-3">
        {blocks.map((block) => (
          <Card
            key={block.id}
            as="section"
            id={block.id}
            aria-labelledby={`${block.id}-heading`}
            shape="outlined"
            ground="dark"
            inset="none"
            hoverEffect={false}
            className="flex-col gap-stack rounded-(--radius-card)"
          >
            <h2 id={`${block.id}-heading`} className="text-h3 text-white">
              {block.heading}
            </h2>

            {block.intro !== null && (
              <p className="text-body-sm text-body-on-dark">{block.intro}</p>
            )}

            <dl className="flex flex-col gap-tight text-body-sm">
              {block.fields.map((field) => (
                <div key={field.label} className="flex flex-col">
                  <dt className="font-bold text-white">{field.label}</dt>
                  <dd className="text-body-on-dark">
                    {field.kind === 'text' ? (
                      field.value
                    ) : (
                      <a
                        href={
                          field.kind === 'email' ? `mailto:${field.value}` : telHref(field.value)
                        }
                        className="break-words underline decoration-hairline-dark underline-offset-4 transition-colors duration-(--duration-micro) hover:text-white hover:decoration-current focus-visible:outline-white"
                      >
                        {field.value}
                      </a>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}
