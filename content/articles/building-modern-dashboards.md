# Building Modern Dashboards with Next.js 16, Tailwind CSS and Shadcn UI

## Introduction

Dashboard interfaces need to make changing data easy to scan while remaining usable across screen sizes. The main engineering challenges are hierarchy, accessible controls, and loading states that do not shift the layout.

Next.js 16, Tailwind CSS v4, and Shadcn UI have changed the game. Shadcn UI provides accessible, customizable components built on Radix UI and Tailwind. When combined with Next.js Server Components, you can build dashboards that are fast, accessible, and beautiful.

In this guide, I'll show you how to build a production-grade dashboard with these tools, covering layout, components, data visualization, and responsive design.

## Project Setup

Start with a Next.js 16 project:

```bash
npx create-next-app@latest dashboard --typescript --tailwind --app
cd dashboard
```

Initialize Shadcn UI:

```bash
npx shadcn@latest init
```

Install the components you'll need:

```bash
npx shadcn@latest add button card input table dropdown-menu dialog
```

## Shadcn UI Setup

Shadcn UI components are copied into your project, which means you can customize them completely. Here's how I set up a dashboard layout:

```typescript
// components/dashboard/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Settings, Users, FileText } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FileText },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="p-6">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
```

## Dashboard Layout

Create a layout that wraps all dashboard pages:

```typescript
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

The header component:

```typescript
// components/dashboard/header.tsx
'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 pl-10"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <span className="text-sm font-medium">JD</span>
        </div>
      </div>
    </header>
  );
}
```

## Data Visualization

Use Recharts or Chart.js for data visualization:

```bash
npm install recharts
```

Create a chart component:

```typescript
// components/dashboard/revenue-chart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

Use it in a card:

```typescript
// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$45,231</div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        {/* More stat cards */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart />
        </CardContent>
      </Card>
    </div>
  );
}
```

## Responsive Design

Make the dashboard mobile-friendly:

```typescript
// components/dashboard/sidebar.tsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar content */}
      </div>
    </>
  );
}
```

## Common Mistakes

### 1. Not Using Shadcn Components

Don't build custom components when Shadcn provides accessible, tested ones. Customize them instead.

### 2. Overcomplicating Layouts

Keep your layout hierarchy simple. Deep nesting makes the code hard to maintain.

### 3. Ignoring Mobile Users

Dashboards must work on mobile. Test responsive design thoroughly.

### 4. Not Using Server Components

Use Server Components for data fetching. Only use client components for interactivity.

### 5. Inconsistent Styling

Use Tailwind's utility classes consistently. Define custom components for repeated patterns.

## FAQ

### What is Shadcn UI?

Shadcn UI is a collection of accessible, customizable React components built with Radix UI and Tailwind CSS that you can copy into your project.

### How do I customize Shadcn components?

Since components are copied into your project, you can modify them directly. Use CSS variables for theming and Tailwind for styling.

### What layout patterns work best for dashboards?

Sidebar navigation, top header with user actions, main content area with cards, and responsive behavior for mobile devices.

### How do I handle data fetching in dashboards?

Use Server Components for initial data fetch, Server Actions for mutations, and React Query or SWR for client-side caching if needed.
