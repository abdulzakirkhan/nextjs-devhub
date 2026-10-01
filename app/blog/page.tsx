import { Suspense } from 'react';
import { BlogListing } from '@/components/blog/blog-listing';
import { articles } from '@/data/articles';
import { categories } from '@/data/categories';
import { SITE_NAME } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Browse all articles on ${SITE_NAME} covering Next.js 16, React 19, TypeScript, Supabase, and full-stack development.`,
};

export default function BlogPage() {
  const listingArticles = articles.map(({ id, slug, title, description, category, publishedDate, readingTime }) => ({
    id,
    slug,
    title,
    description,
    category,
    publishedDate,
    readingTime,
  }));

  return (
    <Suspense fallback={<div className="container mx-auto min-h-[50vh] px-4 py-12"><h1 className="text-4xl font-bold">Blog</h1></div>}>
      <BlogListing articles={listingArticles} categories={categories} />
    </Suspense>
  );
}
