# Next.js 16 Routing Explained: Async Params, Layouts and Advanced Navigation

## Introduction

The App Router combines filesystem-based routes, nested layouts, React Server Components, and request-time APIs. Dynamic route parameters and search parameters are asynchronous in current Next.js releases, so pages and metadata functions should await their Promise values. This is an API contract, not a data-fetching mechanism by itself.

In this guide, we'll dive deep into Next.js 16 routing—async params, nested layouts, parallel routes, and the patterns that make production applications feel polished and responsive.

## Async Params

Route parameters are supplied to pages as a Promise. Await the parameter object, then use the resulting values to fetch or validate route data. Promise-based request APIs were introduced before Next.js 16; Next.js 16 continues to use this contract.

For a project route at `/projects/[id]`, await `params` before using the identifier:

```typescript
// app/projects/[id]/page.tsx
async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const project = await db.project.findUnique({
    where: { id },
    include: { tasks: true, team: true }
  });

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
```

Awaiting `params` only resolves route values. Fetching, authorization, loading UI, and not-found handling remain application responsibilities. A Server Component can fetch data on the server without adding client-side hydration.

## Nested Layouts

Nested layouts are the killer feature of App Router. They let you wrap child routes with shared UI components, eliminating prop drilling and reducing component complexity.

Consider a dashboard with a sidebar, header, and content area:

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

// app/(dashboard)/projects/[id]/layout.tsx
export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  
  return (
    <div className="flex">
      <ProjectSidebar project={project} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
```

The key insight is that layouts nest. The dashboard layout wraps everything, and the project layout wraps only project routes. This creates a hierarchical UI structure that mirrors your route structure.

Common layout uses include:
- Dashboard sidebar and header
- Context-specific navigation
- Data provider components
- Permission checks and route guards

## Parallel Routes

Parallel routes let you render multiple pages in the same view. This is perfect for split-screen layouts, modals, and complex UI patterns.

For example, a dashboard can render a main area and a sidebar panel in parallel:

```typescript
// app/dashboard/@main/page.tsx
export default function MainContent() {
  return <DashboardMain />;
}

// app/dashboard/@panel/page.tsx
export default function SidePanel() {
  return <DashboardPanel />;
}

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  main,
  panel,
}: {
  children: React.ReactNode;
  main: React.ReactNode;
  panel: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="flex-1">{main}</div>
      <div className="w-80 border-l">{panel}</div>
    </div>
  );
}
```

The `@` notation creates a slot. Each slot can have its own route, and they render in parallel. This is incredibly powerful for complex layouts.

Parallel routes can support:
- Dashboard panels and sidebars
- Modal routes that overlay content
- Split-screen editing interfaces
- Preview/ edit layouts

## Route Handlers

Route Handlers are the App Router's HTTP request handlers, defined in `route.ts` files. They coexist with Pages Router API routes in applications that still use `pages/`:

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const projects = await db.project.findMany();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const project = await db.project.create({ data: body });
  return NextResponse.json(project, { status: 201 });
}
```

Route Handlers are useful for:
- REST API endpoints
- Webhook handlers
- Webhooks and integrations that require HTTP semantics
- Integration with third-party services

## Common Mistakes

### 1. Not Using Layouts

I see developers who don't use layouts at all, repeating the same header/sidebar code on every page. Use layouts to share UI across routes.

### 2. Deep Layout Nesting

Don't nest layouts too deeply. Each layout adds complexity. Keep your layout hierarchy shallow and focused.

### 3. Ignoring Async Params

If you're still fetching data in useEffect with route parameters, you're missing out on async params. Use them for cleaner, faster data fetching.

### 4. Not Handling 404s

Always check if the resource exists in async params and call notFound() if it doesn't. Don't render error states manually.

### 5. Overusing Parallel Routes

Parallel routes are powerful but add complexity. Use them only when you genuinely need multiple independent routes in the same view.

## FAQ

### What are async params in Next.js 16?

Async params allow you to asynchronously fetch data for dynamic route parameters, enabling better data fetching patterns and improved performance.

### How do nested layouts work?

Nested layouts allow you to wrap child routes with shared UI components. Each folder can have its own layout.tsx file that wraps its children.

### What are parallel routes?

Parallel routes let you render multiple pages in the same view, useful for split-screen layouts, modals, and complex UI patterns.

### How do I implement route handlers?

Route handlers are created by adding route.ts files in your app directory. They handle HTTP requests and can be used for API endpoints.
