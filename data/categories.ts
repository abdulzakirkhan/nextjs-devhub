import { Category } from '@/types/blog';

export const categories: Category[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    slug: 'nextjs',
    description: 'Next.js App Router, architecture, and advanced patterns',
    count: 2,
  },
  {
    id: 'errors-debugging',
    name: 'Errors & Debugging',
    slug: 'errors-debugging',
    description: 'Practical fixes for common Next.js, React, and Tailwind CSS problems',
    count: 15,
  },
  {
    id: 'performance',
    name: 'Performance',
    slug: 'performance',
    description: 'Optimization, caching, and Core Web Vitals',
    count: 2,
  },
  {
    id: 'fullstack',
    name: 'Full Stack',
    slug: 'fullstack',
    description: 'Next.js with Supabase, databases, and backend integration',
    count: 2,
  },
  {
    id: 'server-actions',
    name: 'Server Actions',
    slug: 'server-actions',
    description: 'Server Actions, validation, and security',
    count: 2,
  },
  {
    id: 'ui',
    name: 'UI Engineering',
    slug: 'ui',
    description: 'Tailwind CSS, Shadcn UI, and modern dashboards',
    count: 2,
  },
  {
    id: 'security',
    name: 'Security',
    slug: 'security',
    description: 'Security best practices and production hardening',
    count: 1,
  },
  {
    id: 'ai',
    name: 'AI Development',
    slug: 'ai',
    description: 'Building AI applications with Next.js',
    count: 1,
  },
  {
    id: 'deployment',
    name: 'Deployment',
    slug: 'deployment',
    description: 'Production deployment, CI/CD, and DevOps',
    count: 1,
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((cat) => cat.slug === slug);
};
