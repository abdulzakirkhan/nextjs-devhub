import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { ArticleContent } from '@/components/blog/article-content';
import { AuthorCard } from '@/components/blog/author-card';
import { SocialShare } from '@/components/blog/social-share';
import { ArticleCard } from '@/components/blog/article-card';
import { articles, getArticleBySlug, getRelatedArticles } from '@/data/articles';
import { getCategoryBySlug } from '@/data/categories';
import { formatDate } from '@/lib/utils';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/article/${article.slug}` },
    keywords: [...article.tags, article.category, 'Next.js', 'React', 'TypeScript'],
    authors: [{ name: article.author.name }],
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/article/${article.slug}`,
      title: article.title,
      description: article.description,
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate || article.publishedDate,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: 'summary',
      title: article.title,
      description: article.description,
    },
  };
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getCategoryBySlug(article.category);
  const relatedArticles = getRelatedArticles(article.id);
  const articleUrl = `${SITE_URL}/article/${article.slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate || article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: `${SITE_URL}/author/${article.author.id}`,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      ...(category ? [{ '@type': 'ListItem', position: 3, name: category.name, item: `${SITE_URL}/category/${category.slug}` }] : []),
      { '@type': 'ListItem', position: category ? 4 : 3, name: article.title, item: articleUrl },
    ],
  };
  const serializeSchema = (schema: typeof articleSchema | typeof breadcrumbSchema) =>
    JSON.stringify(schema).replace(/</g, '\\u003c');

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4" />
          {category && (
            <>
              <Link
                href={`/category/${category.slug}`}
                className="hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                {category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-zinc-900 dark:text-zinc-50">{article.title}</span>
        </div>

        <details className="mb-8 rounded-md border border-zinc-200 p-4 dark:border-zinc-800 lg:hidden">
          <summary className="cursor-pointer font-semibold">Table of contents</summary>
          <nav aria-label="Table of contents" className="mt-3 space-y-2">
            {article.tableOfContents.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="block text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
                {item.title}
              </a>
            ))}
          </nav>
        </details>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Sidebar - TOC */}
          <aside className="hidden lg:col-span-3 lg:block">
            <TableOfContents items={article.tableOfContents} />
          </aside>

          {/* Main Content */}
          <article className="min-w-0 lg:col-span-6">
            {/* Article Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                {category && <Badge variant="secondary">{category.name}</Badge>}
                {article.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                {article.title}
              </h1>
              <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
                {article.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <span className="text-xs font-bold">
                      {article.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span>{article.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.publishedDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readingTime} min read</span>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Article Content */}
            <ArticleContent content={article.content} />

            {/* FAQ Section */}
            {article.faq && article.faq.length > 0 && (
              <>
                <Separator className="my-8" />
                <div>
                  <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {article.faq.map((faq) => (
                      <div key={faq.question} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="mb-2 font-semibold">{faq.question}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator className="my-8" />

            {/* Social Share */}
            <div>
              <h3 className="mb-4 font-semibold">Share this article</h3>
              <SocialShare url={articleUrl} title={article.title} />
            </div>

            <Separator className="my-8" />

            {/* Back to Blog */}
            <Button variant="outline" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </article>

          {/* Right Sidebar */}
          <aside className="space-y-6 lg:col-span-3">
            <AuthorCard author={article.author} articleDate={article.publishedDate} />

            {/* Contact */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-2 font-semibold">Contact</h3>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                See the current contact options for questions or corrections.
              </p>
              <Button className="w-full" asChild>
                <Link href="/contact">Contact page</Link>
              </Button>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div>
                <h3 className="mb-4 font-semibold">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/article/${related.slug}`}
                      className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      <h4 className="mb-2 line-clamp-2 font-semibold text-sm">
                        {related.title}
                      </h4>
                      <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                        {related.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* More Articles Section */}
        {relatedArticles.length > 0 && (
          <>
            <Separator className="my-16" />
            <div>
              <h2 className="mb-8 text-3xl font-bold">More Articles</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
