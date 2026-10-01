# How to Fix “window is not defined” in Next.js

## Introduction

A module works after clicking around in the browser, but `next build` or a server render fails with `ReferenceError: window is not defined`. The server has no browser `window`; the fix depends on when the code reads it.

## What you see

The error often points to a line using `window`, `document`, `localStorage`, or a package that reads those globals while being imported. The same issue can appear for `navigator` and DOM-only libraries.

## Why it happens

Next.js renders Server Components on the server. Client Components can also be prerendered on the server for the initial HTML, so marking a file `'use client'` does not make top-level browser access safe.

## Minimal reproduction

```tsx
'use client';

const savedTheme = window.localStorage.getItem('theme');

export function ThemeLabel() {
  return <span>{savedTheme}</span>;
}
```

The module evaluates before there is a browser window.

## Fix

Read browser state in an effect, and provide a deterministic first-render fallback.

```tsx
'use client';

import { useEffect, useState } from 'react';

export function ThemeLabel() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    setTheme(window.localStorage.getItem('theme'));
  }, []);

  return <span>{theme ?? 'System theme'}</span>;
}
```

Effects run only in the browser. If the code needs to run in response to a user action, read the API in the event handler instead of adding an effect.

## Step-by-step fixes

1. Read the stack trace and distinguish module-load access from render-time access.
2. Move browser-only work into `useEffect`, an event handler, or a browser-only utility called after mount.
3. Keep the server and initial client output identical. A `typeof window` conditional that returns different JSX can replace this error with a hydration mismatch.
4. If a third-party widget touches the DOM during import, isolate it in a Client Component and use `dynamic(() => import('./Widget'), { ssr: false })` there.
5. If you only need a browser value for a decorative effect, consider CSS media queries rather than JavaScript.

## Common mistakes

- Assuming `'use client'` disables server rendering.
- Evaluating `window` in a module constant or default prop.
- Returning different initial JSX based on `typeof window` without matching server output.
- Using `ssr: false` from a Server Component. In the App Router, put that dynamic import inside a Client Component.

## How to prevent it

Keep browser APIs behind effects or event handlers. Review dependencies that access globals at import time, and make server/client ownership explicit. Prefer server data passed as props when the value is available on the server.

## Version notes

This server/browser distinction applies to Next.js 16 App Router. A Client Component can still prerender; its browser-only logic must wait until it runs in the browser.

## Related reading

- [Server and Client Component boundaries](/article/nextjs-use-state-server-component)
- [Hydration mismatch fixes](/article/nextjs-hydration-error)
- [Next.js image troubleshooting](/article/nextjs-image-troubleshooting)

## FAQ

### Does adding `'use client'` fix `window is not defined`?

Not by itself. Client Components can be rendered on the server. Move the access to an effect or event handler, or disable SSR for a browser-only widget.

### Can I use `typeof window !== 'undefined'`?

It is safe for guarding an operation, but conditional markup can differ between server and first client render. Use a stable fallback and update after mount when the displayed result is browser-specific.

### Should I disable SSR for a whole page?

Usually not. Isolate only the dependency that truly requires browser globals.
