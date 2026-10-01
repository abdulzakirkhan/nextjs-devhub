export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: Author;
  publishedDate: string;
  updatedDate?: string;
  readingTime: number;
  featured: boolean;
  coverImage?: string;
  tableOfContents: TOCItem[];
  faq?: FAQ[];
  relatedArticles?: string[];
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface SearchFilters {
  category?: string;
  tag?: string;
  query?: string;
}
