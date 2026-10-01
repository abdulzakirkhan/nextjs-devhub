export const SITE_NAME = 'Next.js 16 & Full-Stack Developer Hub';
export const SITE_DESCRIPTION = 'A comprehensive resource for Next.js 16, React 19, TypeScript, and full-stack development. Learn production-grade patterns, best practices, and modern development techniques.';
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const SITE_URL = process.env.SITE_URL || 'https://example.invalid';
export const AUTHOR_NAME = process.env.AUTHOR_NAME || 'Site owner (configure AUTHOR_NAME)';
export const AUTHOR_BIO = process.env.AUTHOR_BIO || 'Add the author biography in the deployment environment before publishing.';
export const AUTHOR_EMAIL = process.env.CONTACT_EMAIL || '';

export const SOCIAL_LINKS = {
  twitter: process.env.SOCIAL_X_URL || '',
  github: process.env.SOCIAL_GITHUB_URL || '',
  linkedin: process.env.SOCIAL_LINKEDIN_URL || '',
  youtube: process.env.SOCIAL_YOUTUBE_URL || '',
};

export const NAVIGATION_CATEGORIES = [
  { name: 'Next.js', slug: 'nextjs' },
  { name: 'Errors & Fixes', slug: 'errors-debugging' },
  { name: 'Performance', slug: 'performance' },
  { name: 'Full Stack', slug: 'fullstack' },
  { name: 'Server Actions', slug: 'server-actions' },
  { name: 'UI Engineering', slug: 'ui' },
  { name: 'Security', slug: 'security' },
  { name: 'AI', slug: 'ai' },
  { name: 'Deployment', slug: 'deployment' },
];

export const READING_TIME_WORDS_PER_MINUTE = 200;
