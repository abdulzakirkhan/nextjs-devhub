import { Author } from '@/types/blog';
import { AUTHOR_BIO, AUTHOR_NAME } from '@/lib/constants';

export const authors: Author[] = [
  {
    id: 'site-author',
    name: AUTHOR_NAME,
    bio: AUTHOR_BIO,
    avatar: '',
    website: process.env.AUTHOR_WEBSITE || undefined,
    twitter: process.env.AUTHOR_TWITTER || undefined,
    github: process.env.AUTHOR_GITHUB || undefined,
    linkedin: process.env.AUTHOR_LINKEDIN || undefined,
  },
];

export const getAuthorById = (id: string): Author | undefined => {
  return authors.find((author) => author.id === id);
};
