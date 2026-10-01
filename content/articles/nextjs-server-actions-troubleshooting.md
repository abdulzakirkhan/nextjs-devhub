# Next.js Server Actions Not Working: Common Errors and Fixes

## Introduction

A form submits but nothing changes, the action receives unexpected arguments, or a redirect appears to be ignored. Server Actions are server entry points, so diagnose the form contract, action boundary, return state, and cache behavior separately.

## What you see

Symptoms include an action not being recognized, `FormData` appearing as the wrong argument, a serialization error, a stale page after mutation, or a request that succeeds for one user but should have been denied for another. Error wording varies by React/Next.js version.

## Why it happens

App Router Server Actions are React Server Functions invoked by forms or Actions. A module-level action file needs `'use server'`; exported actions must be async. With React 19 `useActionState`, the signature becomes `(previousState, formData)`. A successful database write alone does not automatically invalidate every cached route.

## Minimal reproduction

Incorrect: an action used by `useActionState` reads its first argument as `FormData`.

```ts
'use server';
export async function saveProfile(formData: FormData) {
  const name = formData.get('name');
}
```

Correct for a direct form action:

```ts
'use server';
export async function saveProfile(formData: FormData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name.trim()) return { error: 'Name is required' };
  // Authenticate, authorize, validate, then persist.
  return { ok: true };
}
```

Correct for `useActionState`:

```ts
'use server';
type State = { error?: string; ok?: boolean };
export async function saveProfileAction(_previous: State, formData: FormData): Promise<State> {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name.trim()) return { error: 'Name is required' };
  // Authenticate and authorize before writing.
  return { ok: true };
}
```

## Fix

Match the action signature to its caller. A plain `<form action={saveProfile}>` passes `FormData`; React 19 `useActionState(saveProfileAction, initialState)` passes previous state first. Ensure the action lives in a Server Component module or a module with `'use server'`, and only pass serializable values across the client boundary.

## Step-by-step fixes

1. Check that the action is `async` and the module-level directive is exactly `'use server'`.
2. Verify the form field `name` attributes match `formData.get()` calls.
3. If using `useActionState`, update the function signature and initial state type.
4. Treat all submitted values as untrusted. Validate shape and length on the server.
5. Authenticate and authorize inside every action; hiding a form is not access control.
6. Return plain serializable state for expected validation errors. Let unexpected errors reach an error boundary or log them server-side without returning secrets.
7. Call `revalidatePath()` or `revalidateTag()` after a mutation when affected cached data needs refreshing. In Next.js 16, `revalidateTag` requires a profile such as `'max'`; use `updateTag` in a Server Action when immediate read-your-own-writes behavior is required.
8. `redirect()` is control flow that throws internally. Call it after mutation/revalidation and do not swallow it in a broad catch.

## Common mistakes

- Importing a server-only database client into a Client Component.
- Returning a class instance, database record with unsupported values, or function as action state.
- Trusting a client-supplied user ID instead of deriving identity from a verified session.
- Assuming `revalidateTag(tag)` is the current complete signature.
- Catching every error around `redirect()` and making the redirect look like a failure.

## How to prevent it

Keep the mutation in a small server module, give its inputs and returned state explicit types, and test unauthorized, invalid, successful, and stale-cache paths. Keep actions idempotent where retries are possible.

## Version notes

This article targets Next.js 16 with React 19. `useActionState` is imported from `react`; its Server Action signature includes previous state. Earlier React/Next.js tutorials may show `useFormState` from `react-dom` or synchronous route APIs.

## Related reading

- [Server Actions and Zod validation](/article/nextjs-server-actions-zod)
- [Securing Server Actions in production](/article/securing-server-actions-production)
- [Next.js async params errors](/article/nextjs-async-params-errors)

## FAQ

### Does a Server Action need a Route Handler?

No. A form can invoke a Server Action directly. Use a Route Handler when you need an HTTP endpoint for a webhook, external client, or protocol-specific request.

### Why is `formData` actually previous state?

That happens when the action is passed to `useActionState`; React prepends the previous state. Use `(previousState, formData)`.

### Why does the page still show old data?

The mutation and cache are separate concerns. Revalidate the relevant route or data tag using the invalidation API that matches the desired freshness behavior.
