# How to Fix Hydration Errors in Next.js

## Introduction

The page appears, then the console says the server HTML does not match the browser render. Hydration errors mean React received different initial markup from the server and client. The exact warning text changes between React and Next.js releases, but the diagnostic idea is the same: make the first client render agree with the HTML Next.js sent.

## What you see

Common messages mention a hydration mismatch, text content differing, or a tree that cannot be hydrated. A warning about one mismatched attribute is not always fatal, but treat it as a rendering defect rather than hiding it immediately.

## Why it happens

Next.js prerenders HTML on the server. On the first browser render, React evaluates the component again to attach behavior. If those executions read different values, the trees differ. Frequent causes include `Date.now()`, `Math.random()`, locale-dependent date formatting, browser storage, viewport APIs, invalid HTML nesting, and libraries that touch `window` during module evaluation.

## Minimal reproduction

```tsx
export default function Clock() {
  return <p>{new Date().toLocaleString()}</p>;
}
```

The server and browser can use different clocks, time zones, or locales, so the string is not guaranteed to match.

## Fix

Prefer deterministic input shared by both renders. Pass a serialized timestamp from the server, then format it consistently, or render browser-specific output after hydration when that difference is intentional.

```tsx
'use client';

import { useEffect, useState } from 'react';

export function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  return <time>{time ?? 'Loading time'}</time>;
}
```

Both initial renders show the same fallback. The effect runs only in the browser. For a server-known time, pass a stable ISO string as a prop instead; this avoids the temporary placeholder.

## Step-by-step fixes

1. Read the first hydration warning and identify the element React names.
2. Search that render path for time, randomness, browser globals, locale formatting, or state read from storage.
3. Make the initial output deterministic, or move browser-only work into an effect.
4. Validate HTML structure. A `<p>` cannot contain another `<p>`, and interactive elements should not be nested inside each other.
5. Check third-party packages. If a package requires the DOM at import time, load it from a Client Component with `dynamic(() => import('./BrowserWidget'), { ssr: false })`.
6. Re-test with a hard refresh, not only client-side navigation.

To avoid unstable random IDs, use React's `useId()` for accessibility relationships. Do not call `Math.random()` during rendering. If the random value is data, generate it once on the server and pass it to both renders.

## Common mistakes

- Adding `suppressHydrationWarning` to the entire page. It only suppresses a narrow, intentional text/attribute mismatch and does not repair the tree.
- Rendering `typeof window !== 'undefined'` branches during the initial render. That often creates the mismatch it was meant to avoid.
- Assuming `useEffect` runs on the server. It does not.
- Blaming Strict Mode. It can reveal render impurities in development, but it is not the cause of different server and browser inputs.

## How to prevent it

Keep render functions pure and derive output from props and state. Treat browser storage and APIs as client-only external systems. Use semantic HTML, stable IDs, and deterministic date formatting for server-rendered content.

## Version notes

The wording and overlay differ across Next.js and React versions. The server/client first-render requirement remains. In Next.js 16 App Router, pages and layouts are Server Components by default; adding `'use client'` enables client features but does not make nondeterministic initial output safe.

## Related reading

- [Server and Client Component import errors](/article/nextjs-use-state-server-component)
- [Tailwind dark mode hydration issues](/article/tailwind-dark-mode-nextjs)
- [React useEffect loops](/article/react-useeffect-infinite-loop)

## FAQ

### Does every hydration warning break the page?

Not every warning is fatal, but a mismatch can cause React to discard and rebuild part of the tree. Fix the underlying difference instead of relying on warning suppression.

### Should I disable SSR to fix hydration?

Only for a browser-dependent widget that cannot render on the server. Disabling SSR for an entire page hides useful server rendering and is usually unnecessary.

### Is `suppressHydrationWarning` a real fix?

It is an escape hatch for a deliberately different value on one element, such as a timestamp. It does not fix mismatched descendants or event behavior.
