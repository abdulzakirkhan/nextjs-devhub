import { Suspense } from 'react';
import { SearchListing } from '@/components/blog/search-listing';
import { articles } from '@/data/articles';
import { getCategoryBySlug } from '@/data/categories';
import { SITE_NAME } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: `Search articles on ${SITE_NAME} covering Next.js, React, TypeScript, and full-stack development.`,
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  const searchableArticles = articles.map(({ id, slug, title, description, category, tags, publishedDate, readingTime }) => ({
    id,
    slug,
    title,
    description,
    category,
    categoryName: getCategoryBySlug(category)?.name ?? category,
    tags,
    publishedDate,
    readingTime,
  }));

  return (
    <Suspense fallback={<div className="container mx-auto min-h-[50vh] px-4 py-12"><h1 className="text-4xl font-bold">Search</h1></div>}>
      <SearchListing articles={searchableArticles} />
    </Suspense>
  );
}
