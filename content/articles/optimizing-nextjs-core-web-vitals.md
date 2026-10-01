# Optimizing Next.js Core Web Vitals: LCP, INP, and CLS

## Introduction

Core Web Vitals measure loading, interactivity, and visual stability using field data. The current metrics are Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS); INP replaced First Input Delay (FID) in March 2024. These metrics are part of Google's page-experience signals, but good scores do not guarantee ranking improvements.

This guide covers common causes of poor LCP, INP, and CLS in Next.js applications, ways to investigate them, and changes that can reduce regressions. Validate improvements with field data as well as lab tools.

## Largest Contentful Paint (LCP)

LCP measures how long it takes for the largest content element to become visible. For most pages, this is an image or large text block.

### Image Optimization

Oversized or poorly prioritized images can delay LCP. Next.js provides `next/image` for responsive sizing and image optimization:

```typescript
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      preload // Use for the single image identified as the LCP resource
      sizes="(max-width: 768px) 100vw, 1200px"
    />
  );
}
```

In Next.js 16, `priority` is deprecated in favor of `preload`. Use preload only when the image is known to be the page's LCP resource; otherwise prefer normal lazy loading or `fetchPriority` where appropriate. The `sizes` prop helps the browser choose an appropriate image width.

### Font Optimization

Custom fonts delay LCP because the browser has to load them before rendering text. Use `next/font` to optimize:

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Show fallback font immediately
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

The `display: 'swap'` option shows a fallback font immediately, preventing layout shifts while the custom font loads.

### Code Splitting

Large JavaScript bundles delay LCP. Next.js automatically code-splits by route, but you can optimize further:

```typescript
import dynamic from 'next/dynamic';

// Dynamically import heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR for client-only components
});
```

## Interaction to Next Paint (INP)

INP measures interaction responsiveness across a page visit, not only the first interaction. Long JavaScript tasks, expensive event handlers, and delayed rendering can all contribute to poor INP.

### Reduce JavaScript Bundle Size

Large client-side bundles can contribute to long main-thread tasks and poor INP. Use a bundle analyzer to identify code that can be removed or loaded only when needed:

```bash
npm install @next/bundle-analyzer
```

```typescript
// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  // ...other config
};

export default withBundleAnalyzer(nextConfig);
```

### Use Server Components

Server Components don't send JavaScript to the client. Use them for everything that doesn't need interactivity:

```typescript
// This is a Server Component by default
export default async function ProductList() {
  const products = await db.product.findMany();
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

Only add `'use client'` when you genuinely need interactivity.

### Debounce Event Handlers

Frequent event handlers block the main thread. Debounce them:

```typescript
import { useCallback, useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      // Perform search
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return <input onChange={handleChange} />;
}
```

## Cumulative Layout Shift (CLS)

CLS measures visual stability—how much content moves around as the page loads. It's the most frustrating metric for users.

### Reserve Space for Images

Always specify image dimensions:

```typescript
<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  className="rounded-full"
/>
```

Never let images resize unexpectedly. If you don't know the dimensions, use aspect-ratio:

```typescript
<div className="aspect-square w-48 bg-gray-200">
  <Image
    src="/profile.jpg"
    alt="Profile"
    fill
    className="object-cover"
  />
</div>
```

### Reserve Space for Dynamic Content

If content loads asynchronously, reserve space for it:

```typescript
function ProductCard({ product }: { product: Product | null }) {
  return (
    <div className="min-h-[300px]">
      {product ? (
        <ProductDetails product={product} />
      ) : (
        <ProductSkeleton />
      )}
    </div>
  );
}
```

The `min-h-[300px]` reserves space even while loading.

### Avoid Font Layout Shift

Use `font-display: swap` and reserve space for text:

```typescript
<p className="h-6 overflow-hidden">Loading text...</p>
```

## Common Mistakes

### 1. Optimizing the Wrong Metrics

Don't optimize metrics that are already good. Focus on the ones that are failing your Core Web Vitals assessment.

### 2. Premature Optimization

Measure first, then optimize. Use Lighthouse and Web Vitals libraries to identify actual bottlenecks.

### 3. Ignoring Real-World Data

Lab tests don't always reflect real-world performance. Use field data from CrUX to understand real user experience.

### 4. Over-Optimizing

Some optimizations increase complexity without meaningful improvements. Focus on high-impact changes first.

### 5. Not Monitoring Continuously

Performance degrades over time as features are added. Monitor Core Web Vitals continuously in production.

## FAQ

### What are Core Web Vitals?

Core Web Vitals currently include LCP (loading), INP (interaction responsiveness), and CLS (visual stability). FID was replaced by INP in March 2024.

### How do I improve LCP in Next.js?

Optimize images with next/image, use font optimization, implement proper caching, and reduce JavaScript bundle size.

### What causes CLS and how do I fix it?

CLS is caused by content shifting during load. Fix by reserving space for images and ads, using font-display: swap, and avoiding dynamic content injection.

### How do I measure Core Web Vitals?

Use Lighthouse, PageSpeed Insights, or the Web Vitals library to measure and track your Core Web Vitals.
