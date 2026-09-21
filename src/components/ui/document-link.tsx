import { cva, type VariantProps } from 'class-variance-authority';
import { ExternalLink } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatFileSize } from '@/lib/utils/format-file-size';

/**
 * A link to an investor document — used on every page under `/investors/`.
 *
 * The documents are PDFs in Azure Blob Storage. They are **linked, not
 * proxied**: the href is the blob's absolute URL and the browser handles it.
 * docs/asset-inventory.md §8.
 *
 * The accessible name is the whole of it — *"Annual Return FY 2024-25, PDF,
 * 2.4 MB, opens in a new tab"*. Sighted users read the type and size from the
 * meta line; without the `sr-only` span a screen-reader user would hear only
 * the title, follow the link, and land in a 40MB download with no warning.
 * The visible meta is `aria-hidden` so it is not announced twice.
 *
 * **`ground` was added 2026-09-21** for the business pages' "Product
 * Downloads" block, which sits on the black dot ground. Same link, the dark
 * ramp: the hairline, the title and the meta each swap to their on-dark
 * token, and the hover takes the footer's `brand-red-bright` rather than
 * paper's `accent-hover`, which is the red the footer already found too dim
 * on black. Paper stays the default because every investor page is paper.
 */
const documentLink = cva(
  [
    'group flex items-start justify-between gap-4 border-b py-4',
    'transition-colors duration-(--duration-micro)',
  ],
  {
    variants: {
      ground: {
        paper: 'border-border hover:text-accent-hover',
        dark: 'border-hairline-dark hover:text-brand-red-bright',
      },
    },
    defaultVariants: { ground: 'paper' },
  },
);

const TITLE_CLASS: Record<'paper' | 'dark', string> = {
  paper: 'text-ink group-hover:text-accent-hover',
  dark: 'text-white group-hover:text-brand-red-bright',
};
const META_CLASS: Record<'paper' | 'dark', string> = {
  paper: 'text-body-soft',
  dark: 'text-on-dark-soft',
};

export interface DocumentLinkProps
  extends
    Omit<ComponentPropsWithRef<'a'>, 'children' | 'href' | 'title'>,
    VariantProps<typeof documentLink> {
  /** The document's absolute URL. Compose it with `blobUrl()`. */
  href: string;
  title: string;
  /** Shown verbatim, e.g. `"PDF"`. */
  fileType?: string;
  /** Size in bytes. Omitted when the backend does not report one. */
  fileSize?: number;
}

export function DocumentLink({
  href,
  title,
  fileType = 'PDF',
  fileSize,
  ground,
  className,
  ...props
}: DocumentLinkProps) {
  const size = fileSize === undefined ? '' : formatFileSize(fileSize);
  const meta = [fileType, size].filter((part) => part !== '');
  const g = ground ?? 'paper';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(documentLink({ ground }), className)}
      {...props}
    >
      <span className="flex flex-col gap-1">
        <span className={cn('text-h3', TITLE_CLASS[g])}>{title}</span>

        {meta.length > 0 && (
          <span className={cn('text-body-sm', META_CLASS[g])} aria-hidden="true">
            {meta.join(' · ')}
          </span>
        )}

        <span className="sr-only">
          {meta.length > 0 && `, ${meta.join(', ')}`}, opens in a new tab
        </span>
      </span>

      <ExternalLink className="mt-1 size-5 shrink-0" aria-hidden="true" focusable="false" />
    </a>
  );
}
