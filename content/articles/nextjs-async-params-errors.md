# How to Fix Next.js Dynamic Route and Async Params Errors

## Introduction

A route that worked in an older App Router tutorial now warns that `params` should be awaited, or TypeScript says a property does not exist on `Promise`. In Next.js 16, `params` and page `searchParams` are asynchronous request APIs.

## What you see

Common symptoms include a synchronous dynamic API warning, a type mismatch for `{ slug: string }`, or code that reads `params.slug` before resolving `params`. The exact diagnostic changes across releases.

## Why it happens

The App Router supplies `params` as a Promise. Dynamic routes still come from folder names such as `[slug]`; awaiting the Promise resolves the captured path values. It does not fetch the record or authorize access by itself. `searchParams` is also a Promise and its values can be `string`, `string[]`, or `undefined`.

## Minimal reproduction

Incorrect Next.js 16 page:

```tsx
export default function ArticlePage({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>;
}
```

Correct page and metadata:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function ArticlePage({ params }: PageProps<'/article/[slug]'>) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  return <h1>{article.title}</h1>;
}

export async function generateMetadata({ params }: PageProps<'/article/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return { title: article?.title ?? 'Article not found' };
}
```

## Fix

Await the route value at the boundary where it is read. Use `PageProps<'/article/[slug]'>` after Next has generated its route types, or explicitly type `params: Promise<{ slug: string }>`.

## Step-by-step fixes

1. Confirm the folder segment: `[slug]` captures one string; `[...slug]` captures a string array.
2. Await `params` in the page, layout, or `generateMetadata` that reads it.
3. Await `searchParams` in the page; a repeated query key can produce a string array.
4. Call `notFound()` when a valid path parameter has no matching record.
5. Do not await params unnecessarily in static pages that do not use them.
6. If old generated route types linger, rerun `next dev`/`next build` or `next typegen`, then run `tsc`.

## Common mistakes

- Changing a route folder name to fix a Promise type error. The folder controls the URL; the type requires awaiting.
- Treating `searchParams` as `URLSearchParams`; it is a plain object.
- Assuming `params` resolves to a database object.
- Typing catch-all segments as `string` when they are `string[]`.

## How to prevent it

Use the route-specific `PageProps` helper and add `generateStaticParams` only when you intentionally pre-render known values. Keep lookup and authorization separate from parameter parsing.

## Version notes

The Promise API is used in current Next.js releases, including 16. Synchronous access was supported for migration in earlier versions but is not the correct Next.js 16 type contract.

## Related reading

- [Next.js routing explained](/article/nextjs-16-routing-explained)
- [Dynamic route rendering and 404s](/article/nextjs-hydration-error)
- [Server Action revalidation issues](/article/nextjs-server-actions-troubleshooting)

## FAQ

### Are `params` asynchronous only for dynamic routes?

Route `params` are Promise-based where route parameters are present. Static pages may receive an empty object; use generated route types for the exact route shape.

### Can I await params in `generateMetadata`?

Yes. Metadata functions receive the same Promise-based route props and must await them before reading values.

### Is `searchParams` available in layouts?

No. Page `searchParams` are page props. Layouts do not receive them because shared layouts are not rerendered for every query-string change.
