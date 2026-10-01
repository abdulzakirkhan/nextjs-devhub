# Tailwind CSS v4 Not Working in Next.js: Setup and Fixes

## Introduction

After upgrading, the page renders but Tailwind utilities are missing, or the old configuration file appears to have no effect. Tailwind v4 uses a CSS-first entry point and a dedicated PostCSS plugin; confirm the project is using that path before debugging individual utilities.

## What you see

Common symptoms include no generated utility styles, an unknown PostCSS plugin error, or custom theme values that are absent. Error wording depends on the PostCSS runner and package versions.

## Why it happens

A v3 tutorial may configure `tailwindcss` directly as a PostCSS plugin and import three `@tailwind` directives. Tailwind v4's standard Next.js setup uses `@tailwindcss/postcss` and a CSS import. Mixing the two setup paths can stop the build pipeline or leave styles incomplete.

## Minimal reproduction

Install the v4 integration packages:

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

Configure PostCSS:

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

Import Tailwind from the app stylesheet:

```css
/* app/globals.css */
@import "tailwindcss";
```

Import that stylesheet from the root layout and use a literal utility in a page to verify the pipeline.

## Fix

Keep one Tailwind entry point, verify package versions, and remove conflicting legacy plugin configuration. If classes in a dependency or ignored folder are missing, explicitly register the source instead of adding a v3 `content` array by reflex.

## Step-by-step fixes

1. Run `npm ls tailwindcss @tailwindcss/postcss postcss` and check that Tailwind is v4.
2. Check `postcss.config.mjs` for the `@tailwindcss/postcss` plugin.
3. Confirm `app/globals.css` contains `@import "tailwindcss";` and `app/layout.tsx` imports that file.
4. Search for stale `@tailwind base`, `@tailwind components`, and `@tailwind utilities` directives or duplicate CSS imports.
5. Test one literal class such as `text-red-600` in a scanned `.tsx` file.
6. If a workspace package is ignored, add an `@source` path relative to the stylesheet.
7. Restart Next after changing PostCSS configuration and run a production build to catch pipeline differences.

## Common mistakes

- Installing Tailwind v4 but retaining a v3 PostCSS plugin entry.
- Importing the global stylesheet only from a nested route.
- Assuming runtime-generated classes will be detected.
- Editing a Tailwind config file while the v4 CSS import is the active configuration path.

## How to prevent it

Pin compatible package ranges, keep the PostCSS configuration small, and test both dev and production builds after upgrades. Add source paths intentionally for monorepo dependencies.

## Version notes

The steps here follow Tailwind's v4 Next.js guide. Tailwind v3 uses `tailwindcss` as the PostCSS plugin and commonly configures a `content` array; do not mix those instructions with the v4 pipeline.

## Related reading

- [Tailwind utilities not generated](/article/tailwind-classes-not-working)
- [Dynamic Tailwind classes](/article/tailwind-dynamic-classes)
- [Custom colors and theme variables](/article/tailwind-theme-variables)

## FAQ

### Do I need to delete `tailwind.config.js`?

Not automatically. First establish which configuration is active. Tailwind v4 supports legacy config loading in some migration scenarios, but CSS-first configuration is the normal v4 path.

### Why do styles work in dev but disappear in build?

Build source detection, ignored paths, and dynamic class names can differ from what you happened to render in development. Test a literal class and inspect the generated production CSS.

### Does this require changing Next.js configuration?

The standard Tailwind v4 integration uses PostCSS and a CSS import; most projects do not need a custom `next.config` entry just to load Tailwind.
