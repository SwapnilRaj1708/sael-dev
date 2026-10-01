import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsArticlePage } from '@/app/newsroom/_lib/article-page';
import { articleMetadata, loadArticleSlugs, loadNewsArticle } from '@/app/newsroom/_lib/news';

const CATEGORY = 'press-release';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Every article is built at build time, and a slug that is not one is a 404
 * rather than a render on demand: on-demand pages would be a runtime cache,
 * which /CLAUDE.md §7 rules out. No `revalidate`, for the same reason.
 */
export const dynamicParams = false;

export function generateStaticParams(): Promise<{ slug: string }[]> {
  return loadArticleSlugs(CATEGORY);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await loadNewsArticle(CATEGORY, (await params).slug);
  return article === null ? {} : articleMetadata(article);
}

/** One press release, at its legacy URL — slug verbatim. */
export default async function PressReleaseArticlePage({ params }: PageProps) {
  const article = await loadNewsArticle(CATEGORY, (await params).slug);
  if (article === null) notFound();

  return <NewsArticlePage article={article} />;
}
