# Tailwind CSS Classes Not Working: A Troubleshooting Guide

## Introduction

A utility class is in your JSX, but the browser shows no corresponding style. In Tailwind v4, separate three questions: did the build process load Tailwind, did source detection see the complete class name, and is another CSS rule winning in the cascade?

## What you see

The class appears in the DOM but not in generated CSS, or the rule exists but is crossed out in DevTools. These are different failures and need different checks.

## Why it happens

Tailwind scans source files as text for complete class tokens. It does not execute JavaScript interpolation. By default it ignores `node_modules`, ignored files, lockfiles, and binary files. A valid generated utility can still lose to a more specific selector or inline style.

## Minimal reproduction

This pattern is not statically detectable:

```tsx
<div className={`bg-${tone}-600`} />
```

The complete strings `bg-red-600` and `bg-green-600` never appear in source.

## Fix

Map values to complete class strings:

```tsx
const tones = {
  danger: 'bg-red-600 text-white',
  success: 'bg-green-700 text-white',
} as const;

export function Status({ tone }: { tone: keyof typeof tones }) {
  return <span className={tones[tone]}>Status</span>;
}
```

Then check the v4 pipeline: install `tailwindcss` and `@tailwindcss/postcss`, configure the `@tailwindcss/postcss` plugin, and import `tailwindcss` from the global stylesheet.

## Step-by-step fixes

1. Confirm the app imports the stylesheet containing `@import "tailwindcss";`.
2. Confirm PostCSS uses `"@tailwindcss/postcss": {}` rather than the old v3 plugin setup.
3. Inspect the built CSS or DevTools Styles panel to see whether the utility was generated.
4. If absent, ensure the source file is not ignored and the full utility token exists literally.
5. For monorepos or external component packages, configure the scan base with `source(...)` or register the path with `@source`.
6. If present but crossed out, inspect cascade layers, selector specificity, inline styles, and component-library styles.
7. Restart the dev server after changing PostCSS configuration.

## Common mistakes

- Copying Tailwind v3's `content`/purge setup as the fix for a v4 source-detection issue.
- Adding an incomplete dynamic class string to `@source inline()` instead of generating complete utilities intentionally.
- Using `!important` before checking which rule wins.
- Forgetting CSS files themselves are not scanned as utility-class sources.

## How to prevent it

Use complete class strings and typed variant maps. Keep a single global Tailwind import, check source detection when workspace roots change, and use browser DevTools to distinguish absent CSS from overridden CSS.

## Version notes

This guide targets Tailwind CSS v4. The current Next.js integration uses `@tailwindcss/postcss` and `@import "tailwindcss";`. Tailwind v3 setup instructions use different PostCSS and content configuration.

## Related reading

- [Tailwind v4 with Next.js setup](/article/tailwind-v4-nextjs-troubleshooting)
- [Dynamic Tailwind classes](/article/tailwind-dynamic-classes)
- [Tailwind responsive layout overflow](/article/tailwind-mobile-overflow)

## FAQ

### Do I need a `content` array in Tailwind v4?

Automatic source detection is the default. Use `@source` or `source(...)` for ignored or external source paths that need to be scanned.

### Why does a class show in DevTools but not work?

The rule may be absent, invalid, or overridden. Inspect the Styles panel and computed property to identify which case applies.

### Does string concatenation work for class names?

Not reliably. Tailwind scans text, not runtime JavaScript. Use a map whose values contain complete class names.
