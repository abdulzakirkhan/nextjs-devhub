# How to Fix “Too Many Re-renders” in React

## Introduction

The component renders, React reports too many re-renders, and the page stops responding. Most often, code schedules a state update during render, or an event handler is called while JSX is being evaluated.

## What you see

React may report “Too many re-renders. React limits the number of renders to prevent an infinite loop.” The exact text can vary, but inspect the component currently rendering and the state setters it calls.

## Why it happens

Rendering must be pure: given the same props and state, return the same UI without scheduling another update. Calling a setter unconditionally during render repeats the cycle. Invoking a handler in JSX also executes it immediately.

## Minimal reproduction

Incorrect: the setter runs on every render, and `handleAdd()` runs before the button is clicked.

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  setCount(count + 1);
  return <button onClick={handleAdd()}>{count}</button>;
}
```

## Fix

Move the update into an event, and pass a function reference to `onClick`.

```tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(current => current + 1)}>{count}</button>;
}
```

## Step-by-step fixes

1. Search the render path for `setState`, a reducer dispatch, or a parent callback that updates state.
2. If it represents a user action, call it from an event handler: `onClick={handleAdd}` or `onClick={() => handleAdd(id)}`.
3. If it derives a value from props/state, calculate it during render instead of copying it into state.
4. If an external subscription must update state, subscribe in an effect and clean it up.
5. If a conditional render-phase update is intentional, verify React's documented same-component adjustment pattern carefully; a normal event/effect is clearer in most cases.

## Common mistakes

- `onClick={setCount(count + 1)}` instead of `onClick={() => setCount(count + 1)}`.
- Calling a setter in a component body to “initialize” derived data.
- Updating a parent from a child's render. Move the update to an event/effect boundary.
- Adding an effect for a value that can be calculated from current props and state.

## How to prevent it

Keep render code free of side effects and state scheduling. Use event handlers for user intent, effects for synchronization with external systems, and derived variables for derived UI.

## Version notes

This is React render behavior and applies to React 19. Strict Mode can call render more than once in development to expose impurities; it does not make unconditional render-time updates safe.

## Related reading

- [Maximum update depth and effect loops](/article/react-maximum-update-depth)
- [React state snapshots](/article/react-state-not-updating)
- [useEffect infinite loops](/article/react-useeffect-infinite-loop)

## FAQ

### Should I use `useEffect` to fix every render loop?

No. Effects are for synchronization with external systems. Event-driven updates belong in event handlers; values derived from props/state usually belong in render calculations.

### Can `setState` run inside a condition in render?

React has a narrow same-component render adjustment pattern, but it is easy to misuse. Prefer a key reset, derived state, or an event/effect with explicit ownership.

### Why does the bug appear only in development?

Strict Mode can expose impure rendering more clearly. Fix the state update location instead of disabling Strict Mode.
