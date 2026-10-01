import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/blog/article-card';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getArticlesByCategory } from '@/data/articles';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} Articles`,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.id);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">{category.name}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {category.description}
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              No articles found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
