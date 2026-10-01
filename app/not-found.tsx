import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-sm font-semibold uppercase text-zinc-500">404</p>
      <h1 className="mb-3 text-3xl font-bold">Page not found</h1>
      <p className="mb-6 max-w-md text-zinc-600 dark:text-zinc-400">
        The page may have moved, or the address may be incorrect.
      </p>
      <Button asChild>
        <Link href="/blog">Browse articles</Link>
      </Button>
    </section>
  );
}