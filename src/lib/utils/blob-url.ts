import { env } from '@/lib/config/env';

/**
 * Compose an absolute URL for an asset in Azure Blob Storage.
 *
 * News images, investor PDFs and team photos all live in Blob Storage and the
 * backend refers to them by path. Concatenating the base at each call site is
 * how you end up with `//` in half the URLs and a missing slash in the other
 * half, so it happens exactly here. docs/asset-inventory.md §8.
 *
 * `AZURE_BLOB_BASE_URL` is not a `NEXT_PUBLIC_` variable, so this is
 * server-only — which is fine, because every consumer composes its URLs during
 * server rendering.
 *
 * Values that are already absolute pass through untouched. That matters during
 * the mock-to-API cutover (FE-23): a fixture can carry a full URL and a real
 * API response can carry a bare path, and neither needs a special case.
 */
export function blobUrl(path: string): string {
  const trimmed = path.trim();

  if (trimmed === '') {
    throw new Error('blobUrl() was called with an empty path.');
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = env.AZURE_BLOB_BASE_URL;

  if (base === undefined) {
    throw new Error(
      `Cannot resolve the blob path "${trimmed}": AZURE_BLOB_BASE_URL is not set. ` +
        'Add it to .env.local — see .env.example.',
    );
  }

  return `${base.replace(/\/+$/, '')}/${trimmed.replace(/^\/+/, '')}`;
}

/**
 * The non-throwing form, for rendering a list where one item has a broken
 * asset reference. Returns `null` instead of taking the page down — a
 * malformed backend response degrades to an empty state. /CLAUDE.md §6.
 */
export function tryBlobUrl(path: string | null | undefined): string | null {
  if (path === null || path === undefined) return null;

  try {
    return blobUrl(path);
  } catch {
    return null;
  }
}
