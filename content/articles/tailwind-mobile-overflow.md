# Tailwind Layout Overflow on Mobile: How to Find and Fix It

## Introduction

When a page fits at desktop width but scrolls sideways on a narrow screen, the viewport is often not the source of the problem. A child element may be wider than the space its grid or flex parent can provide.

## What you see

A page-level horizontal scrollbar, clipped heading, or card extending past the viewport points to unexpected overflow. Code blocks and wide tables may need horizontal scrolling, but that scrolling should stay inside the code or table container rather than widening the page.

## Why it happens

Grid and flex items can retain an automatic minimum size derived from their min-content width. Long URLs, unbroken code tokens, explicit `min-width`, `w-screen`, fixed pixel widths, and `white-space: nowrap` can therefore keep an item wider than its available space.

## Minimal reproduction

This grid can overflow when the article contains unbreakable content and its grid item cannot shrink below its min-content width:

```tsx
<div className="grid grid-cols-12 gap-6">
  <article className="col-span-8">...</article>
</div>
```

## Fix

Allow the grid child to shrink, and make only the code/table region scroll when needed:

```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
  <article className="min-w-0 lg:col-span-8">
    <pre className="max-w-full overflow-x-auto"><code>...</code></pre>
  </article>
</div>
```

`min-w-0` lets the grid item shrink below its min-content width so it stays within the grid track. The `<pre>` then scrolls its own long line through `overflow-x-auto`. Apply the same local wrapper to a wide table instead of making the document scroll sideways.

## Step-by-step fixes

1. Measure `document.documentElement.scrollWidth` against `clientWidth`.
2. In DevTools, inspect elements whose bounding box extends beyond the viewport.
3. Check `w-screen`, fixed widths, minimum widths, long unbroken text, and `whitespace-nowrap`.
4. Add `min-w-0` to the relevant grid/flex item, not every descendant.
5. Constrain code blocks and tables with local `max-w-full overflow-x-auto` wrappers.
6. Re-check 375, 768, 1024, and desktop widths; test actual long content, not only empty cards.

## Common mistakes

- Applying `overflow-x-hidden` to `body` as the first fix. It can clip content or focus indicators and conceal the element causing the overflow.
- Making every element `w-full` when the parent has a fixed track.
- Using `w-screen` inside a padded container; it can exceed the available content width.
- Forgetting long filenames, code tokens, and unbroken URLs.

## How to prevent it

Use responsive tracks and add `min-w-0` only where a grid or flex child needs to shrink. Keep wide tables and code in local scroll containers, then check the layout at narrow and desktop widths.

## Version notes

These are CSS sizing rules, not Tailwind-specific behavior. Tailwind utilities expose them directly in v4; breakpoint variants remain mobile-first and apply at their breakpoint and above.

## Related reading

- [Tailwind classes not working](/article/tailwind-classes-not-working)
- [Tailwind responsive utilities](/article/tailwind-responsive-classes)
- [Tailwind v4 setup in Next.js](/article/tailwind-v4-nextjs-troubleshooting)

## FAQ

### Should I always add `min-w-0` to grid children?

Add it when the child must shrink below its min-content width. It is not required on every grid item.

### Is horizontal scrolling always a bug?

No. A code block or wide data table can scroll locally. Unexpected document-level horizontal scroll is usually the problem.

### Why does a long code line break my mobile layout?

The line's min-content width can prevent a grid or flex item from shrinking. Constrain the code region and allow that parent item to shrink.

## Conclusion

Find the element wider than the viewport, let its grid or flex parent shrink, and contain intentionally wide content in its own scroll region.
