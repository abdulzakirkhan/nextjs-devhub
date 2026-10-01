# React State Is Not Updating Immediately: Why and What to Do

## Introduction

You call a setter and log the old value in the next line. That does not mean React ignored the update: variables in a render are snapshots. A setter queues a future render; it does not mutate the value captured by the current handler.

## What you see

The UI updates after the handler, but `console.log(count)` immediately after `setCount(...)` prints the previous count. Multiple updates may also collapse into one because React batches updates.

## Why it happens

Each render creates event handlers that close over that render's props and state. React processes queued updates after the handler finishes. When several updates depend on the previous value, direct values all use the same snapshot.

## Minimal reproduction

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  function addThree() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count); // still the value from this render
  }
  return <button onClick={addThree}>{count}</button>;
}
```

Each call queues the same `count + 1` value.

## Fix

Use updater functions when each update depends on the preceding queued value:

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  function addThree() {
    setCount(current => current + 1);
    setCount(current => current + 1);
    setCount(current => current + 1);
  }
  return <button onClick={addThree}>{count}</button>;
}
```

The queued functions are applied in order, so the resulting state increases by three. To react to a committed state change, render from state or use an effect only when synchronizing with an external system.

## Step-by-step fixes

1. Decide whether the update replaces state or derives the next state from the previous value.
2. Use `setValue(nextValue)` for a replacement; use `setValue(previous => next(previous))` for dependent updates.
3. Do not expect the current handler's local variable to change after calling a setter.
4. If asynchronous work needs the latest value, pass the needed value into the operation or use a ref for non-rendering mutable data. Avoid reading a stale closure by accident.
5. For object/array state, create a new object or array instead of mutating the existing reference.

## Common mistakes

- `await setState(...)`: state setters do not return a Promise.
- Reading state immediately after setting it and treating the old snapshot as failure.
- Calling a setter several times with the same captured `count + 1` when increments should compose.
- Mutating an object and setting the same reference back.

## How to prevent it

Think of each render as a snapshot. Use updater functions for queued dependent changes, immutable replacements for objects/arrays, and effects for external synchronization rather than post-setter callbacks.

## Version notes

React 19 batches updates from more contexts than early React releases, but the snapshot model remains. Updates inside one event are processed after the handler completes.

## Related reading

- [Too many re-renders](/article/react-too-many-rerenders)
- [Maximum update depth errors](/article/react-maximum-update-depth)
- [Controlled input warnings](/article/react-controlled-uncontrolled-inputs)

## FAQ

### How do I run code after state has committed?

If it synchronizes with an external system, use an effect that depends on the state. For user event logic, often no post-render callback is needed; the next render reflects the state.

### Why do three `setCount(count + 1)` calls add only one?

All three expressions use the same render snapshot. They queue the same replacement value. Functional updater calls compose against the queued result.

### Should I use a ref instead of state?

Use a ref for mutable information that should not trigger rendering. If the value affects visible UI, keep it in state.
