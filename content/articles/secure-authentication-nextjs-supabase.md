# Secure Authentication in Next.js 16 Using Supabase

## Introduction

Authentication must be paired with server-side identity verification and database authorization. Supabase Auth provides identity services, while the application remains responsible for session handling, access control, and Row Level Security.

This guide uses the current `@supabase/ssr` integration model for Next.js and distinguishes verified claims from an unvalidated session cookie.

## Supabase Auth Setup

Supabase authentication is built on top of PostgreSQL and provides email/password, phone, and social providers out of the box.

Install the current SSR package and Supabase client:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

For Next.js 16, use `proxy.ts` to refresh cookies and redirect unauthenticated requests. Verify identity with `getClaims()`; do not use a cookie-backed `getSession()` result as server-side authorization:

```typescript
// proxy.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
        },
      },
    }
  );

  const { data: { claims } } = await supabase.auth.getClaims();

  if (request.nextUrl.pathname.startsWith('/dashboard') && !claims) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

## Social Providers

Supabase supports Google, GitHub, Twitter, and other social providers. Configure them in the Supabase dashboard:

```typescript
// app/login/page.tsx
'use client';

import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <button onClick={handleGoogleLogin}>
      Continue with Google
    </button>
  );
}
```

Create a callback handler:

```typescript
// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing-code', request.url));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(new URL(error ? '/login?error=oauth' : '/', request.url));
}
```

## Session Management

Supabase handles session management automatically, but you need to listen for auth state changes:

```typescript
// app/layout.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## Authorization Beyond the Proxy

The Proxy can refresh an SSR session and redirect unauthenticated navigation, but it is not the authorization boundary for application data. Check verified claims and resource ownership inside every Server Action, Route Handler, and server-side data operation. Enforce row ownership again with PostgreSQL Row Level Security. Use `getClaims()` to verify identity; do not authorize from a cookie-backed `getSession()` result.

## Security Best Practices

### 1. Always Use RLS

Never rely on frontend authentication checks alone. Use Row Level Security:

```sql
-- Enable RLS
alter table public.profiles enable row level security;

-- Users can only see their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);
```

### 2. Validate on Both Ends

Validate on the frontend for UX, but always validate on the backend:

```typescript
// Server action
'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100),
});

export async function updateProfile(data: unknown) {
  const validated = updateProfileSchema.parse(data);

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );
  const { data: { claims }, error } = await supabase.auth.getClaims();

  if (error || !claims?.sub) {
    throw new Error('Unauthorized');
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update(validated)
    .eq('id', claims.sub);

  if (updateError) {
    throw new Error('Unable to update profile');
  }
}
```

### 3. Use Environment Variables

Never commit secrets:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key # Never use this in client code
```

### 4. Implement Rate Limiting

Prevent brute force attacks:

```typescript
// app/api/auth/rate-limit.ts
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

## Common Mistakes

### 1. Not Using Middleware

Don't check authentication in every page component. Use middleware for route protection.

### 2. Exposing Service Keys

Never use the service role key in client-side code. It bypasses RLS policies.

### 3. Ignoring Session Expiry

Supabase handles session refresh automatically, but you should handle expiry gracefully.

### 4. Not Validating on Server

Frontend validation is for UX. Always validate on the server for security.

### 5. Forgetting to Logout

Implement proper logout functionality:

```typescript
const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};
```

## FAQ

### How do I protect routes with Supabase auth?

Use a Next.js 16 `proxy.ts` for session refresh and navigation redirects, then verify claims and resource permissions in each protected server operation.

### What authentication providers does Supabase support?

Supabase supports email/password, phone, and social providers including Google, GitHub, Twitter, and more.

### How do I handle session refresh?

Supabase automatically handles token refresh. Use the auth state change listener to update your UI when session changes.

### Is Supabase auth secure for production?

Supabase Auth provides identity and session services. A production integration also requires correct SSR cookie handling, verified claims, resource authorization, RLS policies, safe redirect handling, and operational monitoring.
