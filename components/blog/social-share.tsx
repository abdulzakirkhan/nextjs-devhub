'use client';

import * as React from 'react';
import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [copyMessage, setCopyMessage] = React.useState('');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyMessage('Link copied');
    } catch {
      setCopyMessage('Unable to copy link');
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
          Share on X
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        <Link2 className="mr-2 h-4 w-4" />
        Copy Link
      </Button>
      <span className="sr-only" aria-live="polite">{copyMessage}</span>
    </div>
  );
}
