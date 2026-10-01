# Fix “You’re Importing a Component That Needs useState” in Next.js

## Introduction

A component works in a client-rendered React app, then the App Router build complains that `useState`, `useEffect`, or an event handler is unavailable in a Server Component. This is a component-boundary error: the file is currently in the server module graph, but its implementation needs browser interactivity.

## What you see

Depending on the Next.js release and import path, the diagnostic may say that a component needs a Client Component boundary, that a hook is unsupported in a Server Component, or that event handlers cannot be passed to a Server Component. The precise wording varies; the required boundary is the key clue.

## Why it happens

In the App Router, pages and layouts are Server Components by default. They can read server data and render HTML, but cannot use state hooks or browser event handlers. A file marked with `'use client'` becomes a boundary: its imports enter the client bundle too.

## Minimal reproduction

```tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

Imported directly into a Server Component, this file has no client boundary.

## Fix

Mark the smallest interactive component as a Client Component, not the entire route.

```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(current => current + 1)}>{count}</button>;
}
```

The page can remain a Server Component and compose it with server-rendered data:

```tsx
import { Counter } from './counter';
import { getProduct } from '@/lib/products';

export default async function ProductPage() {
  const product = await getProduct();
  return <main><h1>{product.name}</h1><Counter /></main>;
}
```

## Step-by-step fixes

1. Find the component that calls a hook or declares an event handler.
2. Add `'use client'` as the first statement in that module, before imports.
3. Keep data fetching, secrets, and static structure in Server Components.
4. Pass only serializable props across the boundary. Functions, class instances, and database clients are not ordinary serializable props.
5. If a Client Component needs server-rendered content, pass that content as `children` from a Server Component rather than importing server-only code into the client graph.

## Common mistakes

- Adding `'use client'` to `app/page.tsx` just to silence the error. This moves its imports into the client bundle and can expose server-only code.
- Placing the directive below an import. Directives must appear before imports.
- Passing callbacks from a Server Component to a Client Component. Use a Client Component callback, or a Server Action where that is the intended interaction.
- Importing `fs`, database credentials, or a `server-only` module below a client boundary.

## How to prevent it

Separate interactive controls from data and layout. Use small Client Components for menus, toggles, forms, and local state. Keep route pages and data access server-side unless they genuinely need browser behavior.

## Version notes

The default Server Component behavior applies to the Next.js 16 App Router. The Pages Router has different conventions. `'use client'` defines a module-graph boundary, not merely a per-component annotation.

## Related reading

- [Hydration mismatch fixes](/article/nextjs-hydration-error)
- [Why `window` is undefined during rendering](/article/nextjs-window-is-not-defined)
- [Server Action errors](/article/nextjs-server-actions-troubleshooting)

## FAQ

### Do child components also need `'use client'`?

Not if they are imported from a module already inside the client graph. Avoid repeating the directive on every file; place it at the boundary.

### Can a Client Component render a Server Component?

A Client Component cannot import a Server Component module directly. A Server Component can render server output and pass it as a `children` prop into a Client Component.

### Does `'use client'` mean the component only renders in the browser?

No. Client Components are normally prerendered to HTML on the initial request and hydrated in the browser. They can still encounter hydration mismatches.
