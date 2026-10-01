# Tailwind CSS v4 Migration Guide

## Introduction

When Tailwind CSS v4 was released, I was excited but also nervous. Major version upgrades can break existing styles and introduce unexpected behavior. But after migrating several production applications, I can say that v4 is worth it—the performance improvements and developer experience are significant.

The key to a smooth migration is understanding what's changed and planning your approach. In this guide, I'll walk you through migrating from Tailwind CSS v3 to v4 with Next.js 16.

## What's New in v4

Tailwind CSS v4 introduces several major changes:

### 1. New Engine
v4 uses a completely new Rust-based engine that's significantly faster. Build times are reduced, and HMR is instant.

### 2. CSS-Based Configuration
Instead of a JavaScript config file, v4 uses CSS-based configuration with the `@theme` directive:

```css
@theme {
  --color-primary: #3b82f6;
  --font-sans: Inter, system-ui, sans-serif;
}
```

### 3. Native CSS Variables
v4 uses CSS variables for theming, making it easier to work with CSS-in-JS frameworks and dynamic theming.

### 4. Better TypeScript Support
TypeScript autocomplete works out of the box, and arbitrary values are type-safe.

### 5. Simplified Setup
No more PostCSS plugins or complex build configurations. Just import Tailwind and go.

## Migration Steps

### Step 1: Update Dependencies

Update your package.json:

```bash
npm install tailwindcss@latest @tailwindcss/postcss@latest
```

Remove old dependencies:

```bash
npm uninstall tailwindcss postcss autoprefixer
```

### Step 2: Update CSS Configuration

Old Tailwind v3 config:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
  plugins: [],
};
```

New Tailwind v4 config (in CSS):

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-sans: Inter, system-ui, sans-serif;
}
```

### Step 3: Update PostCSS Config

Remove the old PostCSS config if you had one. v4 handles PostCSS internally.

### Step 4: Update Next.js Config

If you were using the Tailwind CSS plugin in next.config.js, remove it:

```typescript
// next.config.ts
const nextConfig = {
  // Remove any Tailwind-specific config
};

export default nextConfig;
```

### Step 5: Update CSS Imports

Old import:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

New import:

```css
@import "tailwindcss";
```

## Configuration Changes

### Colors

Old way:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
      },
    },
  },
};
```

New way:

```css
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
}
```

### Fonts

Old way:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

New way:

```css
@theme {
  --font-sans: Inter, system-ui, sans-serif;
}
```

### Spacing

Old way:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
    },
  },
};
```

New way:

```css
@theme {
  --spacing-128: 32rem;
}
```

## Breaking Changes

### 1. JIT Mode Removed
JIT mode is now the default and only mode. If you had JIT disabled, you'll need to adjust.

### 2. Plugin API Changes
Some plugins may not be compatible with v4. Check plugin compatibility before upgrading.

### 3. Purge Renamed
The `purge` option was renamed to `content` in v3, and in v4 it's handled automatically.

### 4. Default Colors Changed
Some default color values have changed. Test your UI thoroughly after migration.

### 5. Responsive Prefixes
The `max-` prefix for max-width queries has changed. Update your responsive classes.

## Common Mistakes

### 1. Not Testing in a Branch

Always migrate in a feature branch. Test thoroughly before merging to main.

### 2. Forgetting to Update Imports

Remove old `@tailwind` directives and replace with `@import "tailwindcss"`.

### 3. Ignoring Plugin Compatibility

Check if your Tailwind plugins support v4. You may need to find alternatives.

### 4. Not Using CSS Variables

Take advantage of v4's CSS variables for theming. Don't stick to the old JavaScript config pattern.

### 5. Skipping Documentation

Read the official migration guide. It covers edge cases that this guide might miss.

## Production Checklist

Before deploying v4 to production:

✓ Test all pages in your application
✓ Check responsive behavior
✓ Verify custom components render correctly
✓ Test dark mode if you use it
✓ Check build performance
✓ Verify third-party component libraries
✓ Test accessibility features
✓ Check that all custom utilities work

## FAQ

### What are the main changes in Tailwind CSS v4?

Tailwind v4 uses a new engine, improved performance, simplified configuration, native CSS variables, and better TypeScript support.

### Do I need to rewrite my existing styles?

Most existing Tailwind classes work the same. Some deprecated classes may need updates, but the migration is generally straightforward.

### How does configuration differ in v4?

v4 uses CSS-based configuration with @theme directive instead of JavaScript config, making it easier to use with CSS-in-JS frameworks.

### Is it worth upgrading to v4?

Yes, v4 offers significant performance improvements, better developer experience, and future-proofing for modern CSS features.
