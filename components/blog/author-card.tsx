import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Author } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface AuthorCardProps {
  author: Author;
  articleDate?: string;
}

export function AuthorCard({ author, articleDate }: AuthorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Author</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <span className="text-lg font-bold">
              {author.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{author.name}</h3>
            {articleDate && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Published {formatDate(articleDate)}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {author.bio}
        </p>
        <div className="flex gap-2">
          {author.twitter && (
            <a
              href={`https://twitter.com/${author.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
          )}
          {author.github && (
            <a
              href={`https://github.com/${author.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          )}
          {author.linkedin && (
            <a
              href={`https://linkedin.com/${author.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
          )}
          {author.website && (
            <a
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Website</span>
            </a>
          )}
        </div>
        <Link
          href={`/author/${author.id}`}
          className="block text-center text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          View all articles by {author.name}
        </Link>
      </CardContent>
    </Card>
  );
}
