import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArticleCard } from '@/components/blog/article-card';
import { authors, getAuthorById } from '@/data/authors';
import { articles } from '@/data/articles';
import type { Metadata } from 'next';

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  const author = getAuthorById(id);

  if (!author) {
    return {
      title: 'Author Not Found',
    };
  }

  return {
    title: `${author.name} - Author Profile`,
    description: author.bio,
    alternates: { canonical: `/author/${author.id}` },
  };
}

export function generateStaticParams() {
  return authors.map((author) => ({ id: author.id }));
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const author = getAuthorById(id);

  if (!author) {
    notFound();
  }

  const authorArticles = articles.filter((article) => article.author.id === author.id);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Author Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to Home
          </Link>
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-100 text-4xl font-bold dark:bg-zinc-800 md:h-40 md:w-40 md:text-5xl">
              {author.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="mb-4 text-4xl font-bold">{author.name}</h1>
              <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
                {author.bio}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-2">
                {author.twitter && (
                  <a
                    href={`https://twitter.com/${author.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                    @{author.twitter}
                  </a>
                )}
                {author.github && (
                  <a
                    href={`https://github.com/${author.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {author.github}
                  </a>
                )}
                {author.linkedin && (
                  <a
                    href={`https://linkedin.com/${author.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Stats */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">{authorArticles.length}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Articles Published
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">
                {authorArticles.reduce((acc, article) => acc + article.readingTime, 0)}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Total Reading Minutes
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">
                {new Set(authorArticles.flatMap(a => a.tags)).size}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Topics Covered
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles */}
        <div>
          <h2 className="mb-8 text-3xl font-bold">Articles by {author.name}</h2>
          {authorArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {authorArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center p-12">
                <p className="text-zinc-500 dark:text-zinc-400">
                  No articles published yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
