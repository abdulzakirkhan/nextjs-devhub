import { Article } from '@/types/blog';
import { authors } from './authors';
import { getCategoryBySlug } from './categories';
import { loadArticleContent } from '@/lib/load-articles';

const articleContent: Record<string, string> = {
  'mastering-nextjs-16-app-router': loadArticleContent('mastering-nextjs-16-app-router'),
  'nextjs-16-routing-explained': loadArticleContent('nextjs-16-routing-explained'),
  'understanding-nextjs-16-cache': loadArticleContent('understanding-nextjs-16-cache'),
  'optimizing-nextjs-core-web-vitals': loadArticleContent('optimizing-nextjs-core-web-vitals'),
  'building-saas-nextjs-supabase': loadArticleContent('building-saas-nextjs-supabase'),
  'secure-authentication-nextjs-supabase': loadArticleContent('secure-authentication-nextjs-supabase'),
  'nextjs-server-actions-zod': loadArticleContent('nextjs-server-actions-zod'),
  'securing-server-actions-production': loadArticleContent('securing-server-actions-production'),
  'building-modern-dashboards': loadArticleContent('building-modern-dashboards'),
  'tailwind-css-v4-migration': loadArticleContent('tailwind-css-v4-migration'),
  'building-ai-applications-nextjs': loadArticleContent('building-ai-applications-nextjs'),
  'deploying-nextjs-production': loadArticleContent('deploying-nextjs-production'),
};

const troubleshootingTableOfContents: Article['tableOfContents'] = [
  { id: 'introduction', title: 'Introduction', level: 1 },
  { id: 'what-you-see', title: 'What You See', level: 2 },
  { id: 'why-it-happens', title: 'Why It Happens', level: 2 },
  { id: 'minimal-reproduction', title: 'Minimal Reproduction', level: 2 },
  { id: 'fix', title: 'Fix', level: 2 },
  { id: 'step-by-step-fixes', title: 'Step-by-Step Fixes', level: 2 },
  { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
  { id: 'how-to-prevent-it', title: 'How to Prevent It', level: 2 },
  { id: 'version-notes', title: 'Version Notes', level: 2 },
  { id: 'related-reading', title: 'Related Reading', level: 2 },
  { id: 'faq', title: 'FAQ', level: 2 },
];

interface TroubleshootingArticleInput {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  relatedArticles: string[];
}

function createTroubleshootingArticle(input: TroubleshootingArticleInput): Article {
  const content = loadArticleContent(input.slug);

  return {
    ...input,
    id: input.slug,
    content,
    category: 'errors-debugging',
    tags: [...input.tags, 'Errors', 'Debugging', 'Troubleshooting'],
    author: authors[0],
    publishedDate: '2026-10-01',
    updatedDate: '2026-10-01',
    readingTime: Math.max(5, Math.ceil(content.split(/\s+/).length / 200)),
    featured: false,
    tableOfContents: troubleshootingTableOfContents,
  };
}

const troubleshootingArticles: Article[] = [
  createTroubleshootingArticle({
    slug: 'nextjs-hydration-error',
    title: 'How to Fix Hydration Errors in Next.js',
    description: 'Trace server/client HTML mismatches in Next.js, including dates, randomness, browser APIs, invalid HTML, and third-party libraries.',
    tags: ['Next.js 16', 'Hydration', 'React 19'],
    relatedArticles: ['nextjs-use-state-server-component', 'nextjs-window-is-not-defined', 'tailwind-dark-mode-nextjs'],
  }),
  createTroubleshootingArticle({
    slug: 'nextjs-use-state-server-component',
    title: 'Fix “You’re Importing a Component That Needs useState” in Next.js',
    description: 'Understand the Next.js Server and Client Component boundary and place use client only where interactivity requires it.',
    tags: ['Next.js 16', 'React Server Components', 'use client'],
    relatedArticles: ['nextjs-hydration-error', 'nextjs-window-is-not-defined', 'nextjs-server-actions-troubleshooting'],
  }),
  createTroubleshootingArticle({
    slug: 'nextjs-window-is-not-defined',
    title: 'How to Fix “window is not defined” in Next.js',
    description: 'Fix server-rendering errors caused by window, document, localStorage, and browser-only third-party packages in Next.js.',
    tags: ['Next.js 16', 'SSR', 'Browser APIs'],
    relatedArticles: ['nextjs-use-state-server-component', 'nextjs-hydration-error', 'nextjs-image-troubleshooting'],
  }),
  createTroubleshootingArticle({
    slug: 'nextjs-server-actions-troubleshooting',
    title: 'Next.js Server Actions Not Working: Common Errors and Fixes',
    description: 'Diagnose Server Action boundaries, form signatures, serializable state, validation, authorization, redirects, and cache revalidation.',
    tags: ['Next.js 16', 'Server Actions', 'React 19'],
    relatedArticles: ['nextjs-server-actions-zod', 'securing-server-actions-production', 'nextjs-async-params-errors'],
  }),
  createTroubleshootingArticle({
    slug: 'nextjs-async-params-errors',
    title: 'How to Fix Next.js Dynamic Route and Async Params Errors',
    description: 'Fix Promise-based params and searchParams typing in Next.js 16 dynamic routes, pages, and metadata functions.',
    tags: ['Next.js 16', 'App Router', 'Dynamic Routes', 'TypeScript'],
    relatedArticles: ['nextjs-16-routing-explained', 'nextjs-server-actions-troubleshooting', 'nextjs-hydration-error'],
  }),
  createTroubleshootingArticle({
    slug: 'react-too-many-rerenders',
    title: 'How to Fix “Too Many Re-renders” in React',
    description: 'Find render-time state updates, immediately invoked handlers, and effects that repeatedly schedule React renders.',
    tags: ['React 19', 'Rendering', 'State'],
    relatedArticles: ['react-maximum-update-depth', 'react-state-not-updating', 'react-useeffect-infinite-loop'],
  }),
  createTroubleshootingArticle({
    slug: 'react-maximum-update-depth',
    title: 'How to Fix “Maximum Update Depth Exceeded” in React',
    description: 'Break React update cycles caused by effects, unstable dependencies, callback refs, or state changes during rendering.',
    tags: ['React 19', 'useEffect', 'Rendering'],
    relatedArticles: ['react-useeffect-infinite-loop', 'react-too-many-rerenders', 'react-state-not-updating'],
  }),
  createTroubleshootingArticle({
    slug: 'react-useeffect-infinite-loop',
    title: 'React useEffect Infinite Loop: Causes and Fixes',
    description: 'Debug effect dependency loops, unstable objects and functions, missing dependencies, and unnecessary state synchronization.',
    tags: ['React 19', 'useEffect', 'Hooks'],
    relatedArticles: ['react-maximum-update-depth', 'react-too-many-rerenders', 'react-state-not-updating'],
  }),
  createTroubleshootingArticle({
    slug: 'react-state-not-updating',
    title: 'React State Is Not Updating Immediately: Why and What to Do',
    description: 'Understand state snapshots, batching, queued updater functions, stale closures, and immutable React state updates.',
    tags: ['React 19', 'State', 'Batching'],
    relatedArticles: ['react-too-many-rerenders', 'react-controlled-uncontrolled-inputs', 'react-maximum-update-depth'],
  }),
  createTroubleshootingArticle({
    slug: 'react-controlled-uncontrolled-inputs',
    title: 'React Controlled vs Uncontrolled Input Warnings: How to Fix Them',
    description: 'Fix React input warnings by choosing a stable controlled or uncontrolled value for text fields, checkboxes, and selects.',
    tags: ['React 19', 'Forms', 'Inputs'],
    relatedArticles: ['react-state-not-updating', 'nextjs-server-actions-zod', 'nextjs-server-actions-troubleshooting'],
  }),
  createTroubleshootingArticle({
    slug: 'tailwind-classes-not-working',
    title: 'Tailwind CSS Classes Not Working: A Troubleshooting Guide',
    description: 'Diagnose missing Tailwind v4 utilities by checking the PostCSS pipeline, source detection, dynamic classes, and CSS cascade.',
    tags: ['Tailwind CSS v4', 'Source Detection', 'CSS'],
    relatedArticles: ['tailwind-v4-nextjs-troubleshooting', 'tailwind-dynamic-classes', 'tailwind-mobile-overflow'],
  }),
  createTroubleshootingArticle({
    slug: 'tailwind-v4-nextjs-troubleshooting',
    title: 'Tailwind CSS v4 Not Working in Next.js: Setup and Fixes',
    description: 'Verify the current Tailwind v4 Next.js setup using @tailwindcss/postcss, the CSS import, and v4 source detection.',
    tags: ['Tailwind CSS v4', 'Next.js 16', 'PostCSS'],
    relatedArticles: ['tailwind-classes-not-working', 'tailwind-dynamic-classes', 'tailwind-dark-mode-nextjs'],
  }),
  createTroubleshootingArticle({
    slug: 'tailwind-dynamic-classes',
    title: 'Tailwind Dynamic Classes Not Working: Use Complete Class Names',
    description: 'Fix utilities missing from builds by replacing interpolated Tailwind class fragments with complete static variants.',
    tags: ['Tailwind CSS v4', 'Dynamic Classes', 'Source Detection'],
    relatedArticles: ['tailwind-classes-not-working', 'tailwind-v4-nextjs-troubleshooting', 'tailwind-dark-mode-nextjs'],
  }),
  createTroubleshootingArticle({
    slug: 'tailwind-dark-mode-nextjs',
    title: 'Tailwind Dark Mode Not Working in Next.js: Fix the Theme Selector',
    description: 'Align Tailwind CSS v4 dark variants with Next.js theme providers, root classes, system preference, and hydration behavior.',
    tags: ['Tailwind CSS v4', 'Next.js 16', 'Dark Mode', 'Hydration'],
    relatedArticles: ['nextjs-hydration-error', 'tailwind-v4-nextjs-troubleshooting', 'tailwind-classes-not-working'],
  }),
  createTroubleshootingArticle({
    slug: 'tailwind-mobile-overflow',
    title: 'Tailwind Layout Overflow on Mobile: How to Find and Fix It',
    description: 'Trace mobile horizontal overflow to fixed widths, grid and flex min-content sizing, long code, and wide tables.',
    tags: ['Tailwind CSS v4', 'Responsive Design', 'Mobile'],
    relatedArticles: ['tailwind-classes-not-working', 'tailwind-v4-nextjs-troubleshooting', 'building-modern-dashboards'],
  }),
];

export const articles: Article[] = [
  {
    id: 'mastering-nextjs-16-app-router',
    slug: 'mastering-nextjs-16-app-router',
    title: 'Mastering Next.js 16 App Router: Production-Grade Project Structure',
    description: 'Learn how to structure a production-grade Next.js 16 application with App Router, route groups, dynamic segments, and SaaS-ready architecture patterns.',
    content: articleContent['mastering-nextjs-16-app-router'],
    category: 'nextjs',
    tags: ['Next.js 16', 'App Router', 'Architecture', 'SaaS'],
    author: authors[0],
    publishedDate: '2026-01-15',
    updatedDate: '2026-01-20',
    readingTime: 15,
    featured: true,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'understanding-app-router', title: 'Understanding App Router', level: 2 },
      { id: 'route-groups', title: 'Route Groups', level: 2 },
      { id: 'dynamic-segments', title: 'Dynamic Segments', level: 2 },
      { id: 'private-folders', title: 'Private Folders', level: 2 },
      { id: 'saas-folder-structure', title: 'SaaS Folder Structure', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'production-checklist', title: 'Production Checklist', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What is the difference between App Router and Pages Router?',
        answer: 'App Router is the newer routing system in Next.js that uses React Server Components by default, supports layouts, and provides better performance. Pages Router is the older system still supported for legacy projects.',
      },
      {
        question: 'When should I use route groups vs. folders?',
        answer: 'Use route groups when you want to organize files without affecting the URL structure. Use regular folders when you want the folder name to appear in the URL path.',
      },
      {
        question: 'How do I handle authentication in App Router?',
        answer: 'You can use middleware for route protection, or check authentication in individual routes using server components and session management.',
      },
      {
        question: 'What are private folders in Next.js?',
        answer: 'Private folders are prefixed with underscore (_) and are not included in the routing system. They are useful for organizing components, utilities, and configuration files.',
      },
      {
        question: 'How do I optimize for production deployment?',
        answer: 'Use static generation where possible, implement proper caching strategies, optimize images, configure environment variables, and set up proper error boundaries.',
      },
    ],
    relatedArticles: ['nextjs-16-routing-explained', 'optimizing-nextjs-core-web-vitals'],
  },
  {
    id: 'nextjs-16-routing-explained',
    slug: 'nextjs-16-routing-explained',
    title: 'Next.js 16 Routing Explained: Async Params, Layouts and Advanced Navigation',
    description: 'Deep dive into Next.js 16 routing capabilities including async params, nested layouts, parallel routes, and advanced navigation patterns.',
    content: articleContent['nextjs-16-routing-explained'],
    category: 'nextjs',
    tags: ['Next.js 16', 'Routing', 'Layouts', 'Navigation'],
    author: authors[0],
    publishedDate: '2026-01-18',
    readingTime: 12,
    featured: true,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'async-params', title: 'Async Params', level: 2 },
      { id: 'nested-layouts', title: 'Nested Layouts', level: 2 },
      { id: 'parallel-routes', title: 'Parallel Routes', level: 2 },
      { id: 'route-handlers', title: 'Route Handlers', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What are async params in Next.js 16?',
        answer: 'Async params allow you to asynchronously fetch data for dynamic route parameters, enabling better data fetching patterns and improved performance.',
      },
      {
        question: 'How do nested layouts work?',
        answer: 'Nested layouts allow you to wrap child routes with shared UI components. Each folder can have its own layout.tsx file that wraps its children.',
      },
      {
        question: 'What are parallel routes?',
        answer: 'Parallel routes let you render multiple pages in the same view, useful for split-screen layouts, modals, and complex UI patterns.',
      },
      {
        question: 'How do I implement route handlers?',
        answer: 'Route handlers are created by adding route.ts files in your app directory. They handle HTTP requests and can be used for API endpoints.',
      },
    ],
    relatedArticles: ['mastering-nextjs-16-app-router', 'building-saas-nextjs-supabase'],
  },
  {
    id: 'understanding-nextjs-16-cache',
    slug: 'understanding-nextjs-16-cache',
    title: 'Understanding Next.js 16 Cache System: From ISR to Modern Caching',
    description: 'Comprehensive guide to Next.js 16 caching strategies including ISR, on-demand revalidation, fetch caching, and the new cache API.',
    content: articleContent['understanding-nextjs-16-cache'],
    category: 'performance',
    tags: ['Next.js 16', 'Caching', 'ISR', 'Performance'],
    author: authors[0],
    publishedDate: '2026-01-20',
    readingTime: 14,
    featured: true,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'cache-types', title: 'Cache Types', level: 2 },
      { id: 'from-isr-to-modern-caching', title: 'From ISR to Modern Caching', level: 2 },
      { id: 'fetch-caching', title: 'Fetch Caching', level: 2 },
      { id: 'on-demand-revalidation', title: 'On-Demand Revalidation', level: 2 },
      { id: 'cache-tags', title: 'Cache Tags', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What is the difference between ISR and static generation?',
        answer: 'ISR (Incremental Static Regeneration) allows you to update static pages after build time, while static generation only builds pages at build time.',
      },
      {
        question: 'How do I implement on-demand revalidation?',
        answer: 'Use the revalidatePath or revalidateTag functions in a server action or API route to trigger revalidation of specific pages.',
      },
      {
        question: 'What are cache tags?',
        answer: 'Cache tags allow you to group cached content and revalidate multiple pages at once by tag, useful for related content updates.',
      },
      {
        question: 'How do I disable caching?',
        answer: 'Use cache: "no-store" in fetch options or export const dynamic = "force-dynamic" in your page component.',
      },
    ],
    relatedArticles: ['optimizing-nextjs-core-web-vitals', 'securing-server-actions-production'],
  },
  {
    id: 'optimizing-nextjs-core-web-vitals',
    slug: 'optimizing-nextjs-core-web-vitals',
    title: 'Optimizing Next.js Core Web Vitals: LCP, INP, and CLS',
    description: 'Investigate and improve LCP, INP, and CLS in Next.js applications using current Core Web Vitals terminology and field data.',
    content: articleContent['optimizing-nextjs-core-web-vitals'],
    category: 'performance',
    tags: ['Next.js', 'Performance', 'Core Web Vitals', 'Optimization'],
    author: authors[0],
    publishedDate: '2026-01-22',
    readingTime: 13,
    featured: false,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'largest-contentful-paint-lcp', title: 'Largest Contentful Paint (LCP)', level: 2 },
      { id: 'interaction-to-next-paint-inp', title: 'Interaction to Next Paint (INP)', level: 2 },
      { id: 'cumulative-layout-shift-cls', title: 'Cumulative Layout Shift (CLS)', level: 2 },
      { id: 'image-optimization', title: 'Image Optimization', level: 2 },
      { id: 'code-splitting', title: 'Code Splitting', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What are Core Web Vitals?',
        answer: 'Current Core Web Vitals are LCP (loading), INP (interaction responsiveness), and CLS (visual stability). INP replaced FID in March 2024.',
      },
      {
        question: 'How do I improve LCP in Next.js?',
        answer: 'Optimize images with next/image, use font optimization, implement proper caching, and reduce JavaScript bundle size.',
      },
      {
        question: 'What causes CLS and how do I fix it?',
        answer: 'CLS is caused by content shifting during load. Fix by reserving space for images and ads, using font-display: swap, and avoiding dynamic content injection.',
      },
      {
        question: 'How do I measure Core Web Vitals?',
        answer: 'Use Lighthouse, PageSpeed Insights, or the Web Vitals library to measure and track your Core Web Vitals.',
      },
    ],
    relatedArticles: ['understanding-nextjs-16-cache', 'tailwind-css-v4-migration'],
  },
  {
    id: 'building-saas-nextjs-supabase',
    slug: 'building-saas-nextjs-supabase',
    title: 'Building a SaaS Application with Next.js 16 and Supabase',
    description: 'Plan a Next.js 16 and Supabase application with authentication, database design, and Row Level Security considerations.',
    content: articleContent['building-saas-nextjs-supabase'],
    category: 'fullstack',
    tags: ['Next.js 16', 'Supabase', 'SaaS', 'PostgreSQL'],
    author: authors[0],
    publishedDate: '2026-01-25',
    readingTime: 20,
    featured: true,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'project-setup', title: 'Project Setup', level: 2 },
      { id: 'supabase-configuration', title: 'Supabase Configuration', level: 2 },
      { id: 'authentication', title: 'Authentication', level: 2 },
      { id: 'database-design', title: 'Database Design', level: 2 },
      { id: 'row-level-security', title: 'Row Level Security', level: 2 },
      { id: 'realtime-features', title: 'Realtime Features', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'production-checklist', title: 'Production Checklist', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'Why use Supabase with Next.js?',
        answer: 'Supabase provides PostgreSQL, authentication, storage, and realtime features that integrate seamlessly with Next.js server components and server actions.',
      },
      {
        question: 'How do I implement Row Level Security?',
        answer: 'RLS policies are SQL rules in PostgreSQL that restrict data access based on user authentication. Supabase makes this easy with their dashboard and SQL editor.',
      },
      {
        question: 'Can I use Supabase with edge functions?',
        answer: 'Yes, Supabase edge functions work well with Next.js edge runtime and API routes for serverless logic.',
      },
      {
        question: 'How do I handle file uploads?',
        answer: 'Use Supabase Storage with the @supabase/supabase-js client. Files are stored in buckets with access controls.',
      },
      {
        question: 'What about database migrations?',
        answer: 'Use Supabase migrations or tools like Prisma with Supabase to manage database schema changes across environments.',
      },
    ],
    relatedArticles: ['secure-authentication-nextjs-supabase', 'nextjs-server-actions-zod'],
  },
  {
    id: 'secure-authentication-nextjs-supabase',
    slug: 'secure-authentication-nextjs-supabase',
    title: 'Secure Authentication in Next.js 16 Using Supabase',
    description: 'Implement secure authentication in Next.js 16 with Supabase including social providers, session management, and security best practices.',
    content: articleContent['secure-authentication-nextjs-supabase'],
    category: 'fullstack',
    tags: ['Next.js 16', 'Supabase', 'Authentication', 'Security'],
    author: authors[0],
    publishedDate: '2026-01-28',
    readingTime: 16,
    featured: false,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'supabase-auth-setup', title: 'Supabase Auth Setup', level: 2 },
      { id: 'social-providers', title: 'Social Providers', level: 2 },
      { id: 'session-management', title: 'Session Management', level: 2 },
      { id: 'authorization-beyond-the-proxy', title: 'Authorization Beyond the Proxy', level: 2 },
      { id: 'security-best-practices', title: 'Security Best Practices', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'How do I protect routes with Supabase auth?',
        answer: 'Use Next.js middleware to check for valid sessions before allowing access to protected routes.',
      },
      {
        question: 'What authentication providers does Supabase support?',
        answer: 'Supabase supports email/password, phone, and social providers including Google, GitHub, Twitter, and more.',
      },
      {
        question: 'How do I handle session refresh?',
        answer: 'Supabase automatically handles token refresh. Use the auth state change listener to update your UI when session changes.',
      },
      {
        question: 'Is Supabase auth secure for production?',
        answer: 'Yes, Supabase auth is production-ready with built-in security features. Follow best practices for session management and RLS policies.',
      },
    ],
    relatedArticles: ['building-saas-nextjs-supabase', 'securing-server-actions-production'],
  },
  {
    id: 'nextjs-server-actions-zod',
    slug: 'nextjs-server-actions-zod',
    title: 'Next.js Server Actions with Zod Validation',
    description: 'Learn how to validate form input with Next.js Server Actions and Zod, and where authentication and authorization fit.',
    content: articleContent['nextjs-server-actions-zod'],
    category: 'server-actions',
    tags: ['Next.js 16', 'Server Actions', 'Zod', 'Validation'],
    author: authors[0],
    publishedDate: '2026-02-01',
    readingTime: 14,
    featured: true,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'server-actions-basics', title: 'Server Actions Basics', level: 2 },
      { id: 'zod-validation', title: 'Zod Validation', level: 2 },
      { id: 'error-handling', title: 'Error Handling', level: 2 },
      { id: 'form-integration', title: 'Form Integration', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What are Server Actions in Next.js?',
        answer: 'Server Actions are functions that run on the server and can be called from client components, eliminating the need for API routes for form submissions.',
      },
      {
        question: 'Why use Zod with Server Actions?',
        answer: 'Zod provides runtime type validation that works seamlessly with TypeScript, ensuring your Server Actions receive validated data.',
      },
      {
        question: 'How do I handle validation errors?',
        answer: 'Return serializable state from your Server Actions and display it with React 19 useActionState.',
      },
      {
        question: 'Can I use Server Actions with edge runtime?',
        answer: 'Some Server Actions features require Node.js runtime. Check the documentation for edge runtime compatibility.',
      },
    ],
    relatedArticles: ['securing-server-actions-production', 'building-modern-dashboards'],
  },
  {
    id: 'securing-server-actions-production',
    slug: 'securing-server-actions-production',
    title: 'Securing Server Actions in Production',
    description: 'Security best practices for Next.js Server Actions including CSRF protection, rate limiting, input validation, and authorization.',
    content: articleContent['securing-server-actions-production'],
    category: 'security',
    tags: ['Next.js 16', 'Server Actions', 'Security', 'Production'],
    author: authors[0],
    publishedDate: '2026-02-03',
    readingTime: 12,
    featured: false,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'csrf-protection', title: 'CSRF Protection', level: 2 },
      { id: 'rate-limiting', title: 'Rate Limiting', level: 2 },
      { id: 'input-validation', title: 'Input Validation', level: 2 },
      { id: 'authorization', title: 'Authorization', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'Are Server Actions secure by default?',
        answer: 'Server Actions have built-in CSRF protection, but you still need to implement proper authorization, validation, and rate limiting.',
      },
      {
        question: 'How do I implement rate limiting?',
        answer: 'Use a rate limiting library or implement one using Redis or your database to track request frequency per user or IP.',
      },
      {
        question: 'What authorization patterns should I use?',
        answer: 'Check user permissions at the start of each Server Action using session data or authentication libraries.',
      },
      {
        question: 'How do I handle sensitive data?',
        answer: 'Never log sensitive data, use environment variables for secrets, and ensure proper encryption for data at rest and in transit.',
      },
    ],
    relatedArticles: ['nextjs-server-actions-zod'],
  },
  {
    id: 'building-modern-dashboards',
    slug: 'building-modern-dashboards',
    title: 'Building Modern Dashboards with Next.js 16, Tailwind CSS and Shadcn UI',
    description: 'Create beautiful, responsive dashboards with Next.js 16, Tailwind CSS v4, and Shadcn UI components following modern design patterns.',
    content: articleContent['building-modern-dashboards'],
    category: 'ui',
    tags: ['Next.js 16', 'Tailwind CSS', 'Shadcn UI', 'Dashboards'],
    author: authors[0],
    publishedDate: '2026-02-05',
    readingTime: 18,
    featured: true,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'project-setup', title: 'Project Setup', level: 2 },
      { id: 'shadcn-ui-setup', title: 'Shadcn UI Setup', level: 2 },
      { id: 'dashboard-layout', title: 'Dashboard Layout', level: 2 },
      { id: 'data-visualization', title: 'Data Visualization', level: 2 },
      { id: 'responsive-design', title: 'Responsive Design', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What is Shadcn UI?',
        answer: 'Shadcn UI is a collection of accessible, customizable React components built with Radix UI and Tailwind CSS that you can copy into your project.',
      },
      {
        question: 'How do I customize Shadcn components?',
        answer: 'Since components are copied into your project, you can modify them directly. Use CSS variables for theming and Tailwind for styling.',
      },
      {
        question: 'What layout patterns work best for dashboards?',
        answer: 'Sidebar navigation, top header with user actions, main content area with cards, and responsive behavior for mobile devices.',
      },
      {
        question: 'How do I handle data fetching in dashboards?',
        answer: 'Use Server Components for initial data fetch, Server Actions for mutations, and React Query or SWR for client-side caching if needed.',
      },
    ],
    relatedArticles: ['tailwind-css-v4-migration', 'building-saas-nextjs-supabase'],
  },
  {
    id: 'tailwind-css-v4-migration',
    slug: 'tailwind-css-v4-migration',
    title: 'Tailwind CSS v4 Migration Guide',
    description: 'Complete guide to migrating from Tailwind CSS v3 to v4 with Next.js 16, including new features, configuration changes, and performance improvements.',
    content: articleContent['tailwind-css-v4-migration'],
    category: 'ui',
    tags: ['Tailwind CSS v4', 'Next.js 16', 'Migration', 'CSS'],
    author: authors[0],
    publishedDate: '2026-02-08',
    readingTime: 11,
    featured: false,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'whats-new-in-v4', title: 'What\'s New in v4', level: 2 },
      { id: 'migration-steps', title: 'Migration Steps', level: 2 },
      { id: 'configuration-changes', title: 'Configuration Changes', level: 2 },
      { id: 'breaking-changes', title: 'Breaking Changes', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What are the main changes in Tailwind CSS v4?',
        answer: 'Tailwind v4 uses a new engine, improved performance, simplified configuration, native CSS variables, and better TypeScript support.',
      },
      {
        question: 'Do I need to rewrite my existing styles?',
        answer: 'Most existing Tailwind classes work the same. Some deprecated classes may need updates, but the migration is generally straightforward.',
      },
      {
        question: 'How does configuration differ in v4?',
        answer: 'v4 uses CSS-based configuration with @theme directive instead of JavaScript config, making it easier to use with CSS-in-JS frameworks.',
      },
      {
        question: 'Is it worth upgrading to v4?',
        answer: 'Yes, v4 offers significant performance improvements, better developer experience, and future-proofing for modern CSS features.',
      },
    ],
    relatedArticles: ['building-modern-dashboards', 'optimizing-nextjs-core-web-vitals'],
  },
  {
    id: 'building-ai-applications-nextjs',
    slug: 'building-ai-applications-nextjs',
    title: 'Building AI Applications with Next.js 16 and Modern AI SDKs',
    description: 'Build production AI applications with Next.js 16 including chatbots, streaming responses, LLM integration, and cost optimization strategies.',
    content: articleContent['building-ai-applications-nextjs'],
    category: 'ai',
    tags: ['Next.js 16', 'AI', 'LLM', 'Chatbots'],
    author: authors[0],
    publishedDate: '2026-02-12',
    readingTime: 17,
    featured: true,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'ai-sdk-setup', title: 'AI SDK Setup', level: 2 },
      { id: 'building-a-chatbot', title: 'Building a Chatbot', level: 2 },
      { id: 'streaming-responses', title: 'Streaming Responses', level: 2 },
      { id: 'llm-integration', title: 'LLM Integration', level: 2 },
      { id: 'cost-optimization', title: 'Cost Optimization', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What AI SDKs work well with Next.js?',
        answer: 'Vercel AI SDK, OpenAI SDK, LangChain, and Anthropic SDK all work well with Next.js for building AI applications.',
      },
      {
        question: 'How do I implement streaming responses?',
        answer: 'Use the Vercel AI SDK\'s streaming capabilities with Server Actions or API routes to stream LLM responses to the client.',
      },
      {
        question: 'How do I optimize AI costs?',
        answer: 'Implement caching, use smaller models when possible, batch requests, and monitor token usage with analytics.',
      },
      {
        question: 'Can I use edge functions for AI?',
        answer: 'Yes, many AI SDKs support edge runtime, but some features may require Node.js. Check the SDK documentation.',
      },
    ],
    relatedArticles: ['building-saas-nextjs-supabase', 'nextjs-server-actions-zod'],
  },
  {
    id: 'deploying-nextjs-production',
    slug: 'deploying-nextjs-production',
    title: 'Deploying Next.js Applications to Production',
    description: 'Complete deployment guide for Next.js applications including Vercel, Azure, Docker, CI/CD pipelines, and production monitoring.',
    content: articleContent['deploying-nextjs-production'],
    category: 'deployment',
    tags: ['Next.js', 'Deployment', 'Vercel', 'Docker', 'CI/CD'],
    author: authors[0],
    publishedDate: '2026-02-15',
    readingTime: 16,
    featured: true,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'vercel-deployment', title: 'Vercel Deployment', level: 2 },
      { id: 'azure-deployment', title: 'Azure Deployment', level: 2 },
      { id: 'docker-deployment', title: 'Docker Deployment', level: 2 },
      { id: 'cicd-pipelines', title: 'CI/CD Pipelines', level: 2 },
      { id: 'production-monitoring', title: 'Production Monitoring', level: 2 },
      { id: 'common-mistakes', title: 'Common Mistakes', level: 2 },
      { id: 'production-checklist', title: 'Production Checklist', level: 2 },
      { id: 'faq', title: 'FAQ', level: 2 },
    ],
    faq: [
      {
        question: 'What is the best platform for Next.js deployment?',
        answer: 'Vercel is the official platform and offers the best integration, but you can also deploy to AWS, Azure, Docker, or other platforms.',
      },
      {
        question: 'How do I set up CI/CD for Next.js?',
        answer: 'Use GitHub Actions, GitLab CI, or similar tools to automatically test and deploy your Next.js application on push.',
      },
      {
        question: 'What environment variables do I need?',
        answer: 'Database URLs, API keys, authentication secrets, and any configuration specific to your application.',
      },
      {
        question: 'How do I monitor production performance?',
        answer: 'Use Vercel Analytics, LogRocket, Sentry, or similar tools to monitor performance, errors, and user behavior.',
      },
      {
        question: 'Should I use Docker for Next.js?',
        answer: 'Docker is useful for self-hosting or deploying to platforms without native Next.js support, but may add complexity.',
      },
    ],
    relatedArticles: ['securing-server-actions-production', 'building-saas-nextjs-supabase'],
  },
  ...troubleshootingArticles,
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find((article) => article.slug === slug);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return articles.filter((article) => article.category === category);
};

export const getFeaturedArticles = (): Article[] => {
  return articles.filter((article) => article.featured);
};

export const getRelatedArticles = (articleId: string, limit = 3): Article[] => {
  const article = articles.find((a) => a.id === articleId);
  if (!article || !article.relatedArticles) return [];
  
  return article.relatedArticles
    .map((id) => articles.find((a) => a.id === id))
    .filter((a): a is Article => a !== undefined)
    .slice(0, limit);
};

export const searchArticles = (query: string): Article[] => {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return [];

  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery) ||
      getCategoryBySlug(article.category)?.name.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
