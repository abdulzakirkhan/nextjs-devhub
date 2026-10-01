import Markdown from 'react-markdown';
import Link from 'next/link';
import type { Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

interface ArticleContentProps {
  content: string;
}

const markdownComponents: Components = {
  a: ({ node: _node, href, children, ...props }) => {
    if (href?.startsWith('/') && !href.startsWith('//')) {
      return <Link href={href} {...props}>{children}</Link>;
    }

    return <a href={href} {...props}>{children}</a>;
  },
};

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-content">
      <Markdown components={markdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeHighlight]}>
        {content}
      </Markdown>
    </div>
  );
}