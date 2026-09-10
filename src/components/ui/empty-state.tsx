import { FileQuestion, type LucideIcon } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The universal fallback: shown when a repository call returns `[]`, and when
 * one fails.
 *
 * Both cases land here deliberately. A malformed backend response degrades to
 * an empty state rather than throwing — a newsroom with no items is a page
 * with a message on it, not a 500. /CLAUDE.md §6.
 *
 * The message is a prop. This primitive knows nothing about news, or
 * documents, or SAEL.
 */
export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** A lucide icon component. Decorative — the message carries the meaning. */
  icon?: LucideIcon;
  /** A recovery route, typically a `<Button>`. */
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FileQuestion,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-stack py-section-y-tight text-center',
        className,
      )}
      {...props}
    >
      <Icon className="size-10 text-inert" aria-hidden="true" focusable="false" />
      <p className="text-h3 text-ink">{title}</p>
      {description !== undefined && description !== null && (
        <p className="max-w-(--measure) text-body text-body-soft">{description}</p>
      )}
      {action}
    </div>
  );
}
