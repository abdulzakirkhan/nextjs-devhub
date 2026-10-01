import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Shield, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/blog/article-card';
import { getFeaturedArticles, getArticlesByCategory, articles } from '@/data/articles';
import { categories } from '@/data/categories';

export default function Home() {
  const featuredArticles = getFeaturedArticles().slice(0, 3);
  const recentArticles = articles.filter((a) => !a.featured).slice(0, 6);
  const troubleshootingArticles = getArticlesByCategory('errors-debugging').slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-green-500" />
              Updated for Next.js 16 & React 19
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Master Modern Full-Stack Development
            </h1>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
              Practical guides to Next.js 16, React 19, TypeScript, Supabase,
              and full-stack application architecture.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/blog">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">About the Platform</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Comprehensive Guides</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                In-depth tutorials covering modern development patterns
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Performance Focus</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Learn optimization techniques for production applications
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Security Best Practices</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Build secure applications with proven patterns
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Real-World Examples</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Examples that explain security, performance, and design trade-offs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Articles</h2>
            <Button variant="ghost" asChild>
              <Link href="/blog">View All</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
          </div>
        </div>
      </section>

      {troubleshootingArticles.length > 0 && (
        <section className="border-t border-zinc-200 py-16 dark:border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-3xl font-bold">Common Errors &amp; Fixes</h2>
              <Button variant="ghost" asChild>
                <Link href="/category/errors-debugging">View All</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {troubleshootingArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <h3 className="mb-2 font-semibold">{category.name}</h3>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {category.description}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  {getArticlesByCategory(category.id).length}{' '}
                  {getArticlesByCategory(category.id).length === 1 ? 'article' : 'articles'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Recent Articles</h2>
            <Button variant="ghost" asChild>
              <Link href="/blog">View All</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-200 bg-zinc-900 py-16 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Keep Exploring
            </h2>
            <p className="mb-8 text-zinc-400">
              Browse practical guides across Next.js, React, full-stack development,
              performance, and security.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/blog">Browse All Articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
