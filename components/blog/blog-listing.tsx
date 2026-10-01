'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArticleCard, type ArticleCardData } from '@/components/blog/article-card';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/blog';

interface BlogListingProps {
  articles: ArticleCardData[];
  categories: Category[];
}

export function BlogListing({ articles, categories }: BlogListingProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || undefined;
  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category === selectedCategory)
    : articles;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Blog</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Explore our collection of tutorials and troubleshooting guides for modern web development.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Button variant={!selectedCategory ? 'default' : 'outline'} size="sm" asChild>
            <Link href="/blog">All</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <Link href={`/blog?category=${encodeURIComponent(category.slug)}`}>
                {category.name}
              </Link>
            </Button>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing {filteredArticles.length}{' '}
            {filteredArticles.length === 1 ? 'article' : 'articles'}
            {selectedCategory && ` in ${categories.find((category) => category.slug === selectedCategory)?.name}`}
          </p>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-zinc-500 dark:text-zinc-400">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
