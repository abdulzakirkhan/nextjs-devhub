# Securing Server Actions in Production

## Introduction

Server Actions are convenient, but they introduce new security considerations. Unlike API routes, Server Actions can be called directly from client components, which makes them easier to use but also easier to misuse.

Server Actions are reachable server entry points, not private functions merely because their callers are rendered in the UI. Each action must authenticate the request, authorize the requested resource, validate untrusted input, and constrain its return value.

## CSRF Protection

Next.js provides built-in CSRF protection for Server Actions, but you need to understand how it works and when to use additional protection.

Server Actions use a CSRF token that's automatically included in forms. The token is validated on the server before the action executes.

For additional protection, implement rate limiting:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

Use it in your Server Actions:

```typescript
// app/actions/create-project.ts
'use server';

import { checkRateLimit } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  const { user } = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Rate limit by user ID
  const allowed = await checkRateLimit(user.id);
  if (!allowed) {
    throw new Error('Too many requests');
  }

  // Proceed with action
}
```

## Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';

// Different limits for different actions
const strictLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
});

const normalLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '1 m'),
});

export async function checkStrictRateLimit(identifier: string) {
  const { success } = await strictLimit.limit(identifier);
  return success;
}

export async function checkNormalRateLimit(identifier: string) {
  const { success } = await normalLimit.limit(identifier);
  return success;
}
```

Apply stricter limits to sensitive actions:

```typescript
export async function deleteAccount(formData: FormData) {
  const { user } = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Strict rate limit for account deletion
  const allowed = await checkStrictRateLimit(user.id);
  if (!allowed) {
    throw new Error('Too many deletion attempts');
  }

  // Proceed with deletion
}
```

## Input Validation

Always validate and sanitize input:

```typescript
// app/actions/update-profile.ts
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid username'),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export async function updateProfile(formData: FormData) {
  const { user } = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  const rawData = {
    username: formData.get('username'),
    bio: formData.get('bio'),
    website: formData.get('website'),
  };

  const validated = updateProfileSchema.parse(rawData);

  // Sanitize HTML if needed
  const sanitized = {
    ...validated,
    bio: validated.bio ? sanitizeHtml(validated.bio) : null,
  };

  await db.profile.update({
    where: { id: user.id },
    data: sanitized,
  });
}
```

## Authorization

Check permissions before executing actions:

```typescript
// lib/auth.ts
export async function requireAuth() {
  const { user } = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requirePermission(permission: string) {
  const user = await requireAuth();
  const hasPermission = await checkPermission(user.id, permission);
  if (!hasPermission) {
    throw new Error('Forbidden');
  }
  return user;
}
```

Use in Server Actions:

```typescript
// app/actions/admin/delete-user.ts
'use server';

import { requirePermission } from '@/lib/auth';

export async function deleteUser(formData: FormData) {
  // Require admin permission
  await requirePermission('admin:delete_user');

  const userId = formData.get('userId') as string;
  
  await db.user.delete({ where: { id: userId } });
}
```

## Error Handling

Handle errors securely:

```typescript
// app/actions/create-project.ts
'use server';

export async function createProject(formData: FormData) {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const validated = createProjectSchema.parse(formData);
    
    const project = await db.project.create({
      data: { ...validated, userId: user.id },
    });

    return { success: true, project };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.flatten().fieldErrors };
    }
    
    // Log actual error for debugging
    console.error('Create project error:', error);
    
    // Return generic error to user
    return { error: 'Failed to create project' };
  }
}
```

## Common Mistakes

### 1. Not Checking Authentication

Every Server Action should check authentication. Never assume the user is authenticated.

### 2. Returning Sensitive Data

Don't return sensitive data in error messages or responses. Log errors server-side.

### 3. Not Implementing Rate Limiting

Without rate limiting, Server Actions are vulnerable to brute force attacks.

### 4. Skipping Input Validation

Always validate input. Never trust data from client-side forms.

### 5. Not Checking Permissions

Authentication isn't authorization. Check that users have permission to perform actions.

## FAQ

### Are Server Actions secure by default?

Server Actions have built-in CSRF protection, but you still need to implement proper authorization, validation, and rate limiting.

### How do I implement rate limiting?

Use a rate limiting library or implement one using Redis or your database to track request frequency per user or IP.

### What authorization patterns should I use?

Check user permissions at the start of each Server Action using session data or authentication libraries.

### How do I handle sensitive data?

Never log sensitive data, use environment variables for secrets, and ensure proper encryption for data at rest and in transit.
