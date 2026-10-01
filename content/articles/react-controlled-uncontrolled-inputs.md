# React Controlled vs Uncontrolled Input Warnings: How to Fix Them

## Introduction

A text field works until async data loads, then React warns that it changed from uncontrolled to controlled. The usual cause is a value that starts as `undefined` and later becomes a string.

## What you see

React warns that an input changed from uncontrolled to controlled, or the reverse. The same rule applies to checkboxes and selects, using `checked` or `value` respectively.

## Why it happens

A controlled input receives its current value from React state on every render. An uncontrolled input keeps its own DOM value and can receive an initial `defaultValue`. Switching ownership mid-lifecycle leaves React unsure which value is authoritative.

## Minimal reproduction

```tsx
function NameField({ loadedName }: { loadedName?: string }) {
  const [name, setName] = useState(loadedName);
  return <input value={name} onChange={event => setName(event.target.value)} />;
}
```

When `loadedName` is undefined initially and a string later, the input changes modes.

## Fix

Initialize controlled string values as strings and keep them controlled.

```tsx
function NameField({ loadedName }: { loadedName?: string }) {
  const [name, setName] = useState(loadedName ?? '');
  return <input value={name} onChange={event => setName(event.target.value)} />;
}
```

For a checkbox, use a boolean `checked` value. If the input should be uncontrolled, use `defaultValue` and do not later pass `value`.

## Step-by-step fixes

1. Find the input named in the warning.
2. Check its first render value. Text `value` should be a string; checkbox `checked` should be a boolean.
3. Normalize optional server/API data at the boundary: `value={profile.name ?? ''}`.
4. Choose ownership: React state (`value`/`checked`) or DOM (`defaultValue`/`defaultChecked`). Do not mix them.
5. For a field that is not editable, use `readOnly` with a controlled value or render text instead.

## Common mistakes

- Using `value={data?.name}` while `data` is loading.
- Combining `defaultValue` and `value` on one input.
- Passing `value={null}`; normalize nullable values to an empty string.
- Controlling a checkbox with `value` instead of `checked`.
- Changing a form field's `key` to hide a state ownership bug.

## How to prevent it

Define form state with explicit initial values. Parse API data into a stable UI model and use consistent controlled/uncontrolled patterns for the lifetime of each input.

## Version notes

The warning applies to React 19 as well as earlier React releases. Server Actions and Next.js do not change the controlled input contract.

## Related reading

- [React state update snapshots](/article/react-state-not-updating)
- [Too many re-renders](/article/react-too-many-rerenders)
- [Server Action form errors](/article/nextjs-server-actions-troubleshooting)

## FAQ

### Is `defaultValue` the same as `value`?

No. `defaultValue` sets the initial DOM value for an uncontrolled input. `value` makes React state authoritative on each render.

### How do I handle optional API fields?

Normalize them to a stable value, such as `data?.name ?? ''`, before passing them to a controlled input.

### Can I use `value={undefined}` temporarily?

Avoid it for controlled inputs. Start with a string or choose an uncontrolled input with `defaultValue`.
