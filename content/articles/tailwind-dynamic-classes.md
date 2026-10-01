# Tailwind Dynamic Classes Not Working: Use Complete Class Names

## Introduction

A component accepts `color="blue"`, but the expected background utility is missing from the production CSS. Tailwind v4 scans files as text; it does not run your component code to discover the final concatenated string.

## What you see

The DOM contains a class such as `bg-blue-600`, but no generated rule exists. The source may contain only fragments like `bg-${color}-600`.

## Why it happens

Tailwind can generate classes it finds as complete tokens. It cannot infer every possible value of a variable, so runtime interpolation leaves the scanner without a full utility name.

## Minimal reproduction

Incorrect:

```tsx
function Badge({ color }: { color: string }) {
  return <span className={`bg-${color}-600 text-white`}>Status</span>;
}
```

## Fix

Map allowed values to complete, statically visible utility strings:

```tsx
const variants = {
  blue: 'bg-blue-600 text-white',
  red: 'bg-red-600 text-white',
  gray: 'bg-gray-200 text-gray-950',
} as const;

type Variant = keyof typeof variants;

export function Badge({ color }: { color: Variant }) {
  return <span className={variants[color]}>Status</span>;
}
```

This also constrains the input to variants the component actually supports.

## Step-by-step fixes

1. Inspect the rendered class string in the browser.
2. Search source for the full class. If only fragments exist, replace interpolation with a static map.
3. For a finite palette, define an object or use the project's class-variance utility with complete values.
4. For truly data-driven colors, use an inline CSS custom property for the value and a static Tailwind utility for layout/typography.
5. Use Tailwind v4 `@source inline()` only when you intentionally need to safelist known classes not present in scanned sources.

A data-driven color can remain dynamic without constructing a utility name:

```tsx
<div style={{ backgroundColor: color }} className="rounded p-3 text-white">
  Status
</div>
```

Validate that `color` comes from a trusted palette if it is user-controlled.

## Common mistakes

- Writing `bg-${color}-600`, `text-${size}`, or `grid-cols-${count}`.
- Safelisting broad class families when a typed finite variant map is clearer.
- Passing arbitrary user input into a CSS value without validation.
- Assuming a class appearing in the browser proves Tailwind generated it.

## How to prevent it

Use literal utility maps for finite variants and CSS custom properties for truly variable runtime values. Let TypeScript constrain variant names so unsupported classes cannot be selected accidentally.

## Version notes

Tailwind v4's source detection still scans text rather than evaluating JavaScript. Its `@source inline()` directive replaces many older safelist examples, but complete class tokens remain the most maintainable approach.

## Related reading

- [Tailwind classes not working](/article/tailwind-classes-not-working)
- [Tailwind v4 and Next.js setup](/article/tailwind-v4-nextjs-troubleshooting)
- [Custom Tailwind theme variables](/article/tailwind-theme-variables)

## FAQ

### Can I use a lookup object for classes?

Yes. A map with complete class strings is statically detectable and gives you a natural place to constrain supported variants.

### When should I use `@source inline()`?

Use it for a small, intentional set of classes that Tailwind cannot discover because the source is external or generated. It should not replace complete class maps for normal component variants.

### What if the value is a runtime color from an API?

Use a CSS variable or inline style for the color value, validate/allowlist it as appropriate, and keep structural utilities static.
