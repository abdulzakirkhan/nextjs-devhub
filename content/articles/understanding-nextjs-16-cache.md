# Understanding Next.js 16 Cache System: From ISR to Modern Caching

## Introduction

Next.js 16 supports route-level revalidation, explicit `fetch` caching, on-demand invalidation, and the opt-in Cache Components model. These mechanisms have different defaults, so choose the model configured by the application before deciding whether data is cached or when it becomes fresh.

## Cache Types

When `cacheComponents` is disabled, the previous caching model applies. In that model, `fetch` is not cached by default; opt into caching with `cache: 'force-cache'` or set a time-based revalidation policy. Cache Components are an opt-in Next.js 16 model enabled with `cacheComponents: true` and use directives such as `use cache`.

### 1. Static Generation
Pages are built at build time and served as static HTML. This is the fastest option but only works for content that doesn't change frequently.

### 2. Incremental Static Regeneration (ISR)
Pages are statically generated but can be regenerated on-demand. This is perfect for content that changes occasionally but doesn't need to be real-time.

### 3. Fetch Caching
The new fetch-based caching system that works with the native fetch API. It's more flexible than ISR and works with Server Components.

### 4. On-Demand Revalidation
Trigger cache invalidation manually via API routes or Server Actions. This gives you control over when content updates.

## From ISR to Modern Caching

Time-based revalidation can be set for a route with a statically analyzable `revalidate` export:

```typescript
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <PostView post={post} />;
}
```

The route setting establishes a default interval for the route. Individual data requests can also specify their own revalidation interval.

For an external request, specify its own revalidation interval:

```typescript
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 }
  }).then(res => res.json());
  
  return <PostView post={post} />;
}
```

With Cache Components disabled, a request can opt into caching with `cache: 'force-cache'` or use `next.revalidate` for time-based revalidation. With Cache Components enabled, follow that model's `use cache` and `cacheLife` guidance instead.

## Fetch Caching

When Cache Components are disabled, `fetch` requests are not cached by default. Use the native fetch options to choose the behavior explicitly:

```typescript
// Cache for 1 hour
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }
}).then(res => res.json());

// No caching
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
}).then(res => res.json());

// Cache until invalidated
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache'
}).then(res => res.json());
```

Use explicit caching for data that is safe to share across requests and has a defined freshness requirement, such as:
- API calls to external services
- Database queries in Server Components
- Data that changes predictably
- Content that doesn't need to be real-time

## On-Demand Revalidation

On-demand revalidation is a game-changer for content management. Instead of waiting for a revalidation interval, you can trigger cache invalidation when content changes:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = process.env.REVALIDATION_TOKEN;
  if (!token || request.headers.get('authorization') !== `Bearer ${token}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: unknown = await request.json();
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { path, tag } = body as { path?: unknown; tag?: unknown };
  const validPath = typeof path === 'string' && /^\/blog\/[a-z0-9-]+$/.test(path);
  const validTag = typeof tag === 'string' && /^post-[a-z0-9-]+$/.test(tag);
  if (!validPath && !validTag) {
    return NextResponse.json({ error: 'Invalid path or tag' }, { status: 400 });
  }

  if (validPath) {
    revalidatePath(path);
  }

  if (validTag) {
    revalidateTag(tag, 'max');
  }

  return NextResponse.json({ revalidated: true });
}
```

Keep this endpoint private to trusted callers and provide the configured token through a server-only environment variable. Call it from your CMS or another trusted service:

```typescript
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({ path: '/blog/my-post' })
});
```

This pattern is perfect for:
- CMS-driven content
- E-commerce product updates
- User-generated content
- Any data that changes unpredictably

## Cache Tags

Cache tags let you group related content and revalidate it together:

```typescript
// Fetch with a tag
const post = await fetch(`https://api.example.com/posts/${id}`, {
  next: { tags: ['posts', `post-${id}`] }
}).then(res => res.json());

// Revalidate all posts
revalidateTag('posts', 'max');

// Revalidate specific post
revalidateTag(`post-${id}`, 'max');
```

Cache tags are useful for:
- Grouping related content
- Bulk revalidation
- Hierarchical cache invalidation
- Organizing cache dependencies

## Common Mistakes

### 1. Caching User-Specific Data

Never cache data that's specific to a user's session or permissions. Use `cache: 'no-store'` for user-specific content.

### 2. Not Setting Revalidation Intervals

If you set `revalidate: false`, content never updates. Always set an appropriate revalidation interval for production data.

### 3. Ignoring Cache Tags

Without cache tags, you can only revalidate entire paths. Use tags to organize your cache and make revalidation more efficient.

### 4. Forgetting About Stale Content

Cached content can become stale. Implement proper revalidation strategies and monitor cache hit rates.

### 5. Caching Everything

Not everything should be cached. Real-time data, user sessions, and frequently changing content should use `cache: 'no-store'`.

## FAQ

### What is the difference between ISR and static generation?

ISR (Incremental Static Regeneration) allows you to update static pages after build time, while static generation only builds pages at build time.

### How do I implement on-demand revalidation?

Use the revalidatePath or revalidateTag functions in a server action or API route to trigger revalidation of specific pages.

### What are cache tags?

Cache tags allow you to group cached content and revalidate multiple pages at once by tag, useful for related content updates.

### How do I disable caching?

Use cache: 'no-store' in fetch options or export const dynamic = 'force-dynamic' in your page component.
