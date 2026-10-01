import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Article } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: ArticleCardData;
  featured?: boolean;
}

export type ArticleCardData = Pick<
  Article,
  'id' | 'slug' | 'title' | 'description' | 'category' | 'publishedDate' | 'readingTime'
>;

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg dark:hover:border-zinc-700">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{article.category}</Badge>
            {featured && <Badge variant="default">Featured</Badge>}
          </div>
          <h3
            className={`font-semibold leading-tight hover:text-zinc-600 dark:hover:text-zinc-400 ${
              featured ? 'text-2xl' : 'text-xl'
            }`}
          >
            {article.title}
          </h3>
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {article.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(article.publishedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{article.readingTime} min read</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
