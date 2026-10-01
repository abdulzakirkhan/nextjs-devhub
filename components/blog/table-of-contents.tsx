'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { TOCItem } from '@/types/blog';

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80px 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="sticky top-20 hidden lg:block">
      <h4 className="mb-4 font-semibold">Table of Contents</h4>
      <nav className="space-y-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={cn(
              'block text-sm transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
              activeId === item.id
                ? 'font-medium text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-600 dark:text-zinc-400',
              item.level === 2 && 'pl-0',
              item.level === 3 && 'pl-4',
              item.level === 4 && 'pl-8'
            )}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
