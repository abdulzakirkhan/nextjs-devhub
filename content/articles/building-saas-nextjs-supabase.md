# Building a SaaS Application with Next.js 16 and Supabase

## Introduction

SaaS applications combine identity, relational data, authorization, and deployment concerns. Supabase provides managed PostgreSQL and related services, but a production design still depends on explicit Row Level Security policies, tested authorization rules, and operational requirements.

In this guide, I'll walk you through building a complete SaaS application with Next.js 16 and Supabase. We'll cover authentication, database design, Row Level Security (RLS), realtime features, and deployment.

## Project Setup

Start by creating a new Next.js 16 project with TypeScript:

```bash
npx create-next-app@latest my-saas --typescript --tailwind --app
cd my-saas
```

Install the Supabase client:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Create environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Initialize the Supabase client:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
```

## Supabase Configuration

Set up your Supabase project by creating tables in the SQL editor:

```sql
-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

## Authentication

Supabase handles authentication out of the box. Create a login page:

```typescript
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

For social providers, configure them in the Supabase dashboard and use:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
});
```

## Database Design

Design your database with relations and constraints:

```sql
-- Projects table
create table public.projects (
  id uuid default gen_random_uuid() not null primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks table
create table public.tasks (
  id uuid default gen_random_uuid() not null primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  status text default 'todo' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS policies
alter table public.projects enable row level security;

create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create projects"
  on public.projects for insert
  with check (auth.uid() = user_id);
```

## Row Level Security

RLS is Supabase's security model. Policies run at the database level, so even if someone bypasses your frontend, they can't access data they shouldn't.

Here's a complex policy for collaborative projects:

```sql
-- Team members table
create table public.project_members (
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' not null,
  primary key (project_id, user_id)
);

-- Policy: Users can view projects they own or are members of
create policy "Users can view accessible projects"
  on public.projects for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.project_members
      where project_members.project_id = projects.id
      and project_members.user_id = auth.uid()
    )
  );
```

## Realtime Features

Supabase provides realtime subscriptions out of the box:

```typescript
// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchProjects();

    // Subscribe to changes
    const subscription = supabase
      .channel('projects-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects([...projects, payload.new as Project]);
          } else if (payload.eventType === 'UPDATE') {
            setProjects(
              projects.map((p) =>
                p.id === payload.new.id ? (payload.new as Project) : p
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setProjects(projects.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
  };

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

## Common Mistakes

### 1. Not Using RLS

Always enable RLS on all tables. Never rely on frontend security alone. RLS protects your data even if someone bypasses your application.

### 2. Exposing Service Keys

Never use the service role key in client-side code. Use the anon key, which respects RLS policies.

### 3. Ignoring Database Constraints

Use database constraints (foreign keys, unique constraints) to enforce data integrity. Don't rely on application validation alone.

### 4. Not Handling Edge Cases

Handle loading states, errors, and edge cases in your Supabase calls. Network requests can fail.

### 5. Overfetching Data

Use Supabase's select and filter capabilities to fetch only the data you need. Don't fetch entire tables.

## Production Checklist

Before deploying your SaaS application:

✓ Enable RLS on all tables
✓ Use environment variables for secrets
✓ Implement proper error handling
✓ Set up database backups
✓ Configure rate limiting
✓ Implement logging and monitoring
✓ Test authentication flows
✓ Validate all user inputs
✓ Use CDN for static assets
✓ Set up proper CORS policies

## FAQ

### Why use Supabase with Next.js?

Supabase provides PostgreSQL, authentication, storage, and realtime features that integrate seamlessly with Next.js server components and server actions.

### How do I implement Row Level Security?

RLS policies are SQL rules in PostgreSQL that restrict data access based on user authentication. Supabase makes this easy with their dashboard and SQL editor.

### Can I use Supabase with edge functions?

Yes, Supabase edge functions work well with Next.js edge runtime and API routes for serverless logic.

### How do I handle file uploads?

Use Supabase Storage with the @supabase/supabase-js client. Files are stored in buckets with access controls.

### What about database migrations?

Use Supabase migrations or tools like Prisma with Supabase to manage database schema changes across environments.
