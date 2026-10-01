# Tailwind Dark Mode Not Working in Next.js: Fix the Theme Selector

## Introduction

The theme toggle adds `dark` to `<html>`, but `dark:bg-*` classes still follow the operating system or never activate. Tailwind's default dark variant is media-query based; a class-based theme provider needs a matching custom variant.

## What you see

The root element changes from `class="light"` to `class="dark"`, but computed styles do not change. Another symptom is a flash between themes during the first render when the preference comes from browser storage.

## Why it happens

Tailwind v4 defaults `dark:` to `prefers-color-scheme`. A manually managed `.dark` class does not automatically override that selector. Separately, browser storage is unavailable during server rendering, so rendering different theme markup from `localStorage` on the first client pass can cause hydration mismatch.

## Minimal reproduction

For a class-based provider, configure the variant in the global stylesheet:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Then set the class on the root element through the theme provider, not by rendering divergent server/client markup yourself.

## Fix

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

The provider applies the current theme class, while Tailwind's custom variant watches that same class. In this repository's layout, the class strategy is already used; the missing custom variant was the mismatch.

## Step-by-step fixes

1. Inspect `<html>` in DevTools and confirm the theme provider changes its class/attribute.
2. Check whether Tailwind's `dark` variant is media-driven or selector-driven.
3. For `.dark` classes, add `@custom-variant dark (&:where(.dark, .dark *));` after the Tailwind import.
4. If you use a `data-theme` attribute instead, define a matching custom variant selector and configure the provider for that attribute.
5. Avoid reading `localStorage` during the initial render. Let the provider resolve it, or render a stable fallback.
6. Check computed styles to distinguish a selector mismatch from a specificity override.

## Common mistakes

- Changing the theme class but leaving Tailwind on its default media query.
- Adding `suppressHydrationWarning` to every element rather than using the provider's root handling.
- Reading `window.matchMedia` in a Server Component.
- Defining `dark:` utilities but omitting the parent `.dark` class.

## How to prevent it

Choose one theme contract: system media, root class, or data attribute. Configure Tailwind and the provider to use the same selector, and keep browser preference resolution out of server render logic.

## Version notes

This custom variant syntax is for Tailwind CSS v4. The site's current Next.js theme provider uses `next-themes` with `attribute="class"`; the CSS selector must match that configuration.

## Related reading

- [Hydration mismatch fixes](/article/nextjs-hydration-error)
- [Tailwind v4 setup with Next.js](/article/tailwind-v4-nextjs-troubleshooting)
- [Tailwind utilities not working](/article/tailwind-classes-not-working)

## FAQ

### Does Tailwind v4 dark mode use system preference by default?

Yes. To use a manually toggled class or attribute, override the `dark` variant with a selector that matches the root theme marker.

### Should the dark class be on `html` or `body`?

Either can be selected by CSS, but a root-level class is common and matches the provider's class strategy. Ensure your custom selector targets that same element and descendants.

### How do I avoid a hydration flash?

Use a theme provider designed to resolve the preference before paint and keep server and initial client markup stable. Do not branch on `localStorage` during render.
