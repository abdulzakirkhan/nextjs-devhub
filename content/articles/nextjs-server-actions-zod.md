# Next.js Server Actions with Zod Validation

## Introduction

Server Actions let forms invoke server-side mutations without a separate application API endpoint. They do not remove the need for server-side authorization, validation, error handling, or abuse controls.

But Server Actions without validation are a security nightmare. You need robust input validation to prevent injection attacks, ensure data integrity, and provide good error messages to users.

Zod is the perfect companion for Server Actions. It provides runtime type validation that works seamlessly with TypeScript, ensuring your Server Actions receive validated data before processing.

This guide demonstrates form validation with Server Actions and Zod. The examples are starting points and need application-specific authorization and persistence before deployment.

## Server Actions Basics

Server Actions are functions that run on the server and can be called from client components. They eliminate the need for API routes for form submissions.

Create a Server Action:

```typescript
// app/actions/create-project.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const project = await db.project.create({
    data: { name, description },
  });

  revalidatePath('/projects');
  return project;
}
```

Use it in a form:

```typescript
// app/projects/new/page.tsx
'use client';

import { createProject } from '@/app/actions/create-project';

export default function NewProjectPage() {
  return (
    <form action={createProject}>
      <input name="name" placeholder="Project name" />
      <textarea name="description" placeholder="Description" />
      <button type="submit">Create Project</button>
    </form>
  );
}
```

## Zod Validation

Zod provides runtime type validation. Define a schema:

```typescript
// lib/schemas.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
```

Integrate with Server Action:

```typescript
// app/actions/create-project.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { createProjectSchema } from '@/lib/schemas';

export async function createProject(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
  };

  // Validate with Zod
  const result = createProjectSchema.safeParse(rawData);

  if (!result.success) {
    // Return validation errors
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { name, description } = result.data;

  const project = await db.project.create({
    data: { name, description },
  });

  revalidatePath('/projects');
  return { success: true, project };
}
```

## Error Handling

Handle errors gracefully in your form:

```typescript
// app/projects/new/page.tsx
'use client';

import { useState } from 'react';
import { createProject } from '@/app/actions/create-project';

export default function NewProjectPage() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const result = await createProject(formData);
    
    if (result.error) {
      setErrors(result.error);
    } else {
      // Success - redirect or show success message
      window.location.href = '/projects';
    }
    
    setIsSubmitting(false);
  }

  return (
    <form action={handleSubmit}>
      <div>
        <input name="name" placeholder="Project name" />
        {errors.name && (
          <p className="text-red-500">{errors.name[0]}</p>
        )}
      </div>
      <div>
        <textarea name="description" placeholder="Description" />
        {errors.description && (
          <p className="text-red-500">{errors.description[0]}</p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
```

## Form Integration

For stateful form feedback, React 19 provides `useActionState`. Its action must accept `(previousState, formData)`, so define a stateful Server Action rather than reusing a direct action that accepts only `FormData`:

```typescript
// app/projects/new/page.tsx
'use client';

import { useActionState } from 'react';
import { createProjectWithState } from '@/app/actions/create-project';

export default function NewProjectPage() {
  const [state, formAction, isPending] = useActionState(createProjectWithState, {
    errors: {},
  });

  return (
    <form action={formAction}>
      <div>
        <input name="name" placeholder="Project name" />
        {state.errors.name?.[0] && (
          <p className="text-red-500">{state.errors.name[0]}</p>
        )}
      </div>
      <div>
        <textarea name="description" placeholder="Description" />
        {state.errors.description?.[0] && (
          <p className="text-red-500">{state.errors.description[0]}</p>
        )}
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
```

## Advanced Validation

Zod supports complex validation scenarios:

```typescript
// lib/schemas.ts
export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain uppercase letter')
      .regex(/[0-9]/, 'Password must contain number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
});
```

## Common Mistakes

### 1. Not Validating on Server

Never trust client-side validation. Always validate on the server in your Server Action.

### 2. Returning Sensitive Errors

Don't return detailed error messages that might leak information about your system.

### 3. Not Handling Loading States

Users need feedback. Show loading states while Server Actions are processing.

### 4. Ignoring TypeScript Types

Use Zod's `infer` to get TypeScript types from your schemas. Don't duplicate type definitions.

### 5. Not Revalidating Data

After mutations, revalidate paths or use revalidateTag to update cached data.

## FAQ

### What are Server Actions in Next.js?

Server Actions are functions that run on the server and can be called from client components, eliminating the need for API routes for form submissions.

### Why use Zod with Server Actions?

Zod provides runtime type validation that works seamlessly with TypeScript, ensuring your Server Actions receive validated data.

### How do I handle validation errors?

Return serializable state from your Server Actions and display it with React 19's `useActionState` hook.

### Can I use Server Actions with edge runtime?

Some Server Actions features require Node.js runtime. Check the SDK documentation for edge runtime compatibility.
