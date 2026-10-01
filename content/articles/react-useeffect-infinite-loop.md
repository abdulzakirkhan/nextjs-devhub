# React useEffect Infinite Loop: Causes and Fixes

## Introduction

An effect runs, updates state, the component renders again, and the effect runs again. A `useEffect` loop is a feedback cycle between an effect update and one of its dependencies, not a reason to blindly remove dependencies.

## What you see

The UI keeps rendering, requests repeat, or React eventually reports maximum update depth. In development, Strict Mode adds an extra setup/cleanup cycle on mount, but a persistent loop usually comes from the effect's state/dependency relationship.

## Why it happens

React compares dependencies with `Object.is`. An effect that updates state can loop when the update changes a dependency. A new object/function created on every render also compares unequal, even when its contents look identical. Omitting the dependency array makes an effect run after every commit.

## Minimal reproduction

```tsx
function Results({ query }: { query: string }) {
  const [filters, setFilters] = useState({ query });
  useEffect(() => {
    setFilters({ query });
  }, [filters]);
  return <p>{filters.query}</p>;
}
```

Each update creates a new object, so `filters` changes again.

## Fix

If the value is derived, remove the effect and state entirely:

```tsx
function Results({ query }: { query: string }) {
  const filters = { query };
  return <p>{filters.query}</p>;
}
```

If the effect synchronizes with an external system, depend on stable primitive inputs and create temporary objects inside the effect:

```tsx
useEffect(() => {
  const connection = connect({ roomId });
  connection.open();
  return () => connection.close();
}, [roomId]);
```

## Step-by-step fixes

1. Write down what external system the effect synchronizes with. If there is none, see whether the effect can be removed.
2. List every reactive value read by setup and cleanup; include those dependencies.
3. Check whether an object or function is recreated during each render.
4. Move effect-only objects/functions inside the effect, or depend on their primitive inputs.
5. When updating state from its previous value, use a functional updater so state itself need not be an effect dependency.
6. Add cleanup for subscriptions, timers, and listeners.

## Common mistakes

- Omitting dependencies to silence the linter. This creates stale closures rather than a sound fix.
- Wrapping every function in `useCallback` or object in `useMemo`. First remove unnecessary dependencies or move construction into the effect.
- Using an effect to copy props into state when the component can render the value directly.
- Treating Strict Mode's extra development cycle as the production loop.

## How to prevent it

Use effects only to synchronize with external systems. Keep dependencies complete, prefer primitive values, and return cleanup for subscriptions. React's exhaustive-deps lint rule is useful evidence, not an obstacle to suppress.

## Version notes

This guidance applies to React 19. Effects run only on the client. React 19's `useEffectEvent` can separate non-reactive effect logic in supported cases, but it is not a way to hide true dependencies.

## Related reading

- [Maximum update depth errors](/article/react-maximum-update-depth)
- [Too many re-renders](/article/react-too-many-rerenders)
- [State snapshots and queued updates](/article/react-state-not-updating)

## FAQ

### Should I memoize dependencies to stop an effect loop?

Sometimes, but first ask whether the effect is needed and whether the object/function can be created inside it. Memoization is justified when identity itself must remain stable.

### Should I use an empty dependency array?

Only if the effect reads no reactive values and should synchronize once per mount. Omitting real dependencies can make the effect use stale values.

### Why does Strict Mode run an effect twice?

In development it performs an extra setup/cleanup cycle to expose missing cleanup. Production does not use that extra cycle.
