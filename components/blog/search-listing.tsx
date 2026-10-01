'use client';

import { useSearchParams } from 'next/navigation';
import { ArticleCard, type ArticleCardData } from '@/components/blog/article-card';
import { BASE_PATH } from '@/lib/constants';

interface SearchableArticle extends ArticleCardData {
  categoryName: string;
  tags: string[];
}

interface SearchListingProps {
  articles: SearchableArticle[];
}

export function SearchListing({ articles }: SearchListingProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const normalizedQuery = query.toLowerCase();
  const results = normalizedQuery
    ? articles.filter((article) =>
        [article.title, article.description, article.category, article.categoryName, ...article.tags]
          .some((field) => field.toLowerCase().includes(normalizedQuery))
      )
    : [];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">Search</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Find articles on Next.js, React, TypeScript, and more.
            </p>
          </div>

          <div className="mb-8">
            <form action={`${BASE_PATH}/search`} method="get" role="search" className="flex gap-2">
              <input
                type="search"
                aria-label="Search articles"
                name="q"
                placeholder="Search articles..."
                defaultValue={query}
                className="flex h-12 w-full rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
              />
              <button
                type="submit"
                className="h-12 rounded-md bg-zinc-900 px-6 font-medium text-white transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90"
              >
                Search
              </button>
            </form>
          </div>

          {query ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {results.length} {results.length === 1 ? 'result' : 'results'} for <q>{query}</q>
                </p>
              </div>

              {results.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {results.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-center">
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No results found</p>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      Try different keywords or browse our categories.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-center">
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Enter a search term</p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Search by title, description, category, or tags.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
