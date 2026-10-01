# How to Fix “Maximum Update Depth Exceeded” in React

## Introduction

A component renders, an effect updates state, the update changes an effect dependency, and the cycle repeats. React eventually stops with a maximum update depth error. The right fix is to break that feedback loop, not suppress a dependency warning.

## What you see

The UI may freeze or repeatedly render before React reports that nested updates exceeded a limit. This often comes from an effect, callback ref, or lifecycle that schedules another update each time it runs.

## Why it happens

An update schedules a render. If the render changes a dependency of an effect that immediately schedules another update, React can never settle. An object or function created inline can also be a changed dependency on every render.

## Minimal reproduction

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => setCount(count + 1), [count]);
  return <p>{count}</p>;
}
```

The effect changes `count`, which triggers itself again.

## Fix

If the effect is not synchronizing with an external system, remove it. If you need a user-driven increment, update from the event:

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(current => current + 1)}>{count}</button>;
}
```

For a real subscription, subscribe to the external source and clean it up; do not write state back to a dependency unless the external value actually changed.

## Step-by-step fixes

1. Read the component stack and identify the state setter or dispatch that repeats.
2. Determine whether the update belongs to an event, an external-system effect, or derived render data.
3. Remove effects that only copy or calculate values already available from props/state.
4. For external synchronization, list all reactive dependencies and avoid recreating object/function dependencies unnecessarily.
5. Use a functional updater when the next value depends on previous state.
6. Check child-to-parent updates and callback refs for state changes during commit/render cycles.

## Common mistakes

- Removing a dependency to silence `exhaustive-deps`; that can leave stale values.
- Wrapping every object in `useMemo` before confirming its identity is the cause.
- Setting state unconditionally in an effect that depends on that state.
- Treating React Strict Mode's extra development setup/cleanup cycle as the production cause.

## How to prevent it

Use state for values that change from events or external systems. Calculate derived values during render. Keep effects small, complete, and paired with cleanup when they subscribe to timers, listeners, or external stores.

## Version notes

The dependency and update model is the same in React 19. Strict Mode can expose missing cleanup in development, but a repeatable dependency feedback loop must still be fixed.

## Related reading

- [Too many re-renders](/article/react-too-many-rerenders)
- [React useEffect infinite loops](/article/react-useeffect-infinite-loop)
- [React state is not immediate](/article/react-state-not-updating)

## FAQ

### Is the error always caused by `useEffect`?

No. Effects are common, but render-time setters, callbacks, refs, and component lifecycle updates can also form loops.

### Should I remove the dependency array?

No. An omitted array runs after every commit. Keep dependencies accurate and change the data flow that causes the cycle.

### Will `useMemo` fix the loop?

Only if an unstable object identity is the actual trigger and stable identity is required. Often moving the object creation inside the effect or deriving the value is simpler.
