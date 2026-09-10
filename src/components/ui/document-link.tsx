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
 */
export interface DocumentLinkProps extends Omit<
  ComponentPropsWithRef<'a'>,
  'children' | 'href' | 'title'
> {
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
  className,
  ...props
}: DocumentLinkProps) {
  const size = fileSize === undefined ? '' : formatFileSize(fileSize);
  const meta = [fileType, size].filter((part) => part !== '');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-start justify-between gap-4 border-b border-border py-4',
        'transition-colors duration-(--duration-micro)',
        'hover:text-accent-hover',
        className,
      )}
      {...props}
    >
      <span className="flex flex-col gap-1">
        <span className="text-h3 text-ink group-hover:text-accent-hover">{title}</span>

        {meta.length > 0 && (
          <span className="text-body-sm text-body-soft" aria-hidden="true">
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
